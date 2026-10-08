// frontend/src/components/Analytics/MarketTrendsChart.jsx
import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Search, Check, Plus, Flame, Sparkles } from 'lucide-react';

export const MarketTrendsChart = ({ marketData = [], userSkills = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'in_stack' | 'missing'

  // Extract set of user's skill names
  const userSkillNames = new Set(
    (userSkills || []).map(s => (s.skill || s.skillName || '').toLowerCase().trim())
  );

  const filtered = (marketData || []).filter(item => {
    const matchesSearch = item.skill.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    const hasSkill = userSkillNames.has(item.skill.toLowerCase().trim());
    if (filterType === 'in_stack') return hasSkill;
    if (filterType === 'missing') return !hasSkill;
    return true;
  });

  const maxCount = marketData.length > 0 ? marketData[0].job_count : 2500;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Market Skill Demand & Salary Premiums</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time scraping intelligence across active tech postings and compensation premiums
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search skill or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 w-44 sm:w-52"
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filterType === 'all' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Skills
            </button>
            <button
              onClick={() => setFilterType('in_stack')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filterType === 'in_stack' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In My Stack
            </button>
            <button
              onClick={() => setFilterType('missing')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                filterType === 'missing' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missing Gaps
            </button>
          </div>
        </div>
      </div>

      {/* Skill Demand List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {filtered.map((item, idx) => {
          const hasSkill = userSkillNames.has(item.skill.toLowerCase().trim());
          const widthPct = Math.max(12, Math.round((item.job_count / maxCount) * 100));
          const isUp = item.trend && item.trend.includes('up');
          const isDown = item.trend && item.trend.includes('down');

          return (
            <div
              key={item.skill}
              className={`p-3.5 rounded-xl border transition-all ${
                hasSkill
                  ? 'border-slate-200 bg-white hover:border-emerald-300'
                  : 'border-slate-200/90 bg-slate-50/40 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-400 w-5">#{idx + 1}</span>
                  <span className="font-bold text-slate-900 text-sm">{item.skill}</span>
                  {item.category && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  )}

                  {/* Status Badge */}
                  {hasSkill ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />
                      In Your Profile
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Skill Gap
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* Job Posting Count */}
                  <span className="text-xs font-bold text-slate-700">
                    {item.job_count.toLocaleString()} postings
                  </span>

                  {/* Trend Indicator */}
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
                    isUp ? 'text-emerald-700 bg-emerald-50' : isDown ? 'text-rose-700 bg-rose-50' : 'text-slate-600 bg-slate-100'
                  }`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : isDown ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                    {item.trend}
                  </span>

                  {/* Salary Premium */}
                  {item.salary_premium > 0 && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      +${(item.salary_premium / 1000).toFixed(0)}k premium
                    </span>
                  )}
                </div>
              </div>

              {/* Demand Bar */}
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    hasSkill ? 'bg-indigo-600' : 'bg-slate-400'
                  }`}
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-slate-400 text-xs">
            No market skills match your search filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTrendsChart;
