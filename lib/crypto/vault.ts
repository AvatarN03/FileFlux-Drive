import { generateSalt, deriveKeyFromPassphrase, createKdfParameters, generateRecoveryKey, deriveKeyFromRecovery, deriveKeyFromRecoveryString } from "./kdf";
import { generateVaultKey, wrapKey, unwrapKey } from "./envelope";
import { EncryptedEnvelope, KdfParameters, VaultEnrollmentPayload } from "./types";

/**
 * Initialize a new Zero-Knowledge vault.
 * Returns the unencrypted vault key (to keep in memory), envelopes to persist to the database,
 * and the recovery key to display to the user once.
 */
export async function createVault(passphrase: string): Promise<{
  vaultKey: Uint8Array;
  enrollment: VaultEnrollmentPayload;
}> {
  // 1. Generate master random 256-bit vault key
  const vaultKey = await generateVaultKey();

  // 2. Generate random salt and derive KEK from user's vault passphrase via Argon2id
  const salt = await generateSalt();
  const kdfParams = await createKdfParameters(salt);
  const passphraseKek = await deriveKeyFromPassphrase(
    passphrase,
    salt,
    kdfParams.opsLimit,
    kdfParams.memLimit
  );

  // 3. Wrap vault key with passphrase KEK
  const passphraseEnvelope = await wrapKey(vaultKey, passphraseKek);

  // 4. Generate high-entropy recovery key and wrap vault key with recovery KEK
  const { recoveryKeyDisplay, rawRecoveryBytes } = await generateRecoveryKey();
  const recoveryKek = await deriveKeyFromRecovery(rawRecoveryBytes);
  const recoveryEnvelope = await wrapKey(vaultKey, recoveryKek);

  return {
    vaultKey,
    enrollment: {
      kdfParams,
      passphraseEnvelope,
      recoveryEnvelope,
      recoveryKeyDisplay,
    },
  };
}

/**
 * Unlock the user's vault using their vault passphrase.
 */
export async function unlockVaultWithPassphrase(
  passphrase: string,
  kdfParams: KdfParameters,
  passphraseEnvelope: EncryptedEnvelope
): Promise<Uint8Array> {
  const { getSodium } = await import("./sodium");
  const sodium = await getSodium();
  const salt = sodium.from_base64(kdfParams.salt);

  const passphraseKek = await deriveKeyFromPassphrase(
    passphrase,
    salt,
    kdfParams.opsLimit,
    kdfParams.memLimit
  );

  return unwrapKey(passphraseEnvelope, passphraseKek);
}

/**
 * Unlock the user's vault using their emergency recovery key.
 */
export async function unlockVaultWithRecoveryKey(
  recoveryKeyDisplay: string,
  recoveryEnvelope: EncryptedEnvelope
): Promise<Uint8Array> {
  const recoveryKek = await deriveKeyFromRecoveryString(recoveryKeyDisplay);
  return unwrapKey(recoveryEnvelope, recoveryKek);
}

/**
 * Re-encrypt the existing vault key under a new passphrase (passphrase rotation).
 * Does not require re-encrypting any files or changing the recovery key.
 */
export async function rotateVaultPassphrase(
  vaultKey: Uint8Array,
  newPassphrase: string
): Promise<{
  kdfParams: KdfParameters;
  passphraseEnvelope: EncryptedEnvelope;
}> {
  const salt = await generateSalt();
  const kdfParams = await createKdfParameters(salt);
  const passphraseKek = await deriveKeyFromPassphrase(
    newPassphrase,
    salt,
    kdfParams.opsLimit,
    kdfParams.memLimit
  );

  const passphraseEnvelope = await wrapKey(vaultKey, passphraseKek);

  return {
    kdfParams,
    passphraseEnvelope,
  };
}
