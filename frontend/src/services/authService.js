// frontend/src/services/authService.js
import api from './api';

/**
 * Authentication Service
 * Handles user registration, login, logout, and token session retrieval
 */
export const authService = {
  /**
   * Register a new user with name, email, password, and targetRole
   * @param {object} data - { name, email, password, targetRole }
   * @returns {Promise<object>} Registration response containing JWT token and user profile
   */
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  /**
   * Authenticate an existing user with email and password
   * @param {object} data - { email, password }
   * @returns {Promise<object>} Login response containing JWT token and user profile
   */
  async login(data) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  /**
   * Logout current session
   * @returns {Promise<object>} Logout acknowledgment
   */
  async logout() {
    const res = await api.post('/auth/logout');
    return res.data;
  },

  /**
   * Fetch currently authenticated user session
   * @returns {Promise<object>} User profile details
   */
  async getCurrentUser() {
    const res = await api.get('/auth/me');
    return res.data;
  }
};

export default authService;
