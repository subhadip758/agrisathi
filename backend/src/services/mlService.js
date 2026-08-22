const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const { logger } = require('../utils/logger');

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

/**
 * ML Service - Integration with Python ML models
 * Handles communication with Flask/FastAPI ML service
 */
class MLService {
  constructor() {
    this.mlServiceUrl = ML_SERVICE_URL;
    this.timeout = 120000; // 2 minutes
  }

  /**
   * Get crop recommendation from ML model
   */
  async getCropRecommendation(data) {
    try {
      const response = await axios.post(`${this.mlServiceUrl}/api/crop-recommendation`, {
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium,
        temperature: data.temperature,
        humidity: data.humidity,
        ph: data.ph,
        rainfall: data.rainfall,
      }, {
        timeout: this.timeout,
      });

      logger.info('Crop prediction successful');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error in crop recommendation ML service:', error.message);
      throw new Error('Failed to get crop recommendation from ML service');
    }
  }

  /**
   * Predict crop recommendation (alias for backward compatibility)
   */
  async predictCrop(data) {
    return await this.getCropRecommendation(data);
  }

  /**
   * Analyze soil and get predictions
   */
  async analyzeSoil(soilData) {
    try {
      const response = await axios.post(`${this.mlServiceUrl}/api/soil-analysis`, {
        nitrogen: soilData.nitrogen,
        phosphorus: soilData.phosphorus,
        potassium: soilData.potassium,
        ph: soilData.ph,
        organicCarbon: soilData.organicCarbon,
        electricalConductivity: soilData.electricalConductivity,
      }, {
        timeout: this.timeout,
      });

      logger.info('Soil prediction successful');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error in soil analysis ML service:', error.message);
      throw new Error('Failed to analyze soil from ML service');
    }
  }

  /**
   * Predict soil quality (alias for backward compatibility)
   */
  async predictSoil(data) {
    return await this.analyzeSoil(data);
  }

  /**
   * Detect plant disease from image
   */
  async detectDisease(imagePath) {
    try {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));

      const response = await axios.post(
        `${this.mlServiceUrl}/api/disease-detection`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 60000, // 60 seconds for image processing
        }
      );

      logger.info('Disease detection successful');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error in disease detection ML service:', error.message);
      throw new Error('Failed to detect disease from ML service');
    }
  }

  /**
   * Predict crop yield
   */
  async predictYield(yieldData) {
    try {
      const response = await axios.post(`${this.mlServiceUrl}/api/yield-prediction`, {
        crop: yieldData.crop,
        season: yieldData.season,
        area: yieldData.area,
        rainfall: yieldData.rainfall,
        temperature: yieldData.temperature,
        humidity: yieldData.humidity,
        ph: yieldData.ph,
        nitrogen: yieldData.nitrogen,
        phosphorus: yieldData.phosphorus,
        potassium: yieldData.potassium,
      }, {
        timeout: this.timeout,
      });

      logger.info('Yield prediction successful');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error in yield prediction ML service:', error.message);
      throw new Error('Failed to predict yield from ML service');
    }
  }

  /**
   * Predict irrigation need using ML ensemble model (98% accuracy)
   * Sends cropType + cropDays to unlock full ML path in routes.py
   */
  async optimizeIrrigation(irrigationData) {
    try {
      const response = await axios.post(`${this.mlServiceUrl}/api/irrigation/predict`, {
        soilMoisture:  irrigationData.soilMoisture,
        temperature:   irrigationData.temperature,
        humidity:      irrigationData.humidity,
        cropType:      irrigationData.cropType  || 'Wheat',   // ← enables ML path
        cropDays:      irrigationData.cropDays  || 45,        // ← enables ML path
        rainfall:      irrigationData.rainfall  || 0,
        soilType:      irrigationData.soilType  || 'loamy',
      }, {
        timeout: this.timeout,
      });

      logger.info('Irrigation prediction successful');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error in irrigation prediction ML service:', error.message);
      throw new Error('Failed to predict irrigation from ML service');
    }
  }

  /**
   * Get 30-day irrigation roadmap using ML ensemble model
   * Returns daily schedule with soil moisture simulation, volume, and advisory
   */
  async getIrrigationSchedule(irrigationData) {
    try {
      const response = await axios.post(
        `${this.mlServiceUrl}/api/irrigation/schedule-recommendation`,
        {
          cropType:      irrigationData.cropType     || 'Wheat',
          cropDays:      irrigationData.cropDays     || 45,
          soilMoisture:  irrigationData.soilMoisture || 50,
          temperature:   irrigationData.temperature  || 25,
          humidity:      irrigationData.humidity     || 60,
          soilType:      irrigationData.soilType     || 'loamy',
          area:          irrigationData.area         || 1,
          forecastDays:  irrigationData.forecastDays || 30,
        },
        { timeout: this.timeout }
      );

      logger.info('Irrigation schedule generated successfully');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error in irrigation schedule ML service:', error.message);
      throw new Error('Failed to get irrigation schedule from ML service');
    }
  }

  /**
   * Predict crop price for marketplace
   * @param {Object} params - Price prediction parameters
   * @param {string} params.crop - Crop type
   * @param {string} params.district - District name
   * @param {string} params.state - State name
   * @param {string} params.date - Date for prediction (optional)
   * @returns {Object} Price prediction with min, max, and confidence
   */
  async predictPrice({ crop, district, state, date }) {
    try {
      const response = await axios.post(
        `${this.mlServiceUrl}/api/predict-price`,
        {
          crop_type: crop,
          district: district,
          state: state,
          date: date || new Date().toISOString().split('T')[0],
        },
        {
          timeout: this.timeout,
        }
      );

      logger.info('Price prediction successful for', crop, 'in', district, state);
      return {
        success: true,
        predictedPrice: response.data.predicted_price,
        minPrice: response.data.min_price,
        maxPrice: response.data.max_price,
        confidence: response.data.confidence,
      };
    } catch (error) {
      logger.error('Error in price prediction ML service:', error.message);
      return {
        success: false,
        predictedPrice: null,
        minPrice: null,
        maxPrice: null,
        confidence: 0,
        error: error.message,
      };
    }
  }

  /**
   * Check ML service health
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${this.mlServiceUrl}/health`, {
        timeout: 5000,
      });

      return {
        success: true,
        status: response.data.status || 'healthy',
        message: 'ML service is healthy',
      };
    } catch (error) {
      logger.error('ML service health check failed:', error.message);
      return {
        success: false,
        status: 'unhealthy',
        message: 'ML service is not responding',
      };
    }
  }

  /**
   * Get model information
   */
  async getModelInfo(modelType) {
    try {
      const response = await axios.get(`${this.mlServiceUrl}/api/models/${modelType}/info`, {
        timeout: 5000,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      logger.error('Error getting model info:', error.message);
      return {
        success: false,
        modelType,
        status: 'unavailable',
        error: error.message
      };
    }
  }
}

module.exports = new MLService();