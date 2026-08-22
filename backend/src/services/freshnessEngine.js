const mongoose = require('mongoose');
const CropFreshnessRule = require('../models/CropFreshnessRule');

const DEFAULT_FRESH_RULES = {
  tomato:    { newly_arrived: 2, fresh: 6,  aging: 10, old: 14 },
  spinach:   { newly_arrived: 1, fresh: 3,  aging: 5,  old: 7  },
  potato:    { newly_arrived: 5, fresh: 30, aging: 60, old: 90 },
  onion:     { newly_arrived: 5, fresh: 45, aging: 90, old: 120 },
  rice:      { newly_arrived: 7, fresh: 90, aging: 180, old: 365 },
  wheat:     { newly_arrived: 7, fresh: 90, aging: 180, old: 365 },
  default:   { newly_arrived: 2, fresh: 7,  aging: 14, old: 21 },
};

const DEFAULT_COLD_RULES = {
  potato:    { newly_arrived: 14, fresh: 120, aging: 240, old: 365 },
  apple:     { newly_arrived: 14, fresh: 90,  aging: 180, old: 270 },
  onion:     { newly_arrived: 14, fresh: 120, aging: 210, old: 300 },
  default:   { newly_arrived: 7,  fresh: 60,  aging: 120, old: 180 },
};

/**
 * Calculates freshness status dynamically for a listing
 */
async function calculateFreshnessStatus(listing) {
  if (!listing) return 'QUALITY REVIEW';

  const category = listing.category || 'fresh';
  const crop = (listing.cropType || 'default').toLowerCase();

  // Look up database rule if Mongoose connection is ready
  let dbRule = null;
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      dbRule = await CropFreshnessRule.findOne({ cropName: crop, storageType: category }).maxTimeMS(1000);
    } catch {
      dbRule = null;
    }
  }

  let thresholds;
  if (dbRule) {
    thresholds = {
      newly_arrived: dbRule.newly_arrived_days,
      fresh: dbRule.fresh_days,
      aging: dbRule.aging_days,
      old: dbRule.old_after_days,
    };
  } else if (category === 'cold_storage') {
    thresholds = DEFAULT_COLD_RULES[crop] || DEFAULT_COLD_RULES.default;
  } else {
    thresholds = DEFAULT_FRESH_RULES[crop] || DEFAULT_FRESH_RULES.default;
  }

  const now = new Date();

  if (category === 'cold_storage') {
    // Cold storage calculates age primarily from storage date / release date
    const storageDate = listing.storageDetails?.storageDate ? new Date(listing.storageDetails.storageDate) : new Date(listing.createdAt || listing.harvestDate);
    const ageDays = Math.max(0, Math.floor((now - storageDate) / (1000 * 60 * 60 * 24)));

    if (ageDays <= thresholds.newly_arrived) return 'NEWLY ARRIVED';
    if (ageDays <= thresholds.fresh) return 'FRESH';
    if (ageDays <= thresholds.aging) return 'AGING';
    if (ageDays <= thresholds.old) return 'OLD';
    return 'QUALITY REVIEW';
  } else {
    // Fresh produce calculates age from harvest date
    const harvestDate = new Date(listing.harvestDate || listing.createdAt || now);
    const ageDays = Math.max(0, Math.floor((now - harvestDate) / (1000 * 60 * 60 * 24)));

    if (ageDays <= thresholds.newly_arrived) return 'NEWLY ARRIVED';
    if (ageDays <= thresholds.fresh) return 'FRESH';
    if (ageDays <= thresholds.aging) return 'AGING';
    if (ageDays <= thresholds.old) return 'OLD';
    return 'QUALITY REVIEW';
  }
}

module.exports = {
  calculateFreshnessStatus,
  DEFAULT_FRESH_RULES,
  DEFAULT_COLD_RULES,
};
