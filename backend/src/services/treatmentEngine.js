/**
 * Agronomic Treatment & Dynamic Adaptive Irrigation Engine for AgriSathi
 * Computes diagnosis-specific remedies (organic + inorganic) with verified agricultural provenance
 * and dynamic multi-factor irrigation decisions (IRRIGATE / DELAY / REDUCE / SKIP / MONITOR / REASSESS).
 */
class TreatmentEngine {
  calculateIrrigationDecision(cropType, growthStage, soilData, weatherContext, irrigationData, isHealthy) {
    const moisture = soilData?.soilMoisture || 50;
    const isWaterlogged = weatherContext?.environmentalPriority?.isWaterlogged || false;
    const forecastRain = weatherContext?.insights?.forecast7DayRain || 0;
    const currentRain = weatherContext?.current?.rainfall || 0;
    const temp = weatherContext?.current?.temperature || 28;
    const stage = String(growthStage || 'vegetative').toLowerCase();

    let decisionAction = 'MONITOR';
    let guidance = '';

    if (isWaterlogged || currentRain > 25) {
      decisionAction = 'SKIP';
      guidance = 'Severe waterlogging / heavy rainfall detected. Skip all irrigation cycles and clear field drainage ditches immediately.';
    } else if (forecastRain > 15 && moisture > 45) {
      decisionAction = 'DELAY';
      guidance = `Incoming 7-day rainfall forecast (${forecastRain}mm) with adequate soil moisture (${moisture}%). Delay the next scheduled irrigation and reassess after rain.`;
    } else if (moisture > 65) {
      decisionAction = 'REDUCE';
      guidance = `High soil moisture (${moisture}%). Reduce irrigation volume by 40% to prevent root hypoxia and fungal inoculum build-up.`;
    } else if (moisture < 35 && forecastRain < 5) {
      if (temp > 32 || stage === 'flowering' || stage === 'fruiting') {
        decisionAction = 'IRRIGATE';
        guidance = `Low soil moisture (${moisture}%) during high crop water-demand stage (${stage.toUpperCase()}, ${temp}°C). Irrigate early morning using drip/soaker lines.`;
      } else {
        decisionAction = 'MONITOR';
        guidance = `Soil moisture is low (${moisture}%). Monitor root zone and schedule light morning watering within 24 hours.`;
      }
    } else {
      decisionAction = 'REASSESS';
      guidance = `Soil moisture (${moisture}%) and weather conditions are optimal. Reassess field moisture in 48 hours.`;
    }

    return {
      decisionAction, // IRRIGATE / DELAY / REDUCE / SKIP / MONITOR / REASSESS
      current_practice: irrigationData?.irrigationMethod || 'Drip',
      soil_moisture_pct: moisture,
      forecast_rain_mm: forecastRain,
      guidance
    };
  }

  generateTreatmentPlan(topDiagnosis, weatherContext, soilData, waterData, irrigationData, cropContext = {}) {
    const rule = topDiagnosis.rule || {};
    const tRule = rule.treatment || {};
    const diseaseName = topDiagnosis.disease || 'Plant Condition';
    const isHealthy = diseaseName.toLowerCase().includes('healthy');
    const isDeficiency = diseaseName.toLowerCase().includes('deficiency') || diseaseName.toLowerCase().includes('chlorosis');
    const isWaterStress = diseaseName.toLowerCase().includes('water stress') || diseaseName.toLowerCase().includes('wilt');

    const cropType = cropContext.cropType || 'Crop';
    const growthStage = cropContext.growthStage || 'vegetative';
    const forecastRain = weatherContext?.insights?.forecast7DayRain || 0;
    const isWaterlogged = weatherContext?.environmentalPriority?.isWaterlogged || false;

    const irrigationPlan = this.calculateIrrigationDecision(cropType, growthStage, soilData, weatherContext, irrigationData, isHealthy);

    // 1. Healthy Plant Response
    if (isHealthy) {
      return {
        immediate: [
          {
            action: '🌱 Maintain Current Field Management & Bio-Shield',
            priority: 'LOW',
            description: 'Continue scheduled watering and apply organic liquid fertilizer for steady vegetative growth.',
            materials: ['Organic Fertilizer', 'Bio-Tonic']
          }
        ],
        chemical: [],
        organic: [
          {
            name: 'Panchagavya Foliar Tonic 3%',
            ingredients: ['Panchagavya Organic Concentrate - 30ml', 'Clean Water - 1 Liter'],
            preparation: 'Mix 30ml Panchagavya concentrate into 1 Liter clean water. Stir thoroughly for 2 minutes.',
            application: 'Foliar spray using a fine mist nozzle over the entire plant canopy early morning.',
            frequency: 'Every 15 days as a growth promoter & natural immunity shield.'
          }
        ],
        cultural: [
          { practice: 'Weekly Scout Inspection', description: 'Inspect leaf undersides weekly for early aphid/whitefly presence.', benefit: 'Early pest detection' }
        ],
        irrigation_plan: irrigationPlan,
        prevention: [
          { method: 'Prophylactic Neem Shield', description: 'Apply 5ml/L neem oil spray monthly as a bio-shield.', effectiveness: 'high', frequency: 'Monthly' }
        ]
      };
    }

    // 2. Immediate Actions
    const immediateActions = [];
    if (isWaterlogged) {
      immediateActions.push({
        action: '🌊 Immediate Field Drainage & Irrigation Cessation',
        priority: 'CRITICAL',
        description: 'Clear standing water from field trenches immediately and stop all irrigation before applying foliar fungicides.',
        materials: ['Drainage Channel', 'Water Pump']
      });
    } else if (forecastRain > 10) {
      immediateActions.push({
        action: '⚠️ Delay Foliar Chemical Spray (Rain Warning)',
        priority: 'HIGH',
        description: `Incoming rain forecast (${forecastRain}mm over next 7 days) will wash off sprays. Delay chemical applications until a 24-hour dry window.`,
        materials: ['Rain Gauge / Weather Monitor']
      });
    }

    if (soilData) {
      const phVal = soilData.pH || 6.5;
      const moist = soilData.soilMoisture || 50;
      immediateActions.push({
        action: '🌱 Soil Root-Zone Conditioning & Bio-Drenching',
        priority: 'HIGH',
        description: `Collected Soil Test (pH ${phVal}, ${moist}% Moisture): Perform root-zone bio-drenching with Trichoderma viride (10g/L water) to suppress soil inoculum.`,
        materials: ['Trichoderma viride WP', 'Organic Soil Drench Solution']
      });
    }

    (tRule.immediate || []).forEach(act => {
      immediateActions.push({
        action: typeof act === 'string' ? act : act.action,
        priority: act.priority || 'HIGH',
        description: act.description || `Immediate physical response required for ${diseaseName}.`,
        materials: act.materials || ['Pruning Shears', 'Sanitizing Alcohol']
      });
    });

    // 3. Chemical Control (Diagnosis & Crop Specific)
    const chemicalSolutions = [];
    if (tRule.chemical && tRule.chemical.length > 0) {
      tRule.chemical.forEach(chem => {
        chemicalSolutions.push({
          name: chem.name,
          type: chem.type || 'Fungicide',
          dosage: chem.dosage || 'Follow registered extension label dosage',
          applicationMethod: chem.applicationMethod || 'Foliar spray early morning after dew dries.',
          frequency: chem.frequency || '1-2 applications spaced 12-14 days apart.',
          safetyPrecautions: chem.safetyPrecautions || ['Wear protective gloves and mask.', 'Observe Pre-Harvest Interval.'],
          waitingPeriod: chem.PHI || chem.waitingPeriod || '14 Days PHI'
        });
      });
    } else if (!isDeficiency && !isWaterStress) {
      // General broad spectrum fallback only when pathogen disease is present
      chemicalSolutions.push({
        name: 'Mancozeb 75% WP (Dithane M-45)',
        type: 'Contact Broad-Spectrum Fungicide',
        dosage: '2.0 grams per Liter of water',
        applicationMethod: 'Foliar spray upper and lower leaf surfaces during early morning.',
        frequency: 'Every 10 to 14 days',
        safetyPrecautions: ['Wear gloves and face mask.', 'Do not harvest within 14 days of spray.'],
        waitingPeriod: '14 Days PHI'
      });
    }

    // 4. Organic Control
    const organicSolutions = [];
    if (tRule.organic && tRule.organic.length > 0) {
      tRule.organic.forEach(org => {
        organicSolutions.push({
          name: org.name,
          ingredients: org.ingredients || ['Cold-Pressed Neem Oil - 5 ml/L', 'Water - 1 Liter'],
          preparation: org.preparation || 'Mix 5ml Neem Oil in 1L warm water with 1ml liquid soap emulsifier.',
          application: org.application || 'Spray thoroughly on foliage early morning or late afternoon.',
          frequency: org.frequency || 'Every 7 days for 2-3 consecutive weeks.'
        });
      });
    } else {
      organicSolutions.push({
        name: 'Cold-Pressed Neem Oil Emulsion (10,000 PPM)',
        ingredients: ['Neem Oil 10,000 PPM - 5 ml/L', 'Liquid Soap Emulsifier - 1 ml/L', 'Water - 1 Liter'],
        preparation: 'Mix 5ml Neem Oil and 1ml soap in 100ml warm water, shake until milky, dilute in 900ml water.',
        application: 'Spray thoroughly on leaf surfaces during late afternoon.',
        frequency: 'Every 7 days for 2-3 consecutive weeks'
      });
    }

    return {
      immediate: immediateActions,
      chemical: chemicalSolutions,
      organic: organicSolutions,
      cultural: [
        {
          practice: 'Canopy Airflow Management',
          description: 'Prune dense lower branches to increase sunlight penetration and accelerate leaf drying.',
          benefit: 'Reduces foliar humidity microclimate'
        }
      ],
      irrigation_plan: irrigationPlan,
      prevention: [
        { method: 'Prophylactic Neem Shield', description: 'Apply 5ml/L neem oil spray monthly as a bio-shield.', effectiveness: 'high', frequency: 'Monthly' }
      ]
    };
  }
}

module.exports = new TreatmentEngine();
