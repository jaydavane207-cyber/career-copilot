// src/lib/interviewPrep/generator.ts
// Deterministic engine for generating tailored interview preparation roadmaps and countdown reminders

import {
  InterviewPrepPlan,
  UpcomingInterviewPrepSummary,
  UrgencyLevel,
  PrepChecklistItem,
  PrepResource,
  DailyPrepPlan,
} from "./schemas";
import { getCompanyIntelligence } from "./companyData";
import { SKILL_RESOURCES_MAP } from "@/lib/constants/skillResources";

export interface InterviewWithApplication {
  id: string;
  title: string;
  type: string;
  mode: string;
  scheduledStart: Date | string;
  durationMin: number;
  meetingLink?: string | null;
  location?: string | null;
  interviewerName?: string | null;
  notes?: string | null;
  application: {
    id: string;
    company: string;
    role: string;
  };
}

export interface UserActiveLearningPath {
  id: string;
  title: string;
  durationWeeks: number;
  weeks: Array<{
    weekNumber: number;
    title: string;
    tasks: Array<{
      id: string;
      title: string;
      type: string;
      durationMin: number;
      resourceUrl?: string | null;
      status: string;
    }>;
  }>;
}

export function calculateCountdownAndUrgency(
  scheduledStartInput: Date | string,
  now: Date = new Date()
): { timeUntil: string; hoursUntil: number; urgencyLevel: UrgencyLevel } {
  const start = new Date(scheduledStartInput);
  const diffMs = start.getTime() - now.getTime();
  const hoursUntil = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let timeUntil: string;
  if (diffMs <= 0) {
    timeUntil = "Concluded or In Progress";
  } else if (diffMs < 60 * 60 * 1000) {
    const minutes = Math.max(1, Math.floor(diffMs / (60 * 1000)));
    timeUntil = `${minutes} min${minutes === 1 ? "" : "s"}`;
  } else if (diffMs < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const mins = Math.floor((diffMs % (60 * 60 * 1000)) / (60 * 1000));
    timeUntil = `${hours}h ${mins}m`;
  } else {
    const remHours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    timeUntil = `${diffDays} day${diffDays === 1 ? "" : "s"}, ${remHours}h`;
  }

  let urgencyLevel: UrgencyLevel = "low";
  if (hoursUntil <= 24) {
    urgencyLevel = "critical";
  } else if (hoursUntil <= 72) {
    urgencyLevel = "high";
  } else if (hoursUntil <= 168) {
    urgencyLevel = "moderate";
  }

  return { timeUntil, hoursUntil, urgencyLevel };
}

export function generateDailyPrepPlan(
  roundType: string,
  companyName: string,
  role: string,
  hoursUntil: number,
  matchingLearningTasks: Array<{ title: string; type: string }> = []
): DailyPrepPlan {
  const normalizedType = (roundType || "TECHNICAL").toUpperCase();
  const todayTasks: string[] = [];

  // Inject relevant learning path tasks if present
  if (matchingLearningTasks.length > 0) {
    const topTask = matchingLearningTasks[0];
    todayTasks.push(`Targeted Study Task: ${topTask.title} (${topTask.type})`);
  }

  switch (normalizedType) {
    case "TECHNICAL":
      todayTasks.push(`Review top 5 coding patterns: Two Pointers, Sliding Window, BFS/DFS, Binary Search for ${companyName}`);
      todayTasks.push("Walk through 1 complex system design / scalability pattern aloud");
      todayTasks.push("Practice explaining algorithmic space & time complexity before writing solution code");
      todayTasks.push(`Review your resume bullet points for ${role} stack and be ready to defend technical trade-offs`);
      break;

    case "OA":
      todayTasks.push("Solve 2 timed LeetCode medium problems under exam timer (45 minutes maximum)");
      todayTasks.push("Review tricky edge cases: null/empty inputs, integer overflow, 1-element arrays, extreme bounds");
      todayTasks.push("Check test environment hotkeys, boilerplate I/O code, and standard library data structures");
      break;

    case "HR":
    case "SCREENING":
      todayTasks.push(`Craft and rehearse 60-second elevator pitch answering 'Tell me about yourself' tailored to ${companyName}`);
      todayTasks.push("Prepare STAR format stories (Situation, Task, Action, Result) for Conflict, Leadership, and Biggest Win");
      todayTasks.push(`Research ${companyName}'s current products, public engineering blog posts, and company mission`);
      todayTasks.push("Review expected salary range benchmarks and reason for seeking this new role");
      break;

    case "MANAGERIAL":
      todayTasks.push("Formulate STAR examples demonstrating cross-functional leadership, mentoring, and technical trade-offs");
      todayTasks.push("Prepare a structured answer describing how you handle project scope changes and missing deadlines");
      todayTasks.push(`Draft 3 strategic questions regarding ${companyName}'s engineering culture and upcoming team roadmap`);
      break;

    default:
      todayTasks.push(`Review core technical competencies required for ${role} at ${companyName}`);
      todayTasks.push("Conduct a 30-minute self-mock interview answering standard behavioral and technical questions");
      todayTasks.push("Prepare your self-introduction and 3 reverse questions for the interviewer");
      break;
  }

  const tomorrowTasks: string[] = [];
  if (hoursUntil > 24) {
    tomorrowTasks.push(`Conduct 1 full 45-minute timed mock interview simulating ${companyName} questions`);
    tomorrowTasks.push(`Re-read ${companyName}'s core culture values and align your talking points with them`);
    tomorrowTasks.push("Complete a final pass over system design cheat sheets and API contract design rules");
  }

  const interviewDayTasks: string[] = [
    "Warm up with 1 easy coding problem or quick technical concept review to get in the zone",
    "Sanity check room lighting, camera angle, microphone audio, and meeting link 30 minutes prior",
    "Keep notepad, pen, a glass of water, and your resume copy right next to you",
    "Take 3 deep breaths: remember the interview is a collaborative technical conversation",
  ];

  return {
    today: todayTasks.slice(0, 4),
    tomorrow: tomorrowTasks.length > 0 ? tomorrowTasks : undefined,
    interviewDay: interviewDayTasks,
  };
}

export function generatePrepChecklist(
  mode: string,
  companyName: string
): PrepChecklistItem[] {
  const isOnline = mode.toUpperCase() === "ONLINE";

  const checklist: PrepChecklistItem[] = [
    {
      id: "chk-audio-video",
      category: "logistics",
      text: isOnline
        ? "Test webcam, microphone, and headphones inside the meeting app (Zoom/Meet/Teams) 30 min before start"
        : `Confirm commute route, parking, and arrive at ${companyName} reception 15 minutes early`,
    },
    {
      id: "chk-network",
      category: "logistics",
      text: isOnline
        ? "Verify stable Wi-Fi connection and ensure mobile phone personal hotspot is enabled on standby"
        : "Bring valid government ID and visitor pass confirmation for building security",
    },
    {
      id: "chk-workspace",
      category: "logistics",
      text: "Ensure clean, quiet space with optimal front-facing lighting and zero background noise",
    },
    {
      id: "chk-resume",
      category: "technical",
      text: "Have your resume and the target job description open in a side window for instant reference",
    },
    {
      id: "chk-notepad",
      category: "technical",
      text: "Keep physical scratch paper and a pen ready for sketching diagrams, flowcharts, or notes",
    },
    {
      id: "chk-company-values",
      category: "behavioral",
      text: `Review ${companyName}'s core values and incorporate 2-3 into your behavioral examples`,
    },
    {
      id: "chk-questions",
      category: "behavioral",
      text: "Prepare at least 3 thoughtful reverse questions to ask the interviewers about team culture & architecture",
    },
    {
      id: "chk-mindset",
      category: "mindset",
      text: "Hydrate, take slow breaths, and focus on thinking out loud collaboratively rather than rushing answers",
    },
  ];

  return checklist;
}

export function generatePrepResources(
  roundType: string,
  role: string
): PrepResource[] {
  const normalizedType = (roundType || "TECHNICAL").toUpperCase();
  const resources: PrepResource[] = [];

  if (normalizedType === "TECHNICAL" || normalizedType === "OA") {
    const dsa = SKILL_RESOURCES_MAP["DSA Basics"] || [];
    dsa.forEach((item, idx) => {
      resources.push({
        id: `res-dsa-${idx}`,
        title: item.title,
        url: item.url,
        type: item.type as any,
        durationMinutes: item.estimatedMinutes,
        source: item.provider,
        isFree: true,
      });
    });

    const complexity = SKILL_RESOURCES_MAP["Time & Space Complexity"] || [];
    if (complexity[0]) {
      resources.push({
        id: "res-complexity-0",
        title: complexity[0].title,
        url: complexity[0].url,
        type: complexity[0].type as any,
        durationMinutes: complexity[0].estimatedMinutes,
        source: complexity[0].provider,
        isFree: true,
      });
    }

    const sysDesign = SKILL_RESOURCES_MAP["System Design"] || [];
    if (sysDesign[0]) {
      resources.push({
        id: "res-sysdesign-0",
        title: sysDesign[0].title,
        url: sysDesign[0].url,
        type: sysDesign[0].type as any,
        durationMinutes: sysDesign[0].estimatedMinutes,
        source: sysDesign[0].provider,
        isFree: true,
      });
    }
  } else {
    // HR, Screening, Managerial
    resources.push(
      {
        id: "res-star-method",
        title: "The STAR Method for Behavioral Interviews Complete Guide",
        url: "https://www.freecodecamp.org/news/star-method-for-interviews/",
        type: "DOC",
        durationMinutes: 30,
        source: "freeCodeCamp",
        isFree: true,
      },
      {
        id: "res-questions-to-ask",
        title: "Top 38 Reverse Questions Candidates Should Ask Interviewers",
        url: "https://github.com/viraptor/reverse-interview",
        type: "DOC",
        durationMinutes: 20,
        source: "GitHub Open Source",
        isFree: true,
      },
      {
        id: "res-tech-elevator-pitch",
        title: "How to Answer 'Tell Me About Yourself' for Software Engineers",
        url: "https://www.youtube.com/results?search_query=tell+me+about+yourself+software+engineer+freecodecamp",
        type: "VIDEO",
        durationMinutes: 15,
        source: "YouTube",
        isFree: true,
      }
    );
  }

  return resources.slice(0, 4);
}

export const CURATED_REVERSE_QUESTIONS = [
  "What does success look like for someone in this role within the first 90 days?",
  "How does your engineering team manage technical debt and architectural refactoring alongside new feature delivery?",
  "What was the most challenging production outage or architectural bottleneck the team tackled recently?",
  "How are decisions made when there are disagreements between product management and engineering?",
  "What opportunities exist on this team for continuous learning and engineering leadership?",
];

export function generateInterviewPrepPlan(
  interview: InterviewWithApplication,
  activeLearningPath?: UserActiveLearningPath | null
): InterviewPrepPlan {
  const companyName = interview.application.company || "Target Company";
  const roleTitle = interview.application.role || "Software Engineer";

  const { timeUntil, hoursUntil, urgencyLevel } = calculateCountdownAndUrgency(
    interview.scheduledStart
  );

  // Determine connected tasks from Learning Path
  let matchingTasks: Array<{
    id: string;
    title: string;
    type: string;
    durationMin: number;
    resourceUrl?: string | null;
  }> = [];
  let relevantSkills: string[] = [];

  if (activeLearningPath) {
    const allTasks = activeLearningPath.weeks.flatMap((w) => w.tasks);
    // Find pending tasks
    const pendingTasks = allTasks.filter((t) => t.status === "PENDING");
    matchingTasks = pendingTasks.slice(0, 3);
    relevantSkills = ["System Design", "Problem Solving", "Core CS Foundations"];
  }

  const prepPlan = generateDailyPrepPlan(
    interview.type,
    companyName,
    roleTitle,
    hoursUntil,
    matchingTasks
  );

  const checklist = generatePrepChecklist(interview.mode, companyName);
  const resources = generatePrepResources(interview.type, roleTitle);
  const companyIntel = getCompanyIntelligence(companyName, roleTitle);

  return {
    interviewId: interview.id,
    company: companyName,
    role: roleTitle,
    roundTitle: interview.title,
    roundType: interview.type,
    mode: interview.mode,
    scheduledStart: new Date(interview.scheduledStart).toISOString(),
    durationMin: interview.durationMin,
    meetingLink: interview.meetingLink,
    location: interview.location,
    interviewerName: interview.interviewerName,
    notes: interview.notes,
    timeUntil,
    hoursUntil,
    urgencyLevel,
    prepPlan,
    checklist,
    resources,
    companyIntel,
    learningPathIntegration: activeLearningPath
      ? {
          activePathTitle: activeLearningPath.title,
          activeWeekNumber: activeLearningPath.weeks[0]?.weekNumber || 1,
          matchingTasks,
          relevantSkills,
        }
      : null,
    reverseQuestionsToAsk: CURATED_REVERSE_QUESTIONS,
  };
}

export function generateUpcomingInterviewPrepSummary(
  interview: InterviewWithApplication
): UpcomingInterviewPrepSummary {
  const { timeUntil, hoursUntil, urgencyLevel } = calculateCountdownAndUrgency(
    interview.scheduledStart
  );

  const plan = generateDailyPrepPlan(
    interview.type,
    interview.application.company,
    interview.application.role,
    hoursUntil
  );

  return {
    interviewId: interview.id,
    company: interview.application.company,
    role: interview.application.role,
    roundTitle: interview.title,
    roundType: interview.type,
    scheduledStart: new Date(interview.scheduledStart).toISOString(),
    durationMin: interview.durationMin,
    meetingLink: interview.meetingLink,
    timeUntil,
    hoursUntil,
    urgencyLevel,
    todayTopTasks: plan.today.slice(0, 2),
    totalChecklistCount: 8,
  };
}
