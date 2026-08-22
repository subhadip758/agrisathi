const request = require('supertest');
const app = require('../src/server');
const ttsService = require('../src/services/ttsService');
const { getTTSConfig } = require('../src/config/ttsConfig');
const { preprocessForSpeech, chunkTextForTTS, validateUnicodeText } = require('../src/utils/ttsPreprocessor');

describe('AGriSathi Text-to-Speech (TTS) Engine & Architecture Tests', () => {

  // 1. Language Configuration & Locale Mapping
  describe('Centralized TTS Configuration', () => {
    test('explicitly maps Bengali (bn) to bn-IN and Google Bengali Voice', () => {
      const config = getTTSConfig('bn');
      expect(config.languageCode).toBe('bn-IN');
      expect(config.locale).toBe('bn-IN');
      expect(config.voiceName).toBe('bn-IN-Wavenet-A');
    });

    test('explicitly maps Hindi (hi) to hi-IN', () => {
      const config = getTTSConfig('hi');
      expect(config.languageCode).toBe('hi-IN');
      expect(config.locale).toBe('hi-IN');
      expect(config.voiceName).toBe('hi-IN-Wavenet-D');
    });

    test('explicitly maps English (en) to en-IN', () => {
      const config = getTTSConfig('en');
      expect(config.languageCode).toBe('en-IN');
      expect(config.locale).toBe('en-IN');
      expect(config.voiceName).toBe('en-IN-Wavenet-D');
    });
  });

  // 2. Unicode Preservation & Text Preprocessing
  describe('Unicode Preservation & Text Preprocessing', () => {
    test('preserves Bengali Unicode script without ASCII or Latin-1 corruption', () => {
      const originalBengali = 'বাংলা ভাষায় কৃষকদের জন্য এই তথ্যটি পড়ে শোনানো হবে।';
      const validated = validateUnicodeText(originalBengali);
      expect(validated).toBe(originalBengali);
    });

    test('preprocesses mixed technical agricultural terms without breaking Bengali text', () => {
      const mixedText = 'মাটির pH ৬.৫ এবং Fusarium রোগের ঝুঁকি বেশি।';
      const { speechText } = preprocessForSpeech(mixedText, 'bn');
      expect(speechText).toContain('পি এইচ');
      expect(speechText).toContain('Fusarium');
      expect(speechText).toContain('মাটির');
    });

    test('segments long Bengali text safely at sentence boundaries (।) without cutting multibyte chars', () => {
      const longText = 'মাটিতে আর্দ্রতা বেশি থাকলে অতিরিক্ত সেচ দেবেন না। আজ বৃষ্টির সম্ভাবনা রয়েছে। তাই কীটনাশক স্প্রে বন্ধ রাখুন।';
      const chunks = chunkTextForTTS(longText, 60);
      expect(chunks.length).toBeGreaterThan(1);
      expect(chunks[0]).toContain('সেচ দেবেন না।');
    });
  });

  // 3. Section 9 Required Bengali Test Strings
  describe('Section 9 Required Bengali Test Strings', () => {
    const testCases = [
      { id: 1, text: 'বাংলা ভাষায় কৃষকদের জন্য এই তথ্যটি পড়ে শোনানো হবে।' },
      { id: 2, text: 'আপনার ধানের পাতায় বাদামী দাগ দেখা যাচ্ছে।' },
      { id: 3, text: 'মাটির আর্দ্রতা বেশি থাকায় সেচের পরিমাণ কমিয়ে দিন।' },
      { id: 4, text: 'আজ বৃষ্টির সম্ভাবনা রয়েছে। তাই আজ কীটনাশক স্প্রে না করাই ভালো।' },
      { id: 5, text: 'এই রোগের লক্ষণগুলি ভালোভাবে পর্যবেক্ষণ করুন এবং প্রয়োজনে কৃষি বিশেষজ্ঞের পরামর্শ নিন।' }
    ];

    testCases.forEach(({ id, text }) => {
      test(`Test ${id}: processes Bengali sentence successfully with bn-IN locale`, async () => {
        const result = await ttsService.generateSpeech({ text, language: 'bn' });
        expect(result.success).toBe(true);
        expect(result.languageCode).toBe('bn-IN');
        expect(result.audioBuffer).toBeInstanceOf(Buffer);
        expect(result.audioBuffer.length).toBeGreaterThan(0);
      });
    });
  });

  // 4. Section 23 Acceptance Tests (English, Hindi, Bengali)
  describe('Section 23 Acceptance Tests', () => {
    test('English TTS: "Apply irrigation only when soil moisture is low." returns en-IN audio', async () => {
      const result = await ttsService.generateSpeech({
        text: 'Apply irrigation only when soil moisture is low.',
        language: 'en'
      });
      expect(result.success).toBe(true);
      expect(result.languageCode).toBe('en-IN');
      expect(result.audioBuffer).toBeInstanceOf(Buffer);
    });

    test('Hindi TTS: "मिट्टी में नमी अधिक होने पर सिंचाई कम करें।" returns hi-IN audio', async () => {
      const result = await ttsService.generateSpeech({
        text: 'मिट्टी में नमी अधिक होने पर सिंचाई कम करें।',
        language: 'hi'
      });
      expect(result.success).toBe(true);
      expect(result.languageCode).toBe('hi-IN');
      expect(result.audioBuffer).toBeInstanceOf(Buffer);
    });

    test('Bengali TTS: "মাটিতে আর্দ্রতা বেশি থাকলে অতিরিক্ত সেচ দেবেন না।" returns bn-IN audio', async () => {
      const result = await ttsService.generateSpeech({
        text: 'মাটিতে আর্দ্রতা বেশি থাকলে অতিরিক্ত সেচ দেবেন না।',
        language: 'bn'
      });
      expect(result.success).toBe(true);
      expect(result.languageCode).toBe('bn-IN');
      expect(result.audioBuffer).toBeInstanceOf(Buffer);
    });
  });

  // 5. Diagnostic Voices API Endpoint Test
  describe('Diagnostic /api/v1/tts/voices Endpoint', () => {
    test('GET /api/v1/tts/voices returns verified voice list including bn-IN, hi-IN, en-IN', async () => {
      const res = await request(app).get('/api/v1/tts/voices');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.configuredVoices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A' }),
          expect.objectContaining({ languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D' }),
          expect.objectContaining({ languageCode: 'en-IN', name: 'en-IN-Wavenet-D' })
        ])
      );
    });

    test('POST /api/v1/tts/speak returns base64 audio payload in JSON format', async () => {
      const res = await request(app)
        .post('/api/v1/tts/speak?format=json')
        .send({ text: 'বাংলা কৃষি পরামর্শ।', language: 'bn' });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.languageCode).toBe('bn-IN');
      expect(typeof res.body.audioBase64).toBe('string');
      expect(res.body.audioBase64.length).toBeGreaterThan(50);
    });
  });

});
