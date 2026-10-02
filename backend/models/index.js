// backend/models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const Resume = require('./Resume');
const Job = require('./Job');
const Skill = require('./Skill');
const StudyPlan = require('./StudyPlan');
const CodingProblem = require('./CodingProblem');
const MockInterview = require('./MockInterview');

// Setup Associations
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes', onDelete: 'CASCADE' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Job, { foreignKey: 'userId', as: 'jobs', onDelete: 'CASCADE' });
Job.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Skill, { foreignKey: 'userId', as: 'skills', onDelete: 'CASCADE' });
Skill.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(StudyPlan, { foreignKey: 'userId', as: 'studyPlans', onDelete: 'CASCADE' });
StudyPlan.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(CodingProblem, { foreignKey: 'userId', as: 'codingProblems', onDelete: 'CASCADE' });
CodingProblem.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(MockInterview, { foreignKey: 'userId', as: 'mockInterviews', onDelete: 'CASCADE' });
MockInterview.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Resume,
  Job,
  Skill,
  StudyPlan,
  CodingProblem,
  MockInterview
};
