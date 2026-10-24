"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";

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
        setMessage("This verification link is missing its cryptographic token.");
        return;
      }

      try {
        const result = await verifyEmail(token);

        if (!result.success) {
          setStatus("error");
          setMessage("This verification link is invalid or has expired.");
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
      } catch (error: unknown) {
        setStatus("error");
        setMessage(
          (error as Error)?.message ||
            "Something went wrong while verifying. Check your connection and try again."
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
    <div className="min-h-screen w-full flex items-center justify-center bg-brand-cream text-brand-violet px-4 selection:bg-brand-peach selection:text-brand-violet">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <div className="bg-brand-violet-dark text-brand-cream border-2 border-brand-violet shadow-[8px_8px_0px_0px_#BA5624] p-8 animate-fadeIn">
          {status === "verifying" && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-brand-violet border-2 border-brand-brown mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#BA5624]">
                <Loader2 className="w-8 h-8 text-brand-peach-vibrant animate-spin" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-extrabold text-brand-cream tracking-tight">
                Verifying Token
              </h1>
              <p className="text-xs text-brand-peach/80">
                Validating cryptographic verification challenge with server...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-600/20 border-2 border-emerald-500 mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#064e3b]">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-extrabold text-brand-cream tracking-tight">
                Email Verified Successfully
              </h1>
              <p className="text-xs text-brand-peach/85">
                Your zero-knowledge workspace is ready. Redirecting you to your dashboard...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-600/20 border-2 border-red-500 mx-auto flex items-center justify-center shadow-[2px_2px_0px_0px_#381D2A]">
                <XCircle className="w-8 h-8 text-red-400" strokeWidth={2.5} />
              </div>
              <h1 className="text-xl font-extrabold text-brand-cream tracking-tight">
                Verification Failed
              </h1>
              <p className="text-xs text-brand-cream/70 leading-relaxed">
                {message}
              </p>
              <button
                type="button"
                onClick={() => router.push("/auth")}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2.5 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream font-bold text-xs uppercase tracking-wider border border-brand-peach shadow-[2px_2px_0px_0px_#26131D] transition-all cursor-pointer"
              >
                Return to Login <ArrowRight className="w-3.5 h-3.5 text-brand-peach" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailTokenPage;
