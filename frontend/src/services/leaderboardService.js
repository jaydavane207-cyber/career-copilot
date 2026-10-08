// frontend/src/services/leaderboardService.js
import api from './api';

export const leaderboardService = {
  /**
   * Get leaderboard rankings
   * @param {string} type - 'salary', 'offers', 'readiness', 'mock_interviews', 'coding', 'streak'
   * @param {string} period - 'all_time', 'this_month', 'this_week'
   */
  async getLeaderboard(type = 'salary', period = 'all_time') {
    const res = await api.get(`/leaderboard/${type}?period=${period}`);
    return res.data;
  },

  /**
   * Get user rank and percentile for a rank type
   * @param {string} userId 
   * @param {string} type 
   */
  async getUserRank(userId, type = 'salary') {
    const path = userId ? `/leaderboard/${type}/user/${userId}` : `/leaderboard/${type}/user/me`;
    const res = await api.get(path);
    return res.data;
  },

  /**
   * Get nearby rankings with user in context
   * @param {string} type 
   * @param {string} period 
   */
  async getNearbyRanks(type = 'salary', period = 'all_time') {
    const res = await api.get(`/leaderboard/${type}/nearby?period=${period}`);
    return res.data;
  },

  /**
   * Get user's earned and locked badges
   */
  async getUserBadges() {
    const res = await api.get('/user/badges');
    return res.data;
  },

  /**
   * Get user's achievement progress
   */
  async getUserAchievements() {
    const res = await api.get('/user/achievements');
    return res.data;
  },

  /**
   * Get user's total points and career level
   */
  async getUserPoints() {
    const res = await api.get('/user/points');
    return res.data;
  },

  /**
   * Award a badge manually or on milestone
   * @param {string} badgeType 
   */
  async awardBadge(badgeType) {
    const res = await api.post('/user/badges/award', { badge_type: badgeType });
    return res.data;
  }
};

export default leaderboardService;
