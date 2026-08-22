const mongoose = require('mongoose');

const ruleBasedIrrigationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmDetails: {
    farmSize: { type: Number, required: true }, // in acres
    cropType: { type: String, required: true },
    soilType: { 
      type: String, 
      required: true,
      enum: ['Sandy', 'Loamy', 'Clay', 'Silt', 'Peaty', 'Chalky']
    },
    location: {
      latitude: Number,
      longitude: Number,
      region: String,
      city: String
    }
  },
  environmentalConditions: {
    currentSoilMoisture: { type: Number }, // percentage (0-100)
    temperature: { type: Number }, // Celsius
    humidity: { type: Number }, // percentage
    rainfall: { type: Number }, // mm in last 24hrs
    rainForecast: { type: Number }, // mm expected in next 3 days
    season: { 
      type: String,
      enum: ['Summer', 'Winter', 'Monsoon', 'Spring', 'Autumn']
    },
    windSpeed: { type: Number } // km/h
  },
  cropWaterRequirements: {
    cropStage: { 
      type: String,
      enum: ['Germination', 'Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Maturity']
    },
    dailyWaterNeed: { type: Number }, // liters per acre per day
    criticalPeriods: [String],
    waterStressTolerance: {
      type: String,
      enum: ['Low', 'Medium', 'High']
    }
  },
  irrigationSchedule: {
    frequency: { type: String }, // "Daily", "Every 2 days", "Twice daily", etc.
    duration: { type: Number }, // minutes per session
    timeOfDay: [String], // ["Morning", "Evening"]
    waterQuantity: { type: Number }, // liters per session
    weeklyWaterTotal: { type: Number }, // total liters per week
    startDate: { type: Date },
    endDate: { type: Date }
  },
  recommendations: {
    irrigationAdvice: { type: String },
    waterSavingTips: [String],
    cautionaryNotes: [String],
    alternativeMethods: [String],
    seasonalAdjustments: { type: String }
  },
  scheduleType: {
    type: String,
    enum: ['Rule-Based', 'ML-Based', 'Hybrid'],
    default: 'Rule-Based'
  },
  calculatedBy: {
    method: { type: String, default: 'Rule-Based Engine' },
    rulesApplied: [String], // List of rules that were triggered
    confidence: { type: Number, default: 100 } // Rule-based is 100% deterministic
  },
  notifications: {
    enabled: { type: Boolean, default: true },
    reminderTime: [String], // ["07:00", "18:00"]
    channels: [String] // ["SMS", "Email", "App"]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    effectiveness: {
      type: String,
      enum: ['Very Effective', 'Effective', 'Neutral', 'Ineffective']
    }
  }
}, {
  timestamps: true
});

// Index for faster queries
ruleBasedIrrigationSchema.index({ userId: 1, createdAt: -1 });
ruleBasedIrrigationSchema.index({ 'farmDetails.cropType': 1 });
ruleBasedIrrigationSchema.index({ isActive: 1 });

// Virtual for days until next irrigation
ruleBasedIrrigationSchema.virtual('daysUntilNextIrrigation').get(function() {
  if (!this.irrigationSchedule.startDate) return null;
  const today = new Date();
  const nextDate = new Date(this.irrigationSchedule.startDate);
  const diffTime = nextDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to check if irrigation is needed today
ruleBasedIrrigationSchema.methods.isIrrigationNeededToday = function() {
  const today = new Date().toLocaleDateString();
  const startDate = new Date(this.irrigationSchedule.startDate).toLocaleDateString();
  
  if (today === startDate) return true;
  
  // Parse frequency and calculate
  const frequency = this.irrigationSchedule.frequency;
  if (frequency === 'Daily') return true;
  if (frequency.includes('Every')) {
    const days = parseInt(frequency.match(/\d+/)[0]);
    const daysDiff = Math.floor((new Date() - new Date(this.irrigationSchedule.startDate)) / (1000 * 60 * 60 * 24));
    return daysDiff % days === 0;
  }
  
  return false;
};

module.exports = mongoose.model('RuleBasedIrrigation', ruleBasedIrrigationSchema);