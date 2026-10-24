"use client";

import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { signupSchema } from "@/lib/validations/auth";
import toastC from "@/lib/toast";

import { AUTH_TOAST_MESSAGES } from "@/constant";

const SignupForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { signup, isLoading } = useAuth();

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
        data: AUTH_TOAST_MESSAGES.FIELDS_INVALID,
      });
      return;
    }

    const result = await signup(parsed.data);

    if (result.success) {
      toastC({
        type: "success",
        data: AUTH_TOAST_MESSAGES.SIGNUP_SUCCESS,
      });

      setName("");
      setEmail("");
      setPassword("");
    } else {
      console.error("Signup failed:", result.error);
      toastC({
        type: "error",
        data: result.error || AUTH_TOAST_MESSAGES.SIGNUP_FAILED,
      });
    }
  }

  return (
    <form onSubmit={handleSignup} className="space-y-4 w-full">
      {/* Name */}
      <div className="flex flex-col gap-1.5 justify-start">
        <label
          htmlFor="name"
          className="text-xs font-bold uppercase tracking-wider text-brand-peach"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. John Doe"
          className="w-full px-3.5 py-2.5 bg-brand-violet border-2 border-brand-violet-light text-brand-cream placeholder:text-brand-cream/35 font-medium text-sm focus:outline-none focus:border-brand-peach-vibrant focus:shadow-[2px_2px_0px_0px_#FFA552] transition-all rounded-none"
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5 justify-start">
        <label
          htmlFor="email"
          className="text-xs font-bold uppercase tracking-wider text-brand-peach"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-3.5 py-2.5 bg-brand-violet border-2 border-brand-violet-light text-brand-cream placeholder:text-brand-cream/35 font-medium text-sm focus:outline-none focus:border-brand-peach-vibrant focus:shadow-[2px_2px_0px_0px_#FFA552] transition-all rounded-none"
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5 justify-start">
        <label
          htmlFor="password"
          className="text-xs font-bold uppercase tracking-wider text-brand-peach"
        >
          Create Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="w-full px-3.5 py-2.5 bg-brand-violet border-2 border-brand-violet-light text-brand-cream placeholder:text-brand-cream/35 font-medium text-sm focus:outline-none focus:border-brand-peach-vibrant focus:shadow-[2px_2px_0px_0px_#FFA552] transition-all rounded-none"
          required
        />
      </div>

      {/* Sign Up Button */}
      <button
        type="submit"
        className="w-full px-5 py-3 bg-brand-brown hover:bg-brand-brown-dark text-brand-cream text-sm font-bold border-2 border-brand-brown shadow-[3px_3px_0px_0px_#FFA552] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#FFA552] transition-all rounded-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="w-4 h-4 animate-spin text-brand-peach" />
            <span>Creating account...</span>
          </div>
        ) : (
          "Create FileFlux Account"
        )}
      </button>
    </form>
  );
};

export default SignupForm;
