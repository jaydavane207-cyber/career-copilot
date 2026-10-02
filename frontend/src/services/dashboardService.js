// frontend/src/services/dashboardService.js
import api from './api';

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

export const mockInterviewService = {
  async startSession(config) {
    const res = await api.post('/mock-interview/start', config);
    return res.data;
  },

  async submitSession(payload) {
    const res = await api.post('/mock-interview/submit', payload);
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/mock-interview/history');
    return res.data;
  },

  async getSessionById(id) {
    const res = await api.get(`/mock-interview/${id}`);
    return res.data;
  }
};
