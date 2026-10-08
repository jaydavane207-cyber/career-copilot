// backend/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const {
  getLeaderboard,
  getUserRank,
  getNearbyRanks,
  getUserBadges,
  getUserAchievements,
  getUserPoints,
  awardBadge
} = require('../controllers/leaderboardController');

// Optional authentication middleware for public endpoints
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);
      if (decoded?.userId) {
        const user = await User.findByPk(decoded.userId);
        if (user) req.user = user;
      }
    }
  } catch (err) {
    // ignore
  }
  next();
};

// Route: Badges, Achievements & Points aliases on leaderboard router
router.get('/badges', authenticate, getUserBadges);
router.get('/achievements', authenticate, getUserAchievements);
router.get('/points', authenticate, getUserPoints);
router.post('/badges/award', authenticate, awardBadge);

// Route: Nearby context for user
router.get('/:type/nearby', optionalAuth, getNearbyRanks);

// Route: User specific rank on leaderboard
router.get('/:type/user/:userId', optionalAuth, getUserRank);

// Route: Get ranked leaderboard list
router.get('/:type', optionalAuth, getLeaderboard);
router.get('/', optionalAuth, (req, res) => {
  req.params.type = 'salary';
  return getLeaderboard(req, res);
});

module.exports = router;
