import api from './api';

// ── Shared error helper ───────────────────────────────────────
const handle = (error, fallback) => {
  throw error.response?.data || { message: fallback };
};

const yieldService = {

  // ============================================================
  //  PREDICTION
  // ============================================================

  /**
   * Advanced / ML yield prediction powered by Claude AI.
   * Requires soil test data: NPK, pH, temperature, humidity, rainfall.
   * @param {Object} predictionData - { cropDetails, inputFactors, location }
   */
  predictYieldML: async (predictionData) => {
    try {
      const response = await api.post('/yield/predict/advanced', predictionData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to predict yield using ML model');
    }
  },

  /**
   * Farmer-friendly yield estimation powered by Claude AI.
   * Observation-based — no lab data required.
   * @param {Object} estimationData - { crop, growthStage, plantHealth, ... }
   */
  estimateYieldSimple: async (estimationData) => {
    try {
      const response = await api.post('/yield/predict/simple', estimationData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to estimate yield');
    }
  },

  /**
   * @deprecated Use predictYieldML or estimateYieldSimple instead.
   * Legacy route — delegates to advanced ML mode.
   */
  predictYield: async (predictionData) => {
    try {
      const response = await api.post('/yield/predict', predictionData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to predict yield');
    }
  },

  // ============================================================
  //  HISTORY & RETRIEVAL
  // ============================================================

  /**
   * Get authenticated user's prediction history.
   * @param {Object} params - { page, limit, cropType, status, mode }
   */
  getPredictions: async (params = {}) => {
    try {
      const response = await api.get('/yield/history', { params });
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch yield predictions');
    }
  },

  /** Alias for getPredictions — kept for analytics consumers. */
  getYieldHistory: async (params = {}) => {
    try {
      const response = await api.get('/yield/history', { params });
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch yield history');
    }
  },

  /**
   * Get a single prediction by Mongo _id or predictionId string.
   * @param {string} predictionId
   */
  getPredictionById: async (predictionId) => {
    try {
      const response = await api.get(`/yield/${predictionId}`);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch yield prediction');
    }
  },

  /**
   * Get all predictions for a specific crop type (public).
   * @param {string} cropType
   */
  getPredictionsByCrop: async (cropType) => {
    try {
      const response = await api.get(`/yield/crop/${cropType}`);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch crop predictions');
    }
  },

  // ============================================================
  //  STATISTICS & ANALYTICS
  // ============================================================

  /**
   * Get accuracy statistics from the backend.
   * @param {Object} params - { mode: 'ml' | 'simple' }
   */
  getYieldStatistics: async (params = {}) => {
    try {
      const response = await api.get('/yield/stats/accuracy', { params });
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch yield statistics');
    }
  },

  /**
   * Get mode usage statistics (simple vs ML) — uses backend accuracy endpoint.
   * Replaces the old client-side approach that fetched 1000 records.
   * @param {string|null} mode - optional filter: 'simple' | 'ml'
   */
  getModeStatistics: async (mode = null) => {
    try {
      const params = mode ? { mode } : {};
      const response = await api.get('/yield/stats/accuracy', { params });
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch mode statistics');
    }
  },

  /**
   * Get yield trends for a crop over time.
   * @param {string} cropType
   * @param {Object} params - { months } (default 12)
   */
  getSeasonalTrends: async (cropType, params = {}) => {
    try {
      const response = await api.get(`/yield/trends/${cropType}`, { params });
      return response.data;
    } catch (error) {
      handle(error, 'Failed to fetch seasonal trends');
    }
  },

  /**
   * Compare a prediction against the regional average.
   * Works for both simple and ML predictions.
   * @param {Object} comparisonData - { predictionId, regionalAverage }
   */
  compareWithRegional: async (comparisonData) => {
    try {
      const response = await api.post('/yield/compare-regional', comparisonData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to compare with regional average');
    }
  },

  /**
   * Compare simple vs ML prediction accuracy for a given crop.
   * Uses harvested records to compute real deviation stats per mode.
   * @param {string} cropType
   */
  compareModePredictions: async (cropType) => {
    try {
      const response = await api.get(`/yield/compare-modes/${cropType}`);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to compare prediction modes');
    }
  },

  /**
   * Get economic analysis (revenue, profit, ROI, break-even).
   * Works for both simple and ML predictions.
   * @param {Object} economicData - { predictionId, marketPrice, estimatedCost }
   */
  getEconomicAnalysis: async (economicData) => {
    try {
      const response = await api.post('/yield/economic-analysis', economicData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to get economic analysis');
    }
  },

  // ============================================================
  //  UPDATE & MANAGEMENT
  // ============================================================

  /**
   * Record actual harvest yield for accuracy tracking.
   * @param {string} predictionId
   * @param {Object} actualData - { actualYield, harvestDate, notes }
   */
  recordActualYield: async (predictionId, actualData) => {
    try {
      const response = await api.post(`/yield/${predictionId}/actual`, actualData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to record actual yield');
    }
  },

  /**
   * Append a risk assessment entry to a prediction.
   * @param {string} predictionId
   * @param {Object} riskData - { type, description, severity, probability, mitigation }
   */
  addRisk: async (predictionId, riskData) => {
    try {
      const response = await api.post(`/yield/${predictionId}/risks`, riskData);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to add risk');
    }
  },

  /**
   * Update prediction lifecycle status.
   * @param {string} predictionId
   * @param {string} status - 'predicted' | 'monitored' | 'harvested' | 'archived'
   */
  updateStatus: async (predictionId, status) => {
    try {
      const response = await api.put(`/yield/${predictionId}/status`, { status });
      return response.data;
    } catch (error) {
      handle(error, 'Failed to update status');
    }
  },

  /**
   * Delete a yield prediction (owner or admin only).
   * @param {string} predictionId
   */
  deletePrediction: async (predictionId) => {
    try {
      const response = await api.delete(`/yield/${predictionId}`);
      return response.data;
    } catch (error) {
      handle(error, 'Failed to delete yield prediction');
    }
  },

  // ============================================================
  //  CLIENT-SIDE HELPERS  (no API calls)
  // ============================================================

  /**
   * Validate simple mode form data before submission.
   * @param {Object} formData
   * @returns {{ isValid: boolean, errors: Object }}
   */
  validateSimpleInput: (formData) => {
    const errors = {};
    if (!formData.crop)        errors.crop        = 'Crop type is required';
    if (!formData.growthStage) errors.growthStage = 'Growth stage is required';
    if (formData.farmSize && formData.farmSize <= 0) {
      errors.farmSize = 'Farm size must be greater than 0';
    }
    return { isValid: Object.keys(errors).length === 0, errors };
  },

  /**
   * Format a yield value for display.
   * @param {number} value
   * @param {string} unit
   * @returns {string}
   */
  formatYield: (value, unit = 'kg') => {
    if (!value && value !== 0) return 'N/A';
    return `${Number(value).toLocaleString()} ${unit}`;
  },

  /**
   * Return a Tailwind class pair for a confidence level.
   * @param {string} confidence - 'Very High' | 'High' | 'Medium' | 'Low'
   * @returns {string}
   */
  getConfidenceColor: (confidence) => {
    const map = {
      'Very High': 'text-green-700 bg-green-100',
      'High':      'text-green-600 bg-green-100',
      'Medium':    'text-yellow-600 bg-yellow-100',
      'Low':       'text-red-600   bg-red-100'
    };
    return map[confidence] || 'text-gray-600 bg-gray-100';
  },

  /**
   * Return a Tailwind gradient class for a yield category.
   * @param {string} category - 'Excellent' | 'Good' | 'Average' | 'Below Average' | 'Poor'
   * @returns {string}
   */
  getCategoryGradient: (category) => {
    const map = {
      'Excellent':    'from-green-500 to-green-600',
      'Good':         'from-green-400 to-green-500',
      'Average':      'from-yellow-400 to-yellow-500',
      'Below Average':'from-orange-400 to-orange-500',
      'Poor':         'from-red-400   to-red-500'
    };
    return map[category] || 'from-gray-400 to-gray-500';
  }
};

export default yieldService;