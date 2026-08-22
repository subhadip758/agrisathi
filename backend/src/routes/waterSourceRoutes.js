// ============================================
// WATER SOURCE ROUTES
// API Endpoints Configuration
// ============================================

const express = require('express');
const router = express.Router();
const waterSourceController = require('../controllers/waterSourceController');
const {protect} = require('../middleware/authMiddleware');

// Apply authentication to all routes
router.use(protect);

// ============================================
// STATISTICS & ANALYTICS ROUTES
// (Place before :id routes to avoid conflicts)
// ============================================

/**
 * @route   GET /api/v1/water-sources/stats
 * @desc    Get farmer's water statistics
 * @access  Private
 */
router.get('/stats', waterSourceController.getFarmerStats);

/**
 * @route   GET /api/v1/water-sources/recommendation
 * @desc    Get recommended water source based on availability, cost, sustainability
 * @access  Private
 */
router.get('/recommendation', waterSourceController.getRecommendation);

/**
 * @route   GET /api/v1/water-sources/analytics/by-type
 * @desc    Get usage analytics grouped by source type
 * @access  Private
 */
router.get('/analytics/by-type', waterSourceController.getUsageBySourceType);

// ============================================
// CRUD ROUTES
// ============================================

/**
 * @route   GET /api/v1/water-sources
 * @desc    Get all water sources for logged-in farmer
 * @access  Private
 * @query   ?status=active&sourceType=well
 */
router.get('/', waterSourceController.getAllWaterSources);

/**
 * @route   POST /api/v1/water-sources
 * @desc    Create new water source
 * @access  Private
 * @body    { sourceType, name, capacity, currentAvailability, costPerUnit, sustainabilityRating }
 */
router.post('/', waterSourceController.createWaterSource);

/**
 * @route   GET /api/v1/water-sources/:id
 * @desc    Get single water source by ID
 * @access  Private
 */
router.get('/:id', waterSourceController.getWaterSourceById);

/**
 * @route   PUT /api/v1/water-sources/:id
 * @desc    Update water source details
 * @access  Private
 * @body    { name?, capacity?, currentAvailability?, costPerUnit?, sustainabilityRating?, status? }
 */
router.put('/:id', waterSourceController.updateWaterSource);

/**
 * @route   DELETE /api/v1/water-sources/:id
 * @desc    Delete water source
 * @access  Private
 */
router.delete('/:id', waterSourceController.deleteWaterSource);

// ============================================
// USAGE TRACKING ROUTES
// ============================================

/**
 * @route   POST /api/v1/water-sources/:id/use
 * @desc    Record water usage from a source
 * @access  Private
 * @body    { amountUsed, purpose?, notes? }
 */
router.post('/:id/use', waterSourceController.recordWaterUsage);

/**
 * @route   POST /api/v1/water-sources/:id/refill
 * @desc    Refill water source
 * @access  Private
 * @body    { amount }
 */
router.post('/:id/refill', waterSourceController.refillWaterSource);

/**
 * @route   GET /api/v1/water-sources/:id/history
 * @desc    Get usage history for a water source
 * @access  Private
 * @query   ?days=30
 */
router.get('/:id/history', waterSourceController.getUsageHistory);

// ============================================
// EXPORTS
// ============================================

module.exports = router;