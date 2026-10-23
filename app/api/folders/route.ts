import { NextResponse } from "next/server";

import { and, count, eq, isNull } from "drizzle-orm";

import { verifyAuth } from "../_services";

import { db } from "@/db";
import { files, folders } from "@/db/schema";

// CREATE FOLDER
export async function POST(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const { name, parentId } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Folder name is required" },
        { status: 400 },
      );
    }

    const [folder] = await db
      .insert(folders)
      .values({
        name,
        parentId: parentId ?? null,
        userId,
      })
      .returning();

    return NextResponse.json({ success: true, folder });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }
}

// GET FOLDERS
export async function GET(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("folderId");

    const whereClause = parentId
      ? and(
          eq(folders.userId, userId),
          eq(folders.parentId, parentId),
          isNull(folders.deletedAt),
        )
      : and(
          eq(folders.userId, userId),
          isNull(folders.parentId),
          isNull(folders.deletedAt),
        );

    const result = await db
      .select({
        id: folders.id,
        name: folders.name,
        isFavorite: folders.isFavorite,
      })
      .from(folders)
      .leftJoin(
        files,
        and(eq(files.folderId, folders.id), isNull(files.deletedAt)),
      )
      .where(whereClause)
      .groupBy(folders.id);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

// DELETE FOLDER
export async function DELETE(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const { folderId }: { folderId: string } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { success: false, error: "Folder ID is required" },
        { status: 400 },
      );
    }

    const [folder] = await db
      .select({ id: folders.id })
      .from(folders)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.userId, userId),
          isNull(folders.deletedAt),
        ),
      );

    if (!folder) {
      return NextResponse.json(
        { success: false, error: "Folder not found" },
        { status: 404 },
      );
    }

    const [{ fileCount }] = await db
      .select({
        fileCount: count(),
      })
      .from(files)
      .where(and(eq(files.folderId, folderId), isNull(files.deletedAt)));

    if (fileCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Folder contains files. Remove or move them before deleting the folder.",
        },
        { status: 400 },
      );
    }

    // Check for child folders
    const [{ childCount }] = await db
      .select({
        childCount: count(),
      })
      .from(folders)
      .where(and(eq(folders.parentId, folderId), isNull(folders.deletedAt)));

    if (childCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Folder contains subfolders. Delete them first.",
        },
        { status: 400 },
      );
    }

    await db
      .delete(folders)
      .where(and(eq(folders.id, folderId), eq(folders.userId, userId)));

    return NextResponse.json({
      success: true,
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const {
      folderId,
      name,
      parentId,
    }: {
      folderId: string;
      name?: string;
      parentId?: string | null;
    } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { success: false, error: "Folder ID is required" },
        { status: 400 },
      );
    }

    if (name === undefined && parentId === undefined) {
      return NextResponse.json(
        { success: false, error: "Nothing to update" },
        { status: 400 },
      );
    }

    const [folder] = await db
      .select()
      .from(folders)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.userId, userId),
          isNull(folders.deletedAt),
        ),
      );

    if (!folder) {
      return NextResponse.json(
        { success: false, error: "Folder not found" },
        { status: 404 },
      );
    }

    await db
      .update(folders)
      .set({
        ...(name !== undefined && { name: name.trim() }),
        ...(parentId !== undefined && { parentId }),
      })
      .where(eq(folders.id, folderId));

    const [updatedFolder] = await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId));

    return NextResponse.json({
      success: true,
      folder: updatedFolder,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
