// src/lib/constants/skillResources.ts
// Curated 100% Free Resources Library for Developer Skills (No paid APIs, No web scraping)

export type ResourceType = "DOC" | "VIDEO" | "COURSE";

export interface SkillResource {
  title: string;
  provider: string;
  url: string;
  type: ResourceType;
  estimatedMinutes: number;
}

export const SKILL_RESOURCES_MAP: Record<string, SkillResource[]> = {
  // Core Algorithmic & Computer Science
  "DSA Basics": [
    {
      title: "Algorithms & Data Structures Free Crash Course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/data-structures-and-algorithms-in-python-free-crash-course/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "Data Structures Reference & Tutorials",
      provider: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/data-structures/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "NeetCode Roadmap - Core DSA Foundations",
      provider: "NeetCode",
      url: "https://neetcode.io/roadmap",
      type: "VIDEO",
      estimatedMinutes: 45,
    },
  ],

  "Arrays & Strings": [
    {
      title: "Array and String Manipulation Patterns",
      provider: "LeetCode Explore (Free)",
      url: "https://leetcode.com/explore/learn/card/array-and-string/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Two Pointers & Sliding Window In-Depth",
      provider: "freeCodeCamp YouTube",
      url: "https://www.youtube.com/watch?v=022A_p4jL40",
      type: "VIDEO",
      estimatedMinutes: 45,
    },
  ],

  "Time & Space Complexity": [
    {
      title: "Big-O Cheat Sheet & Complexity Guide",
      provider: "BigOCheatSheet",
      url: "https://www.bigocheatsheet.com/",
      type: "DOC",
      estimatedMinutes: 30,
    },
    {
      title: "Asymptotic Notation & Time Complexity Lecture",
      provider: "NPTEL",
      url: "https://nptel.ac.in/courses/106102064",
      type: "COURSE",
      estimatedMinutes: 45,
    },
  ],

  "Object-Oriented Programming (OOP)": [
    {
      title: "OOP Principles & Design Patterns Guide",
      provider: "Refactoring Guru",
      url: "https://refactoring.guru/design-patterns",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Object Oriented Programming Full Course",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=pTB0EiLXUC8",
      type: "VIDEO",
      estimatedMinutes: 60,
    },
  ],

  "Trees & Graphs": [
    {
      title: "Tree Data Structures & Traversal Algorithms",
      provider: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/binary-tree-data-structure/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Graph Algorithms Course for Technical Interviews",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU",
      type: "VIDEO",
      estimatedMinutes: 60,
    },
  ],

  "Dynamic Programming": [
    {
      title: "Dynamic Programming Patterns & Fundamentals",
      provider: "freeCodeCamp YouTube",
      url: "https://www.youtube.com/watch?v=oBt53YbR9Kk",
      type: "VIDEO",
      estimatedMinutes: 60,
    },
    {
      title: "DP Reference Handbook & Tabulation vs Memoization",
      provider: "GeeksforGeeks",
      url: "https://www.geeksforgeeks.org/dynamic-programming/",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "System Design": [
    {
      title: "System Design Primer by Donne Martin",
      provider: "GitHub Open Source",
      url: "https://github.com/donnemartin/system-design-primer",
      type: "DOC",
      estimatedMinutes: 60,
    },
    {
      title: "Distributed Systems Architecture Crash Course",
      provider: "MIT OpenCourseWare",
      url: "https://pdos.csail.mit.edu/6.824/schedule.html",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "System Design Interview Concepts for Beginners",
      provider: "Gaurav Sen YouTube",
      url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX",
      type: "VIDEO",
      estimatedMinutes: 45,
    },
  ],

  // Languages & Frontend
  "JavaScript": [
    {
      title: "MDN JavaScript Official Reference & Guide",
      provider: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "JavaScript Programming Full Course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "javascript.info - The Modern JavaScript Tutorial",
      provider: "JavaScript.info",
      url: "https://javascript.info/",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "TypeScript": [
    {
      title: "TypeScript Official Handbook & Documentation",
      provider: "TypeScript Docs",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "TypeScript Full Course for Beginners",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=gp5H0Vw39yw",
      type: "VIDEO",
      estimatedMinutes: 60,
    },
  ],

  "React": [
    {
      title: "React Official Documentation & Interactive Quick Start",
      provider: "React Official Docs",
      url: "https://react.dev/learn",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Full React Tutorial (Hooks, Context, State)",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/learn-react-by-building-10-projects/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
  ],

  "Next.js": [
    {
      title: "Next.js App Router Official Interactive Learn Course",
      provider: "Next.js Docs",
      url: "https://nextjs.org/learn",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "Next.js Documentation & Server Components Guide",
      provider: "Next.js Docs",
      url: "https://nextjs.org/docs",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "HTML/CSS & Responsive Design": [
    {
      title: "MDN Learn HTML & CSS Layouts",
      provider: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Responsive Web Design Certification",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
  ],

  // Backend, Databases & Infrastructure
  "Node.js": [
    {
      title: "Node.js Official Documentation & Guides",
      provider: "Node.js Docs",
      url: "https://nodejs.org/en/learn",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Node.js and Express.js Full Course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/free-8-hour-node-js-express-course/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
  ],

  "Express": [
    {
      title: "Express.js Getting Started & Routing Guide",
      provider: "Expressjs.com",
      url: "https://expressjs.com/en/starter/installing.html",
      type: "DOC",
      estimatedMinutes: 30,
    },
    {
      title: "REST APIs with Express and Node.js",
      provider: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "SQL & Databases": [
    {
      title: "PostgreSQL Official Tutorial",
      provider: "PostgreSQL Docs",
      url: "https://www.postgresql.org/docs/current/tutorial.html",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "SQL & Relational Database Design Full Course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/sql-and-databases-full-course/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "SQLZoo Interactive SQL Practice",
      provider: "SQLZoo",
      url: "https://sqlzoo.net/",
      type: "COURSE",
      estimatedMinutes: 45,
    },
  ],

  "NoSQL & MongoDB": [
    {
      title: "MongoDB University - Free Intro to MongoDB",
      provider: "MongoDB University",
      url: "https://learn.mongodb.com/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "MongoDB Official Manual",
      provider: "MongoDB Docs",
      url: "https://www.mongodb.com/docs/manual/",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "Redis & Caching": [
    {
      title: "Redis Official University Free Courses",
      provider: "Redis University",
      url: "https://university.redis.com/",
      type: "COURSE",
      estimatedMinutes: 45,
    },
    {
      title: "Redis Commands & In-Memory Caching Architecture",
      provider: "Redis Docs",
      url: "https://redis.io/docs/latest/",
      type: "DOC",
      estimatedMinutes: 30,
    },
  ],

  "Docker & Containers": [
    {
      title: "Docker Get Started Official Guide",
      provider: "Docker Docs",
      url: "https://docs.docker.com/get-started/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Docker Tutorial for Beginners",
      provider: "freeCodeCamp YouTube",
      url: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
      type: "VIDEO",
      estimatedMinutes: 60,
    },
  ],

  "Git & Version Control": [
    {
      title: "Pro Git Free Open-Source Book",
      provider: "Git SCM",
      url: "https://git-scm.com/book/en/v2",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Git and GitHub for Beginners - Full Crash Course",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      type: "VIDEO",
      estimatedMinutes: 45,
    },
  ],

  "REST APIs": [
    {
      title: "REST API Design Best Practices Handbook",
      provider: "RESTful API Guidelines",
      url: "https://restfulapi.net/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Building Scalable RESTful Services",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/rest-api-design-best-practices/",
      type: "DOC",
      estimatedMinutes: 30,
    },
  ],

  "Unit Testing": [
    {
      title: "Jest Official Getting Started Documentation",
      provider: "Jest Docs",
      url: "https://jestjs.io/docs/getting-started",
      type: "DOC",
      estimatedMinutes: 30,
    },
    {
      title: "Testing JavaScript Applications & Mocks",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=7r4xVDI2vho",
      type: "VIDEO",
      estimatedMinutes: 45,
    },
  ],

  "Computer Networks": [
    {
      title: "Computer Networks NPTEL Video Lectures",
      provider: "NPTEL",
      url: "https://nptel.ac.in/courses/106105081",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "HTTP Networking Protocols & Web Fundamentals",
      provider: "MDN Web Docs",
      url: "https://developer.mozilla.org/en-US/docs/Web/HTTP",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "Operating Systems": [
    {
      title: "Operating Systems Principles & Concurrency",
      provider: "NPTEL",
      url: "https://nptel.ac.in/courses/106106144",
      type: "COURSE",
      estimatedMinutes: 60,
    },
    {
      title: "Linux Command Line Basics for Developers",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/the-linux-commands-handbook/",
      type: "DOC",
      estimatedMinutes: 45,
    },
  ],

  "Web Security": [
    {
      title: "OWASP Top 10 Security Vulnerabilities & Mitigations",
      provider: "OWASP",
      url: "https://owasp.org/www-project-top-ten/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Web Security Fundamentals Course",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/news/learn-web-security-basics/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
  ],

  "CI/CD & GitHub Actions": [
    {
      title: "GitHub Actions Official Quickstart",
      provider: "GitHub Docs",
      url: "https://docs.github.com/en/actions/quickstart",
      type: "DOC",
      estimatedMinutes: 30,
    },
    {
      title: "Continuous Integration & Deployment Crash Course",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=R8_veQiYBjI",
      type: "VIDEO",
      estimatedMinutes: 45,
    },
  ],

  "Java": [
    {
      title: "Oracle Java Official Documentation & Tutorials",
      provider: "Oracle Docs",
      url: "https://docs.oracle.com/javase/tutorial/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Java Programming for Beginners Full Course",
      provider: "freeCodeCamp",
      url: "https://www.youtube.com/watch?v=A74TOX803D0",
      type: "VIDEO",
      estimatedMinutes: 60,
    },
  ],

  "Python": [
    {
      title: "Python Official Documentation & Tutorial",
      provider: "Python Docs",
      url: "https://docs.python.org/3/tutorial/",
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: "Scientific Computing with Python Certification",
      provider: "freeCodeCamp",
      url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
      type: "COURSE",
      estimatedMinutes: 60,
    },
  ],
};

/**
 * Normalizes a skill string to find curated resources, with fallback to DevDocs / freeCodeCamp.
 */
export function getSkillResources(skillName: string): SkillResource[] {
  if (!skillName) return getFallbackResources("General Engineering");

  const clean = skillName.trim();

  // 1. Direct match
  if (SKILL_RESOURCES_MAP[clean]) {
    return SKILL_RESOURCES_MAP[clean];
  }

  // 2. Case-insensitive exact or substring match
  const lower = clean.toLowerCase();
  for (const [key, resources] of Object.entries(SKILL_RESOURCES_MAP)) {
    const keyLower = key.toLowerCase();
    if (keyLower === lower || keyLower.includes(lower) || lower.includes(keyLower)) {
      return resources;
    }
  }

  // 3. Fallback
  return getFallbackResources(clean);
}

function getFallbackResources(skillName: string): SkillResource[] {
  const encoded = encodeURIComponent(skillName);
  return [
    {
      title: `${skillName} Reference & Official Documentation`,
      provider: "DevDocs",
      url: `https://devdocs.io/#q=${encoded}`,
      type: "DOC",
      estimatedMinutes: 45,
    },
    {
      title: `${skillName} Practical Study Guide & Exercises`,
      provider: "freeCodeCamp",
      url: `https://www.freecodecamp.org/news/search/?query=${encoded}`,
      type: "COURSE",
      estimatedMinutes: 60,
    },
  ];
}
