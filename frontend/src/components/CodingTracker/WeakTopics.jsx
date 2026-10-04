// frontend/src/components/CodingTracker/WeakTopics.jsx
import React from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Flame,
  Clock
} from 'lucide-react';

export const WeakTopics = ({ weakTopics = [], onReviewTopic }) => {
  if (!weakTopics || weakTopics.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">No Weak Topics Flagged</h4>
        <p className="text-xs text-slate-400 max-w-xs mx-auto">
          All practicing topics maintain a &ge;70% success rate. Excellent algorithmic consistency!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-rose-50/40 rounded-2xl border-2 border-rose-200 p-5 shadow-sm space-y-4">
      {/* Header with Red Alert Highlight */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-600 flex-shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-rose-950">
                Weak Topics (&lt; 70% Success Rate)
              </h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs">
                {weakTopics.length} Flagged
              </span>
            </div>
            <p className="text-xs text-rose-700/80 mt-0.5">
              Targeted DSA areas where success rate has dropped below mastery threshold.
            </p>
          </div>
        </div>
      </div>

      {/* List of Weak Topics */}
      <div className="space-y-2.5">
        {weakTopics.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-rose-200/90 bg-white shadow-xs hover:border-rose-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="font-bold text-xs text-slate-900 truncate">
                  {item.topic}
                </span>
                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  {item.successRate}% Success Rate
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.max(5, item.successRate)}%` }}
                />
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span>
                  Solved {item.solved} of {item.total} attempted
                </span>
                {item.avgTime && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Avg: {item.avgTime}m
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* "Review These" Action Button */}
            <div className="self-end sm:self-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => onReviewTopic && onReviewTopic(item.topic)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Review These
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakTopics;
