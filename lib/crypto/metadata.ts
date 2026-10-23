import { getSodium } from "./sodium";
import { EncryptedEnvelope, EncryptedFileMetadata } from "./types";

/**
 * Encrypt sensitive file metadata into an authenticated envelope using the user's Vault Key.
 */
export async function encryptMetadata(
  metadata: EncryptedFileMetadata,
  vaultKey: Uint8Array
): Promise<EncryptedEnvelope> {
  const sodium = await getSodium();
  const jsonString = JSON.stringify(metadata);
  const plaintextBytes = sodium.from_string(jsonString);

  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(plaintextBytes, nonce, vaultKey);

  return {
    nonce: sodium.to_base64(nonce),
    ciphertext: sodium.to_base64(ciphertext),
  };
}

/**
 * Decrypt and verify an authenticated metadata envelope using the user's Vault Key.
 */
export async function decryptMetadata(
  envelope: EncryptedEnvelope,
  vaultKey: Uint8Array
): Promise<EncryptedFileMetadata> {
  const sodium = await getSodium();
  const nonce = sodium.from_base64(envelope.nonce);
  const ciphertext = sodium.from_base64(envelope.ciphertext);

  try {
    const decryptedBytes = sodium.crypto_secretbox_open_easy(
      ciphertext,
      nonce,
      vaultKey
    );
    const jsonString = sodium.to_string(decryptedBytes);
    return JSON.parse(jsonString) as EncryptedFileMetadata;
  } catch {
    throw new Error("Failed to decrypt metadata: invalid vault key or corrupted metadata envelope.");
  }
}
