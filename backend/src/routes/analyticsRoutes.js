const express = require('express');
const router = express.Router();

// Import middleware
const { protect } = require('../middleware/authMiddleware');

// Import controller
const {
  getWaterUsageAnalytics,
  getIrrigationHistory,
  getSoilMoisture
} = require('../controllers/analyticsController');

// All analytics routes require authentication
router.use(protect);

/**
 * @route   GET /api/v1/analytics/water-usage
 * @desc    Get water usage analytics for date range
 * @access  Private
 */
router.get('/water-usage', getWaterUsageAnalytics);

/**
 * @route   GET /api/v1/analytics/irrigation-history
 * @desc    Get irrigation history
 * @access  Private
 */
router.get('/irrigation-history', getIrrigationHistory);

/**
 * @route   GET /api/v1/analytics/soil-moisture
 * @desc    Get soil moisture data
 * @access  Private
 */
router.get('/soil-moisture', getSoilMoisture);

module.exports = router;