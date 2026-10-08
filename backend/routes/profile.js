// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');

// Require authentication for all profile import endpoints
router.use(authenticate);

/**
 * @route   GET /api/profile
 * @desc    Fetch authenticated user profile details
 * @access  Private
 */
router.get('/', userController.getProfile);

/**
 * @route   POST /api/profile
 * @desc    Update authenticated user profile
 * @access  Private
 */
router.post('/', userController.updateProfile);

/**
 * @route   POST /api/profile/import/confirm
 * @desc    Confirm and save selected imported LinkedIn/GitHub items to database
 * @access  Private
 */
router.post('/import/confirm', oauthController.confirmImport);

/**
 * @route   POST /api/profile/import/refresh
 * @desc    Re-fetch and refresh imported profile data from LinkedIn or GitHub
 * @access  Private
 */
router.post('/import/refresh', oauthController.refreshOAuthData);

/**
 * @route   GET /api/profile/oauth-status
 * @desc    Get connected OAuth accounts and sync status
 * @access  Private
 */
router.get('/oauth-status', oauthController.getOAuthStatus);

/**
 * @route   DELETE /api/profile/oauth/:provider
 * @desc    Disconnect an OAuth provider and clear stored access tokens
 * @access  Private
 */
router.delete('/oauth/:provider', oauthController.disconnectOAuth);

module.exports = router;
