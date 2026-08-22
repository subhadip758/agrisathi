const mongoose = require('mongoose');

const marketConsentSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  consentStatus: {
    type: Boolean,
    required: true,
    default: true,
  },
  policyVersion: {
    type: String,
    required: true,
    default: 'v1.0',
  },
  ipAddress: {
    type: String,
    default: '',
  },
  consentedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

marketConsentSchema.index({ farmer: 1, policyVersion: 1 });

module.exports = mongoose.model('MarketConsent', marketConsentSchema);
