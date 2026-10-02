// backend/routes/skills.js
const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const authenticate = require('../middleware/auth');

router.get('/roles', skillController.getRoles);
router.get('/catalog', skillController.getCatalog);
router.get('/resources/:skillName', skillController.getResources);

router.use(authenticate);

router.get('/my-skills', skillController.getMySkills);
router.post('/assess', skillController.assessSkill);
router.get('/gap-analysis', skillController.getGapAnalysis);

module.exports = router;
