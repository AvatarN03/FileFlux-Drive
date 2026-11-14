import { NextResponse } from "next/server";

import { and, count, eq, isNull } from "drizzle-orm";

import { isAuthError, verifyAuth } from "../_services";

import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { logServerError } from "@/lib/security/safeLogging";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// CREATE FOLDER
export async function POST(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const { encryptedMetadata, parentId } = await req.json();

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

    const [folder] = await db
      .insert(folders)
      .values({
        name: "[Encrypted Folder]",
        encryptedMetadataNonce: encryptedMetadata.nonce,
        encryptedMetadataCiphertext: encryptedMetadata.ciphertext,
        isEncrypted: true,
        parentId: parentId ?? null,
        userId,
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
      isFavorite,
    }: {
      folderId: string;
      name?: string;
      encryptedMetadata?: { nonce?: unknown; ciphertext?: unknown };
      parentId?: string | null;
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
         ...(isFavorite !== undefined && { isFavorite }),
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
