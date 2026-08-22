const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/feed', optionalAuth, communityController.getFeed);
router.post('/posts', optionalAuth, communityController.createPost);
router.post('/posts/:id/react', optionalAuth, communityController.reactToPost);
router.get('/posts/:id/comments', optionalAuth, communityController.getComments);
router.post('/posts/:id/comments', optionalAuth, communityController.addComment);
router.post('/comments/:commentId/react', optionalAuth, communityController.reactToComment);
router.delete('/posts/:id', optionalAuth, communityController.deletePost);
router.get('/profile/:userId?', optionalAuth, communityController.getUserProfile);
router.put('/profile', optionalAuth, communityController.updateUserProfile);
router.post('/reports', optionalAuth, communityController.submitReport);

module.exports = router;
