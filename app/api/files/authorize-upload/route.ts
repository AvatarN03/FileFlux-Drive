import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { getAuthUser, isAuthError } from "../../_services";
import { generateUploadPresignedUrl } from "@/lib/storage/s3";
import { logServerError } from "@/lib/security/safeLogging";
import {
  getUploadSizeError,
  MAX_ENCRYPTED_FILE_BYTES,
} from "@/lib/storage/uploadPolicy";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email before uploading files.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { estimatedSize } = body as { estimatedSize?: number };
    const sizeError = getUploadSizeError(
      estimatedSize ?? Number.NaN,
      user.storageUsed,
      user.storageLimit,
    );

    if (sizeError === "invalid") {
      return NextResponse.json(
        { success: false, error: "A valid upload size is required" },
        { status: 400 },
      );
    }

    if (sizeError === "too_large") {
      return NextResponse.json(
        {
          success: false,
          error: `Encrypted files cannot exceed ${MAX_ENCRYPTED_FILE_BYTES} bytes`,
        },
        { status: 413 },
      );
    }

    if (sizeError === "quota_exceeded") {
      return NextResponse.json(
        { success: false, error: "Storage limit exceeded" },
        { status: 413 },
      );
    }

    // Generate opaque object key: vaults/<user-id>/<uuid>.enc
    const fileId = crypto.randomUUID();
    const objectKey = `vaults/${user.id}/${fileId}.enc`;

    const { presignedUrl } = await generateUploadPresignedUrl({
      objectKey,
      expiresIn: 900, // 15 minutes
    });

    return NextResponse.json({
      success: true,
      objectKey,
      presignedUrl,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    logServerError("Authorize upload", error);
    return NextResponse.json(
      { success: false, error: "Failed to authorize upload" },
      { status: 500 }
    );
  }
}
