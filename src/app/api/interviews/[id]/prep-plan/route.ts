// src/app/api/interviews/[id]/prep-plan/route.ts
// Returns tailored day-by-day prep plan, countdown, company intel, and checklist for an interview

import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getInterviewPrepPlanById } from "@/lib/interviewPrep/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const prepPlan = await getInterviewPrepPlanById(id, userId);

    if (!prepPlan) {
      return NextResponse.json(
        { error: "Interview not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prepPlan,
    });
  } catch (error: any) {
    console.error("GET /api/interviews/[id]/prep-plan error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate interview prep plan" },
      { status: 500 }
    );
  }
}
