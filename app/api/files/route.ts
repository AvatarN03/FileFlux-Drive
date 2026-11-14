import { NextResponse } from "next/server";
import { and, desc, eq, isNull } from "drizzle-orm";

import { isAuthError, verifyAuth } from "../_services";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { fileListSelect, folderPreviewSelect } from "@/db/selection";
import { logServerError } from "@/lib/security/safeLogging";

export async function GET(req: Request) {
  try {
    const { id } = await verifyAuth();

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");

    const conditions = [eq(files.userId, id), isNull(files.deletedAt)];

    if (folderId) {
      conditions.push(eq(files.folderId, folderId));
    }

    const filesData = await db
      .select({
        ...fileListSelect,
        folder: folderPreviewSelect,
      })
      .from(files)
      .leftJoin(folders, eq(files.folderId, folders.id))
      .where(and(...conditions))
      .orderBy(desc(files.createdAt));

    return NextResponse.json({
      success: true,
      files: filesData,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    logServerError("File fetch", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
