import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { publicUserSelect } from "@/db/selection";
import { getAuthUser, isAuthError } from "../../_services";

export async function PATCH(req: Request) {
  try {
    const user = await getAuthUser();
    const body = await req.json();
    const { name } = body as { name?: string };

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Full name cannot be empty" },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 60) {
      return NextResponse.json(
        { success: false, error: "Full name must be between 2 and 60 characters" },
        { status: 400 }
      );
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        name: trimmedName,
        updatedAt: new Date(),
      })
      .where(eq(usersTable.id, user.id))
      .returning(publicUserSelect);

    return NextResponse.json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile name" },
      { status: 500 }
    );
  }
}

