import { z } from "zod";

export const interviewTypeEnum = z.enum([
  "OA",
  "TECHNICAL",
  "HR",
  "MANAGERIAL",
  "SCREENING",
  "OTHER",
]);

export const interviewModeEnum = z.enum(["ONLINE", "OFFLINE"]);

export const interviewStatusEnum = z.enum([
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
]);

export const interviewOutcomeEnum = z.enum(["PASS", "FAIL", "PENDING"]);

export const createInterviewSchema = z.object({
  applicationId: z.string().min(1, "Job Application is required"),
  title: z.string().min(1, "Title is required").max(150),
  type: interviewTypeEnum.default("TECHNICAL"),
  mode: interviewModeEnum.default("ONLINE"),
  scheduledStart: z.string().or(z.date()).transform((val) => new Date(val)),
  durationMin: z.coerce.number().int().positive().default(45),
  timezone: z.string().default("Asia/Kolkata"),
  meetingLink: z.string().url("Must be a valid URL").optional().or(z.literal("")).nullable(),
  location: z.string().optional().nullable(),
  interviewerName: z.string().optional().nullable(),
  status: interviewStatusEnum.default("SCHEDULED"),
  outcome: interviewOutcomeEnum.optional().nullable(),
  notes: z.string().optional().nullable(),
  feedback: z.string().optional().nullable(),
});

export const updateInterviewSchema = createInterviewSchema.partial().extend({
  id: z.string().optional(),
});

export const completeInterviewSchema = z.object({
  outcome: interviewOutcomeEnum.default("PENDING"),
  feedback: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const interviewFilterSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  applicationId: z.string().optional(),
  scope: z.enum(["upcoming", "all"]).optional(),
});

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type CompleteInterviewInput = z.infer<typeof completeInterviewSchema>;
export type InterviewFilterInput = z.infer<typeof interviewFilterSchema>;
