const mongoose = require('mongoose');

const marketReportSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketListing',
    required: true,
  },
  reportedSeller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    enum: [
      'fraud',
      'fake_product',
      'misleading_info',
      'fake_images',
      'incorrect_quantity',
      'suspicious_seller',
      'inappropriate_behaviour',
      'other'
    ],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['Report Submitted', 'Under Review', 'Action Taken', 'Dismissed'],
    default: 'Report Submitted',
  },
  adminNotes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

marketReportSchema.index({ listing: 1, reportedSeller: 1, status: 1 });

module.exports = mongoose.model('MarketReport', marketReportSchema);
