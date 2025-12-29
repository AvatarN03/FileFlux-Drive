"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { LoaderCircle } from "lucide-react";

import  useAuthStore  from "@/context/useAuthStore";

const LoginForm = () => {
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const { login, isLoading } = useAuthStore();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await login({ email, password });

    if (result.success) {
      console.log("Login successful!");
      router.push("/dashboard");
    } else {
      console.error("Login failed:", result.error);
    }
  }

  return (
    <form className="space-y-8 w-full h-full">
      {/* Email */}
      <div className="flex flex-col gap-2 justify-start">
        <label htmlFor="email" className="text-base">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="px-3 py-2 bg-brown rounded-md text-violet font-medium outline-0 border-0"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="••••••••"
          className="px-3 py-2 bg-brown rounded-md text-violet font-medium outline-0 border-0"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Sign In */}
      <button
        onClick={handleLogin}
        className="w-full  text-base rounded-md cursor-pointer px-3 py-2 font-semibold bg-violet text-peach hover:text-ember"
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
