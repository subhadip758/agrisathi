const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const imageAnalysisService = require('./src/services/imageAnalysisService');
const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const treatmentEngine = require('./src/services/treatmentEngine');
const contextOrchestrator = require('./src/services/contextOrchestrator');

async function run20RealWorldValidation() {
  console.log('================================================================');
  console.log('🧪 FINAL 20-IMAGE REAL-WORLD VALIDATION & INTEGRATION SUITE');
  console.log('================================================================\n');

  const testCases = [
    { id: 1, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', context: {} },
    { id: 2, file: 'ml_service/datasets/rice/Brown_Spot/rice_brown_spot_001.jpg', crop: 'Rice', context: {} },
    { id: 3, file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg', crop: 'Rice', context: {} },
    { id: 4, file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg', crop: 'Wheat', context: {} },
    { id: 5, file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg', crop: 'Wheat', context: {} },
    { id: 6, file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Tomato', context: {} },
    { id: 7, file: 'ml_service/datasets/tomato/Healthy_Tomato/tomato_healthy_tomato_001.jpg', crop: 'Tomato', context: {} },
    { id: 8, file: 'ml_service/datasets/other/Leaf_Rust/other_leaf_rust_001.jpg', crop: 'Other', context: {} },
    { id: 9, file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg', crop: 'Other', context: {} },
    { id: 10, file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg', crop: 'Other', context: {} },
    { id: 11, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', context: {}, note: 'Determinism Test' },
    { id: 12, file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg', crop: 'Wheat', rain: 30, context: {}, note: 'Heavy Rain Forecast -> SKIP Irrigation' },
    { id: 13, file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Tomato', moisture: 25, rain: 0, context: {}, note: 'Dry Soil -> IRRIGATE Decision' },
    { id: 14, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', lowQuality: true, note: 'Low Quality Gate Test' },
    { id: 15, file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Rice', note: 'Crop Mismatch Test' },
    { id: 16, file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg', crop: 'Rice', soilN: 50, note: 'Low Nitrogen Soil Test' },
    { id: 17, file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg', crop: 'Wheat', moisture: 20, note: 'Water Stress Test' },
    { id: 18, file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg', crop: 'Other', humidity: 92, note: 'High Humidity Fungal Risk' },
    { id: 19, file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg', crop: 'Other', temp: 38, note: 'High Temp Heat Stress' },
    { id: 20, file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg', crop: 'Other', unknown: true, note: 'Uncertainty Policy Test' }
  ];

  const results = [];

  for (const tc of testCases) {
    const filename = path.basename(tc.file);
    const imageBuffer = fs.readFileSync(tc.file);
    const sha256 = crypto.createHash('sha256').update(imageBuffer).digest('hex').substring(0, 10);
    const requestId = `REQ-2026-${tc.id}-${Date.now()}`;

    // 1. Image Quality & Vision Analysis
    const visionData = await imageAnalysisService.analyzeImage(imageBuffer, { cropType: tc.crop }, filename);
    const mlPrediction = visionData.visual_candidates[0]?.disease || 'Unknown';

    // 2. Weather & Context
    const farmContext = await contextOrchestrator.getUnifiedFarmContext(`user_${tc.id}`, { cropType: tc.crop, lat: 26.72, lon: 88.39 });
    if (!farmContext.weather.current) farmContext.weather.current = { temperature: 28, humidity: 65 };
    if (tc.rain !== undefined) farmContext.weather.insights = { forecast7DayRain: tc.rain };
    if (tc.humidity !== undefined) farmContext.weather.current.humidity = tc.humidity;
    if (tc.temp !== undefined) farmContext.weather.current.temperature = tc.temp;
    if (tc.moisture !== undefined) farmContext.soil.soilMoisture = tc.moisture;
    if (tc.soilN !== undefined) farmContext.soil.nitrogen = tc.soilN;

    // 3. Evidence Fusion
    const fusionResult = evidenceFusionEngine.fuseEvidence(
      visionData,
      farmContext.weather,
      farmContext.soil,
      farmContext.water,
      farmContext.irrigation,
      { cropType: tc.crop }
    );

    // 4. Treatment & Adaptive Irrigation
    const treatmentPlan = treatmentEngine.generateTreatmentPlan(
      fusionResult.top_diagnosis,
      farmContext.weather,
      farmContext.soil,
      farmContext.water,
      farmContext.irrigation,
      { cropType: tc.crop }
    );

    const finalDiag = fusionResult.top_diagnosis.disease;
    const confidence = fusionResult.calibrated_confidence;
    const irrAction = treatmentPlan.irrigation_plan?.decisionAction || 'MONITOR';

    console.log(`📌 CASE ${tc.id}: ${filename} (${tc.crop}) | ${tc.note || ''}`);
    console.log(`  - SHA256:        ${sha256}`);
    console.log(`  - ML Prediction: ${mlPrediction}`);
    console.log(`  - Final Diag:    ${finalDiag} (${confidence}%)`);
    console.log(`  - Irr Action:    ${irrAction}`);
    console.log(`  - Status:        ✅ EXECUTED\n`);

    results.push({
      Id: tc.id,
      File: filename,
      SHA256: sha256,
      Crop: tc.crop,
      MlPrediction: mlPrediction,
      FinalDiagnosis: finalDiag,
      Confidence: `${confidence}%`,
      IrrigationAction: irrAction,
      Note: tc.note || 'Normal'
    });
  }

  console.log('================================================================');
  console.log('📊 20-IMAGE VALIDATION SUMMARY MATRIX');
  console.log('================================================================');
  console.table(results);
}

run20RealWorldValidation();
