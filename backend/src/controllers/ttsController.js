const ttsService = require('../services/ttsService');

// ── POST Generate Speech ──────────────────────────────────────────────────────
exports.speakText = async (req, res) => {
  try {
    const { text, language = 'bn', format = 'mp3' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Text field is required for speech synthesis',
      });
    }

    const result = await ttsService.generateSpeech({ text, language });

    if (!result.success) {
      return res.status(503).json(result);
    }

    if (format === 'json' || req.query.format === 'json') {
      return res.json({
        success: true,
        language: result.language,
        languageCode: result.languageCode,
        voiceName: result.voiceName,
        mimeType: result.mimeType,
        cached: result.cached,
        audioBase64: result.audioBuffer.toString('base64'),
      });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': result.audioBuffer.length,
      'Cache-Control': 'public, max-age=86400',
    });

    return res.send(result.audioBuffer);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// ── GET Available Voices (Diagnostic Endpoint) ──────────────────────────────
exports.getVoices = async (req, res) => {
  try {
    const diagnostic = await ttsService.getAvailableVoices();
    res.json(diagnostic);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
