// frontend/src/components/CodingTracker/StatsCards.jsx
import React from 'react';
import { Code2, CheckCircle2, RotateCcw, Flame } from 'lucide-react';

export const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { label: 'Total Solved', value: stats.solved || 0, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Needs Review', value: stats.review || 0, icon: RotateCcw, color: 'text-amber-600 bg-amber-50' },
    { label: 'Easy Solved', value: stats.difficultyCounts?.Easy || 0, icon: Code2, color: 'text-teal-600 bg-teal-50' },
    { label: 'Medium Solved', value: stats.difficultyCounts?.Medium || 0, icon: Code2, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Hard Solved', value: stats.difficultyCounts?.Hard || 0, icon: Flame, color: 'text-rose-600 bg-rose-50' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${c.color} flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{c.label}</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">{c.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
