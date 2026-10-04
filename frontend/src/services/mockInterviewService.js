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
   * Start an interview session
   * @param {string} type - 'Behavioral' | 'Technical' | 'System Design'
   * @param {number} numQuestions - Number of questions
   * @param {string} role - Target role
   */
  async startInterview(type = 'Technical', numQuestions = 5, role = 'Fullstack Developer') {
    const payload = typeof type === 'object' ? type : { type, numQuestions, role };
    const res = await api.post('/mock-interview/start', payload);
    return res.data;
  },

  /**
   * Submit a single answer for an active interview
   * @param {string} interviewId - Interview UUID
   * @param {string} questionId - Question identifier
   * @param {string} userAnswer - Response text
   * @param {number} confidence - Confidence rating (1-5)
   */
  async submitAnswer(interviewId, questionId, userAnswer, confidence = 3) {
    const payload = typeof interviewId === 'object' ? interviewId : { interviewId, questionId, userAnswer, confidence };
    const res = await api.post('/mock-interview/submit-answer', payload);
    return res.data;
  },

  /**
   * Get results for an interview session
   * @param {string} interviewId - Interview UUID
   */
  async getResults(interviewId) {
    const res = await api.get(`/mock-interview/${interviewId}/results`);
    return res.data;
  },

  /**
   * Get model review and sample answer for a specific question
   * @param {string} interviewId - Interview UUID
   * @param {string} questionId - Question identifier
   */
  async getAnswerReview(interviewId, questionId) {
    const res = await api.get(`/mock-interview/${interviewId}/answer/${questionId}`);
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
