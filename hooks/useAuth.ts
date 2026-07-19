"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { API_ENDPOINTS, TOAST_MESSAGES } from "@/constant";

import toastC from "@/lib/toast";
import getErrorMessage from "@/lib/file/getErrorMessage";

import type { ApiResponse, User, AuthCredentials } from "@/types/auth";

const authApi = {
  async checkAuth(): Promise<User | null> {
    const res = await fetch(API_ENDPOINTS.CHECK_AUTH, {
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: ApiResponse<User> = await res.json();

    return data.success ? data.user! : null;
  },

  async login(credentials: AuthCredentials): Promise<User> {
    const res = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || TOAST_MESSAGES.LOGIN_FAILED);
    }

    return data.user!;
  },

  async signup(credentials: AuthCredentials): Promise<User> {
    const res = await fetch(API_ENDPOINTS.SIGNUP, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data: ApiResponse<User> = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || TOAST_MESSAGES.SIGNUP_FAILED);
    }

    return data.user!;
  },

  async logout() {
    const res = await fetch(API_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Logout failed");
    }
  },

  async resendVerification() {
    const res = await fetch(API_ENDPOINTS.VERIFICATION_MAIL, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return data;
  },

  async verifyEmail(token: string) {
    const res = await fetch(
      `${API_ENDPOINTS.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw data;
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

    return data.user!;
  },

  async deleteAccount() {
    const res = await fetch(API_ENDPOINTS.DELETE_ACCOUNT, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Delete account failed");
    }
  },
};

export function useAuth() {
  const queryClient = useQueryClient();

  // =====================
  // USER
  // =====================

  const userQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: authApi.checkAuth,

    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,

    retry: false,

    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });

  // =====================
  // LOGIN
  // =====================

  const loginMutation = useMutation({
    mutationFn: authApi.login,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });

  // =====================
  // SIGNUP
  // =====================

  const signupMutation = useMutation({
    mutationFn: authApi.signup,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });

  // =====================
  // LOGOUT
  // =====================

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,

    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    },
  });

  const resendVerificationMutation = useMutation({
    mutationFn: authApi.resendVerification,
  });

  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,

    onSuccess: () => {
      // refresh user query
      queryClient.invalidateQueries({
        queryKey: ["auth", "user"],
      });
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: authApi.googleLogin,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });

  // =====================
  // DELETE ACCOUNT
  // =====================

  const deleteMutation = useMutation({
    mutationFn: authApi.deleteAccount,

    onSuccess: () => {
      queryClient.setQueryData(["auth", "user"], null);

      queryClient.removeQueries();
    },
  });

  return {
    user: userQuery.data ?? null,

    isAuthenticated: !!userQuery.data,

    isLoading:
      userQuery.isPending ||
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending ||
      deleteMutation.isPending,

    checkAuth: userQuery.refetch,

    login: async (data: AuthCredentials) => {
      try {
        const user = await loginMutation.mutateAsync(data);

        return {
          success: true,
          user,
        };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error),
        };
      }
    },

    signup: async (data: AuthCredentials) => {
      try {
        const user = await signupMutation.mutateAsync(data);

        return {
          success: true,
          user,
        };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error),
        };
      }
    },

    logout: async () => {
      try {
        await logoutMutation.mutateAsync();

        toastC({
          type: "success",
          data: TOAST_MESSAGES.LOGOUT_SUCCESS,
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error),
        };
      }
    },

    resendVerification: async () => {
      try {
        return await resendVerificationMutation.mutateAsync();
      } catch (error) {
        throw error;
      }
    },

    verifyEmail: async (token: string) => {
      try {
        const data = await verifyEmailMutation.mutateAsync(token);

        return {
          success: true,
          data,
        };
      } catch (error) {
        return {
          success: false,
          error,
        };
      }
    },

    googleLogin: async (credential: string) => {
      try {
        const user = await googleLoginMutation.mutateAsync(credential);

        return {
          success: true,
          user,
        };
      } catch (error) {
        return {
          success: false,
          error: getErrorMessage(error),
        };
      }
    },

    deleteAccount: async () => {
      try {
        await deleteMutation.mutateAsync();

        toastC({
          type: "success",
          data: TOAST_MESSAGES.DELETE_SUCCESS,
        });

        return {
          success: true,
        };
      } catch (error) {
        toastC({
          type: "error",
          data: TOAST_MESSAGES.DELETE_FAILED,
        });

        return {
          success: false,
          error: getErrorMessage(error),
        };
      }
    },
  };
}
