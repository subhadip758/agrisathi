const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { successResponse } = require('../utils/helpers');
const { logUserActivity } = require('../utils/logger');
const weatherService = require('../services/weatherService');

/**
 * @desc    Get current weather with automatic coordinates & reverse geocoding
 * @route   GET /api/v1/weather/current
 * @access  Public
 */
exports.getCurrentWeather = asyncHandler(async (req, res, next) => {
  const { lat, lon, city } = req.query;

  let compResult;
  try {
    if (city) {
      compResult = await weatherService.getCurrentWeatherByCity(city);
    } else {
      const latitude = Number(lat) || 26.7271;
      const longitude = Number(lon) || 88.3953;
      compResult = await weatherService.getComprehensiveWeather(latitude, longitude);
    }
  } catch (err) {
    compResult = await weatherService.getFallbackWeather(Number(lat) || 26.7271, Number(lon) || 88.3953);
  }

  const d = compResult?.data || {};

  successResponse(res, 200, 'Current weather retrieved successfully', {
    weather: {
      location: d.location || { formattedName: 'Siliguri, West Bengal, India' },
      current: d.current || {},
      timestamp: d.current?.timestamp || new Date(),
    },
    advisory: d.agriculturalInsights?.alerts || []
  });
});

/**
 * @desc    Get 7-day weather forecast
 * @route   GET /api/v1/weather/forecast
 * @access  Public
 */
exports.getWeatherForecast = asyncHandler(async (req, res, next) => {
  const { lat, lon, city } = req.query;

  let compResult;
  try {
    if (city) {
      compResult = await weatherService.getCurrentWeatherByCity(city);
    } else {
      const latitude = Number(lat) || 26.7271;
      const longitude = Number(lon) || 88.3953;
      compResult = await weatherService.getComprehensiveWeather(latitude, longitude);
    }
  } catch (err) {
    compResult = await weatherService.getFallbackWeather(Number(lat) || 26.7271, Number(lon) || 88.3953);
  }

  const d = compResult?.data || {};

  successResponse(res, 200, 'Weather forecast retrieved successfully', {
    location: d.location || { formattedName: 'Siliguri, West Bengal, India' },
    dailyForecast: d.forecast || [],
    forecast: {
      location: d.location || {},
      forecast: d.forecast || [],
    },
    recommendations: d.agriculturalInsights?.alerts || []
  });
});

/**
 * @desc    Get genuine previous 5 days historical weather
 * @route   GET /api/v1/weather/history
 * @access  Public
 */
exports.getWeatherHistory = asyncHandler(async (req, res, next) => {
  const { lat, lon } = req.query;
  const latitude = Number(lat) || 26.7271;
  const longitude = Number(lon) || 88.3953;

  let compResult;
  try {
    compResult = await weatherService.getComprehensiveWeather(latitude, longitude);
  } catch (err) {
    compResult = await weatherService.getFallbackWeather(latitude, longitude);
  }

  const d = compResult?.data || {};

  successResponse(res, 200, 'Historical weather retrieved successfully', {
    location: d.location || { formattedName: 'Siliguri, West Bengal, India' },
    history: d.history || [],
  });
});

/**
 * @desc    Get full unified weather context (Current + 5-day History + 7-day Forecast + Agricultural Insights)
 * @route   GET /api/v1/weather/context
 * @access  Public
 */
exports.getWeatherContext = asyncHandler(async (req, res, next) => {
  const { lat, lon, city } = req.query;

  let compResult;
  try {
    if (city) {
      compResult = await weatherService.getCurrentWeatherByCity(city);
    } else {
      const latitude = Number(lat) || 26.7271;
      const longitude = Number(lon) || 88.3953;
      compResult = await weatherService.getComprehensiveWeather(latitude, longitude);
    }
  } catch (err) {
    compResult = await weatherService.getFallbackWeather(Number(lat) || 26.7271, Number(lon) || 88.3953);
  }

  successResponse(res, 200, 'Full weather context retrieved successfully', compResult?.data || {});
});

/**
 * @desc    Get agricultural advisory based on full weather context
 * @route   GET /api/v1/weather/advisory
 * @access  Public
 */
exports.getAgriculturalAdvisory = asyncHandler(async (req, res, next) => {
  const { lat, lon, cropType } = req.query;
  const latitude = Number(lat) || 26.7271;
  const longitude = Number(lon) || 88.3953;

  let compResult;
  try {
    compResult = await weatherService.getComprehensiveWeather(latitude, longitude);
  } catch (err) {
    compResult = await weatherService.getFallbackWeather(latitude, longitude);
  }

  const d = compResult?.data || {};
  const insights = d.agriculturalInsights || {};

  successResponse(res, 200, 'Agricultural advisory generated successfully', {
    advisory: {
      location: d.location || {},
      currentConditions: d.current || {},
      alerts: insights.alerts || [],
      insights,
      cropType: cropType || 'General Crop',
    }
  });
});

/**
 * @desc    Get severe weather alerts
 * @route   GET /api/v1/weather/alerts
 * @access  Public
 */
exports.getSevereWeatherAlerts = asyncHandler(async (req, res, next) => {
  const { lat, lon } = req.query;
  const latitude = Number(lat) || 26.7271;
  const longitude = Number(lon) || 88.3953;

  let compResult;
  try {
    compResult = await weatherService.getComprehensiveWeather(latitude, longitude);
  } catch (err) {
    compResult = await weatherService.getFallbackWeather(latitude, longitude);
  }

  const d = compResult?.data || {};
  const alerts = (d.agriculturalInsights?.alerts || []).filter(a => a.priority === 'critical' || a.priority === 'high');

  successResponse(res, 200, 'Severe weather alerts retrieved successfully', { alerts });
});