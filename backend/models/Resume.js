// backend/models/Resume.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Resume Model
 * Stores uploaded resumes, extracted text, and past analysis records
 */
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
    allowNull: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  uploadedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  extractedText: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Past resume analyses array: [{ id, jobTitle, jobDescription, matchScore, matchingKeywords, missingKeywords, suggestions, atsReadiness, analyzedAt }]
  analyses: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  // Backward compatibility fields for dashboard and existing views
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
  },
  parsedSections: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'resumes',
  timestamps: true
});

module.exports = Resume;
