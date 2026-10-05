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
  // Real Job Postings Integration columns
  jobDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'job_description'
  },
  jobSource: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'other',
    field: 'job_source'
  },
  jobPostingUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'job_posting_url'
  },
  matchScore: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'match_score'
  },
  requiredSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'required_skills',
    get() {
      let val = this.getDataValue('requiredSkills');
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
      this.setDataValue('requiredSkills', val);
    }
  },
  missingSkills: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'missing_skills',
    get() {
      let val = this.getDataValue('missingSkills');
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
      this.setDataValue('missingSkills', val);
    }
  },
  aiAnalysis: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'ai_analysis',
    get() {
      let val = this.getDataValue('aiAnalysis');
      while (typeof val === 'string') {
        try {
          val = JSON.parse(val);
        } catch (e) {
          break;
        }
      }
      return val || null;
    },
    set(val) {
      this.setDataValue('aiAnalysis', val);
    }
  },
  scrapedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'scraped_at'
  },
  autoSaved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'auto_saved'
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

      // Sync jobPostingUrl with jobLink
      if (job.jobPostingUrl && !job.jobLink) job.jobLink = job.jobPostingUrl;
      if (job.jobLink && !job.jobPostingUrl) job.jobPostingUrl = job.jobLink;

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
      if (job.jobPostingUrl && !job.jobLink) job.jobLink = job.jobPostingUrl;
      if (job.jobLink && !job.jobPostingUrl) job.jobPostingUrl = job.jobLink;
      if (job.salary && !job.salaryRange) job.salaryRange = job.salary;
      if (job.dateApplied && !job.appliedDate) job.appliedDate = job.dateApplied;
      if (job.stage) {
        job.status = job.stage === 'interview' ? 'Interviewing' : job.stage === 'offer' ? 'Offer' : 'Applied';
      }
    }
  }
});

// Alias virtual getters and setters for seamless JSON / snake_case interoperability
Object.defineProperty(Job.prototype, 'job_description', {
  get() { return this.getDataValue('jobDescription'); },
  set(val) { this.setDataValue('jobDescription', val); }
});

Object.defineProperty(Job.prototype, 'job_source', {
  get() { return this.getDataValue('jobSource'); },
  set(val) { this.setDataValue('jobSource', val); }
});

Object.defineProperty(Job.prototype, 'job_posting_url', {
  get() { return this.getDataValue('jobPostingUrl'); },
  set(val) { this.setDataValue('jobPostingUrl', val); }
});

Object.defineProperty(Job.prototype, 'match_score', {
  get() { return this.getDataValue('matchScore'); },
  set(val) { this.setDataValue('matchScore', val); }
});

Object.defineProperty(Job.prototype, 'required_skills', {
  get() { return this.requiredSkills; },
  set(val) { this.requiredSkills = val; }
});

Object.defineProperty(Job.prototype, 'missing_skills', {
  get() { return this.missingSkills; },
  set(val) { this.missingSkills = val; }
});

Object.defineProperty(Job.prototype, 'ai_analysis', {
  get() { return this.aiAnalysis; },
  set(val) { this.aiAnalysis = val; }
});

Object.defineProperty(Job.prototype, 'scraped_at', {
  get() { return this.getDataValue('scrapedAt'); },
  set(val) { this.setDataValue('scrapedAt', val); }
});

Object.defineProperty(Job.prototype, 'auto_saved', {
  get() { return this.getDataValue('autoSaved'); },
  set(val) { this.setDataValue('autoSaved', val); }
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
    jobLink: values.jobLink || values.jobUrl || values.jobPostingUrl || null,
    stage: stage,
    dateApplied: values.dateApplied || values.appliedDate || (values.createdAt ? new Date(values.createdAt).toISOString().split('T')[0] : null),
    interviewDate: values.interviewDate || null,
    notes: values.notes || '',
    salary: values.salary || values.salaryRange || null,
    // Real Job Postings Integration fields
    jobDescription: values.jobDescription || values.job_description || null,
    jobSource: values.jobSource || values.job_source || 'other',
    jobPostingUrl: values.jobPostingUrl || values.job_posting_url || values.jobLink || null,
    matchScore: values.matchScore !== undefined ? values.matchScore : (values.match_score !== undefined ? values.match_score : null),
    requiredSkills: this.requiredSkills || [],
    missingSkills: this.missingSkills || [],
    aiAnalysis: this.aiAnalysis || null,
    scrapedAt: values.scrapedAt || values.scraped_at || null,
    autoSaved: values.autoSaved !== undefined ? values.autoSaved : Boolean(values.auto_saved),
    // Snake case aliases
    job_description: values.jobDescription || values.job_description || null,
    job_source: values.jobSource || values.job_source || 'other',
    job_posting_url: values.jobPostingUrl || values.job_posting_url || values.jobLink || null,
    match_score: values.matchScore !== undefined ? values.matchScore : (values.match_score !== undefined ? values.match_score : null),
    required_skills: this.requiredSkills || [],
    missing_skills: this.missingSkills || [],
    ai_analysis: this.aiAnalysis || null,
    scraped_at: values.scrapedAt || values.scraped_at || null,
    auto_saved: values.autoSaved !== undefined ? values.autoSaved : Boolean(values.auto_saved),
    createdAt: values.createdAt,
    updatedAt: values.updatedAt,
    // Compatibility fields
    positionTitle: values.jobTitle || values.positionTitle,
    jobUrl: values.jobLink || values.jobUrl || values.jobPostingUrl || null,
    appliedDate: values.dateApplied || values.appliedDate,
    salaryRange: values.salary || values.salaryRange,
    status: stage === 'interview' ? 'Interviewing' : stage === 'offer' ? 'Offer' : 'Applied'
  };
};

// Helper migration function to add missing columns in existing SQLite or PostgreSQL tables
Job.syncColumns = async () => {
  try {
    const dialect = sequelize.getDialect();
    if (dialect === 'sqlite') {
      const [cols] = await sequelize.query("PRAGMA table_info('jobs');");
      const existingColNames = cols.map(c => c.name);

      const columnsToAdd = [
        { name: 'job_description', type: 'TEXT' },
        { name: 'job_source', type: 'VARCHAR(50)' },
        { name: 'job_posting_url', type: 'VARCHAR(500)' },
        { name: 'match_score', type: 'INTEGER' },
        { name: 'required_skills', type: 'TEXT' },
        { name: 'missing_skills', type: 'TEXT' },
        { name: 'ai_analysis', type: 'TEXT' },
        { name: 'scraped_at', type: 'DATETIME' },
        { name: 'auto_saved', type: 'BOOLEAN DEFAULT 0' }
      ];

      for (const col of columnsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE jobs ADD COLUMN ${col.name} ${col.type};`);
        }
      }
      try {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_job_posting_url ON jobs(job_posting_url);`);
      } catch (idxErr) {
        // ignore if index already exists
      }
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        ALTER TABLE jobs
        ADD COLUMN IF NOT EXISTS job_description TEXT,
        ADD COLUMN IF NOT EXISTS job_source VARCHAR(50),
        ADD COLUMN IF NOT EXISTS job_posting_url VARCHAR(500),
        ADD COLUMN IF NOT EXISTS match_score INTEGER,
        ADD COLUMN IF NOT EXISTS required_skills JSONB,
        ADD COLUMN IF NOT EXISTS missing_skills JSONB,
        ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
        ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS auto_saved BOOLEAN DEFAULT false;
      `);
      try {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_job_posting_url ON jobs(job_posting_url);`);
      } catch (idxErr) {
        // ignore
      }
    }
  } catch (err) {
    console.warn('⚠️ [Job.syncColumns] Notice:', err.message);
  }
};

module.exports = Job;
module.exports.JOB_STAGES = JOB_STAGES;
