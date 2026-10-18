// backend/controllers/interviewController.js
const { Op } = require('sequelize');
const { Interview, InterviewPrepLog, Job, Company } = require('../models');
const { generatePrepPlanForInterview } = require('../utils/interviewPrepAutomation');
const { analyzeAnswer } = require('../utils/interviewAnswerAnalyzer');

/**
 * 1) createInterview(userId, data)
 * Validates date/time and required fields, associates job and company, and creates record.
 */
const createInterview = async (userId, data) => {
  const {
    jobId,
    job_id,
    companyId,
    company_id,
    companyName,
    company_name,
    roleTitle,
    role_title,
    stage = 'Round 1',
    interviewType = 'technical',
    interview_type,
    mode = 'online',
    location,
    interviewDatetime,
    interview_datetime,
    durationMinutes = 60,
    duration_minutes,
    meetLink,
    meet_link,
    notes,
    status = 'upcoming'
  } = data || {};

  const resolvedCompany = (companyName || company_name || '').trim();
  const resolvedRole = (roleTitle || role_title || '').trim();
  const resolvedDatetime = interviewDatetime || interview_datetime;

  if (!resolvedCompany) {
    const error = new Error('Company name is required');
    error.statusCode = 400;
    throw error;
  }

  if (!resolvedRole) {
    const error = new Error('Role title is required');
    error.statusCode = 400;
    throw error;
  }

  if (!resolvedDatetime) {
    const error = new Error('Interview date and time is required');
    error.statusCode = 400;
    throw error;
  }

  const parsedDate = new Date(resolvedDatetime);
  if (isNaN(parsedDate.getTime())) {
    const error = new Error('Invalid interview date and time format');
    error.statusCode = 400;
    throw error;
  }

  let finalCompanyId = companyId || company_id || null;
  // If companyId was not provided, look up by name in the companies table
  if (!finalCompanyId && resolvedCompany) {
    try {
      const match = await Company.findOne({
        where: {
          name: { [Op.like]: `%${resolvedCompany}%` }
        }
      });
      if (match) {
        finalCompanyId = match.id;
      }
    } catch (e) {
      // ignore
    }
  }

  const interview = await Interview.create({
    userId,
    jobId: jobId || job_id || null,
    companyId: finalCompanyId,
    companyName: resolvedCompany,
    roleTitle: resolvedRole,
    stage: stage || 'Round 1',
    interviewType: interviewType || interview_type || 'technical',
    mode: mode || 'online',
    location: location || null,
    interviewDatetime: parsedDate,
    durationMinutes: parseInt(durationMinutes ?? duration_minutes ?? 60, 10) || 60,
    meetLink: meetLink || meet_link || null,
    status: status || 'upcoming',
    notes: notes || null
  });

  return interview;
};

/**
 * 2) getInterviews(userId, fromDate?, toDate?)
 * Retrieves interviews filtered by optional date range, or returns all upcoming and recent past.
 */
const getInterviews = async (userId, fromDate, toDate) => {
  const where = { userId };

  if (fromDate && toDate) {
    where.interview_datetime = {
      [Op.between]: [new Date(fromDate), new Date(toDate)]
    };
  } else if (fromDate) {
    where.interview_datetime = {
      [Op.gte]: new Date(fromDate)
    };
  } else if (toDate) {
    where.interview_datetime = {
      [Op.lte]: new Date(toDate)
    };
  }

  const interviews = await Interview.findAll({
    where,
    order: [['interview_datetime', 'ASC']],
    include: [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'companyName', 'jobTitle', 'stage', 'jobLink'],
        required: false
      },
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'logo_url', 'website'],
        required: false
      },
      {
        model: InterviewPrepLog,
        as: 'prepLogs',
        required: false
      }
    ]
  });

  return interviews;
};

/**
 * 3) getUpcomingInterviews(userId, limit = 5)
 * Returns next N upcoming interviews (status = 'upcoming' and interview_datetime >= now - 2h)
 */
const getUpcomingInterviews = async (userId, limit = 5) => {
  const parsedLimit = parseInt(limit, 10) || 5;
  // Allow an ongoing interview up to 2 hours in the past to remain in upcoming view
  const recentCutoff = new Date(Date.now() - 2 * 60 * 60 * 1000);

  const upcoming = await Interview.findAll({
    where: {
      userId,
      status: 'upcoming',
      interview_datetime: {
        [Op.gte]: recentCutoff
      }
    },
    order: [['interview_datetime', 'ASC']],
    limit: parsedLimit,
    include: [
      {
        model: Job,
        as: 'job',
        attributes: ['id', 'companyName', 'jobTitle', 'stage', 'jobLink'],
        required: false
      },
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name', 'logo_url'],
        required: false
      },
      {
        model: InterviewPrepLog,
        as: 'prepLogs',
        required: false
      }
    ]
  });

  return upcoming;
};

/**
 * 4) updateInterview(userId, interviewId, updates)
 * Updates interview fields with authorization check
 */
const updateInterview = async (userId, interviewId, updates) => {
  const interview = await Interview.findOne({
    where: { id: interviewId, userId }
  });

  if (!interview) {
    const error = new Error('Interview not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
    'companyName',
    'company_name',
    'roleTitle',
    'role_title',
    'stage',
    'interviewType',
    'interview_type',
    'mode',
    'location',
    'interviewDatetime',
    'interview_datetime',
    'durationMinutes',
    'duration_minutes',
    'meetLink',
    'meet_link',
    'status',
    'notes',
    'jobId',
    'job_id',
    'companyId',
    'company_id'
  ];

  const payload = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === 'interviewDatetime' || field === 'interview_datetime') {
        payload.interviewDatetime = new Date(updates[field]);
      } else if (field === 'durationMinutes' || field === 'duration_minutes') {
        payload.durationMinutes = parseInt(updates[field], 10) || 60;
      } else {
        payload[field] = updates[field];
      }
    }
  });

  await interview.update(payload);
  return interview;
};

/**
 * 5) deleteInterview(userId, interviewId)
 * Hard-deletes interview for user
 */
const deleteInterview = async (userId, interviewId) => {
  const interview = await Interview.findOne({
    where: { id: interviewId, userId }
  });

  if (!interview) {
    const error = new Error('Interview not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  await interview.destroy();
  return { deleted: true, id: interviewId };
};

/**
 * 6) logPrepTask(userId, interviewId, taskData)
 * Inserts a completed prep task into interview_prep_logs
 */
const logPrepTask = async (userId, interviewId, taskData) => {
  const interview = await Interview.findOne({
    where: { id: interviewId, userId }
  });

  if (!interview) {
    const error = new Error('Interview not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  const { taskType, task_type, description } = taskData || {};

  if (!taskType && !task_type) {
    const error = new Error('Task type is required');
    error.statusCode = 400;
    throw error;
  }

  const log = await InterviewPrepLog.create({
    userId,
    interviewId,
    taskType: taskType || task_type,
    description: description || 'Prep task completed',
    completedAt: new Date()
  });

  return log;
};

/**
 * 7) getInterviewPrepLogs(userId, interviewId)
 * Returns all logs for an interview ordered by completed_at DESC
 */
const getInterviewPrepLogs = async (userId, interviewId) => {
  const interview = await Interview.findOne({
    where: { id: interviewId, userId }
  });

  if (!interview) {
    const error = new Error('Interview not found or unauthorized');
    error.statusCode = 404;
    throw error;
  }

  const logs = await InterviewPrepLog.findAll({
    where: { interviewId },
    order: [['completed_at', 'DESC']]
  });

  return logs;
};

// ============================================================================
// EXPRESS CONTROLLER HANDLERS
// ============================================================================

const handleCreateInterview = async (req, res, next) => {
  try {
    const interview = await createInterview(req.user.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: interview
    });
  } catch (error) {
    next(error);
  }
};

const handleGetInterviews = async (req, res, next) => {
  try {
    const { from, to, fromDate, toDate } = req.query;
    const interviews = await getInterviews(req.user.id, from || fromDate, to || toDate);
    res.json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (error) {
    next(error);
  }
};

const handleGetUpcomingInterviews = async (req, res, next) => {
  try {
    const limit = req.query.limit || 5;
    const upcoming = await getUpcomingInterviews(req.user.id, limit);
    res.json({
      success: true,
      count: upcoming.length,
      data: upcoming
    });
  } catch (error) {
    next(error);
  }
};

const handleUpdateInterview = async (req, res, next) => {
  try {
    const updated = await updateInterview(req.user.id, req.params.id, req.body);
    res.json({
      success: true,
      message: 'Interview updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

const handleDeleteInterview = async (req, res, next) => {
  try {
    const result = await deleteInterview(req.user.id, req.params.id);
    res.json({
      success: true,
      message: 'Interview deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const handleLogPrepTask = async (req, res, next) => {
  try {
    const log = await logPrepTask(req.user.id, req.params.id, req.body);
    res.status(201).json({
      success: true,
      message: 'Prep task logged successfully',
      data: log
    });
  } catch (error) {
    next(error);
  }
};

const handleGetInterviewPrepLogs = async (req, res, next) => {
  try {
    const logs = await getInterviewPrepLogs(req.user.id, req.params.id);
    res.json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

const handleGetPrepPlan = async (req, res, next) => {
  try {
    const interview = await Interview.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    const plan = await generatePrepPlanForInterview(req.user.id, interview);
    res.json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

const handleAnswerFeedback = async (req, res, next) => {
  try {
    const { question, answer, role, company } = req.body;
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: 'Question and answer are required'
      });
    }

    const feedback = await analyzeAnswer(question, answer, role || req.user?.targetRole, company);
    res.json({
      success: true,
      data: feedback
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Core business methods
  createInterview,
  getInterviews,
  getUpcomingInterviews,
  updateInterview,
  deleteInterview,
  logPrepTask,
  getInterviewPrepLogs,
  // Express handlers
  handleCreateInterview,
  handleGetInterviews,
  handleGetUpcomingInterviews,
  handleUpdateInterview,
  handleDeleteInterview,
  handleLogPrepTask,
  handleGetInterviewPrepLogs,
  handleGetPrepPlan,
  handleAnswerFeedback
};
