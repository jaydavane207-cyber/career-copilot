// frontend/src/components/Analytics/SkillsChart.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowUpDown, Award, Zap, DollarSign } from 'lucide-react';

export const SkillsChart = ({ skillsData, onPracticeSkill }) => {
  const [sortBy, setSortBy] = useState('success_rate'); // 'success_rate' | 'weakest' | 'most_improved'

  const rawSkills = skillsData?.skills || [];

  // Sort logic
  const sortedSkills = [...rawSkills].sort((a, b) => {
    if (sortBy === 'weakest') {
      return a.success_rate - b.success_rate;
    }
    if (sortBy === 'most_improved') {
      return b.vs_platform_avg - a.vs_platform_avg;
    }
    return b.success_rate - a.success_rate;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Skill Performance & Platform Benchmarks</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare your evaluated proficiency and test outcomes against platform standards
          </p>
        </div>

        {/* Sort Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort By:</span>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setSortBy('success_rate')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'success_rate'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Highest
            </button>
            <button
              onClick={() => setSortBy('weakest')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'weakest'
                  ? 'bg-white text-rose-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weakest
            </button>
            <button
              onClick={() => setSortBy('most_improved')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                sortBy === 'most_improved'
                  ? 'bg-white text-emerald-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Top Growth
            </button>
          </div>
        </div>
      </div>

      {/* Summary Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Top Performing Skill</span>
          <p className="text-sm font-bold text-emerald-950 mt-1 truncate">
            {skillsData?.top_skill || 'React (85% success)'}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium">Ready for Tier 1 technical interviews</span>
        </div>

        <div className="p-3.5 bg-rose-50/60 border border-rose-200/80 rounded-xl">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Critical Weakness</span>
          <p className="text-sm font-bold text-rose-950 mt-1 truncate">
            {skillsData?.weakest_skill || 'System Design (45% success)'}
          </p>
          <span className="text-[11px] text-rose-700 font-medium">Recommended: 40 hrs practice</span>
        </div>

        <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-xl">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">Fastest Momentum</span>
          <p className="text-sm font-bold text-indigo-950 mt-1 truncate">
            {skillsData?.most_improved || 'JavaScript (+20% in 2 weeks)'}
          </p>
          <span className="text-[11px] text-indigo-700 font-medium">High retention rate on spaced repetition</span>
        </div>
      </div>

      {/* Comparative Legend */}
      <div className="flex items-center justify-end gap-5 text-xs text-slate-500 font-medium pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600"></span>
          <span>Your Success Rate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-slate-300"></span>
          <span>Platform Average</span>
        </div>
      </div>

      {/* Comparative Skill Rows */}
      <div className="space-y-4">
        {sortedSkills.map((item) => {
          const isAbove = item.vs_platform_avg >= 0;
          const diffAbs = Math.abs(item.vs_platform_avg || 0);

          return (
            <div
              key={item.skill}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all bg-white"
            >
              {/* Skill Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base">{item.skill}</span>
                  <span className="text-xs text-slate-400">
                    ({item.practice_count} attempts · {item.practice_hours} hrs)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Trend Indicator */}
                  <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                    isAbove
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="w-3.5 h-3.5" />
                    ) : (
                      <Minus className="w-3.5 h-3.5" />
                    )}
                    <span>{isAbove ? `+${diffAbs}%` : `-${diffAbs}%`} vs avg</span>
                  </div>

                  {/* Estimated Salary Impact */}
                  {item.estimated_salary_impact > 0 && (
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md hidden sm:inline">
                      +${item.estimated_salary_impact.toLocaleString()} salary impact
                    </span>
                  )}
                </div>
              </div>

              {/* Comparative Dual Bars */}
              <div className="space-y-1.5">
                {/* User Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-slate-500 w-16">You:</span>
                  <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAbove ? 'bg-blue-600' : 'bg-rose-500'
                      }`}
                      style={{ width: `${item.success_rate}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 w-12 text-right">
                    {item.success_rate}%
                  </span>
                </div>

                {/* Platform Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-medium text-slate-400 w-16">Platform:</span>
                  <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-300 rounded-full transition-all duration-500"
                      style={{ width: `${item.platform_avg_success}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 w-12 text-right">
                    {item.platform_avg_success}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsChart;
