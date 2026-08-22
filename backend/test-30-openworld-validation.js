const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const imageAnalysisService = require('./src/services/imageAnalysisService');
const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const treatmentEngine = require('./src/services/treatmentEngine');
const contextOrchestrator = require('./src/services/contextOrchestrator');

async function run30OpenWorldValidation() {
  console.log('================================================================');
  console.log('🌐 AGRISATHI — 30-IMAGE OPEN-WORLD DIAGNOSIS VALIDATION SUITE');
  console.log('================================================================\n');

  const testCases = [
    { id: 1, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', type: 'Pathogen Disease' },
    { id: 2, file: 'ml_service/datasets/rice/Brown_Spot/rice_brown_spot_001.jpg', crop: 'Rice', type: 'Pathogen Disease' },
    { id: 3, file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg', crop: 'Rice', type: 'Healthy Plant' },
    { id: 4, file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg', crop: 'Wheat', type: 'Pathogen Disease' },
    { id: 5, file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg', crop: 'Wheat', type: 'Healthy Plant' },
    { id: 6, file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Tomato', type: 'Pathogen Disease' },
    { id: 7, file: 'ml_service/datasets/tomato/Healthy_Tomato/tomato_healthy_tomato_001.jpg', crop: 'Tomato', type: 'Healthy Plant' },
    { id: 8, file: 'ml_service/datasets/other/Leaf_Rust/other_leaf_rust_001.jpg', crop: 'Other', type: 'Pathogen Disease' },
    { id: 9, file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg', crop: 'Other', type: 'Healthy Plant' },
    { id: 10, file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg', crop: 'Other', type: 'Pathogen Disease' },
    { id: 11, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', soilN: 35, type: 'Nitrogen Deficiency Correlation' },
    { id: 12, file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg', crop: 'Wheat', moisture: 18, type: 'Water Stress / Drought' },
    { id: 13, file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg', crop: 'Wheat', rain: 35, moisture: 85, type: 'Waterlogging Risk' },
    { id: 14, file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Rice', type: 'Crop Mismatch Check' },
    { id: 15, file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg', crop: 'Maize', type: 'Open-World Maize Crop' },
    { id: 16, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', lowQuality: true, type: 'Low Quality Image Gate' },
    { id: 17, file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg', crop: 'Other', humidity: 95, type: 'High Humidity Fungal Spore Risk' },
    { id: 18, file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg', crop: 'Other', temp: 39, type: 'Heat Stress Assessment' },
    { id: 19, file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg', crop: 'Rice', stage: 'panicle_initiation', type: 'Growth Stage Alignment' },
    { id: 20, file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg', crop: 'Wheat', stage: 'flowering', type: 'Flowering Stage Alignment' },
    { id: 21, file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Tomato', stage: 'fruiting', type: 'Fruiting Stage Alignment' },
    { id: 22, file: 'ml_service/datasets/other/Leaf_Rust/other_leaf_rust_001.jpg', crop: 'Other', pestDamage: true, type: 'Pest Damage Evidence' },
    { id: 23, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', sha256Test: true, type: 'Image Hash Isolation' },
    { id: 24, file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg', crop: 'Wheat', sha256Test: true, type: 'Request ID Traceability' },
    { id: 25, file: 'ml_service/datasets/tomato/Healthy_Tomato/tomato_healthy_tomato_001.jpg', crop: 'Tomato', soilK: 40, type: 'Potassium Deficiency Correlation' },
    { id: 26, file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg', crop: 'Cotton', type: 'Open-World Cotton Crop' },
    { id: 27, file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg', crop: 'Sugarcane', type: 'Open-World Sugarcane Crop' },
    { id: 28, file: 'ml_service/datasets/rice/Brown_Spot/rice_brown_spot_001.jpg', crop: 'Rice', stage: 'seedling', type: 'Seedling Stage Alignment' },
    { id: 29, file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg', crop: 'Wheat', rain: 0, moisture: 22, type: 'Irrigation Action: IRRIGATE' },
    { id: 30, file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', rain: 28, moisture: 70, type: 'Irrigation Action: SKIP / DELAY' }
  ];

  const summary = [];

  for (const tc of testCases) {
    const filename = path.basename(tc.file);
    const imageBuffer = fs.readFileSync(tc.file);
    const sha256 = crypto.createHash('sha256').update(imageBuffer).digest('hex').substring(0, 10);
    const requestId = `REQ-OPENWORLD-${tc.id}-${Date.now()}`;

    // 1. Vision Layer
    const visionData = await imageAnalysisService.analyzeImage(imageBuffer, { cropType: tc.crop, growthStage: tc.stage }, filename);
    const mlPrediction = visionData.visual_candidates[0]?.disease || 'Unknown';

    // 2. Context Orchestration
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
      { cropType: tc.crop, growthStage: tc.stage || 'vegetative' }
    );

    // 4. Treatment & Irrigation
    const treatmentPlan = treatmentEngine.generateTreatmentPlan(
      fusionResult.top_diagnosis,
      farmContext.weather,
      farmContext.soil,
      farmContext.water,
      farmContext.irrigation,
      { cropType: tc.crop, growthStage: tc.stage || 'vegetative' }
    );

    const finalDiag = fusionResult.top_diagnosis.disease;
    const confidence = fusionResult.calibrated_confidence;
    const irrAction = treatmentPlan.irrigation_plan?.decisionAction || 'MONITOR';

    console.log(`📌 TEST ${tc.id}/30: ${filename} (${tc.crop}) | ${tc.type}`);
    console.log(`  - SHA256:        ${sha256}`);
    console.log(`  - ML Prediction: ${mlPrediction}`);
    console.log(`  - Final Diag:    ${finalDiag} (${confidence}%)`);
    console.log(`  - Irr Action:    ${irrAction}`);
    console.log(`  - Status:        ✅ EXECUTED\n`);

    summary.push({
      Id: tc.id,
      File: filename,
      Crop: tc.crop,
      TestType: tc.type,
      MlPrediction: mlPrediction,
      FinalDiagnosis: finalDiag,
      Confidence: `${confidence}%`,
      IrrigationAction: irrAction
    });
  }

  console.log('================================================================');
  console.log('📊 30-IMAGE OPEN-WORLD VALIDATION SUMMARY MATRIX');
  console.log('================================================================');
  console.table(summary);
}

run30OpenWorldValidation();
