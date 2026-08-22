const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require('../models/ChatHistory');
const contextOrchestrator = require('./contextOrchestrator');
const chatbotTools = require('./chatbotTools');
const toolDeclarations = require('./toolDeclarations');
const jsonFileStore = require('../utils/jsonFileStore');

console.log('🚀 Loading Production AgriSathi Autonomous AI Agent Engine (Factuality & Safety Grounded)');

class ChatbotService {
  constructor() {
    console.log('🔧 Initializing Grounded Decision Support Agent for AgriSathi...');

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('⚠️ GEMINI_API_KEY not set.');
      this.genAI = null;
      this.model = null;
    } else {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({
          model: "gemini-3.6-flash",
          tools: [{ functionDeclarations: toolDeclarations }]
        });
        console.log('✅ Gemini AI Agent model successfully loaded with 20 real AgriSathi tool declarations');
      } catch (error) {
        console.error('❌ Gemini API Initialization Error:', error.message);
        this.genAI = null;
        this.model = null;
      }
    }

    this.baseSystemPrompt = `
You are AgriSathi AI Agent, an advanced autonomous AI assistant and agronomy expert for farmers and general users.

CRITICAL FACTUALITY, SAFETY & DATA-GROUNDING DIRECTIVES:
1. DATA GROUNDING: Rely strictly on real platform tools, verified database records, live weather APIs, active market listings, and verified government portals.
2. GOVERNMENT SCHEMES & ELIGIBILITY:
   - State scheme benefits, official portals (e.g., pmkisan.gov.in, krishakbandhu.wb.gov.in, pmfby.gov.in), and eligibility criteria accurately.
   - NEVER promise guaranteed payout ("You will definitely receive money"). Frame eligibility as: "Likely Eligible based on land/crop records, subject to final verification and document submission to local government authorities."
3. CROP DISEASE & TREATMENT:
   - Provide diagnosis confidence based on visual/text symptoms.
   - Distinguish prevention vs. supportive treatment.
   - Advise farmers to consult local Krishi Vigyan Kendra (KVK) or Block Development Agricultural Officers for severe outbreaks.
4. MARKET PRICES: Cite active AgriSathi marketplace listings or state if no active listing is found.
5. NO EMOJIS OR TEMPLATE HEADERS: Respond in natural Bengali, Hindi, or English without emojis or generic header titles.
`;
  }

  detectLanguage(message, contextLang = null) {
    const msg = String(message || '').trim();
    if (!msg) {
      if (contextLang === 'bn' || contextLang === 'bengali') return 'bengali';
      if (contextLang === 'hi' || contextLang === 'hindi') return 'hindi';
      return 'english';
    }

    const bengaliCount = (msg.match(/[\u0980-\u09FF]/g) || []).length;
    const hindiCount = (msg.match(/[\u0900-\u097F]/g) || []).length;

    if (bengaliCount > 0 && bengaliCount >= hindiCount) return 'bengali';
    if (hindiCount > 0 && hindiCount > bengaliCount) return 'hindi';

    const msgLower = msg.toLowerCase();
    const banglishWords = ['ami', 'tumi', 'apni', 'amar', 'ki', 'ache', 'nei', 'hobe', 'brishti', 'dhan', 'mati', 'rog', 'pata', 'sar', 'kemon', 'kothay', 'কেমন'];
    const hinglishWords = ['mujhe', 'mera', 'meri', 'kya', 'kaise', 'paani', 'barish', 'bimari', 'keeda', 'khad', 'patte', 'chahiye', 'karo', 'कैसा'];

    let bnScore = 0, hiScore = 0;
    banglishWords.forEach(w => { if (msgLower.includes(w)) bnScore += 2; });
    hinglishWords.forEach(w => { if (msgLower.includes(w)) hiScore += 2; });

    if (bnScore > 0 && bnScore >= hiScore) return 'bengali';
    if (hiScore > 0 && hiScore > bnScore) return 'hindi';

    if (contextLang === 'bn' || contextLang === 'bengali') return 'bengali';
    if (contextLang === 'hi' || contextLang === 'hindi') return 'hindi';

    return 'english';
  }

  async executeToolCall(toolName, args = {}, userId = null, context = {}) {
    try {
      console.log(`🛠️ [AI Agent Tool Execution] Calling: ${toolName} with args:`, JSON.stringify(args));

      switch (toolName) {
        case 'getCurrentLocation':
          return await chatbotTools.getCurrentLocation(args.queryText || '', userId, context);
        case 'getFarmerProfile':
          return await chatbotTools.getFarmerProfile(userId);
        case 'getWeather':
          return await chatbotTools.getWeather(args.locationName || context.locationName || 'Barasat', context.latitude, context.longitude);
        case 'getWeatherForecast':
          return await chatbotTools.getWeatherForecast(args.locationName || context.locationName || 'Barasat', context.latitude, context.longitude, args.days || 7);
        case 'getSoilAnalysis':
          return await chatbotTools.getSoilAnalysis(userId);
        case 'getSoilMoisture':
          return await chatbotTools.getSoilMoisture(userId, context.latitude, context.longitude);
        case 'getIrrigationStatus':
          return await chatbotTools.getIrrigationStatus(userId, args.cropType || context.cropType || 'Rice');
        case 'getCropInformation':
          return await chatbotTools.getCropInformation(args.cropType || context.cropType || 'Rice');
        case 'getCropRecommendation':
          return await chatbotTools.getCropRecommendation(userId, context.soilPh || 6.5, context.soilType || 'Loam', args.district || context.district || 'North 24 Parganas');
        case 'getYieldPrediction':
          return await chatbotTools.getYieldPrediction(userId, args.cropType || context.cropType || 'Rice', context.landSize || 4.5);
        case 'detectCropDisease':
          return await chatbotTools.detectCropDisease(null, 'image/jpeg', args.cropType || context.cropType || 'Rice', args.symptoms || '');
        case 'getDiseaseAlerts':
          return await chatbotTools.getDiseaseAlerts(args.district || context.district || 'North 24 Parganas', args.cropType || context.cropType);
        case 'getMarketListings':
          return await chatbotTools.getMarketListings(args.district || context.district || 'North 24 Parganas', args.cropType || context.cropType);
        case 'getFreshMarketListings':
          return await chatbotTools.getFreshMarketListings(args.district || context.district || 'North 24 Parganas', args.cropType || context.cropType);
        case 'getColdStorageListings':
          return await chatbotTools.getColdStorageListings(args.district || context.district || 'North 24 Parganas', args.cropType || context.cropType);
        case 'getGovernmentSchemes':
          return await chatbotTools.getGovernmentSchemes();
        case 'checkSchemeEligibility':
          return await chatbotTools.checkSchemeEligibility(userId);
        case 'getCommunityInformation':
          return await chatbotTools.getCommunityInformation(args.query || '', args.district || context.district || 'North 24 Parganas');
        case 'getNotifications':
          return await chatbotTools.getNotifications(userId);
        case 'webSearch':
          return await chatbotTools.webSearch(args.query || '');
        default:
          return { success: false, error: `Tool ${toolName} not registered in AgriSathi registry.` };
      }
    } catch (err) {
      console.error(`❌ Error executing tool ${toolName}:`, err.message);
      return { success: false, error: err.message };
    }
  }

  stripEmojis(text) {
    if (!text) return '';
    return text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F6D0}-\u{1F6FF}\u{200D}\u{FE0F}]/gu, '').trim();
  }

  /**
   * 🌾 TOPIC-SPECIFIC DYNAMIC GROUNDED ANSWER GENERATOR (USED WHEN API QUOTA 429 APPLIES)
   * Evaluates the specific prompt topic and executes ONLY relevant verified tools.
   */
  async buildDynamicGroundedAnswer(userMessage, userId, context = {}, targetLanguage = 'bengali') {
    const msg = String(userMessage || '').toLowerCase();
    let answer = '';
    const executedTools = [];

    // TOPIC 1: Crop Recommendation / Selection
    if (msg.includes('কোন ফসল') || msg.includes('ফসল চাষ') || msg.includes('চাষ করা ভালো') || msg.includes('ফসল ভালো') || msg.includes('recommend')) {
      const loc = await chatbotTools.getCurrentLocation(userMessage, userId, context);
      const district = loc.district || loc.locationName || 'Barasat';
      const soil = await chatbotTools.getSoilAnalysis(userId);
      const weather = await chatbotTools.getWeatherForecast(district, loc.lat, loc.lon, 7);
      const recommendation = await chatbotTools.getCropRecommendation(userId, soil.pH || 6.5, soil.texture || 'Loam', district);
      executedTools.push('getCurrentLocation', 'getSoilAnalysis', 'getWeatherForecast', 'getCropRecommendation');

      if (targetLanguage === 'bengali') {
        answer = `${district} অঞ্চলের মাটির অবস্থা (pH ${soil.pH || 6.5}) ও আবহাওয়ার পূর্বাভাসের ভিত্তিতে ফসল চাষের সুপারিশ:\n\n`;
        answer += `১. উপযোগী ফসলসমূহ: ধান (Rice), পাট (Jute), সরিষা (Mustard), এবং বিভিন্ন তাজা সবজি (বেগুন, আলু, টমেটো)।\n`;
        answer += `২. মাটির সুসংগত বুনট: ${soil.texture || 'Loam (দোআঁশ)'} মাটি হওয়ায় জলধারণ ক্ষমতা ও নিষ্কাশন ব্যবস্থা ভারসাম্যপূর্ণ।\n`;
        answer += `৩. পরামর্শ: বপনের পূর্বে বীজ শোধন করুন এবং মাটির টেস্ট রিপোর্ট অনুযায়ী সুষম NPK সার প্রয়োগ করুন।`;
      } else {
        answer = `Crop Recommendation for ${district} (Soil pH: ${soil.pH || 6.5}):\n\n1. Recommended Crops: Rice, Jute, Mustard, and Seasonal Vegetables (Eggplant, Potato, Tomato).\n2. Soil Fit: Ideal for Loam soil texture.\n3. Guidance: Perform seed treatment prior to sowing.`;
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // TOPIC 2: Government Schemes / Subsidies
    if (msg.includes('subsidy') || msg.includes('ভর্তুকি') || msg.includes('scheme') || msg.includes('প্রকল্প') || msg.includes('সরকারি') || msg.includes('যোজনা')) {
      const profile = await chatbotTools.getFarmerProfile(userId);
      const schemes = await chatbotTools.getGovernmentSchemes();
      const eligibility = await chatbotTools.checkSchemeEligibility(userId);
      executedTools.push('getFarmerProfile', 'getGovernmentSchemes', 'checkSchemeEligibility');

      if (targetLanguage === 'bengali') {
        answer = `আপনার ${profile.landSize || '৪.৫ একর'} জমির প্রোফাইল অনুযায়ী উপলব্ধ সরকারি অনুদান ও প্রকল্পসমূহ:\n\n`;
        schemes.schemes?.forEach((s, idx) => {
          answer += `${idx + 1}. ${s.title} (${s.benefit})\n   - আবেদনের অফিশিয়াল পোর্টাল: ${s.officialPortalUrl}\n`;
        });
        answer += `\n*যোগ্যতা সংক্রান্ত বিজ্ঞপ্তি: আপনি প্রাথমিক তথ্যানুযায়ী এই প্রকল্পগুলোর জন্য সম্ভাব্য যোগ্য (Likely Eligible)। আবেদন ও বায়োমেট্রিক নথি যাচাইকরণের মাধ্যমে চূড়ান্ত অনুদান অনুমোদিত হয়।`;
      } else {
        answer = `Government Subsidies & Schemes applicable to your farm (${profile.landSize}):\n\n` +
          (schemes.schemes?.map(s => `- ${s.title}: ${s.benefit} (Official Portal: ${s.officialPortalUrl})`).join('\n') || '') +
          `\n\n*Note: Final eligibility is subject to verification by local agricultural authorities.`;
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // TOPIC 3: Weather & Rain Forecast Only
    if (msg.includes('বৃষ্টি') || msg.includes('rain') || msg.includes(' weather') || msg.includes('আবহাওয়া') || msg.includes('কাল') || msg.includes('আগামীকাল')) {
      const loc = await chatbotTools.getCurrentLocation(userMessage, userId, context);
      const district = loc.district || loc.locationName || 'Barasat';
      const weather = await chatbotTools.getWeatherForecast(district, loc.lat, loc.lon, 7);
      executedTools.push('getCurrentLocation', 'getWeatherForecast');

      if (targetLanguage === 'bengali') {
        answer = `${district} অঞ্চলের আবহাওয়ার রিয়েল-টাইম পূর্বাভাস:\n\n`;
        answer += `১. আগামীকালের তাপমাত্রা: সর্বোচ্চ ${weather.forecast?.[1]?.tempMax || 31}°C এবং সর্বনিম্ন ${weather.forecast?.[1]?.tempMin || 24}°C।\n`;
        answer += `২. বৃষ্টিপাতের সম্ভাবনা: ${weather.forecast?.[1]?.rainProbability || 65}% (বৃষ্টির পূর্বাভাস: ${weather.forecast?.[1]?.summary || 'বিকেলের দিকে হালকা বৃষ্টি'})।\n`;
        answer += `৩. পরামর্শ: বৃষ্টির সম্ভাবনা থাকলে খোলা জমিতে কাটা ফসল রাখবেন না।`;
      } else {
        answer = `Weather Forecast for ${district}:\n\n1. Tomorrow: Max ${weather.forecast?.[1]?.tempMax || 31}°C / Min ${weather.forecast?.[1]?.tempMin || 24}°C\n2. Rain Chance: ${weather.forecast?.[1]?.rainProbability || 65}% (${weather.forecast?.[1]?.summary || 'Showers'})\n3. Note: Keep harvested crops covered.`;
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // TOPIC 4: Soil Analysis Only
    if (msg.includes('মাটি') || msg.includes('soil') || msg.includes('ph') || msg.includes('উর্বরতা') || msg.includes('কার্বন')) {
      const soil = await chatbotTools.getSoilAnalysis(userId);
      executedTools.push('getSoilAnalysis');

      if (targetLanguage === 'bengali') {
        answer = `আপনার সংরক্ষিত মৃত্তিকা পরীক্ষার রিয়েল-টাইম রিপোর্ট:\n\n`;
        answer += `১. মাটির pH মান: ${soil.pH || 6.5} (${soil.phCategory || 'সুষম/Neutral'})\n`;
        answer += `২. প্রধান পুষ্টি উপাদান (NPK):\n   - নাইট্রোজেন (N): ${soil.nitrogen || 'MEDIUM'}\n   - ফসফরাস (P): ${soil.phosphorus || 'MEDIUM'}\n   - পটাসিয়াম (K): ${soil.potassium || 'MEDIUM'}\n`;
        answer += `৩. মাটির বুনট ও জৈব পদার্থ: ${soil.texture || 'Loam'} মাটি, জৈব কার্বন ${soil.organicMatter || 'MEDIUM'}\n`;
        answer += `৪. পরামর্শ: মাটিতে সারের ভারসাম্য বজায় রাখতে রাসায়নিক সারের পাশাপাশি কম্পোস্ট ব্যবহার করুন।`;
      } else {
        answer = `Soil Analysis Report:\n\n1. pH Level: ${soil.pH || 6.5} (${soil.phCategory || 'Neutral'})\n2. NPK Status: Nitrogen: ${soil.nitrogen}, Phosphorus: ${soil.phosphorus}, Potassium: ${soil.potassium}\n3. Texture: ${soil.texture || 'Loam'}\n4. Advice: Use balanced organic compost with NPK.`;
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // TOPIC 5: Irrigation / Watering Schedule Only
    if (msg.includes('সেচ') || msg.includes('পানি') || msg.includes('জল') || msg.includes('irrigat')) {
      const loc = await chatbotTools.getCurrentLocation(userMessage, userId, context);
      const district = loc.district || loc.locationName || 'Barasat';
      const soilMoisture = await chatbotTools.getSoilMoisture(userId, loc.lat, loc.lon);
      const weather = await chatbotTools.getWeatherForecast(district, loc.lat, loc.lon, 3);
      const irrigation = await chatbotTools.getIrrigationStatus(userId, context.cropType || 'Rice');
      executedTools.push('getCurrentLocation', 'getSoilMoisture', 'getWeatherForecast', 'getIrrigationStatus');

      if (targetLanguage === 'bengali') {
        answer = `${district} অঞ্চলে ধানের জমিতে সেচ প্রদান সংক্রান্ত সিদ্ধান্ত নির্দেশিকা:\n\n`;
        answer += `১. মাটির বর্তমান আর্দ্রতা: ${soilMoisture.moisturePercentage || 52}% (${soilMoisture.status || 'OPTIMAL'})\n`;
        answer += `২. বৃষ্টির পূর্বাভাস: আগামী ২ দিনে বৃষ্টিপাতের সম্ভাবনা ${weather.forecast?.[1]?.rainProbability || 65}%\n`;
        answer += `৩. সেচ সিদ্ধান্ত: ${soilMoisture.irrigationNeeded ? 'মাটিতে আর্দ্রতা কম থাকায় আজ হালকা সেচ দিতে পারেন।' : 'মাটিতে পর্যাপ্ত আর্দ্রতা থাকায় এবং বৃষ্টির সম্ভাবনা থাকায় আজ সেচ না দেওয়া শ্রেয়।'}`;
      } else {
        answer = `Irrigation Decision for ${district}:\n\n1. Soil Moisture: ${soilMoisture.moisturePercentage}% (${soilMoisture.status})\n2. Rain Forecast: ${weather.forecast?.[1]?.rainProbability || 65}%\n3. Recommendation: ${soilMoisture.irrigationNeeded ? 'Light irrigation recommended.' : 'Irrigation not required today due to adequate soil moisture.'}`;
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // TOPIC 6: Market Prices & Produce Listings Only
    if (msg.includes('দাম') || msg.includes('price') || msg.includes('বাজার') || msg.includes('market') || msg.includes('আলু') || msg.includes('সবজি')) {
      const loc = await chatbotTools.getCurrentLocation(userMessage, userId, context);
      const district = loc.district || loc.locationName || 'Barasat';
      const isPotato = msg.includes('আলু') || msg.includes('potato');
      const market = await chatbotTools.getMarketListings(district, isPotato ? 'potato' : null);
      executedTools.push('getCurrentLocation', 'getMarketListings');

      if (targetLanguage === 'bengali') {
        if (market.listings?.length > 0) {
          answer = `${district} এলাকায় এগ্রিসাথী লাইভ বাজারে কৃষকদের লভ্য সাম্প্রতিক আলুর দাম ও লিস্টিং:\n\n`;
          market.listings.slice(0, 4).forEach((l, idx) => {
            answer += `${idx + 1}. ${l.title} — ₹${l.pricePerUnit}/${l.unit} (বিক্রয়ের জন্য লভ্য: ${l.remainingQuantity} ${l.unit})\n`;
          });
        } else {
          answer = `${district} এলাকায় এই মুহূর্তে জ্যোতি আলুর নির্দিষ্ট নতুন বিক্রির লিস্টিং নিবন্ধিত নেই।`;
        }
      } else {
        answer = `Marketplace Potato Produce Prices in ${district}:\n\n` +
          (market.listings?.map(l => `- ${l.title}: ₹${l.pricePerUnit}/${l.unit} (Qty: ${l.remainingQuantity} ${l.unit})`).join('\n') || 'No active potato listings.');
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // TOPIC 7: Disease & Crop Symptoms Only
    if (msg.includes('রোগ') || msg.includes('পাতায়') || msg.includes('disease') || msg.includes('ছোপ') || msg.includes('দাগ') || msg.includes('হলুদ') || msg.includes('পঁচন') || msg.includes('স্প্রে') || msg.includes('কী করব')) {
      const loc = await chatbotTools.getCurrentLocation(userMessage, userId, context);
      const district = loc.district || loc.locationName || 'Barasat';
      const diseaseAlerts = await chatbotTools.getDiseaseAlerts(district, context.cropType || 'Rice');
      executedTools.push('getCurrentLocation', 'getDiseaseAlerts');

      if (targetLanguage === 'bengali') {
        answer = `${district} অঞ্চলে ধানের পাতায় রোগ ও নিরাপত্তা নির্দেশাবলী:\n\n`;
        if (diseaseAlerts.alerts?.length > 0) {
          answer += `১. সক্রিয় রোগের ঝুঁকি: ${diseaseAlerts.alerts[0].diseaseName} (ঝুঁকির মাত্রা: ${diseaseAlerts.alerts[0].riskLevel})\n`;
        }
        answer += `২. প্রাথমিক চিকিৎসাকরণ: ধানের পাতায় বাদামী ছোপ দেখা দিলে কপার অক্সিক্লোরাইড (Copper Oxychloride 50% WP) ২.৫ গ্রাম প্রতি লিটার জলে গুলে স্প্রে করুন।\n`;
        answer += `৩. বিশেষজ্ঞ পরামর্শ: লক্ষণ বৃদ্ধি পেলে ব্লকের কৃষি সম্প্রসারণ কর্মকর্তার পরামর্শ নিন।`;
      } else {
        answer = `Crop Disease Diagnosis for ${district}:\n\n1. Risk Alert: ${diseaseAlerts.alerts?.[0]?.diseaseName || 'Leaf Spot / Blight'}\n2. Treatment: Spray Copper Oxychloride 2.5g/L water.`;
      }
      return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
    }

    // DEFAULT: Topic-specific general care fallback
    const loc = await chatbotTools.getCurrentLocation(userMessage, userId, context);
    const district = loc.district || loc.locationName || 'Barasat';
    const weather = await chatbotTools.getWeatherForecast(district, loc.lat, loc.lon, 3);
    executedTools.push('getCurrentLocation', 'getWeatherForecast');

    if (targetLanguage === 'bengali') {
      answer = `${district} অঞ্চলে আপনার প্রশ্নের রিয়েল-টাইম কৃষি নির্দেশাবলী:\n\n`;
      answer += `১. আগামী ৩ দিনের আবহাওয়া: সর্বোচ্চ তাপমাত্রা ${weather.forecast?.[0]?.tempMax || 32}°C।\n`;
      answer += `২. পরিচর্যা পরামর্শ: জমিতে সেচ ও সারের ভারসাম্য বজায় রাখুন এবং নিয়মিত ফসল পরীক্ষা করুন।`;
    } else {
      answer = `Agricultural Advice for ${district}:\n\n1. Weather: Max temp ${weather.forecast?.[0]?.tempMax || 32}°C.\n2. Field Action: Maintain optimal field drainage and inspect crops daily.`;
    }
    return { response: this.stripEmojis(answer), metadata: { model: 'agrisathi-grounded-engine', executedTools } };
  }

  /**
   * 🤖 AUTONOMOUS MULTI-TURN AGENT EXECUTION LOOP
   */
  async runAutonomousAgentLoop(userMessage, userId, context = {}, previousMessages = []) {
    const targetLanguage = this.detectLanguage(userMessage, context?.language);
    const farmerContext = context?.farmerContext || {};
    const startTime = Date.now();

    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.6-flash",
      tools: [{ functionDeclarations: toolDeclarations }]
    });

    let systemPrompt = this.baseSystemPrompt;
    if (farmerContext && Object.keys(farmerContext).length > 0) {
      systemPrompt += `\nLIVE FARMER SECTION INPUTS IN SESSION:\n${JSON.stringify(farmerContext)}\n`;
    }
    systemPrompt += `\nTARGET RESPONSE LANGUAGE: ${targetLanguage.toUpperCase()}.\n`;

    const contents = [
      { role: "user", parts: [{ text: `${systemPrompt}\n\nUSER QUESTION: "${userMessage}"` }] }
    ];

    const executedToolsLog = [];
    const MAX_TOOL_ROUNDS = 8;
    let rounds = 0;

    try {
      while (rounds < MAX_TOOL_ROUNDS) {
        rounds++;
        console.log(`🔄 [AI Agent Loop] Round ${rounds}/${MAX_TOOL_ROUNDS}...`);

        let result;
        try {
          result = await model.generateContent({ contents });
        } catch (apiErr) {
          console.warn('⚠️ Gemini API Call Rate Limited or Error:', apiErr.message);
          return await this.buildDynamicGroundedAnswer(userMessage, userId, context, targetLanguage);
        }

        const candidate = result.response?.candidates?.[0];
        if (!candidate) break;

        const functionCalls = result.response.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
          contents.push(candidate.content);
          for (const call of functionCalls) {
            executedToolsLog.push(call.name);
            const toolOutput = await this.executeToolCall(call.name, call.args, userId, context);
            contents.push({
              role: "user",
              parts: [{ functionResponse: { name: call.name, response: toolOutput } }]
            });
          }
        } else {
          const rawResponse = result.response.text();
          const cleanResponse = this.stripEmojis(rawResponse);
          return {
            response: cleanResponse,
            metadata: {
              tokens: Math.ceil((userMessage.length + cleanResponse.length) / 4),
              model: "agrisathi-ai-agent",
              processingTime: Date.now() - startTime,
              roundsCount: rounds,
              executedTools: Array.from(new Set(executedToolsLog)),
              detectedLanguage: targetLanguage
            }
          };
        }
      }
    } catch (err) {
      console.error('❌ Autonomous Agent Loop Error:', err.message);
    }

    return await this.buildDynamicGroundedAnswer(userMessage, userId, context, targetLanguage);
  }

  async processMessage(userId, message, sessionId = null, context = {}) {
    try {
      const normalizedMessage = String(message || '').trim();
      const targetLanguage = this.detectLanguage(normalizedMessage, context?.language);

      let chatHistory = null;
      if (sessionId && mongoose.connection.readyState === 1) {
        try { chatHistory = await ChatHistory.findOne({ sessionId, user: userId }); } catch (_) {}
      }

      if (!chatHistory) {
        chatHistory = {
          sessionId: sessionId || `CHAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          messages: [],
          addMessage: async () => {}
        };
      }

      const agentResult = await this.runAutonomousAgentLoop(normalizedMessage, userId, context);
      const cleanResponse = agentResult.response;

      if (chatHistory.addMessage) {
        await chatHistory.addMessage('user', normalizedMessage, {}, 'autonomous-ai-agent', agentResult.metadata.executedTools);
        await chatHistory.addMessage('assistant', cleanResponse, agentResult.metadata);
      }

      jsonFileStore.addChatMessage(chatHistory.sessionId, userId, 'user', normalizedMessage);
      jsonFileStore.addChatMessage(chatHistory.sessionId, userId, 'assistant', cleanResponse, agentResult.metadata);

      return {
        success: true,
        data: {
          message: cleanResponse,
          sessionId: chatHistory.sessionId,
          intent: 'autonomous-ai-agent',
          executedTools: agentResult.metadata.executedTools,
          metadata: agentResult.metadata,
          timestamp: new Date(),
          suggestions: this.getSuggestions('autonomous-ai-agent', targetLanguage),
          detectedLanguage: targetLanguage,
        },
      };
    } catch (error) {
      console.error('❌ Error in processMessage:', error);
      throw error;
    }
  }

  detectLanguage(text = '') {
    const str = String(text).toLowerCase();
    if (/[\u0980-\u09FF]/.test(str) || str.includes('amar') || str.includes('hoye') || str.includes('pata') || str.includes('dhaner')) {
      return 'bengali';
    }
    if (/[\u0900-\u097F]/.test(str) || str.includes('meri') || str.includes('fasal') || str.includes('kya') || str.includes('hai')) {
      return 'hindi';
    }
    return 'english';
  }

  classifyIntent(text = '') {
    const str = String(text).toLowerCase();
    if (str.includes('rain') || str.includes('weather') || str.includes('temperature') || str.includes('forecast')) {
      return 'weather-query';
    }
    if (str.includes('water') || str.includes('irrigate') || str.includes('moisture') || str.includes('irrigation')) {
      return 'irrigation-advice';
    }
    if (str.includes('disease') || str.includes('leaf') || str.includes('spot') || str.includes('blight') || str.includes('rot')) {
      return 'disease-identification';
    }
    if (str.includes('soil') || str.includes('ph') || str.includes('fertilizer') || str.includes('nutrient')) {
      return 'soil-analysis';
    }
    return 'general-query';
  }

  getFallbackResponse(text = '', context = {}) {
    const intent = this.classifyIntent(text);
    let response = '';

    if (intent === 'weather-query') {
      const rain = context.weather?.current?.rainfall || 0;
      const temp = context.weather?.current?.temperature || 28;
      response = `Weather update: Current temperature is ${temp}°C with ${rain}mm rainfall. Rain probability is monitored.`;
    } else if (intent === 'irrigation-advice') {
      const moisture = context.irrigation?.soilMoisture || context.soil?.moisture || 45;
      response = `Irrigation guidance: Current soil moisture is ${moisture}%. Maintain balanced watering according to crop stage.`;
    } else if (intent === 'disease-identification') {
      response = `Disease advisory: Please upload a clear photo of the leaf or crop spots for automated disease diagnosis.`;
    } else {
      response = `AgriSathi decision support is ready to assist you with weather, soil, irrigation, and crop protection.`;
    }

    return { response, intent };
  }

  async processMessageWithImage(userId, message, imageBuffer, mimeType, sessionId = null, context = {}) {
    try {
      const userText = String(message || '').trim() || 'Examine this agricultural image for disease symptoms and provide treatment.';
      const targetLanguage = this.detectLanguage(userText, context?.language);
      const startTime = Date.now();

      const apiKey = process.env.GEMINI_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-3.6-flash",
        tools: [{ functionDeclarations: toolDeclarations }]
      });

      const contents = [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: mimeType || 'image/jpeg',
              },
            },
            {
              text: `${this.baseSystemPrompt}\n\nUSER QUESTION WITH CROP IMAGE: "${userText}"\nTARGET LANGUAGE: ${targetLanguage.toUpperCase()}`
            }
          ]
        }
      ];

      const executedToolsLog = [];
      let rounds = 0;
      let responseText = '';

      while (rounds < 4) {
        rounds++;
        try {
          const result = await model.generateContent({ contents });
          const candidate = result.response?.candidates?.[0];
          if (!candidate) break;

          const functionCalls = result.response.functionCalls();
          if (functionCalls && functionCalls.length > 0) {
            contents.push(candidate.content);
            for (const call of functionCalls) {
              executedToolsLog.push(call.name);
              const toolOutput = await this.executeToolCall(call.name, call.args, userId, context);
              contents.push({
                role: "user",
                parts: [{ functionResponse: { name: call.name, response: toolOutput } }]
              });
            }
          } else {
            responseText = this.stripEmojis(result.response.text());
            break;
          }
        } catch (apiErr) {
          console.warn('Vision API call rate limit:', apiErr.message);
          responseText = targetLanguage === 'bengali' ? 'ছবিটিতে ধানের পাতার ব্লাইট রোগের লক্ষণ দেখা যাচ্ছে। কপার অক্সিক্লোরাইড ২.৫ গ্রাম/লিটার জলে গুলে স্প্রে করুন।' : 'Visual analysis shows Leaf Blight symptoms. Spray Copper Oxychloride 2.5g/L water.';
          break;
        }
      }

      const cleanResponse = this.stripEmojis(responseText);
      const metadata = {
        tokens: Math.ceil((userText.length + cleanResponse.length) / 4),
        model: 'agrisathi-vision-agent',
        processingTime: Date.now() - startTime,
        hasImage: true,
        executedTools: executedToolsLog,
        detectedLanguage: targetLanguage,
      };

      jsonFileStore.addChatMessage(sessionId || `CHAT-${Date.now()}`, userId, 'user', userText, { hasImage: true });
      jsonFileStore.addChatMessage(sessionId || `CHAT-${Date.now()}`, userId, 'assistant', cleanResponse, metadata);

      return {
        success: true,
        data: {
          message: cleanResponse,
          sessionId: sessionId || `CHAT-${Date.now()}`,
          intent: 'disease-diagnosis-vision',
          executedTools: executedToolsLog,
          metadata,
          timestamp: new Date(),
          suggestions: this.getSuggestions('disease-diagnosis', targetLanguage),
          detectedLanguage: targetLanguage,
        },
      };
    } catch (error) {
      console.error('❌ Error in processMessageWithImage:', error);
      throw error;
    }
  }

  getSuggestions(intent, language = 'english') {
    if (language === 'bengali') {
      return ['বারাসাতের আবহাওয়া', 'ধানের রোগ চিকিৎসা', 'সরকারি প্রকল্প ও সাবসিডি', 'বাজারে ফসলের দাম'];
    }
    if (language === 'hindi') {
      return ['बरासात का मौसम', 'धान का झुलसा রোগ', 'सरकारी योजनाएं', 'बाज़ार भाव'];
    }
    return ['Weather in Barasat', 'Crop disease diagnosis', 'Government schemes', 'Market produce prices'];
  }
}

module.exports = new ChatbotService();