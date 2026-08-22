/**
 * Irrigation Rules Engine
 * Contains all the logic and rules for determining irrigation schedules
 */

/**
 * Soil moisture thresholds by soil type
 */
const SOIL_MOISTURE_THRESHOLDS = {
    'Sandy': {
      critical: 15,      // Below this: immediate irrigation needed
      low: 25,           // Below this: irrigation needed soon
      optimal: 40,       // Target range
      high: 60           // Above this: no irrigation needed
    },
    'Loamy': {
      critical: 20,
      low: 30,
      optimal: 50,
      high: 70
    },
    'Clay': {
      critical: 25,
      low: 35,
      optimal: 55,
      high: 80
    },
    'Silt': {
      critical: 18,
      low: 28,
      optimal: 45,
      high: 65
    },
    'Peaty': {
      critical: 30,
      low: 40,
      optimal: 60,
      high: 85
    },
    'Chalky': {
      critical: 15,
      low: 25,
      optimal: 40,
      high: 55
    }
  };
  
  /**
   * Calculate Evapotranspiration (ET) - Simplified Penman equation
   */
  function calculateEvapotranspiration(temperature, humidity, windSpeed = 5) {
    // Simplified ET calculation in mm/day
    const saturationVaporPressure = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    const actualVaporPressure = (humidity / 100) * saturationVaporPressure;
    const vaporPressureDeficit = saturationVaporPressure - actualVaporPressure;
    
    // Wind function (simplified)
    const windFunction = 2.6 * (1 + 0.54 * windSpeed);
    
    // Reference ET (mm/day)
    const et0 = (0.408 * temperature + windFunction * vaporPressureDeficit) / 10;
    
    return Math.max(2, Math.min(et0, 15)); // Cap between 2-15 mm/day
  }
  
  /**
   * Apply seasonal adjustments
   */
  function getSeasonalMultiplier(season) {
    const multipliers = {
      'Summer': 1.3,
      'Monsoon': 0.5,
      'Winter': 0.8,
      'Spring': 1.1,
      'Autumn': 0.9
    };
    return multipliers[season] || 1.0;
  }
  
  /**
   * Soil type water retention factor
   */
  function getSoilRetentionFactor(soilType) {
    const factors = {
      'Sandy': 0.7,      // Poor retention, more frequent irrigation
      'Loamy': 1.0,      // Ideal retention
      'Clay': 1.3,       // High retention, less frequent irrigation
      'Silt': 0.9,
      'Peaty': 1.2,
      'Chalky': 0.8
    };
    return factors[soilType] || 1.0;
  }
  
  /**
   * Temperature stress factor
   */
  function getTemperatureStressFactor(temperature) {
    if (temperature < 15) return 0.8;      // Cool, less evaporation
    if (temperature < 25) return 1.0;      // Optimal
    if (temperature < 35) return 1.3;      // Hot, more evaporation
    return 1.5;                             // Very hot, high stress
  }
  
  /**
   * Main rule: Calculate irrigation need
   */
  function calculateIrrigationNeed(params) {
    const {
      soilMoisture,
      soilType,
      temperature,
      humidity,
      rainfall,
      rainForecast,
      season,
      windSpeed = 5
    } = params;
  
    const rules = [];
    let needsIrrigation = false;
    let urgency = 'None';
    let adjustmentFactor = 1.0;
  
    // Rule 1: Check soil moisture level
    const thresholds = SOIL_MOISTURE_THRESHOLDS[soilType];
    if (soilMoisture < thresholds.critical) {
      needsIrrigation = true;
      urgency = 'Critical';
      rules.push('RULE-001: Soil moisture below critical level');
    } else if (soilMoisture < thresholds.low) {
      needsIrrigation = true;
      urgency = 'High';
      rules.push('RULE-002: Soil moisture below optimal level');
    } else if (soilMoisture < thresholds.optimal) {
      needsIrrigation = true;
      urgency = 'Medium';
      rules.push('RULE-003: Soil moisture approaching low level');
    } else if (soilMoisture > thresholds.high) {
      needsIrrigation = false;
      urgency = 'None';
      rules.push('RULE-004: Soil moisture adequate, no irrigation needed');
    }
  
    // Rule 2: Recent rainfall check
    if (rainfall > 10) {
      needsIrrigation = false;
      urgency = 'None';
      rules.push('RULE-005: Significant rainfall in last 24hrs, skip irrigation');
    }
  
    // Rule 3: Rain forecast check
    if (rainForecast > 5 && urgency !== 'Critical') {
      needsIrrigation = false;
      urgency = 'None';
      rules.push('RULE-006: Rain expected soon, delay irrigation');
    }
  
    // Rule 4: Temperature stress
    const tempFactor = getTemperatureStressFactor(temperature);
    if (temperature > 35) {
      adjustmentFactor *= 1.2;
      rules.push('RULE-007: High temperature stress, increase water by 20%');
    }
  
    // Rule 5: Low humidity stress
    if (humidity < 30) {
      adjustmentFactor *= 1.15;
      rules.push('RULE-008: Low humidity, increase water by 15%');
    }
  
    // Rule 6: Seasonal adjustment
    const seasonalMultiplier = getSeasonalMultiplier(season);
    adjustmentFactor *= seasonalMultiplier;
    rules.push(`RULE-009: Seasonal adjustment (${season}): ${seasonalMultiplier}x`);
  
    // Rule 7: Soil retention
    const soilFactor = getSoilRetentionFactor(soilType);
    adjustmentFactor *= soilFactor;
    rules.push(`RULE-010: Soil retention factor (${soilType}): ${soilFactor}x`);
  
    // Calculate ET
    const et = calculateEvapotranspiration(temperature, humidity, windSpeed);
    rules.push(`RULE-011: Calculated ET: ${et.toFixed(2)} mm/day`);
  
    return {
      needsIrrigation,
      urgency,
      adjustmentFactor,
      evapotranspiration: et,
      rulesApplied: rules
    };
  }
  
  /**
   * Calculate irrigation frequency
   */
  function calculateFrequency(soilType, season, cropStressTolerance, temperature) {
    let frequency = 'Daily';
  
    // Sandy soil needs more frequent irrigation
    if (soilType === 'Sandy') {
      if (temperature > 35) {
        frequency = 'Twice Daily';
      } else {
        frequency = 'Daily';
      }
    }
    // Clay retains water well
    else if (soilType === 'Clay' || soilType === 'Peaty') {
      if (season === 'Monsoon') {
        frequency = 'Every 4 days';
      } else if (season === 'Winter') {
        frequency = 'Every 3 days';
      } else {
        frequency = 'Every 2 days';
      }
    }
    // Loamy is balanced
    else if (soilType === 'Loamy') {
      if (season === 'Summer' && temperature > 35) {
        frequency = 'Daily';
      } else if (season === 'Monsoon') {
        frequency = 'Every 3 days';
      } else {
        frequency = 'Every 2 days';
      }
    }
  
    // Adjust based on crop stress tolerance
    if (cropStressTolerance === 'Low') {
      // More frequent irrigation for sensitive crops
      if (frequency === 'Every 3 days') frequency = 'Every 2 days';
      if (frequency === 'Every 4 days') frequency = 'Every 3 days';
    } else if (cropStressTolerance === 'High') {
      // Less frequent for tolerant crops
      if (frequency === 'Daily' && season !== 'Summer') frequency = 'Every 2 days';
      if (frequency === 'Every 2 days') frequency = 'Every 3 days';
    }
  
    return frequency;
  }
  
  /**
   * Calculate irrigation duration and quantity
   */
  function calculateIrrigationAmount(baseWaterNeed, farmSize, adjustmentFactor, cropStageMultiplier) {
    // Base water need is per acre per day
    const totalDailyNeed = baseWaterNeed * farmSize * adjustmentFactor * cropStageMultiplier;
    
    // Assuming drip irrigation efficiency of 90%
    const actualWaterNeeded = totalDailyNeed / 0.9;
    
    // Duration in minutes (assuming flow rate of 20 liters/minute per acre)
    const flowRate = 20 * farmSize;
    const duration = Math.ceil(actualWaterNeeded / flowRate);
    
    return {
      waterQuantity: Math.ceil(actualWaterNeeded),
      duration: Math.max(15, Math.min(duration, 120)), // Between 15-120 minutes
      dailyNeed: Math.ceil(totalDailyNeed)
    };
  }
  
  /**
   * Determine best irrigation times
   */
  function getBestIrrigationTimes(frequency, season, temperature) {
    let times = [];
  
    if (frequency === 'Twice Daily') {
      times = ['06:00', '18:00'];
    } else if (season === 'Summer' && temperature > 35) {
      times = ['05:30', '19:00']; // Very early morning and evening
    } else if (season === 'Summer') {
      times = ['06:00', '18:30'];
    } else if (season === 'Winter') {
      times = ['08:00']; // Late morning
    } else {
      times = ['07:00']; // Morning
    }
  
    return times;
  }
  
  /**
   * Generate water-saving tips
   */
  function generateWaterSavingTips(soilType, cropType, season) {
    const tips = [
      'Use drip irrigation for up to 50% water savings',
      'Apply mulch to reduce evaporation by 20-30%',
      'Irrigate during early morning or late evening',
      'Monitor soil moisture regularly to avoid over-watering'
    ];
  
    if (soilType === 'Sandy') {
      tips.push('Add organic matter to improve water retention in sandy soil');
    }
  
    if (season === 'Summer') {
      tips.push('Consider shade nets to reduce water evaporation');
      tips.push('Increase irrigation frequency but reduce duration');
    }
  
    if (season === 'Monsoon') {
      tips.push('Ensure proper drainage to prevent waterlogging');
      tips.push('Reduce irrigation frequency during rainy periods');
    }
  
    return tips;
  }
  
  /**
   * Generate cautionary notes
   */
  function generateCautionaryNotes(params) {
    const notes = [];
    const { soilMoisture, temperature, rainfall, season, cropStage } = params;
  
    if (soilMoisture > 80) {
      notes.push('⚠️ High soil moisture detected - risk of waterlogging and root rot');
    }
  
    if (temperature > 40) {
      notes.push('⚠️ Extreme heat alert - increase irrigation frequency');
    }
  
    if (season === 'Monsoon' && rainfall > 20) {
      notes.push('⚠️ Heavy rainfall - ensure proper drainage');
    }
  
    if (cropStage === 'Flowering') {
      notes.push('⚠️ Critical flowering stage - maintain consistent moisture');
    }
  
    if (temperature < 10) {
      notes.push('⚠️ Cold stress possible - avoid over-irrigation');
    }
  
    return notes;
  }
  
  module.exports = {
    SOIL_MOISTURE_THRESHOLDS,
    calculateIrrigationNeed,
    calculateEvapotranspiration,
    getSeasonalMultiplier,
    getSoilRetentionFactor,
    getTemperatureStressFactor,
    calculateFrequency,
    calculateIrrigationAmount,
    getBestIrrigationTimes,
    generateWaterSavingTips,
    generateCautionaryNotes
  };