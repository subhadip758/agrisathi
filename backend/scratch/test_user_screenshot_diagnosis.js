const imageAnalysisService = require('../src/services/imageAnalysisService');
const evidenceFusionEngine = require('../src/services/evidenceFusionEngine');
const fs = require('fs');

async function testUserScreenshotDiagnosis() {
  console.log('================================================================');
  console.log('🧪 TESTING USER SCREENSHOT DIAGNOSIS ACCURACY');
  console.log('================================================================\n');

  const imgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787417697682.png";
  const buf = fs.readFileSync(imgPath);
  const cropDetails = { cropType: 'rice', affectedArea: 'spike' };

  const vision = await imageAnalysisService.analyzeImage(buf, cropDetails, 'user_diseased_rice.png');
  const fusion = evidenceFusionEngine.fuseEvidence(
    vision,
    { current: { temperature: 26, humidity: 84 } },
    null, null, null,
    cropDetails
  );

  console.log('Result for User Screenshot Image:');
  console.log('  is_non_plant       :', vision.is_non_plant);
  console.log('  Primary Condition  :', fusion.primaryCondition);
  console.log('  Diagnosed Disease  :', fusion.top_diagnosis?.disease);
  console.log('  Scientific Name    :', fusion.top_diagnosis?.scientificName);
  console.log('  Calibrated Conf    :', fusion.calibrated_confidence + '%');
  console.log('  Visual Candidates  :', vision.visual_candidates);
}

testUserScreenshotDiagnosis();
