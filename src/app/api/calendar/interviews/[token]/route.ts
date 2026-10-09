import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/calendar/tokenService";
import { getInterviewsForUser } from "@/lib/interviews/queries";
import { buildInterviewIcs } from "@/lib/calendar/interviewIcs";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    if (!token) {
      return new NextResponse("Token is required", { status: 400 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return new NextResponse("Invalid or expired calendar token", { status: 404 });
    }

    // Live calendar feed returns all active and upcoming interviews
    const interviews = await getInterviewsForUser(userId);
    const icsContent = buildInterviewIcs(interviews as any);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("GET /api/calendar/interviews/[token] error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
