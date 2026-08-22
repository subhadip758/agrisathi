const fs = require('fs');
const path = require('path');
const imageAnalysisService = require('./src/services/imageAnalysisService');

async function test10DiseaseImages() {
  console.log('================================================================');
  console.log('🔬 REPRODUCING & VALIDATING 10 REAL DISEASE IMAGE PREDICTIONS');
  console.log('================================================================\n');

  const testCases = [
    {
      file: 'ml_service/datasets/rice/Bacterial_Leaf_Blight/rice_bacterial_leaf_blight_001.jpg',
      crop: 'Rice',
      trueClass: 'Bacterial Leaf Blight'
    },
    {
      file: 'ml_service/datasets/rice/Brown_Spot/rice_brown_spot_001.jpg',
      crop: 'Rice',
      trueClass: 'Brown Spot'
    },
    {
      file: 'ml_service/datasets/rice/Healthy_Rice/rice_healthy_rice_001.jpg',
      crop: 'Rice',
      trueClass: 'Healthy Rice'
    },
    {
      file: 'ml_service/datasets/wheat/Common_Bunt/wheat_common_bunt_001.jpg',
      crop: 'Wheat',
      trueClass: 'Common Bunt'
    },
    {
      file: 'ml_service/datasets/wheat/Healthy_Wheat/wheat_healthy_wheat_001.jpg',
      crop: 'Wheat',
      trueClass: 'Healthy Wheat'
    },
    {
      file: 'ml_service/datasets/tomato/Early_Blight/tomato_early_blight_001.jpg',
      crop: 'Tomato',
      trueClass: 'Early Blight'
    },
    {
      file: 'ml_service/datasets/tomato/Healthy_Tomato/tomato_healthy_tomato_001.jpg',
      crop: 'Tomato',
      trueClass: 'Healthy Tomato'
    },
    {
      file: 'ml_service/datasets/other/Leaf_Rust/other_leaf_rust_001.jpg',
      crop: 'Other',
      trueClass: 'Leaf Rust'
    },
    {
      file: 'ml_service/datasets/other/Healthy_Plant/other_healthy_plant_001.jpg',
      crop: 'Other',
      trueClass: 'Healthy Plant'
    },
    {
      file: 'ml_service/datasets/other/Powdery_Mildew/other_powdery_mildew_001.jpg',
      crop: 'Other',
      trueClass: 'Powdery Mildew'
    }
  ];

  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`📌 TEST ${i + 1}/10: ${path.basename(tc.file)} (${tc.crop})`);
    if (!fs.existsSync(tc.file)) {
      console.log(`⚠️ File not found: ${tc.file}`);
      continue;
    }

    const imageBuffer = fs.readFileSync(tc.file);
    const start = Date.now();
    const result = await imageAnalysisService.analyzeImage(imageBuffer, { cropType: tc.crop }, path.basename(tc.file));

    const topPred = result.visual_candidates[0];
    const isCorrect = topPred.disease.toLowerCase().includes(tc.trueClass.toLowerCase()) ||
                      tc.trueClass.toLowerCase().includes(topPred.disease.toLowerCase());

    console.log(`  - True Label:      ${tc.trueClass}`);
    console.log(`  - Predicted Label: ${topPred.disease}`);
    console.log(`  - Confidence:      ${(topPred.probability * 100).toFixed(2)}%`);
    console.log(`  - Model Version:   ${result.model_version}`);
    console.log(`  - Top-3 Candidates:`, JSON.stringify(result.visual_candidates.slice(0, 3)));
    console.log(`  - Evaluation:      ${isCorrect ? '✅ CORRECT MATCH' : '⚠️ DIFFERENT CLASS'}\n`);

    results.push({
      file: path.basename(tc.file),
      crop: tc.crop,
      trueClass: tc.trueClass,
      predictedLabel: topPred.disease,
      confidence: topPred.probability,
      correct: isCorrect
    });
  }

  console.log('================================================================');
  console.log('📊 REGRESSION MATRIX SUMMARY');
  console.log('================================================================');
  console.table(results);

  const totalDistinctPredictions = new Set(results.map(r => r.predictedLabel)).size;
  console.log(`\n🎉 Total Distinct Disease Predictions across 10 Images: ${totalDistinctPredictions}`);
  if (totalDistinctPredictions >= 5) {
    console.log('✅ PASS: Model genuinely produces distinct, class-specific predictions!');
  } else {
    console.log('❌ FAIL: Predictions are still collapsing!');
  }
}

test10DiseaseImages();
