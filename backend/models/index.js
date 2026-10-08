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
const OAuthProfile = require('./OAuthProfile');
const Subscription = require('./Subscription');
const {
  SuccessStory,
  StoryComment,
  StoryUpvote,
  StoryReport
} = require('./SuccessStory');
const { LeaderboardEntry } = require('./Leaderboard');
const { UserBadge, UserAchievement } = require('./Badge');
const {
  Company,
  CompanyInterviewQuestion,
  CompanySalaryData,
  CompanyReview,
  CompanySuccessStory,
  CompanyInterviewProcess,
  CompanyCultureValue,
  UserCompanyPreparation
} = require('./Company');

// Associations: User -> Personal Models
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes', onDelete: 'CASCADE' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(OAuthProfile, { foreignKey: 'userId', as: 'oauthProfiles', onDelete: 'CASCADE' });
OAuthProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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

User.hasMany(Subscription, { foreignKey: 'userId', as: 'subscriptions', onDelete: 'CASCADE' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Associations: Company -> Sub-models
Company.hasMany(CompanyInterviewQuestion, { foreignKey: 'company_id', as: 'questions', onDelete: 'CASCADE' });
CompanyInterviewQuestion.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(CompanySalaryData, { foreignKey: 'company_id', as: 'salaryData', onDelete: 'CASCADE' });
CompanySalaryData.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(CompanyReview, { foreignKey: 'company_id', as: 'reviews', onDelete: 'CASCADE' });
CompanyReview.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(CompanySuccessStory, { foreignKey: 'company_id', as: 'successStories', onDelete: 'CASCADE' });
CompanySuccessStory.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(CompanyInterviewProcess, { foreignKey: 'company_id', as: 'interviewProcesses', onDelete: 'CASCADE' });
CompanyInterviewProcess.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(CompanyCultureValue, { foreignKey: 'company_id', as: 'cultureValues', onDelete: 'CASCADE' });
CompanyCultureValue.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

Company.hasMany(UserCompanyPreparation, { foreignKey: 'company_id', as: 'preparations', onDelete: 'CASCADE' });
UserCompanyPreparation.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// User -> Company Preparations, Reviews & Stories
User.hasMany(CompanyReview, { foreignKey: 'user_id', as: 'companyReviews', onDelete: 'SET NULL' });
CompanyReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(CompanySuccessStory, { foreignKey: 'user_id', as: 'companySuccessStories', onDelete: 'SET NULL' });
CompanySuccessStory.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserCompanyPreparation, { foreignKey: 'user_id', as: 'companyPreparations', onDelete: 'CASCADE' });
UserCompanyPreparation.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Associations: Role -> Skills Curriculum (role_id foreign key)
Role.hasMany(Skill, { foreignKey: 'roleId', as: 'roleSkills', onDelete: 'CASCADE' });
Role.hasMany(Skill, { foreignKey: 'roleId', as: 'skills', onDelete: 'CASCADE' });
Skill.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

// Feature 7 Associations: Success Stories & Community
User.hasMany(SuccessStory, { foreignKey: 'user_id', as: 'authoredStories', onDelete: 'SET NULL' });
SuccessStory.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

Company.hasMany(SuccessStory, { foreignKey: 'company_id', as: 'communityStories', onDelete: 'SET NULL' });
SuccessStory.belongsTo(Company, { foreignKey: 'company_id', as: 'companyDetails' });

SuccessStory.hasMany(StoryComment, { foreignKey: 'story_id', as: 'comments', onDelete: 'CASCADE' });
StoryComment.belongsTo(SuccessStory, { foreignKey: 'story_id', as: 'story' });

User.hasMany(StoryComment, { foreignKey: 'user_id', as: 'userComments', onDelete: 'CASCADE' });
StoryComment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

SuccessStory.hasMany(StoryUpvote, { foreignKey: 'story_id', as: 'upvotes', onDelete: 'CASCADE' });
StoryUpvote.belongsTo(SuccessStory, { foreignKey: 'story_id', as: 'story' });

User.hasMany(UserBadge, { foreignKey: 'user_id', as: 'badges', onDelete: 'CASCADE' });
UserBadge.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserAchievement, { foreignKey: 'user_id', as: 'achievements', onDelete: 'CASCADE' });
UserAchievement.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(LeaderboardEntry, { foreignKey: 'user_id', as: 'leaderboardEntries', onDelete: 'CASCADE' });
LeaderboardEntry.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Feature 8 Associations: Career Analytics
const {
  ApplicationAnalytics,
  SkillPerformanceAnalytics,
  SalaryAnalytics,
  StudyEffectivenessAnalytics,
  PreparationRoiAnalytics,
  PlatformAnalytics,
  UserComparison,
  syncColumns: syncAnalyticsColumns
} = require('./Analytics');

User.hasOne(ApplicationAnalytics, { foreignKey: 'user_id', as: 'applicationAnalytics', onDelete: 'CASCADE' });
ApplicationAnalytics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(SkillPerformanceAnalytics, { foreignKey: 'user_id', as: 'skillAnalytics', onDelete: 'CASCADE' });
SkillPerformanceAnalytics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(SalaryAnalytics, { foreignKey: 'user_id', as: 'salaryAnalytics', onDelete: 'CASCADE' });
SalaryAnalytics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasOne(StudyEffectivenessAnalytics, { foreignKey: 'user_id', as: 'studyEffectiveness', onDelete: 'CASCADE' });
StudyEffectivenessAnalytics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(PreparationRoiAnalytics, { foreignKey: 'user_id', as: 'preparationRoi', onDelete: 'CASCADE' });
PreparationRoiAnalytics.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(UserComparison, { foreignKey: 'user_id', as: 'comparisons', onDelete: 'CASCADE' });
UserComparison.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Ensure custom columns are synchronized whenever sequelize.sync() is executed
sequelize.afterSync(async () => {
  try {
    if (User && User.syncColumns) await User.syncColumns();
    if (Subscription && Subscription.syncColumns) await Subscription.syncColumns();
    if (OAuthProfile && OAuthProfile.syncColumns) await OAuthProfile.syncColumns();
    if (Resume && Resume.syncColumns) await Resume.syncColumns();
    if (Job && Job.syncColumns) await Job.syncColumns();
    if (CodingProblem && CodingProblem.syncColumns) await CodingProblem.syncColumns();
    if (MockInterview && MockInterview.syncColumns) await MockInterview.syncColumns();
    if (Skill && Skill.syncColumns) await Skill.syncColumns();
    if (StudyPlan && StudyPlan.syncColumns) await StudyPlan.syncColumns();
    if (SuccessStory && SuccessStory.syncColumns) await SuccessStory.syncColumns();
    if (UserBadge && UserBadge.syncColumns) await UserBadge.syncColumns();
    if (UserAchievement && UserAchievement.syncColumns) await UserAchievement.syncColumns();
    if (LeaderboardEntry && LeaderboardEntry.syncColumns) await LeaderboardEntry.syncColumns();
    if (syncAnalyticsColumns) await syncAnalyticsColumns();
  } catch (e) {
    // ignore
  }
});

module.exports = {
  sequelize,
  User,
  Subscription,
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
  CodingTopic,
  OAuthProfile,
  Company,
  CompanyInterviewQuestion,
  CompanySalaryData,
  CompanyReview,
  CompanySuccessStory,
  CompanyInterviewProcess,
  CompanyCultureValue,
  UserCompanyPreparation,
  SuccessStory,
  StoryComment,
  StoryUpvote,
  StoryReport,
  LeaderboardEntry,
  UserBadge,
  UserAchievement,
  ApplicationAnalytics,
  SkillPerformanceAnalytics,
  SalaryAnalytics,
  StudyEffectivenessAnalytics,
  PreparationRoiAnalytics,
  PlatformAnalytics,
  UserComparison
};

