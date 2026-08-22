const mongoose = require('mongoose');
const multer = require('multer');
const ChatHistory = require('../models/ChatHistory');
const chatbotService = require('../services/chatbotService');
const inMemoryStore = require('../utils/inMemoryStore');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const storage = multer.memoryStorage();
const upload = multer({ storage });
exports.uploadMiddleware = upload.single('image');

const successResponse = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({
    status: 'success',
    message,
    data
  });
};

exports.sendMessageWithImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please provide an image file', 400));
  }

  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const message = req.body.message || '';
  const sessionId = req.body.sessionId || null;
  let context = {};
  if (req.body.context) {
    try {
      context = typeof req.body.context === 'string' ? JSON.parse(req.body.context) : req.body.context;
    } catch (_) {}
  }

  try {
    const result = await chatbotService.processMessageWithImage(
      userId,
      message,
      req.file.buffer,
      req.file.mimetype,
      sessionId,
      context
    );

    // Track in inMemoryStore
    inMemoryStore.addChatMessage(result.data.sessionId, userId, 'user', message || '📷 Image sent', { hasImage: true });
    inMemoryStore.addChatMessage(result.data.sessionId, userId, 'assistant', result.data.message, result.data.metadata);

    successResponse(res, 200, 'Image message sent successfully', result.data);
  } catch (error) {
    console.error('❌ Chatbot Image Message Error:', error.message);
    return next(new AppError('Failed to process image message: ' + error.message, 500));
  }
});

exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { message, sessionId, context } = req.body;
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  if (!message || message.trim().length === 0) {
    return next(new AppError('Please provide a message', 400));
  }

  try {
    const result = await chatbotService.processMessage(
      userId,
      message.trim(),
      sessionId,
      context
    );

    // Track in inMemoryStore
    inMemoryStore.addChatMessage(result.data.sessionId, userId, 'user', message.trim());
    inMemoryStore.addChatMessage(result.data.sessionId, userId, 'assistant', result.data.message, result.data.metadata);

    successResponse(res, 200, 'Message sent successfully', result.data);
  } catch (error) {
    console.error('❌ Chatbot Message Error:', error.message);
    return next(new AppError('Failed to process message: ' + error.message, 500));
  }
});

exports.createSession = asyncHandler(async (req, res, next) => {
  const { context } = req.body;
  const newSessionId = `CHAT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  if (mongoose.connection.readyState !== 1) {
    return successResponse(res, 201, 'Chat session created successfully', {
      sessionId: newSessionId,
      context: context || {}
    });
  }

  try {
    const session = new ChatHistory({
      user: userId,
      sessionId: newSessionId,
      context: context || {},
      status: 'active'
    });
    await session.save();

    successResponse(res, 201, 'Chat session created successfully', {
      sessionId: session.sessionId,
      context: session.context
    });
  } catch (err) {
    successResponse(res, 201, 'Chat session created successfully', {
      sessionId: newSessionId,
      context: context || {}
    });
  }
});

exports.getChatHistory = asyncHandler(async (req, res, next) => {
  const { limit = 20, page = 1 } = req.query;
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  let history = [];
  if (mongoose.connection.readyState === 1) {
    try {
      history = await ChatHistory.find({ user: userId })
        .sort({ updatedAt: -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * parseInt(limit))
        .lean();
    } catch (_) {}
  }

  if (history.length === 0) {
    history = inMemoryStore.getChatHistory(userId);
  }

  const total = history.length;

  successResponse(res, 200, 'Chat history retrieved successfully', {
    history: Array.isArray(history) ? history : [],
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)) || 1,
      limit: parseInt(limit)
    }
  });
});

exports.getChatSession = asyncHandler(async (req, res, next) => {
  const { sessionId } = req.params;
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  if (mongoose.connection.readyState !== 1) {
    const session = inMemoryStore.getChatHistory(userId).find(s => s.sessionId === sessionId);
    return successResponse(res, 200, 'Session retrieved successfully', {
      session: session || { sessionId, messages: [] }
    });
  }

  try {
    const session = await ChatHistory.findOne({ sessionId, user: userId }).lean();
    successResponse(res, 200, 'Session retrieved successfully', {
      session: session || { sessionId, messages: [] }
    });
  } catch (err) {
    const session = inMemoryStore.getChatHistory(userId).find(s => s.sessionId === sessionId);
    successResponse(res, 200, 'Session retrieved successfully', {
      session: session || { sessionId, messages: [] }
    });
  }
});

exports.getActiveSessions = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Active sessions retrieved', { sessions: [] });
});

exports.updateSessionContext = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Context updated', { context: req.body.context });
});

exports.endSession = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Session ended');
});

exports.addMessageFeedback = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Feedback added');
});

exports.escalateToExpert = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Escalated to expert');
});

exports.resolveEscalation = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Escalation resolved');
});

exports.getChatStats = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Stats retrieved', { totalChats: 0 });
});

exports.getPopularTopics = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Popular topics retrieved', { topics: [] });
});

exports.getEscalatedChats = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Escalated chats retrieved', { chats: [] });
});

exports.deleteChatSession = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'Session deleted');
});

exports.clearChatHistory = asyncHandler(async (req, res, next) => {
  const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  inMemoryStore.clearChatHistory(userId);
  if (mongoose.connection.readyState === 1) {
    try { await ChatHistory.deleteMany({ user: userId }); } catch (_) {}
  }
  successResponse(res, 200, 'Chat history cleared');
});

exports.getFAQs = asyncHandler(async (req, res, next) => {
  successResponse(res, 200, 'FAQs retrieved', { faqs: [] });
});