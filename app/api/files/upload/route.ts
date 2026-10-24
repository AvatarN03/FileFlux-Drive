import { NextResponse } from "next/server";

import { UploadApiResponse } from "cloudinary";

import { db } from "@/db";
import { files, usersTable } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import {
  getFileExtension,
  getFileNameWithoutExtension,
} from "@/lib/file/operations";
import { getAuthUser, getThumbnailUrl, isAuthError } from "../../_services";
import { eq, sql } from "drizzle-orm";
import { canUploadFile } from "@/lib/validations/file";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email before uploading files.",
        },
        { status: 403 },
      );
    }

    // 3️⃣ Read file
    const formData = await req.formData();

    const file = formData.get("fileUpload");
    const folderId = formData.get("folderId");

    console.log("Received file:", file);

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 },
      );
    }
    const folderIdValue =
      typeof folderId === "string" && folderId.length > 0 ? folderId : null;

    // Storage check
    if (canUploadFile(file, user) === false) {
      return NextResponse.json(
        { success: false, error: "Storage limit exceeded" },
        { status: 400 },
      );
    }

    const originalName = file.name;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const displayName = getFileNameWithoutExtension(originalName);
    const extension = getFileExtension(originalName);

    // 4️⃣ Upload to Cloudinary

    const uploadResult = await new Promise<UploadApiResponse>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: `fileflux/${user.id}`,
              resource_type: "auto",
              public_id: crypto.randomUUID(),
              overwrite: false,
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }

              if (!result) {
                return reject(new Error("Cloudinary upload failed: no result"));
              }

              resolve(result);
            },
          )
          .end(buffer);
      },
    );

    const thumbnailUrl = getThumbnailUrl(uploadResult);

    await db.transaction(async (tx) => {
      await tx.insert(files).values({
        userId: user.id,
        name: displayName,
        originalName,
        extension,
        mimeType: file.type,
        size: file.size,
        url: uploadResult.secure_url,
        thumbnailUrl,
        publicId: uploadResult.public_id,
        folderId: folderIdValue,
      });

      await tx
        .update(usersTable)
        .set({
          storageUsed: sql`${usersTable.storageUsed} + ${file.size}`,
        })
        .where(eq(usersTable.id, user.id));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    console.error("Upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
      },
      { status: 500 },
    );
  }
}
