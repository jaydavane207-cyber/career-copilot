// backend/routes/story.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models');
const {
  createSuccessStory,
  getSuccessStories,
  getSuccessStoryDetail,
  upvoteStory,
  shareStory,
  addComment
} = require('../controllers/storyController');
const { reportStory } = require('../controllers/moderationController');

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
    // ignore token errors for optional routes
  }
  next();
};

// Route 1: POST /api/stories (Protected) - Create success story
router.post('/', authenticate, createSuccessStory);

// Route 2: GET /api/stories (Public) - Browse success stories
router.get('/', optionalAuth, getSuccessStories);

// Route 3: GET /api/stories/:id (Public) - Get single story detail
router.get('/:id', optionalAuth, getSuccessStoryDetail);

// Route 4: POST /api/stories/:id/upvote (Protected) - Upvote/remove upvote
router.post('/:id/upvote', authenticate, upvoteStory);

// Route 5: POST /api/stories/:id/share (Public / Optional) - Track story share
router.post('/:id/share', optionalAuth, shareStory);

// Route 6: POST /api/stories/:id/comments (Protected) - Post comment
router.post('/:id/comments', authenticate, addComment);

// Route 7: POST /api/stories/:id/report (Protected) - Report story
router.post('/:id/report', authenticate, reportStory);

module.exports = router;
