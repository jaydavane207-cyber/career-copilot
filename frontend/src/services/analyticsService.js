// frontend/src/services/analyticsService.js
import api from './api';

export const analyticsService = {
  /**
   * 1. Get complete analytics dashboard suite
   */
  getDashboardData: async () => {
    const res = await api.get('/analytics/dashboard');
    return res.data;
  },

  /**
   * 2. Get application funnel metrics & conversion rates
   */
  getFunnelData: async () => {
    const res = await api.get('/analytics/funnel');
    return res.data;
  },

  /**
   * 3. Get skill performance analysis (?sort=success_rate|weakest|most_improved)
   */
  getSkillAnalysis: async (sort = 'success_rate') => {
    const res = await api.get(`/analytics/skills?sort=${sort}`);
    return res.data;
  },

  /**
   * 4. Get study effectiveness metrics
   */
  getStudyAnalysis: async () => {
    const res = await api.get('/analytics/study');
    return res.data;
  },

  /**
   * 5. Get salary analysis and negotiation gains
   */
  getSalaryAnalysis: async () => {
    const res = await api.get('/analytics/salary');
    return res.data;
  },

  /**
   * 6. Get preparation ROI analysis
   */
  getROIAnalysis: async () => {
    const res = await api.get('/analytics/roi');
    return res.data;
  },

  /**
   * 7. Get market skill demand trends
   */
  getMarketSkills: async (limit = 20) => {
    const res = await api.get(`/analytics/market/skills?limit=${limit}`);
    return res.data;
  },

  /**
   * 8. Get market salary percentiles
   */
  getMarketSalary: async (role = 'Senior SDE', location = 'Mountain View, CA') => {
    const res = await api.get(`/analytics/market/salary?role=${encodeURIComponent(role)}&location=${encodeURIComponent(location)}`);
    return res.data;
  },

  /**
   * 9. Get comparison to platform average
   */
  getComparison: async (metric = '') => {
    const url = metric ? `/analytics/compare?metric=${metric}` : '/analytics/compare';
    const res = await api.get(url);
    return res.data;
  },

  /**
   * 10. Get prioritized recommendations
   */
  getRecommendations: async () => {
    const res = await api.get('/analytics/recommendations');
    return res.data;
  },

  /**
   * 11. Get 3-month future outcome predictions
   */
  getPredictions: async () => {
    const res = await api.get('/analytics/predictions');
    return res.data;
  },

  /**
   * 12. Export report (PDF or Excel)
   */
  exportReport: async (format = 'pdf') => {
    const res = await api.get(`/analytics/export?format=${format}`);
    return res.data;
  }
};

export default analyticsService;
