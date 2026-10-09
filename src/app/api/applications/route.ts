import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let applications = await prisma.application.findMany({
      where: { userId },
      include: {
        interviews: {
          orderBy: { scheduledStart: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // If empty for dev user, auto seed a few sample applications
    if (applications.length === 0) {
      await prisma.application.createMany({
        data: [
          {
            userId,
            company: "Google",
            role: "Software Engineer III",
            status: "INTERVIEW",
            salary: "₹45 LPA",
            location: "Bangalore",
          },
          {
            userId,
            company: "Microsoft",
            role: "Senior Full Stack Engineer",
            status: "APPLIED",
            salary: "₹42 LPA",
            location: "Hyderabad",
          },
          {
            userId,
            company: "Razorpay",
            role: "Backend Engineer",
            status: "INTERVIEW",
            salary: "₹28 LPA",
            location: "Bangalore",
          },
        ],
      });

      applications = await prisma.application.findMany({
        where: { userId },
        include: {
          interviews: {
            orderBy: { scheduledStart: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    return NextResponse.json({ data: applications });
  } catch (error: any) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await getAuthUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { company, role, status = "APPLIED", salary, location, notes } = body;

    if (!company || !role) {
      return NextResponse.json(
        { error: "Company and Role are required" },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        userId,
        company,
        role,
        status,
        salary,
        location,
        notes,
      },
    });

    return NextResponse.json({ data: application }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status: 500 }
    );
  }
}
