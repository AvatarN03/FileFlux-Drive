import { NextResponse } from "next/server";

import { UploadApiResponse } from "cloudinary";

import { db } from "@/db";
import { files } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { canUploadFile, getFileExtension, getFileNameWithoutExtension } from "@/lib/file";
import { getAuthUser, getThumbnailUrl } from "../../_services";

export async function POST(req: Request) {
  const user = await getAuthUser();

  try {
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

    await db.insert(files).values({
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Upload failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload file",
      },
      { status: 500 },
    );
  }
}
