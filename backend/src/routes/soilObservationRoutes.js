/**
 * Soil Observation Routes
 * Routes for farmer-friendly soil analysis
 */

const express = require('express');
const router = express.Router();
const {
  analyzeSoilObservation,
  getSoilAnalysisHistory,
  getSoilAnalysisById,
  getObservationOptions
} = require('../controllers/soilObservationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/observation-options', getObservationOptions);

// Protected routes (require authentication)
router.post('/analyze-observation', protect, analyzeSoilObservation);
router.get('/history', protect, getSoilAnalysisHistory);
router.get('/analysis/:id', protect, getSoilAnalysisById);

module.exports = router;