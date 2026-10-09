import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getOrCreateCalendarToken } from "@/lib/calendar/tokenService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getOrCreateCalendarToken(userId);
    const origin = req.nextUrl.origin || "http://localhost:3000";
    const feedUrl = `${origin}/api/calendar/interviews/${token}`;

    return NextResponse.json({
      token,
      feedUrl,
    });
  } catch (error: any) {
    console.error("GET /api/calendar/token error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve calendar token" },
      { status: 500 }
    );
  }
}
