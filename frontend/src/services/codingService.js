// frontend/src/services/codingService.js
import api from './api';

export const codingService = {
  /**
   * Log a new solved or practiced problem
   * POST /api/coding/log
   */
  async logProblem(data) {
    const res = await api.post('/coding/log', data);
    return res.data;
  },

  /**
   * Get all logged problems with optional filters
   * GET /api/coding/problems
   */
  async getProblems(filters = {}) {
    const res = await api.get('/coding/problems', { params: filters });
    return res.data;
  },

  /**
   * Get topics with <70% success rate
   * GET /api/coding/weak-topics
   */
  async getWeakTopics() {
    const res = await api.get('/coding/weak-topics');
    return res.data;
  },

  /**
   * Get aggregate stats, time trends, topic distribution
   * GET /api/coding/stats
   */
  async getStats() {
    const res = await api.get('/coding/stats');
    return res.data;
  },

  /**
   * Get problems due for spaced repetition review (1, 3, 7, 14, 30 days)
   * GET /api/coding/spaced-repetition
   */
  async getSpacedRepetition() {
    const res = await api.get('/coding/spaced-repetition');
    return res.data;
  },

  /**
   * Mark a problem as reviewed in spaced repetition schedule
   * POST /api/coding/:id/review
   */
  async reviewProblem(id, data = {}) {
    const res = await api.post(`/coding/${id}/review`, data);
    return res.data;
  },

  /**
   * Update problem details
   * PUT /api/coding/:id
   */
  async updateProblem(id, data) {
    const res = await api.put(`/coding/${id}`, data);
    return res.data;
  },

  /**
   * Remove a logged problem
   * DELETE /api/coding/:id
   */
  async deleteProblem(id) {
    const res = await api.delete(`/coding/${id}`);
    return res.data;
  }
};

export default codingService;
