// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const { validateProfileUpdate } = require('../middleware/validation');

// Require authentication for all user routes
router.use(authenticate);

/**
 * @route   GET /api/user
 * @desc    Fetch authenticated user profile details
 * @access  Private
 */
router.get('/', userController.getProfile);

/**
 * @route   POST /api/user
 * @desc    Update authenticated user profile (name, targetRole, bio)
 * @access  Private
 */
router.post('/', validateProfileUpdate, userController.updateProfile);

/**
 * Backward compatibility endpoints
 */
router.get('/profile', userController.getProfile);
router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.put('/change-password', userController.changePassword);

module.exports = router;
