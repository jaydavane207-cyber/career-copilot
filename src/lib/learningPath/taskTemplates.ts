// src/lib/learningPath/taskTemplates.ts
// Deterministic static task blueprints and focus-mode bucket allocations (No AI)

import { getSkillResources, SkillResource } from "@/lib/constants/skillResources";

export type LearningTaskType = "LEARN" | "PRACTICE" | "REVISE" | "MOCK";
export type LearningPathFocusMode = "BALANCED" | "OA_FIRST" | "INTERVIEW_FIRST";

export interface FocusModeAllocation {
  practiceRatio: number;
  learnRatio: number;
  reviseRatio: number;
  mockRatio: number;
}

export const FOCUS_MODE_CONFIG: Record<LearningPathFocusMode, FocusModeAllocation> = {
  BALANCED: {
    practiceRatio: 0.45,
    learnRatio: 0.30,
    reviseRatio: 0.15,
    mockRatio: 0.10,
  },
  OA_FIRST: {
    practiceRatio: 0.60,
    learnRatio: 0.25,
    reviseRatio: 0.10,
    mockRatio: 0.05,
  },
  INTERVIEW_FIRST: {
    practiceRatio: 0.35,
    learnRatio: 0.25,
    reviseRatio: 0.15,
    mockRatio: 0.25,
  },
};

export interface TaskBlueprint {
  type: LearningTaskType;
  title: string;
  description: string;
  durationMin: number;
  resourceUrl?: string;
  resourceTitle?: string;
  skillIds: string[];
}

/**
 * Creates a LEARN task linking to a curated free resource.
 */
export function createLearnTask(skill: string, durationMin = 45): TaskBlueprint {
  const resources = getSkillResources(skill);
  const primaryResource: SkillResource | undefined = resources[0];

  return {
    type: "LEARN",
    title: `Master core principles & documentation for ${skill}`,
    description: `Read foundational concepts, best practices, and study architectural trade-offs for ${skill}. Summarize takeaways in notes.`,
    durationMin,
    resourceUrl: primaryResource?.url,
    resourceTitle: primaryResource ? `${primaryResource.title} (${primaryResource.provider})` : undefined,
    skillIds: [skill],
  };
}

/**
 * Creates a PRACTICE task tailored to coding exercises and mini-tasks.
 */
export function createPracticeTask(
  skill: string,
  focusMode: LearningPathFocusMode,
  durationMin = 60
): TaskBlueprint {
  const resources = getSkillResources(skill);
  // Prefer interactive / course / video or second resource for hands-on
  const practiceResource = resources.length > 1 ? resources[1] : resources[0];

  const oaPrefix = focusMode === "OA_FIRST" ? "[OA Drill] " : "";

  return {
    type: "PRACTICE",
    title: `${oaPrefix}Hands-on problem solving & implementation in ${skill}`,
    description: `Solve 2-3 focused coding problems or construct a minimal runnable feature utilizing ${skill} patterns. Test edge cases.`,
    durationMin,
    resourceUrl: practiceResource?.url,
    resourceTitle: practiceResource ? `${practiceResource.title} (${practiceResource.provider})` : undefined,
    skillIds: [skill],
  };
}

/**
 * Creates a REVISE task for spaced repetition from a prior week.
 */
export function createReviseTask(
  skill: string,
  originWeek: number,
  durationMin = 30
): TaskBlueprint {
  const resources = getSkillResources(skill);
  const resource = resources[0];

  return {
    type: "REVISE",
    title: `Spaced repetition review: ${skill} (from Week ${originWeek})`,
    description: `Re-evaluate core patterns learned in Week ${originWeek}. Re-solve 1 key problem without looking at solutions to consolidate recall.`,
    durationMin,
    resourceUrl: resource?.url,
    resourceTitle: resource ? `${resource.title} (${resource.provider})` : undefined,
    skillIds: [skill],
  };
}

/**
 * Creates a MOCK interview task tagged to the week's skills.
 */
export function createMockTask(
  skills: string[],
  weekNumber: number,
  isMilestoneWeek = false,
  durationMin = 45
): TaskBlueprint {
  const skillsLabel = skills.slice(0, 2).join(" & ");
  const milestoneTag = isMilestoneWeek ? "[Review + Mock Milestone] " : "";

  return {
    type: "MOCK",
    title: `${milestoneTag}Technical interview simulation: ${skillsLabel}`,
    description: `Practice articulating technical solutions out loud: explain time/space trade-offs, architecture choices, and answer 2-3 common interview questions on ${skillsLabel}.`,
    durationMin,
    resourceUrl: `https://devdocs.io/#q=${encodeURIComponent(skills[0] || "interview")}`,
    resourceTitle: `Interview Checkpoint Guide (${skillsLabel})`,
    skillIds: skills,
  };
}
