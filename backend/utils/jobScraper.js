// backend/utils/jobScraper.js
const axios = require('axios');
const cheerio = require('cheerio');
const env = require('../config/env');

const SCRAPER_TIMEOUT = env.SCRAPER_TIMEOUT || 10000;

/**
 * Detect which job site the URL is from
 * @param {string} url
 * @returns {string} 'linkedin' | 'indeed' | 'glassdoor' | 'monster' | 'dice' | 'github' | 'wellfound' | 'other'
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
 * Extract text from HTML, preserving paragraphs and list items
 * @param {string} rawHtml
 * @returns {string} Clean plain text
 */
const cleanHtmlText = (rawHtml = '') => {
  if (!rawHtml) return '';
  const $ = cheerio.load(rawHtml);
  $('script, style, noscript, nav, header, footer, svg, button, form, iframe').remove();

  // Add spaces / newlines before line-breaking elements
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
 * High-fidelity standard used by LinkedIn, Indeed, Glassdoor, etc.
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
        // Continue to next script tag
      }
    }
  } catch (e) {
    // ignore
  }
  return null;
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

  // 1. Try JSON-LD JobPosting first
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
      description = cleanHtmlText(jsonLd.description);
    }
  }

  // 2. Site-Specific Selectors Fallback
  if (sourceWebsite === 'linkedin') {
    if (!jobTitle) {
      jobTitle = $(
        'h1.topcard__title, h1.top-card-layout__title, h1.job-title, .jobTitle, h1[data-automation-id="jobTitle"], h1'
      ).first().text().trim();
    }
    if (!company) {
      company = $(
        '.topcard__org-name-link, a.topcard__org-name-link, a.sub-nav-cta__sub-title-link, span.topcard__flavor, .companyName, [data-automation-id="companyName"], a[data-tracking-control-name="public_jobs_topcard-org-name"]'
      ).first().text().trim();
    }
    if (!location) {
      location = $(
        '.topcard__flavor--bullet, span.sub-nav-cta__meta-text, .jobLocation, span.topcard__flavor:nth-of-type(2)'
      ).first().text().trim();
    }
    if (!description) {
      const descHtml = $(
        '.description__text, .show-more-less-html__markup, [data-testid="job-details"], .description, #job-details'
      ).html();
      if (descHtml) description = cleanHtmlText(descHtml);
    }
    if (!salary) {
      salary = $('.compensation__salary, .salary').first().text().trim();
    }
  } else if (sourceWebsite === 'indeed') {
    if (!jobTitle) {
      jobTitle = $('h1[class*="jobsearch-JobInfoHeader"], h1.jobsearch-JobInfoHeader-title, h1').first().text().trim();
    }
    if (!company) {
      company = $(
        '[data-company-name], div[data-testid="inlineHeader-companyName"], .jobsearch-InlineCompanyRating-companyHeader, [data-testid="company-name"]'
      ).first().text().trim();
    }
    if (!location) {
      location = $(
        '[data-testid="job-location"], [data-testid="inlineHeader-companyLocation"], .jobsearch-JobInfoHeader-companyLocation'
      ).first().text().trim();
    }
    if (!description) {
      const descHtml = $('#jobDescriptionText, .jobsearch-jobDescriptionText').html();
      if (descHtml) description = cleanHtmlText(descHtml);
    }
    if (!salary) {
      salary = $('[class*="salary"], #salaryInfoAndJobType, [data-testid="jobsearch-JobInfoHeader-salary"]').first().text().trim();
    }
  } else if (sourceWebsite === 'glassdoor') {
    if (!jobTitle) {
      jobTitle = $('.JobTitle, [data-test="job-title"], h1').first().text().trim();
    }
    if (!company) {
      company = $('.EmployerProfile, [data-test="employer-name"]').first().text().trim();
    }
    if (!location) {
      location = $('.JobLocation, [data-test="location"]').first().text().trim();
    }
    if (!description) {
      const descHtml = $('.jobDescription, [data-test="job-description"], #JobDescriptionContainer').html();
      if (descHtml) description = cleanHtmlText(descHtml);
    }
    if (!salary) {
      salary = $('.salaryEstimate, [data-test="detailSalary"]').first().text().trim();
    }
  }

  // 3. Generic Meta Tags Fallback (OpenGraph & Twitter cards)
  if (!jobTitle) {
    jobTitle = $('meta[property="og:title"]').attr('content')
      || $('meta[name="twitter:title"]').attr('content')
      || $('title').text()
      || 'Software Engineer';
    // Clean trailing site brand: "Software Engineer at Google | LinkedIn"
    jobTitle = jobTitle.replace(/\s*[|\-–—]\s*(LinkedIn|Indeed|Glassdoor|Wellfound|Jobs).*$/i, '').trim();
  }

  if (!company) {
    company = $('meta[property="og:site_name"]').attr('content')
      || $('.company, .company-name, .employer, [data-testid="company-name"]').first().text().trim();
    if (!company && originalUrl) {
      try {
        const u = new URL(originalUrl);
        const hostParts = u.hostname.replace('www.', '').split('.');
        if (hostParts.length > 0 && !['linkedin', 'indeed', 'glassdoor', 'monster', 'dice'].includes(hostParts[0])) {
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
    // Try main article, body content
    const mainDescHtml = $('article, main, [role="main"], .job-description, .posting-requirements, #content').html();
    if (mainDescHtml) {
      description = cleanHtmlText(mainDescHtml);
    } else {
      const metaDesc = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
      description = metaDesc || cleanHtmlText($('body').html());
    }
  }

  // Clean values
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
 * Clean and extract main job description text
 * @param {string} html
 * @param {string} sourceWebsite
 * @returns {string} Clean text string
 */
const extractJobDescription = (html, sourceWebsite = 'other') => {
  const metadata = extractJobMetadata(html, sourceWebsite);
  return metadata.jobDescription || '';
};

/**
 * Main Web Scraper entrypoint
 * Scrapes job posting details from any valid URL
 * @param {string} url - Job posting URL
 * @returns {Promise<Object>}
 */
const scrapeJobFromURL = async (url) => {
  if (!url || typeof url !== 'string') {
    throw new Error('Please enter a valid job URL.');
  }

  const cleanUrl = url.trim();
  if (!isValidURL(cleanUrl)) {
    throw new Error('Invalid URL format. Please provide a full HTTP or HTTPS job link.');
  }

  const sourceWebsite = detectJobWebsite(cleanUrl);

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  };

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
      throw new Error('Took too long to load the page. Scraping timed out after 10 seconds. Please try again.');
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 404 || status === 410) {
        throw new Error('Job posting not found. It may have expired or been removed.');
      }
      if (status === 429) {
        throw new Error('Too many requests. The job board is rate-limiting requests. Please wait a moment and try again.');
      }
      if (status === 403) {
        // Some sites like LinkedIn guest view might challenge with auth wall on certain IP ranges
        // Try fallback parsing if title is encoded in URL slug
        const urlSlugData = parseDetailsFromUrlSlug(cleanUrl, sourceWebsite);
        if (urlSlugData) {
          return urlSlugData;
        }
        throw new Error('Access denied by job site (Bot protection active). You can still paste or customize the job description manually.');
      }
      throw new Error(`Failed to retrieve job posting: HTTP ${status}`);
    }
    throw new Error(`Network error scraping job posting: ${error.message}`);
  }

  const html = response.data;
  if (!html || typeof html !== 'string' || html.length < 50) {
    throw new Error('Received empty response from the job website.');
  }

  const extracted = extractJobMetadata(html, sourceWebsite, cleanUrl);

  // If description is extremely sparse (under 60 characters)
  if (!extracted.jobDescription || extracted.jobDescription.length < 50) {
    // Attempt fallback from URL slug or title
    const fallback = parseDetailsFromUrlSlug(cleanUrl, sourceWebsite);
    if (fallback && fallback.jobDescription) {
      extracted.jobDescription = fallback.jobDescription;
      if (!extracted.jobTitle || extracted.jobTitle === 'Software Engineer') {
        extracted.jobTitle = fallback.jobTitle;
      }
      if (!extracted.company || extracted.company === 'Company') {
        extracted.company = fallback.company;
      }
    } else {
      throw new Error('Could not extract job description from the page. The posting may require a login or JavaScript rendering.');
    }
  }

  return {
    jobTitle: extracted.jobTitle,
    company: extracted.company,
    location: extracted.location,
    jobDescription: extracted.jobDescription,
    salary: extracted.salary,
    jobType: extracted.jobType,
    postedDate: extracted.postedDate,
    jobLink: cleanUrl,
    sourceWebsite
  };
};

/**
 * Intelligent helper to parse title, company and stub JD from job URL slug
 * Handles LinkedIn URLs like /jobs/view/senior-software-engineer-at-google-3891234
 * or Indeed URLs like /rc/clk?jk=...
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
    }

    return {
      jobTitle: title,
      company: company,
      location: 'Remote / Hybrid',
      salary: null,
      jobType: 'Full-time',
      postedDate: new Date().toISOString().split('T')[0],
      jobLink: url,
      sourceWebsite,
      jobDescription: `Position: ${title} at ${company}.\n\nRequirements & Responsibilities:\nWe are looking for an experienced ${title} to join our team. The ideal candidate will have strong experience in modern software engineering, web frameworks, distributed architectures, database optimization, and teamwork.`
    };
  } catch (e) {
    return null;
  }
};

module.exports = {
  scrapeJobFromURL,
  extractJobDescription,
  extractJobMetadata,
  detectJobWebsite,
  isValidURL
};
