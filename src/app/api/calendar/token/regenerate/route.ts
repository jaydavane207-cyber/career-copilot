import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { regenerateCalendarToken } from "@/lib/calendar/tokenService";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await regenerateCalendarToken(userId);
    const origin = req.nextUrl.origin || "http://localhost:3000";
    const feedUrl = `${origin}/api/calendar/interviews/${token}`;

    return NextResponse.json({
      token,
      feedUrl,
      message: "Calendar token regenerated successfully. Previous calendar feed URL is now revoked.",
    });
  } catch (error: any) {
    console.error("POST /api/calendar/token/regenerate error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to regenerate calendar token" },
      { status: 500 }
    );
  }
}
