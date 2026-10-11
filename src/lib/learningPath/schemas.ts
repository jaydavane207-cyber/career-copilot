// src/lib/learningPath/schemas.ts
// Zod schemas for Learning Path API validation

import { z } from "zod";

export const generateLearningPathSchema = z.object({
  durationWeeks: z.number().int().min(1).max(52).default(6),
  hoursPerWeek: z.number().int().min(1).max(40).default(6),
  focusMode: z.enum(["BALANCED", "OA_FIRST", "INTERVIEW_FIRST"]).default("BALANCED"),
  targetRoleKey: z.string().optional().default("sde-1"),
  sourceResumeAnalysisId: z.string().optional().nullable(),
});

export type GenerateLearningPathInput = z.infer<typeof generateLearningPathSchema>;

export const updateTaskStatusSchema = z.object({
  status: z.enum(["PENDING", "DONE", "SKIPPED"]),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export const regenerateRemainingSchema = z.object({
  fromWeek: z.number().int().min(1).optional(),
});

export type RegenerateRemainingInput = z.infer<typeof regenerateRemainingSchema>;
