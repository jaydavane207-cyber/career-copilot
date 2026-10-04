// backend/routes/studyPlan.js
const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// Protected Study Plan Endpoints
router.post('/create', studyController.createPlan);
router.post('/generate', studyController.createPlan);
router.get('/', studyController.getPlan);
router.get('/progress', studyController.getProgress);
router.put('/pause', studyController.pausePlan);
router.put('/resume', studyController.resumePlan);
router.put('/:taskId/complete', studyController.completeDayTask);
router.put('/:id/task', studyController.completeDayTask);
router.get('/history', studyController.getPlanHistory);
router.delete('/:id', studyController.deletePlan);

module.exports = router;
