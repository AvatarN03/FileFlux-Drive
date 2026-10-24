import { getSodium } from "./sodium";
import { EncryptedEnvelope } from "./types";

/**
 * Generate a cryptographically secure 256-bit (32-byte) random Master Vault Key.
 */
export async function generateVaultKey(): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
}

/**
 * Encrypt arbitrary payload (e.g. Master Vault Key or File Key) under a wrapping key.
 */
export async function wrapKey(
  targetKey: Uint8Array,
  wrappingKey: Uint8Array
): Promise<EncryptedEnvelope> {
  const sodium = await getSodium();
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  const ciphertext = sodium.crypto_secretbox_easy(targetKey, nonce, wrappingKey);

  return {
    nonce: sodium.to_base64(nonce),
    ciphertext: sodium.to_base64(ciphertext),
  };
}

/**
 * Decrypt and authenticate a wrapped key envelope.
 * Throws an Error if the key is incorrect or if the envelope has been modified.
 */
export async function unwrapKey(
  envelope: EncryptedEnvelope,
  wrappingKey: Uint8Array
): Promise<Uint8Array> {
  const sodium = await getSodium();
  const nonce = sodium.from_base64(envelope.nonce);
  const ciphertext = sodium.from_base64(envelope.ciphertext);

  try {
    const decrypted = sodium.crypto_secretbox_open_easy(
      ciphertext,
      nonce,
      wrappingKey
    );
    return decrypted;
  } catch {
    throw new Error("Failed to unwrap key: invalid passphrase, wrong recovery key, or corrupted data.");
  }
}
