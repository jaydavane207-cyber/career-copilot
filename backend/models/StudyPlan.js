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
  targetDate: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dailyTasks: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  weeklyModules: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0 // 0 to 100%
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active' // 'active' | 'paused' | 'completed'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'study_plans',
  timestamps: true
});

StudyPlan.syncColumns = async () => {
  try {
    if (sequelize.getDialect() === 'sqlite') {
      const [cols] = await sequelize.query("PRAGMA table_info('study_plans');");
      const existingColNames = cols.map(c => c.name);

      const columnsToAdd = [
        { name: 'targetDate', type: 'VARCHAR(255)' },
        { name: 'dailyTasks', type: "JSON DEFAULT '[]'" },
        { name: 'status', type: "VARCHAR(255) DEFAULT 'active'" }
      ];

      for (const col of columnsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE study_plans ADD COLUMN ${col.name} ${col.type};`);
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ [StudyPlan.syncColumns] Notice:', err.message);
  }
};

module.exports = StudyPlan;

