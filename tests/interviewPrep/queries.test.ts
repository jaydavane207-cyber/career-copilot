// tests/interviewPrep/queries.test.ts

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getInterviewPrepPlanById,
  getUpcomingInterviewsPrep,
  getImmediateNextInterviewPrep,
} from "@/lib/interviewPrep/queries";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    interviewEvent: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    learningPath: {
      findFirst: vi.fn(),
    },
  },
}));

describe("Interview Prep Queries - getInterviewPrepPlanById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null if interview event does not exist", async () => {
    (prisma.interviewEvent.findFirst as any).mockResolvedValue(null);

    const result = await getInterviewPrepPlanById("missing-id", "user-123");

    expect(result).toBeNull();
    expect(prisma.interviewEvent.findFirst).toHaveBeenCalledWith({
      where: {
        id: "missing-id",
        userId: "user-123",
      },
      include: {
        application: {
          select: {
            id: true,
            company: true,
            role: true,
          },
        },
      },
    });
  });

  it("fetches interview and active learning path, then returns complete plan", async () => {
    const mockInterview = {
      id: "evt-1",
      userId: "user-123",
      title: "System Design Round",
      type: "TECHNICAL",
      mode: "ONLINE",
      scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000),
      durationMin: 45,
      meetingLink: "https://zoom.us/j/123456",
      application: {
        id: "app-1",
        company: "Amazon",
        role: "Software Development Engineer",
      },
    };

    const mockPath = {
      id: "path-1",
      userId: "user-123",
      title: "SDE-1 8-Week Path",
      durationWeeks: 8,
      weeks: [
        {
          weekNumber: 1,
          title: "Foundations",
          tasks: [
            {
              id: "task-1",
              title: "System Design Basics",
              type: "LEARN",
              durationMin: 45,
              resourceUrl: null,
              status: "PENDING",
            },
          ],
        },
      ],
    };

    (prisma.interviewEvent.findFirst as any).mockResolvedValue(mockInterview);
    (prisma.learningPath.findFirst as any).mockResolvedValue(mockPath);

    const plan = await getInterviewPrepPlanById("evt-1", "user-123");

    expect(plan).not.toBeNull();
    expect(plan?.company).toBe("Amazon");
    expect(plan?.role).toBe("Software Development Engineer");
    expect(plan?.learningPathIntegration?.activePathTitle).toBe("SDE-1 8-Week Path");
  });
});

describe("Interview Prep Queries - getUpcomingInterviewsPrep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries upcoming interviews and returns mapped prep summaries", async () => {
    const mockInterviews = [
      {
        id: "evt-10",
        userId: "user-123",
        title: "Coding Round",
        type: "TECHNICAL",
        mode: "ONLINE",
        scheduledStart: new Date(Date.now() + 48 * 60 * 60 * 1000),
        durationMin: 60,
        meetingLink: "https://meet.google.com/xyz",
        application: {
          id: "app-10",
          company: "Google",
          role: "SWE",
        },
      },
    ];

    (prisma.interviewEvent.findMany as any).mockResolvedValue(mockInterviews);

    const results = await getUpcomingInterviewsPrep("user-123", 5, 14);

    expect(prisma.interviewEvent.findMany).toHaveBeenCalled();
    expect(results).toHaveLength(1);
    expect(results[0].company).toBe("Google");
    expect(results[0].roundTitle).toBe("Coding Round");
    expect(results[0].todayTopTasks.length).toBeGreaterThan(0);
  });
});

describe("Interview Prep Queries - getImmediateNextInterviewPrep", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when no upcoming interview exists", async () => {
    (prisma.interviewEvent.findFirst as any).mockResolvedValue(null);

    const result = await getImmediateNextInterviewPrep("user-123");
    expect(result).toBeNull();
  });
});
