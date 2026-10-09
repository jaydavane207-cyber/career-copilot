import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { updateInterview } from "@/lib/interviews/queries";
import { updateInterviewSchema } from "@/lib/interviews/schemas";

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
    const parsed = updateInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateInterview(id, userId, parsed.data);

    return NextResponse.json({ data: updated });
  } catch (error: any) {
    console.error("POST /api/interviews/[id]/update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update interview" },
      { status: 400 }
    );
  }
}
