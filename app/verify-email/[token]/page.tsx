"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

import Logo from "@/app/_components/Logo";

import { useAuth } from "@/hooks/useAuth";

import toastC from "@/lib/toast";

import { Status } from "@/types/auth";

import { AUTH_TOAST_MESSAGES } from "@/constant";

const VerifyEmailTokenPage = () => {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState<string | null>(null);

  const hasRun = useRef(false);
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const { verifyEmail } = useAuth();

  useEffect(() => {

    if (hasRun.current) return;
    hasRun.current = true;

    const token = params?.token;

    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("This verification link is missing its token.");
        return;
      }

      try {

        const result = await verifyEmail(token);

        if (!result.success) {
          setStatus("error");
          setMessage(
            "This link is invalid or has expired."
          );
          toastC({
            type: "error",
            data: AUTH_TOAST_MESSAGES.EMAIL_VERIFICATION_FAILED,
          });
          return;
        }

        setStatus("success");
        toastC({
          type: "success",
          data: AUTH_TOAST_MESSAGES.EMAIL_VERIFICATION_SUCCESS,
        });


        setTimeout(() => {
          router.push("/dashboard");
        }, 1800);


        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {

        setStatus("error");
        setMessage(
          error?.message ||
          "Something went wrong. Check your connection and try again."
        );
        toastC({
          type: "error",
          data: AUTH_TOAST_MESSAGES.EMAIL_VERIFICATION_FAILED,
        });

      }
    };

    verify();
  }, [params?.token, verifyEmail, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8 text-peach">
          <Logo />
        </div>

        <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900/60 shadow-ember/40 shadow-md animate-fadeIn">
          {status === "verifying" && (
            <>
              <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-500/20">
                <Loader2 className="w-7 h-7 text-slate-300 animate-spin" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-semibold text-gray-100 mb-2">
                Verifying your email
              </h1>
              <p className="text-sm text-gray-400">
                Give us a moment while we confirm your link.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-emerald-500/15">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-semibold text-gray-100 mb-2">
                Email verified
              </h1>
              <p className="text-sm text-gray-400">
                Your account is active. Taking you to your dashboard...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-red-500/15">
                <XCircle className="w-8 h-8 text-red-400" strokeWidth={1.75} />
              </div>
              <h1 className="text-xl font-semibold text-gray-100 mb-2">
                Verification failed
              </h1>
              <p className="text-sm text-gray-400 mb-6">
                {message}
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-sm font-medium text-peach hover:text-brown transition-colors cursor-pointer px-3 py-2 rounded-md bg-neutral-800"
              >
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailTokenPage;