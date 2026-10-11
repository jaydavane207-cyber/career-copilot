// src/app/api/learning-path/[pathId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getLearningPathById } from "@/lib/learningPath/queries";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { pathId: string } }
) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { pathId } = params;
    if (!pathId) {
      return NextResponse.json({ error: "Missing pathId" }, { status: 400 });
    }

    const learningPath = await getLearningPathById(pathId, userId);

    if (!learningPath) {
      return NextResponse.json(
        { error: "Learning path not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: learningPath });
  } catch (error: any) {
    console.error("GET /api/learning-path/[pathId] error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
