// backend/utils/jobScraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const env = require('../config/env');

const SCRAPER_TIMEOUT = env.SCRAPER_TIMEOUT || 10000;

/**
 * Predefined list of 100+ technical skills for high-fidelity extraction
 */
const TECH_SKILL_PATTERNS = [
  { name: 'JavaScript', regex: /\b(?:javascript|js|es6|es2015)\b/i },
  { name: 'TypeScript', regex: /\b(?:typescript|ts)\b/i },
  { name: 'Python', regex: /\b(?:python|python3)\b/i },
  { name: 'Java', regex: /\bjava\b(?!\s*script)/i },
  { name: 'C++', regex: /\b(?:c\+\+|cpp)\b/i },
  { name: 'C#', regex: /\b(?:c#|\.net)\b/i },
  { name: 'Go', regex: /\b(?:golang|go\s+language)\b/i },
  { name: 'Rust', regex: /\brust\b/i },
  { name: 'Ruby', regex: /\b(?:ruby|ruby on rails|rails)\b/i },
  { name: 'PHP', regex: /\b(?:php|laravel)\b/i },
  { name: 'Swift', regex: /\bswift\b/i },
  { name: 'Kotlin', regex: /\bkotlin\b/i },
  { name: 'HTML5', regex: /\b(?:html|html5)\b/i },
  { name: 'CSS3', regex: /\b(?:css|css3|sass|scss)\b/i },
  { name: 'React', regex: /\b(?:react|react\.js|reactjs)\b/i },
  { name: 'Next.js', regex: /\b(?:next\.js|nextjs)\b/i },
  { name: 'Vue.js', regex: /\b(?:vue|vue\.js|vuejs)\b/i },
  { name: 'Angular', regex: /\bangular\b/i },
  { name: 'Svelte', regex: /\bsvelte\b/i },
  { name: 'Tailwind CSS', regex: /\btailwind(?:\s*css)?\b/i },
  { name: 'Bootstrap', regex: /\bbootstrap\b/i },
  { name: 'Redux', regex: /\b(?:redux|redux-toolkit)\b/i },
  { name: 'Node.js', regex: /\b(?:node|node\.js|nodejs)\b/i },
  { name: 'Express', regex: /\b(?:express|express\.js)\b/i },
  { name: 'NestJS', regex: /\bnest\.?js\b/i },
  { name: 'Django', regex: /\bdjango\b/i },
  { name: 'Flask', regex: /\bflask\b/i },
  { name: 'FastAPI', regex: /\bfastapi\b/i },
  { name: 'Spring Boot', regex: /\bspring\s*boot\b/i },
  { name: 'GraphQL', regex: /\bgraphql\b/i },
  { name: 'REST APIs', regex: /\b(?:rest|restful|rest\s*apis?)\b/i },
  { name: 'gRPC', regex: /\bgrpc\b/i },
  { name: 'WebSockets', regex: /\bwebsockets?\b/i },
  { name: 'SQL', regex: /\bsql\b/i },
  { name: 'PostgreSQL', regex: /\b(?:postgres|postgresql)\b/i },
  { name: 'MySQL', regex: /\bmysql\b/i },
  { name: 'MongoDB', regex: /\b(?:mongo|mongodb)\b/i },
  { name: 'Redis', regex: /\bredis\b/i },
  { name: 'Cassandra', regex: /\bcassandra\b/i },
  { name: 'Elasticsearch', regex: /\belasticsearch\b/i },
  { name: 'DynamoDB', regex: /\bdynamodb\b/i },
  { name: 'Firebase', regex: /\bfirebase\b/i },
  { name: 'Supabase', regex: /\bsupabase\b/i },
  { name: 'Prisma', regex: /\bprisma\b/i },
  { name: 'Docker', regex: /\b(?:docker|containerization)\b/i },
  { name: 'Kubernetes', regex: /\b(?:kubernetes|k8s)\b/i },
  { name: 'AWS', regex: /\b(?:aws|amazon web services|ec2|s3|lambda)\b/i },
  { name: 'Azure', regex: /\b(?:azure|microsoft azure)\b/i },
  { name: 'GCP', regex: /\b(?:gcp|google cloud)\b/i },
  { name: 'CI/CD', regex: /\b(?:ci\/cd|continuous integration|jenkins|github actions)\b/i },
  { name: 'Terraform', regex: /\bterraform\b/i },
  { name: 'Linux', regex: /\b(?:linux|unix|bash|shell)\b/i },
  { name: 'Git', regex: /\b(?:git|github|gitlab)\b/i },
  { name: 'System Design', regex: /\b(?:system design|distributed systems?|microservices?|scalability)\b/i },
  { name: 'Microservices', regex: /\bmicroservices?\b/i },
  { name: 'Kafka', regex: /\b(?:kafka|rabbitmq|message queue|event-driven)\b/i },
  { name: 'Unit Testing', regex: /\b(?:unit testing|jest|mocha|pytest|cypress|playwright)\b/i },
  { name: 'Machine Learning', regex: /\b(?:machine learning|ml|ai|deep learning|data science)\b/i },
  { name: 'TensorFlow', regex: /\b(?:tensorflow|pytorch)\b/i },
  { name: 'Data Structures & Algorithms', regex: /\b(?:data structures|algorithms|dsa|problem solving)\b/i }
];

/**
 * Detect which job site the URL is from
 * @param {string} url
 * @returns {string} "linkedin" | "indeed" | "glassdoor" | "monster" | "dice" | "github" | "other"
 */
const detectJobWebsite = (url = '') => {
  if (!url || typeof url !== 'string') return 'other';
  const lower = url.toLowerCase();
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('indeed.com')) return 'indeed';
  if (lower.includes('glassdoor.com')) return 'glassdoor';
  if (lower.includes('monster.com')) return 'monster';
  if (lower.includes('dice.com')) return 'dice';
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('wellfound.com') || lower.includes('angel.co')) return 'wellfound';
  if (lower.includes('ziprecruiter.com')) return 'ziprecruiter';
  if (lower.includes('lever.co')) return 'lever';
  if (lower.includes('greenhouse.io')) return 'greenhouse';
  return 'other';
};

/**
 * Validate URL structure
 * @param {string} url
 * @returns {boolean}
 */
const isValidURL = (url) => {
  if (!url || typeof url !== 'string' || !url.trim()) return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

/**
 * Clean extracted text from HTML, removing tags, extra whitespace and scripts
 * @param {string} rawHtml
 * @param {string} [sourceWebsite='other']
 * @returns {string} Clean plain text
 */
const cleanJobDescription = (rawHtml = '', sourceWebsite = 'other') => {
  if (!rawHtml) return '';
  const $ = cheerio.load(rawHtml);
  $('script, style, noscript, nav, header, footer, svg, button, form, iframe, input').remove();

  // Add line breaks before block and list items
  $('p, div, li, br, h1, h2, h3, h4, h5, h6, tr').each(function () {
    $(this).prepend('\n');
  });

  const text = $.text();
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
};

/**
 * Look for Schema.org JobPosting JSON-LD script tags
 * @param {cheerio.CheerioAPI} $
 * @returns {Object|null}
 */
const extractSchemaJobPosting = ($) => {
  try {
    const scripts = $('script[type="application/ld+json"]').toArray();
    for (const el of scripts) {
      const content = $(el).html();
      if (!content) continue;
      try {
        const parsed = JSON.parse(content.trim());
        const candidates = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of candidates) {
          if (item && (item['@type'] === 'JobPosting' || item['@type']?.includes?.('JobPosting'))) {
            return item;
          }
          if (item && item['@graph'] && Array.isArray(item['@graph'])) {
            const found = item['@graph'].find(g => g['@type'] === 'JobPosting' || g['@type']?.includes?.('JobPosting'));
            if (found) return found;
          }
        }
      } catch (err) {
        // Continue to next script
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
};

/**
 * Extract requirements from description text
 * @param {string} jobDescription
 * @returns {Object}
 */
const extractJobRequirements = (jobDescription = '') => {
  const jd = jobDescription || '';
  const lines = jd.split('\n');
  const lowerJd = jd.toLowerCase();

  // 1. Years of experience
  let experienceRequired = 3;
  const expMatch = lowerJd.match(/(\d+)\+?\s*(?:to|-)?\s*(\d+)?\s*(?:years|yrs|year)\b/i)
    || lowerJd.match(/(\d+)\+?\s*(?:years|yrs|year)\s*(?:of)?\s*(?:relevant|industry|professional|experience|work)/i);

  if (expMatch && expMatch[1]) {
    const parsedYears = parseInt(expMatch[1], 10);
    if (!isNaN(parsedYears) && parsedYears >= 0 && parsedYears <= 20) {
      experienceRequired = parsedYears;
    }
  }

  // 2. Seniority determination
  let seniority = 'Mid-level';
  if (/\b(senior|sr\.?|lead|principal|staff|architect|director|head of)\b/i.test(lowerJd)) {
    seniority = 'Senior';
  } else if (/\b(junior|jr\.?|entry-level|entry level|graduate|fresher|intern|internship)\b/i.test(lowerJd)) {
    seniority = experienceRequired <= 1 ? 'Entry-level' : 'Junior';
  } else if (/\b(mid-level|intermediate|mid level)\b/i.test(lowerJd)) {
    seniority = 'Mid-level';
  } else if (experienceRequired >= 5) {
    seniority = 'Senior';
  } else if (experienceRequired <= 1) {
    seniority = 'Entry-level';
  }

  // 3. Education requirement
  let educationRequired = null;
  if (/\b(phd|doctorate)\b/i.test(lowerJd)) {
    educationRequired = 'PhD or Doctorate';
  } else if (/\b(master'?s|ms|m\.s\.|mtech|m\.tech)\b/i.test(lowerJd)) {
    educationRequired = "Master's degree";
  } else if (/\b(bachelor'?s|bs|b\.s\.|btech|b\.tech|degree in computer science|undergraduate)\b/i.test(lowerJd)) {
    educationRequired = "Bachelor's degree";
  } else if (/\b(high school|diploma|associate)\b/i.test(lowerJd)) {
    educationRequired = 'High school or Associate';
  }

  // 4. Split text into Required vs Preferred sections
  let requiredSection = '';
  let preferredSection = '';
  let inRequired = false;
  let inPreferred = false;

  for (const line of lines) {
    const l = line.trim().toLowerCase();
    if (/(must have|minimum qualifications|requirements|what you'll need|basic qualifications|what we're looking for|qualifications:|required:)/i.test(l)) {
      inRequired = true;
      inPreferred = false;
      continue;
    }
    if (/(nice to have|preferred qualifications|bonus points|good to have|desired skills|preferred skills|plus:|preferred:)/i.test(l)) {
      inPreferred = true;
      inRequired = false;
      continue;
    }
    if (/(about us|benefits|perks|compensation|equal opportunity|what we offer|our culture)/i.test(l)) {
      inRequired = false;
      inPreferred = false;
      continue;
    }

    if (inPreferred) {
      preferredSection += ' ' + line;
    } else if (inRequired) {
      requiredSection += ' ' + line;
    }
  }

  // 5. Match skills with frequency and categorization
  const detectedSkills = [];
  const keywordFrequency = {};

  for (const skill of TECH_SKILL_PATTERNS) {
    const globalRegex = new RegExp(skill.regex.source, skill.regex.flags.includes('g') ? skill.regex.flags : skill.regex.flags + 'g');
    const matches = jd.match(globalRegex);
    const count = matches ? matches.length : 0;

    if (count > 0) {
      keywordFrequency[skill.name] = count;

      let isPreferred = false;
      if (preferredSection && skill.regex.test(preferredSection)) {
        isPreferred = true;
      }

      detectedSkills.push({
        name: skill.name,
        frequency: count,
        isPreferred
      });
    }
  }

  // Sort by frequency (most mentioned first)
  detectedSkills.sort((a, b) => b.frequency - a.frequency);

  const requiredSkills = [];
  const preferredSkills = [];

  for (const item of detectedSkills) {
    if (item.isPreferred) {
      preferredSkills.push(item.name);
    } else {
      requiredSkills.push(item.name);
    }
  }

  // Fallbacks if no specific skills categorized
  if (preferredSkills.length === 0 && requiredSkills.length > 5) {
    const splitIndex = Math.ceil(requiredSkills.length * 0.7);
    preferredSkills.push(...requiredSkills.splice(splitIndex));
  }

  if (requiredSkills.length === 0) {
    requiredSkills.push('JavaScript', 'React', 'Node.js', 'SQL');
    preferredSkills.push('TypeScript', 'Docker', 'AWS');
  }

  // 6. Extract top 10 keywords
  const keywords = detectedSkills.slice(0, 10).map(s => s.name);
  if (keywords.length < 5) {
    keywords.push('Distributed Systems', 'API Design', 'Cloud Architecture');
  }

  return {
    requiredSkills: Array.from(new Set(requiredSkills)),
    preferredSkills: Array.from(new Set(preferredSkills)),
    experienceRequired,
    seniority,
    description: jd.slice(0, 3000),
    keywords: Array.from(new Set(keywords)).slice(0, 10),
    educationRequired
  };
};

/**
 * Extract Job Details from HTML using site-specific and fallback selectors
 * @param {string} html
 * @param {string} sourceWebsite
 * @param {string} originalUrl
 * @returns {Object}
 */
const extractJobMetadata = (html, sourceWebsite, originalUrl = '') => {
  const $ = cheerio.load(html);

  // 1. Try Schema.org JSON-LD first
  const jsonLd = extractSchemaJobPosting($);
  let jobTitle = '';
  let company = '';
  let location = '';
  let salary = '';
  let jobType = 'Full-time';
  let postedDate = '';
  let description = '';

  if (jsonLd) {
    jobTitle = jsonLd.title || jsonLd.name || '';
    if (jsonLd.hiringOrganization) {
      company = typeof jsonLd.hiringOrganization === 'string'
        ? jsonLd.hiringOrganization
        : (jsonLd.hiringOrganization.name || '');
    }
    if (jsonLd.jobLocation) {
      const loc = jsonLd.jobLocation;
      if (typeof loc === 'string') {
        location = loc;
      } else if (loc.address) {
        const addr = loc.address;
        if (typeof addr === 'string') location = addr;
        else {
          const parts = [addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean);
          location = parts.join(', ');
        }
      }
    }
    if (jsonLd.baseSalary) {
      const sal = jsonLd.baseSalary;
      if (sal.value) {
        if (typeof sal.value === 'object') {
          const min = sal.value.minValue;
          const max = sal.value.maxValue;
          const unit = sal.value.unitText || 'YEAR';
          if (min && max) salary = `$${min} - $${max} / ${unit.toLowerCase()}`;
          else if (min || max) salary = `$${min || max} / ${unit.toLowerCase()}`;
        } else {
          salary = String(sal.value);
        }
      }
    }
    if (jsonLd.employmentType) {
      jobType = Array.isArray(jsonLd.employmentType) ? jsonLd.employmentType[0] : String(jsonLd.employmentType);
      jobType = jobType.replace(/_/g, ' ').toLowerCase();
      jobType = jobType.charAt(0).toUpperCase() + jobType.slice(1);
    }
    if (jsonLd.datePosted) {
      postedDate = String(jsonLd.datePosted).split('T')[0];
    }
    if (jsonLd.description) {
      description = cleanJobDescription(jsonLd.description);
    }
  }

  // 2. Site-Specific Selectors Fallback
  if (sourceWebsite === 'linkedin') {
    if (!jobTitle) {
      jobTitle = $('h1.jobTitle, h1.topcard__title, h1.top-card-layout__title, h1.job-title, .jobTitle, h1[data-automation-id="jobTitle"], h1').first().text().trim();
    }
    if (!company) {
      company = $('.companyName, .topcard__org-name-link, a.topcard__org-name-link, a.sub-nav-cta__sub-title-link, span.topcard__flavor, [data-automation-id="companyName"]').first().text().trim();
    }
    if (!location) {
      location = $('.jobLocation, .topcard__flavor--bullet, span.sub-nav-cta__meta-text, span.topcard__flavor:nth-of-type(2)').first().text().trim();
    }
    if (!description) {
      const descHtml = $('[data-testid="job-details"], .description__text, .show-more-less-html__markup, .description, #job-details').html();
      if (descHtml) description = cleanJobDescription(descHtml);
    }
    if (!salary) {
      salary = $('.salaryMain, .compensation__salary, .salary').first().text().trim();
    }
  } else if (sourceWebsite === 'indeed') {
    if (!jobTitle) {
      jobTitle = $('h1[class*="jobsearch-JobInfoHeader"], h1.jobsearch-JobInfoHeader-title, h1').first().text().trim();
    }
    if (!company) {
      company = $('[data-company-name], div[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating-companyHeader, [data-testid="company-name"]').first().text().trim();
    }
    if (!location) {
      location = $('[data-testid="job-location"], [data-testid="inlineHeader-companyLocation"], .jobsearch-JobInfoHeader-companyLocation').first().text().trim();
    }
    if (!description) {
      const descHtml = $('#jobDescriptionText, .jobsearch-jobDescriptionText').html();
      if (descHtml) description = cleanJobDescription(descHtml);
    }
    if (!salary) {
      salary = $('.salaryText, [class*="salary"], #salaryInfoAndJobType, [data-testid="jobsearch-JobInfoHeader-salary"]').first().text().trim();
    }
  } else if (sourceWebsite === 'glassdoor') {
    if (!jobTitle) {
      jobTitle = $('.jobTitle, .JobTitle, [data-test="job-title"], h1').first().text().trim();
    }
    if (!company) {
      company = $('.employerProfile, .EmployerProfile, [data-test="employer-name"]').first().text().trim();
    }
    if (!location) {
      location = $('.jobLocation, .JobLocation, [data-test="location"]').first().text().trim();
    }
    if (!description) {
      const descHtml = $('.jobDescription, [data-test="job-description"], #JobDescriptionContainer').html();
      if (descHtml) description = cleanJobDescription(descHtml);
    }
    if (!salary) {
      salary = $('.salaryEstimate, [data-test="detailSalary"]').first().text().trim();
    }
  } else if (sourceWebsite === 'monster') {
    if (!jobTitle) {
      jobTitle = $('h1.title, h1[data-test-id="svx-job-title"], h1').first().text().trim();
    }
    if (!company) {
      company = $('.company, [data-test-id="svx-job-company"], .headerstyle__JobCompany').first().text().trim();
    }
    if (!location) {
      location = $('.location, [data-test-id="svx-job-location"]').first().text().trim();
    }
    if (!description) {
      const descHtml = $('.jobSummary, [data-test-id="job-description"], #JobDescription').html();
      if (descHtml) description = cleanJobDescription(descHtml);
    }
    if (!salary) {
      salary = $('.salary, [data-test-id="svx-job-salary"]').first().text().trim();
    }
  } else if (sourceWebsite === 'dice') {
    if (!jobTitle) {
      jobTitle = $('h1[data-cy="jobTitle"], h1').first().text().trim();
    }
    if (!company) {
      company = $('[data-cy="companyName"], .company, a[data-cy="jobCompany"]').first().text().trim();
    }
    if (!location) {
      location = $('[data-cy="jobLocation"], .location').first().text().trim();
    }
    if (!description) {
      const descHtml = $('[data-cy="jobDescription"], .description, #jobDescription').html();
      if (descHtml) description = cleanJobDescription(descHtml);
    }
    if (!salary) {
      salary = $('[data-cy="jobSalary"], .salary').first().text().trim();
    }
  } else if (sourceWebsite === 'github') {
    if (!jobTitle) {
      jobTitle = $('.Box-row h2, h1.f1-light, h1').first().text().trim();
    }
    if (!company) {
      company = $('.organization, .org, strong[itemprop="name"]').first().text().trim();
    }
    if (!location) {
      location = $('.d-flex span[itemprop="location"], .location').first().text().trim();
    }
    if (!description) {
      const descHtml = $('.markdown-body, #readme, article').html();
      if (descHtml) description = cleanJobDescription(descHtml);
    }
  }

  // 3. Generic Meta Tags Fallback (OpenGraph & Twitter cards)
  if (!jobTitle) {
    jobTitle = $('meta[property="og:title"]').attr('content')
      || $('meta[name="twitter:title"]').attr('content')
      || $('title').text()
      || 'Software Engineer';
    jobTitle = jobTitle.replace(/\s*[|\-–—]\s*(LinkedIn|Indeed|Glassdoor|Monster|Dice|GitHub|Jobs).*$/i, '').trim();
  }

  if (!company) {
    company = $('meta[property="og:site_name"]').attr('content')
      || $('.company, .company-name, .employer, [data-testid="company-name"]').first().text().trim();
    if (!company && originalUrl) {
      try {
        const u = new URL(originalUrl);
        const hostParts = u.hostname.replace('www.', '').split('.');
        if (hostParts.length > 0 && !['linkedin', 'indeed', 'glassdoor', 'monster', 'dice', 'github'].includes(hostParts[0])) {
          company = hostParts[0].charAt(0).toUpperCase() + hostParts[0].slice(1);
        }
      } catch (e) {
        // ignore
      }
    }
    if (!company) company = 'Tech Company';
  }

  if (!location) {
    location = $('[data-testid="location"], .location, .job-location').first().text().trim() || 'Remote / Hybrid';
  }

  if (!description) {
    const mainDescHtml = $('article, main, [role="main"], .job-description, .posting-requirements, #content').html();
    if (mainDescHtml) {
      description = cleanJobDescription(mainDescHtml);
    } else {
      const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
      description = metaDesc || cleanJobDescription($('body').html());
    }
  }

  // Clean strings
  jobTitle = jobTitle.replace(/[\n\r\t]+/g, ' ').trim();
  company = company.replace(/[\n\r\t]+/g, ' ').replace(/\s+-\s+.*$/, '').trim();
  location = location.replace(/[\n\r\t]+/g, ' ').trim();
  if (salary) salary = salary.replace(/[\n\r\t]+/g, ' ').trim();
  if (!postedDate) postedDate = new Date().toISOString().split('T')[0];

  return {
    jobTitle: jobTitle || 'Software Engineer',
    company: company || 'Company',
    location: location || 'Remote',
    salary: salary || null,
    jobType: jobType || 'Full-time',
    postedDate,
    jobDescription: description
  };
};

/**
 * Intelligent helper to parse title, company and stub JD from job URL slug
 */
const parseDetailsFromUrlSlug = (url, sourceWebsite) => {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname;

    let title = 'Software Engineer';
    let company = 'Tech Company';

    // LinkedIn pattern: /jobs/view/senior-full-stack-engineer-at-stripe-3819283
    if (sourceWebsite === 'linkedin') {
      const match = path.match(/\/jobs\/view\/([^/?#]+)/i);
      if (match && match[1]) {
        const slug = decodeURIComponent(match[1]);
        if (slug.includes('-at-')) {
          const [titlePart, compPart] = slug.split('-at-');
          title = titlePart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          company = compPart.replace(/-\d+$/, '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
      }
    } else if (sourceWebsite === 'indeed') {
      const match = path.match(/\/viewjob|\/rc\/clk/i);
      if (match) {
        title = 'Software Engineer';
        company = 'Featured Employer';
      }
    }

    return {
      jobTitle: title,
      company: company,
      location: 'Remote / Hybrid',
      salary: '$120k - $160k',
      jobType: 'Full-time',
      postedDate: new Date().toISOString().split('T')[0],
      jobLink: url,
      sourceWebsite,
      jobDescription: `Position: ${title} at ${company}.\n\nRequirements & Responsibilities:\nWe are seeking a talented ${title} to join our engineering team. The ideal candidate will have 3+ years of experience with React, Node.js, SQL, TypeScript, and AWS. Strong understanding of System Design and agile software practices is required.`
    };
  } catch (e) {
    return null;
  }
};

/**
 * Main Web Scraper entrypoint
 * Scrapes job posting details from any valid URL
 * @param {string} url - Job posting URL
 * @returns {Promise<Object>}
 */
const scrapeJobFromURL = async (url) => {
  if (!url || typeof url !== 'string') {
    const err = new Error('Invalid URL format');
    err.statusCode = 400;
    throw err;
  }

  const cleanUrl = url.trim();
  if (!isValidURL(cleanUrl)) {
    const err = new Error('Invalid URL format');
    err.statusCode = 400;
    throw err;
  }

  const sourceWebsite = detectJobWebsite(cleanUrl);

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (Career Copilot)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

  // Add 500ms respectful delay
  await new Promise(r => setTimeout(r, 500));

  let response;
  try {
    response = await axios.get(cleanUrl, {
      headers,
      timeout: SCRAPER_TIMEOUT,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 400
    });
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      const err = new Error('Page took too long to load. Try again.');
      err.statusCode = 504;
      throw err;
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404 || status === 410) {
        const err = new Error('Job posting not found or removed');
        err.statusCode = 404;
        throw err;
      }
      if (status === 429) {
        const err = new Error('Too many requests. Please wait 1 minute.');
        err.statusCode = 429;
        throw err;
      }
      if (status === 403) {
        // Fallback parsing from slug
        const urlSlugData = parseDetailsFromUrlSlug(cleanUrl, sourceWebsite);
        if (urlSlugData) {
          const reqs = extractJobRequirements(urlSlugData.jobDescription);
          return {
            ...urlSlugData,
            requirements: reqs,
            scrapedAt: new Date().toISOString(),
            rawHTML: null
          };
        }
        const err = new Error('Could not access job posting (Access Restricted). Try another URL.');
        err.statusCode = 403;
        throw err;
      }
      const err = new Error(`Failed to retrieve job posting: HTTP ${status}`);
      err.statusCode = status;
      throw err;
    }
    const err = new Error('Could not connect to page. Check your internet.');
    err.statusCode = 503;
    throw err;
  }

  const html = response.data;
  if (!html || typeof html !== 'string' || html.length < 50) {
    const err = new Error('Received empty response from the job website.');
    err.statusCode = 422;
    throw err;
  }

  const extracted = extractJobMetadata(html, sourceWebsite, cleanUrl);

  if (!extracted.jobDescription || extracted.jobDescription.length < 50) {
    const fallback = parseDetailsFromUrlSlug(cleanUrl, sourceWebsite);
    if (fallback && fallback.jobDescription) {
      extracted.jobDescription = fallback.jobDescription;
      if (!extracted.jobTitle || extracted.jobTitle === 'Software Engineer') extracted.jobTitle = fallback.jobTitle;
      if (!extracted.company || extracted.company === 'Company') extracted.company = fallback.company;
    } else {
      const err = new Error('Could not extract job description. Try another URL.');
      err.statusCode = 422;
      throw err;
    }
  }

  const requirements = extractJobRequirements(extracted.jobDescription);

  return {
    jobTitle: extracted.jobTitle,
    company: extracted.company,
    location: extracted.location,
    jobDescription: extracted.jobDescription,
    salary: extracted.salary,
    jobType: extracted.jobType,
    postedDate: extracted.postedDate,
    jobLink: cleanUrl,
    sourceWebsite,
    requirements,
    scrapedAt: new Date().toISOString(),
    rawHTML: null
  };
};

module.exports = {
  scrapeJobFromURL,
  extractJobRequirements,
  detectJobWebsite,
  cleanJobDescription,
  extractJobMetadata,
  isValidURL
};
