// backend/config/badges.js
/**
 * Badge & Achievement Configurations
 * Career Copilot - Feature 7: Success Stories & Leaderboard
 */

const BADGES = [
  {
    type: 'mock_interview_master',
    name: 'Mock Interview Master',
    description: 'Complete 10+ mock interviews to master verbal & technical responses',
    rarity: 'Common',
    points: 100,
    icon: 'Mic',
    emoji: '🎖️',
    category: 'Interviewing',
    target: 10,
    metric: 'mockInterviewsDone',
    condition: (stats) => (stats.mockInterviewsDone || 0) >= 10
  },
  {
    type: 'coding_champion',
    name: 'Coding Champion',
    description: 'Log 100+ coding problems solved across algorithms & data structures',
    rarity: 'Common',
    points: 100,
    icon: 'Code2',
    emoji: '💻',
    category: 'Coding',
    target: 100,
    metric: 'codingProblemsLogged',
    condition: (stats) => (stats.codingProblemsLogged || 0) >= 100
  },
  {
    type: 'study_streaker',
    name: 'Study Streaker',
    description: 'Maintain a 30-day continuous study and prep streak',
    rarity: 'Rare',
    points: 250,
    icon: 'Flame',
    emoji: '🔥',
    category: 'Consistency',
    target: 30,
    metric: 'streakDays',
    condition: (stats) => (stats.streakDays || 0) >= 30
  },
  {
    type: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score a flawless 100/100 in an AI mock interview evaluation',
    rarity: 'Rare',
    points: 200,
    icon: 'Award',
    emoji: '💯',
    category: 'Excellence',
    target: 100,
    metric: 'highestMockScore',
    condition: (stats) => (stats.highestMockScore || 0) >= 100
  },
  {
    type: 'negotiation_wizard',
    name: 'Negotiation Wizard',
    description: 'Successfully negotiate +$20,000 or more above the initial offer',
    rarity: 'Rare',
    points: 300,
    icon: 'DollarSign',
    emoji: '💰',
    category: 'Negotiation',
    target: 20000,
    metric: 'highestNegotiationAmount',
    condition: (stats) => (stats.highestNegotiationAmount || 0) >= 20000
  },
  {
    type: 'speed_runner',
    name: 'Speed Runner',
    description: 'Accelerate from 0% to job-ready readiness score in under 2 weeks',
    rarity: 'Very Rare',
    points: 500,
    icon: 'Zap',
    emoji: '⚡',
    category: 'Velocity',
    target: 80,
    metric: 'readinessScore',
    condition: (stats) => Boolean(stats.isSpeedRunner) || ((stats.readinessScore || 0) >= 80 && (stats.daysActive || 0) <= 14)
  },
  {
    type: 'offer_collector',
    name: 'Offer Collector',
    description: 'Secure 3 or more concurrent job offers from top tech companies',
    rarity: 'Rare',
    points: 400,
    icon: 'Briefcase',
    emoji: '💼',
    category: 'Offers',
    target: 3,
    metric: 'offersCount',
    condition: (stats) => (stats.offersCount || 0) >= 3
  },
  {
    type: 'early_bird',
    name: 'Early Bird',
    description: 'Complete full interview preparation roadmap 1+ week ahead of schedule',
    rarity: 'Uncommon',
    points: 150,
    icon: 'Clock',
    emoji: '🌅',
    category: 'Planning',
    target: 1,
    metric: 'earlyCompleted',
    condition: (stats) => Boolean(stats.earlyCompleted) || (stats.studyPlanCompletedEarly || 0) >= 1
  },
  {
    type: 'skill_mastery',
    name: 'Skill Mastery',
    description: 'Master all 5 core skills recommended for your target career role',
    rarity: 'Rare',
    points: 250,
    icon: 'CheckCircle2',
    emoji: '🎯',
    category: 'Skills',
    target: 5,
    metric: 'masteredSkillsCount',
    condition: (stats) => (stats.masteredSkillsCount || 0) >= 5
  },
  {
    type: 'community_helper',
    name: 'Community Helper',
    description: 'Help 10+ peers through helpful story comments and answers',
    rarity: 'Common',
    points: 100,
    icon: 'Heart',
    emoji: '🤝',
    category: 'Community',
    target: 10,
    metric: 'communityHelpsCount',
    condition: (stats) => (stats.communityHelpsCount || 0) >= 10
  }
];

const ACHIEVEMENTS = [
  {
    type: 'first_interview',
    name: 'First Interview',
    description: 'Complete your first AI mock interview session',
    points: 10,
    target: 1,
    metric: 'mockInterviewsDone'
  },
  {
    type: 'first_success_story',
    name: 'First Success Story',
    description: 'Share your first offer journey to inspire the community',
    points: 50,
    target: 1,
    metric: 'storiesCount'
  },
  {
    type: 'salary_goal_hit',
    name: 'Salary Goal Hit',
    description: 'Successfully negotiate target salary boost ($10k+)',
    points: 100,
    target: 10000,
    metric: 'highestNegotiationAmount'
  },
  {
    type: 'study_consistency',
    name: 'Study Consistency',
    description: 'Complete 7 consecutive days of active study',
    points: 25,
    target: 7,
    metric: 'streakDays'
  },
  {
    type: 'company_master',
    name: 'Company Master',
    description: 'Complete all preparation modules for at least one target company',
    points: 75,
    target: 1,
    metric: 'companiesCompletedPrep'
  }
];

// Level thresholds
const LEVEL_TIERS = [
  { level: 1, minPoints: 0, maxPoints: 199, title: 'Novice Aspirant' },
  { level: 2, minPoints: 200, maxPoints: 499, title: 'Active Apprentice' },
  { level: 3, minPoints: 500, maxPoints: 899, title: 'Skilled Practitioner' },
  { level: 4, minPoints: 900, maxPoints: 1399, title: 'Interview Contender' },
  { level: 5, minPoints: 1400, maxPoints: 1999, title: 'Offer Strategist' },
  { level: 6, minPoints: 2000, maxPoints: 2799, title: 'Negotiation Pro' },
  { level: 7, minPoints: 2800, maxPoints: 3799, title: 'Career Copilot Elite' },
  { level: 8, minPoints: 3800, maxPoints: 4999, title: 'Industry Titan' },
  { level: 9, minPoints: 5000, maxPoints: 6499, title: 'Grandmaster' },
  { level: 10, minPoints: 6500, maxPoints: Infinity, title: 'Career Legend' }
];

/**
 * Calculates current level and progress to next level
 */
const calculateLevel = (totalPoints = 0) => {
  const points = Math.max(0, parseInt(totalPoints, 10) || 0);
  let currentTier = LEVEL_TIERS[0];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (points >= LEVEL_TIERS[i].minPoints && points <= LEVEL_TIERS[i].maxPoints) {
      currentTier = LEVEL_TIERS[i];
      break;
    }
  }

  const currentLevel = currentTier.level;
  const isMaxLevel = currentLevel >= LEVEL_TIERS.length;
  const nextTier = isMaxLevel ? currentTier : LEVEL_TIERS[currentLevel];
  const nextLevelPoints = isMaxLevel ? currentTier.maxPoints : nextTier.minPoints;
  const pointsToNext = isMaxLevel ? 0 : Math.max(0, nextLevelPoints - points);

  const span = isMaxLevel ? 1 : (nextLevelPoints - currentTier.minPoints);
  const progressInLevel = isMaxLevel ? 100 : Math.min(100, Math.round(((points - currentTier.minPoints) / span) * 100));

  return {
    level: currentLevel,
    title: currentTier.title,
    currentPoints: points,
    nextLevelPoints: isMaxLevel ? points : nextLevelPoints,
    pointsNeeded: pointsToNext,
    progressPercentage: progressInLevel,
    isMaxLevel
  };
};

module.exports = {
  BADGES,
  ACHIEVEMENTS,
  LEVEL_TIERS,
  calculateLevel
};
