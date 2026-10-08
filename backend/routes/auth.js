// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const oauthController = require('../controllers/oauthController');
const authenticate = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account with name, email, password (min 8 chars)
 * @access  Public
 */
router.post('/register', validateRegister, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Log in an existing user and return a signed JWT
 * @access  Public
 */
router.post('/login', validateLogin, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Log out current session
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged-in user profile
 * @access  Private
 */
router.get('/me', authenticate, authController.me);

/* ============================================================================
 * OAuth Integration Routes (LinkedIn & GitHub)
 * ============================================================================ */

/**
 * @route   GET /api/auth/linkedin
 * @desc    Initiate LinkedIn OAuth authentication
 * @access  Public
 */
router.get('/linkedin', oauthController.initiateLinkedInLogin);

/**
 * @route   GET /api/auth/linkedin/callback
 * @desc    LinkedIn OAuth callback handler
 * @access  Public
 */
router.get('/linkedin/callback', oauthController.handleLinkedInCallback);

/**
 * @route   GET /api/auth/github
 * @desc    Initiate GitHub OAuth authentication
 * @access  Public
 */
router.get('/github', oauthController.initiateGitHubLogin);

/**
 * @route   GET /api/auth/github/callback
 * @desc    GitHub OAuth callback handler
 * @access  Public
 */
router.get('/github/callback', oauthController.handleGitHubCallback);

/**
 * @route   GET /api/auth/preview/:previewToken
 * @desc    Retrieve temporary cached OAuth import preview
 * @access  Public
 */
router.get('/preview/:previewToken', oauthController.getImportPreview);

/**
 * @route   GET /api/auth/demo-preview/:provider
 * @desc    Get instant simulated demo preview data (linkedin | github)
 * @access  Public
 */
router.get('/demo-preview/:provider', oauthController.getDemoPreview);

module.exports = router;
