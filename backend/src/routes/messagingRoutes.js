const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/conversations', optionalAuth, messagingController.getConversations);
router.get('/conversations/:conversationId', optionalAuth, messagingController.getMessages);
router.post('/messages', optionalAuth, messagingController.sendMessage);

module.exports = router;
