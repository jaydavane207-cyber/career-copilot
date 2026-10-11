// src/app/api/learning-path/generate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { generateLearningPathSchema } from "@/lib/learningPath/schemas";
import { createLearningPathForUser } from "@/lib/learningPath/queries";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = generateLearningPathSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const learningPath = await createLearningPathForUser(userId, parsed.data);

    if (!learningPath) {
      return NextResponse.json(
        { error: "Failed to generate learning path" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        pathId: learningPath.id,
        data: learningPath,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/learning-path/generate error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
