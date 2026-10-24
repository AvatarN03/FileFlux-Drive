import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { vaults } from "@/db/schema";
import { isAuthError, verifyAuth } from "../../_services";
import { KdfParameters, EncryptedEnvelope } from "@/lib/crypto/types";

export async function POST(req: Request) {
  try {
    const { id: userId } = await verifyAuth();

    // Check if vault already exists
    const [existing] = await db
      .select({ id: vaults.id })
      .from(vaults)
      .where(eq(vaults.userId, userId));

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A vault is already enrolled for this account" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { kdfParams, passphraseEnvelope, recoveryEnvelope } = body as {
      kdfParams?: KdfParameters;
      passphraseEnvelope?: EncryptedEnvelope;
      recoveryEnvelope?: EncryptedEnvelope;
    };

    if (
      !kdfParams?.salt ||
      !kdfParams.opsLimit ||
      !kdfParams.memLimit ||
      !passphraseEnvelope?.nonce ||
      !passphraseEnvelope.ciphertext ||
      !recoveryEnvelope?.nonce ||
      !recoveryEnvelope.ciphertext
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required vault envelope parameters" },
        { status: 400 }
      );
    }

    const [newVault] = await db
      .insert(vaults)
      .values({
        userId,
        kdfSalt: kdfParams.salt,
        kdfOpsLimit: kdfParams.opsLimit,
        kdfMemLimit: kdfParams.memLimit,
        kdfAlgorithm: kdfParams.algorithm || "argon2id",
        passphraseNonce: passphraseEnvelope.nonce,
        passphraseCiphertext: passphraseEnvelope.ciphertext,
        recoveryNonce: recoveryEnvelope.nonce,
        recoveryCiphertext: recoveryEnvelope.ciphertext,
      })
      .returning({ id: vaults.id });

    return NextResponse.json({
      success: true,
      message: "Vault enrolled successfully",
      vaultId: newVault.id,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Enroll vault error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
