const mongoose = require('mongoose');

const irrigationScheduleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  scheduleName: {
    type: String,
    required: [true, 'Schedule name is required'],
    trim: true,
    maxlength: [100, 'Schedule name cannot exceed 100 characters']
  },
  cropDetails: {
    cropType: {
      type: String,
      required: [true, 'Crop type is required'],
      trim: true
    },
    variety: {
      type: String,
      trim: true
    },
    plantedDate: {
      type: Date,
      required: [true, 'Planting date is required']
    },
    expectedHarvestDate: {
      type: Date
    },
    growthStage: {
      type: String,
      enum: ['germination', 'vegetative', 'flowering', 'fruiting', 'maturation', 'harvest'],
      default: 'germination'
    },
    area: {
      value: {
        type: Number,
        required: [true, 'Farm area is required'],
        min: [0, 'Area cannot be negative']
      },
      unit: {
        type: String,
        enum: ['sqm', 'sqft', 'acres', 'hectares'],
        default: 'sqm'
      }
    }
  },
  soilInformation: {
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty'],
      required: [true, 'Soil type is required']
    },
    moistureLevel: {
      type: Number, // percentage
      min: 0,
      max: 100
    },
    waterHoldingCapacity: {
      type: Number, // percentage
      min: 0,
      max: 100
    },
    drainageRate: {
      type: String,
      enum: ['poor', 'moderate', 'good', 'excellent'],
      default: 'moderate'
    }
  },
  // FIXED: Simple coordinate structure instead of GeoJSON
  location: {
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  irrigationSystem: {
    type: {
      type: String,
      enum: ['drip', 'sprinkler', 'surface', 'subsurface', 'manual'],
      required: [true, 'Irrigation system type is required']
    },
    efficiency: {
      type: Number, // percentage
      min: 0,
      max: 100,
      default: 75
    },
    flowRate: {
      value: Number, // liters per hour
      unit: {
        type: String,
        default: 'lph'
      }
    }
  },
  schedule: {
    frequency: {
      type: String,
      enum: ['daily', 'alternate-days', 'twice-weekly', 'weekly', 'custom'],
      required: true,
      default: 'daily'
    },
    customInterval: {
      type: Number, // days between irrigations (for custom frequency)
      min: 1,
      max: 30
    },
    timesPerDay: {
      type: Number,
      min: 1,
      max: 10,
      default: 1
    },
    preferredTimes: [{
      hour: {
        type: Number,
        min: 0,
        max: 23
      },
      minute: {
        type: Number,
        min: 0,
        max: 59
      },
      duration: {
        type: Number, // minutes
        min: 1,
        max: 480
      }
    }],
    waterAmount: {
      value: {
        type: Number,
        required: true,
        min: 0
      },
      unit: {
        type: String,
        enum: ['liters', 'gallons', 'cubic-meters'],
        default: 'liters'
      }
    }
  },
  weatherAdjustments: {
    enabled: {
      type: Boolean,
      default: true
    },
    rainThreshold: {
      type: Number, // mm of rain to skip irrigation
      default: 5
    },
    temperatureAdjustment: {
      type: Boolean,
      default: true
    },
    humidityAdjustment: {
      type: Boolean,
      default: true
    }
  },
  upcomingIrrigations: [{
    scheduledDate: {
      type: Date,
      required: true
    },
    scheduledTime: String,
    duration: Number, // minutes
    waterAmount: {
      value: Number,
      unit: String
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'skipped', 'failed'],
      default: 'pending'
    },
    completedAt: Date,
    actualWaterUsed: Number,
    notes: String,
    weatherCondition: String,
    skippedReason: String
  }],
  totalWaterUsage: {
    daily: {
      type: Number,
      default: 0
    },
    weekly: {
      type: Number,
      default: 0
    },
    monthly: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    }
  },
  duration: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
      default: Date.now
    },
    endDate: {
      type: Date
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  isAutomated: {
    type: Boolean,
    default: false
  },
  automationDeviceId: {
    type: String
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: Number, // minutes before scheduled time
      default: 30
    },
    channels: [{
      type: String,
      enum: ['email', 'sms', 'push', 'in-app']
    }]
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  modelVersion: {
    type: String,
    default: '1.0.0'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
irrigationScheduleSchema.index({ user: 1, status: 1 });
irrigationScheduleSchema.index({ 'duration.startDate': 1, 'duration.endDate': 1 });
irrigationScheduleSchema.index({ 'upcomingIrrigations.scheduledDate': 1 });
// REMOVED: geospatial index

// Virtual for days since planting
irrigationScheduleSchema.virtual('daysSincePlanting').get(function() {
  if (!this.cropDetails.plantedDate) return 0;
  const now = new Date();
  const planted = new Date(this.cropDetails.plantedDate);
  return Math.floor((now - planted) / (1000 * 60 * 60 * 24));
});

// Virtual for next irrigation
irrigationScheduleSchema.virtual('nextIrrigation').get(function() {
  if (!this.upcomingIrrigations || this.upcomingIrrigations.length === 0) return null;
  
  const pending = this.upcomingIrrigations
    .filter(irr => irr.status === 'pending')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  
  return pending.length > 0 ? pending[0] : null;
});

// Virtual for completion rate
irrigationScheduleSchema.virtual('completionRate').get(function() {
  if (!this.upcomingIrrigations || this.upcomingIrrigations.length === 0) return 0;
  
  const completed = this.upcomingIrrigations.filter(irr => irr.status === 'completed').length;
  const total = this.upcomingIrrigations.length;
  
  return Math.round((completed / total) * 100);
});

// Method to add irrigation event
irrigationScheduleSchema.methods.addIrrigationEvent = function(scheduledDate, duration, waterAmount) {
  this.upcomingIrrigations.push({
    scheduledDate,
    scheduledTime: new Date(scheduledDate).toTimeString().slice(0, 5),
    duration,
    waterAmount: {
      value: waterAmount,
      unit: this.schedule.waterAmount.unit
    },
    status: 'pending'
  });
  return this.save();
};

// Method to complete irrigation
irrigationScheduleSchema.methods.completeIrrigation = function(irrigationId, actualWaterUsed, notes) {
  const irrigation = this.upcomingIrrigations.id(irrigationId);
  
  if (irrigation) {
    irrigation.status = 'completed';
    irrigation.completedAt = Date.now();
    irrigation.actualWaterUsed = actualWaterUsed;
    irrigation.notes = notes;
    
    // Update total water usage
    this.totalWaterUsage.total += actualWaterUsed;
  }
  
  return this.save();
};

// Method to skip irrigation
irrigationScheduleSchema.methods.skipIrrigation = function(irrigationId, reason) {
  const irrigation = this.upcomingIrrigations.id(irrigationId);
  
  if (irrigation) {
    irrigation.status = 'skipped';
    irrigation.skippedReason = reason;
  }
  
  return this.save();
};

// Method to update growth stage
irrigationScheduleSchema.methods.updateGrowthStage = function(stage) {
  this.cropDetails.growthStage = stage;
  return this.save();
};

// Static method to get active schedules for user
irrigationScheduleSchema.statics.getActiveSchedules = async function(userId) {
  return this.find({ user: userId, status: 'active' })
    .sort({ 'duration.startDate': -1 });
};

// Static method to get schedules needing irrigation today
irrigationScheduleSchema.statics.getTodaySchedules = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return this.find({
    status: 'active',
    'upcomingIrrigations.scheduledDate': {
      $gte: today,
      $lt: tomorrow
    },
    'upcomingIrrigations.status': 'pending'
  }).populate('user', 'name email phone');
};

// Static method to get water usage statistics
irrigationScheduleSchema.statics.getWaterUsageStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { user: mongoose.Types.ObjectId(userId), createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalWater: { $sum: '$totalWaterUsage.total' },
        avgDaily: { $avg: '$totalWaterUsage.daily' }
      }
    }
  ]);
};

const IrrigationSchedule = mongoose.model('IrrigationSchedule', irrigationScheduleSchema);

module.exports = IrrigationSchedule;