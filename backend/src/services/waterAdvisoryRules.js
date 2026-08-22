// ============================================
// WATER ADVISORY RULE ENGINE
// Pure Rule-Based Logic (No ML, No Datasets)
// ============================================

/**
 * Main function to generate water advisory
 * @param {Object} inputs - Farmer inputs
 * @returns {Object} - Complete advisory with charts
 */
const generateWaterAdvisory = (inputs) => {
    const {
      cropType,
      cropStage,
      soilTexture,
      waterDrainage,
      soilMoisture,
      temperature,
      rainfall
    } = inputs;
  
    // Step 1: Calculate base water requirement
    const baseRequirement = calculateBaseWaterRequirement(cropType, cropStage);
    
    // Step 2: Apply soil adjustments
    const soilAdjusted = applySoilAdjustments(baseRequirement, soilTexture, waterDrainage);
    
    // Step 3: Apply weather adjustments
    const weatherAdjusted = applyWeatherAdjustments(soilAdjusted, temperature, rainfall);
    
    // Step 4: Apply moisture adjustments
    const finalRequirement = applyMoistureAdjustments(weatherAdjusted, soilMoisture);
    
    // Step 5: Make irrigation decision
    const decision = makeIrrigationDecision(finalRequirement, soilMoisture, rainfall);
    
    // Step 6: Determine water quantity
    const waterQuantity = determineWaterQuantity(finalRequirement);
    
    // Step 7: Best irrigation time
    const bestTime = determineBestTime(temperature, rainfall);
    
    // Step 8: Risk alerts
    const riskAlerts = generateRiskAlerts(soilMoisture, rainfall, waterDrainage, cropStage, finalRequirement);
    
    // Step 9: Farmer-friendly message
    const farmerMessage = generateFarmerMessage(decision, waterQuantity, cropType, cropStage, riskAlerts);
    
    // Step 10: Technical reason
    const technicalReason = generateTechnicalReason(decision, baseRequirement, finalRequirement, soilTexture, temperature, rainfall);
    
    // Step 11: Generate chart data
    const charts = generateChartData(cropType, cropStage, soilMoisture, soilTexture, finalRequirement);
  
    return {
      irrigationDecision: decision,
      waterQuantity,
      bestTime,
      riskAlerts,
      farmerMessage,
      technicalReason,
      charts,
      waterRequirementScore: Math.round(finalRequirement),
      timestamp: new Date().toISOString()
    };
  };
  
  // ============================================
  // RULE 1: BASE WATER REQUIREMENT BY CROP & STAGE
  // ============================================
  const calculateBaseWaterRequirement = (cropType, cropStage) => {
    // Water requirement matrix (0-100 scale)
    const waterMatrix = {
      rice: {
        sowing: 80,
        vegetative: 90,
        flowering: 95,
        fruiting: 85,
        harvest: 40
      },
      wheat: {
        sowing: 60,
        vegetative: 70,
        flowering: 85,
        fruiting: 80,
        harvest: 30
      },
      maize: {
        sowing: 55,
        vegetative: 75,
        flowering: 90,
        fruiting: 85,
        harvest: 35
      },
      cotton: {
        sowing: 50,
        vegetative: 70,
        flowering: 95,
        fruiting: 90,
        harvest: 40
      }
    };
  
    return waterMatrix[cropType]?.[cropStage] || 60;
  };
  
  // ============================================
  // RULE 2: SOIL TEXTURE & DRAINAGE ADJUSTMENTS
  // ============================================
  const applySoilAdjustments = (baseRequirement, soilTexture, waterDrainage) => {
    let adjusted = baseRequirement;
  
    // Soil texture multiplier
    const soilMultiplier = {
      sandy: 1.25,      // Needs more water (drains fast)
      loam: 1.0,        // Ideal soil
      clay: 0.85        // Holds water longer
    };
    adjusted *= soilMultiplier[soilTexture] || 1.0;
  
    // Drainage adjustment
    const drainageAdjustment = {
      very_fast: 15,
      fast: 10,
      normal: 0,
      slow: -10,
      very_slow: -20
    };
    adjusted += drainageAdjustment[waterDrainage] || 0;
  
    return Math.max(0, Math.min(100, adjusted));
  };
  
  // ============================================
  // RULE 3: WEATHER ADJUSTMENTS
  // ============================================
  const applyWeatherAdjustments = (requirement, temperature, rainfall) => {
    let adjusted = requirement;
  
    // Temperature adjustment (high temp = more water)
    if (temperature > 35) {
      adjusted += 15;
    } else if (temperature > 30) {
      adjusted += 10;
    } else if (temperature < 15) {
      adjusted -= 10;
    }
  
    // Rainfall adjustment
    const rainfallReduction = {
      none: 0,
      light: -15,
      moderate: -40,
      heavy: -70
    };
    adjusted += rainfallReduction[rainfall] || 0;
  
    return Math.max(0, Math.min(100, adjusted));
  };
  
  // ============================================
  // RULE 4: SOIL MOISTURE ADJUSTMENTS
  // ============================================
  const applyMoistureAdjustments = (requirement, soilMoisture) => {
    const moistureReduction = {
      dry: 0,              // No reduction
      slightly_moist: -20,  // Reduce need
      wet: -50,            // Much less needed
      waterlogged: -100    // Stop irrigation
    };
  
    let adjusted = requirement + (moistureReduction[soilMoisture] || 0);
    return Math.max(0, Math.min(100, adjusted));
  };
  
  // ============================================
  // RULE 5: IRRIGATION DECISION
  // ============================================
  const makeIrrigationDecision = (requirement, soilMoisture, rainfall) => {
    // Critical checks first
    if (soilMoisture === 'waterlogged') {
      return 'DRAIN_EXCESS_WATER';
    }
  
    if (rainfall === 'heavy' || rainfall === 'moderate') {
      return 'NO_IRRIGATION';
    }
  
    if (soilMoisture === 'wet') {
      return 'NO_IRRIGATION';
    }
  
    // Decision based on requirement score
    if (requirement >= 60) {
      return 'IRRIGATE_NOW';
    } else if (requirement >= 30) {
      return 'DELAY_IRRIGATION';
    } else {
      return 'NO_IRRIGATION';
    }
  };
  
  // ============================================
  // RULE 6: WATER QUANTITY
  // ============================================
  const determineWaterQuantity = (requirement) => {
    if (requirement >= 70) return 'HIGH';
    if (requirement >= 40) return 'MEDIUM';
    return 'LOW';
  };
  
  // ============================================
  // RULE 7: BEST IRRIGATION TIME
  // ============================================
  const determineBestTime = (temperature, rainfall) => {
    if (rainfall === 'heavy' || rainfall === 'moderate') {
      return 'Not Recommended';
    }
  
    if (temperature > 30) {
      return 'Evening';  // Cooler time
    }
  
    return 'Morning';  // Default best time
  };
  
  // ============================================
  // RULE 8: RISK ALERTS
  // ============================================
  const generateRiskAlerts = (soilMoisture, rainfall, waterDrainage, cropStage, requirement) => {
    const alerts = [];
  
    // Water stress check
    if (soilMoisture === 'dry' && requirement > 70) {
      alerts.push('Water stress - Urgent irrigation needed');
    }
  
    // Over-irrigation check
    if (soilMoisture === 'wet' && rainfall !== 'none') {
      alerts.push('Over-irrigation risk - Skip watering');
    }
  
    // Root rot check
    if (soilMoisture === 'waterlogged' || (soilMoisture === 'wet' && waterDrainage === 'very_slow')) {
      alerts.push('Root rot risk - Improve drainage immediately');
    }
  
    // Nutrient leaching check
    if (rainfall === 'heavy' && waterDrainage === 'very_fast') {
      alerts.push('Nutrient leaching - Consider fertilizer application');
    }
  
    // Critical stage check
    if ((cropStage === 'flowering' || cropStage === 'fruiting') && soilMoisture === 'dry') {
      alerts.push('Critical growth stage - Water deficit can reduce yield');
    }
  
    return alerts.length > 0 ? alerts : ['No major risks detected'];
  };
  
  // ============================================
  // RULE 9: FARMER-FRIENDLY MESSAGE
  // ============================================
  const generateFarmerMessage = (decision, waterQuantity, cropType, cropStage, riskAlerts) => {
    const messages = {
      IRRIGATE_NOW: `🌾 Please water your ${cropType} field NOW. This is the ${cropStage} stage which needs good water. Use ${waterQuantity.toLowerCase()} amount of water. ${riskAlerts.length > 1 ? '⚠️ Check alerts below!' : '✅ Your crop is doing well!'}`,
      
      DELAY_IRRIGATION: `⏰ Your ${cropType} field has enough water for now. You can water after 1-2 days. Keep checking the soil. ${riskAlerts.length > 1 ? 'Watch for warnings below.' : 'All good!'}`,
      
      NO_IRRIGATION: `✋ Do NOT water your ${cropType} field today. The soil has enough moisture. Save water and money! ${riskAlerts.length > 1 ? '⚠️ But check alerts below.' : '👍 Perfect condition!'}`,
      
      DRAIN_EXCESS_WATER: `🚨 URGENT: Your field has TOO MUCH water! This can damage roots. Stop irrigation immediately and improve drainage. Your ${cropType} needs help!`
    };
  
    return messages[decision] || 'Check your field condition and decide carefully.';
  };
  
  // ============================================
  // RULE 10: TECHNICAL REASON
  // ============================================
  const generateTechnicalReason = (decision, baseRequirement, finalRequirement, soilTexture, temperature, rainfall) => {
    return `Decision: ${decision}. Base water need was ${Math.round(baseRequirement)}%, adjusted to ${Math.round(finalRequirement)}% after considering ${soilTexture} soil, ${temperature}°C temperature, and ${rainfall} rainfall. This ensures optimal water use for your crop.`;
  };
  
  // ============================================
  // RULE 11: GENERATE CHART DATA
  // ============================================
  const generateChartData = (cropType, cropStage, soilMoisture, soilTexture, finalRequirement) => {
    // Chart 1: Soil Moisture Status (Pie Chart)
    const moistureValues = {
      dry: soilMoisture === 'dry' ? 100 : 0,
      slightly_moist: soilMoisture === 'slightly_moist' ? 100 : 0,
      wet: soilMoisture === 'wet' ? 100 : 0,
      waterlogged: soilMoisture === 'waterlogged' ? 100 : 0
    };
  
    const soilMoistureChart = {
      labels: ['Dry', 'Slightly Moist', 'Wet', 'Waterlogged'],
      values: [
        moistureValues.dry,
        moistureValues.slightly_moist,
        moistureValues.wet,
        moistureValues.waterlogged
      ]
    };
  
    // Chart 2: Water Requirement by Crop Stage (Bar Chart)
    const stageRequirements = {
      sowing: calculateBaseWaterRequirement(cropType, 'sowing'),
      vegetative: calculateBaseWaterRequirement(cropType, 'vegetative'),
      flowering: calculateBaseWaterRequirement(cropType, 'flowering'),
      fruiting: calculateBaseWaterRequirement(cropType, 'fruiting'),
      harvest: calculateBaseWaterRequirement(cropType, 'harvest')
    };
  
    const waterRequirementChart = {
      labels: ['Sowing', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
      values: [
        stageRequirements.sowing,
        stageRequirements.vegetative,
        stageRequirements.flowering,
        stageRequirements.fruiting,
        stageRequirements.harvest
      ]
    };
  
    // Chart 3: Weekly Irrigation Trend (Line Chart)
    // Simulate a week's pattern based on current requirement
    const baseValue = finalRequirement;
    const weeklyIrrigationTrend = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      values: [
        Math.max(0, baseValue - 10),
        Math.max(0, baseValue - 5),
        baseValue,
        Math.min(100, baseValue + 5),
        Math.max(0, baseValue - 8),
        Math.max(0, baseValue - 12),
        Math.max(0, baseValue - 3)
      ]
    };
  
    return {
      soilMoistureChart,
      waterRequirementChart,
      weeklyIrrigationTrend
    };
  };
  
  // ============================================
  // EXPORTS
  // ============================================
  module.exports = {
    generateWaterAdvisory
  };