// backend/seeds/indiaSkillDefinitions.js
/**
 * Detailed Skill Definitions for each of the 20 Target Roles in the Indian Tech Ecosystem.
 * Each role contains 8 Required Skills and 3 Optional Skills.
 * Schema adheres to user requirement:
 * {
 *   roleId: "frontend-developer",
 *   skill: "React",
 *   category: "JavaScript Framework",
 *   difficulty: "Intermediate",
 *   requiredLevel: 75,
 *   estimatedHours: 80,
 *   isOptional: false,
 *   resources: {
 *     official: "https://react.dev",
 *     youtube: "https://youtube.com/...",
 *     course: "https://..."
 *   }
 * }
 */

const roleSkills = [
  // 1. Senior Software Engineer
  {
    roleId: "senior-software-engineer",
    skill: "System Design & Distributed Architectures",
    category: "Architecture",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 120,
    isOptional: false,
    resources: {
      official: "https://github.com/donnemartin/system-design-primer",
      youtube: "https://www.youtube.com/@gkcs",
      course: "https://bytebytego.com"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Java & Spring Boot",
    category: "Backend Language & Framework",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://spring.io/projects/spring-boot",
      youtube: "https://www.youtube.com/@JavaBrainsChannel",
      course: "https://www.baeldung.com"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Distributed Systems & Scalability",
    category: "Distributed Systems",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 90,
    isOptional: false,
    resources: {
      official: "https://martinfowler.com/articles/patterns-of-distributed-systems/",
      youtube: "https://www.youtube.com/watch?v=Y6Ev8GkD3Go",
      course: "https://dataintensive.net"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Microservices Architecture",
    category: "Architecture",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://microservices.io",
      youtube: "https://www.youtube.com/watch?v=1xo-0gCVhTU",
      course: "https://microservices.io/patterns/index.html"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "PostgreSQL & Database Internals",
    category: "Databases",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/",
      youtube: "https://www.youtube.com/watch?v=e1f7LsmL5qM",
      course: "https://use-the-index-luke.com"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Redis Caching Strategies",
    category: "Caching & In-Memory",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://redis.io/docs/",
      youtube: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
      course: "https://university.redis.com"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Concurrency & Multithreading",
    category: "Core Computing",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://docs.oracle.com/javase/tutorial/essential/concurrency/",
      youtube: "https://www.youtube.com/watch?v=r_MbozD32eo",
      course: "https://www.baeldung.com/java-concurrency"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Docker & Containerization",
    category: "DevOps",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.docker.com",
      youtube: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      course: "https://training.play-with-docker.com"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Apache Kafka",
    category: "Message Streaming",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://kafka.apache.org/documentation/",
      youtube: "https://www.youtube.com/watch?v=R873BlNVUB4",
      course: "https://developer.confluent.io/learn-kafka/"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "AWS Cloud Architecture",
    category: "Cloud",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://aws.amazon.com/architecture/",
      youtube: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "senior-software-engineer",
    skill: "Prometheus & Grafana Observability",
    category: "Observability",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://prometheus.io/docs/introduction/overview/",
      youtube: "https://www.youtube.com/watch?v=h4Sl21AK9g8",
      course: "https://grafana.com/tutorials/"
    }
  },

  // 2. Full Stack Developer
  {
    roleId: "full-stack-developer",
    skill: "JavaScript & TypeScript",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://www.typescriptlang.org/docs/",
      youtube: "https://www.youtube.com/watch?v=d56mG7DezGs",
      course: "https://javascript.info"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "React",
    category: "Frontend Framework",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://react.dev",
      youtube: "https://www.youtube.com/watch?v=bMknfKXIFA8",
      course: "https://fullstackopen.com/en/"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "Node.js & Express",
    category: "Backend Runtime",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://nodejs.org/en/docs",
      youtube: "https://www.youtube.com/watch?v=Oe421EPjeBE",
      course: "https://www.theodinproject.com/paths/full-stack-javascript"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "PostgreSQL",
    category: "Databases",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://www.postgresqltutorial.com",
      youtube: "https://www.youtube.com/watch?v=qw--VYLpxG4",
      course: "https://sqlzoo.net"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "MongoDB",
    category: "Databases",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://www.mongodb.com/docs/",
      youtube: "https://www.youtube.com/watch?v=ofme2o29ngU",
      course: "https://learn.mongodb.com"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "REST & GraphQL APIs",
    category: "API Design",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://graphql.org/learn/",
      youtube: "https://www.youtube.com/watch?v=ed8SzALpx1Q",
      course: "https://www.howtographql.com"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "Git & GitHub Workflow",
    category: "Version Control",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 30,
    isOptional: false,
    resources: {
      official: "https://git-scm.com/doc",
      youtube: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      course: "https://learngitbranching.js.org"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "Docker Basics",
    category: "DevOps",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://docs.docker.com/get-started/",
      youtube: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
      course: "https://docker-curriculum.com"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "Next.js & Fullstack SSR",
    category: "Frontend Framework",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://nextjs.org/docs",
      youtube: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
      course: "https://nextjs.org/learn"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "Redis Caching",
    category: "Databases",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://redis.io/docs/getting-started/",
      youtube: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
      course: "https://university.redis.com"
    }
  },
  {
    roleId: "full-stack-developer",
    skill: "AWS Cloud Hosting",
    category: "Cloud",
    difficulty: "Intermediate",
    requiredLevel: 65,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://aws.amazon.com/getting-started/",
      youtube: "https://www.youtube.com/watch?v=k1RI5locZE4",
      course: "https://explore.skillbuilder.aws"
    }
  },

  // 3. Frontend Developer (React/Vue/Angular)
  {
    roleId: "frontend-developer",
    skill: "React",
    category: "JavaScript Framework",
    difficulty: "Intermediate",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://react.dev",
      youtube: "https://www.youtube.com/watch?v=bMknfKXIFA8",
      course: "https://fullstackopen.com/en/part1"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "JavaScript (ES6+ Deep Dive)",
    category: "Languages",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://javascript.info",
      youtube: "https://www.youtube.com/watch?v=pN6jk0uUrD8",
      course: "https://eloquentjavascript.net"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "TypeScript for Frontend",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://www.typescriptlang.org/docs/",
      youtube: "https://www.youtube.com/watch?v=gieEQFIfgYc",
      course: "https://www.totaltypescript.com/tutorials"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "HTML5 Semantic Markup",
    category: "Core Web",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 30,
    isOptional: false,
    resources: {
      official: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      youtube: "https://www.youtube.com/watch?v=kUMe1FH4CHE",
      course: "https://web.dev/learn/html"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "CSS3 & Tailwind CSS",
    category: "Core Web & Styling",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://tailwindcss.com/docs",
      youtube: "https://www.youtube.com/watch?v=lCxcTsOHrjo",
      course: "https://web.dev/learn/css"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "State Management (Redux / Zustand)",
    category: "State Management",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://redux-toolkit.js.org",
      youtube: "https://www.youtube.com/watch?v=9zySeP5vH9c",
      course: "https://zustand.docs.pmnd.rs"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "REST API Integration & Async Patterns",
    category: "Data Fetching",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://tanstack.com/query/latest",
      youtube: "https://www.youtube.com/watch?v=r8Dg0KVnfMA",
      course: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "Web Performance & Core Web Vitals",
    category: "Performance Optimization",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://web.dev/vitals/",
      youtube: "https://www.youtube.com/watch?v=AQqIZgkUA2I",
      course: "https://web.dev/fast/"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "Next.js & SSR Architecture",
    category: "Frameworks",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 55,
    isOptional: true,
    resources: {
      official: "https://nextjs.org/docs",
      youtube: "https://www.youtube.com/watch?v=tj34997vP6Y",
      course: "https://nextjs.org/learn"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "Vue.js / Angular Fundamentals",
    category: "Alternative Frameworks",
    difficulty: "Intermediate",
    requiredLevel: 68,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://vuejs.org/guide/introduction.html",
      youtube: "https://www.youtube.com/watch?v=FXpIoQ_rT_c",
      course: "https://angular.dev"
    }
  },
  {
    roleId: "frontend-developer",
    skill: "Jest & React Testing Library",
    category: "Testing",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://testing-library.com/docs/react-testing-library/intro/",
      youtube: "https://www.youtube.com/watch?v=7d43ua34w_Y",
      course: "https://jestjs.io/docs/getting-started"
    }
  },

  // 4. Backend Developer (Node.js/Python/Java)
  {
    roleId: "backend-developer",
    skill: "Node.js / Python / Java Core",
    category: "Backend Language",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 90,
    isOptional: false,
    resources: {
      official: "https://nodejs.org/docs/latest/api/",
      youtube: "https://www.youtube.com/watch?v=Oe421EPjeBE",
      course: "https://github.com/goldbergyoni/nodebestpractices"
    }
  },
  {
    roleId: "backend-developer",
    skill: "RESTful API Architecture",
    category: "API Design",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://restfulapi.net",
      youtube: "https://www.youtube.com/watch?v=-MTSQjw5DrM",
      course: "https://microservices.io/patterns/apigateway.html"
    }
  },
  {
    roleId: "backend-developer",
    skill: "PostgreSQL & Relational Schemas",
    category: "Databases",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/",
      youtube: "https://www.youtube.com/watch?v=qw--VYLpxG4",
      course: "https://use-the-index-luke.com"
    }
  },
  {
    roleId: "backend-developer",
    skill: "Redis Caching Patterns",
    category: "In-Memory Datastores",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://redis.io/docs/",
      youtube: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
      course: "https://university.redis.com"
    }
  },
  {
    roleId: "backend-developer",
    skill: "Microservices & Service Communication",
    category: "Architecture",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://microservices.io",
      youtube: "https://www.youtube.com/watch?v=1xo-0gCVhTU",
      course: "https://grpc.io/docs/languages/node/"
    }
  },
  {
    roleId: "backend-developer",
    skill: "ORM & Database Modeling (Prisma/Sequelize/Hibernate)",
    category: "Database Modeling",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://sequelize.org/docs/v6/",
      youtube: "https://www.youtube.com/watch?v=bDOZbknb3W4",
      course: "https://www.prisma.io/docs"
    }
  },
  {
    roleId: "backend-developer",
    skill: "Authentication & Security (JWT, OAuth2, RBAC)",
    category: "Security",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 55,
    isOptional: false,
    resources: {
      official: "https://jwt.io/introduction",
      youtube: "https://www.youtube.com/watch?v=7Q17ubqL20U",
      course: "https://auth0.com/docs"
    }
  },
  {
    roleId: "backend-developer",
    skill: "Git & Automated CI/CD",
    category: "Tooling",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 35,
    isOptional: false,
    resources: {
      official: "https://docs.github.com/en/actions",
      youtube: "https://www.youtube.com/watch?v=RGOj5yH7evk",
      course: "https://learngitbranching.js.org"
    }
  },
  {
    roleId: "backend-developer",
    skill: "Apache Kafka Event Streaming",
    category: "Message Queues",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 65,
    isOptional: true,
    resources: {
      official: "https://kafka.apache.org",
      youtube: "https://www.youtube.com/watch?v=R873BlNVUB4",
      course: "https://developer.confluent.io"
    }
  },
  {
    roleId: "backend-developer",
    skill: "Docker Containerization",
    category: "DevOps",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://docs.docker.com",
      youtube: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      course: "https://training.play-with-docker.com"
    }
  },
  {
    roleId: "backend-developer",
    skill: "GraphQL API Server",
    category: "API Design",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://graphql.org",
      youtube: "https://www.youtube.com/watch?v=ed8SzALpx1Q",
      course: "https://www.apollographql.com/docs/"
    }
  },

  // 5. DevOps Engineer
  {
    roleId: "devops-engineer",
    skill: "Linux System Administration",
    category: "Operating Systems",
    difficulty: "Intermediate",
    requiredLevel: 88,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://linuxjourney.com",
      youtube: "https://www.youtube.com/watch?v=wBp0Rb-ZJak",
      course: "https://overthewire.org/wargames/bandit/"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Docker Containerization",
    category: "Containers",
    difficulty: "Intermediate",
    requiredLevel: 88,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.docker.com",
      youtube: "https://www.youtube.com/watch?v=fqMOX6JJhGo",
      course: "https://training.play-with-docker.com"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Kubernetes Cluster Management",
    category: "Orchestration",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://kubernetes.io/docs/",
      youtube: "https://www.youtube.com/watch?v=X48VuDVv0do",
      course: "https://kodekloud.com"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "CI/CD (GitHub Actions / Jenkins)",
    category: "Automation Pipelines",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.github.com/en/actions",
      youtube: "https://www.youtube.com/watch?v=R8_veQiYWrI",
      course: "https://www.jenkins.io/doc/"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Terraform (Infrastructure as Code)",
    category: "IaC",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 75,
    isOptional: false,
    resources: {
      official: "https://developer.hashicorp.com/terraform/docs",
      youtube: "https://www.youtube.com/watch?v=SLB_c_ayRMo",
      course: "https://learn.hashicorp.com/terraform"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "AWS Cloud Infrastructure",
    category: "Cloud",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/architecture/",
      youtube: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Bash & Shell Scripting",
    category: "Scripting",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://tldp.org/LDP/Bash-Beginners-Guide/html/",
      youtube: "https://www.youtube.com/watch?v=v-F3YLd6oMw",
      course: "https://www.shellscript.sh"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Prometheus & Grafana Monitoring",
    category: "Observability",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://prometheus.io/docs/",
      youtube: "https://www.youtube.com/watch?v=h4Sl21AK9g8",
      course: "https://grafana.com/tutorials/"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Ansible Configuration Management",
    category: "Automation",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://docs.ansible.com",
      youtube: "https://www.youtube.com/watch?v=5hycyr-8EKs",
      course: "https://www.ansible.com/resources"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Helm Package Manager",
    category: "Kubernetes Tooling",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://helm.sh/docs/",
      youtube: "https://www.youtube.com/watch?v=-ykwb1d0DXU",
      course: "https://helm.sh"
    }
  },
  {
    roleId: "devops-engineer",
    skill: "Python for DevOps Automation",
    category: "Scripting",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://docs.python.org/3/",
      youtube: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      course: "https://realpython.com"
    }
  },

  // 6. QA Automation Engineer
  {
    roleId: "qa-automation-engineer",
    skill: "Test Automation Strategy & Pyramid",
    category: "Testing Principles",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://martinfowler.com/articles/practical-test-pyramid.html",
      youtube: "https://www.youtube.com/watch?v=0k7y6g668E4",
      course: "https://automationpanda.com"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "Selenium WebDriver",
    category: "Browser Automation",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.selenium.dev/documentation/",
      youtube: "https://www.youtube.com/watch?v=j7VZsCCnptM",
      course: "https://testautomationu.applitools.com"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "Playwright / Cypress Frameworks",
    category: "Modern Test Frameworks",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 65,
    isOptional: false,
    resources: {
      official: "https://playwright.dev/docs/intro",
      youtube: "https://www.youtube.com/watch?v=2T_o_H6A_9w",
      course: "https://docs.cypress.io"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "Java / Python / JavaScript for Testing",
    category: "Programming",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.oracle.com/javase/tutorial/",
      youtube: "https://www.youtube.com/watch?v=eIrMbAQSU34",
      course: "https://www.freecodecamp.org"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "API Testing (Postman & RestAssured)",
    category: "API Testing",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://learning.postman.com/docs/",
      youtube: "https://www.youtube.com/watch?v=VywxIQ2ZXw4",
      course: "https://rest-assured.io"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "TestNG / Jest Test Runners",
    category: "Test Execution",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://testng.org/doc/",
      youtube: "https://www.youtube.com/watch?v=KzKvdQjJqQI",
      course: "https://jestjs.io"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "CI/CD Test Integration (Jenkins/GitHub Actions)",
    category: "CI/CD",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://docs.github.com/en/actions",
      youtube: "https://www.youtube.com/watch?v=R8_veQiYWrI",
      course: "https://testautomationu.applitools.com"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "SQL & Database Verification",
    category: "Databases",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 35,
    isOptional: false,
    resources: {
      official: "https://www.w3schools.com/sql/",
      youtube: "https://www.youtube.com/watch?v=HXV3zeRR3h4",
      course: "https://sqlzoo.net"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "Performance Testing (JMeter / k6)",
    category: "Load Testing",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://jmeter.apache.org",
      youtube: "https://www.youtube.com/watch?v=mP_T0H0K9w4",
      course: "https://k6.io/docs/"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "Mobile Testing (Appium)",
    category: "Mobile Testing",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 55,
    isOptional: true,
    resources: {
      official: "https://appium.io/docs/en/latest/",
      youtube: "https://www.youtube.com/watch?v=Gk5V1e0K8F0",
      course: "https://testautomationu.applitools.com"
    }
  },
  {
    roleId: "qa-automation-engineer",
    skill: "BDD with Cucumber",
    category: "BDD",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://cucumber.io/docs/guides/",
      youtube: "https://www.youtube.com/watch?v=k5jG2X4c0L4",
      course: "https://cucumber.io"
    }
  },

  // 7. Data Scientist
  {
    roleId: "data-scientist",
    skill: "Python for Data Science",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 90,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.python.org",
      youtube: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
      course: "https://realpython.com"
    }
  },
  {
    roleId: "data-scientist",
    skill: "SQL & Complex Analytics Queries",
    category: "Data Extraction",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 55,
    isOptional: false,
    resources: {
      official: "https://mode.com/sql-tutorial/",
      youtube: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      course: "https://sqlzoo.net"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Applied Statistics & Probability",
    category: "Mathematics",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 90,
    isOptional: false,
    resources: {
      official: "https://www.statlect.com",
      youtube: "https://www.youtube.com/watch?v=Vfo5le26IlY",
      course: "https://openintro-stats.netlify.app"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Machine Learning (Scikit-Learn)",
    category: "Machine Learning",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://scikit-learn.org/stable/",
      youtube: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
      course: "https://www.coursera.org/learn/machine-learning"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Data Wrangling (Pandas & NumPy)",
    category: "Data Processing",
    difficulty: "Intermediate",
    requiredLevel: 90,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://pandas.pydata.org/docs/",
      youtube: "https://www.youtube.com/watch?v=vmEHCJofslg",
      course: "https://numpy.org/doc/stable/"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Data Visualization (Matplotlib & Seaborn)",
    category: "Visualization",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://seaborn.pydata.org",
      youtube: "https://www.youtube.com/watch?v=6GUZXDef2U0",
      course: "https://matplotlib.org/stable/"
    }
  },
  {
    roleId: "data-scientist",
    skill: "A/B Testing & Hypothesis Testing",
    category: "Experimentation",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://hbr.org/2017/06/a-refresher-on-ab-testing",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://www.udacity.com/course/ab-testing--ud257"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Feature Engineering & Imbalanced Data",
    category: "ML Techniques",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://imbalanced-learn.org/stable/",
      youtube: "https://www.youtube.com/watch?v=YMPMZmlH5Bo",
      course: "https://www.kaggle.com/learn/feature-engineering"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Deep Learning (PyTorch)",
    category: "Deep Learning",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 90,
    isOptional: true,
    resources: {
      official: "https://pytorch.org/tutorials/",
      youtube: "https://www.youtube.com/watch?v=V_xro1bcAuA",
      course: "https://course.fast.ai"
    }
  },
  {
    roleId: "data-scientist",
    skill: "Apache Spark for Big Data",
    category: "Big Data",
    difficulty: "Advanced",
    requiredLevel: 72,
    estimatedHours: 70,
    isOptional: true,
    resources: {
      official: "https://spark.apache.org/docs/latest/",
      youtube: "https://www.youtube.com/watch?v=_C8kWso4dU4",
      course: "https://databricks.com/spark"
    }
  },
  {
    roleId: "data-scientist",
    skill: "NLP & LLM Fundamentals",
    category: "AI",
    difficulty: "Advanced",
    requiredLevel: 72,
    estimatedHours: 65,
    isOptional: true,
    resources: {
      official: "https://huggingface.co/learn/nlp-course",
      youtube: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      course: "https://deeplearning.ai"
    }
  },

  // 8. Android Developer
  {
    roleId: "android-developer",
    skill: "Kotlin Programming",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://kotlinlang.org/docs/home.html",
      youtube: "https://www.youtube.com/watch?v=F9UC9DY-vIU",
      course: "https://hyperskill.org/tracks/18"
    }
  },
  {
    roleId: "android-developer",
    skill: "Jetpack Compose Modern UI",
    category: "UI Framework",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://developer.android.com/jetpack/compose",
      youtube: "https://www.youtube.com/watch?v=6_wK4gA1Fh8",
      course: "https://developer.android.com/courses/pathways/compose"
    }
  },
  {
    roleId: "android-developer",
    skill: "Android Architecture & Activity Lifecycle",
    category: "Core Android",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://developer.android.com/topic/architecture",
      youtube: "https://www.youtube.com/watch?v=m_nLqZfO_aU",
      course: "https://developer.android.com/courses"
    }
  },
  {
    roleId: "android-developer",
    skill: "Kotlin Coroutines & Flow",
    category: "Asynchronous",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://kotlinlang.org/docs/coroutines-overview.html",
      youtube: "https://www.youtube.com/watch?v=C38lG24044E",
      course: "https://developer.android.com/kotlin/coroutines"
    }
  },
  {
    roleId: "android-developer",
    skill: "Room Local Database",
    category: "Persistence",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://developer.android.com/training/data-storage/room",
      youtube: "https://www.youtube.com/watch?v=lwAvI3WDXBY",
      course: "https://developer.android.com"
    }
  },
  {
    roleId: "android-developer",
    skill: "Retrofit & REST API Networking",
    category: "Networking",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://square.github.io/retrofit/",
      youtube: "https://www.youtube.com/watch?v=t6Gx33U0XfM",
      course: "https://developer.android.com"
    }
  },
  {
    roleId: "android-developer",
    skill: "Dagger Hilt Dependency Injection",
    category: "Architecture",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://developer.android.com/training/dependency-injection/hilt-android",
      youtube: "https://www.youtube.com/watch?v=bbMsuI2p1DQ",
      course: "https://developer.android.com"
    }
  },
  {
    roleId: "android-developer",
    skill: "Play Store Deployment & App Bundles",
    category: "Publishing",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 30,
    isOptional: false,
    resources: {
      official: "https://developer.android.com/distribute",
      youtube: "https://www.youtube.com/watch?v=Qx8d_P0I9rE",
      course: "https://play.google.com/console/about/guides/"
    }
  },
  {
    roleId: "android-developer",
    skill: "Unit & UI Testing (JUnit, MockK, Espresso)",
    category: "Testing",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://developer.android.com/training/testing",
      youtube: "https://www.youtube.com/watch?v=2m_vG_X0Q0k",
      course: "https://mockk.io"
    }
  },
  {
    roleId: "android-developer",
    skill: "WorkManager Background Processing",
    category: "System Services",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://developer.android.com/topic/libraries/architecture/workmanager",
      youtube: "https://www.youtube.com/watch?v=836_60xT8u4",
      course: "https://developer.android.com"
    }
  },
  {
    roleId: "android-developer",
    skill: "Jetpack Navigation",
    category: "UI Architecture",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 30,
    isOptional: true,
    resources: {
      official: "https://developer.android.com/guide/navigation",
      youtube: "https://www.youtube.com/watch?v=FIEnIbNZ610",
      course: "https://developer.android.com"
    }
  },

  // 9. iOS Developer
  {
    roleId: "ios-developer",
    skill: "Swift Programming Language",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 90,
    estimatedHours: 85,
    isOptional: false,
    resources: {
      official: "https://www.swift.org/documentation/",
      youtube: "https://www.youtube.com/watch?v=comQ1-x2a1Q",
      course: "https://www.hackingwithswift.com/100"
    }
  },
  {
    roleId: "ios-developer",
    skill: "SwiftUI Declarative UI",
    category: "UI Framework",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://developer.apple.com/tutorials/swiftui",
      youtube: "https://www.youtube.com/watch?v=F2ojC6TNwws",
      course: "https://www.hackingwithswift.com/100/swiftui"
    }
  },
  {
    roleId: "ios-developer",
    skill: "UIKit & AutoLayout",
    category: "Core iOS",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://developer.apple.com/documentation/uikit",
      youtube: "https://www.youtube.com/watch?v=p4vW7Q_8a9c",
      course: "https://www.hackingwithswift.com"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Combine & Swift Modern Concurrency",
    category: "Asynchronous",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.swift.org/swift-book/documentation/the-swift-programming-language/concurrency/",
      youtube: "https://www.youtube.com/watch?v=M5G8rEwP6u4",
      course: "https://www.donnywals.com/concurrency/"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Core Data & SwiftData Persistence",
    category: "Persistence",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://developer.apple.com/documentation/swiftdata",
      youtube: "https://www.youtube.com/watch?v=0kP8y7W77Xk",
      course: "https://www.hackingwithswift.com/quick-tech/swiftdata"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Networking & URLSession REST APIs",
    category: "Networking",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://developer.apple.com/documentation/foundation/urlsession",
      youtube: "https://www.youtube.com/watch?v=ERr0GXq3bms",
      course: "https://seanallen.co"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Xcode Profiling & Instruments",
    category: "Tooling",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://developer.apple.com/xcode/",
      youtube: "https://www.youtube.com/watch?v=KzKvdQjJqQI",
      course: "https://developer.apple.com/videos/play/wwdc2021/10211/"
    }
  },
  {
    roleId: "ios-developer",
    skill: "App Store Review Guidelines & TestFlight",
    category: "Publishing",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 30,
    isOptional: false,
    resources: {
      official: "https://developer.apple.com/app-store/review/guidelines/",
      youtube: "https://www.youtube.com/watch?v=m7X0q4L4_0c",
      course: "https://developer.apple.com/testflight/"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Unit & UI Testing with XCTest",
    category: "Testing",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://developer.apple.com/documentation/xctest",
      youtube: "https://www.youtube.com/watch?v=2T_o_H6A_9w",
      course: "https://qualitycoding.org"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Fastlane CI/CD Automation",
    category: "DevOps",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://docs.fastlane.tools",
      youtube: "https://www.youtube.com/watch?v=aG4QvX0Q0kE",
      course: "https://fastlane.tools"
    }
  },
  {
    roleId: "ios-developer",
    skill: "Core Animation & Micro-interactions",
    category: "UI Animations",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://developer.apple.com/documentation/quartzcore",
      youtube: "https://www.youtube.com/watch?v=0kP8y7W77Xk",
      course: "https://developer.apple.com"
    }
  },

  // 10. System Design Architect
  {
    roleId: "system-design-architect",
    skill: "Distributed Systems Architecture",
    category: "Architecture",
    difficulty: "Expert",
    requiredLevel: 95,
    estimatedHours: 150,
    isOptional: false,
    resources: {
      official: "https://github.com/donnemartin/system-design-primer",
      youtube: "https://www.youtube.com/@gkcs",
      course: "https://dataintensive.net"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "High-Level System Design (HLD)",
    category: "Architecture",
    difficulty: "Expert",
    requiredLevel: 92,
    estimatedHours: 120,
    isOptional: false,
    resources: {
      official: "https://bytebytego.com",
      youtube: "https://www.youtube.com/@ByteByteGo",
      course: "https://highscalability.com"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Low-Level Design (LLD & Design Patterns)",
    category: "Design Patterns",
    difficulty: "Expert",
    requiredLevel: 90,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://refactoring.guru/design-patterns",
      youtube: "https://www.youtube.com/watch?v=v9ejT8FO-7I",
      course: "https://sourcemaking.com/design_patterns"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Data Partitioning & Sharding Strategies",
    category: "Data Scaling",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/blogs/database/sharding-with-amazon-relational-database-service/",
      youtube: "https://www.youtube.com/watch?v=5faMjKuB9bc",
      course: "https://dataintensive.net"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "High Availability & Fault Tolerance Patterns",
    category: "Resilience",
    difficulty: "Expert",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://martinfowler.com/articles/patterns-of-distributed-systems/",
      youtube: "https://www.youtube.com/watch?v=Y6Ev8GkD3Go",
      course: "https://aws.amazon.com/architecture/well-architected/"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Distributed Caching (Redis/Memcached)",
    category: "Caching",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://redis.io/docs/",
      youtube: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
      course: "https://university.redis.com"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Event Streaming & Message Brokers (Kafka)",
    category: "Streaming",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://kafka.apache.org",
      youtube: "https://www.youtube.com/watch?v=R873BlNVUB4",
      course: "https://developer.confluent.io"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Database Replication & Consistency Models",
    category: "Databases",
    difficulty: "Expert",
    requiredLevel: 90,
    estimatedHours: 75,
    isOptional: false,
    resources: {
      official: "https://jepsen.io/analyses",
      youtube: "https://www.youtube.com/watch?v=hG0rN5rLg3E",
      course: "https://dataintensive.net"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Event Sourcing & CQRS",
    category: "Advanced Architecture",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://martinfowler.com/bliki/CQRS.html",
      youtube: "https://www.youtube.com/watch?v=8UKYz9bJv1E",
      course: "https://microservices.io/patterns/data/cqrs.html"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "Multi-Cloud & Hybrid Cloud Strategy",
    category: "Cloud",
    difficulty: "Advanced",
    requiredLevel: 78,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://cloud.google.com/solutions/hybrid-and-multi-cloud-architecture-patterns",
      youtube: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      course: "https://aws.amazon.com/enterprise/"
    }
  },
  {
    roleId: "system-design-architect",
    skill: "FinOps & Cloud Cost Optimization",
    category: "Operations",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://www.finops.org/framework/",
      youtube: "https://www.youtube.com/watch?v=7h4Sl21AK9g",
      course: "https://www.finops.org"
    }
  },

  // 11. Product Manager
  {
    roleId: "product-manager",
    skill: "Product Discovery & Strategy",
    category: "Product Leadership",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://www.productplan.com/learn/",
      youtube: "https://www.youtube.com/@LennysPodcast",
      course: "https://www.reforge.com"
    }
  },
  {
    roleId: "product-manager",
    skill: "User Research & Customer Interviews",
    category: "User Insights",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://www.nngroup.com/articles/",
      youtube: "https://www.youtube.com/watch?v=z8Xk0sXzG0I",
      course: "https://www.mindtheproduct.com"
    }
  },
  {
    roleId: "product-manager",
    skill: "PRD (Product Requirements Documentation)",
    category: "Documentation",
    difficulty: "Intermediate",
    requiredLevel: 90,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://coda.io/templates/product-requirements-doc",
      youtube: "https://www.youtube.com/watch?v=5V5q8L7k6U4",
      course: "https://www.atlassian.com/agile/product-management/requirements"
    }
  },
  {
    roleId: "product-manager",
    skill: "Metrics & North Star Definition",
    category: "Analytics",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://amplitude.com/north-star",
      youtube: "https://www.youtube.com/watch?v=P_V3xM_lC9k",
      course: "https://mixpanel.com/blog/"
    }
  },
  {
    roleId: "product-manager",
    skill: "SQL for Product Analytics",
    category: "Data Analysis",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 55,
    isOptional: false,
    resources: {
      official: "https://mode.com/sql-tutorial/",
      youtube: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      course: "https://sqlzoo.net"
    }
  },
  {
    roleId: "product-manager",
    skill: "Agile Sprint Execution (Jira / Scrum)",
    category: "Agile Leadership",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 35,
    isOptional: false,
    resources: {
      official: "https://www.atlassian.com/agile/scrum",
      youtube: "https://www.youtube.com/watch?v=9TycLR0TqFA",
      course: "https://scrumguides.org"
    }
  },
  {
    roleId: "product-manager",
    skill: "A/B Testing & Product Experimentation",
    category: "Experimentation",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://optimizely.com/optimization-glossary/ab-testing/",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://www.reforge.com"
    }
  },
  {
    roleId: "product-manager",
    skill: "Cross-Functional Stakeholder Communication",
    category: "Soft Skills",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://hbr.org/topic/communication",
      youtube: "https://www.youtube.com/watch?v=HAnw168huqA",
      course: "https://shreyasdoshi.substack.com"
    }
  },
  {
    roleId: "product-manager",
    skill: "Wireframing & Prototyping (Figma)",
    category: "Design Tools",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://help.figma.com/hc/en-us",
      youtube: "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
      course: "https://www.figma.com/resources/learn-design/"
    }
  },
  {
    roleId: "product-manager",
    skill: "Go-to-Market (GTM) Strategy",
    category: "Marketing & Launch",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://www.reforge.com/brief/go-to-market-strategy",
      youtube: "https://www.youtube.com/watch?v=0wQ7W7W_e5E",
      course: "https://productschool.com"
    }
  },
  {
    roleId: "product-manager",
    skill: "System Architecture Basics for PMs",
    category: "Technical Literacy",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://bytebytego.com",
      youtube: "https://www.youtube.com/watch?v=M7w98k_H5F4",
      course: "https://highscalability.com"
    }
  },

  // 12. Data Engineer
  {
    roleId: "data-engineer",
    skill: "Python for Data Engineering",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 88,
    estimatedHours: 75,
    isOptional: false,
    resources: {
      official: "https://www.python.org",
      youtube: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
      course: "https://realpython.com"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Advanced SQL & Query Optimization",
    category: "Querying",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://mode.com/sql-tutorial/",
      youtube: "https://www.youtube.com/watch?v=7S_tz1z_5bA",
      course: "https://use-the-index-luke.com"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Apache Spark (PySpark Distributed Processing)",
    category: "Distributed Compute",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://spark.apache.org/docs/latest/api/python/",
      youtube: "https://www.youtube.com/watch?v=_C8kWso4dU4",
      course: "https://databricks.com/spark"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Apache Kafka Streaming",
    category: "Event Streaming",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://kafka.apache.org",
      youtube: "https://www.youtube.com/watch?v=R873BlNVUB4",
      course: "https://developer.confluent.io"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Cloud Data Warehouses (Snowflake / BigQuery)",
    category: "Data Warehousing",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://docs.snowflake.com",
      youtube: "https://www.youtube.com/watch?v=3W47W7W_e5E",
      course: "https://cloud.google.com/bigquery/docs"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Apache Airflow Pipeline Orchestration",
    category: "Workflow Orchestration",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://airflow.apache.org/docs/",
      youtube: "https://www.youtube.com/watch?v=K9AnJ9_ZAXE",
      course: "https://astronomer.io/guides/"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Data Modeling (Star & Snowflake Schema)",
    category: "Data Architecture",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/",
      youtube: "https://www.youtube.com/watch?v=M9m-wX0P8h8",
      course: "https://dataintensive.net"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Docker & Cloud Object Storage (S3/GCS)",
    category: "Infrastructure",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/s3/",
      youtube: "https://www.youtube.com/watch?v=3c-iBn73dDE",
      course: "https://docs.docker.com"
    }
  },
  {
    roleId: "data-engineer",
    skill: "dbt (Data Build Tool)",
    category: "Transformation",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://docs.getdbt.com",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://courses.getdbt.com"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Delta Lake & Apache Iceberg",
    category: "Lakehouse",
    difficulty: "Advanced",
    requiredLevel: 72,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://delta.io",
      youtube: "https://www.youtube.com/watch?v=k5jG2X4c0L4",
      course: "https://iceberg.apache.org"
    }
  },
  {
    roleId: "data-engineer",
    skill: "Scala for Spark",
    category: "Languages",
    difficulty: "Intermediate",
    requiredLevel: 68,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://docs.scala-lang.org",
      youtube: "https://www.youtube.com/watch?v=DzFt0YkZo8M",
      course: "https://www.coursera.org/specializations/scala"
    }
  },

  // 13. Security Engineer
  {
    roleId: "security-engineer",
    skill: "Application Security (OWASP Top 10)",
    category: "AppSec",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://owasp.org/www-project-top-ten/",
      youtube: "https://www.youtube.com/watch?v=2vU_gq58_2U",
      course: "https://portswigger.net/web-security"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Cloud Security (AWS/Azure IAM & Policies)",
    category: "Cloud Security",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/security/",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Penetration Testing & Vulnerability Assessment",
    category: "Ethical Hacking",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 90,
    isOptional: false,
    resources: {
      official: "https://www.hackthebox.com",
      youtube: "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
      course: "https://tryhackme.com"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Network Security & Firewalls",
    category: "Networking",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://www.wireshark.org/docs/",
      youtube: "https://www.youtube.com/watch?v=lb1Dw0elw0Q",
      course: "https://www.professormesser.com"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Cryptography & PKI (Public Key Infrastructure)",
    category: "Cryptography",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.openssl.org/docs/",
      youtube: "https://www.youtube.com/watch?v=jhXCTbFnK8o",
      course: "https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Threat Modeling (STRIDE / DREAD)",
    category: "Architecture Security",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://owasp.org/www-community/Threat_Modeling",
      youtube: "https://www.youtube.com/watch?v=3g8K9vP_l1I",
      course: "https://portswigger.net"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Security Scripting (Python / Bash)",
    category: "Automation",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.python.org",
      youtube: "https://www.youtube.com/watch?v=7lmCu8wz8ro",
      course: "https://nostarch.com/blackhatpython2E"
    }
  },
  {
    roleId: "security-engineer",
    skill: "SIEM & Incident Response (Splunk/ELK)",
    category: "SecOps",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://www.splunk.com/en_us/training.html",
      youtube: "https://www.youtube.com/watch?v=7xVwL7W_e5E",
      course: "https://tryhackme.com"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Container & Kubernetes Security",
    category: "Cloud Native Security",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://kubernetes.io/docs/concepts/security/",
      youtube: "https://www.youtube.com/watch?v=d_k8wX0Q0kE",
      course: "https://kodekloud.com"
    }
  },
  {
    roleId: "security-engineer",
    skill: "SAST & DAST Automated Tooling",
    category: "DevSecOps",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://snyk.io/learn/",
      youtube: "https://www.youtube.com/watch?v=9vW0kX0Q0kE",
      course: "https://snyk.io"
    }
  },
  {
    roleId: "security-engineer",
    skill: "Security Compliance (ISO 27001 & SOC 2)",
    category: "Governance",
    difficulty: "Intermediate",
    requiredLevel: 70,
    estimatedHours: 35,
    isOptional: true,
    resources: {
      official: "https://www.iso.org/isoiec-27001-information-security.html",
      youtube: "https://www.youtube.com/watch?v=0wQ7W7W_e5E",
      course: "https://www.aicpa.org/soc"
    }
  },

  // 14. Machine Learning Engineer
  {
    roleId: "machine-learning-engineer",
    skill: "Python for Deep Learning",
    category: "Languages",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://docs.python.org",
      youtube: "https://www.youtube.com/watch?v=LHBE6Q9XlzI",
      course: "https://realpython.com"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "PyTorch & Neural Network Architecture",
    category: "Deep Learning",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 120,
    isOptional: false,
    resources: {
      official: "https://pytorch.org/tutorials/",
      youtube: "https://www.youtube.com/watch?v=V_xro1bcAuA",
      course: "https://course.fast.ai"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "MLOps & Automated Model Pipelines (MLflow/Kubeflow)",
    category: "MLOps",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://mlflow.org/docs/latest/index.html",
      youtube: "https://www.youtube.com/watch?v=95b_6oB4h2c",
      course: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "FastAPI & Low-Latency Model Serving (Triton/TorchServe)",
    category: "Model Serving",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://fastapi.tiangolo.com",
      youtube: "https://www.youtube.com/watch?v=0sOvCWFmrtA",
      course: "https://developer.nvidia.com/triton-inference-server"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "Docker & Kubernetes for Machine Learning",
    category: "Infrastructure",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://kubernetes.io",
      youtube: "https://www.youtube.com/watch?v=X48VuDVv0do",
      course: "https://kodekloud.com"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "Feature Stores & Data Pipelines (Feast)",
    category: "Data Pipelines",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.feast.dev",
      youtube: "https://www.youtube.com/watch?v=3W47W7W_e5E",
      course: "https://feast.dev"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "Model Drift Monitoring & Observability (Evidently AI)",
    category: "Observability",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.evidentlyai.com",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://www.evidentlyai.com"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "Linear Algebra & Gradient Optimization",
    category: "Mathematics",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/",
      youtube: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      course: "https://www.3blue1brown.com/topics/linear-algebra"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "Hugging Face & Transformer Models",
    category: "LLMs",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 70,
    isOptional: true,
    resources: {
      official: "https://huggingface.co/docs/transformers/index",
      youtube: "https://www.youtube.com/watch?v=kCc8FmEb1nY",
      course: "https://huggingface.co/learn"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "ONNX & TensorRT Inference Optimization",
    category: "Model Optimization",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://onnxruntime.ai/docs/",
      youtube: "https://www.youtube.com/watch?v=8UKYz9bJv1E",
      course: "https://developer.nvidia.com/tensorrt"
    }
  },
  {
    roleId: "machine-learning-engineer",
    skill: "Vector Databases & RAG Architectures",
    category: "GenAI",
    difficulty: "Advanced",
    requiredLevel: 78,
    estimatedHours: 55,
    isOptional: true,
    resources: {
      official: "https://www.pinecone.io/learn/",
      youtube: "https://www.youtube.com/watch?v=tcqEUSncnG8",
      course: "https://www.deeplearning.ai"
    }
  },

  // 15. Cloud Engineer (AWS/GCP/Azure)
  {
    roleId: "cloud-engineer",
    skill: "AWS / Azure / GCP Core Infrastructure",
    category: "Cloud Providers",
    difficulty: "Intermediate",
    requiredLevel: 88,
    estimatedHours: 90,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com",
      youtube: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Terraform Infrastructure as Code",
    category: "IaC",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://developer.hashicorp.com/terraform/docs",
      youtube: "https://www.youtube.com/watch?v=SLB_c_ayRMo",
      course: "https://learn.hashicorp.com/terraform"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Cloud Networking (VPCs, Subnets, DNS, Load Balancers)",
    category: "Networking",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com/vpc/",
      youtube: "https://www.youtube.com/watch?v=cpknXmR_H2E",
      course: "https://aws.amazon.com/blogs/networking-and-content-delivery/"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "IAM (Identity & Access Management)",
    category: "Security",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com/iam/",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Serverless (AWS Lambda / Cloud Functions)",
    category: "Compute",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com/lambda/",
      youtube: "https://www.youtube.com/watch?v=eOBq__h4OJ4",
      course: "https://serverless.com"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Cloud Storage & Managed Databases (S3, RDS)",
    category: "Storage",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com/rds/",
      youtube: "https://www.youtube.com/watch?v=qw--VYLpxG4",
      course: "https://aws.amazon.com/rds/"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Cloud Monitoring & Logging (CloudWatch, CloudTrail)",
    category: "Observability",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com/cloudwatch/",
      youtube: "https://www.youtube.com/watch?v=h4Sl21AK9g8",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Linux Shell & Automation",
    category: "Systems",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://linuxjourney.com",
      youtube: "https://www.youtube.com/watch?v=wBp0Rb-ZJak",
      course: "https://overthewire.org/wargames/bandit/"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Kubernetes on Cloud (EKS / GKE / AKS)",
    category: "Container Orchestration",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 70,
    isOptional: true,
    resources: {
      official: "https://aws.amazon.com/eks/",
      youtube: "https://www.youtube.com/watch?v=X48VuDVv0do",
      course: "https://kodekloud.com"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Cloud FinOps & Cost Optimization",
    category: "Governance",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://www.finops.org/framework/",
      youtube: "https://www.youtube.com/watch?v=7h4Sl21AK9g",
      course: "https://www.finops.org"
    }
  },
  {
    roleId: "cloud-engineer",
    skill: "Cloud Security Posture Management (CSPM)",
    category: "Security",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://aws.amazon.com/security-hub/",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://explore.skillbuilder.aws"
    }
  },

  // 16. Database Administrator
  {
    roleId: "database-administrator",
    skill: "PostgreSQL & MySQL Database Administration",
    category: "RDBMS",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/",
      youtube: "https://www.youtube.com/watch?v=e1f7LsmL5qM",
      course: "https://use-the-index-luke.com"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Query Tuning & Execution Plan Analysis (EXPLAIN)",
    category: "Performance Tuning",
    difficulty: "Advanced",
    requiredLevel: 92,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/current/using-explain.html",
      youtube: "https://www.youtube.com/watch?v=r_MbozD32eo",
      course: "https://explain.depesz.com"
    }
  },
  {
    roleId: "database-administrator",
    skill: "B-Tree Indexing & Composite Index Design",
    category: "Indexing",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://use-the-index-luke.com",
      youtube: "https://www.youtube.com/watch?v=qw--VYLpxG4",
      course: "https://use-the-index-luke.com"
    }
  },
  {
    roleId: "database-administrator",
    skill: "High Availability & Streaming Replication",
    category: "Availability",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/current/high-availability.html",
      youtube: "https://www.youtube.com/watch?v=5faMjKuB9bc",
      course: "https://patroni.readthedocs.io"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Backup & Point-in-Time Recovery (PITR)",
    category: "Disaster Recovery",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/current/continuous-archiving.html",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://pgbackrest.org"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Database Security & Role-Based Permissions",
    category: "Security",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/current/user-manag.html",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://www.postgresql.org"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Table Partitioning & Sharding",
    category: "Scaling",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.postgresql.org/docs/current/ddl-partitioning.html",
      youtube: "https://www.youtube.com/watch?v=5faMjKuB9bc",
      course: "https://citusdata.com"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Linux Shell Scripting for DB Automation",
    category: "Automation",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://linuxjourney.com",
      youtube: "https://www.youtube.com/watch?v=v-F3YLd6oMw",
      course: "https://www.shellscript.sh"
    }
  },
  {
    roleId: "database-administrator",
    skill: "NoSQL Database Administration (MongoDB/Cassandra)",
    category: "NoSQL",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://www.mongodb.com/docs/",
      youtube: "https://www.youtube.com/watch?v=ofme2o29ngU",
      course: "https://learn.mongodb.com"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Cloud Managed Databases (AWS RDS / Aurora)",
    category: "Cloud DBs",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/",
      youtube: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "database-administrator",
    skill: "Redis Cluster Administration",
    category: "In-Memory",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://redis.io/docs/management/",
      youtube: "https://www.youtube.com/watch?v=jgpVdJB2sKQ",
      course: "https://university.redis.com"
    }
  },

  // 17. Solutions Architect
  {
    roleId: "solutions-architect",
    skill: "Enterprise Architecture & Cloud Migration",
    category: "Enterprise Cloud",
    difficulty: "Expert",
    requiredLevel: 92,
    estimatedHours: 130,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/architecture/",
      youtube: "https://www.youtube.com/watch?v=Ia-UEYYR44s",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Well-Architected Framework (6 Pillars)",
    category: "Architecture Standards",
    difficulty: "Expert",
    requiredLevel: 90,
    estimatedHours: 90,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/architecture/well-architected/",
      youtube: "https://www.youtube.com/watch?v=Y6Ev8GkD3Go",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Microservices & API Gateway Strategy",
    category: "Integration",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://microservices.io",
      youtube: "https://www.youtube.com/watch?v=1xo-0gCVhTU",
      course: "https://konghq.com/learning-center"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Event-Driven Systems Architecture",
    category: "Async Systems",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 75,
    isOptional: false,
    resources: {
      official: "https://martinfowler.com/articles/201701-event-driven.html",
      youtube: "https://www.youtube.com/watch?v=R873BlNVUB4",
      course: "https://developer.confluent.io"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Security & Governance Compliance",
    category: "Compliance",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://aws.amazon.com/compliance/",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://csrc.nist.gov"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "TCO & Infrastructure Sizing",
    category: "Financial Sizing",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://calculator.aws/#/",
      youtube: "https://www.youtube.com/watch?v=7h4Sl21AK9g",
      course: "https://www.finops.org"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Executive Stakeholder Communication & Presales",
    category: "Communication",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://hbr.org/topic/communication",
      youtube: "https://www.youtube.com/watch?v=HAnw168huqA",
      course: "https://shreyasdoshi.substack.com"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Hybrid Cloud Networking (DirectConnect/ExpressRoute)",
    category: "Networking",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://docs.aws.amazon.com/directconnect/",
      youtube: "https://www.youtube.com/watch?v=cpknXmR_H2E",
      course: "https://aws.amazon.com"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "TOGAF Enterprise Architecture Framework",
    category: "Frameworks",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://www.opengroup.org/togaf",
      youtube: "https://www.youtube.com/watch?v=0wQ7W7W_e5E",
      course: "https://www.opengroup.org"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Legacy Monolith Modernization Patterns",
    category: "Modernization",
    difficulty: "Advanced",
    requiredLevel: 80,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://martinfowler.com/bliki/StranglerFigApplication.html",
      youtube: "https://www.youtube.com/watch?v=1xo-0gCVhTU",
      course: "https://microservices.io"
    }
  },
  {
    roleId: "solutions-architect",
    skill: "Disaster Recovery Architecture (RTO/RPO)",
    category: "Resilience",
    difficulty: "Advanced",
    requiredLevel: 78,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://aws.amazon.com/disaster-recovery/",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://explore.skillbuilder.aws"
    }
  },

  // 18. IT Infrastructure Engineer
  {
    roleId: "it-infrastructure-engineer",
    skill: "Windows Server & Active Directory (AD DS)",
    category: "Identity & Directory",
    difficulty: "Intermediate",
    requiredLevel: 88,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://learn.microsoft.com/en-us/windows-server/",
      youtube: "https://www.youtube.com/watch?v=0kP8y7W77Xk",
      course: "https://learn.microsoft.com"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Linux Enterprise Administration (RHEL/Ubuntu)",
    category: "Operating Systems",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://access.redhat.com/documentation/",
      youtube: "https://www.youtube.com/watch?v=wBp0Rb-ZJak",
      course: "https://linuxjourney.com"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Enterprise Networking (VLANs, Routing, VPN)",
    category: "Networking",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://www.cisco.com/c/en/us/support/index.html",
      youtube: "https://www.youtube.com/watch?v=lb1Dw0elw0Q",
      course: "https://www.professormesser.com"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Virtualization (VMware vSphere / Hyper-V)",
    category: "Virtualization",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 75,
    isOptional: false,
    resources: {
      official: "https://docs.vmware.com/en/VMware-vSphere/index.html",
      youtube: "https://www.youtube.com/watch?v=KzKvdQjJqQI",
      course: "https://customerconnect.vmware.com"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "SAN & NAS Storage Management",
    category: "Storage",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.netapp.com",
      youtube: "https://www.youtube.com/watch?v=0wQ7W7W_e5E",
      course: "https://www.snia.org"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Firewall & Endpoint Security",
    category: "Security",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.paloaltonetworks.com",
      youtube: "https://www.youtube.com/watch?v=4b7mX_2C0qM",
      course: "https://portswigger.net"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Backup & Patch Management (Veeam/WSUS)",
    category: "Maintenance",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://helpcenter.veeam.com",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://learn.microsoft.com"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "PowerShell & Bash Scripting",
    category: "Automation",
    difficulty: "Intermediate",
    requiredLevel: 80,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://learn.microsoft.com/en-us/powershell/",
      youtube: "https://www.youtube.com/watch?v=v-F3YLd6oMw",
      course: "https://www.shellscript.sh"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Cloud Fundamentals (Azure / AWS)",
    category: "Cloud",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://learn.microsoft.com/en-us/azure/",
      youtube: "https://www.youtube.com/watch?v=k1RI5locZE4",
      course: "https://explore.skillbuilder.aws"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "Microsoft 365 & Entra ID",
    category: "SaaS Identity",
    difficulty: "Intermediate",
    requiredLevel: 75,
    estimatedHours: 40,
    isOptional: true,
    resources: {
      official: "https://learn.microsoft.com/en-us/entra/",
      youtube: "https://www.youtube.com/watch?v=0kP8y7W77Xk",
      course: "https://learn.microsoft.com"
    }
  },
  {
    roleId: "it-infrastructure-engineer",
    skill: "ITIL Service Management Standards",
    category: "Process",
    difficulty: "Beginner",
    requiredLevel: 70,
    estimatedHours: 30,
    isOptional: true,
    resources: {
      official: "https://www.axelos.com/certifications/itil-service-management",
      youtube: "https://www.youtube.com/watch?v=9TycLR0TqFA",
      course: "https://www.axelos.com"
    }
  },

  // 19. Blockchain Developer
  {
    roleId: "blockchain-developer",
    skill: "Solidity Smart Contract Programming",
    category: "Smart Contracts",
    difficulty: "Advanced",
    requiredLevel: 90,
    estimatedHours: 100,
    isOptional: false,
    resources: {
      official: "https://docs.soliditylang.org",
      youtube: "https://www.youtube.com/watch?v=gyMwXuJrbJQ",
      course: "https://cryptozombies.io"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Ethereum & EVM Architecture",
    category: "EVM",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://ethereum.org/en/developers/docs/evm/",
      youtube: "https://www.youtube.com/watch?v=bBC-nXj3Ng4",
      course: "https://ethereum.org"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Web3.js / Ethers.js",
    category: "Client Libraries",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://docs.ethers.org/v6/",
      youtube: "https://www.youtube.com/watch?v=yk7nVp5HTCk",
      course: "https://web3js.readthedocs.io"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Hardhat & Foundry Development Frameworks",
    category: "Tooling",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://book.getfoundry.sh",
      youtube: "https://www.youtube.com/watch?v=sas02qSFZ74",
      course: "https://hardhat.org/tutorial"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Smart Contract Security & Reentrancy Mitigation",
    category: "Security & Auditing",
    difficulty: "Expert",
    requiredLevel: 90,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://consensys.github.io/smart-contract-best-practices/",
      youtube: "https://www.youtube.com/watch?v=4Mm3BCyHtDY",
      course: "https://ethernaut.openzeppelin.com"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Cryptography & Hashing (Keccak256, ECDSA)",
    category: "Cryptography",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm",
      youtube: "https://www.youtube.com/watch?v=jhXCTbFnK8o",
      course: "https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Node.js & TypeScript for Web3 Backends",
    category: "Backend",
    difficulty: "Intermediate",
    requiredLevel: 82,
    estimatedHours: 50,
    isOptional: false,
    resources: {
      official: "https://www.typescriptlang.org",
      youtube: "https://www.youtube.com/watch?v=gieEQFIfgYc",
      course: "https://javascript.info"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "IPFS & Decentralized Storage",
    category: "Storage",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 40,
    isOptional: false,
    resources: {
      official: "https://docs.ipfs.tech",
      youtube: "https://www.youtube.com/watch?v=5Uj6uR3fp-U",
      course: "https://proto.school"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Rust for Solana / Polkadot",
    category: "Alternative Chains",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 80,
    isOptional: true,
    resources: {
      official: "https://docs.solana.com/developers",
      youtube: "https://www.youtube.com/watch?v=0P8YU3uL44o",
      course: "https://doc.rust-lang.org/book/"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "Layer-2 Rollups (Arbitrum, Optimism, Polygon)",
    category: "Scaling",
    difficulty: "Advanced",
    requiredLevel: 78,
    estimatedHours: 45,
    isOptional: true,
    resources: {
      official: "https://polygon.technology/docs",
      youtube: "https://www.youtube.com/watch?v=7pWUC949_Ew",
      course: "https://ethereum.org/en/developers/docs/scaling/"
    }
  },
  {
    roleId: "blockchain-developer",
    skill: "DeFi Protocols & AMM Math",
    category: "DeFi",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 60,
    isOptional: true,
    resources: {
      official: "https://docs.uniswap.org",
      youtube: "https://www.youtube.com/watch?v=IL7cRj5vzEU",
      course: "https://finematics.com"
    }
  },

  // 20. Game Developer (Unity/Unreal)
  {
    roleId: "game-developer",
    skill: "Unity Engine & C# (or Unreal & C++)",
    category: "Game Engines",
    difficulty: "Advanced",
    requiredLevel: 88,
    estimatedHours: 110,
    isOptional: false,
    resources: {
      official: "https://docs.unity3d.com/Manual/index.html",
      youtube: "https://www.youtube.com/watch?v=gB1F9G0JXOo",
      course: "https://learn.unity.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Game Physics & Collision Detection",
    category: "Physics",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://docs.unity3d.com/Manual/PhysicsSection.html",
      youtube: "https://www.youtube.com/watch?v=7h4Sl21AK9g",
      course: "https://learn.unity.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Object-Oriented Game Architecture & Design Patterns",
    category: "Software Design",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 80,
    isOptional: false,
    resources: {
      official: "https://gameprogrammingpatterns.com",
      youtube: "https://www.youtube.com/watch?v=0JJFLz64Il8",
      course: "https://gameprogrammingpatterns.com/contents.html"
    }
  },
  {
    roleId: "game-developer",
    skill: "3D/2D Mathematics & Linear Algebra",
    category: "Mathematics",
    difficulty: "Advanced",
    requiredLevel: 85,
    estimatedHours: 70,
    isOptional: false,
    resources: {
      official: "https://www.3blue1brown.com/topics/linear-algebra",
      youtube: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      course: "https://gamemath.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Gameplay Mechanics & Finite State Machines",
    category: "Gameplay Systems",
    difficulty: "Intermediate",
    requiredLevel: 85,
    estimatedHours: 60,
    isOptional: false,
    resources: {
      official: "https://docs.unity3d.com/Manual/StateMachineBasics.html",
      youtube: "https://www.youtube.com/watch?v=vt8y6e0_V9U",
      course: "https://learn.unity.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Memory Management & Frame-Rate Profiling",
    category: "Optimization",
    difficulty: "Advanced",
    requiredLevel: 82,
    estimatedHours: 65,
    isOptional: false,
    resources: {
      official: "https://docs.unity3d.com/Manual/Profiler.html",
      youtube: "https://www.youtube.com/watch?v=0kH_Q2u4hX8",
      course: "https://learn.unity.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Git LFS for Large Game Assets",
    category: "Version Control",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 30,
    isOptional: false,
    resources: {
      official: "https://git-lfs.com",
      youtube: "https://www.youtube.com/watch?v=uLR1RNqJ1Mw",
      course: "https://docs.github.com/en/repositories/working-with-files/managing-large-files"
    }
  },
  {
    roleId: "game-developer",
    skill: "UI/UX for Interactive Games",
    category: "UI",
    difficulty: "Intermediate",
    requiredLevel: 78,
    estimatedHours: 45,
    isOptional: false,
    resources: {
      official: "https://docs.unity3d.com/Packages/com.unity.ugui@latest",
      youtube: "https://www.youtube.com/watch?v=TAGZxRMglL8",
      course: "https://learn.unity.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Shader Programming (HLSL / Shader Graph)",
    category: "Graphics & Shaders",
    difficulty: "Advanced",
    requiredLevel: 72,
    estimatedHours: 70,
    isOptional: true,
    resources: {
      official: "https://docs.unity3d.com/Manual/shader-graph.html",
      youtube: "https://www.youtube.com/watch?v=31sTlsUa7kY",
      course: "https://thebookofshaders.com"
    }
  },
  {
    roleId: "game-developer",
    skill: "Multiplayer Networking (Photon / Mirror)",
    category: "Networking",
    difficulty: "Advanced",
    requiredLevel: 75,
    estimatedHours: 65,
    isOptional: true,
    resources: {
      official: "https://doc.photonengine.com/pun/current/getting-started/pun-intro",
      youtube: "https://www.youtube.com/watch?v=2fA3k_a1G3g",
      course: "https://mirror-networking.gitbook.io/docs"
    }
  },
  {
    roleId: "game-developer",
    skill: "Unreal Engine Blueprints Visual Scripting",
    category: "Scripting",
    difficulty: "Intermediate",
    requiredLevel: 72,
    estimatedHours: 50,
    isOptional: true,
    resources: {
      official: "https://dev.epicgames.com/documentation/en-us/unreal-engine/blueprints-visual-scripting-in-unreal-engine",
      youtube: "https://www.youtube.com/watch?v=k-zMkzmduqI",
      course: "https://dev.epicgames.com"
    }
  }
];

module.exports = roleSkills;
