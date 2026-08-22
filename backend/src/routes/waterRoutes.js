// ============================================
// WATER ADVISORY ROUTES
// Express Router Configuration
// ============================================

const express = require('express');
const router = express.Router();
const { getWaterAdvisory, getChartData } = require('../controllers/waterAdvisoryController');
const { protect } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes (if needed)
router.post('/advisory', protect, getWaterAdvisory);
router.get('/charts', protect, getChartData);

/**
 * @route   POST /api/water/advisory
 * @desc    Get complete water advisory with charts
 * @access  Private (authenticated farmers)
 * @body    { cropType, cropStage, soilTexture, waterDrainage, soilMoisture, temperature, rainfall }
 */
router.post('/advisory', getWaterAdvisory);

/**
 * @route   GET /api/water/charts
 * @desc    Get chart data only (for dashboard refresh)
 * @access  Private
 * @query   cropType, cropStage, soilMoisture, soilTexture, temperature
 */
router.get('/charts', getChartData);

// ============================================
// EXPORTS
// ============================================
module.exports = router;