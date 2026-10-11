import { describe, it, expect } from "vitest";
import { generateLearningPath } from "@/lib/learningPath/generator";

describe("Learning Path Generator", () => {
  it("enforces weekly total minutes <= weekly budget (hoursPerWeek * 60)", () => {
    const testCases = [
      { durationWeeks: 4, hoursPerWeek: 4 },
      { durationWeeks: 6, hoursPerWeek: 6 },
      { durationWeeks: 8, hoursPerWeek: 8 },
      { durationWeeks: 12, hoursPerWeek: 12 },
    ];

    for (const { durationWeeks, hoursPerWeek } of testCases) {
      const budgetMinutes = hoursPerWeek * 60;
      const plan = generateLearningPath({
        durationWeeks,
        hoursPerWeek,
        focusMode: "BALANCED",
      });

      expect(plan.weeks).toHaveLength(durationWeeks);

      for (const week of plan.weeks) {
        const totalMin = week.tasks.reduce((sum, t) => sum + t.durationMin, 0);
        expect(totalMin).toBeLessThanOrEqual(budgetMinutes);
        expect(week.totalMinutes).toBeLessThanOrEqual(budgetMinutes);
      }
    }
  });

  it("enforces task counts per week to be between 3 and 6", () => {
    const focusModes: Array<"BALANCED" | "OA_FIRST" | "INTERVIEW_FIRST"> = [
      "BALANCED",
      "OA_FIRST",
      "INTERVIEW_FIRST",
    ];

    for (const focusMode of focusModes) {
      const plan = generateLearningPath({
        durationWeeks: 6,
        hoursPerWeek: 6,
        focusMode,
      });

      for (const week of plan.weeks) {
        expect(week.tasks.length).toBeGreaterThanOrEqual(3);
        expect(week.tasks.length).toBeLessThanOrEqual(6);
      }
    }
  });

  it("schedules spaced repetition REVISE tasks in Week W+1 and Week W+3", () => {
    const plan = generateLearningPath({
      durationWeeks: 6,
      hoursPerWeek: 8,
      focusMode: "BALANCED",
    });

    // Check week 1 skills
    const week1Skills = plan.weeks[0].skills;
    const primarySkill = week1Skills[0];

    // Week 1+1 = Week 2 should contain a REVISE task for primarySkill
    const week2 = plan.weeks[1];
    const week2ReviseTask = week2.tasks.find(
      (t) =>
        t.type === "REVISE" &&
        (t.skillIds.includes(primarySkill) ||
          t.title.toLowerCase().includes(primarySkill.toLowerCase()))
    );
    expect(week2ReviseTask).toBeDefined();

    // Week 1+3 = Week 4 should contain a REVISE task referencing primarySkill or week 1
    const week4 = plan.weeks[3];
    const week4ReviseTask = week4.tasks.find(
      (t) =>
        t.type === "REVISE" &&
        (t.skillIds.includes(primarySkill) ||
          t.title.toLowerCase().includes(primarySkill.toLowerCase()) ||
          t.title.includes("Week 1"))
    );
    expect(week4ReviseTask).toBeDefined();
  });

  it("includes review and mock emphasis every 3rd week", () => {
    const plan = generateLearningPath({
      durationWeeks: 6,
      hoursPerWeek: 6,
      focusMode: "BALANCED",
    });

    const week3 = plan.weeks[2]; // Week 3 (index 2)
    const week6 = plan.weeks[5]; // Week 6 (index 5)

    expect(week3.title).toContain("Milestone & Review");
    const week3MockTask = week3.tasks.find((t) => t.type === "MOCK");
    expect(week3MockTask).toBeDefined();

    expect(week6.title).toContain("Milestone & Review");
    const week6MockTask = week6.tasks.find((t) => t.type === "MOCK");
    expect(week6MockTask).toBeDefined();
  });

  it("ensures core SDE skills appear in early weeks", () => {
    const plan = generateLearningPath({
      durationWeeks: 6,
      hoursPerWeek: 6,
      targetRoleKey: "sde-1",
    });

    // Week 1 skills should include core SDE foundations (DSA Basics / Arrays & Strings)
    const week1Skills = plan.weeks[0].skills;
    const hasCoreFoundation = week1Skills.some((s) =>
      ["DSA Basics", "Arrays & Strings", "Time & Space Complexity"].includes(s)
    );
    expect(hasCoreFoundation).toBe(true);
  });
});
