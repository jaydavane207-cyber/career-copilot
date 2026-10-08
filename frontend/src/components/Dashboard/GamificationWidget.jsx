// frontend/src/components/Dashboard/GamificationWidget.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Award, TrendingUp, Sparkles, ArrowRight, PlusCircle } from 'lucide-react';
import { leaderboardService } from '../../services/leaderboardService';
import ShareStoryModal from '../Stories/ShareStoryModal';

export const GamificationWidget = () => {
  const navigate = useNavigate();
  const [pointsData, setPointsData] = useState(null);
  const [badgesData, setBadgesData] = useState(null);
  const [rankData, setRankData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const loadGamificationStats = async () => {
      try {
        const [pRes, bRes, rRes] = await Promise.all([
          leaderboardService.getUserPoints(),
          leaderboardService.getUserBadges(),
          leaderboardService.getUserRank(null, 'salary')
        ]);
        if (pRes?.success) setPointsData(pRes);
        if (bRes?.success) setBadgesData(bRes);
        if (rRes?.success) setRankData(rRes);
      } catch (err) {
        // Fallback default state
      } finally {
        setLoading(false);
      }
    };

    loadGamificationStats();
  }, []);

  const latestBadge = badgesData?.badges?.find((b) => b.isEarned);
  const userRank = rankData?.rank || 14;
  const userPoints = pointsData?.points || 750;
  const userLevel = pointsData?.level || 3;
  const progressPct = pointsData?.progress_percentage || 45;
  const pointsNeeded = pointsData?.points_needed || 150;

  return (
    <>
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-amber-400/40">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0 shadow-xs">
            <Trophy className="w-6 h-6 text-yellow-200" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-100">
                Community Standing
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white text-amber-900 shadow-2xs">
                #{userRank} on Leaderboard
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black tracking-tight">
              Level {userLevel}: {pointsData?.title || 'Skilled Practitioner'} • {userPoints.toLocaleString()} pts
            </h4>

            <div className="flex items-center gap-2 pt-0.5 max-w-xs">
              <div className="flex-1 bg-black/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-200 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-amber-100 whitespace-nowrap">
                {pointsNeeded > 0 ? `${pointsNeeded} pts to L${userLevel + 1}` : 'Max Level'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Share Offer Story</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/leaderboard')}
            className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-black text-amber-400 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>View Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <ShareStoryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

export default GamificationWidget;
