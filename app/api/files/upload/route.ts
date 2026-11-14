import { NextResponse } from "next/server";

/**
 * This legacy endpoint accepted plaintext multipart uploads.
 * FileFlux v2 uploads client-encrypted ciphertext directly to Neon Object
 * Storage and finalizes metadata through `/api/files/record` instead.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "This plaintext upload endpoint is retired. Use the encrypted upload flow.",
    },
    { status: 410 },
  );
}
