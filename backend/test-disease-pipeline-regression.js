const imageAnalysisService = require('./src/services/imageAnalysisService');
const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const diseaseKnowledgeBase = require('./src/services/diseaseKnowledgeBase');
const fs = require('fs');
const path = require('path');

async function runRegressionTestSuite() {
  console.log('================================================================');
  console.log('🧪 AGRISATHI DISEASE PIPELINE HARD REGRESSION TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  // ---------------------------------------------------------------------------
  // TEST 1: POSITIVE CASE (Valid Plant Image + Correct Selected Crop)
  // ---------------------------------------------------------------------------
  const wheatImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787412073127.png";
  if (fs.existsSync(wheatImgPath)) {
    const buf = fs.readFileSync(wheatImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'wheat' }, 'wheat_spike.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 22, humidity: 85 } }, null, null, null, { cropType: 'wheat' });
    const sciName = diseaseKnowledgeBase.getScientificName(fusion.top_diagnosis?.disease);

    const isMatch = diseaseKnowledgeBase.assertBinomialMatch(fusion.top_diagnosis?.disease, sciName);

    console.log('--- TEST 1: Positive Case (Wheat Photo + Wheat Crop Selected) ---');
    console.log('  Primary Condition :', fusion.primaryCondition);
    console.log('  Diagnosed Disease :', fusion.top_diagnosis?.disease);
    console.log('  Binomial Name     :', sciName);
    console.log('  Confidence        :', fusion.calibrated_confidence + '%');

    if (fusion.primaryCondition === 'Pathogen Disease' && fusion.top_diagnosis?.disease && sciName && isMatch) {
      console.log('  RESULT: ✅ PASS');
      passed++;
    } else {
      console.error('  RESULT: ❌ FAIL');
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 2: NEGATIVE CASE A (Non-Plant Image - Person / Face)
  // ---------------------------------------------------------------------------
  const personImgPath = "C:/Users/Subhadip/.gemini/antigravity/brain/b009c539-dbb3-4248-bfdf-a3be65bdcba6/.user_uploaded/media_1787411985300.png";
  if (fs.existsSync(personImgPath)) {
    const buf = fs.readFileSync(personImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'rice' }, 'person.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 28 } }, null, null, null, { cropType: 'rice' });

    console.log('\n--- TEST 2: Negative Case A (Non-Plant Person Photo + Rice Crop) ---');
    console.log('  Is Non Plant      :', vision.is_non_plant);
    console.log('  Pipeline Executed :', fusion.diagnosis_pipeline_executed);
    console.log('  Primary Condition :', fusion.primaryCondition);
    console.log('  Rejection Message :', vision.uncertainty_message);

    if (vision.is_non_plant === true && fusion.diagnosis_pipeline_executed === false && fusion.primaryCondition === 'Non-Plant / Irrelevant Photo') {
      console.log('  RESULT: ✅ PASS (Strictly Rejected - No False Diagnosis Generated)');
      passed++;
    } else {
      console.error('  RESULT: ❌ FAIL');
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 3: NEGATIVE CASE B (Valid Plant Image + Wrong Crop Type Selected)
  // ---------------------------------------------------------------------------
  if (fs.existsSync(wheatImgPath)) {
    const buf = fs.readFileSync(wheatImgPath);
    const vision = await imageAnalysisService.analyzeImage(buf, { cropType: 'tomato' }, 'wheat_spike.png');
    const fusion = evidenceFusionEngine.fuseEvidence(vision, { current: { temperature: 28 } }, null, null, null, { cropType: 'tomato' });

    console.log('\n--- TEST 3: Negative Case B (Wheat Photo + Tomato Selected) ---');
    console.log('  Is Crop Mismatch  :', vision.is_crop_mismatch);
    console.log('  Detected Crop     :', vision.detected_crop);
    console.log('  Primary Condition :', fusion.primaryCondition);
    console.log('  Mismatch Warning  :', vision.mismatch_message);

    if (vision.is_crop_mismatch === true && fusion.primaryCondition === 'Crop Mismatch Detected' && vision.detected_crop === 'Wheat') {
      console.log('  RESULT: ✅ PASS (Mismatch Warning Returned - No False Diagnosis)');
      passed++;
    } else {
      console.error('  RESULT: ❌ FAIL');
      failed++;
    }
  }

  // ---------------------------------------------------------------------------
  // TEST 4: NEGATIVE CASE C (Blurry / Dark Image - Low Quality)
  // ---------------------------------------------------------------------------
  const blurryBuf = Buffer.alloc(1024, 0x22); // Dark low quality dummy buffer
  const visionBlurry = await imageAnalysisService.analyzeImage(blurryBuf, { cropType: 'rice' }, 'blurry_low_quality.jpg');
  const fusionBlurry = evidenceFusionEngine.fuseEvidence(visionBlurry, { current: { temperature: 28 } }, null, null, null, { cropType: 'rice' });

  console.log('\n--- TEST 4: Negative Case C (Low Quality / Blurry Photo) ---');
  console.log('  Quality Status    :', visionBlurry.quality_status);
  console.log('  Is Non Plant      :', visionBlurry.is_non_plant);
  console.log('  Uncertainty Status:', visionBlurry.uncertainty_status);

  if (visionBlurry.is_non_plant === true || visionBlurry.quality_status === 'non_plant_or_irrelevant' || visionBlurry.uncertainty_status === 'rejected') {
    console.log('  RESULT: ✅ PASS (Low Quality / Blurry Image Prompted for Re-upload)');
    passed++;
  } else {
    console.error('  RESULT: ❌ FAIL');
    failed++;
  }

  console.log('\n================================================================');
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED (TOTAL 4 TESTS)`);
  console.log('================================================================');

  process.exit(failed === 0 ? 0 : 1);
}

runRegressionTestSuite();
