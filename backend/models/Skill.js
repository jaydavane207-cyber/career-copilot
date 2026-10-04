// backend/models/Skill.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { SKILL_PROFICIENCY } = require('../config/constants');

/**
 * Skill Model
 * Represents both:
 * 1. Role-specific curriculum skill requirements (with roleId / role_id foreign key to Role)
 * 2. Candidate assessed skills (with userId foreign key to User)
 * 
 * Supports both camelCase and snake_case field accessors for seamless fixture seeding and API compatibility.
 */
const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  // Foreign Key to Role (for role curriculum & skill gap definitions)
  roleId: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'role_id',
    references: {
      model: 'roles',
      key: 'id'
    },
    onDelete: 'CASCADE',
    comment: 'Foreign key to roles table (role_id)'
  },
  // Foreign Key to User (for user assessed profile skills)
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'userId',
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE',
    comment: 'Foreign key to users table (nullable for role benchmark skills)'
  },
  // Skill name / title
  skillName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'skillName',
    comment: 'Name of the skill, e.g. React, Docker, System Design'
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General',
    comment: 'Category: Frontend, Backend, Databases, Cloud, DevOps, AI / ML, etc.'
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Intermediate',
    comment: 'Difficulty level: Beginner, Intermediate, Advanced, Expert'
  },
  requiredLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 75,
    field: 'requiredLevel',
    comment: 'Target proficiency benchmark score (0-100)'
  },
  userLevel: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    field: 'userLevel',
    comment: 'Candidate assessed skill proficiency score (0-100)'
  },
  assessedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'assessedAt',
    comment: 'Timestamp when candidate assessed this skill'
  },
  estimatedHours: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    field: 'estimatedHours',
    comment: 'Estimated study / practice hours needed to acquire competency'
  },
  isOptional: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'isOptional',
    comment: 'Whether this skill is optional / nice-to-have for the target role'
  },
  // Curated learning resource pointers: { official, youtube, course, practice }
  resources: {
    type: DataTypes.JSON,
    defaultValue: {},
    comment: 'Curated learning resources: { official: URL, youtube: URL, course: URL }',
    get() {
      let val = this.getDataValue('resources');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return (val && typeof val === 'object') ? val : {};
    },
    set(val) {
      this.setDataValue('resources', val);
    }
  },
  // User assessment fields
  proficiency: {
    type: DataTypes.STRING,
    defaultValue: SKILL_PROFICIENCY ? SKILL_PROFICIENCY.INTERMEDIATE : 'Intermediate',
    comment: 'User evaluated proficiency: Beginner, Intermediate, Advanced, Expert'
  },
  yearsOfExperience: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0,
    comment: 'Years of hands-on experience'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Whether skill assessment has been validated via mock tests'
  }
}, {
  tableName: 'skills',
  timestamps: true,
  indexes: [
    {
      fields: ['role_id'],
      name: 'idx_skills_role_id'
    },
    {
      fields: ['userId'],
      name: 'idx_skills_user_id'
    },
    {
      fields: ['skillName'],
      name: 'idx_skills_name'
    }
  ]
});

// Alias virtual getters and setters for seamless JSON / snake_case interoperability
Object.defineProperty(Skill.prototype, 'skill', {
  get() {
    return this.getDataValue('skillName');
  },
  set(val) {
    this.setDataValue('skillName', val);
  }
});

Object.defineProperty(Skill.prototype, 'role_id', {
  get() {
    return this.getDataValue('roleId');
  },
  set(val) {
    this.setDataValue('roleId', val);
  }
});

Object.defineProperty(Skill.prototype, 'required_level', {
  get() {
    return this.getDataValue('requiredLevel');
  },
  set(val) {
    this.setDataValue('requiredLevel', val);
  }
});

Object.defineProperty(Skill.prototype, 'estimated_hours', {
  get() {
    return this.getDataValue('estimatedHours');
  },
  set(val) {
    this.setDataValue('estimatedHours', val);
  }
});

Object.defineProperty(Skill.prototype, 'is_optional', {
  get() {
    return this.getDataValue('isOptional');
  },
  set(val) {
    this.setDataValue('isOptional', val);
  }
});

// Helper migration function to add missing columns in existing SQLite tables
Skill.syncColumns = async () => {
  try {
    if (sequelize.getDialect() === 'sqlite') {
      const [cols] = await sequelize.query("PRAGMA table_info('skills');");
      const existingColNames = cols.map(c => c.name);

      const columnsToAdd = [
        { name: 'userLevel', type: 'INTEGER DEFAULT 50' },
        { name: 'assessedAt', type: 'DATETIME' }
      ];

      for (const col of columnsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE skills ADD COLUMN ${col.name} ${col.type};`);
        }
      }
    }
  } catch (err) {
    console.warn('⚠️ [Skill.syncColumns] Notice:', err.message);
  }
};

module.exports = Skill;
