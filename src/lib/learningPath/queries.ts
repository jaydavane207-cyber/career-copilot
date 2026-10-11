// src/lib/learningPath/queries.ts
// Prisma queries and persistence operations for Learning Paths

import prisma from "@/lib/prisma";
import { generateLearningPath } from "./generator";
import { GenerateLearningPathInput } from "./schemas";
import {
  LearningPathFocusMode,
  LearningTaskStatus,
  LearningTaskType,
} from "@prisma/client";

export interface PathSummary {
  id: string;
  title: string;
  targetRoleKey: string | null;
  durationWeeks: number;
  hoursPerWeek: number;
  focusMode: LearningPathFocusMode;
  createdAt: Date;
  updatedAt: Date;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
  currentWeekNumber: number;
}

export async function createLearningPathForUser(
  userId: string,
  input: GenerateLearningPathInput
) {
  // Generate deterministic plan
  const plan = generateLearningPath({
    durationWeeks: input.durationWeeks,
    hoursPerWeek: input.hoursPerWeek,
    focusMode: input.focusMode,
    targetRoleKey: input.targetRoleKey,
    sourceResumeAnalysisId: input.sourceResumeAnalysisId || undefined,
  });

  // Persist to Postgres via Prisma transaction
  return prisma.$transaction(async (tx) => {
    const learningPath = await tx.learningPath.create({
      data: {
        userId,
        title: plan.title,
        targetRoleKey: plan.targetRoleKey,
        durationWeeks: plan.durationWeeks,
        hoursPerWeek: plan.hoursPerWeek,
        focusMode: plan.focusMode as LearningPathFocusMode,
        sourceResumeAnalysisId: plan.sourceResumeAnalysisId,
      },
    });

    for (const weekData of plan.weeks) {
      const createdWeek = await tx.learningWeek.create({
        data: {
          pathId: learningPath.id,
          weekNumber: weekData.weekNumber,
          title: weekData.title,
          goalSummary: weekData.goalSummary,
          skillIds: weekData.skills,
        },
      });

      for (const taskData of weekData.tasks) {
        await tx.learningTask.create({
          data: {
            pathId: learningPath.id,
            weekId: createdWeek.id,
            userId,
            type: taskData.type as LearningTaskType,
            title: taskData.title,
            description: taskData.description,
            durationMin: taskData.durationMin,
            resourceUrl: taskData.resourceUrl,
            resourceTitle: taskData.resourceTitle,
            skillIds: taskData.skillIds,
            status: LearningTaskStatus.PENDING,
          },
        });
      }
    }

    return tx.learningPath.findUnique({
      where: { id: learningPath.id },
      include: {
        weeks: {
          orderBy: { weekNumber: "asc" },
          include: {
            tasks: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });
  });
}

export async function getLearningPathsList(userId: string): Promise<PathSummary[]> {
  const paths = await prisma.learningPath.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      },
    },
  });

  return paths.map((p) => {
    let totalTasks = 0;
    let completedTasks = 0;
    let currentWeekNumber = 1;
    let foundCurrentWeek = false;

    p.weeks.forEach((week) => {
      const weekTotal = week.tasks.length;
      const weekDone = week.tasks.filter((t) => t.status === LearningTaskStatus.DONE).length;

      totalTasks += weekTotal;
      completedTasks += weekDone;

      if (!foundCurrentWeek && weekDone < weekTotal) {
        currentWeekNumber = week.weekNumber;
        foundCurrentWeek = true;
      }
    });

    if (!foundCurrentWeek && p.weeks.length > 0) {
      currentWeekNumber = p.weeks.length;
    }

    const progressPercent =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      id: p.id,
      title: p.title,
      targetRoleKey: p.targetRoleKey,
      durationWeeks: p.durationWeeks,
      hoursPerWeek: p.hoursPerWeek,
      focusMode: p.focusMode,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      totalTasks,
      completedTasks,
      progressPercent,
      currentWeekNumber,
    };
  });
}

export async function getLearningPathById(pathId: string, userId: string) {
  const path = await prisma.learningPath.findFirst({
    where: {
      id: pathId,
      userId,
    },
    include: {
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          tasks: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!path) return null;

  let totalTasks = 0;
  let completedTasks = 0;

  const weeksWithProgress = path.weeks.map((week) => {
    const total = week.tasks.length;
    const completed = week.tasks.filter(
      (t) => t.status === LearningTaskStatus.DONE
    ).length;
    const weekProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalTasks += total;
    completedTasks += completed;

    return {
      ...week,
      progressPercent: weekProgress,
      totalTasks: total,
      completedTasks: completed,
    };
  });

  const overallProgressPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    ...path,
    weeks: weeksWithProgress,
    totalTasks,
    completedTasks,
    overallProgressPercent,
  };
}

export async function updateTaskStatus(
  taskId: string,
  userId: string,
  status: LearningTaskStatus
) {
  const existingTask = await prisma.learningTask.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    throw new Error("Task not found or unauthorized");
  }

  return prisma.learningTask.update({
    where: { id: taskId },
    data: {
      status,
      completedAt: status === LearningTaskStatus.DONE ? new Date() : null,
    },
  });
}

export async function regenerateRemainingWeeksForPath(
  pathId: string,
  userId: string,
  explicitFromWeek?: number
) {
  const path = await prisma.learningPath.findFirst({
    where: {
      id: pathId,
      userId,
    },
    include: {
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          tasks: true,
        },
      },
    },
  });

  if (!path) {
    throw new Error("Learning path not found or unauthorized");
  }

  // Determine starting week to regenerate
  let startWeek = explicitFromWeek;
  if (!startWeek) {
    const firstIncompleteWeek = path.weeks.find((w) =>
      w.tasks.some((t) => t.status !== LearningTaskStatus.DONE)
    );
    startWeek = firstIncompleteWeek ? firstIncompleteWeek.weekNumber : path.durationWeeks;
  }

  // Generate a fresh plan with the same parameters
  const freshPlan = generateLearningPath({
    durationWeeks: path.durationWeeks,
    hoursPerWeek: path.hoursPerWeek,
    focusMode: path.focusMode,
    targetRoleKey: path.targetRoleKey || undefined,
    sourceResumeAnalysisId: path.sourceResumeAnalysisId || undefined,
  });

  return prisma.$transaction(async (tx) => {
    for (const weekData of freshPlan.weeks) {
      if (weekData.weekNumber < startWeek) {
        // Skip past completed weeks
        continue;
      }

      // Find existing week record
      let existingWeek = path.weeks.find((w) => w.weekNumber === weekData.weekNumber);

      if (!existingWeek) {
        existingWeek = await tx.learningWeek.create({
          data: {
            pathId: path.id,
            weekNumber: weekData.weekNumber,
            title: weekData.title,
            goalSummary: weekData.goalSummary,
            skillIds: weekData.skills,
          },
          include: { tasks: true },
        });
      } else {
        // Update week meta
        await tx.learningWeek.update({
          where: { id: existingWeek.id },
          data: {
            title: weekData.title,
            goalSummary: weekData.goalSummary,
            skillIds: weekData.skills,
          },
        });
      }

      // Retain completed tasks in this week
      const completedTaskTitles = new Set(
        existingWeek.tasks
          .filter((t) => t.status === LearningTaskStatus.DONE)
          .map((t) => t.title.toLowerCase().trim())
      );

      // Remove tasks that are PENDING or SKIPPED
      await tx.learningTask.deleteMany({
        where: {
          weekId: existingWeek.id,
          status: {
            in: [LearningTaskStatus.PENDING, LearningTaskStatus.SKIPPED],
          },
        },
      });

      // Insert newly generated tasks if not already done
      for (const t of weekData.tasks) {
        if (!completedTaskTitles.has(t.title.toLowerCase().trim())) {
          await tx.learningTask.create({
            data: {
              pathId: path.id,
              weekId: existingWeek.id,
              userId,
              type: t.type as LearningTaskType,
              title: t.title,
              description: t.description,
              durationMin: t.durationMin,
              resourceUrl: t.resourceUrl,
              resourceTitle: t.resourceTitle,
              skillIds: t.skillIds,
              status: LearningTaskStatus.PENDING,
            },
          });
        }
      }
    }

    return getLearningPathById(path.id, userId);
  });
}
