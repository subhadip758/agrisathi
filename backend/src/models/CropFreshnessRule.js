const mongoose = require('mongoose');

const cropFreshnessRuleSchema = new mongoose.Schema({
  cropName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  storageType: {
    type: String,
    enum: ['fresh', 'cold_storage'],
    default: 'fresh',
    required: true,
  },
  newly_arrived_days: {
    type: Number,
    required: true,
    default: 2,
  },
  fresh_days: {
    type: Number,
    required: true,
    default: 7,
  },
  aging_days: {
    type: Number,
    required: true,
    default: 14,
  },
  old_after_days: {
    type: Number,
    required: true,
    default: 21,
  },
  tempRange: {
    min: { type: Number, default: 4 },
    max: { type: Number, default: 25 },
  },
  humidityRange: {
    min: { type: Number, default: 60 },
    max: { type: Number, default: 90 },
  },
  source: {
    type: String,
    default: 'ICAR / AgriSathi Scientific Guidance',
  },
  sourceUrl: {
    type: String,
    default: 'https://icar.org.in',
  },
  lastVerifiedAt: {
    type: Date,
    default: Date.now,
  },
  verificationStatus: {
    type: String,
    enum: ['test_seed', 'verified_production'],
    default: 'verified_production',
  },
}, { timestamps: true });

cropFreshnessRuleSchema.index({ cropName: 1, storageType: 1 }, { unique: true });

module.exports = mongoose.model('CropFreshnessRule', cropFreshnessRuleSchema);
