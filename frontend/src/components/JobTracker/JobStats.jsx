// frontend/src/components/JobTracker/JobStats.jsx
import React from 'react';
import { Briefcase, CalendarCheck2, Trophy, TrendingUp } from 'lucide-react';

export const JobStats = ({ stats }) => {
  const totalApplied = stats?.totalApplied ?? stats?.total ?? 0;
  const inInterview = stats?.inInterview ?? stats?.interview ?? 0;
  const offers = stats?.offers ?? stats?.offer ?? 0;
  const conversionRate = stats?.conversionRate ?? (totalApplied > 0 ? Math.round((inInterview / totalApplied) * 100) : 0);

  const statCards = [
    {
      id: 'total-applied',
      label: 'Total Applied',
      value: totalApplied,
      icon: Briefcase,
      color: 'text-[#3B82F6] bg-[#EBF5FF]',
      description: 'Active tracked applications'
    },
    {
      id: 'interviews',
      label: 'Interviews',
      value: inInterview,
      icon: CalendarCheck2,
      color: 'text-[#F59E0B] bg-[#FEF3C7]',
      description: 'Scheduled rounds & tests'
    },
    {
      id: 'offers',
      label: 'Offers',
      value: offers,
      icon: Trophy,
      color: 'text-[#10B981] bg-[#D1FAE5]',
      description: 'Job offers received'
    },
    {
      id: 'conversion',
      label: 'Conversion %',
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: 'text-[#8B5CF6] bg-[#F5F3FF]',
      description: 'Application to interview rate'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-white rounded-[12px] border border-[#E5E7EB] p-[20px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex items-center justify-between"
          >
            <div>
              <span className="text-[14px] font-semibold text-[#6B7280]">
                {card.label}
              </span>
              <div className="text-[28px] font-bold text-[#111827] tracking-[-0.5px] mt-1">
                {card.value}
              </div>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5 truncate">
                {card.description}
              </p>
            </div>
            <div className={`w-[48px] h-[48px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${card.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JobStats;
