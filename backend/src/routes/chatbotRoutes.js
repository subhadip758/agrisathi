const express = require('express');
const router = express.Router();

// Import controllers
const {
  sendMessage,
  sendMessageWithImage,
  uploadMiddleware, 
  createSession,
  getChatHistory,
  getChatSession,
  getActiveSessions,
  updateSessionContext,
  endSession,
  addMessageFeedback,
  escalateToExpert,
  resolveEscalation,
  getChatStats,
  getPopularTopics,
  getEscalatedChats,
  deleteChatSession,
  clearChatHistory,
  getFAQs
} = require('../controllers/chatbotController');

// Import middleware
const { protect } = require('../middleware/authMiddleware');
const { chatbotLimiter } = require('../middleware/rateLimiter');
const { validateRequest } = require('../utils/validators');
const { chatbotMessageSchema } = require('../utils/validators');

// ====================
// PUBLIC ROUTES
// ====================

router.get('/popular-topics', getPopularTopics);
router.get('/faqs', getFAQs);

// ====================
// PROTECTED ROUTES (Require Authentication)
// ====================

router.use(protect);

router.post('/session', createSession);

router.post(
  '/message',
  chatbotLimiter,
  validateRequest(chatbotMessageSchema),
  sendMessage
);

router.get('/history', getChatHistory);
router.get('/sessions/active', getActiveSessions);
router.get('/stats', getChatStats);
router.get('/session/:sessionId', getChatSession);
router.put('/session/:sessionId/context', updateSessionContext);
router.post('/session/:sessionId/end', endSession);
router.post('/session/:sessionId/feedback', addMessageFeedback);
router.post('/session/:sessionId/escalate', escalateToExpert);
router.post('/session/:sessionId/resolve', resolveEscalation);

router.post('/message-with-image', protect, uploadMiddleware, sendMessageWithImage);

router.get('/escalated', getEscalatedChats);
router.delete('/session/:sessionId', deleteChatSession);

// Support both /history/clear and /history for clear history
router.delete('/history/clear', clearChatHistory);
router.delete('/history', clearChatHistory);

module.exports = router;