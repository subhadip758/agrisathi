/**
 * AgriSathi Frontend Centralized TTS Client Service
 * Communicates with backend /api/v1/tts/speak API to stream
 * language-specific audio (bn-IN, hi-IN, en-IN) with Web Speech API fallback.
 */

let currentAudio = null;

const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return '/api/v1';
};

/**
 * Stops and clears any currently playing audio (both HTML5 Audio and Web Speech API).
 */
export const stopSpeech = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
};

/**
 * Speak text using Web Speech API fallback.
 */
export const speakWithWebSpeech = (text, language = 'en') => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return reject(new Error('Speech synthesis is not supported on this browser.'));
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    const langMap = { bn: 'bn-IN', hi: 'hi-IN', en: 'en-US' };
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase()) || v.lang.toLowerCase().startsWith(language));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Sends speech synthesis request to backend and handles playback lifecycle with fallback.
 */
export const speakText = async ({ text, language = 'bn' }) => {
  stopSpeech();

  if (!text || !text.trim()) {
    throw new Error('Text is required for speech synthesis.');
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/tts/speak?format=json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true',
        'localtunnel-bypass-https': 'true',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ text, language, format: 'json' }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      return await speakWithWebSpeech(text, language);
    }

    const data = await response.json();
    if (!data.success || !data.audioBase64) {
      return await speakWithWebSpeech(text, language);
    }

    const audioUrl = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    return new Promise((resolve, reject) => {
      audio.onended = () => { currentAudio = null; resolve(); };
      audio.onerror = async () => {
        currentAudio = null;
        try {
          await speakWithWebSpeech(text, language);
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      audio.play().catch(async () => {
        currentAudio = null;
        try {
          await speakWithWebSpeech(text, language);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  } catch (err) {
    try {
      return await speakWithWebSpeech(text, language);
    } catch (_) {
      stopSpeech();
      throw err;
    }
  }
};
