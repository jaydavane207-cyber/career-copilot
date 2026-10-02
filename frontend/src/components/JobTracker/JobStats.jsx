// frontend/src/components/JobTracker/JobStats.jsx
import React from 'react';
import { Briefcase, Send, CheckCircle2, Trophy, Percent } from 'lucide-react';

export const JobStats = ({ stats }) => {
  if (!stats) return null;

  const statCards = [
    { label: 'Total Tracked', value: stats.total || 0, icon: Briefcase, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Active Applications', value: (stats.applied || 0) + (stats.interviewing || 0), icon: Send, color: 'text-blue-600 bg-blue-50' },
    { label: 'Interviewing', value: stats.interviewing || 0, icon: CheckCircle2, color: 'text-amber-600 bg-amber-50' },
    { label: 'Offers Received', value: stats.offer || 0, icon: Trophy, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Response Rate', value: `${stats.responseRate || 0}%`, icon: Percent, color: 'text-purple-600 bg-purple-50' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${card.color} flex-shrink-0`}>
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

export default JobStats;
