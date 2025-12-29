import { NextResponse } from "next/server";

import { and, eq, isNull, sql } from "drizzle-orm";

import { getAuthUser } from "../_services";

import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { FolderResponse } from "@/types/file";

// CREATE FOLDER
export async function POST(req: Request) {
  try {
    const { id: userId } = await getAuthUser();
    if(!userId) return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

    const { name, parentId }: { name: string; parentId?: number | null } =
      await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(folders)
      .values({
        name,
        parentId: parentId ?? null,
        user_id: userId,
      })
      .returning({ id: folders.id });

    const folder = await getFolderById(created.id);

    return NextResponse.json({ success: true, folder });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}

// GET FOLDERS
export async function GET(req: Request) {
  try {
    const { id: userId } = await getAuthUser();
    if(!userId)  return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("folderId");
    const limit = searchParams.get("limit");

    const whereClause = parentId
      ? and(eq(folders.user_id, userId), eq(folders.parentId, Number(parentId)))
      : and(eq(folders.user_id, userId), isNull(folders.parentId));

    const query = db
      .select({
        id: folders.id,
        name: folders.name,
        fileCount: sql<number>`COUNT(${files.id})`,
        totalSize: sql<number>`COALESCE(SUM(${files.file_size}), 0)`,
      })
      .from(folders)
      .leftJoin(files, eq(files.folderId, folders.id))
      .where(whereClause)
      .groupBy(folders.id);

    const foldersResult =
      !parentId && limit ? await query.limit(Number(limit)) : await query;

    return NextResponse.json({ success: true, folders: foldersResult });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}

// DELETE FOLDER
export async function DELETE(req: Request) {

  const {id: userId} = await getAuthUser();

  if (!userId) {
     return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { folderId }: { folderId: number } = await req.json();

  if (!folderId) {
    return NextResponse.json(
      { success: false, error: "Folder ID is required" },
      { status: 400 }
    );
  }

  // Only delete folder owned by this user
  await db
    .delete(folders)
    .where(and(eq(folders.id, folderId), eq(folders.user_id, userId)));

  return NextResponse.json({
    success: true,
    message: "Folder deleted successfully",
  });
}

export async function PATCH(req: Request) {
  try {
    const { id: userId } = await getAuthUser();

    const { folderId, name, parentId } = await req.json();

    if (!folderId || isNaN(folderId)) {
      return NextResponse.json({ error: "Invalid folder ID" }, { status: 400 });
    }

    if (!name && parentId === undefined) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await db
      .update(folders)
      .set({
        ...(name && { name }),
        ...(parentId !== undefined && { parentId }),
      })
      .where(and(eq(folders.id, folderId), eq(folders.user_id, userId)));

    const folder = await getFolderById(folderId);

    return NextResponse.json({ success: true, folder });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}



async function getFolderById(folderId: number): Promise<FolderResponse | null> {
  const [folder] = await db
    .select({
      id: folders.id,
      name: folders.name,
      fileCount: sql<number>`COUNT(${files.id})`,
      totalSize: sql<number>`COALESCE(SUM(${files.file_size}), 0)`,
    })
    .from(folders)
    .leftJoin(files, eq(files.folderId, folders.id))
    .where(eq(folders.id, folderId))
    .groupBy(folders.id);

  return folder ?? null;
}
