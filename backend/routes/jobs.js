// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

// Backend stats endpoint: Total applications, Applications in each stage, Conversion rate, Average days between stages
router.get('/stats', jobController.getJobStats);

// REST Job endpoints
router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.put('/:id', jobController.updateJob);
router.patch('/:id/status', jobController.updateJobStatus);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
