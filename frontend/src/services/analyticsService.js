import api from './api';

/**
 * Analytics Service - API calls for water and irrigation analytics
 */
const analyticsService = {
  /**
   * Get water usage analytics for a date range
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   */
  getWaterUsageAnalytics: async (startDate, endDate) => {
    try {
      const response = await api.get('/analytics/water-usage', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching water usage analytics:', error);
      throw error;
    }
  },

  /**
   * Get water analytics data
   */
  getWaterAnalytics: async () => {
    try {
      const response = await api.get('/analytics/water');
      return response.data;
    } catch (error) {
      console.error('Error fetching water analytics:', error);
      throw error;
    }
  },

  /**
   * Get irrigation history
   * @param {Object} params - Query parameters
   */
  getIrrigationHistory: async (params) => {
    try {
      const response = await api.get('/analytics/irrigation-history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching irrigation history:', error);
      throw error;
    }
  },

  /**
   * Get soil moisture data
   */
  getSoilMoistureData: async () => {
    try {
      const response = await api.get('/analytics/soil-moisture');
      return response.data;
    } catch (error) {
      console.error('Error fetching soil moisture data:', error);
      throw error;
    }
  },

  /**
   * Get water usage statistics
   * @param {string} period - Time period for stats
   */
  getWaterUsageStats: async (period) => {
    try {
      const response = await api.get('/analytics/water-usage-stats', {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching water usage stats:', error);
      throw error;
    }
  },
};

export default analyticsService;