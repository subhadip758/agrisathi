require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testGeminiModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Using Gemini API Key:', apiKey ? (apiKey.substring(0, 10) + '...') : 'MISSING');

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTest = ['gemini-3.6-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

  const humanImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png";
  const imgBuffer = fs.readFileSync(humanImgPath);
  const base64Image = imgBuffer.toString('base64');

  const prompt = `Strict agricultural vision safety gate:
Is this a photograph of a plant, leaf, crop, or tree? (is_plant: true/false)
Is this a human person, man, woman, or non-plant object? (is_human_or_non_plant: true/false)
Describe what is shown in the image (description).

Respond strictly in JSON format:
{
  "is_plant": boolean,
  "is_human_or_non_plant": boolean,
  "description": string
}`;

  for (const modelName of modelsToTest) {
    try {
      console.log(`\nTesting model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Image,
            mimeType: 'image/png'
          }
        }
      ]);
      console.log(`✅ SUCCESS with ${modelName}:`);
      console.log(result.response.text());
      return;
    } catch (err) {
      console.log(`❌ FAILED with ${modelName}: ${err.message}`);
    }
  }
}

testGeminiModels();
