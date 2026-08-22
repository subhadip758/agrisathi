const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadDiseaseImage } = require('../config/multer');
const {
  detectDisease,
  getDetectionHistory,
  getDetection,
  addFollowUp,
  deleteDetection
} = require('../controllers/diseaseDetectionController');

// All routes require authentication
router.use(protect);

// POST /api/v1/disease/detect  — upload image + detect
router.post('/detect', uploadDiseaseImage, detectDisease);

// POST /api/v1/disease/multimodal — multimodal diagnosis endpoint
router.post('/multimodal', uploadDiseaseImage, detectDisease);

// GET  /api/v1/disease/history — paginated history
router.get('/history', getDetectionHistory);

// GET  /api/v1/disease/:id     — single record
router.get('/:id', getDetection);

// POST /api/v1/disease/:id/followup
router.post('/:id/followup', addFollowUp);

// DELETE /api/v1/disease/:id
router.delete('/:id', deleteDetection);

module.exports = router;