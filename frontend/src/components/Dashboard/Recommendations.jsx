// frontend/src/components/Dashboard/Recommendations.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

export const Recommendations = ({ recommendations = [], targetRole = 'Developer' }) => {
  // Default recommendations matching the prompt specifications if none passed
  const items = (Array.isArray(recommendations) && recommendations.length > 0)
    ? recommendations
    : [
        {
          id: 'rec-1',
          text: "You're weak in System Design - practice 3 more interviews",
          type: 'interview',
          actionUrl: '/mock-interview',
          badge: 'Interview Alert'
        },
        {
          id: 'rec-2',
          text: 'Binary Trees success rate is 60% - review basics',
          type: 'coding',
          actionUrl: '/coding',
          badge: 'Coding Focus'
        },
        {
          id: 'rec-3',
          text: 'Job application pipeline: 5 applied, 1 interview - follow up!',
          type: 'jobs',
          actionUrl: '/jobs',
          badge: 'Pipeline Tip'
        }
      ];

  const getCardStyle = (type) => {
    switch (type) {
      case 'interview':
        return {
          icon: Brain,
          badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
          cta: 'Practice Mock Interview'
        };
      case 'coding':
        return {
          icon: AlertTriangle,
          badge: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
          cta: 'Review Problems'
        };
      case 'jobs':
        return {
          icon: TrendingUp,
          badge: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
          cta: 'Manage Pipeline'
        };
      default:
        return {
          icon: Sparkles,
          badge: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30',
          cta: 'Take Action'
        };
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-5 border border-indigo-900/50">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 backdrop-blur-xs">
            <Sparkles className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-base font-bold tracking-tight text-white">
              Recommended Actions Widget
            </h3>
            <p className="text-xs text-indigo-200/80 mt-0.5">
              Personalized AI strategic insights for {targetRole}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-indigo-200 px-3 py-1 rounded-full border border-white/10">
          Smart Diagnostics
        </span>
      </div>

      {/* Grid of Recommended Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, idx) => {
          const style = getCardStyle(item.type);
          const Icon = style.icon;

          return (
            <div
              key={item.id || idx}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-1.5 rounded-lg bg-white/10 text-indigo-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                    {item.badge || 'Action Tip'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-100 leading-relaxed group-hover:text-white transition-colors">
                  "{item.text}"
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <Link
                  to={item.actionUrl || '/dashboard'}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white transition-colors group-hover:translate-x-0.5 transform duration-150"
                >
                  <span>{style.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Recommendations;
