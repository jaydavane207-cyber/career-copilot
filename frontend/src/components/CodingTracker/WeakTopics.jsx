// frontend/src/components/CodingTracker/WeakTopics.jsx
import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export const WeakTopics = ({ weakTopics }) => {
  if (!weakTopics || weakTopics.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center text-xs text-slate-400">
        No weak topics identified yet. Log more questions!
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <h4 className="text-sm font-bold text-slate-900">Priority Topics for Review</h4>
      </div>
      <p className="text-xs text-slate-500">
        Algorithmic areas with high review ratios requiring deliberate practice.
      </p>

      <div className="space-y-2 pt-1">
        {weakTopics.slice(0, 5).map((item, idx) => (
          <div key={idx} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">{item.topic}</span>
              <p className="text-[10px] text-slate-400">
                {item.needsReview} flagged for review / {item.total} logged
              </p>
            </div>
            <span className="text-xs font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              {item.weaknessScore}% review rate
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakTopics;
