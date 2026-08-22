const evidenceFusionEngine = require('./src/services/evidenceFusionEngine');
const treatmentEngine = require('./src/services/treatmentEngine');
const diseaseKnowledgeBase = require('./src/services/diseaseKnowledgeBase');

console.log('====================================================');
console.log('🌾 AGRISATHI — 30 UNIQUE TEST CASE MASTER VALIDATION');
console.log('====================================================\n');

const testCases = [
  // 1. Crop Mismatch Cases
  { id: 1, name: 'Crop Mismatch: Selected Rice, Uploaded Tomato', vision: { crop: { name: 'Tomato', detectedCrop: 'Tomato' }, quality_status: 'good', visual_candidates: [{ disease: 'Tomato Early Blight', probability: 0.85 }] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Crop Mismatch' },
  { id: 2, name: 'Crop Mismatch: Selected Wheat, Uploaded Corn', vision: { crop: { name: 'Corn', detectedCrop: 'Corn' }, quality_status: 'good', visual_candidates: [{ disease: 'Corn Common Rust', probability: 0.88 }] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Crop Mismatch' },
  
  // 2. Non-Plant / OOD Cases
  { id: 3, name: 'OOD: Human / Person Face Image', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Non-Plant' },
  { id: 4, name: 'OOD: Vehicle / Motorbike Image', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Non-Plant' },
  { id: 5, name: 'OOD: Soil Only Photo', vision: { is_non_plant: true, quality_status: 'non_plant_or_irrelevant', visual_candidates: [] }, cropContext: { cropType: 'Potato' }, expectedCondition: 'Non-Plant' },

  // 3. Healthy Plants
  { id: 6, name: 'Healthy Wheat Crop', vision: { crop: { name: 'Wheat' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Wheat', probability: 0.95 }] }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Healthy' },
  { id: 7, name: 'Healthy Rice Crop', vision: { crop: { name: 'Rice' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Healthy Rice', probability: 0.94 }] }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Healthy' },

  // 4. Nutrient Deficiencies
  { id: 8, name: 'Nitrogen Deficiency (Soil N = 85 kg/ha)', vision: { crop: { name: 'Rice' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Blast', probability: 0.55 }] }, soilData: { nitrogen: 85 }, cropContext: { cropType: 'Rice' }, expectedCondition: 'Nitrogen Deficiency' },
  { id: 9, name: 'Potassium Deficiency (Soil K = 70 kg/ha)', vision: { crop: { name: 'Wheat' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Wheat Rust', probability: 0.50 }] }, soilData: { potassium: 70 }, cropContext: { cropType: 'Wheat' }, expectedCondition: 'Potassium Deficiency' },

  // 5. Environmental & Water Stress
  { id: 10, name: 'Drought Stress (Soil Moisture 15%, 0mm Rain)', vision: { crop: { name: 'Maize' }, quality_status: 'good', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Maize Leaf Blight', probability: 0.45 }] }, soilData: { soilMoisture: 15 }, weatherContext: { insights: { recent5DayRain: 0 } }, cropContext: { cropType: 'Maize' }, expectedCondition: 'Water Stress' },

  // 6. Unknown / Low Confidence
  { id: 11, name: 'Low Confidence / Uncertain Disease (Visual Prob 0.35)', vision: { crop: { name: 'Potato' }, quality_status: 'good', uncertainty_status: 'uncertain', affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Unknown Spot', probability: 0.35 }] }, cropContext: { cropType: 'Potato' }, expectedCondition: 'Unknown Abnormality' },

  // 7-30. Pathogen Diseases Across Diverse Crops & Conditions
  { id: 12, name: 'Rice Bacterial Leaf Blight', vision: { crop: { name: 'Rice' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Bacterial Leaf Blight of Rice', probability: 0.89, organ: 'leaf' }] }, cropContext: { cropType: 'Rice', growthStage: 'tillering' }, expectedCondition: 'Bacterial Leaf Blight' },
  { id: 13, name: 'Rice Blast (Magnaporthe oryzae)', vision: { crop: { name: 'Rice' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Blast', probability: 0.91, organ: 'leaf' }] }, cropContext: { cropType: 'Rice', growthStage: 'tillering' }, expectedCondition: 'Rice Blast' },
  { id: 14, name: 'Potato Late Blight', vision: { crop: { name: 'Potato' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Potato Late Blight', probability: 0.93, organ: 'leaf' }] }, cropContext: { cropType: 'Potato', growthStage: 'tuberization' }, expectedCondition: 'Potato Late Blight' },
  { id: 15, name: 'Tomato Early Blight', vision: { crop: { name: 'Tomato' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Tomato Early Blight', probability: 0.88, organ: 'leaf' }] }, cropContext: { cropType: 'Tomato', growthStage: 'flowering' }, expectedCondition: 'Tomato Early Blight' },
  { id: 16, name: 'Wheat Stripe Rust / Yellow Rust', vision: { crop: { name: 'Wheat' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Stripe Rust of Wheat', probability: 0.90, organ: 'leaf' }] }, cropContext: { cropType: 'Wheat', growthStage: 'booting' }, expectedCondition: 'Stripe Rust' },
  { id: 17, name: 'Wheat Loose Smut', vision: { crop: { name: 'Wheat' }, affected_part: { organ: 'spike' }, visual_candidates: [{ disease: 'Loose Smut of Wheat', probability: 0.92, organ: 'spike' }] }, cropContext: { cropType: 'Wheat', growthStage: 'flowering' }, expectedCondition: 'Loose Smut' },
  { id: 18, name: 'Maize Northern Leaf Blight', vision: { crop: { name: 'Maize' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Northern Corn Leaf Blight', probability: 0.87, organ: 'leaf' }] }, cropContext: { cropType: 'Maize', growthStage: 'tasseling' }, expectedCondition: 'Northern Corn Leaf Blight' },
  { id: 19, name: 'Cotton Bacterial Blight', vision: { crop: { name: 'Cotton' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Bacterial Blight of Cotton', probability: 0.86, organ: 'leaf' }] }, cropContext: { cropType: 'Cotton', growthStage: 'boll_development' }, expectedCondition: 'Bacterial Blight' },
  { id: 20, name: 'Sugarcane Red Rot', vision: { crop: { name: 'Sugarcane' }, affected_part: { organ: 'stem' }, visual_candidates: [{ disease: 'Sugarcane Red Rot', probability: 0.89, organ: 'stem' }] }, cropContext: { cropType: 'Sugarcane', growthStage: 'grand_growth' }, expectedCondition: 'Sugarcane Red Rot' },
  { id: 21, name: 'Soybean Frog Eye Leaf Spot', vision: { crop: { name: 'Soybean' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Soybean Frogeye Leaf Spot', probability: 0.85, organ: 'leaf' }] }, cropContext: { cropType: 'Soybean', growthStage: 'podding' }, expectedCondition: 'Soybean Frogeye' },
  { id: 22, name: 'Groundnut Tikka Leaf Spot', vision: { crop: { name: 'Groundnut' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Tikkar Leaf Spot of Groundnut', probability: 0.88, organ: 'leaf' }] }, cropContext: { cropType: 'Groundnut', growthStage: 'flowering' }, expectedCondition: 'Tikkar Leaf Spot' },
  { id: 23, name: 'Chilli Anthracnose / Fruit Rot', vision: { crop: { name: 'Chilli' }, affected_part: { organ: 'fruit' }, visual_candidates: [{ disease: 'Chilli Anthracnose', probability: 0.90, organ: 'fruit' }] }, cropContext: { cropType: 'Chilli', growthStage: 'fruiting' }, expectedCondition: 'Chilli Anthracnose' },
  { id: 24, name: 'Papaya Ring Spot Virus', vision: { crop: { name: 'Papaya' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Papaya Ringspot Virus', probability: 0.89, organ: 'leaf' }] }, cropContext: { cropType: 'Papaya', growthStage: 'fruiting' }, expectedCondition: 'Papaya Ringspot' },
  { id: 25, name: 'Grape Powdery Mildew', vision: { crop: { name: 'Grapes' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Grape Powdery Mildew', probability: 0.91, organ: 'leaf' }] }, cropContext: { cropType: 'Grapes', growthStage: 'berry_development' }, expectedCondition: 'Grape Powdery Mildew' },
  { id: 26, name: 'Citrus Canker', vision: { crop: { name: 'Citrus' }, affected_part: { organ: 'fruit' }, visual_candidates: [{ disease: 'Citrus Canker', probability: 0.92, organ: 'fruit' }] }, cropContext: { cropType: 'Citrus', growthStage: 'fruit_development' }, expectedCondition: 'Citrus Canker' },
  { id: 27, name: 'Banana Sigatoka Leaf Spot', vision: { crop: { name: 'Banana' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Banana Sigatoka', probability: 0.88, organ: 'leaf' }] }, cropContext: { cropType: 'Banana', growthStage: 'shooting' }, expectedCondition: 'Banana Sigatoka' },
  { id: 28, name: 'Castor Alternaria Blight', vision: { crop: { name: 'Castor' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Castor Alternaria Blight', probability: 0.86, organ: 'leaf' }] }, cropContext: { cropType: 'Castor', growthStage: 'flowering' }, expectedCondition: 'Castor Alternaria' },
  { id: 29, name: 'Apple Scab', vision: { crop: { name: 'Apple' }, affected_part: { organ: 'fruit' }, visual_candidates: [{ disease: 'Apple Scab', probability: 0.94, organ: 'fruit' }] }, cropContext: { cropType: 'Apple', growthStage: 'fruit_development' }, expectedCondition: 'Apple Scab' },
  { id: 30, name: 'Rice Brown Spot', vision: { crop: { name: 'Rice' }, affected_part: { organ: 'leaf' }, visual_candidates: [{ disease: 'Rice Brown Spot', probability: 0.89, organ: 'leaf' }] }, cropContext: { cropType: 'Rice', growthStage: 'tillering' }, expectedCondition: 'Rice Brown Spot' }
];

let passed = 0;
let failed = 0;

testCases.forEach(tc => {
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

  if (isMatch) {
    passed++;
    console.log(`[PASS] Case ${tc.id}: ${tc.name}`);
    console.log(`       -> Output: Primary: "${primary}" | Top Diagnosis: "${topDisease}"`);
  } else {
    failed++;
    console.log(`[FAIL] Case ${tc.id}: ${tc.name}`);
    console.log(`       -> Expected: "${tc.expectedCondition}" | Received Primary: "${primary}" | Top: "${topDisease}"`);
  }
});

console.log('\n====================================================');
console.log(`RESULTS SUMMARY: ${passed}/30 PASSED (${failed} FAILED)`);
console.log('====================================================');

if (failed === 0) {
  console.log('\n🎉 ALL 30 UNIQUE TEST CASES PASSED WITH 100% SUCCESS RATE!');
  process.exit(0);
} else {
  console.error('\n❌ SOME TEST CASES FAILED!');
  process.exit(1);
}
