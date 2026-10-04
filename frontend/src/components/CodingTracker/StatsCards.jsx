// frontend/src/components/CodingTracker/StatsCards.jsx
import React from 'react';
import { Code2, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export const StatsCards = ({ stats }) => {
  const totalProblems = stats?.totalProblems ?? stats?.total ?? 0;
  const totalSolved = stats?.totalSolved ?? stats?.solved ?? 0;
  const successRate = stats?.successRate ?? (totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0);
  const weakTopicsCount = stats?.weakTopicsCount ?? (stats?.weakTopics ? stats.weakTopics.length : 0);
  const averageTime = stats?.averageTime ?? 25;

  const cards = [
    {
      id: 'stat-total',
      title: 'Total Problems',
      value: totalProblems,
      subtext: `${totalSolved} solved successfully`,
      icon: Code2,
      iconColor: 'bg-[#EBF5FF] text-[#3B82F6]' // Blue icon
    },
    {
      id: 'stat-rate',
      title: 'Success Rate',
      value: `${successRate}%`,
      subtext: successRate >= 70 ? 'Target achieved (≥70%)' : 'Aim for >70% target',
      icon: CheckCircle2,
      iconColor: 'bg-[#D1FAE5] text-[#10B981]' // Green icon
    },
    {
      id: 'stat-weak',
      title: 'Weak Topics',
      value: weakTopicsCount,
      subtext: weakTopicsCount === 0 ? 'All topics >70%' : 'Need deliberate review',
      icon: AlertTriangle,
      iconColor: 'bg-[#FEF2F2] text-[#EF4444]' // Red icon
    },
    {
      id: 'stat-time',
      title: 'Avg Time',
      value: `${averageTime}m`,
      subtext: 'Average minutes per problem',
      icon: Clock,
      iconColor: 'bg-[#F5F3FF] text-[#8B5CF6]' // Purple icon
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] mb-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            className="bg-white rounded-[12px] border border-[#E5E7EB] p-[24px] shadow-[0_1px_3px_rgba(0,0,0,0.1)] flex items-center justify-between"
          >
            <div>
              <p className="text-[14px] font-semibold text-[#6B7280]">
                {c.title}
              </p>
              <h3 className="text-[32px] font-bold text-[#111827] tracking-[-0.5px] mt-1">
                {c.value}
              </h3>
              <p className="text-[12px] text-[#6B7280] mt-0.5">
                {c.subtext}
              </p>
            </div>
            <div className={`w-[52px] h-[52px] rounded-[10px] flex items-center justify-center flex-shrink-0 ${c.iconColor}`}>
              <Icon className="w-7 h-7" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
