/**
 * Farmer Mode Input Validator
 * Validates inputs for the farmer-friendly fertilizer recommendation system
 */

const { getAvailableCrops, getGrowthStages } = require('../utils/cropNutrientDatabase');
const { getAllSymptoms } = require('../utils/symptomMappings');

/**
 * Validate farmer mode inputs
 */
const validateFarmerModeInputs = (data) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!data.cropType || data.cropType.trim() === '') {
    errors.push('Crop type is required');
  } else {
    // Check if crop exists in database
    const availableCrops = getAvailableCrops();
    const cropExists = availableCrops.some(crop => 
      crop.value.toLowerCase() === data.cropType.toLowerCase()
    );
    if (!cropExists) {
      errors.push(`Crop type "${data.cropType}" is not supported. Available crops: ${availableCrops.map(c => c.label).join(', ')}`);
    }
  }

  if (!data.growthStage || data.growthStage.trim() === '') {
    errors.push('Growth stage is required');
  } else if (data.cropType) {
    // Validate growth stage for the crop
    const validStages = getGrowthStages(data.cropType);
    const stageExists = validStages.some(stage => 
      stage.value.toLowerCase() === data.growthStage.toLowerCase()
    );
    if (!stageExists && validStages.length > 0) {
      errors.push(`Invalid growth stage for ${data.cropType}. Valid stages: ${validStages.map(s => s.label).join(', ')}`);
    }
  }

  // Optional but recommended fields
  if (!data.symptoms || data.symptoms.length === 0) {
    warnings.push('No symptoms selected. Recommendation will be based only on crop stage.');
  } else {
    // Validate symptoms
    const validSymptoms = getAllSymptoms();
    const validSymptomKeys = validSymptoms.map(s => s.value);
    
    data.symptoms.forEach(symptom => {
      if (!validSymptomKeys.includes(symptom)) {
        errors.push(`Invalid symptom: ${symptom}`);
      }
    });

    // Warn if too many symptoms
    if (data.symptoms.length > 5) {
      warnings.push('You selected many symptoms. Consider consulting an expert for accurate diagnosis.');
    }
  }

  // Validate soil type
  const validSoilTypes = ['sandy', 'loamy', 'clay'];
  if (data.soilType && !validSoilTypes.includes(data.soilType.toLowerCase())) {
    errors.push(`Invalid soil type. Valid types: ${validSoilTypes.join(', ')}`);
  }

  // Validate irrigation frequency
  const validIrrigation = ['daily', 'alternate', 'weekly', 'rainfall'];
  if (data.irrigationFrequency && !validIrrigation.includes(data.irrigationFrequency.toLowerCase())) {
    errors.push(`Invalid irrigation frequency. Valid options: ${validIrrigation.join(', ')}`);
  }

  // Validate farm size
  if (data.farmSize) {
    const size = parseFloat(data.farmSize);
    if (isNaN(size) || size <= 0) {
      errors.push('Farm size must be a positive number');
    } else if (size > 1000) {
      warnings.push('Farm size seems very large. Please verify the value.');
    }
  }

  // Validate last fertilizer used
  const validFertilizers = ['urea', 'dap', 'mop', 'npk', 'ssp', 'none', 'unknown'];
  if (data.lastFertilizerUsed && !validFertilizers.includes(data.lastFertilizerUsed.toLowerCase())) {
    warnings.push(`Unknown fertilizer type: ${data.lastFertilizerUsed}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Sanitize and normalize farmer mode inputs
 */
const sanitizeFarmerModeInputs = (data) => {
  return {
    cropType: data.cropType ? data.cropType.toLowerCase().trim() : '',
    growthStage: data.growthStage ? data.growthStage.toLowerCase().trim() : '',
    symptoms: Array.isArray(data.symptoms) ? data.symptoms : [],
    soilType: data.soilType ? data.soilType.toLowerCase().trim() : 'loamy',
    irrigationFrequency: data.irrigationFrequency ? data.irrigationFrequency.toLowerCase().trim() : 'alternate',
    lastFertilizerUsed: data.lastFertilizerUsed ? data.lastFertilizerUsed.toLowerCase().trim() : 'none',
    farmSize: data.farmSize ? parseFloat(data.farmSize) : 1
  };
};

/**
 * Validate expert mode inputs (existing ML-based)
 */
const validateExpertModeInputs = (data) => {
  const errors = [];

  // Check for required NPK values
  if (data.nitrogen === undefined || data.nitrogen === null) {
    errors.push('Nitrogen (N) value is required');
  } else if (data.nitrogen < 0 || data.nitrogen > 500) {
    errors.push('Nitrogen value should be between 0 and 500 kg/ha');
  }

  if (data.phosphorus === undefined || data.phosphorus === null) {
    errors.push('Phosphorus (P) value is required');
  } else if (data.phosphorus < 0 || data.phosphorus > 200) {
    errors.push('Phosphorus value should be between 0 and 200 kg/ha');
  }

  if (data.potassium === undefined || data.potassium === null) {
    errors.push('Potassium (K) value is required');
  } else if (data.potassium < 0 || data.potassium > 300) {
    errors.push('Potassium value should be between 0 and 300 kg/ha');
  }

  // pH validation
  if (data.pH !== undefined && data.pH !== null) {
    if (data.pH < 3 || data.pH > 10) {
      errors.push('pH value should be between 3 and 10');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings: []
  };
};

/**
 * Check if inputs indicate urgent action needed
 */
const checkUrgency = (data) => {
  const urgentSymptoms = [
    'yellowLeaves',
    'stuntedGrowth',
    'poorFlowering',
    'brownEdges',
    'blossomEndRot'
  ];

  if (!data.symptoms || data.symptoms.length === 0) {
    return {
      isUrgent: false,
      message: null
    };
  }

  const hasUrgentSymptom = data.symptoms.some(s => urgentSymptoms.includes(s));

  if (hasUrgentSymptom && data.symptoms.length >= 2) {
    return {
      isUrgent: true,
      message: 'Multiple severe symptoms detected. Apply fertilizer within 2-3 days for best results.'
    };
  } else if (hasUrgentSymptom) {
    return {
      isUrgent: true,
      message: 'Symptom indicates deficiency. Apply fertilizer within 5 days.'
    };
  }

  return {
    isUrgent: false,
    message: null
  };
};

/**
 * Get helpful tips based on validation results
 */
const getValidationTips = (validationResult, inputData) => {
  const tips = [];

  if (validationResult.warnings.length > 0) {
    tips.push('Please review the warnings above');
  }

  if (!inputData.symptoms || inputData.symptoms.length === 0) {
    tips.push('Tip: Selecting symptoms helps us give better recommendations');
  }

  if (!inputData.soilType) {
    tips.push('Tip: Knowing your soil type helps optimize fertilizer quantity');
  }

  if (!inputData.irrigationFrequency) {
    tips.push('Tip: Irrigation frequency affects how we calculate fertilizer doses');
  }

  return tips;
};

module.exports = {
  validateFarmerModeInputs,
  sanitizeFarmerModeInputs,
  validateExpertModeInputs,
  checkUrgency,
  getValidationTips
};