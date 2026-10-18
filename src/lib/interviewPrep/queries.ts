// src/lib/interviewPrep/queries.ts
// Database queries connecting InterviewEvents, LearningPaths, and Prep Automation

import prisma from "@/lib/prisma";
import {
  generateInterviewPrepPlan,
  generateUpcomingInterviewPrepSummary,
  UserActiveLearningPath,
} from "./generator";
import { InterviewPrepPlan, UpcomingInterviewPrepSummary } from "./schemas";
import { InterviewStatus } from "@prisma/client";

export async function getInterviewPrepPlanById(
  interviewId: string,
  userId: string
): Promise<InterviewPrepPlan | null> {
  const interview = await prisma.interviewEvent.findFirst({
    where: {
      id: interviewId,
      userId,
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

  if (!interview) {
    return null;
  }

  // Fetch user's latest active learning path if any
  const activePathRaw = await prisma.learningPath.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      weeks: {
        orderBy: {
          weekNumber: "asc",
        },
        include: {
          tasks: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
    },
  });

  let activeLearningPath: UserActiveLearningPath | null = null;
  if (activePathRaw) {
    activeLearningPath = {
      id: activePathRaw.id,
      title: activePathRaw.title,
      durationWeeks: activePathRaw.durationWeeks,
      weeks: activePathRaw.weeks.map((w) => ({
        weekNumber: w.weekNumber,
        title: w.title,
        tasks: w.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          type: t.type,
          durationMin: t.durationMin,
          resourceUrl: t.resourceUrl,
          status: t.status,
        })),
      })),
    };
  }

  return generateInterviewPrepPlan(interview, activeLearningPath);
}

export async function getUpcomingInterviewsPrep(
  userId: string,
  limit: number = 5,
  days: number = 14
): Promise<UpcomingInterviewPrepSummary[]> {
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);

  const interviews = await prisma.interviewEvent.findMany({
    where: {
      userId,
      status: InterviewStatus.SCHEDULED,
      scheduledStart: {
        gte: now,
        lte: future,
      },
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
    orderBy: {
      scheduledStart: "asc",
    },
    take: limit,
  });

  return interviews.map((item) => generateUpcomingInterviewPrepSummary(item));
}

export async function getImmediateNextInterviewPrep(
  userId: string
): Promise<InterviewPrepPlan | null> {
  const now = new Date();

  const nextInterview = await prisma.interviewEvent.findFirst({
    where: {
      userId,
      status: InterviewStatus.SCHEDULED,
      scheduledStart: {
        gte: now,
      },
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
    orderBy: {
      scheduledStart: "asc",
    },
  });

  if (!nextInterview) {
    return null;
  }

  return getInterviewPrepPlanById(nextInterview.id, userId);
}
