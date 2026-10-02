// backend/routes/studyPlan.js
const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', studyController.getActivePlan);
router.post('/generate', studyController.createOrGeneratePlan);
router.put('/:id/task', studyController.toggleTaskCompletion);
router.get('/history', studyController.getPlanHistory);
router.delete('/:id', studyController.deletePlan);

module.exports = router;
