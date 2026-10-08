// frontend/src/components/Leaderboard/UserBadgesPanel.jsx
import React from 'react';
import {
  Award,
  Mic,
  Code2,
  Flame,
  DollarSign,
  Zap,
  Briefcase,
  Clock,
  CheckCircle2,
  Heart,
  Lock,
  Sparkles
} from 'lucide-react';

const ICON_MAP = {
  Mic,
  Code2,
  Flame,
  Award,
  DollarSign,
  Zap,
  Briefcase,
  Clock,
  CheckCircle2,
  Heart
};

const RARITY_STYLES = {
  Common: {
    bg: 'from-slate-100 to-slate-200 text-slate-800 border-slate-300',
    tag: 'bg-slate-200 text-slate-800',
    glow: 'border-slate-200'
  },
  Uncommon: {
    bg: 'from-emerald-50 to-teal-100 text-emerald-900 border-emerald-300',
    tag: 'bg-emerald-200 text-emerald-900',
    glow: 'border-emerald-300 shadow-emerald-100'
  },
  Rare: {
    bg: 'from-blue-50 to-indigo-100 text-indigo-900 border-indigo-300',
    tag: 'bg-indigo-200 text-indigo-900',
    glow: 'border-indigo-300 shadow-indigo-100'
  },
  'Very Rare': {
    bg: 'from-amber-100 to-yellow-200 text-amber-950 border-amber-400',
    tag: 'bg-amber-300 text-amber-950',
    glow: 'border-amber-400 shadow-amber-200'
  }
};

export const UserBadgesPanel = ({ badges = [], earnedCount = 0 }) => {
  const earnedBadges = badges.filter((b) => b.isEarned);
  const lockedBadges = badges.filter((b) => !b.isEarned);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-900">Achievement Badges</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Earn prestigious badges by crushing mock interviews, solving algorithms, and hitting milestones.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-xs">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>
            {earnedBadges.length} of {badges.length} Unlocked
          </span>
        </div>
      </div>

      {/* Earned Badges Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Your Unlocked Badges ({earnedBadges.length})
        </h4>

        {earnedBadges.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
            No badges unlocked yet. Complete a mock interview or log coding problems to earn your first badge!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => {
              const IconComp = ICON_MAP[badge.icon] || Award;
              const style = RARITY_STYLES[badge.rarity] || RARITY_STYLES.Common;

              return (
                <div
                  key={badge.type}
                  className={`relative p-5 rounded-2xl border bg-gradient-to-b ${style.bg} ${style.glow} shadow-sm flex flex-col justify-between transition-transform hover:-translate-y-0.5`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-slate-900">
                        <IconComp className="w-6 h-6 text-amber-500" />
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${style.tag}`}>
                        {badge.rarity}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-sm font-black text-slate-900 tracking-tight">
                        {badge.name}
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/5 flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>+{badge.points} pts</span>
                    <span className="text-[10px] text-slate-500">
                      {badge.earnedDate ? new Date(badge.earnedDate).toLocaleDateString() : 'Unlocked'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Badges to Unlock Section */}
      {lockedBadges.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Next Badges to Unlock ({lockedBadges.length})
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedBadges.map((badge) => {
              const IconComp = ICON_MAP[badge.icon] || Award;
              const progressPct = badge.progressPercentage || 0;

              return (
                <div
                  key={badge.type}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-200/80 px-2 py-0.5 rounded-full">
                      {badge.rarity}
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{badge.name}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>Progress</span>
                      <span>
                        {badge.currentProgress || 0} / {badge.target}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBadgesPanel;
