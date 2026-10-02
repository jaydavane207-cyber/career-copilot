// backend/models/CodingProblem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { CODING_DIFFICULTIES, CODING_STATUSES } = require('../config/constants');

const CodingProblem = sequelize.define('CodingProblem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  problemUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  platform: {
    type: DataTypes.STRING,
    defaultValue: 'LeetCode' // LeetCode, HackerRank, Codeforces, NeetCode, Custom
  },
  difficulty: {
    type: DataTypes.ENUM(
      CODING_DIFFICULTIES.EASY,
      CODING_DIFFICULTIES.MEDIUM,
      CODING_DIFFICULTIES.HARD
    ),
    defaultValue: CODING_DIFFICULTIES.MEDIUM
  },
  topic: {
    type: DataTypes.STRING,
    defaultValue: 'Arrays' // Arrays, Trees, Dynamic Programming, Graphs, Strings, etc.
  },
  status: {
    type: DataTypes.ENUM(
      CODING_STATUSES.SOLVED,
      CODING_STATUSES.ATTEMPTED,
      CODING_STATUSES.REVIEW
    ),
    defaultValue: CODING_STATUSES.SOLVED
  },
  timeSpentMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 30
  },
  solutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  solvedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'coding_problems',
  timestamps: true
});

module.exports = CodingProblem;
