// backend/models/MockInterview.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { INTERVIEW_TYPES } = require('../config/constants');

const MockInterview = sequelize.define('MockInterview', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Fullstack Developer'
  },
  interviewType: {
    type: DataTypes.ENUM(
      INTERVIEW_TYPES.TECHNICAL,
      INTERVIEW_TYPES.BEHAVIORAL,
      INTERVIEW_TYPES.SYSTEM_DESIGN
    ),
    defaultValue: INTERVIEW_TYPES.TECHNICAL
  },
  questions: {
    type: DataTypes.JSON, // Array of { id, question, category, expectedKeywords, userResponse, score, feedback }
    defaultValue: []
  },
  overallScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0 // 0 to 100
  },
  feedbackSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  strengths: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  areasForImprovement: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mock_interviews',
  timestamps: true
});

module.exports = MockInterview;
