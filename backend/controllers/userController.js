// backend/controllers/userController.js
const { User } = require('../models');

/**
 * Get User Profile Controller
 * Endpoint: GET /api/user (and GET /api/user/profile)
 * 
 * Fetches the currently authenticated user's profile details.
 * Excludes sensitive fields like password.
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        subscriptionTier: user.subscriptionTier || 'free',
        subscriptionStatus: user.subscriptionStatus || 'active',
        subscriptionExpiresAt: user.subscriptionExpiresAt || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update User Profile Controller
 * Endpoint: POST /api/user (and PUT /api/user/profile)
 * 
 * Updates the user's name, targetRole, and optional bio/experience details.
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, fullName, targetRole, experienceLevel, bio } = req.body;
    const user = req.user;

    // Handle name updates (support both 'name' and 'fullName')
    const incomingName = name !== undefined ? name : fullName;
    if (incomingName !== undefined) {
      if (typeof incomingName !== 'string' || !incomingName.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be blank.'
        });
      }
      user.name = incomingName.trim();
    }

    // Handle target role updates
    if (targetRole !== undefined) {
      if (typeof targetRole === 'string' && targetRole.trim()) {
        user.targetRole = targetRole.trim();
      }
    }

    // Handle additional profile fields
    if (experienceLevel !== undefined) {
      user.experienceLevel = experienceLevel;
    }
    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        targetRole: user.targetRole,
        experienceLevel: user.experienceLevel,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change Password Controller
 * Endpoint: PUT /api/user/change-password
 * 
 * Validates current password via bcrypt, verifies new password meets
 * the 8-character minimum policy, and hashes new password.
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current password and new password are required.'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.'
      });
    }

    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password does not match.'
      });
    }

    req.user.password = newPassword;
    await req.user.save();

    return res.json({
      success: true,
      message: 'Password updated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
