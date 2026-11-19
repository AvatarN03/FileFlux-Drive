import type { ApiResponse } from ".";

// Shared authentication types
export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

export interface ResendVerificationResponse extends ApiResponse {
  coolDownMs?: number; // Only present when status is 429
}

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
