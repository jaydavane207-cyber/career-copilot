// frontend/src/components/CodingTracker/ProblemsChart.jsx
import React from 'react';
import { PieChart } from 'lucide-react';

export const ProblemsChart = ({ distribution = {} }) => {
  const topics = Object.keys(distribution);
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <PieChart className="w-5 h-5 text-indigo-600" />
        <h4 className="text-sm font-bold text-slate-900">Topic Coverage Distribution</h4>
      </div>

      <div className="space-y-2 pt-2">
        {topics.length > 0 ? (
          topics.map((topic, i) => {
            const count = distribution[topic];
            const pct = Math.round((count / total) * 100);
            return (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{topic}</span>
                  <span>{count} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 italic">No topic data available yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProblemsChart;
