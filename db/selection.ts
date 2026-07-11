import { usersTable } from "./schema";

export const publicUserSelect = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  emailVerified: usersTable.emailVerified,
  storageUsed: usersTable.storageUsed,
  storageLimit: usersTable.storageLimit,
  lastLoginAt: usersTable.lastLoginAt,
  createdAt: usersTable.createdAt,
};