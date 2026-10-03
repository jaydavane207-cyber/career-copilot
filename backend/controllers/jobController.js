// backend/controllers/jobController.js
const { Job } = require('../models');

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
 * Get all user's job applications with optional stage filtering
 */
const getJobs = async (req, res, next) => {
  try {
    const { stage, status } = req.query;
    const filter = { userId: req.user.id };

    const targetStage = stage || status;
    if (targetStage) {
      filter.stage = normalizeStage(targetStage);
    }

    const jobs = await Job.findAll({
      where: filter,
      order: [
        ['dateApplied', 'DESC'],
        ['createdAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/jobs
 * Add new job application
 */
const createJob = async (req, res, next) => {
  try {
    const {
      companyName,
      jobTitle,
      positionTitle,
      jobLink,
      jobUrl,
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
    const link = (jobLink || jobUrl || '').trim();
    const initialStage = normalizeStage(stage || status || 'applied');
    const applied = dateApplied || appliedDate || new Date().toISOString().split('T')[0];
    const interview = interviewDate || null;
    const notesContent = notes !== undefined ? notes : '';
    const salaryVal = salary || salaryRange || null;

    // Input Validation
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required.'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Job title is required.'
      });
    }

    if (!ALLOWED_STAGES.includes(initialStage)) {
      return res.status(400).json({
        success: false,
        message: "Stage must be one of: 'applied', 'interview', 'offer'."
      });
    }

    const job = await Job.create({
      userId: req.user.id,
      companyName: company,
      jobTitle: title,
      jobLink: link || null,
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
 * Update job (move between stages, edit details)
 */
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.'
      });
    }

    const {
      companyName,
      jobTitle,
      positionTitle,
      jobLink,
      jobUrl,
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

    const newLink = jobLink !== undefined ? jobLink : jobUrl;
    if (newLink !== undefined) {
      job.jobLink = newLink ? newLink.trim() : null;
    }

    const newStageRaw = stage !== undefined ? stage : status;
    if (newStageRaw !== undefined) {
      const normalized = normalizeStage(newStageRaw);
      if (!ALLOWED_STAGES.includes(normalized)) {
        return res.status(400).json({
          success: false,
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
 * Legacy status update endpoint (kept for backward compatibility)
 */
const updateJobStatus = async (req, res, next) => {
  try {
    const { stage, status } = req.body;
    const targetStage = normalizeStage(stage || status);

    if (!ALLOWED_STAGES.includes(targetStage)) {
      return res.status(400).json({
        success: false,
        message: "Stage must be one of: 'applied', 'interview', 'offer'."
      });
    }

    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found.'
      });
    }

    job.stage = targetStage;
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
 * Delete job application
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({
        success: false,
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
 * Return stats:
 * - Total applications
 * - Applications in each stage (applied, interview, offer)
 * - Conversion rate (interviews / applied)
 * - Average days between stages
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

    // Conversion rate: (interviews / applied) as a percentage
    // If appliedCount > 0, interviews / applied * 100
    // If appliedCount is 0 but we have total applications: (interviews / totalApplications) * 100
    let conversionRate = 0;
    if (appliedCount > 0) {
      conversionRate = Math.round((interviewCount / appliedCount) * 100);
    } else if (totalApplications > 0 && interviewCount > 0) {
      conversionRate = Math.round((interviewCount / totalApplications) * 100);
    }

    // Overall pipeline conversion (interviews + offers) / total
    const overallSuccessRate = totalApplications > 0
      ? Math.round(((interviewCount + offerCount) / totalApplications) * 100)
      : 0;

    // Average days between stages calculation:
    // Measures time between dateApplied and interviewDate or stage progression
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
      // Primary required backend stats
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

module.exports = {
  getJobs,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  getJobStats
};
