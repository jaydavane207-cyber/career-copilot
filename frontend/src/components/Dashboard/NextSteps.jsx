// frontend/src/components/Dashboard/NextSteps.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Mic,
  FileText,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';

const iconMap = {
  BookOpen,
  Code2,
  Mic,
  FileText,
  Send,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap
};

export const NextSteps = ({ nextSteps = [], nextActions = [] }) => {
  // If only raw string nextActions were passed, convert to standard step objects
  let steps = [];
  if (Array.isArray(nextSteps) && nextSteps.length > 0) {
    steps = nextSteps;
  } else if (Array.isArray(nextActions) && nextActions.length > 0) {
    steps = nextActions.map((action, idx) => {
      let icon = 'CheckCircle2';
      let link = '/dashboard';
      let buttonText = 'Go to Action';

      const lower = action.toLowerCase();
      if (lower.includes('study plan') || lower.includes('study')) {
        icon = 'BookOpen';
        link = '/study-plan';
        buttonText = 'Go to Study Plan';
      } else if (lower.includes('question') || lower.includes('coding') || lower.includes('problem')) {
        icon = 'Code2';
        link = '/coding';
        buttonText = 'Go to Coding Tracker';
      } else if (lower.includes('interview')) {
        icon = 'Mic';
        link = '/mock-interview';
        buttonText = 'Go to Mock Interview';
      } else if (lower.includes('resume')) {
        icon = 'FileText';
        link = '/resume';
        buttonText = 'Go to Resume Analyzer';
      } else if (lower.includes('apply') || lower.includes('job')) {
        icon = 'Send';
        link = '/jobs';
        buttonText = 'Go to Job Tracker';
      }

      return {
        id: `step-${idx}`,
        title: action,
        action,
        description: 'Recommended actionable milestone based on your target role.',
        icon,
        link,
        buttonText,
        progress: 40,
        priority: idx === 0 ? 'High' : 'Medium'
      };
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Prioritized Next Steps
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Targeted actions to increase your overall readiness to "Ready!" (67%+)
          </p>
        </div>

        <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
          {steps.length} Actions
        </span>
      </div>

      <div className="space-y-3">
        {steps.length > 0 ? (
          steps.map((step, idx) => {
            const IconComponent = iconMap[step.icon] || CheckCircle2;
            const priorityBadge =
              step.priority === 'High'
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200';

            const progressVal = typeof step.progress === 'number' ? step.progress : 0;

            return (
              <div
                key={step.id || idx}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center flex-shrink-0 transition-colors shadow-2xs mt-0.5 sm:mt-0">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {step.title || step.action}
                      </span>
                      {step.priority && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                          {step.priority} Priority
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-1">
                      {step.description}
                    </p>

                    {/* Progress Indicator */}
                    <div className="flex items-center gap-2.5 pt-1 max-w-xs">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(5, progressVal))}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {progressVal}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* "Go to..." Button */}
                <div className="w-full sm:w-auto flex-shrink-0">
                  <Link
                    to={step.link || '/dashboard'}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all group-hover:scale-102"
                  >
                    <span>{step.buttonText || 'Go to Feature'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">All key preparation steps up to date!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Explore mock interviews or track job opportunities.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NextSteps;
