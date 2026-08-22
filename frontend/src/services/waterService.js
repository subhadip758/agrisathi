// ============================================
// WATER ADVISORY SERVICE
// Frontend API Service
// ============================================

import api from './api';

/**
 * Get water advisory from backend
 * @param {Object} inputs - Farmer inputs
 * @returns {Promise} - Advisory data
 */
export const getWaterAdvisory = async (inputs) => {
  try {
    const response = await api.post('/water/advisory', inputs);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to get water advisory' 
    };
  }
};

/**
 * Get chart data only
 * @param {Object} params - Query parameters
 * @returns {Promise} - Chart data
 */
export const getChartData = async (params) => {
  try {
    const response = await api.get('/water/charts', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to get chart data' 
    };
  }
};

export default {
  getWaterAdvisory,
  getChartData
};