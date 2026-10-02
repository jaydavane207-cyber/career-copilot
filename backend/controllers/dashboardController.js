// backend/controllers/dashboardController.js
const { calculateReadinessScore } = require('../utils/readinessCalculator');
const { Job, CodingProblem, StudyPlan, Resume, Skill } = require('../models');

const getReadinessScore = async (req, res, next) => {
  try {
    const result = await calculateReadinessScore(req.user.id, req.user.targetRole);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [readiness, jobs, codingCount, activePlan, skillsCount] = await Promise.all([
      calculateReadinessScore(userId, req.user.targetRole),
      Job.findAll({ where: { userId }, order: [['updatedAt', 'DESC']], limit: 5 }),
      CodingProblem.count({ where: { userId } }),
      StudyPlan.findOne({ where: { userId, isActive: true } }),
      Skill.count({ where: { userId } })
    ]);

    const activeInterviews = jobs.filter(j => j.status === 'Interviewing').length;
    const appliedJobs = jobs.filter(j => j.status === 'Applied').length;

    // Next recommended actionable steps
    const nextSteps = [];
    if (readiness.breakdown.resume.score < 70) {
      nextSteps.push({
        id: 'step-1',
        title: 'Optimize Resume Keywords',
        description: 'Upload your latest resume to analyze ATS keyword coverage for your target role.',
        actionUrl: '/resume',
        priority: 'High'
      });
    }

    if (skillsCount < 6) {
      nextSteps.push({
        id: 'step-2',
        title: 'Complete Skill Audit',
        description: 'Log and verify your current skills to identify missing competencies.',
        actionUrl: '/skills',
        priority: 'High'
      });
    }

    if (codingCount < 10) {
      nextSteps.push({
        id: 'step-3',
        title: 'Daily Coding Practice',
        description: 'Solve 1 Medium difficulty problem in dynamic programming or graphs today.',
        actionUrl: '/coding',
        priority: 'Medium'
      });
    }

    if (readiness.breakdown.interview.sessionsCompleted < 2) {
      nextSteps.push({
        id: 'step-4',
        title: 'Run a Mock Interview',
        description: 'Practice 5 simulated behavioral and technical questions to boost interview confidence.',
        actionUrl: '/mock-interview',
        priority: 'Medium'
      });
    }

    res.json({
      success: true,
      summary: {
        targetRole: req.user.targetRole,
        readinessScore: readiness.totalReadiness,
        readinessBreakdown: readiness.breakdown,
        metrics: {
          activeInterviews,
          appliedJobs,
          totalTrackedJobs: jobs.length,
          codingProblemsSolved: codingCount,
          activeStudyPlanProgress: activePlan ? activePlan.progress : 0
        },
        recentJobs: jobs,
        nextSteps
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReadinessScore,
  getDashboardSummary
};
