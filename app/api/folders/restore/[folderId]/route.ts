import { NextResponse } from "next/server";
import { and, eq, inArray, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { folders } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../../_services";
import { logServerError } from "@/lib/security/safeLogging";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ folderId: string }> },
) {
  try {
    const { id: userId } = await verifyAuth();
    const { folderId } = await params;

    if (!UUID_PATTERN.test(folderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder ID" },
        { status: 400 },
      );
    }

    const deletedFolders = await db
      .select({ id: folders.id, parentId: folders.parentId })
      .from(folders)
      .where(and(eq(folders.userId, userId), isNotNull(folders.deletedAt)));

    const deletedById = new Map(
      deletedFolders.map((folder) => [folder.id, folder]),
    );
    if (!deletedById.has(folderId)) {
      return NextResponse.json(
        { success: false, error: "Folder not found in trash" },
        { status: 404 },
      );
    }

    let rootId = folderId;
    let parentId = deletedById.get(rootId)?.parentId ?? null;
    while (parentId && deletedById.has(parentId)) {
      rootId = parentId;
      parentId = deletedById.get(rootId)?.parentId ?? null;
    }

    const childrenByParent = new Map<string, string[]>();
    for (const folder of deletedFolders) {
      if (!folder.parentId) continue;
      const children = childrenByParent.get(folder.parentId) ?? [];
      children.push(folder.id);
      childrenByParent.set(folder.parentId, children);
    }

    const subtreeIds: string[] = [];
    const pendingIds = [rootId];
    while (pendingIds.length > 0) {
      const currentId = pendingIds.pop();
      if (!currentId || subtreeIds.includes(currentId)) continue;

      subtreeIds.push(currentId);
      pendingIds.push(...(childrenByParent.get(currentId) ?? []));
    }

    await db
      .update(folders)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(
        and(
          eq(folders.userId, userId),
          inArray(folders.id, subtreeIds),
          isNotNull(folders.deletedAt),
        ),
      );

    return NextResponse.json({
      success: true,
      folderIds: subtreeIds,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    logServerError("Restore folder", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore folder" },
      { status: 500 },
    );
  }
}
