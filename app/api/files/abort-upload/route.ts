import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { getAuthUser, isAuthError } from "../../_services";
import { deleteStoredObject } from "@/lib/storage/s3";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    const body = await req.json();
    const { objectKey } = body as { objectKey?: string };

    if (!objectKey || typeof objectKey !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid objectKey" },
        { status: 400 }
      );
    }

    // Security check: Must belong strictly to the authenticated user's vault namespace
    if (!objectKey.startsWith(`vaults/${user.id}/`)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized object namespace" },
        { status: 403 }
      );
    }

    // Safety assertion: Ensure this object is NOT an already finalized active file
    const [existingFile] = await db
      .select({ id: files.id })
      .from(files)
      .where(and(eq(files.userId, user.id), eq(files.objectKey, objectKey)))
      .limit(1);

    if (existingFile) {
      return NextResponse.json(
        { success: false, error: "Cannot abort a finalized file record" },
        { status: 400 }
      );
    }

    // Purge orphaned/partial ciphertext from private Neon S3 bucket
    try {
      await deleteStoredObject(objectKey);
    } catch (storageError) {
      // If object was never created in S3 or was empty, ignore 404/NoSuchKey
      console.warn("Storage cleanup note for aborted upload:", storageError);
    }

    return NextResponse.json({
      success: true,
      message: "Unfinalized upload aborted and cleaned up successfully",
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Abort upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to abort upload" },
      { status: 500 }
    );
  }
}

