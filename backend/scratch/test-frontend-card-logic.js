const diagnosticReport = {
  user: '650000000000000000000001',
  cropDetails: { cropType: 'rice', variety: '', affectedArea: 'leaf' },
  images: [{ url: '/uploads/disease-images/temp.jpg', filename: 'temp.jpg' }],
  detection: {
    diseaseName: 'Not a Plant / No Valid Plant Evidence Detected',
    scientificName: '',
    confidence: 0,
    severity: 'none',
    category: 'non_plant',
    affectedStage: 'vegetative'
  },
  symptoms: [],
  causes: [],
  treatment: { immediate: [], chemical: [], organic: [], cultural: [], shortTerm: [], longTerm: [] },
  prevention: [],
  prognosis: { recoveryProbability: 0, expectedRecoveryTime: 'N/A', yieldImpact: 'none', spreadRisk: 'none' },
  _id: 'DISEASE-1787415162468',
  primaryCondition: 'Non-Plant / Irrelevant Photo',
  is_non_plant: true,
  is_crop_mismatch: false,
  message: 'No suitable plant/leaf evidence detected for agricultural disease diagnosis.',
  cropCompatibility: { isCompatible: false, status: 'REJECTED' },
  final_diagnosis: {
    diseaseName: 'Not a Plant / No Valid Plant Evidence Detected',
    scientificName: '',
    calibrated_confidence: 0
  }
};

// Response from backend API: res.status(201).json({ status: 'success', data: { detection: diagnosticReport } });
// Response from diseaseService.js: return { source: 'backend', data: response.data.data };
// Value passed to DiseaseResultCard: detection = { detection: diagnosticReport };

const detectionProp = { detection: diagnosticReport };

// Evaluate DiseaseResultCard props mapping:
const rootData = detectionProp || {};
const data = rootData.detection || rootData;
const topDiagnosis = rootData.top_diagnosis || rootData.topDiagnosis || rootData.final_diagnosis || rootData.detection || rootData;
const det = topDiagnosis.detection_details || topDiagnosis.detection || {};

console.log('rootData keys:', Object.keys(rootData));
console.log('data keys:', Object.keys(data));
console.log('topDiagnosis keys:', Object.keys(topDiagnosis));
console.log('det keys:', Object.keys(det));

const diseaseRaw = topDiagnosis.disease || topDiagnosis.diseaseName || det.diseaseName || rootData.diseaseName || 'Healthy Plant';

const isNonPlant = rootData.is_non_plant === true || 
  data.is_non_plant === true ||
  rootData.primaryCondition === 'Non-Plant / Irrelevant Photo' || 
  data.primaryCondition === 'Non-Plant / Irrelevant Photo' ||
  det.category === 'non_plant' || 
  data.category === 'non_plant' || 
  rootData.diagnosis_pipeline_executed === false || 
  String(diseaseRaw).toLowerCase().includes('not a plant');

console.log('\nResults:');
console.log('diseaseRaw:', diseaseRaw);
console.log('isNonPlant:', isNonPlant);
