import { files, folders, usersTable } from "./schema";

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

export const fileListSelect = {
  id: files.id,
  name: files.name,
  extension: files.extension,
  mimeType: files.mimeType,
  size: files.size,
  thumbnailUrl: files.thumbnailUrl,
  folderId: files.folderId,
  isFavorite: files.isFavorite,
  createdAt: files.createdAt,
  updatedAt: files.updatedAt
};

export const folderPreviewSelect = {
  id: folders.id,
  name: folders.name,
  color: folders.color
};