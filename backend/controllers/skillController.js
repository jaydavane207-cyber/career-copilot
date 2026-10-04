// backend/controllers/skillController.js
const { Skill, Role, Resource, PopularCompany, CodingTopic } = require('../models');
const rolesData = require('../seeds/roles.json');
const skillsCatalog = require('../seeds/skills.json');
const resourcesData = require('../seeds/resources.json');
const popularCompaniesData = require('../seeds/popularCompanies.json');
const codingTopicsData = require('../seeds/codingTopics.json');

/**
 * GET /api/skills/roles
 * Query all roles from roles table. For each role, attach associated curriculum skills.
 * Returns array of roles with skills.
 */
const getRoles = async (req, res, next) => {
  try {
    let roles = await Role.findAll({ order: [['title', 'ASC']] });

    if (!roles || roles.length === 0) {
      roles = rolesData;
    }

    // Attach associated skills to each role
    const allBenchmarkSkills = await Skill.findAll({
      where: { userId: null },
      order: [['isOptional', 'ASC'], ['requiredLevel', 'DESC']]
    }).catch(() => []);

    const enrichedRoles = roles.map(r => {
      const rJson = r.toJSON ? r.toJSON() : { ...r };
      const roleId = rJson.id;
      const roleTitle = rJson.title;

      let associatedSkills = allBenchmarkSkills.filter(s => s.roleId === roleId);

      if (associatedSkills.length === 0) {
        associatedSkills = skillsCatalog.filter(s => s.roleId === roleId);
      }

      if (associatedSkills.length === 0 && rJson.coreSkills) {
        associatedSkills = rJson.coreSkills.map(name => ({
          skillName: name,
          name,
          category: 'Core',
          requiredLevel: 75
        }));
      }

      return {
        ...rJson,
        skills: associatedSkills.map(s => s.toJSON ? s.toJSON() : s)
      };
    });

    res.json({
      success: true,
      count: enrichedRoles.length,
      roles: enrichedRoles
    });
  } catch (error) {
    console.error('❌ [skillController] getRoles error:', error);
    res.json({
      success: true,
      count: rolesData.length,
      roles: rolesData
    });
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

    const matched = skillsCatalog.filter(s => s.roleId === roleId);
    res.json({ success: true, roleId, count: matched.length, skills: matched });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/skills/assess (protected)
 * Body: { roleId, assessmentData } or { skillName, proficiency, yearsOfExperience, category }
 * - For each skill in assessmentData:
 *   * Check if already assessed (update or insert)
 *   * Insert/update into skills table
 * - Calculate gaps for each skill (requiredLevel - userLevel)
 * - Return assessment result with all gaps
 */
const assessSkills = async (req, res, next) => {
  try {
    const { roleId, assessmentData, skillName, proficiency, yearsOfExperience, category, userLevel } = req.body;
    const userId = req.user.id;

    // Support single skill assessment payload
    if (skillName && !Array.isArray(assessmentData)) {
      const levelNum = userLevel !== undefined
        ? parseInt(userLevel, 10)
        : (proficiency === 'Expert' ? 95 : proficiency === 'Advanced' ? 85 : proficiency === 'Intermediate' ? 65 : 40);

      let skill = await Skill.findOne({
        where: { userId, skillName }
      });

      if (skill) {
        skill.proficiency = proficiency || skill.proficiency;
        skill.userLevel = levelNum;
        skill.assessedAt = new Date();
        if (yearsOfExperience !== undefined) skill.yearsOfExperience = yearsOfExperience;
        if (category) skill.category = category;
        if (roleId) skill.roleId = roleId;
        await skill.save();
      } else {
        skill = await Skill.create({
          userId,
          roleId: roleId || null,
          skillName,
          userLevel: levelNum,
          proficiency: proficiency || 'Intermediate',
          yearsOfExperience: yearsOfExperience || 1.0,
          category: category || 'General',
          assessedAt: new Date()
        });
      }

      return res.json({
        success: true,
        message: 'Skill assessed successfully',
        skill
      });
    }

    // Support bulk assessmentData: [{ skillName: "React", userLevel: 60 }, ...]
    if (!Array.isArray(assessmentData) || assessmentData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'assessmentData must be an array of skill assessments.'
      });
    }

    // Fetch role's benchmark skills to determine required levels
    let benchmarkSkills = [];
    if (roleId) {
      benchmarkSkills = await Skill.findAll({
        where: { roleId, userId: null }
      });
      if (benchmarkSkills.length === 0) {
        benchmarkSkills = skillsCatalog.filter(s => s.roleId === roleId);
      }
    }

    const results = [];
    const gaps = [];

    for (const item of assessmentData) {
      const sName = (item.skillName || item.name || '').trim();
      if (!sName) continue;

      const uLevel = Math.min(100, Math.max(0, parseInt(item.userLevel ?? item.level ?? 50, 10)));
      const benchmark = benchmarkSkills.find(b =>
        (b.skillName || b.name || '').toLowerCase() === sName.toLowerCase()
      );
      const reqLevel = benchmark ? (benchmark.requiredLevel || 75) : 75;
      const gap = Math.max(0, reqLevel - uLevel);

      let prof = 'Intermediate';
      if (uLevel >= 85) prof = 'Advanced';
      else if (uLevel >= 60) prof = 'Intermediate';
      else if (uLevel >= 30) prof = 'Beginner';
      else prof = 'Beginner';

      let userSkill = await Skill.findOne({
        where: { userId, skillName: sName }
      });

      if (userSkill) {
        userSkill.userLevel = uLevel;
        userSkill.requiredLevel = reqLevel;
        userSkill.roleId = roleId || userSkill.roleId;
        userSkill.proficiency = item.proficiency || prof;
        userSkill.assessedAt = new Date();
        await userSkill.save();
      } else {
        userSkill = await Skill.create({
          userId,
          roleId: roleId || null,
          skillName: sName,
          userLevel: uLevel,
          requiredLevel: reqLevel,
          proficiency: item.proficiency || prof,
          category: benchmark ? benchmark.category : 'General',
          assessedAt: new Date()
        });
      }

      results.push(userSkill);
      gaps.push({
        skillName: sName,
        userLevel: uLevel,
        requiredLevel: reqLevel,
        gap,
        status: gap > 50 ? 'Critical' : gap >= 25 ? 'Medium' : 'Good'
      });
    }

    // Sort by gap descending
    gaps.sort((a, b) => b.gap - a.gap);

    res.json({
      success: true,
      message: 'Skills assessed successfully',
      roleId,
      assessedCount: results.length,
      gaps,
      skills: results
    });
  } catch (error) {
    console.error('❌ [skillController] assessSkills error:', error);
    next(error);
  }
};

/**
 * GET /api/skills/gap/:roleId (also GET /api/skills/gap-analysis)
 * - Get all skills for roleId
 * - Get user's assessments for those skills
 * - Calculate gap for each (required - user)
 * - Sort by gap descending
 * - Return array of skills with gaps
 */
const getGapAnalysis = async (req, res, next) => {
  try {
    const roleIdParam = req.params.roleId || req.query.roleId || req.query.role;
    const userId = req.user.id;

    // Find role by id or title
    let targetRole = null;
    if (roleIdParam) {
      targetRole = rolesData.find(r =>
        r.id === roleIdParam ||
        r.title.toLowerCase() === roleIdParam.toLowerCase() ||
        r.title.toLowerCase().includes(roleIdParam.toLowerCase())
      );
    }
    if (!targetRole) {
      targetRole = rolesData.find(r =>
        r.title.toLowerCase() === (req.user.targetRole || 'Fullstack Developer').toLowerCase()
      ) || rolesData[0];
    }

    const roleId = targetRole.id;

    // 1. Get benchmark skills for role
    let benchmarkSkills = await Skill.findAll({
      where: { roleId, userId: null },
      order: [['isOptional', 'ASC'], ['requiredLevel', 'DESC']]
    });

    if (!benchmarkSkills || benchmarkSkills.length === 0) {
      const fromCatalog = skillsCatalog.filter(s => s.roleId === roleId);
      if (fromCatalog.length > 0) {
        benchmarkSkills = fromCatalog;
      } else if (Array.isArray(targetRole.coreSkills)) {
        benchmarkSkills = targetRole.coreSkills.map(cs => ({
          skillName: cs,
          name: cs,
          category: 'Core',
          requiredLevel: 80
        }));
      }
    }

    // 2. Get user assessments
    const userSkills = await Skill.findAll({
      where: { userId }
    });

    const gapList = [];
    const masteredList = [];
    const missingList = [];

    for (const bSkill of benchmarkSkills) {
      const bName = (bSkill.skillName || bSkill.name || '').trim();
      const reqLevel = bSkill.requiredLevel || 75;

      const userMatch = userSkills.find(u =>
        u.skillName.toLowerCase() === bName.toLowerCase() ||
        bName.toLowerCase().includes(u.skillName.toLowerCase()) ||
        u.skillName.toLowerCase().includes(bName.toLowerCase())
      );

      let uLevel = 0;
      let userProficiency = 'Beginner';
      if (userMatch) {
        uLevel = userMatch.userLevel !== undefined ? userMatch.userLevel : 60;
        userProficiency = userMatch.proficiency || 'Intermediate';
      }

      const gap = Math.max(0, reqLevel - uLevel);
      let status = 'Good';
      if (gap > 50) status = 'Critical';
      else if (gap >= 25) status = 'Medium';

      const skillGapItem = {
        skillName: bName,
        name: bName,
        category: bSkill.category || 'General',
        userLevel: uLevel,
        userScore: uLevel,
        requiredLevel: reqLevel,
        requiredScore: reqLevel,
        gap,
        status,
        proficiency: userProficiency,
        isOptional: Boolean(bSkill.isOptional)
      };

      gapList.push(skillGapItem);

      if (uLevel >= reqLevel - 15) {
        masteredList.push(skillGapItem);
      } else {
        missingList.push({
          ...skillGapItem,
          resources: resourcesData[bName] || []
        });
      }
    }

    // Sort by gap descending
    gapList.sort((a, b) => b.gap - a.gap);

    const totalBenchmark = gapList.length || 1;
    const avgUser = gapList.reduce((acc, c) => acc + c.userLevel, 0) / totalBenchmark;
    const avgReq = gapList.reduce((acc, c) => acc + c.requiredLevel, 0) / totalBenchmark;
    const readinessPercentage = Math.min(100, Math.max(0, Math.round((avgUser / (avgReq || 1)) * 100)));

    res.json({
      success: true,
      roleId: targetRole.id,
      role: targetRole.title,
      description: targetRole.description,
      readinessPercentage,
      coveragePercentage: readinessPercentage,
      skills: gapList,
      gaps: gapList,
      masteredSkills: masteredList,
      missingSkills: missingList,
      totalSkills: gapList.length
    });
  } catch (error) {
    console.error('❌ [skillController] getGapAnalysis error:', error);
    next(error);
  }
};

/**
 * GET /api/skills/resources/:skillName
 * Find skill in resources.json / resources table, return resources object
 */
const getResources = async (req, res, next) => {
  try {
    const { skillName } = req.params;

    // Check Resource table
    const dbResources = await Resource.findAll({
      where: { skill: skillName }
    }).catch(() => []);

    if (dbResources && dbResources.length > 0) {
      return res.json({
        success: true,
        skill: skillName,
        count: dbResources.length,
        resources: dbResources
      });
    }

    // Fallback to resources.json or dynamic curated fallback
    let list = resourcesData[skillName];
    if (!list || list.length === 0) {
      // Case-insensitive lookup in resourcesData
      const key = Object.keys(resourcesData).find(k => k.toLowerCase() === skillName.toLowerCase());
      if (key) list = resourcesData[key];
    }

    if (!list || list.length === 0) {
      list = [
        {
          title: `${skillName} Official Documentation`,
          type: 'Official Docs',
          url: `https://devdocs.io/#q=${encodeURIComponent(skillName)}`,
          free: true
        },
        {
          title: `${skillName} Crash Course & Tutorial`,
          type: 'YouTube Tutorial',
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skillName + ' tutorial full course')}`,
          free: true
        },
        {
          title: `${skillName} Best Practices & Architecture`,
          type: 'Article',
          url: `https://medium.com/search?q=${encodeURIComponent(skillName + ' best practices')}`,
          free: true
        },
        {
          title: `Awesome ${skillName} GitHub Repositories`,
          type: 'GitHub Repo',
          url: `https://github.com/search?q=${encodeURIComponent(skillName + ' awesome')}&type=repositories`,
          free: true
        }
      ];
    }

    res.json({
      success: true,
      skill: skillName,
      count: list.length,
      resources: list
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/skills/my-skills
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
 * GET /api/skills/catalog
 */
const getCatalog = (req, res) => {
  res.json({ success: true, count: skillsCatalog.length, skills: skillsCatalog });
};

/**
 * GET /api/skills/companies
 */
const getCompanies = async (req, res, next) => {
  try {
    const companiesFromDb = await PopularCompany.findAll({ order: [['tier', 'ASC'], ['name', 'ASC']] }).catch(() => []);
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
 */
const getCodingTopics = async (req, res, next) => {
  try {
    const topicsFromDb = await CodingTopic.findAll().catch(() => []);
    if (topicsFromDb && topicsFromDb.length > 0) {
      return res.json({ success: true, count: topicsFromDb.length, topics: topicsFromDb });
    }
    res.json({ success: true, count: codingTopicsData.length, topics: codingTopicsData });
  } catch (error) {
    res.json({ success: true, count: codingTopicsData.length, topics: codingTopicsData });
  }
};

module.exports = {
  getRoles,
  getRoleSkills,
  assessSkills,
  assessSkill: assessSkills,
  getGapAnalysis,
  getResources,
  getMySkills,
  getCatalog,
  getCompanies,
  getCodingTopics
};
