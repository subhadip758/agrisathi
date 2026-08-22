// ============================================
// WATER SOURCE MODEL
// Mongoose Schema for Water Source Management
// ============================================

const mongoose = require('mongoose');

// Usage History Sub-Schema
const usageHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  amountUsed: {
    type: Number,
    required: true,
    min: [0, 'Amount used cannot be negative']
  },
  purpose: {
    type: String,
    enum: ['irrigation', 'livestock', 'domestic', 'other'],
    default: 'irrigation'
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, { _id: false });

// Main Water Source Schema
const waterSourceSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required'],
    index: true
  },
  sourceType: {
    type: String,
    enum: {
      values: ['well', 'canal', 'rainwater', 'tank', 'borewell', 'pond', 'river'],
      message: '{VALUE} is not a valid source type'
    },
    required: [true, 'Source type is required']
  },
  name: {
    type: String,
    required: [true, 'Water source name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  capacity: {
    type: Number,
    required: [true, 'Capacity is required'],
    min: [0, 'Capacity cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Capacity must be a valid number'
    }
  },
  currentAvailability: {
    type: Number,
    required: [true, 'Current availability is required'],
    min: [0, 'Availability cannot be negative'],
    validate: {
      validator: function(value) {
        return value <= this.capacity;
      },
      message: 'Current availability cannot exceed capacity'
    }
  },
  costPerUnit: {
    type: Number,
    required: [true, 'Cost per unit is required'],
    min: [0, 'Cost cannot be negative'],
    default: 0
  },
  sustainabilityRating: {
    type: Number,
    required: [true, 'Sustainability rating is required'],
    min: [1, 'Sustainability rating must be between 1 and 5'],
    max: [5, 'Sustainability rating must be between 1 and 5'],
    default: 3
  },
  usageHistory: {
    type: [usageHistorySchema],
    default: []
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    description: {
      type: String,
      maxlength: 200
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'depleted'],
    default: 'active'
  },
  lastRefillDate: {
    type: Date,
    default: null
  },
  qualityRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ============================================
// VIRTUAL FIELDS
// ============================================

// Calculate availability percentage
waterSourceSchema.virtual('availabilityPercentage').get(function() {
  if (this.capacity === 0) return 0;
  return Math.round((this.currentAvailability / this.capacity) * 100);
});

// Calculate total usage (last 30 days)
// FIX: Guard against usageHistory being excluded via .select('-usageHistory')
waterSourceSchema.virtual('totalUsageLast30Days').get(function() {
  if (!this.usageHistory) return 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.usageHistory
    .filter(entry => new Date(entry.date) >= thirtyDaysAgo)
    .reduce((total, entry) => total + entry.amountUsed, 0);
});

// Check if source is critical (below 20% capacity)
waterSourceSchema.virtual('isCritical').get(function() {
  return this.availabilityPercentage < 20;
});

// ============================================
// INDEXES
// ============================================

waterSourceSchema.index({ farmerId: 1, status: 1 });
waterSourceSchema.index({ sourceType: 1, status: 1 });
waterSourceSchema.index({ createdAt: -1 });

// ============================================
// INSTANCE METHODS
// ============================================

// Add usage entry and update availability
waterSourceSchema.methods.recordUsage = function(amountUsed, purpose = 'irrigation', notes = '') {
  if (amountUsed > this.currentAvailability) {
    throw new Error(`Cannot use ${amountUsed}L. Only ${this.currentAvailability}L available.`);
  }

  this.currentAvailability -= amountUsed;

  this.usageHistory.push({
    date: new Date(),
    amountUsed,
    purpose,
    notes
  });

  // Keep only last 100 entries to prevent document size issues
  if (this.usageHistory.length > 100) {
    this.usageHistory = this.usageHistory.slice(-100);
  }

  if (this.currentAvailability === 0) {
    this.status = 'depleted';
  }

  return this.save();
};

// Refill water source
waterSourceSchema.methods.refill = function(amount) {
  const newAvailability = this.currentAvailability + amount;
  
  this.currentAvailability = newAvailability > this.capacity ? this.capacity : newAvailability;
  this.lastRefillDate = new Date();
  
  if (this.status === 'depleted') {
    this.status = 'active';
  }

  return this.save();
};

// ============================================
// STATIC METHODS
// ============================================

waterSourceSchema.statics.getRecommendation = async function(farmerId) {
  const sources = await this.find({ 
    farmerId, 
    status: 'active',
    currentAvailability: { $gt: 0 }
  });

  if (sources.length === 0) return null;

  const scoredSources = sources.map(source => {
    const availabilityScore = source.availabilityPercentage / 100;
    const sustainabilityScore = source.sustainabilityRating / 5;
    const costScore = source.costPerUnit === 0 ? 1 : (1 / (1 + source.costPerUnit / 10));
    
    const totalScore = (
      availabilityScore * 0.4 +
      sustainabilityScore * 0.35 +
      costScore * 0.25
    );

    return {
      source,
      score: totalScore,
      reasons: {
        availability: `${source.availabilityPercentage}% available`,
        sustainability: `${source.sustainabilityRating}/5 sustainability rating`,
        cost: source.costPerUnit === 0 ? 'Free' : `₹${source.costPerUnit} per liter`
      }
    };
  });

  scoredSources.sort((a, b) => b.score - a.score);
  return scoredSources[0];
};

waterSourceSchema.statics.getFarmerStats = async function(farmerId) {
  const sources = await this.find({ farmerId });

  const totalCapacity = sources.reduce((sum, s) => sum + s.capacity, 0);
  const totalAvailable = sources.reduce((sum, s) => sum + s.currentAvailability, 0);
  const activeSources = sources.filter(s => s.status === 'active').length;
  
  const totalUsage30Days = sources.reduce((sum, source) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const usage = source.usageHistory
      .filter(entry => new Date(entry.date) >= thirtyDaysAgo)
      .reduce((total, entry) => total + entry.amountUsed, 0);
    
    return sum + usage;
  }, 0);

  return {
    totalSources: sources.length,
    activeSources,
    totalCapacity,
    totalAvailable,
    availabilityPercentage: totalCapacity > 0 ? Math.round((totalAvailable / totalCapacity) * 100) : 0,
    totalUsage30Days,
    criticalSources: sources.filter(s => s.availabilityPercentage < 20).length
  };
};

// ============================================
// MIDDLEWARE
// ============================================

waterSourceSchema.pre('save', function(next) {
  if (this.currentAvailability > this.capacity) {
    this.currentAvailability = this.capacity;
  }
  next();
});

// ============================================
// EXPORT MODEL
// ============================================

const WaterSource = mongoose.model('WaterSource', waterSourceSchema);

module.exports = WaterSource;