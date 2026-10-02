// frontend/src/services/jobService.js
import api from './api';

export const jobService = {
  async getJobs(status) {
    const res = await api.get('/jobs', { params: { status } });
    return res.data;
  },

  async createJob(jobData) {
    const res = await api.post('/jobs', jobData);
    return res.data;
  },

  async updateJob(id, jobData) {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/jobs/${id}/status`, { status });
    return res.data;
  },

  async deleteJob(id) {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },

  async getStats() {
    const res = await api.get('/jobs/stats');
    return res.data;
  }
};
