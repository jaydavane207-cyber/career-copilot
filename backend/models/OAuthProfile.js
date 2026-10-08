// backend/models/OAuthProfile.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { encryptToken, decryptToken } = require('../config/oauth');

/**
 * OAuthProfile Model
 * Stores encrypted OAuth access and refresh tokens, cached provider profile data,
 * and tracks imported professional credentials (work experience, education, skills, repos).
 */
const OAuthProfile = sequelize.define('OAuthProfile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
    onDelete: 'CASCADE'
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'OAuth provider: "linkedin" | "github"'
  },
  providerId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'provider_id',
    comment: 'Remote user identifier on LinkedIn or GitHub'
  },
  providerUsername: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'provider_username',
    comment: 'LinkedIn vanity name or GitHub username'
  },
  accessToken: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'access_token',
    comment: 'AES-256 encrypted OAuth access token',
    set(val) {
      if (!val) {
        this.setDataValue('accessToken', null);
      } else if (val.includes(':')) {
        // Already encrypted
        this.setDataValue('accessToken', val);
      } else {
        this.setDataValue('accessToken', encryptToken(val));
      }
    },
    get() {
      const raw = this.getDataValue('accessToken');
      return raw ? decryptToken(raw) : null;
    }
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'refresh_token',
    comment: 'AES-256 encrypted OAuth refresh token',
    set(val) {
      if (!val) {
        this.setDataValue('refreshToken', null);
      } else if (val.includes(':')) {
        this.setDataValue('refreshToken', val);
      } else {
        this.setDataValue('refreshToken', encryptToken(val));
      }
    },
    get() {
      const raw = this.getDataValue('refreshToken');
      return raw ? decryptToken(raw) : null;
    }
  },
  tokenExpiry: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'token_expiry'
  },
  profileData: {
    type: DataTypes.JSON,
    defaultValue: {},
    field: 'profile_data',
    comment: 'Full cached profile snapshot from provider',
    get() {
      let val = this.getDataValue('profileData');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return val || {};
    },
    set(val) {
      this.setDataValue('profileData', val);
    }
  },
  importedWorkExperience: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'imported_work_experience',
    get() {
      let val = this.getDataValue('importedWorkExperience');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('importedWorkExperience', val);
    }
  },
  importedEducation: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'imported_education',
    get() {
      let val = this.getDataValue('importedEducation');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('importedEducation', val);
    }
  },
  importedSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'imported_skills',
    get() {
      let val = this.getDataValue('importedSkills');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('importedSkills', val);
    }
  },
  importedRepositories: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'imported_repositories',
    get() {
      let val = this.getDataValue('importedRepositories');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return Array.isArray(val) ? val : [];
    },
    set(val) {
      this.setDataValue('importedRepositories', val);
    }
  },
  lastRefreshed: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'last_refreshed'
  }
}, {
  tableName: 'oauth_profiles',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'provider'],
      name: 'idx_oauth_user_provider'
    }
  ]
});

// Helper migration function to sync columns in SQLite or PostgreSQL
OAuthProfile.syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS oauth_profiles (
          id VARCHAR(36) PRIMARY KEY,
          user_id VARCHAR(36) NOT NULL,
          provider VARCHAR(50) NOT NULL,
          provider_id VARCHAR(100),
          provider_username VARCHAR(100),
          access_token TEXT,
          refresh_token TEXT,
          token_expiry DATETIME,
          profile_data TEXT,
          imported_work_experience TEXT,
          imported_education TEXT,
          imported_skills TEXT,
          imported_repositories TEXT,
          last_refreshed DATETIME,
          createdAt DATETIME,
          updatedAt DATETIME,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        );
      `);
      await sequelize.query(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_oauth_user_provider
        ON oauth_profiles (user_id, provider);
      `);
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS oauth_profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          provider VARCHAR(50) NOT NULL,
          provider_id VARCHAR(100),
          provider_username VARCHAR(100),
          access_token TEXT,
          refresh_token TEXT,
          token_expiry TIMESTAMP,
          profile_data JSONB DEFAULT '{}',
          imported_work_experience JSONB DEFAULT '[]',
          imported_education JSONB DEFAULT '[]',
          imported_skills JSONB DEFAULT '[]',
          imported_repositories JSONB DEFAULT '[]',
          last_refreshed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT uq_oauth_user_provider UNIQUE (user_id, provider)
        );
        CREATE INDEX IF NOT EXISTS idx_oauth_user_provider ON oauth_profiles(user_id, provider);
      `);
    }
  } catch (err) {
    console.warn('⚠️ [OAuthProfile.syncColumns] Notice:', err.message);
  }
};

module.exports = OAuthProfile;
