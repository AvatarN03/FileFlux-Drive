/**
 * Serialized envelope for secretbox-encrypted key material or metadata.
 */
export interface EncryptedEnvelope {
  /** Hex or Base64 encoded nonce */
  nonce: string;
  /** Hex or Base64 encoded ciphertext with Poly1305 MAC appended */
  ciphertext: string;
}

/**
 * Parameters used for Argon2id key derivation.
 */
export interface KdfParameters {
  /** Base64 encoded random salt */
  salt: string;
  /** Operations limit (CPU cost) */
  opsLimit: number;
  /** Memory limit in bytes */
  memLimit: number;
  /** Algorithm identifier (e.g. "argon2id") */
  algorithm: "argon2id";
}

/**
 * Vault setup payload produced during initial enrollment or passphrase rotation.
 */
export interface VaultEnrollmentPayload {
  kdfParams: KdfParameters;
  passphraseEnvelope: EncryptedEnvelope;
  recoveryEnvelope: EncryptedEnvelope;
  recoveryKeyDisplay: string;
}

/**
 * Sensitive file metadata that must be encrypted before reaching the database.
 */
export interface EncryptedFileMetadata {
  name: string;
  originalName?: string;
  extension: string;
  mimeType: string;
  customAttributes?: Record<string, unknown>;
}
