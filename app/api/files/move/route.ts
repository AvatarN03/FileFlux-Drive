import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { files } from "@/db/schema";
import { getAuthUser } from "../../_services";

export async function PATCH(req: Request) {
  const { id: userId } = await getAuthUser();
  if (!userId)
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );

  const { fileId, folderId } = await req.json();
  console.log(folderId);

  if (!folderId) {
    return NextResponse.json(
      { success: false, error: "Target folder ID required" },
      { status: 400 }
    );
  }

  try {
    await db
      .update(files)
      .set({ folderId })
      .where(eq(files.id, Number(fileId)));
    return NextResponse.json({
      success: true,
      message: "File moved successfully",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to move file" },
      { status: 500 }
    );
  }
}
