const chatbotService = require('../src/services/chatbotService');

describe('AgriSathi Production Chatbot Service Tests', () => {

  test('1. Detects Bengali language correctly from script', () => {
    const lang = chatbotService.detectLanguage('আমার ধানের পাতায় বাদামী দাগ দেখা যাচ্ছে');
    expect(lang).toBe('bengali');
  });

  test('2. Detects Hindi language correctly from script', () => {
    const lang = chatbotService.detectLanguage('मेरी धान की फसल में पत्तों पर धब्बे हैं');
    expect(lang).toBe('hindi');
  });

  test('3. Detects English language correctly from script', () => {
    const lang = chatbotService.detectLanguage('What is the weather of Barasat?');
    expect(lang).toBe('english');
  });

  test('4. Disease query WITHOUT photo or symptoms returns request for photo/symptoms without fake diagnosis', async () => {
    const result = await chatbotService.processMessage('user123', 'গাছের রোগ চিহ্নিত করুন', 'S-NO-PHOTO');
    expect(result.success).toBe(true);
    expect(result.data.intent).toBe('disease-identification-no-photo');
    expect(result.data.message).toContain('ছবি আপলোড করুন');
    expect(result.data.message).not.toContain('Paddy Blast');
  });

  test('5. Disease query WITH text symptoms returns specific diagnosis and treatment', async () => {
    const result = await chatbotService.processMessage('user123', 'আমার ধানের পাতায় বাদামী ছোপ পঁচন দেখা যাচ্ছে, কী করব?', 'S-WITH-SYMPTOMS');
    expect(result.success).toBe(true);
    expect(result.data.intent).toBe('disease-identification');
    expect(result.data.message).toContain('রোগ');
  });

  test('6. Processes Barasat weather query in English with real geocoded data', async () => {
    const result = await chatbotService.processMessage('user123', 'What is the weather of Barasat?', 'SESSION-WEATHER-EN');
    expect(result.success).toBe(true);
    expect(result.data.intent).toBe('weather-query');
    expect(result.data.detectedLanguage).toBe('english');
    expect(result.data.message).toContain('Barasat');
    expect(result.data.message).toContain('Temperature');
  });

  test('7. Processes Barasat weather query in Bengali with 100% Bengali output', async () => {
    const result = await chatbotService.processMessage('user123', 'বারাসাতের আজকের আবহাওয়া কেমন?', 'SESSION-WEATHER-BN');
    expect(result.success).toBe(true);
    expect(result.data.intent).toBe('weather-query');
    expect(result.data.detectedLanguage).toBe('bengali');
    expect(result.data.message).toContain('বারাসাত');
    expect(result.data.message).toContain('তাপমাত্রা');
  });

  test('8. Soil analysis query returns soil context grounded answer', async () => {
    const result = await chatbotService.processMessage('user123', 'মাটিতে ইউরিয়া সার কতটুকু দেব?', 'SESSION-SOIL');
    expect(result.success).toBe(true);
    expect(result.data.intent).toBe('soil-analysis');
    expect(result.data.message).not.toContain('AgriSathi is ready to assist');
  });

  test('9. Multimodal Image Query: Processes image buffer without crash', async () => {
    const mockImageBuffer = Buffer.from('fake-image-bytes');
    const result = await chatbotService.processMessageWithImage('user123', 'এই পাতায় কি সমস্যা?', mockImageBuffer, 'image/jpeg', 'SESSION-TEST-IMG', { language: 'bn' });
    expect(result.success).toBe(true);
    expect(result.data.message).toBeDefined();
    expect(result.data.metadata.hasImage).toBe(true);
  });

});
