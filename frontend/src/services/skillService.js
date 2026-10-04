// frontend/src/services/skillService.js
import api from './api';

export const skillService = {
  /**
   * Fetch all roles with benchmark skills
   * GET /api/skills/roles
   */
  async getRoles() {
    const res = await api.get('/skills/roles');
    return res.data;
  },

  /**
   * Fetch skills for a specific role
   * GET /api/skills/role/:roleId
   */
  async getRoleSkills(roleId) {
    const res = await api.get(`/skills/role/${roleId}`);
    return res.data;
  },

  /**
   * Assess skills in bulk or single
   * POST /api/skills/assess
   * @param {string|object} roleIdOrData
   * @param {Array} [assessmentData]
   */
  async assessSkills(roleIdOrData, assessmentData) {
    let payload;
    if (typeof roleIdOrData === 'object' && roleIdOrData !== null) {
      payload = roleIdOrData;
    } else {
      payload = {
        roleId: roleIdOrData,
        assessmentData
      };
    }
    const res = await api.post('/skills/assess', payload);
    return res.data;
  },

  // Alias
  async assessSkill(data) {
    return this.assessSkills(data);
  },

  /**
   * Get skill gap analysis for a role
   * GET /api/skills/gap/:roleId
   */
  async getGapAnalysis(roleId) {
    const res = await api.get(`/skills/gap/${encodeURIComponent(roleId)}`);
    return res.data;
  },

  /**
   * Get learning resources for a skill
   * GET /api/skills/resources/:skillName
   */
  async getResources(skillName) {
    const res = await api.get(`/skills/resources/${encodeURIComponent(skillName)}`);
    return res.data;
  },

  async getCatalog() {
    const res = await api.get('/skills/catalog');
    return res.data;
  },

  async getMySkills() {
    const res = await api.get('/skills/my-skills');
    return res.data;
  }
};

export default skillService;
