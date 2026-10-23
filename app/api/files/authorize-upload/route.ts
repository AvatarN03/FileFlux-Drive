import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { getAuthUser, isAuthError } from "../../_services";
import { generateUploadPresignedUrl } from "@/lib/storage/s3";

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

    // Check storage limits if size provided
    if (estimatedSize && typeof estimatedSize === "number") {
      if (user.storageUsed + estimatedSize > user.storageLimit) {
        return NextResponse.json(
          { success: false, error: "Storage limit exceeded" },
          { status: 400 }
        );
      }
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
    console.error("Authorize upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authorize upload" },
      { status: 500 }
    );
  }
}
