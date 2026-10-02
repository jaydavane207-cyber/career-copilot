// frontend/src/services/userService.js
import api from './api';

/**
 * Service handling User Profile operations
 * Interacts with GET and POST /api/user endpoints
 */
export const userService = {
  /**
   * Fetches the current user profile from GET /api/user
   * @returns {Promise<object>} User profile response
   */
  async getUserProfile() {
    const res = await api.get('/user');
    return res.data;
  },

  /**
   * Updates the user profile via POST /api/user
   * @param {object} profileData - { name, targetRole, experienceLevel, bio }
   * @returns {Promise<object>} Updated user response
   */
  async updateUserProfile(profileData) {
    const res = await api.post('/user', profileData);
    return res.data;
  },

  /**
   * Changes the user password via PUT /api/user/change-password
   * @param {object} passwords - { currentPassword, newPassword }
   * @returns {Promise<object>} Status response
   */
  async changePassword(passwords) {
    const res = await api.put('/user/change-password', passwords);
    return res.data;
  }
};

export default userService;
