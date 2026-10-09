import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { createInterview } from "@/lib/interviews/queries";
import { createInterviewSchema } from "@/lib/interviews/schemas";

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createInterviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const interview = await createInterview(userId, parsed.data);

    return NextResponse.json({ data: interview }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/interviews/create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create interview" },
      { status: 400 }
    );
  }
}
