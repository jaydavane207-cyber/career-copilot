// frontend/src/pages/Pricing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import subscriptionService from '../services/subscriptionService';
import {
  Check,
  X,
  Sparkles,
  Crown,
  Zap,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const Pricing = () => {
  const { user, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();

  // State
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [currency, setCurrency] = useState('INR'); // 'INR' | 'USD'
  const [plans, setPlans] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  // Checkout Modal State
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState(null);
  const [checkoutGateway, setCheckoutGateway] = useState('razorpay'); // 'razorpay' | 'stripe' | 'mock_checkout'
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load plans and user status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const plansData = await subscriptionService.getPlans();
        if (plansData.success) {
          setPlans(plansData.plans || []);
          setFaqs(plansData.faqs || []);
        }

        if (isAuthenticated) {
          const statusData = await subscriptionService.getStatus();
          if (statusData.success) {
            setUserStatus(statusData);
          }
        }
      } catch (err) {
        console.error('Failed to fetch pricing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const currentTier = userStatus?.tier || user?.subscriptionTier || 'free';

  // Currency Formatter
  const formatPrice = (plan) => {
    if (!plan) return '';
    const isINR = currency === 'INR';
    const priceObj = isINR ? plan.priceINR : plan.priceUSD;
    if (!priceObj) return '₹0';
    const amount = billingCycle === 'yearly' ? priceObj.yearly : priceObj.monthly;

    if (amount === 0) return 'Free';
    return isINR ? `₹${amount.toLocaleString('en-IN')}` : `$${amount}`;
  };

  const getPerMonthEquivalent = (plan) => {
    if (billingCycle !== 'yearly' || !plan) return null;
    const isINR = currency === 'INR';
    const priceObj = isINR ? plan.priceINR : plan.priceUSD;
    if (!priceObj || priceObj.yearly === 0) return null;
    const perMonth = Math.round(priceObj.yearly / 12);
    return isINR ? `₹${perMonth.toLocaleString('en-IN')}/mo` : `$${(priceObj.yearly / 12).toFixed(2)}/mo`;
  };

  // Handle plan selection
  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/pricing');
      return;
    }

    if (plan.id === currentTier) {
      return;
    }

    if (plan.id === 'free') {
      // Free plan selected
      return;
    }

    setSelectedPlanForCheckout(plan);
    setErrorMessage(null);
    setCheckoutSuccess(false);
  };

  // Process checkout order and verification
  const handleConfirmPayment = async () => {
    if (!selectedPlanForCheckout) return;

    try {
      setPaymentProcessing(true);
      setErrorMessage(null);

      // 1. Create order
      const orderRes = await subscriptionService.createOrder({
        planId: selectedPlanForCheckout.id,
        billingCycle,
        currency,
        gateway: checkoutGateway
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to create payment order');
      }

      // 2. Verify payment & provision tier
      const verifyRes = await subscriptionService.verifyPayment({
        orderId: orderRes.order.orderId,
        paymentId: `pay_${checkoutGateway}_${Date.now()}`,
        signature: 'mock_valid_signature',
        planId: selectedPlanForCheckout.id,
        billingCycle,
        currency,
        gateway: checkoutGateway
      });

      if (!verifyRes.success) {
        throw new Error(verifyRes.message || 'Payment verification failed');
      }

      setCheckoutSuccess(true);

      // Refresh status
      const updatedStatus = await subscriptionService.getStatus();
      if (updatedStatus.success) {
        setUserStatus(updatedStatus);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Payment processing error');
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Invest In Your Next 20–40 LPA Tech Offer</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Predictable Pricing for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 bg-clip-text text-transparent">
              Ambitious Tech Careers
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            One month of targeted preparation with Career Copilot pays for itself on Day 1 of your new software engineering role.
          </p>

          {/* Current User Plan Banner */}
          {isAuthenticated && userStatus && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white border border-slate-200/90 shadow-sm rounded-2xl px-5 py-2.5 text-xs">
              <span className="text-slate-500 font-medium">Your Current Plan:</span>
              <span className={`font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                currentTier === 'pro'
                  ? 'bg-amber-100 text-amber-800'
                  : currentTier === 'premium'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {currentTier}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">
                Remaining Scans: <strong className="text-slate-900">{userStatus.remaining?.resumeScans}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">
                Remaining Mocks: <strong className="text-slate-900">{userStatus.remaining?.mockInterviews}</strong>
              </span>
            </div>
          )}

          {/* Toggles: Billing Cycle & Currency */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Monthly / Yearly Toggle */}
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md">
                  SAVE 20%
                </span>
              </button>
            </div>

            {/* Currency Selector */}
            <div className="bg-slate-100/90 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  currency === 'INR'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-20">
          {/* 1. Free Starter */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                Starter
              </div>
              <h3 className="text-2xl font-black text-slate-900">Free Forever</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                Essential interview prep tools to explore the platform and test your baseline.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                <span className="text-xs text-slate-400 font-medium">/forever</span>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6 space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  What's included:
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>1 AI ATS Resume Analysis / month</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>5 AI Mock Interviews total</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Track up to 20 Job Applications</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Unified Career Readiness Score</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-400">
                  <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                  <span>Unlimited ATS Resumes & Rewrites</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-400">
                  <X className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />
                  <span>Salary Negotiation Assistant</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                disabled={currentTier === 'free'}
                onClick={() => handleSelectPlan({ id: 'free' })}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-colors ${
                  currentTier === 'free'
                    ? 'bg-slate-100 text-slate-500 cursor-default'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {currentTier === 'free' ? 'Current Plan' : 'Select Free'}
              </button>
            </div>
          </div>

          {/* 2. Premium (Most Popular) */}
          <div className="relative bg-white rounded-3xl p-8 border-2 border-indigo-600 shadow-xl shadow-indigo-100/60 flex flex-col justify-between transform md:-translate-y-2">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-md shadow-indigo-200">
              Most Popular
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Premium Tier</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Career Copilot Premium</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                Unlimited practice and advanced AI evaluations to fast-track your product tech placement.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {formatPrice(plans.find((p) => p.id === 'premium') || {
                    priceINR: { monthly: 799, yearly: 7990 },
                    priceUSD: { monthly: 9.99, yearly: 99.99 }
                  })}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
                {billingCycle === 'yearly' && (
                  <span className="ml-2 text-xs font-semibold text-emerald-600">
                    ({getPerMonthEquivalent(plans.find((p) => p.id === 'premium'))})
                  </span>
                )}
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6 space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Everything in Starter, plus:
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> AI ATS Resume Scans & Tailoring</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> AI Mock Interviews with Instant Scoring</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Unlimited</strong> Job Application Tracking & Notes</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Full Top Indian MNC & Startup Question Banks</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Personalized 12-Week Study Roadmaps</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Downloadable PDF Performance Reports</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Priority AI Processing & Zero Wait Time</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                disabled={currentTier === 'premium'}
                onClick={() => handleSelectPlan({ id: 'premium', name: 'Career Copilot Premium' })}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                  currentTier === 'premium'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:scale-[1.02]'
                }`}
              >
                <span>{currentTier === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}</span>
                {currentTier !== 'premium' && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 3. Pro Tier */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider mb-4">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>Executive Pro</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Career Copilot Pro</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed min-h-[36px]">
                Video simulations, personalized negotiation assistance, and senior mentorship.
              </p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">
                  {formatPrice(plans.find((p) => p.id === 'pro') || {
                    priceINR: { monthly: 1999, yearly: 19990 },
                    priceUSD: { monthly: 24.99, yearly: 249.99 }
                  })}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
                {billingCycle === 'yearly' && (
                  <span className="ml-2 text-xs font-semibold text-emerald-600">
                    ({getPerMonthEquivalent(plans.find((p) => p.id === 'pro'))})
                  </span>
                )}
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6 space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Everything in Premium, plus:
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>AI Video Mock Simulator</strong> & Speech Pace Analysis</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Executive Salary Negotiation</strong> Assistant & Scripts</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>1 Monthly 1-on-1 Mentorship</strong> Credit with Senior Dev</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Direct Startup Referral Pipeline Access</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-800 font-medium">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Dedicated 24/7 Career Advisor Support</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4">
              <button
                disabled={currentTier === 'pro'}
                onClick={() => handleSelectPlan({ id: 'pro', name: 'Career Copilot Pro' })}
                className={`w-full py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  currentTier === 'pro'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200 cursor-default'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md shadow-amber-200 hover:scale-[1.02]'
                }`}
              >
                <span>{currentTier === 'pro' ? 'Current Plan' : 'Unlock Pro Access'}</span>
                {currentTier !== 'pro' && <Zap className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm mb-20 overflow-x-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Detailed Feature Comparison</h2>
            <p className="text-xs text-slate-500 mt-1">See exactly how each tier empowers your preparation journey</p>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 font-bold text-slate-900 w-1/2">Capabilities & Features</th>
                <th className="py-3 px-4 font-bold text-slate-900 text-center w-1/6">Free Starter</th>
                <th className="py-3 px-4 font-bold text-indigo-700 text-center w-1/6">Premium (₹799)</th>
                <th className="py-3 px-4 font-bold text-amber-700 text-center w-1/6">Pro (₹1,999)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">ATS Resume Scans & Keyword Matching</td>
                <td className="py-3 px-4 text-center">1 / month</td>
                <td className="py-3 px-4 text-center text-indigo-600 font-bold">Unlimited</td>
                <td className="py-3 px-4 text-center text-amber-600 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">AI Mock Interview Sessions</td>
                <td className="py-3 px-4 text-center">5 Total</td>
                <td className="py-3 px-4 text-center text-indigo-600 font-bold">Unlimited</td>
                <td className="py-3 px-4 text-center text-amber-600 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Job Application Tracking & Kanban</td>
                <td className="py-3 px-4 text-center">Up to 20 Jobs</td>
                <td className="py-3 px-4 text-center text-indigo-600 font-bold">Unlimited</td>
                <td className="py-3 px-4 text-center text-amber-600 font-bold">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Company Interview Question Banks</td>
                <td className="py-3 px-4 text-center">Basic (5 Questions)</td>
                <td className="py-3 px-4 text-center font-semibold text-slate-800">Full 100+ Companies</td>
                <td className="py-3 px-4 text-center font-semibold text-slate-800">Full + Hidden Patterns</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Downloadable PDF Performance Reports</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
                <td className="py-3 px-4 text-center text-emerald-600 font-bold">✓ Included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">AI Video Mock Interview & Speech Analysis</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-amber-600 font-bold">✓ Pro Exclusive</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Executive Salary Negotiation Assistant</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-amber-600 font-bold">✓ Pro Exclusive</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">1-on-1 Senior Engineer Mentorship Pass</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-slate-400">—</td>
                <td className="py-3 px-4 text-center text-amber-600 font-bold">1 / month included</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-800">Support Level</td>
                <td className="py-3 px-4 text-center">Community</td>
                <td className="py-3 px-4 text-center font-semibold text-indigo-700">Priority Email</td>
                <td className="py-3 px-4 text-center font-bold text-amber-800">Dedicated 24/7 VIP</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQs Accordion */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-500 mt-1">Everything you need to know about payments, billing, and cancellations</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 cursor-pointer transition-all hover:border-slate-300"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600" />
                    <span>{faq.question}</span>
                  </h4>
                  <span className="text-slate-400 text-xs font-bold">
                    {activeFaq === idx ? '−' : '+'}
                  </span>
                </div>
                {activeFaq === idx && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Guarantee Footer */}
        <div className="text-center max-w-xl mx-auto border-t border-slate-200 pt-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>7-Day 100% Risk-Free Guarantee</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            If Career Copilot doesn't noticeably accelerate your confidence and readiness, reach out within 7 days for an instant, no-questions-asked refund.
          </p>
        </div>
      </div>

      {/* Checkout Dialog Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8">
            <button
              onClick={() => setSelectedPlanForCheckout(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {checkoutSuccess ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-100 mb-4 animate-bounce">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Payment Successful! 🎉</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Your account is now elevated to <strong>{selectedPlanForCheckout.name}</strong>. All quotas and premium AI features are immediately unlocked!
                </p>
                <button
                  onClick={() => {
                    setSelectedPlanForCheckout(null);
                    navigate('/dashboard');
                  }}
                  className="mt-6 w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-100 transition-colors"
                >
                  Go to Dashboard & Start Prepping
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Order Summary</h3>
                    <span className="text-[11px] text-slate-500">Secure 256-Bit Encrypted Checkout</span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Bill Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 mb-5 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Plan:</span>
                    <strong className="text-slate-900">{selectedPlanForCheckout.name}</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Billing Cycle:</span>
                    <span className="capitalize font-semibold text-slate-800">{billingCycle}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Currency:</span>
                    <span className="font-semibold text-slate-800">{currency}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between items-center text-sm font-extrabold text-slate-900">
                    <span>Total Due Today:</span>
                    <span className="text-indigo-600 text-base">{formatPrice(selectedPlanForCheckout)}</span>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div className="mb-6">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Choose Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutGateway('razorpay')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        checkoutGateway === 'razorpay'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-[10px] block">UPI / Cards</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutGateway('stripe')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        checkoutGateway === 'stripe'
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-[10px] block">Stripe Global</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutGateway('mock_checkout')}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        checkoutGateway === 'mock_checkout'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Zap className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                      <span className="text-[10px] block">Sandbox 1-Click</span>
                    </button>
                  </div>
                </div>

                {/* Pay Action */}
                <button
                  disabled={paymentProcessing}
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  {paymentProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Payment ({formatPrice(selectedPlanForCheckout)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <span className="text-[10px] text-slate-400">
                    Auto-renews until canceled. Cancel anytime in 1 click.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
