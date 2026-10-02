// frontend/src/components/Dashboard/NextSteps.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react';

export const NextSteps = ({ nextSteps = [] }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">Recommended Action Steps</h4>
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
          Personalized
        </span>
      </div>

      <div className="space-y-2.5">
        {nextSteps && nextSteps.length > 0 ? (
          nextSteps.map((step) => (
            <Link
              key={step.id}
              to={step.actionUrl}
              className="p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {step.title}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${step.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                    {step.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{step.description}</p>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic text-center py-4">All preparation goals up to date!</p>
        )}
      </div>
    </div>
  );
};

export default NextSteps;
