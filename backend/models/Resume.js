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
  },
  // AI Resume Feedback fields (Gemini API analysis)
  aiFeedback: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'ai_feedback',
    get() {
      let val = this.getDataValue('aiFeedback');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return val || null;
    },
    set(val) {
      this.setDataValue('aiFeedback', val);
    }
  },
  aiImprovedResume: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ai_improved_resume'
  },
  aiScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'ai_score'
  },
  aiFeedbackGeneratedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'ai_feedback_generated_at'
  }
}, {
  tableName: 'resumes',
  timestamps: true
});

// Alias virtual getters and setters for seamless JSON / snake_case interoperability
Object.defineProperty(Resume.prototype, 'ai_feedback', {
  get() {
    return this.getDataValue('aiFeedback');
  },
  set(val) {
    this.setDataValue('aiFeedback', val);
  }
});

Object.defineProperty(Resume.prototype, 'ai_improved_resume', {
  get() {
    return this.getDataValue('aiImprovedResume');
  },
  set(val) {
    this.setDataValue('aiImprovedResume', val);
  }
});

Object.defineProperty(Resume.prototype, 'ai_score', {
  get() {
    return this.getDataValue('aiScore');
  },
  set(val) {
    this.setDataValue('aiScore', val);
  }
});

Object.defineProperty(Resume.prototype, 'ai_feedback_generated_at', {
  get() {
    return this.getDataValue('aiFeedbackGeneratedAt');
  },
  set(val) {
    this.setDataValue('aiFeedbackGeneratedAt', val);
  }
});

// Helper migration function to add missing columns in existing SQLite or PostgreSQL tables
Resume.syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      const [cols] = await sequelize.query("PRAGMA table_info('resumes');");
      const existingColNames = cols.map(c => c.name);

      const columnsToAdd = [
        { name: 'ai_feedback', type: 'TEXT' },
        { name: 'ai_improved_resume', type: 'TEXT' },
        { name: 'ai_score', type: 'INTEGER' },
        { name: 'ai_feedback_generated_at', type: 'DATETIME' }
      ];

      for (const col of columnsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE resumes ADD COLUMN ${col.name} ${col.type};`);
        }
      }
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        ALTER TABLE resumes
        ADD COLUMN IF NOT EXISTS ai_feedback JSONB,
        ADD COLUMN IF NOT EXISTS ai_improved_resume TEXT,
        ADD COLUMN IF NOT EXISTS ai_score INTEGER,
        ADD COLUMN IF NOT EXISTS ai_feedback_generated_at TIMESTAMP;
      `);
    }
  } catch (err) {
    console.warn('⚠️ [Resume.syncColumns] Notice:', err.message);
  }
};

module.exports = Resume;
