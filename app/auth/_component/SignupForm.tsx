"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { LoaderCircle } from "lucide-react";

import useAuthStore  from "@/context/useAuthStore";

const SignupForm = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const { signup, isLoading } = useAuthStore();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const result = await signup({ name, email, password });

    if (result.success) {
      console.log("Signup successful!");
      router.push("/dashboard");
    } else {
      console.error("Signup failed:", result.error);
    
    }
  }

  return (
    <form className="space-y-6 w-full h-full">
      {/* Name */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="name" className="text-base">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
           className="px-3 py-2 bg-brown rounded-md outline-0 border-0 text-violet font-medium"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="email" className="text-base">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
           className="px-3 py-2 bg-brown rounded-md outline-0 border-0 text-violet font-medium"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="password" className="text-base">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
           className="px-3 py-2 bg-brown rounded-md outline-0 border-0 text-violet font-medium"
          required
        />
      </div>

      {/* Sign Up Button */}
      <button
         className="w-full  text-base rounded-md cursor-pointer px-3 py-2 font-semibold bg-violet text-peach hover:text-ember"
        onClick={handleSignup}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="animate-spin" />
            Creating your account...
          </div>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
