const mongoose = require('mongoose');

const governmentSchemeSchema = new mongoose.Schema({
  schemeName: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    default: 'Department of Agriculture & Farmers Welfare',
  },
  governmentLevel: {
    type: String,
    enum: ['central', 'state'],
    default: 'central',
  },
  state: {
    type: String,
    default: 'All / West Bengal',
  },
  description: {
    type: String,
    required: true,
  },
  benefit: {
    type: String,
    required: true,
  },
  eligibilityRules: {
    states: [{ type: String }],
    districts: [{ type: String }],
    maxLandAcres: { type: Number, default: 50 },
    farmerCategories: [{ type: String }], // e.g. Small, Marginal, All
    cropsSupported: [{ type: String }],
  },
  requiredDocuments: [{
    type: String,
  }],
  applicationDeadline: {
    type: String,
    default: 'Ongoing / Open Year-Round',
  },
  officialPortalUrl: {
    type: String,
    required: true,
  },
  sourceUrl: {
    type: String,
    required: true,
  },
  officialSourceDomain: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending_verification', 'verified', 'published', 'archived'],
    default: 'published',
  },
  lastVerifiedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

governmentSchemeSchema.index({ schemeName: 1, officialSourceDomain: 1 });

module.exports = mongoose.model('GovernmentScheme', governmentSchemeSchema);
