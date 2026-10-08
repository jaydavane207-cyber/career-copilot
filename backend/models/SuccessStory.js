// backend/models/SuccessStory.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * 1. SuccessStory Model (table: success_stories)
 */
const SuccessStory = sequelize.define('SuccessStory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
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
  company_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
    allowNull: true,
    get() {
      return this.getDataValue('companyId') ?? this.getDataValue('company_id');
    },
    set(val) {
      this.setDataValue('companyId', val);
      this.setDataValue('company_id', val);
    }
  },
  company_name: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('company_name') || this.getDataValue('companyName') || 'Tech Company';
    },
    set(val) {
      this.setDataValue('company_name', val);
      this.setDataValue('companyName', val);
    }
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      return this.getDataValue('companyName') || this.getDataValue('company_name') || 'Tech Company';
    },
    set(val) {
      this.setDataValue('companyName', val);
      this.setDataValue('company_name', val);
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Software Engineer'
  },
  experience_level: {
    type: DataTypes.STRING,
    defaultValue: 'Mid',
    get() {
      return this.getDataValue('experience_level') || this.getDataValue('experienceLevel') || 'Mid';
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
      return this.getDataValue('experienceLevel') || this.getDataValue('experience_level') || 'Mid';
    },
    set(val) {
      this.setDataValue('experienceLevel', val);
      this.setDataValue('experience_level', val);
    }
  },
  years_experience: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    get() {
      return this.getDataValue('years_experience') ?? this.getDataValue('yearsExperience') ?? 2;
    },
    set(val) {
      this.setDataValue('years_experience', val);
      this.setDataValue('yearsExperience', val);
    }
  },
  yearsExperience: {
    type: DataTypes.INTEGER,
    defaultValue: 2,
    get() {
      return this.getDataValue('yearsExperience') ?? this.getDataValue('years_experience') ?? 2;
    },
    set(val) {
      this.setDataValue('yearsExperience', val);
      this.setDataValue('years_experience', val);
    }
  },
  starting_salary: {
    type: DataTypes.INTEGER,
    defaultValue: 150000,
    get() {
      return this.getDataValue('starting_salary') ?? this.getDataValue('startingSalary') ?? 150000;
    },
    set(val) {
      this.setDataValue('starting_salary', val);
      this.setDataValue('startingSalary', val);
    }
  },
  startingSalary: {
    type: DataTypes.INTEGER,
    defaultValue: 150000,
    get() {
      return this.getDataValue('startingSalary') ?? this.getDataValue('starting_salary') ?? 150000;
    },
    set(val) {
      this.setDataValue('startingSalary', val);
      this.setDataValue('starting_salary', val);
    }
  },
  final_salary: {
    type: DataTypes.INTEGER,
    defaultValue: 180000,
    get() {
      return this.getDataValue('final_salary') ?? this.getDataValue('finalSalary') ?? 180000;
    },
    set(val) {
      this.setDataValue('final_salary', val);
      this.setDataValue('finalSalary', val);
    }
  },
  finalSalary: {
    type: DataTypes.INTEGER,
    defaultValue: 180000,
    get() {
      return this.getDataValue('finalSalary') ?? this.getDataValue('final_salary') ?? 180000;
    },
    set(val) {
      this.setDataValue('finalSalary', val);
      this.setDataValue('final_salary', val);
    }
  },
  negotiation_amount: {
    type: DataTypes.INTEGER,
    defaultValue: 30000,
    get() {
      return this.getDataValue('negotiation_amount') ?? this.getDataValue('negotiationAmount') ?? 30000;
    },
    set(val) {
      this.setDataValue('negotiation_amount', val);
      this.setDataValue('negotiationAmount', val);
    }
  },
  negotiationAmount: {
    type: DataTypes.INTEGER,
    defaultValue: 30000,
    get() {
      return this.getDataValue('negotiationAmount') ?? this.getDataValue('negotiation_amount') ?? 30000;
    },
    set(val) {
      this.setDataValue('negotiationAmount', val);
      this.setDataValue('negotiation_amount', val);
    }
  },
  salary_percentage_increase: {
    type: DataTypes.FLOAT,
    defaultValue: 20.0,
    get() {
      return this.getDataValue('salary_percentage_increase') ?? this.getDataValue('salaryPercentageIncrease') ?? 20.0;
    },
    set(val) {
      this.setDataValue('salary_percentage_increase', val);
      this.setDataValue('salaryPercentageIncrease', val);
    }
  },
  salaryPercentageIncrease: {
    type: DataTypes.FLOAT,
    defaultValue: 20.0,
    get() {
      return this.getDataValue('salaryPercentageIncrease') ?? this.getDataValue('salary_percentage_increase') ?? 20.0;
    },
    set(val) {
      this.setDataValue('salaryPercentageIncrease', val);
      this.setDataValue('salary_percentage_increase', val);
    }
  },
  job_type: {
    type: DataTypes.STRING,
    defaultValue: 'Full-time',
    get() {
      return this.getDataValue('job_type') || this.getDataValue('jobType') || 'Full-time';
    },
    set(val) {
      this.setDataValue('job_type', val);
      this.setDataValue('jobType', val);
    }
  },
  jobType: {
    type: DataTypes.STRING,
    defaultValue: 'Full-time',
    get() {
      return this.getDataValue('jobType') || this.getDataValue('job_type') || 'Full-time';
    },
    set(val) {
      this.setDataValue('jobType', val);
      this.setDataValue('job_type', val);
    }
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: 'Mountain View, CA'
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
  interviews_completed: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('interviews_completed') ?? this.getDataValue('interviewsCompleted') ?? 4;
    },
    set(val) {
      this.setDataValue('interviews_completed', val);
      this.setDataValue('interviewsCompleted', val);
    }
  },
  interviewsCompleted: {
    type: DataTypes.INTEGER,
    defaultValue: 4,
    get() {
      return this.getDataValue('interviewsCompleted') ?? this.getDataValue('interviews_completed') ?? 4;
    },
    set(val) {
      this.setDataValue('interviewsCompleted', val);
      this.setDataValue('interviews_completed', val);
    }
  },
  mock_interviews_done: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    get() {
      return this.getDataValue('mock_interviews_done') ?? this.getDataValue('mockInterviewsDone') ?? 10;
    },
    set(val) {
      this.setDataValue('mock_interviews_done', val);
      this.setDataValue('mockInterviewsDone', val);
    }
  },
  mockInterviewsDone: {
    type: DataTypes.INTEGER,
    defaultValue: 10,
    get() {
      return this.getDataValue('mockInterviewsDone') ?? this.getDataValue('mock_interviews_done') ?? 10;
    },
    set(val) {
      this.setDataValue('mockInterviewsDone', val);
      this.setDataValue('mock_interviews_done', val);
    }
  },
  coding_problems_logged: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    get() {
      return this.getDataValue('coding_problems_logged') ?? this.getDataValue('codingProblemsLogged') ?? 100;
    },
    set(val) {
      this.setDataValue('coding_problems_logged', val);
      this.setDataValue('codingProblemsLogged', val);
    }
  },
  codingProblemsLogged: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    get() {
      return this.getDataValue('codingProblemsLogged') ?? this.getDataValue('coding_problems_logged') ?? 100;
    },
    set(val) {
      this.setDataValue('codingProblemsLogged', val);
      this.setDataValue('coding_problems_logged', val);
    }
  },
  study_plan_followed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      return this.getDataValue('study_plan_followed') ?? this.getDataValue('studyPlanFollowed') ?? true;
    },
    set(val) {
      this.setDataValue('study_plan_followed', Boolean(val));
      this.setDataValue('studyPlanFollowed', Boolean(val));
    }
  },
  studyPlanFollowed: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      return this.getDataValue('studyPlanFollowed') ?? this.getDataValue('study_plan_followed') ?? true;
    },
    set(val) {
      this.setDataValue('studyPlanFollowed', Boolean(val));
      this.setDataValue('study_plan_followed', Boolean(val));
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
  story_title: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'My Journey to Landing the Offer',
    get() {
      return this.getDataValue('story_title') || this.getDataValue('storyTitle') || 'My Journey to Landing the Offer';
    },
    set(val) {
      this.setDataValue('story_title', val);
      this.setDataValue('storyTitle', val);
    }
  },
  storyTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'My Journey to Landing the Offer',
    get() {
      return this.getDataValue('storyTitle') || this.getDataValue('story_title') || 'My Journey to Landing the Offer';
    },
    set(val) {
      this.setDataValue('storyTitle', val);
      this.setDataValue('story_title', val);
    }
  },
  story_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('story_text') || this.getDataValue('storyText') || '';
    },
    set(val) {
      this.setDataValue('story_text', val);
      this.setDataValue('storyText', val);
    }
  },
  storyText: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('storyText') || this.getDataValue('story_text') || '';
    },
    set(val) {
      this.setDataValue('storyText', val);
      this.setDataValue('story_text', val);
    }
  },
  key_tips: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('key_tips') || this.getDataValue('keyTips') || [];
    },
    set(val) {
      this.setDataValue('key_tips', val);
      this.setDataValue('keyTips', val);
    }
  },
  keyTips: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('keyTips') || this.getDataValue('key_tips') || [];
    },
    set(val) {
      this.setDataValue('keyTips', val);
      this.setDataValue('key_tips', val);
    }
  },
  what_helped_most: {
    type: DataTypes.STRING,
    defaultValue: 'AI Mock Interviews & Structured Study Roadmap',
    get() {
      return this.getDataValue('what_helped_most') || this.getDataValue('whatHelpedMost') || 'AI Mock Interviews';
    },
    set(val) {
      this.setDataValue('what_helped_most', val);
      this.setDataValue('whatHelpedMost', val);
    }
  },
  whatHelpedMost: {
    type: DataTypes.STRING,
    defaultValue: 'AI Mock Interviews & Structured Study Roadmap',
    get() {
      return this.getDataValue('whatHelpedMost') || this.getDataValue('what_helped_most') || 'AI Mock Interviews';
    },
    set(val) {
      this.setDataValue('whatHelpedMost', val);
      this.setDataValue('what_helped_most', val);
    }
  },
  what_hindered: {
    type: DataTypes.STRING,
    defaultValue: 'Imposter syndrome early on and over-focusing on rare algorithms',
    get() {
      return this.getDataValue('what_hindered') || this.getDataValue('whatHindered') || '';
    },
    set(val) {
      this.setDataValue('what_hindered', val);
      this.setDataValue('whatHindered', val);
    }
  },
  whatHindered: {
    type: DataTypes.STRING,
    defaultValue: 'Imposter syndrome early on and over-focusing on rare algorithms',
    get() {
      return this.getDataValue('whatHindered') || this.getDataValue('what_hindered') || '';
    },
    set(val) {
      this.setDataValue('whatHindered', val);
      this.setDataValue('what_hindered', val);
    }
  },
  advice_for_others: {
    type: DataTypes.TEXT,
    defaultValue: 'Consistency is everything. Trust the preparation process!',
    get() {
      return this.getDataValue('advice_for_others') || this.getDataValue('adviceForOthers') || '';
    },
    set(val) {
      this.setDataValue('advice_for_others', val);
      this.setDataValue('adviceForOthers', val);
    }
  },
  adviceForOthers: {
    type: DataTypes.TEXT,
    defaultValue: 'Consistency is everything. Trust the preparation process!',
    get() {
      return this.getDataValue('adviceForOthers') || this.getDataValue('advice_for_others') || '';
    },
    set(val) {
      this.setDataValue('adviceForOthers', val);
      this.setDataValue('advice_for_others', val);
    }
  },
  photos: {
    type: DataTypes.JSON,
    defaultValue: [],
    get() {
      return this.getDataValue('photos') || [];
    },
    set(val) {
      this.setDataValue('photos', val);
    }
  },
  is_anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    get() {
      return this.getDataValue('is_anonymous') ?? this.getDataValue('isAnonymous') ?? false;
    },
    set(val) {
      this.setDataValue('is_anonymous', Boolean(val));
      this.setDataValue('isAnonymous', Boolean(val));
    }
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    get() {
      return this.getDataValue('isAnonymous') ?? this.getDataValue('is_anonymous') ?? false;
    },
    set(val) {
      this.setDataValue('isAnonymous', Boolean(val));
      this.setDataValue('is_anonymous', Boolean(val));
    }
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      return this.getDataValue('is_verified') ?? this.getDataValue('isVerified') ?? true;
    },
    set(val) {
      this.setDataValue('is_verified', Boolean(val));
      this.setDataValue('isVerified', Boolean(val));
    }
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    get() {
      return this.getDataValue('isVerified') ?? this.getDataValue('is_verified') ?? true;
    },
    set(val) {
      this.setDataValue('isVerified', Boolean(val));
      this.setDataValue('is_verified', Boolean(val));
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
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
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  shares: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'published' // 'published', 'draft', 'pending_review'
  }
}, {
  tableName: 'success_stories',
  timestamps: true,
  underscored: true
});

/**
 * 2. StoryComment Model (table: story_comments)
 */
const StoryComment = sequelize.define('StoryComment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  story_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('story_id') ?? this.getDataValue('storyId');
    },
    set(val) {
      this.setDataValue('story_id', val);
      this.setDataValue('storyId', val);
    }
  },
  storyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get() {
      return this.getDataValue('storyId') ?? this.getDataValue('story_id');
    },
    set(val) {
      this.setDataValue('storyId', val);
      this.setDataValue('story_id', val);
    }
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
  comment_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('comment_text') || this.getDataValue('commentText') || '';
    },
    set(val) {
      this.setDataValue('comment_text', val);
      this.setDataValue('commentText', val);
    }
  },
  commentText: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('commentText') || this.getDataValue('comment_text') || '';
    },
    set(val) {
      this.setDataValue('commentText', val);
      this.setDataValue('comment_text', val);
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5
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
  tableName: 'story_comments',
  timestamps: true,
  underscored: true
});

/**
 * 3. StoryUpvote Model (table: story_upvotes)
 */
const StoryUpvote = sequelize.define('StoryUpvote', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  story_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'story_upvotes',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['story_id', 'user_id']
    }
  ]
});

/**
 * 4. StoryReport Model (table: story_reports)
 */
const StoryReport = sequelize.define('StoryReport', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  story_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // pending, resolved, dismissed
  }
}, {
  tableName: 'story_reports',
  timestamps: true,
  underscored: true
});

/**
 * Custom column sync helper for non-destructive migrations
 */
SuccessStory.syncColumns = async () => {
  try {
    const qi = sequelize.getQueryInterface();
    const tableDesc = await qi.describeTable('success_stories').catch(() => null);
    if (!tableDesc) return;

    const colsToAdd = [
      { name: 'company_name', type: DataTypes.STRING },
      { name: 'location', type: DataTypes.STRING, defaultVal: 'Mountain View, CA' },
      { name: 'views', type: DataTypes.INTEGER, defaultVal: 0 },
      { name: 'shares', type: DataTypes.INTEGER, defaultVal: 0 },
      { name: 'status', type: DataTypes.STRING, defaultVal: 'published' }
    ];

    for (const col of colsToAdd) {
      if (!tableDesc[col.name]) {
        await qi.addColumn('success_stories', col.name, {
          type: col.type,
          allowNull: true,
          defaultValue: col.defaultVal
        }).catch(() => {});
      }
    }
  } catch (err) {
    // Gracefully handle if columns already exist
  }
};

module.exports = {
  SuccessStory,
  StoryComment,
  StoryUpvote,
  StoryReport
};
