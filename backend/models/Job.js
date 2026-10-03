// backend/models/Job.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JOB_STAGES = {
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFER: 'offer'
};

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Company name is required' }
    }
  },
  jobTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Job title is required' }
    }
  },
  jobLink: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stage: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: JOB_STAGES.APPLIED,
    validate: {
      isIn: {
        args: [['applied', 'interview', 'offer']],
        msg: "Stage must be one of: 'applied', 'interview', 'offer'"
      }
    }
  },
  dateApplied: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW
  },
  interviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Compatibility columns for existing components / queries
  positionTitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  jobUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  appliedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  salaryRange: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  hooks: {
    beforeValidate: (job) => {
      // Sync canonical fields with compatibility fields
      if (job.jobTitle && !job.positionTitle) job.positionTitle = job.jobTitle;
      if (job.positionTitle && !job.jobTitle) job.jobTitle = job.positionTitle;
      if (job.jobLink && !job.jobUrl) job.jobUrl = job.jobLink;
      if (job.jobUrl && !job.jobLink) job.jobLink = job.jobUrl;
      if (job.salary && !job.salaryRange) job.salaryRange = job.salary;
      if (job.salaryRange && !job.salary) job.salary = job.salaryRange;
      if (job.dateApplied && !job.appliedDate) job.appliedDate = job.dateApplied;
      if (job.appliedDate && !job.dateApplied) job.dateApplied = job.appliedDate;

      if (job.stage) {
        const s = String(job.stage).toLowerCase();
        if (s.includes('interview')) job.status = 'Interviewing';
        else if (s.includes('offer')) job.status = 'Offer';
        else job.status = 'Applied';
      } else if (job.status) {
        const s = String(job.status).toLowerCase();
        if (s.includes('interview')) job.stage = 'interview';
        else if (s.includes('offer')) job.stage = 'offer';
        else job.stage = 'applied';
      }
    },
    beforeSave: (job) => {
      if (job.jobTitle && !job.positionTitle) job.positionTitle = job.jobTitle;
      if (job.jobLink && !job.jobUrl) job.jobUrl = job.jobLink;
      if (job.salary && !job.salaryRange) job.salaryRange = job.salary;
      if (job.dateApplied && !job.appliedDate) job.appliedDate = job.dateApplied;
      if (job.stage) {
        job.status = job.stage === 'interview' ? 'Interviewing' : job.stage === 'offer' ? 'Offer' : 'Applied';
      }
    }
  }
});

// Clean JSON representation
Job.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  const stage = values.stage || 'applied';

  return {
    id: values.id,
    userId: values.userId,
    companyName: values.companyName,
    jobTitle: values.jobTitle || values.positionTitle,
    jobLink: values.jobLink || values.jobUrl || null,
    stage: stage,
    dateApplied: values.dateApplied || values.appliedDate || (values.createdAt ? new Date(values.createdAt).toISOString().split('T')[0] : null),
    interviewDate: values.interviewDate || null,
    notes: values.notes || '',
    salary: values.salary || values.salaryRange || null,
    createdAt: values.createdAt,
    updatedAt: values.updatedAt,
    // Compatibility fields
    positionTitle: values.jobTitle || values.positionTitle,
    jobUrl: values.jobLink || values.jobUrl || null,
    appliedDate: values.dateApplied || values.appliedDate,
    salaryRange: values.salary || values.salaryRange,
    status: stage === 'interview' ? 'Interviewing' : stage === 'offer' ? 'Offer' : 'Applied'
  };
};

module.exports = Job;
module.exports.JOB_STAGES = JOB_STAGES;
