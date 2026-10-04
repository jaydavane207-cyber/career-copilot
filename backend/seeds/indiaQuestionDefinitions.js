// backend/seeds/indiaQuestionDefinitions.js
/**
 * 100 Curated Mock Interview Questions for Indian Tech Roles
 * Exactly:
 * - 35 Behavioral Questions (with follow-ups, STAR framework, and India tech culture context)
 * - 40 Technical Questions (10 Frontend, 10 Backend/SDE, 10 QA Automation, 10 Data Science)
 * - 25 System Design Questions (High-concurrency architectures & Indian tech scale scenarios)
 */

const questions = [
  // ==========================================================================
  // BEHAVIORAL QUESTIONS (35)
  // ==========================================================================
  {
    id: "beh-1",
    type: "Behavioral",
    category: "Introduction",
    role: "General",
    difficulty: "Easy",
    question: "Tell me about yourself",
    followUps: [
      "What led you to specialize in your current tech stack?",
      "Which accomplishment in your career are you most proud of?",
      "Where do you see yourself technically in the next 2-3 years?"
    ],
    sampleAnswer: {
      strongAnswer: "I am a software engineer with over 4 years of experience specializing in scalable backend services and distributed systems. Currently at my current company in Bengaluru, I lead the core checkout services team where I re-architected our order processing microservice, reducing p99 latency by 35% during high-concurrency peak traffic. Previously, I worked on full-stack web applications using React and Node.js. Beyond daily engineering, I mentor junior developers and actively contribute to internal architecture design reviews. What excites me about your team is your high-scale product engineering culture and your recent expansion into real-time payment orchestration.",
      keyPoints: [
        "Follow the Present-Past-Future narrative structure clearly.",
        "Highlight 1-2 quantified engineering achievements (e.g., 35% latency drop, 10k RPS).",
        "Concisely explain technical passion and alignment with this specific company.",
        "Keep the narrative between 90 and 120 seconds."
      ],
      tips: "Do not simply recite your resume line by line. Tailor your accomplishments to the tech stack and engineering challenges of the company you are interviewing with."
    },
    expectedKeywords: ["present past future", "software engineer", "scalable", "latency", "achievements", "mentor", "impact"],
    indiaContextTip: "In Indian tech interviews (both Tier-1 startups and MNCs), interviewers use this icebreaker to assess communication clarity and genuine passion. Emphasize ownership and production impact over generic duty lists."
  },
  {
    id: "beh-2",
    type: "Behavioral",
    category: "Motivation",
    role: "General",
    difficulty: "Easy",
    question: "Why do you want to work with us?",
    followUps: [
      "What aspects of our engineering tech stack or architecture excite you most?",
      "How do our company values resonate with your personal work ethic?",
      "Have you used our product yourself, and what is one thing you would improve?"
    ],
    sampleAnswer: {
      strongAnswer: "I have been following your engineering blog, especially your recent case study on migrating from a monolithic database to a distributed event-driven architecture using Kafka and Redis. My recent project solving concurrency bottlenecks aligns directly with the architectural challenges your team tackles. Moreover, colleagues who joined your Bangalore tech center shared that your culture prizes engineering autonomy, blameless post-mortems, and rapid product velocity. I want to bring my experience in high-throughput API design to help build resilient platforms for your next 50 million Indian users.",
      keyPoints: [
        "Cite specific architectural blog posts, open-source projects, or tech choices.",
        "Connect your past engineering experience directly to their current problems.",
        "Show genuine knowledge of their business model, product scale, and user base."
      ],
      tips: "Avoid generic praise like 'You are a market leader'. Specific engineering references prove you did real homework before the interview."
    },
    expectedKeywords: ["architecture", "engineering blog", "scale", "autonomy", "alignment", "impact"],
    indiaContextTip: "Interviewers in India look for genuine curiosity vs candidates who applied to 50 companies with the same generic answer. Citing an engineering blog or tech conference talk immediately sets you in the top 10%."
  },
  {
    id: "beh-3",
    type: "Behavioral",
    category: "Leadership & Ownership",
    role: "General",
    difficulty: "Medium",
    question: "Describe a challenging project you led",
    followUps: [
      "What was the most difficult architectural trade-off you had to make?",
      "How did you manage conflicting stakeholder timelines?",
      "What would you do differently if you had to start this project over today?"
    ],
    sampleAnswer: {
      strongAnswer: "During last year's festive sale preparation, our payment gateway service experienced severe CPU spikes and a 12% timeout rate when traffic surged 5x. (Situation) As the module tech lead, I took ownership of redesigning our checkout lock mechanism within a strict 3-week window. (Task) I led a squad of 4 engineers to replace database-level row locks with a distributed Redis Redlock algorithm and Kafka-backed asynchronous order settlement with idempotent consumers. (Action) We stress-tested the service to 25,000 requests per second. During the actual sale, our system achieved zero payment drops and saved an estimated ₹1.8 Crore in GMV. (Result)",
      keyPoints: [
        "Structure strictly with STAR: Situation, Task, Action, Result.",
        "Emphasize personal technical choices and leadership actions (use 'I led', 'I architected').",
        "Quantify business and engineering results (zero drops, 25k RPS, ₹1.8 Cr GMV protected)."
      ],
      tips: "Be ready for deep follow-ups on the trade-offs of the technology choices you mention."
    },
    expectedKeywords: ["STAR", "situation", "task", "action", "result", "redis", "concurrency", "leadership"],
    indiaContextTip: "At Indian unicorns like Flipkart, Swiggy, and Razorpay, sale events (Big Billion Days, IPL flash sales) are standard high-stakes scenarios. Framing your experience around scale and business continuity carries high weight."
  },
  {
    id: "beh-4",
    type: "Behavioral",
    category: "Collaboration",
    role: "General",
    difficulty: "Medium",
    question: "How do you handle conflict in a team?",
    followUps: [
      "Can you give a specific example where you had to disagree and commit?",
      "How do you resolve architectural disagreements with a senior engineer?",
      "What do you do if a colleague is consistently missing sprint commitments?"
    ],
    sampleAnswer: {
      strongAnswer: "I believe healthy technical debate is essential for robust architecture, provided it remains focused on objective data rather than egos. Recently, a senior engineer and I disagreed on whether to implement GraphQL or stick with optimized REST endpoints for our new mobile client. (Situation) The mobile team was worried about network over-fetching in tier-2 Indian cities with spotty 3G/4G connectivity, while the backend team worried about N+1 query complexity. (Task) I proposed timeboxing a two-day spike: we built prototypes for both and benchmarked payload size and p95 response times. (Action) The data proved that an optimized REST endpoint with field filtering solved the mobile payload issue without the backend caching overhead of GraphQL. We aligned on REST with mutual respect. (Result)",
      keyPoints: [
        "Depersonalize conflict by using data, benchmarks, and proof-of-concept spikes.",
        "Acknowledge the validity of opposing viewpoints.",
        "Demonstrate commitment to the team's shared outcome and business objectives."
      ],
      tips: "Never speak negatively about colleagues. Frame the conflict as an engineering trade-off that led to a better technical decision."
    },
    expectedKeywords: ["data-driven", "benchmark", "prototype", "empathy", "alignment", "respect", "trade-off"],
    indiaContextTip: "Service-to-product transitions in India frequently probe for assertiveness vs passive agreement. Show that you can politely challenge ideas using benchmarks rather than blindly accepting seniority."
  },
  {
    id: "beh-5",
    type: "Behavioral",
    category: "Failure & Resilience",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about a time you failed and how you recovered",
    followUps: [
      "What was the immediate incident response procedure you followed?",
      "How did you prevent similar incidents from reoccurring?",
      "How did you communicate the issue to leadership and external users?"
    ],
    sampleAnswer: {
      strongAnswer: "Early in my career, I deployed a database migration script during an off-peak release that lacked a composite index on a foreign key in our transactions table. (Situation) When the daily batch cron job ran at midnight, table locks caused our API pool to exhaust connections, causing a 25-minute partial outage for 5,000 users. (Task) I immediately escalated to our on-call incident channel, rolled back the release to the previous stable snapshot within 8 minutes, and verified service recovery. (Action) Next morning, I conducted a blameless post-mortem, documented the root cause, added automated linting rules to flag unindexed foreign key migrations in CI, and created a pre-production load-testing checklist. (Result)",
      keyPoints: [
        "Take direct accountability without making excuses or blaming teammates.",
        "Explain immediate containment and incident mitigation actions.",
        "Highlight lasting institutional improvements (CI linter rules, blameless post-mortem)."
      ],
      tips: "Choose a real engineering failure with tangible consequences, but show that you owned the fix and created guardrails so it could never happen again."
    },
    expectedKeywords: ["accountability", "blameless post-mortem", "rollback", "incident response", "guardrails", "learning"],
    indiaContextTip: "Top product companies (Google, Uber, Swiggy) care deeply about blameless engineering culture. Demonstrating that you treat outages as learning opportunities signals senior engineering maturity."
  },
  {
    id: "beh-6",
    type: "Behavioral",
    category: "Time Management & Prioritization",
    role: "General",
    difficulty: "Medium",
    question: "How do you prioritize competing deadlines when everything is marked as urgent?",
    followUps: [
      "How do you push back against unrealistic deadlines from management?",
      "What framework do you use to evaluate trade-offs between speed and technical debt?"
    ],
    sampleAnswer: {
      strongAnswer: "When multiple deliverables collide, I evaluate tasks based on two parameters: customer/revenue impact and technical dependencies. I proactively align with product managers and engineering managers using the Eisenhower matrix. For example, during a critical quarter where a compliance deadline coincided with a client onboarding feature, I broke down the scope, identified non-negotiable compliance items, and negotiated a phased release for the client feature, delivering core functionality first.",
      keyPoints: ["Use a structured prioritization matrix.", "Communicate transparently with stakeholders early.", "Deconstruct large features into incremental deliverables."],
      tips: "Avoid saying 'I just work late hours'. Healthy prioritization is about smart scope management."
    },
    expectedKeywords: ["prioritization", "stakeholders", "scope", "phased release", "impact", "trade-offs"],
    indiaContextTip: "Highlight proactive communication with US/Europe onshore teams or Indian product managers to manage expectations rather than burning out silently."
  },
  {
    id: "beh-7",
    type: "Behavioral",
    category: "Technical Debt",
    role: "General",
    difficulty: "Medium",
    question: "How do you convince stakeholders to invest time into refactoring and technical debt?",
    followUps: ["How do you measure the cost of technical debt in terms of developer velocity?"],
    sampleAnswer: {
      strongAnswer: "I translate technical debt into business language: developer velocity, incident downtime, and cloud costs. Instead of asking for 'time to refactor', I demonstrated that a fragile legacy module accounted for 40% of our production bug tickets and slowed down feature turnaround by 3 days per sprint. By showing how a two-week refactor would accelerate our next two quarters of roadmap features, leadership enthusiastically approved the initiative.",
      keyPoints: ["Translate tech debt into business metrics (cycle time, bug tickets, server costs).", "Propose dedicated allocations (e.g., 20% of sprint capacity)."],
      tips: "Business leaders care about revenue, speed, and reliability. Speak their language."
    },
    expectedKeywords: ["developer velocity", "business metrics", "ROI", "refactoring", "production bugs"],
    indiaContextTip: "Demonstrates that you can bridge the gap between engineering rigor and business realities."
  },
  {
    id: "beh-8",
    type: "Behavioral",
    category: "Mentorship",
    role: "General",
    difficulty: "Medium",
    question: "Describe how you mentored a junior engineer or intern",
    followUps: ["How do you conduct code reviews so they serve as learning opportunities?"],
    sampleAnswer: {
      strongAnswer: "When an associate engineer joined our team, they struggled with asynchronous error handling in Node.js. Instead of rewriting their code in PR reviews, I scheduled weekly pair-programming sessions. I guided them to identify edge cases themselves using debugging breakpoints. Within 3 months, they independently architected an internal webhook integration service and became a reliable PR reviewer for new joiners.",
      keyPoints: ["Emphasize empathy and empowerment over direct problem-solving.", "Encourage autonomy and celebrate progress."],
      tips: "Mention your code review philosophy: explain the 'why' behind design comments."
    },
    expectedKeywords: ["mentorship", "pair programming", "code review", "autonomy", "growth"],
    indiaContextTip: "High hiring volumes in India make strong mentorship and onboarding skills highly prized in senior and mid-level roles."
  },
  {
    id: "beh-9",
    type: "Behavioral",
    category: "Adaptability",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about a time you had to learn a completely new technology under tight deadlines",
    followUps: ["How did you evaluate if that new technology was actually the right choice?"],
    sampleAnswer: {
      strongAnswer: "Our team needed to build a real-time collaborative dashboard, but our team had zero production experience with WebSockets or Redis Pub/Sub. I had 10 days before the architecture sign-off. I spent the weekend reading official documentation, built a functional proof-of-concept with load testing, and documented gotchas regarding connection memory leaks. We delivered the prototype on schedule and successfully rolled it out.",
      keyPoints: ["Structured learning approach: official docs, POC, load testing.", "Sharing knowledge with the team via documentation."],
      tips: "Highlight hands-on prototyping over passive video watching."
    },
    expectedKeywords: ["quick learner", "proof of concept", "load testing", "documentation", "adaptability"],
    indiaContextTip: "Demonstrates technical agility in fast-evolving tech environments."
  },
  {
    id: "beh-10",
    type: "Behavioral",
    category: "Cross-Functional Collaboration",
    role: "General",
    difficulty: "Medium",
    question: "Describe a situation where you worked closely with design and product teams",
    followUps: ["How do you handle feature requests that are technically impossible within the given timeline?"],
    sampleAnswer: {
      strongAnswer: "While building our mobile onboarding flow, design proposed a multi-step animation that introduced 800ms of UI thread jank on budget Android devices. Rather than saying 'no', I met with the designer and product manager with screen recordings on a ₹10,000 phone. I suggested a CSS transform and canvas-based alternative that achieved the exact visual aesthetic while maintaining 60fps across all device tiers.",
      keyPoints: ["Collaborative mindset instead of engineering pushback.", "Keep the end-user experience across device tiers at the center."],
      tips: "Emphasize empathy for designers and business goals."
    },
    expectedKeywords: ["cross-functional", "design", "product", "performance", "empathy", "60fps"],
    indiaContextTip: "In India, designing for device fragmentation (budget Android devices, varying screen sizes) is a critical practical skill."
  },
  {
    id: "beh-11",
    type: "Behavioral",
    category: "Customer Obsession",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about a time you advocated for the customer over short-term engineering convenience",
    followUps: ["How did you validate that the customer actually experienced the pain point?"],
    sampleAnswer: {
      strongAnswer: "Our team was pressured to release a silent checkout retry mechanism to artificially boost conversion metrics. However, analyzing customer support logs revealed that users in tier-3 cities with poor connectivity were getting double-debited due to network timeouts. I advocated for adding an explicit, idempotent confirmation screen with clear bank status indicators. While it added 3 days of development, it eliminated duplicate debits and raised our CSAT score by 18 points.",
      keyPoints: ["Put user trust and customer experience above cosmetic short-term metrics.", "Use real telemetry and support ticket data."],
      tips: "Demonstrate that long-term user trust translates directly to business value."
    },
    expectedKeywords: ["customer obsession", "idempotent", "CSAT", "telemetry", "user trust"],
    indiaContextTip: "Relevant for Indian fintech and e-commerce companies where network unreliability causes transaction anxiety."
  },
  {
    id: "beh-12",
    type: "Behavioral",
    category: "On-Call & Production Outages",
    role: "General",
    difficulty: "Hard",
    question: "Describe your experience managing a high-severity production incident while on-call",
    followUps: ["How did you handle communication with anxious business stakeholders during the incident?"],
    sampleAnswer: {
      strongAnswer: "At 2 AM on a Saturday, PagerDuty alerted us that our auth service was returning 500 errors for 20% of incoming logins. As secondary on-call, I joined the war room within 5 minutes. I designated a dedicated communications lead so engineers could focus on debugging. Inspecting distributed traces showed an external SMS OTP vendor timeout. I toggled our fallback vendor feature flag, restoring authentication within 12 minutes. Following this, we added automated vendor health checks and multi-provider failover.",
      keyPoints: ["Clear incident command structure: triage, containment, communication.", "Use feature flags for rapid blast-radius reduction.", "Post-incident hardening."],
      tips: "Calmness, clear communication, and structured debugging are key."
    },
    expectedKeywords: ["PagerDuty", "war room", "feature flag", "root cause", "post-incident", "observability"],
    indiaContextTip: "Demonstrates true production readiness and real on-call ownership."
  },
  {
    id: "beh-13",
    type: "Behavioral",
    category: "Ethical Dilemmas",
    role: "General",
    difficulty: "Hard",
    question: "Tell me about a time you faced an ethical dilemma at work and how you handled it",
    followUps: ["Were you worried about pushback from leadership?"],
    sampleAnswer: {
      strongAnswer: "Prior to a marketing campaign, our team was asked to export user phone numbers and location coordinates into an unsecured spreadsheet for a third-party agency. Recognizing that this violated user privacy agreements and data protection norms, I escalated to our data security officer. I proposed an alternative: our team securely hashed user IDs and generated anonymized demographic segments. This gave the agency the insights they needed without exposing raw PII.",
      keyPoints: ["Uphold data security and ethics with courage.", "Offer viable, compliant alternatives rather than merely blocking."],
      tips: "Focus on integrity, compliance, and privacy by design."
    },
    expectedKeywords: ["PII", "privacy", "ethics", "security", "anonymization", "compliance"],
    indiaContextTip: "Relevant with India's Digital Personal Data Protection (DPDP) Act."
  },
  {
    id: "beh-14",
    type: "Behavioral",
    category: "Ambiguity",
    role: "General",
    difficulty: "Medium",
    question: "Describe a project where the requirements were vague or constantly changing",
    followUps: ["How did you avoid scope creep?"],
    sampleAnswer: {
      strongAnswer: "Our leadership requested an 'AI-driven recommendation engine' with no defined metrics or input specifications. Instead of building blindly, I drafted a one-page RFC defining success criteria: click-through rate on recommended products. I proposed building a simple collaborative filtering baseline first within one sprint before introducing complex neural models. This baseline delivered an 8% lift in CTR and gave us clear benchmark data to refine requirements.",
      keyPoints: ["De-risk ambiguity by building RFCs and baseline prototypes.", "Define clear success metrics upfront."],
      tips: "Show that you can navigate ambiguity with disciplined, hypothesis-driven steps."
    },
    expectedKeywords: ["ambiguity", "RFC", "baseline", "prototype", "metrics", "iterative"],
    indiaContextTip: "Startups in India value engineers who can bring structure to unstructured requests."
  },
  {
    id: "beh-15",
    type: "Behavioral",
    category: "Disagree and Commit",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about a time you disagreed with a technical decision but still had to commit to it",
    followUps: ["How did you ensure the project succeeded despite your reservations?"],
    sampleAnswer: {
      strongAnswer: "Our architect decided to adopt a nascent graph database for our user connection features, whereas I preferred our proven PostgreSQL relational model with recursive CTEs. I voiced my concerns regarding backup tooling and community support during the architectural review. Once the team chose the graph database, I fully committed: I wrote integration tests, set up automated monitoring, and helped debug connection pooling issues. The project shipped successfully.",
      keyPoints: ["Voice objections clearly with technical merit before decision is made.", "Fully commit and support the team once the direction is set."],
      tips: "Never act defensively or passively sabotage decisions you disagreed with."
    },
    expectedKeywords: ["disagree and commit", "architectural review", "team player", "monitoring", "ownership"],
    indiaContextTip: "Amazon, Google, and Indian unicorns look for engineers who disagree with data but execute wholeheartedly once decisions are finalized."
  },
  // Behavioral 16-35
  {
    id: "beh-16",
    type: "Behavioral",
    category: "Career Growth",
    role: "General",
    difficulty: "Easy",
    question: "What is your proudest technical achievement to date?",
    followUps: ["What was your unique individual contribution?"],
    sampleAnswer: {
      strongAnswer: "Building an automated document processing pipeline that replaced manual data entry for 40,000 daily KYC submissions. I designed the OCR queue with BullMQ and Redis, saving over 200 operational hours per week.",
      keyPoints: ["Quantify business savings.", "Highlight personal architectural ownership."],
      tips: "Keep it focused and articulate."
    },
    expectedKeywords: ["achievement", "impact", "architecture", "automation"],
    indiaContextTip: "Quantifying operational hours or cost savings in Lakhs/Crores resonates strongly."
  },
  {
    id: "beh-17",
    type: "Behavioral",
    category: "Culture & Teamwork",
    role: "General",
    difficulty: "Easy",
    question: "What type of team culture helps you do your best work?",
    followUps: ["How do you handle working with engineers who have different communication styles?"],
    sampleAnswer: {
      strongAnswer: "A culture of high technical rigor, psychological safety, and blameless transparency where team members can debate ideas openly and experiment without fear of punishment for honest mistakes.",
      keyPoints: ["Psychological safety", "Constructive debate", "Continuous learning."],
      tips: "Reflect authentic alignment with modern engineering values."
    },
    expectedKeywords: ["psychological safety", "blameless", "transparency", "rigor"],
    indiaContextTip: "Shows cultural readiness for progressive engineering environments."
  },
  {
    id: "beh-18",
    type: "Behavioral",
    category: "Feedback",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about critical feedback you received and how you acted on it",
    followUps: ["Did you agree with the feedback initially?"],
    sampleAnswer: {
      strongAnswer: "In a previous review, my manager noted that while my code quality was exceptional, I often delayed opening PRs until the entire feature was 100% complete. I took this constructively: I adopted trunk-based development, created smaller draft PRs under feature flags, and reduced our average PR review turnaround from 3 days to under 4 hours.",
      keyPoints: ["Show maturity in accepting feedback.", "Concrete behavioral and workflow modifications."],
      tips: "Choose a real developmental area with an actionable resolution."
    },
    expectedKeywords: ["feedback", "trunk-based development", "feature flags", "growth"],
    indiaContextTip: "Demonstrates humility and continuous self-improvement."
  },
  {
    id: "beh-19",
    type: "Behavioral",
    category: "Productivity",
    role: "General",
    difficulty: "Easy",
    question: "How do you maintain focus and engineering velocity during high-distraction periods?",
    followUps: ["How do you protect your deep-work hours?"],
    sampleAnswer: {
      strongAnswer: "I block dedicated morning deep-work focus sessions for complex architectural coding. I batch Slack messages and email communications into specific windows, and document decisions asynchronously in Notion or Jira to reduce unnecessary sync meetings.",
      keyPoints: ["Time-blocking for deep work.", "Asynchronous communication over reactive meetings."],
      tips: "Demonstrates mature time management."
    },
    expectedKeywords: ["deep work", "asynchronous", "focus", "velocity"],
    indiaContextTip: "Especially important in remote/hybrid teams working across global time zones."
  },
  {
    id: "beh-20",
    type: "Behavioral",
    category: "Decision Making",
    role: "General",
    difficulty: "Hard",
    question: "Describe a time you made a technical decision that you later regretted. What did you learn?",
    followUps: ["How long did it take to realize the mistake?"],
    sampleAnswer: {
      strongAnswer: "I once chose a custom hand-rolled authentication token encryption scheme instead of using standard OAuth2/JWT libraries, believing it would be more lightweight. Within 4 months, maintaining cryptographic edge cases and token refresh mechanisms became a massive burden. I led the migration to an audited standard OAuth2 provider. I learned to never reinvent security primitives.",
      keyPoints: ["Honest technical introspection.", "Respecting industry standards over custom reinvention."],
      tips: "Never blame colleagues for your design choices."
    },
    expectedKeywords: ["regret", "standards", "OAuth2", "cryptography", "learning"],
    indiaContextTip: "Shows senior maturity: knowing when not to build custom wheels."
  },
  {
    id: "beh-21",
    type: "Behavioral",
    category: "Remote Collaboration",
    role: "General",
    difficulty: "Medium",
    question: "How do you collaborate effectively with cross-timezone teams (e.g., US or Europe)?",
    followUps: ["How do you handle asynchronous handoffs?"],
    sampleAnswer: {
      strongAnswer: "Through detailed asynchronous communication. I record 2-minute Loom walkthroughs of complex PRs, maintain comprehensive PR descriptions with before/after screenshots and test logs, and schedule daily 30-minute overlap windows for high-priority architectural discussions.",
      keyPoints: ["Asynchronous documentation", "Loom walkthroughs", "Overlap optimization."],
      tips: "Essential for Global Capability Centers (GCCs) in India."
    },
    expectedKeywords: ["asynchronous", "documentation", "timezone", "handoff"],
    indiaContextTip: "Key requirement for Microsoft IDC, Amazon, Google, and Indian IT GCCs."
  },
  {
    id: "beh-22",
    type: "Behavioral",
    category: "Process Improvement",
    role: "General",
    difficulty: "Medium",
    question: "Describe an initiative you took to improve developer productivity for your team",
    followUps: ["How did your teammates react to the new workflow?"],
    sampleAnswer: {
      strongAnswer: "Our local Docker development environment took 25 minutes to boot up and frequently broke due to inconsistent seed data. I created a lightweight Docker Compose setup with mocked external services and automated seed scripts, reducing onboarding boot time from 25 minutes to 90 seconds. The team loved it.",
      keyPoints: ["Identifying developer friction.", "Creating clean tooling that saves hours."],
      tips: "Focus on developer happiness and efficiency."
    },
    expectedKeywords: ["developer tooling", "productivity", "docker compose", "developer experience"],
    indiaContextTip: "Demonstrates engineering citizenship."
  },
  {
    id: "beh-23",
    type: "Behavioral",
    category: "Pressure",
    role: "General",
    difficulty: "Medium",
    question: "How do you perform under tight release pressure without sacrificing code quality?",
    followUps: ["Have you ever had to push back on a release date?"],
    sampleAnswer: {
      strongAnswer: "By maintaining strict testing discipline and scoping down non-essential bells and whistles rather than skipping tests. Automated unit and integration tests are what give us the confidence to ship rapidly without catastrophic regressions.",
      keyPoints: ["Quality is speed.", "Cut scope, not quality."],
      tips: "Reiterate that cutting tests creates compounding slowdowns."
    },
    expectedKeywords: ["testing", "quality", "scope management", "discipline"],
    indiaContextTip: "Separates disciplined engineers from quick-and-dirty coders."
  },
  {
    id: "beh-24",
    type: "Behavioral",
    category: "Negotiation",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about a time you had to negotiate requirements with an external partner or client",
    followUps: ["How did you protect your team's bandwidth?"],
    sampleAnswer: {
      strongAnswer: "An enterprise customer requested 15 bespoke custom API endpoints. Recognizing that bespoke APIs would create maintenance debt, I negotiated a generic webhook payload and GraphQL schema that satisfied their data requirements while remaining reusable for future clients.",
      keyPoints: ["Reusable architecture over one-off custom solutions.", "Win-win negotiation."],
      tips: "Highlight strategic thinking."
    },
    expectedKeywords: ["negotiation", "reusability", "webhooks", "stakeholders"],
    indiaContextTip: "Demonstrates strategic enterprise engineering mindset."
  },
  {
    id: "beh-25",
    type: "Behavioral",
    category: "Initiative",
    role: "General",
    difficulty: "Medium",
    question: "Describe a time you noticed an issue that was outside your direct responsibility and solved it",
    followUps: ["Did you get recognition for it?"],
    sampleAnswer: {
      strongAnswer: "I noticed our cloud staging environment was running idle over weekends, racking up ₹1.2 Lakh in unnecessary AWS costs every month. I wrote a scheduled Lambda script to shut down non-production EC2 and RDS instances on Friday evening and wake them on Monday morning, cutting our non-prod cloud bill by 32%.",
      keyPoints: ["Proactive ownership.", "Measurable financial savings."],
      tips: "True ownership extends beyond sprint tickets."
    },
    expectedKeywords: ["ownership", "cloud costs", "AWS Lambda", "initiative"],
    indiaContextTip: "Cost efficiency and frugality are highly prized."
  },
  {
    id: "beh-26",
    type: "Behavioral",
    category: "Conflict with Leadership",
    role: "General",
    difficulty: "Hard",
    question: "How do you handle a situation where your manager makes a technical decision you disagree with?",
    followUps: ["What if they insist on their decision despite your counter-arguments?"],
    sampleAnswer: {
      strongAnswer: "I request a 1-on-1 meeting to understand their underlying context and business constraints that I might be unaware of. I present my concerns with concrete benchmarks and risk assessments. If they decide to proceed with their approach, I respect their authority, commit fully, and work to mitigate the identified risks.",
      keyPoints: ["Seek first to understand.", "Present data calmly.", "Disagree and commit professionally."],
      tips: "Show respect for hierarchy while maintaining technical integrity."
    },
    expectedKeywords: ["1-on-1", "risk assessment", "professionalism", "commitment"],
    indiaContextTip: "Highlights emotional intelligence and professional maturity."
  },
  {
    id: "beh-27",
    type: "Behavioral",
    category: "Continuous Learning",
    role: "General",
    difficulty: "Easy",
    question: "How do you stay updated with rapid technological changes in software engineering?",
    followUps: ["What is the latest technical paper or tool you experimented with?"],
    sampleAnswer: {
      strongAnswer: "I read engineering blogs (Uber, Netflix, Cloudflare), follow open-source GitHub repositories, and build small weekend prototypes. Recently, I experimented with LocalAI and pgvector to understand vector search embeddings inside PostgreSQL.",
      keyPoints: ["Continuous habit.", "Hands-on experimentation with recent tech."],
      tips: "Demonstrate curiosity with a tangible recent experiment."
    },
    expectedKeywords: ["engineering blogs", "open-source", "prototyping", "pgvector"],
    indiaContextTip: "Curiosity is a major differentiator in technical evaluations."
  },
  {
    id: "beh-28",
    type: "Behavioral",
    category: "Accountability",
    role: "General",
    difficulty: "Medium",
    question: "Tell me about a time you missed a project deadline. How did you handle it?",
    followUps: ["When did you first realize the deadline was at risk?"],
    sampleAnswer: {
      strongAnswer: "During a database migration, unforeseen third-party API rate limits doubled our data transfer timeline. As soon as telemetry indicated we would miss the Friday deadline, I notified leadership on Wednesday morning, presented the revised timeline, and proposed an automated backfill script that completed the rollout by Monday morning with zero downtime.",
      keyPoints: ["Early warning rather than last-minute surprise.", "Accountability with a proposed remediation."],
      tips: "Surprises are what damage trust, not delays communicated early."
    },
    expectedKeywords: ["early communication", "accountability", "telemetry", "remediation"],
    indiaContextTip: "Shows reliability and professional communication."
  },
  {
    id: "beh-29",
    type: "Behavioral",
    category: "Security Culture",
    role: "General",
    difficulty: "Medium",
    question: "How do you incorporate security into your day-to-day software development practices?",
    followUps: ["How do you handle third-party dependency vulnerabilities (CVEs)?"],
    sampleAnswer: {
      strongAnswer: "I treat security as a first-class citizen at every stage: input sanitization, least-privilege database roles, dependency scanning via Snyk in CI/CD, and never checking in secrets or hardcoded tokens. In code reviews, I actively verify authorization boundaries.",
      keyPoints: ["Shift-left security.", "Least privilege.", "Automated scanning."],
      tips: "Show that security is ingrained in your coding habits."
    },
    expectedKeywords: ["shift-left", "least privilege", "Snyk", "authorization", "secrets"],
    indiaContextTip: "Security compliance is paramount in Indian banking and enterprise software."
  },
  {
    id: "beh-30",
    type: "Behavioral",
    category: "Team Diversity",
    role: "General",
    difficulty: "Easy",
    question: "How do you foster an inclusive and collaborative environment for developers from diverse backgrounds?",
    followUps: ["How do you ensure quieter engineers get their voices heard in team meetings?"],
    sampleAnswer: {
      strongAnswer: "By actively inviting quieter teammates to share thoughts, ensuring code review feedback focuses on the code rather than the author, and offering written async alternatives for brainstorms so introverted or non-native English speakers can contribute equally.",
      keyPoints: ["Active inclusion.", "Async brainstorming.", "Constructive reviews."],
      tips: "Reflect authentic empathy and teamwork."
    },
    expectedKeywords: ["inclusive", "async brainstorming", "empathy", "collaboration"],
    indiaContextTip: "Critical for multinational organizations with diverse regional teams."
  },
  {
    id: "beh-31",
    type: "Behavioral",
    category: "Simplification",
    role: "General",
    difficulty: "Medium",
    question: "Describe a time you simplified a complex technical solution",
    followUps: ["Why was the original solution over-engineered?"],
    sampleAnswer: {
      strongAnswer: "A team proposal suggested introducing Kubernetes and a distributed queue for a daily batch job processing 2,000 records. I demonstrated that a simple Node.js cron job with Postgres ACID transactions completed the task in 4 seconds at zero additional infrastructure cost, avoiding massive operational complexity.",
      keyPoints: ["Reject over-engineering.", "Choose the simplest tool that reliably solves the problem."],
      tips: "Pragmatic engineering is the mark of true seniority."
    },
    expectedKeywords: ["simplification", "pragmatic", "avoid over-engineering", "cost efficiency"],
    indiaContextTip: "Senior interviewers admire engineers who resist unnecessary architectural hype."
  },
  {
    id: "beh-32",
    type: "Behavioral",
    category: "Reorganization & Change",
    role: "General",
    difficulty: "Medium",
    question: "How do you navigate company restructurings, team reassignments, or shifting leadership priorities?",
    followUps: ["How do you keep your morale high during uncertainty?"],
    sampleAnswer: {
      strongAnswer: "By focusing on what I can control: shipping high-quality code, maintaining solid relationships with teammates, and understanding the strategic business rationale behind the shift. During an organizational pivot, I quickly aligned my goals with the new team roadmap and offered to help document the legacy services we were transferring.",
      keyPoints: ["Focus on controllables.", "Positive attitude and adaptability.", "Business alignment."],
      tips: "Shows resilience in fast-paced startup or enterprise reorganizations."
    },
    expectedKeywords: ["resilience", "adaptability", "business goals", "controllables"],
    indiaContextTip: "Common occurrence in the Indian tech ecosystem."
  },
  {
    id: "beh-33",
    type: "Behavioral",
    category: "High Stakes Delivery",
    role: "General",
    difficulty: "Hard",
    question: "Describe a situation where a critical demo or release failed right before an executive meeting. How did you react?",
    followUps: ["How did you communicate the issue to leadership?"],
    sampleAnswer: {
      strongAnswer: "Ten minutes before a major client demo, a third-party payment sandbox went down. Rather than panicking, I switched our staging environment to a deterministic mock service worker with recorded transaction states. I briefed the presenter on the fallback. The demo proceeded flawlessly and the client signed the agreement.",
      keyPoints: ["Grace under pressure.", "Having robust mock fallbacks.", "Transparent stakeholder communication."],
      tips: "Demonstrates calm problem-solving under stress."
    },
    expectedKeywords: ["grace under pressure", "mock fallback", "communication", "resilience"],
    indiaContextTip: "Shows enterprise presence of mind."
  },
  {
    id: "beh-34",
    type: "Behavioral",
    category: "Technical Standards",
    role: "General",
    difficulty: "Medium",
    question: "How do you uphold technical excellence in a team where other developers cut corners?",
    followUps: ["How do you avoid sounding condescending?"],
    sampleAnswer: {
      strongAnswer: "By automating standards through tooling rather than manual policing. I introduced ESLint, Prettier, Husky pre-commit hooks, and SonarQube in CI to enforce code coverage and quality gates automatically. This removed emotional friction and raised our code baseline seamlessly.",
      keyPoints: ["Automate standards via CI/CD.", "Remove personal confrontation through automated guardrails."],
      tips: "Tooling is more effective than nagging."
    },
    expectedKeywords: ["Husky", "SonarQube", "automation", "quality gates", "CI/CD"],
    indiaContextTip: "Engineering discipline through tooling is widely respected."
  },
  {
    id: "beh-35",
    type: "Behavioral",
    category: "Long-Term Vision",
    role: "General",
    difficulty: "Easy",
    question: "What are your long-term career aspirations, and how does this role fit into that roadmap?",
    followUps: ["Do you aspire towards an engineering management or principal architect trajectory?"],
    sampleAnswer: {
      strongAnswer: "Over the next 3 to 5 years, my goal is to evolve into a Principal Architect leading distributed systems and platform infrastructure. This role offers the scale, high concurrency challenges, and mentorship environment that will sharpen my architectural instincts while allowing me to deliver high-impact engineering solutions.",
      keyPoints: ["Clear ambition (Staff/Principal Architect).", "Alignment with company scope and technical challenges."],
      tips: "Convey ambition paired with commitment to the company's success."
    },
    expectedKeywords: ["Principal Architect", "scale", "concurrency", "vision", "impact"],
    indiaContextTip: "Clarifies technical track vs managerial track alignment."
  },

  // ==========================================================================
  // TECHNICAL QUESTIONS (40)
  // Frontend: 10 | Backend/SDE: 10 | QA Automation: 10 | Data Science: 10
  // ==========================================================================

  // --- Frontend Developer (10 questions) ---
  {
    id: "tech-fe-1",
    type: "Technical",
    category: "React Architecture",
    role: "Frontend Developer",
    difficulty: "Medium",
    question: "Explain React lifecycle in class components and how it maps to functional component hooks",
    followUps: [
      "How do you replicate componentDidUpdate with selective dependency comparisons?",
      "Why is returning a cleanup function in useEffect crucial to prevent memory leaks?",
      "What is the difference between useEffect and useLayoutEffect?"
    ],
    sampleAnswer: {
      strongAnswer: "In class components, the lifecycle consists of Mounting (constructor, getDerivedStateFromProps, render, componentDidMount), Updating (shouldComponentUpdate, render, getSnapshotBeforeUpdate, componentDidUpdate), and Unmounting (componentWillUnmount). In functional components, these are unified under hooks: useEffect with an empty dependency array maps to componentDidMount, useEffect with dependencies maps to componentDidUpdate, and the cleanup function returned from useEffect maps to componentWillUnmount. Additionally, useLayoutEffect fires synchronously after all DOM mutations but before the browser paints, which is essential for reading layout measurements and avoiding visual flicker.",
      keyPoints: [
        "Contrast Mounting, Updating, and Unmounting phases.",
        "Map componentDidMount, componentDidUpdate, and componentWillUnmount to useEffect.",
        "Explain useLayoutEffect vs useEffect timing with browser paint."
      ],
      tips: "Mention React 18/19 concurrent rendering and why lifecycle methods should be pure and idempotent."
    },
    expectedKeywords: ["mounting", "updating", "unmounting", "useEffect", "useLayoutEffect", "cleanup function", "render", "paint"],
    indiaContextTip: "A staple in Indian frontend interviews. Candidates who clearly articulate paint timing vs layout effects stand out."
  },
  {
    id: "tech-fe-2",
    type: "Technical",
    category: "React Hooks",
    role: "Frontend Developer",
    difficulty: "Medium",
    question: "What are hooks in React? Explain the rules of hooks and when to use useMemo vs useCallback",
    followUps: [
      "Can you call hooks conditionally inside an if statement, and why does React forbid it?",
      "What is the performance cost of overuse of useMemo and useCallback?"
    ],
    sampleAnswer: {
      strongAnswer: "Hooks are functions that let functional components tap into React state and lifecycle features without writing classes. The two fundamental rules of hooks are: 1. Only call hooks at the top level (never inside loops, conditions, or nested functions) so React can preserve hook call order across renders using an internal linked list; 2. Only call hooks from React function components or custom hooks. useMemo caches the result of an expensive calculation between renders, while useCallback caches a function definition to prevent unnecessary re-renders of memoized child components (React.memo).",
      keyPoints: [
        "Explain the top-level execution rule and internal linked list tracking.",
        "Distinguish caching values (useMemo) vs caching function references (useCallback).",
        "Explain referential equality for child components wrapped in React.memo."
      ],
      tips: "Highlight that premature optimization with useMemo has a memory overhead and should be guided by profiler data."
    },
    expectedKeywords: ["useMemo", "useCallback", "rules of hooks", "linked list", "referential equality", "React.memo"],
    indiaContextTip: "Commonly tested in machine coding and technical rounds at Flipkart, Meesho, and CRED."
  },
  {
    id: "tech-fe-3",
    type: "Technical",
    category: "JavaScript Core",
    role: "Frontend Developer",
    difficulty: "Easy",
    question: "Difference between var, let, const in JavaScript: scope, hoisting, and re-declaration",
    followUps: [
      "What is the Temporal Dead Zone (TDZ) and why does it occur?",
      "Can properties of an object declared with const be modified?"
    ],
    sampleAnswer: {
      strongAnswer: "var is function-scoped (or globally scoped), can be re-declared, and is hoisted to the top of its scope initialized to undefined. In contrast, let and const are block-scoped (scoped to curly braces {}), cannot be re-declared in the same scope, and are hoisted without initialization, placing them in the Temporal Dead Zone (TDZ) from the start of the block until the declaration is evaluated, throwing a ReferenceError if accessed early. const additionally requires immediate initialization and cannot be reassigned, although properties of objects assigned to const can still be mutated unless frozen with Object.freeze().",
      keyPoints: [
        "Function scope (var) vs Block scope (let/const).",
        "Hoisting differences and the Temporal Dead Zone (TDZ).",
        "Immutability of variable binding (const) vs mutation of object contents."
      ],
      tips: "Always mention the Temporal Dead Zone (TDZ); it demonstrates deep JavaScript engine understanding."
    },
    expectedKeywords: ["var", "let", "const", "block scope", "function scope", "hoisting", "Temporal Dead Zone", "reassignment"],
    indiaContextTip: "Every Indian service-based and product-based company asks this question in round 1 technical screens."
  },
  {
    id: "tech-fe-4",
    type: "Technical",
    category: "JavaScript Core",
    role: "Frontend Developer",
    difficulty: "Medium",
    question: "How does closure work in JavaScript? Provide practical production use-cases",
    followUps: [
      "Can closures lead to memory leaks, and how do modern V8 engines mitigate this?",
      "How do you implement a private counter or memoization function using closures?"
    ],
    sampleAnswer: {
      strongAnswer: "A closure is the combination of a function bundled together with references to its surrounding lexical environment. In JavaScript, an inner function retains access to variables declared in its outer enclosing function even after the outer function has finished executing and returned. Practical use-cases include: 1. Data privacy / encapsulation (e.g. creating private variables in factory functions); 2. Function currying and partial application; 3. Memoization cache decorators; 4. Event handlers and debouncing/throttling utilities preserving timer IDs.",
      keyPoints: [
        "Define closure and lexical scope retention.",
        "Give concrete examples: debounce/throttle, memoization, private state.",
        "Discuss garbage collection and potential memory retention."
      ],
      tips: "Write or explain a clean debounce or memoize snippet in pseudo-code during your answer."
    },
    expectedKeywords: ["closure", "lexical environment", "encapsulation", "debounce", "throttle", "memoization", "garbage collection"],
    indiaContextTip: "Inspired by 'Namaste JavaScript' (Akshay Saini), which is widely referenced by Indian interviewers."
  },
  {
    id: "tech-fe-5",
    type: "Technical",
    category: "Asynchronous JavaScript",
    role: "Frontend Developer",
    difficulty: "Medium",
    question: "Explain async/await and the JavaScript Event Loop (microtasks vs macrotasks)",
    followUps: [
      "In what order do Promise.then, setTimeout, process.nextTick/queueMicrotask, and setImmediate execute?",
      "How does async/await handle unhandled rejections compared to Promise.catch?"
    ],
    sampleAnswer: {
      strongAnswer: "JavaScript is single-threaded with a non-blocking event-driven runtime. Code executes on the Call Stack. When asynchronous operations occur, their callbacks are sent to task queues: the Microtask Queue (Promises, queueMicrotask, MutationObserver) and the Macrotask Queue (setTimeout, setInterval, I/O, UI rendering). The Event Loop continually monitors the call stack; once empty, it drains the entire Microtask Queue before taking a single task from the Macrotask Queue. async/await is syntactic sugar over Promises and generators, pausing execution of the async function while yielding control to the Event Loop until the awaited Promise resolves.",
      keyPoints: [
        "Single-threaded call stack execution.",
        "Priority: Microtasks execute before Macrotasks.",
        "async/await as Promise-based non-blocking execution suspension."
      ],
      tips: "Walk through a code snippet execution order trace (e.g. console.log(1), setTimeout, Promise.resolve.then) clearly."
    },
    expectedKeywords: ["Event Loop", "Call Stack", "Microtask Queue", "Macrotask Queue", "Promises", "setTimeout", "async/await"],
    indiaContextTip: "High-probability question in every JavaScript technical interview across India."
  },
  {
    id: "tech-fe-6",
    type: "Technical",
    category: "Virtual DOM & Reconciliation",
    role: "Frontend Developer",
    difficulty: "Hard",
    question: "How does the Virtual DOM work and how does React Fiber optimize rendering?",
    followUps: ["Why is using index as a key an anti-pattern in lists?"]
  },
  {
    id: "tech-fe-7",
    type: "Technical",
    category: "State Management",
    role: "Frontend Developer",
    difficulty: "Medium",
    question: "Compare Context API vs Redux Toolkit vs Zustand: when would you choose each?",
    followUps: ["How do you prevent unnecessary re-renders in Context API?"]
  },
  {
    id: "tech-fe-8",
    type: "Technical",
    category: "Performance",
    role: "Frontend Developer",
    difficulty: "Hard",
    question: "What are Core Web Vitals (LCP, FID/INP, CLS) and how do you optimize them in production?",
    followUps: ["How do dynamic imports, image formats, and font loading affect LCP and CLS?"]
  },
  {
    id: "tech-fe-9",
    type: "Technical",
    category: "Rendering Strategies",
    role: "Frontend Developer",
    difficulty: "Medium",
    question: "Explain CSR vs SSR vs SSG vs ISR in modern frameworks like Next.js",
    followUps: ["What are React Server Components (RSC) and how do they differ from SSR?"]
  },
  {
    id: "tech-fe-10",
    type: "Technical",
    category: "CSS Architecture",
    role: "Frontend Developer",
    difficulty: "Easy",
    question: "Explain the CSS Box Model and compare Flexbox vs CSS Grid for responsive web design",
    followUps: ["What is the difference between box-sizing: content-box and border-box?"]
  },

  // --- Backend Developer / SDE (10 questions) ---
  {
    id: "tech-be-1",
    type: "Technical",
    category: "Architecture",
    role: "Backend Developer",
    difficulty: "Medium",
    question: "Compare Monolithic vs Microservices architectures: what are the real operational trade-offs?",
    followUps: [
      "How do you handle distributed tracing across microservices?",
      "When is it better to stick with a modular monolith?"
    ],
    sampleAnswer: {
      strongAnswer: "Monoliths offer single-deployment simplicity, ACID transactions across tables, and zero network latency for inter-module calls, but can suffer from slow build times, tight coupling, and scaling bottlenecks. Microservices offer autonomous deployments, independent horizontal scaling, and tech-stack flexibility, but introduce severe distributed system complexities: network latency, partial failures, distributed data consistency, and operational overhead. Teams should start with a modular monolith with clean boundaries and only split services when organizational scaling or independent deployment needs justify the overhead.",
      keyPoints: ["Trade-offs: simplicity & transactions vs autonomy & scalability.", "Distributed complexities: networking, data consistency, monitoring.", "Modular monolith as a pragmatic middle ground."],
      tips: "Quote Conway's Law and Martin Fowler's Strangler Fig pattern."
    },
    expectedKeywords: ["monolith", "microservices", "ACID", "autonomous deployment", "distributed tracing", "strangler fig"],
    indiaContextTip: "SDE-2/SDE-3 interviews at Swiggy, Amazon, and Flipkart heavily emphasize when NOT to use microservices."
  },
  {
    id: "tech-be-2",
    type: "Technical",
    category: "API Design",
    role: "Backend Developer",
    difficulty: "Medium",
    question: "Compare REST vs GraphQL vs gRPC: when would you select each for scalable systems?",
    followUps: ["Why is gRPC preferred for internal service-to-service communication?"]
  },
  {
    id: "tech-be-3",
    type: "Technical",
    category: "Databases",
    role: "Backend Developer",
    difficulty: "Hard",
    question: "How does database indexing work internally (B-Trees / B+ Trees), and when can indexes degrade performance?",
    followUps: ["Why are B+ Trees favored over Binary Search Trees or B-Trees for disk storage?"]
  },
  {
    id: "tech-be-4",
    type: "Technical",
    category: "Distributed Transactions",
    role: "Backend Developer",
    difficulty: "Hard",
    question: "Explain ACID properties and how to manage distributed transactions using the Saga Pattern",
    followUps: ["What is the difference between Choreography and Orchestration in Sagas?"]
  },
  {
    id: "tech-be-5",
    type: "Technical",
    category: "Performance & Networking",
    role: "Backend Developer",
    difficulty: "Medium",
    question: "Explain Connection Pooling and how to prevent connection pool exhaustion during traffic spikes",
    followUps: ["How does PgBouncer optimize PostgreSQL connection scaling?"]
  },
  {
    id: "tech-be-6",
    type: "Technical",
    category: "Security",
    role: "Backend Developer",
    difficulty: "Medium",
    question: "Compare JWT vs Session-based authentication: discuss security vulnerabilities and revocation strategies",
    followUps: ["How do you invalidate a JWT before its expiration date without hitting a database on every call?"]
  },
  {
    id: "tech-be-7",
    type: "Technical",
    category: "Concurrency",
    role: "Backend Developer",
    difficulty: "Hard",
    question: "How do you handle concurrency, race conditions, and thread safety in backend systems?",
    followUps: ["What is the difference between Optimistic and Pessimistic locking?"]
  },
  {
    id: "tech-be-8",
    type: "Technical",
    category: "Caching",
    role: "Backend Developer",
    difficulty: "Medium",
    question: "Explain Redis caching patterns: Cache-Aside vs Write-Through, and how to avoid Cache Stampede",
    followUps: ["What is Cache Penetration vs Cache Avalanche, and how do Bloom filters help?"]
  },
  {
    id: "tech-be-9",
    type: "Technical",
    category: "Message Queues",
    role: "Backend Developer",
    difficulty: "Hard",
    question: "Compare Apache Kafka vs RabbitMQ: explain partitioning, consumer groups, and idempotency",
    followUps: ["How do you guarantee exactly-once processing semantics in message consumers?"]
  },
  {
    id: "tech-be-10",
    type: "Technical",
    category: "Database Tuning",
    role: "Backend Developer",
    difficulty: "Medium",
    question: "How do you optimize slow SQL queries using EXPLAIN ANALYZE? Discuss common anti-patterns",
    followUps: ["What is the N+1 query problem in ORMs and how do you resolve it?"]
  },

  // --- QA Automation Engineer (10 questions) ---
  {
    id: "tech-qa-1",
    type: "Technical",
    category: "Testing Fundamentals",
    role: "QA Automation Engineer",
    difficulty: "Easy",
    question: "What is test automation and how do you decide what test cases to automate?",
    followUps: [
      "How do you calculate ROI for test automation?",
      "Why shouldn't you aim for 100% UI automation?"
    ],
    sampleAnswer: {
      strongAnswer: "Test automation is using software tools to execute pre-scripted test suites automatically, comparing expected outcomes against actual results. We prioritize automation for repetitive regression suites, high-volume data-driven scenarios, critical user workflows (checkout, login, payments), and cross-browser matrices. We avoid automating unstable, rapidly changing exploratory features. According to the Test Pyramid, we focus the bulk of tests on fast, isolated unit and API tests, keeping expensive UI end-to-end tests reserved for end-to-end happy paths.",
      keyPoints: ["Automation criteria: repetition, risk, stability, data volume.", "Test Pyramid ratio: Unit > API > UI.", "Avoid premature UI automation on fluid features."],
      tips: "Emphasize maintainability and execution speed."
    },
    expectedKeywords: ["test automation", "Test Pyramid", "regression", "ROI", "API tests", "UI tests"],
    indiaContextTip: "TCS, Wipro, Cognizant, and product companies like BrowserStack ask this in every automation screen."
  },
  {
    id: "tech-qa-2",
    type: "Technical",
    category: "Testing Types",
    role: "QA Automation Engineer",
    difficulty: "Easy",
    question: "Difference between unit and integration testing (and end-to-end testing)",
    followUps: ["Where does API testing fit within this spectrum?"]
  },
  {
    id: "tech-qa-3",
    type: "Technical",
    category: "Browser Automation",
    role: "QA Automation Engineer",
    difficulty: "Medium",
    question: "Explain Selenium WebDriver architecture and compare it with modern tools like Playwright and Cypress",
    followUps: ["How does Playwright's WebSocket protocol outperform Selenium's JSON Wire / W3C WebDriver HTTP calls?"]
  },
  {
    id: "tech-qa-4",
    type: "Technical",
    category: "API Testing",
    role: "QA Automation Engineer",
    difficulty: "Medium",
    question: "What is API testing, and how do you test status codes, payload schemas, and authentication using RestAssured or Postman?",
    followUps: ["How do you validate JSON schema compliance automatically?"]
  },
  {
    id: "tech-qa-5",
    type: "Technical",
    category: "Design Patterns in Testing",
    role: "QA Automation Engineer",
    difficulty: "Medium",
    question: "What is the Page Object Model (POM) pattern, and why is it essential for maintainable test suites?",
    followUps: ["How do you combine POM with Component-based architecture?"]
  },
  {
    id: "tech-qa-6",
    type: "Technical",
    category: "Test Doubles",
    role: "QA Automation Engineer",
    difficulty: "Medium",
    question: "Explain the difference between Mocks, Stubs, Dummies, Spies, and Fakes in automated testing",
    followUps: ["When is mocking an external payment gateway appropriate versus using a sandbox environment?"]
  },
  {
    id: "tech-qa-7",
    type: "Technical",
    category: "Flaky Tests",
    role: "QA Automation Engineer",
    difficulty: "Hard",
    question: "How do you identify, debug, and eliminate flaky tests in CI/CD pipelines?",
    followUps: ["Why is using hardcoded sleep statements an anti-pattern compared to explicit/dynamic waits?"]
  },
  {
    id: "tech-qa-8",
    type: "Technical",
    category: "CI/CD & DevOps",
    role: "QA Automation Engineer",
    difficulty: "Medium",
    question: "How do you integrate automated regression suites into CI/CD pipelines with test parallelization?",
    followUps: ["How do you manage test reporting and alerting on failed regression runs?"]
  },
  {
    id: "tech-qa-9",
    type: "Technical",
    category: "Performance Testing",
    role: "QA Automation Engineer",
    difficulty: "Medium",
    question: "How do you design and execute load and stress testing using JMeter or k6?",
    followUps: ["What is the difference between Load, Stress, Soak, and Spike testing?"]
  },
  {
    id: "tech-qa-10",
    type: "Technical",
    category: "Security Testing",
    role: "QA Automation Engineer",
    difficulty: "Hard",
    question: "What are the fundamentals of security testing for QA engineers (SQLi, XSS, and BOLA/IDOR)?",
    followUps: ["How do you incorporate OWASP ZAP automated security scanning into pipeline stages?"]
  },

  // --- Data Scientist (10 questions) ---
  {
    id: "tech-ds-1",
    type: "Technical",
    category: "ML Fundamentals",
    role: "Data Scientist",
    difficulty: "Easy",
    question: "Explain supervised vs unsupervised learning with industry examples",
    followUps: [
      "What is semi-supervised learning and when is it useful?",
      "Can you give an e-commerce example of each learning paradigm?"
    ],
    sampleAnswer: {
      strongAnswer: "Supervised learning trains models on labeled input-output pairs to predict continuous values (regression, e.g., house price forecasting) or discrete categories (classification, e.g., fraud detection at Razorpay). Unsupervised learning uncovers latent structures in unlabeled data without explicit targets, such as customer clustering using K-Means or dimensionality reduction with PCA. Reinforcement learning trains agents to maximize cumulative rewards through trial-and-error environment interaction (e.g., dynamic ride-pricing algorithms or algorithmic trading).",
      keyPoints: ["Supervised: labeled data (classification, regression).", "Unsupervised: unlabeled data (clustering, PCA).", "Reinforcement: reward-driven policy optimization."],
      tips: "Anchor answers with concrete business use cases."
    },
    expectedKeywords: ["supervised", "unsupervised", "reinforcement learning", "labels", "clustering", "regression", "reward"],
    indiaContextTip: "Universal opening question in Indian data science interviews."
  },
  {
    id: "tech-ds-2",
    type: "Technical",
    category: "Model Generalization",
    role: "Data Scientist",
    difficulty: "Easy",
    question: "What is overfitting and underfitting, and how do you detect and prevent them?",
    followUps: ["How do L1 (Lasso) and L2 (Ridge) regularization mathematically prevent overfitting?"]
  },
  {
    id: "tech-ds-3",
    type: "Technical",
    category: "Experimentation",
    role: "Data Scientist",
    difficulty: "Hard",
    question: "Explain A/B testing end-to-end: hypothesis testing, sample size sizing, p-values, and statistical power",
    followUps: ["How do you detect and mitigate the novelty effect or sample ratio mismatch (SRM)?"]
  },
  {
    id: "tech-ds-4",
    type: "Technical",
    category: "Data Preprocessing",
    role: "Data Scientist",
    difficulty: "Medium",
    question: "How do you handle imbalanced datasets (e.g. 99.8% negative, 0.2% positive fraud data)?",
    followUps: ["Why is SMOTE sometimes problematic for high-dimensional or categorical data?"]
  },
  {
    id: "tech-ds-5",
    type: "Technical",
    category: "Theory",
    role: "Data Scientist",
    difficulty: "Medium",
    question: "Explain the Bias-Variance tradeoff: how do bagging and boosting algorithms impact each?",
    followUps: ["Why does Random Forest reduce variance while Gradient Boosting reduces bias?"]
  },
  {
    id: "tech-ds-6",
    type: "Technical",
    category: "Evaluation Metrics",
    role: "Data Scientist",
    difficulty: "Medium",
    question: "Precision, Recall, F1-Score, and ROC-AUC: how do you choose the right metric for fraud detection vs cancer diagnosis?",
    followUps: ["When is Precision-Recall AUC (PR-AUC) preferred over ROC-AUC on imbalanced datasets?"]
  },
  {
    id: "tech-ds-7",
    type: "Technical",
    category: "Feature Engineering",
    role: "Data Scientist",
    difficulty: "Medium",
    question: "Discuss feature engineering strategies: handling missing data, encoding high-cardinality categoricals, and feature scaling",
    followUps: ["Why must feature scaling parameters be fit ONLY on training sets and not the full dataset?"]
  },
  {
    id: "tech-ds-8",
    type: "Technical",
    category: "Algorithms",
    role: "Data Scientist",
    difficulty: "Hard",
    question: "Compare Random Forest vs Gradient Boosting (XGBoost/LightGBM): explain tree building and gradient descent optimization",
    followUps: ["How does LightGBM's leaf-wise tree growth differ from XGBoost's level-wise tree growth?"]
  },
  {
    id: "tech-ds-9",
    type: "Technical",
    category: "Validation",
    role: "Data Scientist",
    difficulty: "Medium",
    question: "Explain Cross-Validation strategies: K-Fold, Stratified K-Fold, and Time-Series Split",
    followUps: ["Why does standard K-Fold shuffle cause catastrophic data leakage in stock forecasting or sales forecasting?"]
  },
  {
    id: "tech-ds-10",
    type: "Technical",
    category: "Statistics",
    role: "Data Scientist",
    difficulty: "Medium",
    question: "Explain p-values, Type I and Type II errors, and statistical significance in product decision making",
    followUps: ["What does p < 0.05 actually mean mathematically?"]
  },

  // ==========================================================================
  // SYSTEM DESIGN QUESTIONS (25)
  // High-concurrency systems & Indian tech unicorn scale scenarios
  // ==========================================================================
  {
    id: "sd-1",
    type: "System Design",
    category: "Social Media",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design Twitter/Facebook News Feed at scale",
    followUps: [
      "How do you handle celebrity users with 50M+ followers (Fanout-on-write vs Fanout-on-read)?",
      "How do you rank feed posts in real time?",
      "How do you ensure sub-200ms latency for users globally?"
    ],
    sampleAnswer: {
      strongAnswer: "To design Twitter/Facebook News Feed for 500M DAU, we separate the system into Feed Ingestion (Post creation) and Feed Generation (Timeline retrieval). For normal users, we employ a Fanout-on-Write (Push model) where posts are pushed asynchronously via message queues into their followers' Redis timelines. For high-follower celebrities (e.g. Virat Kohli or PM Modi with 50M+ followers), pushing to 50M lists causes severe write amplification; we use a Hybrid Model where celebrity posts are pulled and merged into the user's feed on-demand (Fanout-on-Read). We use Redis sorted sets with timestamp scores for instant chronological lookups, backed by a distributed database like Cassandra/ScyllaDB.",
      keyPoints: [
        "Capacity estimation: 500M DAU, write throughput vs read throughput.",
        "Fanout-on-Write vs Fanout-on-Read and the Hybrid approach for celebrities.",
        "Redis Sorted Sets caching and Cassandra persistent storage.",
        "Real-time ranking microservice with feature store."
      ],
      tips: "Always start with requirements clarification and capacity estimation before drawing architectural boxes."
    },
    expectedKeywords: ["Fanout-on-Write", "Fanout-on-Read", "Hybrid approach", "Redis Sorted Sets", "Cassandra", "Celebrity problem", "Write amplification"],
    indiaContextTip: "Classic FAANG/Tier-1 interview question frequently asked at Uber, Google, and Indian unicorns."
  },
  {
    id: "sd-2",
    type: "System Design",
    category: "Video Streaming",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design YouTube video streaming platform",
    followUps: [
      "How do you transcode raw 4K video uploads into adaptive bitrate streams (HLS/DASH)?",
      "How do you optimize CDN cache hit ratios for trending vs long-tail videos?"
    ]
  },
  {
    id: "sd-3",
    type: "System Design",
    category: "Web Services",
    role: "System Design Architect",
    difficulty: "Easy",
    question: "Design URL Shortener service (TinyURL)",
    followUps: [
      "How do you generate unique 7-character hash keys without collision (Base62 vs KGS)?",
      "How do you handle high read-to-write ratios with distributed caching?"
    ]
  },
  {
    id: "sd-4",
    type: "System Design",
    category: "Infrastructure",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design a caching system like Redis / Memcached",
    followUps: [
      "How do you implement Consistent Hashing with virtual nodes for uniform data distribution?",
      "How do you implement LRU/LFU eviction policies efficiently using doubly linked lists and hash maps?"
    ]
  },
  {
    id: "sd-5",
    type: "System Design",
    category: "Hyperlocal Logistics",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design Swiggy / Zomato real-time food delivery order lifecycle and driver tracking system",
    followUps: [
      "How do you store and query millions of active delivery driver coordinates every 3-5 seconds using Geohashing or Google S2 cells?",
      "How do you design the driver dispatch algorithm under high lunch/dinner surge hours?",
      "How do you ensure orders are never dropped during network dead-zones for delivery partners?"
    ],
    sampleAnswer: {
      strongAnswer: "Architecture consists of: 1. Location Ingestion Service receiving driver coordinates via WebSocket/MQTT every 4 seconds, writing to an in-memory Redis geospatial index (GEOADD/GEORADIUS) with a 30-second TTL; 2. Dispatch Matchmaker Service using Uber H3 or Google S2 spatial indexing to identify drivers within a 3km radius of the restaurant; 3. State Machine Order Service orchestrating order lifecycle (Placed -> Confirmed -> Food Ready -> Picked Up -> Delivered) with distributed locks to avoid multi-driver assignment; 4. Outbox pattern with Kafka for reliable event publishing to notification and payment ledgers.",
      keyPoints: [
        "Geospatial indexing: Geohash / Google S2 / Redis GEO.",
        "High-throughput location ingestion via WebSockets/MQTT.",
        "Order state machine with distributed locking (Redlock).",
        "Driver matchmaking optimization considering ETA, direction, and restaurant prep time."
      ],
      tips: "Emphasize network resilience for delivery executives operating in fluctuating Indian mobile networks."
    },
    expectedKeywords: ["Geohash", "Google S2", "Redis GEO", "WebSockets", "MQTT", "State Machine", "Matchmaking", "Surge"],
    indiaContextTip: "Top favorite question at Swiggy, Zomato, Zepto, Blinkit, and Ola."
  },
  {
    id: "sd-6",
    type: "System Design",
    category: "Fintech & Payments",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design UPI / PhonePe / Razorpay high-throughput real-time payment gateway",
    followUps: [
      "How do you guarantee idempotency so customers are never double-charged for network timeouts?",
      "How do you model double-entry bookkeeping ledger architecture for financial audits?",
      "How do you handle NPCI / Bank switch timeouts and reconciliation cron jobs?"
    ],
    sampleAnswer: {
      strongAnswer: "The system relies on four pillars: 1. Strict Idempotency: Every payment request requires a client-generated UUID idempotency key stored in Redis with distributed locks. Duplicate requests with the same key immediately return the in-flight or completed status; 2. Double-Entry Accounting Ledger: We never mutate balances directly; every financial transaction writes an immutable debit and credit record to an append-only ledger in a strict ACID relational database (PostgreSQL/CockroachDB); 3. Asynchronous Banking Switch Orchestration: Communicating with NPCI and bank APIs via message queues with exponential backoff and circuit breakers; 4. Automated EOD (End of Day) Reconciliation Engine comparing bank settlement files against internal transaction logs.",
      keyPoints: [
        "Idempotency keys with Redis distributed locking.",
        "Double-entry bookkeeping (every transaction has balanced debit and credit entries).",
        "Circuit breakers and failover across multiple acquiring banks.",
        "Reconciliation pipelines for handling unconfirmed bank callback states."
      ],
      tips: "Financial systems prioritize ACID consistency and auditability over eventual consistency."
    },
    expectedKeywords: ["Idempotency key", "Double-entry bookkeeping", "ACID", "Ledger", "NPCI", "Circuit breaker", "Reconciliation"],
    indiaContextTip: "Crucial for PhonePe, Razorpay, Paytm, CRED, and Juspay technical architecture rounds."
  },
  {
    id: "sd-7",
    type: "System Design",
    category: "E-Commerce",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design Flipkart / Amazon Flash Sale System (Big Billion Days inventory booking)",
    followUps: [
      "How do you prevent inventory overselling when 50,000 users click Buy Now simultaneously for 500 phones?",
      "How do you manage temporary cart reservations with automatic TTL timeouts?",
      "How do you absorb the spike before it overwhelms your database?"
    ],
    sampleAnswer: {
      strongAnswer: "To handle 100,000 RPS on limited inventory: 1. Edge & Reverse Proxy Rate Limiting: CDN and NGINX shed non-essential traffic and throttle requests per user; 2. In-Memory Inventory Reservation: Pre-warm stock counters in Redis. Decrement stock using atomic Redis Lua scripts (DECRBY) with Lua checking stock > 0 before committing. This achieves sub-millisecond reservation without database disk locks; 3. Asynchronous Order Processing: Successful reservation generates a signed temporary reservation token with a 10-minute TTL and enqueues an order event into Apache Kafka; 4. Worker Pool processes Kafka orders, initiates payment, and updates the core relational DB. If payment times out, inventory is automatically refunded back to the Redis counter.",
      keyPoints: [
        "Atomic inventory decrements via Redis Lua scripts.",
        "Decoupled queuing via Kafka to flatten database write spikes.",
        "Temporary reservation locks with automatic TTL expiration refund.",
        "Idempotent consumer processing."
      ],
      tips: "Never lock relational database rows directly during flash sales."
    },
    expectedKeywords: ["Flash sale", "Redis Lua script", "Atomic decrement", "Kafka queue", "TTL inventory hold", "Overselling prevention"],
    indiaContextTip: "The holy grail system design interview problem at Flipkart and Amazon India."
  },
  {
    id: "sd-8",
    type: "System Design",
    category: "Ride-Sharing",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design Uber / Ola ride-matching and surge-pricing system",
    followUps: ["How do you calculate real-time demand-supply ratios in geographical hexagons (Uber H3)?"]
  },
  {
    id: "sd-9",
    type: "System Design",
    category: "Messaging",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design WhatsApp / WeChat real-time chat application with group messaging",
    followUps: ["How do you handle offline message queuing and delivery receipts (sent, delivered, read)?"]
  },
  {
    id: "sd-10",
    type: "System Design",
    category: "API Gateway",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design a Distributed Rate Limiter for API Gateways",
    followUps: ["Compare Token Bucket, Leaky Bucket, and Sliding Window Log algorithms in distributed Redis clusters."]
  },
  {
    id: "sd-11",
    type: "System Design",
    category: "Storage",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Distributed Key-Value Store like DynamoDB or Cassandra",
    followUps: ["Explain Quorum consensus (R + W > N), Vector Clocks, and SSTable/LSM Tree write paths."]
  },
  {
    id: "sd-12",
    type: "System Design",
    category: "Search & Crawling",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Web Crawler capable of indexing billions of web pages",
    followUps: ["How do you manage the URL Frontier queue while respecting domain politeness and deduplication via Bloom filters?"]
  },
  {
    id: "sd-13",
    type: "System Design",
    category: "Distributed IDs",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design a Distributed Unique ID Generator (Twitter Snowflake architecture)",
    followUps: ["How do you construct a 64-bit ID using timestamps, datacenter IDs, machine IDs, and sequence counters?"]
  },
  {
    id: "sd-14",
    type: "System Design",
    category: "Collaboration",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design Google Docs / Notion real-time collaborative document editor",
    followUps: ["Compare Operational Transformation (OT) vs Conflict-free Replicated Data Types (CRDTs)."]
  },
  {
    id: "sd-15",
    type: "System Design",
    category: "Monitoring",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Centralized Metrics Monitoring & Alerting System (Datadog / Prometheus)",
    followUps: ["Compare Push vs Pull metric collection models and time-series database downsampling."]
  },
  {
    id: "sd-16",
    type: "System Design",
    category: "Notifications",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design a Scalable Multi-Channel Notification Service (SMS, Email, Push)",
    followUps: ["How do you handle user notification preferences, rate limits, and provider failover with exponential backoff?"]
  },
  {
    id: "sd-17",
    type: "System Design",
    category: "Fintech / Trading",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Low-Latency Stock Exchange Matching Engine (Zerodha / NSE scale)",
    followUps: ["How do you achieve sub-microsecond price-time priority order matching without garbage collection pauses?"]
  },
  {
    id: "sd-18",
    type: "System Design",
    category: "Storage",
    role: "System Design Architect",
    difficulty: "Easy",
    question: "Design Pastebin / Text Sharing Service with automated TTL expiration",
    followUps: ["How do you decouple metadata in SQL/NoSQL from raw payload storage in S3 with CDN caching?"]
  },
  {
    id: "sd-19",
    type: "System Design",
    category: "Search",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design Search Autocomplete / Typeahead Suggestion system",
    followUps: ["How do you structure Trie nodes with Top-K pre-computed rankings updated offline via MapReduce/Spark?"]
  },
  {
    id: "sd-20",
    type: "System Design",
    category: "Streaming",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Distributed Message Broker (Apache Kafka architecture)",
    followUps: ["Explain commit logs, zero-copy OS transfers (sendfile), partition leader election, and consumer group rebalancing."]
  },
  {
    id: "sd-21",
    type: "System Design",
    category: "Scheduling",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Distributed Job Scheduler (Distributed Cron)",
    followUps: ["How do you manage leader election using etcd/ZooKeeper and ensure jobs run at least once?"]
  },
  {
    id: "sd-22",
    type: "System Design",
    category: "Ticketing",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design BookMyShow / Ticketmaster seat reservation system for high-demand concerts",
    followUps: ["How do you handle temporary seat holds for 8 minutes and prevent race conditions when two users select the same seat?"]
  },
  {
    id: "sd-23",
    type: "System Design",
    category: "Geo-Spatial",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design a Nearby Places / Location Search Service (Yelp / Google Maps Nearby)",
    followUps: ["How does QuadTree spatial partitioning compare with Geohash grids for dynamic merchant searches?"]
  },
  {
    id: "sd-24",
    type: "System Design",
    category: "Ephemeral Media",
    role: "System Design Architect",
    difficulty: "Medium",
    question: "Design Ephemeral Stories (Instagram / WhatsApp Status with 24-hour expiration)",
    followUps: ["How do you efficiently clean up expired stories and maintain user unread story indicator rings?"]
  },
  {
    id: "sd-25",
    type: "System Design",
    category: "Cloud Storage",
    role: "System Design Architect",
    difficulty: "Hard",
    question: "Design a Cloud File Storage and Sync Service (Dropbox / Google Drive)",
    followUps: ["How do you implement block-level file chunking, deduplication, and delta synchronization across client devices?"]
  }
];

module.exports = questions;
