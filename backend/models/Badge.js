// backend/models/Badge.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 1. UserBadge Model (table: user_badges)
 */
const UserBadge = sequelize.define('UserBadge', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    get() {
      return this.getDataValue('userId') ?? this.getDataValue('user_id');
    },
    set(val) {
      this.setDataValue('userId', val);
      this.setDataValue('user_id', val);
    }
  },
  badge_type: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('badge_type') || this.getDataValue('badgeType');
    },
    set(val) {
      this.setDataValue('badge_type', val);
      this.setDataValue('badgeType', val);
    }
  },
  badgeType: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('badgeType') || this.getDataValue('badge_type');
    },
    set(val) {
      this.setDataValue('badgeType', val);
      this.setDataValue('badge_type', val);
    }
  },
  badge_name: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('badge_name') || this.getDataValue('badgeName');
    },
    set(val) {
      this.setDataValue('badge_name', val);
      this.setDataValue('badgeName', val);
    }
  },
  badgeName: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('badgeName') || this.getDataValue('badge_name');
    },
    set(val) {
      this.setDataValue('badgeName', val);
      this.setDataValue('badge_name', val);
    }
  },
  badge_description: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('badge_description') || this.getDataValue('badgeDescription');
    },
    set(val) {
      this.setDataValue('badge_description', val);
      this.setDataValue('badgeDescription', val);
    }
  },
  badgeDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('badgeDescription') || this.getDataValue('badge_description');
    },
    set(val) {
      this.setDataValue('badgeDescription', val);
      this.setDataValue('badge_description', val);
    }
  },
  rarity: {
    type: DataTypes.STRING,
    defaultValue: 'Common'
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  earned_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('earned_date') ?? this.getDataValue('earnedDate');
    },
    set(val) {
      this.setDataValue('earned_date', val);
      this.setDataValue('earnedDate', val);
    }
  },
  earnedDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('earnedDate') ?? this.getDataValue('earned_date');
    },
    set(val) {
      this.setDataValue('earnedDate', val);
      this.setDataValue('earned_date', val);
    }
  }
}, {
  tableName: 'user_badges',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'badge_type']
    }
  ]
});

/**
 * 2. UserAchievement Model (table: user_achievements)
 */
const UserAchievement = sequelize.define('UserAchievement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    get() {
      return this.getDataValue('userId') ?? this.getDataValue('user_id');
    },
    set(val) {
      this.setDataValue('userId', val);
      this.setDataValue('user_id', val);
    }
  },
  achievement_type: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('achievement_type') || this.getDataValue('achievementType');
    },
    set(val) {
      this.setDataValue('achievement_type', val);
      this.setDataValue('achievementType', val);
    }
  },
  achievementType: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('achievementType') || this.getDataValue('achievement_type');
    },
    set(val) {
      this.setDataValue('achievementType', val);
      this.setDataValue('achievement_type', val);
    }
  },
  achievement_name: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('achievement_name') || this.getDataValue('achievementName');
    },
    set(val) {
      this.setDataValue('achievement_name', val);
      this.setDataValue('achievementName', val);
    }
  },
  achievementName: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('achievementName') || this.getDataValue('achievement_name');
    },
    set(val) {
      this.setDataValue('achievementName', val);
      this.setDataValue('achievement_name', val);
    }
  },
  progress_current: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('progress_current') ?? this.getDataValue('progressCurrent') ?? 0;
    },
    set(val) {
      this.setDataValue('progress_current', val);
      this.setDataValue('progressCurrent', val);
    }
  },
  progressCurrent: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('progressCurrent') ?? this.getDataValue('progress_current') ?? 0;
    },
    set(val) {
      this.setDataValue('progressCurrent', val);
      this.setDataValue('progress_current', val);
    }
  },
  progress_target: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    get() {
      return this.getDataValue('progress_target') ?? this.getDataValue('progressTarget') ?? 1;
    },
    set(val) {
      this.setDataValue('progress_target', val);
      this.setDataValue('progressTarget', val);
    }
  },
  progressTarget: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    get() {
      return this.getDataValue('progressTarget') ?? this.getDataValue('progress_target') ?? 1;
    },
    set(val) {
      this.setDataValue('progressTarget', val);
      this.setDataValue('progress_target', val);
    }
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'in_progress' // 'in_progress', 'completed'
  },
  earned_date: {
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      return this.getDataValue('earned_date') ?? this.getDataValue('earnedDate');
    },
    set(val) {
      this.setDataValue('earned_date', val);
      this.setDataValue('earnedDate', val);
    }
  },
  earnedDate: {
    type: DataTypes.DATE,
    allowNull: true,
    get() {
      return this.getDataValue('earnedDate') ?? this.getDataValue('earned_date');
    },
    set(val) {
      this.setDataValue('earnedDate', val);
      this.setDataValue('earned_date', val);
    }
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 25
  }
}, {
  tableName: 'user_achievements',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'achievement_type']
    }
  ]
});

UserBadge.syncColumns = async () => {};
UserAchievement.syncColumns = async () => {};

module.exports = {
  UserBadge,
  UserAchievement
};
