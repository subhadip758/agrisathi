/**
 * AgriSathi TTS Text Preprocessor & Segmentation Layer
 * Handles Unicode preservation, Bengali sentence boundary detection,
 * mixed technical term speech normalization, and multibyte-safe chunking.
 */

/**
 * Validates that text is valid UTF-8 and contains non-empty printable characters.
 */
const validateUnicodeText = (text) => {
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Invalid or empty text payload provided for speech synthesis');
  }
  return Buffer.from(text, 'utf-8').toString('utf-8');
};

/**
 * Preprocesses text for natural speech pronunciation while preserving original displayText.
 * Keeps technical agricultural terms (pH, NPK, EC, TDS, °C, ppm, mm) readable by TTS.
 */
const preprocessForSpeech = (rawText, language = 'bn') => {
  const displayText = validateUnicodeText(rawText);
  let speechText = displayText;

  if (language === 'bn') {
    // Normalize technical terms into Bengali-friendly speech tokens without breaking Bengali script
    speechText = speechText
      .replace(/\bpH\b/gi, 'পি এইচ')
      .replace(/\bNPK\b/gi, 'এন পি কে')
      .replace(/\bEC\b/gi, 'ই সি')
      .replace(/\bTDS\b/gi, 'টি ডি এস')
      .replace(/°C/g, ' ডিগ্রি সেলসিয়াস')
      .replace(/\bppm\b/gi, 'পি পি এম')
      .replace(/\bmm\b/gi, 'মিমি');

    speechText = speechText.replace(/[ \t]+/g, ' ');
  } else if (language === 'hi') {
    speechText = speechText
      .replace(/\bpH\b/gi, 'पी एच')
      .replace(/\bNPK\b/gi, 'एन पी के')
      .replace(/°C/g, ' डिग्री सेल्सियस')
      .replace(/[ \t]+/g, ' ');
  } else {
    speechText = speechText.replace(/[ \t]+/g, ' ');
  }

  return {
    displayText,
    speechText: speechText.trim(),
  };
};

/**
 * Safely segments long text into small chunks at sentence boundaries (।, ., ?, !, \n, commas, spaces)
 * without cutting multibyte Bengali Unicode characters or exceeding Google HTTP stream limits (~140 chars).
 */
const chunkTextForTTS = (text, maxChunkLength = 130) => {
  const validText = validateUnicodeText(text);
  if (validText.length <= maxChunkLength) {
    return [validText];
  }

  // Split at sentence or punctuation boundaries (।, ., ?, !, :, ;)
  const sentences = validText.split(/(?<=[।.?!:;,\n])\s+/);
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if (!sentence) continue;
    if ((currentChunk + ' ' + sentence).trim().length <= maxChunkLength) {
      currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());

      // If a single segment still exceeds maxChunkLength, split by words
      if (sentence.length > maxChunkLength) {
        const words = sentence.split(/\s+/);
        let wordChunk = '';
        for (const word of words) {
          if ((wordChunk + ' ' + word).trim().length <= maxChunkLength) {
            wordChunk = wordChunk ? `${wordChunk} ${word}` : word;
          } else {
            if (wordChunk) chunks.push(wordChunk.trim());
            wordChunk = word;
          }
        }
        if (wordChunk) currentChunk = wordChunk;
      } else {
        currentChunk = sentence;
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
};

module.exports = {
  validateUnicodeText,
  preprocessForSpeech,
  chunkTextForTTS,
};
