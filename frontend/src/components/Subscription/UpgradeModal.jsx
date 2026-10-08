// frontend/src/components/Subscription/UpgradeModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, X, ShieldCheck } from 'lucide-react';

export const UpgradeModal = ({
  isOpen,
  onClose,
  title = 'Upgrade Your Prep Level',
  feature = 'Premium Features',
  message = 'You have reached your free plan limit for this feature. Unlock unlimited access with Career Copilot Premium.'
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 md:p-8 overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              {feature}
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Description Message */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {message}
        </p>

        {/* Quick Perks List */}
        <div className="space-y-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Unlimited AI ATS Resume Scans & Keyword Tailoring</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Unlimited AI Mock Interviews with Instant Actionable Feedback</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Unlimited Application Tracking & Personalized Roadmaps</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Starting at just ₹799/month (or ₹26/day)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <button
            onClick={() => {
              onClose();
              navigate('/pricing');
            }}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>View All Plans & Upgrade</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition-colors"
          >
            Maybe Later
          </button>
        </div>

        {/* Guarantee subtext */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>7-Day 100% Money-Back Guarantee • Cancel anytime</span>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
