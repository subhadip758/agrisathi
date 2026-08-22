import api from './api';

const API_BASE = '/irrigation/rule-based';

/**
 * Generate a new rule-based irrigation schedule
 */
export const generateSchedule = async (formData) => {
  try {
    const response = await api.post(`${API_BASE}/generate`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get user's irrigation schedules
 */
export const getUserSchedules = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`${API_BASE}/schedules?${params}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get active irrigation schedule
 */
export const getActiveSchedule = async () => {
  try {
    const response = await api.get(`${API_BASE}/active`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get specific schedule by ID
 */
export const getScheduleById = async (scheduleId) => {
  try {
    const response = await api.get(`${API_BASE}/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Update irrigation schedule
 */
export const updateSchedule = async (scheduleId, updates) => {
  try {
    const response = await api.put(`${API_BASE}/schedule/${scheduleId}`, updates);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Deactivate schedule
 */
export const deactivateSchedule = async (scheduleId) => {
  try {
    const response = await api.delete(`${API_BASE}/schedule/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Add user feedback to schedule
 */
export const addFeedback = async (scheduleId, feedback) => {
  try {
    const response = await api.post(`${API_BASE}/schedule/${scheduleId}/feedback`, feedback);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get quick recommendation without saving
 */
export const getQuickRecommendation = async (data) => {
  try {
    const response = await api.post(`${API_BASE}/quick-recommendation`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get all available crops
 */
export const getAvailableCrops = async () => {
  try {
    const response = await api.get(`${API_BASE}/crops`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get specific crop information
 */
export const getCropInformation = async (cropName) => {
  try {
    const response = await api.get(`${API_BASE}/crop/${cropName}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const ruleBasedIrrigationService = {
  generateSchedule,
  getUserSchedules,
  getActiveSchedule,
  getScheduleById,
  updateSchedule,
  deactivateSchedule,
  addFeedback,
  getQuickRecommendation,
  getAvailableCrops,
  getCropInformation
};

export default ruleBasedIrrigationService;