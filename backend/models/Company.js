// backend/models/Company.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 1. Company Model (table: companies)
 */
const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('logo_url') || this.getDataValue('logoUrl');
    },
    set(val) {
      this.setDataValue('logo_url', val);
      this.setDataValue('logoUrl', val);
    }
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('logoUrl') || this.getDataValue('logo_url');
    },
    set(val) {
      this.setDataValue('logoUrl', val);
      this.setDataValue('logo_url', val);
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  headquarters: {
    type: DataTypes.STRING,
    allowNull: true
  },
  founded_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    get() {
      return this.getDataValue('founded_year') ?? this.getDataValue('foundedYear');
    },
    set(val) {
      this.setDataValue('founded_year', val);
      this.setDataValue('foundedYear', val);
    }
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    get() {
      return this.getDataValue('foundedYear') ?? this.getDataValue('founded_year');
    },
    set(val) {
      this.setDataValue('foundedYear', val);
      this.setDataValue('founded_year', val);
    }
  },
  employee_count: {
    type: DataTypes.STRING,
    defaultValue: '10,000+',
    get() {
      return this.getDataValue('employee_count') || this.getDataValue('employeeCount');
    },
    set(val) {
      this.setDataValue('employee_count', val);
      this.setDataValue('employeeCount', val);
    }
  },
  employeeCount: {
    type: DataTypes.STRING,
    defaultValue: '10,000+',
    get() {
      return this.getDataValue('employeeCount') || this.getDataValue('employee_count');
    },
    set(val) {
      this.setDataValue('employeeCount', val);
      this.setDataValue('employee_count', val);
    }
  },
  industry: {
    type: DataTypes.STRING,
    defaultValue: 'Technology'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  culture_summary: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('culture_summary') || this.getDataValue('cultureSummary');
    },
    set(val) {
      this.setDataValue('culture_summary', val);
      this.setDataValue('cultureSummary', val);
    }
  },
  cultureSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('cultureSummary') || this.getDataValue('culture_summary');
    },
    set(val) {
      this.setDataValue('cultureSummary', val);
      this.setDataValue('culture_summary', val);
    }
  },
  interview_difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Hard',
    get() {
      return this.getDataValue('interview_difficulty') || this.getDataValue('interviewDifficulty');
    },
    set(val) {
      this.setDataValue('interview_difficulty', val);
      this.setDataValue('interviewDifficulty', val);
    }
  },
  interviewDifficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Hard',
    get() {
      return this.getDataValue('interviewDifficulty') || this.getDataValue('interview_difficulty');
    },
    set(val) {
      this.setDataValue('interviewDifficulty', val);
      this.setDataValue('interview_difficulty', val);
    }
  },
  average_interview_rounds: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('average_interview_rounds') ?? this.getDataValue('averageInterviewRounds') ?? 4;
    },
    set(val) {
      this.setDataValue('average_interview_rounds', val);
      this.setDataValue('averageInterviewRounds', val);
    }
  },
  averageInterviewRounds: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('averageInterviewRounds') ?? this.getDataValue('average_interview_rounds') ?? 4;
    },
    set(val) {
      this.setDataValue('averageInterviewRounds', val);
      this.setDataValue('average_interview_rounds', val);
    }
  },
  average_interview_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 21,
    get() {
      return this.getDataValue('average_interview_duration') ?? this.getDataValue('averageInterviewDuration') ?? 21;
    },
    set(val) {
      this.setDataValue('average_interview_duration', val);
      this.setDataValue('averageInterviewDuration', val);
    }
  },
  averageInterviewDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 21,
    get() {
      return this.getDataValue('averageInterviewDuration') ?? this.getDataValue('average_interview_duration') ?? 21;
    },
    set(val) {
      this.setDataValue('averageInterviewDuration', val);
      this.setDataValue('average_interview_duration', val);
    }
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'companies',
  timestamps: true
});

/**
 * 2. CompanyInterviewQuestion Model (table: company_interview_questions)
 */
const CompanyInterviewQuestion = sequelize.define('CompanyInterviewQuestion', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'SDE'
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'Technical' // 'System Design', 'Behavioral', 'Technical', 'Product Sense'
  },
  difficulty: {
    type: DataTypes.STRING,
    defaultValue: 'Medium' // 'Easy', 'Medium', 'Hard'
  },
  frequency: {
    type: DataTypes.INTEGER,
    defaultValue: 5 // 1 - 10
  },
  sample_answer: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('sample_answer') || this.getDataValue('sampleAnswer');
    },
    set(val) {
      this.setDataValue('sample_answer', val);
      this.setDataValue('sampleAnswer', val);
    }
  },
  sampleAnswer: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('sampleAnswer') || this.getDataValue('sample_answer');
    },
    set(val) {
      this.setDataValue('sampleAnswer', val);
      this.setDataValue('sample_answer', val);
    }
  },
  tips: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  follow_up_questions: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('follow_up_questions') || this.getDataValue('followUpQuestions') || [];
    },
    set(val) {
      this.setDataValue('follow_up_questions', val);
      this.setDataValue('followUpQuestions', val);
    }
  },
  followUpQuestions: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('followUpQuestions') || this.getDataValue('follow_up_questions') || [];
    },
    set(val) {
      this.setDataValue('followUpQuestions', val);
      this.setDataValue('follow_up_questions', val);
    }
  },
  source: {
    type: DataTypes.STRING,
    defaultValue: 'blind' // 'blind', 'user_submission', 'leetcode', 'glassdoor'
  },
  submitted_by_user: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    get() {
      return this.getDataValue('submitted_by_user') ?? this.getDataValue('submittedByUser') ?? false;
    },
    set(val) {
      this.setDataValue('submitted_by_user', Boolean(val));
      this.setDataValue('submittedByUser', Boolean(val));
    }
  },
  submittedByUser: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    get() {
      return this.getDataValue('submittedByUser') ?? this.getDataValue('submitted_by_user') ?? false;
    },
    set(val) {
      this.setDataValue('submittedByUser', Boolean(val));
      this.setDataValue('submitted_by_user', Boolean(val));
    }
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('helpful_count') ?? this.getDataValue('helpfulCount') ?? 0;
    },
    set(val) {
      this.setDataValue('helpful_count', val);
      this.setDataValue('helpfulCount', val);
    }
  },
  helpfulCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('helpfulCount') ?? this.getDataValue('helpful_count') ?? 0;
    },
    set(val) {
      this.setDataValue('helpfulCount', val);
      this.setDataValue('helpful_count', val);
    }
  }
}, {
  tableName: 'company_interview_questions',
  timestamps: true
});

/**
 * 3. CompanySalaryData Model (table: company_salary_data)
 */
const CompanySalaryData = sequelize.define('CompanySalaryData', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'United States'
  },
  salary_low: {
    type: DataTypes.INTEGER,
    defaultValue: 140000,
    get() {
      return this.getDataValue('salary_low') ?? this.getDataValue('salaryLow') ?? 140000;
    },
    set(val) {
      this.setDataValue('salary_low', val);
      this.setDataValue('salaryLow', val);
    }
  },
  salaryLow: {
    type: DataTypes.INTEGER,
    defaultValue: 140000,
    get() {
      return this.getDataValue('salaryLow') ?? this.getDataValue('salary_low') ?? 140000;
    },
    set(val) {
      this.setDataValue('salaryLow', val);
      this.setDataValue('salary_low', val);
    }
  },
  salary_high: {
    type: DataTypes.INTEGER,
    defaultValue: 200000,
    get() {
      return this.getDataValue('salary_high') ?? this.getDataValue('salaryHigh') ?? 200000;
    },
    set(val) {
      this.setDataValue('salary_high', val);
      this.setDataValue('salaryHigh', val);
    }
  },
  salaryHigh: {
    type: DataTypes.INTEGER,
    defaultValue: 200000,
    get() {
      return this.getDataValue('salaryHigh') ?? this.getDataValue('salary_high') ?? 200000;
    },
    set(val) {
      this.setDataValue('salaryHigh', val);
      this.setDataValue('salary_high', val);
    }
  },
  salary_average: {
    type: DataTypes.INTEGER,
    defaultValue: 170000,
    get() {
      return this.getDataValue('salary_average') ?? this.getDataValue('salaryAverage') ?? 170000;
    },
    set(val) {
      this.setDataValue('salary_average', val);
      this.setDataValue('salaryAverage', val);
    }
  },
  salaryAverage: {
    type: DataTypes.INTEGER,
    defaultValue: 170000,
    get() {
      return this.getDataValue('salaryAverage') ?? this.getDataValue('salary_average') ?? 170000;
    },
    set(val) {
      this.setDataValue('salaryAverage', val);
      this.setDataValue('salary_average', val);
    }
  },
  bonus_low: {
    type: DataTypes.INTEGER,
    defaultValue: 15000,
    get() {
      return this.getDataValue('bonus_low') ?? this.getDataValue('bonusLow') ?? 15000;
    },
    set(val) {
      this.setDataValue('bonus_low', val);
      this.setDataValue('bonusLow', val);
    }
  },
  bonusLow: {
    type: DataTypes.INTEGER,
    defaultValue: 15000,
    get() {
      return this.getDataValue('bonusLow') ?? this.getDataValue('bonus_low') ?? 15000;
    },
    set(val) {
      this.setDataValue('bonusLow', val);
      this.setDataValue('bonus_low', val);
    }
  },
  bonus_high: {
    type: DataTypes.INTEGER,
    defaultValue: 45000,
    get() {
      return this.getDataValue('bonus_high') ?? this.getDataValue('bonusHigh') ?? 45000;
    },
    set(val) {
      this.setDataValue('bonus_high', val);
      this.setDataValue('bonusHigh', val);
    }
  },
  bonusHigh: {
    type: DataTypes.INTEGER,
    defaultValue: 45000,
    get() {
      return this.getDataValue('bonusHigh') ?? this.getDataValue('bonus_high') ?? 45000;
    },
    set(val) {
      this.setDataValue('bonusHigh', val);
      this.setDataValue('bonus_high', val);
    }
  },
  bonus_average: {
    type: DataTypes.INTEGER,
    defaultValue: 30000,
    get() {
      return this.getDataValue('bonus_average') ?? this.getDataValue('bonusAverage') ?? 30000;
    },
    set(val) {
      this.setDataValue('bonus_average', val);
      this.setDataValue('bonusAverage', val);
    }
  },
  bonusAverage: {
    type: DataTypes.INTEGER,
    defaultValue: 30000,
    get() {
      return this.getDataValue('bonusAverage') ?? this.getDataValue('bonus_average') ?? 30000;
    },
    set(val) {
      this.setDataValue('bonusAverage', val);
      this.setDataValue('bonus_average', val);
    }
  },
  equity_low: {
    type: DataTypes.INTEGER,
    defaultValue: 25000,
    get() {
      return this.getDataValue('equity_low') ?? this.getDataValue('equityLow') ?? 25000;
    },
    set(val) {
      this.setDataValue('equity_low', val);
      this.setDataValue('equityLow', val);
    }
  },
  equityLow: {
    type: DataTypes.INTEGER,
    defaultValue: 25000,
    get() {
      return this.getDataValue('equityLow') ?? this.getDataValue('equity_low') ?? 25000;
    },
    set(val) {
      this.setDataValue('equityLow', val);
      this.setDataValue('equity_low', val);
    }
  },
  equity_high: {
    type: DataTypes.INTEGER,
    defaultValue: 80000,
    get() {
      return this.getDataValue('equity_high') ?? this.getDataValue('equityHigh') ?? 80000;
    },
    set(val) {
      this.setDataValue('equity_high', val);
      this.setDataValue('equityHigh', val);
    }
  },
  equityHigh: {
    type: DataTypes.INTEGER,
    defaultValue: 80000,
    get() {
      return this.getDataValue('equityHigh') ?? this.getDataValue('equity_high') ?? 80000;
    },
    set(val) {
      this.setDataValue('equityHigh', val);
      this.setDataValue('equity_high', val);
    }
  },
  total_comp_low: {
    type: DataTypes.INTEGER,
    defaultValue: 180000,
    get() {
      return this.getDataValue('total_comp_low') ?? this.getDataValue('totalCompLow') ?? 180000;
    },
    set(val) {
      this.setDataValue('total_comp_low', val);
      this.setDataValue('totalCompLow', val);
    }
  },
  totalCompLow: {
    type: DataTypes.INTEGER,
    defaultValue: 180000,
    get() {
      return this.getDataValue('totalCompLow') ?? this.getDataValue('total_comp_low') ?? 180000;
    },
    set(val) {
      this.setDataValue('totalCompLow', val);
      this.setDataValue('total_comp_low', val);
    }
  },
  total_comp_high: {
    type: DataTypes.INTEGER,
    defaultValue: 300000,
    get() {
      return this.getDataValue('total_comp_high') ?? this.getDataValue('totalCompHigh') ?? 300000;
    },
    set(val) {
      this.setDataValue('total_comp_high', val);
      this.setDataValue('totalCompHigh', val);
    }
  },
  totalCompHigh: {
    type: DataTypes.INTEGER,
    defaultValue: 300000,
    get() {
      return this.getDataValue('totalCompHigh') ?? this.getDataValue('total_comp_high') ?? 300000;
    },
    set(val) {
      this.setDataValue('totalCompHigh', val);
      this.setDataValue('total_comp_high', val);
    }
  },
  total_comp_average: {
    type: DataTypes.INTEGER,
    defaultValue: 235000,
    get() {
      return this.getDataValue('total_comp_average') ?? this.getDataValue('totalCompAverage') ?? 235000;
    },
    set(val) {
      this.setDataValue('total_comp_average', val);
      this.setDataValue('totalCompAverage', val);
    }
  },
  totalCompAverage: {
    type: DataTypes.INTEGER,
    defaultValue: 235000,
    get() {
      return this.getDataValue('totalCompAverage') ?? this.getDataValue('total_comp_average') ?? 235000;
    },
    set(val) {
      this.setDataValue('totalCompAverage', val);
      this.setDataValue('total_comp_average', val);
    }
  },
  data_points: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    get() {
      return this.getDataValue('data_points') ?? this.getDataValue('dataPoints') ?? 50;
    },
    set(val) {
      this.setDataValue('data_points', val);
      this.setDataValue('dataPoints', val);
    }
  },
  dataPoints: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    get() {
      return this.getDataValue('dataPoints') ?? this.getDataValue('data_points') ?? 50;
    },
    set(val) {
      this.setDataValue('dataPoints', val);
      this.setDataValue('data_points', val);
    }
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    get() {
      return this.getDataValue('last_updated') || this.getDataValue('lastUpdated');
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
      return this.getDataValue('lastUpdated') || this.getDataValue('last_updated');
    },
    set(val) {
      this.setDataValue('lastUpdated', val);
      this.setDataValue('last_updated', val);
    }
  }
}, {
  tableName: 'company_salary_data',
  timestamps: true
});

/**
 * 4. CompanyReview Model (table: company_reviews)
 */
const CompanyReview = sequelize.define('CompanyReview', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
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
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Software Engineer'
  },
  employment_status: {
    type: DataTypes.STRING,
    defaultValue: 'Current', // 'Current', 'Former'
    get() {
      return this.getDataValue('employment_status') || this.getDataValue('employmentStatus');
    },
    set(val) {
      this.setDataValue('employment_status', val);
      this.setDataValue('employmentStatus', val);
    }
  },
  employmentStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Current',
    get() {
      return this.getDataValue('employmentStatus') || this.getDataValue('employment_status');
    },
    set(val) {
      this.setDataValue('employmentStatus', val);
      this.setDataValue('employment_status', val);
    }
  },
  years_at_company: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    get() {
      return this.getDataValue('years_at_company') ?? this.getDataValue('yearsAtCompany') ?? 2;
    },
    set(val) {
      this.setDataValue('years_at_company', val);
      this.setDataValue('yearsAtCompany', val);
    }
  },
  yearsAtCompany: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    get() {
      return this.getDataValue('yearsAtCompany') ?? this.getDataValue('years_at_company') ?? 2;
    },
    set(val) {
      this.setDataValue('yearsAtCompany', val);
      this.setDataValue('years_at_company', val);
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 4 // 1 - 5
  },
  pros: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  cons: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  work_life_balance: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('work_life_balance') ?? this.getDataValue('workLifeBalance') ?? 4;
    },
    set(val) {
      this.setDataValue('work_life_balance', val);
      this.setDataValue('workLifeBalance', val);
    }
  },
  workLifeBalance: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('workLifeBalance') ?? this.getDataValue('work_life_balance') ?? 4;
    },
    set(val) {
      this.setDataValue('workLifeBalance', val);
      this.setDataValue('work_life_balance', val);
    }
  },
  culture_rating: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('culture_rating') ?? this.getDataValue('cultureRating') ?? 4;
    },
    set(val) {
      this.setDataValue('culture_rating', val);
      this.setDataValue('cultureRating', val);
    }
  },
  cultureRating: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('cultureRating') ?? this.getDataValue('culture_rating') ?? 4;
    },
    set(val) {
      this.setDataValue('cultureRating', val);
      this.setDataValue('culture_rating', val);
    }
  },
  management_rating: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('management_rating') ?? this.getDataValue('managementRating') ?? 4;
    },
    set(val) {
      this.setDataValue('management_rating', val);
      this.setDataValue('managementRating', val);
    }
  },
  managementRating: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('managementRating') ?? this.getDataValue('management_rating') ?? 4;
    },
    set(val) {
      this.setDataValue('managementRating', val);
      this.setDataValue('management_rating', val);
    }
  },
  compensation_rating: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('compensation_rating') ?? this.getDataValue('compensationRating') ?? 4;
    },
    set(val) {
      this.setDataValue('compensation_rating', val);
      this.setDataValue('compensationRating', val);
    }
  },
  compensationRating: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('compensationRating') ?? this.getDataValue('compensation_rating') ?? 4;
    },
    set(val) {
      this.setDataValue('compensationRating', val);
      this.setDataValue('compensation_rating', val);
    }
  }
}, {
  tableName: 'company_reviews',
  timestamps: true
});

/**
 * 5. CompanySuccessStory Model (table: company_success_stories)
 */
const CompanySuccessStory = sequelize.define('CompanySuccessStory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
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
  role: {
    type: DataTypes.STRING,
    defaultValue: 'SDE'
  },
  experience_level: {
    type: DataTypes.STRING,
    defaultValue: 'Mid', // 'Junior', 'Mid', 'Senior'
    get() {
      return this.getDataValue('experience_level') || this.getDataValue('experienceLevel');
    },
    set(val) {
      this.setDataValue('experience_level', val);
      this.setDataValue('experienceLevel', val);
    }
  },
  experienceLevel: {
    type: DataTypes.STRING,
    defaultValue: 'Mid',
    get() {
      return this.getDataValue('experienceLevel') || this.getDataValue('experience_level');
    },
    set(val) {
      this.setDataValue('experienceLevel', val);
      this.setDataValue('experience_level', val);
    }
  },
  years_experience: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    get() {
      return this.getDataValue('years_experience') ?? this.getDataValue('yearsExperience') ?? 3;
    },
    set(val) {
      this.setDataValue('years_experience', val);
      this.setDataValue('yearsExperience', val);
    }
  },
  yearsExperience: {
    type: DataTypes.INTEGER,
    defaultValue: 3,
    get() {
      return this.getDataValue('yearsExperience') ?? this.getDataValue('years_experience') ?? 3;
    },
    set(val) {
      this.setDataValue('yearsExperience', val);
      this.setDataValue('years_experience', val);
    }
  },
  interview_duration: {
    type: DataTypes.INTEGER,
    defaultValue: 21,
    get() {
      return this.getDataValue('interview_duration') ?? this.getDataValue('interviewDuration') ?? 21;
    },
    set(val) {
      this.setDataValue('interview_duration', val);
      this.setDataValue('interviewDuration', val);
    }
  },
  interviewDuration: {
    type: DataTypes.INTEGER,
    defaultValue: 21,
    get() {
      return this.getDataValue('interviewDuration') ?? this.getDataValue('interview_duration') ?? 21;
    },
    set(val) {
      this.setDataValue('interviewDuration', val);
      this.setDataValue('interview_duration', val);
    }
  },
  preparation_weeks: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('preparation_weeks') ?? this.getDataValue('preparationWeeks') ?? 4;
    },
    set(val) {
      this.setDataValue('preparation_weeks', val);
      this.setDataValue('preparationWeeks', val);
    }
  },
  preparationWeeks: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('preparationWeeks') ?? this.getDataValue('preparation_weeks') ?? 4;
    },
    set(val) {
      this.setDataValue('preparationWeeks', val);
      this.setDataValue('preparation_weeks', val);
    }
  },
  interview_rounds: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('interview_rounds') ?? this.getDataValue('interviewRounds') ?? 4;
    },
    set(val) {
      this.setDataValue('interview_rounds', val);
      this.setDataValue('interviewRounds', val);
    }
  },
  interviewRounds: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('interviewRounds') ?? this.getDataValue('interview_rounds') ?? 4;
    },
    set(val) {
      this.setDataValue('interviewRounds', val);
      this.setDataValue('interview_rounds', val);
    }
  },
  key_preparation: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('key_preparation') || this.getDataValue('keyPreparation') || [];
    },
    set(val) {
      this.setDataValue('key_preparation', val);
      this.setDataValue('keyPreparation', val);
    }
  },
  keyPreparation: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('keyPreparation') || this.getDataValue('key_preparation') || [];
    },
    set(val) {
      this.setDataValue('keyPreparation', val);
      this.setDataValue('key_preparation', val);
    }
  },
  tips_for_success: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('tips_for_success') || this.getDataValue('tipsForSuccess') || [];
    },
    set(val) {
      this.setDataValue('tips_for_success', val);
      this.setDataValue('tipsForSuccess', val);
    }
  },
  tipsForSuccess: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('tipsForSuccess') || this.getDataValue('tips_for_success') || [];
    },
    set(val) {
      this.setDataValue('tipsForSuccess', val);
      this.setDataValue('tips_for_success', val);
    }
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  salary_negotiated: {
    type: DataTypes.INTEGER,
    defaultValue: 180000,
    get() {
      return this.getDataValue('salary_negotiated') ?? this.getDataValue('salaryNegotiated') ?? 180000;
    },
    set(val) {
      this.setDataValue('salary_negotiated', val);
      this.setDataValue('salaryNegotiated', val);
    }
  },
  salaryNegotiated: {
    type: DataTypes.INTEGER,
    defaultValue: 180000,
    get() {
      return this.getDataValue('salaryNegotiated') ?? this.getDataValue('salary_negotiated') ?? 180000;
    },
    set(val) {
      this.setDataValue('salaryNegotiated', val);
      this.setDataValue('salary_negotiated', val);
    }
  },
  offer_accepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      return this.getDataValue('offer_accepted') ?? this.getDataValue('offerAccepted') ?? true;
    },
    set(val) {
      this.setDataValue('offer_accepted', Boolean(val));
      this.setDataValue('offerAccepted', Boolean(val));
    }
  },
  offerAccepted: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      return this.getDataValue('offerAccepted') ?? this.getDataValue('offer_accepted') ?? true;
    },
    set(val) {
      this.setDataValue('offerAccepted', Boolean(val));
      this.setDataValue('offer_accepted', Boolean(val));
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
}, {
  tableName: 'company_success_stories',
  timestamps: true
});

/**
 * 6. CompanyInterviewProcess Model (table: company_interview_processes)
 */
const CompanyInterviewProcess = sequelize.define('CompanyInterviewProcess', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Senior Software Engineer'
  },
  round_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    get() {
      return this.getDataValue('round_number') ?? this.getDataValue('roundNumber') ?? 1;
    },
    set(val) {
      this.setDataValue('round_number', val);
      this.setDataValue('roundNumber', val);
    }
  },
  roundNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    get() {
      return this.getDataValue('roundNumber') ?? this.getDataValue('round_number') ?? 1;
    },
    set(val) {
      this.setDataValue('roundNumber', val);
      this.setDataValue('round_number', val);
    }
  },
  round_name: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('round_name') || this.getDataValue('roundName');
    },
    set(val) {
      this.setDataValue('round_name', val);
      this.setDataValue('roundName', val);
    }
  },
  roundName: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue('roundName') || this.getDataValue('round_name');
    },
    set(val) {
      this.setDataValue('roundName', val);
      this.setDataValue('round_name', val);
    }
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 45,
    get() {
      return this.getDataValue('duration_minutes') ?? this.getDataValue('durationMinutes') ?? 45;
    },
    set(val) {
      this.setDataValue('duration_minutes', val);
      this.setDataValue('durationMinutes', val);
    }
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 45,
    get() {
      return this.getDataValue('durationMinutes') ?? this.getDataValue('duration_minutes') ?? 45;
    },
    set(val) {
      this.setDataValue('durationMinutes', val);
      this.setDataValue('duration_minutes', val);
    }
  },
  interviewer_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    get() {
      return this.getDataValue('interviewer_count') ?? this.getDataValue('interviewerCount') ?? 1;
    },
    set(val) {
      this.setDataValue('interviewer_count', val);
      this.setDataValue('interviewerCount', val);
    }
  },
  interviewerCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    get() {
      return this.getDataValue('interviewerCount') ?? this.getDataValue('interviewer_count') ?? 1;
    },
    set(val) {
      this.setDataValue('interviewerCount', val);
      this.setDataValue('interviewer_count', val);
    }
  },
  focus_areas: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('focus_areas') || this.getDataValue('focusAreas') || [];
    },
    set(val) {
      this.setDataValue('focus_areas', val);
      this.setDataValue('focusAreas', val);
    }
  },
  focusAreas: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('focusAreas') || this.getDataValue('focus_areas') || [];
    },
    set(val) {
      this.setDataValue('focusAreas', val);
      this.setDataValue('focus_areas', val);
    }
  },
  tips: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  rejection_rate: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    get() {
      return this.getDataValue('rejection_rate') ?? this.getDataValue('rejectionRate') ?? 30;
    },
    set(val) {
      this.setDataValue('rejection_rate', val);
      this.setDataValue('rejectionRate', val);
    }
  },
  rejectionRate: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
    get() {
      return this.getDataValue('rejectionRate') ?? this.getDataValue('rejection_rate') ?? 30;
    },
    set(val) {
      this.setDataValue('rejectionRate', val);
      this.setDataValue('rejection_rate', val);
    }
  }
}, {
  tableName: 'company_interview_processes',
  timestamps: true
});

/**
 * 7. CompanyCultureValue Model (table: company_culture_values)
 */
const CompanyCultureValue = sequelize.define('CompanyCultureValue', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  how_its_tested: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('how_its_tested') || this.getDataValue('howItsTested');
    },
    set(val) {
      this.setDataValue('how_its_tested', val);
      this.setDataValue('howItsTested', val);
    }
  },
  howItsTested: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      return this.getDataValue('howItsTested') || this.getDataValue('how_its_tested');
    },
    set(val) {
      this.setDataValue('howItsTested', val);
      this.setDataValue('how_its_tested', val);
    }
  },
  importance: {
    type: DataTypes.STRING,
    defaultValue: 'Critical' // 'Critical', 'Important', 'Nice-to-have'
  }
}, {
  tableName: 'company_culture_values',
  timestamps: true
});

/**
 * 8. UserCompanyPreparation Model (table: user_company_preparations)
 */
const UserCompanyPreparation = sequelize.define('UserCompanyPreparation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
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
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('company_id') ?? this.getDataValue('companyId');
    },
    set(val) {
      this.setDataValue('company_id', val);
      this.setDataValue('companyId', val);
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Software Engineer'
  },
  interview_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    get() {
      return this.getDataValue('interview_date') || this.getDataValue('interviewDate');
    },
    set(val) {
      this.setDataValue('interview_date', val);
      this.setDataValue('interviewDate', val);
    }
  },
  interviewDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    get() {
      return this.getDataValue('interviewDate') || this.getDataValue('interview_date');
    },
    set(val) {
      this.setDataValue('interviewDate', val);
      this.setDataValue('interview_date', val);
    }
  },
  preparation_status: {
    type: DataTypes.STRING,
    defaultValue: 'Preparing', // 'Planning', 'Preparing', 'Ready', 'Completed'
    get() {
      return this.getDataValue('preparation_status') || this.getDataValue('preparationStatus');
    },
    set(val) {
      this.setDataValue('preparation_status', val);
      this.setDataValue('preparationStatus', val);
    }
  },
  preparationStatus: {
    type: DataTypes.STRING,
    defaultValue: 'Preparing',
    get() {
      return this.getDataValue('preparationStatus') || this.getDataValue('preparation_status');
    },
    set(val) {
      this.setDataValue('preparationStatus', val);
      this.setDataValue('preparation_status', val);
    }
  },
  questions_practiced: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('questions_practiced') ?? this.getDataValue('questionsPracticed') ?? 0;
    },
    set(val) {
      this.setDataValue('questions_practiced', val);
      this.setDataValue('questionsPracticed', val);
    }
  },
  questionsPracticed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('questionsPracticed') ?? this.getDataValue('questions_practiced') ?? 0;
    },
    set(val) {
      this.setDataValue('questionsPracticed', val);
      this.setDataValue('questions_practiced', val);
    }
  },
  mock_interviews_done: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('mock_interviews_done') ?? this.getDataValue('mockInterviewsDone') ?? 0;
    },
    set(val) {
      this.setDataValue('mock_interviews_done', val);
      this.setDataValue('mockInterviewsDone', val);
    }
  },
  mockInterviewsDone: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('mockInterviewsDone') ?? this.getDataValue('mock_interviews_done') ?? 0;
    },
    set(val) {
      this.setDataValue('mockInterviewsDone', val);
      this.setDataValue('mock_interviews_done', val);
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  readiness_score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('readiness_score') ?? this.getDataValue('readinessScore') ?? 0;
    },
    set(val) {
      this.setDataValue('readiness_score', val);
      this.setDataValue('readinessScore', val);
    }
  },
  readinessScore: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    get() {
      return this.getDataValue('readinessScore') ?? this.getDataValue('readiness_score') ?? 0;
    },
    set(val) {
      this.setDataValue('readinessScore', val);
      this.setDataValue('readiness_score', val);
    }
  }
}, {
  tableName: 'user_company_preparations',
  timestamps: true
});

module.exports = {
  Company,
  CompanyInterviewQuestion,
  CompanySalaryData,
  CompanyReview,
  CompanySuccessStory,
  CompanyInterviewProcess,
  CompanyCultureValue,
  UserCompanyPreparation
};
