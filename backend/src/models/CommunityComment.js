const mongoose = require('mongoose');

const communityCommentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorAvatar: {
    type: String,
    default: '',
  },
  authorRole: {
    type: String,
    default: 'Farmer',
  },
  content: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  voiceUrl: {
    type: String,
    default: '',
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityComment',
    default: null,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

communityCommentSchema.index({ post: 1, parentComment: 1, createdAt: 1 });

module.exports = mongoose.model('CommunityComment', communityCommentSchema);
