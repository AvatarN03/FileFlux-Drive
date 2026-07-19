"use client";

import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";

import useAuthStore from "@/context/useAuthStore";
import { signupSchema } from "@/lib/validations/auth";
import toastC from "@/lib/toast";
import { TOAST_MESSAGES } from "@/constant";

const SignupForm = () => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const { signup, isLoading } = useAuthStore();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse({
      name,
      email,
      password,
    });

    if (!parsed.success) {
      toastC({
        type: "error",
        data: TOAST_MESSAGES.FIELDS_INVALID,
      });
      return;
    }

    const result = await signup(parsed.data);

    if (result.success) {
      toastC({
        type: "success",
        data: TOAST_MESSAGES.SIGNUP_SUCCESS,
      });

      setName("");
      setEmail("");
      setPassword("");
    } else {
      console.error("Signup failed:", result.error);
      toastC({
        type: "error",
        data: result.error || TOAST_MESSAGES.SIGNUP_FAILED,
      });
    }
  }

  return (
    <form className="space-y-6 w-full h-full">
      {/* Name */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="name" className="text-xl">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex. Ramu Naidu"
          className="px-3 py-2 bg-slate-400 rounded-md text-violet outline-0 border-0 focus:border-2 focus:border-ember"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="email" className="text-xl">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="px-3 py-2 bg-slate-400 rounded-md text-violet outline-0 border-0 focus:border-2 focus:border-ember"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="password" className="text-xl">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="px-3 py-2 bg-slate-400 rounded-md text-violet outline-0 border-0 focus:border-2 focus:border-ember"
          required
        />
      </div>

      {/* Sign Up Button */}
      <button
        className="w-full  text-base rounded-md cursor-pointer px-3 py-2 font-semibold bg-ember text-peach hover:text-green hover:bg-ember/80 transition-colors duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-violet disabled:text-peach/80"
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
