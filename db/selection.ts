import { files, folders, usersTable, vaults } from "./schema";

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
  url: files.url,
  thumbnailUrl: files.thumbnailUrl,
  folderId: files.folderId,
  isFavorite: files.isFavorite,
  objectKey: files.objectKey,
  streamHeader: files.streamHeader,
  encryptedKeyNonce: files.encryptedKeyNonce,
  encryptedKeyCiphertext: files.encryptedKeyCiphertext,
  encryptedMetadataNonce: files.encryptedMetadataNonce,
  encryptedMetadataCiphertext: files.encryptedMetadataCiphertext,
  isEncrypted: files.isEncrypted,
  createdAt: files.createdAt,
  updatedAt: files.updatedAt,
};

export const folderPreviewSelect = {
  id: folders.id,
  name: folders.name,
  color: folders.color
};

export const vaultEnvelopesSelect = {
  id: vaults.id,
  kdfSalt: vaults.kdfSalt,
  kdfOpsLimit: vaults.kdfOpsLimit,
  kdfMemLimit: vaults.kdfMemLimit,
  kdfAlgorithm: vaults.kdfAlgorithm,
  passphraseNonce: vaults.passphraseNonce,
  passphraseCiphertext: vaults.passphraseCiphertext,
  recoveryNonce: vaults.recoveryNonce,
  recoveryCiphertext: vaults.recoveryCiphertext,
  updatedAt: vaults.updatedAt,
};