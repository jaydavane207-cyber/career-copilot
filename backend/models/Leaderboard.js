// backend/models/Leaderboard.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * LeaderboardEntry Model (table: leaderboard_entries)
 */
const LeaderboardEntry = sequelize.define('LeaderboardEntry', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
    get() {
      return this.getDataValue('user_id') ?? this.getDataValue('userId');
    },
    set(val) {
      this.setDataValue('user_id', val);
      this.setDataValue('userId', val);
    }
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    get() {
      return this.getDataValue('userId') ?? this.getDataValue('user_id');
    },
    set(val) {
      this.setDataValue('userId', val);
      this.setDataValue('user_id', val);
    }
  },
  // For dummy / seeded community members who might not have user_id
  user_name: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('user_name') || this.getDataValue('userName') || 'Community Member';
    },
    set(val) {
      this.setDataValue('user_name', val);
      this.setDataValue('userName', val);
    }
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('userName') || this.getDataValue('user_name') || 'Community Member';
    },
    set(val) {
      this.setDataValue('userName', val);
      this.setDataValue('user_name', val);
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  company: {
    type: DataTypes.STRING,
    defaultValue: 'Tech Corp'
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Software Engineer'
  },
  rank_type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'salary', // salary, offers, readiness, mock_interviews, coding, streak
    get() {
      return this.getDataValue('rank_type') || this.getDataValue('rankType') || 'salary';
    },
    set(val) {
      this.setDataValue('rank_type', val);
      this.setDataValue('rankType', val);
    }
  },
  rankType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'salary',
    get() {
      return this.getDataValue('rankType') || this.getDataValue('rank_type') || 'salary';
    },
    set(val) {
      this.setDataValue('rankType', val);
      this.setDataValue('rank_type', val);
    }
  },
  period: {
    type: DataTypes.STRING,
    defaultValue: 'all_time' // 'all_time', 'this_month', 'this_week'
  },
  rank: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  rank_value: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0',
    get() {
      return this.getDataValue('rank_value') || this.getDataValue('rankValue') || '0';
    },
    set(val) {
      this.setDataValue('rank_value', String(val));
      this.setDataValue('rankValue', String(val));
    }
  },
  rankValue: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0',
    get() {
      return this.getDataValue('rankValue') || this.getDataValue('rank_value') || '0';
    },
    set(val) {
      this.setDataValue('rankValue', String(val));
      this.setDataValue('rank_value', String(val));
    }
  },
  rank_change: {
    type: DataTypes.STRING,
    defaultValue: '→ 0',
    get() {
      return this.getDataValue('rank_change') || this.getDataValue('rankChange') || '→ 0';
    },
    set(val) {
      this.setDataValue('rank_change', val);
      this.setDataValue('rankChange', val);
    }
  },
  rankChange: {
    type: DataTypes.STRING,
    defaultValue: '→ 0',
    get() {
      return this.getDataValue('rankChange') || this.getDataValue('rank_change') || '→ 0';
    },
    set(val) {
      this.setDataValue('rankChange', val);
      this.setDataValue('rank_change', val);
    }
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('badges') || [];
    },
    set(val) {
      this.setDataValue('badges', val);
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 500
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('last_updated') ?? this.getDataValue('lastUpdated');
    },
    set(val) {
      this.setDataValue('last_updated', val);
      this.setDataValue('lastUpdated', val);
    }
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('lastUpdated') ?? this.getDataValue('last_updated');
    },
    set(val) {
      this.setDataValue('lastUpdated', val);
      this.setDataValue('last_updated', val);
    }
  }
}, {
  tableName: 'leaderboard_entries',
  timestamps: true,
  underscored: true
});

LeaderboardEntry.syncColumns = async () => {};

module.exports = {
  LeaderboardEntry
};
