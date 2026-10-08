// backend/routes/resume.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authenticate = require('../middleware/auth');
const { uploadResumeMiddleware } = require('../middleware/fileUpload');
const { requireQuota } = require('../middleware/subscriptionGate');

// All resume routes require authentication
router.use(authenticate);

// Resume upload (PDF file, max 5MB, format checked, quota enforced)
router.post('/upload', requireQuota('resume_scan'), uploadResumeMiddleware, resumeController.uploadResume);

// Resume analysis against Job Description
router.post('/analyze', resumeController.analyzeResume);

// Analysis history
router.get('/history', resumeController.getHistory);
router.delete('/history/:analysisId', resumeController.deleteAnalysis);

// Specific resume operations
router.get('/:id', resumeController.getResumeById);
router.delete('/:id', resumeController.deleteResume);

// AI Resume Feedback & Improvement (Gemini API)
router.post('/:id/ai-feedback', resumeController.generateAIFeedback);
router.get('/:id/ai-feedback', resumeController.getAIFeedback);
router.get('/:id/improved', resumeController.getImprovedResume);
router.get('/:id/improved/download', resumeController.downloadImprovedResume);

module.exports = router;
