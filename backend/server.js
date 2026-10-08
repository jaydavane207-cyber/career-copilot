// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');
const { sequelize, testConnection } = require('./config/database');
require('./models'); // load associations

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const resumeRoutes = require('./routes/resume');
const jobsRoutes = require('./routes/jobs');
const skillsRoutes = require('./routes/skills');
const studyPlanRoutes = require('./routes/studyPlan');
const codingRoutes = require('./routes/coding');
const mockInterviewRoutes = require('./routes/mockInterview');
const dashboardRoutes = require('./routes/dashboard');
const profileRoutes = require('./routes/profile');
const companyRoutes = require('./routes/company');
const storyRoutes = require('./routes/story');
const leaderboardRoutes = require('./routes/leaderboard');
const analyticsRoutes = require('./routes/analytics');
const subscriptionRoutes = require('./routes/subscription');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Career Copilot API',
    environment: env.NODE_ENV
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/mock-interview', mockInterviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/subscription', subscriptionRoutes);

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use(errorHandler);

const PORT = env.PORT || 5000;

// Initialize Server & Database
const startServer = async () => {
  try {
    await testConnection();
    await sequelize.sync({ alter: false });
    const { User, Subscription, CodingProblem, MockInterview, Skill, StudyPlan, Resume, OAuthProfile, SuccessStory, LeaderboardEntry, UserBadge, UserAchievement } = require('./models');
    const { syncColumns: syncAnalytics } = require('./models/Analytics');
    if (User && User.syncColumns) await User.syncColumns();
    if (Subscription && Subscription.syncColumns) await Subscription.syncColumns();
    if (OAuthProfile && OAuthProfile.syncColumns) await OAuthProfile.syncColumns();
    if (Resume && Resume.syncColumns) await Resume.syncColumns();
    if (CodingProblem && CodingProblem.syncColumns) await CodingProblem.syncColumns();
    if (MockInterview && MockInterview.syncColumns) await MockInterview.syncColumns();
    if (Skill && Skill.syncColumns) await Skill.syncColumns();
    if (StudyPlan && StudyPlan.syncColumns) await StudyPlan.syncColumns();
    if (SuccessStory && SuccessStory.syncColumns) await SuccessStory.syncColumns();
    if (UserBadge && UserBadge.syncColumns) await UserBadge.syncColumns();
    if (UserAchievement && UserAchievement.syncColumns) await UserAchievement.syncColumns();
    if (LeaderboardEntry && LeaderboardEntry.syncColumns) await LeaderboardEntry.syncColumns();
    if (syncAnalytics) await syncAnalytics();
    console.log('📦 Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`🚀 Career Copilot API running at http://localhost:${PORT}`);
      console.log(`📋 Health check available at http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
