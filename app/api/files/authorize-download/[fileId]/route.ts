import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { getAuthUser, isAuthError } from "../../../_services";
import { generateDownloadPresignedUrl } from "@/lib/storage/s3";

interface RouteParams {
  params: Promise<{
    fileId: string;
  }>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const user = await getAuthUser();
    const { fileId } = await params;

    if (!fileId || !UUID_REGEX.test(fileId)) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    const [file] = await db
      .select({
        id: files.id,
        objectKey: files.objectKey,
        streamHeader: files.streamHeader,
        encryptedKeyNonce: files.encryptedKeyNonce,
        encryptedKeyCiphertext: files.encryptedKeyCiphertext,
        encryptedMetadataNonce: files.encryptedMetadataNonce,
        encryptedMetadataCiphertext: files.encryptedMetadataCiphertext,
        isEncrypted: files.isEncrypted,
        size: files.size,
      })
      .from(files)
      .where(
        and(
          eq(files.id, fileId),
          eq(files.userId, user.id),
          isNull(files.deletedAt)
        )
      );

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    if (!file.isEncrypted || !file.objectKey) {
      return NextResponse.json(
        { success: false, error: "File is not stored in encrypted object storage" },
        { status: 400 }
      );
    }

    const presignedUrl = await generateDownloadPresignedUrl({
      objectKey: file.objectKey,
      expiresIn: 900, // 15 minutes
    });

    return NextResponse.json({
      success: true,
      presignedUrl,
      file: {
        id: file.id,
        size: file.size,
        streamHeader: file.streamHeader,
        encryptedKey: {
          nonce: file.encryptedKeyNonce,
          ciphertext: file.encryptedKeyCiphertext,
        },
        encryptedMetadata: {
          nonce: file.encryptedMetadataNonce,
          ciphertext: file.encryptedMetadataCiphertext,
        },
      },
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Authorize download error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authorize download" },
      { status: 500 }
    );
  }
}
