// backend/routes/interviews.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  handleCreateInterview,
  handleGetInterviews,
  handleGetUpcomingInterviews,
  handleUpdateInterview,
  handleDeleteInterview,
  handleLogPrepTask,
  handleGetInterviewPrepLogs,
  handleGetPrepPlan,
  handleAnswerFeedback
} = require('../controllers/interviewController');

// All interview endpoints require authenticated session
router.use(authenticate);

// 1. Upcoming interviews
router.get('/upcoming', handleGetUpcomingInterviews);

// 2. AI Answer Feedback (behavioral/technical evaluation)
router.post('/answer-feedback', handleAnswerFeedback);

// 3. Main CRUD
router.post('/', handleCreateInterview);
router.get('/', handleGetInterviews);
router.put('/:id', handleUpdateInterview);
router.delete('/:id', handleDeleteInterview);

// 4. Prep Logs and Smart Prep Plan
router.post('/:id/prep-log', handleLogPrepTask);
router.get('/:id/prep-log', handleGetInterviewPrepLogs);
router.get('/:id/prep-plan', handleGetPrepPlan);

module.exports = router;
