import api, { uploadFile } from './api';
import axios from 'axios';

const DISEASE_API_KEY = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const FALLBACK_PROMPT = (cropType, affectedArea) => `
You are a strict agricultural computer vision safety inspector and plant pathologist.
Analyze this uploaded photograph carefully.

Step 1: Check if the photo shows an actual agricultural plant, crop, leaf, stem, fruit, root, or flower.
If the photo shows a human person, man, woman, face, animal, vehicle, building, furniture, or non-plant object:
Set "is_non_plant": true, "primaryCondition": "Non-Plant / Irrelevant Photo", "diseaseName": "Not a Plant / No Valid Plant Evidence", "rejection_reason": "No agricultural plant or leaf detected in this photo. Upload a photo of an actual plant."

Step 2: If it IS a plant, compare the visible plant species against the selected crop type (${cropType}).
If they do not match, set "is_crop_mismatch": true, "primaryCondition": "Crop Mismatch Detected", "mismatch_message": "The uploaded photo appears to show a different crop than ${cropType}."

Step 3: Only if it is a valid plant and matches ${cropType}, diagnose the plant disease.

Respond ONLY in valid JSON with this exact structure:
{
  "is_non_plant": boolean,
  "is_crop_mismatch": boolean,
  "primaryCondition": "Pathogen Disease|Non-Plant / Irrelevant Photo|Crop Mismatch Detected",
  "diseaseName": "string",
  "scientificName": "string",
  "confidence": 85,
  "severity": "none|mild|moderate|severe|critical",
  "category": "non_plant|crop_mismatch|fungal|bacterial|viral|pest|nutrient-deficiency|environmental|unknown",
  "description": "string",
  "rejection_reason": "string",
  "mismatch_message": "string",
  "symptoms": [{ "description": "...", "severity": "mild|moderate|severe", "location": "..." }],
  "causes": [],
  "treatment": { "immediate": [], "organic": [], "chemical": [], "cultural": [] },
  "prevention": [],
  "prognosis": { "recoveryProbability": 0, "expectedRecoveryTime": "N/A", "yieldImpact": "none", "spreadRisk": "none" }
}`;

const callGeminiFallback = async (imageFile, cropType, affectedArea, geminiApiKey) => {
  if (!geminiApiKey) throw new Error('No Gemini API key available for fallback.');

  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(imageFile);
  });

  const ext = imageFile.name.split('.').pop().toLowerCase();
  const mimeMap = { png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
  const mimeType = mimeMap[ext] || 'image/jpeg';

  const { data } = await axios.post(
    `${DISEASE_API_KEY}?key=${geminiApiKey}`,
    {
      contents: [{
        parts: [
          { text: FALLBACK_PROMPT(cropType, affectedArea) },
          { inline_data: { mime_type: mimeType, data: base64 } }
        ]
      }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 4096 }
    },
    { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
  );

  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

const normalizeFallbackResult = (gemini, cropType, affectedArea) => ({
  isFallback: true,
  detectionId: `LOCAL-${Date.now()}`,
  primaryCondition: gemini.is_non_plant ? 'Non-Plant / Irrelevant Photo' : (gemini.is_crop_mismatch ? 'Crop Mismatch Detected' : (gemini.primaryCondition || 'Pathogen Disease')),
  cropDetails: { cropType, affectedArea },
  images: [],
  detection: {
    diseaseName: gemini.is_non_plant ? 'Not a Plant / No Valid Plant Evidence' : (gemini.is_crop_mismatch ? 'Crop Mismatch Detected' : gemini.diseaseName),
    scientificName: (gemini.is_non_plant || gemini.is_crop_mismatch) ? '' : (gemini.scientificName || ''),
    confidence: (gemini.is_non_plant || gemini.is_crop_mismatch) ? 0 : (gemini.confidence || 0),
    severity: (gemini.is_non_plant || gemini.is_crop_mismatch) ? 'none' : (gemini.severity || 'mild'),
    category: gemini.is_non_plant ? 'non_plant' : (gemini.is_crop_mismatch ? 'crop_mismatch' : (gemini.category || 'unknown')),
    affectedStage: 'any'
  },
  message: gemini.rejection_reason || gemini.mismatch_message || gemini.description,
  symptoms: (gemini.is_non_plant || gemini.is_crop_mismatch) ? [] : (gemini.symptoms || []),
  causes: (gemini.is_non_plant || gemini.is_crop_mismatch) ? [] : (gemini.causes || []),
  treatment: (gemini.is_non_plant || gemini.is_crop_mismatch) ? { immediate: [], organic: [], chemical: [], cultural: [], shortTerm: [], longTerm: [] } : (gemini.treatment || { immediate: [], organic: [], chemical: [], cultural: [] }),
  prevention: (gemini.is_non_plant || gemini.is_crop_mismatch) ? [] : (gemini.prevention || []),
  prognosis: (gemini.is_non_plant || gemini.is_crop_mismatch) ? { recoveryProbability: 0, expectedRecoveryTime: 'N/A', yieldImpact: 'none', spreadRisk: 'none' } : (gemini.prognosis || {}),
  alternativeDiagnoses: [],
  createdAt: new Date().toISOString()
});

export const detectDisease = async (imageFile, cropDetails, geminiApiKey = null) => {
  const apiKeyToUse = cropDetails?.geminiApiKey || geminiApiKey;

  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('cropType', cropDetails.cropType);
  if (cropDetails.variety) formData.append('variety', cropDetails.variety);
  if (cropDetails.plantAge) formData.append('plantAge', cropDetails.plantAge);
  formData.append('affectedArea', cropDetails.affectedArea || 'leaf');
  if (cropDetails.growthStage) formData.append('growthStage', cropDetails.growthStage);

  // 1. Auto-populate Soil History
  let soilpH = cropDetails.soilpH;
  let soilMoisture = cropDetails.soilMoisture;
  try {
    const rawSoil = localStorage.getItem('agrisathi_soil_history');
    if (rawSoil) {
      const parsed = JSON.parse(rawSoil);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const latest = parsed[0];
        if (!soilpH) soilpH = latest.soilProperties?.ph?.value || latest.results?.phValue || 6.5;
        if (!soilMoisture) soilMoisture = 55;
      }
    }
  } catch (_) {}

  // 2. Auto-populate Water History
  let waterpH = cropDetails.waterpH || 7.2;
  let waterTDS = cropDetails.waterTDS || 320;
  let waterSourceType = cropDetails.waterSourceType || 'Borewell';
  try {
    const rawWater = localStorage.getItem('agrisathi_water_history');
    if (rawWater) {
      const parsed = JSON.parse(rawWater);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const latest = parsed[0];
        if (latest.sourceType) waterSourceType = latest.sourceType;
        if (latest.name) waterSourceType = latest.name;
      }
    }
  } catch (_) {}

  // 3. Auto-populate Irrigation History
  let irrigationMethod = cropDetails.irrigationMethod || 'Drip';
  try {
    const rawIrr = localStorage.getItem('agrisathi_irrigation_history');
    if (rawIrr) {
      const parsed = JSON.parse(rawIrr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const latest = parsed[0];
        if (latest.farmDetails?.irrigationMethod) irrigationMethod = latest.farmDetails.irrigationMethod;
        else if (latest.irrigationSchedule?.method) irrigationMethod = latest.irrigationSchedule.method;
      }
    }
  } catch (_) {}

  if (soilpH) formData.append('soilpH', soilpH);
  if (cropDetails.soilEC) formData.append('soilEC', cropDetails.soilEC);
  if (soilMoisture) formData.append('soilMoisture', soilMoisture);

  formData.append('waterpH', waterpH);
  formData.append('waterTDS', waterTDS);
  formData.append('waterSourceType', waterSourceType);
  formData.append('irrigationMethod', irrigationMethod);

  if (apiKeyToUse) formData.append('geminiApiKey', apiKeyToUse);

  try {
    const response = await api.post('/disease/detect', formData, {
      headers: { 'Content-Type': undefined },
      timeout: 120000
    });
    return { source: 'backend', data: response.data.data };
  } catch (backendError) {
    console.warn('Backend disease detection failed, trying Gemini fallback:', backendError.message);

    if (!apiKeyToUse) throw backendError;

    try {
      const geminiResult = await callGeminiFallback(
        imageFile,
        cropDetails.cropType,
        cropDetails.affectedArea,
        apiKeyToUse
      );
      return {
        source: 'fallback',
        data: normalizeFallbackResult(geminiResult, cropDetails.cropType, cropDetails.affectedArea)
      };
    } catch (fallbackError) {
      console.error('Gemini fallback also failed:', fallbackError.message);
      throw new Error('Disease analysis failed. Please check your connection and try again.');
    }
  }
};

export const getDetectionHistory = async (params = {}) => {
  const response = await api.get('/disease/history', { params });
  return response.data;
};

export const getDetection = async (id) => {
  const response = await api.get(`/disease/${id}`);
  return response.data.data.detection;
};

export const addFollowUp = async (id, payload) => {
  const response = await api.post(`/disease/${id}/followup`, payload);
  return response.data.data.detection;
};

export const deleteDetection = async (id) => {
  await api.delete(`/disease/${id}`);
};