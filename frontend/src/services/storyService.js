// frontend/src/services/storyService.js
import api from './api';

export const storyService = {
  /**
   * Create a new success story
   * @param {Object} storyData 
   */
  async createStory(storyData) {
    const res = await api.post('/stories', storyData);
    return res.data;
  },

  /**
   * Get filtered list of success stories
   * @param {Object} filters 
   */
  async getStories(filters = {}) {
    const params = new URLSearchParams();
    if (filters.company && filters.company !== 'All') params.append('company', filters.company);
    if (filters.role && filters.role !== 'All') params.append('role', filters.role);
    if (filters.experience_level && filters.experience_level !== 'All') params.append('experience_level', filters.experience_level);
    if (filters.salary_min) params.append('salary_min', filters.salary_min);
    if (filters.salary_max) params.append('salary_max', filters.salary_max);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const res = await api.get(`/stories?${params.toString()}`);
    return res.data;
  },

  /**
   * Get single story detail with comments and engagement
   * @param {number|string} storyId 
   */
  async getStoryDetail(storyId) {
    const res = await api.get(`/stories/${storyId}`);
    return res.data;
  },

  /**
   * Toggle upvote on a story
   * @param {number|string} storyId 
   */
  async upvoteStory(storyId) {
    const res = await api.post(`/stories/${storyId}/upvote`);
    return res.data;
  },

  /**
   * Track share and retrieve shareable links
   * @param {number|string} storyId 
   * @param {string} platform 
   */
  async shareStory(storyId, platform = 'generic') {
    const res = await api.post(`/stories/${storyId}/share?platform=${platform}`);
    return res.data;
  },

  /**
   * Add a community comment to a story
   * @param {number|string} storyId 
   * @param {string} commentText 
   * @param {number} rating 
   */
  async addComment(storyId, commentText, rating = 5) {
    const res = await api.post(`/stories/${storyId}/comments`, {
      comment_text: commentText,
      rating
    });
    return res.data;
  },

  /**
   * Report an inappropriate story
   * @param {number|string} storyId 
   * @param {string} reason 
   * @param {string} details 
   */
  async reportStory(storyId, reason, details = '') {
    const res = await api.post(`/stories/${storyId}/report`, {
      reason,
      details
    });
    return res.data;
  }
};

export default storyService;
