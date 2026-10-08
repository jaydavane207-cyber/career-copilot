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
  jobScrapedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'job_scraped_at'
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
  criticalSkills: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'critical_skills',
    get() {
      let val = this.getDataValue('criticalSkills');
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
      this.setDataValue('criticalSkills', val);
    }
  },
  jobAnalysis: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'job_analysis',
    get() {
      let val = this.getDataValue('jobAnalysis');
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
      this.setDataValue('jobAnalysis', val);
    }
  },
  userMatchLevel: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'user_match_level'
  },
  prepTimeEstimate: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'prep_time_estimate'
  },
  prepRecommendations: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'prep_recommendations',
    get() {
      let val = this.getDataValue('prepRecommendations');
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
      this.setDataValue('prepRecommendations', val);
    }
  },
  redFlags: {
    type: DataTypes.JSON,
    defaultValue: [],
    field: 'red_flags',
    get() {
      let val = this.getDataValue('redFlags');
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
      this.setDataValue('redFlags', val);
    }
  },
  autoSaved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'auto_saved'
  },
  scrapedSuccessfully: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'scraped_successfully'
  },
  // Compatibility columns
  aiAnalysis: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'ai_analysis',
    get() {
      let val = this.getDataValue('aiAnalysis') || this.getDataValue('jobAnalysis');
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
      this.setDataValue('jobAnalysis', val);
    }
  },
  scrapedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'scraped_at'
  },
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
      if (job.jobTitle && !job.positionTitle) job.positionTitle = job.jobTitle;
      if (job.positionTitle && !job.jobTitle) job.jobTitle = job.positionTitle;
      if (job.jobLink && !job.jobUrl) job.jobUrl = job.jobLink;
      if (job.jobUrl && !job.jobLink) job.jobLink = job.jobUrl;
      if (job.salary && !job.salaryRange) job.salaryRange = job.salary;
      if (job.salaryRange && !job.salary) job.salary = job.salaryRange;
      if (job.dateApplied && !job.appliedDate) job.appliedDate = job.dateApplied;
      if (job.appliedDate && !job.dateApplied) job.dateApplied = job.appliedDate;

      if (job.jobPostingUrl && !job.jobLink) job.jobLink = job.jobPostingUrl;
      if (job.jobLink && !job.jobPostingUrl) job.jobPostingUrl = job.jobLink;

      if (job.scrapedAt && !job.jobScrapedAt) job.jobScrapedAt = job.scrapedAt;
      if (job.jobScrapedAt && !job.scrapedAt) job.scrapedAt = job.jobScrapedAt;

      if (job.aiAnalysis && !job.jobAnalysis) job.jobAnalysis = job.aiAnalysis;
      if (job.jobAnalysis && !job.aiAnalysis) job.aiAnalysis = job.jobAnalysis;

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
      if (job.scrapedAt && !job.jobScrapedAt) job.jobScrapedAt = job.scrapedAt;
      if (job.jobScrapedAt && !job.scrapedAt) job.scrapedAt = job.jobScrapedAt;
      if (job.aiAnalysis && !job.jobAnalysis) job.jobAnalysis = job.aiAnalysis;
      if (job.jobAnalysis && !job.aiAnalysis) job.aiAnalysis = job.jobAnalysis;
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

Object.defineProperty(Job.prototype, 'job_scraped_at', {
  get() { return this.getDataValue('jobScrapedAt') || this.getDataValue('scrapedAt'); },
  set(val) { this.setDataValue('jobScrapedAt', val); this.setDataValue('scrapedAt', val); }
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

Object.defineProperty(Job.prototype, 'critical_skills', {
  get() { return this.criticalSkills; },
  set(val) { this.criticalSkills = val; }
});

Object.defineProperty(Job.prototype, 'job_analysis', {
  get() { return this.jobAnalysis || this.aiAnalysis; },
  set(val) { this.jobAnalysis = val; this.aiAnalysis = val; }
});

Object.defineProperty(Job.prototype, 'user_match_level', {
  get() { return this.getDataValue('userMatchLevel'); },
  set(val) { this.setDataValue('userMatchLevel', val); }
});

Object.defineProperty(Job.prototype, 'prep_time_estimate', {
  get() { return this.getDataValue('prepTimeEstimate'); },
  set(val) { this.setDataValue('prepTimeEstimate', val); }
});

Object.defineProperty(Job.prototype, 'prep_recommendations', {
  get() { return this.prepRecommendations; },
  set(val) { this.prepRecommendations = val; }
});

Object.defineProperty(Job.prototype, 'red_flags', {
  get() { return this.redFlags; },
  set(val) { this.redFlags = val; }
});

Object.defineProperty(Job.prototype, 'scraped_successfully', {
  get() { return this.getDataValue('scrapedSuccessfully'); },
  set(val) { this.setDataValue('scrapedSuccessfully', val); }
});

Object.defineProperty(Job.prototype, 'ai_analysis', {
  get() { return this.aiAnalysis || this.jobAnalysis; },
  set(val) { this.aiAnalysis = val; this.jobAnalysis = val; }
});

Object.defineProperty(Job.prototype, 'scraped_at', {
  get() { return this.getDataValue('scrapedAt') || this.getDataValue('jobScrapedAt'); },
  set(val) { this.setDataValue('scrapedAt', val); this.setDataValue('jobScrapedAt', val); }
});

Object.defineProperty(Job.prototype, 'auto_saved', {
  get() { return this.getDataValue('autoSaved'); },
  set(val) { this.setDataValue('autoSaved', val); }
});

// Clean JSON representation
Job.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  const stage = values.stage || 'applied';
  const scrapedTimestamp = values.jobScrapedAt || values.scrapedAt || null;
  const analysisObj = this.jobAnalysis || this.aiAnalysis || null;

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
    jobScrapedAt: scrapedTimestamp,
    matchScore: values.matchScore !== undefined ? values.matchScore : (values.match_score !== undefined ? values.match_score : null),
    requiredSkills: this.requiredSkills || [],
    missingSkills: this.missingSkills || [],
    criticalSkills: this.criticalSkills || null,
    jobAnalysis: analysisObj,
    userMatchLevel: values.userMatchLevel || values.user_match_level || null,
    prepTimeEstimate: values.prepTimeEstimate !== undefined ? values.prepTimeEstimate : values.prep_time_estimate,
    prepRecommendations: this.prepRecommendations || null,
    redFlags: this.redFlags || [],
    autoSaved: values.autoSaved !== undefined ? values.autoSaved : Boolean(values.auto_saved),
    scrapedSuccessfully: values.scrapedSuccessfully !== undefined ? values.scrapedSuccessfully : (values.scraped_successfully !== undefined ? values.scraped_successfully : true),
    scrapedAt: scrapedTimestamp,
    aiAnalysis: analysisObj,
    // Snake case aliases
    job_description: values.jobDescription || values.job_description || null,
    job_source: values.jobSource || values.job_source || 'other',
    job_posting_url: values.jobPostingUrl || values.job_posting_url || values.jobLink || null,
    job_scraped_at: scrapedTimestamp,
    match_score: values.matchScore !== undefined ? values.matchScore : (values.match_score !== undefined ? values.match_score : null),
    required_skills: this.requiredSkills || [],
    missing_skills: this.missingSkills || [],
    critical_skills: this.criticalSkills || null,
    job_analysis: analysisObj,
    user_match_level: values.userMatchLevel || values.user_match_level || null,
    prep_time_estimate: values.prepTimeEstimate !== undefined ? values.prepTimeEstimate : values.prep_time_estimate,
    prep_recommendations: this.prepRecommendations || null,
    red_flags: this.redFlags || [],
    auto_saved: values.autoSaved !== undefined ? values.autoSaved : Boolean(values.auto_saved),
    scraped_successfully: values.scrapedSuccessfully !== undefined ? values.scrapedSuccessfully : true,
    scraped_at: scrapedTimestamp,
    ai_analysis: analysisObj,
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
        { name: 'job_scraped_at', type: 'DATETIME' },
        { name: 'match_score', type: 'INTEGER' },
        { name: 'required_skills', type: 'TEXT' },
        { name: 'missing_skills', type: 'TEXT' },
        { name: 'critical_skills', type: 'TEXT' },
        { name: 'job_analysis', type: 'TEXT' },
        { name: 'user_match_level', type: 'VARCHAR(50)' },
        { name: 'prep_time_estimate', type: 'INTEGER' },
        { name: 'prep_recommendations', type: 'TEXT' },
        { name: 'red_flags', type: 'TEXT' },
        { name: 'auto_saved', type: 'BOOLEAN DEFAULT 0' },
        { name: 'scraped_successfully', type: 'BOOLEAN DEFAULT 1' },
        { name: 'ai_analysis', type: 'TEXT' },
        { name: 'scraped_at', type: 'DATETIME' }
      ];

      for (const col of columnsToAdd) {
        if (!existingColNames.includes(col.name)) {
          await sequelize.query(`ALTER TABLE jobs ADD COLUMN ${col.name} ${col.type};`);
        }
      }
      try {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_job_posting_url ON jobs(job_posting_url);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_match_score ON jobs(match_score);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_job_source ON jobs(job_source);`);
      } catch (idxErr) {
        // ignore if index already exists
      }
    } else if (dialect === 'postgres') {
      await sequelize.query(`
        ALTER TABLE jobs
        ADD COLUMN IF NOT EXISTS job_description TEXT,
        ADD COLUMN IF NOT EXISTS job_source VARCHAR(50),
        ADD COLUMN IF NOT EXISTS job_posting_url VARCHAR(500),
        ADD COLUMN IF NOT EXISTS job_scraped_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS match_score INTEGER,
        ADD COLUMN IF NOT EXISTS required_skills JSONB,
        ADD COLUMN IF NOT EXISTS missing_skills JSONB,
        ADD COLUMN IF NOT EXISTS critical_skills JSONB,
        ADD COLUMN IF NOT EXISTS job_analysis JSONB,
        ADD COLUMN IF NOT EXISTS user_match_level VARCHAR(50),
        ADD COLUMN IF NOT EXISTS prep_time_estimate INTEGER,
        ADD COLUMN IF NOT EXISTS prep_recommendations JSONB,
        ADD COLUMN IF NOT EXISTS red_flags TEXT[],
        ADD COLUMN IF NOT EXISTS auto_saved BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS scraped_successfully BOOLEAN DEFAULT true,
        ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
        ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP;
      `);
      try {
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_job_posting_url ON jobs(job_posting_url);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_match_score ON jobs(match_score);`);
        await sequelize.query(`CREATE INDEX IF NOT EXISTS idx_job_source ON jobs(job_source);`);
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
