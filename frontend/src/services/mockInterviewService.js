// frontend/src/services/mockInterviewService.js
import api from './api';

export const mockInterviewService = {
  /**
   * Fetch randomized interview questions
   * @param {Object} params - { type, count, role }
   */
  async getQuestions(params = {}) {
    const res = await api.get('/mock-interview/questions', { params });
    return res.data;
  },

  /**
   * Submit interview session answers for evaluation and storage
   * @param {Object} payload - { interviewType, role, answers, sessionStats, durationMinutes }
   */
  async submitSession(payload) {
    const res = await api.post('/mock-interview/submit-answer', payload);
    return res.data;
  },

  /**
   * Fetch past interview history for the logged-in candidate
   */
  async getHistory() {
    const res = await api.get('/mock-interview/history');
    return res.data;
  },

  /**
   * Fetch sample answers, key points, and coaching tips for specific questions
   * @param {Object} params - { questionId, questionIds, type }
   */
  async getFeedback(params = {}) {
    const res = await api.get('/mock-interview/feedback', { params });
    return res.data;
  },

  /**
   * Fetch a specific session by ID
   * @param {string} id - Session UUID
   */
  async getSessionById(id) {
    const res = await api.get(`/mock-interview/${id}`);
    return res.data;
  },

  /**
   * Legacy startSession adapter
   */
  async startSession(config) {
    const res = await api.get('/mock-interview/questions', {
      params: {
        type: config.interviewType,
        count: config.questionCount || 5,
        role: config.role
      }
    });
    return {
      success: res.data.success,
      session: {
        role: config.role || 'Fullstack Developer',
        interviewType: config.interviewType || 'Technical',
        questions: res.data.questions
      }
    };
  }
};

export default mockInterviewService;
