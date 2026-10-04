// backend/models/PopularCompany.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * PopularCompany Model
 * Stores profile metadata and interview insights for popular companies hiring in India.
 * Covers Indian unicorns (Flipkart, Swiggy, Razorpay, CRED, Zerodha),
 * Big Tech India Centers (Google India, Microsoft IDC, Amazon India, Uber India),
 * and Major IT Services firms (TCS, Infosys, Wipro).
 */
const PopularCompany = sequelize.define('PopularCompany', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    comment: 'Slug identifier, e.g. google-india, flipkart, razorpay, tcs'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Company full name, e.g. Flipkart, Razorpay, Google India'
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Tier-1 Product / Big Tech',
    comment: 'Tier-1 Product, Fintech Unicorn, E-Commerce, IT Services Giant, Global Capability Center'
  },
  tier: {
    type: DataTypes.STRING,
    defaultValue: 'Tier 1',
    comment: 'Market tier: Tier 1, Tier 2, Tier 3'
  },
  headquarters: {
    type: DataTypes.STRING,
    defaultValue: 'Bengaluru',
    comment: 'Primary India headquarters or base'
  },
  indiaOffices: {
    type: DataTypes.JSON,
    defaultValue: ['Bengaluru'],
    comment: 'Major offices/development centers in India'
  },
  typicalRounds: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Sequence of interview stages: [Online Assessment, Machine Coding LLD, DSA, HLD, Bar Raiser]'
  },
  focusAreas: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Primary technical evaluation criteria: [DSA, Low-Level Design, System Design, Concurrency]'
  },
  salaryRangeByLevel: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Real-world market compensation bands in INR LPA by seniority level'
  },
  interviewTips: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Company-specific tactical interview preparation tips and culture nuances'
  },
  popularRoles: {
    type: DataTypes.JSON,
    defaultValue: [],
    comment: 'Common roles frequently hired at this company'
  }
}, {
  tableName: 'popular_companies',
  timestamps: true,
  indexes: [
    { fields: ['tier'], name: 'idx_companies_tier' },
    { fields: ['category'], name: 'idx_companies_category' }
  ]
});

module.exports = PopularCompany;
