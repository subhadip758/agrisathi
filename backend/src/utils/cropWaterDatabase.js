/**
 * Crop Water Database
 * Contains water requirements, growth stages, and characteristics for various crops
 * All water quantities are in liters per acre per day unless specified
 */

const CROP_WATER_DATABASE = {
    // Cereals & Grains
    'Rice': {
      category: 'Cereal',
      targetSoilMoisture: 80,
      baseWaterNeed: { low: 3000, medium: 4500, high: 6000 },
      stages: {
        'Germination': { duration: 7, waterMultiplier: 1.2, critical: true },
        'Seedling': { duration: 15, waterMultiplier: 1.0, critical: true },
        'Vegetative': { duration: 30, waterMultiplier: 1.5, critical: true },
        'Flowering': { duration: 20, waterMultiplier: 1.8, critical: true },
        'Fruiting': { duration: 30, waterMultiplier: 1.3, critical: true },
        'Maturity': { duration: 15, waterMultiplier: 0.5, critical: false }
      },
      stressTolerance: 'Low',
      soilPreference: ['Clay', 'Loamy']
    },
    
    'Wheat': {
      category: 'Cereal',
      targetSoilMoisture: 65,
      baseWaterNeed: { low: 1500, medium: 2200, high: 3000 },
      stages: {
        'Germination': { duration: 10, waterMultiplier: 1.0, critical: true },
        'Seedling': { duration: 20, waterMultiplier: 0.8, critical: false },
        'Vegetative': { duration: 40, waterMultiplier: 1.2, critical: true },
        'Flowering': { duration: 25, waterMultiplier: 1.5, critical: true },
        'Fruiting': { duration: 30, waterMultiplier: 1.3, critical: true },
        'Maturity': { duration: 20, waterMultiplier: 0.4, critical: false }
      },
      stressTolerance: 'Medium',
      soilPreference: ['Loamy', 'Clay']
    },
  
    'Maize': {
      category: 'Cereal',
      targetSoilMoisture: 70,
      baseWaterNeed: { low: 2000, medium: 2800, high: 3500 },
      stages: {
        'Germination': { duration: 7, waterMultiplier: 1.1, critical: true },
        'Seedling': { duration: 14, waterMultiplier: 0.9, critical: false },
        'Vegetative': { duration: 35, waterMultiplier: 1.3, critical: true },
        'Flowering': { duration: 20, waterMultiplier: 1.6, critical: true },
        'Fruiting': { duration: 30, waterMultiplier: 1.4, critical: true },
        'Maturity': { duration: 15, waterMultiplier: 0.5, critical: false }
      },
      stressTolerance: 'Medium',
      soilPreference: ['Loamy', 'Sandy']
    },
  
    'Tomato': {
      category: 'Vegetable',
      targetSoilMoisture: 70,
      baseWaterNeed: { low: 1200, medium: 1800, high: 2400 },
      stages: {
        'Germination': { duration: 7, waterMultiplier: 1.0, critical: true },
        'Seedling': { duration: 21, waterMultiplier: 0.8, critical: false },
        'Vegetative': { duration: 30, waterMultiplier: 1.2, critical: true },
        'Flowering': { duration: 20, waterMultiplier: 1.5, critical: true },
        'Fruiting': { duration: 40, waterMultiplier: 1.3, critical: true },
        'Maturity': { duration: 15, waterMultiplier: 0.7, critical: false }
      },
      stressTolerance: 'Low',
      soilPreference: ['Loamy', 'Sandy']
    },
  
    'Potato': {
      category: 'Vegetable',
      targetSoilMoisture: 75,
      baseWaterNeed: { low: 1500, medium: 2000, high: 2500 },
      stages: {
        'Germination': { duration: 14, waterMultiplier: 0.9, critical: true },
        'Seedling': { duration: 21, waterMultiplier: 0.8, critical: false },
        'Vegetative': { duration: 30, waterMultiplier: 1.3, critical: true },
        'Flowering': { duration: 15, waterMultiplier: 1.2, critical: false },
        'Fruiting': { duration: 35, waterMultiplier: 1.5, critical: true },
        'Maturity': { duration: 20, waterMultiplier: 0.4, critical: false }
      },
      stressTolerance: 'Medium',
      soilPreference: ['Loamy', 'Sandy']
    },
  
    'Onion': {
      category: 'Vegetable',
      targetSoilMoisture: 65,
      baseWaterNeed: { low: 1000, medium: 1500, high: 2000 },
      stages: {
        'Germination': { duration: 10, waterMultiplier: 1.0, critical: true },
        'Seedling': { duration: 25, waterMultiplier: 0.9, critical: false },
        'Vegetative': { duration: 40, waterMultiplier: 1.2, critical: true },
        'Flowering': { duration: 20, waterMultiplier: 1.0, critical: false },
        'Fruiting': { duration: 30, waterMultiplier: 1.3, critical: true },
        'Maturity': { duration: 15, waterMultiplier: 0.3, critical: false }
      },
      stressTolerance: 'High',
      soilPreference: ['Loamy', 'Sandy']
    },
  
    'Cabbage': {
      category: 'Vegetable',
      targetSoilMoisture: 70,
      baseWaterNeed: { low: 1200, medium: 1700, high: 2200 },
      stages: {
        'Germination': { duration: 7, waterMultiplier: 1.0, critical: true },
        'Seedling': { duration: 21, waterMultiplier: 0.9, critical: false },
        'Vegetative': { duration: 40, waterMultiplier: 1.3, critical: true },
        'Flowering': { duration: 0, waterMultiplier: 0, critical: false },
        'Fruiting': { duration: 35, waterMultiplier: 1.4, critical: true },
        'Maturity': { duration: 10, waterMultiplier: 0.6, critical: false }
      },
      stressTolerance: 'Low',
      soilPreference: ['Loamy', 'Clay']
    },
  
    'Chickpea': {
      category: 'Pulse',
      targetSoilMoisture: 60,
      baseWaterNeed: { low: 800, medium: 1200, high: 1600 },
      stages: {
        'Germination': { duration: 10, waterMultiplier: 1.0, critical: true },
        'Seedling': { duration: 20, waterMultiplier: 0.7, critical: false },
        'Vegetative': { duration: 35, waterMultiplier: 1.0, critical: false },
        'Flowering': { duration: 25, waterMultiplier: 1.3, critical: true },
        'Fruiting': { duration: 30, waterMultiplier: 1.2, critical: true },
        'Maturity': { duration: 20, waterMultiplier: 0.3, critical: false }
      },
      stressTolerance: 'High',
      soilPreference: ['Loamy', 'Clay']
    },
  
    'Mango': {
      category: 'Fruit',
      targetSoilMoisture: 65,
      baseWaterNeed: { low: 2500, medium: 3500, high: 4500 },
      stages: {
        'Germination': { duration: 0, waterMultiplier: 0, critical: false },
        'Seedling': { duration: 90, waterMultiplier: 0.8, critical: false },
        'Vegetative': { duration: 120, waterMultiplier: 1.2, critical: true },
        'Flowering': { duration: 30, waterMultiplier: 1.5, critical: true },
        'Fruiting': { duration: 90, waterMultiplier: 1.6, critical: true },
        'Maturity': { duration: 30, waterMultiplier: 0.8, critical: false }
      },
      stressTolerance: 'Medium',
      soilPreference: ['Loamy', 'Sandy']
    },
  
    'Banana': {
      category: 'Fruit',
      targetSoilMoisture: 80,
      baseWaterNeed: { low: 3000, medium: 4000, high: 5000 },
      stages: {
        'Germination': { duration: 0, waterMultiplier: 0, critical: false },
        'Seedling': { duration: 60, waterMultiplier: 1.0, critical: true },
        'Vegetative': { duration: 150, waterMultiplier: 1.4, critical: true },
        'Flowering': { duration: 30, waterMultiplier: 1.6, critical: true },
        'Fruiting': { duration: 90, waterMultiplier: 1.8, critical: true },
        'Maturity': { duration: 30, waterMultiplier: 0.8, critical: false }
      },
      stressTolerance: 'Low',
      soilPreference: ['Loamy', 'Clay']
    },
  
    'Cotton': {
      category: 'Cash Crop',
      targetSoilMoisture: 65,
      baseWaterNeed: { low: 1800, medium: 2500, high: 3200 },
      stages: {
        'Germination': { duration: 10, waterMultiplier: 1.0, critical: true },
        'Seedling': { duration: 25, waterMultiplier: 0.8, critical: false },
        'Vegetative': { duration: 40, waterMultiplier: 1.3, critical: true },
        'Flowering': { duration: 30, waterMultiplier: 1.5, critical: true },
        'Fruiting': { duration: 50, waterMultiplier: 1.4, critical: true },
        'Maturity': { duration: 25, waterMultiplier: 0.4, critical: false }
      },
      stressTolerance: 'Medium',
      soilPreference: ['Loamy', 'Clay']
    },
  
    'Sugarcane': {
      category: 'Cash Crop',
      targetSoilMoisture: 80,
      baseWaterNeed: { low: 4000, medium: 5500, high: 7000 },
      stages: {
        'Germination': { duration: 21, waterMultiplier: 1.2, critical: true },
        'Seedling': { duration: 30, waterMultiplier: 1.0, critical: true },
        'Vegetative': { duration: 120, waterMultiplier: 1.5, critical: true },
        'Flowering': { duration: 30, waterMultiplier: 1.3, critical: false },
        'Fruiting': { duration: 90, waterMultiplier: 1.6, critical: true },
        'Maturity': { duration: 60, waterMultiplier: 0.6, critical: false }
      },
      stressTolerance: 'Low',
      soilPreference: ['Loamy', 'Clay']
    }
};

function getCropInfo(cropName) {
  if (!cropName) return CROP_WATER_DATABASE['Wheat'];
  const key = Object.keys(CROP_WATER_DATABASE).find(
    k => k.toLowerCase() === String(cropName).toLowerCase()
  );
  return CROP_WATER_DATABASE[key] || CROP_WATER_DATABASE['Wheat'];
}

function getAllCrops() {
  return Object.keys(CROP_WATER_DATABASE);
}

function getCropsByCategory(category) {
  return Object.keys(CROP_WATER_DATABASE).filter(
    crop => CROP_WATER_DATABASE[crop].category === category
  );
}

function getAllCategories() {
  const categories = new Set();
  Object.values(CROP_WATER_DATABASE).forEach(crop => {
    categories.add(crop.category);
  });
  return Array.from(categories);
}

// ─── Calculation Helper Functions ───────────────────────────────────────────

function calculateStageWaterFactor(cropInfo, stageName) {
  if (!cropInfo || !cropInfo.stages) return 1.0;
  const keys = Object.keys(cropInfo.stages);
  const foundKey = keys.find(k => k.toLowerCase() === String(stageName || '').toLowerCase());
  const stageData = cropInfo.stages[foundKey] || cropInfo.stages['Vegetative'];
  return stageData ? (stageData.waterMultiplier || 1.0) : 1.0;
}

function calculateSoilWaterFactor(soilType) {
  const s = String(soilType || '').toLowerCase();
  if (s.includes('sand')) return 1.3;
  if (s.includes('clay')) return 0.8;
  if (s.includes('black')) return 0.85;
  if (s.includes('red')) return 1.1;
  return 1.0; // Loamy / default
}

function calculateSeasonWaterFactor(season) {
  const sec = String(season || '').toLowerCase();
  if (sec.includes('summer') || sec.includes('zaid')) return 1.3;
  if (sec.includes('monsoon') || sec.includes('kharif')) return 0.7;
  if (sec.includes('winter') || sec.includes('rabi')) return 0.9;
  return 1.0;
}

function calculateMoistureDeficit(targetMoisture = 70, currentMoisture = 40) {
  const target = Number(targetMoisture) || 70;
  const current = Number(currentMoisture) || 40;
  return Math.max(0, target - current);
}

function determineIrrigationUrgency(moistureDeficit, temp, humidity, adjustmentFactor) {
  const deficit = Number(moistureDeficit) || 0;
  const t = Number(temp) || 28;
  const h = Number(humidity) || 60;

  const rawNeed = (deficit * 1.5) + (t > 32 ? 15 : 5) - (h > 70 ? 10 : 0);
  let urgency = 'Low';
  let action = 'Soil moisture is optimal. Continue monitoring.';

  if (rawNeed > 45 || deficit > 35) {
    urgency = 'Critical';
    action = 'Immediate heavy irrigation required to prevent severe drought stress.';
  } else if (rawNeed > 30 || deficit > 20) {
    urgency = 'High';
    action = 'Apply irrigation within 24 hours to restore target soil moisture.';
  } else if (rawNeed > 15 || deficit > 10) {
    urgency = 'Medium';
    action = 'Scheduled light irrigation recommended over the next 48 hours.';
  }

  return { urgency, action, rawNeed: Math.round(rawNeed), adjustmentFactor };
}

function calculateWaterQuantity(baseWaterNeed, farmSize, adjustmentFactor) {
  const base = (baseWaterNeed && baseWaterNeed.medium) ? baseWaterNeed.medium : 2500;
  const area = Number(farmSize) || 1;
  const factor = Number(adjustmentFactor) || 1.0;
  const totalLiters = Math.round(base * area * factor);
  const durationMinutes = Math.round(totalLiters / 40);

  return {
    waterQuantity: totalLiters,
    unit: 'liters',
    duration: Math.max(15, durationMinutes)
  };
}

function calculateIrrigationFrequency(soilType, currentMoisture, urgency) {
  if (urgency === 'Critical') return 'Daily (Twice a day)';
  if (urgency === 'High') return 'Every 2 days';
  const s = String(soilType || '').toLowerCase();
  if (s.includes('sand')) return 'Every 2-3 days';
  if (s.includes('clay')) return 'Every 5-7 days';
  return 'Every 3-4 days';
}

function determineBestIrrigationTimes(season, temp) {
  const t = Number(temp) || 28;
  const sec = String(season || '').toLowerCase();
  if (t > 35 || sec.includes('summer')) {
    return ['6:00 AM - 8:00 AM', '6:00 PM - 8:00 PM'];
  }
  return ['7:00 AM - 9:00 AM', '5:00 PM - 7:00 PM'];
}

function calculateWeeklyWaterNeed(waterQuantity, frequency) {
  const qty = Number(waterQuantity) || 2000;
  if (frequency.includes('Twice a day')) return qty * 14;
  if (frequency.includes('Daily')) return qty * 7;
  if (frequency.includes('Every 2')) return qty * 4;
  return qty * 2;
}

function generateNextIrrigationDate(urgency, frequency) {
  const now = new Date();
  if (urgency === 'Critical') {
    now.setHours(now.getHours() + 4);
  } else if (urgency === 'High') {
    now.setDate(now.getDate() + 1);
  } else {
    now.setDate(now.getDate() + 2);
  }
  return now.toISOString();
}

module.exports = {
  CROP_WATER_DATABASE,
  getCropInfo,
  getAllCrops,
  getCropsByCategory,
  getAllCategories,
  calculateStageWaterFactor,
  calculateSoilWaterFactor,
  calculateSeasonWaterFactor,
  calculateMoistureDeficit,
  determineIrrigationUrgency,
  calculateWaterQuantity,
  calculateIrrigationFrequency,
  determineBestIrrigationTimes,
  calculateWeeklyWaterNeed,
  generateNextIrrigationDate
};