// app/auth/verify-email/[token]/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Logo from "@/app/(main)/_components/Logo";
import useAuthStore from "@/context/useAuthStore";

type Status = "verifying" | "success" | "error";

const VerifyEmailTokenPage = () => {
  const [status, setStatus] = useState<Status>("verifying");
  const [message, setMessage] = useState<string | null>(null);
  const hasRun = useRef(false);
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Guard against React strict-mode double-invoking effects in dev,
    // which would otherwise burn the (likely single-use) token.
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
        const res = await fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: "POST",
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setStatus("error");
          setMessage(data?.message || "This link is invalid or has expired.");
          return;
        }

        setStatus("success");
        // Refresh whatever auth/session state the app holds so the user
        // is immediately recognized as verified without a manual reload.
        await checkAuth();

        setTimeout(() => {
          router.push("/dashboard");
        }, 1800);
      } catch {
        setStatus("error");
        setMessage("Something went wrong. Check your connection and try again.");
      }
    };

    verify();
  }, [params?.token, checkAuth, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8 text-peach">
          <Logo />
        </div>

        <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900/60 shadow-xl animate-fadeIn">
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
                onClick={() => router.push("/auth")}
                className="text-sm font-medium text-brand hover:text-brand-hover transition-colors"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailTokenPage;