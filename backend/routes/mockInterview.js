// backend/routes/mockInterview.js
const express = require('express');
const router = express.Router();
const mockInterviewController = require('../controllers/mockInterviewController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.post('/start', mockInterviewController.startSession);
router.post('/submit', mockInterviewController.submitSession);
router.get('/history', mockInterviewController.getHistory);
router.get('/:id', mockInterviewController.getSessionById);

module.exports = router;
