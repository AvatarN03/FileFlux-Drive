import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import authApi from "@/services/authApi";

import getErrorMessage from "@/lib";

import { AuthCredentials } from "@/types/auth";

export function useAuth() {
  const queryClient = useQueryClient();

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

  const loginMutation = useMutation({
    mutationFn: authApi.login,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.signup,

    onSuccess: (user) => {
      queryClient.setQueryData(["auth", "user"], user);
    },
  });

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

  // const deleteMutation = useMutation({
  //   mutationFn: authApi.deleteAccount,

  //   onSuccess: () => {
  //     queryClient.setQueryData(["auth", "user"], null);

  //     queryClient.removeQueries();
  //   },
  // });

  return {
    user: userQuery.data ?? null,

    isAuthenticated: !!userQuery.data,

    isLoading:
      userQuery.isPending ||
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending ||
      googleLoginMutation.isPending ||
      verifyEmailMutation.isPending ||
      resendVerificationMutation.isPending,
    // deleteMutation.isPending,

    
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
        return {
          success: false,
          error: getErrorMessage(error),
        };
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
          error: getErrorMessage(error),
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

    // deleteAccount: async () => {
    //   try {
    //     await deleteMutation.mutateAsync();

    //     toastC({
    //       type: "success",
    //       data: AUTH_TOAST_MESSAGES.DELETE_SUCCESS,
    //     });

    //     return {
    //       success: true,
    //     };
    //   } catch (error) {
    //     toastC({
    //       type: "error",
    //       data: AUTH_TOAST_MESSAGES.DELETE_FAILED,
    //     });

    //     return {
    //       success: false,
    //       error: getErrorMessage(error),
    //     };
    //   }
    // },
  };
}
