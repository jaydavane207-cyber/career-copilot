// frontend/src/components/MockInterview/InterviewHistory.jsx
import React from 'react';
import { Award, Calendar, ChevronRight } from 'lucide-react';
import { formatDate, formatPercentage } from '../../utils/formatters';

export const InterviewHistory = ({ history, onSelect }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center text-xs text-slate-400">
        No mock interviews recorded yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
      <h4 className="text-sm font-bold text-slate-900">Past Simulated Sessions</h4>
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect && onSelect(item)}
            className="p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all cursor-pointer flex items-center justify-between text-xs"
          >
            <div>
              <p className="font-bold text-slate-800">{item.role} ({item.interviewType})</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(item.completedAt)}</span>
                <span>•</span>
                <span>{item.durationMinutes} mins</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {formatPercentage(item.overallScore)}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
