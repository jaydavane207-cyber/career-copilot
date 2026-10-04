// backend/controllers/skillController.js
const { Skill, Role, Resource, PopularCompany, CodingTopic } = require('../models');
const rolesData = require('../seeds/roles.json');
const skillsCatalog = require('../seeds/skills.json');
const resourcesData = require('../seeds/resources.json');
const popularCompaniesData = require('../seeds/popularCompanies.json');
const codingTopicsData = require('../seeds/codingTopics.json');

/**
 * GET /api/skills/roles
 * Returns 20 target tech roles in India with compensation and location benchmarks
 */
const getRoles = async (req, res, next) => {
  try {
    const rolesFromDb = await Role.findAll({ order: [['title', 'ASC']] });
    if (rolesFromDb && rolesFromDb.length > 0) {
      return res.json({ success: true, count: rolesFromDb.length, roles: rolesFromDb });
    }
    res.json({ success: true, count: rolesData.length, roles: rolesData });
  } catch (error) {
    res.json({ success: true, count: rolesData.length, roles: rolesData });
  }
};

/**
 * GET /api/skills/role/:roleId
 * Returns detailed skill curriculum for a specific target role
 */
const getRoleSkills = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const skills = await Skill.findAll({
      where: { roleId, userId: null },
      order: [['isOptional', 'ASC'], ['requiredLevel', 'DESC']]
    });

    if (skills && skills.length > 0) {
      return res.json({ success: true, roleId, count: skills.length, skills });
    }

    // Fallback to JSON fixture
    const matched = skillsCatalog.filter(s => s.roleId === roleId);
    res.json({ success: true, roleId, count: matched.length, skills: matched });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/skills/catalog
 * Returns general skills catalog
 */
const getCatalog = (req, res) => {
  res.json({ success: true, count: skillsCatalog.length, skills: skillsCatalog });
};

/**
 * GET /api/skills/companies
 * Returns popular tech companies hiring in India with rounds & LPA salaries
 */
const getCompanies = async (req, res, next) => {
  try {
    const companiesFromDb = await PopularCompany.findAll({ order: [['tier', 'ASC'], ['name', 'ASC']] });
    if (companiesFromDb && companiesFromDb.length > 0) {
      return res.json({ success: true, count: companiesFromDb.length, companies: companiesFromDb });
    }
    res.json({ success: true, count: popularCompaniesData.length, companies: popularCompaniesData });
  } catch (error) {
    res.json({ success: true, count: popularCompaniesData.length, companies: popularCompaniesData });
  }
};

/**
 * GET /api/skills/coding-topics
 * Returns 20 core DSA problem topics with benchmark problems
 */
const getCodingTopics = async (req, res, next) => {
  try {
    const topicsFromDb = await CodingTopic.findAll();
    if (topicsFromDb && topicsFromDb.length > 0) {
      return res.json({ success: true, count: topicsFromDb.length, topics: topicsFromDb });
    }
    res.json({ success: true, count: codingTopicsData.length, topics: codingTopicsData });
  } catch (error) {
    res.json({ success: true, count: codingTopicsData.length, topics: codingTopicsData });
  }
};

/**
 * GET /api/skills/my-skills
 * Returns current authenticated user's assessed skills
 */
const getMySkills = async (req, res, next) => {
  try {
    const userSkills = await Skill.findAll({
      where: { userId: req.user.id },
      order: [['skillName', 'ASC']]
    });
    res.json({ success: true, count: userSkills.length, skills: userSkills });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/skills/assess
 * Records or updates a skill self-assessment for the authenticated user
 */
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

/**
 * GET /api/skills/gap-analysis
 * Analyzes candidate's assessed skills against target role curriculum
 */
const getGapAnalysis = async (req, res, next) => {
  try {
    const targetRoleName = req.query.role || req.user.targetRole || 'Full Stack Developer';

    const normalizedTarget = targetRoleName.toLowerCase().replace(/[^a-z0-9]/g, '');

    const role = rolesData.find(r => {
      const normTitle = r.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normId = r.id.toLowerCase().replace(/[^a-z0-9]/g, '');
      return normTitle.includes(normalizedTarget) || normalizedTarget.includes(normTitle) || normId.includes(normalizedTarget);
    }) || rolesData[0];

    const userSkills = await Skill.findAll({
      where: { userId: req.user.id }
    });

    const mastered = [];
    const missing = [];

    const coreSkillList = Array.isArray(role.coreSkills) ? role.coreSkills : [];

    for (const requiredSkill of coreSkillList) {
      const found = userSkills.find(s => {
        const sName = (s.skillName || '').toLowerCase().trim();
        const rName = requiredSkill.toLowerCase().trim();
        return sName === rName || rName.includes(sName) || sName.includes(rName);
      });

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
            {
              title: `${requiredSkill} Documentation & Guides`,
              type: 'Documentation',
              url: `https://www.google.com/search?q=${encodeURIComponent(requiredSkill + ' tutorial')}`,
              free: true
            }
          ]
        });
      }
    }

    const totalRequired = coreSkillList.length || 1;
    const coveragePercentage = Math.round((mastered.length / totalRequired) * 100);

    res.json({
      success: true,
      role: role.title,
      description: role.description,
      coveragePercentage,
      totalRequired,
      masteredSkills: mastered,
      missingSkills: missing
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/skills/resources/:skillName
 * Returns curated learning links for a specific skill
 */
const getResources = async (req, res, next) => {
  try {
    const { skillName } = req.params;
    // Query Resource table first
    const dbResources = await Resource.findAll({
      where: { skill: skillName }
    });

    if (dbResources && dbResources.length > 0) {
      return res.json({ success: true, skill: skillName, count: dbResources.length, resources: dbResources });
    }

    const list = resourcesData[skillName] || [];
    res.json({ success: true, skill: skillName, count: list.length, resources: list });
  } catch (error) {
    const list = resourcesData[req.params.skillName] || [];
    res.json({ success: true, skill: req.params.skillName, count: list.length, resources: list });
  }
};

module.exports = {
  getRoles,
  getRoleSkills,
  getCatalog,
  getCompanies,
  getCodingTopics,
  getMySkills,
  assessSkill,
  getGapAnalysis,
  getResources
};
