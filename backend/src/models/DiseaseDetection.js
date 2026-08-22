const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  detectionId: {
    type: String,
    unique: true,
    default: function() {
      return `DIS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
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
    plantAge: {
      type: Number, // days
      min: 0
    },
    affectedArea: {
      type: String,
      enum: ['leaves', 'stem', 'roots', 'fruits', 'flowers', 'whole-plant','Leaves','Stem','Roots','Fruits','Flowers','Whole-Planet'],
      required: true
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    filename: String,
    size: Number, // bytes
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    thumbnail: String,
    metadata: {
      width: Number,
      height: Number,
      quality: Number
    }
  }],
  detection: {
    diseaseName: {
      type: String,
      required: true
    },
    scientificName: String,
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical'],
      required: true
    },
    category: {
      type: String,
      enum: ['fungal', 'bacterial', 'viral', 'pest', 'nutrient-deficiency', 'environmental', 'unknown'],
      required: true
    },
    affectedStage: {
      type: String,
      enum: ['seedling', 'vegetative', 'flowering', 'fruiting', 'maturation', 'any'],
      default: 'any'
    }
  },
  symptoms: [{
    description: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    location: String
  }],
  causes: [{
    factor: String,
    description: String,
    likelihood: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  }],
  treatment: {
    immediate: [{
      action: String,
      priority: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low'],
        default: 'medium'
      },
      description: String,
      materials: [String]
    }],
    shortTerm: [{
      action: String,
      timeline: String, // e.g., "Within 7 days"
      description: String,
      expectedOutcome: String
    }],
    longTerm: [{
      action: String,
      timeline: String,
      description: String
    }],
    chemical: [{
      name: String,
      type: {
        type: String,
        enum: ['fungicide', 'bactericide', 'insecticide', 'pesticide', 'herbicide']
      },
      dosage: String,
      applicationMethod: String,
      frequency: String,
      safetyPrecautions: [String],
      waitingPeriod: String // days before harvest
    }],
    organic: [{
      name: String,
      ingredients: [String],
      preparation: String,
      application: String,
      frequency: String
    }],
    cultural: [{
      practice: String,
      description: String,
      benefit: String
    }]
  },
  prevention: [{
    method: String,
    description: String,
    effectiveness: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high']
    },
    frequency: String
  }],
  prognosis: {
    recoveryProbability: {
      type: Number,
      min: 0,
      max: 100
    },
    expectedRecoveryTime: String, // e.g., "2-3 weeks"
    yieldImpact: {
      type: String,
      enum: ['none', 'minimal', 'moderate', 'significant', 'severe']
    },
    spreadRisk: {
      type: String,
      enum: ['low', 'medium', 'high', 'very-high']
    }
  },
  environmentalFactors: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    soilMoisture: Number,
    location: {
      latitude: Number,
      longitude: Number,
      city: String,
      state: String,
      country: String
    }
  },
  alternativeDiagnoses: [{
    diseaseName: String,
    confidence: Number,
    reason: String
  }],
  expertReview: {
    isReviewed: {
      type: Boolean,
      default: false
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    confirmedDiagnosis: Boolean,
    expertNotes: String,
    recommendedAction: String
  },
  followUp: [{
    date: Date,
    status: {
      type: String,
      enum: ['improving', 'stable', 'worsening', 'resolved']
    },
    notes: String,
    images: [String],
    treatmentApplied: String
  }],
  outcome: {
    status: {
      type: String,
      enum: ['active', 'recovering', 'resolved', 'lost-crop'],
      default: 'active'
    },
    resolution: String,
    recoveryTime: Number, // days
    yieldLoss: Number, // percentage
    costIncurred: Number,
    lessonsLearned: String
  },
  modelVersion: {
    type: String,
    default: '1.0.0'
  },
  processingTime: {
    type: Number, // milliseconds
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [String],
  notes: {
    type: String,
    maxlength: 2000
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
diseaseDetectionSchema.index({ user: 1, createdAt: -1 });
diseaseDetectionSchema.index({ detectionId: 1 });
diseaseDetectionSchema.index({ 'detection.diseaseName': 1 });
diseaseDetectionSchema.index({ 'detection.category': 1 });
diseaseDetectionSchema.index({ 'cropDetails.cropType': 1 });
diseaseDetectionSchema.index({ 'environmentalFactors.location': '2dsphere' });

// Virtual for urgency level
diseaseDetectionSchema.virtual('urgencyLevel').get(function() {
  const severity = this.detection.severity;
  const spreadRisk = this.prognosis.spreadRisk;
  
  if (severity === 'critical' || spreadRisk === 'very-high') return 'critical';
  if (severity === 'severe' || spreadRisk === 'high') return 'high';
  if (severity === 'moderate') return 'medium';
  return 'low';
});

// Virtual for treatment complexity
diseaseDetectionSchema.virtual('treatmentComplexity').get(function() {
  const chemicalCount = this.treatment.chemical?.length || 0;
  const immediateCount = this.treatment.immediate?.length || 0;
  
  const total = chemicalCount + immediateCount;
  
  if (total > 5) return 'complex';
  if (total > 2) return 'moderate';
  return 'simple';
});

// Virtual for days since detection
diseaseDetectionSchema.virtual('daysSinceDetection').get(function() {
  const now = new Date();
  const detected = new Date(this.createdAt);
  return Math.floor((now - detected) / (1000 * 60 * 60 * 24));
});

// Method to add follow-up
diseaseDetectionSchema.methods.addFollowUp = function(status, notes, images, treatmentApplied) {
  this.followUp.push({
    date: Date.now(),
    status,
    notes,
    images: images || [],
    treatmentApplied
  });
  
  // Update outcome status based on follow-up
  if (status === 'resolved') {
    this.outcome.status = 'resolved';
    this.outcome.recoveryTime = this.daysSinceDetection;
  }
  
  return this.save();
};

// Method to request expert review
diseaseDetectionSchema.methods.requestExpertReview = function() {
  this.expertReview.isReviewed = false;
  return this.save();
};

// Method to complete expert review
diseaseDetectionSchema.methods.completeExpertReview = function(expertId, confirmed, notes, action) {
  this.expertReview.isReviewed = true;
  this.expertReview.reviewedBy = expertId;
  this.expertReview.reviewedAt = Date.now();
  this.expertReview.confirmedDiagnosis = confirmed;
  this.expertReview.expertNotes = notes;
  this.expertReview.recommendedAction = action;
  
  return this.save();
};

// Method to update outcome
diseaseDetectionSchema.methods.updateOutcome = function(status, resolution, yieldLoss, cost) {
  this.outcome.status = status;
  this.outcome.resolution = resolution;
  this.outcome.yieldLoss = yieldLoss;
  this.outcome.costIncurred = cost;
  
  if (status === 'resolved') {
    this.outcome.recoveryTime = this.daysSinceDetection;
  }
  
  return this.save();
};

// Static method to get user's detection history
diseaseDetectionSchema.statics.getUserHistory = async function(userId, limit = 20) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email');
};

// Static method to get most common diseases
diseaseDetectionSchema.statics.getMostCommonDiseases = async function(limit = 10) {
  return this.aggregate([
    {
      $group: {
        _id: '$detection.diseaseName',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$detection.confidence' },
        categories: { $addToSet: '$detection.category' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

// Static method to get diseases by crop
diseaseDetectionSchema.statics.getDiseasesByCrop = async function(cropType) {
  return this.find({ 'cropDetails.cropType': cropType })
    .select('detection symptoms treatment prognosis')
    .sort({ 'detection.confidence': -1 });
};

// Static method to get diseases requiring urgent attention
diseaseDetectionSchema.statics.getUrgentCases = async function() {
  return this.find({
    $or: [
      { 'detection.severity': { $in: ['severe', 'critical'] } },
      { 'prognosis.spreadRisk': { $in: ['high', 'very-high'] } }
    ],
    'outcome.status': 'active'
  })
  .populate('user', 'name email phone')
  .sort({ createdAt: -1 });
};

// Static method to get detection statistics
diseaseDetectionSchema.statics.getDetectionStats = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalDetections: { $sum: 1 },
        avgConfidence: { $avg: '$detection.confidence' },
        byCategory: {
          $push: '$detection.category'
        },
        bySeverity: {
          $push: '$detection.severity'
        }
      }
    }
  ]);
};

const DiseaseDetection = mongoose.model('DiseaseDetection', diseaseDetectionSchema);

module.exports = DiseaseDetection;