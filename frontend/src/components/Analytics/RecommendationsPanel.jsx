// frontend/src/components/Analytics/RecommendationsPanel.jsx
import React from 'react';
import { Lightbulb, ArrowRight, Clock, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RecommendationsPanel = ({ recommendations = [], onActionClick }) => {
  const navigate = useNavigate();

  const handleStart = (rec) => {
    if (onActionClick) {
      onActionClick(rec);
      return;
    }
    // Default smart routing based on recommendation title
    const t = (rec.title || '').toLowerCase();
    if (t.includes('technical') || t.includes('coding')) {
      navigate('/coding');
    } else if (t.includes('system design') || t.includes('interview')) {
      navigate('/mock-interview');
    } else if (t.includes('application') || t.includes('velocity')) {
      navigate('/jobs');
    } else if (t.includes('negotiat') || t.includes('salary')) {
      navigate('/company-prep');
    } else {
      navigate('/study-plan');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Data-Driven Career Recommendations</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Algorithmic action plans prioritized to maximize offer conversion and compensation gains
          </p>
        </div>

        <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
          {recommendations.length} High-Impact Actions
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec) => {
          const isP1 = rec.priority === 1;

          return (
            <div
              key={rec.priority}
              className={`p-5 rounded-xl border transition-all ${
                isP1
                  ? 'border-rose-300 bg-rose-50/20 hover:border-rose-400 hover:shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  {/* Priority Number Badge */}
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold flex-shrink-0 ${
                    isP1
                      ? 'bg-rose-600 text-white shadow-xs'
                      : rec.priority === 2
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                  }`}>
                    #{rec.priority}
                  </span>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{rec.title}</h4>
                      {rec.badge && (
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${rec.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                          {rec.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{rec.reason}</p>
                  </div>
                </div>

                {/* Impact Pill */}
                <div className="bg-emerald-50 border border-emerald-200/80 rounded-lg px-3 py-1.5 text-right self-start sm:self-auto flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Projected Impact</span>
                  <span className="text-xs font-extrabold text-emerald-800">{rec.estimated_impact}</span>
                </div>
              </div>

              {/* Action Plan & Details Box */}
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200/70 text-xs space-y-2 mt-3">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-slate-700 flex-shrink-0">Action Plan:</span>
                  <span className="text-slate-600">{rec.action}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/50 text-[11px] text-slate-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {rec.timeline} ({rec.hours_required} hrs)
                    </span>
                    {rec.success_probability && (
                      <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                        <Target className="w-3.5 h-3.5" />
                        {rec.success_probability}% success probability
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleStart(rec)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition-colors shadow-xs"
                  >
                    Start Plan
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendationsPanel;
