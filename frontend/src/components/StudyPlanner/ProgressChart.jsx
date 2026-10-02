// frontend/src/components/StudyPlanner/ProgressChart.jsx
import React from 'react';
import { formatPercentage } from '../../utils/formatters';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export const ProgressChart = ({ progress = 0, title }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          <h4 className="text-sm font-bold text-slate-900">Study Roadmap Velocity</h4>
        </div>
        <span className="text-lg font-black text-indigo-600">{formatPercentage(progress)}</span>
      </div>

      {title && <p className="text-xs text-slate-500">{title}</p>}

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
        <span>Sprint Kickoff</span>
        <span>Target Completion</span>
      </div>
    </div>
  );
};

export default ProgressChart;
