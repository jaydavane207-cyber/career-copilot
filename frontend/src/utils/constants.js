// frontend/src/utils/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const JOB_STATUSES = {
  WISHLIST: 'Wishlist',
  APPLIED: 'Applied',
  INTERVIEWING: 'Interviewing',
  OFFER: 'Offer',
  REJECTED: 'Rejected'
};

export const KANBAN_COLUMNS = [
  { id: JOB_STATUSES.WISHLIST, title: 'Wishlist', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  { id: JOB_STATUSES.APPLIED, title: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: JOB_STATUSES.INTERVIEWING, title: 'Interviewing', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: JOB_STATUSES.OFFER, title: 'Offer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: JOB_STATUSES.REJECTED, title: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200' }
];

export const CODING_DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export const CODING_STATUSES = ['Solved', 'Attempted', 'Review'];
