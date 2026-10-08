// frontend/src/components/Analytics/PredictionsPanel.jsx
import React from 'react';
import { TrendingUp, Sparkles, Target, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export const PredictionsPanel = ({ predictions }) => {
  if (!predictions) return null;

  const { current_pace, projections_3_months, platform_avg_pace, if_you_match_platform_avg } = predictions;

  const currentApps = projections_3_months?.total_applications || 39;
  const currentInterviews = projections_3_months?.total_interviews || 21;
  const currentOffers = projections_3_months?.expected_offers || 5;

  const platformApps = if_you_match_platform_avg?.total_applications || 52;
  const platformInterviews = if_you_match_platform_avg?.total_interviews || 31;
  const platformOffers = if_you_match_platform_avg?.expected_offers || 12;

  const deltaOffers = platformOffers - currentOffers;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">3-Month Predictive Career Forecast</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Statistical regression model estimating next quarter offer volume based on velocity and conversion rates
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md self-start sm:self-auto border border-emerald-200">
          Projected: {currentOffers} Job Offers
        </span>
      </div>

      {/* Dual Projection Cards: Current Trajectory vs Platform Benchmark Pace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Your Current Pace */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Current Trajectory (Pace: {current_pace?.applications_per_week || 3} apps/week)
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {current_pace?.offer_rate || 25}% Offer Rate
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-3 border border-slate-200 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Applications</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{currentApps}</span>
              <span className="text-[10px] text-slate-400">Next 90 Days</span>
            </div>

            <div className="border-x border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviews</span>
              <span className="text-xl font-extrabold text-blue-600 mt-0.5 block">{currentInterviews}</span>
              <span className="text-[10px] text-slate-400">Rounds</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Offers</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{currentOffers}</span>
              <span className="text-[10px] text-slate-400">Expected</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/80">
            <strong>Expected Cumulative Value:</strong> At your target compensation bracket ($180k), {currentOffers} offers deliver maximum negotiating leverage.
          </div>
        </div>

        {/* Card 2: If You Match Top Platform Pace */}
        <div className="p-5 rounded-xl border border-indigo-200 bg-indigo-50/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              If You Match Top Platform Benchmark (4-5 apps/week)
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
              40% Offer Rate
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 bg-white rounded-lg p-3 border border-indigo-200 text-center shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Applications</span>
              <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{platformApps}</span>
              <span className="text-[10px] text-indigo-600 font-bold">+13 apps</span>
            </div>

            <div className="border-x border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviews</span>
              <span className="text-xl font-extrabold text-indigo-600 mt-0.5 block">{platformInterviews}</span>
              <span className="text-[10px] text-indigo-600 font-bold">+10 rounds</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Offers</span>
              <span className="text-xl font-extrabold text-emerald-600 mt-0.5 block">{platformOffers}</span>
              <span className="text-[10px] text-emerald-600 font-bold">+{deltaOffers} offers</span>
            </div>
          </div>

          <div className="text-xs text-indigo-900 bg-white p-3 rounded-lg border border-indigo-200/80">
            <strong>Outcome Lift:</strong> Increasing cadence to 4 applications/week and elevating technical conversion unlocks up to <strong>+{deltaOffers} additional offers</strong>.
          </div>
        </div>
      </div>

      {/* Strategic Roadmap Callout */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-5 space-y-3 shadow-md">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h4 className="font-bold text-sm text-white">How To Reach Top-Tier Platform Velocity</h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-200">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-xs">
            <span className="font-bold text-amber-300 block mb-1">1. Increase Cadence</span>
            <span>Submit 4-5 tailored applications per week using Resume Matcher to expand interview pipeline.</span>
          </div>

          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-xs">
            <span className="font-bold text-amber-300 block mb-1">2. Conquer Tech Screens</span>
            <span>Boost technical interview conversion from 50% to 60% with spaced repetition coding drills.</span>
          </div>

          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-xs">
            <span className="font-bold text-amber-300 block mb-1">3. Concurrent Offers</span>
            <span>Group final rounds across target companies within the same 2-week window to maximize bidding.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionsPanel;
