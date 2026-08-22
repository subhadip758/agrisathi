const express = require('express');
const router = express.Router();

// Import controllers
const {
  predictYieldML,          // RENAMED from predictYield
  estimateYieldSimple,     // NEW
  getPredictionHistory,
  getPredictionById,
  recordActualYield,
  addRisk,
  updateStatus,
  deletePrediction,
  getPredictionsByCrop,
  getAccuracyStats,
  getYieldTrends,
  compareWithRegionalAverage,
  getEconomicAnalysis
} = require('../controllers/yieldPredictionController');

// Import middleware
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { mlPredictionLimiter } = require('../middleware/rateLimiter');
const { validateRequest } = require('../utils/validators');
const { yieldPredictionSchema, simpleYieldEstimationSchema } = require('../utils/validators');

// ==================== PUBLIC ROUTES ====================

/**
 * @route   GET /api/v1/yield/crop/:cropType
 * @desc    Get all predictions for a specific crop type
 * @access  Public
 */
router.get('/crop/:cropType', getPredictionsByCrop);

/**
 * @route   GET /api/v1/yield/stats/accuracy
 * @desc    Get accuracy statistics (can filter by mode via query ?mode=ml or ?mode=simple)
 * @access  Public
 */
router.get('/stats/accuracy', getAccuracyStats);

/**
 * @route   GET /api/v1/yield/trends/:cropType
 * @desc    Get yield trends for a crop over time
 * @access  Public
 */
router.get('/trends/:cropType', getYieldTrends);

// ==================== PROTECTED ROUTES ====================

// Apply authentication to all routes below
router.use(protect);

// ==================== PREDICTION ROUTES (DUAL MODE) ====================

/**
 * @route   POST /api/v1/yield/predict/advanced
 * @desc    ML-based yield prediction (requires soil test data, NPK, pH, etc.)
 * @access  Private
 * @limit   Rate limited
 */
router.post(
  '/predict/advanced',
  mlPredictionLimiter,
  validateRequest(yieldPredictionSchema),
  predictYieldML
);

/**
 * @route   POST /api/v1/yield/predict/simple
 * @desc    Farmer-friendly yield estimation (observation-based, no lab data)
 * @access  Private
 * @limit   Rate limited
 */
router.post(
  '/predict/simple',
  mlPredictionLimiter,
  validateRequest(simpleYieldEstimationSchema),
  estimateYieldSimple
);

/**
 * @route   POST /api/v1/yield/predict
 * @desc    Legacy route - defaults to advanced ML prediction
 * @access  Private
 * @deprecated Use /predict/advanced or /predict/simple instead
 */
router.post(
  '/predict',
  mlPredictionLimiter,
  validateRequest(yieldPredictionSchema),
  predictYieldML  // Default to ML for backwards compatibility
);

// ==================== HISTORY & RETRIEVAL ROUTES ====================

/**
 * @route   GET /api/v1/yield/history
 * @desc    Get user's prediction history
 * @query   ?page=1&limit=10&cropType=rice&status=predicted&mode=simple
 * @access  Private
 */
router.get('/history', getPredictionHistory);

/**
 * @route   GET /api/v1/yield/:id
 * @desc    Get single prediction by ID
 * @access  Private (owner or admin)
 */
router.get('/:id', getPredictionById);

/**
 * @route   DELETE /api/v1/yield/:id
 * @desc    Delete a prediction
 * @access  Private (owner or admin)
 */
router.delete('/:id', deletePrediction);

// ==================== ANALYSIS & COMPARISON ROUTES ====================

/**
 * @route   POST /api/v1/yield/compare-regional
 * @desc    Compare prediction with regional average
 * @access  Private
 */
router.post('/compare-regional', compareWithRegionalAverage);

/**
 * @route   POST /api/v1/yield/economic-analysis
 * @desc    Get economic analysis for a prediction
 * @access  Private
 */
router.post('/economic-analysis', getEconomicAnalysis);

// ==================== UPDATE ROUTES ====================

/**
 * @route   POST /api/v1/yield/:id/actual
 * @desc    Record actual harvest yield (for accuracy tracking)
 * @access  Private (owner only)
 */
router.post('/:id/actual', recordActualYield);

/**
 * @route   POST /api/v1/yield/:id/risks
 * @desc    Add risk assessment to prediction
 * @access  Private (owner only)
 */
router.post('/:id/risks', addRisk);

/**
 * @route   PUT /api/v1/yield/:id/status
 * @desc    Update prediction status (predicted, monitored, harvested, archived)
 * @access  Private (owner only)
 */
router.put('/:id/status', updateStatus);

module.exports = router;