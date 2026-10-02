// frontend/src/services/codingService.js
import api from './api';

export const codingService = {
  async getProblems(filters) {
    const res = await api.get('/coding', { params: filters });
    return res.data;
  },

  async logProblem(data) {
    const res = await api.post('/coding', data);
    return res.data;
  },

  async updateProblem(id, data) {
    const res = await api.put(`/coding/${id}`, data);
    return res.data;
  },

  async deleteProblem(id) {
    const res = await api.delete(`/coding/${id}`);
    return res.data;
  },

  async getStats() {
    const res = await api.get('/coding/stats');
    return res.data;
  },

  async getWeakTopics() {
    const res = await api.get('/coding/weak-topics');
    return res.data;
  }
};
