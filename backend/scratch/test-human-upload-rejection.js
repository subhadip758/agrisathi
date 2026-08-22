require('dotenv').config({ path: './.env' });
const imageAnalysisService = require('../src/services/imageAnalysisService');
const fs = require('fs');

async function testHumanUploadRejection() {
  console.log('================================================================');
  console.log('🧪 TESTING USER HUMAN PHOTO UPLOAD REJECTION WITH GEMINI 3.6 FLASH');
  console.log('================================================================\n');

  const humanImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png";
  if (!fs.existsSync(humanImgPath)) {
    console.error('Image file not found:', humanImgPath);
    return;
  }

  const buf = fs.readFileSync(humanImgPath);
  const result = await imageAnalysisService.analyzeImage(buf, { cropType: 'rice', affectedArea: 'leaf' }, 'media_1787415162468.png');

  console.log('Analysis Result Output:');
  console.log('  is_non_plant        :', result.is_non_plant);
  console.log('  quality_status      :', result.quality_status);
  console.log('  uncertainty_status  :', result.uncertainty_status);
  console.log('  uncertainty_message :', result.uncertainty_message);
  console.log('  visual_candidates   :', result.visual_candidates);

  if (result.is_non_plant === true && result.uncertainty_status === 'rejected' && result.visual_candidates.length === 0) {
    console.log('\n✅ TEST PASSED: Human photo strictly rejected by Gemini 3.6 Flash! Zero disease candidates generated.');
  } else {
    console.error('\n❌ TEST FAILED: Human photo was not rejected!');
  }
}

testHumanUploadRejection();
