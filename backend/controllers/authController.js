// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');

/**
 * Generate a signed JWT token for the authenticated user
 * @param {string} userId - UUID of the user
 * @returns {string} Signed JWT Bearer token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * User Registration Controller
 * Endpoint: POST /api/auth/register
 * 
 * Validates user credentials, ensures email uniqueness,
 * creates user with bcrypt-hashed password, and generates JWT.
 */
const register = async (req, res, next) => {
  try {
    const { name, fullName, email, password, targetRole } = req.body;
    const userName = (name || fullName || '').trim();
    const userEmail = (email || '').trim().toLowerCase();

    // 1. Validation: Name required
    if (!userName) {
      return res.status(400).json({
        success: false,
        message: 'Name is required to register an account.'
      });
    }

    // 2. Validation: Email required and valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || !emailRegex.test(userEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 3. Validation: Password min 8 chars
    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long.'
      });
    }

    // 4. Check for existing account
    const existingUser = await User.findOne({ where: { email: userEmail } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.'
      });
    }

    // 5. Create user in database (password is automatically hashed via User model hooks)
    const newUser = await User.create({
      name: userName,
      email: userEmail,
      password,
      targetRole: targetRole || 'Full Stack Developer'
    });

    // 6. Generate JWT token
    const token = generateToken(newUser.id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to Career Copilot.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        fullName: newUser.name,
        email: newUser.email,
        targetRole: newUser.targetRole,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Login Controller
 * Endpoint: POST /api/auth/login
 * 
 * Verifies email and password using bcrypt compare,
 * returns JWT token and user session data.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userEmail = (email || '').trim().toLowerCase();

    // 1. Validate inputs
    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    // 2. Look up user by email
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    // 3. Verify password via bcrypt
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your email and password.'
      });
    }

    // 4. Issue JWT token
    const token = generateToken(user.id);

    return res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        bio: user.bio,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * User Logout Controller
 * Endpoint: POST /api/auth/logout
 * 
 * Informs client to clear authorization tokens.
 */
const logout = async (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully.'
  });
};

/**
 * Current Authenticated User Controller
 * Endpoint: GET /api/auth/me
 * 
 * Returns the profile of the currently logged-in user from req.user
 */
const me = async (req, res) => {
  return res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      fullName: req.user.name,
      email: req.user.email,
      targetRole: req.user.targetRole,
      experienceLevel: req.user.experienceLevel,
      bio: req.user.bio,
      createdAt: req.user.createdAt
    }
  });
};

module.exports = {
  register,
  login,
  logout,
  me
};
