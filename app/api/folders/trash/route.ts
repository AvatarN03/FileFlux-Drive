import { NextResponse } from "next/server";
import { and, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { folders } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../_services";
import { logServerError } from "@/lib/security/safeLogging";

export async function GET() {
  try {
    const { id: userId } = await verifyAuth();
    const deletedFolders = await db
      .select({
        id: folders.id,
        name: folders.name,
        parentId: folders.parentId,
        isEncrypted: folders.isEncrypted,
        encryptedMetadataNonce: folders.encryptedMetadataNonce,
        encryptedMetadataCiphertext: folders.encryptedMetadataCiphertext,
        deletedAt: folders.deletedAt,
      })
      .from(folders)
      .where(and(eq(folders.userId, userId), isNotNull(folders.deletedAt)))
      .orderBy(desc(folders.deletedAt));

    const deletedIds = new Set(deletedFolders.map((folder) => folder.id));
    const trashRoots = deletedFolders.filter(
      (folder) => !folder.parentId || !deletedIds.has(folder.parentId),
    );

    return NextResponse.json({
      success: true,
      data: trashRoots.map((folder) => ({
        ...folder,
        deletedAt: folder.deletedAt!.toISOString(),
      })),
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    logServerError("Fetch folder trash", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch folder trash" },
      { status: 500 },
    );
  }
}
