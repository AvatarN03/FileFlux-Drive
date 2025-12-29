import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { getAuthUser } from "../../_services";

import { folders } from "@/db/schema";
import { db } from "@/db";

export async function GET() {
  try {
    const { id: userId } = await getAuthUser();

    const allFolders = await db
      .select()
      .from(folders)
      .where(eq(folders.user_id, userId));

    return NextResponse.json({ success: true, allFolders });
  } catch  {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
