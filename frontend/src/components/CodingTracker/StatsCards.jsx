// frontend/src/components/CodingTracker/StatsCards.jsx
import React from 'react';
import {
  Code2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Target
} from 'lucide-react';

export const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const totalProblems = stats.totalProblems ?? stats.total ?? 0;
  const totalSolved = stats.totalSolved ?? stats.solved ?? 0;
  const successRate = stats.successRate ?? 0;
  const averageTime = stats.averageTime ?? 0;
  const weakTopicsCount = stats.weakTopicsCount ?? (stats.weakTopics ? stats.weakTopics.length : 0);
  const timeTrends = stats.timeTrends || {};

  const getSuccessRateBadge = (rate) => {
    if (rate >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (rate >= 70) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Problems */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Problems
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h4 className="text-2xl font-black text-slate-900">{totalProblems}</h4>
              <span className="text-[11px] font-medium text-slate-400">
                ({totalSolved} solved)
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Across all algorithmic categories
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Success Rate
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-2xl font-black text-slate-900">{successRate}%</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getSuccessRateBadge(successRate)}`}>
                {successRate >= 70 ? 'On Target' : 'Below 70%'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Problems solved without failure
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Weak Topics */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Weak Topics
            </p>
            <div className="flex items-baseline gap-2 mt-1">
              <h4 className="text-2xl font-black text-slate-900">{weakTopicsCount}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                weakTopicsCount > 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}>
                {weakTopicsCount > 0 ? '&lt; 70% Success' : 'All Mastered'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Requires focused deliberate practice
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Average Time & Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Average Time
            </p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h4 className="text-2xl font-black text-slate-900">{averageTime}</h4>
              <span className="text-xs font-semibold text-slate-500">minutes</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] mt-0.5">
              {timeTrends.trend === 'getting_faster' ? (
                <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                  <TrendingDown className="w-3 h-3" />
                  {timeTrends.percentageChange}% faster recently
                </span>
              ) : timeTrends.trend === 'slowing' ? (
                <span className="text-amber-600 font-medium flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  Harder problems (+{timeTrends.percentageChange}%)
                </span>
              ) : (
                <span className="text-slate-400 flex items-center gap-0.5">
                  <Minus className="w-3 h-3" />
                  Steady pace
                </span>
              )}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
