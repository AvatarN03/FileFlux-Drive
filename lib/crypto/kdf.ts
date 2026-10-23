import { getSodium } from "./sodium";
import { KdfParameters } from "./types";

const RECOVERY_KEY_CONTEXT = "ff_recov"; // 8 chars for sodium generic hash context

/**
 * Generate a cryptographically secure random salt for Argon2id.
 */
export async function generateSalt(): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.randombytes_buf(sodium.crypto_pwhash_SALTBYTES);
}

/**
 * Derive a 32-byte Key Encryption Key (KEK) from a user vault passphrase using Argon2id.
 */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  salt: Uint8Array,
  opsLimit?: number,
  memLimit?: number
): Promise<Uint8Array> {
  const sodium = await getSodium();
  const ops = opsLimit ?? sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE;
  const mem = memLimit ?? sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE;

  const derivedKey = sodium.crypto_pwhash(
    sodium.crypto_secretbox_KEYBYTES, // 32 bytes
    passphrase,
    salt,
    ops,
    mem,
    sodium.crypto_pwhash_ALG_ARGON2ID13
  );

  return derivedKey;
}

/**
 * Convert raw salt to KdfParameters metadata for database storage.
 */
export async function createKdfParameters(
  salt: Uint8Array,
  opsLimit?: number,
  memLimit?: number
): Promise<KdfParameters> {
  const sodium = await getSodium();
  return {
    salt: sodium.to_base64(salt),
    opsLimit: opsLimit ?? sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE,
    memLimit: memLimit ?? sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE,
    algorithm: "argon2id",
  };
}

/**
 * Crockford Base32 alphabet for human-friendly transcription.
 * Excludes I, L, O, U to prevent reading confusion.
 */
const CROCKFORD_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Simple checksum function (2 bytes) for detecting typographical errors.
 */
function computeChecksum(bytes: Uint8Array): number {
  let crc = 0xffff;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc;
}

/**
 * Encodes arbitrary bytes to formatted Crockford Base32 with checksum.
 */
function encodeCrockfordWithChecksum(bytes: Uint8Array): string {
  const checksum = computeChecksum(bytes);
  const fullBytes = new Uint8Array(bytes.length + 2);
  fullBytes.set(bytes);
  fullBytes[bytes.length] = (checksum >> 8) & 0xff;
  fullBytes[bytes.length + 1] = checksum & 0xff;

  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < fullBytes.length; i++) {
    value = (value << 8) | fullBytes[i];
    bits += 8;

    while (bits >= 5) {
      output += CROCKFORD_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += CROCKFORD_ALPHABET[(value << (5 - bits)) & 31];
  }

  // Format into groups of 5 characters separated by hyphens
  const formatted = output.match(/.{1,5}/g)?.join("-") ?? output;
  return formatted;
}

/**
 * Decodes formatted Crockford Base32 string and validates the checksum.
 */
function decodeCrockfordWithChecksum(formatted: string): Uint8Array {
  // Normalize string: uppercase, remove hyphens and spaces
  const clean = formatted
    .toUpperCase()
    .replace(/[- \t\r\n]/g, "")
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");

  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    const index = CROCKFORD_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid character '${char}' in recovery key`);
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  if (bytes.length < 3) {
    throw new Error("Recovery key is too short");
  }

  const rawBytes = new Uint8Array(bytes.slice(0, -2));
  const expectedChecksum = (bytes[bytes.length - 2] << 8) | bytes[bytes.length - 1];
  const actualChecksum = computeChecksum(rawBytes);

  if (expectedChecksum !== actualChecksum) {
    throw new Error("Recovery key checksum verification failed. Please check for typos.");
  }

  return rawBytes;
}

/**
 * Generate a random high-entropy (256-bit) recovery key formatted with error-detecting checksum.
 */
export async function generateRecoveryKey(): Promise<{
  recoveryKeyDisplay: string;
  rawRecoveryBytes: Uint8Array;
}> {
  const sodium = await getSodium();
  const rawRecoveryBytes = sodium.randombytes_buf(32); // 256 bits of entropy
  const recoveryKeyDisplay = encodeCrockfordWithChecksum(rawRecoveryBytes);

  return {
    recoveryKeyDisplay,
    rawRecoveryBytes,
  };
}

/**
 * Derive a 32-byte wrapping key from raw recovery bytes using BLAKE2b generic hash.
 */
export async function deriveKeyFromRecovery(rawBytes: Uint8Array): Promise<Uint8Array> {
  const sodium = await getSodium();
  return sodium.crypto_generichash(
    sodium.crypto_secretbox_KEYBYTES,
    rawBytes,
    null // keyless BLAKE2b
  );
}

/**
 * Parse and validate a user-supplied recovery key string, deriving the 32-byte wrapping key.
 */
export async function deriveKeyFromRecoveryString(
  recoveryKeyString: string
): Promise<Uint8Array> {
  const rawBytes = decodeCrockfordWithChecksum(recoveryKeyString);
  return deriveKeyFromRecovery(rawBytes);
}
