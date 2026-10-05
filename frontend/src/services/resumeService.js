// frontend/src/services/resumeService.js
import api from './api';

/**
 * Service to handle Resume Analyzer API requests
 */
export const resumeService = {
  /**
   * Upload resume PDF file and extract text
   * @param {File} file - PDF file object
   * @param {string} [targetRole] - Optional target role title
   */
  async uploadResume(file, targetRole) {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('file', file);
    if (targetRole) {
      formData.append('targetRole', targetRole);
    }
    const res = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Alias
  async upload(file, targetRole) {
    return this.uploadResume(file, targetRole);
  },

  /**
   * Analyze resume text against a job description
   * @param {string|object} resumeIdOrPayload
   * @param {string} [jobDescription]
   */
  async analyzeResume(resumeIdOrPayload, jobDescription) {
    let payload;
    if (typeof resumeIdOrPayload === 'object' && resumeIdOrPayload !== null) {
      payload = resumeIdOrPayload;
    } else {
      payload = {
        resumeId: resumeIdOrPayload,
        jobDescription
      };
    }
    const res = await api.post('/resume/analyze', payload);
    return res.data;
  },

  // Alias
  async analyze(payload) {
    return this.analyzeResume(payload);
  },

  /**
   * Get user's past resume analyses history
   */
  async getResumeHistory() {
    const res = await api.get('/resume/history');
    return res.data;
  },

  // Alias
  async getHistory() {
    return this.getResumeHistory();
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
   * @param {string} resumeId - Resume UUID
   */
  async deleteResume(resumeId) {
    const res = await api.delete(`/resume/${resumeId}`);
    return res.data;
  },

  // Alias
  async delete(id) {
    return this.deleteResume(id);
  },

  /**
   * Delete a single analysis from history
   * @param {string} analysisId - Analysis UUID
   */
  async deleteAnalysis(analysisId) {
    const res = await api.delete(`/resume/history/${analysisId}`);
    return res.data;
  },

  /**
   * Generate AI-powered feedback for a resume using Google Gemini
   * @param {string} resumeId - Resume UUID
   */
  async generateAIFeedback(resumeId) {
    const res = await api.post(`/resume/${resumeId}/ai-feedback`);
    return res.data;
  },

  /**
   * Get cached AI feedback for a resume if available
   * @param {string} resumeId - Resume UUID
   */
  async getAIFeedback(resumeId) {
    const res = await api.get(`/resume/${resumeId}/ai-feedback`);
    return res.data;
  },

  /**
   * Get AI-generated improved resume text
   * @param {string} resumeId - Resume UUID
   */
  async getImprovedResume(resumeId) {
    const res = await api.get(`/resume/${resumeId}/improved`);
    return res.data;
  },

  /**
   * Download AI-improved resume as a text file
   * @param {string} resumeId - Resume UUID
   */
  async downloadImprovedResume(resumeId) {
    const res = await api.get(`/resume/${resumeId}/improved/download`, {
      responseType: 'blob'
    });

    const blob = new Blob([res.data], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'improved-resume.txt');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    return true;
  }
};

export default resumeService;
