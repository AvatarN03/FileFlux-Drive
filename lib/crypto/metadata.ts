import { getSodium } from "./sodium";
import {
  EncryptedEnvelope,
  EncryptedFileMetadata,
  EncryptedFolderMetadata,
} from "./types";

async function encryptJsonMetadata<T extends object>(
  metadata: T,
  vaultKey: Uint8Array
): Promise<EncryptedEnvelope> {
  const sodium = await getSodium();
  const plaintextBytes = sodium.from_string(JSON.stringify(metadata));
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(plaintextBytes, nonce, vaultKey);

  return {
    nonce: sodium.to_base64(nonce),
    ciphertext: sodium.to_base64(ciphertext),
  };
}

async function decryptJsonMetadata<T>(
  envelope: EncryptedEnvelope,
  vaultKey: Uint8Array
): Promise<T> {
  const sodium = await getSodium();
  const nonce = sodium.from_base64(envelope.nonce);
  const ciphertext = sodium.from_base64(envelope.ciphertext);

  try {
    const decryptedBytes = sodium.crypto_secretbox_open_easy(
      ciphertext,
      nonce,
      vaultKey
    );
    return JSON.parse(sodium.to_string(decryptedBytes)) as T;
  } catch {
    throw new Error(
      "Failed to decrypt metadata: invalid vault key or corrupted metadata envelope."
    );
  }
}

/**
 * Encrypt sensitive file metadata into an authenticated envelope using the user's Vault Key.
 */
export async function encryptMetadata(
  metadata: EncryptedFileMetadata,
  vaultKey: Uint8Array
): Promise<EncryptedEnvelope> {
  return encryptJsonMetadata(metadata, vaultKey);
}

/**
 * Decrypt and verify an authenticated metadata envelope using the user's Vault Key.
 */
export async function decryptMetadata(
  envelope: EncryptedEnvelope,
  vaultKey: Uint8Array
): Promise<EncryptedFileMetadata> {
  return decryptJsonMetadata<EncryptedFileMetadata>(envelope, vaultKey);
}

/** Encrypt a folder name into an authenticated envelope using the user's Vault Key. */
export async function encryptFolderMetadata(
  metadata: EncryptedFolderMetadata,
  vaultKey: Uint8Array
): Promise<EncryptedEnvelope> {
  return encryptJsonMetadata(metadata, vaultKey);
}

/** Decrypt and validate a folder metadata envelope using the user's Vault Key. */
export async function decryptFolderMetadata(
  envelope: EncryptedEnvelope,
  vaultKey: Uint8Array
): Promise<EncryptedFolderMetadata> {
  const metadata = await decryptJsonMetadata<unknown>(envelope, vaultKey);

  if (
    typeof metadata !== "object" ||
    metadata === null ||
    typeof (metadata as EncryptedFolderMetadata).name !== "string"
  ) {
    throw new Error("Failed to decrypt folder metadata: invalid metadata format.");
  }

  return metadata as EncryptedFolderMetadata;
}
