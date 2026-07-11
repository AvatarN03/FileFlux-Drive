import { NextResponse } from "next/server";
import { getAuthUser } from "../../_services";

export async function GET() {
  try {
    const user = await getAuthUser();
    console.log("touch-3")


    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 401,
      }
    );
  }
}