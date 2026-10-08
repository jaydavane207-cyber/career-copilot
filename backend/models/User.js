// backend/models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * User Model
 * Defines the user schema with:
 * - id: Unique UUID identifier
 * - name: Full name of the job seeker
 * - email: Unique validated email address
 * - password: Bcrypt hashed password string
 * - targetRole: Target tech job title (e.g., SDE-1, Full Stack Developer)
 * - createdAt: Account creation timestamp
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    comment: 'Unique user UUID'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Career Aspirant',
    validate: {
      notEmpty: { msg: 'User name cannot be empty' }
    },
    comment: 'User full name'
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      name: 'users_email_unique',
      msg: 'This email is already registered'
    },
    validate: {
      isEmail: { msg: 'Must be a valid email format' },
      notEmpty: { msg: 'Email cannot be empty' }
    },
    comment: 'Unique user email address'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password is required' }
    },
    comment: 'Bcrypt hashed password'
  },
  targetRole: {
    type: DataTypes.STRING,
    defaultValue: 'Full Stack Developer',
    comment: 'Target career role in tech'
  },
  // Virtual getter and setter for fullName for backward compatibility
  fullName: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.getDataValue('name');
    },
    set(val) {
      this.setDataValue('name', val);
    }
  },
  experienceLevel: {
    type: DataTypes.STRING,
    defaultValue: 'Entry-Level'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  avatarUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  subscriptionTier: {
    type: DataTypes.STRING,
    defaultValue: 'free',
    field: 'subscription_tier',
    comment: 'free | premium | pro'
  },
  subscriptionStatus: {
    type: DataTypes.STRING,
    defaultValue: 'active',
    field: 'subscription_status',
    comment: 'active | canceled | past_due | expired'
  },
  subscriptionExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'subscription_expires_at'
  }
}, {
  tableName: 'users',
  timestamps: true, // Automatically manages createdAt and updatedAt
  hooks: {
    /**
     * Hash password with bcrypt before creating user
     */
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (user.email) {
        user.email = user.email.toLowerCase().trim();
      }
    },
    /**
     * Re-hash password if it has been updated
     */
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
      if (user.changed('email')) {
        user.email = user.email.toLowerCase().trim();
      }
    }
  }
});

// Snake_case aliases
Object.defineProperty(User.prototype, 'subscription_tier', {
  get() { return this.getDataValue('subscriptionTier'); },
  set(val) { this.setDataValue('subscriptionTier', val); }
});

Object.defineProperty(User.prototype, 'subscription_status', {
  get() { return this.getDataValue('subscriptionStatus'); },
  set(val) { this.setDataValue('subscriptionStatus', val); }
});

Object.defineProperty(User.prototype, 'subscription_expires_at', {
  get() { return this.getDataValue('subscriptionExpiresAt'); },
  set(val) { this.setDataValue('subscriptionExpiresAt', val); }
});

/**
 * Check if user has active premium or pro access
 */
User.prototype.isPremium = function () {
  const tier = (this.subscriptionTier || 'free').toLowerCase();
  if (tier === 'free') return false;
  if (this.subscriptionExpiresAt && new Date(this.subscriptionExpiresAt) < new Date()) {
    return false;
  }
  return tier === 'premium' || tier === 'pro';
};

/**
 * Check if user has active pro tier access
 */
User.prototype.isPro = function () {
  const tier = (this.subscriptionTier || 'free').toLowerCase();
  if (tier !== 'pro') return false;
  if (this.subscriptionExpiresAt && new Date(this.subscriptionExpiresAt) < new Date()) {
    return false;
  }
  return true;
};

/**
 * Compare candidate plain password with stored bcrypt hash
 * @param {string} candidatePassword - Plain text password from request
 * @returns {Promise<boolean>} True if match, false otherwise
 */
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Sanitize user object for JSON serialization
 * Excludes sensitive password hash
 */
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  // Ensure both name and fullName are available in output
  if (!values.fullName && values.name) values.fullName = values.name;
  if (!values.name && values.fullName) values.name = values.fullName;
  return values;
};

// Safe migration helper for existing databases
User.syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      const [cols] = await sequelize.query("PRAGMA table_info('users');");
      const existingColNames = cols.map(c => c.name);
      const colsToAdd = [
        { name: 'subscription_tier', type: "VARCHAR(50) DEFAULT 'free'" },
        { name: 'subscription_status', type: "VARCHAR(50) DEFAULT 'active'" },
        { name: 'subscription_expires_at', type: "DATETIME" }
      ];
      for (const col of colsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type};`);
        }
      }
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        ALTER TABLE users
        ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free',
        ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
        ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP;
      `);
    }
  } catch (err) {
    console.warn('⚠️ [User.syncColumns] Notice:', err.message);
  }
};

module.exports = User;
