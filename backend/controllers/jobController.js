// backend/controllers/jobController.js
const { Job, User, Resume, Skill, StudyPlan } = require('../models');
const jobScraper = require('../utils/jobScraper');
const jobAnalyzer = require('../utils/jobAnalyzer');
const env = require('../config/env');

// Allowed Kanban stages
const ALLOWED_STAGES = ['applied', 'interview', 'offer'];

/**
 * Normalize stage string to lowercase standard: 'applied' | 'interview' | 'offer'
 */
const normalizeStage = (val) => {
  if (!val) return 'applied';
  const s = String(val).toLowerCase().trim();
  if (s.includes('interview')) return 'interview';
  if (s.includes('offer')) return 'offer';
  if (s === 'applied' || s === 'wishlist' || s === 'rejected') return 'applied';
  return s;
};

/**
 * GET /api/jobs
 * Query all jobs for user where userId = $1
 * Group by stage: { applied: [], interview: [], offer: [] }
 * Sort by dateApplied (newest first) within each stage
 */
const getJobs = async (req, res, next) => {
  try {
    const { stage, status } = req.query;
    const filter = { userId: req.user.id };

    const targetStage = stage || status;
    if (targetStage) {
      filter.stage = normalizeStage(targetStage);
    }

    const allUserJobs = await Job.findAll({
      where: filter,
      order: [
        ['dateApplied', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    const applied = allUserJobs.filter(j => (j.stage || '').toLowerCase() === 'applied');
    const interview = allUserJobs.filter(j => (j.stage || '').toLowerCase() === 'interview');
    const offer = allUserJobs.filter(j => (j.stage || '').toLowerCase() === 'offer');

    res.json({
      success: true,
      count: allUserJobs.length,
      applied,
      interview,
      offer,
      jobs: allUserJobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs
 * Body: { companyName, jobTitle, jobLink, stage, dateApplied, interviewDate, notes, salary }
 */
const createJob = async (req, res, next) => {
  try {
    const {
      companyName,
      jobTitle,
      positionTitle,
      jobLink,
      jobUrl,
      jobPostingUrl,
      jobDescription,
      jobSource,
      matchScore,
      requiredSkills,
      missingSkills,
      criticalSkills,
      jobAnalysis,
      aiAnalysis,
      stage,
      status,
      dateApplied,
      appliedDate,
      interviewDate,
      notes,
      salary,
      salaryRange
    } = req.body;

    const company = (companyName || '').trim();
    const title = (jobTitle || positionTitle || '').trim();
    const link = (jobLink || jobUrl || jobPostingUrl || '').trim();
    const rawStage = stage || status || 'applied';
    const initialStage = normalizeStage(rawStage);
    const applied = dateApplied || appliedDate || new Date().toISOString().split('T')[0];
    const interview = interviewDate || null;
    const notesContent = notes !== undefined ? notes : '';
    const salaryVal = salary || salaryRange || null;

    if (!company) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Company name is required.'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Job title is required.'
      });
    }

    if (!ALLOWED_STAGES.includes(initialStage)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: "Stage must be one of: 'applied', 'interview', 'offer'."
      });
    }

    const job = await Job.create({
      userId: req.user.id,
      companyName: company,
      jobTitle: title,
      jobLink: link || null,
      jobPostingUrl: link || null,
      jobSource: jobSource || (link ? jobScraper.detectJobWebsite(link) : 'other'),
      jobDescription: jobDescription || null,
      matchScore: matchScore !== undefined ? matchScore : null,
      requiredSkills: requiredSkills || [],
      missingSkills: missingSkills || [],
      criticalSkills: criticalSkills || null,
      jobAnalysis: jobAnalysis || aiAnalysis || null,
      aiAnalysis: aiAnalysis || jobAnalysis || null,
      scrapedAt: jobDescription ? new Date() : null,
      stage: initialStage,
      dateApplied: applied,
      interviewDate: interview,
      notes: notesContent,
      salary: salaryVal
    });

    res.status(201).json({
      success: true,
      message: 'Job application added successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/jobs/:id
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Job application not found.'
      });
    }

    const {
      companyName,
      jobTitle,
      positionTitle,
      jobLink,
      jobUrl,
      jobPostingUrl,
      jobDescription,
      jobSource,
      matchScore,
      requiredSkills,
      missingSkills,
      criticalSkills,
      jobAnalysis,
      aiAnalysis,
      stage,
      status,
      dateApplied,
      appliedDate,
      interviewDate,
      notes,
      salary,
      salaryRange
    } = req.body;

    if (companyName !== undefined) {
      if (!companyName.trim()) {
        return res.status(400).json({ success: false, message: 'Company name cannot be empty.' });
      }
      job.companyName = companyName.trim();
    }

    const newTitle = jobTitle !== undefined ? jobTitle : positionTitle;
    if (newTitle !== undefined) {
      if (!newTitle.trim()) {
        return res.status(400).json({ success: false, message: 'Job title cannot be empty.' });
      }
      job.jobTitle = newTitle.trim();
    }

    const newLink = jobLink !== undefined ? jobLink : (jobUrl !== undefined ? jobUrl : jobPostingUrl);
    if (newLink !== undefined) {
      job.jobLink = newLink ? newLink.trim() : null;
      job.jobPostingUrl = newLink ? newLink.trim() : null;
    }

    if (jobDescription !== undefined) job.jobDescription = jobDescription;
    if (jobSource !== undefined) job.jobSource = jobSource;
    if (matchScore !== undefined) job.matchScore = matchScore;
    if (requiredSkills !== undefined) job.requiredSkills = requiredSkills;
    if (missingSkills !== undefined) job.missingSkills = missingSkills;
    if (criticalSkills !== undefined) job.criticalSkills = criticalSkills;
    if (jobAnalysis !== undefined || aiAnalysis !== undefined) {
      const a = jobAnalysis || aiAnalysis;
      job.jobAnalysis = a;
      job.aiAnalysis = a;
    }

    const newStageRaw = stage !== undefined ? stage : status;
    if (newStageRaw !== undefined) {
      const normalized = normalizeStage(newStageRaw);
      if (!ALLOWED_STAGES.includes(normalized)) {
        return res.status(400).json({
          success: false,
          error: 'VALIDATION_ERROR',
          message: "Stage must be one of: 'applied', 'interview', 'offer'."
        });
      }
      job.stage = normalized;
    }

    const newDateApplied = dateApplied !== undefined ? dateApplied : appliedDate;
    if (newDateApplied !== undefined) job.dateApplied = newDateApplied;
    if (interviewDate !== undefined) job.interviewDate = interviewDate;
    if (notes !== undefined) job.notes = notes;

    const newSalary = salary !== undefined ? salary : salaryRange;
    if (newSalary !== undefined) job.salary = newSalary;

    await job.save();

    res.json({
      success: true,
      message: 'Job application updated successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/jobs/:id/status
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { stage, status } = req.body;
    const rawStage = stage || status;

    if (!rawStage) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Stage is required.'
      });
    }

    const normalized = normalizeStage(rawStage);
    if (!ALLOWED_STAGES.includes(normalized)) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: "Stage must be one of: 'applied', 'interview', 'offer'."
      });
    }

    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Job application not found.'
      });
    }

    job.stage = normalized;
    await job.save();

    res.json({
      success: true,
      message: `Job status updated to ${normalized}`,
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/jobs/:id
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Job application not found.'
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: 'Job application deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/stats
 */
const getJobStats = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({ where: { userId: req.user.id } });

    const totalApplications = jobs.length;
    const appliedJobs = jobs.filter(j => (j.stage || '').toLowerCase() === 'applied');
    const interviewJobs = jobs.filter(j => (j.stage || '').toLowerCase() === 'interview');
    const offerJobs = jobs.filter(j => (j.stage || '').toLowerCase() === 'offer');

    const appliedCount = appliedJobs.length;
    const interviewCount = interviewJobs.length;
    const offerCount = offerJobs.length;

    let conversionRate = 0;
    if (appliedCount > 0) {
      conversionRate = Math.round((interviewCount / appliedCount) * 100);
    } else if (totalApplications > 0 && interviewCount > 0) {
      conversionRate = Math.round((interviewCount / totalApplications) * 100);
    }

    const overallSuccessRate = totalApplications > 0
      ? Math.round(((interviewCount + offerCount) / totalApplications) * 100)
      : 0;

    const stageIntervals = [];
    for (const job of jobs) {
      const appliedStr = job.dateApplied || (job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : null);
      if (!appliedStr) continue;

      const appliedTime = new Date(appliedStr).getTime();

      if (job.interviewDate) {
        const interviewTime = new Date(job.interviewDate).getTime();
        const diffDays = Math.round((interviewTime - appliedTime) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) stageIntervals.push(diffDays);
      } else if (job.stage === 'interview' || job.stage === 'offer') {
        const stageTime = new Date(job.updatedAt || job.createdAt).getTime();
        const diffDays = Math.round((stageTime - appliedTime) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) stageIntervals.push(diffDays);
      }
    }

    const averageDaysBetweenStages = stageIntervals.length > 0
      ? Number((stageIntervals.reduce((a, b) => a + b, 0) / stageIntervals.length).toFixed(1))
      : 0;

    const stats = {
      totalApplications,
      totalApplied: totalApplications,
      total: totalApplications,
      applied: appliedCount,
      interview: interviewCount,
      inInterview: interviewCount,
      interviewing: interviewCount,
      offer: offerCount,
      offers: offerCount,
      conversionRate,
      conversionRateFormatted: `${conversionRate}%`,
      overallSuccessRate,
      averageDaysBetweenStages,
      avgDaysBetweenStages: averageDaysBetweenStages,
      stageBreakdown: {
        applied: appliedCount,
        interview: interviewCount,
        offer: offerCount
      }
    };

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs/analyze-url AND POST /api/jobs/analyze
 * Scrapes and analyzes job posting from URL, compares with user resume, auto-saves to tracker
 */
const analyzeJobFromURL = async (req, res, next) => {
  try {
    const rawUrl = req.body.jobURL || req.body.jobUrl || req.body.url;

    if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_URL',
        code: 'INVALID_URL',
        message: 'Please enter a valid job URL.'
      });
    }

    const cleanURL = rawUrl.trim();
    if (!jobScraper.isValidURL(cleanURL)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_URL',
        code: 'INVALID_URL',
        message: 'Please enter a valid HTTP or HTTPS job link (e.g., LinkedIn, Indeed, Glassdoor).'
      });
    }

    const userId = req.user.id;

    // 1. Caching Check: Has this URL been scraped within 24 hours?
    const cacheDays = env.SCRAPER_CACHE_DAYS || 1;
    const cacheWindowMs = cacheDays * 24 * 60 * 60 * 1000;

    const existingScraped = await Job.findOne({
      where: {
        jobPostingUrl: cleanURL
      },
      order: [['scrapedAt', 'DESC']]
    });

    let jobData;
    const isCacheFresh = existingScraped &&
      existingScraped.jobDescription &&
      existingScraped.scrapedAt &&
      (Date.now() - new Date(existingScraped.scrapedAt).getTime() < cacheWindowMs);

    if (isCacheFresh) {
      jobData = {
        jobTitle: existingScraped.jobTitle,
        company: existingScraped.companyName,
        location: 'Remote / Hybrid',
        jobDescription: existingScraped.jobDescription,
        salary: existingScraped.salary,
        jobType: 'Full-time',
        postedDate: existingScraped.dateApplied,
        jobLink: cleanURL,
        sourceWebsite: existingScraped.jobSource || jobScraper.detectJobWebsite(cleanURL),
        fromCache: true
      };
    } else {
      jobData = await jobScraper.scrapeJobFromURL(cleanURL);
    }

    // 2. Perform Full Analysis using jobAnalyzer
    const fullAnalysis = await jobAnalyzer.analyzeJobAndCompareWithResume(userId, jobData);

    const matchScore = fullAnalysis.matchAnalysis?.matchScore ?? fullAnalysis.matchScore ?? 75;
    const reqSkills = fullAnalysis.job?.requirements?.requiredSkills || [];
    const missingSkills = fullAnalysis.matchAnalysis?.skillMatches?.missing || [];
    const criticalSkills = fullAnalysis.preparation?.criticalSkills || [];
    const prepEstimate = fullAnalysis.preparation?.criticalSkills?.reduce((a, b) => a + (b.estimatedHours || 30), 0) || 60;

    // 3. Save or Update in User's Job Applications Tracker
    let userJob = await Job.findOne({
      where: {
        userId,
        jobPostingUrl: cleanURL
      }
    });

    if (userJob) {
      userJob.companyName = jobData.company || userJob.companyName;
      userJob.jobTitle = jobData.jobTitle || userJob.jobTitle;
      userJob.jobLink = cleanURL;
      userJob.jobPostingUrl = cleanURL;
      userJob.jobSource = jobData.sourceWebsite || userJob.jobSource;
      userJob.jobDescription = jobData.jobDescription;
      userJob.salary = jobData.salary || userJob.salary;
      userJob.matchScore = matchScore;
      userJob.requiredSkills = reqSkills;
      userJob.missingSkills = missingSkills;
      userJob.criticalSkills = criticalSkills;
      userJob.jobAnalysis = fullAnalysis;
      userJob.aiAnalysis = fullAnalysis;
      userJob.userMatchLevel = fullAnalysis.matchAnalysis?.matchLevel || 'Good Match';
      userJob.prepTimeEstimate = prepEstimate;
      userJob.prepRecommendations = fullAnalysis.preparation;
      userJob.redFlags = fullAnalysis.redFlags || [];
      userJob.scrapedAt = new Date();
      userJob.jobScrapedAt = new Date();
      userJob.scrapedSuccessfully = true;
      await userJob.save();
    } else {
      userJob = await Job.create({
        userId,
        companyName: jobData.company || 'Company',
        jobTitle: jobData.jobTitle || 'Software Engineer',
        jobLink: cleanURL,
        jobPostingUrl: cleanURL,
        jobSource: jobData.sourceWebsite || 'other',
        jobDescription: jobData.jobDescription,
        stage: 'applied',
        dateApplied: new Date().toISOString().split('T')[0],
        salary: jobData.salary || null,
        matchScore: matchScore,
        requiredSkills: reqSkills,
        missingSkills: missingSkills,
        criticalSkills: criticalSkills,
        jobAnalysis: fullAnalysis,
        aiAnalysis: fullAnalysis,
        userMatchLevel: fullAnalysis.matchAnalysis?.matchLevel || 'Good Match',
        prepTimeEstimate: prepEstimate,
        prepRecommendations: fullAnalysis.preparation,
        redFlags: fullAnalysis.redFlags || [],
        scrapedAt: new Date(),
        jobScrapedAt: new Date(),
        autoSaved: true,
        scrapedSuccessfully: true
      });
    }

    fullAnalysis.jobId = userJob.id;

    // Response matching both exact Part 4 and frontend expectations
    res.status(200).json({
      success: true,
      message: 'Job posting analyzed and saved to your application tracker!',
      jobId: userJob.id,
      url: cleanURL,
      analysis: fullAnalysis,
      data: {
        job: {
          id: userJob.id,
          title: userJob.jobTitle,
          company: userJob.companyName,
          location: jobData.location || 'Remote / Hybrid',
          salary: userJob.salary,
          source: userJob.jobSource,
          url: cleanURL,
          jobDescription: userJob.jobDescription,
          stage: userJob.stage,
          dateApplied: userJob.dateApplied,
          matchScore: userJob.matchScore
        },
        analysis: fullAnalysis,
        jobId: userJob.id
      }
    });
  } catch (error) {
    const statusCode = error.statusCode || (error.message.includes('not found') ? 404 : 500);
    res.status(statusCode).json({
      success: false,
      error: error.message || 'Job posting could not be analyzed.',
      code: error.code || 'JOB_ANALYSIS_ERROR',
      suggestions: 'Try copying the complete job URL from LinkedIn, Indeed, or Glassdoor.'
    });
  }
};

/**
 * GET /api/jobs/:id/analysis
 * Get full saved job analysis details
 */
const getJobAnalysis = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Job application not found.'
      });
    }

    const savedAnalysis = job.jobAnalysis || job.aiAnalysis;
    if (savedAnalysis) {
      return res.json({
        success: true,
        job,
        analysis: savedAnalysis
      });
    }

    // Re-generate if description is available
    if (job.jobDescription) {
      const fullAnalysis = await jobAnalyzer.analyzeJobAndCompareWithResume(req.user.id, {
        jobTitle: job.jobTitle,
        company: job.companyName,
        jobDescription: job.jobDescription,
        sourceWebsite: job.jobSource,
        jobLink: job.jobLink
      });

      job.jobAnalysis = fullAnalysis;
      job.aiAnalysis = fullAnalysis;
      job.matchScore = fullAnalysis.matchAnalysis?.matchScore || job.matchScore;
      job.requiredSkills = fullAnalysis.job?.requirements?.requiredSkills || job.requiredSkills;
      job.missingSkills = fullAnalysis.matchAnalysis?.skillMatches?.missing || job.missingSkills;
      await job.save();

      return res.json({
        success: true,
        job,
        analysis: fullAnalysis
      });
    }

    res.json({
      success: true,
      job,
      analysis: null,
      message: 'No description available for this job yet.'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/:id/preparation
 * Get preparation suggestions
 */
const getJobPreparation = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Job application not found.'
      });
    }

    const analysis = job.jobAnalysis || job.aiAnalysis || {};
    const prepObj = analysis.preparation || {};
    const critical = prepObj.criticalSkills || [];
    const important = prepObj.importantSkills || [];

    const allSkillsToLearn = [...critical, ...important];
    if (allSkillsToLearn.length === 0 && Array.isArray(job.missingSkills)) {
      for (const s of job.missingSkills) {
        allSkillsToLearn.push({ skill: s, priority: 'HIGH', estimatedHours: 35 });
      }
    }

    const skillsWithResources = allSkillsToLearn.map(item => ({
      skill: item.skill,
      priority: item.priority || 'HIGH',
      hours: item.estimatedHours || 30,
      resources: [
        { title: `${item.skill} Official Interactive Docs & Walkthrough`, url: 'https://roadmap.sh', type: 'Documentation' },
        { title: `${item.skill} System Architecture & Patterns`, url: 'https://github.com', type: 'Hands-on Repository' }
      ]
    }));

    const mockInterviews = job.jobTitle?.toLowerCase().includes('senior') ? 4 : 2;
    const studyPlan = prepObj.estimatedPrepTime ? `${prepObj.estimatedPrepTime} intensive plan` : '3-4 weeks intensive';

    res.json({
      success: true,
      skills: skillsWithResources,
      mockInterviews,
      studyPlan,
      recommendations: analysis.recommendation?.nextSteps || [
        'Complete system design mock interview simulation',
        'Brush up on missing required technical skills',
        'Review architecture trade-offs for technical screening'
      ],
      data: {
        jobId: job.id,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        recommendedSkills: skillsWithResources,
        mockInterviews,
        studyPlan
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs/:id/save-to-tracker
 * Save analyzed job to applications tracker
 */
const saveAnalyzedJobToTracker = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'Job application not found.'
      });
    }

    const targetStage = req.body.stage ? normalizeStage(req.body.stage) : 'applied';
    job.stage = targetStage;
    if (req.body.notes !== undefined) {
      job.notes = req.body.notes;
    }
    job.autoSaved = true;
    await job.save();

    res.json({
      success: true,
      jobId: job.id,
      stage: job.stage,
      message: 'Job successfully saved to application tracker!'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/suggested
 * Get AI-suggested jobs based on user's skills
 */
const suggestJobsForUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = Math.min(20, parseInt(req.query.limit, 10) || 5);

    // Get all user skills
    const userSkills = await Skill.findAll({ where: { userId } });
    const skillNames = userSkills.map(s => s.skillName);

    // Query distinct jobs available in database with descriptions
    const allRecentJobs = await Job.findAll({
      limit: 50,
      order: [['createdAt', 'DESC']]
    });

    const suggestions = [];

    for (const j of allRecentJobs) {
      if (!j.jobDescription) continue;
      const reqs = jobScraper.extractJobRequirements(j.jobDescription);
      const score = jobAnalyzer.calculateMatchScore(skillNames, reqs);

      if (score >= 60 || suggestions.length < limit) {
        suggestions.push({
          id: j.id,
          title: j.jobTitle,
          company: j.companyName,
          location: 'Remote / Hybrid',
          salary: j.salary || '$120k - $160k',
          source: j.jobSource || 'linkedin',
          url: j.jobLink || j.jobPostingUrl,
          matchScore: score,
          requiredSkills: reqs.requiredSkills,
          seniority: reqs.seniority
        });
      }
    }

    // Sort descending by matchScore
    suggestions.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      count: suggestions.slice(0, limit).length,
      jobs: suggestions.slice(0, limit)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/jobs/search-analysis
 * Analyze multiple job URLs at once
 */
const searchMultipleJobsAnalysis = async (req, res, next) => {
  try {
    const rawUrls = req.query.urls || '';
    const urlList = rawUrls.split(',').map(u => u.trim()).filter(Boolean);

    if (urlList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No URLs provided in query parameter. Example: ?urls=url1,url2'
      });
    }

    const analyses = [];
    for (const u of urlList.slice(0, 5)) {
      try {
        const scraped = await jobScraper.scrapeJobFromURL(u);
        const analysis = await jobAnalyzer.analyzeJobAndCompareWithResume(req.user.id, scraped);
        analyses.push({
          url: u,
          success: true,
          analysis
        });
      } catch (err) {
        analyses.push({
          url: u,
          success: false,
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  getJobStats,
  analyzeJobFromURL,
  getJobAnalysis,
  getJobPreparation,
  saveAnalyzedJobToTracker,
  suggestJobsForUser,
  searchMultipleJobsAnalysis,
  suggestPreparation: getJobPreparation // alias for backwards compatibility
};
