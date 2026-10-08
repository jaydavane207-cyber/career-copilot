// frontend/src/components/Leaderboard/LeaderboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Award,
  TrendingUp,
  DollarSign,
  Briefcase,
  Flame,
  Code2,
  Mic,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  User,
  ShieldAlert
} from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';
import Avatar from '../UI/Avatar';
import UserBadgesPanel from './UserBadgesPanel';
import UserPointsCard from './UserPointsCard';
import AchievementsPanel from '../Achievements/AchievementsPanel';

const RANK_TABS = [
  { id: 'salary', label: 'Highest Salary Negotiated', icon: DollarSign, unit: 'Salary' },
  { id: 'offers', label: 'Most Job Offers', icon: Briefcase, unit: 'Offers' },
  { id: 'readiness', label: 'Best Readiness Score', icon: TrendingUp, unit: 'Readiness' },
  { id: 'mock_interviews', label: 'Most Mock Interviews', icon: Mic, unit: 'Mocks' },
  { id: 'coding', label: 'Most Coding Problems', icon: Code2, unit: 'Problems' },
  { id: 'streak', label: 'Best Study Streak', icon: Flame, unit: 'Streak' }
];

const PERIODS = [
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'all_time', label: 'All Time' }
];

export const LeaderboardPage = () => {
  const [activeRankType, setActiveRankType] = useState('salary');
  const [activePeriod, setActivePeriod] = useState('all_time');
  const [activeSubView, setActiveSubView] = useState('rankings'); // 'rankings', 'badges', 'achievements', 'points'

  const [leaderboard, setLeaderboard] = useState([]);
  const [userRankData, setUserRankData] = useState(null);
  const [badgesData, setBadgesData] = useState(null);
  const [achievementsData, setAchievementsData] = useState([]);
  const [pointsData, setPointsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [lRes, rRes, bRes, aRes, pRes] = await Promise.all([
        leaderboardService.getLeaderboard(activeRankType, activePeriod),
        leaderboardService.getUserRank(null, activeRankType),
        leaderboardService.getUserBadges(),
        leaderboardService.getUserAchievements(),
        leaderboardService.getUserPoints()
      ]);

      if (lRes?.success) setLeaderboard(lRes.leaderboard || []);
      if (rRes?.success) setUserRankData(rRes);
      if (bRes?.success) setBadgesData(bRes);
      if (aRes?.success) setAchievementsData(aRes.achievements || []);
      if (pRes?.success) setPointsData(pRes);
    } catch (err) {
      console.error('Failed to load leaderboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRankType, activePeriod]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Top 3 Podium
  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];

  const renderTrend = (trend = '→ 0') => {
    if (trend.includes('↑')) {
      return (
        <span className="inline-flex items-center gap-0.5 text-emerald-600 font-bold text-xs">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{trend.replace('↑', '').trim()}</span>
        </span>
      );
    } else if (trend.includes('↓')) {
      return (
        <span className="inline-flex items-center gap-0.5 text-rose-600 font-bold text-xs">
          <ArrowDownRight className="w-3.5 h-3.5" />
          <span>{trend.replace('↓', '').trim()}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-slate-400 font-bold text-xs">
        <Minus className="w-3 h-3" />
        <span>0</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black tracking-wide">
          <Trophy className="w-4 h-4 text-yellow-300" />
          <span>Community Hall of Fame</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Career Copilot Leaderboard
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 font-medium max-w-2xl leading-relaxed">
          See who's crushing interviews, negotiating life-changing packages, and maintaining unstoppable preparation streaks. Compete playfully and climb the ranks!
        </p>

        {/* View Switcher Pills */}
        <div className="pt-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubView('rankings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'rankings'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Rankings Board
          </button>
          <button
            onClick={() => setActiveSubView('badges')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'badges'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            My Badges ({badgesData?.earnedCount || 0})
          </button>
          <button
            onClick={() => setActiveSubView('achievements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'achievements'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Milestones & Goals
          </button>
          <button
            onClick={() => setActiveSubView('points')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeSubView === 'points'
                ? 'bg-white text-slate-900 shadow-md'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Level & Points ({pointsData?.points || 0} pts)
          </button>
        </div>
      </div>

      {activeSubView === 'badges' && (
        <UserBadgesPanel
          badges={badgesData?.badges || []}
          earnedCount={badgesData?.earnedCount || 0}
        />
      )}

      {activeSubView === 'achievements' && (
        <AchievementsPanel achievements={achievementsData} />
      )}

      {activeSubView === 'points' && (
        <UserPointsCard pointsData={pointsData} />
      )}

      {activeSubView === 'rankings' && (
        <div className="space-y-6">
          {/* Your Position Highlight Banner */}
          {userRankData && (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl p-5 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-400/40">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl text-yellow-300">
                  #{userRankData.rank || 14}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-200">
                      Your Current Standing
                    </span>
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                      {userRankData.percentile || 'Top 15%'}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-white mt-0.5">
                    Current Metric: {userRankData.value} ({userRankData.rank_change})
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right sm:block hidden">
                  <div className="text-xs text-blue-200 font-semibold">Total Candidates</div>
                  <div className="text-sm font-black text-white">
                    {userRankData.total_competitors || 480} Tracked
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubView('points')}
                  className="px-4 py-2 rounded-xl bg-white text-blue-700 font-black text-xs hover:bg-blue-50 transition-colors shadow-xs"
                >
                  View Level & Rewards
                </button>
              </div>
            </div>
          )}

          {/* Controls: Rank Type Tabs & Period Filter */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Leaderboard Category Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {RANK_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeRankType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveRankType(tab.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Period Selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
                {PERIODS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePeriod(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activePeriod === p.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Podium Top 3 Cards (Visual Hall of Fame) */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* 2nd Place Silver */}
              {top2 && (
                <div className="order-2 md:order-1 bg-gradient-to-b from-slate-100 to-slate-200/90 rounded-3xl p-6 border border-slate-300 text-center flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <span className="text-2xl font-black">🥈 2nd Place</span>
                    <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-3 border-slate-300 shadow-sm">
                      <img
                        src={top2.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'}
                        alt={top2.user_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{top2.user_name}</h4>
                      <p className="text-xs text-slate-600">
                        {top2.company} • {top2.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-300/80">
                    <div className="text-xl font-black text-slate-900">{top2.rank_value}</div>
                    <div className="text-[11px] text-slate-600 font-bold">{top2.points} points</div>
                  </div>
                </div>
              )}

              {/* 1st Place Gold (Elevated) */}
              {top1 && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-100 via-yellow-100 to-amber-200 rounded-3xl p-6 sm:p-7 border-2 border-amber-400 text-center flex flex-col justify-between shadow-md transform md:-translate-y-2">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow-xs">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Champion 🥇</span>
                    </div>
                    <div className="w-20 h-20 rounded-full mx-auto overflow-hidden border-4 border-amber-400 shadow-md">
                      <img
                        src={top1.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'}
                        alt={top1.user_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{top1.user_name}</h4>
                      <p className="text-xs text-slate-700 font-semibold">
                        {top1.company} • {top1.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-300">
                    <div className="text-2xl font-black text-amber-950">{top1.rank_value}</div>
                    <div className="text-xs text-amber-800 font-extrabold">{top1.points} total points</div>
                  </div>
                </div>
              )}

              {/* 3rd Place Bronze */}
              {top3 && (
                <div className="order-3 md:order-3 bg-gradient-to-b from-amber-50 to-orange-100 rounded-3xl p-6 border border-orange-200 text-center flex flex-col justify-between shadow-xs">
                  <div className="space-y-3">
                    <span className="text-2xl font-black">🥉 3rd Place</span>
                    <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-3 border-orange-200 shadow-sm">
                      <img
                        src={top3.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={top3.user_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-slate-900">{top3.user_name}</h4>
                      <p className="text-xs text-slate-600">
                        {top3.company} • {top3.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-orange-200">
                    <div className="text-xl font-black text-slate-900">{top3.rank_value}</div>
                    <div className="text-[11px] text-slate-600 font-bold">{top3.points} points</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900">
                All Ranked Aspirants ({leaderboard.length})
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                Live Daily Refresh
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Company & Target</th>
                    <th className="py-3.5 px-4 text-right">Metric Value</th>
                    <th className="py-3.5 px-4">Earned Badges</th>
                    <th className="py-3.5 px-4 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {leaderboard.map((entry, idx) => {
                    const isTop1 = entry.rank === 1;
                    const isTop2 = entry.rank === 2;
                    const isTop3 = entry.rank === 3;

                    return (
                      <tr
                        key={entry.id || idx}
                        className={`hover:bg-slate-50/80 transition-colors ${
                          entry.isCurrentUser ? 'bg-blue-50/80 font-bold' : ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isTop1 ? (
                              <span className="text-base">🥇</span>
                            ) : isTop2 ? (
                              <span className="text-base">🥈</span>
                            ) : isTop3 ? (
                              <span className="text-base">🥉</span>
                            ) : (
                              <span className="font-extrabold text-slate-600">#{entry.rank}</span>
                            )}
                            <div className="text-[10px]">{renderTrend(entry.rank_change)}</div>
                          </div>
                        </td>

                        {/* Candidate */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                              {entry.avatar ? (
                                <img
                                  src={entry.avatar}
                                  alt={entry.user_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-slate-600 text-xs">
                                  {entry.user_name?.charAt(0) || 'U'}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{entry.user_name}</span>
                                {entry.isCurrentUser && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-blue-600 text-white font-extrabold">
                                    YOU
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Company & Role */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800">{entry.company}</div>
                          <div className="text-[11px] text-slate-500">{entry.role}</div>
                        </td>

                        {/* Metric Value */}
                        <td className="py-4 px-4 text-right">
                          <span className="inline-block px-3 py-1 rounded-xl font-black text-xs bg-slate-100 text-slate-900 border border-slate-200">
                            {entry.rank_value}
                          </span>
                        </td>

                        {/* Badges */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {Array.isArray(entry.badges) &&
                              entry.badges.slice(0, 2).map((b, bIdx) => (
                                <span
                                  key={bIdx}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200"
                                >
                                  {b}
                                </span>
                              ))}
                          </div>
                        </td>

                        {/* Total Points */}
                        <td className="py-4 px-4 text-right font-black text-slate-900">
                          {entry.points?.toLocaleString()} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
