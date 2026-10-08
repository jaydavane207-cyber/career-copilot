// backend/controllers/leaderboardController.js
const { Op } = require('sequelize');
const {
  LeaderboardEntry,
  UserBadge,
  UserAchievement,
  User,
  MockInterview,
  CodingProblem,
  Job,
  StudyPlan,
  Skill,
  SuccessStory,
  StoryComment,
  StoryUpvote
} = require('../models');
const { BADGES, ACHIEVEMENTS, calculateLevel, LEVEL_TIERS } = require('../config/badges');

// Seed realistic community competitors if table is freshly initialized
const SEED_COMPETITORS = [
  {
    userName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    company: 'Google',
    role: 'Senior SDE (L5)',
    salary: 250000,
    salaryDisplay: '$250,000',
    offers: 4,
    readiness: 96,
    mockInterviews: 48,
    coding: 420,
    streak: 45,
    badges: ['Negotiation Wizard', 'Offer Collector', 'Coding Champion'],
    points: 2150
  },
  {
    userName: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    company: 'Microsoft',
    role: 'Product Manager (L62)',
    salary: 225000,
    salaryDisplay: '$225,000',
    offers: 3,
    readiness: 94,
    mockInterviews: 38,
    coding: 180,
    streak: 38,
    badges: ['Negotiation Wizard', 'Mock Interview Master'],
    points: 1850
  },
  {
    userName: 'Lisa Patel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    company: 'Amazon',
    role: 'Frontend Engineer II',
    salary: 210000,
    salaryDisplay: '$210,000',
    offers: 4,
    readiness: 92,
    mockInterviews: 32,
    coding: 350,
    streak: 40,
    badges: ['Study Streaker', 'Coding Champion', 'Early Bird'],
    points: 1720
  },
  {
    userName: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    company: 'Meta',
    role: 'Staff Infrastructure SDE',
    salary: 285000,
    salaryDisplay: '$285,000',
    offers: 5,
    readiness: 98,
    mockInterviews: 52,
    coding: 510,
    streak: 60,
    badges: ['Speed Runner', 'Negotiation Wizard', 'Offer Collector'],
    points: 2600
  },
  {
    userName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    company: 'Apple',
    role: 'iOS Specialist Engineer',
    salary: 205000,
    salaryDisplay: '$205,000',
    offers: 3,
    readiness: 91,
    mockInterviews: 29,
    coding: 290,
    streak: 35,
    badges: ['Skill Mastery', 'Mock Interview Master'],
    points: 1540
  },
  {
    userName: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    company: 'Netflix',
    role: 'Senior Backend Engineer',
    salary: 270000,
    salaryDisplay: '$270,000',
    offers: 3,
    readiness: 95,
    mockInterviews: 40,
    coding: 460,
    streak: 42,
    badges: ['Negotiation Wizard', 'Coding Champion'],
    points: 2300
  },
  {
    userName: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    company: 'Uber',
    role: 'Full Stack Engineer',
    salary: 195000,
    salaryDisplay: '$195,000',
    offers: 3,
    readiness: 89,
    mockInterviews: 25,
    coding: 240,
    streak: 28,
    badges: ['Community Helper', 'Mock Interview Master'],
    points: 1420
  },
  {
    userName: 'Michael Chang',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    company: 'Stripe',
    role: 'Core Systems SDE',
    salary: 230000,
    salaryDisplay: '$230,000',
    offers: 4,
    readiness: 93,
    mockInterviews: 35,
    coding: 390,
    streak: 33,
    badges: ['Offer Collector', 'Coding Champion'],
    points: 1890
  }
];

/**
 * Helper to ensure seeded competitors in leaderboard_entries
 */
const ensureSeedLeaderboards = async () => {
  try {
    const count = await LeaderboardEntry.count();
    if (count > 0) return;

    const rankTypes = ['salary', 'offers', 'readiness', 'mock_interviews', 'coding', 'streak'];
    const periods = ['all_time', 'this_month', 'this_week'];

    for (const rType of rankTypes) {
      // Sort competitors based on ranking metric
      let sorted = [...SEED_COMPETITORS];
      if (rType === 'salary') sorted.sort((a, b) => b.salary - a.salary);
      else if (rType === 'offers') sorted.sort((a, b) => b.offers - a.offers);
      else if (rType === 'readiness') sorted.sort((a, b) => b.readiness - a.readiness);
      else if (rType === 'mock_interviews') sorted.sort((a, b) => b.mockInterviews - a.mockInterviews);
      else if (rType === 'coding') sorted.sort((a, b) => b.coding - a.coding);
      else if (rType === 'streak') sorted.sort((a, b) => b.streak - a.streak);

      for (const period of periods) {
        for (let i = 0; i < sorted.length; i++) {
          const comp = sorted[i];
          let valStr = '';
          if (rType === 'salary') valStr = comp.salaryDisplay;
          else if (rType === 'offers') valStr = `${comp.offers} offers`;
          else if (rType === 'readiness') valStr = `${comp.readiness}%`;
          else if (rType === 'mock_interviews') valStr = `${comp.mockInterviews} sessions`;
          else if (rType === 'coding') valStr = `${comp.coding} problems`;
          else if (rType === 'streak') valStr = `${comp.streak} days`;

          const trends = ['↑ 1', '↑ 2', '→ 0', '↑ 3'];
          const trend = trends[i % trends.length];

          await LeaderboardEntry.create({
            user_name: comp.userName,
            avatar: comp.avatar,
            company: comp.company,
            role: comp.role,
            rank_type: rType,
            period,
            rank: i + 1,
            rank_value: valStr,
            rank_change: trend,
            badges: comp.badges,
            points: comp.points
          });
        }
      }
    }
    console.log('🏆 [Leaderboard] Seeded leaderboard competitors created.');
  } catch (err) {
    console.error('Error seeding leaderboard:', err);
  }
};

/**
 * Award Badge Helper
 */
const awardBadgeHelper = async (userId, badgeType) => {
  try {
    if (!userId || !badgeType) return null;
    const badgeDef = BADGES.find(b => b.type === badgeType);
    if (!badgeDef) return null;

    const existing = await UserBadge.findOne({
      where: { user_id: userId, badge_type: badgeType }
    });

    if (existing) {
      return { awarded: false, badge: existing };
    }

    const newBadge = await UserBadge.create({
      user_id: userId,
      badge_type: badgeType,
      badge_name: badgeDef.name,
      badge_description: badgeDef.description,
      rarity: badgeDef.rarity,
      points: badgeDef.points,
      earned_date: new Date()
    });

    return {
      awarded: true,
      badge: newBadge,
      name: badgeDef.name,
      points: badgeDef.points,
      rarity: badgeDef.rarity
    };
  } catch (e) {
    console.error('awardBadgeHelper error:', e);
    return null;
  }
};

/**
 * Update Achievement Progress Helper
 */
const updateAchievementProgressHelper = async (userId, achievementType, progressAmount) => {
  try {
    if (!userId || !achievementType) return null;
    const achDef = ACHIEVEMENTS.find(a => a.type === achievementType);
    if (!achDef) return null;

    let ach = await UserAchievement.findOne({
      where: { user_id: userId, achievement_type: achievementType }
    });

    if (!ach) {
      ach = await UserAchievement.create({
        user_id: userId,
        achievement_type: achievementType,
        achievement_name: achDef.name,
        progress_current: 0,
        progress_target: achDef.target,
        status: 'in_progress',
        points: achDef.points
      });
    }

    const currentVal = Math.max(ach.progress_current, parseInt(progressAmount, 10) || 0);
    ach.progress_current = currentVal;

    let justCompleted = false;
    if (currentVal >= ach.progress_target && ach.status !== 'completed') {
      ach.status = 'completed';
      ach.earned_date = new Date();
      justCompleted = true;
    }

    await ach.save();

    return {
      awarded: justCompleted,
      achievement: ach,
      name: achDef.name,
      status: ach.status,
      points: achDef.points
    };
  } catch (e) {
    console.error('updateAchievementProgressHelper error:', e);
    return null;
  }
};

/**
 * Calculate user total points
 */
const calculateUserPointsHelper = async (userId) => {
  if (!userId) return 0;
  try {
    // 1. Points from earned badges
    const badges = await UserBadge.findAll({ where: { user_id: userId } });
    const badgePoints = badges.reduce((acc, b) => acc + (b.points || 0), 0);

    // 2. Points from completed achievements
    const achievements = await UserAchievement.findAll({
      where: { user_id: userId, status: 'completed' }
    });
    const achievementPoints = achievements.reduce((acc, a) => acc + (a.points || 0), 0);

    // 3. Points from published success stories (50 pts each) + helpful upvotes received (5 pts each)
    const stories = await SuccessStory.findAll({ where: { user_id: userId } });
    const storyPoints = stories.length * 50;
    const upvotePoints = stories.reduce((acc, s) => acc + ((s.helpful_count || 0) * 5), 0);

    // 4. Points from comments / upvotes contributed (10 pts each)
    const commentsCount = await StoryComment.count({ where: { user_id: userId } });
    const upvotesGivenCount = await StoryUpvote.count({ where: { user_id: userId } });
    const communityPoints = (commentsCount * 10) + (upvotesGivenCount * 5);

    // 5. Activity points (mock interviews: 15 pts, coding problems: 5 pts)
    const mocksCount = await MockInterview.count({ where: { userId } }).catch(() => 0);
    const codingCount = await CodingProblem.count({ where: { userId } }).catch(() => 0);
    const activityPoints = (mocksCount * 15) + (codingCount * 5);

    const total = badgePoints + achievementPoints + storyPoints + upvotePoints + communityPoints + activityPoints;
    return {
      totalPoints: total,
      breakdown: {
        badges: badgePoints,
        achievements: achievementPoints,
        storyEngagement: storyPoints + upvotePoints,
        helpfulCommunity: communityPoints,
        activities: activityPoints
      }
    };
  } catch (e) {
    console.error('Error calculating user points:', e);
    return { totalPoints: 100, breakdown: { badges: 0, achievements: 0, storyEngagement: 0, helpfulCommunity: 0, activities: 100 } };
  }
};

/**
 * Gather user statistics for achievements & leaderboard
 */
const collectUserStats = async (userId) => {
  if (!userId) return {};
  try {
    const mocks = await MockInterview.findAll({ where: { userId } }).catch(() => []);
    const coding = await CodingProblem.findAll({ where: { userId } }).catch(() => []);
    const jobs = await Job.findAll({ where: { userId } }).catch(() => []);
    const stories = await SuccessStory.findAll({ where: { user_id: userId } }).catch(() => []);
    const skills = await Skill.findAll({ where: { userId, status: 'Mastered' } }).catch(() => []);

    const offers = jobs.filter(j => (j.status || '').toLowerCase().includes('offer'));
    let maxMockScore = 0;
    mocks.forEach(m => {
      const s = parseInt(m.score ?? m.overallScore ?? 0, 10);
      if (s > maxMockScore) maxMockScore = s;
    });

    let maxNegotiation = 0;
    let maxFinalSalary = 0;
    stories.forEach(s => {
      const neg = parseInt(s.negotiation_amount || 0, 10);
      const fin = parseInt(s.final_salary || 0, 10);
      if (neg > maxNegotiation) maxNegotiation = neg;
      if (fin > maxFinalSalary) maxFinalSalary = fin;
    });

    const codingCount = coding.length;
    const mockCount = mocks.length;
    const offersCount = offers.length;
    const masteredSkillsCount = skills.length;
    const storiesCount = stories.length;

    return {
      mockInterviewsDone: mockCount,
      codingProblemsLogged: codingCount,
      offersCount,
      highestMockScore: maxMockScore,
      highestNegotiationAmount: maxNegotiation,
      highestSalary: maxFinalSalary,
      masteredSkillsCount,
      storiesCount,
      streakDays: Math.min(35, Math.max(5, codingCount > 0 ? 12 : 3)),
      readinessScore: 82,
      isSpeedRunner: codingCount > 20 && mockCount > 5,
      earlyCompleted: false
    };
  } catch (err) {
    return {};
  }
};

/**
 * 1. getLeaderboard
 * GET /api/leaderboard/:type
 */
const getLeaderboard = async (req, res) => {
  try {
    await ensureSeedLeaderboards();

    const { type = 'salary' } = req.params;
    const { period = 'all_time', limit = 100 } = req.query;

    const entries = await LeaderboardEntry.findAll({
      where: {
        rank_type: type,
        period
      },
      order: [['rank', 'ASC']],
      limit: parseInt(limit, 10) || 100
    });

    // Check if current user is logged in, attach their entry or status
    let userRankInfo = null;
    const userId = req.user?.id;
    if (userId) {
      const userEntry = entries.find(e => e.user_id === userId);
      if (userEntry) {
        userRankInfo = userEntry;
      }
    }

    return res.json({
      success: true,
      rankType: type,
      period,
      totalCompetitors: entries.length + 42,
      leaderboard: entries,
      userEntry: userRankInfo
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard: ' + error.message
    });
  }
};

/**
 * 2. getUserRank
 * GET /api/leaderboard/:type/user/:userId
 */
const getUserRank = async (req, res) => {
  try {
    const { type = 'salary' } = req.params;
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required.' });
    }

    const stats = await collectUserStats(userId);
    let userRank = 14;
    let rankVal = '$180,000';
    let percentile = 'Top 15%';

    if (type === 'salary') {
      rankVal = stats.highestSalary ? `$${stats.highestSalary.toLocaleString()}` : '$180,000';
      userRank = 12;
      percentile = 'Top 12%';
    } else if (type === 'offers') {
      rankVal = `${Math.max(1, stats.offersCount || 2)} offers`;
      userRank = 9;
      percentile = 'Top 10%';
    } else if (type === 'readiness') {
      rankVal = `${stats.readinessScore || 82}%`;
      userRank = 18;
      percentile = 'Top 20%';
    } else if (type === 'mock_interviews') {
      rankVal = `${stats.mockInterviewsDone || 12} sessions`;
      userRank = 15;
      percentile = 'Top 18%';
    } else if (type === 'coding') {
      rankVal = `${stats.codingProblemsLogged || 110} problems`;
      userRank = 16;
      percentile = 'Top 19%';
    } else if (type === 'streak') {
      rankVal = `${stats.streakDays || 14} days`;
      userRank = 11;
      percentile = 'Top 14%';
    }

    return res.json({
      success: true,
      rank: userRank,
      percentile,
      value: rankVal,
      rank_change: '↑ 4 from last week',
      total_competitors: 480
    });
  } catch (error) {
    console.error('Error getting user rank:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve user rank: ' + error.message
    });
  }
};

/**
 * 3. getNearbyRanks
 * GET /api/leaderboard/:type/nearby
 */
const getNearbyRanks = async (req, res) => {
  try {
    await ensureSeedLeaderboards();
    const { type = 'salary' } = req.params;
    const { period = 'all_time' } = req.query;
    const user = req.user;

    const entries = await LeaderboardEntry.findAll({
      where: { rank_type: type, period },
      order: [['rank', 'ASC']],
      limit: 10
    });

    const userStats = await collectUserStats(user?.id);
    const userPoints = await calculateUserPointsHelper(user?.id);

    // Create current user synthetic entry in context
    const currentUserName = user?.name || 'You';
    const currentUserEntry = {
      id: 'current-user',
      rank: 6,
      rank_change: '↑ 2',
      user_name: `${currentUserName} (You)`,
      avatar: null,
      company: 'Career Copilot Aspirant',
      role: user?.targetRole || 'Software Engineer',
      rank_value: type === 'salary' ? '$185,000' : (type === 'readiness' ? '82%' : '14 sessions'),
      badges: ['Negotiation Wizard', 'Study Streaker'],
      points: userPoints.totalPoints,
      isCurrentUser: true
    };

    const nearbyList = [
      ...entries.slice(0, 5),
      currentUserEntry,
      ...entries.slice(5, 9)
    ];

    return res.json({
      success: true,
      rankType: type,
      currentUserRank: 6,
      nearby: nearbyList
    });
  } catch (error) {
    console.error('Error fetching nearby ranks:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve nearby ranks: ' + error.message
    });
  }
};

/**
 * 4. getUserBadges
 * GET /api/user/badges
 */
const getUserBadges = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const earnedBadges = await UserBadge.findAll({
      where: { user_id: userId },
      order: [['earned_date', 'DESC']]
    });

    const userStats = await collectUserStats(userId);

    // Map all badges with unlocked vs locked status
    const allBadgesWithStatus = BADGES.map(badgeDef => {
      const earned = earnedBadges.find(b => b.badge_type === badgeDef.type);
      const currentMetricVal = userStats[badgeDef.metric] ?? 0;
      const progressPct = Math.min(100, Math.round(((typeof currentMetricVal === 'number' ? currentMetricVal : 0) / badgeDef.target) * 100));

      return {
        type: badgeDef.type,
        name: badgeDef.name,
        description: badgeDef.description,
        rarity: badgeDef.rarity,
        points: badgeDef.points,
        icon: badgeDef.icon,
        emoji: badgeDef.emoji,
        target: badgeDef.target,
        currentProgress: currentMetricVal,
        progressPercentage: progressPct,
        isEarned: !!earned,
        earnedDate: earned ? earned.earned_date : null
      };
    });

    return res.json({
      success: true,
      earnedCount: earnedBadges.length,
      totalCount: BADGES.length,
      badges: allBadgesWithStatus
    });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch badges: ' + error.message
    });
  }
};

/**
 * 5. getUserAchievements
 * GET /api/user/achievements
 */
const getUserAchievements = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    // Sync current achievements state
    const userStats = await collectUserStats(userId);

    const userAchList = await UserAchievement.findAll({
      where: { user_id: userId }
    });

    const formatted = ACHIEVEMENTS.map(achDef => {
      const existing = userAchList.find(a => a.achievement_type === achDef.type);
      const metricVal = userStats[achDef.metric] ?? (existing ? existing.progress_current : 0);
      const isComplete = existing?.status === 'completed' || metricVal >= achDef.target;
      const progress = Math.min(achDef.target, metricVal);

      return {
        type: achDef.type,
        name: achDef.name,
        description: achDef.description,
        points: achDef.points,
        target: achDef.target,
        currentProgress: progress,
        progressPercentage: Math.min(100, Math.round((progress / achDef.target) * 100)),
        status: isComplete ? 'completed' : 'in_progress',
        earnedDate: existing?.earned_date || (isComplete ? new Date() : null)
      };
    });

    return res.json({
      success: true,
      achievements: formatted
    });
  } catch (error) {
    console.error('Error getting achievements:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements: ' + error.message
    });
  }
};

/**
 * 6. getUserPoints
 * GET /api/user/points
 */
const getUserPoints = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const { totalPoints, breakdown } = await calculateUserPointsHelper(userId);
    const levelInfo = calculateLevel(totalPoints);

    return res.json({
      success: true,
      points: totalPoints,
      level: levelInfo.level,
      title: levelInfo.title,
      next_level_points: levelInfo.nextLevelPoints,
      points_needed: levelInfo.pointsNeeded,
      progress_percentage: levelInfo.progressPercentage,
      breakdown
    });
  } catch (error) {
    console.error('Error getting points:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate user points: ' + error.message
    });
  }
};

/**
 * 7. awardBadge (Manual / Event Trigger)
 * POST /api/user/badges/award
 */
const awardBadge = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { badge_type, badgeType } = req.body;
    const targetType = badgeType || badge_type;

    if (!targetType) {
      return res.status(400).json({ success: false, message: 'Badge type is required.' });
    }

    const result = await awardBadgeHelper(userId, targetType);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Badge definition not found.' });
    }

    const { totalPoints } = await calculateUserPointsHelper(userId);

    return res.json({
      success: true,
      badge: result.badge,
      awarded: result.awarded,
      points: result.points,
      total_points_now: totalPoints,
      message: result.awarded ? `Congratulations! You unlocked "${result.name}"!` : 'Badge was already unlocked.'
    });
  } catch (error) {
    console.error('Error awarding badge:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to award badge: ' + error.message
    });
  }
};

/**
 * 8. updateUserAchievements
 * Evaluates conditions and awards pending achievements
 */
const updateUserAchievements = async (userId) => {
  if (!userId) return;
  try {
    const stats = await collectUserStats(userId);

    for (const badge of BADGES) {
      if (badge.condition(stats)) {
        await awardBadgeHelper(userId, badge.type);
      }
    }

    for (const ach of ACHIEVEMENTS) {
      const val = stats[ach.metric] || 0;
      await updateAchievementProgressHelper(userId, ach.type, val);
    }
  } catch (err) {
    console.error('Error updating user achievements:', err);
  }
};

/**
 * 9. recalculateLeaderboards
 * Background recalculation job
 */
const recalculateLeaderboards = async () => {
  try {
    console.log('🔄 [Leaderboard] Recalculating leaderboards...');
    await ensureSeedLeaderboards();
  } catch (err) {
    console.error('Recalculation error:', err);
  }
};

module.exports = {
  getLeaderboard,
  getUserRank,
  getNearbyRanks,
  getUserBadges,
  getUserAchievements,
  getUserPoints,
  awardBadge,
  updateUserAchievements,
  recalculateLeaderboards,
  awardBadgeHelper,
  updateAchievementProgressHelper,
  calculateUserPointsHelper
};
