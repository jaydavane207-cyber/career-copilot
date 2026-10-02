// frontend/src/utils/validators.js

/**
 * Validates whether an email string conforms to standard email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim().toLowerCase());
};

/**
 * Validates that a password satisfies minimum security requirements (minimum 8 characters)
 * @param {string} password - Password string to validate
 * @returns {boolean} True if password is at least 8 characters long
 */
export const validatePassword = (password) => {
  return typeof password === 'string' && password.length >= 8;
};

/**
 * Detailed password validation helper providing granular criteria for interactive UI meters
 * @param {string} password - Password string to check
 * @returns {object} Object with detailed validation flags
 */
export const getPasswordValidationDetails = (password = '') => {
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return {
    hasMinLength,
    hasLetter,
    hasNumber,
    isValid: hasMinLength
  };
};

/**
 * Validates uploaded resume files
 * @param {File} file - Browser File object
 * @returns {object} Object with isValid boolean and error message
 */
export const validatePdfFile = (file) => {
  if (!file) return { isValid: false, message: 'No file selected.' };
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return { isValid: false, message: 'Only PDF documents are supported.' };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { isValid: false, message: 'File size exceeds maximum limit of 10MB.' };
  }
  return { isValid: true };
};
