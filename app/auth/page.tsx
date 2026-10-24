"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { GoogleLogin } from "@react-oauth/google";
import { CredentialResponse } from "@react-oauth/google";

import Logo from "../_components/Logo";
import LoginForm from "../_components/auth/LoginForm";
import SignupForm from "../_components/auth/SignupForm";

import { useAuth } from "@/hooks/useAuth";

import toastC from "@/lib/toast";

import { AUTH_TOAST_MESSAGES } from "@/constant";

function getSafeRedirectUrl(target: string | null | undefined): string {
  if (!target) return "/dashboard";
  try {
    const decoded = decodeURIComponent(target);
    if (
      decoded.startsWith("/") &&
      !decoded.startsWith("//") &&
      !decoded.includes("\\") &&
      decoded !== "/auth" &&
      !decoded.startsWith("/auth?")
    ) {
      return decoded;
    }
  } catch {
    // Malformed URI component fallback
  }
  return "/dashboard";
}

const AuthContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const continueTo = searchParams.get("continueTo");

  const { isAuthenticated, isLoading, user, googleLogin } = useAuth();

  const handleSwitch = () => {
    setIsLogin(prev => !prev);
  };

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) return;

    // Redirect to verify email if not verified
    if (!user.emailVerified) {
      router.push("/verify-email");
      return;
    }

    // Otherwise continue to safe destination or dashboard
    const redirectPath = getSafeRedirectUrl(continueTo);

    router.push(redirectPath);
  }, [isLoading, isAuthenticated, user, continueTo, router]);

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {

    try {
      if (!credentialResponse.credential) {
        toastC({
          data: "Unable to login.",
          type: "error"
        });
        return;
      }

      const result = await googleLogin(
        credentialResponse.credential
      );

      if (!result.success) {
        toastC({
          data: result.error || AUTH_TOAST_MESSAGES.GOOGLE_LOGIN_FAILED,
          type: "error"
        });
        return;
      }

      toastC({
        type: "success",
        data: AUTH_TOAST_MESSAGES.GOOGLE_LOGIN_SUCCESS,
      });

      const redirectPath = getSafeRedirectUrl(continueTo);
      router.push(redirectPath);

    } catch {

      toastC({
        data: "Google Sign In failed",
        type: "error"
      });

    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-cream text-brand-violet selection:bg-brand-peach selection:text-brand-violet flex items-center justify-center overflow-x-hidden">
      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left: Form Section (Dark Theme matching Brand Palette) */}
        <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-4 bg-brand-violet-dark text-brand-cream flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto border-r-2 border-brand-violet relative z-10 shadow-2xl">
          <div>
            {/* Top Brand Logo with cabinet icon & glowing text contrast */}
            <div className="mb-8">
              <Logo classes="text-brand-cream" />
            </div>

            {/* Heading & Subtext */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-cream tracking-tight">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="mt-2 text-sm text-brand-peach/85 font-medium leading-relaxed">
                {isLogin
                  ? "Enter your credentials to access and command your encrypted vaults."
                  : "Sign up to start organizing files with zero-knowledge security."}
              </p>
            </div>

            {/* Interactive Auth Form */}
            <div>{isLogin ? <LoginForm /> : <SignupForm />}</div>

            {/* Divider in Dark Theme */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-brand-violet-light/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-brand-violet px-3 py-0.5 text-xs font-bold text-brand-peach uppercase tracking-wider border border-brand-violet-light">
                  Or Continue With
                </span>
              </div>
            </div>

            {/* Google Authentication */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                theme="filled_black"
                shape="rectangular"
                size="large"
                width="100%"
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  toastC({ data: "Google Sign In failed", type: "error" })
                }
              />
            </div>
          </div>

          {/* Switch Login / Signup Footer */}
          <div className="pt-6 mt-6 border-t border-brand-violet-light/60 text-center text-sm font-medium text-brand-cream/70">
            <span>
              {isLogin ? "Don't have an Account?" : "Already have an Account?"}
            </span>{" "}
            <button
              type="button"
              onClick={handleSwitch}
              className="font-bold text-brand-peach-vibrant hover:text-brand-peach underline underline-offset-4 cursor-pointer transition-colors"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </div>
        </div>

        {/* Right: Large Banner Image Section */}
        <div className="hidden md:block md:col-span-7 lg:col-span-8 relative h-full w-full bg-brand-violet-dark">
          <Image
            src="/auth_banner.png"
            alt="FileFlux Authentication Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Brand Accent Stripe on Divider */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-brown via-brand-peach-vibrant to-brand-peach" />
        </div>
      </div>
    </div>
  );
};

const AuthPage = () => {
  return (
    <Suspense fallback={null}>
      <AuthContent />
    </Suspense>
  );
};

export default AuthPage;
