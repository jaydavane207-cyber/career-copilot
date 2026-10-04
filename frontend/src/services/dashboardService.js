// frontend/src/services/dashboardService.js
import api from './api';
import { mockInterviewService } from './mockInterviewService';

export const dashboardService = {
  /**
   * GET /api/dashboard
   * Returns complete unified dashboard data in a single call
   */
  async getDashboard() {
    const res = await api.get('/dashboard');
    return res.data;
  },

  /**
   * GET /api/dashboard/readiness-score
   * Calculates weighted readiness score and summary
   */
  async getReadinessScore() {
    const res = await api.get('/dashboard/readiness-score');
    return res.data;
  },

  /**
   * Alias for backward compatibility
   */
  async getSummary() {
    const res = await api.get('/dashboard');
    return res.data;
  }
};

export { mockInterviewService };
export default dashboardService;
