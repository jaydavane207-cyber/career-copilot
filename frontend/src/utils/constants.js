// frontend/src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const JOB_STAGES = {
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFER: 'offer'
};

// 3-Column Kanban Board Definition: Applied → Interview → Offer
export const KANBAN_COLUMNS = [
  {
    id: 'applied',
    title: 'Applied',
    description: 'Submitted applications awaiting initial review',
    dotColor: 'bg-blue-500',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    columnBorder: 'border-blue-200/80',
    accentHeader: 'text-blue-700'
  },
  {
    id: 'interview',
    title: 'Interview',
    description: 'Active technical screens, take-homes & rounds',
    dotColor: 'bg-amber-500',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    columnBorder: 'border-amber-200/80',
    accentHeader: 'text-amber-700'
  },
  {
    id: 'offer',
    title: 'Offer',
    description: 'Formal job offers received & negotiation phase',
    dotColor: 'bg-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    columnBorder: 'border-emerald-200/80',
    accentHeader: 'text-emerald-700'
  }
];

// Compatibility legacy statuses
export const JOB_STATUSES = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

export const CODING_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const CODING_STATUSES = ['Solved', 'Attempted', 'Review'];
