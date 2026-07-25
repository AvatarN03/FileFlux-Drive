import { ApiResponse } from ".";

// Auth input (login / signup)
export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

export interface ResendVerificationResponse extends ApiResponse {
  coolDownMs?: number; // Only present when status is 429
}

export type ResendState = "idle" | "sending" | "sent" | "error";

export type Status = "verifying" | "success" | "error";

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