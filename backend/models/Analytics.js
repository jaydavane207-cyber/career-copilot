// backend/models/Analytics.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 1. ApplicationAnalytics Model (table: application_analytics)
 * Tracks job pipeline funnel and conversion rate analytics.
 */
const ApplicationAnalytics = sequelize.define('ApplicationAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  total_applications: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_applications'
  },
  applications_by_stage: {
    type: DataTypes.JSON,
    defaultValue: { applied: 0, phone_screen: 0, technical: 0, offer: 0 },
    field: 'applications_by_stage',
    get() {
      let val = this.getDataValue('applications_by_stage');
      while (typeof val === 'string') {
        try { val = JSON.parse(val); } catch (e) { break; }
      }
      return val || { applied: 0, phone_screen: 0, technical: 0, offer: 0 };
    },
    set(val) {
      this.setDataValue('applications_by_stage', val);
    }
  },
  conversion_rates: {
    type: DataTypes.JSON,
    defaultValue: { phone_screen: 0, technical: 0, offer: 0 },
    field: 'conversion_rates',
    get() {
      let val = this.getDataValue('conversion_rates');
      while (typeof val === 'string') {
        try { val = JSON.parse(val); } catch (e) { break; }
      }
      return val || { phone_screen: 0, technical: 0, offer: 0 };
    },
    set(val) {
      this.setDataValue('conversion_rates', val);
    }
  },
  interview_success_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'interview_success_rate'
  },
  days_to_first_interview: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'days_to_first_interview'
  },
  days_to_offer: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'days_to_offer'
  }
}, {
  tableName: 'application_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

/**
 * 2. SkillPerformanceAnalytics Model (table: skill_performance_analytics)
 */
const SkillPerformanceAnalytics = sequelize.define('SkillPerformanceAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  skill_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'skill_name'
  },
  practice_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'practice_count'
  },
  practice_hours: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'practice_hours'
  },
  success_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'success_rate'
  },
  avg_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'avg_score'
  },
  platform_avg_success_rate: {
    type: DataTypes.FLOAT,
    defaultValue: 75.0,
    field: 'platform_avg_success_rate'
  },
  vs_platform_avg: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'vs_platform_avg'
  },
  trend: {
    type: DataTypes.STRING,
    defaultValue: 'stable', // 'up', 'down', 'stable'
    field: 'trend'
  },
  related_salary_increase: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'related_salary_increase'
  }
}, {
  tableName: 'skill_performance_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

/**
 * 3. SalaryAnalytics Model (table: salary_analytics)
 */
const SalaryAnalytics = sequelize.define('SalaryAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Full Stack Developer',
    field: 'role'
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Remote / US',
    field: 'location'
  },
  starting_offers: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'starting_offers',
    get() {
      let val = this.getDataValue('starting_offers');
      while (typeof val === 'string') {
        try { val = JSON.parse(val); } catch (e) { break; }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('starting_offers', val);
    }
  },
  negotiated_offers: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'negotiated_offers',
    get() {
      let val = this.getDataValue('negotiated_offers');
      while (typeof val === 'string') {
        try { val = JSON.parse(val); } catch (e) { break; }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('negotiated_offers', val);
    }
  },
  total_negotiated: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_negotiated'
  },
  avg_salary_start: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'avg_salary_start'
  },
  avg_salary_final: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'avg_salary_final'
  },
  avg_negotiation_amount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'avg_negotiation_amount'
  },
  avg_negotiation_percentage: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'avg_negotiation_percentage'
  },
  platform_avg_salary: {
    type: DataTypes.INTEGER,
    defaultValue: 175000,
    field: 'platform_avg_salary'
  },
  platform_percentile: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    field: 'platform_percentile'
  }
}, {
  tableName: 'salary_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

/**
 * 4. StudyEffectivenessAnalytics Model (table: study_effectiveness_analytics)
 */
const StudyEffectivenessAnalytics = sequelize.define('StudyEffectivenessAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  study_hours_logged: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'study_hours_logged'
  },
  topics_studied: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'topics_studied',
    get() {
      let val = this.getDataValue('topics_studied');
      while (typeof val === 'string') {
        try { val = JSON.parse(val); } catch (e) { break; }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('topics_studied', val);
    }
  },
  skill_improvement_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'skill_improvement_score'
  },
  time_to_readiness: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    field: 'time_to_readiness'
  },
  interview_prep_score: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'interview_prep_score'
  },
  mock_interview_improvement: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'mock_interview_improvement'
  }
}, {
  tableName: 'study_effectiveness_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

/**
 * 5. PreparationRoiAnalytics Model (table: preparation_roi_analytics)
 */
const PreparationRoiAnalytics = sequelize.define('PreparationRoiAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  skill_name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'skill_name'
  },
  hours_spent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'hours_spent'
  },
  interviews_using_skill: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'interviews_using_skill'
  },
  interview_success_with_skill: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'interview_success_with_skill'
  },
  interview_success_without_skill: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'interview_success_without_skill'
  },
  success_improvement: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'success_improvement'
  },
  estimated_salary_impact: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'estimated_salary_impact'
  },
  roi_per_hour: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'roi_per_hour'
  },
  is_critical_skill: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_critical_skill'
  }
}, {
  tableName: 'preparation_roi_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

/**
 * 6. PlatformAnalytics Model (table: platform_analytics)
 */
const PlatformAnalytics = sequelize.define('PlatformAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  metric_type: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'metric_type'
  },
  metric_value: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'metric_value'
  },
  sample_size: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    field: 'sample_size'
  },
  time_period: {
    type: DataTypes.STRING,
    defaultValue: 'all_time',
    field: 'time_period'
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'role'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'location'
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_updated'
  }
}, {
  tableName: 'platform_analytics',
  timestamps: false
});

/**
 * 7. UserComparison Model (table: user_comparisons)
 */
const UserComparison = sequelize.define('UserComparison', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  comparison_metric: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'comparison_metric'
  },
  user_value: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'user_value'
  },
  platform_avg: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
    field: 'platform_avg'
  },
  percentile: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    field: 'percentile'
  },
  rank_position: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'rank_position'
  },
  total_users_in_group: {
    type: DataTypes.INTEGER,
    defaultValue: 1000,
    field: 'total_users_in_group'
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_updated'
  }
}, {
  tableName: 'user_comparisons',
  timestamps: false
});

// Sync columns helper for zero-config table/column verification
const syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS application_analytics (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          total_applications INTEGER DEFAULT 0,
          applications_by_stage TEXT DEFAULT '{"applied": 0, "phone_screen": 0, "technical": 0, "offer": 0}',
          conversion_rates TEXT DEFAULT '{"phone_screen": 0, "technical": 0, "offer": 0}',
          interview_success_rate REAL DEFAULT 0.0,
          days_to_first_interview INTEGER DEFAULT 0,
          days_to_offer INTEGER DEFAULT 0,
          created_at DATETIME,
          updated_at DATETIME
        );
      `);
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS skill_performance_analytics (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          skill_name VARCHAR(255) NOT NULL,
          practice_count INTEGER DEFAULT 0,
          practice_hours INTEGER DEFAULT 0,
          success_rate REAL DEFAULT 0.0,
          avg_score REAL DEFAULT 0.0,
          platform_avg_success_rate REAL DEFAULT 75.0,
          vs_platform_avg REAL DEFAULT 0.0,
          trend VARCHAR(50) DEFAULT 'stable',
          related_salary_increase INTEGER DEFAULT 0,
          created_at DATETIME,
          updated_at DATETIME
        );
      `);
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS salary_analytics (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          role VARCHAR(255) DEFAULT 'Full Stack Developer',
          location VARCHAR(255) DEFAULT 'Remote / US',
          starting_offers TEXT DEFAULT '[]',
          negotiated_offers TEXT DEFAULT '[]',
          total_negotiated INTEGER DEFAULT 0,
          avg_salary_start INTEGER DEFAULT 0,
          avg_salary_final INTEGER DEFAULT 0,
          avg_negotiation_amount INTEGER DEFAULT 0,
          avg_negotiation_percentage REAL DEFAULT 0.0,
          platform_avg_salary INTEGER DEFAULT 175000,
          platform_percentile INTEGER DEFAULT 50,
          created_at DATETIME,
          updated_at DATETIME
        );
      `);
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS study_effectiveness_analytics (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          study_hours_logged INTEGER DEFAULT 0,
          topics_studied TEXT DEFAULT '[]',
          skill_improvement_score REAL DEFAULT 0.0,
          time_to_readiness INTEGER DEFAULT 30,
          interview_prep_score REAL DEFAULT 0.0,
          mock_interview_improvement REAL DEFAULT 0.0,
          created_at DATETIME,
          updated_at DATETIME
        );
      `);
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS preparation_roi_analytics (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          skill_name VARCHAR(255) NOT NULL,
          hours_spent INTEGER DEFAULT 0,
          interviews_using_skill INTEGER DEFAULT 0,
          interview_success_with_skill REAL DEFAULT 0.0,
          interview_success_without_skill REAL DEFAULT 0.0,
          success_improvement REAL DEFAULT 0.0,
          estimated_salary_impact INTEGER DEFAULT 0,
          roi_per_hour REAL DEFAULT 0.0,
          is_critical_skill BOOLEAN DEFAULT 0,
          created_at DATETIME,
          updated_at DATETIME
        );
      `);
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS platform_analytics (
          id VARCHAR(255) PRIMARY KEY,
          metric_type VARCHAR(100) NOT NULL,
          metric_value VARCHAR(255) NOT NULL,
          sample_size INTEGER DEFAULT 1000,
          time_period VARCHAR(50) DEFAULT 'all_time',
          role VARCHAR(255),
          location VARCHAR(255),
          last_updated DATETIME
        );
      `);
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS user_comparisons (
          id VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          comparison_metric VARCHAR(100) NOT NULL,
          user_value REAL DEFAULT 0.0,
          platform_avg REAL DEFAULT 0.0,
          percentile INTEGER DEFAULT 50,
          rank_position INTEGER DEFAULT 1,
          total_users_in_group INTEGER DEFAULT 1000,
          last_updated DATETIME
        );
      `);
    }
  } catch (err) {
    console.warn('⚠️ [Analytics.syncColumns] Notice:', err.message);
  }
};

module.exports = {
  ApplicationAnalytics,
  SkillPerformanceAnalytics,
  SalaryAnalytics,
  StudyEffectivenessAnalytics,
  PreparationRoiAnalytics,
  PlatformAnalytics,
  UserComparison,
  syncColumns
};
