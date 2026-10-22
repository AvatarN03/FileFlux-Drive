import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { verifyAuth } from "../../_services";

interface RouteParams {
  params: Promise<{
    folderId: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: RouteParams
) {
  try {
    const { id: userId } = await verifyAuth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const { folderId } = await params;

    // Ensure the folder belongs to the user
    const [folder] = await db
      .select({ id: folders.id })
      .from(folders)
      .where(
        and(
          eq(folders.id, folderId),
          eq(folders.userId, userId),
          isNull(folders.deletedAt)
        )
      );

    if (!folder) {
      return NextResponse.json(
        {
          success: false,
          error: "Folder not found",
        },
        {
          status: 404,
        }
      );
    }

    const folderFiles = await db
      .select({
        id: files.id,
        name: files.name,
        originalName: files.originalName,
        extension: files.extension,
        mimeType: files.mimeType,
        size: files.size,
        url: files.url,
        thumbnailUrl: files.thumbnailUrl,
        downloads: files.downloads,
        views: files.views,
        isFavorite: files.isFavorite,
        createdAt: files.createdAt,
        lastOpenedAt: files.lastOpenedAt,
      })
      .from(files)
      .where(
        and(
          eq(files.folderId, folderId),
          eq(files.userId, userId),
          isNull(files.deletedAt)
        )
      );

    return NextResponse.json({
      success: true,
      files: folderFiles,
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
      }
    );
  }
}