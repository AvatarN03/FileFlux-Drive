import { NextResponse } from "next/server";

import { and, eq, inArray, isNull } from "drizzle-orm";

import { isAuthError, verifyAuth } from "../_services";

import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { logServerError } from "@/lib/security/safeLogging";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// CREATE FOLDER
export async function POST(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const { encryptedMetadata, parentId, color, isFavorite } = await req.json();

    if (
      !encryptedMetadata ||
      typeof encryptedMetadata.nonce !== "string" ||
      !encryptedMetadata.nonce ||
      typeof encryptedMetadata.ciphertext !== "string" ||
      !encryptedMetadata.ciphertext
    ) {
      return NextResponse.json(
        { success: false, error: "Encrypted folder metadata is required" },
        { status: 400 },
      );
    }

    if (
      parentId !== undefined &&
      parentId !== null &&
      (typeof parentId !== "string" || !UUID_PATTERN.test(parentId))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid parent folder ID" },
        { status: 400 },
      );
    }

    if (parentId) {
      const [parentFolder] = await db
        .select({ id: folders.id })
        .from(folders)
        .where(
          and(
            eq(folders.id, parentId),
            eq(folders.userId, userId),
            isNull(folders.deletedAt),
          ),
        );

      if (!parentFolder) {
        return NextResponse.json(
          { success: false, error: "Parent folder not found" },
          { status: 404 },
        );
      }
    }

    if (color !== undefined && (typeof color !== "string" || color.length > 32)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder color" },
        { status: 400 },
      );
    }

    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isFavorite must be a boolean" },
        { status: 400 },
      );
    }

    const [folder] = await db
      .insert(folders)
      .values({
        name: "[Encrypted Folder]",
        encryptedMetadataNonce: encryptedMetadata.nonce,
        encryptedMetadataCiphertext: encryptedMetadata.ciphertext,
        isEncrypted: true,
        parentId: parentId ?? null,
        userId,
        ...(color !== undefined && { color }),
        ...(isFavorite !== undefined && { isFavorite }),
      })
      .returning();

    return NextResponse.json({ success: true, folder });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    logServerError("Create folder", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
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
        color: folders.color,
        isFavorite: folders.isFavorite,
        isEncrypted: folders.isEncrypted,
        encryptedMetadataNonce: folders.encryptedMetadataNonce,
        encryptedMetadataCiphertext: folders.encryptedMetadataCiphertext,
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
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    logServerError("Fetch folders", error);
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

    const { folderId }: { folderId?: unknown } = await req.json();

    if (typeof folderId !== "string" || !UUID_PATTERN.test(folderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder ID" },
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

    const userFolders = await db
      .select({ id: folders.id, parentId: folders.parentId })
      .from(folders)
      .where(eq(folders.userId, userId));

    const childrenByParent = new Map<string, string[]>();
    for (const candidate of userFolders) {
      if (!candidate.parentId) continue;
      const children = childrenByParent.get(candidate.parentId) ?? [];
      children.push(candidate.id);
      childrenByParent.set(candidate.parentId, children);
    }

    const subtreeIds: string[] = [];
    const pendingIds = [folderId];
    while (pendingIds.length > 0) {
      const currentId = pendingIds.pop();
      if (!currentId || subtreeIds.includes(currentId)) continue;

      subtreeIds.push(currentId);
      pendingIds.push(...(childrenByParent.get(currentId) ?? []));
    }

    const filesInSubtree = await db
      .select({ id: files.id })
      .from(files)
      .where(
        and(
          eq(files.userId, userId),
          inArray(files.folderId, subtreeIds),
          isNull(files.deletedAt),
        ),
      );

    if (filesInSubtree.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Folder or nested folders contain files. Remove or move them before sending the folder tree to trash.",
        },
        { status: 400 },
      );
    }

    const deletedAt = new Date();
    await db
      .update(folders)
      .set({ deletedAt, updatedAt: deletedAt })
      .where(
        and(
          eq(folders.userId, userId),
          inArray(folders.id, subtreeIds),
          isNull(folders.deletedAt),
        ),
      );

    return NextResponse.json({
      success: true,
      message: "Folder tree moved to trash",
      folderIds: subtreeIds,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    logServerError("Delete folder", error);

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
      encryptedMetadata,
      parentId,
      color,
      isFavorite,
    }: {
      folderId: string;
      name?: string;
      encryptedMetadata?: { nonce?: unknown; ciphertext?: unknown };
      parentId?: string | null;
      color?: string | null;
      isFavorite?: boolean;
    } = await req.json();

    if (!folderId) {
      return NextResponse.json(
        { success: false, error: "Folder ID is required" },
        { status: 400 },
      );
    }

    if (!UUID_PATTERN.test(folderId)) {
      return NextResponse.json(
        { success: false, error: "Invalid folder ID" },
        { status: 400 },
      );
    }

    if (
      parentId !== undefined &&
      parentId !== null &&
      (typeof parentId !== "string" || !UUID_PATTERN.test(parentId))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid destination folder ID" },
        { status: 400 },
      );
    }

    if (
      name === undefined &&
      encryptedMetadata === undefined &&
      parentId === undefined &&
      color === undefined &&
      isFavorite === undefined
    ) {
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

    if (parentId !== undefined && parentId !== null) {
      let ancestorId: string | null = parentId;
      const visited = new Set<string>();

      while (ancestorId !== null) {
        if (ancestorId === folderId) {
          return NextResponse.json(
            { success: false, error: "A folder cannot be moved into itself or a descendant." },
            { status: 400 },
          );
        }

        if (visited.has(ancestorId)) {
          return NextResponse.json(
            { success: false, error: "Destination folder hierarchy is invalid." },
            { status: 409 },
          );
        }
        visited.add(ancestorId);

        const [ancestor] = await db
          .select({ id: folders.id, parentId: folders.parentId })
          .from(folders)
          .where(
            and(
              eq(folders.id, ancestorId),
              eq(folders.userId, userId),
              isNull(folders.deletedAt),
            ),
          );

        if (!ancestor) {
          return NextResponse.json(
            { success: false, error: "Destination folder not found." },
            { status: 404 },
          );
        }

        ancestorId = ancestor.parentId;
      }
    }

    if (isFavorite !== undefined && typeof isFavorite !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isFavorite must be a boolean" },
        { status: 400 },
      );
    }

    if (
      color !== undefined &&
      color !== null &&
      (typeof color !== "string" || color.length > 32)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid folder color" },
        { status: 400 },
      );
    }

    if (name !== undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Folder names must be updated through the encrypted metadata flow.",
        },
        { status: 400 },
      );
    }

    if (encryptedMetadata !== undefined) {
      if (
        !encryptedMetadata ||
        typeof encryptedMetadata.nonce !== "string" ||
        !encryptedMetadata.nonce ||
        typeof encryptedMetadata.ciphertext !== "string" ||
        !encryptedMetadata.ciphertext
      ) {
        return NextResponse.json(
          { success: false, error: "Valid encrypted folder metadata is required." },
          { status: 400 },
        );
      }
    }

    await db
      .update(folders)
      .set({
        ...(encryptedMetadata !== undefined && {
          name: "[Encrypted Folder]",
          encryptedMetadataNonce: encryptedMetadata.nonce as string,
          encryptedMetadataCiphertext: encryptedMetadata.ciphertext as string,
          isEncrypted: true,
        }),
        ...(parentId !== undefined && { parentId }),
        ...(color !== undefined && { color }),
         ...(isFavorite !== undefined && { isFavorite }),
      })
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.userId, userId),
          isNull(folders.deletedAt),
        ),
      );

    const [updatedFolder] = await db
      .select()
      .from(folders)
      .where(eq(folders.id, folderId));

    return NextResponse.json({
      success: true,
      folder: updatedFolder,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }
    logServerError("Update folder", error);
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
