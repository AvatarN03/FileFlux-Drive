import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { User } from "@/types/auth";
import { verifyToken } from "@/lib/validations/jwtServices";

export async function GET() {
  try {
    const token = (await cookies()).get("FP-accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "No token" },
        { status: 401 }
      );
    }

    const verified = verifyToken(token);

    if (!verified.valid) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const payload = verified.value as User;
    
    // Try to fetch the user from DB using id or email when available
    let userRecord;
    if (payload.email) {
        userRecord = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, payload.email));
    }
    console.log("p1");

    if (!userRecord || userRecord.length === 0) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const user = userRecord[0];

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
