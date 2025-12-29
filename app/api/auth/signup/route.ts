import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { validate } from "deep-email-validator";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { signupSchema } from "@/lib/validations/auth";
import { signingToken } from "@/lib/validations/jwtServices";
import {  verifyEmailAddress } from "../../_services";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      return NextResponse.json({ errors }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // ✅ STEP 1: Basic email validation
    const emailCheck = await validate({
      email,
      validateSMTP: false,
      validateTypo: true,
      validateDisposable: true,
    });

    if (!emailCheck.valid) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // ✅ STEP 2: BLOCK TEMP EMAILS (IMPORTANT)
    const disifyRes = await fetch(`https://disify.com/api/email/${email}`);
    const disifyData = await disifyRes.json();

    if (disifyData.disposable) {
      return NextResponse.json(
        { error: "Temporary email addresses are not allowed" },
        { status: 400 }
      );
    }

    // ✅ Validate email using node-email-verifier
    const validation = await verifyEmailAddress(email);

    // If completely invalid
    if (!validation || (typeof validation === "object" && !validation.valid)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // ✅ STEP 3: Check existing user
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // ✅ STEP 4: Create user
    const hash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password: hash,
      })
      .returning();

    const accessToken = signingToken({
      data: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      expireDays: "12h",
    });

    const response = NextResponse.json(
      {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );

    response.cookies.set("FP-accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
