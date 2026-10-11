// src/app/api/learning-path/task/[taskId]/status/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { updateTaskStatusSchema } from "@/lib/learningPath/schemas";
import { updateTaskStatus } from "@/lib/learningPath/queries";
import { LearningTaskStatus } from "@prisma/client";

export async function POST(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { taskId } = params;
    if (!taskId) {
      return NextResponse.json({ error: "Missing taskId" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = updateTaskStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updatedTask = await updateTaskStatus(
      taskId,
      userId,
      parsed.data.status as LearningTaskStatus
    );

    return NextResponse.json({ data: updatedTask });
  } catch (error: any) {
    console.error("POST /api/learning-path/task/[taskId]/status error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
