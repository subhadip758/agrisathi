const express = require('express');
const router = express.Router();
const schemeController = require('../controllers/schemeController');
const { optionalAuth, protect } = require('../middleware/authMiddleware');

router.get('/', schemeController.getSchemes);
router.post('/ingest', protect, schemeController.ingestNewScheme);
router.get('/:id', schemeController.getSchemeById);
router.post('/:id/eligibility-check', optionalAuth, schemeController.checkEligibility);

module.exports = router;
