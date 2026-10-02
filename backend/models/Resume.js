// backend/models/Resume.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  extractedText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  parsedSections: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  targetRole: {
    type: DataTypes.STRING,
    allowNull: true
  },
  atsScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  matchedKeywords: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  missingKeywords: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  suggestions: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'resumes',
  timestamps: true
});

module.exports = Resume;
