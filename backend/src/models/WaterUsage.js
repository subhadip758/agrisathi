const mongoose = require('mongoose');

const waterUsageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  recordDate: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  source: {
    type: {
      type: String,
      enum: ['municipal', 'well', 'rainwater', 'river', 'pond', 'borewell', 'other'],
      required: true
    },
    name: String,
    location: String
  },
  usage: {
    irrigation: {
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        enum: ['liters', 'gallons', 'cubic-meters'],
        default: 'liters'
      }
    },
    spraying: {
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      unit: {
        type: String,
        enum: ['liters', 'gallons', 'cubic-meters'],
        default: 'liters'
      }
    },
    cleaning: {
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      unit: {
        type: String,
        enum: ['liters', 'gallons', 'cubic-meters'],
        default: 'liters'
      }
    },
    other: {
      amount: {
        type: Number,
        default: 0,
        min: 0
      },
      unit: {
        type: String,
        enum: ['liters', 'gallons', 'cubic-meters'],
        default: 'liters'
      },
      description: String
    }
  },
  cropWiseUsage: [{
    cropType: {
      type: String,
      required: true
    },
    area: {
      value: Number,
      unit: String
    },
    waterUsed: {
      amount: Number,
      unit: String
    },
    method: {
      type: String,
      enum: ['drip', 'sprinkler', 'surface', 'manual']
    }
  }],
  totalUsage: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      enum: ['liters', 'gallons', 'cubic-meters'],
      default: 'liters'
    }
  },
  cost: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    ratePerUnit: Number
  },
  weather: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    evapotranspiration: Number
  },
  efficiency: {
    waterUseEfficiency: {
      type: Number, // kg crop per cubic meter water
      min: 0
    },
    irrigationEfficiency: {
      type: Number, // percentage
      min: 0,
      max: 100
    },
    wastage: {
      amount: Number,
      percentage: Number,
      reason: String
    }
  },
  savingsMeasures: [{
    measure: String,
    waterSaved: Number,
    implementation: String
  }],
  qualityParameters: {
    ph: {
      type: Number,
      min: 0,
      max: 14
    },
    tds: {
      type: Number, // Total Dissolved Solids in ppm
      min: 0
    },
    ec: {
      type: Number, // Electrical Conductivity in dS/m
      min: 0
    },
    hardness: {
      type: String,
      enum: ['soft', 'moderate', 'hard', 'very-hard']
    },
    salinity: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  meterReading: {
    previous: Number,
    current: Number,
    unit: String
  },
  location: {
    farmSection: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  recordedBy: {
    type: String,
    default: 'user'
  },
  deviceId: String, // For IoT devices
  isAutomated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
waterUsageSchema.index({ user: 1, recordDate: -1 });
waterUsageSchema.index({ period: 1 });
waterUsageSchema.index({ 'source.type': 1 });
waterUsageSchema.index({ recordDate: -1 });

// Virtual for usage per area
waterUsageSchema.virtual('usagePerArea').get(function() {
  if (!this.cropWiseUsage || this.cropWiseUsage.length === 0) return null;
  
  let totalArea = 0;
  this.cropWiseUsage.forEach(crop => {
    if (crop.area && crop.area.value) {
      totalArea += crop.area.value;
    }
  });
  
  if (totalArea === 0) return null;
  
  return {
    amount: this.totalUsage.amount / totalArea,
    unit: `${this.totalUsage.unit} per ${this.cropWiseUsage[0]?.area?.unit || 'sqm'}`
  };
});

// Virtual for breakdown by purpose
waterUsageSchema.virtual('usageBreakdown').get(function() {
  const total = this.totalUsage.amount;
  
  return {
    irrigation: {
      amount: this.usage.irrigation.amount,
      percentage: (this.usage.irrigation.amount / total * 100).toFixed(2)
    },
    spraying: {
      amount: this.usage.spraying.amount,
      percentage: (this.usage.spraying.amount / total * 100).toFixed(2)
    },
    cleaning: {
      amount: this.usage.cleaning.amount,
      percentage: (this.usage.cleaning.amount / total * 100).toFixed(2)
    },
    other: {
      amount: this.usage.other.amount,
      percentage: (this.usage.other.amount / total * 100).toFixed(2)
    }
  };
});

// Virtual for cost per liter
waterUsageSchema.virtual('costPerLiter').get(function() {
  if (this.cost.amount === 0 || this.totalUsage.amount === 0) return 0;
  return (this.cost.amount / this.totalUsage.amount).toFixed(4);
});

// Pre-save middleware to calculate total usage
waterUsageSchema.pre('save', function(next) {
  const total = 
    this.usage.irrigation.amount +
    this.usage.spraying.amount +
    this.usage.cleaning.amount +
    this.usage.other.amount;
  
  this.totalUsage.amount = total;
  
  // Calculate irrigation efficiency if wastage is provided
  if (this.efficiency.wastage && this.efficiency.wastage.amount) {
    const effective = total - this.efficiency.wastage.amount;
    this.efficiency.irrigationEfficiency = (effective / total * 100).toFixed(2);
  }
  
  next();
});

// Method to add crop-wise usage
waterUsageSchema.methods.addCropUsage = function(cropType, area, waterUsed, method) {
  this.cropWiseUsage.push({
    cropType,
    area,
    waterUsed,
    method
  });
  return this.save();
};

// Method to update efficiency metrics
waterUsageSchema.methods.updateEfficiency = function(wue, irrigationEff, wastage) {
  this.efficiency.waterUseEfficiency = wue;
  this.efficiency.irrigationEfficiency = irrigationEff;
  
  if (wastage) {
    this.efficiency.wastage = wastage;
  }
  
  return this.save();
};

// Static method to get user's usage history
waterUsageSchema.statics.getUserUsageHistory = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    user: userId,
    recordDate: { $gte: startDate }
  }).sort({ recordDate: -1 });
};

// Static method to get usage summary
waterUsageSchema.statics.getUsageSummary = async function(userId, period = 'monthly') {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'daily':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'weekly':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'monthly':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    default:
      startDate = new Date(now.setMonth(now.getMonth() - 1));
  }
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        recordDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalWater: { $sum: '$totalUsage.amount' },
        totalCost: { $sum: '$cost.amount' },
        avgDailyUsage: { $avg: '$totalUsage.amount' },
        totalIrrigation: { $sum: '$usage.irrigation.amount' },
        totalSpraying: { $sum: '$usage.spraying.amount' },
        count: { $sum: 1 }
      }
    }
  ]);
};

// Static method to get usage by source
waterUsageSchema.statics.getUsageBySource = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        recordDate: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$source.type',
        totalUsage: { $sum: '$totalUsage.amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { totalUsage: -1 } }
  ]);
};

// Static method to get usage by crop
waterUsageSchema.statics.getUsageByCrop = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        recordDate: { $gte: startDate }
      }
    },
    { $unwind: '$cropWiseUsage' },
    {
      $group: {
        _id: '$cropWiseUsage.cropType',
        totalWater: { $sum: '$cropWiseUsage.waterUsed.amount' },
        avgPerRecord: { $avg: '$cropWiseUsage.waterUsed.amount' }
      }
    },
    { $sort: { totalWater: -1 } }
  ]);
};

// Static method to get efficiency trends
waterUsageSchema.statics.getEfficiencyTrends = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    user: userId,
    recordDate: { $gte: startDate }
  })
  .select('recordDate efficiency.irrigationEfficiency efficiency.waterUseEfficiency')
  .sort({ recordDate: 1 });
};

// Static method to compare with previous period
waterUsageSchema.statics.compareWithPreviousPeriod = async function(userId, currentDays = 30) {
  const now = new Date();
  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - currentDays);
  
  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - currentDays);
  
  const currentPeriod = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        recordDate: { $gte: currentStart }
      }
    },
    {
      $group: {
        _id: null,
        totalUsage: { $sum: '$totalUsage.amount' },
        totalCost: { $sum: '$cost.amount' }
      }
    }
  ]);
  
  const previousPeriod = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        recordDate: { $gte: previousStart, $lt: currentStart }
      }
    },
    {
      $group: {
        _id: null,
        totalUsage: { $sum: '$totalUsage.amount' },
        totalCost: { $sum: '$cost.amount' }
      }
    }
  ]);
  
  return {
    current: currentPeriod[0] || { totalUsage: 0, totalCost: 0 },
    previous: previousPeriod[0] || { totalUsage: 0, totalCost: 0 }
  };
};

const WaterUsage = mongoose.model('WaterUsage', waterUsageSchema);

module.exports = WaterUsage;