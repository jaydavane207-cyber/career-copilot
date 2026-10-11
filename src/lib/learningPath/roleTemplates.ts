// src/lib/learningPath/roleTemplates.ts
// Curated role skill templates with importance weights (1-5) and core skill markers

export interface RoleSkillDefinition {
  skill: string;
  importanceWeight: number; // 1 to 5
  isCore: boolean;
  defaultReadiness: number; // 0 to 100 baseline
}

export interface RoleTemplate {
  key: string;
  title: string;
  description: string;
  skills: RoleSkillDefinition[];
}

export const ROLE_TEMPLATES: Record<string, RoleTemplate> = {
  "sde-1": {
    key: "sde-1",
    title: "SDE-1 (Software Development Engineer I)",
    description: "Foundational software engineering targeting entry-to-junior SDE roles across Tier-1 and product companies.",
    skills: [
      { skill: "DSA Basics", importanceWeight: 5, isCore: true, defaultReadiness: 45 },
      { skill: "Arrays & Strings", importanceWeight: 5, isCore: true, defaultReadiness: 40 },
      { skill: "Time & Space Complexity", importanceWeight: 5, isCore: true, defaultReadiness: 50 },
      { skill: "Object-Oriented Programming (OOP)", importanceWeight: 4, isCore: true, defaultReadiness: 50 },
      { skill: "Trees & Graphs", importanceWeight: 4, isCore: false, defaultReadiness: 35 },
      { skill: "Dynamic Programming", importanceWeight: 4, isCore: false, defaultReadiness: 30 },
      { skill: "SQL & Databases", importanceWeight: 4, isCore: false, defaultReadiness: 55 },
      { skill: "Git & Version Control", importanceWeight: 3, isCore: false, defaultReadiness: 65 },
      { skill: "REST APIs", importanceWeight: 3, isCore: false, defaultReadiness: 60 },
      { skill: "System Design", importanceWeight: 3, isCore: false, defaultReadiness: 30 },
      { skill: "Unit Testing", importanceWeight: 2, isCore: false, defaultReadiness: 40 },
      { skill: "Computer Networks", importanceWeight: 3, isCore: false, defaultReadiness: 45 },
      { skill: "Operating Systems", importanceWeight: 3, isCore: false, defaultReadiness: 50 },
    ],
  },
  "frontend-dev": {
    key: "frontend-dev",
    title: "Frontend Engineer",
    description: "Modern client-side web development focused on React, TypeScript, state architectures, and responsive UX.",
    skills: [
      { skill: "JavaScript", importanceWeight: 5, isCore: true, defaultReadiness: 55 },
      { skill: "TypeScript", importanceWeight: 5, isCore: true, defaultReadiness: 45 },
      { skill: "React", importanceWeight: 5, isCore: true, defaultReadiness: 50 },
      { skill: "HTML/CSS & Responsive Design", importanceWeight: 4, isCore: true, defaultReadiness: 65 },
      { skill: "Next.js", importanceWeight: 4, isCore: false, defaultReadiness: 40 },
      { skill: "DSA Basics", importanceWeight: 3, isCore: false, defaultReadiness: 45 },
      { skill: "REST APIs", importanceWeight: 4, isCore: false, defaultReadiness: 60 },
      { skill: "Git & Version Control", importanceWeight: 3, isCore: false, defaultReadiness: 70 },
      { skill: "Unit Testing", importanceWeight: 3, isCore: false, defaultReadiness: 40 },
      { skill: "Web Security", importanceWeight: 2, isCore: false, defaultReadiness: 35 },
    ],
  },
  "backend-dev": {
    key: "backend-dev",
    title: "Backend Engineer",
    description: "High-performance server architecture, relational/in-memory databases, and distributed system fundamentals.",
    skills: [
      { skill: "DSA Basics", importanceWeight: 5, isCore: true, defaultReadiness: 45 },
      { skill: "Node.js", importanceWeight: 5, isCore: true, defaultReadiness: 50 },
      { skill: "SQL & Databases", importanceWeight: 5, isCore: true, defaultReadiness: 45 },
      { skill: "Object-Oriented Programming (OOP)", importanceWeight: 4, isCore: true, defaultReadiness: 55 },
      { skill: "REST APIs", importanceWeight: 4, isCore: false, defaultReadiness: 60 },
      { skill: "Redis & Caching", importanceWeight: 4, isCore: false, defaultReadiness: 30 },
      { skill: "System Design", importanceWeight: 4, isCore: false, defaultReadiness: 35 },
      { skill: "Docker & Containers", importanceWeight: 3, isCore: false, defaultReadiness: 40 },
      { skill: "Git & Version Control", importanceWeight: 3, isCore: false, defaultReadiness: 65 },
      { skill: "Unit Testing", importanceWeight: 3, isCore: false, defaultReadiness: 40 },
      { skill: "Computer Networks", importanceWeight: 3, isCore: false, defaultReadiness: 45 },
    ],
  },
  "fullstack-dev": {
    key: "fullstack-dev",
    title: "Full Stack Developer",
    description: "Comprehensive product engineering spanning React/Next.js frontend to Node/SQL services and deployment.",
    skills: [
      { skill: "JavaScript", importanceWeight: 5, isCore: true, defaultReadiness: 55 },
      { skill: "TypeScript", importanceWeight: 5, isCore: true, defaultReadiness: 45 },
      { skill: "React", importanceWeight: 5, isCore: true, defaultReadiness: 50 },
      { skill: "Node.js", importanceWeight: 4, isCore: true, defaultReadiness: 50 },
      { skill: "SQL & Databases", importanceWeight: 4, isCore: true, defaultReadiness: 45 },
      { skill: "DSA Basics", importanceWeight: 4, isCore: false, defaultReadiness: 40 },
      { skill: "Next.js", importanceWeight: 4, isCore: false, defaultReadiness: 40 },
      { skill: "REST APIs", importanceWeight: 4, isCore: false, defaultReadiness: 60 },
      { skill: "Docker & Containers", importanceWeight: 3, isCore: false, defaultReadiness: 35 },
      { skill: "Git & Version Control", importanceWeight: 3, isCore: false, defaultReadiness: 65 },
      { skill: "System Design", importanceWeight: 3, isCore: false, defaultReadiness: 30 },
    ],
  },
  "devops-engineer": {
    key: "devops-engineer",
    title: "DevOps & Cloud Engineer",
    description: "Continuous integration, container orchestration, Linux systems, and cloud infrastructure reliability.",
    skills: [
      { skill: "Linux & Shell Scripting", importanceWeight: 5, isCore: true, defaultReadiness: 50 },
      { skill: "Git & Version Control", importanceWeight: 5, isCore: true, defaultReadiness: 65 },
      { skill: "Docker & Containers", importanceWeight: 5, isCore: true, defaultReadiness: 40 },
      { skill: "CI/CD & GitHub Actions", importanceWeight: 4, isCore: true, defaultReadiness: 40 },
      { skill: "Computer Networks", importanceWeight: 4, isCore: false, defaultReadiness: 45 },
      { skill: "System Design", importanceWeight: 4, isCore: false, defaultReadiness: 35 },
      { skill: "Web Security", importanceWeight: 3, isCore: false, defaultReadiness: 40 },
      { skill: "SQL & Databases", importanceWeight: 3, isCore: false, defaultReadiness: 45 },
    ],
  },
};

export const DEFAULT_ROLE_KEY = "sde-1";

export function getRoleTemplate(roleKey?: string | null): RoleTemplate {
  if (roleKey && ROLE_TEMPLATES[roleKey]) {
    return ROLE_TEMPLATES[roleKey];
  }
  return ROLE_TEMPLATES[DEFAULT_ROLE_KEY];
}

export function getAllRoleTemplates(): RoleTemplate[] {
  return Object.values(ROLE_TEMPLATES);
}
