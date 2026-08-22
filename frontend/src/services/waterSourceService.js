// ============================================
// WATER SOURCE SERVICE 
// API Service Layer
// ============================================

import api from './api';

const BASE_URL = '/water-sources';

/**
 * Get all water sources
 */
export const getAllWaterSources = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const url = params ? `${BASE_URL}?${params}` : BASE_URL;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to fetch water sources' 
    };
  }
};

/**
 * Get single water source by ID
 */
export const getWaterSourceById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to fetch water source' 
    };
  }
};

/**
 * Create new water source
 */
export const createWaterSource = async (sourceData) => {
  try {
    const response = await api.post(BASE_URL, sourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to create water source' 
    };
  }
};

/**
 * Update water source
 */
export const updateWaterSource = async (id, updateData) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to update water source' 
    };
  }
};

/**
 * Delete water source
 */
export const deleteWaterSource = async (id) => {
  try {
    const response = await api.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to delete water source' 
    };
  }
};

/**
 * Record water usage
 */
export const recordWaterUsage = async (id, usageData) => {
  try {
    const response = await api.post(`${BASE_URL}/${id}/use`, usageData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to record water usage' 
    };
  }
};

/**
 * Refill water source
 */
export const refillWaterSource = async (id, amount) => {
  try {
    const response = await api.post(`${BASE_URL}/${id}/refill`, { amount });
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to refill water source' 
    };
  }
};

/**
 * Get recommendation
 */
export const getRecommendation = async () => {
  try {
    const response = await api.get(`${BASE_URL}/recommendation`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to get recommendation' 
    };
  }
};

/**
 * Get farmer stats
 */
export const getFarmerStats = async () => {
  try {
    const response = await api.get(`${BASE_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to fetch statistics' 
    };
  }
};

/**
 * Get usage history
 */
export const getUsageHistory = async (id, days = 30) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}/history?days=${days}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to fetch usage history' 
    };
  }
};

/**
 * Get usage by source type
 */
export const getUsageBySourceType = async (days = 30) => {
  try {
    const response = await api.get(`${BASE_URL}/analytics/by-type?days=${days}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { 
      success: false, 
      message: 'Failed to fetch analytics' 
    };
  }
};

// ============================================
// EXPORTS
// ============================================

const waterSourceService = {
    getAllWaterSources,
  getWaterSourceById,
  createWaterSource,
  updateWaterSource,
  deleteWaterSource,
  recordWaterUsage,
  refillWaterSource,
  getRecommendation,
  getFarmerStats,
  getUsageHistory,
  getUsageBySourceType
  };

export default waterSourceService ;