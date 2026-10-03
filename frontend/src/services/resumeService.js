// frontend/src/services/resumeService.js
import api from './api';

/**
 * Service to handle Resume Analyzer API requests
 */
export const resumeService = {
  /**
   * Upload resume PDF file and extract text
   * @param {File} file - PDF file object
   * @param {string} targetRole - Optional target role title
   */
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

  /**
   * Analyze resume text against a job description
   * @param {object} payload - { resumeText, jobDescription, resumeId, jobTitle }
   */
  async analyze(payload) {
    const res = await api.post('/resume/analyze', payload);
    return res.data;
  },

  /**
   * Get user's past resume analyses history
   */
  async getHistory() {
    const res = await api.get('/resume/history');
    return res.data;
  },

  /**
   * Get specific resume by ID
   * @param {string} id - Resume UUID
   */
  async getById(id) {
    const res = await api.get(`/resume/${id}`);
    return res.data;
  },

  /**
   * Delete an entire resume
   * @param {string} id - Resume UUID
   */
  async delete(id) {
    const res = await api.delete(`/resume/${id}`);
    return res.data;
  },

  /**
   * Delete a single analysis from history
   * @param {string} analysisId - Analysis UUID
   */
  async deleteAnalysis(analysisId) {
    const res = await api.delete(`/resume/history/${analysisId}`);
    return res.data;
  }
};

export default resumeService;
