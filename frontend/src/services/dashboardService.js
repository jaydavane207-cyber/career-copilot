// frontend/src/services/dashboardService.js
import api from './api';
import { mockInterviewService } from './mockInterviewService';

export const dashboardService = {
  async getReadinessScore() {
    const res = await api.get('/dashboard/readiness');
    return res.data;
  },

  async getSummary() {
    const res = await api.get('/dashboard/summary');
    return res.data;
  }
};

export { mockInterviewService };
