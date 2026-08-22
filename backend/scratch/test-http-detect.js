const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testHttpDiseaseDetect() {
  console.log('================================================================');
  console.log('📡 HTTP LIVE API TEST: POST http://localhost:5180/api/v1/disease/detect');
  console.log('================================================================\n');

  const humanImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png";
  if (!fs.existsSync(humanImgPath)) {
    console.error('File not found:', humanImgPath);
    return;
  }

  const formData = new FormData();
  formData.append('image', fs.createReadStream(humanImgPath));
  formData.append('cropType', 'rice');
  formData.append('affectedArea', 'leaf');

  try {
    const res = await axios.post('http://localhost:5180/api/v1/disease/detect', formData, {
      headers: formData.getHeaders(),
      timeout: 30000
    });

    console.log('HTTP Status Code:', res.status);
    console.log('HTTP Response Data Structure:');
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    if (err.response) {
      console.error('HTTP Error Status:', err.response.status);
      console.error('HTTP Error Body:', err.response.data);
    } else {
      console.error('HTTP Request Error:', err.message);
    }
  }
}

testHttpDiseaseDetect();
