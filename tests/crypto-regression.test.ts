import assert from "node:assert/strict";
import test from "node:test";

import { downloadAndDecryptFile } from "../lib/storage/encryptedFileTransfer";
import {
  createVault,
  decryptFolderMetadata,
  decryptMetadata,
  decryptStreamChunk,
  encryptFolderMetadata,
  encryptMetadata,
  encryptStreamChunk,
  generateFileKey,
  generateRecoveryKey,
  generateVaultKey,
  getSodium,
  initStreamDecryption,
  initStreamEncryption,
  unlockVaultWithPassphrase,
  unlockVaultWithRecoveryKey,
  unwrapKey,
  wrapKey,
} from "../lib/crypto";
import { EncryptedFileMetadata, EncryptedFolderMetadata } from "../lib/crypto/types";

test("vault passphrase and recovery unlock the same key; incorrect credentials fail", async () => {
  const { vaultKey, enrollment } = await createVault("Correct horse battery staple");

  const passphraseKey = await unlockVaultWithPassphrase(
    "Correct horse battery staple",
    enrollment.kdfParams,
    enrollment.passphraseEnvelope,
  );
  const recoveryKey = await unlockVaultWithRecoveryKey(
    enrollment.recoveryKeyDisplay,
    enrollment.recoveryEnvelope,
  );

  assert.deepEqual(passphraseKey, vaultKey);
  assert.deepEqual(recoveryKey, vaultKey);

  await assert.rejects(
    unlockVaultWithPassphrase(
      "incorrect passphrase",
      enrollment.kdfParams,
      enrollment.passphraseEnvelope,
    ),
    /Failed to unwrap key/,
  );

  const wrongRecoveryKey = (await generateRecoveryKey()).recoveryKeyDisplay;
  await assert.rejects(
    unlockVaultWithRecoveryKey(wrongRecoveryKey, enrollment.recoveryEnvelope),
    /Failed to unwrap key/,
  );
});

test("encrypted file and folder metadata round-trip and reject wrong keys or tampering", async () => {
  const sodium = await getSodium();
  const vaultKey = await generateVaultKey();
  const wrongKey = await generateVaultKey();
  const fileMetadata: EncryptedFileMetadata = {
    name: "quarterly-report",
    originalName: "quarterly-report.pdf",
    extension: "pdf",
    mimeType: "application/pdf",
  };
  const fileEnvelope = await encryptMetadata(fileMetadata, vaultKey);

  assert.deepEqual(await decryptMetadata(fileEnvelope, vaultKey), fileMetadata);
  await assert.rejects(decryptMetadata(fileEnvelope, wrongKey), /Failed to decrypt metadata/);

  const alteredCiphertext = sodium.from_base64(fileEnvelope.ciphertext);
  alteredCiphertext[0] ^= 1;
  await assert.rejects(
    decryptMetadata(
      { ...fileEnvelope, ciphertext: sodium.to_base64(alteredCiphertext) },
      vaultKey,
    ),
    /Failed to decrypt metadata/,
  );

  const folderMetadata: EncryptedFolderMetadata = { name: "tax-records" };
  const folderEnvelope = await encryptFolderMetadata(folderMetadata, vaultKey);
  assert.deepEqual(await decryptFolderMetadata(folderEnvelope, vaultKey), folderMetadata);

  const malformedFolderEnvelope = await encryptFolderMetadata(
    { name: 42 } as unknown as EncryptedFolderMetadata,
    vaultKey,
  );
  await assert.rejects(
    decryptFolderMetadata(malformedFolderEnvelope, vaultKey),
    /invalid metadata format/,
  );
});

test("wrapped file keys round-trip and reject an incorrect wrapping key", async () => {
  const sodium = await getSodium();
  const fileKey = await generateFileKey();
  const vaultKey = await generateVaultKey();
  const wrongKey = await generateVaultKey();
  const envelope = await wrapKey(fileKey, vaultKey);

  assert.deepEqual(await unwrapKey(envelope, vaultKey), fileKey);
  await assert.rejects(unwrapKey(envelope, wrongKey), /Failed to unwrap key/);

  const alteredCiphertext = sodium.from_base64(envelope.ciphertext);
  alteredCiphertext[0] ^= 1;
  await assert.rejects(
    unwrapKey({ ...envelope, ciphertext: sodium.to_base64(alteredCiphertext) }, vaultKey),
    /Failed to unwrap key/,
  );
});

test("secretstream decrypts ordered chunks and identifies the final chunk", async () => {
  const fileKey = await generateFileKey();
  const encryptState = await initStreamEncryption(fileKey);
  const plaintextChunks = [
    new TextEncoder().encode("first encrypted chunk "),
    new TextEncoder().encode("and the final chunk"),
  ];
  const encryptedChunks: Uint8Array[] = [];

  for (const [index, chunk] of plaintextChunks.entries()) {
    encryptedChunks.push(
      await encryptStreamChunk(encryptState, chunk, index === plaintextChunks.length - 1),
    );
  }

  const decryptState = await initStreamDecryption(encryptState.header, fileKey);
  const decryptedChunks = [];
  for (const chunk of encryptedChunks) {
    decryptedChunks.push(await decryptStreamChunk(decryptState, chunk));
  }

  assert.equal(decryptedChunks[0].isFinal, false);
  assert.equal(decryptedChunks[1].isFinal, true);
  assert.deepEqual(
    Buffer.concat(decryptedChunks.map(({ plaintext }) => Buffer.from(plaintext))),
    Buffer.concat(plaintextChunks.map((chunk) => Buffer.from(chunk))),
  );
});

test("secretstream rejects a modified ciphertext chunk", async () => {
  const fileKey = await generateFileKey();
  const encryptState = await initStreamEncryption(fileKey);
  const ciphertext = await encryptStreamChunk(
    encryptState,
    new TextEncoder().encode("authenticated payload"),
    true,
  );
  const alteredCiphertext = new Uint8Array(ciphertext);
  alteredCiphertext[0] ^= 1;

  const decryptState = await initStreamDecryption(encryptState.header, fileKey);
  await assert.rejects(
    decryptStreamChunk(decryptState, alteredCiphertext),
    /authentication failed/,
  );
});

test("encrypted download rejects a stream that ends without a final chunk", async () => {
  const sodium = await getSodium();
  const vaultKey = await generateVaultKey();
  const fileKey = await generateFileKey();
  const encryptedKey = await wrapKey(fileKey, vaultKey);
  const encryptedMetadata = await encryptMetadata(
    {
      name: "truncated",
      extension: "txt",
      mimeType: "text/plain",
    },
    vaultKey,
  );
  const encryptState = await initStreamEncryption(fileKey);
  const nonFinalChunk = await encryptStreamChunk(
    encryptState,
    new TextEncoder().encode("incomplete file"),
    false,
  );

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    if (String(input).startsWith("/api/files/authorize-download/")) {
      return new Response(
        JSON.stringify({
          success: true,
          presignedUrl: "https://storage.example.test/ciphertext",
          file: {
            streamHeader: sodium.to_hex(encryptState.header),
            encryptedKey,
            encryptedMetadata,
          },
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    }

    if (String(input) === "https://storage.example.test/ciphertext") {
      return new Response(Buffer.from(nonFinalChunk));
    }

    return new Response(null, { status: 404 });
  }) as typeof fetch;

  try {
    await assert.rejects(
      downloadAndDecryptFile({ fileId: "test-file", vaultKey }),
      /file was truncated or incomplete/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
