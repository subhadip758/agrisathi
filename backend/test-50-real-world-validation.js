const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const treatmentEngine = require('./src/services/treatmentEngine');
const diseaseKnowledgeBase = require('./src/services/diseaseKnowledgeBase');
const crypto = require('crypto');

console.log('================================================================');
console.log('🌾 AGRISATHI — 50 REAL-WORLD UNSEEN SCENARIO VALIDATION SUITE');
console.log('================================================================\n');

const testCases = [
  // Category 1: Crop Mismatches (Cases 1-5)
  { id: 1, name: 'Crop Mismatch: Selected Rice, Uploaded Tomato', vision: { crop: { name: 'Tomato', detectedCrop: 'Tomato' }, quality_status: 'good', visual_candidates: [{ disease: 'Tomato Early Blight', probability: 0.88 }] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Crop Mismatch' },
  { id: 2, name: 'Crop Mismatch: Selected Wheat, Uploaded Corn', vision: { crop: { name: 'Corn', detectedCrop: 'Corn' }, quality_status: 'good', visual_candidates: [{ disease: 'Corn Common Rust', probability: 0.89 }] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Crop Mismatch' },
  { id: 3, name: 'Crop Mismatch: Selected Potato, Uploaded Sugarcane', vision: { crop: { name: 'Sugarcane', detectedCrop: 'Sugarcane' }, quality_status: 'good', visual_candidates: [{ disease: 'Sugarcane Red Rot', probability: 0.85 }] }, cropContext: { cropType: 'Potato' }, expectedCondition: 'Crop Mismatch' },
  { id: 4, name: 'Crop Mismatch: Selected Cotton, Uploaded Rice', vision: { crop: { name: 'Rice', detectedCrop: 'Rice' }, quality_status: 'good', visual_candidates: [{ disease: 'Rice Blast', probability: 0.90 }] }, cropContext: { cropType: 'Cotton' }, expectedCondition: 'Crop Mismatch' },
  { id: 5, name: 'Crop Mismatch: Selected Chilli, Uploaded Papaya', vision: { crop: { name: 'Papaya', detectedCrop: 'Papaya' }, quality_status: 'good', visual_candidates: [{ disease: 'Papaya Ringspot Virus', probability: 0.87 }] }, cropContext: { cropType: 'Chilli' }, expectedCondition: 'Crop Mismatch' },

  // Category 2: Non-Plant / Out-of-Distribution (OOD) (Cases 6-12)
  { id: 6, name: 'OOD: Human Face Photo', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Non-Plant' },
  { id: 7, name: 'OOD: Vehicle / Automobile Image', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Non-Plant' },
  { id: 8, name: 'OOD: Soil Only Field Photo', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Potato' }, expectedCondition: 'Non-Plant' },
  { id: 9, name: 'OOD: Sky Only Weather Photo', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Maize' }, expectedCondition: 'Non-Plant' },
  { id: 10, name: 'OOD: Building Structure Photo', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Sugarcane' }, expectedCondition: 'Non-Plant' },
  { id: 11, name: 'OOD: Animal / Cattle Photo', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Cotton' }, expectedCondition: 'Non-Plant' },
  { id: 12, name: 'OOD: Severely Blurry / Unreadable Image', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Tomato' }, expectedCondition: 'Non-Plant' },

  // Category 3: Healthy Crops (Cases 13-17)
  { id: 13, name: 'Healthy Wheat Leaf', vision: { crop: { name: 'Wheat' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Wheat', probability: 0.96 }] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Healthy' },
  { id: 14, name: 'Healthy Rice Canopy', vision: { crop: { name: 'Rice' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Rice', probability: 0.95 }] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Healthy' },
  { id: 15, name: 'Healthy Tomato Plant', vision: { crop: { name: 'Tomato' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Tomato', probability: 0.94 }] }, cropContext: { cropType: 'Tomato' }, expectedCondition: 'Healthy' },
  { id: 16, name: 'Healthy Corn Foliage', vision: { crop: { name: 'Corn' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Corn', probability: 0.93 }] }, cropContext: { cropType: 'Corn' }, expectedCondition: 'Healthy' },
  { id: 17, name: 'Healthy Cotton Plant', vision: { crop: { name: 'Cotton' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Cotton', probability: 0.92 }] }, cropContext: { cropType: 'Cotton' }, expectedCondition: 'Healthy' },

  // Category 4: Soil Nutrient Deficiencies (Cases 18-22)
  { id: 18, name: 'Nitrogen Deficiency (Soil N = 75 kg/ha)', vision: { crop: { name: 'Rice' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Blast', probability: 0.52 }] }, soilData: { nitrogen: 75 }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Nitrogen Deficiency' },
  { id: 19, name: 'Potassium Deficiency (Soil K = 65 kg/ha)', vision: { crop: { name: 'Wheat' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Wheat Rust', probability: 0.48 }] }, soilData: { potassium: 65 }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Potassium Deficiency' },
  { id: 20, name: 'Low Nitrogen Chlorosis in Maize', vision: { crop: { name: 'Maize' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Maize Spot', probability: 0.50 }] }, soilData: { nitrogen: 80 }, cropContext: { cropType: 'Maize' }, expectedCondition: 'Nitrogen Deficiency' },
  { id: 21, name: 'Potassium Margin Scorch in Tomato', vision: { crop: { name: 'Tomato' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Tomato Spot', probability: 0.51 }] }, soilData: { potassium: 75 }, cropContext: { cropType: 'Tomato' }, expectedCondition: 'Potassium Deficiency' },
  { id: 22, name: 'Nitrogen Deficient Cotton Soil', vision: { crop: { name: 'Cotton' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Cotton Blight', probability: 0.49 }] }, soilData: { nitrogen: 90 }, cropContext: { cropType: 'Cotton' }, expectedCondition: 'Nitrogen Deficiency' },

  // Category 5: Environmental & Water Stress (Cases 23-26)
  { id: 23, name: 'Severe Drought Stress (Moisture 12%, 0mm Rain)', vision: { crop: { name: 'Maize' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Maize Leaf Blight', probability: 0.42 }] }, soilData: { soilMoisture: 12 }, weatherContext: { insights: { recent5DayRain: 0 } }, cropContext: { cropType: 'Maize' }, expectedCondition: 'Water Stress' },
  { id: 24, name: 'Rice Moisture Deficit (Moisture 18%, 0mm Rain)', vision: { crop: { name: 'Rice' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Brown Spot', probability: 0.44 }] }, soilData: { soilMoisture: 18 }, weatherContext: { insights: { recent5DayRain: 0 } }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Water Stress' },
  { id: 25, name: 'Wheat Drought Stress (Moisture 15%, 0mm Rain)', vision: { crop: { name: 'Wheat' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Wheat Smut', probability: 0.40 }] }, soilData: { soilMoisture: 15 }, weatherContext: { insights: { recent5DayRain: 0 } }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Water Stress' },
  { id: 26, name: 'Potato Soil Moisture Deficit (Moisture 20%, 0mm Rain)', vision: { crop: { name: 'Potato' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Potato Blight', probability: 0.41 }] }, soilData: { soilMoisture: 20 }, weatherContext: { insights: { recent5DayRain: 0 } }, cropContext: { cropType: 'Potato' }, expectedCondition: 'Water Stress' },

  // Category 6: Unknown / Low Confidence Rejection (Cases 27-30)
  { id: 27, name: 'Uncertain Symptom (Visual Prob 0.32)', vision: { crop: { name: 'Potato' }, quality_status: 'good', uncertainty_status: 'uncertain', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Unknown Spot', probability: 0.32 }] }, cropContext: { cropType: 'Potato' }, expectedCondition: 'Unknown Abnormality' },
  { id: 28, name: 'Uncertain Leaf Spot (Visual Prob 0.38)', vision: { crop: { name: 'Rice' }, quality_status: 'good', uncertainty_status: 'uncertain', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Random Lesion', probability: 0.38 }] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Unknown Abnormality' },
  { id: 29, name: 'Ambiguous Foliar Symptom (Visual Prob 0.35)', vision: { crop: { name: 'Wheat' }, quality_status: 'good', uncertainty_status: 'uncertain', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Ambiguous Speckle', probability: 0.35 }] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Unknown Abnormality' },
  { id: 30, name: 'Low Evidence Crop Damage (Visual Prob 0.30)', vision: { crop: { name: 'Tomato' }, quality_status: 'good', uncertainty_status: 'uncertain', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Unidentified Blight', probability: 0.30 }] }, cropContext: { cropType: 'Tomato' }, expectedCondition: 'Unknown Abnormality' },

  // Category 7: Pathogen Diseases Across Diverse Crops (Cases 31-50)
  { id: 31, name: 'Rice Bacterial Leaf Blight', vision: { crop: { name: 'Rice' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Bacterial Leaf Blight of Rice', probability: 0.89, organ: 'leaf' }] }, cropContext: { cropType: 'Rice', growthStage: 'tillering' }, expectedCondition: 'Bacterial Leaf Blight' },
  { id: 32, name: 'Rice Blast (Magnaporthe oryzae)', vision: { crop: { name: 'Rice' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Blast', probability: 0.91, organ: 'leaf' }] }, cropContext: { cropType: 'Rice', growthStage: 'tillering' }, expectedCondition: 'Rice Blast' },
  { id: 33, name: 'Potato Late Blight', vision: { crop: { name: 'Potato' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Potato Late Blight', probability: 0.93, organ: 'leaf' }] }, cropContext: { cropType: 'Potato', growthStage: 'tuberization' }, expectedCondition: 'Potato Late Blight' },
  { id: 34, name: 'Tomato Early Blight', vision: { crop: { name: 'Tomato' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Tomato Early Blight', probability: 0.88, organ: 'leaf' }] }, cropContext: { cropType: 'Tomato', growthStage: 'flowering' }, expectedCondition: 'Tomato Early Blight' },
  { id: 35, name: 'Wheat Stripe Rust / Yellow Rust', vision: { crop: { name: 'Wheat' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Stripe Rust of Wheat', probability: 0.90, organ: 'leaf' }] }, cropContext: { cropType: 'Wheat', growthStage: 'booting' }, expectedCondition: 'Stripe Rust' },
  { id: 36, name: 'Wheat Loose Smut', vision: { crop: { name: 'Wheat' }, affected_part: { organ: 'spike' }, visual_candidates: [{ disease: 'Loose Smut of Wheat', probability: 0.92, organ: 'spike' }] }, cropContext: { cropType: 'Wheat', growthStage: 'flowering' }, expectedCondition: 'Loose Smut' },
  { id: 37, name: 'Maize Northern Leaf Blight', vision: { crop: { name: 'Maize' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Northern Corn Leaf Blight', probability: 0.87, organ: 'leaf' }] }, cropContext: { cropType: 'Maize', growthStage: 'tasseling' }, expectedCondition: 'Northern Corn Leaf Blight' },
  { id: 38, name: 'Cotton Bacterial Blight', vision: { crop: { name: 'Cotton' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Bacterial Blight of Cotton', probability: 0.86, organ: 'leaf' }] }, cropContext: { cropType: 'Cotton', growthStage: 'boll_development' }, expectedCondition: 'Bacterial Blight' },
  { id: 39, name: 'Sugarcane Red Rot', vision: { crop: { name: 'Sugarcane' }, affected_part: { organ: 'stem' }, visual_candidates: [{ disease: 'Sugarcane Red Rot', probability: 0.89, organ: 'stem' }] }, cropContext: { cropType: 'Sugarcane', growthStage: 'grand_growth' }, expectedCondition: 'Sugarcane Red Rot' },
  { id: 40, name: 'Soybean Frog Eye Leaf Spot', vision: { crop: { name: 'Soybean' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Soybean Frogeye Leaf Spot', probability: 0.85, organ: 'leaf' }] }, cropContext: { cropType: 'Soybean', growthStage: 'podding' }, expectedCondition: 'Soybean Frogeye' },
  { id: 41, name: 'Groundnut Tikka Leaf Spot', vision: { crop: { name: 'Groundnut' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Tikkar Leaf Spot of Groundnut', probability: 0.88, organ: 'leaf' }] }, cropContext: { cropType: 'Groundnut', growthStage: 'flowering' }, expectedCondition: 'Tikkar Leaf Spot' },
  { id: 42, name: 'Chilli Anthracnose / Fruit Rot', vision: { crop: { name: 'Chilli' }, affected_part: { organ: 'fruit' }, visual_candidates: [{ disease: 'Chilli Anthracnose', probability: 0.90, organ: 'fruit' }] }, cropContext: { cropType: 'Chilli', growthStage: 'fruiting' }, expectedCondition: 'Chilli Anthracnose' },
  { id: 43, name: 'Papaya Ring Spot Virus', vision: { crop: { name: 'Papaya' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Papaya Ringspot Virus', probability: 0.89, organ: 'leaf' }] }, cropContext: { cropType: 'Papaya', growthStage: 'fruiting' }, expectedCondition: 'Papaya Ringspot' },
  { id: 44, name: 'Grape Powdery Mildew', vision: { crop: { name: 'Grapes' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Grape Powdery Mildew', probability: 0.91, organ: 'leaf' }] }, cropContext: { cropType: 'Grapes', growthStage: 'berry_development' }, expectedCondition: 'Grape Powdery Mildew' },
  { id: 45, name: 'Citrus Canker', vision: { crop: { name: 'Citrus' }, affected_part: { organ: 'fruit' }, visual_candidates: [{ disease: 'Citrus Canker', probability: 0.92, organ: 'fruit' }] }, cropContext: { cropType: 'Citrus', growthStage: 'fruit_development' }, expectedCondition: 'Citrus Canker' },
  { id: 46, name: 'Banana Sigatoka Leaf Spot', vision: { crop: { name: 'Banana' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Banana Sigatoka', probability: 0.88, organ: 'leaf' }] }, cropContext: { cropType: 'Banana', growthStage: 'shooting' }, expectedCondition: 'Banana Sigatoka' },
  { id: 47, name: 'Castor Alternaria Blight', vision: { crop: { name: 'Castor' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Castor Alternaria Blight', probability: 0.86, organ: 'leaf' }] }, cropContext: { cropType: 'Castor', growthStage: 'flowering' }, expectedCondition: 'Castor Alternaria' },
  { id: 48, name: 'Apple Scab', vision: { crop: { name: 'Apple' }, affected_part: { organ: 'fruit' }, visual_candidates: [{ disease: 'Apple Scab', probability: 0.94, organ: 'fruit' }] }, cropContext: { cropType: 'Apple', growthStage: 'fruit_development' }, expectedCondition: 'Apple Scab' },
  { id: 49, name: 'Rice Brown Spot', vision: { crop: { name: 'Rice' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Brown Spot', probability: 0.89, organ: 'leaf' }] }, cropContext: { cropType: 'Rice', growthStage: 'tillering' }, expectedCondition: 'Rice Brown Spot' },
  { id: 50, name: 'Tomato Leaf Curl Virus', vision: { crop: { name: 'Tomato' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Tomato Yellow Leaf Curl', probability: 0.91, organ: 'leaf' }] }, cropContext: { cropType: 'Tomato', growthStage: 'vegetative' }, expectedCondition: 'Yellow Leaf Curl' }
];

let passed = 0;
let failed = 0;
const resultsLog = [];

testCases.forEach(tc => {
  const reqId = `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  const sha256 = crypto.createHash('sha256').update(tc.name + reqId).digest('hex');

  const result = evidenceFusionEngine.fuseEvidence(
    tc.vision,
    tc.weatherContext || {},
    tc.soilData || null,
    tc.waterData || null,
    tc.irrigationData || null,
    tc.cropContext || {}
  );

  const primary = result.primaryCondition || '';
  const topDisease = result.top_diagnosis?.disease || '';
  const combinedText = `${primary} ${topDisease}`.toLowerCase();
  const expectedLower = tc.expectedCondition.toLowerCase();

  const isMatch = combinedText.includes(expectedLower);

  const record = {
    caseId: tc.id,
    requestId: reqId,
    sha256,
    scenarioName: tc.name,
    expectedCondition: tc.expectedCondition,
    receivedPrimary: primary,
    receivedTopDisease: topDisease,
    confidence: result.calibrated_confidence || Math.round((result.top_diagnosis?.final_score || 0) * 100),
    isMatch
  };

  resultsLog.push(record);

  if (isMatch) {
    passed++;
    console.log(`[PASS] Case ${tc.id}: ${tc.name}`);
    console.log(`       -> Primary: "${primary}" | Top: "${topDisease}" | Confidence: ${record.confidence}%`);
  } else {
    failed++;
    console.log(`[FAIL] Case ${tc.id}: ${tc.name}`);
    console.log(`       -> Expected: "${tc.expectedCondition}" | Received Primary: "${primary}" | Top: "${topDisease}"`);
  }
});

console.log('\n================================================================');
console.log(`RESULTS SUMMARY: ${passed}/50 PASSED (${failed} FAILED)`);
console.log('================================================================');

const fs = require('fs');
fs.writeFileSync(__dirname + '/test-50-results.json', JSON.stringify({ passed, failed, total: 50, results: resultsLog }, null, 2));

if (failed === 0) {
  console.log('\n🎉 ALL 50 REAL-WORLD UNSEEN SCENARIO TEST CASES PASSED WITH 100% SUCCESS RATE!');
  process.exit(0);
} else {
  console.error('\n❌ SOME TEST CASES FAILED!');
  process.exit(1);
}
