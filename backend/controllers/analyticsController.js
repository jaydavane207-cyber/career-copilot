// backend/controllers/analyticsController.js
const {
  calculateApplicationFunnel,
  analyzeSkillPerformance,
  calculateStudyEffectiveness,
  calculatePreparationROI,
  analyzeSalaryTrends,
  compareToPlatformAverage,
  generateRecommendations,
  predictFutureOutcomes
} = require('../utils/analyticsCalculator');

const {
  getSkillDemandMarket,
  getMarketSalaryData,
  getPlatformAverages
} = require('../utils/analyticsQueries');

/**
 * 1. GET /api/analytics/dashboard
 * Aggregates complete analytics suite for user
 */
const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      funnel,
      skills,
      study,
      salary,
      roi,
      comparisons,
      recommendations,
      predictions,
      marketSkills
    ] = await Promise.all([
      calculateApplicationFunnel(userId),
      analyzeSkillPerformance(userId),
      calculateStudyEffectiveness(userId),
      analyzeSalaryTrends(userId),
      calculatePreparationROI(userId),
      compareToPlatformAverage(userId),
      generateRecommendations(userId),
      predictFutureOutcomes(userId),
      getSkillDemandMarket(10)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        funnel,
        skills,
        study,
        salary,
        roi,
        comparisons,
        recommendations,
        predictions,
        marketPreview: marketSkills
      }
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve analytics dashboard data',
      error: error.message
    });
  }
};

/**
 * 2. GET /api/analytics/funnel
 * Application pipeline funnel breakdown and conversion rates
 */
const getFunnelData = async (req, res) => {
  try {
    const userId = req.user.id;
    const funnel = await calculateApplicationFunnel(userId);
    return res.status(200).json({
      success: true,
      data: funnel
    });
  } catch (error) {
    console.error('Error in getFunnelData:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve application funnel data',
      error: error.message
    });
  }
};

/**
 * 3. GET /api/analytics/skills
 * Skill performance analysis with sorting (success_rate | weakest | most_improved)
 */
const getSkillAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const sort = req.query.sort || 'success_rate';
    const analysis = await analyzeSkillPerformance(userId);

    let list = [...analysis.skills];
    if (sort === 'weakest') {
      list.sort((a, b) => a.success_rate - b.success_rate);
    } else if (sort === 'most_improved') {
      list.sort((a, b) => b.vs_platform_avg - a.vs_platform_avg);
    } else {
      list.sort((a, b) => b.success_rate - a.success_rate);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...analysis,
        skills: list
      }
    });
  } catch (error) {
    console.error('Error in getSkillAnalysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve skill performance analytics',
      error: error.message
    });
  }
};

/**
 * 4. GET /api/analytics/study
 * Study effectiveness, velocity, readiness trajectory
 */
const getStudyAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const study = await calculateStudyEffectiveness(userId);
    return res.status(200).json({
      success: true,
      data: study
    });
  } catch (error) {
    console.error('Error in getStudyAnalysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve study effectiveness data',
      error: error.message
    });
  }
};

/**
 * 5. GET /api/analytics/salary
 * Salary analysis, offers history, negotiation gains
 */
const getSalaryAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const salary = await analyzeSalaryTrends(userId);
    return res.status(200).json({
      success: true,
      data: salary
    });
  } catch (error) {
    console.error('Error in getSalaryAnalysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve salary trends analytics',
      error: error.message
    });
  }
};

/**
 * 6. GET /api/analytics/roi
 * Preparation ROI per hour studied
 */
const getROIAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const roi = await calculatePreparationROI(userId);
    return res.status(200).json({
      success: true,
      data: roi
    });
  } catch (error) {
    console.error('Error in getROIAnalysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve preparation ROI analysis',
      error: error.message
    });
  }
};

/**
 * 7. GET /api/analytics/market/skills
 * Market demand ranking, job count, salary premium
 */
const getMarketSkills = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const skills = await getSkillDemandMarket(limit);
    return res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    console.error('Error in getMarketSkills:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve market skill demand',
      error: error.message
    });
  }
};

/**
 * 8. GET /api/analytics/market/salary
 * Market salary percentiles (25th, 50th, 75th, 90th)
 */
const getMarketSalary = async (req, res) => {
  try {
    const role = req.query.role || 'Senior SDE';
    const location = req.query.location || 'Mountain View, CA';
    const salaryData = await getMarketSalaryData(role, location);
    return res.status(200).json({
      success: true,
      data: salaryData
    });
  } catch (error) {
    console.error('Error in getMarketSalary:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve market salary data',
      error: error.message
    });
  }
};

/**
 * 9. GET /api/analytics/compare
 * Compare user vs platform benchmarks
 */
const getComparisonMetrics = async (req, res) => {
  try {
    const userId = req.user.id;
    const metric = req.query.metric || null;
    const comparisons = await compareToPlatformAverage(userId, metric);
    return res.status(200).json({
      success: true,
      data: comparisons
    });
  } catch (error) {
    console.error('Error in getComparisonMetrics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve comparison metrics',
      error: error.message
    });
  }
};

/**
 * 10. GET /api/analytics/recommendations
 * Prioritized high-impact suggestions
 */
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recs = await generateRecommendations(userId);
    return res.status(200).json({
      success: true,
      data: recs
    });
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recommendations',
      error: error.message
    });
  }
};

/**
 * 11. GET /api/analytics/predictions
 * 3-Month outcome projections
 */
const getPredictions = async (req, res) => {
  try {
    const userId = req.user.id;
    const preds = await predictFutureOutcomes(userId);
    return res.status(200).json({
      success: true,
      data: preds
    });
  } catch (error) {
    console.error('Error in getPredictions:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve predictions',
      error: error.message
    });
  }
};

/**
 * 12. GET /api/analytics/export
 * Export full analytics report as PDF or structured JSON / Excel payload
 */
const exportAnalyticsReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const format = req.query.format || 'pdf';

    const [
      funnel,
      skills,
      study,
      salary,
      roi,
      recommendations,
      predictions
    ] = await Promise.all([
      calculateApplicationFunnel(userId),
      analyzeSkillPerformance(userId),
      calculateStudyEffectiveness(userId),
      analyzeSalaryTrends(userId),
      calculatePreparationROI(userId),
      generateRecommendations(userId),
      predictFutureOutcomes(userId)
    ]);

    const reportTimestamp = new Date().toISOString().split('T')[0];
    const fileName = `Career_Analytics_Report_${reportTimestamp}.${format === 'excel' ? 'xlsx' : 'pdf'}`;

    return res.status(200).json({
      success: true,
      message: `Analytics report generated successfully (${format.toUpperCase()})`,
      file_name: fileName,
      file_url: `/api/analytics/export/download?file=${fileName}`,
      report_data: {
        generated_at: new Date().toISOString(),
        candidate: req.user.name || 'Candidate',
        role: req.user.targetRole || 'Software Engineer',
        executive_summary: {
          offer_rate: `${funnel.overall_offer_rate}%`,
          platform_avg_offer_rate: `${funnel.platform_avg_offer_rate}%`,
          avg_salary: `$${salary.avg_final_offer.toLocaleString()}`,
          study_hours: `${study.total_hours} hrs`,
          efficiency: study.efficiency_rating
        },
        funnel,
        top_skills: skills.skills.slice(0, 5),
        salary_negotiation: {
          avg_increase: `$${salary.avg_negotiation.toLocaleString()}`,
          increase_percentage: `${salary.negotiation_percentage}%`
        },
        preparation_roi: roi.skills_by_roi,
        prioritized_recommendations: recommendations,
        three_month_projections: predictions
      }
    });
  } catch (error) {
    console.error('Error in exportAnalyticsReport:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate analytics export',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getFunnelData,
  getSkillAnalysis,
  getStudyAnalysis,
  getSalaryAnalysis,
  getROIAnalysis,
  getMarketSkills,
  getMarketSalary,
  getComparisonMetrics,
  getRecommendations,
  getPredictions,
  exportAnalyticsReport
};
