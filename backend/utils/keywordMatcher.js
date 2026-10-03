// backend/utils/keywordMatcher.js
const rolesData = require('../seeds/roles.json');

/**
 * Comprehensive technical skills repository with canonical names and regex aliases
 */
const TECH_SKILLS_CATALOG = [
  // Programming Languages
  { name: 'JavaScript', aliases: [/\bjavascript\b/i, /\bjs\b/i] },
  { name: 'TypeScript', aliases: [/\btypescript\b/i, /\bts\b/i] },
  { name: 'Python', aliases: [/\bpython\b/i, /\bpython3\b/i] },
  { name: 'Java', aliases: [/\bjava\b(?!\s*script)/i] },
  { name: 'C++', aliases: [/(?:^|[^a-zA-Z0-9_])c\+\+(?:[^a-zA-Z0-9_]|$)/i, /\bcpp\b/i] },
  { name: 'C#', aliases: [/(?:^|[^a-zA-Z0-9_])c#(?:[^a-zA-Z0-9_]|$)/i, /\bc-sharp\b/i] },
  { name: 'Go', aliases: [/\bgolang\b/i, /\bgo\s+language\b/i, /\bgo\b/i] },
  { name: 'Rust', aliases: [/\brust\b/i] },
  { name: 'Ruby', aliases: [/\bruby\b/i] },
  { name: 'PHP', aliases: [/\bphp\b/i] },
  { name: 'Swift', aliases: [/\bswift\b/i] },
  { name: 'Kotlin', aliases: [/\bkotlin\b/i] },
  { name: 'Dart', aliases: [/\bdart\b/i] },
  { name: 'SQL', aliases: [/\bsql\b/i] },
  { name: 'HTML', aliases: [/\bhtml\b/i, /\bhtml5\b/i] },
  { name: 'CSS', aliases: [/\bcss\b/i, /\bcss3\b/i] },
  { name: 'Sass', aliases: [/\bsass\b/i, /\bscss\b/i] },
  { name: 'Bash', aliases: [/\bbash\b/i, /\bshell\s+scripting\b/i] },

  // Frontend Libraries & Frameworks
  { name: 'React', aliases: [/\breact\b/i, /\breactjs\b/i, /\breact\.js\b/i] },
  { name: 'React Native', aliases: [/\breact\s+native\b/i] },
  { name: 'Next.js', aliases: [/\bnext\.js\b/i, /\bnextjs\b/i, /\bnext\s+js\b/i] },
  { name: 'Vue', aliases: [/\bvue\b/i, /\bvuejs\b/i, /\bvue\.js\b/i] },
  { name: 'Nuxt', aliases: [/\bnuxt\b/i, /\bnuxtjs\b/i] },
  { name: 'Angular', aliases: [/\bangular\b/i, /\bangularjs\b/i] },
  { name: 'Svelte', aliases: [/\bsvelte\b/i] },
  { name: 'Redux', aliases: [/\bredux\b/i, /\bredux\s+toolkit\b/i] },
  { name: 'Tailwind', aliases: [/\btailwind\b/i, /\btailwindcss\b/i, /\btailwind\s+css\b/i] },
  { name: 'Bootstrap', aliases: [/\bbootstrap\b/i] },
  { name: 'GraphQL', aliases: [/\bgraphql\b/i] },
  { name: 'REST APIs', aliases: [/\brest\s*api[s]?\b/i, /\brestful\b/i, /\brest\b/i] },
  { name: 'Webpack', aliases: [/\bwebpack\b/i] },
  { name: 'Vite', aliases: [/\bvite\b/i] },

  // Backend Frameworks & Runtimes
  { name: 'Node.js', aliases: [/\bnode\.js\b/i, /\bnodejs\b/i, /\bnode\b/i] },
  { name: 'Express', aliases: [/\bexpress\b/i, /\bexpress\.js\b/i, /\bexpressjs\b/i] },
  { name: 'NestJS', aliases: [/\bnestjs\b/i, /\bnest\.js\b/i] },
  { name: 'Django', aliases: [/\bdjango\b/i] },
  { name: 'Flask', aliases: [/\bflask\b/i] },
  { name: 'FastAPI', aliases: [/\bfastapi\b/i] },
  { name: 'Spring Boot', aliases: [/\bspring\s+boot\b/i, /\bspringboot\b/i, /\bspring\s+framework\b/i] },
  { name: 'ASP.NET', aliases: [/\basp\.net\b/i, /\b\.net\s+core\b/i, /\bdotnet\b/i] },
  { name: 'Ruby on Rails', aliases: [/\bruby\s+on\s+rails\b/i, /\brails\b/i] },
  { name: 'Microservices', aliases: [/\bmicroservices\b/i, /\bmicroservice\b/i] },
  { name: 'WebSockets', aliases: [/\bwebsockets\b/i, /\bwebsocket\b/i, /\bsocket\.io\b/i] },

  // Databases & Caches
  { name: 'PostgreSQL', aliases: [/\bpostgresql\b/i, /\bpostgres\b/i] },
  { name: 'MySQL', aliases: [/\bmysql\b/i] },
  { name: 'MongoDB', aliases: [/\bmongodb\b/i, /\bmongo\b/i] },
  { name: 'Redis', aliases: [/\bredis\b/i] },
  { name: 'SQLite', aliases: [/\bsqlite\b/i, /\bsqlite3\b/i] },
  { name: 'Cassandra', aliases: [/\bcassandra\b/i] },
  { name: 'Elasticsearch', aliases: [/\belasticsearch\b/i] },
  { name: 'Firebase', aliases: [/\bfirebase\b/i] },
  { name: 'Supabase', aliases: [/\bsupabase\b/i] },
  { name: 'Prisma', aliases: [/\bprisma\b/i] },
  { name: 'Kafka', aliases: [/\bkafka\b/i, /\bapache\s+kafka\b/i] },
  { name: 'RabbitMQ', aliases: [/\brabbitmq\b/i] },

  // Cloud & DevOps
  { name: 'AWS', aliases: [/\baws\b/i, /\bamazon\s+web\s+services\b/i] },
  { name: 'Azure', aliases: [/\bazure\b/i, /\bmicrosoft\s+azure\b/i] },
  { name: 'GCP', aliases: [/\bgcp\b/i, /\bgoogle\s+cloud\b/i] },
  { name: 'Docker', aliases: [/\bdocker\b/i] },
  { name: 'Kubernetes', aliases: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { name: 'CI/CD', aliases: [/\bci\/cd\b/i, /\bcicd\b/i, /\bcontinuous\s+integration\b/i] },
  { name: 'Jenkins', aliases: [/\bjenkins\b/i] },
  { name: 'GitHub Actions', aliases: [/\bgithub\s+actions\b/i] },
  { name: 'Terraform', aliases: [/\bterraform\b/i] },
  { name: 'Linux', aliases: [/\blinux\b/i] },
  { name: 'Nginx', aliases: [/\bnginx\b/i] },

  // Testing & Quality
  { name: 'Jest', aliases: [/\bjest\b/i] },
  { name: 'Cypress', aliases: [/\bcypress\b/i] },
  { name: 'Playwright', aliases: [/\bplaywright\b/i] },
  { name: 'Unit Testing', aliases: [/\bunit\s+testing\b/i, /\bunit\s+tests\b/i] },
  { name: 'TDD', aliases: [/\btdd\b/i, /\btest\s+driven\s+development\b/i] },

  // Core Concepts & Tools
  { name: 'Git', aliases: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i] },
  { name: 'Agile', aliases: [/\bagile\b/i, /\bscrum\b/i] },
  { name: 'JIRA', aliases: [/\bjira\b/i] },
  { name: 'System Design', aliases: [/\bsystem\s+design\b/i] },
  { name: 'Data Structures', aliases: [/\bdata\s+structures\b/i, /\bdsa\b/i] },
  { name: 'Algorithms', aliases: [/\balgorithms\b/i] },
  { name: 'OOP', aliases: [/\boop\b/i, /\bobject\s+oriented\b/i] },

  // AI & Data Science
  { name: 'Machine Learning', aliases: [/\bmachine\s+learning\b/i, /\bml\b/i] },
  { name: 'Deep Learning', aliases: [/\bdeep\s+learning\b/i] },
  { name: 'TensorFlow', aliases: [/\btensorflow\b/i] },
  { name: 'PyTorch', aliases: [/\bpytorch\b/i] },
  { name: 'Pandas', aliases: [/\bpandas\b/i] },
  { name: 'NumPy', aliases: [/\bnumpy\b/i] }
];

/**
 * Checks if a specific skill name or its aliases exist in text
 * @param {string} text - Target text
 * @param {object} skill - Skill entry with name and aliases
 * @returns {boolean}
 */
const matchesSkill = (text = '', skill) => {
  if (!text || !skill) return false;

  // Test aliases first
  if (Array.isArray(skill.aliases)) {
    for (const regex of skill.aliases) {
      if (regex.test(text)) return true;
    }
  }

  // Fallback to escaped boundary matching
  const escaped = skill.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const boundaryPattern = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:[^a-zA-Z0-9_]|$)`, 'i');
  return boundaryPattern.test(text);
};

/**
 * Extracts keywords/skills mentioned in a given text (Job Description or Resume)
 * @param {string} text - Source text
 * @returns {string[]} Array of detected unique skill names
 */
const extractKeywords = (text = '') => {
  if (!text) return [];

  const foundKeywords = new Set();

  // 1. Match against known tech catalog
  for (const skill of TECH_SKILLS_CATALOG) {
    if (matchesSkill(text, skill)) {
      foundKeywords.add(skill.name);
    }
  }

  // 2. Extract potential capitalized terms / technical acronyms (e.g. AWS, GCP, CI/CD, Figma, etc.)
  const words = text.match(/\b[A-Z][a-zA-Z0-9+#.-]{1,15}\b/g) || [];
  const commonStopWords = new Set([
    'The', 'We', 'You', 'Our', 'Are', 'This', 'That', 'With', 'From', 'Have',
    'Will', 'Must', 'Job', 'Role', 'Team', 'Work', 'Year', 'Years', 'Company',
    'Candidate', 'Requirements', 'Responsibilities', 'Qualifications', 'About',
    'Skills', 'Experience', 'Education', 'Opportunity', 'Salary', 'Benefits'
  ]);

  for (const word of words) {
    if (!commonStopWords.has(word) && word.length > 2) {
      // Check if it's already in catalog or a clear technical word
      const catalogItem = TECH_SKILLS_CATALOG.find(s => s.name.toLowerCase() === word.toLowerCase());
      if (catalogItem) {
        foundKeywords.add(catalogItem.name);
      }
    }
  }

  return Array.from(foundKeywords);
};

/**
 * Checks basic ATS readiness of resume text
 * Verifies Contact Info, Skills section, Experience section, Education, and provides actionable tips
 * @param {string} resumeText - Extracted resume text
 * @returns {object} ATS readiness audit result
 */
const checkAtsReadiness = (resumeText = '') => {
  const text = resumeText || '';

  // 1. Contact Information check (email, phone, LinkedIn / GitHub)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(text);
  const hasContactInfo = hasEmail || hasPhone;

  // 2. Skills Section check
  const hasSkillsSection = /\b(skills|technical skills|technologies|core competencies|tech stack|key skills|proficiencies)\b/i.test(text);

  // 3. Experience Section check
  const hasExperienceSection = /\b(experience|work experience|employment history|professional experience|work history)\b/i.test(text);

  // 4. Education Section check
  const hasEducationSection = /\b(education|academic background|degree|university|college|b\.tech|b\.e\.|m\.tech|bachelor|master)\b/i.test(text);

  // 5. Projects Section check
  const hasProjectsSection = /\b(projects|personal projects|key projects|academic projects)\b/i.test(text);

  // Generate ATS tips
  const tips = [];
  if (!hasSkillsSection) {
    tips.push('Add Skills section for better ATS score');
  }
  if (!hasExperienceSection) {
    tips.push('Include a standard Experience section with chronological work history');
  }
  if (!hasContactInfo) {
    tips.push('Add clear contact information (email and phone) at the top of your resume');
  }
  if (!hasEducationSection) {
    tips.push('Add an Education section highlighting degrees and academic credentials');
  }
  if (!hasProjectsSection) {
    tips.push('Include a Projects section highlighting practical applications of your skills');
  }

  // Formatting / action verbs check
  const hasActionVerbs = /\b(architected|engineered|developed|implemented|optimized|designed|delivered|built|led)\b/i.test(text);
  if (!hasActionVerbs && tips.length < 3) {
    tips.push('Use strong action verbs like "Engineered", "Architected", and "Optimized" in bullet points');
  }

  if (tips.length === 0) {
    tips.push('Resume follows standard ATS structure. Maintain clean single-column formatting.');
  }

  return {
    hasContactInfo,
    hasSkillsSection,
    hasExperienceSection,
    hasEducationSection,
    hasProjectsSection,
    tips
  };
};

/**
 * Generates 3-5 actionable recommendations based on missing keywords and ATS readiness
 * @param {string[]} missingKeywords - Gaps found
 * @param {object} atsReadiness - ATS checklist
 * @param {string} resumeText - Raw resume text
 * @returns {string[]} 3 to 5 actionable suggestions
 */
const generateActionableSuggestions = (missingKeywords = [], atsReadiness = {}, resumeText = '') => {
  const suggestions = [];

  // Suggestion 1: Add top missing keyword to Skills section
  if (missingKeywords.length > 0) {
    suggestions.push(`Add '${missingKeywords[0]}' to Skills section`);
  }

  // Suggestion 2: Include second missing keyword in recent projects
  if (missingKeywords.length > 1) {
    suggestions.push(`Include ${missingKeywords[1]} in recent project descriptions`);
  }

  // Suggestion 3: Mention third missing keyword
  if (missingKeywords.length > 2) {
    suggestions.push(`Mention ${missingKeywords[2]} experience if you have it`);
  }

  // Suggestion 4: If missing skills section or experience section, provide ATS recommendation
  if (!atsReadiness.hasSkillsSection && !suggestions.some(s => s.toLowerCase().includes('skills section'))) {
    suggestions.push('Add Skills section for better ATS score');
  } else if (!atsReadiness.hasExperienceSection) {
    suggestions.push('Add an Experience section with measurable impact bullet points');
  } else if (!atsReadiness.hasContactInfo) {
    suggestions.push('Place your professional email and contact phone prominently in the header');
  }

  // Suggestion 5: Metric quantification check
  const hasMetrics = /\b\d+%\b|\b\d+\s*(?:users|clients|ms|seconds|million|thousand|k|x)\b/i.test(resumeText);
  if (!hasMetrics && suggestions.length < 5) {
    suggestions.push('Quantify achievements with metrics (e.g. "improved performance by 30%")');
  }

  // Fill in if fewer than 3 suggestions
  if (suggestions.length < 3 && missingKeywords.length > 3) {
    suggestions.push(`Highlight any exposure to ${missingKeywords[3]} in your technical summary`);
  }
  if (suggestions.length < 3) {
    suggestions.push('Tailor your professional summary to mirror key requirements in the job description');
  }
  if (suggestions.length < 3) {
    suggestions.push('Ensure standard font formatting without nested columns or images for ATS compatibility');
  }

  // Guarantee 3 to 5 suggestions
  return suggestions.slice(0, 5);
};

/**
 * Core Analyzer: Takes resume text + job description and returns full analysis
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description or role requirements
 * @param {string} jobTitle - Optional target role / job title
 * @returns {object} Analysis result matching required schema
 */
const analyzeResumeAgainstJD = (resumeText = '', jobDescription = '', jobTitle = 'Target Role') => {
  const resume = resumeText || '';
  const jd = jobDescription || '';

  // 1. Extract keywords from both Job Description and Resume
  let jdKeywords = extractKeywords(jd);
  const resumeKeywords = extractKeywords(resume);

  // If JD is brief or empty, fallback to target role's core skills or common stack
  if (jdKeywords.length === 0) {
    const roleMatch = rolesData.find(
      r => r.title.toLowerCase() === (jobTitle || '').toLowerCase()
    ) || rolesData.find(r => r.title === 'Fullstack Developer');

    jdKeywords = roleMatch ? roleMatch.coreSkills : ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
  }

  // 2. Identify matching and missing keywords
  const matchingKeywords = [];
  const missingKeywords = [];

  for (const keyword of jdKeywords) {
    // Check if the skill appears in resume
    const catalogItem = TECH_SKILLS_CATALOG.find(s => s.name.toLowerCase() === keyword.toLowerCase()) || { name: keyword };
    if (matchesSkill(resume, catalogItem)) {
      matchingKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  // 3. Calculate match score (0-100) = (matching keywords / total JD keywords) * 100
  const totalJDKeywords = jdKeywords.length;
  const matchScore = totalJDKeywords > 0
    ? Math.min(100, Math.max(0, Math.round((matchingKeywords.length / totalJDKeywords) * 100)))
    : 0;

  // 4. Check basic ATS readiness
  const atsReadiness = checkAtsReadiness(resume);

  // 5. Provide 3-5 actionable suggestions based on gaps
  const suggestions = generateActionableSuggestions(missingKeywords, atsReadiness, resume, matchingKeywords);

  return {
    matchScore,
    missingKeywords,
    matchingKeywords,
    totalJDKeywords,
    matchingCount: matchingKeywords.length,
    suggestions,
    atsReadiness,
    jobTitle: jobTitle || 'Target Role'
  };
};

/**
 * Backward-compatible helper for role-based resume matching
 */
const analyzeResumeMatch = (resumeText = '', targetRoleName = 'Fullstack Developer') => {
  const role = rolesData.find(
    r => r.title.toLowerCase() === (targetRoleName || '').toLowerCase()
  ) || rolesData.find(r => r.title === 'Fullstack Developer');

  const requiredSkills = role ? role.coreSkills : [
    'JavaScript', 'React', 'Node.js', 'Express', 'SQL', 'Git', 'REST APIs', 'Docker'
  ];

  const syntheticJD = `Job Title: ${targetRoleName}. Requirements: ${requiredSkills.join(', ')}`;
  const result = analyzeResumeAgainstJD(resumeText, syntheticJD, targetRoleName);

  return {
    targetRole: role ? role.title : targetRoleName,
    atsScore: result.matchScore,
    matchScore: result.matchScore,
    totalRequired: requiredSkills.length,
    matchedCount: result.matchingKeywords.length,
    matchedKeywords: result.matchingKeywords,
    matchingKeywords: result.matchingKeywords,
    missingKeywords: result.missingKeywords,
    suggestions: result.suggestions,
    atsReadiness: result.atsReadiness
  };
};

module.exports = {
  analyzeResumeAgainstJD,
  analyzeResumeMatch,
  extractKeywords,
  checkAtsReadiness,
  generateActionableSuggestions
};
