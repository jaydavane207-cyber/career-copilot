// frontend/src/utils/helpers.js

export const getScoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
  return 'text-rose-600 bg-rose-50 border-rose-200';
};

export const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-emerald-100 text-emerald-700';
    case 'Medium':
      return 'bg-amber-100 text-amber-700';
    case 'Hard':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
