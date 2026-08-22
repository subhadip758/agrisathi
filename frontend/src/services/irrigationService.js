import api from './api';

// ML Service URL - make sure to add this to your .env file
const ML_SERVICE_URL = process.env.REACT_APP_ML_SERVICE_URL || 'http://localhost:8000';

const irrigationService = {
  /**
   * Create irrigation schedule based on crop and environmental data
   * @param {Object} irrigationData - Irrigation parameters
   * @returns {Promise<Object>} Irrigation schedule
   */
  createSchedule: async (irrigationData) => {
    try {
      const response = await api.post('/irrigation/schedule', irrigationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create irrigation schedule' };
    }
  },

  getIrrigationSchedule: async (formData) => {
    try {
      const response = await api.post('/irrigation/schedule', formData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get irrigation schedule' };
    }
  },

  /**
   * Get all irrigation schedules for the user
   * @param {Object} params - Query parameters (page, limit, cropType, etc.)
   * @returns {Promise<Object>} List of irrigation schedules
   */
  getSchedules: async (params = {}) => {
    try {
      const response = await api.get('/irrigation/schedules', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch irrigation schedules' };
    }
  },

  /**
   * Get a specific irrigation schedule by ID
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise<Object>} Irrigation schedule details
   */
  getScheduleById: async (scheduleId) => {
    try {
      const response = await api.get(`/irrigation/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch irrigation schedule' };
    }
  },

  /**
   * Update an existing irrigation schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} updateData - Updated schedule data
   * @returns {Promise<Object>} Updated schedule
   */
  updateSchedule: async (scheduleId, updateData) => {
    try {
      const response = await api.put(`/irrigation/schedule/${scheduleId}`, updateData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update irrigation schedule' };
    }
  },

  /**
   * Delete an irrigation schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteSchedule: async (scheduleId) => {
    try {
      const response = await api.delete(`/irrigation/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete irrigation schedule' };
    }
  },

  /**
   * Get optimized irrigation recommendations using ML
   * @param {Object} optimizationData - Data for optimization (soil moisture, weather, crop type)
   * @returns {Promise<Object>} Optimized irrigation recommendations
   */
  getOptimizedRecommendation: async (optimizationData) => {
    try {
      const response = await api.post('/irrigation/optimize', optimizationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get optimized recommendations' };
    }
  },

  // ==================== ML INTEGRATION FUNCTIONS ====================

  /**
   * Get ML-based irrigation prediction (routes through backend — auth protected)
   * Uses ensemble model: XGBoost + RandomForest + GradientBoosting + LightGBM (98% accuracy)
   *
   * @param {Object} data - Environmental conditions
   * @param {number} data.soilMoisture - Current soil moisture (%)
   * @param {number} data.temperature  - Temperature (°C)
   * @param {number} data.humidity     - Humidity (%)
   * @param {number} data.rainfall     - Recent rainfall (mm, optional)
   * @param {string} data.cropType     - Crop type — enables full ML path (e.g. "Wheat")
   * @param {number} data.cropDays     - Days since sowing — enables full ML path
   * @param {string} data.soilType     - Soil type (optional)
   * @returns {Promise<Object>} ML prediction with needsIrrigation, confidence, volume, urgency, cropStage
   */
  getPrediction: async (data) => {
    try {
      const response = await api.post('/irrigation/ml/predict', {
        soilMoisture: data.soilMoisture,
        temperature:  data.temperature,
        humidity:     data.humidity,
        rainfall:     data.rainfall  || 0,
        cropType:     data.cropType  || data.cropStage || 'Wheat',
        cropDays:     data.cropDays  || 45,
        soilType:     data.soilType  || 'loamy',
      });
      return response.data;
    } catch (error) {
      console.error('ML Prediction Error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get 30-day ML irrigation roadmap (routes through backend — auth protected)
   * Returns daily schedule with soil moisture simulation, volume, advisory per day.
   *
   * @param {Object} data
   * @param {string} data.cropType     - Crop type
   * @param {number} data.cropDays     - Days since sowing
   * @param {number} data.soilMoisture - Current soil moisture (%)
   * @param {number} data.temperature  - Temperature (°C)
   * @param {number} data.humidity     - Humidity (%)
   * @param {string} data.soilType     - Soil type
   * @param {number} data.area         - Field area in acres
   * @param {number} data.forecastDays - Days to forecast (default 30)
   * @returns {Promise<Object>} { summary, dailySchedule, cropTips, irrigationSystem, ... }
   */
  getMLRoadmap: async (data) => {
    try {
      const response = await api.post('/irrigation/ml/roadmap', {
        cropType:     data.cropType     || 'Wheat',
        cropDays:     data.cropDays     || 45,
        soilMoisture: data.soilMoisture || 50,
        temperature:  data.temperature  || 25,
        humidity:     data.humidity     || 60,
        soilType:     data.soilType     || 'loamy',
        area:         data.area         || 1,
        forecastDays: data.forecastDays || 30,
      });
      return response.data;
    } catch (error) {
      console.error('ML Roadmap Error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get ML-based schedule recommendations (routes through backend — auth protected)
   *
   * @param {Object} data
   * @param {string} data.cropType     - Type of crop
   * @param {string} data.soilType     - Type of soil
   * @param {number} data.area         - Farm area in acres
   * @param {number} data.cropDays     - Days since sowing
   * @param {number} data.soilMoisture - Current soil moisture (%)
   * @param {number} data.temperature  - Temperature (°C)
   * @param {number} data.humidity     - Humidity (%)
   * @returns {Promise<Object>} ML schedule with dailySchedule, summary, cropTips
   */
  getMLRecommendation: async (data) => {
    try {
      const response = await api.post('/irrigation/ml/roadmap', {
        cropType:     data.cropType     || 'Wheat',
        cropDays:     data.cropDays     || 45,
        soilMoisture: data.soilMoisture || 50,
        temperature:  data.temperature  || 25,
        humidity:     data.humidity     || 60,
        soilType:     data.soilType     || data.climateZone || 'loamy',
        area:         data.area         || 1,
        forecastDays: 30,
      });
      return response.data;
    } catch (error) {
      console.error('ML Recommendation Error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * Get comprehensive AI analysis — prediction + 30-day roadmap in parallel
   * @param {Object} data - Complete environmental and crop data
   * @returns {Promise<Object>} { prediction, recommendation, roadmapSummary, dailySchedule, cropTips, modelVersion }
   */
  getAIAnalysis: async (data) => {
    try {
      const [predResult, roadmapResult] = await Promise.all([
        irrigationService.getPrediction({
          soilMoisture: data.soilMoisture,
          temperature:  data.temperature,
          humidity:     data.humidity,
          rainfall:     data.rainfall,
          cropType:     data.cropType,
          cropDays:     data.cropDays,
          soilType:     data.soilType,
        }),
        irrigationService.getMLRoadmap({
          cropType:     data.cropType,
          cropDays:     data.cropDays,
          soilMoisture: data.soilMoisture,
          temperature:  data.temperature,
          humidity:     data.humidity,
          soilType:     data.soilType,
          area:         data.area,
          forecastDays: data.forecastDays || 30,
        }),
      ]);

      return {
        prediction:     predResult.prediction,
        recommendation: roadmapResult.recommendation,
        roadmapSummary: roadmapResult.recommendation?.summary      || null,
        dailySchedule:  roadmapResult.recommendation?.dailySchedule || [],
        cropTips:       roadmapResult.recommendation?.cropTips      || [],
        modelVersion:   predResult.model_version || '1.0.0',
        algorithm:      predResult.algorithm     || 'ensemble',
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      throw error;
    }
  },

  /**
   * Generate & save ML-based irrigation schedule to DB
   * @param {Object} data - { scheduleName, cropDetails, soilInformation, location, duration }
   * @returns {Promise<Object>} Saved schedule with roadmapSummary, cropTips, urgency
   */
  generateMLSchedule: async (data) => {
    try {
      const response = await api.post('/irrigation/ml/generate', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate ML schedule' };
    }
  },

  /**
   * Get all ML-generated schedules saved to DB
   */
  getMLSchedules: async (params = {}) => {
    try {
      const response = await api.get('/irrigation/ml/schedules', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch ML schedules' };
    }
  },

  // ==================== END ML INTEGRATION ====================

  // ==================== RULE-BASED IRRIGATION METHODS (NEW) ====================

  /**
   * Generate rule-based irrigation schedule
   * @param {Object} data - Farm and environmental data
   * @returns {Promise<Object>} Rule-based schedule
   */
  generateRuleBasedSchedule: async (data) => {
    try {
      const response = await api.post('/irrigation/rule-based/generate', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate rule-based schedule' };
    }
  },

  /**
   * Get user's rule-based irrigation schedules
   * @param {Object} params - Query parameters (isActive, cropType, limit)
   * @returns {Promise<Object>} List of rule-based schedules
   */
  getRuleBasedSchedules: async (params = {}) => {
    try {
      const response = await api.get('/irrigation/rule-based/schedules', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch rule-based schedules' };
    }
  },

  /**
   * Get active rule-based schedule
   * @returns {Promise<Object>} Active schedule
   */
  getActiveRuleBasedSchedule: async () => {
    try {
      const response = await api.get('/irrigation/rule-based/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch active schedule' };
    }
  },

  /**
   * Get specific rule-based schedule by ID
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise<Object>} Schedule details
   */
  getRuleBasedScheduleById: async (scheduleId) => {
    try {
      const response = await api.get(`/irrigation/rule-based/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch schedule' };
    }
  },

  /**
   * Update rule-based schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object>} Updated schedule
   */
  updateRuleBasedSchedule: async (scheduleId, updates) => {
    try {
      const response = await api.put(`/irrigation/rule-based/schedule/${scheduleId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update schedule' };
    }
  },

  /**
   * Deactivate rule-based schedule
   * @param {string} scheduleId - Schedule ID
   * @returns {Promise<Object>} Deactivation confirmation
   */
  deactivateRuleBasedSchedule: async (scheduleId) => {
    try {
      const response = await api.delete(`/irrigation/rule-based/schedule/${scheduleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to deactivate schedule' };
    }
  },

  /**
   * Add feedback to rule-based schedule
   * @param {string} scheduleId - Schedule ID
   * @param {Object} feedback - Feedback data (rating, comment, effectiveness)
   * @returns {Promise<Object>} Updated schedule
   */
  addRuleBasedFeedback: async (scheduleId, feedback) => {
    try {
      const response = await api.post(`/irrigation/rule-based/schedule/${scheduleId}/feedback`, feedback);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add feedback' };
    }
  },

  /**
   * Get quick irrigation recommendation without saving
   * @param {Object} data - Basic farm data
   * @returns {Promise<Object>} Quick recommendation
   */
  getQuickRuleBasedRecommendation: async (data) => {
    try {
      const response = await api.post('/irrigation/rule-based/quick-recommendation', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get recommendation' };
    }
  },

  /**
   * Get all available crops for rule-based planning
   * @returns {Promise<Object>} List of crops
   */
  getAvailableCrops: async () => {
    try {
      const response = await api.get('/irrigation/rule-based/crops');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch crops' };
    }
  },

  /**
   * Get specific crop information
   * @param {string} cropName - Name of the crop
   * @returns {Promise<Object>} Crop details
   */
  getCropInformation: async (cropName) => {
    try {
      const response = await api.get(`/irrigation/rule-based/crop/${cropName}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch crop information' };
    }
  },

  /**
   * Get all schedules (both ML and Rule-based)
   * @returns {Promise<Object>} Combined schedules
   */
  getAllSchedules: async () => {
    try {
      const response = await api.get('/irrigation/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch all schedules' };
    }
  },

  /**
   * Compare ML and Rule-based schedules
   * @param {string} mlId - ML schedule ID
   * @param {string} ruleId - Rule-based schedule ID
   * @returns {Promise<Object>} Comparison data
   */
  compareSchedules: async (mlId, ruleId) => {
    try {
      const response = await api.get(`/irrigation/compare/${mlId}/${ruleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to compare schedules' };
    }
  },

  // ==================== END RULE-BASED METHODS ====================

  /**
   * Mark irrigation task as completed
   * @param {string} scheduleId - Schedule ID
   * @param {Object} completionData - Completion details (date, amount used, notes)
   * @returns {Promise<Object>} Updated schedule
   */
  markAsCompleted: async (scheduleId, completionData) => {
    try {
      const response = await api.post(`/irrigation/schedule/${scheduleId}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to mark irrigation as completed' };
    }
  },

  /**
   * Get irrigation history for analytics
   * @param {Object} params - Query parameters (startDate, endDate, cropType)
   * @returns {Promise<Object>} Irrigation history data
   */
  getIrrigationHistory: async (params = {}) => {
    try {
      const response = await api.get('/irrigation/history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch irrigation history' };
    }
  },

  /**
   * Get current soil moisture levels
   * @param {string} locationId - Location or field ID
   * @returns {Promise<Object>} Soil moisture data
   */
  getSoilMoisture: async (locationId) => {
    try {
      const response = await api.get(`/irrigation/soil-moisture/${locationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch soil moisture data' };
    }
  },

  /**
   * Calculate water requirements for a crop
   * @param {Object} cropData - Crop details (type, stage, area, location)
   * @returns {Promise<Object>} Water requirement calculation
   */
  calculateWaterRequirement: async (cropData) => {
    try {
      const response = await api.post('/irrigation/calculate-requirement', cropData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to calculate water requirement' };
    }
  },

  /**
   * Get upcoming irrigation tasks
   * @param {number} days - Number of days to look ahead (default: 7)
   * @returns {Promise<Object>} Upcoming irrigation tasks
   */
  getUpcomingTasks: async (days = 7) => {
    try {
      const response = await api.get('/irrigation/upcoming', { params: { days } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch upcoming tasks' };
    }
  }
};

export default irrigationService;