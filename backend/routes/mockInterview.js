// backend/routes/mockInterview.js
const express = require('express');
const router = express.Router();
const mockInterviewController = require('../controllers/mockInterviewController');
const authenticate = require('../middleware/auth');

// All mock interview operations require user authentication
router.use(authenticate);

// Core Mock Interview API endpoints
router.get('/questions', mockInterviewController.getQuestions);
router.post('/submit-answer', mockInterviewController.submitAnswer);
router.post('/submit', mockInterviewController.submitAnswer); // alias for backwards compatibility
router.get('/history', mockInterviewController.getHistory);
router.get('/feedback', mockInterviewController.getFeedback);

// Legacy start route alias
router.post('/start', mockInterviewController.startSession);

// Session by ID
router.get('/:id', mockInterviewController.getSessionById);

module.exports = router;
