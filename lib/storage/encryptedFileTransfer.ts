import {
  generateFileKey,
  wrapKey,
  unwrapKey,
  encryptMetadata,
  decryptMetadata,
  initStreamEncryption,
  encryptStreamChunk,
  initStreamDecryption,
  decryptStreamChunk,
  getSodium,
  EncryptedFileMetadata,
  EncryptedEnvelope,
} from "@/lib/crypto";

export interface UploadEncryptedFileOptions {
  file: File;
  displayName: string;
  folderId?: string | null;
  vaultKey: Uint8Array;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/**
 * Encrypt a local file client-side and upload directly to Neon Object Storage via presigned URL.
 */
export async function uploadEncryptedFile({
  file,
  displayName,
  folderId,
  vaultKey,
  onProgress,
  signal,
}: UploadEncryptedFileOptions): Promise<{ fileId: string }> {
  const sodium = await getSodium();

  // 1. Generate individual random 256-bit file key & wrap under vault key
  const fileKey = await generateFileKey();
  const encryptedKey = await wrapKey(fileKey, vaultKey);

  // 2. Extract and encrypt sensitive metadata
  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || ""
    : "";

  const metadata: EncryptedFileMetadata = {
    name: displayName,
    originalName: file.name,
    extension,
    mimeType: file.type || "application/octet-stream",
  };
  const encryptedMetadata = await encryptMetadata(metadata, vaultKey);

  // 3. Request presigned upload URL from Next.js server
  const authRes = await fetch("/api/files/authorize-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estimatedSize: file.size + 1024 }),
    signal,
  });

  const authData = await authRes.json();
  if (!authRes.ok || !authData.success) {
    throw new Error(authData.error || "Failed to authorize file upload");
  }

  const { objectKey, presignedUrl } = authData as {
    objectKey: string;
    presignedUrl: string;
  };

  // 4. Encrypt file using XChaCha20-Poly1305 secretstream
  const encryptState = await initStreamEncryption(fileKey);
  const streamHeaderHex = sodium.to_hex(encryptState.header);

  // Read file as ArrayBuffer and encrypt in chunks
  const fileBuffer = await file.arrayBuffer();
  const fileBytes = new Uint8Array(fileBuffer);

  const CHUNK_SIZE = 1024 * 1024; // 1 MB chunks
  const totalChunks = Math.ceil(fileBytes.length / CHUNK_SIZE) || 1;
  const encryptedChunks: Uint8Array[] = [];

  for (let i = 0; i < totalChunks; i++) {
    if (signal?.aborted) {
      throw new Error("Upload aborted");
    }

    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, fileBytes.length);
    const chunk = fileBytes.subarray(start, end);
    const isFinal = i === totalChunks - 1;

    const cipherChunk = await encryptStreamChunk(encryptState, chunk, isFinal);
    encryptedChunks.push(cipherChunk);

    if (onProgress) {
      // 0 - 50% progress allocated to client encryption
      onProgress(Math.round(((i + 1) / totalChunks) * 50));
    }
  }

  // Combine encrypted chunks into single binary blob
  const totalLength = encryptedChunks.reduce((acc, c) => acc + c.length, 0);
  const combinedCiphertext = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of encryptedChunks) {
    combinedCiphertext.set(chunk, offset);
    offset += chunk.length;
  }

  // 5. Upload raw ciphertext directly to Neon Object Storage via presigned PUT
  const uploadRes = await fetch(presignedUrl, {
    method: "PUT",
    body: combinedCiphertext,
    headers: {
      "Content-Type": "application/octet-stream",
    },
    signal,
  });

  if (!uploadRes.ok) {
    throw new Error(`Direct storage upload failed with status ${uploadRes.status}`);
  }

  if (onProgress) onProgress(90);

  // 6. Record encrypted metadata and opaque reference in PostgreSQL
  const recordRes = await fetch("/api/files/record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      objectKey,
      folderId,
      streamHeader: streamHeaderHex,
      encryptedKey,
      encryptedMetadata,
      ciphertextFileSize: totalLength,
    }),
    signal,
  });

  const recordData = await recordRes.json();
  if (!recordRes.ok || !recordData.success) {
    throw new Error(recordData.error || "Failed to record encrypted file metadata");
  }

  if (onProgress) onProgress(100);

  return { fileId: recordData.fileId };
}

export interface DownloadEncryptedFileOptions {
  fileId: string;
  vaultKey: Uint8Array;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/**
 * Retrieve encrypted ciphertext from Neon Object Storage, authenticate, decrypt, and trigger download.
 */
export async function downloadAndDecryptFile({
  fileId,
  vaultKey,
  onProgress,
  signal,
}: DownloadEncryptedFileOptions): Promise<{ filename: string }> {
  const sodium = await getSodium();

  // 1. Authorize download and retrieve presigned GET URL & encrypted keys
  const authRes = await fetch(`/api/files/authorize-download/${fileId}`, {
    signal,
  });

  const authData = await authRes.json();
  if (!authRes.ok || !authData.success) {
    throw new Error(authData.error || "Failed to authorize file download");
  }

  const { presignedUrl, file } = authData as {
    presignedUrl: string;
    file: {
      streamHeader: string;
      encryptedKey: EncryptedEnvelope;
      encryptedMetadata: EncryptedEnvelope;
    };
  };

  // 2. Unwrap file key and decrypt metadata in memory
  const fileKey = await unwrapKey(file.encryptedKey, vaultKey);
  const metadata = await decryptMetadata(file.encryptedMetadata, vaultKey);
  const fullFilename = metadata.extension
    ? `${metadata.name}.${metadata.extension}`
    : metadata.name;

  if (onProgress) onProgress(20);

  // 3. Fetch ciphertext from Neon Object Storage
  const storageRes = await fetch(presignedUrl, { signal });
  if (!storageRes.ok) {
    throw new Error("Failed to fetch encrypted file from storage");
  }

  const ciphertextBuffer = await storageRes.arrayBuffer();
  const ciphertextBytes = new Uint8Array(ciphertextBuffer);

  if (onProgress) onProgress(60);

  // 4. Decrypt secretstream
  const streamHeaderBytes = sodium.from_hex(file.streamHeader);
  const decryptState = await initStreamDecryption(streamHeaderBytes, fileKey);

  // For single chunk or stream, pull decrypted bytes
  const decryptedResult = await decryptStreamChunk(decryptState, ciphertextBytes);

  if (!decryptedResult.isFinal) {
    throw new Error("Stream integrity error: file was truncated or incomplete.");
  }

  if (onProgress) onProgress(90);

  // 5. Trigger browser download of authenticated plaintext
  const plaintextBlob = new Blob([decryptedResult.plaintext as unknown as BlobPart], {
    type: metadata.mimeType,
  });
  const objectUrl = URL.createObjectURL(plaintextBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = objectUrl;
  downloadLink.download = fullFilename;
  downloadLink.click();
  URL.revokeObjectURL(objectUrl);

  if (onProgress) onProgress(100);

  return { filename: fullFilename };
}
