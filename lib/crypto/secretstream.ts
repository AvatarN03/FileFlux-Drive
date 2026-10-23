import { getSodium } from "./sodium";

export interface SecretstreamEncryptState {
  state: unknown;
  header: Uint8Array;
}

export interface SecretstreamDecryptState {
  state: unknown;
}

export interface DecryptedChunkResult {
  plaintext: Uint8Array;
  isFinal: boolean;
  tag: number;
}

/**
 * Generate a random 32-byte key for secretstream file encryption.
 */
export async function generateFileKey(): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.crypto_secretstream_xchacha20poly1305_keygen();
}

/**
 * Initialize a secretstream encryption session.
 * Returns the opaque state and the 24-byte header that must be stored/transmitted with the ciphertext.
 */
export async function initStreamEncryption(fileKey: Uint8Array): Promise<SecretstreamEncryptState> {
  const sodium = await getSodium();
  const res = sodium.crypto_secretstream_xchacha20poly1305_init_push(fileKey);
  return {
    state: res.state,
    header: res.header,
  };
}

/**
 * Encrypt a single chunk of data in the secretstream.
 * Set `isFinal: true` for the last chunk of the file.
 */
export async function encryptStreamChunk(
  encryptState: SecretstreamEncryptState,
  chunk: Uint8Array,
  isFinal: boolean
): Promise<Uint8Array> {
  const sodium = await getSodium();
  const tag = isFinal
    ? sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL
    : sodium.crypto_secretstream_xchacha20poly1305_TAG_MESSAGE;

  const ciphertextChunk = sodium.crypto_secretstream_xchacha20poly1305_push(
    encryptState.state as any,
    chunk,
    null, // no additional data
    tag
  );

  return ciphertextChunk;
}

/**
 * Initialize a secretstream decryption session from the file's 24-byte header.
 */
export async function initStreamDecryption(
  header: Uint8Array,
  fileKey: Uint8Array
): Promise<SecretstreamDecryptState> {
  const sodium = await getSodium();
  const state = sodium.crypto_secretstream_xchacha20poly1305_init_pull(header, fileKey);
  return { state };
}

/**
 * Decrypt and verify a single chunk in the secretstream.
 * Throws an Error if the chunk was tampered with, out of order, or corrupted.
 */
export async function decryptStreamChunk(
  decryptState: SecretstreamDecryptState,
  ciphertextChunk: Uint8Array
): Promise<DecryptedChunkResult> {
  const sodium = await getSodium();
  try {
    const res = sodium.crypto_secretstream_xchacha20poly1305_pull(
      decryptState.state as any,
      ciphertextChunk,
      null
    );

    if (!res || (typeof res === "boolean" && res === false)) {
      throw new Error("Secretstream chunk authentication failed: data corrupted or tampered.");
    }

    const isFinal = res.tag === sodium.crypto_secretstream_xchacha20poly1305_TAG_FINAL;

    return {
      plaintext: res.message,
      isFinal,
      tag: res.tag,
    };
  } catch {
    throw new Error("Secretstream chunk authentication failed: data corrupted or tampered.");
  }
}
