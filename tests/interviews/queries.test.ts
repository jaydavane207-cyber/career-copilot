import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUpcomingInterviews } from "@/lib/interviews/queries";
import prisma from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  default: {
    interviewEvent: {
      findMany: vi.fn(),
    },
  },
}));

describe("Interview Queries - getUpcomingInterviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries upcoming interviews within the next 7 days with SCHEDULED status", async () => {
    const mockEvents = [
      {
        id: "evt-1",
        title: "Coding Round",
        scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: "SCHEDULED",
        application: { company: "Google", role: "SWE" },
      },
      {
        id: "evt-2",
        title: "HR Round",
        scheduledStart: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: "SCHEDULED",
        application: { company: "Microsoft", role: "Full Stack" },
      },
    ];

    (prisma.interviewEvent.findMany as any).mockResolvedValue(mockEvents);

    const result = await getUpcomingInterviews("user-test-123", 5, 7);

    expect(prisma.interviewEvent.findMany).toHaveBeenCalledTimes(1);
    const queryArg = (prisma.interviewEvent.findMany as any).mock.calls[0][0];

    expect(queryArg.where.userId).toBe("user-test-123");
    expect(queryArg.where.status).toBe("SCHEDULED");
    expect(queryArg.where.scheduledStart.gte).toBeInstanceOf(Date);
    expect(queryArg.where.scheduledStart.lte).toBeInstanceOf(Date);

    // Difference between lte and gte should be approximately 7 days (in ms)
    const diffDays =
      (queryArg.where.scheduledStart.lte.getTime() -
        queryArg.where.scheduledStart.gte.getTime()) /
      (1000 * 60 * 60 * 24);
    expect(Math.round(diffDays)).toBe(7);

    expect(queryArg.orderBy).toEqual({ scheduledStart: "asc" });
    expect(queryArg.take).toBe(5);
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe("Coding Round");
  });
});
