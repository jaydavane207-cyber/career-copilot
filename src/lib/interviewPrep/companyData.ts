// src/lib/interviewPrep/companyData.ts
// Curated company interview intelligence and role questions (100% deterministic, zero external API costs)

export interface CompanyTopQuestion {
  question: string;
  category: "System Design" | "Algorithms" | "Behavioral" | "Frontend" | "Backend" | "Core CS";
  difficulty: "Easy" | "Medium" | "Hard";
  tips: string[];
  sampleAnswerSnippet?: string;
}

export interface CompanyIntelligence {
  name: string;
  industry: string;
  difficulty: "Easy" | "Medium" | "Hard";
  averageRounds: number;
  cultureSummary: string;
  keyValues: string[];
  tipsForInterview: string[];
  topQuestions: CompanyTopQuestion[];
}

export const KNOWN_COMPANIES: Record<string, CompanyIntelligence> = {
  google: {
    name: "Google",
    industry: "Technology & Cloud",
    difficulty: "Hard",
    averageRounds: 5,
    cultureSummary: "Innovation-driven, consensus-building, data-focused, fast-paced. Values: Think 10x, Act Fast, Be Helpful, Googleyness & Psychological Safety.",
    keyValues: ["Focus on the user", "Think 10x", "Intellectual Humility", "Googleyness", "Data-driven decisions"],
    tipsForInterview: [
      "Ask clarifying questions before writing a single line of code.",
      "State Big-O time and space complexity upfront before optimizing.",
      "In System Design, explicitly calculate scale (QPS, storage, bandwidth).",
      "For behavioral questions, demonstrate how you navigate ambiguity and disagree with empathy."
    ],
    topQuestions: [
      {
        question: "Design YouTube video upload, transcoding pipeline, and CDN delivery at 2B MAU scale.",
        category: "System Design",
        difficulty: "Hard",
        tips: ["Highlight chunking and resumable uploads", "Explain adaptive bitrate streaming (HLS/DASH)", "Discuss CDN edge cache eviction"],
        sampleAnswerSnippet: "Break upload into 5MB chunks with pre-signed GCS URLs. Worker queue processes parallel FFmpeg transcoding into multi-bitrate streams. Edge Points of Presence cache top 20% viral video segments."
      },
      {
        question: "Find the median from a data stream of numbers arriving in real-time.",
        category: "Algorithms",
        difficulty: "Hard",
        tips: ["Use two heaps: max-heap for lower half, min-heap for upper half", "Keep sizes balanced within 1 element difference"],
        sampleAnswerSnippet: "Maintain a max-heap for lower numbers and min-heap for larger numbers. If heaps differ by more than 1 in size, rebalance by popping and pushing."
      },
      {
        question: "Tell me about a time you had a technical disagreement with a team lead or colleague. How did you resolve it?",
        category: "Behavioral",
        difficulty: "Medium",
        tips: ["Use STAR method", "Focus on data and prototyping rather than ego", "Show outcome and mutual respect"],
        sampleAnswerSnippet: "Rather than debating microservices vs modular monolith theoretically, I ran a 2-day benchmark simulating our peak throughput. The data showed modular monolith met p99 latency with 60% less operational overhead."
      }
    ]
  },
  microsoft: {
    name: "Microsoft",
    industry: "Enterprise Software & Cloud",
    difficulty: "Hard",
    averageRounds: 4,
    cultureSummary: "Growth mindset, customer-obsessed, diverse & inclusive, collaborative, work-life balance oriented.",
    keyValues: ["Growth Mindset", "Customer Obsession", "Diversity & Inclusion", "One Microsoft"],
    tipsForInterview: [
      "Emphasize continuous learning: highlight what you learned from failures.",
      "Write modular, clean, and testable code with clean variable naming.",
      "Show enterprise readiness: consider backward compatibility and security.",
      "Be prepared for scenario-based architectural questions on Azure/cloud patterns."
    ],
    topQuestions: [
      {
        question: "Design a collaborative real-time document editor like Microsoft Word / Notion.",
        category: "System Design",
        difficulty: "Hard",
        tips: ["Contrast Operational Transformation (OT) vs CRDTs", "Explain WebSocket connections and snapshot state persistence"],
        sampleAnswerSnippet: "Use CRDTs (Conflict-free Replicated Data Types) for decentralized merging without server coordination locks. Store document change logs in an append-only store and broadcast operational deltas over WebSockets."
      },
      {
        question: "Serialize and deserialize a binary tree.",
        category: "Algorithms",
        difficulty: "Medium",
        tips: ["Pre-order traversal with delimiter and null-markers", "Queue-based iterative reconstruction"],
        sampleAnswerSnippet: "Use preorder traversal (Root, Left, Right) separated by commas, marking null nodes with '#'. For deserialization, split string into tokens and recursively build subtrees."
      },
      {
        question: "Describe a project where you had to learn an unfamiliar technology stack under tight deadline constraints.",
        category: "Behavioral",
        difficulty: "Medium",
        tips: ["Demonstrate growth mindset", "Show structured learning approach (docs, spike, tests)", "Highlight impact delivered"],
        sampleAnswerSnippet: "When tasked with building our WebSocket notification system in Go with no prior Go experience, I spent 2 days building a spike, consulted official specs, and delivered the microservice 3 days ahead of schedule."
      }
    ]
  },
  amazon: {
    name: "Amazon",
    industry: "E-Commerce, Cloud & Logistics",
    difficulty: "Hard",
    averageRounds: 5,
    cultureSummary: "Frugality, bias for action, deep dive, ownership, customer obsession. Driven by the 16 Leadership Principles.",
    keyValues: ["Customer Obsession", "Ownership", "Bias for Action", "Earn Trust", "Deliver Results", "Have Backbone; Disagree and Commit"],
    tipsForInterview: [
      "Every single answer in behavioral rounds MUST map directly to an Amazon Leadership Principle.",
      "Use quantified metrics in every STAR answer (e.g., 'reduced latency by 32%', 'saved $40K monthly').",
      "Expect the Bar Raiser round to rigorously probe boundary conditions and edge cases.",
      "Be prepared to explain deep dive trade-offs between consistency and availability (CAP theorem)."
    ],
    topQuestions: [
      {
        question: "Design an e-commerce flash sale inventory reservation system preventing overselling at 100K RPS.",
        category: "System Design",
        difficulty: "Hard",
        tips: ["Use Redis distributed locks or Lua atomic scripts for inventory decrement", "Kafka order queue to decouple billing", "Optimistic concurrency control with database versioning"],
        sampleAnswerSnippet: "Decouple inventory reservation from payment. Use Redis atomic decrement (DECRBY) with Lua script to verify stock > 0 in memory. On success, enqueue order token into Kafka; on payment failure, release stock via compensating transaction."
      },
      {
        question: "LRU (Least Recently Used) Cache implementation with O(1) get and put.",
        category: "Algorithms",
        difficulty: "Medium",
        tips: ["Hash Map + Doubly Linked List", "Dummy head and tail nodes to simplify pointer operations"],
        sampleAnswerSnippet: "Combine a hash map pointing to doubly linked list nodes. When an item is accessed or added, move it to the head. When capacity is exceeded, evict the node right before the tail."
      },
      {
        question: "Tell me about a time you had to make an important architectural decision without having all the data.",
        category: "Behavioral",
        difficulty: "Medium",
        tips: ["Highlight 'Bias for Action' and 'Two-Way Door Decisions'", "Explain risk mitigation strategies"],
        sampleAnswerSnippet: "Recognizing this was a two-way door decision, I chose Postgres with JSONB indexing over a dedicated NoSQL cluster, allowing us to ship the MVP 4 weeks earlier while retaining an easy migration path if query patterns diversified."
      }
    ]
  },
  meta: {
    name: "Meta",
    industry: "Social Media & AI",
    difficulty: "Hard",
    averageRounds: 4,
    cultureSummary: "Move fast, build awesome things, live in the future, be open. Deep algorithmic efficiency and fast coding.",
    keyValues: ["Move Fast", "Focus on Long-Term Impact", "Build Awesome Things", "Live in the Future", "Be Open"],
    tipsForInterview: [
      "Speed matters: you are expected to solve 2 algorithmic problems in 45 minutes.",
      "Write bug-free code quickly; avoid long pauses before coding.",
      "In System Design, master distributed caching (Memcached/TAO) and graph queries.",
      "Explain end-to-end data flow with client-side optimistic UI updates."
    ],
    topQuestions: [
      {
        question: "Design Facebook News Feed with fan-out on write vs fan-out on read.",
        category: "System Design",
        difficulty: "Hard",
        tips: ["Discuss push vs pull model for celebrity accounts", "Ranking service ML scoring", "Distributed cache architecture"],
        sampleAnswerSnippet: "Use hybrid fan-out: for regular users, push posts to friends' feed timelines on write. For high-follower accounts, pull posts at read time. Feed aggregator merges and ranks stories via machine-learned scoring model."
      },
      {
        question: "Merge k Sorted Lists into one sorted linked list.",
        category: "Algorithms",
        difficulty: "Hard",
        tips: ["Min-heap of size k or divide and conquer merge", "O(N log k) time complexity"],
        sampleAnswerSnippet: "Insert the head node of all k lists into a min-heap. Pop the minimum node, append to result, and push its next pointer into the heap until empty."
      }
    ]
  }
};

export function getCompanyIntelligence(companyName: string, roleTitle: string = "Software Engineer"): CompanyIntelligence {
  const normalized = (companyName || "").trim().toLowerCase();

  // Check known map
  for (const [key, data] of Object.entries(KNOWN_COMPANIES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return data;
    }
  }

  // Generative fallback for any other company
  const displayName = companyName.trim() || "Target Company";
  return {
    name: displayName,
    industry: "Technology / Software",
    difficulty: "Medium",
    averageRounds: 4,
    cultureSummary: `High-ownership, collaborative engineering culture prioritizing business impact, code reliability, and clear technical communication at ${displayName}.`,
    keyValues: [
      "Technical Excellence",
      "Problem Solving & Ownership",
      "Effective Cross-functional Communication",
      "Customer-Centric Execution"
    ],
    tipsForInterview: [
      `Research ${displayName}'s core product, business model, and recent developments.`,
      "Clarify requirements and edge cases thoroughly before starting solutions.",
      "Communicate your thought process out loud at every step of technical problem solving.",
      "Prepare 3 structured questions demonstrating genuine interest in their engineering roadmap."
    ],
    topQuestions: [
      {
        question: `How would you design a scalable web architecture handling high traffic spikes for ${displayName}'s core product?`,
        category: "System Design",
        difficulty: "Medium",
        tips: [
          "Discuss horizontal scaling and stateless API services",
          "Explain caching layers (Redis/CDN)",
          "Highlight database read replicas and sharding"
        ],
        sampleAnswerSnippet: "Deploy containerized services behind load balancers with auto-scaling groups. Cache heavy database queries in Redis and deliver static assets via CDN. Employ write-ahead logging and database read-replicas."
      },
      {
        question: "Design an in-memory rate limiter supporting 10,000 requests per minute per IP.",
        category: "Algorithms",
        difficulty: "Medium",
        tips: [
          "Token Bucket or Sliding Window Log algorithm",
          "Atomic counter operations in Redis or concurrent hash map"
        ],
        sampleAnswerSnippet: "Use the Token Bucket algorithm. Maintain a capacity of 10,000 tokens and refill at constant rate. Decrement 1 token per request; reject if bucket is empty."
      },
      {
        question: `Tell me about a complex technical challenge you solved in your past experience that is relevant to ${roleTitle}.`,
        category: "Behavioral",
        difficulty: "Medium",
        tips: [
          "Structure response with STAR (Situation, Task, Action, Result)",
          "Quantify the performance or business improvement",
          "Mention technical trade-offs you evaluated"
        ],
        sampleAnswerSnippet: "Our analytics endpoint suffered 4-second latency under peak load. I profiled the slow queries, introduced composite indexes and Redis caching for aggregate computations, reducing p95 response time to 180ms."
      }
    ]
  };
}
