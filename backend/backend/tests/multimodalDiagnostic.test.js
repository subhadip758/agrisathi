const contextOrchestrator = require('../../src/services/contextOrchestrator');
const chatbotService = require('../../src/services/chatbotService');
const evidenceFusionEngine = require('../../src/services/evidenceFusionEngine');

describe('AgriSathi V3 Reliability & Multimodal Unit Tests', () => {

  test('ContextOrchestrator returns structured data status for soil, water, and irrigation', async () => {
    const mockUserId = '000000000000000000000001';
    const context = await contextOrchestrator.getUnifiedFarmContext(mockUserId, {
      cropType: 'Wheat',
      lat: 22.73,
      lon: 88.50,
      soilpH: 6.8,
      soilMoisture: 45
    });

    expect(context).toHaveProperty('location');
    expect(context).toHaveProperty('crop');
    expect(context.crop.cropType).toBe('Wheat');

    expect(context.soil).toHaveProperty('isAvailable');
    expect(context.soil.isAvailable).toBe(true);
    expect(context.soil.status).toContain('Available');

    expect(context.irrigation).toHaveProperty('isAvailable');
    expect(context.water).toHaveProperty('isAvailable');
    expect(context).toHaveProperty('environmentalPriority');
    expect(context.environmentalPriority.isWaterlogged).toBe(false);
  });

  test('ChatbotService detects language correctly', () => {
    expect(chatbotService.detectLanguage('Why are my wheat leaves turning yellow?')).toBe('english');
    expect(chatbotService.detectLanguage('আমার ধানের জমিতে কি সেচ দেওয়া উচিত?')).toBe('bengali');
    expect(chatbotService.detectLanguage('मेरी फसल में पत्तों पर पीले धब्बे आ रहे हैं')).toBe('hindi');
    expect(chatbotService.detectLanguage('amar gachera pata holud hoye geche')).toBe('bengali');
    expect(chatbotService.detectLanguage('meri fasal me paani kitna dena hai')).toBe('hindi');
  });

  test('ChatbotService classifies intent correctly', () => {
    expect(chatbotService.classifyIntent('Will it rain tomorrow in Siliguri?')).toBe('weather-query');
    expect(chatbotService.classifyIntent('How much water should I irrigate my crop with?')).toBe('irrigation-advice');
    expect(chatbotService.classifyIntent('My rice leaf has dark brown spots')).toBe('disease-identification');
    expect(chatbotService.classifyIntent('What is the ideal soil pH for tomato?')).toBe('soil-analysis');
  });

  test('ChatbotService returns intent-specific fallback responses without repetitive generic answers', () => {
    const weatherResp = chatbotService.getFallbackResponse('Will it rain tomorrow?', {
      weather: { current: { temperature: 30, rainfall: 5 } }
    });
    expect(weatherResp.response.toLowerCase()).toContain('weather');

    const irrigationResp = chatbotService.getFallbackResponse('Should I water my crop today?', {
      irrigation: { soilMoisture: 40 }
    });
    expect(irrigationResp.response.toLowerCase()).toContain('irrigation');

    const diseaseResp = chatbotService.getFallbackResponse('My leaf has brown spots');
    expect(diseaseResp.response.toLowerCase()).toContain('spot');

    expect(weatherResp.response).not.toEqual(irrigationResp.response);
    expect(irrigationResp.response).not.toEqual(diseaseResp.response);
  });

  test('EvidenceFusionEngine correctly weights evidence and handles organ alignment', () => {
    const mockVision = {
      crop: 'Wheat',
      affected_part: { organ: 'spike', label: 'Earhead / Spike' },
      symptoms: [{ symptom: 'Abnormal dark mass', severity: 'high', location: 'spike' }],
      visual_candidates: [
        { disease: 'Loose Smut of Wheat', confidence: 0.90, organ: 'spike' }
      ]
    };

    const mockWeather = {
      current: { temperature: 24, humidity: 80, rainfall: 15 },
      agriculturalInsights: { recent5DayRain: 40, forecast7DayRain: 25 }
    };

    const fusion = evidenceFusionEngine.fuseEvidence(
      mockVision,
      mockWeather,
      { isAvailable: true, pH: 6.5 },
      { isAvailable: true, pH: 7.0 },
      { isAvailable: true, soilMoisture: 70 },
      { cropType: 'Wheat', growthStage: 'flowering' }
    );

    expect(fusion).toHaveProperty('top_diagnosis');
    expect(fusion.top_diagnosis.disease).toBe('Loose Smut of Wheat');
    expect(fusion.calibrated_confidence).toBeGreaterThan(0.70);
  });

});
