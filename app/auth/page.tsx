"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { motion } from "motion/react";

import LoginForm from "./_component/LoginForm";
import SignupForm from "./_component/SignupForm";

import useAuthStore from "@/context/useAuthStore";
import Logo from "../(main)/_components/Logo";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const { continueTo }: { continueTo: string } = useParams();
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

  return (
    <div className="h-screen w-screen bg-gradient-62 flex items-center justify-center p-1 sm:p-8 relative z-30 overflow-hidden">
      {/* Blur layer - isolated at the back */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-96 aspect-square rounded-full bg-ember blur-[80px] absolute top-0 -right-32 opacity-80" />
        <div className="w-96 h-96 rounded-full bg-ember blur-[80px] absolute bottom-0 -left-32 opacity-70" />
      </div>

      {/* Main Card - Above blur layer */}
      <motion.div
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, }}
       
        className="relative z-10 flex w-full max-w-3xl lg:max-w-4xl h-auto md:max-h-[80vh] bg-peach rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Left: Form Section */}
        <div className="w-full md:w-1/2 p-4 md:p-10 flex flex-col justify-center text-ember">
          <div className="my-8">
            <Logo />
          </div>

          <h1 className="text-2xl font-medium mb-4">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="mb-6 font-normal tracking-wider text-base">
            Login to continue tracking your expenses.
          </p>

          <div>{isLogin ? <LoginForm /> : <SignupForm />}</div>

          <div className="text-center text-base mt-8 flex items-center justify-center">
            <p>
              {isLogin ? "Don't have an Account?" : "Already have an Account ?"}
            </p>
            <button
              onClick={handleSwitch}
              className="font-semibold hover:underline cursor-pointer mx-1"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </div>
        </div>

        {/* Right: Image Section */}
        <div className="hidden md:block w-1/2 h-full my-auto">
          <Image
            width={900}
            height={900}
            src="/auth_img.png"
            alt="auth-img"
            className="w-full h-full object-cover rounded-r-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;
