import { NextResponse } from "next/server";
import { and, desc, eq, isNotNull } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { fileListSelect } from "@/db/selection";
import { isAuthError, verifyAuth } from "../../_services";
import { logServerError } from "@/lib/security/safeLogging";

export async function GET() {
  try {
    const { id: userId } = await verifyAuth();
    const trashFiles = await db
      .select({ ...fileListSelect, deletedAt: files.deletedAt })
      .from(files)
      .where(and(eq(files.userId, userId), isNotNull(files.deletedAt)))
      .orderBy(desc(files.deletedAt));

    return NextResponse.json({ success: true, files: trashFiles });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    logServerError("Fetch trash files", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trash" },
      { status: 500 },
    );
  }
}
