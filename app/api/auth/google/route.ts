// app/api/auth/google/route.ts

import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { publicUserSelect } from "@/db/selection";
import { signingToken } from "@/lib/validations/jwtServices";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { credential } = await req.json();

    if (!credential) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing Google credential.",
        },
        {
          status: 400,
        },
      );
    }

    // Verify Google ID Token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Google account.",
        },
        {
          status: 401,
        },
      );
    }

    const { email, name, picture, email_verified } = payload;
    console.log("Google Auth Payload:", payload);

    let user;

    const [existingUser] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existingUser) {
      [user] = await db
        .update(usersTable)
        .set({
          avatarUrl: picture ?? existingUser.avatarUrl,
          emailVerified: email_verified ?? existingUser.emailVerified,
          lastLoginAt: new Date(),
        })
        .where(eq(usersTable.id, existingUser.id))
        .returning(publicUserSelect);
    } else {
      [user] = await db
        .insert(usersTable)
        .values({
          name: name ?? "Google User",
          email,
          password: null,
          avatarUrl: picture,
          emailVerified: true,
          lastLoginAt: new Date(),
        })
        .returning(publicUserSelect);
    }

    // Generate your own JWT
    const accessToken = signingToken({
      data: {
        id: user.id,
      },
      expireDays: "12h",
    });

    const response = NextResponse.json(
      {
        success: true,
        user,
      },
      {
        status: 200,
      },
    );

    response.cookies.set("FP-accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google Auth Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Google authentication failed.",
      },
      {
        status: 500,
      },
    );
  }
}
