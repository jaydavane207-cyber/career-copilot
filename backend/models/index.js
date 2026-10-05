// backend/models/index.js
const { sequelize } = require('../config/database');
const User = require('./User');
const Resume = require('./Resume');
const Job = require('./Job');
const Skill = require('./Skill');
const StudyPlan = require('./StudyPlan');
const CodingProblem = require('./CodingProblem');
const MockInterview = require('./MockInterview');
const Role = require('./Role');
const MockInterviewQuestion = require('./MockInterviewQuestion');
const Resource = require('./Resource');
const PopularCompany = require('./PopularCompany');
const CodingTopic = require('./CodingTopic');

// Associations: User -> Personal Models
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

// Associations: Role -> Skills Curriculum (role_id foreign key)
Role.hasMany(Skill, { foreignKey: 'roleId', as: 'roleSkills', onDelete: 'CASCADE' });
Role.hasMany(Skill, { foreignKey: 'roleId', as: 'skills', onDelete: 'CASCADE' });
Skill.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Ensure custom columns are synchronized whenever sequelize.sync() is executed
sequelize.afterSync(async () => {
  try {
    if (Resume && Resume.syncColumns) await Resume.syncColumns();
    if (Job && Job.syncColumns) await Job.syncColumns();
    if (CodingProblem && CodingProblem.syncColumns) await CodingProblem.syncColumns();
    if (MockInterview && MockInterview.syncColumns) await MockInterview.syncColumns();
    if (Skill && Skill.syncColumns) await Skill.syncColumns();
    if (StudyPlan && StudyPlan.syncColumns) await StudyPlan.syncColumns();
  } catch (e) {
    // ignore
  }
});

module.exports = {
  sequelize,
  User,
  Resume,
  Job,
  Skill,
  StudyPlan,
  CodingProblem,
  MockInterview,
  Role,
  MockInterviewQuestion,
  Resource,
  PopularCompany,
  CodingTopic
};
