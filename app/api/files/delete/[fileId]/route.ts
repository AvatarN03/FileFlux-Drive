import { NextResponse } from "next/server";
import { and, eq, isNull } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../../_services";

interface RouteParams {
  params: Promise<{
    fileId: string;
  }>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function DELETE(req: Request, { params }: RouteParams) {
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

    const [deleted] = await db
      .update(files)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(files.id, fileId),
          eq(files.userId, userId),
          isNull(files.deletedAt)
        )
      )
      .returning({ id: files.id });

    if (!deleted) {
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

    return NextResponse.json({
      success: true,
      message: "File moved to trash successfully",
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
    console.error("Delete file error:", error);

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
