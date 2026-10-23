import { NextResponse } from "next/server";

import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { getAuthUser } from "../../_services";

export async function PATCH(req: Request) {
  try {
    const { id: userId } = await getAuthUser();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fileId, folderId } = await req.json();

    if (!fileId) {
      return NextResponse.json(
        { success: false, error: "File ID is required" },
        { status: 400 }
      );
    }

    if (folderId === undefined) {
      return NextResponse.json(
        { success: false, error: "Target folder ID required" },
        { status: 400 }
      );
    }

    if (folderId !== null) {
      const [targetFolder] = await db
        .select({ id: folders.id })
        .from(folders)
        .where(
          and(
            eq(folders.id, folderId),
            eq(folders.userId, userId),
            isNull(folders.deletedAt)
          )
        );

      if (!targetFolder) {
        return NextResponse.json(
          { success: false, error: "Destination folder not found" },
          { status: 404 }
        );
      }
    }

    const [updated] = await db
      .update(files)
      .set({ folderId: folderId ?? null })
      .where(
        and(
          eq(files.id, fileId),
          eq(files.userId, userId),
          isNull(files.deletedAt)
        )
      )
      .returning({ id: files.id });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "File moved successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to move file" },
      { status: 500 }
    );
  }
}
