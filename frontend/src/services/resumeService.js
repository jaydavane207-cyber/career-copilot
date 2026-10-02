// frontend/src/services/resumeService.js
import api from './api';

export const resumeService = {
  async upload(file, targetRole) {
    const formData = new FormData();
    formData.append('resume', file);
    if (targetRole) {
      formData.append('targetRole', targetRole);
    }
    const res = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  async analyze(resumeId, targetRole) {
    const res = await api.post('/resume/analyze', { resumeId, targetRole });
    return res.data;
  },

  async getHistory() {
    const res = await api.get('/resume/history');
    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/resume/${id}`);
    return res.data;
  },

  async delete(id) {
    const res = await api.delete(`/resume/${id}`);
    return res.data;
  }
};
