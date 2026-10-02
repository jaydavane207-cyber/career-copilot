// backend/controllers/jobController.js
const { Job } = require('../models');
const { JOB_STATUSES } = require('../config/constants');

const getJobs = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user.id };
    if (status) {
      filter.status = status;
    }

    const jobs = await Job.findAll({
      where: filter,
      order: [['updatedAt', 'DESC']]
    });

    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

const createJob = async (req, res, next) => {
  try {
    const { companyName, positionTitle, jobUrl, location, workType, salaryRange, status, deadline, appliedDate, notes, contactPerson } = req.body;

    if (!companyName || !positionTitle) {
      return res.status(400).json({ success: false, message: 'companyName and positionTitle are required.' });
    }

    const job = await Job.create({
      userId: req.user.id,
      companyName,
      positionTitle,
      jobUrl,
      location,
      workType: workType || 'Remote',
      salaryRange,
      status: status || JOB_STATUSES.WISHLIST,
      deadline,
      appliedDate: appliedDate || (status === JOB_STATUSES.APPLIED ? new Date() : null),
      notes,
      contactPerson
    });

    res.status(201).json({ success: true, message: 'Job application tracked', job });
  } catch (error) {
    next(error);
  }
};

const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const fields = ['companyName', 'positionTitle', 'jobUrl', 'location', 'workType', 'salaryRange', 'status', 'deadline', 'appliedDate', 'notes', 'contactPerson'];
    for (const f of fields) {
      if (req.body[f] !== undefined) {
        job[f] = req.body[f];
      }
    }

    await job.save();

    res.json({ success: true, message: 'Job updated successfully', job });
  } catch (error) {
    next(error);
  }
};

const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !Object.values(JOB_STATUSES).includes(status)) {
      return res.status(400).json({ success: false, message: 'Valid status is required.' });
    }

    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    job.status = status;
    if (status === JOB_STATUSES.APPLIED && !job.appliedDate) {
      job.appliedDate = new Date();
    }
    await job.save();

    res.json({ success: true, message: `Status updated to ${status}`, job });
  } catch (error) {
    next(error);
  }
};

const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    await job.destroy();

    res.json({ success: true, message: 'Job application removed.' });
  } catch (error) {
    next(error);
  }
};

const getJobStats = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({ where: { userId: req.user.id } });

    const stats = {
      total: jobs.length,
      wishlist: jobs.filter(j => j.status === JOB_STATUSES.WISHLIST).length,
      applied: jobs.filter(j => j.status === JOB_STATUSES.APPLIED).length,
      interviewing: jobs.filter(j => j.status === JOB_STATUSES.INTERVIEWING).length,
      offer: jobs.filter(j => j.status === JOB_STATUSES.OFFER).length,
      rejected: jobs.filter(j => j.status === JOB_STATUSES.REJECTED).length,
      responseRate: 0
    };

    const activeOrFinished = stats.applied + stats.interviewing + stats.offer + stats.rejected;
    if (activeOrFinished > 0) {
      stats.responseRate = Math.round(((stats.interviewing + stats.offer) / activeOrFinished) * 100);
    }

    res.json({ success: true, stats });
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
