// backend/services/subscriptionService.js
const { Op } = require('sequelize');
const crypto = require('crypto');
const { User, Subscription, Resume, MockInterview, Job } = require('../models');

/**
 * Platform Tier Plans Configuration
 */
const PLANS = {
  free: {
    id: 'free',
    name: 'Free Starter',
    badge: 'Standard',
    description: 'Perfect for exploring tech interview prep with core features.',
    priceINR: { monthly: 0, yearly: 0 },
    priceUSD: { monthly: 0, yearly: 0 },
    features: [
      '1 ATS Resume Analysis per month',
      '5 AI Mock Interviews total',
      'Track up to 20 Job Applications',
      'Curated Indian tech interview questions',
      'Unified Career Readiness Score',
      'Community Success Stories access'
    ],
    limits: {
      resumeScansPerMonth: 1,
      mockInterviewsTotal: 5,
      jobsLimit: 20,
      videoInterviews: false,
      salaryNegotiation: false,
      prioritySupport: false
    }
  },
  premium: {
    id: 'premium',
    name: 'Career Copilot Premium',
    badge: 'Most Popular',
    description: 'The complete toolkit for landing high-paying product tech roles.',
    priceINR: { monthly: 799, yearly: 7990 }, // 2 months free on yearly
    priceUSD: { monthly: 9.99, yearly: 99.99 },
    features: [
      'Unlimited ATS Resume Analysis & Keyword Tailoring',
      'Unlimited AI Mock Interviews with Instant Feedback',
      'Unlimited Job Application Tracking with Notes',
      'Full Top Indian MNC & Startup Question Banks',
      'Personalized 12-Week Study Roadmaps',
      'Downloadable PDF Performance Reports',
      'Priority AI Processing & Zero Wait Time',
      'Ad-free experience & Priority Email Support'
    ],
    limits: {
      resumeScansPerMonth: Infinity,
      mockInterviewsTotal: Infinity,
      jobsLimit: Infinity,
      videoInterviews: false,
      salaryNegotiation: false,
      prioritySupport: true
    }
  },
  pro: {
    id: 'pro',
    name: 'Career Copilot Pro',
    badge: 'Maximum Impact',
    description: 'Executive guidance, advanced video simulations, and salary negotiation.',
    priceINR: { monthly: 1999, yearly: 19990 },
    priceUSD: { monthly: 24.99, yearly: 249.99 },
    features: [
      'Everything in Premium included',
      'AI Video Mock Interview Simulator & Speech Pace Analysis',
      'Executive Salary Negotiation Assistant & Counter-Offer Scripts',
      '1 Monthly Senior Engineer Mentorship Booking Credit',
      'Predictive Tech Stack Weakness Diagnosis',
      'Exclusive Tier-1 Startup Referral Network Access',
      'Dedicated 24/7 Career Advisor Support'
    ],
    limits: {
      resumeScansPerMonth: Infinity,
      mockInterviewsTotal: Infinity,
      jobsLimit: Infinity,
      videoInterviews: true,
      salaryNegotiation: true,
      prioritySupport: true
    }
  }
};

/**
 * Get comprehensive usage metrics and quota comparisons for a user
 * @param {string} userId - User UUID
 */
const getUserUsageAndLimits = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const currentTier = (user.subscriptionTier || 'free').toLowerCase();
  const planConfig = PLANS[currentTier] || PLANS.free;

  // Calculate start of current calendar month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Parallel database queries for usage metrics
  const [resumeCount, interviewCount, jobCount, activeSub] = await Promise.all([
    Resume.count({
      where: {
        userId,
        createdAt: { [Op.gte]: startOfMonth }
      }
    }),
    MockInterview.count({
      where: { userId }
    }),
    Job.count({
      where: { userId }
    }),
    Subscription.findOne({
      where: {
        userId,
        status: 'active'
      },
      order: [['createdAt', 'DESC']]
    })
  ]);

  const limits = planConfig.limits;

  const canPerformResumeScan = limits.resumeScansPerMonth === Infinity || resumeCount < limits.resumeScansPerMonth;
  const canPerformMockInterview = limits.mockInterviewsTotal === Infinity || interviewCount < limits.mockInterviewsTotal;
  const canAddJob = limits.jobsLimit === Infinity || jobCount < limits.jobsLimit;

  return {
    tier: currentTier,
    tierName: planConfig.name,
    status: user.subscriptionStatus || 'active',
    expiresAt: user.subscriptionExpiresAt,
    isPremium: user.isPremium ? user.isPremium() : currentTier !== 'free',
    isPro: user.isPro ? user.isPro() : currentTier === 'pro',
    subscriptionDetails: activeSub ? {
      id: activeSub.id,
      tier: activeSub.tier,
      billingCycle: activeSub.billingCycle,
      amount: activeSub.amount,
      currency: activeSub.currency,
      gateway: activeSub.gateway,
      currentPeriodEnd: activeSub.currentPeriodEnd,
      cancelAtPeriodEnd: activeSub.cancelAtPeriodEnd
    } : null,
    usage: {
      resumeScansThisMonth: resumeCount,
      mockInterviewsTotal: interviewCount,
      jobsTracked: jobCount
    },
    limits: {
      resumeScansPerMonth: limits.resumeScansPerMonth === Infinity ? 'Unlimited' : limits.resumeScansPerMonth,
      mockInterviewsTotal: limits.mockInterviewsTotal === Infinity ? 'Unlimited' : limits.mockInterviewsTotal,
      jobsLimit: limits.jobsLimit === Infinity ? 'Unlimited' : limits.jobsLimit,
      videoInterviews: limits.videoInterviews,
      salaryNegotiation: limits.salaryNegotiation
    },
    remaining: {
      resumeScans: limits.resumeScansPerMonth === Infinity ? 'Unlimited' : Math.max(0, limits.resumeScansPerMonth - resumeCount),
      mockInterviews: limits.mockInterviewsTotal === Infinity ? 'Unlimited' : Math.max(0, limits.mockInterviewsTotal - interviewCount),
      jobsTracked: limits.jobsLimit === Infinity ? 'Unlimited' : Math.max(0, limits.jobsLimit - jobCount)
    },
    canPerform: {
      resumeScan: canPerformResumeScan,
      mockInterview: canPerformMockInterview,
      addJob: canAddJob,
      videoInterview: planConfig.limits.videoInterviews,
      salaryNegotiation: planConfig.limits.salaryNegotiation
    }
  };
};

/**
 * Create payment gateway checkout order
 * Supports Razorpay, Stripe, and Mock Sandbox checkout
 */
const createCheckoutOrder = async ({ userId, planId, billingCycle = 'monthly', currency = 'INR', gateway = 'mock_checkout' }) => {
  const plan = PLANS[planId];
  if (!plan || planId === 'free') {
    throw new Error('Invalid plan selected for checkout');
  }

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  const isINR = (currency || 'INR').toUpperCase() === 'INR';
  const priceObj = isINR ? plan.priceINR : plan.priceUSD;
  const amountUnits = billingCycle === 'yearly' ? priceObj.yearly : priceObj.monthly;
  const amountMinor = isINR ? Math.round(amountUnits * 100) : Math.round(amountUnits * 100);

  const orderId = `order_${gateway}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

  // If Razorpay keys exist in process.env, can generate real Razorpay order; otherwise provide structured response
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_career_copilot_demo';
  const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_career_copilot_demo';

  return {
    orderId,
    amount: amountMinor,
    displayAmount: amountUnits,
    currency: isINR ? 'INR' : 'USD',
    planId,
    planName: plan.name,
    billingCycle,
    gateway,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    key: gateway === 'stripe' ? stripePublishableKey : razorpayKeyId,
    mode: (process.env.NODE_ENV === 'production' && process.env.RAZORPAY_KEY_ID) ? 'live' : 'sandbox'
  };
};

/**
 * Verify payment signature / token and provision subscription
 */
const verifyPaymentAndUpgrade = async ({
  userId,
  orderId,
  paymentId = `pay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
  signature = 'mock_valid_signature',
  planId,
  billingCycle = 'monthly',
  currency = 'INR',
  gateway = 'mock_checkout'
}) => {
  const plan = PLANS[planId];
  if (!plan || planId === 'free') {
    throw new Error('Invalid plan to upgrade');
  }

  const user = await User.findByPk(userId);
  if (!user) throw new Error('User not found');

  // Verify Razorpay signature if live key secret is provided
  if (gateway === 'razorpay' && process.env.RAZORPAY_KEY_SECRET && signature !== 'mock_valid_signature') {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      throw new Error('Invalid payment signature verification failed');
    }
  }

  const isINR = (currency || 'INR').toUpperCase() === 'INR';
  const priceObj = isINR ? plan.priceINR : plan.priceUSD;
  const amountUnits = billingCycle === 'yearly' ? priceObj.yearly : priceObj.monthly;
  const amountMinor = Math.round(amountUnits * 100);

  const now = new Date();
  const periodEnd = new Date(now);
  if (billingCycle === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  // Deactivate any previous active subscriptions for this user
  await Subscription.update(
    { status: 'canceled' },
    { where: { userId, status: 'active' } }
  );

  // Create new active subscription record
  const subscription = await Subscription.create({
    userId,
    tier: planId,
    billingCycle,
    amount: amountMinor,
    currency: isINR ? 'INR' : 'USD',
    gateway,
    status: 'active',
    orderId,
    paymentId,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd: false,
    metadata: JSON.stringify({
      verifiedAt: now.toISOString(),
      planName: plan.name,
      billingCycle,
      currency: isINR ? 'INR' : 'USD',
      amountDisplay: amountUnits
    })
  });

  // Elevate user's tier
  user.subscriptionTier = planId;
  user.subscriptionStatus = 'active';
  user.subscriptionExpiresAt = periodEnd;
  await user.save();

  return {
    success: true,
    message: `🎉 Successfully upgraded to ${plan.name}! All ${planId.toUpperCase()} features are now unlocked.`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      subscriptionTier: user.subscriptionTier,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionExpiresAt: user.subscriptionExpiresAt
    },
    subscription: {
      id: subscription.id,
      tier: subscription.tier,
      billingCycle: subscription.billingCycle,
      currentPeriodEnd: subscription.currentPeriodEnd,
      gateway: subscription.gateway,
      paymentId: subscription.paymentId
    }
  };
};

/**
 * Cancel active subscription at period end or immediately
 */
const cancelSubscription = async (userId) => {
  const subscription = await Subscription.findOne({
    where: { userId, status: 'active' },
    order: [['createdAt', 'DESC']]
  });

  if (!subscription) {
    throw new Error('No active subscription found to cancel');
  }

  subscription.cancelAtPeriodEnd = true;
  await subscription.save();

  return {
    success: true,
    message: 'Subscription will not renew. Your benefits remain active until the end of the billing cycle.',
    expiresAt: subscription.currentPeriodEnd
  };
};

module.exports = {
  PLANS,
  getUserUsageAndLimits,
  createCheckoutOrder,
  verifyPaymentAndUpgrade,
  cancelSubscription
};
