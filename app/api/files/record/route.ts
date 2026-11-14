import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { files, usersTable } from "@/db/schema";
import { getAuthUser, isAuthError } from "../../_services";
import { EncryptedEnvelope } from "@/lib/crypto/types";
import { isOwnedVaultObjectKey } from "@/lib/storage/authorization";
import { logServerError } from "@/lib/security/safeLogging";
import { getUploadSizeError } from "@/lib/storage/uploadPolicy";

export interface RecordEncryptedFilePayload {
  objectKey: string;
  folderId?: string | null;
  streamHeader: string;
  encryptedKey: EncryptedEnvelope;
  encryptedMetadata: EncryptedEnvelope;
  ciphertextFileSize: number;
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    const body: RecordEncryptedFilePayload = await req.json();
    const {
      objectKey,
      folderId,
      streamHeader,
      encryptedKey,
      encryptedMetadata,
      ciphertextFileSize,
    } = body;

    if (
      !objectKey ||
      !streamHeader ||
      !encryptedKey?.nonce ||
      !encryptedKey?.ciphertext ||
      !encryptedMetadata?.nonce ||
      !encryptedMetadata?.ciphertext ||
      typeof ciphertextFileSize !== "number"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid encrypted file payload" },
        { status: 400 }
      );
    }

    const sizeError = getUploadSizeError(
      ciphertextFileSize,
      user.storageUsed,
      user.storageLimit,
    );

    if (sizeError === "invalid") {
      return NextResponse.json(
        { success: false, error: "Invalid encrypted file size" },
        { status: 400 },
      );
    }

    if (sizeError === "too_large") {
      return NextResponse.json(
        { success: false, error: "Encrypted file exceeds the maximum size" },
        { status: 413 },
      );
    }

    if (sizeError === "quota_exceeded") {
      return NextResponse.json(
        { success: false, error: "Storage limit exceeded" },
        { status: 413 },
      );
    }

    // Security check: Verify objectKey belongs to this user
    if (!isOwnedVaultObjectKey(objectKey, user.id)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized object namespace" },
        { status: 403 }
      );
    }

    const folderIdValue =
      typeof folderId === "string" && folderId.length > 0 ? folderId : null;

    // Insert file metadata (neon-http driver does not support db.transaction())
    const [newFile] = await db
      .insert(files)
      .values({
        userId: user.id,
        objectKey,
        folderId: folderIdValue,
        streamHeader,
        encryptedKeyNonce: encryptedKey.nonce,
        encryptedKeyCiphertext: encryptedKey.ciphertext,
        encryptedMetadataNonce: encryptedMetadata.nonce,
        encryptedMetadataCiphertext: encryptedMetadata.ciphertext,
        isEncrypted: true,
        // Legacy-compatible non-sensitive placeholders
        name: "[Encrypted File]",
        originalName: "[Encrypted]",
        extension: "",
        mimeType: "application/octet-stream",
        size: ciphertextFileSize,
        url: "",
      })
      .returning({ id: files.id });

    // Update storage used
    await db
      .update(usersTable)
      .set({
        storageUsed: sql`${usersTable.storageUsed} + ${ciphertextFileSize}`,
      })
      .where(eq(usersTable.id, user.id));

    return NextResponse.json({
      success: true,
      fileId: newFile.id,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    logServerError("Record encrypted file", error);
    return NextResponse.json(
      { success: false, error: "Failed to record encrypted file" },
      { status: 500 }
    );
  }
}
