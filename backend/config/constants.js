// backend/config/constants.js

const JOB_STATUSES = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

const SKILL_PROFICIENCY = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert'
};

const CODING_DIFFICULTIES = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard'
};

const CODING_STATUSES = {
  SOLVED: 'Solved',
  ATTEMPTED: 'Attempted',
  REVIEW: 'Review'
};

const INTERVIEW_TYPES = {
  TECHNICAL: 'Technical',
  BEHAVIORAL: 'Behavioral',
  SYSTEM_DESIGN: 'System Design'
};

const READINESS_WEIGHTS = {
  RESUME: 0.25,
  SKILLS: 0.25,
  CODING: 0.25,
  INTERVIEW: 0.25
};

module.exports = {
  JOB_STATUSES,
  SKILL_PROFICIENCY,
  CODING_DIFFICULTIES,
  CODING_STATUSES,
  INTERVIEW_TYPES,
  READINESS_WEIGHTS
};
