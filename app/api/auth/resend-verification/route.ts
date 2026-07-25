import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";

import { generateEmailVerification, getAuthUser } from "../../_services";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

import { sendVerificationEmail } from "@/lib/email/sendVerifyEmail";

import { COOLDOWN_MS } from "@/constant";

export async function POST() {
  try {
    const user = await getAuthUser();

    if (!user.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is required.",
        },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Email is already verified.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const canSend =
      !user.lastVerificationEmailSentAt ||
      now.getTime() - user.lastVerificationEmailSentAt.getTime() >=
        COOLDOWN_MS;

    if (!canSend) {
      const retryAfterMs =
        COOLDOWN_MS -
        (now.getTime() - user.lastVerificationEmailSentAt!.getTime());

      return NextResponse.json(
        {
          success: false,
          error: "Please wait 15min before requesting another verification email.",
          coolDownMs: retryAfterMs,
        },
        { status: 429 }
      );
    }

    // Creates a new token and removes any previous one(s)
    const verificationToken = await generateEmailVerification(user.id);

    await sendVerificationEmail(user.email, verificationToken);

     await db
      .update(usersTable)
      .set({
        lastVerificationEmailSentAt: now,
      })
      .where(eq(usersTable.id, user.id));

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}