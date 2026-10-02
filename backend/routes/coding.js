// backend/routes/coding.js
const express = require('express');
const router = express.Router();
const codingController = require('../controllers/codingController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', codingController.getProblems);
router.post('/', codingController.logProblem);
router.get('/stats', codingController.getCodingStats);
router.get('/weak-topics', codingController.getWeakTopics);
router.put('/:id', codingController.updateProblem);
router.delete('/:id', codingController.deleteProblem);

module.exports = router;
