const imageAnalysisService = require('../src/services/imageAnalysisService');
const evidenceFusionEngine = require('../src/services/evidenceFusionEngine');
const fs = require('fs');
const path = require('path');

async function testDiseasedPlantInference() {
  console.log('================================================================');
  console.log('🧪 TESTING DISEASED PLANT PHOTO DETECTION');
  console.log('================================================================\n');

  // Test photo 1: Diseased foliar spot image from dataset
  const foliarImgPath = path.join(__dirname, '../ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg');
  if (fs.existsSync(foliarImgPath)) {
    const buf = fs.readFileSync(foliarImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'rice', affectedArea: 'leaf' }, 'other_foliar_spot_001.jpg');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 28, humidity: 85 } }, null, null, null, { cropType: 'rice' });

    console.log('--- TEST 1: Foliar Spot Image (Selected Rice) ---');
    console.log('  is_non_plant       :', vision.is_non_plant);
    console.log('  Primary Condition  :', fusion.primaryCondition);
    console.log('  Diagnosed Disease  :', fusion.top_diagnosis?.disease);
    console.log('  Calibrated Conf    :', fusion.calibrated_confidence + '%');
    console.log('  Visual Candidates  :', vision.visual_candidates);
  }

  // Test photo 2: Wheat spike disease image
  const wheatImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png";
  if (fs.existsSync(wheatImgPath)) {
    const buf = fs.readFileSync(wheatImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'wheat', affectedArea: 'spike' }, 'wheat_spike.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 22, humidity: 85 } }, null, null, null, { cropType: 'wheat' });

    console.log('\n--- TEST 2: Wheat Spike Image (Selected Wheat) ---');
    console.log('  is_non_plant       :', vision.is_non_plant);
    console.log('  Primary Condition  :', fusion.primaryCondition);
    console.log('  Diagnosed Disease  :', fusion.top_diagnosis?.disease);
    console.log('  Calibrated Conf    :', fusion.calibrated_confidence + '%');
    console.log('  Visual Candidates  :', vision.visual_candidates);
  }
}

testDiseasedPlantInference();
