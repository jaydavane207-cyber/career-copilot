// backend/models/Skill.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { SKILL_PROFICIENCY } = require('../config/constants');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  skillName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'General' // Frontend, Backend, Database, Cloud, Tooling
  },
  proficiency: {
    type: DataTypes.ENUM(
      SKILL_PROFICIENCY.BEGINNER,
      SKILL_PROFICIENCY.INTERMEDIATE,
      SKILL_PROFICIENCY.ADVANCED,
      SKILL_PROFICIENCY.EXPERT
    ),
    defaultValue: SKILL_PROFICIENCY.INTERMEDIATE
  },
  yearsOfExperience: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'skills',
  timestamps: true
});

module.exports = Skill;
