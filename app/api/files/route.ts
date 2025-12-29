import { NextRequest, NextResponse } from "next/server";

import { and, eq } from "drizzle-orm";

import { deleteFromCloudinary, getAuthUser } from "../_services";

import { db } from "@/db";
import { files } from "@/db/schema";

export async function PATCH(req: NextRequest) {
  try {
    const { id: userId } = await getAuthUser();
    if (!userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    const { fileId, file_name } = await req.json();

    if (!fileId || !file_name?.trim()) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const updated = await db
      .update(files)
      .set({
        file_name,
      })
      .where(and(eq(files.id, fileId), eq(files.user_id, userId)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      file: updated[0],
    });
  } catch (error) {
    console.error("Rename error:", error);
    return NextResponse.json(
      { error: "Failed to rename file" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { fileId, folderId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 }
      );
    }

    const { id: userId } = await getAuthUser();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 1️⃣ Get file first (to access publicId)
    const file = await db.query.files.findFirst({
      where: and(
        eq(files.id, fileId),
        eq(files.user_id, userId),
        folderId ? eq(files.folderId, folderId) : undefined
      ),
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    if (!file.public_id) {
      return NextResponse.json(
        { error: "File has no public ID" },
        { status: 400 }
      );
    }

    // 2️⃣ Delete from Cloudinary
    await deleteFromCloudinary(file.public_id);

    // 3️⃣ Delete from DB
    await db.delete(files).where(eq(files.id, fileId));

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
