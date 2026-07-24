import { usersTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

// Generic API response
export type ApiResponse<T = unknown> = {
  success: boolean;
  status?: number;
  user?: T; // renamed from `user` → more reusable
  error?: string;
};

// Auth input (login / signup)
export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

// Auth store / hook interface
export interface UseAuthProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (credentials: AuthCredentials) => Promise<ApiResponse<User>>;
  signup: (credentials: AuthCredentials) => Promise<ApiResponse<User>>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<ApiResponse<null>>;
  deleteAccount: () => Promise<void>;
}

// Token creation
export interface SigninTokenProps {
  data: Record<string, unknown>; // safer than object
  expireDays?: number | string;
}

// API error shape
export interface ApiError {
  error?: string;
  message?: string;
}


export type ResendState = "idle" | "sending" | "sent" | "error";

export type Status = "verifying" | "success" | "error";

export type User = InferSelectModel<typeof usersTable>;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  storageUsed: number;
  storageLimit: number;
  lastVerificationEmailSentAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
};