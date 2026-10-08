// backend/routes/company.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const companyController = require('../controllers/companyController');

// Helper middleware for optional authentication
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

/**
 * Public Routes
 */

// Route 1: GET /api/company/all - Get all companies with stats & filtering
router.get('/all', companyController.getAllCompanies);

// Route: GET /api/company/user/preparations - Active preparations for logged-in user
router.get('/user/preparations', authenticate, companyController.getUserPreparations);

// Route 8: POST /api/company/prepare - Start or update company prep plan
router.post('/prepare', authenticate, companyController.startCompanyPreparation);

// Route 10: PUT /api/company/prepare/:prepId/progress - Update prep progress
router.put('/prepare/:prepId/progress', authenticate, companyController.updatePreparationProgress);

// Route: POST /api/company/practice-answer - Submit answer for practice question
router.post('/practice-answer', optionalAuth, companyController.submitQuestionPractice);

// Route 11: GET /api/company/:id/process/:role - Interview process for specific role
router.get('/:id/process/:role', companyController.getCompanyInterviewRounds);

// Route 7: GET /api/company/:id/interview-process - Interview process breakdown
router.get('/:id/interview-process', companyController.getCompanyInterviewRounds);

// Route 3: GET /api/company/:id/questions - Interview questions by role/category
router.get('/:id/questions', companyController.getCompanyQuestionsByRole);

// Route 4: GET /api/company/:id/salary - Salary benchmarks by role & location
router.get('/:id/salary', companyController.getCompanySalaryData);

// Route 5: GET /api/company/:id/success-stories - Verified user success stories
router.get('/:id/success-stories', companyController.getSuccessStories);

// Route 6: GET /api/company/:id/reviews - Employee reviews and culture metrics
router.get('/:id/reviews', companyController.getCompanyReviews);

// Route 9: GET /api/company/:id/personalized-questions - Tailored practice set
router.get('/:id/personalized-questions', authenticate, companyController.getPersonalizedInterviewQuestions);

// Route 2: GET /api/company/:id - Company overview and comprehensive details
router.get('/:id', companyController.getCompanyDetails);

module.exports = router;
