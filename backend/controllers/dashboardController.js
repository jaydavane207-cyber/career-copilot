// backend/controllers/dashboardController.js
const { calculateReadinessScore } = require('../utils/readinessCalculator');

/**
 * GET /api/dashboard
 * Return all unified dashboard data in one call
 */
const getDashboard = async (req, res, next) => {
  try {
    const data = await calculateReadinessScore(req.user.id, req.user.targetRole);
    res.json({
      success: true,
      readinessScore: data.readinessScore,
      targetRole: data.targetRole,
      readinessLabel: data.readinessLabel,
      resumeScore: data.resumeScore,
      skillGapScore: data.skillGapScore,
      studyProgress: data.studyProgress,
      interviewScore: data.interviewScore,
      timeEstimate: data.timeEstimate,
      nextActions: data.nextActions,
      nextSteps: data.nextSteps,
      summary: data.summary,
      breakdown: data.breakdown,
      chartStackedData: data.chartStackedData,
      recommendations: data.recommendations,
      recentActivities: data.recentActivities,
      // Backwards compatibility for existing components
      metrics: data.metrics,
      recentJobs: data.recentJobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/dashboard/readiness-score
 * Calculate weighted readiness score
 */
const getReadinessScoreEndpoint = async (req, res, next) => {
  try {
    const data = await calculateReadinessScore(req.user.id, req.user.targetRole);
    res.json({
      success: true,
      readinessScore: data.readinessScore,
      targetRole: data.targetRole,
      readinessLabel: data.readinessLabel,
      resumeScore: data.resumeScore,
      skillGapScore: data.skillGapScore,
      studyProgress: data.studyProgress,
      interviewScore: data.interviewScore,
      nextActions: data.nextActions,
      summary: data.summary
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Legacy alias for GET /api/dashboard/summary
 */
const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await calculateReadinessScore(req.user.id, req.user.targetRole);
    res.json({
      success: true,
      readinessScore: data.readinessScore,
      targetRole: data.targetRole,
      readinessLabel: data.readinessLabel,
      resumeScore: data.resumeScore,
      skillGapScore: data.skillGapScore,
      studyProgress: data.studyProgress,
      interviewScore: data.interviewScore,
      timeEstimate: data.timeEstimate,
      nextActions: data.nextActions,
      nextSteps: data.nextSteps,
      summary: data.summary,
      breakdown: data.breakdown,
      chartStackedData: data.chartStackedData,
      recommendations: data.recommendations,
      recentActivities: data.recentActivities,
      metrics: data.metrics,
      recentJobs: data.recentJobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Legacy alias for GET /api/dashboard/readiness
 */
const getReadinessScore = async (req, res, next) => {
  return getReadinessScoreEndpoint(req, res, next);
};

module.exports = {
  getDashboard,
  getReadinessScoreEndpoint,
  getDashboardSummary,
  getReadinessScore
};
