"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { loginSchema } from "@/lib/validations/auth";
import toastC from "@/lib/toast";

import { AUTH_TOAST_MESSAGES } from "@/constant";


const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { login, isLoading } = useAuth();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      toastC({
        type: "error",
        data: AUTH_TOAST_MESSAGES.FIELDS_INVALID,
      });
      return;
    }

    const result = await login({ email, password });

    if (result.success) {
      toastC({
        type: "success",
        data: AUTH_TOAST_MESSAGES.LOGIN_SUCCESS,
      });

      setEmail("");
      setPassword("");
    } else {
      console.error("Login failed:", result.error);
      toastC({
        type: "error",
        data: result.error || AUTH_TOAST_MESSAGES.LOGIN_FAILED,
      });
    }
  }

  return (
    <form className="space-y-8 w-full h-full">
      {/* Email */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="email" className="text-xl">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="px-3 py-2 bg-slate-400 rounded-md text-violet outline-0 border-0 focus:border-2 focus:border-ember"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="••••••••"
          className="px-3 py-2 bg-slate-400 rounded-md text-violet outline-0 border-0 focus:border-2 focus:border-ember"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Sign In */}
      <button
        onClick={handleLogin}
        className="w-full  text-base rounded-md cursor-pointer px-3 py-2 font-semibold bg-ember text-peach hover:text-green hover:bg-ember/80 transition-colors duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:bg-violet disabled:text-peach/80"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <LoaderCircle className="animate-spin" />
            Loging In...
          </div>
        ) : (
          "Log In"
        )}
      </button>
    </form>
  );
};

export default LoginForm;
