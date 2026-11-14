import { NextResponse } from "next/server";
import { and, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../../_services";
import { logServerError } from "@/lib/security/safeLogging";

interface RouteParams {
  params: Promise<{ fileId: string }>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(_req: Request, { params }: RouteParams) {
  try {
    const { id: userId } = await verifyAuth();
    const { fileId } = await params;

    if (!UUID_REGEX.test(fileId)) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 },
      );
    }

    const [restored] = await db
      .update(files)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(
        and(
          eq(files.id, fileId),
          eq(files.userId, userId),
          isNotNull(files.deletedAt),
        ),
      )
      .returning({ id: files.id });

    if (!restored) {
      return NextResponse.json(
        { success: false, error: "File not found in trash" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, fileId: restored.id });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    logServerError("Restore file", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore file" },
      { status: 500 },
    );
  }
}
