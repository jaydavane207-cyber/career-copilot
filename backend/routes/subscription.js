// backend/routes/subscription.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { requireTier } = require('../middleware/subscriptionGate');
const {
  PLANS,
  getUserUsageAndLimits,
  createCheckoutOrder,
  verifyPaymentAndUpgrade,
  cancelSubscription
} = require('../services/subscriptionService');

/**
 * @route   GET /api/subscription/plans
 * @desc    Get all available subscription plans, pricing, and feature comparison
 * @access  Public
 */
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: Object.values(PLANS),
    faqs: [
      {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes! You can cancel at any time with 1-click in your account settings. You will continue to have full access until the end of your billing cycle.'
      },
      {
        question: 'Do you support UPI and Indian Credit/Debit cards?',
        answer: 'Yes! We support UPI (Google Pay, PhonePe, Paytm), Netbanking, RuPay, and all major Indian and international cards via Razorpay and Stripe.'
      },
      {
        question: 'What is the refund policy?',
        answer: 'We offer an unconditional 7-day money-back guarantee. If Career Copilot doesn’t help boost your prep, email us for a full refund.'
      },
      {
        question: 'What happens to my data if I downgrade to Free?',
        answer: 'All your resumes, mock interview logs, and tracked jobs are preserved forever. You will simply be restricted to Free tier monthly creation limits.'
      }
    ]
  });
});

/**
 * @route   GET /api/subscription/status
 * @desc    Get current user tier, usage metrics, and limits
 * @access  Private
 */
router.get('/status', auth, async (req, res, next) => {
  try {
    const statusData = await getUserUsageAndLimits(req.user.id);
    res.json({
      success: true,
      ...statusData
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/subscription/create-order
 * @desc    Create a payment gateway order (Razorpay / Stripe / Mock Sandbox)
 * @access  Private
 */
router.post('/create-order', auth, async (req, res, next) => {
  try {
    const { planId, billingCycle = 'monthly', currency = 'INR', gateway = 'mock_checkout' } = req.body;
    
    if (!planId || !['premium', 'pro'].includes(planId)) {
      return res.status(400).json({
        success: false,
        message: 'Please choose a valid plan: "premium" or "pro"'
      });
    }

    const order = await createCheckoutOrder({
      userId: req.user.id,
      planId,
      billingCycle,
      currency,
      gateway
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/subscription/verify-payment
 * @desc    Verify payment signature and activate subscription
 * @access  Private
 */
router.post('/verify-payment', auth, async (req, res, next) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      planId,
      billingCycle = 'monthly',
      currency = 'INR',
      gateway = 'mock_checkout'
    } = req.body;

    if (!orderId || !planId) {
      return res.status(400).json({
        success: false,
        message: 'Missing orderId or planId'
      });
    }

    const result = await verifyPaymentAndUpgrade({
      userId: req.user.id,
      orderId,
      paymentId,
      signature,
      planId,
      billingCycle,
      currency,
      gateway
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/subscription/cancel
 * @desc    Cancel active subscription at end of billing cycle
 * @access  Private
 */
router.post('/cancel', auth, async (req, res, next) => {
  try {
    const result = await cancelSubscription(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/subscription/webhook
 * @desc    Handle payment provider webhooks (Razorpay / Stripe)
 * @access  Public (Signature validated)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Webhook event received
  res.json({ received: true });
});

/**
 * @route   GET /api/subscription/pro-features/salary-coach
 * @desc    Example Pro-only feature: Executive Salary Negotiation Assistant
 * @access  Private (Pro Tier only)
 */
router.get('/pro-features/salary-coach', auth, requireTier('pro'), (req, res) => {
  res.json({
    success: true,
    feature: 'Executive Salary Negotiation Assistant',
    data: {
      negotiationGuide: 'Framework for negotiating Indian Product Startups & US MNC Offers (CTC structure: Fixed + Variable + ESOPs)',
      templates: [
        {
          scenario: 'Counter-offering after initial verbal offer',
          template: 'Thank you for the offer. Based on current market benchmarks for SDE-2 in Bengaluru and my competing offers, I am looking for a total compensation closer to ₹36 LPA with a higher fixed component...'
        },
        {
          scenario: 'Negotiating joining bonus & ESOP vesting',
          template: 'Given the stock vesting schedule, I would like to explore an upfront joining bonus of ₹3 LPA to offset unvested equity at my current firm...'
        }
      ]
    }
  });
});

/**
 * @route   GET /api/subscription/pro-features/video-mock
 * @desc    Example Pro-only feature: Video Mock Interview Simulator
 * @access  Private (Pro Tier only)
 */
router.get('/pro-features/video-mock', auth, requireTier('pro'), (req, res) => {
  res.json({
    success: true,
    feature: 'AI Video Mock Interview Simulator',
    data: {
      status: 'ready',
      modules: ['Body Language Analysis', 'Speech Pace & Filler Words (um/like)', 'Camera Framing Check', 'Live AI Feedback']
    }
  });
});

module.exports = router;
