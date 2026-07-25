import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { generateEmailVerification } from "../../_services";
import { signingToken } from "../../_services/jwtServices";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { publicUserSelect } from "@/db/selection";

import { loginSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email/sendVerifyEmail";

import { COOLDOWN_MS } from "@/constant";

export async function POST(req: Request) {
  // Changed from NextResponse to Request
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);

      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const [existingUser] = await db
      .select({
        id: usersTable.id,
        email: usersTable.email,
        password: usersTable.password,
        emailVerified: usersTable.emailVerified,
        lastVerificationEmailSentAt: usersTable.lastVerificationEmailSentAt,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!existingUser.password) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This account uses Google Sign-In. Continue with Google, or set a password from your account settings first.",
        },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const now = new Date();

    const updateData: {
      lastLoginAt: Date;
      lastVerificationEmailSentAt?: Date;
    } = {
      lastLoginAt: now,
    };

    if (!existingUser.emailVerified) {
      const canSend =
        !existingUser.lastVerificationEmailSentAt ||
        now.getTime() - existingUser.lastVerificationEmailSentAt.getTime() >=
          COOLDOWN_MS;

      if (canSend) {
        const token = await generateEmailVerification(existingUser.id);

        await sendVerificationEmail(existingUser.email, token);

        updateData.lastVerificationEmailSentAt = now;
      }
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, existingUser.id))
      .returning(publicUserSelect);

    // Generate access token
    const accessToken = signingToken({
      data: {
        id: existingUser.id,
      },
      expireDays: "12h",
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        data: updatedUser,
      },
      { status: 200 },
    );

    // Set access token cookie
    response.cookies.set("FP-accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
