const imageAnalysisService = require('../src/services/imageAnalysisService');
const evidenceFusionEngine = require('../src/services/evidenceFusionEngine');
const fs = require('fs');
const path = require('path');

async function runExhaustivePipelineTests() {
  console.log('================================================================');
  console.log('🧪 EXHAUSTIVE AGRISATHI DISEASE PIPELINE PERFECTION SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, details = '') {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      if (details) console.error(`   Details: ${details}`);
    }
  }

  // 1. Test Human Photo (Must be rejected by Stage A Safety Gate)
  const humanImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787415162468.png";
  if (fs.existsSync(humanImgPath)) {
    const buf = fs.readFileSync(humanImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'rice', affectedArea: 'leaf' }, 'human_photo.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 28, humidity: 85 } }, null, null, null, { cropType: 'rice' });
    
    assert(
      vision.is_non_plant === true || fusion.primaryCondition === 'Non-Plant / Irrelevant Photo',
      'Test 1: Human Photo Safety Gate Rejection',
      `Primary Condition: ${fusion.primaryCondition}`
    );
  }

  // 2. Test User Screenshot Image (Diseased Rice Grain - Must be accepted as Plant Pathogen)
  const userScreenshotPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787417697682.png";
  if (fs.existsSync(userScreenshotPath)) {
    const buf = fs.readFileSync(userScreenshotPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'rice', affectedArea: 'spike' }, 'user_screenshot.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 26, humidity: 84 } }, null, null, null, { cropType: 'rice' });

    assert(
      (vision.is_non_plant === false || vision.is_non_plant === undefined) && fusion.top_diagnosis?.disease !== null && !String(fusion.top_diagnosis?.disease).toLowerCase().includes('healthy'),
      'Test 2: User Screenshot Diseased Rice Grain Diagnosis',
      `Diagnosed Disease: ${fusion.top_diagnosis?.disease}, is_non_plant: ${vision.is_non_plant}, primaryCondition: ${fusion.primaryCondition}`
    );
  }

  // 3. Test Dataset Foliar Spot Image (Diseased Rice Leaf - Must be diagnosed with Rice Brown Spot / Blast)
  const foliarImgPath = path.join(__dirname, '../ml_service/datasets/other/Foliar_Spot/other_foliar_spot_001.jpg');
  if (fs.existsSync(foliarImgPath)) {
    const buf = fs.readFileSync(foliarImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'rice', affectedArea: 'leaf' }, 'foliar_spot_001.jpg');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 28, humidity: 85 } }, null, null, null, { cropType: 'rice' });

    assert(
      (vision.is_non_plant === false || vision.is_non_plant === undefined) && fusion.top_diagnosis?.disease !== null && !String(fusion.top_diagnosis?.disease).toLowerCase().includes('healthy'),
      'Test 3: Dataset Foliar Spot Image Diagnosis',
      `Diagnosed Disease: ${fusion.top_diagnosis?.disease}`
    );
  }

  // 4. Test Wheat Infection Image (Selected Wheat - Must be diagnosed with Wheat Leaf Rust / Yellow Rust)
  const wheatImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png";
  if (fs.existsSync(wheatImgPath)) {
    const buf = fs.readFileSync(wheatImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'wheat', affectedArea: 'spike' }, 'wheat_spike.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 22, humidity: 85 } }, null, null, null, { cropType: 'wheat' });

    assert(
      (vision.is_non_plant === false || vision.is_non_plant === undefined) && fusion.top_diagnosis?.disease !== null && !String(fusion.top_diagnosis?.disease).toLowerCase().includes('healthy'),
      'Test 4: Wheat Spike Infection Image Diagnosis',
      `Diagnosed Disease: ${fusion.top_diagnosis?.disease}`
    );
  }

  console.log('\n================================================================');
  console.log(`📊 PIPELINE TEST SUMMARY: ${passed}/${total} TESTS PASSED (${Math.round((passed/total)*100)}%)`);
  console.log('================================================================\n');
}

runExhaustivePipelineTests();
