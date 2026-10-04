// backend/routes/skills.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const authenticate = require('../middleware/auth');

// Public catalog and role benchmark endpoints
router.get('/roles', skillController.getRoles);
router.get('/role/:roleId', skillController.getRoleSkills);
router.get('/catalog', skillController.getCatalog);
router.get('/companies', skillController.getCompanies);
router.get('/coding-topics', skillController.getCodingTopics);
router.get('/resources/:skillName', skillController.getResources);

// Protected candidate skill assessment and gap analysis endpoints
router.use(authenticate);
router.get('/my-skills', skillController.getMySkills);
router.post('/assess', skillController.assessSkills);
router.get('/gap/:roleId', skillController.getGapAnalysis);
router.get('/gap-analysis', skillController.getGapAnalysis);

module.exports = router;
