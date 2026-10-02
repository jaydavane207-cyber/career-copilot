// frontend/src/services/studyService.js
import api from './api';

export const studyService = {
  async getActivePlan() {
    const res = await api.get('/study-plan');
    return res.data;
  },

  async generatePlan(planConfig) {
    const res = await api.post('/study-plan/generate', planConfig);
    return res.data;
  },

  async toggleTask(planId, taskId) {
    const res = await api.put(`/study-plan/${planId}/task`, { taskId });
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/study-plan/history');
    return res.data;
  },

  async deletePlan(planId) {
    const res = await api.delete(`/study-plan/${planId}`);
    return res.data;
  }
};
