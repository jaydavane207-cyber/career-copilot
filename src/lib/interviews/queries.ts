import prisma from "@/lib/prisma";
import {
  CreateInterviewInput,
  UpdateInterviewInput,
  CompleteInterviewInput,
} from "./schemas";
import { InterviewStatus, InterviewType } from "@prisma/client";

export interface InterviewFilterOptions {
  from?: Date;
  to?: Date;
  status?: string;
  type?: string;
  applicationId?: string;
  scope?: "upcoming" | "all";
}

export async function getInterviewsForUser(
  userId: string,
  options: InterviewFilterOptions = {}
) {
  const where: any = { userId };

  if (options.applicationId) {
    where.applicationId = options.applicationId;
  }

  if (options.status) {
    const statuses = options.status.split(",") as InterviewStatus[];
    if (statuses.length === 1) {
      where.status = statuses[0];
    } else {
      where.status = { in: statuses };
    }
  }

  if (options.type) {
    where.type = options.type as InterviewType;
  }

  if (options.from || options.to) {
    where.scheduledStart = {};
    if (options.from) {
      where.scheduledStart.gte = options.from;
    }
    if (options.to) {
      where.scheduledStart.lte = options.to;
    }
  }

  return prisma.interviewEvent.findMany({
    where,
    include: {
      application: {
        select: {
          id: true,
          company: true,
          role: true,
          status: true,
        },
      },
    },
    orderBy: {
      scheduledStart: "asc",
    },
  });
}

export async function getUpcomingInterviews(
  userId: string,
  limit?: number,
  days: number = 7
) {
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return prisma.interviewEvent.findMany({
    where: {
      userId,
      status: InterviewStatus.SCHEDULED,
      scheduledStart: {
        gte: now,
        lte: futureDate,
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
}

export async function getInterviewById(id: string, userId: string) {
  return prisma.interviewEvent.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      application: {
        select: {
          id: true,
          company: true,
          role: true,
          status: true,
        },
      },
    },
  });
}

export async function createInterview(
  userId: string,
  data: CreateInterviewInput
) {
  // Validate that application belongs to user
  const app = await prisma.application.findFirst({
    where: {
      id: data.applicationId,
      userId,
    },
  });

  if (!app) {
    throw new Error("Application not found or unauthorized");
  }

  return prisma.interviewEvent.create({
    data: {
      userId,
      applicationId: data.applicationId,
      title: data.title,
      type: data.type as InterviewType,
      mode: data.mode,
      scheduledStart: new Date(data.scheduledStart),
      durationMin: data.durationMin,
      timezone: data.timezone || "Asia/Kolkata",
      meetingLink: data.meetingLink || null,
      location: data.location || null,
      interviewerName: data.interviewerName || null,
      status: data.status || InterviewStatus.SCHEDULED,
      outcome: data.outcome || null,
      notes: data.notes || null,
      feedback: data.feedback || null,
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
}

export async function updateInterview(
  id: string,
  userId: string,
  data: UpdateInterviewInput
) {
  const existing = await prisma.interviewEvent.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Interview not found or unauthorized");
  }

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.type !== undefined) updateData.type = data.type as InterviewType;
  if (data.mode !== undefined) updateData.mode = data.mode;
  if (data.scheduledStart !== undefined)
    updateData.scheduledStart = new Date(data.scheduledStart);
  if (data.durationMin !== undefined)
    updateData.durationMin = data.durationMin;
  if (data.timezone !== undefined) updateData.timezone = data.timezone;
  if (data.meetingLink !== undefined) updateData.meetingLink = data.meetingLink;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.interviewerName !== undefined)
    updateData.interviewerName = data.interviewerName;
  if (data.status !== undefined)
    updateData.status = data.status as InterviewStatus;
  if (data.outcome !== undefined) updateData.outcome = data.outcome;
  if (data.notes !== undefined) updateData.notes = data.notes;
  if (data.feedback !== undefined) updateData.feedback = data.feedback;

  return prisma.interviewEvent.update({
    where: { id },
    data: updateData,
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
}

export async function deleteInterview(id: string, userId: string) {
  const existing = await prisma.interviewEvent.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Interview not found or unauthorized");
  }

  return prisma.interviewEvent.delete({
    where: { id },
  });
}

export async function completeInterview(
  id: string,
  userId: string,
  data: CompleteInterviewInput
) {
  const existing = await prisma.interviewEvent.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Interview not found or unauthorized");
  }

  return prisma.interviewEvent.update({
    where: { id },
    data: {
      status: InterviewStatus.COMPLETED,
      outcome: data.outcome,
      feedback: data.feedback !== undefined ? data.feedback : existing.feedback,
      notes: data.notes !== undefined ? data.notes : existing.notes,
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
}

export async function getUserApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    select: {
      id: true,
      company: true,
      role: true,
      status: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
}
