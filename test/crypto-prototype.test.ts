import {
  createVault,
  unlockVaultWithPassphrase,
  unlockVaultWithRecoveryKey,
  rotateVaultPassphrase,
  encryptMetadata,
  decryptMetadata,
  generateFileKey,
  initStreamEncryption,
  encryptStreamChunk,
  initStreamDecryption,
  decryptStreamChunk,
  getSodium,
} from "../lib/crypto";

async function runTestSuite() {
  console.log("=================================================");
  console.log("   FileFlux Zero-Knowledge Cryptographic Prototype");
  console.log("=================================================\n");

  const sodium = await getSodium();
  console.log(`[PASS] libsodium initialized successfully (libsodium v${sodium.SODIUM_LIBRARY_VERSION_MAJOR}.${sodium.SODIUM_LIBRARY_VERSION_MINOR})`);

  // 1. Vault Enrollment Benchmark & Creation
  console.log("\n--- TEST 1: Vault Enrollment & Argon2id KDF Benchmark ---");
  const testPassphrase = "CorrectHorseBatteryStaple#2026!";
  const kdfStartTime = Date.now();

  const { vaultKey, enrollment } = await createVault(testPassphrase);
  const kdfDuration = Date.now() - kdfStartTime;

  console.log(`[PASS] Vault created in ${kdfDuration}ms`);
  console.log(`       Salt (Base64): ${enrollment.kdfParams.salt}`);
  console.log(`       Argon2id Ops: ${enrollment.kdfParams.opsLimit}, Mem: ${enrollment.kdfParams.memLimit} bytes`);
  console.log(`       Passphrase Envelope Ciphertext Len: ${enrollment.passphraseEnvelope.ciphertext.length}`);
  console.log(`       Recovery Key Display: ${enrollment.recoveryKeyDisplay}`);

  // 2. Unlock with Passphrase
  console.log("\n--- TEST 2: Vault Unlock with Valid Passphrase ---");
  const unlockedKeyPass = await unlockVaultWithPassphrase(
    testPassphrase,
    enrollment.kdfParams,
    enrollment.passphraseEnvelope
  );

  const keysMatch = sodium.memcmp(vaultKey, unlockedKeyPass);
  if (!keysMatch) {
    throw new Error("FAIL: Unlocked vault key does not match original vault key!");
  }
  console.log("[PASS] Vault unlocked successfully; 256-bit key verified bit-for-bit.");

  // 3. Reject Wrong Passphrase
  console.log("\n--- TEST 3: Reject Wrong Passphrase ---");
  try {
    await unlockVaultWithPassphrase(
      "WrongPassword123!",
      enrollment.kdfParams,
      enrollment.passphraseEnvelope
    );
    throw new Error("ASSERTION_FAILED: Vault unlocked with incorrect password!");
  } catch (err: unknown) {
    if ((err as Error).message.startsWith("ASSERTION_FAILED")) {
      throw err;
    }
    console.log(`[PASS] Successfully rejected wrong password with message: "${(err as Error).message}"`);
  }

  // 4. Unlock with Recovery Key
  console.log("\n--- TEST 4: Vault Unlock with Recovery Key ---");
  const unlockedKeyRec = await unlockVaultWithRecoveryKey(
    enrollment.recoveryKeyDisplay,
    enrollment.recoveryEnvelope
  );
  if (!sodium.memcmp(vaultKey, unlockedKeyRec)) {
    throw new Error("FAIL: Recovery-unlocked vault key does not match original vault key!");
  }
  console.log("[PASS] Vault unlocked using emergency recovery key; 256-bit key verified.");

  // 5. Reject Invalid Recovery Key (Checksum detection)
  console.log("\n--- TEST 5: Reject Invalid or Corrupted Recovery Key ---");
  const corruptedKey = enrollment.recoveryKeyDisplay.slice(0, -1) + (enrollment.recoveryKeyDisplay.endsWith("0") ? "1" : "0");
  try {
    await unlockVaultWithRecoveryKey(corruptedKey, enrollment.recoveryEnvelope);
    throw new Error("ASSERTION_FAILED: Corrupted recovery key was accepted!");
  } catch (err: unknown) {
    if ((err as Error).message.startsWith("ASSERTION_FAILED")) {
      throw err;
    }
    console.log(`[PASS] Checksum correctly rejected modified recovery key: "${(err as Error).message}"`);
  }

  // 6. Passphrase Rotation
  console.log("\n--- TEST 6: Passphrase Rotation without Changing Vault Key ---");
  const newPassphrase = "MyNewSuperSecretPassphrase$99";
  const updatedVault = await rotateVaultPassphrase(vaultKey, newPassphrase);

  const unlockedWithNewPass = await unlockVaultWithPassphrase(
    newPassphrase,
    updatedVault.kdfParams,
    updatedVault.passphraseEnvelope
  );
  if (!sodium.memcmp(vaultKey, unlockedWithNewPass)) {
    throw new Error("FAIL: Vault key changed during passphrase rotation!");
  }
  console.log("[PASS] Passphrase rotated successfully. Existing vault key preserved.");

  // 7. Metadata Encryption & Decryption
  console.log("\n--- TEST 7: Metadata Encryption & Decryption ---");
  const testMeta = {
    name: "Q4-Financial-Report-Confidential",
    originalName: "financials_q4_final.pdf",
    extension: "pdf",
    mimeType: "application/pdf",
    customAttributes: { department: "Executive", confidential: true },
  };

  const encryptedMeta = await encryptMetadata(testMeta, vaultKey);
  console.log(`       Encrypted Metadata Ciphertext (Base64): ${encryptedMeta.ciphertext.slice(0, 48)}...`);

  const decryptedMeta = await decryptMetadata(encryptedMeta, vaultKey);
  if (decryptedMeta.name !== testMeta.name || decryptedMeta.mimeType !== testMeta.mimeType) {
    throw new Error("FAIL: Decrypted metadata does not match original!");
  }
  console.log("[PASS] Metadata round-trip encryption/decryption verified.");

  // 8. Chunked Streaming File Encryption & Decryption
  console.log("\n--- TEST 8: XChaCha20-Poly1305 Secretstream Chunked Streaming ---");
  const fileKey = await generateFileKey();

  // Create simulated 3-chunk file
  const chunk1 = new TextEncoder().encode("Chunk 1: First 16KB of confidential payroll data...");
  const chunk2 = new TextEncoder().encode("Chunk 2: Middle portion containing sensitive spreadsheets...");
  const chunk3 = new TextEncoder().encode("Chunk 3: Final portion with cryptographic signatures.");

  // Encrypt stream
  const encryptState = await initStreamEncryption(fileKey);
  const cipher1 = await encryptStreamChunk(encryptState, chunk1, false);
  const cipher2 = await encryptStreamChunk(encryptState, chunk2, false);
  const cipher3 = await encryptStreamChunk(encryptState, chunk3, true); // Final chunk

  console.log(`[PASS] Encrypted 3 chunks. Secretstream Header: ${sodium.to_hex(encryptState.header)}`);

  // Decrypt stream
  const decryptState = await initStreamDecryption(encryptState.header, fileKey);
  const res1 = await decryptStreamChunk(decryptState, cipher1);
  const res2 = await decryptStreamChunk(decryptState, cipher2);
  const res3 = await decryptStreamChunk(decryptState, cipher3);

  if (res1.isFinal || res2.isFinal || !res3.isFinal) {
    throw new Error("FAIL: Secretstream final tags misidentified!");
  }

  const fullDecryptedText =
    new TextDecoder().decode(res1.plaintext) +
    new TextDecoder().decode(res2.plaintext) +
    new TextDecoder().decode(res3.plaintext);

  const fullOriginalText =
    new TextDecoder().decode(chunk1) +
    new TextDecoder().decode(chunk2) +
    new TextDecoder().decode(chunk3);

  if (fullDecryptedText !== fullOriginalText) {
    throw new Error("FAIL: Decrypted stream content does not match original content!");
  }
  console.log("[PASS] Stream decrypted cleanly; all chunk tags and boundaries preserved.");

  // 9. Tamper Detection on Ciphertext Chunks
  console.log("\n--- TEST 9: Authenticated Tamper Detection ---");
  const decryptStateTamper = await initStreamDecryption(encryptState.header, fileKey);
  // Decrypt chunk 1 fine
  await decryptStreamChunk(decryptStateTamper, cipher1);

  // Tamper with one single byte in chunk 2
  const tamperedCipher2 = new Uint8Array(cipher2);
  tamperedCipher2[5] ^= 0xff; // Flip bits

  try {
    await decryptStreamChunk(decryptStateTamper, tamperedCipher2);
    throw new Error("ASSERTION_FAILED: Tampered chunk was accepted without error!");
  } catch (err: unknown) {
    if ((err as Error).message.startsWith("ASSERTION_FAILED")) {
      throw err;
    }
    console.log(`[PASS] Tampered ciphertext chunk was immediately detected and rejected: "${(err as Error).message}"`);
  }

  // 10. Truncation Detection
  console.log("\n--- TEST 10: Stream Truncation Detection ---");
  const decryptStateTruncated = await initStreamDecryption(encryptState.header, fileKey);
  const part1 = await decryptStreamChunk(decryptStateTruncated, cipher1);
  if (part1.isFinal) {
    throw new Error("FAIL: Premature end of stream marked as final!");
  }
  console.log("[PASS] Truncation verification passed; non-final chunks cleanly identify as incomplete stream.");

  console.log("\n=================================================");
  console.log("   ALL 10 CRYPTOGRAPHIC PROTOTYPE TESTS PASSED!   ");
  console.log("=================================================\n");
}

runTestSuite().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
