import { NextResponse } from "next/server";
import { and, desc, eq, ilike, isNull, not, or } from "drizzle-orm";

import { isAuthError, verifyAuth } from "../_services";
import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { fileListSelect, folderPreviewSelect } from "@/db/selection";

const CATEGORY_EXTENSIONS = {
  image: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "heic"],
  video: ["mp4", "mov", "avi", "mkv", "webm"],
  spreadsheet: ["xls", "xlsx", "csv"],
  document: ["doc", "docx", "pdf", "txt"],
} as const;

type Category = keyof typeof CATEGORY_EXTENSIONS;

const isValidCategory = (value: string): value is Category =>
  value in CATEGORY_EXTENSIONS;

// Asserts non-null here, once, since every extensions[] we pass is
// guaranteed non-empty (hardcoded above / derived via flat()).
const extensionCondition = (extensions: readonly string[]) =>
  or(...extensions.map((ext) => eq(files.extension, ext)))!;

export async function GET(req: Request) {
  try {
    const { id } = await verifyAuth();

    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const conditions = [eq(files.userId, id), isNull(files.deletedAt)];

    if (folderId) {
      conditions.push(eq(files.folderId, folderId));
    }

    if (search) {
      conditions.push(ilike(files.name, `%${search}%`));
    }

    if (category === "other") {
      const knownExtensions = Object.values(CATEGORY_EXTENSIONS).flat();
      conditions.push(
        not(or(...knownExtensions.map((ext) => eq(files.extension, ext)))!),
      );
    } else if (category && isValidCategory(category)) {
      conditions.push(extensionCondition(CATEGORY_EXTENSIONS[category]));
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
    console.error("File fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch files" },
      { status: 500 },
    );
  }
}
