import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { deleteInterview } from "@/lib/interviews/queries";

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
    await deleteInterview(id, userId);

    return NextResponse.json({ success: true, message: "Interview deleted successfully" });
  } catch (error: any) {
    console.error("POST /api/interviews/[id]/delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete interview" },
      { status: 400 }
    );
  }
}
