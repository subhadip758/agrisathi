/**
 * AgriSathi Centralized Text-to-Speech (TTS) Language & Voice Configuration
 * Explicitly maps supported languages to Google-supported locales and voices.
 */

const SUPPORTED_TTS_LANGUAGES = {
  en: {
    languageCode: 'en-IN',
    locale: 'en-IN',
    voiceName: 'en-IN-Wavenet-D',
    fallbackVoiceName: 'en-IN-Standard-A',
    ssmlGender: 'FEMALE',
    name: 'English (India)',
  },
  hi: {
    languageCode: 'hi-IN',
    locale: 'hi-IN',
    voiceName: 'hi-IN-Wavenet-D',
    fallbackVoiceName: 'hi-IN-Standard-A',
    ssmlGender: 'FEMALE',
    name: 'Hindi (India)',
  },
  bn: {
    languageCode: 'bn-IN',
    locale: 'bn-IN',
    voiceName: 'bn-IN-Wavenet-A',
    fallbackVoiceName: 'bn-IN-Standard-A',
    ssmlGender: 'FEMALE',
    name: 'Bengali (India)',
  },
};

/**
 * Resolves TTS configuration for a given language code.
 * Defaults to 'en-IN' if language is unknown, but enforces strict 'bn-IN' for Bengali.
 */
const getTTSConfig = (langKey) => {
  const normalizedKey = (langKey || 'en').toLowerCase().trim();
  if (normalizedKey === 'bn' || normalizedKey === 'bengali' || normalizedKey === 'bn-in') {
    return SUPPORTED_TTS_LANGUAGES.bn;
  }
  if (normalizedKey === 'hi' || normalizedKey === 'hindi' || normalizedKey === 'hi-in') {
    return SUPPORTED_TTS_LANGUAGES.hi;
  }
  return SUPPORTED_TTS_LANGUAGES.en;
};

module.exports = {
  SUPPORTED_TTS_LANGUAGES,
  getTTSConfig,
};
