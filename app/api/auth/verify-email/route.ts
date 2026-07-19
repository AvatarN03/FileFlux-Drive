import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable, verificationTokens } from "@/db/schema";

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing verification token.",
        },
        { status: 400 },
      );
    }

    // Single JOIN query
    const [verification] = await db
      .select({
        verificationId: verificationTokens.id,
        userId: usersTable.id,
        expiresAt: verificationTokens.expiresAt,
        emailVerified: usersTable.emailVerified,
      })
      .from(verificationTokens)
      .innerJoin(usersTable, eq(verificationTokens.userId, usersTable.id))
      .where(eq(verificationTokens.token, token));

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification link.",
        },
        { status: 400 },
      );
    }

    // Expired
    if (verification.expiresAt < new Date()) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, verification.verificationId));

      return NextResponse.json(
        {
          success: false,
          error: "Verification link has expired.",
        },
        { status: 400 },
      );
    }

    // Already verified
    if (verification.emailVerified) {
      await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, verification.verificationId));

      return NextResponse.json({
        success: true,
        message: "Email is already verified.",
      });
    }

    await db
      .update(usersTable)
      .set({
        emailVerified: true,
      })
      .where(eq(usersTable.id, verification.userId));

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, verification.verificationId));

    return NextResponse.json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}
