// src/app/api/learning-path/list/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getLearningPathsList } from "@/lib/learningPath/queries";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const paths = await getLearningPathsList(userId);

    return NextResponse.json({ data: paths });
  } catch (error: any) {
    console.error("GET /api/learning-path/list error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
