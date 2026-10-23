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

export async function PATCH(req: Request, { params }: RouteParams) {
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

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body",
        },
        {
          status: 400,
        }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Request body must be an object",
        },
        {
          status: 400,
        }
      );
    }

    const { name, extension, isFavorite } = body as Record<string, unknown>;

    if (
      name === undefined &&
      extension === undefined &&
      isFavorite === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "At least one field (name, extension, isFavorite) must be provided",
        },
        {
          status: 400,
        }
      );
    }

    const updateFields: {
      name?: string;
      extension?: string;
      isFavorite?: boolean;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (name !== undefined) {
      if (typeof name !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "Filename must be a string",
          },
          {
            status: 400,
          }
        );
      }
      const trimmedName = name.trim();
      if (!trimmedName) {
        return NextResponse.json(
          {
            success: false,
            error: "Filename cannot be empty",
          },
          {
            status: 400,
          }
        );
      }
      if (trimmedName.length > 255) {
        return NextResponse.json(
          {
            success: false,
            error: "Filename cannot exceed 255 characters",
          },
          {
            status: 400,
          }
        );
      }
      updateFields.name = trimmedName;
    }

    if (extension !== undefined) {
      if (typeof extension !== "string") {
        return NextResponse.json(
          {
            success: false,
            error: "Extension must be a string",
          },
          {
            status: 400,
          }
        );
      }
      const trimmedExtension = extension
        .trim()
        .toLowerCase()
        .replace(/^\./, "");
      if (!trimmedExtension) {
        return NextResponse.json(
          {
            success: false,
            error: "Extension cannot be empty",
          },
          {
            status: 400,
          }
        );
      }
      if (trimmedExtension.length > 50) {
        return NextResponse.json(
          {
            success: false,
            error: "Extension cannot exceed 50 characters",
          },
          {
            status: 400,
          }
        );
      }
      updateFields.extension = trimmedExtension;
    }

    if (isFavorite !== undefined) {
      if (typeof isFavorite !== "boolean") {
        return NextResponse.json(
          {
            success: false,
            error: "isFavorite must be a boolean",
          },
          {
            status: 400,
          }
        );
      }
      updateFields.isFavorite = isFavorite;
    }

    const [updated] = await db
      .update(files)
      .set(updateFields)
      .where(
        and(
          eq(files.id, fileId),
          eq(files.userId, userId),
          isNull(files.deletedAt)
        )
      )
      .returning({
        id: files.id,
        name: files.name,
        extension: files.extension,
        isFavorite: files.isFavorite,
        updatedAt: files.updatedAt,
      });

    if (!updated) {
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
      message: "File updated successfully",
      data: {
        id: updated.id,
        name: updated.name,
        extension: updated.extension,
        isFavorite: updated.isFavorite,
        updatedAt:
          typeof updated.updatedAt === "string"
            ? updated.updatedAt
            : updated.updatedAt.toISOString(),
      },
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
    console.error("File update error:", error);

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
