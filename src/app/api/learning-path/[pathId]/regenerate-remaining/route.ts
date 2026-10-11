// src/app/api/learning-path/[pathId]/regenerate-remaining/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { regenerateRemainingSchema } from "@/lib/learningPath/schemas";
import { regenerateRemainingWeeksForPath } from "@/lib/learningPath/queries";

export async function POST(
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

    const body = await req.json().catch(() => ({}));
    const parsed = regenerateRemainingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updatedPath = await regenerateRemainingWeeksForPath(
      pathId,
      userId,
      parsed.data.fromWeek
    );

    return NextResponse.json({
      success: true,
      data: updatedPath,
    });
  } catch (error: any) {
    console.error(
      "POST /api/learning-path/[pathId]/regenerate-remaining error:",
      error
    );
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
