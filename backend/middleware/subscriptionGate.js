// backend/middleware/subscriptionGate.js
const { getUserUsageAndLimits, PLANS } = require('../services/subscriptionService');
const { User } = require('../models');

const TIER_LEVELS = {
  free: 0,
  premium: 1,
  pro: 2
};

/**
 * Middleware to require a minimum subscription tier
 * @param {'free' | 'premium' | 'pro'} minTier - Minimum required tier
 */
const requireTier = (minTier = 'premium') => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Authentication required'
        });
      }

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User account not found'
        });
      }

      const currentTier = (user.subscriptionTier || 'free').toLowerCase();
      const currentLevel = TIER_LEVELS[currentTier] ?? 0;
      const requiredLevel = TIER_LEVELS[minTier.toLowerCase()] ?? 1;

      // Check tier expiration if applicable
      if (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) < new Date()) {
        return res.status(403).json({
          success: false,
          error: 'SUBSCRIPTION_EXPIRED',
          message: 'Your subscription has expired. Please renew to continue using premium features.',
          upgradeUrl: '/pricing'
        });
      }

      if (currentLevel < requiredLevel) {
        const plan = PLANS[minTier] || { name: minTier.toUpperCase() };
        return res.status(403).json({
          success: false,
          error: 'PAYMENT_REQUIRED',
          code: 'SUBSCRIPTION_REQUIRED',
          requiredTier: minTier,
          currentTier: currentTier,
          message: `Access to this feature requires a ${plan.name} subscription. Upgrade now to unlock immediate access!`,
          upgradeUrl: '/pricing'
        });
      }

      req.userTier = currentTier;
      next();
    } catch (error) {
      console.error('⚠️ [subscriptionGate.requireTier] Error:', error.message);
      next(error);
    }
  };
};

/**
 * Middleware to enforce freemium action quotas (e.g., 1 resume scan/month, 5 mock interviews, 20 jobs)
 * @param {'resume_scan' | 'mock_interview' | 'job_tracking'} actionType
 */
const requireQuota = (actionType) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          error: 'UNAUTHORIZED',
          message: 'Authentication required'
        });
      }

      const usageInfo = await getUserUsageAndLimits(req.user.id);
      req.subscriptionUsage = usageInfo;

      // If user is already Premium or Pro, skip quota check
      if (usageInfo.tier === 'premium' || usageInfo.tier === 'pro') {
        return next();
      }

      let isAllowed = true;
      let limitMsg = '';

      if (actionType === 'resume_scan') {
        isAllowed = usageInfo.canPerform.resumeScan;
        limitMsg = `You have used your ${usageInfo.limits.resumeScansPerMonth} free ATS resume scan this month.`;
      } else if (actionType === 'mock_interview') {
        isAllowed = usageInfo.canPerform.mockInterview;
        limitMsg = `You have used all ${usageInfo.limits.mockInterviewsTotal} of your free mock interviews.`;
      } else if (actionType === 'job_tracking') {
        isAllowed = usageInfo.canPerform.addJob;
        limitMsg = `You have reached the maximum limit of ${usageInfo.limits.jobsLimit} tracked jobs on the Free plan.`;
      }

      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          error: 'QUOTA_EXCEEDED',
          code: 'LIMIT_REACHED',
          feature: actionType,
          message: `${limitMsg} Upgrade to Premium for unlimited access!`,
          usage: usageInfo.usage,
          limits: usageInfo.limits,
          remaining: usageInfo.remaining,
          upgradeUrl: '/pricing'
        });
      }

      next();
    } catch (error) {
      console.error('⚠️ [subscriptionGate.requireQuota] Error:', error.message);
      next(error);
    }
  };
};

module.exports = {
  requireTier,
  requireQuota
};
