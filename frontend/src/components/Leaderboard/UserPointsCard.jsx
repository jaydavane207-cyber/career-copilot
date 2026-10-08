// frontend/src/components/Leaderboard/UserPointsCard.jsx
import React from 'react';
import { Trophy, TrendingUp, Award, CheckCircle, MessageSquare, Code2, Sparkles } from 'lucide-react';

export const UserPointsCard = ({ pointsData }) => {
  if (!pointsData) return null;

  const {
    points = 0,
    level = 1,
    title = 'Novice Aspirant',
    next_level_points = 200,
    points_needed = 0,
    progress_percentage = 0,
    breakdown = {}
  } = pointsData;

  const breakdownItems = [
    {
      label: 'Badges Earned',
      value: breakdown.badges || 0,
      icon: Award,
      color: 'text-amber-600 bg-amber-50'
    },
    {
      label: 'Achievements',
      value: breakdown.achievements || 0,
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      label: 'Story Engagement',
      value: breakdown.storyEngagement || 0,
      icon: Trophy,
      color: 'text-emerald-600 bg-emerald-50'
    },
    {
      label: 'Community & Helpful',
      value: breakdown.helpfulCommunity || 0,
      icon: MessageSquare,
      color: 'text-indigo-600 bg-indigo-50'
    },
    {
      label: 'Practice Activities',
      value: breakdown.activities || 0,
      icon: Code2,
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              Career Copilot Ranking Status
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Level {level}:</span>
            <span className="text-yellow-400">{title}</span>
          </h3>
        </div>

        <div className="sm:text-right">
          <div className="text-2xl sm:text-3xl font-black text-amber-400">
            {points.toLocaleString()} <span className="text-xs text-amber-200 font-bold">PTS</span>
          </div>
          <p className="text-[11px] text-slate-300 font-medium">
            {points_needed > 0
              ? `${points_needed.toLocaleString()} pts to Level ${level + 1}`
              : 'Maximum Level Reached! 👑'}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold text-slate-300">
          <span>Level {level} Progress</span>
          <span>{progress_percentage}%</span>
        </div>
        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 backdrop-blur-xs">
          <div
            className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${progress_percentage}%` }}
          />
        </div>
      </div>

      {/* Points Breakdown Grid */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          <span>Points Contribution Breakdown</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {breakdownItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white/5 border border-white/10 p-3 rounded-2xl space-y-1.5"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300 truncate">
                    {item.label}
                  </span>
                </div>
                <div className="text-base font-black text-white pl-0.5">
                  {item.value} <span className="text-[10px] text-slate-400 font-bold">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserPointsCard;
