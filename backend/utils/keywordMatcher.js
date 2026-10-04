// backend/utils/keywordMatcher.js
const rolesData = require('../seeds/roles.json');

/**
 * Common English and conversational stop words list
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'can', 'about', 'above', 'across', 'after', 'again',
  'against', 'all', 'almost', 'alone', 'along', 'already', 'also', 'although',
  'always', 'am', 'among', 'and', 'another', 'any', 'anybody', 'anyone',
  'anything', 'anywhere', 'around', 'as', 'at', 'back', 'because', 'become',
  'becomes', 'becoming', 'before', 'behind', 'below', 'beside', 'between',
  'beyond', 'both', 'but', 'by', 'came', 'cannot', 'certain', 'certainly',
  'come', 'comes', 'during', 'each', 'either', 'else', 'elsewhere', 'enough',
  'even', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere',
  'few', 'for', 'from', 'further', 'get', 'gets', 'getting', 'give', 'given',
  'gives', 'go', 'goes', 'going', 'gone', 'got', 'great', 'had', 'has',
  'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'however', 'if', 'in', 'into', 'it', 'its', 'itself', 'just',
  'keep', 'keeps', 'kept', 'know', 'known', 'knows', 'last', 'latter',
  'less', 'like', 'likely', 'little', 'look', 'looked', 'looking', 'looks',
  'made', 'make', 'makes', 'making', 'many', 'me', 'mean', 'means', 'meant',
  'more', 'most', 'mostly', 'much', 'my', 'myself', 'name', 'namely',
  'neither', 'never', 'nevertheless', 'new', 'next', 'no', 'nobody', 'none',
  'noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of', 'off', 'often',
  'on', 'once', 'one', 'only', 'onto', 'or', 'other', 'others', 'otherwise',
  'our', 'ours', 'ourselves', 'out', 'over', 'own', 'per', 'perhaps',
  'please', 'quite', 'rather', 'really', 'regarding', 'said', 'same',
  'say', 'saying', 'says', 'second', 'seconds', 'see', 'seeing', 'seem',
  'seemed', 'seeming', 'seems', 'seen', 'sees', 'several', 'she', 'since',
  'so', 'some', 'somebody', 'someone', 'something', 'somewhere', 'still',
  'such', 'take', 'taken', 'takes', 'taking', 'than', 'that', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there',
  'thereafter', 'thereby', 'therefore', 'therein', 'thereupon', 'these',
  'they', 'this', 'those', 'though', 'through', 'throughout', 'thru',
  'thus', 'to', 'together', 'too', 'toward', 'towards', 'under', 'until',
  'unto', 'up', 'upon', 'us', 'use', 'used', 'uses', 'using', 'very',
  'via', 'want', 'wants', 'we', 'well', 'went', 'what', 'whatever',
  'when', 'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby',
  'wherein', 'whereupon', 'wherever', 'whether', 'which', 'while', 'whither',
  'who', 'whoever', 'whole', 'whom', 'whose', 'why', 'with', 'within',
  'without', 'work', 'working', 'works', 'year', 'years', 'yes', 'yet',
  'you', 'your', 'yours', 'yourself', 'yourselves', 'job', 'role', 'team',
  'candidate', 'requirements', 'qualifications', 'responsibilities', 'opportunity'
]);

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
 */
const matchesSkill = (text = '', skill) => {
  if (!text || !skill) return false;

  if (Array.isArray(skill.aliases)) {
    for (const regex of skill.aliases) {
      if (regex.test(text)) return true;
    }
  }

  const escaped = skill.name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const boundaryPattern = new RegExp(`(?:^|[^a-zA-Z0-9_])${escaped}(?:[^a-zA-Z0-9_]|$)`, 'i');
  return boundaryPattern.test(text);
};

/**
 * extractKeywords(text) function:
 * - Split text by spaces and word boundaries
 * - Remove stop words
 * - Convert to lowercase
 * - Remove special characters but keep alphanumeric (and standard technical + / # characters)
 * - Remove duplicates
 * - Return array of keywords (minimum 3 chars each)
 * - Also enriches with recognized canonical tech skills
 */
const extractKeywords = (text = '') => {
  if (!text) return [];

  const foundSet = new Set();

  // 1. Check known technical catalog for canonical items
  for (const skill of TECH_SKILLS_CATALOG) {
    if (matchesSkill(text, skill)) {
      foundSet.add(skill.name);
    }
  }

  // 2. Tokenize text by whitespace and common punctuation delimiters
  const tokens = text.split(/[\s,;:()[\]{}|/\\<>"'!?~`+*=&]+/);

  for (let rawToken of tokens) {
    // Keep alphanumeric and special technical chars (+, #, .)
    const cleanWord = rawToken.replace(/[^a-zA-Z0-9+#.-]/g, '').trim();
    const lower = cleanWord.toLowerCase();

    if (cleanWord.length >= 3 && !STOP_WORDS.has(lower)) {
      // Check if it matches a catalog item to preserve standard casing
      const catalogItem = TECH_SKILLS_CATALOG.find(s => s.name.toLowerCase() === lower);
      if (catalogItem) {
        foundSet.add(catalogItem.name);
      } else {
        // Capitalize first character for clean presentation
        const formatted = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
        foundSet.add(formatted);
      }
    }
  }

  return Array.from(foundSet);
};

/**
 * matchKeywords(resumeKeywords, jdKeywords) function:
 * - Find intersection of both arrays
 * - Case-insensitive comparison
 * - Return matched keywords array
 */
const matchKeywords = (resumeKeywords = [], jdKeywords = []) => {
  if (!Array.isArray(resumeKeywords) || !Array.isArray(jdKeywords)) return [];

  const matched = [];
  const resumeLower = new Set(resumeKeywords.map(k => (k || '').toString().toLowerCase()));

  for (const jdKey of jdKeywords) {
    if (!jdKey) continue;
    if (resumeLower.has(jdKey.toString().toLowerCase())) {
      if (!matched.some(m => m.toLowerCase() === jdKey.toLowerCase())) {
        matched.push(jdKey);
      }
    }
  }

  return matched;
};

/**
 * calculateMatchScore(matchedCount, totalJdKeywords) function:
 * - Formula: (matchedCount / totalJdKeywords) * 100
 * - Round to 1 decimal place
 * - Return number 0-100
 */
const calculateMatchScore = (matchedCount = 0, totalJdKeywords = 0) => {
  if (!totalJdKeywords || totalJdKeywords <= 0) return 0;
  const rawScore = (matchedCount / totalJdKeywords) * 100;
  const rounded = Math.round(rawScore * 10) / 10;
  return Math.min(100, Math.max(0, rounded));
};

/**
 * findMissingKeywords(resumeKeywords, jdKeywords, jdText) function:
 * - Return keywords in JD but not in resume
 * - Limit to top 20 missing keywords (most important)
 * - Sort by frequency in JD
 */
const findMissingKeywords = (resumeKeywords = [], jdKeywords = [], jdText = '') => {
  if (!Array.isArray(jdKeywords)) return [];

  const resumeLower = new Set((resumeKeywords || []).map(k => (k || '').toString().toLowerCase()));
  const missing = [];

  for (const jdKey of jdKeywords) {
    if (!jdKey) continue;
    if (!resumeLower.has(jdKey.toString().toLowerCase())) {
      if (!missing.some(m => m.toLowerCase() === jdKey.toLowerCase())) {
        missing.push(jdKey);
      }
    }
  }

  // Sort by occurrence frequency in the JD text if text provided
  if (jdText) {
    missing.sort((a, b) => {
      const regA = new RegExp(`\\b${a.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      const regB = new RegExp(`\\b${b.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      const countA = (jdText.match(regA) || []).length;
      const countB = (jdText.match(regB) || []).length;
      return countB - countA;
    });
  }

  // Limit to top 20 missing keywords
  return missing.slice(0, 20);
};

/**
 * generateSuggestions(missingKeywords, resumeText) function:
 * - For each missing keyword, suggest where to add:
 *   - "Add 'React' to Skills section"
 *   - "Mention 'Docker' in recent projects"
 *   - "Include 'AWS' in work experience"
 * - Max 10 suggestions
 * - Prioritize common keywords first
 * - Return array of suggestion strings
 */
const generateSuggestions = (missingKeywords = [], resumeText = '') => {
  const suggestions = [];
  const text = (resumeText || '').toLowerCase();

  const templateTypes = [
    (kw) => `Add '${kw}' to Skills section`,
    (kw) => `Mention '${kw}' in recent projects`,
    (kw) => `Include '${kw}' in work experience`,
    (kw) => `Highlight hands-on exposure to '${kw}' in summary`
  ];

  for (let i = 0; i < missingKeywords.length && suggestions.length < 10; i++) {
    const kw = missingKeywords[i];
    const templateFn = templateTypes[i % templateTypes.length];
    suggestions.push(templateFn(kw));
  }

  // Add ATS formatting tips if fewer than 5
  if (!text.includes('skills') && suggestions.length < 10) {
    suggestions.push("Add a designated 'Skills' section for ATS parsing");
  }
  if (!text.includes('experience') && !text.includes('work') && suggestions.length < 10) {
    suggestions.push("Include a chronological 'Work Experience' section with metric outcomes");
  }

  return suggestions.slice(0, 10);
};

/**
 * Checks basic ATS readiness of resume text
 */
const checkAtsReadiness = (resumeText = '') => {
  const text = resumeText || '';

  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b\d{10}\b/.test(text);
  const hasContactInfo = hasEmail || hasPhone;

  const hasSkillsSection = /\b(skills|technical skills|technologies|core competencies|tech stack|key skills|proficiencies)\b/i.test(text);
  const hasExperienceSection = /\b(experience|work experience|employment history|professional experience|work history)\b/i.test(text);
  const hasEducationSection = /\b(education|academic background|degree|university|college|b\.tech|b\.e\.|m\.tech|bachelor|master)\b/i.test(text);
  const hasProjectsSection = /\b(projects|personal projects|key projects|academic projects)\b/i.test(text);

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

  const hasActionVerbs = /\b(architected|engineered|developed|implemented|optimized|designed|delivered|built|led)\b/i.test(text);
  if (!hasActionVerbs && tips.length < 3) {
    tips.push('Use strong action verbs like "Engineered", "Architected", and "Optimized" in bullet points');
  }

  if (tips.length === 0) {
    tips.push('Resume follows standard ATS structure. Maintain clean single-column formatting.');
  }

  return {
    hasContactInfo,
    hasContact: hasContactInfo,
    hasSkillsSection,
    hasSkills: hasSkillsSection,
    hasExperienceSection,
    hasExperience: hasExperienceSection,
    hasEducationSection,
    hasEducation: hasEducationSection,
    hasProjectsSection,
    hasProjects: hasProjectsSection,
    tips
  };
};

/**
 * Core Analyzer: Takes resume text + job description and returns full analysis
 */
const analyzeResumeAgainstJD = (resumeText = '', jobDescription = '', jobTitle = 'Target Role') => {
  const resume = resumeText || '';
  const jd = jobDescription || '';

  let jdKeywords = extractKeywords(jd);
  const resumeKeywords = extractKeywords(resume);

  if (jdKeywords.length === 0) {
    const roleMatch = rolesData.find(
      r => r.title.toLowerCase() === (jobTitle || '').toLowerCase()
    ) || rolesData.find(r => r.title === 'Fullstack Developer');

    jdKeywords = roleMatch ? roleMatch.coreSkills : ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'];
  }

  const matchingKeywords = matchKeywords(resumeKeywords, jdKeywords);
  const missingKeywords = findMissingKeywords(resumeKeywords, jdKeywords, jd);
  const score = calculateMatchScore(matchingKeywords.length, jdKeywords.length);
  const atsReadiness = checkAtsReadiness(resume);
  const suggestions = generateSuggestions(missingKeywords, resume);

  return {
    matchScore: Math.round(score),
    rawScore: score,
    missingKeywords,
    matchingKeywords,
    totalJDKeywords: jdKeywords.length,
    matchingCount: matchingKeywords.length,
    suggestions,
    atsReadiness,
    atsReady: {
      hasContact: atsReadiness.hasContactInfo,
      hasSkills: atsReadiness.hasSkillsSection,
      hasExperience: atsReadiness.hasExperienceSection,
      hasEducation: atsReadiness.hasEducationSection
    },
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
    atsReadiness: result.atsReadiness,
    atsReady: result.atsReady
  };
};

module.exports = {
  extractKeywords,
  matchKeywords,
  calculateMatchScore,
  findMissingKeywords,
  generateSuggestions,
  checkAtsReadiness,
  analyzeResumeAgainstJD,
  analyzeResumeMatch,
  TECH_SKILLS_CATALOG,
  STOP_WORDS
};
