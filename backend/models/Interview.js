// backend/models/Interview.js
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Interview Model
 * Dedicated table: interviews
 * Tracks scheduled job interviews, stages, interview formats, meeting links, and notes.
 */
const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    get() {
      return this.getDataValue('userId') ?? this.getDataValue('user_id');
    },
    set(val) {
      this.setDataValue('userId', val);
      this.setDataValue('user_id', val);
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    get() {
      return this.getDataValue('user_id') ?? this.getDataValue('userId');
    },
    set(val) {
      this.setDataValue('user_id', val);
      this.setDataValue('userId', val);
    }
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'job_id',
    references: {
      model: 'jobs',
      key: 'id'
    },
    onDelete: 'SET NULL',
    get() {
      return this.getDataValue('jobId') ?? this.getDataValue('job_id');
    },
    set(val) {
      this.setDataValue('jobId', val);
      this.setDataValue('job_id', val);
    }
  },
  job_id: {
    type: DataTypes.UUID,
    allowNull: true,
    get() {
      return this.getDataValue('job_id') ?? this.getDataValue('jobId');
    },
    set(val) {
      this.setDataValue('job_id', val);
      this.setDataValue('jobId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'company_id',
    references: {
      model: 'companies',
      key: 'id'
    },
    onDelete: 'SET NULL',
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'company_name',
    get() {
      return this.getDataValue('companyName') || this.getDataValue('company_name');
    },
    set(val) {
      this.setDataValue('companyName', val);
      this.setDataValue('company_name', val);
    }
  },
  company_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    get() {
      return this.getDataValue('company_name') || this.getDataValue('companyName');
    },
    set(val) {
      this.setDataValue('company_name', val);
      this.setDataValue('companyName', val);
    }
  },
  roleTitle: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'role_title',
    get() {
      return this.getDataValue('roleTitle') || this.getDataValue('role_title');
    },
    set(val) {
      this.setDataValue('roleTitle', val);
      this.setDataValue('role_title', val);
    }
  },
  role_title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    get() {
      return this.getDataValue('role_title') || this.getDataValue('roleTitle');
    },
    set(val) {
      this.setDataValue('role_title', val);
      this.setDataValue('roleTitle', val);
    }
  },
  stage: {
    type: DataTypes.STRING(50),
    defaultValue: 'Round 1', // 'Screen', 'Round 1', 'Round 2', 'System Design', 'Behavioral', 'Final', 'HR'
    allowNull: false
  },
  interviewType: {
    type: DataTypes.STRING(50),
    defaultValue: 'technical', // 'technical', 'system_design', 'behavioral', 'hr'
    field: 'interview_type',
    get() {
      return this.getDataValue('interviewType') || this.getDataValue('interview_type');
    },
    set(val) {
      this.setDataValue('interviewType', val);
      this.setDataValue('interview_type', val);
    }
  },
  interview_type: {
    type: DataTypes.STRING(50),
    defaultValue: 'technical',
    get() {
      return this.getDataValue('interview_type') || this.getDataValue('interviewType');
    },
    set(val) {
      this.setDataValue('interview_type', val);
      this.setDataValue('interviewType', val);
    }
  },
  mode: {
    type: DataTypes.STRING(50),
    defaultValue: 'online', // 'online', 'onsite', 'phone'
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  interviewDatetime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'interview_datetime',
    get() {
      return this.getDataValue('interviewDatetime') || this.getDataValue('interview_datetime');
    },
    set(val) {
      this.setDataValue('interviewDatetime', val);
      this.setDataValue('interview_datetime', val);
    }
  },
  interview_datetime: {
    type: DataTypes.DATE,
    allowNull: false,
    get() {
      return this.getDataValue('interview_datetime') || this.getDataValue('interviewDatetime');
    },
    set(val) {
      this.setDataValue('interview_datetime', val);
      this.setDataValue('interviewDatetime', val);
    }
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    field: 'duration_minutes',
    get() {
      return this.getDataValue('durationMinutes') ?? this.getDataValue('duration_minutes') ?? 60;
    },
    set(val) {
      this.setDataValue('durationMinutes', val);
      this.setDataValue('duration_minutes', val);
    }
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    get() {
      return this.getDataValue('duration_minutes') ?? this.getDataValue('durationMinutes') ?? 60;
    },
    set(val) {
      this.setDataValue('duration_minutes', val);
      this.setDataValue('durationMinutes', val);
    }
  },
  meetLink: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'meet_link',
    get() {
      return this.getDataValue('meetLink') || this.getDataValue('meet_link');
    },
    set(val) {
      this.setDataValue('meetLink', val);
      this.setDataValue('meet_link', val);
    }
  },
  meet_link: {
    type: DataTypes.STRING(500),
    allowNull: true,
    get() {
      return this.getDataValue('meet_link') || this.getDataValue('meetLink');
    },
    set(val) {
      this.setDataValue('meet_link', val);
      this.setDataValue('meetLink', val);
    }
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'upcoming', // 'upcoming', 'completed', 'cancelled'
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'interviews',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      name: 'idx_interviews_user_date',
      fields: ['user_id', 'interview_datetime']
    }
  ]
});

/**
 * InterviewPrepLog Model
 * Dedicated table: interview_prep_logs
 * Tracks individual prep activity completions for a specific interview.
 */
const InterviewPrepLog = sequelize.define('InterviewPrepLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    get() {
      return this.getDataValue('userId') ?? this.getDataValue('user_id');
    },
    set(val) {
      this.setDataValue('userId', val);
      this.setDataValue('user_id', val);
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    get() {
      return this.getDataValue('user_id') ?? this.getDataValue('userId');
    },
    set(val) {
      this.setDataValue('user_id', val);
      this.setDataValue('userId', val);
    }
  },
  interviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'interview_id',
    references: {
      model: 'interviews',
      key: 'id'
    },
    onDelete: 'CASCADE',
    get() {
      return this.getDataValue('interviewId') ?? this.getDataValue('interview_id');
    },
    set(val) {
      this.setDataValue('interviewId', val);
      this.setDataValue('interview_id', val);
    }
  },
  interview_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('interview_id') ?? this.getDataValue('interviewId');
    },
    set(val) {
      this.setDataValue('interview_id', val);
      this.setDataValue('interviewId', val);
    }
  },
  taskType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'task_type', // 'mock_interview', 'prep_material', 'behavioral_practice', 'coding', 'company_research', 'logistics'
    get() {
      return this.getDataValue('taskType') || this.getDataValue('task_type');
    },
    set(val) {
      this.setDataValue('taskType', val);
      this.setDataValue('task_type', val);
    }
  },
  task_type: {
    type: DataTypes.STRING(50),
    allowNull: false,
    get() {
      return this.getDataValue('task_type') || this.getDataValue('taskType');
    },
    set(val) {
      this.setDataValue('task_type', val);
      this.setDataValue('taskType', val);
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'completed_at',
    get() {
      return this.getDataValue('completedAt') || this.getDataValue('completed_at');
    },
    set(val) {
      this.setDataValue('completedAt', val);
      this.setDataValue('completed_at', val);
    }
  },
  completed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('completed_at') || this.getDataValue('completedAt');
    },
    set(val) {
      this.setDataValue('completed_at', val);
      this.setDataValue('completedAt', val);
    }
  }
}, {
  tableName: 'interview_prep_logs',
  timestamps: false,
  underscored: true
});

/**
 * Ensures compatibility with afterSync lifecycle
 */
Interview.syncColumns = async () => {};
InterviewPrepLog.syncColumns = async () => {};

module.exports = {
  Interview,
  InterviewPrepLog
};
