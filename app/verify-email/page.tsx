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
  }, [user, router]);

  return (
    <div className="min-h-screen w-full bg-brand-cream text-brand-violet selection:bg-brand-peach selection:text-brand-violet flex items-center justify-center overflow-x-hidden">
      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left: Content Panel */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-4 bg-brand-violet-dark text-brand-cream flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto border-r-2 border-brand-violet relative z-10 shadow-2xl">
          <div>
            <div className="mb-8">
              <Logo classes="text-brand-cream" />
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-6 text-xs text-brand-cream/80 max-w-xs whitespace-nowrap">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                Account Created
              </span>
              <span className="w-full h-0.5 bg-brand-violet-light" />
              <span className="flex items-center gap-1.5 text-brand-peach font-bold">
                <MailCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                Verify Email
              </span>
            </div>

            <div className="border-2 border-brand-violet bg-brand-violet p-6 shadow-[4px_4px_0px_0px_#BA5624] text-center mb-6">
              <div className="w-14 h-14 bg-brand-peach border-2 border-brand-brown mx-auto flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_#BA5624]">
                <Mail className="w-7 h-7 text-brand-brown" strokeWidth={2} />
              </div>

              <h1 className="text-xl font-extrabold text-brand-cream mb-2 tracking-tight">
                Check Your Inbox
              </h1>
              <p className="text-xs text-brand-peach/85 mb-2">
                We sent a cryptographic verification token to:
              </p>
              <p className="text-xs font-mono font-bold text-brand-peach bg-brand-violet-dark border border-brand-violet-light p-2 mb-4 truncate">
                {user?.email}
              </p>
              <p className="text-[11px] text-brand-cream/70 leading-relaxed mb-4">
                Click the confirmation link inside that message to activate zero-knowledge vaults for your account.
              </p>

              <div className="border-t border-brand-violet-light pt-4">
                {resendState === "sent" && cooldown > 0 ? (
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Verification link resent!
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={cooldown > 0 || resendState === "sending"}
                    className="w-full text-xs font-bold uppercase tracking-wider text-brand-cream bg-brand-brown hover:bg-brand-brown-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all py-2.5 border border-brand-peach-vibrant shadow-[2px_2px_0px_0px_#26131D] cursor-pointer"
                  >
                    {resendState === "sending"
                      ? "Sending..."
                      : cooldown > 0
                        ? `Resend in ${formatTime(cooldown)}`
                        : "Resend Verification Email"}
                  </button>
                )}

                {resendState === "error" && resendMessage && (
                  <p className="text-xs text-red-400 mt-2 font-bold">{resendMessage}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="flex items-center justify-center gap-1.5 w-full text-xs font-bold text-brand-peach/80 hover:text-brand-peach transition-colors cursor-pointer"
            >
              Skip, proceed to Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="pt-6 mt-6 border-t border-brand-violet-light text-center text-xs text-brand-cream/60 font-mono">
            fileflux://auth/verify · End-to-End Encrypted
          </div>
        </div>

        {/* Right: Banner Image */}
        <div className="hidden md:block md:col-span-7 lg:col-span-8 relative h-full w-full bg-brand-violet-dark">
          <Image
            src="/auth_banner.png"
            alt="FileFlux Verify Email Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-brown via-brand-peach-vibrant to-brand-peach" />
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
