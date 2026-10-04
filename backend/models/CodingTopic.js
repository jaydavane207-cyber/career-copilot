// backend/models/CodingTopic.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * CodingTopic Model
 * Stores data structures and algorithm categories frequently tested in
 * Indian tech company assessments (LeetCode, HackerRank, CodeChef, Striver SDE Sheet).
 */
const CodingTopic = sequelize.define('CodingTopic', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: 'Slug identifier, e.g. array, string, dynamic-programming, graph'
  },
  topicName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Display title of the coding topic'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Conceptual overview and problem classification'
  },
  frequencyInIndiaInterviews: {
    type: DataTypes.STRING,
    defaultValue: 'High',
    comment: 'Frequency rating: Very High, High, Medium'
  },
  keyPatterns: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Essential algorithmic patterns: e.g. Two Pointers, Sliding Window, Kadane, Topological Sort'
  },
  recommendedProblems: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Top curated benchmark interview questions with difficulty & URLs'
  }
}, {
  tableName: 'coding_topics',
  timestamps: true
});

module.exports = CodingTopic;
