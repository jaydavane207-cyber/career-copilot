// frontend/src/components/CodingTracker/ProblemsList.jsx
import React from 'react';
import { getDifficultyBadge } from '../../utils/helpers';
import { formatDate } from '../../utils/formatters';
import { Trash2, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

export const ProblemsList = ({ problems, onDelete }) => {
  if (!problems || problems.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-400 text-xs">
        No coding problems logged yet.
      </div>
    );
  }

  const statusIcons = {
    Solved: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    Review: <RotateCcw className="w-4 h-4 text-amber-500" />,
    Attempted: <HelpCircle className="w-4 h-4 text-slate-400" />
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-900">Recent Solved Problems ({problems.length})</h4>
      </div>

      <div className="divide-y divide-slate-100">
        {problems.map((p) => (
          <div key={p.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {statusIcons[p.status] || statusIcons.Solved}
                <h5 className="font-bold text-slate-900 text-xs">{p.title}</h5>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getDifficultyBadge(p.difficulty)}`}>
                  {p.difficulty}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {p.topic}
                </span>
              </div>

              {p.solutionNotes && (
                <p className="text-[11px] text-slate-500 line-clamp-1 italic pl-6">
                  "{p.solutionNotes}"
                </p>
              )}

              <div className="flex items-center gap-3 text-[10px] text-slate-400 pl-6">
                <span>Platform: {p.platform}</span>
                <span>•</span>
                <span>Time: {p.timeSpentMinutes} mins</span>
                <span>•</span>
                <span>{formatDate(p.solvedAt)}</span>
              </div>
            </div>

            {onDelete && (
              <button
                onClick={() => onDelete(p.id)}
                className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemsList;
