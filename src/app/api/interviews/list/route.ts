import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import { getInterviewsForUser } from "@/lib/interviews/queries";
import { interviewFilterSchema } from "@/lib/interviews/schemas";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const parsed = interviewFilterSchema.safeParse({
      from: searchParams.get("from") || undefined,
      to: searchParams.get("to") || undefined,
      status: searchParams.get("status") || undefined,
      type: searchParams.get("type") || undefined,
      applicationId: searchParams.get("applicationId") || undefined,
      scope: searchParams.get("scope") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const filter = parsed.data;
    const options: any = {
      status: filter.status,
      type: filter.type,
      applicationId: filter.applicationId,
    };

    if (filter.from) options.from = new Date(filter.from);
    if (filter.to) options.to = new Date(filter.to);

    const interviews = await getInterviewsForUser(userId, options);

    return NextResponse.json({ data: interviews });
  } catch (error: any) {
    console.error("GET /api/interviews/list error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
