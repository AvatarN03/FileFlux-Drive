// app/auth/verify/page.tsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import Logo from "@/app/(main)/_components/Logo";

const VerifyEmailPage = () => {
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleResend = async () => {
    if (!email || resendCooldown > 0) return;
    setIsResending(true);
    try {
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendCooldown(45);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // resend failing shouldn't break the pending state
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-sm animate-fadeIn">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-brand-light dark:bg-brand/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-brand-light dark:bg-brand/20 flex items-center justify-center">
              <Mail className="w-7 h-7 text-brand" strokeWidth={1.75} />
            </div>
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Check your inbox
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            We sent a verification link to
          </p>
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-6">
            {email || "your email address"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Click the link in that email to activate your account. It expires in 30 minutes.
          </p>

          <button
            onClick={handleResend}
            disabled={resendCooldown > 0 || isResending}
            className="text-sm font-medium text-brand hover:text-brand-hover disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isResending
              ? "Sending..."
              : resendCooldown > 0
              ? `Resend link in ${resendCooldown}s`
              : "Didn't get it? Resend link"}
          </button>
        </div>

        <button
          onClick={() => router.push("/auth")}
          className="mt-6 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailPage;