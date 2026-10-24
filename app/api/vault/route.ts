import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { vaults } from "@/db/schema";
import { vaultEnvelopesSelect } from "@/db/selection";
import { isAuthError, verifyAuth } from "../_services";

export async function GET() {
  try {
    const { id: userId } = await verifyAuth();

    const [vault] = await db
      .select(vaultEnvelopesSelect)
      .from(vaults)
      .where(eq(vaults.userId, userId));

    if (!vault) {
      return NextResponse.json({
        success: true,
        enrolled: false,
        vault: null,
      });
    }

    return NextResponse.json({
      success: true,
      enrolled: true,
      vault,
    });
  } catch (error) {
    if (isAuthError(error)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    console.error("Fetch vault error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
