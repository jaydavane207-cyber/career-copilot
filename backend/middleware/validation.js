// backend/middleware/validation.js

/**
 * Regular expression for standard email format validation
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Middleware: Validates user registration payload
 * Enforces:
 * - name: non-empty string
 * - email: valid email address format
 * - password: minimum 8 characters in length
 */
const validateRegister = (req, res, next) => {
  const { name, fullName, email, password } = req.body;
  const userName = name || fullName;

  // Name validation
  if (!userName || typeof userName !== 'string' || !userName.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Name is required to create your Career Copilot profile.'
    });
  }

  // Email validation
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Email address is required.'
    });
  }

  if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address (e.g. name@domain.com).'
    });
  }

  // Password validation (minimum 8 characters)
  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Password is required.'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long for security.'
    });
  }

  next();
};

/**
 * Middleware: Validates user login payload
 * Enforces email format and password presence
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your email address.'
    });
  }

  if (!EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email format.'
    });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Please provide your password.'
    });
  }

  next();
};

/**
 * Middleware: Validates user profile updates
 * Checks name if present (cannot be empty)
 */
const validateProfileUpdate = (req, res, next) => {
  const { name, fullName, email } = req.body;
  const userName = name !== undefined ? name : fullName;

  if (userName !== undefined && (typeof userName !== 'string' || !userName.trim())) {
    return res.status(400).json({
      success: false,
      message: 'User name cannot be empty.'
    });
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format provided for update.'
      });
    }
  }

  next();
};

/**
 * Helper to ensure required fields exist on a request body
 */
const validateRequiredFields = (requiredFields = []) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`
      });
    }

    next();
  };
};

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateRequiredFields
};
