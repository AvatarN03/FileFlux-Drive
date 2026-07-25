
import { User } from "@/db/schema";

import { AUTH_API_ENDPOINTS, AUTH_TOAST_MESSAGES } from "@/constant";

import { ApiResponse } from "@/types";
import { AuthCredentials, ResendVerificationResponse } from "@/types/auth";

const authApi = {
  async checkAuth(): Promise<User | null> {
    const res = await fetch(AUTH_API_ENDPOINTS.CHECK_AUTH, {
      credentials: "include",
      cache: "no-store",
    });

    if (res.status === 401) {
      return null;
    }

    const data: ApiResponse<User> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Failed to fetch user.");
    }

    return data.data ?? null;
  },

  async login(credentials: AuthCredentials): Promise<User> {
    const res = await fetch(AUTH_API_ENDPOINTS.LOGIN, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || AUTH_TOAST_MESSAGES.LOGIN_FAILED);
    }

    return data.data!;
  },

  async signup(credentials: AuthCredentials): Promise<User> {
    const res = await fetch(AUTH_API_ENDPOINTS.SIGNUP, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || AUTH_TOAST_MESSAGES.SIGNUP_FAILED);
    }

    return data.data!;
  },

  async logout() {
    const res = await fetch(AUTH_API_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Logout failed");
    }

    return true;
  },

  async resendVerification():  Promise<ResendVerificationResponse> {
    const res = await fetch(AUTH_API_ENDPOINTS.VERIFICATION_MAIL, {
      method: "POST",
      credentials: "include",
    });

    const data: ResendVerificationResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Error in resend email");
    }

    return data;
  },

  async verifyEmail(token: string): Promise<ApiResponse> {
    const res = await fetch(
      `${AUTH_API_ENDPOINTS.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data: ApiResponse = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error ?? "Email verification failed.");
    }

    return data;
  },

  async googleLogin(credential: string): Promise<User> {
    const res = await fetch("/api/auth/google", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        credential,
      }),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Google Sign In failed");
    }

    return data.data!;
  },

  // async deleteAccount() {
  //   const res = await fetch(AUTH_API_ENDPOINTS.DELETE_ACCOUNT, {
  //     method: "DELETE",
  //     credentials: "include",
  //   });

  //   if (!res.ok) {
  //     throw new Error("Delete account failed");
  //   }
  // },
};

export default authApi;