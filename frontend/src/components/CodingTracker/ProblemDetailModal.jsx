// frontend/src/components/CodingTracker/ProblemDetailModal.jsx
import React from 'react';
import {
  X,
  Clock,
  Star,
  CheckCircle2,
  HelpCircle,
  Calendar,
  RotateCcw,
  ExternalLink,
  Tag,
  Flame,
  Brain
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { getDifficultyBadge } from '../../utils/helpers';

export const ProblemDetailModal = ({
  problem,
  isOpen,
  onClose,
  onReview
}) => {
  if (!isOpen || !problem) return null;

  const ratingLabels = {
    1: 'Failed / Complete struggle',
    2: 'Needed significant hints',
    3: 'Struggled but solved',
    4: 'Solved with minor hesitation',
    5: 'Solved easily & optimally'
  };

  const isDue = problem.isDue;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-scale-up">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getDifficultyBadge(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200/70 text-slate-700">
                {problem.topic}
              </span>
              {problem.platform && (
                <span className="text-[10px] font-medium text-slate-400">
                  {problem.platform}
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {problem.problemName || problem.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                <Clock className="w-3.5 h-3.5" />
                Time Spent
              </div>
              <p className="text-sm font-bold text-slate-800">{problem.timeTaken} mins</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                {problem.solved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                )}
                Outcome
              </div>
              <p className={`text-sm font-bold ${problem.solved ? 'text-emerald-700' : 'text-amber-700'}`}>
                {problem.solved ? 'Solved' : 'Needs Practice'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold mb-1">
                <Calendar className="w-3.5 h-3.5" />
                Practiced On
              </div>
              <p className="text-sm font-bold text-slate-800">{formatDate(problem.date)}</p>
            </div>
          </div>

          {/* Self-Rating Rating Bar */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Self Rating</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= (problem.selfRating || 3)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {ratingLabels[problem.selfRating || 3]}
            </p>
          </div>

          {/* Notes & Solution Approach */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Solution Approach & Notes
            </h4>
            {problem.notes ? (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 whitespace-pre-wrap leading-relaxed font-mono">
                {problem.notes}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No notes logged for this problem.</p>
            )}
          </div>

          {/* Spaced Repetition Timeline */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-indigo-600" />
                <h4 className="text-xs font-bold text-indigo-950">Spaced Repetition Retention</h4>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isDue
                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                  : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {isDue
                  ? problem.daysOverdue > 0
                    ? `Overdue by ${problem.daysOverdue}d`
                    : 'Due for review today'
                  : 'On Schedule'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 text-xs text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Current Stage:</span>
                <span className="font-semibold text-slate-800">
                  Stage {(problem.reviewStage || 0) + 1} ({problem.intervalDays || 1}d interval)
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Next Review Due:</span>
                <span className="font-semibold text-slate-800">
                  {formatDate(problem.nextReviewDate)}
                </span>
              </div>
            </div>

            {problem.lastReviewedAt && (
              <p className="text-[10px] text-slate-400 pt-1">
                Last reviewed on {formatDate(problem.lastReviewedAt)}
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            Close
          </button>

          {onReview && (
            <button
              type="button"
              onClick={() => {
                onReview(problem.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Mark as Reviewed
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailModal;
