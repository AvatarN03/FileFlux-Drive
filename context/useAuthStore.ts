// context/useAuth.ts
"use client";

import { redirect } from "next/navigation";

import axios from "axios";
import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

import { UseAuthProps, User, ApiResponse, AuthCredentials } from "@/types/auth";
import toastC from "@/lib/toast";
import { clearAuthStorage } from "@/lib/auth";
import getErrorMessage from "@/lib/file/getErrorMessage";
import { API_ENDPOINTS, STORAGE_KEY, TOAST_MESSAGES } from "@/constant";

const useAuthStore = create<UseAuthProps>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,

        login: async (credentials: AuthCredentials) => {
          set({ isLoading: true }, false, "login/start");

          try {
            const res = await axios.post<ApiResponse<User>>(
              API_ENDPOINTS.LOGIN,
              credentials,
              { withCredentials: true }
            );

            if (res.data.success && res.data.user) {
              set(
                {
                  user: res.data.user,
                  isAuthenticated: true,
                  isLoading: false,
                },
                false,
                "login/success"
              );

              toastC({
                type: "success",
                data: TOAST_MESSAGES.LOGIN_SUCCESS,
              });

              return { success: true };
            }

            set({ isLoading: false }, false, "login/failed");

            const errorMsg = res.data.error || TOAST_MESSAGES.LOGIN_FAILED;
            toastC({
              type: "error",
              data: TOAST_MESSAGES.LOGIN_FAILED,
            });

            return {
              success: false,
              error: errorMsg,
            };
          } catch (error) {
            set({ isLoading: false }, false, "login/error");

            const errorMsg =
              getErrorMessage(error) || TOAST_MESSAGES.LOGIN_FAILED;
            toastC({
              type: "error",
              data: errorMsg,
            });

            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        signup: async (credentials: AuthCredentials) => {
          set({ isLoading: true }, false, "signup/start");

          try {
            const res = await axios.post<ApiResponse<User>>(
              API_ENDPOINTS.SIGNUP,
              credentials,
              { withCredentials: true }
            );
            console.log(res.data);

            if (res.data.success && res.data.user) {
              set(
                {
                  user: res.data.user,
                  isAuthenticated: true,
                  isLoading: false,
                },
                false,
                "signup/success"
              );

              toastC({
                type: "success",
                data: TOAST_MESSAGES.SIGNUP_SUCCESS,
              });

              return { success: true };
            }

            set({ isLoading: false }, false, "signup/failed");

            const errorMsg = TOAST_MESSAGES.SIGNUP_FAILED;
            toastC({
              type: "error",
              data: errorMsg,
            });

            return {
              success: false,
              error: errorMsg,
            };
          } catch (error) {
            set({ isLoading: false }, false, "signup/error");

            const errorMsg =
              getErrorMessage(error) || TOAST_MESSAGES.SIGNUP_FAILED;
            toastC({
              type: "error",
              data: errorMsg,
            });

            return {
              success: false,
              error: errorMsg,
            };
          }
        },

        logout: async () => {
          set({ isLoading: true }, false, "logout/start");

          try {
            await axios.post<ApiResponse>(
              API_ENDPOINTS.LOGOUT,
              {},
              { withCredentials: true }
            );
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
              },
              false,
              "logout/success"
            );

            clearAuthStorage();

            toastC({
              type: "success",
              data: TOAST_MESSAGES.LOGOUT_SUCCESS,
            });

            return { success: true };
          } catch (error) {
            // Always clear store even if logout API fails
            // This ensures security - user is logged out locally
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
              },
              false,
              "logout/error"
            );

            clearAuthStorage();

            console.error("Logout error:", error);

            return { success: false };
          }
        },

        checkAuth: async () => {
          set({ isLoading: true }, false, "checkAuth/start");

          try {
            const res = await axios.get<ApiResponse<User>>(
              API_ENDPOINTS.CHECK_AUTH,
              { withCredentials: true }
            );

            if (res.data.success && res.data.user) {
              set(
                {
                  user: res.data.user,
                  isAuthenticated: true,
                  isLoading: false,
                },
                false,
                "checkAuth/success"
              );
            } else {
              set(
                {
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                },
                false,
                "checkAuth/notAuthenticated"
              );
              clearAuthStorage();

              toastC({
                type: "error",
                data: TOAST_MESSAGES.SESSION_EXPIRED,
              });
            }
          } catch (error) {
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
              },
              false,
              "checkAuth/error"
            );

            clearAuthStorage();

            console.error("Auth check failed:", error);
          }
        },

        deleteAccount: async () => {
          set({ isLoading: true }, false, "deleteAccount/start");

          try {
            await axios.delete(API_ENDPOINTS.DELETE_ACCOUNT);

            // Clear state and storage
            set(
              {
                user: null,
                isAuthenticated: false,
                isLoading: false,
              },
              false,
              "deleteAccount/success"
            );

            clearAuthStorage();

            toastC({
              type: "success",
              data: TOAST_MESSAGES.DELETE_SUCCESS,
            });

            // Redirect to home
            redirect("/");
          } catch (error) {
            set({ isLoading: false }, false, "deleteAccount/error");

            console.error("Delete account failed:", error);
            toastC({
              type: "error",
              data: TOAST_MESSAGES.DELETE_FAILED,
            });
          }
        },
      }),
      {
        name: STORAGE_KEY,
        // Only persist essential auth state
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "auth-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

export default useAuthStore;
