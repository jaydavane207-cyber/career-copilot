// frontend/src/components/CodingTracker/SpacedRepetitionReminder.jsx
import React from 'react';
import {
  Brain,
  CheckCircle2,
  CalendarClock,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { getDifficultyBadge } from '../../utils/helpers';
import { formatDate } from '../../utils/formatters';

export const SpacedRepetitionReminder = ({
  spacedData,
  onReviewProblem,
  onViewDetails
}) => {
  const dueProblems = spacedData?.dueProblems || [];
  const dueCount = spacedData?.dueCount || dueProblems.length;
  const intervals = spacedData?.intervals || [1, 3, 7, 14, 30];

  return (
    <div className="bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 rounded-2xl border border-indigo-100 p-5 shadow-sm space-y-4">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 flex-shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Spaced Repetition System
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                1d &bull; 3d &bull; 7d &bull; 14d &bull; 30d
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dueCount > 0
                ? `You have ${dueCount} ${dueCount === 1 ? 'problem' : 'problems'} to review today to retain algorithmic patterns.`
                : 'Great job! You have no problems due for spaced repetition review today.'}
            </p>
          </div>
        </div>

        {dueCount > 0 && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start sm:self-auto">
            <CalendarClock className="w-4 h-4 text-amber-600" />
            <span>{dueCount} Due Now</span>
          </div>
        )}
      </div>

      {/* Due Problems List */}
      {dueCount > 0 ? (
        <div className="space-y-2.5 pt-1">
          {dueProblems.slice(0, 4).map((p) => (
            <div
              key={p.id}
              className="bg-white/90 backdrop-blur-sm rounded-xl border border-indigo-100/80 p-3.5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {p.problemName || p.title}
                  </h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getDifficultyBadge(p.difficulty)}`}>
                    {p.difficulty}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {p.topic}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Stage {(p.reviewStage || 0) + 1} ({p.intervalDays || 1}d)
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Solved {formatDate(p.date)}</span>
                  <span>&bull;</span>
                  {p.daysOverdue > 0 ? (
                    <span className="text-rose-600 font-semibold">
                      Overdue by {p.daysOverdue} {p.daysOverdue === 1 ? 'day' : 'days'}
                    </span>
                  ) : (
                    <span className="text-amber-600 font-medium">Due today</span>
                  )}
                  {p.notes && (
                    <>
                      <span>&bull;</span>
                      <span className="truncate max-w-[200px] italic">"{p.notes}"</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                {onViewDetails && (
                  <button
                    type="button"
                    onClick={() => onViewDetails(p)}
                    className="px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    Details
                  </button>
                )}
                {onReviewProblem && (
                  <button
                    type="button"
                    onClick={() => onReviewProblem(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Mark as Reviewed
                  </button>
                )}
              </div>
            </div>
          ))}

          {dueCount > 4 && (
            <p className="text-[11px] text-center text-slate-400 pt-1">
              +{dueCount - 4} more problems due for review today in table below
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white/60 rounded-xl border border-emerald-100 p-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-800">Retention cadence is on track!</span>{' '}
            Solved problems will reappear automatically when review intervals (1, 3, 7, 14, 30 days) are reached.
          </div>
        </div>
      )}

      {/* Cadence Visualizer */}
      <div className="pt-2 border-t border-indigo-100/60">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-600">Spaced Repetition Milestones:</span>
          <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] font-medium">
            {intervals.map((days, idx) => (
              <span key={idx} className="flex items-center gap-1 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                +{days}d
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacedRepetitionReminder;
