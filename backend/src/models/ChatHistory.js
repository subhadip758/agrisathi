const mongoose = require('mongoose');

const entitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
  confidence: { type: Number, required: true }
}, { _id: false });

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    index: true,
    default: function() {
      return `CHAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  },
  messages: {
    type: [{
      role: {
        type: String,
        enum: ['user', 'assistant', 'system'],
        required: true
      },
      content: {
        type: String,
        required: true,
        maxlength: 5000
      },
      timestamp: {
        type: Date,
        default: Date.now,
        required: true
      },
      metadata: {
        tokens: Number,
        model: String,
        processingTime: Number,
        confidence: Number
      },
      attachments: [{
        type: {
          type: String,
          enum: ['image', 'document', 'link']
        },
        url: String,
        filename: String,
        size: Number
      }],
      intent: {
        type: String,
        enum: [
          'crop-recommendation',
          'disease-identification',
          'pest-control',
          'soil-analysis',
          'irrigation-advice',
          'fertilizer-recommendation',
          'weather-query',
          'market-price',
          'general-query',
          'troubleshooting',
          'best-practices',
          'yield-optimization',
          'other'
        ]
      },
      entities: [entitySchema],
      feedback: {
        rating: { type: Number, min: 1, max: 5 },
        helpful: Boolean,
        comment: String,
        submittedAt: Date
      }
    }],
    default: []   // 🔥 THIS LINE FIXES EVERYTHING
  },  
  context: {
    cropType: String,
    farmLocation: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    season: String,
    currentIssues: [String],
    preferences: {
      language: {
        type: String,
        default: 'en'
      },
      detailLevel: {
        type: String,
        enum: ['brief', 'moderate', 'detailed'],
        default: 'moderate'
      }
    }
  },
  summary: {
    mainTopic: String,
    keyPoints: [String],
    actionItems: [String],
    recommendations: [String]
  },
  sessionMetadata: {
    startTime: {
      type: Date,
      default: Date.now
    },
    endTime: Date,
    duration: Number,
    messageCount: {
      type: Number,
      default: 0
    },
    totalTokens: {
      type: Number,
      default: 0
    },
    averageResponseTime: Number,
    deviceInfo: {
      type: String,
      userAgent: String,
      platform: String
    }
  },
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    resolved: {
      type: Boolean,
      default: false
    },
    comment: String,
    submittedAt: Date
  },
  tags: [String],
  category: {
    type: String,
    enum: [
      'technical-support',
      'crop-guidance',
      'pest-disease',
      'soil-water',
      'market-info',
      'general-inquiry',
      'complaint',
      'feedback'
    ],
    default: 'general-inquiry'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'escalated', 'archived'],
    default: 'active'
  },
  escalation: {
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    escalatedAt: Date,
    reason: String,
    resolution: String,
    resolvedAt: Date
  },
  relatedRecords: {
    cropRecommendations: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CropRecommendation'
    }],
    diseaseDetections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiseaseDetection'
    }],
    soilAnalyses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SoilAnalysis'
    }]
  },
  isPublic: {
    type: Boolean,
    default: false
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
chatHistorySchema.index({ user: 1, createdAt: -1 });
chatHistorySchema.index({ sessionId: 1 });
chatHistorySchema.index({ status: 1 });
chatHistorySchema.index({ category: 1 });
chatHistorySchema.index({ 'messages.intent': 1 });
chatHistorySchema.index({ createdAt: -1 });

// Virtual for session duration in minutes
chatHistorySchema.virtual('durationInMinutes').get(function() {
  if (!this.sessionMetadata.duration) return 0;
  return (this.sessionMetadata.duration / 60).toFixed(2);
});

// Virtual for last message
chatHistorySchema.virtual('lastMessage').get(function() {
  if (!this.messages || this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Virtual for user messages count
chatHistorySchema.virtual('userMessageCount').get(function() {
  if (!this.messages) return 0;
  return Array.isArray(this.messages)
  ? this.messages.filter(msg => msg.role === 'user').length
  : 0;
});

// Virtual for assistant messages count
chatHistorySchema.virtual('assistantMessageCount').get(function() {
  if (!this.messages) return 0;
  return this.messages.filter(msg => msg.role === 'assistant').length;
});

// Virtual for average satisfaction rating
chatHistorySchema.virtual('averageMessageRating').get(function() {
  const ratedMessages = this.messages.filter(msg => msg.feedback && msg.feedback.rating);
  if (ratedMessages.length === 0) return null;
  
  const sum = ratedMessages.reduce((acc, msg) => acc + msg.feedback.rating, 0);
  return (sum / ratedMessages.length).toFixed(2);
});

// Pre-save middleware to update session metadata
chatHistorySchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.sessionMetadata.messageCount = this.messages.length;
    
    const totalTokens = this.messages.reduce((sum, msg) => {
      return sum + (msg.metadata?.tokens || 0);
    }, 0);
    this.sessionMetadata.totalTokens = totalTokens;
    
    const assistantMessages = this.messages.filter(msg => 
      msg.role === 'assistant' && msg.metadata?.processingTime
    );
    
    if (assistantMessages.length > 0) {
      const totalTime = assistantMessages.reduce((sum, msg) => 
        sum + msg.metadata.processingTime, 0
      );
      this.sessionMetadata.averageResponseTime = Math.round(totalTime / assistantMessages.length);
    }
    
    if (this.status === 'resolved' || this.status === 'archived') {
      if (!this.sessionMetadata.endTime) {
        this.sessionMetadata.endTime = Date.now();
        const start = new Date(this.sessionMetadata.startTime).getTime();
        const end = this.sessionMetadata.endTime.getTime();
        this.sessionMetadata.duration = Math.round((end - start) / 1000);
      }
    }
  }
  
  next();
});

// Method to add message - FIXED to handle optional intent
chatHistorySchema.methods.addMessage = function(role, content, metadata = {}, intent, entities = []) {
  const message = {
    role,
    content,
    timestamp: Date.now(),
    metadata,
    entities
  };
  
  // Only add intent if it's provided and not null/undefined
  if (intent) {
    message.intent = intent;
  }
  
  if (!Array.isArray(this.messages)) {
    this.messages = [];
  }
  
  this.messages.push(message);  
  return this.save();
};

// Method to add feedback to message
chatHistorySchema.methods.addMessageFeedback = function(messageIndex, rating, helpful, comment) {
  if (this.messages[messageIndex]) {
    this.messages[messageIndex].feedback = {
      rating,
      helpful,
      comment,
      submittedAt: Date.now()
    };
  }
  return this.save();
};

// Method to end session
chatHistorySchema.methods.endSession = function(rating = null, resolved = false, comment = null) {
  this.sessionMetadata.endTime = Date.now();
  
  const start = new Date(this.sessionMetadata.startTime).getTime();
  const end = this.sessionMetadata.endTime.getTime();
  this.sessionMetadata.duration = Math.round((end - start) / 1000);
  
  if (rating || resolved || comment) {
    this.satisfaction = {
      rating,
      resolved,
      comment,
      submittedAt: Date.now()
    };
  }
  
  this.status = resolved ? 'resolved' : 'active';
  
  return this.save();
};

// Method to escalate to expert
chatHistorySchema.methods.escalate = function(expertId, reason) {
  this.escalation = {
    isEscalated: true,
    escalatedTo: expertId,
    escalatedAt: Date.now(),
    reason
  };
  this.status = 'escalated';
  this.priority = 'high';
  
  return this.save();
};

// Method to resolve escalation
chatHistorySchema.methods.resolveEscalation = function(resolution) {
  if (this.escalation) {
    this.escalation.resolution = resolution;
    this.escalation.resolvedAt = Date.now();
  }
  this.status = 'resolved';
  
  return this.save();
};

// Method to generate summary
chatHistorySchema.methods.generateSummary = function() {
  const intents = [...new Set(this.messages
    .filter(msg => msg.intent)
    .map(msg => msg.intent))];
  
  const entities = this.messages
    .flatMap(msg => msg.entities || [])
    .filter((entity, index, self) => 
      index === self.findIndex(e => e.type === entity.type && e.value === entity.value)
    );
  
  this.summary = {
    mainTopic: intents[0] || 'general-inquiry',
    keyPoints: intents,
    actionItems: [],
    recommendations: []
  };
  
  return this.save();
};

// Static method to get user's chat history
chatHistorySchema.statics.getUserChatHistory = async function(userId, limit = 20) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('sessionId category status satisfaction.rating sessionMetadata.messageCount createdAt');
};

// Static method to get active sessions
chatHistorySchema.statics.getActiveSessions = async function(userId) {
  return this.find({ user: userId, status: 'active' })
    .sort({ updatedAt: -1 });
};

// Static method to get chat statistics - FIXED
chatHistorySchema.statics.getChatStats = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  // Use new keyword for newer mongoose versions
  const ObjectId = mongoose.Types.ObjectId;
  
  return this.aggregate([
    {
      $match: {
        user: new ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalChats: { $sum: 1 },
        totalMessages: { $sum: '$sessionMetadata.messageCount' },
        avgMessagesPerChat: { $avg: '$sessionMetadata.messageCount' },
        avgDuration: { $avg: '$sessionMetadata.duration' },
        resolvedChats: {
          $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
        },
        avgSatisfaction: { $avg: '$satisfaction.rating' }
      }
    }
  ]);
};

// Static method to get popular topics
chatHistorySchema.statics.getPopularTopics = async function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    { $unwind: '$messages' },
    { $match: { 'messages.intent': { $exists: true, $ne: null } } },
    {
      $group: {
        _id: '$messages.intent',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
};

// Static method to get escalated chats
chatHistorySchema.statics.getEscalatedChats = async function() {
  return this.find({ 'escalation.isEscalated': true, status: 'escalated' })
    .populate('user', 'name email phone')
    .populate('escalation.escalatedTo', 'name email')
    .sort({ 'escalation.escalatedAt': -1 });
};

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

module.exports = ChatHistory;