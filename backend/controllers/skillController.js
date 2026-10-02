// backend/controllers/skillController.js
const { Skill } = require('../models');
const rolesData = require('../seeds/roles.json');
const skillsCatalog = require('../seeds/skills.json');
const resourcesData = require('../seeds/resources.json');

const getRoles = (req, res) => {
  res.json({ success: true, roles: rolesData });
};

const getCatalog = (req, res) => {
  res.json({ success: true, skills: skillsCatalog });
};

const getMySkills = async (req, res, next) => {
  try {
    const userSkills = await Skill.findAll({
      where: { userId: req.user.id },
      order: [['skillName', 'ASC']]
    });
    res.json({ success: true, skills: userSkills });
  } catch (error) {
    next(error);
  }
};

const assessSkill = async (req, res, next) => {
  try {
    const { skillName, proficiency, yearsOfExperience, category } = req.body;

    if (!skillName) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    let skill = await Skill.findOne({
      where: { userId: req.user.id, skillName }
    });

    if (skill) {
      skill.proficiency = proficiency || skill.proficiency;
      skill.yearsOfExperience = yearsOfExperience !== undefined ? yearsOfExperience : skill.yearsOfExperience;
      if (category) skill.category = category;
      await skill.save();
    } else {
      skill = await Skill.create({
        userId: req.user.id,
        skillName,
        proficiency: proficiency || 'Intermediate',
        yearsOfExperience: yearsOfExperience || 1.0,
        category: category || 'General'
      });
    }

    res.json({ success: true, message: 'Skill saved successfully', skill });
  } catch (error) {
    next(error);
  }
};

const getGapAnalysis = async (req, res, next) => {
  try {
    const targetRoleName = req.query.role || req.user.targetRole || 'Fullstack Developer';

    const role = rolesData.find(
      r => r.title.toLowerCase() === targetRoleName.toLowerCase()
    ) || rolesData[0];

    const userSkills = await Skill.findAll({
      where: { userId: req.user.id }
    });

    const userSkillNames = userSkills.map(s => s.skillName.toLowerCase());

    const mastered = [];
    const missing = [];

    for (const requiredSkill of role.coreSkills) {
      const found = userSkills.find(s => s.skillName.toLowerCase() === requiredSkill.toLowerCase());
      if (found) {
        mastered.push({
          name: requiredSkill,
          proficiency: found.proficiency,
          yearsOfExperience: found.yearsOfExperience
        });
      } else {
        missing.push({
          name: requiredSkill,
          resources: resourcesData[requiredSkill] || [
            { title: `${requiredSkill} Documentation & Guides`, type: 'Documentation', url: `https://www.google.com/search?q=${encodeURIComponent(requiredSkill + ' tutorial')}`, free: true }
          ]
        });
      }
    }

    const coveragePercentage = Math.round((mastered.length / role.coreSkills.length) * 100);

    res.json({
      success: true,
      role: role.title,
      description: role.description,
      coveragePercentage,
      totalRequired: role.coreSkills.length,
      masteredSkills: mastered,
      missingSkills: missing
    });
  } catch (error) {
    next(error);
  }
};

const getResources = (req, res) => {
  const { skillName } = req.params;
  const list = resourcesData[skillName] || [];
  res.json({ success: true, skill: skillName, resources: list });
};

module.exports = {
  getRoles,
  getCatalog,
  getMySkills,
  assessSkill,
  getGapAnalysis,
  getResources
};
