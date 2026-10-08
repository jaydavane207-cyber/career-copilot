// frontend/src/services/oauthService.js
import api from './api';
import { API_BASE_URL } from '../utils/constants';

export const oauthService = {
  /**
   * Get direct URL to initiate LinkedIn OAuth login flow
   */
  getLinkedInLoginURL: (demo = false) => {
    return `${API_BASE_URL}/auth/linkedin${demo ? '?demo=true' : ''}`;
  },

  /**
   * Get direct URL to initiate GitHub OAuth login flow
   */
  getGitHubLoginURL: (demo = false) => {
    return `${API_BASE_URL}/auth/github${demo ? '?demo=true' : ''}`;
  },

  /**
   * Fetch temporary cached preview data by preview token
   * @param {string} previewToken
   */
  getImportPreview: async (previewToken) => {
    const res = await api.get(`/auth/preview/${previewToken}`);
    return res.data;
  },

  /**
   * Get instant simulated demo preview for development / testing without API keys
   * @param {'linkedin' | 'github'} provider
   */
  getDemoPreview: async (provider) => {
    const res = await api.get(`/auth/demo-preview/${provider}`);
    return res.data;
  },

  /**
   * Confirm and save selected imported professional items to profile
   * @param {'linkedin' | 'github'} provider
   * @param {object} selectedData - Selected work experiences, education, skills, repos
   * @param {string} previewToken
   */
  confirmImport: async (provider, selectedData, previewToken = null) => {
    const res = await api.post('/profile/import/confirm', {
      provider,
      selectedItems: selectedData,
      previewToken
    });
    return res.data;
  },

  /**
   * Re-fetch fresh profile data from connected provider
   * @param {'linkedin' | 'github'} provider
   */
  refreshImportedData: async (provider) => {
    const res = await api.post('/profile/import/refresh', { provider });
    return res.data;
  },

  /**
   * Get connection status for both LinkedIn and GitHub accounts
   */
  getOAuthStatus: async () => {
    const res = await api.get('/profile/oauth-status');
    return res.data;
  },

  /**
   * Disconnect an OAuth account and erase stored tokens
   * @param {'linkedin' | 'github'} provider
   */
  disconnectOAuth: async (provider) => {
    const res = await api.delete(`/profile/oauth/${provider}`);
    return res.data;
  }
};

export default oauthService;
