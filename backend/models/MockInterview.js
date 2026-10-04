// backend/models/MockInterview.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { INTERVIEW_TYPES } = require('../config/constants');

const MockInterview = sequelize.define('MockInterview', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('date') || this.getDataValue('completedAt') || this.getDataValue('createdAt');
    },
    set(val) {
      this.setDataValue('date', val);
      this.setDataValue('completedAt', val);
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Fullstack Developer'
  },
  interviewType: {
    type: DataTypes.ENUM(
      INTERVIEW_TYPES.TECHNICAL,
      INTERVIEW_TYPES.BEHAVIORAL,
      INTERVIEW_TYPES.SYSTEM_DESIGN
    ),
    defaultValue: INTERVIEW_TYPES.TECHNICAL
  },
  // Primary array of answer objects as specified in prompt:
  // [{ questionId, question, userAnswer, confidence (1-5), answerLength, ... }]
  answers: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const raw = this.getDataValue('answers');
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') {
        try { return JSON.parse(raw); } catch (e) { return []; }
      }
      return [];
    },
    set(val) {
      this.setDataValue('answers', val);
    }
  },
  // Summary session statistics: { totalQuestions, timeSpent, avgConfidence }
  sessionStats: {
    type: DataTypes.JSON,
    defaultValue: {
      totalQuestions: 0,
      timeSpent: 0,
      avgConfidence: 0
    }
  },
  // Questions column for active session questions
  questions: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      const raw = this.getDataValue('questions');
      if (Array.isArray(raw)) return raw;
      if (typeof raw === 'string') {
        try { return JSON.parse(raw); } catch (e) { return []; }
      }
      return [];
    },
    set(val) {
      this.setDataValue('questions', val);
    }
  },
  overallScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0 // 0 to 100
  },
  feedbackSummary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  strengths: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  areasForImprovement: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 10
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mock_interviews',
  timestamps: true
});

// Helper migration function to add missing columns in existing SQLite/Postgres tables
MockInterview.syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      const [cols] = await sequelize.query('PRAGMA table_info(mock_interviews);');
      const existingColNames = cols.map(c => c.name);

      const columnsToAdd = [
        { name: 'date', type: 'DATETIME' },
        { name: 'answers', type: "JSON DEFAULT '[]'" },
        { name: 'sessionStats', type: "JSON DEFAULT '{}'" }
      ];

      for (const col of columnsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE mock_interviews ADD COLUMN ${col.name} ${col.type};`);
        }
      }
    }
  } catch (err) {
    // If table not created yet or already exists, safe to ignore
    console.warn('⚠️ [MockInterview.syncColumns] Notice:', err.message);
  }
};

module.exports = MockInterview;
