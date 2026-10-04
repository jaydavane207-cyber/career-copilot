// backend/routes/coding.js
const express = require('express');
const router = express.Router();
const codingController = require('../controllers/codingController');
const authenticate = require('../middleware/auth');

// Require authentication for all coding tracker endpoints
router.use(authenticate);

// Specific requested API endpoints
router.post('/log', codingController.logProblem);
router.get('/problems', codingController.getProblems);
router.get('/weak-topics', codingController.getWeakTopics);
router.get('/stats', codingController.getCodingStats);
router.get('/spaced-repetition', codingController.getSpacedRepetition);
router.post('/:id/review', codingController.reviewProblem);

// Base CRUD endpoints for flexibility and backwards compatibility
router.get('/', codingController.getProblems);
router.post('/', codingController.logProblem);
router.put('/:id', codingController.updateProblem);
router.delete('/:id', codingController.deleteProblem);

module.exports = router;
