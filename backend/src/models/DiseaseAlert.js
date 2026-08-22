const mongoose = require('mongoose');

const diseaseAlertSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: true,
    lowercase: true,
  },
  diseaseName: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
    default: 'West Bengal',
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MODERATE', 'HIGH', 'VERY HIGH'],
    required: true,
    default: 'MODERATE',
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  // Explainability Factor Breakdown
  contributingFactors: [{
    factor: { type: String, required: true },
    points: { type: Number, required: true },
    detail: { type: String, default: '' },
  }],
  reportCount: {
    type: Number,
    default: 1,
  },
  symptoms: [{
    type: String,
  }],
  preventionSteps: [{
    type: String,
  }],
  verifiedSource: {
    type: String,
    default: 'ICAR-KVK / Krishi Vigyan Kendra Advisory',
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'suppressed'],
    default: 'active',
  },
}, { timestamps: true });

diseaseAlertSchema.index({ district: 1, cropType: 1, diseaseName: 1 });

module.exports = mongoose.model('DiseaseAlert', diseaseAlertSchema);
