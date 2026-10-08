// backend/controllers/moderationController.js
const { SuccessStory, StoryReport, StoryComment, User } = require('../models');

// Basic profanity / spam detection keywords
const BLOCKED_KEYWORDS = ['viagra', 'casino', 'scam', 'crypto investment guarantee', 'free cash giveaway'];

/**
 * 1. checkContentSafety
 * Automated content filtering helper
 */
const checkContentSafety = (title = '', text = '', salary = 0) => {
  const combined = `${title} ${text}`.toLowerCase();
  for (const word of BLOCKED_KEYWORDS) {
    if (combined.includes(word)) {
      return { safe: false, reason: `Contains forbidden spam phrase: "${word}"` };
    }
  }

  // Sanity check on salary claims (> $10,000,000 requires proof)
  if (salary > 10000000) {
    return { safe: false, reason: 'Salary figure exceeds allowable unverified threshold.' };
  }

  return { safe: true };
};

/**
 * 2. reportStory
 * POST /api/moderation/report
 */
const reportStory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { story_id, storyId, reason = 'Inappropriate content', details = '' } = req.body;
    const targetId = storyId || story_id;

    if (!targetId) {
      return res.status(400).json({ success: false, message: 'Story ID is required to report.' });
    }

    const story = await SuccessStory.findByPk(targetId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    const report = await StoryReport.create({
      story_id: targetId,
      user_id: userId,
      reason,
      details,
      status: 'pending'
    });

    // Check if report count >= 3, automatically unpublish for review
    const reportsCount = await StoryReport.count({
      where: { story_id: targetId, status: 'pending' }
    });

    if (reportsCount >= 3) {
      story.status = 'pending_review';
      await story.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Thank you for your report. Our community team will review this story promptly.',
      reportId: report.id
    });
  } catch (error) {
    console.error('Error reporting story:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit report: ' + error.message
    });
  }
};

/**
 * 3. getPendingStories (Admin / Moderator)
 * GET /api/moderation/pending
 */
const getPendingStories = async (req, res) => {
  try {
    const pending = await SuccessStory.findAll({
      where: { status: 'pending_review' },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json({
      success: true,
      count: pending.length,
      stories: pending
    });
  } catch (error) {
    console.error('Error fetching pending stories:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending stories: ' + error.message
    });
  }
};

/**
 * 4. moderateStoryAction
 * POST /api/moderation/stories/:id/action
 */
const moderateStoryAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action = 'approve' } = req.body; // 'approve', 'reject', 'delete'

    const story = await SuccessStory.findByPk(id);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found.' });
    }

    if (action === 'approve') {
      story.status = 'published';
      story.is_verified = true;
      await story.save();
      // Dismiss pending reports for this story
      await StoryReport.update({ status: 'resolved' }, { where: { story_id: id } });
      return res.json({ success: true, message: 'Story approved and published!' });
    } else if (action === 'reject') {
      story.status = 'draft';
      await story.save();
      return res.json({ success: true, message: 'Story reverted to draft.' });
    } else if (action === 'delete') {
      await story.destroy();
      return res.json({ success: true, message: 'Story deleted permanently.' });
    }

    return res.status(400).json({ success: false, message: 'Invalid action provided.' });
  } catch (error) {
    console.error('Error taking moderation action:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process moderation action: ' + error.message
    });
  }
};

module.exports = {
  checkContentSafety,
  reportStory,
  getPendingStories,
  moderateStoryAction
};
