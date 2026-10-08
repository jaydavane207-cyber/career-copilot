// frontend/src/components/Achievements/AchievementsPanel.jsx
import React from 'react';
import { CheckCircle2, Clock, Lock, Sparkles, Award, Target, Trophy } from 'lucide-react';

export const AchievementsPanel = ({ achievements = [] }) => {
  const completed = achievements.filter((a) => a.status === 'completed');
  const inProgress = achievements.filter((a) => a.status !== 'completed');

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-black text-slate-900">Career Achievements</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete milestones across interview preparation, consistency, and negotiations to collect points.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-extrabold text-xs">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>
            {completed.length} of {achievements.length} Completed
          </span>
        </div>
      </div>

      {/* In-Progress Section */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
          In-Progress Goals ({inProgress.length})
        </h4>

        {inProgress.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 font-medium">
            All current achievements completed! Check back as new community goals are introduced.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgress.map((ach) => (
              <div
                key={ach.type}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{ach.name}</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 flex-shrink-0">
                    +{ach.points} pts
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate-600">
                    <span>Current Progress</span>
                    <span>
                      {ach.currentProgress} / {ach.target}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${ach.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Section */}
      {completed.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Completed Achievements ({completed.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((ach) => (
              <div
                key={ach.type}
                className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{ach.name}</h5>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 flex-shrink-0">
                    +{ach.points} pts
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] font-bold text-emerald-700 pt-1">
                  <span>Goal Achieved!</span>
                  <span>{ach.earnedDate ? new Date(ach.earnedDate).toLocaleDateString() : 'Completed'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsPanel;
