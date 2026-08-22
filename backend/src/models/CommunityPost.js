const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorRole: {
    type: String,
    default: 'Farmer',
  },
  authorAvatar: {
    type: String,
    default: '',
  },
  authorLocation: {
    type: String,
    default: 'West Bengal, India',
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    required: true,
  },
  postType: {
    type: String,
    enum: ['text', 'image', 'voice', 'multimodal'],
    default: 'text',
  },
  images: [{
    type: String,
  }],
  voiceUrl: {
    type: String,
    default: '',
  },
  cropTag: {
    type: String,
    default: 'General Agriculture',
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  dislikesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'reported', 'removed'],
    default: 'active',
  },
}, { timestamps: true });

communityPostSchema.index({ createdAt: -1, status: 1 });
communityPostSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('CommunityPost', communityPostSchema);
