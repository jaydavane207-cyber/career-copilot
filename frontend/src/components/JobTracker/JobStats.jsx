// frontend/src/components/JobTracker/JobStats.jsx
import React from 'react';
import { Briefcase, CalendarCheck2, Trophy, TrendingUp, Clock } from 'lucide-react';

export const JobStats = ({ stats }) => {
  const totalApplied = stats?.totalApplied ?? stats?.total ?? 0;
  const inInterview = stats?.inInterview ?? stats?.interview ?? 0;
  const offers = stats?.offers ?? stats?.offer ?? 0;
  const conversionRate = stats?.conversionRate ?? 0;
  const avgDays = stats?.avgDaysBetweenStages ?? stats?.averageDaysBetweenStages ?? 0;

  const statCards = [
    {
      id: 'total-applied',
      label: 'Total applied',
      value: totalApplied,
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      description: 'Active tracked applications'
    },
    {
      id: 'in-interview',
      label: 'In interview',
      value: inInterview,
      icon: CalendarCheck2,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      description: 'Technical rounds & screens'
    },
    {
      id: 'offers',
      label: 'Offers',
      value: offers,
      icon: Trophy,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      description: 'Formal job offers received'
    },
    {
      id: 'conversion-rate',
      label: 'Conversion rate',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      description: 'Applications converted to interviews'
    },
    {
      id: 'avg-days',
      label: 'Avg Days Between Stages',
      value: `${avgDays} d`,
      icon: Clock,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      description: 'Application to interview velocity'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500 tracking-tight">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl border ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobStats;
