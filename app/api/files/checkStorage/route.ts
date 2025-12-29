import { NextResponse } from "next/server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { getAuthUser, MAX_STORAGE } from "../../_services";

export async function GET(req: Request) {
  

  const { searchParams } = new URL(req.url);
  const incomingSize = Number(searchParams.get("size") ?? 0);

  const { id: userId } = await getAuthUser();
  if (!userId)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  const result = await db
    .select({
      total: sql<number>`COALESCE(SUM(${files.file_size}), 0)`,
    })
    .from(files)
    .where(eq(files.user_id, userId));

  const used = Number(result[0]?.total ?? 0);
  const afterUpload = used + incomingSize;

  return NextResponse.json({
    success: true,
    used,
    incoming: incomingSize,
    max: MAX_STORAGE,
    remaining: Math.max(MAX_STORAGE - used, 0),
    canUpload: afterUpload <= MAX_STORAGE,
  });
}
