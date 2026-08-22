const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const CommunityMessage = require('../models/CommunityMessage');
const User = require('../models/User');

const memoryConversations = [];
const memoryMessages = [];

// ── GET User Conversations ───────────────────────────────────────────────────
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user?._id || '650000000000000000000001';
    let conversations = [];

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      conversations = await Conversation.find({ participants: userId })
        .populate('participants', 'name email profileImage role farmDetails')
        .sort({ lastMessageAt: -1 });
    }

    if (conversations.length === 0) {
      conversations = memoryConversations.filter(c => c.participants.some(p => String(p._id || p) === String(userId)));
    }

    res.json({ success: true, count: conversations.length, data: conversations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── GET Messages in Conversation (With Authorization Check) ─────────────────
exports.getMessages = async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const userId = req.user?._id || '650000000000000000000001';

    let conversation = null;
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      conversation = await Conversation.findById(conversationId);
      if (conversation && !conversation.participants.some(p => String(p) === String(userId))) {
        return res.status(403).json({ success: false, error: 'Access Denied: You are not a participant in this private conversation' });
      }
    }

    let messages = [];
    if (mongoose.connection && mongoose.connection.readyState === 1) {
      messages = await CommunityMessage.find({ conversation: conversationId }).sort({ createdAt: 1 });
    }

    if (messages.length === 0) {
      messages = memoryMessages.filter(m => String(m.conversation) === String(conversationId));
    }

    res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── SEND Message (Creates Conversation if needed & saves to MongoDB) ─────────
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text, images, voiceUrl } = req.body;
    const senderId = req.user?._id || '650000000000000000000001';
    const senderName = req.user?.name || 'Farmer';

    if (!recipientId) {
      return res.status(400).json({ success: false, error: 'Recipient user ID is required' });
    }
    if (!text && (!images || images.length === 0) && !voiceUrl) {
      return res.status(400).json({ success: false, error: 'Message text, image, or voice recording is required' });
    }

    let conversation = null;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, recipientId] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, recipientId],
          lastMessage: text || (voiceUrl ? '🎤 Voice message' : '📷 Image'),
          lastMessageAt: new Date(),
          lastMessageSender: senderId,
        });
      } else {
        conversation.lastMessage = text || (voiceUrl ? '🎤 Voice message' : '📷 Image');
        conversation.lastMessageAt = new Date();
        conversation.lastMessageSender = senderId;
        await conversation.save();
      }
    } else {
      const convId = `CONV-${senderId}-${recipientId}`;
      conversation = memoryConversations.find(c => c._id === convId);
      if (!conversation) {
        conversation = {
          _id: convId,
          participants: [{ _id: senderId, name: senderName }, { _id: recipientId, name: 'Farmer' }],
          lastMessage: text || 'Message',
          lastMessageAt: new Date(),
        };
        memoryConversations.push(conversation);
      }
    }

    const messageObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      conversation: conversation._id,
      sender: senderId,
      senderName,
      recipient: recipientId,
      text: text || '',
      images: images || [],
      voiceUrl: voiceUrl || '',
      read: false,
      createdAt: new Date(),
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      const doc = new CommunityMessage(messageObj);
      await doc.save();
    }

    memoryMessages.push(messageObj);

    res.status(201).json({
      success: true,
      message: 'Direct message sent successfully',
      data: messageObj,
      conversationId: conversation._id,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
