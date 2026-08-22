// backend/src/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Reference to the seller (user)
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Seller's name for display purposes
  sellerName: {
    type: String,
    required: true
  },
  
  // Product details
  cropType: {
    type: String,
    required: true,
    trim: true,
    index: true  // Index for faster filtering
  },
  
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'quintal', 'ton', 'piece', 'dozen'],
    default: 'kg'
  },
  
  expectedPrice: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Location details
  location: {
    district: {
      type: String,
      required: true,
      trim: true,
      index: true  // Index for location-based filtering
    },
    state: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    pincode: {
      type: String,
      trim: true
    }
  },
  
  // Optional product description
  description: {
    type: String,
    maxlength: 500
  },
  
  // Product images (optional - store URLs or paths)
  images: [{
    type: String
  }],
  
  // Product status
  status: {
    type: String,
    enum: ['available', 'sold', 'expired'],
    default: 'available'
  },
  
  // Contact information
  contactPhone: {
    type: String
  },
  
  // Timestamps
  uploadDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  expiryDate: {
    type: Date,
    // Auto-expire listings after 30 days
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  }
}, {
  timestamps: true  // Adds createdAt and updatedAt
});

// Compound index for efficient location + crop filtering
productSchema.index({ 'location.district': 1, 'location.state': 1, cropType: 1 });

// Index for fetching seller's products
productSchema.index({ seller: 1, status: 1 });

// Virtual for checking if product is expired
productSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});

// Method to format product for API response
productSchema.methods.toJSON = function() {
  const product = this.toObject({ virtuals: true });
  delete product.__v;
  return product;
};

// Static method to get active products with filters
productSchema.statics.getActiveProducts = function(filters = {}) {
  const query = { status: 'available', expiryDate: { $gt: new Date() } };
  
  if (filters.district) {
    query['location.district'] = new RegExp(filters.district, 'i');
  }
  if (filters.state) {
    query['location.state'] = new RegExp(filters.state, 'i');
  }
  if (filters.cropType) {
    query.cropType = new RegExp(filters.cropType, 'i');
  }
  
  return this.find(query)
    .populate('seller', 'name email')
    .sort({ uploadDate: -1 });
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;