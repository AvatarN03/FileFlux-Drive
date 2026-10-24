import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { files, folders } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../../_services";
import { FileDetail } from "@/types/file";

interface RouteParams {
  params: Promise<{
    fileId: string;
  }>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request, { params }: RouteParams) {
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

    const { fileId } = await params;

    if (!fileId || !UUID_REGEX.test(fileId)) {
      return NextResponse.json(
        {
          success: false,
          error: "File not found",
        },
        {
          status: 404,
        }
      );
    }

    const [fileData] = await db
      .select({
        id: files.id,
        name: files.name,
        extension: files.extension,
        mimeType: files.mimeType,
        size: files.size,
        thumbnailUrl: files.thumbnailUrl,
        folderId: files.folderId,
        isFavorite: files.isFavorite,
        downloads: files.downloads,
        views: files.views,
        lastOpenedAt: files.lastOpenedAt,
        createdAt: files.createdAt,
        updatedAt: files.updatedAt,
        folderIdJoin: folders.id,
        folderName: folders.name,
        folderColor: folders.color,
      })
      .from(files)
      .leftJoin(
        folders,
        and(
          eq(files.folderId, folders.id),
          eq(folders.userId, userId),
          isNull(folders.deletedAt)
        )
      )
      .where(
        and(
          eq(files.id, fileId),
          eq(files.userId, userId),
          isNull(files.deletedAt)
        )
      );

    if (!fileData) {
      return NextResponse.json(
        {
          success: false,
          error: "File not found",
        },
        {
          status: 404,
        }
      );
    }

    const formattedFile: FileDetail = {
      id: fileData.id,
      name: fileData.name,
      extension: fileData.extension,
      mimeType: fileData.mimeType,
      size: fileData.size,
      thumbnailUrl: fileData.thumbnailUrl,
      isFavorite: fileData.isFavorite,
      createdAt:
        typeof fileData.createdAt === "string"
          ? fileData.createdAt
          : fileData.createdAt.toISOString(),
      updatedAt:
        typeof fileData.updatedAt === "string"
          ? fileData.updatedAt
          : fileData.updatedAt.toISOString(),
      folder:
        fileData.folderIdJoin && fileData.folderName
          ? {
              id: fileData.folderIdJoin,
              name: fileData.folderName,
              color: fileData.folderColor,
            }
          : null,
      downloads: fileData.downloads,
      views: fileData.views,
      lastOpenedAt: fileData.lastOpenedAt
        ? typeof fileData.lastOpenedAt === "string"
          ? fileData.lastOpenedAt
          : fileData.lastOpenedAt.toISOString()
        : null,
    };

    return NextResponse.json({
      success: true,
      data: formattedFile,
    });
  } catch (error) {
    if (isAuthError(error)) {
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
    console.error("Single file fetch error:", error);

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
