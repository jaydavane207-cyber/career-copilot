// frontend/src/components/Subscription/SubscriptionBadge.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, Zap } from 'lucide-react';

export const SubscriptionBadge = ({ tier = 'free', showUpgradeLink = true, size = 'sm' }) => {
  const normalizedTier = (tier || 'free').toLowerCase();

  if (normalizedTier === 'pro') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-300 text-amber-800 font-bold text-[11px] shadow-sm">
        <Crown className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span>PRO MEMBER</span>
      </div>
    );
  }

  if (normalizedTier === 'premium') {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-[11px] shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>PREMIUM</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-[10px] border border-slate-200">
        FREE PLAN
      </span>
      {showUpgradeLink && (
        <Link
          to="/pricing"
          className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>Upgrade</span>
        </Link>
      )}
    </div>
  );
};

export default SubscriptionBadge;
