import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { completeInterview } from "@/lib/interviews/queries";
import { completeInterviewSchema } from "@/lib/interviews/schemas";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const parsed = completeInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const completed = await completeInterview(id, userId, parsed.data);

    return NextResponse.json({ data: completed });
  } catch (error: any) {
    console.error("POST /api/interviews/[id]/complete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to mark interview as completed" },
      { status: 400 }
    );
  }
}
