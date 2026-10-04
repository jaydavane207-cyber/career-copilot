// backend/controllers/studyController.js
const { StudyPlan } = require('../models');
const { generatePlan } = require('../utils/studyPlanGenerator');

/**
 * POST /api/study-plan/create (and /generate)
 * createPlan(userId, { targetRole, hoursPerWeek, targetDate })
 */
const createPlan = async (req, res, next) => {
  try {
    const { targetRole, hoursPerWeek, targetDate, durationWeeks } = req.body;
    const roleName = targetRole || req.user.targetRole || 'Frontend Developer';
    const hours = parseInt(hoursPerWeek || 15, 10);

    const generated = generatePlan(roleName, hours, targetDate);

    // Deactivate previous active plans for this user
    await StudyPlan.update({ isActive: false }, { where: { userId: req.user.id } });

    const newPlan = await StudyPlan.create({
      userId: req.user.id,
      title: generated.title,
      targetRole: generated.targetRole,
      durationWeeks: generated.durationWeeks,
      hoursPerWeek: generated.hoursPerWeek,
      targetDate: generated.targetDate,
      dailyTasks: generated.dailyTasks,
      weeklyModules: generated.weeklyModules,
      progress: 0.0,
      status: 'active',
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Study plan generated and saved successfully!',
      plan: newPlan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/study-plan
 * getPlan(userId): Get active plan from database, return plan object
 */
const getPlan = async (req, res, next) => {
  try {
    let plan = await StudyPlan.findOne({
      where: { userId: req.user.id, isActive: true },
      order: [['createdAt', 'DESC']]
    });

    if (!plan) {
      plan = await StudyPlan.findOne({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });
    }

    res.json({
      success: true,
      plan: plan || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/study-plan/:taskId/complete (and PUT /:id/task)
 * completeDayTask(userId, taskId):
 * - Mark task as completed
 * - Set completedAt timestamp
 * - Return updated plan
 */
const completeDayTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId || req.body.taskId;

    const plan = await StudyPlan.findOne({
      where: { userId: req.user.id, isActive: true },
      order: [['createdAt', 'DESC']]
    }) || await StudyPlan.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    if (!plan) {
      return res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: 'No study plan found for user.'
      });
    }

    let dailyTasks = JSON.parse(JSON.stringify(plan.dailyTasks || []));
    let weeklyModules = JSON.parse(JSON.stringify(plan.weeklyModules || []));
    let found = false;

    // Toggle or complete in dailyTasks
    dailyTasks = dailyTasks.map(t => {
      if (t.id === taskId) {
        found = true;
        const newCompleted = !t.completed;
        return {
          ...t,
          completed: newCompleted,
          completedAt: newCompleted ? new Date().toISOString() : null
        };
      }
      return t;
    });

    // Also update in weeklyModules
    weeklyModules = weeklyModules.map(mod => {
      if (Array.isArray(mod.dailyTasks)) {
        const updatedTasks = mod.dailyTasks.map(t => {
          if (t.id === taskId) {
            found = true;
            const newCompleted = !t.completed;
            return {
              ...t,
              completed: newCompleted,
              completedAt: newCompleted ? new Date().toISOString() : null
            };
          }
          return t;
        });
        return { ...mod, dailyTasks: updatedTasks };
      }
      return mod;
    });

    // If task was not in flat dailyTasks, flatten from weeklyModules
    if (!found) {
      for (const mod of weeklyModules) {
        if (Array.isArray(mod.dailyTasks)) {
          for (const t of mod.dailyTasks) {
            if (t.id === taskId) {
              found = true;
              t.completed = !t.completed;
              t.completedAt = t.completed ? new Date().toISOString() : null;
            }
          }
        }
      }
    }

    // Recalculate progress percentage
    let totalCount = 0;
    let completedCount = 0;

    for (const mod of weeklyModules) {
      if (Array.isArray(mod.dailyTasks)) {
        for (const t of mod.dailyTasks) {
          totalCount++;
          if (t.completed) completedCount++;
        }
      }
    }

    if (totalCount === 0 && dailyTasks.length > 0) {
      totalCount = dailyTasks.length;
      completedCount = dailyTasks.filter(t => t.completed).length;
    }

    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    plan.dailyTasks = dailyTasks;
    plan.weeklyModules = weeklyModules;
    plan.progress = progress;
    await plan.save();

    res.json({
      success: true,
      message: 'Task status updated successfully',
      progress,
      completedCount,
      totalCount,
      plan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/study-plan/progress
 * getProgress(userId):
 * - Get completed tasks count
 * - Get total tasks
 * - Calculate progress percentage
 * - Check if on track
 * - Return progress object
 */
const getProgress = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({
      where: { userId: req.user.id, isActive: true },
      order: [['createdAt', 'DESC']]
    }) || await StudyPlan.findOne({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    if (!plan) {
      return res.json({
        success: true,
        progress: {
          completedTasks: 0,
          totalTasks: 0,
          percentage: 0,
          isOnTrack: true,
          status: 'no_plan',
          targetDate: null,
          daysRemaining: 0
        }
      });
    }

    let totalTasks = 0;
    let completedTasks = 0;

    const modules = plan.weeklyModules || [];
    for (const mod of modules) {
      if (Array.isArray(mod.dailyTasks)) {
        for (const t of mod.dailyTasks) {
          totalTasks++;
          if (t.completed) completedTasks++;
        }
      }
    }

    if (totalTasks === 0 && Array.isArray(plan.dailyTasks)) {
      totalTasks = plan.dailyTasks.length;
      completedTasks = plan.dailyTasks.filter(t => t.completed).length;
    }

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let daysRemaining = 0;
    if (plan.targetDate) {
      const targetTime = new Date(plan.targetDate).getTime();
      daysRemaining = Math.max(0, Math.round((targetTime - Date.now()) / (1000 * 3600 * 24)));
    }

    const isOnTrack = percentage >= 20 || daysRemaining > 14;

    res.json({
      success: true,
      progress: {
        completedTasks,
        totalTasks,
        percentage,
        progress: percentage,
        isOnTrack,
        status: plan.status || 'active',
        targetDate: plan.targetDate,
        daysRemaining
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/study-plan/pause
 * pausePlan(userId): Set status to paused
 */
const pausePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({
      where: { userId: req.user.id, isActive: true }
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Active study plan not found.' });
    }

    plan.status = 'paused';
    await plan.save();

    res.json({
      success: true,
      message: 'Study plan paused.',
      status: 'paused',
      plan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/study-plan/resume
 * resumePlan(userId): Set status to active
 */
const resumePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({
      where: { userId: req.user.id, isActive: true }
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Active study plan not found.' });
    }

    plan.status = 'active';
    await plan.save();

    res.json({
      success: true,
      message: 'Study plan resumed.',
      status: 'active',
      plan
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/study-plan/history
 */
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

/**
 * DELETE /api/study-plan/:id
 */
const deletePlan = async (req, res, next) => {
  try {
    const plan = await StudyPlan.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Study plan not found.' });
    }
    await plan.destroy();
    res.json({ success: true, message: 'Study plan deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlan,
  createOrGeneratePlan: createPlan,
  getPlan,
  getActivePlan: getPlan,
  completeDayTask,
  getProgress,
  pausePlan,
  resumePlan,
  getPlanHistory,
  deletePlan
};
