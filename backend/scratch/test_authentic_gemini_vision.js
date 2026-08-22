const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
require('dotenv').config();

async function testAuthenticGeminiVision() {
  console.log('================================================================');
  console.log('🔍 TESTING GOOGLE GEMINI VISION AUTHENTIC PLANT DIAGNOSIS');
  console.log('================================================================\n');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY missing in process.env!');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const imgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787417697682.png";
  if (!fs.existsSync(imgPath)) {
    console.error('File not found:', imgPath);
    return;
  }

  const base64Image = fs.readFileSync(imgPath).toString('base64');

  const prompt = `You are an expert plant pathologist and agricultural scientist at ICAR / KVK.
Analyze this uploaded crop photograph with high precision.

Respond strictly in raw valid JSON format matching this exact structure:
{
  "is_plant": true,
  "is_human_or_non_plant": false,
  "detected_crop": "Rice",
  "detected_disease": "Rice False Smut (Ustilaginoidea virens)",
  "scientific_name": "Ustilaginoidea virens",
  "confidence": 0.92,
  "severity": "moderate",
  "symptoms": ["Orange-yellow to greenish-black velvety smut balls on grains", "Individual grains replaced by spore masses"],
  "causes": ["High relative humidity (>90%) during flowering stage", "Excessive nitrogen fertilizer application"],
  "organic_solutions": [
    {"title": "Neem Oil Extract (3%)", "description": "Foliar spray with 3% Neem oil emulsion at panicle emergence to suppress fungal spore germination.", "dosage": "30ml per liter of water"},
    {"title": "Trichoderma viride Bio-control", "description": "Apply Trichoderma viride bio-fungicide to crop canopy before flowering.", "dosage": "5g per liter of water"}
  ],
  "chemical_solutions": [
    {"title": "Copper Oxychloride 50% WP", "description": "Spray contact copper fungicide at boot leaf stage to prevent smut ball formation.", "dosage": "3g per liter of water"},
    {"title": "Propiconazole 25% EC", "description": "Apply systemic triazole fungicide at 50% panicle emergence.", "dosage": "1ml per liter of water"}
  ]
}`;

  const modelsToTry = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest'];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Calling ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64Image, mimeType: 'image/png' } }
      ]);

      const text = result.response.text();
      console.log(`\n--- Response from ${modelName} ---`);
      console.log(text);
      return;
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} failed:`, err.message);
    }
  }
}

testAuthenticGeminiVision();
