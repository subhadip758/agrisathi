const textToSpeech = require('@google-cloud/text-to-speech');
const axios = require('axios');
const crypto = require('crypto');
const { getTTSConfig, SUPPORTED_TTS_LANGUAGES } = require('../config/ttsConfig');
const { preprocessForSpeech, chunkTextForTTS, validateUnicodeText } = require('../utils/ttsPreprocessor');
const { logger } = require('../utils/logger');

// In-Memory Audio Cache (key: lang:voice:hash -> Buffer)
const audioCache = new Map();
const MAX_CACHE_ENTRIES = 250;

// Initialize Google Cloud TTS Client if credentials are available
let ttsClient = null;
try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_PROJECT) {
    ttsClient = new textToSpeech.TextToSpeechClient();
    logger.info('Initialized Google Cloud Text-to-Speech SDK Client');
  }
} catch (err) {
  logger.warn('Google Cloud Text-to-Speech SDK initialization skipped, using Google TTS HTTP Stream fallback:', err.message);
}

/**
 * Generates speech audio buffer for a given text and language.
 * Enforces explicit locale (bn-IN, hi-IN, en-IN) and explicit Google voice mapping.
 */
const generateSpeech = async ({ text, language = 'bn' }) => {
  const config = getTTSConfig(language);
  const validatedText = validateUnicodeText(text);

  const { displayText, speechText } = preprocessForSpeech(validatedText, language);

  // Generate cache key
  const textHash = crypto.createHash('md5').update(speechText, 'utf8').digest('hex');
  const cacheKey = `${config.languageCode}:${config.voiceName}:${textHash}`;

  if (audioCache.has(cacheKey)) {
    logger.info(`TTS Cache Hit for [${config.languageCode}]: "${speechText.substring(0, 40)}..."`);
    return {
      success: true,
      audioBuffer: audioCache.get(cacheKey),
      mimeType: 'audio/mpeg',
      language: language,
      languageCode: config.languageCode,
      voiceName: config.voiceName,
      cached: true,
    };
  }

  // Log payload details as required
  logger.info('TTS Request Payload:', {
    language,
    languageCode: config.languageCode,
    voiceName: config.voiceName,
    textLength: speechText.length,
    textPreview: speechText.substring(0, 100),
  });

  // Use 130 character chunks to ensure 100% Google HTTP API compatibility
  const textChunks = chunkTextForTTS(speechText, 130);
  const audioBuffers = [];

  for (const chunk of textChunks) {
    let chunkBuffer = null;

    // 1. Try Google Cloud Text-to-Speech SDK
    if (ttsClient) {
      try {
        const requestPayload = {
          input: { text: chunk },
          voice: {
            languageCode: config.languageCode,
            name: config.voiceName,
            ssmlGender: config.ssmlGender,
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.9,
          },
        };

        const [response] = await ttsClient.synthesizeSpeech(requestPayload);
        if (response.audioContent) {
          chunkBuffer = Buffer.from(response.audioContent);
        }
      } catch (sdkError) {
        logger.warn(`Google Cloud SDK synthesis failed for ${config.languageCode}, falling back to stream:`, sdkError.message);
      }
    }

    // 2. Fallback to Google TTS Stream API preserving Unicode payload & locale ISO 639-1
    if (!chunkBuffer) {
      try {
        const encodedText = encodeURIComponent(chunk);
        const tlCode = config.locale ? config.locale.split('-')[0] : 'bn';
        const ttsStreamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${tlCode}&client=tw-ob`;

        const res = await axios.get(ttsStreamUrl, {
          responseType: 'arraybuffer',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'audio/mpeg',
          },
          timeout: 8000,
        });

        if (res.data && res.data.byteLength > 0) {
          chunkBuffer = Buffer.from(res.data);
        }
      } catch (streamError) {
        logger.error(`Google TTS Stream fallback failed for ${config.languageCode}:`, streamError.message);
      }
    }

    if (!chunkBuffer) {
      // Controlled error handling: return structured error, DO NOT silently fall back to another language
      const isBn = language === 'bn';
      return {
        success: false,
        language,
        languageCode: config.languageCode,
        errorCode: isBn ? 'BENGALI_TTS_UNAVAILABLE' : 'TTS_GENERATION_FAILED',
        message: isBn
          ? 'বাংলা ভয়েস বর্তমানে উপলভ্য নয়। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Voice synthesis service is currently unavailable. Please try again.',
      };
    }

    audioBuffers.push(chunkBuffer);
  }

  const finalAudioBuffer = Buffer.concat(audioBuffers);

  // Store in cache
  if (audioCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = audioCache.keys().next().value;
    audioCache.delete(firstKey);
  }
  audioCache.set(cacheKey, finalAudioBuffer);

  return {
    success: true,
    audioBuffer: finalAudioBuffer,
    mimeType: 'audio/mpeg',
    language,
    languageCode: config.languageCode,
    voiceName: config.voiceName,
    cached: false,
  };
};

/**
 * Diagnostic method to list supported Google Cloud voices.
 */
const getAvailableVoices = async () => {
  let voices = [];
  if (ttsClient) {
    try {
      const [result] = await ttsClient.listVoices({});
      voices = (result.voices || []).filter(v =>
        v.languageCodes?.some(code => code.includes('bn-IN') || code.includes('hi-IN') || code.includes('en-IN'))
      );
    } catch (err) {
      logger.warn('Failed to fetch voices from Google Cloud SDK:', err.message);
    }
  }

  const configuredVoices = Object.values(SUPPORTED_TTS_LANGUAGES).map(cfg => ({
    name: cfg.voiceName,
    languageCode: cfg.languageCode,
    ssmlGender: cfg.ssmlGender,
    status: 'ACTIVE',
  }));

  return {
    success: true,
    count: configuredVoices.length,
    configuredVoices,
    sdkAvailable: !!ttsClient,
    sdkVoicesCount: voices.length,
  };
};

module.exports = {
  generateSpeech,
  getAvailableVoices,
};
