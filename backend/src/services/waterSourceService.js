// ============================================
// WATER SOURCE SERVICE
// Business Logic Layer
// ============================================

const WaterSource = require('../models/WaterSource');

/**
 * Get all water sources for a farmer
 */
const getAllWaterSources = async (farmerId, filters = {}) => {
  const query = { farmerId, ...filters };
  
  // FIX: Removed .select('-usageHistory') — excluding usageHistory caused the
  // totalUsageLast30Days virtual to crash with "Cannot read properties of undefined"
  // because toJSON: { virtuals: true } forces all virtuals to serialize on response.
  // usageHistory is now guarded in the model virtual, and excluded via lean projection
  // only when explicitly needed (e.g. analytics endpoints).
  const sources = await WaterSource.find(query)
    .sort({ createdAt: -1 })
    .select('-__v');

  return sources;
};

/**
 * Get single water source by ID
 */
const getWaterSourceById = async (sourceId, farmerId) => {
  const source = await WaterSource.findOne({ _id: sourceId, farmerId });
  
  if (!source) {
    throw new Error('Water source not found');
  }

  return source;
};

/**
 * Create new water source
 */
const createWaterSource = async (farmerId, sourceData) => {
  const waterSource = new WaterSource({
    farmerId,
    ...sourceData
  });

  await waterSource.save();
  return waterSource;
};

/**
 * Update water source
 */
const updateWaterSource = async (sourceId, farmerId, updateData) => {
  const allowedUpdates = [
    'name', 'capacity', 'currentAvailability', 'costPerUnit', 
    'sustainabilityRating', 'status', 'qualityRating', 'notes', 'location'
  ];

  const updates = {};
  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = updateData[key];
    }
  });

  const source = await WaterSource.findOneAndUpdate(
    { _id: sourceId, farmerId },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!source) {
    throw new Error('Water source not found');
  }

  return source;
};

/**
 * Delete water source
 */
const deleteWaterSource = async (sourceId, farmerId) => {
  const source = await WaterSource.findOneAndDelete({ _id: sourceId, farmerId });

  if (!source) {
    throw new Error('Water source not found');
  }

  return { message: 'Water source deleted successfully', source };
};

/**
 * Record water usage
 */
const recordWaterUsage = async (sourceId, farmerId, usageData) => {
  const { amountUsed, purpose, notes } = usageData;

  if (!amountUsed || amountUsed <= 0) {
    throw new Error('Amount used must be greater than 0');
  }

  const source = await WaterSource.findOne({ _id: sourceId, farmerId });

  if (!source) {
    throw new Error('Water source not found');
  }

  if (source.status !== 'active') {
    throw new Error(`Cannot use water from ${source.status} source`);
  }

  await source.recordUsage(amountUsed, purpose, notes);

  return source;
};

/**
 * Refill water source
 */
const refillWaterSource = async (sourceId, farmerId, amount) => {
  if (!amount || amount <= 0) {
    throw new Error('Refill amount must be greater than 0');
  }

  const source = await WaterSource.findOne({ _id: sourceId, farmerId });

  if (!source) {
    throw new Error('Water source not found');
  }

  await source.refill(amount);

  return source;
};

/**
 * Get water source recommendation
 */
const getRecommendation = async (farmerId) => {
  const recommendation = await WaterSource.getRecommendation(farmerId);

  if (!recommendation) {
    return {
      hasRecommendation: false,
      message: 'No active water sources available with sufficient water'
    };
  }

  return {
    hasRecommendation: true,
    recommendation: {
      source: recommendation.source,
      score: Math.round(recommendation.score * 100),
      reasons: recommendation.reasons,
      explanation: generateRecommendationExplanation(recommendation)
    }
  };
};

/**
 * Generate human-readable recommendation explanation
 */
const generateRecommendationExplanation = (recommendation) => {
  const { source, reasons } = recommendation;
  
  let explanation = `We recommend using "${source.name}" (${source.sourceType}) because:\n`;
  explanation += `• ${reasons.availability}\n`;
  explanation += `• ${reasons.sustainability}\n`;
  explanation += `• Cost: ${reasons.cost}\n`;
  
  if (source.isCritical) {
    explanation += `\n⚠️ Warning: This source is running low. Consider refilling soon.`;
  }

  return explanation;
};

/**
 * Get farmer water statistics
 */
const getFarmerStats = async (farmerId) => {
  const stats = await WaterSource.getFarmerStats(farmerId);
  return stats;
};

/**
 * Get usage history for a water source
 */
const getUsageHistory = async (sourceId, farmerId, days = 30) => {
  const source = await WaterSource.findOne({ _id: sourceId, farmerId });

  if (!source) {
    throw new Error('Water source not found');
  }

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const history = source.usageHistory
    .filter(entry => new Date(entry.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    source: {
      id: source._id,
      name: source.name,
      sourceType: source.sourceType
    },
    history,
    totalUsage: history.reduce((sum, entry) => sum + entry.amountUsed, 0),
    period: `Last ${days} days`
  };
};

/**
 * Get aggregated usage by source type
 */
const getUsageBySourceType = async (farmerId, days = 30) => {
  const sources = await WaterSource.find({ farmerId });

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const usageByType = {};

  sources.forEach(source => {
    const typeUsage = source.usageHistory
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .reduce((sum, entry) => sum + entry.amountUsed, 0);

    if (usageByType[source.sourceType]) {
      usageByType[source.sourceType] += typeUsage;
    } else {
      usageByType[source.sourceType] = typeUsage;
    }
  });

  return {
    usageByType,
    period: `Last ${days} days`,
    totalUsage: Object.values(usageByType).reduce((sum, val) => sum + val, 0)
  };
};

// ============================================
// EXPORTS
// ============================================

module.exports = {
  getAllWaterSources,
  getWaterSourceById,
  createWaterSource,
  updateWaterSource,
  deleteWaterSource,
  recordWaterUsage,
  refillWaterSource,
  getRecommendation,
  getFarmerStats,
  getUsageHistory,
  getUsageBySourceType
};