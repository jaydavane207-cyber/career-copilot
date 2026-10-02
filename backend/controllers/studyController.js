// backend/controllers/studyController.js
const { StudyPlan, Skill } = require('../models');
const { generateStudyPlan } = require('../utils/studyPlanGenerator');
const rolesData = require('../seeds/roles.json');

const getActivePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({
      where: { userId: req.user.id, isActive: true },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};

const createOrGeneratePlan = async (req, res, next) => {
  try {
    const { targetRole, durationWeeks, hoursPerWeek, missingSkills } = req.body;
    const roleName = targetRole || req.user.targetRole || 'Fullstack Developer';

    let skillsToInclude = missingSkills;
    if (!skillsToInclude || !skillsToInclude.length) {
      // derive from user's current missing skills
      const role = rolesData.find(r => r.title.toLowerCase() === roleName.toLowerCase()) || rolesData[0];
      const userSkills = await Skill.findAll({ where: { userId: req.user.id } });
      const userSkillNames = userSkills.map(s => s.skillName.toLowerCase());
      skillsToInclude = role.coreSkills.filter(s => !userSkillNames.includes(s.toLowerCase()));
    }

    const planData = generateStudyPlan(roleName, skillsToInclude, durationWeeks || 4, hoursPerWeek || 10);

    // Deactivate prior plans
    await StudyPlan.update({ isActive: false }, { where: { userId: req.user.id } });

    const newPlan = await StudyPlan.create({
      userId: req.user.id,
      title: planData.title,
      targetRole: planData.targetRole,
      durationWeeks: planData.durationWeeks,
      hoursPerWeek: planData.hoursPerWeek,
      weeklyModules: planData.weeklyModules,
      progress: 0.0,
      isActive: true
    });

    res.status(201).json({ success: true, message: 'Custom study plan generated!', plan: newPlan });
  } catch (error) {
    next(error);
  }
};

const toggleTaskCompletion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { taskId } = req.body;

    const plan = await StudyPlan.findOne({
      where: { id, userId: req.user.id }
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    const modules = JSON.parse(JSON.stringify(plan.weeklyModules));
    for (const week of modules) {
      if (Array.isArray(week.dailyTasks)) {
        for (const t of week.dailyTasks) {
          totalTasks++;
          if (t.id === taskId) {
            t.completed = !t.completed;
          }
          if (t.completed) completedTasks++;
        }
      }
    }

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    plan.weeklyModules = modules;
    plan.progress = progress;
    await plan.save();

    res.json({ success: true, message: 'Task updated', progress, plan });
  } catch (error) {
    next(error);
  }
};

const getPlanHistory = async (req, res, next) => {
  try {
    const plans = await StudyPlan.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};

const deletePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }

    await plan.destroy();
    res.json({ success: true, message: 'Study plan removed.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getActivePlan,
  createOrGeneratePlan,
  toggleTaskCompletion,
  getPlanHistory,
  deletePlan
};
