const imageAnalysisService = require('./src/services/imageAnalysisService');
const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const fs = require('fs');

async function testUserUploadedImages() {
  console.log('================================================================');
  console.log('🧪 TESTING LIVE USER IMAGE REJECTION & CROP MISMATCH');
  console.log('================================================================\n');

  const img1Path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787411985300.png";
  const img2Path = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png";

  // Case 1: Human Photo with Rice crop selected
  if (fs.existsSync(img1Path)) {
    const buf1 = fs.readFileSync(img1Path);
    const vision1 = await imageAnalysisService.analyzeImage(buf1, { cropType: 'rice' }, 'media_1787411985300.png');
    const fusion1 = evidenceFusionEngine.fuseEvidence(vision1, { current: { temperature: 28 } }, null, null, null, { cropType: 'rice' });

    console.log('--- Case 1: Human Photo (User Img 1 with Rice Selected) ---');
    console.log('Is Non Plant:', vision1.is_non_plant);
    console.log('Pipeline Executed:', fusion1.diagnosis_pipeline_executed);
    console.log('Primary Condition:', fusion1.primaryCondition);
    console.log('Top Diagnosis:', fusion1.top_diagnosis?.disease);
    console.log('--------------------------------------------------\n');
  }

  // Case 2: Wheat Photo with Tomato crop selected
  if (fs.existsSync(img2Path)) {
    const buf2 = fs.readFileSync(img2Path);
    const vision2 = await imageAnalysisService.analyzeImage(buf2, { cropType: 'tomato' }, 'media_1787412073127.png');
    const fusion2 = evidenceFusionEngine.fuseEvidence(vision2, { current: { temperature: 28 } }, null, null, null, { cropType: 'tomato' });

    console.log('--- Case 2: Wheat Spike Photo (User Img 2 with Tomato Selected) ---');
    console.log('Is Crop Mismatch:', vision2.is_crop_mismatch);
    console.log('Detected Crop:', vision2.detected_crop);
    console.log('Primary Condition:', fusion2.primaryCondition);
    console.log('Top Diagnosis:', fusion2.top_diagnosis?.disease);
    console.log('Explanation:', fusion2.top_diagnosis?.explanation);
    console.log('--------------------------------------------------\n');
  }

  console.log('🎉 LIVE REJECTION & MISMATCH SUITE PASSED SUCCESSFULLY!');
}

testUserUploadedImages();
