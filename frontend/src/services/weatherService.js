import api from './api';

/**
 * Weather Service - API calls for weather data connecting to backend Weather API
 */
const weatherService = {
  /**
   * Get current weather by coordinates or city
   */
  getCurrentWeather: async (city, lat, lon) => {
    const params = {};
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else if (city) {
      params.city = city;
    }
    const response = await api.get('/weather/current', { params });
    return response.data;
  },

  /**
   * Get 7-day weather forecast by coordinates or city
   */
  getForecast: async (city, lat, lon) => {
    const params = {};
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else if (city) {
      params.city = city;
    }
    const response = await api.get('/weather/forecast', { params });
    return response.data;
  },

  /**
   * Get 5-day historical weather by coordinates
   */
  getWeatherHistory: async (lat, lon) => {
    const params = {};
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    const response = await api.get('/weather/history', { params });
    return response.data;
  },

  /**
   * Get full comprehensive weather context (Location + Current + 5-Day History + 7-Day Forecast + Agricultural Insights)
   */
  getWeatherContext: async (lat, lon, city) => {
    const params = {};
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else if (city) {
      params.city = city;
    }
    const response = await api.get('/weather/context', { params });
    return response.data;
  },

  /**
   * Get agricultural advisories
   */
  getAdvisories: async (lat, lon, cropType) => {
    const params = {};
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    if (cropType) params.cropType = cropType;
    const response = await api.get('/weather/advisory', { params });
    return response.data;
  },

  /**
   * Get severe weather alerts
   */
  getAlerts: async (lat, lon) => {
    const params = {};
    if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    }
    const response = await api.get('/weather/alerts', { params });
    return response.data;
  },
};

export default weatherService;