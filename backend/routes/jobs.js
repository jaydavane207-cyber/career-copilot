// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authenticate = require('../middleware/auth');

router.use(authenticate);

router.get('/', jobController.getJobs);
router.post('/', jobController.createJob);
router.get('/stats', jobController.getJobStats);
router.put('/:id', jobController.updateJob);
router.patch('/:id/status', jobController.updateJobStatus);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
