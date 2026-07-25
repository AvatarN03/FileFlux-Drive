// Auth input (login / signup)
export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
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