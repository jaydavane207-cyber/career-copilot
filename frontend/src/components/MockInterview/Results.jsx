// frontend/src/components/MockInterview/Results.jsx
import React from 'react';
import { Award, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

export const Results = ({ result, onRestart }) => {
  if (!result) return null;

  const score = result.overallScore || 0;
  const badgeColor = score >= 75 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : score >= 50 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-rose-600 bg-rose-50 border-rose-200';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Evaluation Scorecard</span>
          <h3 className="text-xl font-bold text-slate-900">{result.role} • {result.interviewType}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{result.feedbackSummary}</p>
        </div>

        <div className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border ${badgeColor}`}>
          <Award className="w-6 h-6 flex-shrink-0" />
          <div className="text-right">
            <span className="text-2xl font-black">{formatPercentage(score)}</span>
            <span className="block text-[10px] font-bold uppercase tracking-wider opacity-75">Interview Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Observed Strengths</h4>
          </div>
          <ul className="text-xs text-emerald-900 space-y-1">
            {result.strengths && result.strengths.length > 0 ? (
              result.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-500">Good attempt across questions.</li>
            )}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Areas for Improvement</h4>
          </div>
          <ul className="text-xs text-amber-900 space-y-1">
            {result.areasForImprovement && result.areasForImprovement.length > 0 ? (
              result.areasForImprovement.map((a, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-bold">•</span>
                  <span>{a}</span>
                </li>
              ))
            ) : (
              <li className="italic text-slate-500">Continue refining speed and concise delivery.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Answer Breakdowns */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Per-Question Feedback</h4>
        {result.questions?.map((q, idx) => (
          <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Q{idx + 1}: {q.question}</span>
              <span className="font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                {q.score || 0}%
              </span>
            </div>
            {q.userResponse && (
              <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                "{q.userResponse}"
              </p>
            )}
            <p className="text-[11px] text-indigo-700 font-medium">{q.feedback}</p>
          </div>
        ))}
      </div>

      <div className="pt-2 text-right">
        <button onClick={onRestart} className="btn-primary text-xs">
          <RotateCcw className="w-3.5 h-3.5" />
          Start Another Mock Session
        </button>
      </div>
    </div>
  );
};

export default Results;
