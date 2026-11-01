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

export const STREAM_CHUNK_SIZE = 1024 * 1024; // 1 MB chunks

export interface UploadEncryptedFileOptions {
  file: File;
  displayName: string;
  folderId?: string | null;
  vaultKey: Uint8Array;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/**
 * Notify the server to delete an unfinalized S3 object if an upload is aborted or fails.
 */
async function cleanupAbortedUpload(objectKey: string): Promise<void> {
  try {
    await fetch("/api/files/abort-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ objectKey }),
    });
  } catch (err) {
    console.warn("Failed to notify abort-upload cleanup:", err);
  }
}

/**
 * Upload ciphertext Blob directly to presigned URL with genuine network progress and abort support.
 * Operates on native Blob chunks to avoid duplicate monolithic memory allocations in the browser.
 */
function uploadCiphertextWithProgress(
  presignedUrl: string,
  ciphertext: Blob,
  onProgress?: (percent: number) => void,
  signal?: AbortSignal
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      return reject(new Error("Upload aborted"));
    }

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && e.total > 0) {
          // Scale network transfer smoothly between 50% and 90%
          const pct = 50 + Math.round((e.loaded / e.total) * 40);
          onProgress(Math.min(pct, 90));
        }
      };
    }

    const abortHandler = () => {
      xhr.abort();
      reject(new Error("Upload aborted"));
    };

    if (signal) {
      signal.addEventListener("abort", abortHandler, { once: true });
    }

    xhr.onload = () => {
      if (signal) {
        signal.removeEventListener("abort", abortHandler);
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(90);
        resolve();
      } else {
        reject(
          new Error(`Direct storage upload failed with status ${xhr.status}`)
        );
      }
    };

    xhr.onerror = () => {
      if (signal) {
        signal.removeEventListener("abort", abortHandler);
      }
      reject(new Error("Network error during direct storage upload"));
    };

    xhr.onabort = () => {
      if (signal) {
        signal.removeEventListener("abort", abortHandler);
      }
      reject(new Error("Upload aborted"));
    };

    xhr.send(ciphertext);
  });
}

/**
 * Encrypt a local file client-side and upload directly to Neon Object Storage via presigned URL.
 * Memory-optimized: Uses Blob slicing to load only 1 chunk into RAM at a time, eliminating duplicate monolithic buffers.
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

  let allocatedObjectKey: string | null = null;
  let isRecorded = false;

  try {
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
    allocatedObjectKey = objectKey;

    // 4. Encrypt file using XChaCha20-Poly1305 secretstream
    const encryptState = await initStreamEncryption(fileKey);
    const streamHeaderHex = sodium.to_hex(encryptState.header);

    // Memory optimization: Slice file into 1 MB chunks without buffering full file into RAM
    const CHUNK_SIZE = STREAM_CHUNK_SIZE;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE) || 1;
    const encryptedChunks: Uint8Array[] = [];

    for (let i = 0; i < totalChunks; i++) {
      if (signal?.aborted) {
        throw new Error("Upload aborted");
      }

      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBlob = file.slice(start, end);
      const chunkBuffer = await chunkBlob.arrayBuffer();
      const chunkBytes = new Uint8Array(chunkBuffer);
      const isFinal = i === totalChunks - 1;

      const cipherChunk = await encryptStreamChunk(encryptState, chunkBytes, isFinal);
      encryptedChunks.push(cipherChunk);

      if (onProgress) {
        // 0 - 50% progress allocated to client-side encryption
        onProgress(Math.round(((i + 1) / totalChunks) * 50));
      }
    }

    // Assemble ciphertext into a Blob for streaming upload (avoids a second duplicate full-file byte copy)
    const totalLength = encryptedChunks.reduce((acc, c) => acc + c.length, 0);
    const ciphertextBlob = new Blob(encryptedChunks as unknown as BlobPart[], {
      type: "application/octet-stream",
    });

    // 5. Upload raw ciphertext directly to Neon Object Storage via presigned PUT with network telemetry
    await uploadCiphertextWithProgress(
      presignedUrl,
      ciphertextBlob,
      onProgress,
      signal
    );

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

    isRecorded = true;
    if (onProgress) onProgress(100);

    return { fileId: recordData.fileId };
  } catch (error) {
    if (allocatedObjectKey && !isRecorded) {
      // Clean up orphaned ciphertext object from S3
      cleanupAbortedUpload(allocatedObjectKey);
    }
    throw error;
  }
}

export interface DownloadEncryptedFileOptions {
  fileId: string;
  vaultKey: Uint8Array;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

/**
 * Retrieve encrypted ciphertext from Neon Object Storage, authenticate, decrypt, and trigger download.
 * Memory & streaming optimized: Reads ciphertext packets directly via ReadableStream and decrypts chunk-by-chunk.
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

  // 3. Fetch ciphertext from Neon Object Storage using streaming ReadableStream
  const storageRes = await fetch(presignedUrl, { signal });
  if (!storageRes.ok) {
    throw new Error("Failed to fetch encrypted file from storage");
  }

  const streamHeaderBytes = sodium.from_hex(file.streamHeader);
  const decryptState = await initStreamDecryption(streamHeaderBytes, fileKey);

  const CIPHER_CHUNK_SIZE =
    STREAM_CHUNK_SIZE + sodium.crypto_secretstream_xchacha20poly1305_ABYTES;
  const decryptedChunks: Uint8Array[] = [];
  let isFinalSeen = false;

  if (storageRes.body && typeof storageRes.body.getReader === "function") {
    // Streaming network read: decrypts chunks incrementally as packets arrive
    const contentLengthHeader = storageRes.headers.get("content-length");
    const totalContentLength = contentLengthHeader
      ? parseInt(contentLengthHeader, 10)
      : 0;

    const reader = storageRes.body.getReader();
    let buffer = new Uint8Array(0);
    let bytesReceived = 0;

    while (true) {
      if (signal?.aborted) {
        reader.cancel();
        throw new Error("Download aborted");
      }

      const { done, value } = await reader.read();

      if (value) {
        bytesReceived += value.length;
        const newBuffer = new Uint8Array(buffer.length + value.length);
        newBuffer.set(buffer, 0);
        newBuffer.set(value, buffer.length);
        buffer = newBuffer;

        if (onProgress && totalContentLength > 0) {
          const pct = 20 + Math.round((bytesReceived / totalContentLength) * 70);
          onProgress(Math.min(pct, 90));
        }
      }

      // Process all full CIPHER_CHUNK_SIZE chunks currently in buffer
      while (buffer.length >= CIPHER_CHUNK_SIZE && !isFinalSeen) {
        const chunkToDecrypt = buffer.subarray(0, CIPHER_CHUNK_SIZE);
        buffer = buffer.subarray(CIPHER_CHUNK_SIZE);

        const res = await decryptStreamChunk(decryptState, chunkToDecrypt);
        decryptedChunks.push(res.plaintext);
        if (res.isFinal) {
          isFinalSeen = true;
          break;
        }
      }

      if (done) {
        // Process trailing final chunk
        if (buffer.length > 0 && !isFinalSeen) {
          const res = await decryptStreamChunk(decryptState, buffer);
          decryptedChunks.push(res.plaintext);
          if (res.isFinal) {
            isFinalSeen = true;
          }
          buffer = new Uint8Array(0);
        }
        break;
      }
    }
  } else {
    // ArrayBuffer fallback for environments where ReadableStream is unavailable
    const ciphertextBuffer = await storageRes.arrayBuffer();
    const ciphertextBytes = new Uint8Array(ciphertextBuffer);

    let readOffset = 0;
    while (readOffset < ciphertextBytes.length) {
      if (signal?.aborted) {
        throw new Error("Download aborted");
      }

      const end = Math.min(readOffset + CIPHER_CHUNK_SIZE, ciphertextBytes.length);
      const cipherChunk = ciphertextBytes.subarray(readOffset, end);
      readOffset = end;

      const res = await decryptStreamChunk(decryptState, cipherChunk);
      decryptedChunks.push(res.plaintext);

      if (onProgress) {
        onProgress(20 + Math.round((readOffset / ciphertextBytes.length) * 70));
      }

      if (res.isFinal) {
        isFinalSeen = true;
        break;
      }
    }
  }

  if (!isFinalSeen) {
    throw new Error("Stream integrity error: file was truncated or incomplete.");
  }

  if (onProgress) onProgress(95);

  // 5. Trigger browser download of authenticated plaintext directly from decrypted chunk parts
  // (Avoids allocating a duplicate monolithic Uint8Array in memory)
  const plaintextBlob = new Blob(decryptedChunks as unknown as BlobPart[], {
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
