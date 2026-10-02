// backend/utils/studyPlanGenerator.js
const { v4: uuidv4 } = require('uuid');

const generateStudyPlan = (targetRole, missingSkills = [], durationWeeks = 4, hoursPerWeek = 10) => {
  const weeks = Math.max(1, Math.min(12, durationWeeks));
  const skillsToDistribute = missingSkills.length > 0 ? missingSkills : ['Core Architecture', 'Data Structures', 'System Design', 'Testing'];

  const weeklyModules = [];
  const skillsPerWeek = Math.ceil(skillsToDistribute.length / weeks);

  for (let w = 1; w <= weeks; w++) {
    const startIndex = (w - 1) * skillsPerWeek;
    const weekSkills = skillsToDistribute.slice(startIndex, startIndex + skillsPerWeek);
    const primaryTopic = weekSkills.length > 0 ? weekSkills.join(' & ') : 'Consolidation & Practice Projects';

    weeklyModules.push({
      week: w,
      title: `Week ${w}: Mastery of ${primaryTopic}`,
      focusSkills: weekSkills,
      allocatedHours: hoursPerWeek,
      dailyTasks: [
        {
          id: uuidv4(),
          day: 'Monday',
          task: `Deep dive into official documentation and fundamentals of ${weekSkills[0] || 'core concepts'}`,
          completed: false
        },
        {
          id: uuidv4(),
          day: 'Tuesday',
          task: `Implement 2 practical code examples or mini-features using ${weekSkills[0] || 'targeted tools'}`,
          completed: false
        },
        {
          id: uuidv4(),
          day: 'Wednesday',
          task: `Study architectural design patterns and best practices for ${primaryTopic}`,
          completed: false
        },
        {
          id: uuidv4(),
          day: 'Thursday',
          task: `Solve 2 relevant algorithmic or system design questions related to ${primaryTopic}`,
          completed: false
        },
        {
          id: uuidv4(),
          day: 'Friday',
          task: `Integrate ${primaryTopic} into portfolio project and write comprehensive unit tests`,
          completed: false
        },
        {
          id: uuidv4(),
          day: 'Weekend',
          task: `Conduct self-review and complete a simulated 30-minute mock interview session`,
          completed: false
        }
      ]
    });
  }

  return {
    title: `${targetRole} Accelerator Plan (${weeks} Weeks)`,
    targetRole,
    durationWeeks: weeks,
    hoursPerWeek,
    weeklyModules,
    progress: 0.0,
    isActive: true
  };
};

module.exports = {
  generateStudyPlan
};
