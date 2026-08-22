const mongoose = require('mongoose');

const marketFeedbackSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketListing',
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
    default: 'Verified Buyer',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedbackType: {
    type: String,
    enum: ['product', 'seller'],
    default: 'product',
  },
  comment: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  evidence: {
    type: String,
    default: '',
  },
}, { timestamps: true });

marketFeedbackSchema.index({ listing: 1, seller: 1, buyer: 1 });

module.exports = mongoose.model('MarketFeedback', marketFeedbackSchema);
