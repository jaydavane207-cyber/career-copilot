import { describe, it, expect } from "vitest";
import { prioritizeSkills } from "@/lib/learningPath/prioritizer";
import { RoleSkillDefinition } from "@/lib/learningPath/roleTemplates";

describe("Learning Path Prioritizer", () => {
  const sampleSkills: RoleSkillDefinition[] = [
    { skill: "DSA Basics", importanceWeight: 5, isCore: true, defaultReadiness: 50 },
    { skill: "System Design", importanceWeight: 3, isCore: false, defaultReadiness: 30 },
    { skill: "TypeScript", importanceWeight: 4, isCore: true, defaultReadiness: 80 },
    { skill: "Docker", importanceWeight: 2, isCore: false, defaultReadiness: 20 },
  ];

  it("prioritizes skills with highest (gap * importanceWeight) score", () => {
    // DSA Basics: gap = 50, importance = 5 => 250
    // System Design: gap = 70, importance = 3 => 210
    // TypeScript: gap = 20, importance = 4 => 80
    // Docker: gap = 80, importance = 2 => 160
    const result = prioritizeSkills({
      skills: sampleSkills,
      userReadinessMap: {
        "DSA Basics": 50,
        "System Design": 30,
        "TypeScript": 80,
        "Docker": 20,
      },
      durationWeeks: 6,
    });

    expect(result).toHaveLength(4);
    expect(result[0].skill).toBe("DSA Basics");
    expect(result[0].priorityScore).toBe(250);

    expect(result[1].skill).toBe("System Design");
    expect(result[1].priorityScore).toBe(210);

    expect(result[2].skill).toBe("Docker");
    expect(result[2].priorityScore).toBe(160);

    expect(result[3].skill).toBe("TypeScript");
    expect(result[3].priorityScore).toBe(80);
  });

  it("applies 1.15 bonus weight for skills present in ResumeAnalysis missingKeywords", () => {
    // Without resume keyword: Docker score = 80 * 2 = 160
    // With resume keyword: Docker score = 160 * 1.15 = 184
    const result = prioritizeSkills({
      skills: sampleSkills,
      userReadinessMap: {
        "DSA Basics": 50,
        "System Design": 30,
        "TypeScript": 80,
        "Docker": 20,
      },
      missingKeywords: ["Docker"],
      durationWeeks: 6,
    });

    const dockerResult = result.find((s) => s.skill === "Docker");
    expect(dockerResult).toBeDefined();
    expect(dockerResult?.isFromResumeGap).toBe(true);
    expect(dockerResult?.priorityScore).toBe(184);
  });

  it("caps selected skills at min(12, durationWeeks * 2)", () => {
    const manySkills: RoleSkillDefinition[] = Array.from({ length: 20 }, (_, i) => ({
      skill: `Skill ${i + 1}`,
      importanceWeight: 3,
      isCore: false,
      defaultReadiness: 40,
    }));

    // For 4 weeks: min(12, 4 * 2) = 8
    const result4Weeks = prioritizeSkills({
      skills: manySkills,
      durationWeeks: 4,
    });
    expect(result4Weeks).toHaveLength(8);

    // For 8 weeks: min(12, 8 * 2) = 12
    const result8Weeks = prioritizeSkills({
      skills: manySkills,
      durationWeeks: 8,
    });
    expect(result8Weeks).toHaveLength(12);
  });
});
