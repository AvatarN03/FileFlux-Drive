import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { validate } from "deep-email-validator";

import { verifyEmailAddress } from "../../_services/email";
import { signingToken } from "../../_services/jwtServices";
import { generateEmailVerification } from "../../_services";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { publicUserSelect } from "@/db/selection";

import { signupSchema } from "@/lib/validations/auth";
import { sendVerificationEmail } from "@/lib/email/sendVerifyEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((err) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 },
      );
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
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 },
      );
    }

    // ✅ STEP 2: BLOCK TEMP EMAILS (IMPORTANT)
    const disifyRes = await fetch(`https://disify.com/api/email/${email}`);
    const disifyData = await disifyRes.json();

    if (disifyData.disposable) {
      return NextResponse.json(
        { success: false, error: "Temporary email addresses are not allowed" },
        { status: 400 },
      );
    }

    // ✅ Validate email using node-email-verifier
    const validation = await verifyEmailAddress(email);

    // If completely invalid
    if (!validation || (typeof validation === "object" && !validation.valid)) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 },
      );
    }

    // ✅ STEP 3: Check existing user
    const [existingUser] = await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
        },
        { status: 409 },
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
        lastVerificationEmailSentAt: new Date(),
      })
      .returning(publicUserSelect);

    const token = await generateEmailVerification(newUser.id);

    await sendVerificationEmail(newUser.email, token);

    const accessToken = signingToken({
      data: {
        id: newUser.id,
      },
      expireDays: "12h",
    });

    const response = NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 },
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
      { status: 500 },
    );
  }
}
