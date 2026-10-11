// src/lib/learningPath/generator.ts
// Deterministic Planning Engine for Personalized Learning Path (Zero AI, 100% Free Resources)

import {
  getRoleTemplate,
  RoleTemplate,
  DEFAULT_ROLE_KEY,
} from "./roleTemplates";
import { prioritizeSkills, PrioritizedSkill } from "./prioritizer";
import {
  createLearnTask,
  createPracticeTask,
  createReviseTask,
  createMockTask,
  FOCUS_MODE_CONFIG,
  LearningPathFocusMode,
  LearningTaskType,
  TaskBlueprint,
} from "./taskTemplates";

export interface GeneratePlanOptions {
  durationWeeks?: number; // 4 | 6 | 8 | 12 (default 6)
  hoursPerWeek?: number; // 4 | 6 | 8 | 10 | 12 (default 6)
  focusMode?: LearningPathFocusMode; // BALANCED | OA_FIRST | INTERVIEW_FIRST (default BALANCED)
  targetRoleKey?: string;
  userReadinessMap?: Record<string, number>;
  missingKeywords?: string[];
  sourceResumeAnalysisId?: string;
}

export interface GeneratedWeek {
  weekNumber: number;
  title: string;
  goalSummary: string;
  skills: string[];
  tasks: TaskBlueprint[];
  totalMinutes: number;
}

export interface GeneratedLearningPath {
  title: string;
  targetRoleKey: string;
  durationWeeks: number;
  hoursPerWeek: number;
  focusMode: LearningPathFocusMode;
  sourceResumeAnalysisId?: string;
  totalMinutes: number;
  totalHours: number;
  weeks: GeneratedWeek[];
}

/**
 * Deterministic week-by-week study roadmap generator.
 */
export function generateLearningPath({
  durationWeeks = 6,
  hoursPerWeek = 6,
  focusMode = "BALANCED",
  targetRoleKey = DEFAULT_ROLE_KEY,
  userReadinessMap = {},
  missingKeywords = [],
  sourceResumeAnalysisId,
}: GeneratePlanOptions): GeneratedLearningPath {
  // Validate and clamp inputs
  const validDurationWeeks = [4, 6, 8, 12].includes(durationWeeks)
    ? durationWeeks
    : Math.max(4, Math.min(12, durationWeeks));
  const validHoursPerWeek = [4, 6, 8, 10, 12].includes(hoursPerWeek)
    ? hoursPerWeek
    : Math.max(4, Math.min(12, hoursPerWeek));
  const validFocusMode: LearningPathFocusMode =
    focusMode in FOCUS_MODE_CONFIG ? focusMode : "BALANCED";

  const roleTemplate: RoleTemplate = getRoleTemplate(targetRoleKey);

  // 1. Prioritize Skills (gap * importanceWeight, bonus for missingKeywords)
  const prioritized = prioritizeSkills({
    skills: roleTemplate.skills,
    userReadinessMap,
    missingKeywords,
    durationWeeks: validDurationWeeks,
  });

  // 2. Order skills so that core skills for SDE roles appear early
  // Core skills: DSA basics, arrays/strings, complexity, OOP
  const coreSkillNames = [
    "DSA Basics",
    "Arrays & Strings",
    "Time & Space Complexity",
    "Object-Oriented Programming (OOP)",
  ];

  const coreSkills: PrioritizedSkill[] = [];
  const otherSkills: PrioritizedSkill[] = [];

  for (const s of prioritized) {
    const isSdeCore = coreSkillNames.some(
      (c) => c.toLowerCase() === s.skill.toLowerCase()
    );
    if (isSdeCore || s.isCore) {
      coreSkills.push(s);
    } else {
      otherSkills.push(s);
    }
  }

  // Preserve core skills early, then non-core skills
  const orderedSkills = [...coreSkills, ...otherSkills];

  // 3. Week Allocation:
  // Spread selected skills across weeks:
  // <= 6 weeks: 1–2 primary skills/week
  // > 6 weeks: 2–3 primary skills/week
  const skillsPerWeek =
    validDurationWeeks <= 6
      ? Math.max(1, Math.min(2, Math.ceil(orderedSkills.length / validDurationWeeks)))
      : Math.max(2, Math.min(3, Math.ceil(orderedSkills.length / validDurationWeeks)));

  const weeklySkillsMap: Record<number, string[]> = {};
  const skillIntroducedWeek: Record<string, number> = {};

  let skillIndex = 0;
  for (let w = 1; w <= validDurationWeeks; w++) {
    const weekSkills: string[] = [];
    for (let s = 0; s < skillsPerWeek; s++) {
      if (skillIndex < orderedSkills.length) {
        const skillName = orderedSkills[skillIndex].skill;
        weekSkills.push(skillName);
        if (!skillIntroducedWeek[skillName]) {
          skillIntroducedWeek[skillName] = w;
        }
        skillIndex++;
      }
    }

    // If out of new skills, cycle back to the highest priority core skills for review/reinforcement
    if (weekSkills.length === 0) {
      const fallbackSkill = orderedSkills[w % orderedSkills.length]?.skill || "DSA Basics";
      weekSkills.push(fallbackSkill);
    }

    weeklySkillsMap[w] = weekSkills;
  }

  // 4. Spaced repetition map:
  // For each skill introduced in week W:
  // Add REVISE task in week W+1 and W+3 (if within plan)
  const scheduledRevisions: Record<number, { skill: string; originWeek: number }[]> = {};
  for (const [skill, w] of Object.entries(skillIntroducedWeek)) {
    const w1 = w + 1;
    const w3 = w + 3;

    if (w1 <= validDurationWeeks) {
      scheduledRevisions[w1] = scheduledRevisions[w1] || [];
      scheduledRevisions[w1].push({ skill, originWeek: w });
    }
    if (w3 <= validDurationWeeks) {
      scheduledRevisions[w3] = scheduledRevisions[w3] || [];
      scheduledRevisions[w3].push({ skill, originWeek: w });
    }
  }

  // 5. Generate Weekly Tasks scoped to weeklyMinutes budget
  const weeklyBudgetMin = validHoursPerWeek * 60;
  const generatedWeeks: GeneratedWeek[] = [];

  for (let w = 1; w <= validDurationWeeks; w++) {
    const weekSkills = weeklySkillsMap[w] || ["DSA Basics"];
    const isMilestoneWeek = w % 3 === 0;
    const primarySkill = weekSkills[0];
    const secondarySkill = weekSkills[1] || primarySkill;

    // Build raw candidate tasks for this week
    const candidateTasks: TaskBlueprint[] = [];

    // Bucket A: LEARN tasks
    candidateTasks.push(createLearnTask(primarySkill, 45));
    if (weekSkills.length > 1 && weekSkills[1] !== primarySkill) {
      candidateTasks.push(createLearnTask(secondarySkill, 45));
    }

    // Bucket B: PRACTICE tasks (scaled by focusMode)
    const practiceDuration =
      validFocusMode === "OA_FIRST" ? 75 : validFocusMode === "INTERVIEW_FIRST" ? 45 : 60;
    candidateTasks.push(createPracticeTask(primarySkill, validFocusMode, practiceDuration));
    if (validFocusMode === "OA_FIRST" || validHoursPerWeek >= 8) {
      candidateTasks.push(
        createPracticeTask(secondarySkill, validFocusMode, practiceDuration)
      );
    }

    // Bucket C: REVISE tasks (Spaced repetition)
    const revisionsForWeek = scheduledRevisions[w] || [];
    if (revisionsForWeek.length > 0) {
      // Pick up to 2 revisions
      for (const rev of revisionsForWeek.slice(0, 2)) {
        candidateTasks.push(createReviseTask(rev.skill, rev.originWeek, 30));
      }
    } else if (w > 1) {
      // If no spaced repetition due, add revision of previous week's primary skill
      const prevWeekSkills = weeklySkillsMap[w - 1] || [];
      if (prevWeekSkills.length > 0) {
        candidateTasks.push(createReviseTask(prevWeekSkills[0], w - 1, 30));
      }
    }

    // Bucket D: MOCK task (Every 3rd week, or for INTERVIEW_FIRST, or if budget allows)
    if (isMilestoneWeek || validFocusMode === "INTERVIEW_FIRST" || w === validDurationWeeks) {
      const mockDuration = validFocusMode === "INTERVIEW_FIRST" ? 60 : 45;
      candidateTasks.push(
        createMockTask(weekSkills, w, isMilestoneWeek, mockDuration)
      );
    }

    // Fit tasks strictly within weeklyBudgetMin and constrain between 3 and 6 tasks
    const fittedTasks = fitTasksToBudget(candidateTasks, weeklyBudgetMin, weekSkills);

    const totalMinutes = fittedTasks.reduce((sum, t) => sum + t.durationMin, 0);

    const weekTitle = isMilestoneWeek
      ? `Week ${w}: ${weekSkills.join(" & ")} (Milestone & Review)`
      : `Week ${w}: ${weekSkills.join(" & ")}`;

    const goalSummary = isMilestoneWeek
      ? `Consolidate ${weekSkills.join(", ")}, conduct spaced repetition drills, and complete interview simulation checkpoint.`
      : `Focus on mastering foundational patterns in ${weekSkills.join(", ")} through concept study and hands-on exercises.`;

    generatedWeeks.push({
      weekNumber: w,
      title: weekTitle,
      goalSummary,
      skills: weekSkills,
      tasks: fittedTasks,
      totalMinutes,
    });
  }

  const grandTotalMinutes = generatedWeeks.reduce(
    (sum, week) => sum + week.totalMinutes,
    0
  );
  const grandTotalHours = Math.round((grandTotalMinutes / 60) * 10) / 10;

  // Title formatting, e.g. "SDE-1 6-week roadmap"
  const shortRoleTitle =
    roleTemplate.key === "sde-1" ? "SDE-1" : roleTemplate.title.split("(")[0].trim();
  const pathTitle = `${shortRoleTitle} ${validDurationWeeks}-week roadmap`;

  return {
    title: pathTitle,
    targetRoleKey: roleTemplate.key,
    durationWeeks: validDurationWeeks,
    hoursPerWeek: validHoursPerWeek,
    focusMode: validFocusMode,
    sourceResumeAnalysisId,
    totalMinutes: grandTotalMinutes,
    totalHours: grandTotalHours,
    weeks: generatedWeeks,
  };
}

/**
 * Guarantees:
 * 1. Total weekly task durations <= budget
 * 2. Total task count is between 3 and 6
 */
function fitTasksToBudget(
  candidates: TaskBlueprint[],
  weeklyBudgetMin: number,
  weekSkills: string[]
): TaskBlueprint[] {
  let selected: TaskBlueprint[] = [];
  let currentSum = 0;

  for (const task of candidates) {
    if (selected.length >= 6) break;

    if (currentSum + task.durationMin <= weeklyBudgetMin) {
      selected.push({ ...task });
      currentSum += task.durationMin;
    }
  }

  // Ensure minimum 3 tasks while respecting budget
  if (selected.length < 3) {
    const needed = 3 - selected.length;
    for (let i = 0; i < needed; i++) {
      const remainingTime = weeklyBudgetMin - currentSum;
      const duration = Math.min(45, Math.max(30, remainingTime > 0 ? remainingTime : 30));

      const fallbackTask = createPracticeTask(
        weekSkills[i % weekSkills.length] || "Core Skills",
        "BALANCED",
        duration
      );

      // If adding exceeds budget, shrink the longest existing task to fit
      if (currentSum + duration > weeklyBudgetMin) {
        const overflow = currentSum + duration - weeklyBudgetMin;
        const longest = selected.reduce(
          (max, t) => (t.durationMin > max.durationMin ? t : max),
          selected[0]
        );
        if (longest && longest.durationMin - overflow >= 30) {
          longest.durationMin -= overflow;
          currentSum -= overflow;
          selected.push(fallbackTask);
          currentSum += duration;
        } else {
          // Keep duration clamped to remaining
          if (remainingTime >= 30) {
            fallbackTask.durationMin = remainingTime;
            selected.push(fallbackTask);
            currentSum += remainingTime;
          } else {
            // Shrink current tasks slightly to accommodate 3rd task
            const shrinkPerTask = Math.ceil((30 - remainingTime) / Math.max(1, selected.length));
            selected.forEach((t) => {
              t.durationMin = Math.max(30, t.durationMin - shrinkPerTask);
            });
            currentSum = selected.reduce((s, t) => s + t.durationMin, 0);
            fallbackTask.durationMin = Math.max(30, weeklyBudgetMin - currentSum);
            selected.push(fallbackTask);
            currentSum += fallbackTask.durationMin;
          }
        }
      } else {
        selected.push(fallbackTask);
        currentSum += duration;
      }
    }
  }

  // Final sanity clamp: ensure currentSum <= weeklyBudgetMin
  let totalMin = selected.reduce((s, t) => s + t.durationMin, 0);
  while (totalMin > weeklyBudgetMin) {
    const diff = totalMin - weeklyBudgetMin;
    const shrinkable = selected.find((t) => t.durationMin > 30);
    if (shrinkable) {
      const reduction = Math.min(diff, shrinkable.durationMin - 30);
      shrinkable.durationMin -= reduction;
      totalMin -= reduction;
      if (reduction === 0) break;
    } else {
      // If all are at 30, and count > 3, drop the last one
      if (selected.length > 3) {
        const popped = selected.pop();
        if (popped) totalMin -= popped.durationMin;
      } else {
        break;
      }
    }
  }

  // Ensure task count is between 3 and 6
  if (selected.length > 6) {
    selected = selected.slice(0, 6);
  }

  return selected;
}
