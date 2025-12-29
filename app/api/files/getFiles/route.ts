import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";

import { buildFolderPath, getAuthUser } from "../../_services";
import { db } from "@/db";
import { files } from "@/db/schema";


export async function GET(req: Request) {
  try {
    /* 1️⃣ Auth */
    const { id: userId } = await getAuthUser();
    if (!userId)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );

    /* 2️⃣ Params */
    const { searchParams } = new URL(req.url);
    const folderIdParam = searchParams.get("folderId");
    const limitParam = searchParams.get("limit");

    const folderId = folderIdParam ? Number(folderIdParam) : null;
    const limit = limitParam ? Number(limitParam) : undefined;

    const fileWhere = folderId
      ? and(eq(files.user_id, userId), eq(files.folderId, folderId))
      : eq(files.user_id, userId);

    const fileQuery = db.select().from(files).where(fileWhere);
    const filesData = limit ? await fileQuery.limit(limit) : await fileQuery;

    /* 5️⃣ Build Folder Path (cached) */
    const folderPathCache = new Map<number, { id: number; name: string }[]>();

    const filesWithPath = await Promise.all(
      filesData.map(async (file) => {
        if (!file.folderId) {
          return { ...file, path: [] };
        }

        if (!folderPathCache.has(file.folderId)) {
          folderPathCache.set(
            file.folderId,
            await buildFolderPath(file.folderId, userId)
          );
        }

        return {
          ...file,
          path: folderPathCache.get(file.folderId)!,
        };
      })
    );

    /* 6️⃣ Response */
    return NextResponse.json({
      success: true,
      files: filesWithPath,
    });
  } catch (error) {
    console.error("File fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}


