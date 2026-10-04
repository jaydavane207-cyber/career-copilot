// backend/utils/studyPlanGenerator.js
const { v4: uuidv4 } = require('uuid');
const rolesData = require('../seeds/roles.json');
const resourcesData = require('../seeds/resources.json');

/**
 * generatePlan(targetRole, hoursPerWeek, targetDate)
 * - Gets all skills for targetRole
 * - Calculates days until targetDate
 * - Calculates total hours needed
 * - Distributes skills across weeks (3 skills per week)
 * - Creates daily tasks (1-3 hours/day, distributed Mon-Fri)
 * - Attaches learning resources for each skill
 * - Returns plan object with dailyTasks array
 */
const generatePlan = (targetRole = 'Frontend Developer', hoursPerWeek = 15, targetDate) => {
  const roleName = targetRole || 'Frontend Developer';
  const role = rolesData.find(r =>
    r.title.toLowerCase() === roleName.toLowerCase() ||
    r.title.toLowerCase().includes(roleName.toLowerCase())
  ) || rolesData[0];

  const skillsList = Array.isArray(role.coreSkills) && role.coreSkills.length > 0
    ? role.coreSkills
    : ['JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Data Structures', 'System Design', 'Testing'];

  // Calculate days until targetDate
  let daysUntilTarget = 56; // default 8 weeks (56 days)
  if (targetDate) {
    const targetTime = new Date(targetDate).getTime();
    const now = Date.now();
    const diff = Math.round((targetTime - now) / (1000 * 3600 * 24));
    if (diff > 7) {
      daysUntilTarget = diff;
    }
  }

  const durationWeeks = Math.max(1, Math.min(24, Math.round(daysUntilTarget / 7)));
  const totalHours = hoursPerWeek * durationWeeks;
  const hoursPerDay = Math.max(1, Math.min(4, Math.round(hoursPerWeek / 5)));

  const weeklyModules = [];
  const allDailyTasks = [];

  const skillsPerWeek = Math.max(1, Math.ceil(skillsList.length / durationWeeks));

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  for (let w = 1; w <= durationWeeks; w++) {
    const startIndex = (w - 1) * skillsPerWeek;
    const weekSkills = skillsList.slice(startIndex, startIndex + skillsPerWeek);
    if (weekSkills.length === 0) {
      weekSkills.push(skillsList[w % skillsList.length] || 'Core Architecture');
    }

    const primarySkill = weekSkills[0] || 'Core Concepts';
    const primaryResources = resourcesData[primarySkill] || [
      {
        title: `${primarySkill} Guides`,
        url: `https://devdocs.io/#q=${encodeURIComponent(primarySkill)}`
      }
    ];

    const weekDailyTasks = weekDays.map((dayName, dIdx) => {
      const taskSkill = weekSkills[dIdx % weekSkills.length] || primarySkill;
      const skillResources = resourcesData[taskSkill] || primaryResources;

      const taskTemplates = [
        `Study foundational concepts and review documentation for ${taskSkill}`,
        `Write code samples and implement mini-exercise utilizing ${taskSkill}`,
        `Solve 2 algorithmic or architecture problem scenarios focused on ${taskSkill}`,
        `Integrate ${taskSkill} into your active hands-on portfolio milestone`,
        `Review performance, test edge cases, and commit changes for ${taskSkill}`
      ];

      const taskId = uuidv4();
      const taskObj = {
        id: taskId,
        week: w,
        day: dayName,
        dayName,
        task: taskTemplates[dIdx] || `Practice ${taskSkill}`,
        skill: taskSkill,
        skillName: taskSkill,
        hours: `${hoursPerDay}h`,
        hoursNum: hoursPerDay,
        resources: skillResources,
        completed: false,
        completedAt: null
      };

      allDailyTasks.push(taskObj);
      return taskObj;
    });

    weeklyModules.push({
      week: w,
      title: `Week ${w}: Mastery of ${weekSkills.join(' & ')}`,
      focusSkills: weekSkills,
      allocatedHours: hoursPerWeek,
      dailyTasks: weekDailyTasks
    });
  }

  return {
    title: `${durationWeeks}-Week Plan to Become ${roleName}`,
    targetRole: roleName,
    durationWeeks,
    hoursPerWeek,
    targetDate: targetDate || new Date(Date.now() + daysUntilTarget * 24 * 3600 * 1000).toISOString().split('T')[0],
    totalHours,
    dailyTasks: allDailyTasks,
    weeklyModules,
    progress: 0.0,
    status: 'active',
    isActive: true
  };
};

/**
 * adjustPlanForMissedDays(plan, missedDays)
 * - Calculates remaining days
 * - If behind: redistributes tasks to catch up
 * - Extends targetDate if needed
 * - Returns adjusted plan
 */
const adjustPlanForMissedDays = (plan, missedDays = 1) => {
  if (!plan) return null;
  const currentPlan = JSON.parse(JSON.stringify(plan));

  if (missedDays > 0 && currentPlan.targetDate) {
    const currentDate = new Date(currentPlan.targetDate);
    currentDate.setDate(currentDate.getDate() + missedDays);
    currentPlan.targetDate = currentDate.toISOString().split('T')[0];
  }

  return currentPlan;
};

module.exports = {
  generatePlan,
  generateStudyPlan: generatePlan,
  adjustPlanForMissedDays
};
