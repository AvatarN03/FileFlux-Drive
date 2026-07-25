"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Mail, CheckCircle2, MailCheck, ArrowRight } from "lucide-react";

import Logo from "@/app/_components/Logo";

import { useAuth } from "@/hooks/useAuth";

import { formatTime } from "@/lib/email/formatTime";

import { ResendState, ResendVerificationResponse } from "@/types/auth";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { user, resendVerification } = useAuth();

  const [resendState, setResendState] = useState<ResendState>("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const startCooldown = (ms: number) => {
    let remaining = Math.ceil(ms / 1000);
    setCooldown(remaining);
    const timer = setInterval(() => {
      remaining -= 1;
      setCooldown(remaining);
      if (remaining <= 0) {
        setCooldown(0);
        setResendState("idle");
        setResendMessage(null);
        clearInterval(timer);
      }
    }, 1000);
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendState === "sending") return;

    setResendState("sending");
    setResendMessage(null);

    try {
      const data = await resendVerification();
      if (data.success) {
        setResendState("sent");
        startCooldown(data.coolDownMs ?? 10000);
        return;
      }

      setResendState("error");
      setResendMessage(data.error ?? "Couldn't resend email.");


    } catch (error: unknown) {
      setResendState("error");

      const resendError = error as Partial<ResendVerificationResponse>;

      setResendMessage(resendError.error ?? "Couldn't resend email.");

      if (resendError.coolDownMs) {
        startCooldown(resendError.coolDownMs);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      router.replace("/auth");
      return;
    }

    if (user.emailVerified) {
      router.replace("/dashboard");
      return;
    }
  }, [user,router]);

  return (
    <div className="min-h-screen w-full flex bg-neutral-900">
      {/* Left: image panel — hidden below lg */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <Image
          src="/verify_banner.avif"
          alt="verify email background"
          width={1400}
          height={1400}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/20" />
        <div className="absolute inset-0 bg-neutral-950/30" />

        <div className="relative z-10 flex justify-center items-center p-12 w-full">
          <div className="max-w-sm text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">
              Almost there
            </p>
            <h2 className="text-2xl font-semibold text-gray-100 leading-snug mb-3">
              One click and you&apos;re in.
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We take account security seriously — confirming your email keeps
              your data safe and makes sure it&apos;s really you.
            </p>
          </div>
        </div>
      </div>

      {/* Right: content panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8 text-peach">
            <Logo />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-8 text-xs text-gray-300 max-w-xs mx-auto whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-emerald-400 ">
              <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
              Account created
            </span>
            <span className="w-full h-px bg-gray-700" />
            <span className="flex items-center gap-1.5 text-peach font-medium">
              <MailCheck className="w-3.5 h-3.5" strokeWidth={2} />
              Verify email
            </span>
          </div>

          <div className="border border-gray-800 rounded-2xl p-8 bg-gray-900/60 backdrop-blur shadow-xl animate-fadeIn text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-slate-500/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-slate-500/70 flex items-center justify-center">
                <Mail className="w-7 h-7 text-brown" strokeWidth={1.75} />
              </div>
            </div>

            <h1 className="text-xl font-semibold text-gray-100 mb-2">
              Check your inbox
            </h1>
            <p className="text-sm text-gray-400 mb-1">
              We sent a verification link to
            </p>
            <p className="text-sm text-gray-200 font-medium mb-6">
              {/* {email} */}
              {user?.email}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              Click the link in that email to activate your account. It expires
              in 24 hours.
            </p>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-xs text-gray-500 mb-3">Didn&apos;t receive the email?</p>

              {resendState === "sent" && cooldown > 0 ? (
                <p className="text-sm text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                  Verification email sent!
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0 || resendState === "sending"}
                  className="text-sm font-medium cursor-pointer text-peach hover:text-brown disabled:text-gray-500 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-md bg-neutral-800 border border-violet hover:border-green"
                >
                  {resendState === "sending"
                    ? "Sending..."
                    : cooldown > 0
                      ? `Resend in ${formatTime(cooldown)}`
                      : "Resend email"}
                </button>
              )}

              {resendState === "error" && resendMessage && (
                <p className="text-xs text-red-400 mt-2">{resendMessage}</p>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 flex items-center justify-center gap-1.5 w-full text-sm text-gray-500 hover:text-gray-300 transition-colors cursor-pointer "
          >
            Skip, Go to Dashboard
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;