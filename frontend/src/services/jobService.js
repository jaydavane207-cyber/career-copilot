// frontend/src/services/jobService.js
import api from './api';

export const jobService = {
  /**
   * Fetch all job applications for the logged-in user
   * @param {string} [stage] - Optional stage filter ('applied' | 'interview' | 'offer')
   */
  async getJobs(stage) {
    const res = await api.get('/jobs', { params: stage ? { stage } : {} });
    return res.data;
  },

  /**
   * Create a new job application
   * @param {Object} jobData
   */
  async createJob(jobData) {
    const res = await api.post('/jobs', jobData);
    return res.data;
  },

  /**
   * Update job application details or move between stages
   * @param {string} id
   * @param {Object} jobData
   */
  async updateJob(id, jobData) {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data;
  },

  /**
   * Update stage of a job (e.g. from drag & drop)
   * @param {string} id
   * @param {string} stage - 'applied' | 'interview' | 'offer'
   */
  async updateStage(id, stage) {
    const res = await api.patch(`/jobs/${id}/status`, { stage });
    return res.data;
  },

  /**
   * Delete a job application
   * @param {string} id
   */
  async deleteJob(id) {
    const res = await api.delete(`/jobs/${id}`);
    return res.data;
  },

  /**
   * Fetch job statistics: total applied, in interview, offers, conversion rate, avg days
   */
  async getStats() {
    const res = await api.get('/jobs/stats');
    return res.data;
  },

  /**
   * Scrape and analyze a real job posting from a URL
   * @param {string} jobURL
   * @returns {Promise<{ success: boolean, analysis: Object, jobId: string, url: string }>}
   */
  async analyzeJobFromURL(jobURL) {
    const res = await api.post('/jobs/analyze-url', { jobURL });
    return res.data;
  },

  /**
   * Fetch saved analysis details for a job
   * @param {string} jobId
   */
  async getJobAnalysis(jobId) {
    const res = await api.get(`/jobs/${jobId}/analysis`);
    return res.data;
  },

  /**
   * Fetch preparation plan and mock interview recommendations for a job
   * @param {string} jobId
   */
  async getJobPreparation(jobId) {
    const res = await api.get(`/jobs/${jobId}/preparation`);
    return res.data;
  },

  /**
   * Save analyzed job to applications tracker
   * @param {string} jobId
   * @param {string} [stage='applied']
   * @param {string} [notes='']
   */
  async saveJobToTracker(jobId, stage = 'applied', notes = '') {
    const res = await api.post(`/jobs/${jobId}/save-to-tracker`, { stage, notes });
    return res.data;
  },

  /**
   * Get AI-suggested jobs based on user's skills
   * @param {number} [limit=10]
   */
  async getSuggestedJobs(limit = 10) {
    const res = await api.get('/jobs/suggested', { params: { limit } });
    return res.data;
  },

  /**
   * Analyze multiple jobs at once from an array of URLs
   * @param {Array<string>|string} urls
   */
  async analyzeMultipleJobs(urls) {
    const urlString = Array.isArray(urls) ? urls.join(',') : urls;
    const res = await api.get('/jobs/search-analysis', { params: { urls: urlString } });
    return res.data;
  }
};

export default jobService;
