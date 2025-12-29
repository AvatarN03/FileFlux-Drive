import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { deleteFromCloudinary, getAuthUser } from "../../_services";
import { db } from "@/db";
import { usersTable, files } from "@/db/schema";

export async function DELETE() {
  try {
    const { id: userId } = await getAuthUser();

    // 1️⃣ Fetch all user files (for Cloudinary cleanup)
    const userFiles = await db
      .select({
        public_id: files.public_id,
      })
      .from(files)
      .where(eq(files.user_id, userId));

    // 2️⃣ Delete files from Cloudinary
    for (const file of userFiles) {
      if (!file.public_id) continue;
      await deleteFromCloudinary(file.public_id);
    }

    // 3️⃣ Delete user (cascade deletes folders & files in DB)
    await db.delete(usersTable).where(eq(usersTable.id, userId));

    // 4️⃣ Clear cookie
    const response = NextResponse.json({
      message: "Account deleted successfully",
    });

    response.cookies.set("FP-accessToken", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
