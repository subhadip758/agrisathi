const fs = require('fs');
const path = require('path');
const imageAnalysisService = require('./src/services/imageAnalysisService');
const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const treatmentEngine = require('./src/services/treatmentEngine');
const contextOrchestrator = require('./src/services/contextOrchestrator');

async function run5ImagesTrace() {
  console.log('================================================================');
  console.log('🔍 5-IMAGE ROOT CAUSE TRACE & VALIDATION SUITE');
  console.log('================================================================\n');

  const testImages = [
    { file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg', crop: 'Rice', expected: 'Bacterial Leaf Blight' },
    { file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg', crop: 'Rice', expected: 'Healthy Rice' },
    { file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg', crop: 'Wheat', expected: 'Common Bunt' },
    { file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg', crop: 'Tomato', expected: 'Early Blight' },
    { file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg', crop: 'Other', expected: 'Powdery Mildew' }
  ];

  const traceTable = [];

  for (let i = 0; i < testImages.length; i++) {
    const item = testImages[i];
    const imageBuffer = fs.readFileSync(item.file);
    const filename = path.basename(item.file);

    // 1. Image Analysis (Python TFLite ML)
    const visionData = await imageAnalysisService.analyzeImage(imageBuffer, { cropType: item.crop }, filename);
    const pythonPrediction = visionData.visual_candidates[0]?.disease;

    // 2. Weather & Context Fetch
    const farmContext = await contextOrchestrator.getUnifiedFarmContext('user_test', { cropType: item.crop, lat: 26.72, lon: 88.39 });

    // 3. Evidence Fusion Engine
    const fusionResult = evidenceFusionEngine.fuseEvidence(visionData, farmContext.weather, farmContext.soil, farmContext.water, farmContext.irrigation, { cropType: item.crop });
    const apiFinalDiagnosis = fusionResult.top_diagnosis?.disease;

    // 4. Treatment Plan Engine
    const treatmentPlan = treatmentEngine.generateTreatmentPlan(fusionResult.top_diagnosis, farmContext.weather, farmContext.soil, farmContext.water, farmContext.irrigation, { cropType: item.crop });

    // 5. Controller Payload Simulation
    const diagnosticReport = {
      _id: `DISEASE-${Date.now()}`,
      crop: visionData.crop,
      affected_part: visionData.affected_part,
      top_diagnosis: fusionResult.top_diagnosis,
      evidence_fusion: fusionResult,
      treatment_plan: treatmentPlan,
      detection: {
        diseaseName: fusionResult.top_diagnosis.disease,
        confidence: fusionResult.calibrated_confidence
      }
    };

    // 6. UI Property Unpacking Simulation (Old broken logic vs New fixed logic)
    const oldUiData = diagnosticReport.detection || diagnosticReport;
    const oldUiDisease = oldUiData.top_diagnosis?.disease || oldUiData.diseaseName || 'Wheat Leaf Rust';

    const newUiData = diagnosticReport;
    const newUiDisease = newUiData.top_diagnosis?.disease || newUiData.detection?.diseaseName || newUiData.diseaseName;

    traceTable.push({
      Image: filename,
      Crop: item.crop,
      PythonML: pythonPrediction,
      ApiFinal: apiFinalDiagnosis,
      OldUiOutput: oldUiDisease,
      FixedUiOutput: newUiDisease
    });
  }

  console.table(traceTable);
}

run5ImagesTrace();
