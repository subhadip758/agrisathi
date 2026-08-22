const express = require('express');
const router = express.Router();
const diseaseAlertController = require('../controllers/diseaseAlertController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', diseaseAlertController.getAlerts);
router.post('/reports', optionalAuth, diseaseAlertController.submitReport);
router.post('/evaluate', diseaseAlertController.triggerEvaluation);

module.exports = router;
