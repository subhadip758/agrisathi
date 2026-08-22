/**
 * AgriSathi Frontend Centralized TTS Client Service
 * Communicates with backend /api/v1/tts/speak API to stream
 * language-specific audio (bn-IN, hi-IN, en-IN).
 */

let currentAudio = null;

const getApiBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  return 'http://localhost:5180/api/v1';
};

/**
 * Stops and clears any currently playing audio.
 */
export const stopSpeech = () => {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {
      // Ignore pause errors on released media
    }
    currentAudio = null;
  }
};

/**
 * Sends speech synthesis request to backend and handles playback lifecycle.
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
      },
      body: JSON.stringify({
        text,
        language,
        format: 'json',
      }),
    });

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      // If server returned non-JSON HTML (e.g. 404/500 HTML error page)
      throw new Error(
        language === 'bn'
          ? 'বাংলা ভয়েস সার্ভিস বর্তমানে সংযোগ করতে পারছে না। অনুগ্রহ করে ব্যাকএন্ড চালু রয়েছে তা নিশ্চিত করুন।'
          : 'Unable to connect to TTS service. Please ensure backend server is running.'
      );
    }

    const data = await response.json();

    if (!response.ok || !data.success || !data.audioBase64) {
      const errorMsg = data.message || data.error || (language === 'bn' ? 'বাংলা ভয়েস বর্তমানে উপলভ্য নয়। অনুগ্রহ করে আবার চেষ্টা করুন।' : 'Failed to generate speech audio.');
      throw new Error(errorMsg);
    }

    const audioUrl = `data:${data.mimeType || 'audio/mpeg'};base64,${data.audioBase64}`;
    const audio = new Audio(audioUrl);
    currentAudio = audio;

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        currentAudio = null;
        resolve();
      };

      audio.onerror = (err) => {
        currentAudio = null;
        reject(err);
      };

      audio.play().catch((err) => {
        currentAudio = null;
        reject(err);
      });
    });
  } catch (err) {
    stopSpeech();
    throw err;
  }
};
