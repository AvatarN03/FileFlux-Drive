import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { loginSchema } from "@/lib/validations/auth";
import { signingToken } from "@/lib/validations/jwtServices";
import { publicUserSelect } from "@/db/selection";
import { generateEmailVerification } from "../../_services";


export async function POST(req: Request) {
  // Changed from NextResponse to Request
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => issue.message);

      return NextResponse.json({ errors }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));
    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const user = existingUser[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    const [updatedUser] = await db
      .update(usersTable)
      .set({
        lastLoginAt: new Date(),
      })
      .where(eq(usersTable.id, user.id))
      .returning(publicUserSelect);

    if (!user.emailVerified) {
    const token = await generateEmailVerification(user.id);

    // TODO: Implement email sending logic here
    // await sendVerificationEmail(user.email, token);
    }

    // Generate access token
    const accessToken = signingToken({
      data: {
        id: user.id,
      },
      expireDays: "12h",
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        user: updatedUser,
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
