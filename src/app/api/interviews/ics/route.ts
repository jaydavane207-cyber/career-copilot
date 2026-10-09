import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getInterviewsForUser } from "@/lib/interviews/queries";
import { buildInterviewIcs } from "@/lib/calendar/interviewIcs";
import { InterviewStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const scope = searchParams.get("scope") || "upcoming";

    const options: any = {};
    if (scope === "upcoming") {
      options.status = InterviewStatus.SCHEDULED;
      options.from = new Date();
    }

    const interviews = await getInterviewsForUser(userId, options);
    const icsContent = buildInterviewIcs(interviews as any);

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="career-copilot-interviews.ics"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("GET /api/interviews/ics error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate ICS file" },
      { status: 500 }
    );
  }
}
