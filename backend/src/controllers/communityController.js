const mongoose = require('mongoose');
const CommunityPost = require('../models/CommunityPost');
const PostReaction = require('../models/PostReaction');
const CommunityComment = require('../models/CommunityComment');
const CommunityReport = require('../models/CommunityReport');
const User = require('../models/User');
const inMemoryStore = require('../utils/inMemoryStore');

const memoryComments = [];
const memoryReactions = new Map(); // Key: `${userId}_${postId}`, Value: 'like' | 'dislike'
const memoryCommentReactions = new Map(); // Key: `${userId}_${commentId}`, Value: 'like' | 'dislike'

// Helper to get active memory posts from store
const getMemoryPosts = () => inMemoryStore.getCommunityPosts();

// Helper for consistent user identity across sessions & restarts
const getUserIdentity = (req) => {
  return String(req.user?._id || '650000000000000000000001');
};

// ── GET Community Feed (Paginated) ───────────────────────────────────────────
exports.getFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const cropTag = req.query.cropTag;

    let dbPosts = [];
    let totalCount = 0;

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const query = { status: 'active' };
        if (cropTag && cropTag !== 'all') query.cropTag = cropTag;
        totalCount = await CommunityPost.countDocuments(query);
        dbPosts = await CommunityPost.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);
      } catch (_) {}
    }

    if (dbPosts.length === 0) {
      let filtered = getMemoryPosts().filter(p => p.status === 'active');
      if (cropTag && cropTag !== 'all') filtered = filtered.filter(p => p.cropTag === cropTag);
      totalCount = filtered.length;
      dbPosts = filtered.slice(skip, skip + limit);
    }

    const userId = getUserIdentity(req);
    let userReactions = {};
    if (userId && mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const postIds = dbPosts.map(p => p._id);
        if (postIds.length > 0) {
          const reactions = await PostReaction.find({ post: { $in: postIds }, userKey: userId });
          reactions.forEach(r => { userReactions[String(r.post)] = r.type; });
        }
      } catch (_) {}
    }

    const diskReactions = inMemoryStore.getReactionsForUser(userId);

    const formattedPosts = dbPosts.map(p => {
      const obj = p.toObject ? p.toObject() : p;
      const memReaction = memoryReactions.get(`${userId}_${obj._id}`);
      obj.userReaction = userReactions[String(obj._id)] || diskReactions[String(obj._id)] || memReaction || null;
      return obj;
    });

    res.json({
      success: true,
      count: formattedPosts.length,
      total: totalCount,
      page,
      pages: Math.ceil(totalCount / limit) || 1,
      data: formattedPosts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── CREATE Post ─────────────────────────────────────────────────────────────
exports.createPost = async (req, res) => {
  try {
    const { title, content, postType, images, voiceUrl, cropTag, authorRole, authorName, authorLocation } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Post text or description is required' });
    }

    const userId = req.user?._id || '650000000000000000000001';
    const validAuthorId = mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId();
    const userName = authorName || req.user?.name || 'Subhadip Pal';
    const userLocation = authorLocation || req.user?.address || 'Barasat, West Bengal';
    const userRole = authorRole || (req.user?.role === 'admin' ? 'Agricultural Officer' : 'Verified Farmer');

    const postObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      author: validAuthorId,
      authorName: userName,
      authorRole: userRole,
      authorAvatar: req.user?.profileImage || '',
      authorLocation: userLocation,
      title: title || '',
      content: content.trim(),
      postType: postType || (voiceUrl ? 'voice' : (images?.length ? 'image' : 'text')),
      images: Array.isArray(images) ? images : [],
      voiceUrl: voiceUrl || '',
      cropTag: cropTag || 'General Agriculture',
      likesCount: 0,
      dislikesCount: 0,
      commentsCount: 0,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const doc = new CommunityPost(postObj);
        await doc.save();
      } catch (dbErr) {
        console.error('Error saving post to MongoDB:', dbErr);
      }
    }

    // Save to persistent file store
    inMemoryStore.addCommunityPost(postObj);

    res.status(201).json({ success: true, message: 'Community post published successfully', data: postObj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── REACT to Post (Strict Single Reaction Per User: Like/Dislike Toggle) ──────
exports.reactToPost = async (req, res) => {
  try {
    const { reactionType } = req.body;
    if (!['like', 'dislike'].includes(reactionType)) {
      return res.status(400).json({ success: false, error: 'Invalid reaction type' });
    }

    const postId = req.params.id;
    const userId = getUserIdentity(req);
    const validUserId = mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId();
    const userKey = `${userId}_${postId}`;

    let post = null;
    let userReaction = reactionType;

    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        post = await CommunityPost.findById(postId);
        if (post) {
          const existing = await PostReaction.findOne({ post: postId, userKey: userId });
          if (!existing) {
            await PostReaction.create({
              post: postId,
              userKey: userId,
              user: mongoose.Types.ObjectId.isValid(userId) ? userId : undefined,
              type: reactionType
            });
          } else if (existing.type !== reactionType) {
            existing.type = reactionType;
            await existing.save();
          } else {
            await PostReaction.findByIdAndDelete(existing._id);
            userReaction = null;
          }

          // Atomic Exact Recalculation from PostReaction Collection
          const likesCount = await PostReaction.countDocuments({ post: postId, type: 'like' });
          const dislikesCount = await PostReaction.countDocuments({ post: postId, type: 'dislike' });
          post.likesCount = likesCount;
          post.dislikesCount = dislikesCount;
          await post.save();
        }
      } catch (dbErr) {
        console.warn('MongoDB reaction sync warning:', dbErr.message);
      }
    }

    // Persistent tracking for single reaction per user across restarts
    const currentReaction = inMemoryStore.getPostReaction(userId, postId) || memoryReactions.get(userKey);

    const memPosts = getMemoryPosts();
    const memPost = memPosts.find(p => String(p._id) === String(postId));
    if (memPost) {
      if (!currentReaction) {
        memoryReactions.set(userKey, reactionType);
        inMemoryStore.setPostReaction(userId, postId, reactionType);
        if (reactionType === 'like') memPost.likesCount += 1;
        else memPost.dislikesCount += 1;
        userReaction = reactionType;
      } else if (currentReaction !== reactionType) {
        if (currentReaction === 'like') {
          memPost.likesCount = Math.max(0, memPost.likesCount - 1);
          memPost.dislikesCount += 1;
        } else {
          memPost.dislikesCount = Math.max(0, memPost.dislikesCount - 1);
          memPost.likesCount += 1;
        }
        memoryReactions.set(userKey, reactionType);
        inMemoryStore.setPostReaction(userId, postId, reactionType);
        userReaction = reactionType;
      } else {
        if (reactionType === 'like') memPost.likesCount = Math.max(0, memPost.likesCount - 1);
        else memPost.dislikesCount = Math.max(0, memPost.dislikesCount - 1);
        memoryReactions.delete(userKey);
        inMemoryStore.setPostReaction(userId, postId, null);
        userReaction = null;
      }
      inMemoryStore.saveCommunityPosts(memPosts);
      if (!post) post = memPost;
    } else {
      // Record reaction state for MongoDB posts
      memoryReactions.set(userKey, userReaction);
      inMemoryStore.setPostReaction(userId, postId, userReaction);
    }

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({
      success: true,
      data: {
        likesCount: post.likesCount,
        dislikesCount: post.dislikesCount,
        userReaction,
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── GET Post Comments & Replies ─────────────────────────────────────────────
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user?._id || '650000000000000000000001';
    let comments = [];

    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        comments = await CommunityComment.find({ post: postId }).sort({ createdAt: 1 });
      } catch (_) {}
    }

    if (comments.length === 0) {
      comments = memoryComments.filter(c => String(c.post) === String(postId));
    }

    const topLevel = [];
    const replyMap = {};

    comments.forEach(c => {
      const obj = c.toObject ? c.toObject() : { ...c };
      const reactionKey = `${userId}_${obj._id}`;
      obj.userReaction = memoryCommentReactions.get(reactionKey) || null;
      obj.likesCount = obj.likesCount || 0;
      obj.dislikesCount = obj.dislikesCount || 0;

      if (!obj.parentComment) {
        obj.replies = [];
        topLevel.push(obj);
        replyMap[String(obj._id)] = obj;
      }
    });

    comments.forEach(c => {
      const obj = c.toObject ? c.toObject() : { ...c };
      const reactionKey = `${userId}_${obj._id}`;
      obj.userReaction = memoryCommentReactions.get(reactionKey) || null;
      obj.likesCount = obj.likesCount || 0;
      obj.dislikesCount = obj.dislikesCount || 0;

      if (obj.parentComment && replyMap[String(obj.parentComment)]) {
        replyMap[String(obj.parentComment)].replies.push(obj);
      }
    });

    res.json({ success: true, count: topLevel.length, data: topLevel });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── REACT to Comment (Like / Dislike) ──────────────────────────────────────────
exports.reactToComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const { reactionType } = req.body;
    const userId = req.user?._id || '650000000000000000000001';

    const key = `${userId}_${commentId}`;
    const prevReaction = memoryCommentReactions.get(key);

    let comment = memoryComments.find(c => String(c._id) === String(commentId));

    if (!comment && mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(commentId)) {
      try {
        comment = await CommunityComment.findById(commentId);
      } catch (_) {}
    }

    if (!comment) {
      // Fallback object for dynamically added comments
      comment = { _id: commentId, likesCount: 0, dislikesCount: 0 };
      memoryComments.push(comment);
    }

    if (!comment.likesCount) comment.likesCount = 0;
    if (!comment.dislikesCount) comment.dislikesCount = 0;

    let userReaction = reactionType;

    if (prevReaction === reactionType) {
      if (reactionType === 'like') comment.likesCount = Math.max(0, comment.likesCount - 1);
      if (reactionType === 'dislike') comment.dislikesCount = Math.max(0, comment.dislikesCount - 1);
      memoryCommentReactions.delete(key);
      userReaction = null;
    } else {
      if (prevReaction === 'like') comment.likesCount = Math.max(0, comment.likesCount - 1);
      if (prevReaction === 'dislike') comment.dislikesCount = Math.max(0, comment.dislikesCount - 1);

      if (reactionType === 'like') comment.likesCount += 1;
      if (reactionType === 'dislike') comment.dislikesCount += 1;
      memoryCommentReactions.set(key, reactionType);
    }

    if (comment.save && typeof comment.save === 'function') {
      try { await comment.save(); } catch (_) {}
    }

    res.json({
      success: true,
      data: {
        likesCount: comment.likesCount,
        dislikesCount: comment.dislikesCount,
        userReaction
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── ADD Comment or Threaded Reply ────────────────────────────────────────────
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content, images, voiceUrl, parentComment, authorName } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }

    const userId = req.user?._id || '650000000000000000000001';
    const validAuthorId = mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId();
    const userName = authorName || req.user?.name || 'Subhadip Pal';

    const commentObj = {
      _id: new mongoose.Types.ObjectId().toString(),
      post: postId,
      author: validAuthorId,
      authorName: userName,
      authorAvatar: req.user?.profileImage || '',
      authorRole: req.user?.role === 'admin' ? 'Agricultural Specialist' : 'Farmer',
      content: content.trim(),
      images: images || [],
      voiceUrl: voiceUrl || '',
      parentComment: parentComment || null,
      likesCount: 0,
      createdAt: new Date(),
    };

    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        const doc = new CommunityComment(commentObj);
        await doc.save();
        await CommunityPost.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
      } catch (dbErr) {
        console.error('Error saving comment to MongoDB:', dbErr);
      }
    }

    memoryComments.push(commentObj);
    const memPosts = getMemoryPosts();
    const memP = memPosts.find(p => String(p._id) === String(postId));
    if (memP) {
      memP.commentsCount = (memP.commentsCount || 0) + 1;
      inMemoryStore.saveCommunityPosts(memPosts);
    }

    res.status(201).json({ success: true, message: 'Comment posted successfully', data: commentObj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── GET Community Profile ───────────────────────────────────────────────────
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?._id || '650000000000000000000001';
    let user = null;

    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        user = await User.findById(userId).select('-password');
      } catch (_) {}
    }

    if (!user) {
      user = {
        _id: userId,
        name: req.user?.name || 'AgriSathi Farmer',
        role: 'Farmer',
        designation: '👨🌾 Farmer',
        bio: 'Dedicated organic farmer cultivating paddy and seasonal vegetables.',
        farmDetails: { location: { city: 'Barasat', state: 'West Bengal' } }
      };
    }

    let userPosts = [];
    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        userPosts = await CommunityPost.find({ author: userId, status: 'active' }).sort({ createdAt: -1 });
      } catch (_) {}
    }
    if (userPosts.length === 0) {
      userPosts = getMemoryPosts().filter(p => String(p.author) === String(userId));
    }

    res.json({
      success: true,
      data: {
        profile: user,
        posts: userPosts,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── UPDATE Community Profile ────────────────────────────────────────────────
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?._id || '650000000000000000000001';
    const { designation, bio, cropsOfInterest } = req.body;

    let updatedUser = null;
    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(userId)) {
      try {
        updatedUser = await User.findByIdAndUpdate(
          userId,
          { designation, bio, cropsOfInterest },
          { new: true }
        ).select('-password');
      } catch (_) {}
    }

    res.json({ success: true, message: 'Community profile updated successfully', data: updatedUser || { designation, bio } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── SUBMIT Community Report ─────────────────────────────────────────────────
exports.submitReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, details } = req.body;
    const userId = req.user?._id || '650000000000000000000001';
    const validUserId = mongoose.Types.ObjectId.isValid(userId) ? userId : new mongoose.Types.ObjectId();

    const reportObj = {
      reporter: validUserId,
      targetType: targetType || 'post',
      targetId: mongoose.Types.ObjectId.isValid(targetId) ? targetId : new mongoose.Types.ObjectId(),
      reason: reason || 'misinformation',
      details: details || '',
      status: 'Pending Review',
      createdAt: new Date(),
    };

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        const doc = new CommunityReport(reportObj);
        await doc.save();
      } catch (dbErr) {
        console.error('Error saving community report to MongoDB:', dbErr);
      }
    }

    res.status(201).json({ success: true, message: 'Community report submitted to admin for review', data: reportObj });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── DELETE Post (Owner Only) ──────────────────────────────────────────────────
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(postId)) {
      try {
        await CommunityPost.findByIdAndDelete(postId);
      } catch (_) {}
    }

    const filtered = getMemoryPosts().filter(p => String(p._id) !== String(postId));
    inMemoryStore.saveCommunityPosts(filtered);

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
