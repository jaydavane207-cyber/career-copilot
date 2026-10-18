// src/lib/interviewPrep/schemas.ts
// Type definitions and schemas for Interview Reminder & Prep Automation

import { CompanyIntelligence } from "./companyData";

export type UrgencyLevel = "critical" | "high" | "moderate" | "low";

export interface PrepChecklistItem {
  id: string;
  text: string;
  category: "logistics" | "technical" | "behavioral" | "mindset";
  isCompleted?: boolean;
}

export interface PrepResource {
  id: string;
  title: string;
  url: string;
  type: "DOC" | "VIDEO" | "COURSE" | "PRACTICE";
  durationMinutes: number;
  source: string;
  isFree: boolean;
}

export interface DailyPrepPlan {
  today: string[];
  tomorrow?: string[];
  interviewDay: string[];
}

export interface LearningPathLink {
  activePathTitle?: string;
  activeWeekNumber?: number;
  matchingTasks: Array<{
    id: string;
    title: string;
    type: string;
    durationMin: number;
    resourceUrl?: string | null;
  }>;
  relevantSkills: string[];
}

export interface InterviewPrepPlan {
  interviewId: string;
  company: string;
  role: string;
  roundTitle: string;
  roundType: string;
  mode: string;
  scheduledStart: string;
  durationMin: number;
  meetingLink?: string | null;
  location?: string | null;
  interviewerName?: string | null;
  notes?: string | null;
  timeUntil: string;
  hoursUntil: number;
  urgencyLevel: UrgencyLevel;
  prepPlan: DailyPrepPlan;
  checklist: PrepChecklistItem[];
  resources: PrepResource[];
  companyIntel: CompanyIntelligence;
  learningPathIntegration?: LearningPathLink | null;
  reverseQuestionsToAsk: string[];
}

export interface UpcomingInterviewPrepSummary {
  interviewId: string;
  company: string;
  role: string;
  roundTitle: string;
  roundType: string;
  scheduledStart: string;
  durationMin: number;
  meetingLink?: string | null;
  timeUntil: string;
  hoursUntil: number;
  urgencyLevel: UrgencyLevel;
  todayTopTasks: string[];
  totalChecklistCount: number;
}
