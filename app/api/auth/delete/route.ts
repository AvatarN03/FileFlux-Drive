import { NextResponse } from "next/server";

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: "Account deletion is currently disabled" },
    { status: 501 }
  );
}
