// frontend/src/components/Dashboard/MetricsCards.jsx
import React from 'react';
import { Send, Users, Code2, CalendarCheck } from 'lucide-react';
import { formatPercentage } from '../../utils/formatters';

export const MetricsCards = ({ metrics }) => {
  if (!metrics) return null;

  const cards = [
    { label: 'Active Applications', value: metrics.appliedJobs || 0, icon: Send, color: 'text-blue-600 bg-blue-50' },
    { label: 'Interviews Scheduled', value: metrics.activeInterviews || 0, icon: Users, color: 'text-amber-600 bg-amber-50' },
    { label: 'Coding Problems Solved', value: metrics.codingProblemsSolved || 0, icon: Code2, color: 'text-purple-600 bg-purple-50' },
    { label: 'Study Plan Progress', value: formatPercentage(metrics.activeStudyPlanProgress || 0), icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3.5">
            <div className={`p-3 rounded-xl ${card.color} flex-shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
              <h4 className="text-xl font-bold text-slate-900 mt-0.5">{card.value}</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricsCards;
