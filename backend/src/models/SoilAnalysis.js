/**
 * Soil Analysis Model
 * Stores both lab-based and observation-based soil analyses
 */

const mongoose = require('mongoose');

const soilAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  analysisType: {
    type: String,
    enum: ['observation-based', 'lab-based'],
    required: true,
    default: 'observation-based'
  },
  
  // Farmer observations (for observation-based analysis)
  observations: {
    // Plant observations
    leafColor: String,
    oldLeafColor: String,
    leafEdges: String,
    plantGrowth: String,
    stemStrength: String,
    rootDevelopment: String,
    floweringFruiting: String,
    
    // Crop performance
    cropYield: String,
    diseaseResistance: String,
    droughtTolerance: String,
    
    // Soil physical properties
    soilColor: String,
    handFeel: String,
    crackingPattern: String,
    waterDrainage: String,
    crustingBehavior: String,
    
    // Environmental indicators
    weedTypes: String,
    
    // Optional additional notes
    additionalNotes: String
  },
  
  // Lab values (for lab-based analysis)
  labValues: {
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    pH: Number,
    ec: Number, // Electrical Conductivity
    organicCarbon: Number,
    sulfur: Number,
    zinc: Number,
    iron: Number,
    copper: Number,
    manganese: Number,
    boron: Number
  },
  
  // Analysis results
  results: {
    healthScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    healthClass: {
      type: String,
      enum: ['GOOD', 'MEDIUM', 'POOR'],
      required: true
    },
    nitrogenLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
    },
    phosphorusLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
    },
    potassiumLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
    },
    phCategory: {
      type: String,
      enum: ['ACIDIC', 'NEUTRAL', 'ALKALINE']
    },
    phValue: Number,
    texture: {
      type: String,
      enum: ['SANDY', 'CLAY', 'LOAM', 'SANDY_LOAM', 'SILTY']
    },
    organicMatter: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
    },
    waterCapacity: String,
    irrigationNeeds: String
  },
  
  // Recommendations
  recommendations: {
    fertilizers: [{
      type: {
        type: String
      },
      priority: String,
      options: [{
        name: String,
        quantity: String,
        timing: String,
        cost: String
      }]
    }],
    
    crops: {
      highlyRecommended: [{
        name: String,
        reason: String,
        season: String
      }],
      recommended: [{
        name: String,
        reason: String,
        season: String
      }],
      possibleWithCare: [{
        name: String,
        reason: String,
        season: String
      }],
      notRecommended: [{
        name: String,
        reason: String
      }]
    },
    
    improvementPlan: {
      immediate: [{
        action: String,
        description: String,
        timeframe: String
      }],
      shortTerm: [{
        action: String,
        description: String,
        timeframe: String,
        benefit: String
      }],
      longTerm: [{
        action: String,
        description: String,
        timeframe: String,
        benefit: String
      }]
    }
  },
  
  // Detected deficiencies
  deficiencies: [{
    nutrient: String,
    severity: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
    },
    symptoms: [String],
    impact: String
  }],
  
  // Location data (optional)
  location: {
    latitude: Number,
    longitude: Number,
    district: String,
    state: String
  },
  
  // Field information
  fieldInfo: {
    fieldSize: Number, // in acres
    cropType: String,
    lastCropYield: Number,
    previousCrop: String,
    soilTestDate: Date
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
soilAnalysisSchema.index({ userId: 1, createdAt: -1 });
soilAnalysisSchema.index({ 'results.healthScore': 1 });
soilAnalysisSchema.index({ analysisType: 1 });

// Virtual for summary text
soilAnalysisSchema.virtual('summary').get(function() {
  const score = this.results.healthScore;
  const health = this.results.healthClass;
  const defCount = this.deficiencies ? this.deficiencies.length : 0;
  
  let text = '';
  if (health === 'GOOD') {
    text = `Excellent soil health (${score}/100)`;
  } else if (health === 'MEDIUM') {
    text = `Moderate soil health (${score}/100) with ${defCount} deficiencies`;
  } else {
    text = `Poor soil health (${score}/100) with ${defCount} deficiencies`;
  }
  
  return text;
});

// Method to get simplified results for listing
soilAnalysisSchema.methods.getSimplified = function() {
  return {
    id: this._id,
    date: this.createdAt,
    healthScore: this.results.healthScore,
    healthClass: this.results.healthClass,
    analysisType: this.analysisType,
    deficiencyCount: this.deficiencies.length,
    topRecommendedCrops: this.recommendations.crops.highlyRecommended.slice(0, 3).map(c => c.name)
  };
};

module.exports = mongoose.model('SoilAnalysis', soilAnalysisSchema);