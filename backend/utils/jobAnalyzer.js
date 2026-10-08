// backend/utils/jobAnalyzer.js
const { extractJobRequirements } = require('./jobScraper');

/**
 * Predefined database of 100+ technical skills with categories, aliases, and estimated learning hours
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
 * Identify critical skills from job requirements
 * @param {Object} jobRequirements
 * @returns {Array<string>} Array of critical skills sorted by priority
 */
const identifyCriticalSkills = (jobRequirements = {}) => {
  const req = jobRequirements.requiredSkills || [];
  const pref = jobRequirements.preferredSkills || [];
  const allReq = [...req];

  // System Design, Kubernetes, AWS, Data Structures are recognized core interview topics
  const highPriorityKeywords = ['System Design', 'Kubernetes', 'AWS', 'Docker', 'SQL', 'Data Structures & Algorithms', 'Microservices'];

  allReq.sort((a, b) => {
    const aIsHigh = highPriorityKeywords.some(kw => a.toLowerCase().includes(kw.toLowerCase()));
    const bIsHigh = highPriorityKeywords.some(kw => b.toLowerCase().includes(kw.toLowerCase()));
    if (aIsHigh && !bIsHigh) return -1;
    if (!aIsHigh && bIsHigh) return 1;
    return 0;
  });

  return Array.from(new Set(allReq));
};

/**
 * Estimate preparation time in hours, weeks, and days
 * @param {Array<string>} missingSkills
 * @param {number} [hoursPerWeek=15]
 * @returns {{ totalHours: number, weeks: number, days: number }}
 */
const estimatePreparationTime = (missingSkills = [], hoursPerWeek = 15) => {
  let totalHours = 0;
  for (const skill of missingSkills) {
    const dbMatch = SKILL_DATABASE.find(s => s.name.toLowerCase() === skill.toLowerCase());
    totalHours += dbMatch ? dbMatch.hours : 30;
  }

  // Minimum baseline
  if (missingSkills.length === 0) totalHours = 10;

  const weeks = Math.max(1, Math.round(totalHours / hoursPerWeek));
  const days = Math.max(5, Math.round(totalHours / (hoursPerWeek / 7)));

  return {
    totalHours,
    weeks,
    days
  };
};

/**
 * Calculate match score with weighted algorithm:
 * - Required skills match: 60% weight
 * - Experience match: 25% weight
 * - Seniority match: 15% weight
 * @param {Array<string|Object>} userSkills
 * @param {Object} jobRequirements
 * @param {number} [userYears=2]
 * @param {string} [userSeniority='Mid-level']
 * @returns {number} 0-100
 */
const calculateMatchScore = (userSkills = [], jobRequirements = {}, userYears = 2, userSeniority = 'Mid-level') => {
  const reqSkills = jobRequirements.requiredSkills || [];
  const reqExp = jobRequirements.experienceRequired || 3;
  const jobSeniority = jobRequirements.seniority || 'Mid-level';

  // Normalize user skills
  const userSkillSet = new Set();
  for (const s of userSkills) {
    if (typeof s === 'string') userSkillSet.add(s.toLowerCase().trim());
    else if (s && typeof s === 'object') {
      const name = (s.skillName || s.name || s.skill || '').toLowerCase().trim();
      if (name) userSkillSet.add(name);
    }
  }

  // 1. Required skills score (60%)
  let matchedRequired = 0;
  for (const r of reqSkills) {
    const lower = r.toLowerCase();
    if (userSkillSet.has(lower)) {
      matchedRequired++;
      continue;
    }
    const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === lower);
    if (db) {
      for (const alias of db.aliases) {
        let foundAlias = false;
        for (const u of userSkillSet) {
          if (alias.test(u)) {
            matchedRequired++;
            foundAlias = true;
            break;
          }
        }
        if (foundAlias) break;
      }
    }
  }

  const reqScore = reqSkills.length > 0 ? (matchedRequired / reqSkills.length) * 60 : 45;

  // 2. Experience match score (25%)
  let expScore = 0;
  if (userYears >= reqExp) {
    expScore = 25;
  } else if (userYears >= reqExp - 1) {
    expScore = 18;
  } else if (userYears >= reqExp - 2) {
    expScore = 10;
  } else {
    expScore = 5;
  }

  // 3. Seniority match score (15%)
  let seniorityScore = 10;
  const uNorm = userSeniority.toLowerCase();
  const jNorm = jobSeniority.toLowerCase();
  if (uNorm === jNorm || (uNorm.includes('mid') && jNorm.includes('mid'))) {
    seniorityScore = 15;
  } else if (
    (uNorm.includes('mid') && jNorm.includes('senior')) ||
    (uNorm.includes('senior') && jNorm.includes('mid')) ||
    (uNorm.includes('entry') && jNorm.includes('junior'))
  ) {
    seniorityScore = 10;
  } else {
    seniorityScore = 5;
  }

  const total = Math.min(100, Math.max(10, Math.round(reqScore + expScore + seniorityScore)));
  return total;
};

/**
 * Backward-compatible wrapper for analyzeJobRequirements
 */
const analyzeJobRequirements = (jobDescription = '') => {
  return extractJobRequirements(jobDescription);
};

/**
 * Compare resume and skills with job
 */
const compareResumeWithJob = (userSkills = [], jobRequirements = {}, resumeText = '', userExperienceYears = null) => {
  const reqSkills = jobRequirements.requiredSkills || [];
  const prefSkills = jobRequirements.preferredSkills || [];
  const requiredExp = jobRequirements.experienceRequired || 3;

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

  let candidateYears = userExperienceYears;
  if (candidateYears === null || candidateYears === undefined) {
    if (resumeText) {
      const expMatch = resumeText.match(/(\d+)\+?\s*(?:years|yrs)\s*(?:of)?\s*(?:experience|exp)/i);
      if (expMatch && expMatch[1]) {
        candidateYears = parseInt(expMatch[1], 10);
      }
    }
    if (candidateYears === null || candidateYears === undefined) {
      candidateYears = 2;
    }
  }

  const strongMatches = [];
  const partialMatches = [];
  const missingSkills = [];
  const missingCritical = [];
  const missingImportant = [];

  for (const skillName of reqSkills) {
    const lower = skillName.toLowerCase();
    let hasSkill = userSkillSet.has(lower);

    if (!hasSkill) {
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
      } else {
        partialMatches.push(skillName);
      }
    } else {
      missingSkills.push(skillName);
      missingCritical.push(skillName);
    }
  }

  for (const skillName of prefSkills) {
    const lower = skillName.toLowerCase();
    let hasSkill = userSkillSet.has(lower);

    if (hasSkill) {
      strongMatches.push(skillName);
    } else {
      missingSkills.push(skillName);
      missingImportant.push(skillName);
    }
  }

  const scorePercent = calculateMatchScore(
    Array.from(userSkillSet),
    jobRequirements,
    candidateYears,
    candidateYears >= 5 ? 'Senior' : candidateYears >= 2 ? 'Mid-level' : 'Junior'
  );

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

  const expGap = candidateYears - requiredExp;

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
 * Generate human-readable analysis summary
 */
const generateJobAnalysisSummary = (analysis, jobDetails = {}) => {
  const company = jobDetails.company || 'the company';
  const title = jobDetails.jobTitle || 'this position';
  const score = analysis.matchScore;
  const strong = analysis.skillMatches?.strong || [];
  const critical = analysis.missingCriticalSkills || [];
  const important = analysis.missingImportantSkills || [];

  let summary = '';
  if (score >= 85) {
    summary = `Outstanding fit! Your skillset strongly matches the requirements for ${title} at ${company}.`;
  } else if (score >= 67) {
    summary = `Strong match for ${title} at ${company}. You possess foundational requirements with few gaps.`;
  } else if (score >= 40) {
    summary = `Moderate match. You have relevant experience for ${title}, but key technical requirements require preparation.`;
  } else {
    summary = `This role requires technologies outside your primary stack. A focused preparation plan is recommended.`;
  }

  const strengths = [];
  if (strong.length > 0) strengths.push(`Proven skills in ${strong.slice(0, 3).join(', ')}`);
  if (analysis.experienceMatch?.gap >= 0) {
    strengths.push(`Experience bar satisfied (${analysis.experienceMatch.user} yrs vs ${analysis.experienceMatch.required} yrs required)`);
  }

  const gaps = [];
  if (critical.length > 0) gaps.push(`Missing critical required skills: ${critical.slice(0, 3).join(', ')}`);
  if (analysis.experienceMatch?.gap < 0) {
    gaps.push(`Role requires ${analysis.experienceMatch.required} years experience (you have ${analysis.experienceMatch.user} years)`);
  }

  const recommendedPrep = [];
  for (const s of critical.slice(0, 3)) {
    const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === s.toLowerCase());
    recommendedPrep.push({
      type: 'skill',
      skill: s,
      name: s,
      estimatedHours: db ? db.hours : 30,
      priority: 'HIGH',
      recommendation: `Deep dive into ${s} architecture and build a hands-on project milestone.`
    });
  }

  for (const s of important.slice(0, 2)) {
    const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === s.toLowerCase());
    recommendedPrep.push({
      type: 'skill',
      skill: s,
      name: s,
      estimatedHours: db ? db.hours : 20,
      priority: 'MEDIUM',
      recommendation: `Review ${s} fundamentals and common interview concepts.`
    });
  }

  let timeToReady = '2-3 weeks';
  const totalHours = recommendedPrep.reduce((sum, item) => sum + (item.estimatedHours || 10), 0);
  if (totalHours > 70) timeToReady = '3-4 weeks';
  else if (totalHours > 35) timeToReady = '2-3 weeks';
  else timeToReady = '1-2 weeks';

  return {
    summary,
    strengths,
    gaps,
    recommendedPrep,
    timeToReady
  };
};

/**
 * Main Full Job Analysis & Resume Comparison function (Part 2 spec)
 * @param {string|Object} userIdentifier - userId or user object
 * @param {Object} jobData - output from jobScraper.scrapeJobFromURL
 * @returns {Promise<Object>} Full Analysis object
 */
const analyzeJobAndCompareWithResume = async (userIdentifier, jobData = {}) => {
  let userSkills = [];
  let resumeText = '';
  let candidateYears = 2;
  let userSeniority = 'Mid-level';

  // If userIdentifier is a UUID string, query database
  if (typeof userIdentifier === 'string') {
    try {
      const { User, Skill, Resume } = require('../models');
      const [dbSkills, dbResume, dbUser] = await Promise.all([
        Skill.findAll({ where: { userId: userIdentifier } }),
        Resume.findOne({ where: { userId: userIdentifier }, order: [['createdAt', 'DESC']] }),
        User.findByPk(userIdentifier)
      ]);

      if (dbSkills) {
        userSkills = dbSkills.map(s => ({
          skillName: s.skillName,
          userLevel: s.userLevel || 75
        }));
      }

      if (dbResume) {
        resumeText = dbResume.extractedText || '';
        if (Array.isArray(dbResume.matchedKeywords)) {
          for (const kw of dbResume.matchedKeywords) {
            userSkills.push({ skillName: kw, userLevel: 75 });
          }
        }
      }

      if (dbUser && dbUser.experienceLevel) {
        const exp = dbUser.experienceLevel.toLowerCase();
        if (exp.includes('senior') || exp.includes('5+')) {
          candidateYears = 5;
          userSeniority = 'Senior';
        } else if (exp.includes('mid') || exp.includes('3-5')) {
          candidateYears = 3;
          userSeniority = 'Mid-level';
        } else if (exp.includes('junior') || exp.includes('entry')) {
          candidateYears = 1;
          userSeniority = 'Junior';
        }
      }
    } catch (dbErr) {
      // Fallback defaults if DB lookup fails
    }
  } else if (userIdentifier && typeof userIdentifier === 'object') {
    userSkills = userIdentifier.skills || [];
    resumeText = userIdentifier.resumeText || '';
    candidateYears = userIdentifier.experienceYears || 2;
    userSeniority = userIdentifier.seniority || (candidateYears >= 5 ? 'Senior' : candidateYears >= 2 ? 'Mid-level' : 'Junior');
  }

  // Ensure requirements are extracted
  const requirements = jobData.requirements || extractJobRequirements(jobData.jobDescription || '');

  // Compare Resume vs Job
  const comparison = compareResumeWithJob(userSkills, requirements, resumeText, candidateYears);

  // Match score
  const matchScore = comparison.matchScore;
  const reqExp = requirements.experienceRequired || 3;
  const expGap = candidateYears - reqExp;

  // Experience Match Object
  const experienceMatch = {
    required: reqExp,
    userHas: candidateYears,
    gap: expGap,
    message: expGap >= 0
      ? `You meet or exceed the ${reqExp} years requirement!`
      : `You're ${Math.abs(expGap)} year${Math.abs(expGap) > 1 ? 's' : ''} short, but close`
  };

  // Seniority Match Object
  const jobLevel = requirements.seniority || 'Mid-level';
  const seniorityMatch = {
    jobLevel,
    userLevel: userSeniority,
    message: userSeniority.toLowerCase() === jobLevel.toLowerCase()
      ? 'Your current career stage matches the role target'
      : userSeniority === 'Senior'
        ? 'You have more seniority than requested for this role'
        : 'You might need to grow into this role during preparation'
  };

  // Missing Skills categorization
  const missingCritical = [];
  const missingImportant = [];

  for (const s of comparison.skillMatches.missing) {
    if (requirements.requiredSkills.includes(s)) {
      const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === s.toLowerCase());
      missingCritical.push({
        skill: s,
        priority: 'HIGH',
        estimatedHours: db ? db.hours : 35
      });
    } else {
      const db = SKILL_DATABASE.find(item => item.name.toLowerCase() === s.toLowerCase());
      missingImportant.push({
        skill: s,
        priority: 'MEDIUM',
        estimatedHours: db ? db.hours : 20
      });
    }
  }

  // Prep time estimation
  const prepTime = estimatePreparationTime(comparison.skillMatches.missing, 15);
  const prepWeeks = `${Math.max(1, prepTime.weeks - 1)}-${prepTime.weeks + 1} weeks`;

  // Recommended order of learning
  const recommendedOrder = [
    ...missingCritical.map(m => `${m.skill} (most critical for technical round)`),
    ...missingImportant.map(m => `${m.skill} (valuable for bonus questions)`)
  ];
  if (recommendedOrder.length === 0) {
    recommendedOrder.push('Review System Design and technical mock interviews');
  }

  // Red flags
  const redFlags = [];
  if (candidateYears < reqExp) {
    redFlags.push(`Job requires ${reqExp}+ years, you currently have ${candidateYears}`);
  }
  if (jobLevel === 'Senior' && userSeniority !== 'Senior') {
    redFlags.push(`Seniority is Senior, while your profile is ${userSeniority}`);
  }
  if (jobData.location && jobData.location.toLowerCase().includes('on-site') && !jobData.location.toLowerCase().includes('remote')) {
    redFlags.push(`Position requires on-site presence in ${jobData.location}`);
  }
  if (requirements.educationRequired && requirements.educationRequired.includes('Master') && candidateYears < 3) {
    redFlags.push(`Advanced degree preferred: ${requirements.educationRequired}`);
  }

  // Recommendations
  const shouldApply = matchScore >= 50;
  const confidence = `${matchScore}% - ${comparison.matchLevel}`;
  const nextSteps = [];

  if (missingCritical.length > 0) {
    nextSteps.push(`Study ${missingCritical[0].skill} (${missingCritical[0].estimatedHours} hours)`);
  }
  nextSteps.push('Take 3 mock technical interviews');
  if (missingCritical.length > 1) {
    nextSteps.push(`Learn ${missingCritical[1].skill} fundamentals`);
  }
  nextSteps.push('Apply with focus on your proven strengths and system impact');

  const matchBreakdown = {
    requiredSkillsHave: comparison.skillMatches.strong.filter(s => requirements.requiredSkills.includes(s)).length,
    requiredSkillsMissing: requirements.requiredSkills.filter(s => comparison.skillMatches.missing.includes(s)).length,
    preferredSkillsHave: comparison.skillMatches.strong.filter(s => requirements.preferredSkills.includes(s)).length,
    preferredSkillsMissing: requirements.preferredSkills.filter(s => comparison.skillMatches.missing.includes(s)).length
  };

  const preparation = {
    criticalSkills: missingCritical,
    importantSkills: missingImportant,
    estimatedPrepTime: prepWeeks,
    recommendedOrder
  };

  const recommendation = {
    shouldApply,
    confidence,
    nextSteps
  };

  return {
    jobId: jobData.jobId || jobData.id || null,
    job: {
      title: jobData.jobTitle || 'Software Engineer',
      company: jobData.company || 'Company',
      location: jobData.location || 'Remote',
      salary: jobData.salary || 'Competitive',
      source: jobData.sourceWebsite || 'other',
      url: jobData.jobLink || jobData.url || '',
      description: jobData.jobDescription || '',
      requirements: {
        requiredSkills: requirements.requiredSkills,
        preferredSkills: requirements.preferredSkills,
        experienceRequired: reqExp,
        seniority: jobLevel
      }
    },
    matchAnalysis: {
      matchScore,
      matchPercentage: `${matchScore}%`,
      matchLevel: comparison.matchLevel,
      skillMatches: comparison.skillMatches,
      experienceMatch,
      seniorityMatch
    },
    matchBreakdown,
    preparation,
    redFlags,
    recommendation,
    timeToReady: prepWeeks
  };
};

module.exports = {
  SKILL_DATABASE,
  analyzeJobRequirements,
  compareResumeWithJob,
  generateJobAnalysisSummary,
  calculateMatchScore,
  identifyCriticalSkills,
  estimatePreparationTime,
  analyzeJobAndCompareWithResume
};
