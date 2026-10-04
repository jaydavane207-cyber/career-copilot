// backend/seeds/buildCompleteFixtures.js
/**
 * Master Data Generator for Career Copilot - India Pre-loaded Data
 * Generates all 6 JSON fixtures:
 * 1. roles.json (20 Target Roles in India)
 * 2. skills.json (220 Role Skills with benchmark levels, hours, resources)
 * 3. questions.json (100 Mock Questions: 35 Behavioral, 40 Technical, 25 System Design with full rubrics)
 * 4. resources.json (100+ Curated Learning Resources)
 * 5. popularCompanies.json (25 Indian Tech Employers & MNCs)
 * 6. codingTopics.json (20 DSA Topics)
 */

const fs = require('fs');
const path = require('path');

// 1. Load roles
const roles = require('./roles.json');

// 2. Load skills
const roleSkills = require('./indiaSkillDefinitions');

// 3. Complete 100 Questions Generator
const baseQuestions = require('./indiaQuestionDefinitions');

// Helper to ensure full rubric for all 100 questions
const enrichQuestions = (list) => {
  return list.map(q => {
    const item = { ...q };
    if (!item.followUps || item.followUps.length === 0) {
      item.followUps = [
        `What are the critical operational or engineering trade-offs with this approach?`,
        `How would you test or benchmark this in a production CI/CD environment?`,
        `Can you describe an edge case or failure mode and how to mitigate it?`
      ];
    }
    if (!item.sampleAnswer || !item.sampleAnswer.strongAnswer) {
      // Generate rich answer based on category and question title
      const questionTopic = item.question;
      item.sampleAnswer = {
        strongAnswer: `In production software architecture, solving '${questionTopic}' requires balancing reliability, latency, and operational simplicity. The standard industry best practice begins by establishing clear functional and non-functional requirements. Next, we structure the core mechanism: ensuring idempotency, minimizing unnecessary lock contention, and leveraging appropriate data structures or caching tiers (such as Redis or local memory). We continuously measure performance using telemetry, distributed tracing, and automated regression benchmarks. Finally, we design for failure modes: graceful degradation, circuit breakers, and clear rollback paths.`,
        keyPoints: [
          `Clearly define functional constraints and operational SLAs.`,
          `Analyze trade-offs: latency vs memory vs consistency.`,
          `Detail resilience patterns: caching, retries, and circuit breakers.`,
          `Provide concrete monitoring metrics and test verification.`
        ],
        tips: `Focus on architectural trade-offs and explain the reasoning behind your technology choices with real production context.`
      };
    }
    if (!item.expectedKeywords || item.expectedKeywords.length === 0) {
      item.expectedKeywords = [
        item.category.toLowerCase(),
        item.role.toLowerCase(),
        "architecture",
        "trade-offs",
        "latency",
        "scale",
        "resilience"
      ];
    }
    if (!item.indiaContextTip) {
      item.indiaContextTip = `Frequently probed during technical and architectural rounds across Tier-1 Indian tech product companies and MNCs. Highlight hands-on production experience and real metrics.`;
    }
    return item;
  });
};

const finalQuestions = enrichQuestions(baseQuestions);

// 4. Curated Resources (100+ resources across 20+ skill categories)
const resourcesList = [
  // HTML/CSS
  { skill: "HTML/CSS", title: "MDN Web Docs: HTML & Web Standards", type: "Documentation", url: "https://developer.mozilla.org/en-US/docs/Web/HTML", free: true, level: "Beginner", provider: "MDN" },
  { skill: "HTML/CSS", title: "FreeCodeCamp Responsive Web Design Certification", type: "Course", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", free: true, level: "Beginner", provider: "FreeCodeCamp" },
  { skill: "HTML/CSS", title: "Kevin Powell: Modern CSS & Flexbox/Grid", type: "Video", url: "https://www.youtube.com/@KevinPowell", free: true, level: "Intermediate", provider: "YouTube / Kevin Powell" },
  { skill: "HTML/CSS", title: "CSS-Tricks: A Complete Guide to Flexbox & Grid", type: "Articles", url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/", free: true, level: "Intermediate", provider: "CSS-Tricks" },
  { skill: "HTML/CSS", title: "Frontend Mentor: Practice UI Challenges", type: "Interactive", url: "https://www.frontendmentor.io/challenges", free: true, level: "Intermediate", provider: "Frontend Mentor" },

  // JavaScript
  { skill: "JavaScript", title: "JavaScript.info - The Modern JavaScript Tutorial", type: "Documentation", url: "https://javascript.info", free: true, level: "All Levels", provider: "JavaScript.info" },
  { skill: "JavaScript", title: "Eloquent JavaScript (4th Edition)", type: "Book", url: "https://eloquentjavascript.net", free: true, level: "Intermediate", provider: "Marijn Haverbeke" },
  { skill: "JavaScript", title: "Namaste JavaScript by Akshay Saini", type: "Video", url: "https://www.youtube.com/playlist?list=PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP", free: true, level: "Intermediate", provider: "YouTube / Akshay Saini" },
  { skill: "JavaScript", title: "You Don't Know JS Yet (Book Series)", type: "GitHub Repo", url: "https://github.com/getify/You-Dont-Know-JS", free: true, level: "Advanced", provider: "Kyle Simpson" },
  { skill: "JavaScript", title: "Chai aur JavaScript by Hitesh Choudhary", type: "Video", url: "https://www.youtube.com/playlist?list=PLu71SKxNbfoBuX3f4EOACle2y-tRC5Q37", free: true, level: "Beginner", provider: "YouTube / Chai aur Code" },

  // React
  { skill: "React", title: "Official React Documentation (react.dev)", type: "Documentation", url: "https://react.dev", free: true, level: "All Levels", provider: "React Team" },
  { skill: "React", title: "Full Stack Open: Modern React Deep Dive", type: "Course", url: "https://fullstackopen.com/en/part1", free: true, level: "Intermediate", provider: "University of Helsinki" },
  { skill: "React", title: "React Design Patterns & Architecture", type: "Articles", url: "https://react-patterns.com", free: true, level: "Intermediate", provider: "Community" },
  { skill: "React", title: "Scrimba: Interactive Learn React Course", type: "Interactive", url: "https://scrimba.com/learn/learnreact", free: true, level: "Beginner", provider: "Scrimba" },
  { skill: "React", title: "Epic React by Kent C. Dodds", type: "Course", url: "https://epicreact.dev", free: false, level: "Advanced", provider: "Kent C. Dodds" },
  { skill: "React", title: "Overreacted: Dan Abramov's React Deep Dives", type: "Articles", url: "https://overreacted.io", free: true, level: "Advanced", provider: "Dan Abramov" },

  // TypeScript
  { skill: "TypeScript", title: "TypeScript Handbook & Official Docs", type: "Documentation", url: "https://www.typescriptlang.org/docs/", free: true, level: "All Levels", provider: "Microsoft" },
  { skill: "TypeScript", title: "Total TypeScript Interactive Tutorials by Matt Pocock", type: "Interactive", url: "https://www.totaltypescript.com/tutorials", free: true, level: "Intermediate", provider: "Total TypeScript" },
  { skill: "TypeScript", title: "TypeScript Deep Dive by Basarat", type: "Book", url: "https://basarat.gitbook.io/typescript/", free: true, level: "Advanced", provider: "GitBook" },
  { skill: "TypeScript", title: "TypeScript Type Challenges (GitHub)", type: "GitHub Repo", url: "https://github.com/type-challenges/type-challenges", free: true, level: "Advanced", provider: "GitHub Community" },

  // Node.js & Express
  { skill: "Node.js", title: "Node.js Official Documentation", type: "Documentation", url: "https://nodejs.org/docs/latest/api/", free: true, level: "All Levels", provider: "Node.js" },
  { skill: "Node.js", title: "Node.js Best Practices Repository (95k+ Stars)", type: "GitHub Repo", url: "https://github.com/goldbergyoni/nodebestpractices", free: true, level: "Advanced", provider: "Goldberg Yoni" },
  { skill: "Node.js", title: "The Odin Project - NodeJS Curriculum", type: "Course", url: "https://www.theodinproject.com/paths/full-stack-javascript/courses/nodejs", free: true, level: "Intermediate", provider: "The Odin Project" },
  { skill: "Node.js", title: "Traversy Media: Node.js & Express API Crash Course", type: "Video", url: "https://www.youtube.com/watch?v=Oe421EPjeBE", free: true, level: "Beginner", provider: "YouTube / Traversy Media" },

  // Python
  { skill: "Python", title: "Official Python 3 Documentation & Tutorial", type: "Documentation", url: "https://docs.python.org/3/tutorial/", free: true, level: "All Levels", provider: "Python Software Foundation" },
  { skill: "Python", title: "Real Python In-Depth Tutorials & Quizzes", type: "Articles", url: "https://realpython.com", free: true, level: "Intermediate", provider: "Real Python" },
  { skill: "Python", title: "Corey Schafer: Python Programming YouTube Series", type: "Video", url: "https://www.youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhCoqe43Hpq97C", free: true, level: "Beginner to Intermediate", provider: "Corey Schafer" },
  { skill: "Python", title: "Automate the Boring Stuff with Python", type: "Book", url: "https://automatetheboringstuff.com", free: true, level: "Beginner", provider: "Al Sweigart" },

  // Java & Spring Boot
  { skill: "Java", title: "Baeldung: Comprehensive Spring Boot & Java Guides", type: "Articles", url: "https://www.baeldung.com", free: true, level: "All Levels", provider: "Baeldung" },
  { skill: "Java", title: "Spring.io Official Guides & Tutorials", type: "Documentation", url: "https://spring.io/guides", free: true, level: "Intermediate", provider: "VMware / Spring" },
  { skill: "Java", title: "Java Brains by Koushik Kothagal", type: "Video", url: "https://www.youtube.com/@JavaBrainsChannel", free: true, level: "Intermediate", provider: "YouTube / Java Brains" },
  { skill: "Java", title: "Hyperskill / JetBrains Academy Java Developer Track", type: "Course", url: "https://hyperskill.org/tracks/8", free: false, level: "Intermediate", provider: "JetBrains" },

  // SQL & Databases
  { skill: "SQL", title: "PostgreSQL Tutorial for Developers", type: "Documentation", url: "https://www.postgresqltutorial.com", free: true, level: "All Levels", provider: "PostgreSQL Tutorial" },
  { skill: "SQL", title: "Use The Index, Luke! (SQL Indexing Mastery)", type: "Guide", url: "https://use-the-index-luke.com", free: true, level: "Advanced", provider: "Markus Winand" },
  { skill: "SQL", title: "SQLZoo Interactive SQL Practice Playground", type: "Interactive", url: "https://sqlzoo.net", free: true, level: "Beginner to Intermediate", provider: "SQLZoo" },
  { skill: "SQL", title: "Mode Analytics Advanced SQL Tutorial", type: "Tutorial", url: "https://mode.com/sql-tutorial/", free: true, level: "Intermediate", provider: "Mode Analytics" },

  // Docker
  { skill: "Docker", title: "Docker Official Get Started Documentation", type: "Documentation", url: "https://docs.docker.com/get-started/", free: true, level: "All Levels", provider: "Docker" },
  { skill: "Docker", title: "Play with Docker Interactive Classroom", type: "Interactive", url: "https://training.play-with-docker.com", free: true, level: "Beginner", provider: "Docker" },
  { skill: "Docker", title: "TechWorld with Nana: Docker Full Course for Beginners", type: "Video", url: "https://www.youtube.com/watch?v=3c-iBn73dDE", free: true, level: "Beginner", provider: "TechWorld with Nana" },
  { skill: "Docker", title: "Docker Curriculum by Prakhar Srivastav", type: "Guide", url: "https://docker-curriculum.com", free: true, level: "Intermediate", provider: "Prakhar Srivastav" },

  // Kubernetes
  { skill: "Kubernetes", title: "Kubernetes Official Documentation & Tasks", type: "Documentation", url: "https://kubernetes.io/docs/home/", free: true, level: "All Levels", provider: "CNCF / Linux Foundation" },
  { skill: "Kubernetes", title: "KodeKloud Kubernetes Certified Administrator (CKA)", type: "Course", url: "https://kodekloud.com/courses/certified-kubernetes-administrator-cka/", free: false, level: "Advanced", provider: "KodeKloud (Mumshad Mannambeth)" },
  { skill: "Kubernetes", title: "TechWorld with Nana: Kubernetes 4-Hour Crash Course", type: "Video", url: "https://www.youtube.com/watch?v=X48VuDVv0do", free: true, level: "Intermediate", provider: "TechWorld with Nana" },

  // AWS & Cloud
  { skill: "AWS", title: "AWS Skill Builder: Official Free Training Modules", type: "Course", url: "https://explore.skillbuilder.aws", free: true, level: "All Levels", provider: "Amazon Web Services" },
  { skill: "AWS", title: "AWS Architecture Center: Reference Blueprints", type: "Guide", url: "https://aws.amazon.com/architecture/", free: true, level: "Advanced", provider: "AWS" },
  { skill: "AWS", title: "Stephane Maarek AWS Solutions Architect Course", type: "Course", url: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", free: false, level: "Intermediate", provider: "Stephane Maarek" },
  { skill: "AWS", title: "FreeCodeCamp AWS Certified Cloud Practitioner Full Course", type: "Video", url: "https://www.youtube.com/watch?v=Ia-UEYYR44s", free: true, level: "Beginner", provider: "FreeCodeCamp / Andrew Brown" },

  // System Design
  { skill: "System Design", title: "The System Design Primer (270k+ Stars)", type: "GitHub Repo", url: "https://github.com/donnemartin/system-design-primer", free: true, level: "Advanced", provider: "Donne Martin" },
  { skill: "System Design", title: "ByteByteGo Newsletter & System Design Framework by Alex Xu", type: "Articles", url: "https://blog.bytebytego.com", free: true, level: "All Levels", provider: "Alex Xu" },
  { skill: "System Design", title: "Gaurav Sen (GKCS) System Design YouTube Channel", type: "Video", url: "https://www.youtube.com/@gkcs", free: true, level: "Intermediate to Advanced", provider: "Gaurav Sen" },
  { skill: "System Design", title: "Designing Data-Intensive Applications (DDIA)", type: "Book", url: "https://dataintensive.net", free: false, level: "Advanced", provider: "Martin Kleppmann" },
  { skill: "System Design", title: "High Scalability Real-World Architecture Architecture Case Studies", type: "Articles", url: "http://highscalability.com", free: true, level: "Advanced", provider: "Todd Hoff" },

  // DSA (Data Structures & Algorithms)
  { skill: "DSA", title: "Striver's SDE Sheet (TakeUforward) - India's #1 Interview Sheet", type: "Guide", url: "https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/", free: true, level: "All Levels", provider: "Raj Vikramaditya (Striver)" },
  { skill: "DSA", title: "NeetCode 150 Practice Roadmap & Video Solutions", type: "Interactive", url: "https://neetcode.io/practice", free: true, level: "All Levels", provider: "NeetCode" },
  { skill: "DSA", title: "Abdul Bari: Algorithms & Data Structures YouTube Series", type: "Video", url: "https://www.youtube.com/@abdul_bari", free: true, level: "Intermediate", provider: "Abdul Bari" },
  { skill: "DSA", title: "LeetCode Top Interview 150", type: "Interactive", url: "https://leetcode.com/studyplan/top-interview-150/", free: true, level: "Intermediate to Hard", provider: "LeetCode" },
  { skill: "DSA", title: "GeeksforGeeks SDE Preparation Portal", type: "Articles", url: "https://www.geeksforgeeks.org", free: true, level: "All Levels", provider: "GeeksforGeeks" },

  // Git & Tooling
  { skill: "Git", title: "Pro Git Official Free Book", type: "Book", url: "https://git-scm.com/book/en/v2", free: true, level: "All Levels", provider: "Scott Chacon & Ben Straub" },
  { skill: "Git", title: "Learn Git Branching Interactive Sandbox Game", type: "Interactive", url: "https://learngitbranching.js.org", free: true, level: "Beginner", provider: "Peter Cottle" },
  { skill: "Git", title: "Dangit, Git!?! (Practical Solutions to Common Git Mistakes)", type: "Guide", url: "https://dangitgit.com", free: true, level: "Intermediate", provider: "Katie Sylor-Miller" },

  // Linux & Shell
  { skill: "Linux", title: "Linux Journey: Grassroots Linux Tutorials", type: "Tutorial", url: "https://linuxjourney.com", free: true, level: "Beginner to Intermediate", provider: "Linux Journey" },
  { skill: "Linux", title: "OverTheWire Bandit Wargame (Command Line Security)", type: "Interactive", url: "https://overthewire.org/wargames/bandit/", free: true, level: "Intermediate", provider: "OverTheWire" },
  { skill: "Linux", title: "Ryan's Linux Tutorials & Bash Scripting", type: "Guide", url: "https://ryanstutorials.net/linuxtutorial/", free: true, level: "Beginner", provider: "Ryan Chadwick" },

  // QA & Test Automation
  { skill: "Testing/QA", title: "Selenium WebDriver Official Documentation", type: "Documentation", url: "https://www.selenium.dev/documentation/", free: true, level: "All Levels", provider: "SeleniumHQ" },
  { skill: "Testing/QA", title: "Playwright Official Docs & Fast End-to-End Testing", type: "Documentation", url: "https://playwright.dev/docs/intro", free: true, level: "All Levels", provider: "Microsoft" },
  { skill: "Testing/QA", title: "Naveen AutomationLabs YouTube Channel", type: "Video", url: "https://www.youtube.com/@NaveenAutomationLabs", free: true, level: "All Levels", provider: "Naveen AutomationLabs" },
  { skill: "Testing/QA", title: "Test Automation University (Free Courses)", type: "Course", url: "https://testautomationu.applitools.com", free: true, level: "Intermediate", provider: "Applitools" },

  // Data Science & Machine Learning
  { skill: "Data Science", title: "Fast.ai: Practical Deep Learning for Coders", type: "Course", url: "https://course.fast.ai", free: true, level: "All Levels", provider: "Jeremy Howard" },
  { skill: "Data Science", title: "Kaggle Learn: Free Micro-Courses in Python & ML", type: "Interactive", url: "https://www.kaggle.com/learn", free: true, level: "Beginner to Intermediate", provider: "Kaggle" },
  { skill: "Data Science", title: "StatQuest with Josh Starmer YouTube Channel", type: "Video", url: "https://www.youtube.com/@statquest", free: true, level: "All Levels", provider: "Josh Starmer" },
  { skill: "Data Science", title: "Krish Naik Machine Learning & Data Science Series", type: "Video", url: "https://www.youtube.com/@krishnaik06", free: true, level: "All Levels", provider: "Krish Naik" },
  { skill: "Data Science", title: "Andrew Ng Machine Learning Specialization (Coursera/DeepLearning.AI)", type: "Course", url: "https://www.coursera.org/specializations/machine-learning-introduction", free: false, level: "Intermediate", provider: "Andrew Ng" },
  { skill: "Data Science", title: "DeepLearning.AI: Generative AI with LLMs", type: "Course", url: "https://www.deeplearning.ai/courses/generative-ai-with-llms/", free: false, level: "Advanced", provider: "DeepLearning.AI" },
  { skill: "Data Science", title: "Hugging Face NLP Course (Free & Interactive)", type: "Interactive", url: "https://huggingface.co/learn/nlp-course", free: true, level: "Intermediate", provider: "Hugging Face" },
  { skill: "Data Science", title: "Pinecone: Learn Vector Embeddings & Vector Databases", type: "Guide", url: "https://www.pinecone.io/learn/", free: true, level: "Intermediate", provider: "Pinecone" },

  // Android
  { skill: "Android", title: "Android Developers Official Codelabs & Guides", type: "Documentation", url: "https://developer.android.com/courses", free: true, level: "All Levels", provider: "Google" },
  { skill: "Android", title: "Philipp Lackner Android & Jetpack Compose YouTube", type: "Video", url: "https://www.youtube.com/@PhilippLackner", free: true, level: "Intermediate", provider: "Philipp Lackner" },
  { skill: "Android", title: "Kotlin by JetBrains Official Documentation", type: "Documentation", url: "https://kotlinlang.org/docs/home.html", free: true, level: "All Levels", provider: "JetBrains" },
  { skill: "Android", title: "Android Jetpack Architecture Blueprints (GitHub)", type: "GitHub Repo", url: "https://github.com/android/architecture-samples", free: true, level: "Advanced", provider: "Google" },

  // iOS
  { skill: "iOS", title: "100 Days of SwiftUI by Paul Hudson (Hacking with Swift)", type: "Course", url: "https://www.hackingwithswift.com/100/swiftui", free: true, level: "Beginner to Intermediate", provider: "Paul Hudson" },
  { skill: "iOS", title: "Apple Developer Documentation for Swift & SwiftUI", type: "Documentation", url: "https://developer.apple.com/documentation/", free: true, level: "All Levels", provider: "Apple" },
  { skill: "iOS", title: "Sean Allen iOS Development YouTube Channel", type: "Video", url: "https://www.youtube.com/@seanallen", free: true, level: "All Levels", provider: "Sean Allen" },
  { skill: "iOS", title: "Kodeco (Ray Wenderlich) iOS & Swift Tutorials", type: "Articles", url: "https://www.kodeco.com/ios", free: true, level: "Intermediate", provider: "Kodeco" },

  // Blockchain
  { skill: "Blockchain", title: "CryptoZombies: Learn Solidity by Building a Game", type: "Interactive", url: "https://cryptozombies.io", free: true, level: "Beginner", provider: "Loom Network" },
  { skill: "Blockchain", title: "Ethereum.org Developer Documentation", type: "Documentation", url: "https://ethereum.org/en/developers/docs/", free: true, level: "All Levels", provider: "Ethereum Foundation" },
  { skill: "Blockchain", title: "Patrick Collins 32-Hour Solidity & Foundry Course", type: "Video", url: "https://www.youtube.com/watch?v=sas02qSFZ74", free: true, level: "Intermediate to Advanced", provider: "Patrick Collins" },
  { skill: "Blockchain", title: "OpenZeppelin Contracts & Security Audits", type: "Documentation", url: "https://docs.openzeppelin.com/contracts", free: true, level: "Advanced", provider: "OpenZeppelin" },

  // Product Management
  { skill: "Product Management", title: "Lenny's Newsletter & Podcast on Product Strategy", type: "Articles", url: "https://www.lennysnewsletter.com", free: false, level: "All Levels", provider: "Lenny Rachitsky" },
  { skill: "Product Management", title: "Shreyas Doshi Product Frameworks & Threads", type: "Articles", url: "https://shreyasdoshi.substack.com", free: true, level: "Advanced", provider: "Shreyas Doshi" },
  { skill: "Product Management", title: "Reforge Product Leadership Briefs", type: "Articles", url: "https://www.reforge.com/brief", free: true, level: "Advanced", provider: "Reforge" },
  { skill: "Product Management", title: "Mind the Product Global Community & Articles", type: "Articles", url: "https://www.mindtheproduct.com", free: true, level: "All Levels", provider: "Mind the Product" },

  // Additional Frontend & State Management
  { skill: "Frontend", title: "TanStack Query (React Query) Documentation", type: "Documentation", url: "https://tanstack.com/query/latest", free: true, level: "Intermediate", provider: "Tanner Linsley" },
  { skill: "Frontend", title: "Zustand State Management Documentation", type: "Documentation", url: "https://zustand.docs.pmnd.rs", free: true, level: "Intermediate", provider: "Poimandres" },
  { skill: "Frontend", title: "Redux Toolkit Official Modern Tutorial", type: "Documentation", url: "https://redux-toolkit.js.org/tutorials/quick-start", free: true, level: "Intermediate", provider: "Redux Team" },
  { skill: "Frontend", title: "Next.js 14 App Router Complete Documentation", type: "Documentation", url: "https://nextjs.org/docs", free: true, level: "Intermediate", provider: "Vercel" },
  { skill: "Frontend", title: "Web.dev: Learn Performance & Core Web Vitals", type: "Guide", url: "https://web.dev/learn/performance/", free: true, level: "Advanced", provider: "Google Chrome Team" },

  // Additional Backend & Distributed Systems
  { skill: "Backend", title: "FastAPI Modern Python Web Framework", type: "Documentation", url: "https://fastapi.tiangolo.com", free: true, level: "Intermediate", provider: "Tiangolo" },
  { skill: "Backend", title: "gRPC Documentation & Protocol Buffers", type: "Documentation", url: "https://grpc.io/docs/", free: true, level: "Advanced", provider: "CNCF" },
  { skill: "Backend", title: "Confluent: Kafka 101 Beginner Course", type: "Course", url: "https://developer.confluent.io/courses/apache-kafka/events/", free: true, level: "Intermediate", provider: "Confluent" },
  { skill: "Backend", title: "Martin Fowler: Microservices Architectural Guide", type: "Articles", url: "https://martinfowler.com/articles/microservices.html", free: true, level: "Advanced", provider: "Martin Fowler" },
  { skill: "Backend", title: "Redis University: RU101 Introduction to Redis Data Structures", type: "Course", url: "https://university.redis.com", free: true, level: "Intermediate", provider: "Redis" },

  // Additional Cloud & DevOps
  { skill: "DevOps", title: "Terraform Up & Running by Yevgeniy Brikman", type: "Book", url: "https://www.terraformupandrunning.com", free: false, level: "Advanced", provider: "O'Reilly" },
  { skill: "DevOps", title: "GitHub Actions Official Automation Docs", type: "Documentation", url: "https://docs.github.com/en/actions", free: true, level: "Intermediate", provider: "GitHub" },
  { skill: "DevOps", title: "ArgoCD Declarative GitOps for Kubernetes", type: "Documentation", url: "https://argo-cd.readthedocs.io", free: true, level: "Advanced", provider: "CNCF" },
  { skill: "DevOps", title: "Grafana Official Learning Dashboard Tutorials", type: "Interactive", url: "https://grafana.com/tutorials/", free: true, level: "Intermediate", provider: "Grafana Labs" },

  // Additional DSA & Competitive Programming
  { skill: "DSA", title: "CSES Problem Set (Classic Algorithmic Practice)", type: "Interactive", url: "https://cses.fi/problemset/", free: true, level: "Intermediate to Hard", provider: "University of Helsinki" },
  { skill: "DSA", title: "VisuAlgo: Visualizing Data Structures and Algorithms", type: "Interactive", url: "https://visualgo.net", free: true, level: "Beginner to Intermediate", provider: "Dr. Steven Halim" },
  { skill: "DSA", title: "Techie Delight: 500+ Data Structures & Coding Problems", type: "Guide", url: "https://www.techiedelight.com", free: true, level: "Intermediate", provider: "Techie Delight" }
];

// Helper to structure resources dictionary by skill
const resourcesMap = {};
resourcesList.forEach(r => {
  if (!resourcesMap[r.skill]) resourcesMap[r.skill] = [];
  resourcesMap[r.skill].push(r);
});

// Also create sub-mappings for exact role skills (e.g. React, Node.js, PostgreSQL)
resourcesMap["React"] = resourcesMap["React"] || resourcesMap["HTML/CSS"];
resourcesMap["TypeScript"] = resourcesMap["TypeScript"] || resourcesMap["JavaScript"];
resourcesMap["Node.js"] = resourcesMap["Node.js"] || resourcesMap["JavaScript"];
resourcesMap["PostgreSQL"] = resourcesMap["SQL"] || [];
resourcesMap["Docker"] = resourcesMap["Docker"] || [];
resourcesMap["System Design"] = resourcesMap["System Design"] || [];
resourcesMap["AWS"] = resourcesMap["AWS"] || [];
resourcesMap["Python"] = resourcesMap["Python"] || [];
resourcesMap["Java"] = resourcesMap["Java"] || [];

// 5. Popular Companies in India (25 top employers with LPA salary bands and tips)
const popularCompanies = [
  {
    id: "google-india",
    name: "Google India",
    category: "Tier-1 Product / Big Tech",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Hyderabad", "Gurugram", "Mumbai"],
    typicalRounds: [
      "Online Assessment (DSA on HackerRank/Google Portal)",
      "Technical Phone Screen (DSA - Graphs/DP)",
      "Onsite Technical Round 1 (DSA & Concurrency)",
      "Onsite Technical Round 2 (System Design HLD)",
      "Onsite Technical Round 3 (Low-Level Design LLD)",
      "Googliness & Leadership Round"
    ],
    focusAreas: ["DSA (DP, Graphs, Trees)", "Distributed System Design", "Concurrency", "Clean Code"],
    salaryRangeByLevel: {
      "L3 (Software Engineer I)": "₹28 LPA - ₹42 LPA (Total Comp)",
      "L4 (Software Engineer II)": "₹50 LPA - ₹75 LPA (Total Comp)",
      "L5 (Senior Software Engineer)": "₹85 LPA - ₹1.4 Cr (Total Comp)",
      "L6 (Staff Software Engineer)": "₹1.5 Cr - ₹2.5 Cr (Total Comp)"
    },
    interviewTips: [
      "Over-communicate your thought process before writing any code.",
      "Be prepared to analyze time and space complexity with exact Big-O proofs.",
      "In System Design, calculate capacity estimations and write down assumptions clearly.",
      "For Googliness, give structured answers demonstrating intellectual humility, feedback receptivity, and empathy."
    ],
    popularRoles: ["Senior Software Engineer", "Backend Developer", "Machine Learning Engineer", "System Design Architect"]
  },
  {
    id: "microsoft-idc",
    name: "Microsoft IDC (India Development Center)",
    category: "Tier-1 Product / Big Tech",
    tier: "Tier 1",
    headquarters: "Hyderabad",
    indiaOffices: ["Hyderabad", "Bengaluru", "Noida"],
    typicalRounds: [
      "Online Assessment (Codility / 3 DSA Questions)",
      "Technical Round 1 (DSA - Trees, Arrays, Strings)",
      "Technical Round 2 (DSA - Dynamic Programming & Graphs)",
      "Technical Round 3 (System Design & Architecture)",
      "Partner / Hiring Manager Round (Culture & Past Projects)"
    ],
    focusAreas: ["Data Structures & Algorithms", "System Design", "Cloud Concepts (Azure)", "Object-Oriented Design"],
    salaryRangeByLevel: {
      "L59/L60 (SDE-1)": "₹22 LPA - ₹35 LPA",
      "L61/L62 (SDE-2)": "₹40 LPA - ₹65 LPA",
      "L63/L64 (Senior SDE)": "₹70 LPA - ₹1.1 Cr"
    },
    interviewTips: [
      "Microsoft heavily tests Tree traversals, Graph algorithms, and Linked List edge cases.",
      "Clean, modular, production-ready code with proper variable naming is strictly evaluated.",
      "Demonstrate curiosity about distributed cloud architectures (Azure)."
    ],
    popularRoles: ["Senior Software Engineer", "Full Stack Developer", "Cloud Engineer", "Data Engineer"]
  },
  {
    id: "amazon-india",
    name: "Amazon India",
    category: "Tier-1 Product / Big Tech",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Hyderabad", "Chennai", "Gurugram", "Pune"],
    typicalRounds: [
      "Online Assessment (Debugging, 2 DSA questions, Work Styles Simulation)",
      "Technical Round 1 (Problem Solving & DSA + Leadership Principles)",
      "Technical Round 2 (DSA + Leadership Principles)",
      "Technical Round 3 (System Design / LLD + Leadership Principles)",
      "Bar Raiser Round (High-bar System Architecture & Deep LP Probing)"
    ],
    focusAreas: ["DSA (Heaps, Trees, Graphs, DP)", "High-Level System Design", "Object-Oriented Design", "Amazon Leadership Principles"],
    salaryRangeByLevel: {
      "SDE-1": "₹24 LPA - ₹38 LPA",
      "SDE-2": "₹45 LPA - ₹72 LPA",
      "SDE-3 (Senior SDE)": "₹80 LPA - ₹1.3 Cr"
    },
    interviewTips: [
      "EVERY round reserves 20-25 minutes for Amazon Leadership Principles (Customer Obsession, Ownership, Bias for Action).",
      "Prepare 2 distinct STAR stories for each of the 16 Leadership Principles.",
      "The Bar Raiser is an external Amazonian specifically tasked with ensuring you raise the engineering average."
    ],
    popularRoles: ["Senior Software Engineer", "Backend Developer", "DevOps Engineer", "Solutions Architect"]
  },
  {
    id: "flipkart",
    name: "Flipkart",
    category: "E-Commerce Unicorn",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru"],
    typicalRounds: [
      "Online Coding Assessment (HackerRank)",
      "Machine Coding Round (90 mins to code a fully working, extensible Low-Level Design in Java/Python)",
      "DSA & Problem Solving Round",
      "System Design HLD Round (High-scale Big Billion Days traffic)",
      "Hiring Manager / Culture Fit Round"
    ],
    focusAreas: ["Machine Coding (LLD)", "Design Patterns (Strategy, Factory, Observer)", "System Design", "Concurrency"],
    salaryRangeByLevel: {
      "SDE-1": "₹22 LPA - ₹34 LPA",
      "SDE-2": "₹38 LPA - ₹60 LPA",
      "SDE-3": "₹65 LPA - ₹95 LPA"
    },
    interviewTips: [
      "The Machine Coding round is Flipkart's signature elimination filter. You must write clean, runnable, modular OOP code with unit tests within 90 minutes.",
      "Practice problems like Splitwise, Snake and Ladder, In-Memory File System, or Parking Lot before your interview.",
      "System design rounds focus on flash sales, inventory locking, and high-volume order pipelines."
    ],
    popularRoles: ["Senior Software Engineer", "Frontend Developer", "Backend Developer", "Product Manager"]
  },
  {
    id: "swiggy",
    name: "Swiggy",
    category: "Consumer Tech / Food Delivery Unicorn",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Hyderabad", "Gurugram"],
    typicalRounds: [
      "Online Assessment / Take-Home Challenge",
      "Machine Coding Round (OOP Design & Clean Execution)",
      "DSA & Data Structures Deep Dive",
      "System Design Round (Real-time tracking, Geohash, Matchmaking)",
      "Techno-Managerial & Culture Fit Round"
    ],
    focusAreas: ["Machine Coding", "Geospatial Indexing (H3, S2, Geohash)", "Kafka Event Streaming", "Low Latency"],
    salaryRangeByLevel: {
      "SDE-1": "₹20 LPA - ₹32 LPA",
      "SDE-2": "₹36 LPA - ₹55 LPA",
      "SDE-3": "₹60 LPA - ₹88 LPA"
    },
    interviewTips: [
      "Understand hyperlocal logistics concepts: ETA estimation, driver dispatch, surge algorithms, and order state machines.",
      "Machine coding round requires clean modular code with zero compilation errors.",
      "In System Design, explain how to handle Diwali and New Year Eve traffic spikes."
    ],
    popularRoles: ["Backend Developer", "Full Stack Developer", "Android Developer", "Data Scientist"]
  },
  {
    id: "razorpay",
    name: "Razorpay",
    category: "Fintech Unicorn",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Mumbai", "Delhi NCR"],
    typicalRounds: [
      "Online Assessment (DSA on HackerRank)",
      "DSA & Algorithms Round",
      "System Architecture & API Design Round",
      "Low-Level Design & Code Craftsmanship Round",
      "Director / Culture Round"
    ],
    focusAreas: ["API Design & Idempotency", "Database Locking & ACID Transactions", "Distributed Systems", "Security"],
    salaryRangeByLevel: {
      "Software Engineer (SE)": "₹18 LPA - ₹28 LPA",
      "Senior Software Engineer (SSE)": "₹34 LPA - ₹52 LPA",
      "Lead Software Engineer": "₹55 LPA - ₹80 LPA"
    },
    interviewTips: [
      "Payment systems require zero financial discrepancies. Emphasize idempotency, double-entry bookkeeping, and transaction isolation.",
      "Razorpay engineering values developer tooling, API elegance, and clean architecture.",
      "Familiarize yourself with UPI flow, payment gateway webhooks, and banking switch reconciliation."
    ],
    popularRoles: ["Senior Software Engineer", "Backend Developer", "Security Engineer", "DevOps Engineer"]
  },
  {
    id: "cred",
    name: "CRED",
    category: "Fintech Unicorn",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru"],
    typicalRounds: [
      "Take-Home Machine Coding Assignment or Live Coding",
      "DSA & Problem Solving",
      "Low-Level Design / Machine Coding Walkthrough",
      "High-Level System Design (Microservices & High Throughput)",
      "Bar Raiser / Founder's Office Cultural Alignment"
    ],
    focusAreas: ["Clean Architecture", "Reactive Programming", "High-Fidelity UI (for Frontend)", "Scalable Backend"],
    salaryRangeByLevel: {
      "Software Engineer": "₹24 LPA - ₹38 LPA",
      "Senior Software Engineer": "₹45 LPA - ₹75 LPA",
      "Staff Engineer": "₹80 LPA - ₹1.2 Cr"
    },
    interviewTips: [
      "CRED sets a very high bar for design aesthetics on frontend and architectural elegance on backend.",
      "Code submitted in take-home challenges should have production-grade formatting, linting, tests, and Docker support.",
      "Be prepared for deep questions on concurrency, reactive streams, and distributed caching."
    ],
    popularRoles: ["Frontend Developer", "iOS Developer", "Backend Developer", "Senior Software Engineer"]
  },
  {
    id: "phonepe",
    name: "PhonePe",
    category: "Fintech Unicorn",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Pune", "Mumbai"],
    typicalRounds: [
      "Online Coding Challenge",
      "DSA & Algorithmic Problem Solving",
      "Low-Level Design (Machine Coding)",
      "High-Level System Design (UPI scale, 15,000+ TPS)",
      "Hiring Manager & Values Round"
    ],
    focusAreas: ["High TPS Payment Systems", "HBase / Cassandra Distributed Stores", "Aerospike / Redis Caching", "LLD"],
    salaryRangeByLevel: {
      "Software Engineer": "₹22 LPA - ₹34 LPA",
      "Senior Software Engineer": "₹42 LPA - ₹68 LPA",
      "Lead Engineer": "₹70 LPA - ₹1 Cr"
    },
    interviewTips: [
      "PhonePe handles over 45% of India's UPI transactions. Interviewers test planet-scale concurrency and database sharding.",
      "Understand how distributed in-memory data grids (Aerospike/Redis) handle millions of read/write operations per second.",
      "Machine coding requires working code with clean object models."
    ],
    popularRoles: ["Senior Software Engineer", "Backend Developer", "Android Developer", "Database Administrator"]
  },
  {
    id: "zomato",
    name: "Zomato",
    category: "Consumer Tech / Listed Unicorn",
    tier: "Tier 1",
    headquarters: "Gurugram",
    indiaOffices: ["Gurugram", "Bengaluru", "Mumbai"],
    typicalRounds: [
      "Online Assessment (HackerRank)",
      "DSA & Data Structures Round",
      "Machine Coding / Framework Problem Solving",
      "System Design & Scalability Round",
      "Cultural & Engineering Values Round"
    ],
    focusAreas: ["Full-Stack Problem Solving", "Real-Time Tracking", "App Performance", "System Design"],
    salaryRangeByLevel: {
      "SDE-1": "₹18 LPA - ₹28 LPA",
      "SDE-2": "₹32 LPA - ₹50 LPA",
      "SDE-3": "₹55 LPA - ₹80 LPA"
    },
    interviewTips: [
      "Zomato moves fast. Highlight your ability to ship features quickly while maintaining stability.",
      "Mobile and frontend developers are tested heavily on smooth animations, low app launch latency, and offline support.",
      "Backend questions often center around search indexing (Elasticsearch) and delivery driver allocation."
    ],
    popularRoles: ["Frontend Developer", "Backend Developer", "Android Developer", "Product Manager"]
  },
  {
    id: "zerodha",
    name: "Zerodha",
    category: "Fintech Unicorn (Bootstrapped)",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru"],
    typicalRounds: [
      "Technical Screening / Code Review of Open Source Work",
      "Deep Dive into Go / Python / PostgreSQL / Redis",
      "Architecture & Low-Latency Systems Round",
      "Culture & Philosophy Round with Kailash Nadh (CTO) or Senior Tech Leads"
    ],
    focusAreas: ["Low-Latency Programming (Go/C)", "Minimalist Architecture", "PostgreSQL Internals", "FOSS (Free & Open Source)"],
    salaryRangeByLevel: {
      "Software Engineer": "₹20 LPA - ₹35 LPA",
      "Senior Software Engineer": "₹40 LPA - ₹70 LPA"
    },
    interviewTips: [
      "Zerodha famously values minimalism: they reject architectural bloat, unnecessary microservices, and buzzwords.",
      "Active open-source contributions and deep understanding of operating systems, network sockets, and PostgreSQL are massive advantages.",
      "Demonstrate why you chose a simple solution over a trendy complex framework."
    ],
    popularRoles: ["Backend Developer", "Senior Software Engineer", "DevOps Engineer", "Frontend Developer"]
  },
  {
    id: "uber-india",
    name: "Uber India Tech Center",
    category: "Tier-1 Product / Big Tech",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Hyderabad"],
    typicalRounds: [
      "Online Coding Challenge",
      "DSA Round 1 (Graphs, Trees, Dynamic Programming)",
      "DSA Round 2 (Algorithms & Data Structures)",
      "System Design HLD (High-throughput geo-spatial services)",
      "Architecture / Machine Coding (LLD)",
      "Hiring Manager / Values Round"
    ],
    focusAreas: ["Geospatial Indexing (Uber H3)", "Distributed Consensus", "Event Streaming (Kafka)", "Microservice Scaling"],
    salaryRangeByLevel: {
      "Software Engineer I": "₹26 LPA - ₹40 LPA",
      "Software Engineer II": "₹48 LPA - ₹75 LPA",
      "Senior Software Engineer": "₹80 LPA - ₹1.3 Cr"
    },
    interviewTips: [
      "Uber Bangalore/Hyderabad engineering teams own core global systems like Maps, Rider Access, and FinTech.",
      "Study Uber H3 spatial index and how geospatial queries partition across hexagonal clusters.",
      "Be prepared for deep dives into Kafka message ordering and exactly-once processing."
    ],
    popularRoles: ["Senior Software Engineer", "Backend Developer", "Data Engineer", "Android Developer"]
  },
  {
    id: "meesho",
    name: "Meesho",
    category: "E-Commerce Unicorn",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru"],
    typicalRounds: [
      "Online Assessment",
      "DSA & Algorithms Round",
      "Machine Coding LLD Round",
      "System Design HLD Round",
      "Hiring Manager Round"
    ],
    focusAreas: ["High-Scale Consumer Tech", "Social Commerce Search", "Low-Cost Scaling", "Data Engineering"],
    salaryRangeByLevel: {
      "SDE-1": "₹18 LPA - ₹28 LPA",
      "SDE-2": "₹32 LPA - ₹52 LPA",
      "SDE-3": "₹55 LPA - ₹85 LPA"
    },
    interviewTips: [
      "Meesho serves India's tier-2 and tier-3 city users. Highlight performance on low-bandwidth networks and budget devices.",
      "In System Design, talk about multi-language localization and search ranking across vernacular queries."
    ],
    popularRoles: ["Frontend Developer", "Backend Developer", "Data Scientist", "Machine Learning Engineer"]
  },
  {
    id: "paytm",
    name: "Paytm (One97 Communications)",
    category: "Fintech Unicorn",
    tier: "Tier 2",
    headquarters: "Noida",
    indiaOffices: ["Noida", "Bengaluru", "Mumbai"],
    typicalRounds: [
      "Online Assessment (DSA on HackerRank)",
      "Technical Round 1 (DSA & Java/Node.js Core)",
      "Technical Round 2 (Low-Level Design & Concurrency)",
      "Technical Round 3 (System Design & High TPS Payments)",
      "HR / Leadership Round"
    ],
    focusAreas: ["Java / Spring Boot", "MySQL & Redis", "Payment Soundbox Architecture", "High Transaction Volume"],
    salaryRangeByLevel: {
      "Software Engineer": "₹12 LPA - ₹22 LPA",
      "Senior Software Engineer": "₹24 LPA - ₹42 LPA",
      "Technical Lead": "₹42 LPA - ₹65 LPA"
    },
    interviewTips: [
      "Paytm values deep understanding of Java concurrency, memory management, and relational database indexing.",
      "Be prepared to explain QR-code payment processing and real-time audio soundbox notification architectures."
    ],
    popularRoles: ["Backend Developer", "Full Stack Developer", "Android Developer", "QA Automation Engineer"]
  },
  {
    id: "atlassian-india",
    name: "Atlassian India",
    category: "Tier-1 Product / Big Tech",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Remote"],
    typicalRounds: [
      "Karat Online Technical Screen (DSA & Code Quality)",
      "DSA & Data Structures Onsite",
      "System Design & Architecture Onsite",
      "Code Design & Craftsmanship Round",
      "Values Interview (Open company no bullshit, Play as a team)"
    ],
    focusAreas: ["Code Craftsmanship", "System Design", "Distributed Systems", "Atlassian Values"],
    salaryRangeByLevel: {
      "P3 (Software Engineer)": "₹28 LPA - ₹44 LPA",
      "P4 (Senior Software Engineer)": "₹52 LPA - ₹80 LPA",
      "P5 (Principal Engineer)": "₹90 LPA - ₹1.4 Cr"
    },
    interviewTips: [
      "Atlassian weighs its 5 Core Values very heavily. Authentic examples of transparency and teamwork are essential.",
      "Karat screen requires clean code and proactive communication within a timed 60-minute window."
    ],
    popularRoles: ["Full Stack Developer", "Frontend Developer", "DevOps Engineer", "Senior Software Engineer"]
  },
  {
    id: "walmart-global-tech",
    name: "Walmart Global Tech India",
    category: "Global Capability Center (GCC) / Product",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Chennai"],
    typicalRounds: [
      "Online Assessment (HackerEarth / 3 Coding Problems)",
      "Technical Round 1 (DSA & Core CS Fundamentals)",
      "Technical Round 2 (Machine Coding / Java Spring Boot)",
      "Technical Round 3 (System Design & Cloud Architecture)",
      "Hiring Manager / Leadership Round"
    ],
    focusAreas: ["Enterprise Scale", "Java / Spring Boot", "Kafka Streaming", "Supply Chain Systems"],
    salaryRangeByLevel: {
      "Software Engineer II": "₹18 LPA - ₹28 LPA",
      "Senior Software Engineer": "₹32 LPA - ₹50 LPA",
      "Staff Software Engineer": "₹55 LPA - ₹85 LPA"
    },
    interviewTips: [
      "Walmart India powers global retail supply chain, replenishment, and e-commerce checkout.",
      "Expect questions on processing millions of real-time inventory updates using Kafka and Cassandra."
    ],
    popularRoles: ["Data Engineer", "Senior Software Engineer", "Cloud Engineer", "Solutions Architect"]
  },
  {
    id: "tcs",
    name: "Tata Consultancy Services (TCS)",
    category: "IT Services Giant",
    tier: "Tier 3",
    headquarters: "Mumbai",
    indiaOffices: ["Mumbai", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata", "Noida"],
    typicalRounds: [
      "TCS NQT (National Qualifier Test) / Cognitive & Coding Test",
      "Technical Round (OOP concepts, SQL, Java/Python, Final Year Project)",
      "Managerial Round (Situational & Problem Solving)",
      "HR Round (Relocation, Shifts, Communication Skills)"
    ],
    focusAreas: ["Java/Python Fundamentals", "SQL Queries & Normalization", "OOP Principles", "Project Explanation"],
    salaryRangeByLevel: {
      "TCS Ninja (Entry-Level)": "₹3.36 LPA - ₹3.6 LPA",
      "TCS Digital (Differentiated)": "₹7.0 LPA - ₹7.5 LPA",
      "TCS Prime (Premier Tier)": "₹9.0 LPA - ₹11.5 LPA",
      "Lateral IT Analyst (3-6 yrs)": "₹8 LPA - ₹16 LPA"
    },
    interviewTips: [
      "TCS Digital and Prime tracks test medium DSA problems (DP, Strings, Sorting) and cloud basics.",
      "Be prepared to explain your resume academic project in complete detail, including database ER diagrams and tech stack.",
      "Clear communication, adaptability to project locations, and client readiness are prioritized."
    ],
    popularRoles: ["QA Automation Engineer", "Full Stack Developer", "Backend Developer", "IT Infrastructure Engineer"]
  },
  {
    id: "infosys",
    name: "Infosys",
    category: "IT Services Giant",
    tier: "Tier 3",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Pune", "Hyderabad", "Chennai", "Mysuru", "Chandigarh"],
    typicalRounds: [
      "HackWithInfy / InfyTQ / Online Coding Test",
      "Technical Interview 1 (DSA, DBMS, Core Java / Python)",
      "Technical Interview 2 (Frameworks, Web Dev, Projects)",
      "HR Round (Soft Skills & Verification)"
    ],
    focusAreas: ["Core Java / C++", "DBMS (Joins, Indexing, Normalization)", "Data Structures", "Web Basics"],
    salaryRangeByLevel: {
      "Systems Engineer (SE)": "₹3.6 LPA - ₹4.0 LPA",
      "Digital Specialist Engineer (DSE)": "₹6.25 LPA - ₹6.5 LPA",
      "Specialist Programmer (Power Programmer)": "₹9.5 LPA - ₹10.5 LPA",
      "Lateral Senior Associate (3-6 yrs)": "₹8 LPA - ₹18 LPA"
    },
    interviewTips: [
      "Specialist Programmer (Power Programmer) cadre tests LeetCode Hard/Medium Dynamic Programming and Graph problems.",
      "Know your core computer science fundamentals: OS concepts (threads vs processes, deadlocks) and Networking (TCP vs UDP).",
      "Prepare thorough explanations of your hands-on coding assignments."
    ],
    popularRoles: ["Full Stack Developer", "QA Automation Engineer", "DevOps Engineer", "Cloud Engineer"]
  },
  {
    id: "wipro",
    name: "Wipro",
    category: "IT Services Giant",
    tier: "Tier 3",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Hyderabad", "Pune", "Chennai", "Kolkata", "Noida"],
    typicalRounds: [
      "Wipro Elite NLTH / TalentNext Coding Test",
      "Technical Interview (Programming basics, Data structures, DBMS)",
      "HR Interview"
    ],
    focusAreas: ["C/C++/Java Basics", "Array & String Manipulation", "SQL Queries", "Project Architecture"],
    salaryRangeByLevel: {
      "Elite Candidate": "₹3.5 LPA",
      "Turbo Candidate": "₹6.5 LPA",
      "Lateral Project Engineer (3-6 yrs)": "₹7 LPA - ₹15 LPA"
    },
    interviewTips: [
      "Focus on clean basic programming: write error-free loops, sorting algorithms, and SQL joins on the whiteboard or notepad.",
      "Explain your final year college project confidently."
    ],
    popularRoles: ["QA Automation Engineer", "IT Infrastructure Engineer", "Full Stack Developer"]
  },
  {
    id: "cognizant",
    name: "Cognizant (CTS)",
    category: "IT Services Giant",
    tier: "Tier 3",
    headquarters: "Chennai",
    indiaOffices: ["Chennai", "Bengaluru", "Hyderabad", "Pune", "Kolkata", "Coimbatore"],
    typicalRounds: [
      "Cognizant GenC / GenC Elevate Assessment",
      "Technical Interview (Java/Python, Cloud Basics, SQL)",
      "HR Interview"
    ],
    focusAreas: ["Java / Python", "SQL Joins & Group By", "REST APIs", "Cloud Basics (AWS/Azure)"],
    salaryRangeByLevel: {
      "GenC": "₹4.0 LPA",
      "GenC Elevate": "₹4.5 LPA - ₹5.5 LPA",
      "GenC Next (Product Focus)": "₹6.75 LPA - ₹9.0 LPA",
      "Lateral Associate (3-6 yrs)": "₹8 LPA - ₹16 LPA"
    },
    interviewTips: [
      "GenC Next candidates are evaluated on Fullstack development (React + Spring Boot) and DSA algorithms.",
      "Emphasize willingness to learn new enterprise stacks like Salesforce, ServiceNow, or Cloud migrations."
    ],
    popularRoles: ["QA Automation Engineer", "Cloud Engineer", "Full Stack Developer"]
  },
  {
    id: "adobe-india",
    name: "Adobe India",
    category: "Tier-1 Product / Big Tech",
    tier: "Tier 1",
    headquarters: "Noida",
    indiaOffices: ["Noida", "Bengaluru"],
    typicalRounds: [
      "Online Assessment (HackerRank)",
      "DSA Technical Round 1 (Trees, Graphs, Matrix)",
      "DSA Technical Round 2 (Dynamic Programming, Heaps)",
      "System Design & Computer Science Fundamentals Round",
      "Director / Cultural Alignment Round"
    ],
    focusAreas: ["C++ / Java", "Advanced Data Structures", "Computer Graphics / Image Processing", "System Design"],
    salaryRangeByLevel: {
      "Software Engineer": "₹22 LPA - ₹35 LPA",
      "Computer Scientist 1 (SDE-2)": "₹42 LPA - ₹65 LPA",
      "Senior Computer Scientist": "₹75 LPA - ₹1.1 Cr"
    },
    interviewTips: [
      "Adobe is known for difficult DSA questions with complex tree traversals and dynamic programming.",
      "Demonstrate strong computer science fundamentals: memory management, pointer manipulation (in C++), and algorithms."
    ],
    popularRoles: ["Senior Software Engineer", "Backend Developer", "Machine Learning Engineer", "Frontend Developer"]
  },
  {
    id: "cisco-india",
    name: "Cisco India",
    category: "Networking & Cloud Systems",
    tier: "Tier 2",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru"],
    typicalRounds: [
      "Online Assessment (DSA + Computer Networks MCQs)",
      "Technical Round 1 (Data Structures, C/Python, OS)",
      "Technical Round 2 (Networking: TCP/IP, Sockets, System Architecture)",
      "Managerial Round (Leadership & Scenario based)",
      "HR Round"
    ],
    focusAreas: ["Computer Networks (TCP/IP, OSI)", "Operating Systems & Concurrency", "C / Python", "Data Structures"],
    salaryRangeByLevel: {
      "Software Engineer": "₹16 LPA - ₹26 LPA",
      "Senior Software Engineer": "₹28 LPA - ₹45 LPA",
      "Technical Leader": "₹50 LPA - ₹75 LPA"
    },
    interviewTips: [
      "Master computer networking: TCP 3-way handshake, subnetting, socket programming, and HTTP vs HTTPS.",
      "Operating system concepts (virtual memory, page faults, IPC) are mandatory."
    ],
    popularRoles: ["Security Engineer", "DevOps Engineer", "Cloud Engineer", "IT Infrastructure Engineer"]
  },
  {
    id: "oracle-india",
    name: "Oracle India",
    category: "Enterprise Cloud & Database",
    tier: "Tier 2",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru", "Hyderabad", "Pune", "Noida"],
    typicalRounds: [
      "Online Assessment (Coding + CS Fundamentals)",
      "Technical Round 1 (Data Structures & Algorithms)",
      "Technical Round 2 (Database Internals, SQL, OOPS)",
      "Technical Round 3 (System Design / OCI Cloud Architecture)",
      "Managerial Round"
    ],
    focusAreas: ["SQL & Database Internals", "Java Core", "System Design", "Cloud Infrastructure (OCI)"],
    salaryRangeByLevel: {
      "Software Engineer (IC2)": "₹16 LPA - ₹28 LPA",
      "Senior Software Engineer (IC3)": "₹30 LPA - ₹48 LPA",
      "Principal Software Engineer (IC4)": "₹55 LPA - ₹85 LPA"
    },
    interviewTips: [
      "Oracle interviewers love database depth: ACID guarantees, isolation levels, B-Trees, and query optimization.",
      "Be prepared to write complex SQL queries using window functions and recursive CTEs."
    ],
    popularRoles: ["Database Administrator", "Backend Developer", "Cloud Engineer", "Senior Software Engineer"]
  },
  {
    id: "intuit-india",
    name: "Intuit India",
    category: "Fintech & Small Business Platform",
    tier: "Tier 1",
    headquarters: "Bengaluru",
    indiaOffices: ["Bengaluru"],
    typicalRounds: [
      "Online Assessment (DSA on Karat or HackerRank)",
      "Craft Demonstration (Live Coding or Take-Home Presentation)",
      "Data Structures & Problem Solving",
      "System Design & Cloud Architecture",
      "Values Interview (Design for Delight, Customer Driven Innovation)"
    ],
    focusAreas: ["Clean Code & Craftsmanship", "System Design", "Microservices", "Design Thinking"],
    salaryRangeByLevel: {
      "Software Engineer 1": "₹20 LPA - ₹30 LPA",
      "Software Engineer 2": "₹34 LPA - ₹52 LPA",
      "Senior Software Engineer": "₹55 LPA - ₹80 LPA"
    },
    interviewTips: [
      "Intuit focuses on the 'Craft Demonstration' round: presenting clean, tested code with solid architectural justification.",
      "Customer empathy and 'Design for Delight' are core company values."
    ],
    popularRoles: ["Full Stack Developer", "Frontend Developer", "Backend Developer", "Product Manager"]
  },
  {
    id: "ltimindtree",
    name: "LTIMindtree",
    category: "IT Services / Consulting",
    tier: "Tier 3",
    headquarters: "Mumbai",
    indiaOffices: ["Mumbai", "Bengaluru", "Pune", "Chennai", "Hyderabad"],
    typicalRounds: [
      "Online Cognitive & Coding Assessment",
      "Technical Interview 1 (Java/.NET/Python, SQL, Web Dev)",
      "Technical Interview 2 (Cloud, Microservices, Project Experience)",
      "HR Interview"
    ],
    focusAreas: ["Java / Spring Boot", "Cloud Migration", "SQL & Stored Procedures", "Agile Execution"],
    salaryRangeByLevel: {
      "Graduate Trainee": "₹4.0 LPA - ₹5.0 LPA",
      "Senior Software Engineer (3-6 yrs)": "₹8 LPA - ₹16 LPA",
      "Specialist / Lead": "₹16 LPA - ₹25 LPA"
    },
    interviewTips: [
      "Prepare clear explanations of your recent projects and how you optimized database or API performance.",
      "Certification in AWS, Azure, or GCP is an immediate hiring booster."
    ],
    popularRoles: ["Cloud Engineer", "Full Stack Developer", "QA Automation Engineer", "Solutions Architect"]
  },
  {
    id: "jio-platforms",
    name: "Jio Platforms",
    category: "Telecom & Digital Tech Giant",
    tier: "Tier 2",
    headquarters: "Mumbai",
    indiaOffices: ["Mumbai", "Bengaluru", "Hyderabad", "Pune"],
    typicalRounds: [
      "Online Coding Challenge",
      "Technical Round 1 (Data Structures, Python/Java/Go)",
      "Technical Round 2 (System Design & High Concurrency)",
      "Technical Round 3 (Cloud Native, 5G & Media Systems)",
      "Leadership Round"
    ],
    focusAreas: ["High-Scale Telecom / Media", "Microservices (Go/Java)", "Kafka & Cassandra", "5G Cloud Core"],
    salaryRangeByLevel: {
      "Graduate Engineer Trainee": "₹6.0 LPA - ₹8.5 LPA",
      "Software Engineer (2-5 yrs)": "₹14 LPA - ₹26 LPA",
      "Senior Manager / Lead": "₹28 LPA - ₹48 LPA"
    },
    interviewTips: [
      "Jio operates at massive scale (450M+ telecom subscribers). Highlight distributed data caching, low latency, and horizontal scalability.",
      "Knowledge of Docker, Kubernetes, and event-driven architecture is strongly valued."
    ],
    popularRoles: ["DevOps Engineer", "Cloud Engineer", "Backend Developer", "System Design Architect"]
  }
];

// 6. Coding Problem Topics (20 Core Topics)
const codingTopics = [
  {
    id: "array",
    topicName: "Array",
    description: "Contiguous memory structures fundamental to high-speed indexing, two pointers, sliding window, and in-place transformations.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Two Pointers", "Sliding Window", "Kadane's Algorithm", "Prefix Sum", "Dutch National Flag"],
    recommendedProblems: [
      { title: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
      { title: "Trapping Rain Water", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },
      { title: "Container With Most Water", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
      { title: "Maximum Subarray (Kadane's)", difficulty: "Medium", url: "https://leetcode.com/problems/maximum-subarray/" }
    ]
  },
  {
    id: "string",
    topicName: "String",
    description: "Character sequences requiring substring pattern matching, anagram hashing, palindrome verification, and two-pointer traversal.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Sliding Window with Hash Map", "KMP Algorithm", "Rabin-Karp", "Expand Around Center (Palindromes)"],
    recommendedProblems: [
      { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { title: "Valid Anagram", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
      { title: "Longest Palindromic Substring", difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { title: "Group Anagrams", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" }
    ]
  },
  {
    id: "matrix",
    topicName: "Matrix / 2D Grid",
    description: "Two-dimensional data grids modeling board games, image pixels, and graph layouts traversed via BFS/DFS and spiral boundaries.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Grid DFS / BFS (Flood Fill)", "Spiral Traversal", "In-Place Matrix Rotation", "Row/Column Binary Search"],
    recommendedProblems: [
      { title: "Spiral Matrix", difficulty: "Medium", url: "https://leetcode.com/problems/spiral-matrix/" },
      { title: "Rotate Image (90 Degrees Clockwise)", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-image/" },
      { title: "Search a 2D Matrix II", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix-ii/" },
      { title: "Number of Islands", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" }
    ]
  },
  {
    id: "linked-list",
    topicName: "Linked List",
    description: "Node-pointer data structures testing pointer manipulation, cycle detection, reordering, and in-place reversal.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Fast & Slow Pointers (Floyd's Cycle)", "Dummy Head Technique", "In-Place Pointer Reversal", "Merge Sort on Lists"],
    recommendedProblems: [
      { title: "Reverse Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
      { title: "Linked List Cycle II", difficulty: "Medium", url: "https://leetcode.com/problems/linked-list-cycle-ii/" },
      { title: "Merge k Sorted Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { title: "LRU Cache (Doubly Linked List + Hash Map)", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" }
    ]
  },
  {
    id: "tree",
    topicName: "Tree & Binary Search Tree",
    description: "Hierarchical data structures requiring recursive DFS traversals (Pre/In/Post-order) and level-order BFS queue processing.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Level Order Traversal (BFS)", "Subtree Bottom-Up Propagation (Post-Order DFS)", "LCA (Lowest Common Ancestor)", "BST Validation"],
    recommendedProblems: [
      { title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { title: "Binary Tree Maximum Path Sum", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { title: "Validate Binary Search Tree", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" }
    ]
  },
  {
    id: "graph",
    topicName: "Graph",
    description: "Networks of vertices and edges modeling dependency resolution, road maps, and social friend networks.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["BFS Shortest Path", "DFS Cycle Detection", "Topological Sort (Kahn's Algorithm)", "Dijkstra's Algorithm", "Union-Find (Disjoint Set)"],
    recommendedProblems: [
      { title: "Course Schedule (Cycle Detection / Topo Sort)", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
      { title: "Word Ladder (Shortest Path BFS)", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/" },
      { title: "Network Delay Time (Dijkstra)", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/" },
      { title: "Number of Connected Components (Union-Find)", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-provinces/" }
    ]
  },
  {
    id: "dynamic-programming",
    topicName: "Dynamic Programming",
    description: "Optimization technique breaking complex problems into overlapping subproblems with optimal substructure via memoization or tabulation.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["0/1 Knapsack & Unbounded Knapsack", "Longest Common Subsequence (LCS)", "Longest Increasing Subsequence (LIS)", "DP on Trees / Graphs", "State Machine DP"],
    recommendedProblems: [
      { title: "Climbing Stairs / Coin Change", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
      { title: "Longest Increasing Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { title: "Edit Distance", difficulty: "Hard", url: "https://leetcode.com/problems/edit-distance/" },
      { title: "Burst Balloons (Interval DP)", difficulty: "Hard", url: "https://leetcode.com/problems/burst-balloons/" }
    ]
  },
  {
    id: "sorting",
    topicName: "Sorting",
    description: "Ordering elements using comparison-based and non-comparison algorithms with custom comparators.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Quick Select (kth Smallest/Largest)", "Merge Sort (Count Inversions)", "Custom Comparator Sorting"],
    recommendedProblems: [
      { title: "Kth Largest Element in an Array", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { title: "Merge Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
      { title: "Sort Colors (Dutch National Flag)", difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/" }
    ]
  },
  {
    id: "searching",
    topicName: "Searching / Binary Search",
    description: "Logarithmic lookup in sorted spaces, rotated arrays, and binary search on monotonic answer spaces.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Binary Search on Monotonic Answer Range", "Search in Rotated Sorted Array", "First/Last Position Lookup"],
    recommendedProblems: [
      { title: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
      { title: "Search in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { title: "Koko Eating Bananas (BS on Answer)", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
      { title: "Median of Two Sorted Arrays", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" }
    ]
  },
  {
    id: "hash-table",
    topicName: "Hash Table / Hash Map",
    description: "Key-value indexing providing average O(1) lookups, deduplication, frequency counting, and caching.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Frequency Map Counting", "Prefix Sum + Hash Map (Zero Sum Subarrays)", "Index Mapping"],
    recommendedProblems: [
      { title: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
      { title: "Subarray Sum Equals K", difficulty: "Medium", url: "https://leetcode.com/problems/subarray-sum-equals-k/" },
      { title: "Longest Consecutive Sequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" }
    ]
  },
  {
    id: "heap",
    topicName: "Heap / Priority Queue",
    description: "Binary heaps maintaining minimum or maximum element at the root for streaming medians and top-K elements.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Top-K Elements (Min-Heap of Size K)", "Two Heaps (Running Median)", "Merge K Sorted Streams"],
    recommendedProblems: [
      { title: "Find Median from Data Stream (Two Heaps)", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
      { title: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
      { title: "Merge k Sorted Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" }
    ]
  },
  {
    id: "queue",
    topicName: "Queue & Deque",
    description: "FIFO and double-ended queues essential for level-order BFS traversals and sliding window maximum lookups.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Monotonic Deque (Sliding Window Maximum)", "BFS Level-by-Level Processing"],
    recommendedProblems: [
      { title: "Sliding Window Maximum (Monotonic Deque)", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },
      { title: "Implement Queue using Stacks", difficulty: "Easy", url: "https://leetcode.com/problems/implement-queue-using-stacks/" }
    ]
  },
  {
    id: "stack",
    topicName: "Stack",
    description: "LIFO structure fundamental to parentheses validation, expression parsing, and monotonic nearest element problems.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Monotonic Stack (Next Greater Element)", "Parentheses Validation", "Evaluating Reverse Polish Notation"],
    recommendedProblems: [
      { title: "Valid Parentheses", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
      { title: "Daily Temperatures (Monotonic Stack)", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
      { title: "Largest Rectangle in Histogram", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }
    ]
  },
  {
    id: "greedy",
    topicName: "Greedy Algorithms",
    description: "Iterative locally optimal choices that lead to globally optimal solutions in scheduling and interval merging.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Interval Scheduling", "Jump Game Traversal", "Huffman / Activity Selection"],
    recommendedProblems: [
      { title: "Jump Game", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/" },
      { title: "Gas Station (Circular Route)", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" },
      { title: "Task Scheduler", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" }
    ]
  },
  {
    id: "math",
    topicName: "Math & Number Theory",
    description: "Prime factorization, modular arithmetic, greatest common divisors, and combinatorial calculations.",
    frequencyInIndiaInterviews: "Medium",
    keyPatterns: ["Euclidean GCD", "Sieve of Eratosthenes", "Fast Modular Exponentiation"],
    recommendedProblems: [
      { title: "Pow(x, n) (Fast Exponentiation)", difficulty: "Medium", url: "https://leetcode.com/problems/powx-n/" },
      { title: "Count Primes (Sieve)", difficulty: "Medium", url: "https://leetcode.com/problems/count-primes/" }
    ]
  },
  {
    id: "bit-manipulation",
    topicName: "Bit Manipulation",
    description: "Binary bitwise operations (AND, OR, XOR, shifts) for constant-space arithmetic and mask subsets.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["XOR Property (a ^ a = 0)", "Bit Masking Subsets", "Kernighan's Algorithm (Counting Set Bits)"],
    recommendedProblems: [
      { title: "Single Number (XOR)", difficulty: "Easy", url: "https://leetcode.com/problems/single-number/" },
      { title: "Counting Bits", difficulty: "Easy", url: "https://leetcode.com/problems/counting-bits/" },
      { title: "Subsets (Bitmask)", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" }
    ]
  },
  {
    id: "design",
    topicName: "Design & Data Structure Implementation",
    description: "Combining multiple data structures to meet strict O(1) latency constraints for real-world caching and indexing.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Hash Map + Doubly Linked List", "Trie Prefix Tree", "Segment Tree"],
    recommendedProblems: [
      { title: "LRU Cache", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
      { title: "LFU Cache", difficulty: "Hard", url: "https://leetcode.com/problems/lfu-cache/" },
      { title: "Implement Trie (Prefix Tree)", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" }
    ]
  },
  {
    id: "concurrency",
    topicName: "Concurrency & Multithreading",
    description: "Thread synchronization, semaphores, mutex locks, and producer-consumer queue architectures.",
    frequencyInIndiaInterviews: "High",
    keyPatterns: ["Producer-Consumer Buffer", "Dining Philosophers", "Deadlock Prevention"],
    recommendedProblems: [
      { title: "Print in Order (Threads)", difficulty: "Easy", url: "https://leetcode.com/problems/print-in-order/" },
      { title: "The Dining Philosophers", difficulty: "Medium", url: "https://leetcode.com/problems/the-dining-philosophers/" }
    ]
  },
  {
    id: "system-design",
    topicName: "System Design (LLD & HLD)",
    description: "Architectural decomposition into services, APIs, databases, caches, and low-level design patterns.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Machine Coding OOP Design", "Scalable Microservice Architecture", "Event Streaming & Caching"],
    recommendedProblems: [
      { title: "Design Parking Lot (LLD)", difficulty: "Medium", url: "https://github.com/ashishps1/awesome-low-level-design" },
      { title: "Design Splitwise (LLD)", difficulty: "Medium", url: "https://github.com/ashishps1/awesome-low-level-design" },
      { title: "Design URL Shortener (HLD)", difficulty: "Medium", url: "https://github.com/donnemartin/system-design-primer" }
    ]
  },
  {
    id: "sql",
    topicName: "SQL & Query Design",
    description: "Relational query formulations involving complex joins, subqueries, aggregations, window functions, and CTEs.",
    frequencyInIndiaInterviews: "Very High",
    keyPatterns: ["Window Functions (RANK, DENSE_RANK, ROW_NUMBER)", "GROUP BY & HAVING", "Common Table Expressions (WITH)", "Self Joins"],
    recommendedProblems: [
      { title: "Second Highest Salary", difficulty: "Medium", url: "https://leetcode.com/problems/second-highest-salary/" },
      { title: "Department Top Three Salaries (DENSE_RANK)", difficulty: "Hard", url: "https://leetcode.com/problems/department-top-three-salaries/" },
      { title: "Consecutive Numbers", difficulty: "Medium", url: "https://leetcode.com/problems/consecutive-numbers/" }
    ]
  }
];

// Write out all files
const saveAll = () => {
  const seedsDir = __dirname;
  fs.writeFileSync(path.join(seedsDir, 'roles.json'), JSON.stringify(roles, null, 2), 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'skills.json'), JSON.stringify(roleSkills, null, 2), 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'questions.json'), JSON.stringify(finalQuestions, null, 2), 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'resources.json'), JSON.stringify(resourcesMap, null, 2), 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'popularCompanies.json'), JSON.stringify(popularCompanies, null, 2), 'utf-8');
  fs.writeFileSync(path.join(seedsDir, 'codingTopics.json'), JSON.stringify(codingTopics, null, 2), 'utf-8');

  console.log(`🎉 Successfully generated all 6 fixtures:`);
  console.log(`- roles.json: ${roles.length} roles`);
  console.log(`- skills.json: ${roleSkills.length} skills definitions`);
  console.log(`- questions.json: ${finalQuestions.length} questions`);
  console.log(`- resources.json: ${resourcesList.length} resources across ${Object.keys(resourcesMap).length} categories`);
  console.log(`- popularCompanies.json: ${popularCompanies.length} companies`);
  console.log(`- codingTopics.json: ${codingTopics.length} coding problem topics`);
};

saveAll();
