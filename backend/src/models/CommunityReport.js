const mongoose = require('mongoose');

const communityReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['post', 'comment', 'user', 'message'],
    required: true,
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'misinformation', 'fraud', 'inappropriate_content', 'fake_claims', 'other'],
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending Review', 'Under Review', 'Action Taken', 'Dismissed'],
    default: 'Pending Review',
  },
  adminNotes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

communityReportSchema.index({ targetType: 1, targetId: 1, status: 1 });

module.exports = mongoose.model('CommunityReport', communityReportSchema);
