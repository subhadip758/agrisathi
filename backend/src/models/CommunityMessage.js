const mongoose = require('mongoose');

const communityMessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    default: '',
  },
  images: [{
    type: String,
  }],
  voiceUrl: {
    type: String,
    default: '',
  },
  read: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

communityMessageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model('CommunityMessage', communityMessageSchema);
