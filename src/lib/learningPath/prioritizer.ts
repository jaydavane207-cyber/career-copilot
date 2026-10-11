// src/lib/learningPath/prioritizer.ts
// Deterministic Skill Gap Prioritizer (No AI, 100% Deterministic)

import { RoleSkillDefinition } from "./roleTemplates";

export interface PrioritizedSkill {
  skill: string;
  importanceWeight: number;
  readiness: number;
  gap: number;
  priorityScore: number;
  isCore: boolean;
  isFromResumeGap: boolean;
}

export interface PrioritizationOptions {
  skills: RoleSkillDefinition[];
  userReadinessMap?: Record<string, number>;
  missingKeywords?: string[];
  durationWeeks?: number;
}

/**
 * Calculates priority score for each skill in a role template:
 *   gap = 100 - readiness
 *   priorityScore = gap * importanceWeight
 *   If skill appears in ResumeAnalysis missingKeywords: priorityScore *= 1.15
 *
 * Sorts descending and picks top N = min(12, durationWeeks * 2).
 */
export function prioritizeSkills({
  skills,
  userReadinessMap = {},
  missingKeywords = [],
  durationWeeks = 6,
}: PrioritizationOptions): PrioritizedSkill[] {
  const normalizedMissingKeywords = (missingKeywords || [])
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  const scoredSkills: PrioritizedSkill[] = skills.map((roleSkill) => {
    // 1. Determine readiness (from user readiness map, or role default, fallback 50)
    const skillKey = roleSkill.skill.toLowerCase();
    let readiness = 50;

    if (userReadinessMap[roleSkill.skill] !== undefined) {
      readiness = userReadinessMap[roleSkill.skill];
    } else {
      // Try case-insensitive lookup
      const foundEntry = Object.entries(userReadinessMap).find(
        ([k]) => k.toLowerCase() === skillKey
      );
      if (foundEntry) {
        readiness = foundEntry[1];
      } else if (roleSkill.defaultReadiness !== undefined) {
        readiness = roleSkill.defaultReadiness;
      }
    }

    // Clamp readiness between 0 and 100
    readiness = Math.max(0, Math.min(100, readiness));

    // 2. Calculate gap and base priorityScore
    const gap = 100 - readiness;
    let priorityScore = gap * roleSkill.importanceWeight;

    // 3. Bonus for skills in ResumeAnalysis missing keywords
    const isFromResumeGap = normalizedMissingKeywords.some((keyword) => {
      const lowerSkill = roleSkill.skill.toLowerCase();
      return (
        lowerSkill === keyword ||
        lowerSkill.includes(keyword) ||
        keyword.includes(lowerSkill)
      );
    });

    if (isFromResumeGap) {
      priorityScore = Math.round(priorityScore * 1.15 * 100) / 100;
    }

    return {
      skill: roleSkill.skill,
      importanceWeight: roleSkill.importanceWeight,
      readiness,
      gap,
      priorityScore,
      isCore: Boolean(roleSkill.isCore),
      isFromResumeGap,
    };
  });

  // Sort descending by priorityScore
  scoredSkills.sort((a, b) => {
    if (b.priorityScore !== a.priorityScore) {
      return b.priorityScore - a.priorityScore;
    }
    // Tie-breaker: core skills first
    if (a.isCore !== b.isCore) {
      return a.isCore ? -1 : 1;
    }
    // Alphabetical tie-breaker for deterministic output
    return a.skill.localeCompare(b.skill);
  });

  // Pick top N skills: min(12, durationWeeks * 2)
  const maxN = Math.min(12, Math.max(2, durationWeeks * 2));
  return scoredSkills.slice(0, maxN);
}
