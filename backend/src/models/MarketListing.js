const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  comment: {
    type: String,
    required: true,
  },
  audioUrl: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const priceChangeSchema = new mongoose.Schema({
  previousPrice: Number,
  newPrice: Number,
  changedAt: { type: Date, default: Date.now }
});

const marketListingSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmerName: {
    type: String,
    required: true,
  },
  farmerContact: {
    type: String,
    required: true,
  },
  contactPreferences: {
    showPhone: { type: Boolean, default: true },
    showWhatsapp: { type: Boolean, default: true },
    showAddress: { type: Boolean, default: true },
    whatsappNumber: { type: String, default: '' },
  },
  allowBuyerContact: {
    type: Boolean,
    default: true,
  },
  termsAgreed: {
    type: Boolean,
    required: [true, 'Seller must agree to product listing terms & conditions'],
    default: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: ['fresh', 'cold_storage'],
    default: 'fresh',
    required: true,
  },
  cropType: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  variety: {
    type: String,
    default: 'Standard',
  },
  quantity: {
    type: Number,
    required: true,
    min: [0.1, 'Quantity must be greater than 0'],
  },
  soldQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Sold quantity cannot be negative'],
  },
  remainingQuantity: {
    type: Number,
    default: function() { return this.quantity; },
  },
  unit: {
    type: String,
    enum: ['kg', 'quintal', 'ton', 'bag', 'box'],
    default: 'kg',
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative'],
  },
  priceHistory: [priceChangeSchema],
  harvestDate: {
    type: Date,
    required: true,
  },
  location: {
    state: { type: String, required: true, default: 'West Bengal' },
    district: { type: String, required: true, default: 'North 24 Parganas' },
    blockOrVillage: { type: String, default: 'Barasat' },
    address: { type: String, default: '' },
  },
  images: {
    type: [String],
    validate: [val => val.length > 0, 'At least one product photograph is required'],
    required: [true, 'Product photograph is mandatory'],
  },
  description: {
    type: String,
    default: '',
  },
  // Cold Storage Specific Fields
  storageDetails: {
    coldStorageName: { type: String, default: '' },
    storageDate: { type: Date },
    receiptRefNumber: { type: String, default: '' },
    expectedReleaseDate: { type: Date },
    tempMaintained: { type: Number },
    humidityMaintained: { type: Number },
  },
  // Freshness System Output
  freshnessStatus: {
    type: String,
    enum: ['NEWLY ARRIVED', 'FRESH', 'AGING', 'OLD', 'QUALITY REVIEW'],
    default: 'NEWLY ARRIVED',
  },
  // Buyer Reviews & Seller Rating System
  reviews: [reviewSchema],
  sellerRating: {
    type: Number,
    default: 5.0,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'sold', 'removed', 'reported'],
    default: 'active',
  },
  moderationNotes: {
    type: String,
    default: '',
  },
  deletedAt: Date,
}, { timestamps: true });

marketListingSchema.index({ category: 1, status: 1, cropType: 1 });
marketListingSchema.index({ farmer: 1, status: 1 });
marketListingSchema.index({ 'location.district': 1, 'location.state': 1 });

module.exports = mongoose.model('MarketListing', marketListingSchema);
