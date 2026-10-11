# Personalized Learning Path Engine

## Overview
The **Personalized Learning Path** feature in Career Copilot automatically generates a week-by-week study roadmap targeting a user's specific skill gaps. It runs completely deterministically with an **AI Budget of $0** (no external AI calls, no OpenAI/Claude tokens, and no web scraping). All recommendations are powered by an algorithmic prioritization engine and a curated library of 100% free learning resources.

---

## 1. Skill Prioritization Engine

Skills are prioritized deterministically using role-specific benchmark templates, the user's readiness level, and optional keyword gaps detected in their latest resume analysis.

### Formula
For each skill $S$ in the target role template:
$$\text{gap} = 100 - \text{readiness}$$
$$\text{priorityScore} = \text{gap} \times \text{importanceWeight}$$

Where:
- $\text{readiness} \in [0, 100]$: User's measured skill readiness or self-assessment baseline (default: 50).
- $\text{importanceWeight} \in [1, 5]$: The importance of skill $S$ for the target role (1 = optional, 5 = critical core).

### Resume Gap Signal Multiplier
If skill $S$ appears in the user's `ResumeAnalysis.missingKeywords`:
$$\text{priorityScore} = \text{priorityScore} \times 1.15$$

### Selection & Cap
Skills are sorted descending by `priorityScore`. Ties are broken first by core skill status, then alphabetically. The top $N$ skills are selected:
$$N = \min(12, \text{durationWeeks} \times 2)$$

---

## 2. Focus Modes & Time Budgeting

Users can tailor their study balance based on their upcoming interview schedule:

| Focus Mode | Practice Ratio | Learning Ratio | Revision Ratio | Mock Ratio | Ideal For |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **BALANCED** | 45% | 30% | 15% | 10% | General comprehensive preparation |
| **OA_FIRST** | 60% | 25% | 10% | 5% | Upcoming Online Assessments & coding rounds |
| **INTERVIEW_FIRST** | 35% | 25% | 15% | 25% | Upcoming live technical & behavioral rounds |

### Time Budgeting Guarantees
- Weekly budget: $\text{weeklyMinutes} = \text{hoursPerWeek} \times 60$.
- Each individual task duration is scoped (30, 45, 60, 75, or 90 minutes).
- $\sum \text{task.durationMin} \le \text{weeklyMinutes}$.
- Weekly task counts are strictly bounded between **3 and 6 tasks** to prevent cognitive overload.

---

## 3. Week Allocation & Spaced Repetition

### Core Skills Ordering
For Software Engineering roles (SDE-1, Backend, Full Stack), fundamental computer science foundations are ordered into the earliest weeks:
1. DSA Basics & Problem-Solving Foundations
2. Arrays & Strings & Two-Pointer / Sliding Window Patterns
3. Time & Space Complexity (Big-O analysis)
4. Object-Oriented Programming (OOP) & Clean Design

### Spaced Repetition (Ebbinghaus Forgetting Curve)
For each skill introduced in week $W$:
- A **REVISE** task is scheduled in **Week $W + 1$** (1-week consolidation).
- A second **REVISE** task is scheduled in **Week $W + 3$** (3-week long-term retention).

### Milestone Weeks
Every 3rd week (Week 3, 6, 9, 12):
- Designated as a **Review & Mock Milestone**.
- Includes technical interview checklist questions and comprehensive spaced reviews.

---

## 4. Curated Free Resource Policy

Resources are defined in [`src/lib/constants/skillResources.ts`](file:///c:/Users/JAY/OneDrive/Desktop/projects/projcet2/src/lib/constants/skillResources.ts).

### Criteria
- **100% Free**: No paywalls, no trial credit cards, no login-locked content.
- **Provider Quality**:
  - Official documentation (React Docs, MDN Web Docs, PostgreSQL, Node.js, TypeScript).
  - Open courses & certifications (freeCodeCamp, NPTEL, MIT OpenCourseWare).
  - Free tutorials (NeetCode, GeeksforGeeks basics, DevDocs).
- **Zero Web Scraping**: In-code map guarantees zero runtime network failures, bot blocks, or outdated links.

---

## 5. Security & Persistence

- **Data Models**: `LearningPath`, `LearningWeek`, and `LearningTask` persisted to PostgreSQL via Prisma.
- **Tenant Isolation**: All read, write, toggle, and regeneration operations verify `userId` ownership matching the authenticated NextAuth session or dev fallback.
- **Regenerate Remaining Weeks**:
  - Users can refresh future weeks at any time.
  - Tasks marked as `DONE` are preserved and never overwritten.

---

## 6. Architecture & Limitations

### Deterministic Engine vs. LLM Prompts
- **Deterministic**: 100% reproducible, zero latency, runs instantly offline, $0 cost.
- **No AI Hallucinations**: Every suggested task maps to a known curriculum and verified resource link.
- **Extensible**: New skills or roles can be added by declaring them in `ROLE_TEMPLATES` and `SKILL_RESOURCES_MAP`.
