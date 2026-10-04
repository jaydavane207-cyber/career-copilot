// backend/models/Resource.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Resource Model
 * Stores curated learning resources mapped by technical skill.
 * Contains 100+ handpicked official documentations, top YouTube channels/playlists,
 * GitHub practice repositories, and interactive tutorials.
 */
const Resource = sequelize.define('Resource', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  skill: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The targeted technical skill, e.g. React, JavaScript, System Design, Docker'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Descriptive title of the resource'
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: 'Documentation',
    comment: 'Resource type: Documentation, Video, Course, GitHub Repo, Interactive, Articles'
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Direct link URL to the learning resource'
  },
  free: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Whether the resource is 100% free or freemium/paid'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Brief summary of what the resource covers and why it is recommended'
  },
  level: {
    type: DataTypes.STRING,
    defaultValue: 'Beginner',
    comment: 'Target audience level: Beginner, Intermediate, Advanced, All Levels'
  },
  provider: {
    type: DataTypes.STRING,
    defaultValue: 'Official',
    comment: 'Author or platform: MDN, FreeCodeCamp, Striver / TakeUforward, ByteByteGo, etc.'
  }
}, {
  tableName: 'resources',
  timestamps: true,
  indexes: [
    { fields: ['skill'], name: 'idx_resources_skill' },
    { fields: ['type'], name: 'idx_resources_type' }
  ]
});

module.exports = Resource;
