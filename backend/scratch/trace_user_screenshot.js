const imageAnalysisService = require('../src/services/imageAnalysisService');
const evidenceFusionEngine = require('../src/services/evidenceFusionEngine');
const fs = require('fs');

async function traceUserScreenshot() {
  console.log('================================================================');
  console.log('🔍 FORENSIC TRACE OF USER SCREENSHOT IMAGE: media_1787417697682.png');
  console.log('================================================================\n');

  const imgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787417697682.png";
  if (!fs.existsSync(imgPath)) {
    console.error('File not found:', imgPath);
    return;
  }

  const buf = fs.readFileSync(imgPath);
  const cropDetails = { cropType: 'rice', affectedArea: 'leaf' };

  console.log('1. Analyzing Image via imageAnalysisService.analyzeImage...');
  const visionData = await imageAnalysisService.analyzeImage(buf, cropDetails, 'media_1787417697682.png');
  console.log('Vision Output:');
  console.log(JSON.stringify(visionData, null, 2));

  console.log('\n2. Fusing Evidence via evidenceFusionEngine.fuseEvidence...');
  const fusionResult = evidenceFusionEngine.fuseEvidence(
    visionData,
    { current: { temperature: 26, humidity: 84 } },
    null, null, null,
    cropDetails
  );
  console.log('Fusion Output:');
  console.log(JSON.stringify(fusionResult, null, 2));
}

traceUserScreenshot();
