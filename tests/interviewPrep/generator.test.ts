// tests/interviewPrep/generator.test.ts

import { describe, it, expect } from "vitest";
import {
  calculateCountdownAndUrgency,
  generateDailyPrepPlan,
  generatePrepChecklist,
  generatePrepResources,
  generateInterviewPrepPlan,
  generateUpcomingInterviewPrepSummary,
  CURATED_REVERSE_QUESTIONS,
} from "@/lib/interviewPrep/generator";
import { getCompanyIntelligence } from "@/lib/interviewPrep/companyData";

describe("Interview Prep Generator - calculateCountdownAndUrgency", () => {
  it("classifies interviews scheduled within 24 hours as critical urgency", () => {
    const now = new Date("2026-10-15T10:00:00Z");
    const interviewDate = new Date("2026-10-15T22:00:00Z"); // 12 hours away

    const result = calculateCountdownAndUrgency(interviewDate, now);

    expect(result.urgencyLevel).toBe("critical");
    expect(result.hoursUntil).toBe(12);
    expect(result.timeUntil).toBe("12h 0m");
  });

  it("classifies interviews scheduled within 2-3 days as high urgency", () => {
    const now = new Date("2026-10-15T10:00:00Z");
    const interviewDate = new Date("2026-10-17T14:00:00Z"); // ~52 hours away (2 days 4h)

    const result = calculateCountdownAndUrgency(interviewDate, now);

    expect(result.urgencyLevel).toBe("high");
    expect(result.hoursUntil).toBe(52);
    expect(result.timeUntil).toContain("2 days");
  });

  it("classifies interviews scheduled within 4-7 days as moderate urgency", () => {
    const now = new Date("2026-10-15T10:00:00Z");
    const interviewDate = new Date("2026-10-20T10:00:00Z"); // 5 days away (120 hours)

    const result = calculateCountdownAndUrgency(interviewDate, now);

    expect(result.urgencyLevel).toBe("moderate");
    expect(result.hoursUntil).toBe(120);
    expect(result.timeUntil).toContain("5 days");
  });

  it("classifies interviews scheduled beyond 7 days as low urgency", () => {
    const now = new Date("2026-10-15T10:00:00Z");
    const interviewDate = new Date("2026-10-25T10:00:00Z"); // 10 days away (240 hours)

    const result = calculateCountdownAndUrgency(interviewDate, now);

    expect(result.urgencyLevel).toBe("low");
    expect(result.hoursUntil).toBe(240);
  });

  it("handles concluded or in-progress interviews gracefully", () => {
    const now = new Date("2026-10-15T10:00:00Z");
    const interviewDate = new Date("2026-10-15T09:00:00Z"); // 1 hour ago

    const result = calculateCountdownAndUrgency(interviewDate, now);

    expect(result.timeUntil).toBe("Concluded or In Progress");
  });
});

describe("Interview Prep Generator - generateDailyPrepPlan", () => {
  it("tailors tasks specifically for TECHNICAL rounds", () => {
    const plan = generateDailyPrepPlan("TECHNICAL", "Google", "Backend Engineer", 48);

    expect(plan.today.some((t) => t.includes("coding patterns"))).toBe(true);
    expect(plan.today.some((t) => t.includes("system design"))).toBe(true);
    expect(plan.tomorrow).toBeDefined();
    expect(plan.interviewDay.length).toBeGreaterThanOrEqual(3);
  });

  it("tailors tasks specifically for HR & SCREENING rounds", () => {
    const plan = generateDailyPrepPlan("HR", "Microsoft", "Product Analyst", 12);

    expect(plan.today.some((t) => t.includes("elevator pitch"))).toBe(true);
    expect(plan.today.some((t) => t.includes("STAR format"))).toBe(true);
    // When <= 24 hours, tomorrow tasks are not scheduled
    expect(plan.tomorrow).toBeUndefined();
  });

  it("incorporates active learning path tasks into today's prep tasks", () => {
    const mockTasks = [
      { title: "Master Graph BFS & DFS Traversal", type: "PRACTICE" },
    ];

    const plan = generateDailyPrepPlan("TECHNICAL", "Amazon", "SDE-1", 48, mockTasks);

    expect(plan.today[0]).toContain("Targeted Study Task: Master Graph BFS & DFS Traversal");
  });
});

describe("Interview Prep Generator - Company Intelligence", () => {
  it("retrieves rich company intelligence for known companies like Google", () => {
    const intel = getCompanyIntelligence("Google", "SWE");

    expect(intel.name).toBe("Google");
    expect(intel.difficulty).toBe("Hard");
    expect(intel.averageRounds).toBe(5);
    expect(intel.keyValues).toContain("Googleyness");
    expect(intel.topQuestions.length).toBeGreaterThanOrEqual(2);
  });

  it("generates structured intelligence for arbitrary new companies", () => {
    const intel = getCompanyIntelligence("Stripe Labs", "Fullstack Developer");

    expect(intel.name).toBe("Stripe Labs");
    expect(intel.difficulty).toBe("Medium");
    expect(intel.keyValues.length).toBeGreaterThan(0);
    expect(intel.topQuestions.length).toBeGreaterThan(0);
  });
});

describe("Interview Prep Generator - Full Prep Plan Pipeline", () => {
  it("assembles complete InterviewPrepPlan data contract", () => {
    const mockInterview = {
      id: "evt-test-1",
      title: "Round 2: System Architecture",
      type: "TECHNICAL",
      mode: "ONLINE",
      scheduledStart: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days
      durationMin: 60,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      location: null,
      interviewerName: "Sarah Jenkins",
      notes: "Brush up on distributed caching and Kafka message queues",
      application: {
        id: "app-1",
        company: "Google",
        role: "Senior Backend Engineer",
      },
    };

    const mockLearningPath = {
      id: "path-1",
      title: "Backend Engineer 6-Week Mastery",
      durationWeeks: 6,
      weeks: [
        {
          weekNumber: 1,
          title: "System Design Foundations",
          tasks: [
            {
              id: "task-1",
              title: "Distributed Caching with Redis",
              type: "LEARN",
              durationMin: 60,
              resourceUrl: "https://redis.io/docs",
              status: "PENDING",
            },
          ],
        },
      ],
    };

    const plan = generateInterviewPrepPlan(mockInterview as any, mockLearningPath as any);

    expect(plan.interviewId).toBe("evt-test-1");
    expect(plan.company).toBe("Google");
    expect(plan.roundTitle).toBe("Round 2: System Architecture");
    expect(plan.urgencyLevel).toBe("high");
    expect(plan.checklist.length).toBe(8);
    expect(plan.resources.length).toBeGreaterThan(0);
    expect(plan.companyIntel.name).toBe("Google");
    expect(plan.learningPathIntegration?.activePathTitle).toBe("Backend Engineer 6-Week Mastery");
    expect(plan.reverseQuestionsToAsk).toEqual(CURATED_REVERSE_QUESTIONS);
  });

  it("generates upcoming prep summary for dashboard widgets", () => {
    const mockInterview = {
      id: "evt-test-2",
      title: "HR Screening",
      type: "HR",
      mode: "ONLINE",
      scheduledStart: new Date(Date.now() + 18 * 60 * 60 * 1000),
      durationMin: 30,
      meetingLink: null,
      application: {
        id: "app-2",
        company: "Microsoft",
        role: "Frontend Engineer",
      },
    };

    const summary = generateUpcomingInterviewPrepSummary(mockInterview as any);

    expect(summary.interviewId).toBe("evt-test-2");
    expect(summary.company).toBe("Microsoft");
    expect(summary.urgencyLevel).toBe("critical");
    expect(summary.todayTopTasks.length).toBeGreaterThan(0);
  });
});
