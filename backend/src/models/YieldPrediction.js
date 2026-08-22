const mongoose = require('mongoose');

const yieldPredictionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  predictionId: {
    type: String,
    unique: true,
    default: function () {
      return `YLD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  },

  // ==================== NEW: Prediction Mode ====================
  predictionMode: {
    type: String,
    enum: ['ml', 'simple', 'advanced'], // 'advanced' is alias for 'ml'
    default: 'simple',
    required: true
  },
  // ==============================================================

  cropDetails: {
    cropType: {
      type: String,
      required: [true, 'Crop type is required'],
      trim: true
    },
    crop: String, // For ML model compatibility
    variety: String,
    plantedDate: {
      type: Date,
      required: false
    },
    expectedHarvestDate: {
      type: Date,
      required: false
    },
    growthStage: {
      type: String,
      enum: [
        'sowing', 'germination', 'vegetative', 'tillering',
        'flowering', 'fruiting', 'grain_filling', 'fruit_development',
        'maturation', 'maturity', 'harvest'
      ],
      default: 'vegetative'
    },
    area: {
      value: {
        type: Number,
        required: false,
        min: 0,
        default: 1
      },
      unit: {
        type: String,
        enum: ['sqm', 'sqft', 'acres', 'hectares', 'hectare', 'acre'],
        default: 'hectare'
      }
    },
    plantDensity: {
      type: Number,
      min: 0
    }
  },

  // ==================== NEW: Simple Mode Farmer Inputs ====================
  farmerInputs: {
    sowingTime: {
      type: String,
      enum: {
        values: ['very_early', 'slightly_early', 'on_time', 'slightly_late', 'very_late', null],
        message: '{VALUE} is not a valid sowing time'
      },
      default: null  // ✅ Set default to null instead of undefined
    },
    plantHealth: {
      type: String,
      enum: {
        values: ['excellent', 'good', 'average', 'poor', 'very_poor', null],
        message: '{VALUE} is not a valid plant health status'
      },
      default: null
    },
    leafColor: {
      type: String,
      enum: {
        values: ['dark_green', 'light_green', 'pale_yellow', 'yellow_brown', null],
        message: '{VALUE} is not a valid leaf color'
      },
      default: null
    },
    pestDiseaseImpact: {
      type: String,
      enum: {
        values: ['none', 'minor', 'moderate', 'severe', 'very_severe', null],
        message: '{VALUE} is not a valid pest/disease impact level'
      },
      default: null
    },
    rainfallExperience: {
      type: String,
      enum: {
        values: ['excess', 'adequate', 'below_normal', 'deficit', null],
        message: '{VALUE} is not a valid rainfall experience'
      },
      default: null
    },
    waterAvailability: {
      type: String,
      enum: {
        values: ['excess', 'adequate', 'slight_stress', 'moderate_stress', 'severe_stress', null],
        message: '{VALUE} is not a valid water availability status'
      },
      default: null
    },
    fertilizerUsage: {
      type: String,
      enum: {
        values: ['none', 'minimal', 'below_recommended', 'recommended', 'excess', null],
        message: '{VALUE} is not a valid fertilizer usage level'
      },
      default: null
    },
    lastSeasonComparison: {
      type: String,
      enum: {
        values: ['much_worse', 'worse', 'same', 'better', 'much_better', null],
        message: '{VALUE} is not a valid season comparison'
      },
      default: null
    },
    soilType: {
      type: String,
      default: null
    },
    location: {
      type: String,
      default: null
    }
  },
  // ========================================================================

  // Existing ML/Advanced Mode inputs
  inputFactors: {
    season: {
      type: String,
      enum: [
        'kharif', 'rabi', 'summer', 'winter', 'autumn', 'spring',
        'Kharif', 'Rabi', 'Summer', 'Winter', 'Autumn', 'Spring',
        'Zaid', 'zaid', 'Whole Year', 'whole year'
      ],
      required: false // Changed to false since simple mode doesn't need it
    },
    climate: {
      avgTemperature: {
        type: Number,
        required: false // Changed to false
      },
      avgHumidity: {
        type: Number,
        min: 0,
        max: 100
      },
      totalRainfall: {
        type: Number,
        required: false, // Changed to false
        min: 0
      },
      sunlightHours: {
        type: Number,
        min: 0,
        max: 24
      }
    },
    soil: {
      type: {
        type: String,
        enum: [
          'clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty',
          'Clay', 'Sandy', 'Loamy', 'Peaty', 'Chalky', 'Silty',
          'Black', 'black', 'Red', 'red', 'Alluvial', 'alluvial',
          'Clayey', 'clayey', 'Sandy Loam', 'sandy loam'
        ],
        required: false // Changed to false
      },
      ph: {
        type: Number,
        min: 0,
        max: 14
      },
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      organicMatter: Number
    },
    inputs: {
      fertilizer: {
        type: {
          type: String,
          enum: ['organic', 'inorganic', 'mixed', 'none']
        },
        amount: {
          type: Number,
          required: false,
          min: 0,
          default: 0
        },
        unit: String
      },
      pesticides: {
        used: {
          type: Boolean,
          default: false
        },
        frequency: String
      },
      irrigation: {
        method: {
          type: String,
          enum: ['drip', 'sprinkler', 'surface', 'rainfed']
        },
        frequency: String,
        totalWater: {
          type: Number,
          default: 0
        }
      }
    },
    management: {
      farmingPractice: {
        type: String,
        enum: ['conventional', 'organic', 'integrated', 'precision'],
        default: 'conventional'
      },
      weedControl: {
        type: String,
        enum: ['manual', 'chemical', 'mulching', 'integrated']
      },
      pestManagement: {
        type: String,
        enum: ['preventive', 'curative', 'ipm', 'none']
      }
    }
  },

  location: {
    coordinates: {
      latitude: {
        type: Number,
        min: -90,
        max: 90
      },
      longitude: {
        type: Number,
        min: -180,
        max: 180
      }
    },
    city: String,
    district: String,
    state: String,
    country: String,
    elevation: Number
  },

  prediction: {
    predictedYield: {
      value: {
        type: Number,
        required: false, // Changed to false since simple mode uses range
        min: 0
      },
      unit: {
        type: String,
        enum: ['kg', 'tons', 'quintals', 'pounds', 'kg per hectare', 'kg/ha'],
        default: 'kg'
      }
    },
    yieldPerArea: {
      value: Number,
      unit: String
    },
    confidence: {
      type: String, // Changed from Number to String for simple mode
      enum: ['Low', 'Medium', 'High', 'Very High']
    },
    confidenceScore: {
      type: Number, // Keep numeric confidence for ML mode
      min: 0,
      max: 100
    },
    range: {
      min: Number,
      max: Number
    },
    factors: [{
      name: String,
      impact: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
      },
      weight: Number,
      description: String
    }]
  },

  // ==================== NEW: Simple Mode Outputs ====================
  yieldCategory: {
    type: String,
    enum: ['Excellent', 'Good', 'Average', 'Below Average', 'Poor']
  },
  yieldRange: {
    low: Number,
    expected: Number,
    high: Number
  },
  adjustmentFactor: Number,
  affectingFactors: [{
    factor: String,
    impact: String,
    description: String,
    effect: String
  }],
  // ==================================================================

  historicalComparison: {
    previousYields: [{
      season: String,
      year: Number,
      yield: Number
    }],
    regionalAverage: {
      value: Number,
      unit: String
    },
    comparisonToAverage: {
      type: String,
      enum: ['above', 'average', 'below']
    },
    percentageDifference: Number
  },

  recommendations: [{
    category: {
      type: String,
      enum: ['fertilizer', 'irrigation', 'pest-control', 'harvesting', 'general', 'soil', 'water']
    },
    title: String,
    description: String,
    expectedImpact: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low']
    },
    implementationCost: {
      amount: Number,
      currency: String
    }
  }],

  risks: [{
    type: {
      type: String,
      enum: ['weather', 'pest', 'disease', 'market', 'resource']
    },
    description: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical']
    },
    probability: {
      type: Number,
      min: 0,
      max: 100
    },
    mitigationStrategy: String
  }],

  economicAnalysis: {
    estimatedRevenue: {
      amount: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    estimatedCost: {
      amount: Number,
      currency: String
    },
    expectedProfit: {
      amount: Number,
      currency: String
    },
    breakEvenYield: Number,
    roi: Number,
    marketPrice: {
      current: Number,
      predicted: Number,
      unit: String
    }
  },

  actualYield: {
    value: Number,
    unit: String,
    harvestDate: Date,
    notes: String
  },

  accuracy: {
    deviationPercentage: Number,
    isAccurate: Boolean,
    factors: [String],
    withinRange: Boolean // NEW: For simple mode range accuracy
  },

  modelInfo: {
    modelName: {
      type: String,
      default: 'Yield Prediction Model'
    },
    version: {
      type: String,
      default: '1.0.0'
    },
    algorithm: {
      type: String,
      enum: [
        'random-forest', 'neural-network', 'gradient-boosting', 'linear-regression',
        'heuristic', 'ensemble', 'decision-tree', 'svm', 'rule-based',
        'stacking-ensemble (XGB+LGB+RF+ET+GBM)', 'xgboost', 'lightgbm'
      ],
      default: 'random-forest'
    },
    trainingDate: Date,
    features: [String],
    accuracy: Number
  },

  processingTime: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ['predicted', 'monitored', 'harvested', 'archived'],
    default: 'predicted'
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

// Indexes
yieldPredictionSchema.index({ user: 1, createdAt: -1 });
yieldPredictionSchema.index({ predictionId: 1 });
yieldPredictionSchema.index({ 'cropDetails.cropType': 1 });
yieldPredictionSchema.index({ 'inputFactors.season': 1 });
yieldPredictionSchema.index({ status: 1 });
yieldPredictionSchema.index({ predictionMode: 1 }); // NEW INDEX

// Virtual for days until harvest
yieldPredictionSchema.virtual('daysUntilHarvest').get(function () {
  if (!this.cropDetails.expectedHarvestDate) return null;
  const now = new Date();
  const harvest = new Date(this.cropDetails.expectedHarvestDate);
  return Math.ceil((harvest - now) / (1000 * 60 * 60 * 24));
});

// Virtual for growth duration
yieldPredictionSchema.virtual('growthDuration').get(function () {
  if (!this.cropDetails.plantedDate || !this.cropDetails.expectedHarvestDate) return null;
  const planted = new Date(this.cropDetails.plantedDate);
  const harvest = new Date(this.cropDetails.expectedHarvestDate);
  return Math.ceil((harvest - planted) / (1000 * 60 * 60 * 24));
});

// Virtual for profit margin
yieldPredictionSchema.virtual('profitMargin').get(function () {
  if (!this.economicAnalysis.estimatedRevenue || !this.economicAnalysis.estimatedCost) {
    return null;
  }
  const revenue = this.economicAnalysis.estimatedRevenue.amount;
  const cost = this.economicAnalysis.estimatedCost.amount;
  return ((revenue - cost) / revenue * 100).toFixed(2);
});

// Virtual for yield quality rating
yieldPredictionSchema.virtual('yieldQuality').get(function () {
  // For simple mode, use yieldCategory
  if (this.predictionMode === 'simple' && this.yieldCategory) {
    return this.yieldCategory.toLowerCase().replace(' ', '-');
  }

  // For ML mode, use historical comparison
  if (!this.historicalComparison.regionalAverage) return 'unknown';

  const predicted = this.prediction.predictedYield.value;
  const average = this.historicalComparison.regionalAverage.value;

  const ratio = predicted / average;

  if (ratio >= 1.2) return 'excellent';
  if (ratio >= 1.0) return 'good';
  if (ratio >= 0.8) return 'average';
  if (ratio >= 0.6) return 'below-average';
  return 'poor';
});

// Pre-save middleware to calculate derived values
yieldPredictionSchema.pre('save', function (next) {
  // Sync cropType and crop fields
  if (this.cropDetails.crop && !this.cropDetails.cropType) {
    this.cropDetails.cropType = this.cropDetails.crop;
  }
  if (this.cropDetails.cropType && !this.cropDetails.crop) {
    this.cropDetails.crop = this.cropDetails.cropType;
  }

  // Calculate yield per area (for both modes)
  if (this.cropDetails.area && this.cropDetails.area.value > 0) {
    if (this.predictionMode === 'simple' && this.yieldRange) {
      // For simple mode, use expected yield
      const yieldValue = this.yieldRange.expected;
      const areaValue = this.cropDetails.area.value;

      this.prediction.yieldPerArea = {
        value: (yieldValue / areaValue).toFixed(2),
        unit: `kg per ${this.cropDetails.area.unit}`
      };
    } else if (this.prediction.predictedYield) {
      // For ML mode
      const yieldValue = this.prediction.predictedYield.value;
      const areaValue = this.cropDetails.area.value;

      this.prediction.yieldPerArea = {
        value: (yieldValue / areaValue).toFixed(2),
        unit: `${this.prediction.predictedYield.unit} per ${this.cropDetails.area.unit}`
      };
    }
  }

  // Calculate economic metrics
  if (this.economicAnalysis.estimatedRevenue && this.economicAnalysis.estimatedCost) {
    const revenue = this.economicAnalysis.estimatedRevenue.amount;
    const cost = this.economicAnalysis.estimatedCost.amount;

    this.economicAnalysis.expectedProfit = {
      amount: revenue - cost,
      currency: this.economicAnalysis.estimatedRevenue.currency
    };

    if (cost > 0) {
      this.economicAnalysis.roi = ((revenue - cost) / cost * 100).toFixed(2);
    }
  }

  next();
});

// Method to record actual yield
yieldPredictionSchema.methods.recordActualYield = function (actualYield, harvestDate, notes) {
  this.actualYield = {
    value: actualYield,
    unit: this.prediction.predictedYield?.unit || 'kg',
    harvestDate: harvestDate || Date.now(),
    notes
  };

  // Calculate accuracy based on mode
  if (this.predictionMode === 'simple' && this.yieldRange) {
    // For simple mode, check if actual is within range
    const withinRange = actualYield >= this.yieldRange.low && actualYield <= this.yieldRange.high;
    const expected = this.yieldRange.expected;
    const deviation = Math.abs((actualYield - expected) / expected * 100);

    this.accuracy = {
      deviationPercentage: deviation.toFixed(2),
      isAccurate: deviation <= 15, // 15% tolerance for simple mode
      withinRange: withinRange
    };
  } else if (this.prediction.predictedYield) {
    // For ML mode
    const predicted = this.prediction.predictedYield.value;
    const deviation = Math.abs((actualYield - predicted) / predicted * 100);

    this.accuracy = {
      deviationPercentage: deviation.toFixed(2),
      isAccurate: deviation <= 10
    };
  }

  this.status = 'harvested';

  return this.save();
};

// Method to add risk
yieldPredictionSchema.methods.addRisk = function (type, description, severity, probability, mitigation) {
  this.risks.push({
    type,
    description,
    severity,
    probability,
    mitigationStrategy: mitigation
  });
  return this.save();
};

// Method to update status
yieldPredictionSchema.methods.updateStatus = function (newStatus) {
  this.status = newStatus;
  return this.save();
};

// Static method to get user's prediction history
yieldPredictionSchema.statics.getUserPredictions = async function (userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email');
};

// Static method to get predictions by crop
yieldPredictionSchema.statics.getPredictionsByCrop = async function (cropType) {
  return this.find({ 'cropDetails.cropType': cropType })
    .select('prediction cropDetails inputFactors predictionMode yieldCategory yieldRange')
    .sort({ createdAt: -1 });
};

// NEW: Static method to get predictions by mode
yieldPredictionSchema.statics.getPredictionsByMode = async function (userId, mode, limit = 10) {
  return this.find({ user: userId, predictionMode: mode })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get accuracy statistics
yieldPredictionSchema.statics.getAccuracyStats = async function (mode = null) {
  const matchQuery = {
    status: 'harvested',
    'accuracy.deviationPercentage': { $exists: true }
  };

  if (mode) {
    matchQuery.predictionMode = mode;
  }

  return this.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$predictionMode',
        avgDeviation: { $avg: '$accuracy.deviationPercentage' },
        accuratePredictions: {
          $sum: { $cond: ['$accuracy.isAccurate', 1, 0] }
        },
        totalPredictions: { $sum: 1 }
      }
    },
    {
      $project: {
        mode: '$_id',
        avgDeviation: 1,
        accuracyRate: {
          $multiply: [
            { $divide: ['$accuratePredictions', '$totalPredictions'] },
            100
          ]
        }
      }
    }
  ]);
};

// Static method to get yield trends
yieldPredictionSchema.statics.getYieldTrends = async function (cropType, months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  return this.aggregate([
    {
      $match: {
        'cropDetails.cropType': cropType,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          mode: '$predictionMode'
        },
        avgYield: {
          $avg: {
            $cond: [
              { $eq: ['$predictionMode', 'simple'] },
              '$yieldRange.expected',
              '$prediction.predictedYield.value'
            ]
          }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);
};

// NEW: Static method to compare simple vs ML predictions
yieldPredictionSchema.statics.compareModePredictions = async function (userId, cropType) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        'cropDetails.cropType': cropType,
        status: 'harvested'
      }
    },
    {
      $group: {
        _id: '$predictionMode',
        avgAccuracy: { $avg: '$accuracy.deviationPercentage' },
        totalPredictions: { $sum: 1 }
      }
    }
  ]);
};

const YieldPrediction = mongoose.model('YieldPrediction', yieldPredictionSchema);

module.exports = YieldPrediction;