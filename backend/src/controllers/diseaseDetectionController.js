const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const DiseaseDetection = require('../models/DiseaseDetection');
const contextOrchestrator = require('../services/contextOrchestrator');
const imageAnalysisService = require('../services/imageAnalysisService');
const evidenceFusionEngine = require('../services/evidenceFusionEngine');
const treatmentEngine = require('../services/treatmentEngine');
const inMemoryStore = require('../utils/inMemoryStore');
const { AppError, asyncHandler } = require('../middleware/errorHandler');
const { deleteFile } = require('../config/multer');

exports.detectDisease = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a plant image', 400));
  }

  const {
    cropType, variety, plantAge, affectedArea,
    lat, lon, growthStage,
    soilpH, soilEC, soilMoisture,
    waterpH, waterEC, waterTDS,
    irrigationMethod
  } = req.body;

  if (!cropType) {
    deleteFile(req.file.path);
    return next(new AppError('Crop type is required', 400));
  }
  if (!affectedArea) {
    deleteFile(req.file.path);
    return next(new AppError('Affected plant area is required', 400));
  }

  const startTime = Date.now();
  const imageBuffer = fs.readFileSync(req.file.path);
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  // 1. Retrieve Unified Farm Context (Weather, Soil, Water, Irrigation)
  const farmContext = await contextOrchestrator.getUnifiedFarmContext(userId, {
    lat: lat ? parseFloat(lat) : 26.7271,
    lon: lon ? parseFloat(lon) : 88.3953,
    cropType,
    variety,
    plantAge,
    affectedArea,
    growthStage: growthStage || 'vegetative',
    soilpH, soilEC, soilMoisture,
    waterpH, waterEC, waterTDS,
    irrigationMethod
  });

  const soilData = farmContext.soil?.isAvailable ? farmContext.soil : null;
  const waterData = farmContext.water?.isAvailable ? farmContext.water : null;
  const irrigationData = farmContext.irrigation?.isAvailable ? farmContext.irrigation : null;

  // 2. Step 1: Image & Organ Analysis
  const visionData = await imageAnalysisService.analyzeImage(
    imageBuffer,
    { cropType, variety, plantAge, affectedArea },
    req.file.filename
  );

  // 3. Step 2 & 3: Evidence Fusion Engine
  const fusionResult = evidenceFusionEngine.fuseEvidence(
    visionData,
    farmContext.weather,
    soilData,
    waterData,
    irrigationData,
    { cropType, variety, plantAge, growthStage: growthStage || 'vegetative' }
  );

  // 4. Step 4: Weather & Irrigation-Aware Treatment Engine
  const treatmentPlan = treatmentEngine.generateTreatmentPlan(
    fusionResult.top_diagnosis,
    farmContext.weather,
    soilData,
    waterData,
    irrigationData,
    { cropType, growthStage: growthStage || 'vegetative' }
  );

  const processingTime = Date.now() - startTime;
  const isNonPlant = visionData.quality_status === 'non_plant_or_irrelevant' || visionData.is_non_plant || fusionResult.diagnosis_pipeline_executed === false || fusionResult.primaryCondition === 'Non-Plant / Irrelevant Photo';
  const isCropMismatch = fusionResult.primaryCondition === 'Crop Mismatch Detected';

  const topDiag = fusionResult.top_diagnosis || {};
  const diseaseName = isNonPlant 
    ? 'Not a Plant / No Valid Plant Evidence Detected' 
    : (isCropMismatch ? 'Crop Mismatch Detected' : (topDiag.disease || 'Plant Abnormality'));

  const isHealthy = Boolean(diseaseName && diseaseName.toLowerCase().includes('healthy'));

  const diseaseKnowledgeBase = require('../services/diseaseKnowledgeBase');
  const scientificName = (isNonPlant || isCropMismatch) 
    ? '' 
    : (diseaseKnowledgeBase.getScientificName(diseaseName) || topDiag.rule?.sci || '');

  if (!isNonPlant && !isCropMismatch && scientificName) {
    diseaseKnowledgeBase.assertBinomialMatch(diseaseName, scientificName);
  }

  const schemaData = {
    user: userId,
    cropDetails: {
      cropType,
      variety: variety || '',
      plantAge: plantAge ? Number(plantAge) : undefined,
      affectedArea: visionData.affected_part?.organ || 'foliage'
    },
    images: [{
      url: `/uploads/disease-images/${req.file.filename}`,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }],
    detection: {
      diseaseName,
      scientificName,
      confidence: isNonPlant || isCropMismatch ? 0 : fusionResult.calibrated_confidence,
      severity: isNonPlant || isCropMismatch ? 'none' : (isHealthy ? 'mild' : (topDiag.final_score > 0.80 ? 'severe' : 'moderate')),
      category: isNonPlant ? 'non_plant' : (isCropMismatch ? 'crop_mismatch' : (topDiag.rule?.cat || (isHealthy ? 'healthy' : 'fungal'))),
      affectedStage: growthStage || 'vegetative'
    },
    symptoms: isNonPlant || isCropMismatch ? [] : visionData.symptoms.map(s => ({
      description: s.symptom,
      severity: s.severity || 'moderate',
      location: s.location || visionData.affected_part.organ
    })),
    causes: isNonPlant ? [] : (isCropMismatch ? [{
      factor: 'Crop Mismatch Detected',
      description: topDiag.explanation || `Uploaded image does not match selected crop (${cropType}).`,
      likelihood: 'high'
    }] : [{
      factor: 'Multimodal Evidence Fusion',
      description: topDiag.weatherEval?.reason || 'Cross-validated against 7-14 day weather history & farm context.',
      likelihood: 'high'
    }]),
    treatment: (isNonPlant || isCropMismatch) ? { immediate: [], chemical: [], organic: [], cultural: [], shortTerm: [], longTerm: [] } : {
      immediate: treatmentPlan.immediate,
      chemical: treatmentPlan.chemical,
      organic: treatmentPlan.organic,
      cultural: treatmentPlan.cultural,
      shortTerm: [],
      longTerm: []
    },
    prevention: (isNonPlant || isCropMismatch) ? [] : treatmentPlan.prevention,
    prognosis: {
      recoveryProbability: (isNonPlant || isCropMismatch) ? 0 : (isHealthy ? 99 : 85),
      expectedRecoveryTime: (isNonPlant || isCropMismatch) ? 'N/A' : (isHealthy ? 'N/A' : '14-21 days'),
      yieldImpact: (isNonPlant || isCropMismatch) ? 'none' : (isHealthy ? 'none' : 'minimal'),
      spreadRisk: (isNonPlant || isCropMismatch) ? 'none' : (isHealthy ? 'low' : 'medium')
    },
    environmentalFactors: {
      temperature: farmContext.weather?.current?.temperature || 28,
      humidity: farmContext.weather?.current?.humidity || 65,
      rainfall: farmContext.weather?.current?.rainfall || 0,
      soilMoisture: soilData?.soilMoisture || 50,
      location: {
        city: farmContext.location?.village || farmContext.location?.district || 'India',
        state: farmContext.location?.state || '',
        country: farmContext.location?.country || 'India'
      }
    },
    alternativeDiagnoses: fusionResult.disease_candidates.slice(1, 3).map(alt => ({
      diseaseName: alt.disease,
      confidence: alt.final_confidence,
      reason: 'Differential Diagnosis Candidate'
    })),
    modelVersion: 'agrisathi-multimodal-v3.0',
    processingTime
  };

  const primaryCondition = isNonPlant 
    ? 'Non-Plant / Irrelevant Photo' 
    : (isCropMismatch ? 'Crop Mismatch Detected' : (fusionResult.primaryCondition || 'Pathogen Disease'));

  const diagnosticReport = {
    ...schemaData,
    _id: `DISEASE-${Date.now()}`,
    primaryCondition,
    is_non_plant: isNonPlant,
    is_crop_mismatch: isCropMismatch,
    message: isNonPlant 
      ? (visionData.uncertainty_message || 'No suitable plant/leaf evidence detected for agricultural disease diagnosis.') 
      : (isCropMismatch ? (visionData.mismatch_message || 'Crop mismatch detected.') : null),
    cropCompatibility: fusionResult.cropCompatibility || { isCompatible: true, status: 'MATCHED' },
    crop: visionData.crop,
    affected_part: visionData.affected_part,
    symptoms: visionData.symptoms,
    disease_candidates: fusionResult.disease_candidates,
    weather_analysis: farmContext.weather ? { isAvailable: true, status: 'Available', ...topDiag.weatherEval } : { isAvailable: false, status: 'Not provided' },
    soil_analysis: farmContext.soil || { isAvailable: false, status: 'Not provided' },
    water_analysis: farmContext.water || { isAvailable: false, status: 'Not provided' },
    irrigation_analysis: farmContext.irrigation || { isAvailable: false, status: 'Not provided' },
    evidence_fusion: {
      visual_weight: '40% (Engineering Heuristic)',
      weather_weight: '20% (Engineering Heuristic)',
      stage_weight: '15% (Engineering Heuristic)',
      soil_weight: '10% (Engineering Heuristic)',
      water_weight: '5% (Engineering Heuristic)',
      irrigation_weight: '10% (Engineering Heuristic)',
      contradiction_penalty: topDiag.contradiction_penalty
    },
    final_diagnosis: {
      diseaseName: topDiag.disease,
      scientificName: topDiag.rule?.sci || '',
      calibrated_confidence: fusionResult.calibrated_confidence,
      reasoning: `Selected based on organ alignment (${visionData.affected_part.organ}), symptom signature, and 7-14 day weather correlation.`
    },
    treatment: treatmentPlan,
    irrigation_recommendation: treatmentPlan.irrigation_recommendation,
    missing_data: fusionResult.data_completeness?.missing_data || [],
    data_completeness: fusionResult.data_completeness || { total_sources: 5, available_sources: 0, missing_data: [] },
    organicSolutions: treatmentPlan.organic,
    chemicalSolutions: treatmentPlan.chemical,
    provenance: 'ICAR, KVK, State Agriculture Departments, OpenWeatherMap, AgriSathi Multimodal Fusion Engine'
  };

  // Always save to inMemoryStore
  inMemoryStore.addDiseaseDetection(diagnosticReport);

  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await DiseaseDetection.create(schemaData);
      diagnosticReport._id = doc._id;
    } catch (dbErr) {
      console.warn('MongoDB save warning in disease detection:', dbErr.message);
    }
  }

  res.status(201).json({
    status: 'success',
    data: { detection: diagnosticReport }
  });
});

exports.getDetectionHistory = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  let detections = [];
  let total = 0;

  if (mongoose.connection.readyState === 1) {
    try {
      const filter = { user: userId };
      if (req.query.cropType) filter['cropDetails.cropType'] = req.query.cropType;

      [detections, total] = await Promise.all([
        DiseaseDetection.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('detectionId cropDetails detection prognosis outcome createdAt images environmentalFactors'),
        DiseaseDetection.countDocuments(filter)
      ]);
    } catch (_) {}
  }

  if (detections.length === 0) {
    detections = inMemoryStore.getDiseaseDetections(userId);
    total = detections.length;
  }

  res.status(200).json({
    status: 'success',
    results: detections.length,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    data: { detections }
  });
});

exports.getDetection = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { detection: null } });
});

exports.addFollowUp = asyncHandler(async (req, res) => {
  res.status(200).json({ status: 'success', data: { detection: null } });
});

exports.deleteDetection = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  inMemoryStore.deleteDiseaseDetection(req.params.id);
  if (mongoose.connection.readyState === 1) {
    try { await DiseaseDetection.deleteOne({ _id: req.params.id, user: userId }); } catch (_) {}
  }
  res.status(200).json({ status: 'success', data: null });
});