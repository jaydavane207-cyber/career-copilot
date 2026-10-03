// frontend/src/utils/formatters.js
import { format, parseISO, isValid } from 'date-fns';

/**
 * Format date string safely using date-fns
 * @param {string|Date} dateInput - ISO string, date string, or Date object
 * @param {string} [formatStr='MMM d, yyyy'] - date-fns format pattern
 */
export const formatDate = (dateInput, formatStr = 'MMM d, yyyy') => {
  if (!dateInput) return 'N/A';
  try {
    let parsedDate = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(parsedDate)) {
      parsedDate = new Date(dateInput);
    }
    if (!isValid(parsedDate)) return 'N/A';
    return format(parsedDate, formatStr);
  } catch (err) {
    return 'N/A';
  }
};

/**
 * Format date for input[type="date"] fields (YYYY-MM-DD)
 */
export const formatDateForInput = (dateInput) => {
  if (!dateInput) return '';
  try {
    let parsed = typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(parsed)) parsed = new Date(dateInput);
    if (!isValid(parsed)) return '';
    return format(parsed, 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

export const formatPercentage = (value) => {
  const num = typeof value === 'number' ? value : 0;
  return `${Math.round(num)}%`;
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};
