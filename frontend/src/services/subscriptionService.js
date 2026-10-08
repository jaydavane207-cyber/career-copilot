// frontend/src/services/subscriptionService.js
import api from './api';

export const subscriptionService = {
  /**
   * Fetch all subscription plans, pricing in INR/USD, and FAQs
   */
  async getPlans() {
    const response = await api.get('/subscription/plans');
    return response.data;
  },

  /**
   * Get authenticated user's current tier, usage stats, and feature limits
   */
  async getStatus() {
    const response = await api.get('/subscription/status');
    return response.data;
  },

  /**
   * Create checkout order for Razorpay / Stripe / Mock Sandbox
   */
  async createOrder({ planId, billingCycle = 'monthly', currency = 'INR', gateway = 'mock_checkout' }) {
    const response = await api.post('/subscription/create-order', {
      planId,
      billingCycle,
      currency,
      gateway
    });
    return response.data;
  },

  /**
   * Verify signature and provision user tier upgrade
   */
  async verifyPayment({ orderId, paymentId, signature, planId, billingCycle = 'monthly', currency = 'INR', gateway = 'mock_checkout' }) {
    const response = await api.post('/subscription/verify-payment', {
      orderId,
      paymentId,
      signature,
      planId,
      billingCycle,
      currency,
      gateway
    });
    return response.data;
  },

  /**
   * Cancel subscription at end of billing cycle
   */
  async cancelSubscription() {
    const response = await api.post('/subscription/cancel');
    return response.data;
  },

  /**
   * Fetch Pro exclusive salary coach guidelines
   */
  async getSalaryCoach() {
    const response = await api.get('/subscription/pro-features/salary-coach');
    return response.data;
  }
};

export default subscriptionService;
