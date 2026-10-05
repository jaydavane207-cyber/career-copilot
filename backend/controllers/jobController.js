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

    // Group by stage and sort newest first within each stage
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
 * Validates required fields: companyName, jobTitle, stage
 * Validates stage enum: applied|interview|offer
 * Inserts into jobs table and returns created job
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

    // Validate required fields
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
      aiAnalysis: aiAnalysis || null,
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
 * Validate job belongs to user, update only provided fields, update updatedAt, return updated job
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

    if (jobDescription !== undefined) {
      job.jobDescription = jobDescription;
    }

    if (jobSource !== undefined) {
      job.jobSource = jobSource;
    }

    if (matchScore !== undefined) {
      job.matchScore = matchScore;
    }

    if (requiredSkills !== undefined) {
      job.requiredSkills = requiredSkills;
    }

    if (missingSkills !== undefined) {
      job.missingSkills = missingSkills;
    }

    if (aiAnalysis !== undefined) {
      job.aiAnalysis = aiAnalysis;
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

    const newApplied = dateApplied !== undefined ? dateApplied : appliedDate;
    if (newApplied !== undefined) {
      job.dateApplied = newApplied || null;
    }

    if (interviewDate !== undefined) {
      job.interviewDate = interviewDate || null;
    }

    if (notes !== undefined) {
      job.notes = notes;
    }

    const newSalary = salary !== undefined ? salary : salaryRange;
    if (newSalary !== undefined) {
      job.salary = newSalary || null;
    }

    job.updatedAt = new Date();
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
    const targetStage = normalizeStage(stage || status);

    if (!ALLOWED_STAGES.includes(targetStage)) {
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

    job.stage = targetStage;
    job.updatedAt = new Date();
    await job.save();

    res.json({
      success: true,
      message: `Job stage updated to ${targetStage}`,
      job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/jobs/:id
 * Validate job belongs to user, delete from jobs table, return success message
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
 * Count jobs by stage, calculate conversion: (interviews / applied) * 100,
 * calculate average days in each stage, return stats object
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

    // Conversion rate: (interviews / applied) * 100
    let conversionRate = 0;
    if (appliedCount > 0) {
      conversionRate = Math.round((interviewCount / appliedCount) * 100);
    } else if (totalApplications > 0 && interviewCount > 0) {
      conversionRate = Math.round((interviewCount / totalApplications) * 100);
    }

    const overallSuccessRate = totalApplications > 0
      ? Math.round(((interviewCount + offerCount) / totalApplications) * 100)
      : 0;

    // Calculate average days between stages
    const stageIntervals = [];
    for (const job of jobs) {
      const appliedStr = job.dateApplied || (job.createdAt ? new Date(job.createdAt).toISOString().split('T')[0] : null);
      if (!appliedStr) continue;

      const appliedTime = new Date(appliedStr).getTime();

      if (job.interviewDate) {
        const interviewTime = new Date(job.interviewDate).getTime();
        const diffDays = Math.round((interviewTime - appliedTime) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          stageIntervals.push(diffDays);
        }
      } else if (job.stage === 'interview' || job.stage === 'offer') {
        const stageTime = new Date(job.updatedAt || job.createdAt).getTime();
        const diffDays = Math.round((stageTime - appliedTime) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0) {
          stageIntervals.push(diffDays);
        }
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
 * POST /api/jobs/analyze
 * Scrapes and analyzes job posting from URL, compares with user resume, auto-saves to tracker
 */
const analyzeJobFromURL = async (req, res, next) => {
  try {
    const { jobURL } = req.body;

    if (!jobURL || typeof jobURL !== 'string' || !jobURL.trim()) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_URL',
        message: 'Please enter a valid job URL.'
      });
    }

    const cleanURL = jobURL.trim();
    if (!jobScraper.isValidURL(cleanURL)) {
      return res.status(400).json({
        success: false,
        error: 'INVALID_URL',
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

    let jobDetails;
    const isCacheFresh = existingScraped &&
      existingScraped.jobDescription &&
      existingScraped.scrapedAt &&
      (Date.now() - new Date(existingScraped.scrapedAt).getTime() < cacheWindowMs);

    if (isCacheFresh) {
      jobDetails = {
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
      jobDetails = await jobScraper.scrapeJobFromURL(cleanURL);
    }

    // 2. Analyze Job Requirements (Required, Preferred, Seniority, Exp)
    const requirements = jobAnalyzer.analyzeJobRequirements(jobDetails.jobDescription);

    // 3. Retrieve User Skills and Latest Resume
    const [userSkills, latestResume, user] = await Promise.all([
      Skill.findAll({ where: { userId } }),
      Resume.findOne({ where: { userId }, order: [['createdAt', 'DESC']] }),
      User.findByPk(userId)
    ]);

    const userSkillList = [];
    if (userSkills && userSkills.length > 0) {
      for (const s of userSkills) {
        userSkillList.push({
          skillName: s.skillName,
          userLevel: s.userLevel || 70
        });
      }
    }

    const resumeText = latestResume ? (latestResume.extractedText || '') : '';
    if (latestResume && latestResume.matchedKeywords && Array.isArray(latestResume.matchedKeywords)) {
      for (const kw of latestResume.matchedKeywords) {
        userSkillList.push({ skillName: kw, userLevel: 75 });
      }
    }

    let candidateYears = null;
    if (user && user.experienceLevel) {
      const exp = user.experienceLevel.toLowerCase();
      if (exp.includes('senior') || exp.includes('5+')) candidateYears = 5;
      else if (exp.includes('mid') || exp.includes('3-5')) candidateYears = 3;
      else if (exp.includes('entry') || exp.includes('junior')) candidateYears = 1;
    }

    // 4. Compare User Skills/Resume against Job Requirements
    const comparison = jobAnalyzer.compareResumeWithJob(
      userSkillList,
      requirements,
      resumeText,
      candidateYears
    );

    // 5. Generate human-readable summary and preparation suggestions
    const analysisSummary = jobAnalyzer.generateJobAnalysisSummary(
      comparison,
      {
        ...jobDetails,
        seniority: requirements.seniority
      }
    );

    const fullAnalysis = {
      matchScore: comparison.matchScore,
      matchPercentage: comparison.matchPercentage,
      matchLevel: comparison.matchLevel,
      skillMatches: comparison.skillMatches,
      missingSkills: comparison.skillMatches.missing,
      missingCriticalSkills: comparison.missingCriticalSkills,
      missingImportantSkills: comparison.missingImportantSkills,
      experienceMatch: comparison.experienceMatch,
      requirements: {
        requiredSkills: requirements.requiredSkills,
        preferredSkills: requirements.preferredSkills,
        experienceRequired: requirements.experienceRequired,
        seniority: requirements.seniority,
        jobType: requirements.jobType,
        keywordFrequency: requirements.keywordFrequency
      },
      summary: analysisSummary.summary,
      strengths: analysisSummary.strengths,
      gaps: analysisSummary.gaps,
      recommendedPrep: analysisSummary.recommendedPrep,
      timeToReady: analysisSummary.timeToReady,
      scrapedAt: new Date(),
      fromCache: Boolean(jobDetails.fromCache)
    };

    // 6. Save or Update in User's Job Applications Tracker
    let userJob = await Job.findOne({
      where: {
        userId,
        jobPostingUrl: cleanURL
      }
    });

    if (userJob) {
      userJob.companyName = jobDetails.company || userJob.companyName;
      userJob.jobTitle = jobDetails.jobTitle || userJob.jobTitle;
      userJob.jobLink = cleanURL;
      userJob.jobSource = jobDetails.sourceWebsite || userJob.jobSource;
      userJob.jobDescription = jobDetails.jobDescription;
      userJob.salary = jobDetails.salary || userJob.salary;
      userJob.matchScore = comparison.matchScore;
      userJob.requiredSkills = requirements.requiredSkills;
      userJob.missingSkills = comparison.skillMatches.missing;
      userJob.aiAnalysis = fullAnalysis;
      userJob.scrapedAt = new Date();
      await userJob.save();
    } else {
      userJob = await Job.create({
        userId,
        companyName: jobDetails.company || 'Company',
        jobTitle: jobDetails.jobTitle || 'Software Engineer',
        jobLink: cleanURL,
        jobPostingUrl: cleanURL,
        jobSource: jobDetails.sourceWebsite || 'other',
        jobDescription: jobDetails.jobDescription,
        stage: 'applied',
        dateApplied: new Date().toISOString().split('T')[0],
        salary: jobDetails.salary || null,
        matchScore: comparison.matchScore,
        requiredSkills: requirements.requiredSkills,
        missingSkills: comparison.skillMatches.missing,
        aiAnalysis: fullAnalysis,
        scrapedAt: new Date(),
        autoSaved: true
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job posting analyzed and saved to your application tracker!',
      data: {
        job: {
          id: userJob.id,
          title: userJob.jobTitle,
          company: userJob.companyName,
          location: jobDetails.location || 'Remote / Hybrid',
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
    next(error);
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

    if (job.aiAnalysis) {
      return res.json({
        success: true,
        job,
        analysis: job.aiAnalysis
      });
    }

    // If analysis hasn't been computed yet
    if (job.jobDescription) {
      const requirements = jobAnalyzer.analyzeJobRequirements(job.jobDescription);
      const userSkills = await Skill.findAll({ where: { userId: req.user.id } });
      const comparison = jobAnalyzer.compareResumeWithJob(userSkills, requirements);
      const summary = jobAnalyzer.generateJobAnalysisSummary(comparison, {
        jobTitle: job.jobTitle,
        company: job.companyName
      });

      const analysis = {
        matchScore: comparison.matchScore,
        matchPercentage: comparison.matchPercentage,
        matchLevel: comparison.matchLevel,
        skillMatches: comparison.skillMatches,
        missingSkills: comparison.skillMatches.missing,
        missingCriticalSkills: comparison.missingCriticalSkills,
        missingImportantSkills: comparison.missingImportantSkills,
        experienceMatch: comparison.experienceMatch,
        summary: summary.summary,
        strengths: summary.strengths,
        gaps: summary.gaps,
        recommendedPrep: summary.recommendedPrep,
        timeToReady: summary.timeToReady
      };

      job.aiAnalysis = analysis;
      job.matchScore = comparison.matchScore;
      job.requiredSkills = requirements.requiredSkills;
      job.missingSkills = comparison.skillMatches.missing;
      await job.save();

      return res.json({
        success: true,
        job,
        analysis
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
 * Get preparation plan and suggested practice for this job
 */
const suggestPreparation = async (req, res, next) => {
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

    const analysis = job.aiAnalysis || {};
    const recommendedPrep = analysis.recommendedPrep || [];
    const missingCritical = analysis.missingCriticalSkills || job.missingSkills || [];

    const suggestedCourses = missingCritical.map(skill => ({
      skill,
      course: `${skill} Practical Mastery for Software Engineers`,
      provider: 'Career Copilot Curated Library',
      type: 'Hands-on Module'
    }));

    const mockInterviews = [
      {
        track: job.jobTitle?.toLowerCase().includes('senior') ? 'System Design' : 'Technical Coding',
        title: `${job.companyName || 'Technical'} Role Interview Simulation`,
        description: `Simulate interview questions expected for ${job.jobTitle || 'Software Engineer'}.`,
        durationMinutes: 45
      },
      {
        track: 'Behavioral',
        title: `${job.companyName || 'Company'} Behavioral & Leadership`,
        description: 'Practice high-impact STAR answers addressing company culture.',
        durationMinutes: 30
      }
    ];

    const totalHours = recommendedPrep.reduce((acc, p) => acc + (p.estimatedHours || 15), 0);
    const estimatedDays = Math.max(7, Math.ceil(totalHours / 2.5));

    res.json({
      success: true,
      data: {
        jobId: job.id,
        jobTitle: job.jobTitle,
        companyName: job.companyName,
        recommendedSkills: recommendedPrep,
        suggestedCourses,
        mockInterviews,
        estimatedDays
      }
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
  suggestPreparation
};

