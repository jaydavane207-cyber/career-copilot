// backend/models/Role.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Role Model
 * Stores popular tech roles (specifically calibrated for the Indian technology job market).
 * Includes salary benchmarks in INR (LPA), popular hiring hubs, demand indicators, and skills.
 */
const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: 'Slug identifier for the role, e.g. senior-software-engineer'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Official role title, e.g. Senior Software Engineer'
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Software Engineering',
    comment: 'Job family: Software Engineering, Data & AI, Cloud & Infrastructure, etc.'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Detailed overview of role responsibilities and industry expectations'
  },
  experienceLevel: {
    type: DataTypes.STRING,
    defaultValue: 'Mid-Level',
    comment: 'Entry-Level, Mid-Level (2-5 yrs), Senior (5-8+ yrs), Lead/Architect (8-14+ yrs)'
  },
  salaryRangeInr: {
    type: DataTypes.STRING,
    defaultValue: '₹12 LPA - ₹25 LPA',
    comment: 'Typical compensation range in India expressed in Lakhs Per Annum (LPA)'
  },
  popularLocations: {
    type: DataTypes.JSON,
    defaultValue: ['Bengaluru', 'Hyderabad', 'Pune', 'Gurugram', 'Noida'],
    comment: 'Key hiring locations across Indian tech corridors'
  },
  marketDemand: {
    type: DataTypes.STRING,
    defaultValue: 'High',
    comment: 'Market demand metric: Moderate, High, Very High'
  },
  coreSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of core required skill names for rapid lookup and matching'
  },
  optionalSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Array of optional / nice-to-have skill names'
  },
  topHiringCompanies: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Representative top employers hiring for this role in India'
  }
}, {
  tableName: 'roles',
  timestamps: true
});

module.exports = Role;
