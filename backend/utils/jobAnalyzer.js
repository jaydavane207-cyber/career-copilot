// backend/utils/jobAnalyzer.js
const { TECH_SKILLS_CATALOG } = require('./keywordMatcher');

/**
 * Predefined dictionary of 120+ tech skills with categories, aliases, and estimated learning hours
 */
const SKILL_DATABASE = [
  // Frontend
  { name: 'React', category: 'Frontend', hours: 35, aliases: [/\breact(?:\.js)?\b/i] },
  { name: 'Next.js', category: 'Frontend', hours: 25, aliases: [/\bnext(?:\.js)?\b/i] },
  { name: 'Vue.js', category: 'Frontend', hours: 30, aliases: [/\bvue(?:\.js)?\b/i] },
  { name: 'Angular', category: 'Frontend', hours: 45, aliases: [/\bangular\b/i] },
  { name: 'TypeScript', category: 'Frontend/Backend', hours: 30, aliases: [/\btypescript\b/i, /\bts\b/i] },
  { name: 'JavaScript', category: 'Frontend/Backend', hours: 40, aliases: [/\bjavascript\b/i, /\bes6\b/i] },
  { name: 'HTML5', category: 'Frontend', hours: 15, aliases: [/\bhtml5?\b/i] },
  { name: 'CSS3', category: 'Frontend', hours: 20, aliases: [/\bcss3?\b/i] },
  { name: 'Tailwind CSS', category: 'Frontend', hours: 15, aliases: [/\btailwind(?:\s*css)?\b/i] },
  { name: 'Redux', category: 'Frontend', hours: 20, aliases: [/\bredux\b/i, /\btoolkit\b/i] },
  { name: 'Webpack', category: 'Frontend Tooling', hours: 20, aliases: [/\bwebpack\b/i, /\bvite\b/i] },

  // Backend
  { name: 'Node.js', category: 'Backend', hours: 35, aliases: [/\bnode(?:\.js)?\b/i] },
  { name: 'Express', category: 'Backend', hours: 20, aliases: [/\bexpress(?:\.js)?\b/i] },
  { name: 'Python', category: 'Backend/Data', hours: 40, aliases: [/\bpython3?\b/i] },
  { name: 'Django', category: 'Backend', hours: 35, aliases: [/\bdjango\b/i] },
  { name: 'FastAPI', category: 'Backend', hours: 25, aliases: [/\bfastapi\b/i] },
  { name: 'Java', category: 'Backend', hours: 50, aliases: [/\bjava\b(?!\s*script)/i] },
  { name: 'Spring Boot', category: 'Backend', hours: 45, aliases: [/\bspring\s*boot\b/i] },
  { name: 'Go', category: 'Backend', hours: 40, aliases: [/\bgolang\b/i, /\bgo\s+language\b/i] },
  { name: 'C#', category: 'Backend', hours: 45, aliases: [/\bc#\b/i, /\b\.net\b/i] },
  { name: 'C++', category: 'Systems', hours: 60, aliases: [/\bc\+\+\b/i, /\bcpp\b/i] },
  { name: 'Rust', category: 'Systems', hours: 55, aliases: [/\brust\b/i] },
  { name: 'PHP', category: 'Backend', hours: 30, aliases: [/\bphp\b/i, /\blaravel\b/i] },
  { name: 'Ruby on Rails', category: 'Backend', hours: 35, aliases: [/\bruby\b/i, /\brails\b/i] },

  // Databases & Caching
  { name: 'SQL', category: 'Database', hours: 25, aliases: [/\bsql\b/i] },
  { name: 'PostgreSQL', category: 'Database', hours: 30, aliases: [/\bpostgres(?:ql)?\b/i] },
  { name: 'MySQL', category: 'Database', hours: 25, aliases: [/\bmysql\b/i] },
  { name: 'MongoDB', category: 'Database', hours: 25, aliases: [/\bmongo(?:db)?\b/i] },
  { name: 'Redis', category: 'Database/Cache', hours: 20, aliases: [/\bredis\b/i] },
  { name: 'Cassandra', category: 'Database', hours: 35, aliases: [/\bcassandra\b/i] },
  { name: 'Elasticsearch', category: 'Search/Database', hours: 30, aliases: [/\belasticsearch\b/i] },
  { name: 'DynamoDB', category: 'Database', hours: 25, aliases: [/\bdynamodb\b/i] },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud', hours: 40, aliases: [/\baws\b/i, /\bamazon web services\b/i, /\bec2\b/i, /\bs3\b/i] },
  { name: 'Azure', category: 'Cloud', hours: 40, aliases: [/\bazure\b/i] },
  { name: 'Google Cloud (GCP)', category: 'Cloud', hours: 35, aliases: [/\bgcp\b/i, /\bgoogle cloud\b/i] },
  { name: 'Docker', category: 'DevOps', hours: 25, aliases: [/\bdocker\b/i, /\bcontainer(?:ization)?\b/i] },
  { name: 'Kubernetes', category: 'DevOps', hours: 45, aliases: [/\bkubernetes\b/i, /\bk8s\b/i] },
  { name: 'CI/CD', category: 'DevOps', hours: 25, aliases: [/\bci\s*\/\s*cd\b/i, /\bjenkins\b/i, /\bgithub actions\b/i] },
  { name: 'Terraform', category: 'DevOps/IaC', hours: 30, aliases: [/\bterraform\b/i] },
  { name: 'Linux', category: 'Systems', hours: 25, aliases: [/\blinux\b/i, /\bunix\b/i, /\bbash\b/i] },

  // Architecture & APIs
  { name: 'REST APIs', category: 'Architecture', hours: 20, aliases: [/\brest(?:ful)?\s*apis?\b/i, /\brest\b/i] },
  { name: 'GraphQL', category: 'Architecture', hours: 25, aliases: [/\bgraphql\b/i] },
  { name: 'Microservices', category: 'Architecture', hours: 35, aliases: [/\bmicroservices?\b/i] },
  { name: 'System Design', category: 'Architecture', hours: 40, aliases: [/\bsystem design\b/i, /\bdistributed systems?\b/i, /\bscalability\b/i] },
  { name: 'gRPC', category: 'Architecture', hours: 25, aliases: [/\bgrpc\b/i] },
  { name: 'Kafka', category: 'Messaging', hours: 35, aliases: [/\bkafka\b/i, /\brabbitmq\b/i, /\bevent-driven\b/i] },

  // Testing & Quality
  { name: 'Unit Testing', category: 'Testing', hours: 20, aliases: [/\bunit test(?:ing)?\b/i, /\bjest\b/i, /\bmocha\b/i, /\bcypress\b/i] },
  { name: 'Git', category: 'Version Control', hours: 15, aliases: [/\bgit\b/i, /\bgithub\b/i, /\bgitlab\b/i] },

  // AI & Data
  { name: 'Machine Learning', category: 'AI/ML', hours: 50, aliases: [/\bmachine learning\b/i, /\bml\b/i] },
  { name: 'TensorFlow', category: 'AI/ML', hours: 40, aliases: [/\btensorflow\b/i, /\bpytorch\b/i] },
  { name: 'Data Structures & Algorithms', category: 'Computer Science', hours: 50, aliases: [/\bdsa\b/i, /\bdata structures\b/i, /\balgorithms\b/i] }
];

/**
 * Extract required vs preferred skills, years of experience, seniority, and frequency from JD text
 * @param {string} jobDescription
 * @returns {Object}
 */
const analyzeJobRequirements = (jobDescription = '') => {
  const jd = jobDescription || '';
  const lines = jd.split('\n');

  // Detect seniority
  let seniority = 'Mid';
  const lowerJd = jd.toLowerCase();
  if (/\b(senior|sr\.?|lead|principal|staff|architect|director|head of)\b/i.test(lowerJd)) {
    seniority = 'Senior';
  } else if (/\b(junior|jr\.?|entry-level|entry level|graduate|intern|associate|fresher)\b/i.test(lowerJd)) {
    seniority = 'Junior';
  }

  // Detect job type
  let jobType = 'Full-time';
  if (/\b(contract|contractor|freelance|c2c|w2 contract)\b/i.test(lowerJd)) {
    jobType = 'Contract';
  } else if (/\b(part-time|part time)\b/i.test(lowerJd)) {
    jobType = 'Part-time';
  } else if (/\b(internship|co-op)\b/i.test(lowerJd)) {
    jobType = 'Internship';
  }

  // Extract years of experience
  let experienceRequired = seniority === 'Senior' ? 5 : seniority === 'Junior' ? 1 : 3;
  const expMatch = lowerJd.match(/(\d+)\+?\s*(?:to|-)\s*(\d+)?\s*(?:years|yrs|year)\b/i)
    || lowerJd.match(/(\d+)\+?\s*(?:years|yrs|year)\s*(?:of)?\s*(?:relevant|industry|professional|experience|work)/i);

  if (expMatch && expMatch[1]) {
    const parsedYears = parseInt(expMatch[1], 10);
    if (!isNaN(parsedYears) && parsedYears >= 0 && parsedYears <= 20) {
      experienceRequired = parsedYears;
    }
  }

  // Segment JD into Required vs Preferred blocks
  let requiredBlock = '';
  let preferredBlock = '';
  let inRequired = false;
  let inPreferred = false;

  for (const line of lines) {
    const l = line.trim().toLowerCase();
    if (/(must have|minimum qualifications|requirements|what you'll need|basic qualifications|what we're looking for|qualifications:)/i.test(l)) {
      inRequired = true;
      inPreferred = false;
      continue;
    }
    if (/(nice to have|preferred qualifications|bonus points|good to have|desired skills|preferred skills|plus:)/i.test(l)) {
      inPreferred = true;
      inRequired = false;
      continue;
    }
    if (/(about us|benefits|perks|compensation|equal opportunity|what we offer)/i.test(l)) {
      inRequired = false;
      inPreferred = false;
      continue;
    }

    if (inPreferred) {
      preferredBlock += ' ' + line;
    } else if (inRequired) {
      requiredBlock += ' ' + line;
    }
  }

  // Skill matching & frequency calculation
  const foundSkills = [];
  const keywordFrequency = {};

  for (const skill of SKILL_DATABASE) {
    let count = 0;
    for (const alias of skill.aliases) {
      const globalRegex = new RegExp(alias.source, alias.flags.includes('g') ? alias.flags : alias.flags + 'g');
      const matches = jd.match(globalRegex);
      if (matches) {
        count += matches.length;
      }
    }

    if (count > 0) {
      keywordFrequency[skill.name] = count;

      // Determine if skill is required or preferred
      let isPreferred = false;
      if (preferredBlock) {
        for (const alias of skill.aliases) {
          if (alias.test(preferredBlock)) {
            isPreferred = true;
            break;
          }
        }
      }

      foundSkills.push({
        ...skill,
        frequency: count,
        isPreferred
      });
    }
  }

  // Sort by frequency descending
  foundSkills.sort((a, b) => b.frequency - a.frequency);

  const requiredSkills = [];
  const preferredSkills = [];

  for (const s of foundSkills) {
    if (s.isPreferred) {
      preferredSkills.push(s.name);
    } else {
      requiredSkills.push(s.name);
    }
  }

  // If no skills segregated as preferred, take the lowest frequency ones as preferred if list is long
  if (preferredSkills.length === 0 && requiredSkills.length > 5) {
    const splitIndex = Math.ceil(requiredSkills.length * 0.7);
    preferredSkills.push(...requiredSkills.splice(splitIndex));
  }

  // Fallback defaults if JD text was short
  if (requiredSkills.length === 0) {
    requiredSkills.push('JavaScript', 'React', 'Node.js', 'SQL', 'Git');
    preferredSkills.push('TypeScript', 'Docker', 'AWS');
  }

  return {
    requiredSkills,
    preferredSkills,
    experienceRequired,
    keywordFrequency,
    seniority,
    jobType,
    allMatchedSkills: foundSkills
  };
};

/**
 * Compare user profile / resume skills against job requirements
 * @param {Array<string|Object>} userSkills - Array of skill names or skill objects
 * @param {Object} jobRequirements - Output from analyzeJobRequirements
 * @param {string} resumeText - Raw text of user resume (optional)
 * @param {number} userExperienceYears - Candidate years of experience (optional)
 * @returns {Object}
 */
const compareResumeWithJob = (userSkills = [], jobRequirements = {}, resumeText = '', userExperienceYears = null) => {
  const reqSkills = jobRequirements.requiredSkills || [];
  const prefSkills = jobRequirements.preferredSkills || [];
  const requiredExp = jobRequirements.experienceRequired || 3;

  // Normalize user skills list into lowercase map
  const userSkillSet = new Set();
  const userSkillProficiencies = {};

  if (Array.isArray(userSkills)) {
    for (const item of userSkills) {
      if (typeof item === 'string') {
        userSkillSet.add(item.toLowerCase().trim());
      } else if (item && typeof item === 'object') {
        const name = (item.skillName || item.name || item.skill || '').toLowerCase().trim();
        if (name) {
          userSkillSet.add(name);
          userSkillProficiencies[name] = item.userLevel || item.proficiency || 70;
        }
      }
    }
  }

  // Also check resumeText if provided
  if (resumeText) {
    const lowerResume = resumeText.toLowerCase();
    for (const skill of SKILL_DATABASE) {
      for (const alias of skill.aliases) {
        if (alias.test(lowerResume)) {
          userSkillSet.add(skill.name.toLowerCase());
          break;
        }
      }
    }
  }

  // Calculate experience
  let candidateYears = userExperienceYears;
  if (candidateYears === null || candidateYears === undefined) {
    if (resumeText) {
      const expMatch = resumeText.match(/(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience|exp)/i);
      if (expMatch && expMatch[1]) {
        candidateYears = parseInt(expMatch[1], 10);
      }
    }
    if (candidateYears === null || candidateYears === undefined) {
      candidateYears = 2; // sensible candidate baseline
    }
  }

  // Skill matching evaluation
  const strongMatches = [];
  const partialMatches = [];
  const missingSkills = [];
  const missingCritical = [];
  const missingImportant = [];

  let earnedPoints = 0;
  let totalPossiblePoints = 0;

  // 1. Evaluate Required Skills (+20 points for strong, +10 for partial)
  for (const skillName of reqSkills) {
    totalPossiblePoints += 20;
    const lower = skillName.toLowerCase();

    // Check direct or alias match
    let hasSkill = userSkillSet.has(lower);
    if (!hasSkill) {
      // Check partial match with database aliases
      const dbEntry = SKILL_DATABASE.find(s => s.name.toLowerCase() === lower);
      if (dbEntry) {
        for (const alias of dbEntry.aliases) {
          for (const u of userSkillSet) {
            if (alias.test(u)) {
              hasSkill = true;
              break;
            }
          }
          if (hasSkill) break;
        }
      }
    }

    if (hasSkill) {
      const prof = userSkillProficiencies[lower] || 75;
      if (prof >= 60) {
        strongMatches.push(skillName);
        earnedPoints += 20;
      } else {
        partialMatches.push(skillName);
        earnedPoints += 10;
      }
    } else {
      missingSkills.push(skillName);
      missingCritical.push(skillName);
    }
  }

  // 2. Evaluate Preferred Skills (+10 points)
  for (const skillName of prefSkills) {
    totalPossiblePoints += 10;
    const lower = skillName.toLowerCase();
    let hasSkill = userSkillSet.has(lower);

    if (hasSkill) {
      strongMatches.push(skillName);
      earnedPoints += 10;
    } else {
      missingSkills.push(skillName);
      missingImportant.push(skillName);
    }
  }

  // 3. Evaluate Experience (+10 points)
  totalPossiblePoints += 10;
  let expPoints = 0;
  const expGap = candidateYears - requiredExp;

  if (candidateYears >= requiredExp) {
    expPoints = 10;
  } else if (candidateYears >= requiredExp - 1) {
    expPoints = 5;
  }
  earnedPoints += expPoints;

  // Calculate percentage (0-100)
  const scorePercent = totalPossiblePoints > 0
    ? Math.min(100, Math.max(10, Math.round((earnedPoints / totalPossiblePoints) * 100)))
    : 70;

  // Categorize Match Level
  let matchLevel = 'Good Match';
  if (scorePercent >= 86) {
    matchLevel = 'Excellent Match';
  } else if (scorePercent >= 67) {
    matchLevel = 'Good Match';
  } else if (scorePercent >= 34) {
    matchLevel = 'Needs Preparation';
  } else {
    matchLevel = 'Poor Match';
  }

  return {
    matchScore: scorePercent,
    matchPercentage: `${scorePercent}%`,
    matchLevel,
    skillMatches: {
      strong: Array.from(new Set(strongMatches)),
      partial: Array.from(new Set(partialMatches)),
      missing: Array.from(new Set(missingSkills))
    },
    experienceMatch: {
      required: requiredExp,
      user: candidateYears,
      gap: expGap
    },
    missingCriticalSkills: Array.from(new Set(missingCritical)),
    missingImportantSkills: Array.from(new Set(missingImportant)),
    overQualified: candidateYears > requiredExp + 3,
    underQualified: candidateYears < requiredExp - 2
  };
};

/**
 * Generate human-readable analysis summary, strengths, gaps and prep recommendations
 * @param {Object} analysis - Output of compareResumeWithJob
 * @param {Object} jobDetails - Scraped job metadata
 * @returns {Object}
 */
const generateJobAnalysisSummary = (analysis, jobDetails = {}) => {
  const company = jobDetails.company || 'the company';
  const title = jobDetails.jobTitle || 'this position';
  const score = analysis.matchScore;
  const strong = analysis.skillMatches?.strong || [];
  const missing = analysis.skillMatches?.missing || [];
  const critical = analysis.missingCriticalSkills || [];
  const important = analysis.missingImportantSkills || [];

  // Summary sentence
  let summary = '';
  if (score >= 85) {
    summary = `Outstanding fit! Your skillset strongly matches the requirements for ${title} at ${company}. You have verified proficiency in core technologies and meet the expected experience bar.`;
  } else if (score >= 67) {
    summary = `Strong match for ${title} at ${company}. You possess most foundational requirements, with just a few target skills to brush up on before your technical rounds.`;
  } else if (score >= 40) {
    summary = `Moderate match. You have relevant experience for ${title}, but there are key gaps in required tech stack that you should prepare before applying.`;
  } else {
    summary = `This role requires several technologies outside your current primary stack. A focused 3-4 week study plan is recommended before submitting an application.`;
  }

  // Strengths
  const strengths = [];
  if (strong.length > 0) {
    strengths.push(`Proven skills in ${strong.slice(0, 3).join(', ')}`);
  }
  if (analysis.experienceMatch?.gap >= 0) {
    strengths.push(`Experience bar satisfied (${analysis.experienceMatch.user} yrs vs ${analysis.experienceMatch.required} yrs required)`);
  } else {
    strengths.push(`Core engineering fundamentals align with ${jobDetails.seniority || 'the target'} level`);
  }
  if (strong.length >= 4) {
    strengths.push(`Demonstrated proficiency across ${strong.length} job-specific keywords`);
  }

  // Gaps
  const gaps = [];
  if (critical.length > 0) {
    gaps.push(`Missing critical required skills: ${critical.slice(0, 3).join(', ')}`);
  }
  if (analysis.experienceMatch?.gap < 0) {
    gaps.push(`Role prefers ${analysis.experienceMatch.required} years experience (you have ${analysis.experienceMatch.user} years)`);
  }
  if (important.length > 0) {
    gaps.push(`Would benefit from learning preferred toolings: ${important.slice(0, 2).join(', ')}`);
  }
  if (gaps.length === 0) {
    gaps.push('No critical skill gaps identified for this posting.');
  }

  // Recommended preparation tasks
  const recommendedPrep = [];

  // Critical skills (High Priority)
  for (const s of critical.slice(0, 3)) {
    const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === s.toLowerCase());
    recommendedPrep.push({
      type: 'skill',
      name: s,
      estimatedHours: db ? db.hours : 30,
      priority: 'high',
      recommendation: `Deep dive into ${s} architecture and build a hands-on project milestone.`
    });
  }

  // Important skills (Medium Priority)
  for (const s of important.slice(0, 2)) {
    const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === s.toLowerCase());
    recommendedPrep.push({
      type: 'skill',
      name: s,
      estimatedHours: db ? db.hours : 20,
      priority: 'medium',
      recommendation: `Review ${s} fundamentals and common interview concepts.`
    });
  }

  // Always suggest system design / mock interview if Senior role
  if (jobDetails.seniority === 'Senior') {
    recommendedPrep.push({
      type: 'interview',
      name: 'System Design Mock Interview',
      estimatedHours: 10,
      priority: 'high',
      recommendation: 'Complete 2-3 System Design mock interview sessions focusing on scalability and trade-offs.'
    });
  } else {
    recommendedPrep.push({
      type: 'interview',
      name: 'Technical Screening Practice',
      estimatedHours: 6,
      priority: 'medium',
      recommendation: 'Complete mock technical coding sessions on core data structures.'
    });
  }

  // Estimate time to ready
  let timeToReady = '1 week';
  const totalHours = recommendedPrep.reduce((sum, item) => sum + (item.estimatedHours || 10), 0);
  if (totalHours > 70) {
    timeToReady = '3-4 weeks';
  } else if (totalHours > 35) {
    timeToReady = '2-3 weeks';
  } else if (totalHours > 15) {
    timeToReady = '1-2 weeks';
  }

  return {
    summary,
    strengths,
    gaps,
    recommendedPrep,
    timeToReady
  };
};

module.exports = {
  SKILL_DATABASE,
  analyzeJobRequirements,
  compareResumeWithJob,
  generateJobAnalysisSummary
};
