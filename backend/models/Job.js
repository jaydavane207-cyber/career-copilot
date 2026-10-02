// backend/models/Job.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { JOB_STATUSES } = require('../config/constants');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  positionTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  jobUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  workType: {
    type: DataTypes.STRING,
    defaultValue: 'Remote' // Remote, Hybrid, On-site
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      JOB_STATUSES.WISHLIST,
      JOB_STATUSES.APPLIED,
      JOB_STATUSES.INTERVIEWING,
      JOB_STATUSES.OFFER,
      JOB_STATUSES.REJECTED
    ),
    defaultValue: JOB_STATUSES.WISHLIST
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  appliedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'jobs',
  timestamps: true
});

module.exports = Job;
