// frontend/src/services/companyService.js
import api from './api';

export const companyService = {
  /**
   * 1. Get all companies with search, industry, difficulty, and sort filters
   */
  getAllCompanies: async (params = {}) => {
    try {
      const response = await api.get('/company/all', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error.response?.data || { message: 'Failed to fetch companies' };
    }
  },

  /**
   * 2. Get complete company details (info, process, culture, ratings, stats)
   */
  getCompanyDetails: async (companyId) => {
    try {
      const response = await api.get(`/company/${companyId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching company details for ${companyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch company details' };
    }
  },

  /**
   * 3. Get company questions filtered by role, category, and difficulty
   */
  getCompanyQuestions: async (companyId, params = {}) => {
    try {
      const response = await api.get(`/company/${companyId}/questions`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching questions for company ${companyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch questions' };
    }
  },

  /**
   * 4. Get salary data by role and location
   */
  getCompanySalary: async (companyId, params = {}) => {
    try {
      const response = await api.get(`/company/${companyId}/salary`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching salary for company ${companyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch salary data' };
    }
  },

  /**
   * 5. Get verified success stories
   */
  getSuccessStories: async (companyId, params = {}) => {
    try {
      const response = await api.get(`/company/${companyId}/success-stories`, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching success stories for company ${companyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch success stories' };
    }
  },

  /**
   * 6. Get company reviews & culture metrics
   */
  getCompanyReviews: async (companyId, limit = 15) => {
    try {
      const response = await api.get(`/company/${companyId}/reviews`, { params: { limit } });
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for company ${companyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch reviews' };
    }
  },

  /**
   * 7. Get interview process rounds for company and role
   */
  getInterviewProcess: async (companyId, role) => {
    try {
      const response = await api.get(`/company/${companyId}/interview-process`, {
        params: role ? { role } : {}
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching interview process for company ${companyId}:`, error);
      throw error.response?.data || { message: 'Failed to fetch interview process' };
    }
  },

  /**
   * 8. Start personalized company preparation plan (Protected)
   */
  startPreparation: async (companyId, role, interviewDate) => {
    try {
      const response = await api.post('/company/prepare', {
        companyId,
        role,
        interviewDate
      });
      return response.data;
    } catch (error) {
      console.error('Error starting company preparation:', error);
      throw error.response?.data || { message: 'Failed to start preparation' };
    }
  },

  /**
   * 9. Get personalized interview questions based on user's preparation (Protected)
   */
  getPersonalizedQuestions: async (companyId, role, count = 5) => {
    try {
      const response = await api.get(`/company/${companyId}/personalized-questions`, {
        params: { role, count }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching personalized questions:', error);
      throw error.response?.data || { message: 'Failed to fetch personalized questions' };
    }
  },

  /**
   * 10. Update preparation progress and recalculate readiness (Protected)
   */
  updateProgress: async (prepId, data = {}) => {
    try {
      const response = await api.put(`/company/prepare/${prepId}/progress`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating preparation progress for ${prepId}:`, error);
      throw error.response?.data || { message: 'Failed to update progress' };
    }
  },

  /**
   * 11. Get all active preparations for the logged-in user (Protected)
   */
  getUserPreparations: async () => {
    try {
      const response = await api.get('/company/user/preparations');
      return response.data;
    } catch (error) {
      console.error('Error fetching user preparations:', error);
      throw error.response?.data || { message: 'Failed to fetch preparations' };
    }
  },

  /**
   * 12. Submit practice answer for a question and receive instant feedback
   */
  submitPracticeAnswer: async (questionId, answer, confidence, prepId) => {
    try {
      const response = await api.post('/company/practice-answer', {
        questionId,
        answer,
        confidence,
        prepId
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting practice answer:', error);
      throw error.response?.data || { message: 'Failed to submit practice answer' };
    }
  }
};

export default companyService;
