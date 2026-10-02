// frontend/src/services/skillService.js
import api from './api';

export const skillService = {
  async getRoles() {
    const res = await api.get('/skills/roles');
    return res.data;
  },

  async getCatalog() {
    const res = await api.get('/skills/catalog');
    return res.data;
  },

  async getMySkills() {
    const res = await api.get('/skills/my-skills');
    return res.data;
  },

  async assessSkill(data) {
    const res = await api.post('/skills/assess', data);
    return res.data;
  },

  async getGapAnalysis(role) {
    const res = await api.get('/skills/gap-analysis', { params: { role } });
    return res.data;
  },

  async getResources(skillName) {
    const res = await api.get(`/skills/resources/${encodeURIComponent(skillName)}`);
    return res.data;
  }
};
