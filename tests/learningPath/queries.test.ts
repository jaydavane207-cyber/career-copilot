import { describe, it, expect, vi, beforeEach } from "vitest";
import { getLearningPathsList, getLearningPathById, updateTaskStatus } from "@/lib/learningPath/queries";
import prisma from "@/lib/prisma";
import { LearningTaskStatus } from "@prisma/client";

vi.mock("@/lib/prisma", () => ({
  default: {
    learningPath: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    learningTask: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe("Learning Path Queries", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates progress percentage correctly in getLearningPathsList", async () => {
    const mockPaths = [
      {
        id: "path-1",
        title: "SDE-1 6-week roadmap",
        targetRoleKey: "sde-1",
        durationWeeks: 6,
        hoursPerWeek: 6,
        focusMode: "BALANCED",
        createdAt: new Date(),
        updatedAt: new Date(),
        weeks: [
          {
            weekNumber: 1,
            tasks: [
              { id: "t1", status: LearningTaskStatus.DONE },
              { id: "t2", status: LearningTaskStatus.DONE },
            ],
          },
          {
            weekNumber: 2,
            tasks: [
              { id: "t3", status: LearningTaskStatus.PENDING },
              { id: "t4", status: LearningTaskStatus.PENDING },
            ],
          },
        ],
      },
    ];

    (prisma.learningPath.findMany as any).mockResolvedValue(mockPaths);

    const summaries = await getLearningPathsList("user-test-123");

    expect(prisma.learningPath.findMany).toHaveBeenCalledWith({
      where: { userId: "user-test-123" },
      orderBy: { createdAt: "desc" },
      include: expect.any(Object),
    });

    expect(summaries).toHaveLength(1);
    expect(summaries[0].totalTasks).toBe(4);
    expect(summaries[0].completedTasks).toBe(2);
    expect(summaries[0].progressPercent).toBe(50);
    expect(summaries[0].currentWeekNumber).toBe(2);
  });

  it("verifies user ownership and updates task status", async () => {
    (prisma.learningTask.findFirst as any).mockResolvedValue({
      id: "task-100",
      userId: "user-test-123",
      status: LearningTaskStatus.PENDING,
    });

    (prisma.learningTask.update as any).mockResolvedValue({
      id: "task-100",
      userId: "user-test-123",
      status: LearningTaskStatus.DONE,
      completedAt: new Date(),
    });

    const updated = await updateTaskStatus(
      "task-100",
      "user-test-123",
      LearningTaskStatus.DONE
    );

    expect(prisma.learningTask.findFirst).toHaveBeenCalledWith({
      where: {
        id: "task-100",
        userId: "user-test-123",
      },
    });

    expect(prisma.learningTask.update).toHaveBeenCalledWith({
      where: { id: "task-100" },
      data: {
        status: LearningTaskStatus.DONE,
        completedAt: expect.any(Date),
      },
    });

    expect(updated.status).toBe(LearningTaskStatus.DONE);
  });
});
