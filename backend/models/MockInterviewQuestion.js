// backend/models/MockInterviewQuestion.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * MockInterviewQuestion Model
 * Stores comprehensive interview question banks categorized by:
 * - Behavioral (35) with STAR frameworks, leadership principles & follow-up deep dives
 * - Technical (40) partitioned across Frontend, Backend/SDE, QA Automation, and Data Science
 * - System Design (25) covering high-scale distributed architectures and popular Indian tech scale scenarios
 */
const MockInterviewQuestion = sequelize.define('MockInterviewQuestion', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: 'Unique slug/ID, e.g. beh-1, tech-fe-1, sys-1'
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Question classification: Behavioral, Technical, System Design'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General',
    comment: 'Specific topic category: Lifecycle, Architecture, Distributed Systems, STAR'
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'General',
    comment: 'Target tech role: Frontend Developer, QA Engineer, Data Scientist, SDE, etc.'
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Medium',
    comment: 'Difficulty level: Easy, Medium, Hard'
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'The interview prompt presented to the candidate'
  },
  followUps: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of follow-up questions interviewer might probe based on initial response'
  },
  sampleAnswer: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'Rubric answer object containing strongAnswer, keyPoints, and tips'
  },
  expectedKeywords: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of high-signal technical terms and keywords'
  },
  indiaContextTip: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Specific tips for Indian tech interviews (e.g. machine coding rounds, service to product switch, scale)'
  }
}, {
  tableName: 'mock_interview_questions',
  timestamps: true,
  indexes: [
    { fields: ['type'], name: 'idx_mock_q_type' },
    { fields: ['role'], name: 'idx_mock_q_role' },
    { fields: ['difficulty'], name: 'idx_mock_q_difficulty' }
  ]
});

module.exports = MockInterviewQuestion;
