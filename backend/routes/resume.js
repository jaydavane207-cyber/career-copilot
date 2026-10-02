// backend/routes/resume.js
const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const authenticate = require('../middleware/auth');
const { uploadResume } = require('../middleware/fileUpload');

router.use(authenticate);

router.post('/upload', uploadResume.single('resume'), resumeController.uploadResume);
router.post('/analyze', resumeController.analyzeResume);
router.get('/history', resumeController.getHistory);
router.get('/:id', resumeController.getResumeById);
router.delete('/:id', resumeController.deleteResume);

module.exports = router;
