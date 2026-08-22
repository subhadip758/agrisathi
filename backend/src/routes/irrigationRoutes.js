const express = require('express');
const router = express.Router();

// ML controller
const {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  completeIrrigation,
  skipIrrigation,
  addIrrigationEvent,
  getTodaySchedules,
  getWaterUsageStats,
  updateGrowthStage,
  getRecommendations,
  generateMLSchedule,   // ← added
  getMLSchedules,       // ← added
  getMLPrediction,      // ← added (new: instant predict, no DB save)
  getMLRoadmap,         // ← added (new: 30-day roadmap, no DB save)
} = require('../controllers/irrigationController');

// ✅ Rule-based controller
const ruleBasedIrrigationController = require('../controllers/ruleBasedIrrigationController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../utils/validators');
const { irrigationScheduleSchema } = require('../utils/validators');

// ============================================
// ALL ROUTES PROTECTED
// ============================================
router.use(protect);

// ============================================
// ML-BASED IRRIGATION ROUTES
// ============================================

router.post('/schedule', validateRequest(irrigationScheduleSchema), createSchedule);
router.get('/schedules',    getSchedules);
router.get('/today',        getTodaySchedules);
router.get('/stats',        getWaterUsageStats);
router.post('/recommend',   getRecommendations);

router
  .route('/schedules/:id')
  .get(getScheduleById)
  .put(updateSchedule)
  .delete(deleteSchedule);

router.post('/schedules/:id/complete',     completeIrrigation);
router.post('/schedules/:id/skip',         skipIrrigation);
router.post('/schedules/:id/events',       addIrrigationEvent);
router.put('/schedules/:id/growth-stage',  updateGrowthStage);

// ── ML model routes ───────────────────────────────────────────────────────────
/**
 * @route   POST /api/v1/irrigation/ml/generate
 * @desc    Generate & save ML-based irrigation schedule (ensemble 98% accuracy)
 * @access  Private
 */
router.post('/ml/generate', generateMLSchedule);

/**
 * @route   GET /api/v1/irrigation/ml/schedules
 * @desc    Get all ML-generated schedules for user
 * @access  Private
 */
router.get('/ml/schedules', getMLSchedules);

/**
 * @route   POST /api/v1/irrigation/ml/predict
 * @desc    Instant ML prediction — no DB save (for "Check now" button)
 *          Body: { cropType, cropDays, soilMoisture, temperature, humidity, rainfall, soilType }
 * @access  Private
 */
router.post('/ml/predict', getMLPrediction);

/**
 * @route   POST /api/v1/irrigation/ml/roadmap
 * @desc    Generate 30-day irrigation roadmap — no DB save (for frontend chart)
 *          Body: { cropType, cropDays, soilMoisture, temperature, humidity, soilType, area, forecastDays }
 * @access  Private
 */
router.post('/ml/roadmap', getMLRoadmap);

// ============================================
// RULE-BASED IRRIGATION ROUTES
// ============================================

/**
 * @route   POST /api/v1/irrigation/rule-based/generate
 * @desc    Generate rule-based irrigation schedule
 * @access  Private
 */
router.post('/rule-based/generate', ruleBasedIrrigationController.generateSchedule);

/**
 * @route   GET /api/v1/irrigation/rule-based/schedules
 * @desc    Get user's rule-based irrigation schedules
 * @access  Private
 */
router.get('/rule-based/schedules', ruleBasedIrrigationController.getUserSchedules);

/**
 * @route   GET /api/v1/irrigation/rule-based/active
 * @desc    Get user's active rule-based schedule
 * @access  Private
 */
router.get('/rule-based/active', ruleBasedIrrigationController.getActiveSchedule);

/**
 * @route   GET /api/v1/irrigation/rule-based/schedule/:id
 * @desc    Get specific rule-based schedule by ID
 * @access  Private
 */
router.get('/rule-based/schedule/:id', ruleBasedIrrigationController.getScheduleById);

/**
 * @route   PUT /api/v1/irrigation/rule-based/schedule/:id
 * @desc    Update rule-based irrigation schedule
 * @access  Private
 */
router.put('/rule-based/schedule/:id', ruleBasedIrrigationController.updateSchedule);

/**
 * @route   DELETE /api/v1/irrigation/rule-based/schedule/:id
 * @desc    Deactivate rule-based irrigation schedule
 * @access  Private
 */
router.delete('/rule-based/schedule/:id', ruleBasedIrrigationController.deactivateSchedule);

/**
 * @route   POST /api/v1/irrigation/rule-based/schedule/:id/feedback
 * @desc    Add user feedback to rule-based schedule
 * @access  Private
 */
router.post('/rule-based/schedule/:id/feedback', ruleBasedIrrigationController.addFeedback);

/**
 * @route   POST /api/v1/irrigation/rule-based/quick-recommendation
 * @desc    Get quick irrigation recommendation without saving
 * @access  Private
 */
router.post('/rule-based/quick-recommendation', ruleBasedIrrigationController.getQuickRecommendation);

// ============================================
// CROP INFORMATION ROUTES (Public)
// ============================================

/**
 * @route   GET /api/v1/irrigation/rule-based/crops
 * @desc    Get all available crops for rule-based planning
 * @access  Public
 */
router.get('/rule-based/crops', (req, res, next) => {
  ruleBasedIrrigationController.getAvailableCrops(req, res, next);
});

/**
 * @route   GET /api/v1/irrigation/rule-based/crop/:cropName
 * @desc    Get specific crop information
 * @access  Public
 */
router.get('/rule-based/crop/:cropName', (req, res, next) => {
  ruleBasedIrrigationController.getCropInformation(req, res, next);
});

// ============================================
// GENERAL IRRIGATION ROUTES
// ============================================

/**
 * @route   GET /api/v1/irrigation/all
 * @desc    Get all irrigation schedules (both ML and Rule-based)
 * @access  Private
 */
router.get('/all', async (req, res) => {
  try {
    const userId = req.user.id;
    const IrrigationSchedule = require('../models/IrrigationSchedule');
    const RuleBasedIrrigation = require('../models/RuleBasedIrrigation');

    const [mlSchedules, ruleBasedSchedules] = await Promise.all([
      IrrigationSchedule.find({ userId }).sort({ createdAt: -1 }).limit(5),
      RuleBasedIrrigation.find({ userId }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        mlBased:    mlSchedules,
        ruleBased:  ruleBasedSchedules,
        total:      mlSchedules.length + ruleBasedSchedules.length,
      },
    });
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch irrigation schedules' });
  }
});

/**
 * @route   GET /api/v1/irrigation/compare/:mlId/:ruleId
 * @desc    Compare ML-based and Rule-based schedules
 * @access  Private
 */
router.get('/compare/:mlId/:ruleId', async (req, res) => {
  try {
    const { mlId, ruleId } = req.params;
    const userId = req.user.id;

    const IrrigationSchedule = require('../models/IrrigationSchedule');
    const RuleBasedIrrigation = require('../models/RuleBasedIrrigation');

    const [mlSchedule, ruleSchedule] = await Promise.all([
      IrrigationSchedule.findOne({ _id: mlId, userId }),
      RuleBasedIrrigation.findOne({ _id: ruleId, userId }),
    ]);

    if (!mlSchedule || !ruleSchedule) {
      return res.status(404).json({ success: false, message: 'One or both schedules not found' });
    }

    const comparison = {
      mlBased: {
        frequency:     mlSchedule.irrigationSchedule?.frequency    || 'N/A',
        waterQuantity: mlSchedule.irrigationSchedule?.waterQuantity || 0,
        duration:      mlSchedule.irrigationSchedule?.duration      || 0,
        confidence:    mlSchedule.confidence                        || 'N/A',
      },
      ruleBased: {
        frequency:     ruleSchedule.irrigationSchedule.frequency,
        waterQuantity: ruleSchedule.irrigationSchedule.waterQuantity,
        duration:      ruleSchedule.irrigationSchedule.duration,
        confidence:    ruleSchedule.calculatedBy.confidence,
      },
      differences: {
        waterDifference: Math.abs(
          (mlSchedule.irrigationSchedule?.waterQuantity || 0) -
          (ruleSchedule.irrigationSchedule.waterQuantity || 0)
        ),
        durationDifference: Math.abs(
          (mlSchedule.irrigationSchedule?.duration || 0) -
          (ruleSchedule.irrigationSchedule.duration || 0)
        ),
      },
    };

    res.status(200).json({ success: true, data: comparison });
  } catch (error) {
    console.error('Error comparing schedules:', error);
    res.status(500).json({ success: false, message: 'Failed to compare schedules' });
  }
});

module.exports = router;