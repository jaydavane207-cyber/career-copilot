// backend/routes/jobs.js
const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authenticate = require('../middleware/auth');
const { requireQuota } = require('../middleware/subscriptionGate');

router.use(authenticate);

/**
 * In-memory sliding rate limiter: 5 scrapes per minute per user
 */
const rateLimitMap = new Map();
const rateLimiter = (req, res, next) => {
  const userId = req.user ? req.user.id : req.ip;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5;

  const userRequests = rateLimitMap.get(userId) || [];
  const recentRequests = userRequests.filter(timestamp => now - timestamp < windowMs);

  if (recentRequests.length >= maxRequests) {
    const oldest = recentRequests[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait 1 minute.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfterSeconds
    });
  }

  recentRequests.push(now);
  rateLimitMap.set(userId, recentRequests);
  next();
};

// Backend stats endpoint
router.get('/stats', jobController.getJobStats);

// Real Job Postings Integration endpoints
router.post('/analyze-url', rateLimiter, jobController.analyzeJobFromURL);
router.post('/analyze', rateLimiter, jobController.analyzeJobFromURL); // compatibility alias

router.get('/suggested', jobController.suggestJobsForUser);
router.get('/search-analysis', jobController.searchMultipleJobsAnalysis);

router.get('/:id/analysis', jobController.getJobAnalysis);
router.get('/:id/preparation', jobController.getJobPreparation);
router.post('/:id/save-to-tracker', jobController.saveAnalyzedJobToTracker);

// REST Job endpoints
router.get('/', jobController.getJobs);
router.post('/', requireQuota('job_tracking'), jobController.createJob);
router.put('/:id', jobController.updateJob);
router.patch('/:id/status', jobController.updateJobStatus);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
