// frontend/src/services/interviewService.js
import api from './api';

export const interviewService = {
  /**
   * 1. Create a new interview
   * @param {Object} data - Interview payload
   */
  createInterview: async (data) => {
    try {
      const response = await api.post('/interviews', data);
      return response.data;
    } catch (error) {
      console.error('Error creating interview:', error);
      throw error.response?.data || { message: 'Failed to schedule interview' };
    }
  },

  /**
   * 2. Get all interviews for user (optional date range filters)
   * @param {string} [from] - Start ISO date
   * @param {string} [to] - End ISO date
   */
  getInterviews: async (from = '', to = '') => {
    try {
      const params = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const response = await api.get('/interviews', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching interviews:', error);
      throw error.response?.data || { message: 'Failed to load interviews' };
    }
  },

  /**
   * 3. Get next N upcoming interviews
   * @param {number} [limit=5]
   */
  getUpcomingInterviews: async (limit = 5) => {
    try {
      const response = await api.get('/interviews/upcoming', { params: { limit } });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming interviews:', error);
      throw error.response?.data || { message: 'Failed to load upcoming interviews' };
    }
  },

  /**
   * 4. Update existing interview
   * @param {string|number} id
   * @param {Object} updates
   */
  updateInterview: async (id, updates) => {
    try {
      const response = await api.put(`/interviews/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error(`Error updating interview ${id}:`, error);
      throw error.response?.data || { message: 'Failed to update interview' };
    }
  },

  /**
   * 5. Delete interview
   * @param {string|number} id
   */
  deleteInterview: async (id) => {
    try {
      const response = await api.delete(`/interviews/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting interview ${id}:`, error);
      throw error.response?.data || { message: 'Failed to delete interview' };
    }
  },

  /**
   * 6. Get smart dynamic prep plan for an interview
   * @param {string|number} interviewId
   */
  getPrepPlan: async (interviewId) => {
    try {
      const response = await api.get(`/interviews/${interviewId}/prep-plan`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prep plan for ${interviewId}:`, error);
      throw error.response?.data || { message: 'Failed to load interview prep plan' };
    }
  },

  /**
   * 7. Get completed prep logs for an interview
   * @param {string|number} interviewId
   */
  getPrepLogs: async (interviewId) => {
    try {
      const response = await api.get(`/interviews/${interviewId}/prep-log`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prep logs for ${interviewId}:`, error);
      throw error.response?.data || { message: 'Failed to load prep logs' };
    }
  },

  /**
   * 8. Log a completed prep task
   * @param {string|number} interviewId
   * @param {Object} taskData - { taskType, description }
   */
  logPrepTask: async (interviewId, taskData) => {
    try {
      const response = await api.post(`/interviews/${interviewId}/prep-log`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error logging prep task for ${interviewId}:`, error);
      throw error.response?.data || { message: 'Failed to log prep task' };
    }
  },

  /**
   * 9. Analyze interview answer with AI feedback (Gemini)
   * @param {string} question
   * @param {string} answer
   * @param {string} [role]
   * @param {string} [company]
   */
  getAnswerFeedback: async (question, answer, role = '', company = '') => {
    try {
      const response = await api.post('/interviews/answer-feedback', {
        question,
        answer,
        role,
        company
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing answer with AI:', error);
      throw error.response?.data || { message: 'Failed to analyze answer' };
    }
  }
};

export default interviewService;
