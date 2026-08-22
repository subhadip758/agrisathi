const mongoose = require('mongoose');

const postReactionSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommunityPost',
    required: true,
  },
  userKey: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['like', 'dislike'],
    required: true,
  },
}, { timestamps: true });

postReactionSchema.index({ post: 1, userKey: 1 }, { unique: true });

module.exports = mongoose.model('PostReaction', postReactionSchema);
