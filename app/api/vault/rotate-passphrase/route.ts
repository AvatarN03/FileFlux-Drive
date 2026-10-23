import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { vaults } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../_services";
import { KdfParameters, EncryptedEnvelope } from "@/lib/crypto/types";

export async function PATCH(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    const [existing] = await db
      .select({ id: vaults.id })
      .from(vaults)
      .where(eq(vaults.userId, userId));

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "No vault found for this account" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { kdfParams, passphraseEnvelope } = body as {
      kdfParams?: KdfParameters;
      passphraseEnvelope?: EncryptedEnvelope;
    };

    if (
      !kdfParams?.salt ||
      !kdfParams.opsLimit ||
      !kdfParams.memLimit ||
      !passphraseEnvelope?.nonce ||
      !passphraseEnvelope.ciphertext
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required passphrase envelope parameters" },
        { status: 400 }
      );
    }

    await db
      .update(vaults)
      .set({
        kdfSalt: kdfParams.salt,
        kdfOpsLimit: kdfParams.opsLimit,
        kdfMemLimit: kdfParams.memLimit,
        kdfAlgorithm: kdfParams.algorithm || "argon2id",
        passphraseNonce: passphraseEnvelope.nonce,
        passphraseCiphertext: passphraseEnvelope.ciphertext,
        updatedAt: new Date(),
      })
      .where(eq(vaults.userId, userId));

    return NextResponse.json({
      success: true,
      message: "Vault passphrase envelope updated successfully",
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Rotate passphrase envelope error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
