// src/app/api/interviews/upcoming/prep/route.ts
// Returns prep summaries, countdowns, and top tasks for upcoming scheduled interviews

import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getUpcomingInterviewsPrep } from "@/lib/interviewPrep/queries";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const days = parseInt(searchParams.get("days") || "14", 10);

    const summaries = await getUpcomingInterviewsPrep(userId, limit, days);

    return NextResponse.json({
      success: true,
      data: summaries,
      total: summaries.length,
    });
  } catch (error: any) {
    console.error("GET /api/interviews/upcoming/prep error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch upcoming interview prep plans" },
      { status: 500 }
    );
  }
}
