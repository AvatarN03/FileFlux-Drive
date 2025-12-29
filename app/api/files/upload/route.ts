import { NextResponse } from "next/server";

import { UploadApiResponse } from "cloudinary";

import { db } from "@/db";
import { files } from "@/db/schema";
import cloudinary from "@/lib/cloudinary";
import { getAuthUser } from "../../_services";

export async function POST(req: Request) {
  const { id: userId } = await getAuthUser();
  if (!userId)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  // 3️⃣ Read file
  const formData = await req.formData();
  const file = formData.get("file");
  const folderIdRaw = formData.get("folderId");
  const folderId = folderIdRaw ? Number(folderIdRaw) : null;

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, error: "No file uploaded" },
      { status: 400 }
    );
  }

  const originalName = file.name;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 4️⃣ Upload to Cloudinary

  const uploadResult = await new Promise<UploadApiResponse>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `fileflux/${userId}`,
            resource_type: "raw",
            public_id: originalName,
            overwrite: true,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            if (!result) {
              return reject(new Error("Cloudinary upload failed: no result"));
            }

            resolve(result);
          }
        )
        .end(buffer);
    }
  );

  const [newFile] = await db
    .insert(files)
    .values({
      user_id: userId,
      file_name: originalName,
      file_url: uploadResult.secure_url,
      public_id: `fileflux/${userId}/${originalName}`,
      file_type: file.type,
      file_size: file.size,
      folderId: folderId ? Number(folderId) : null,
    })
    .returning();

  return NextResponse.json({ success: true, file: newFile });
}
