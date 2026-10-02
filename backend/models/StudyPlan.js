// backend/models/StudyPlan.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudyPlan = sequelize.define('StudyPlan', {
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
  targetRole: {
    type: DataTypes.STRING,
    allowNull: false
  },
  durationWeeks: {
    type: DataTypes.INTEGER,
    defaultValue: 4
  },
  hoursPerWeek: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  weeklyModules: {
    type: DataTypes.JSON, // Array of { week: 1, title: '', topics: [], dailyTasks: [{ id, text, completed: false }] }
    defaultValue: []
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0 // 0 to 100%
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'study_plans',
  timestamps: true
});

module.exports = StudyPlan;
