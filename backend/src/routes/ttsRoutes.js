const express = require('express');
const router = express.Router();
const ttsController = require('../controllers/ttsController');

// POST /api/v1/tts/speak - Generate Speech Audio
router.post('/speak', ttsController.speakText);

// GET /api/v1/tts/voices - Diagnostic Voice List
router.get('/voices', ttsController.getVoices);

module.exports = router;
