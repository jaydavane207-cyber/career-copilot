// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// 1. Comprehensive Dashboard
router.get('/dashboard', authenticate, analyticsController.getDashboardData);

// 2. Application Funnel Analysis
router.get('/funnel', authenticate, analyticsController.getFunnelData);

// 3. Skill Performance Analysis (?sort=success_rate|weakest|most_improved)
router.get('/skills', authenticate, analyticsController.getSkillAnalysis);

// 4. Study Effectiveness Metrics
router.get('/study', authenticate, analyticsController.getStudyAnalysis);

// 5. Salary Analytics & Trends
router.get('/salary', authenticate, analyticsController.getSalaryAnalysis);

// 6. Preparation ROI Analysis
router.get('/roi', authenticate, analyticsController.getROIAnalysis);

// 7. Market Skill Demand Trends (Public)
router.get('/market/skills', analyticsController.getMarketSkills);

// 8. Market Salary Benchmarks (Public)
router.get('/market/salary', analyticsController.getMarketSalary);

// 9. Comparison to Platform Average (?metric=offer_rate|salary|study_hours)
router.get('/compare', authenticate, analyticsController.getComparisonMetrics);

// 10. Prioritized Recommendations
router.get('/recommendations', authenticate, analyticsController.getRecommendations);

// 11. 3-Month Outcome Predictions
router.get('/predictions', authenticate, analyticsController.getPredictions);

// 12. Export Analytics Report (?format=pdf|excel)
router.get('/export', authenticate, analyticsController.exportAnalyticsReport);

module.exports = router;
