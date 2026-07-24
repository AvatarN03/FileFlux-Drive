import { NextResponse } from "next/server";

import { getAuthUser } from "../../_services";

export async function GET() {
  try {
    const user = await getAuthUser();
    
    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error:"Unauthorized",
      },
      {
        status: 401,
      }
    );
  }
}