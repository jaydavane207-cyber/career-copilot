// backend/models/CodingProblem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { CODING_DIFFICULTIES, CODING_STATUSES } = require('../config/constants');

const CodingProblem = sequelize.define('CodingProblem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  // Primary problem name field (also syncs with legacy title)
  problemName: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('problemName') || this.getDataValue('title');
    },
    set(val) {
      this.setDataValue('problemName', val);
      if (!this.getDataValue('title')) {
        this.setDataValue('title', val);
      }
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('title') || this.getDataValue('problemName');
    },
    set(val) {
      this.setDataValue('title', val);
      if (!this.getDataValue('problemName')) {
        this.setDataValue('problemName', val);
      }
    }
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('date') || this.getDataValue('solvedAt') || this.getDataValue('createdAt');
    },
    set(val) {
      this.setDataValue('date', val);
      this.setDataValue('solvedAt', val);
    }
  },
  topic: {
    type: DataTypes.STRING,
    defaultValue: 'Array'
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Medium'
  },
  timeTaken: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    get() {
      return this.getDataValue('timeTaken') ?? this.getDataValue('timeSpentMinutes') ?? 30;
    },
    set(val) {
      const num = parseInt(val, 10) || 30;
      this.setDataValue('timeTaken', num);
      this.setDataValue('timeSpentMinutes', num);
    }
  },
  timeSpentMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    get() {
      return this.getDataValue('timeSpentMinutes') ?? this.getDataValue('timeTaken') ?? 30;
    },
    set(val) {
      const num = parseInt(val, 10) || 30;
      this.setDataValue('timeSpentMinutes', num);
      this.setDataValue('timeTaken', num);
    }
  },
  selfRating: {
    type: DataTypes.INTEGER,
    defaultValue: 3 // 1-5 scale
  },
  solved: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      const val = this.getDataValue('solved');
      if (val !== null && val !== undefined) return Boolean(val);
      return this.getDataValue('status') === CODING_STATUSES.SOLVED;
    },
    set(val) {
      const boolVal = Boolean(val);
      this.setDataValue('solved', boolVal);
      this.setDataValue('status', boolVal ? CODING_STATUSES.SOLVED : CODING_STATUSES.ATTEMPTED);
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('notes') || this.getDataValue('solutionNotes') || '';
    },
    set(val) {
      this.setDataValue('notes', val);
      this.setDataValue('solutionNotes', val);
    }
  },
  solutionNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('solutionNotes') || this.getDataValue('notes') || '';
    },
    set(val) {
      this.setDataValue('solutionNotes', val);
      this.setDataValue('notes', val);
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: CODING_STATUSES.SOLVED,
    get() {
      const s = this.getDataValue('status');
      if (s) return s;
      return this.getDataValue('solved') ? CODING_STATUSES.SOLVED : CODING_STATUSES.ATTEMPTED;
    },
    set(val) {
      this.setDataValue('status', val);
      if (val === CODING_STATUSES.SOLVED) {
        this.setDataValue('solved', true);
      } else if (val === CODING_STATUSES.ATTEMPTED) {
        this.setDataValue('solved', false);
      }
    }
  },
  problemUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  platform: {
    type: DataTypes.STRING,
    defaultValue: 'LeetCode'
  },
  solvedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  lastReviewedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reviewStage: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // 0: 1d, 1: 3d, 2: 7d, 3: 14d, 4: 30d
  },
  nextReviewDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'coding_problems',
  timestamps: true
});

// Helper migration function to add missing columns in existing SQLite tables
CodingProblem.syncColumns = async () => {
  try {
    const [cols] = await sequelize.query('PRAGMA table_info(coding_problems);');
    const existingColNames = cols.map(c => c.name);

    const columnsToAdd = [
      { name: 'problemName', type: 'VARCHAR(255)' },
      { name: 'date', type: 'DATETIME' },
      { name: 'timeTaken', type: 'INTEGER DEFAULT 30' },
      { name: 'selfRating', type: 'INTEGER DEFAULT 3' },
      { name: 'solved', type: 'BOOLEAN DEFAULT 1' },
      { name: 'notes', type: 'TEXT' },
      { name: 'lastReviewedAt', type: 'DATETIME' },
      { name: 'reviewStage', type: 'INTEGER DEFAULT 0' },
      { name: 'nextReviewDate', type: 'DATETIME' }
    ];

    for (const col of columnsToAdd) {
      if (!existingColNames.includes(col.name)) {
        await sequelize.query(`ALTER TABLE coding_problems ADD COLUMN ${col.name} ${col.type};`);
      }
    }
  } catch (err) {
    // If not SQLite or already added, ignore
  }
};

module.exports = CodingProblem;
