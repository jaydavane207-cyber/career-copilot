// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/auth');

// Primary endpoints specified in requirements
router.get('/', authenticate, dashboardController.getDashboard);
router.get('/readiness-score', authenticate, dashboardController.getReadinessScoreEndpoint);

// Aliases for backwards compatibility
router.get('/readiness', authenticate, dashboardController.getReadinessScoreEndpoint);
router.get('/summary', authenticate, dashboardController.getDashboardSummary);

module.exports = router;
