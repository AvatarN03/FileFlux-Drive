import { NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { files, usersTable } from "@/db/schema";
import { getAuthUser, isAuthError } from "../../_services";
import { EncryptedEnvelope } from "@/lib/crypto/types";

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

    // Security check: Verify objectKey belongs to this user
    if (!objectKey.startsWith(`vaults/${user.id}/`)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized object namespace" },
        { status: 403 }
      );
    }

    const folderIdValue =
      typeof folderId === "string" && folderId.length > 0 ? folderId : null;

    const [newFile] = await db.transaction(async (tx) => {
      const [inserted] = await tx
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

      await tx
        .update(usersTable)
        .set({
          storageUsed: sql`${usersTable.storageUsed} + ${ciphertextFileSize}`,
        })
        .where(eq(usersTable.id, user.id));

      return [inserted];
    });

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
    console.error("Record encrypted file error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record encrypted file" },
      { status: 500 }
    );
  }
}
