const mongoose = require('mongoose');

const diseaseReportSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cropType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  diseaseName: {
    type: String,
    required: true,
    trim: true,
  },
  confidence: {
    type: Number,
    default: 0.85,
  },
  location: {
    state: { type: String, required: true, default: 'West Bengal' },
    district: { type: String, required: true, default: 'North 24 Parganas' },
    blockOrVillage: { type: String, default: 'Barasat' },
  },
  imageUrl: {
    type: String,
    default: '',
  },
  symptomsObserved: [{
    type: String,
  }],
  weatherSnapshot: {
    temp: Number,
    humidity: Number,
    rainfall: Number,
  },
}, { timestamps: true });

diseaseReportSchema.index({ cropType: 1, diseaseName: 1, 'location.district': 1 });

module.exports = mongoose.model('DiseaseReport', diseaseReportSchema);
