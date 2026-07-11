"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import Logo from "../(main)/_components/Logo";
import LoginForm from "./_component/LoginForm";
import SignupForm from "./_component/SignupForm";

import useAuthStore from "@/context/useAuthStore";
import { GoogleLogin } from "@react-oauth/google";
import toastC from "@/lib/toast";
import { CredentialResponse } from "@react-oauth/google";


const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const continueTo = searchParams.get("continueTo");

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;

    const redirectPath = continueTo
      ? decodeURIComponent(continueTo)
      : "/dashboard";

    router.push(redirectPath);
  }, [isLoading, isAuthenticated, continueTo, router]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        toastC({ data: "Unable to login.", type: "error" });
        return;
      }

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toastC({ data: data.error, type: "error" });
        return;
      }

      await checkAuth();

      router.push("/dashboard");
    } catch {
      toastC({ data: "Google Sign In failed", type: "error" });
    }
  };

  return (
    <div className="h-screen w-screen bg-gradient-62">
      <div className="flex items-center justify-center max-w-480 mx-auto h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full h-full">
          {/* Left: Form Section */}
          <div className="col-span-full md:col-span-1 lg:col-span-1 p-4 md:p-10 flex flex-col justify-center lg:justify-start text-green bg-neutral-900 max-w-lg m-auto md:m-0 rounded-2xl md:rounded-none shadow-lg h-fit w-full md:h-full">
            <div className="my-8">
              <Logo />
            </div>

            <div className="flex flex-col gap-2 text-center mb-8">
              <h1 className="text-2xl font-medium ">
                {isLogin ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="mb-6 font-light tracking-wider text-sm text-peach">
                Login to continue managing your files.
              </p>
            </div>

            <div>{isLogin ? <LoginForm /> : <SignupForm />}</div>
            <div className="mt-6">
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-700" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-neutral-900 px-4 text-xs text-neutral-400">
                    OR
                  </span>
                </div>
              </div>

              <GoogleLogin
                theme="filled_blue"
                shape="pill"
                size="large"
                width="100%"
                onSuccess={handleGoogleSuccess}
                onError={() => toastC({ data: "Google Sign In failed", type: "error" })}
              />
            </div>

            <div className="text-center text-sm mt-8 flex items-center justify-center">
              <p className="font-light">
                {isLogin ? "Don't have an Account?" : "Already have an Account?"}
              </p>
              <button
                onClick={handleSwitch}
                className="font-semibold hover:underline cursor-pointer mx-1 underline underline-offset-2 hover:text-brown"
              >
                {isLogin ? "Sign Up" : "Login"}
              </button>
            </div>
          </div>

          {/* Right: Image Section */}
          <div className="hidden md:block md:col-span-1 lg:col-span-3 overflow-hidden relative h-full shadow-lg  rounded-r-md">
            <Image
              src="/auth_img.png"
              alt="auth-img"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;