// frontend/src/services/studyService.js
import api from './api';

export const studyService = {
  /**
   * Create study plan
   * POST /api/study-plan/create
   */
  async createPlan(data) {
    const res = await api.post('/study-plan/create', data);
    return res.data;
  },

  // Alias
  async generatePlan(planConfig) {
    return this.createPlan(planConfig);
  },

  /**
   * Get active study plan
   * GET /api/study-plan
   */
  async getPlan() {
    const res = await api.get('/study-plan');
    return res.data;
  },

  // Alias
  async getActivePlan() {
    return this.getPlan();
  },

  /**
   * Complete or toggle a daily task
   * PUT /api/study-plan/:taskId/complete
   */
  async completeTask(taskId) {
    const res = await api.put(`/study-plan/${taskId}/complete`, { taskId });
    return res.data;
  },

  // Alias
  async toggleTask(planId, taskId) {
    const res = await api.put(`/study-plan/${taskId}/complete`, { taskId, planId });
    return res.data;
  },

  /**
   * Get overall study progress metrics
   * GET /api/study-plan/progress
   */
  async getProgress() {
    const res = await api.get('/study-plan/progress');
    return res.data;
  },

  /**
   * Pause active study plan
   * PUT /api/study-plan/pause
   */
  async pausePlan() {
    const res = await api.put('/study-plan/pause');
    return res.data;
  },

  /**
   * Resume paused study plan
   * PUT /api/study-plan/resume
   */
  async resumePlan() {
    const res = await api.put('/study-plan/resume');
    return res.data;
  },

  /**
   * Get history of study plans
   */
  async getHistory() {
    const res = await api.get('/study-plan/history');
    return res.data;
  },

  /**
   * Delete a study plan
   */
  async deletePlan(planId) {
    const res = await api.delete(`/study-plan/${planId}`);
    return res.data;
  }
};

export default studyService;
