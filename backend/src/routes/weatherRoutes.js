const express = require('express');
const router = express.Router();

const {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherHistory,
  getWeatherContext,
  getAgriculturalAdvisory,
  getSevereWeatherAlerts
} = require('../controllers/weatherAdvisoryController');

const { optionalAuth } = require('../middleware/authMiddleware');

// Public routes (optional auth for tracking activity)
router.get('/current', optionalAuth, getCurrentWeather);
router.get('/forecast', optionalAuth, getWeatherForecast);
router.get('/history', optionalAuth, getWeatherHistory);
router.get('/context', optionalAuth, getWeatherContext);
router.get('/advisory', optionalAuth, getAgriculturalAdvisory);
router.get('/alerts', getSevereWeatherAlerts);

module.exports = router;