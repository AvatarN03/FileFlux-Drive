import { usersTable } from "./schema";

export const publicUserSelect = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  avatarUrl: usersTable.avatarUrl,
  emailVerified: usersTable.emailVerified,
  storageUsed: usersTable.storageUsed,
  storageLimit: usersTable.storageLimit,
  lastVerificationEmailSentAt: usersTable.lastVerificationEmailSentAt,
  lastLoginAt: usersTable.lastLoginAt,
  createdAt: usersTable.createdAt,
};