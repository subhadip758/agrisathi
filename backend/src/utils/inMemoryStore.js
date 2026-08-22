const fs = require('fs');
const path = require('path');

const DISEASE_STORE_FILE = path.join(__dirname, '../data/diseaseStore.json');
const COMMUNITY_STORE_FILE = path.join(__dirname, '../data/communityStore.json');
const REACTIONS_STORE_FILE = path.join(__dirname, '../data/reactionsStore.json');

// Helpers for JSON Disk Persistence
const loadJsonFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data) || (filePath.includes('reactionsStore') ? {} : []);
    }
  } catch (err) {
    console.error(`Error loading ${filePath}:`, err.message);
  }
  return filePath.includes('reactionsStore') ? {} : [];
};

const saveJsonFile = (filePath, data) => {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err.message);
  }
};

class InMemoryStore {
  constructor() {
    this.soilAnalyses = [];
    this.waterSources = [];
    this.irrigationSchedules = [];
    this.diseaseDetections = loadJsonFile(DISEASE_STORE_FILE);
    this.communityPosts = loadJsonFile(COMMUNITY_STORE_FILE);
    this.postReactions = loadJsonFile(REACTIONS_STORE_FILE); // Key: `${userId}_${postId}`, Value: 'like' | 'dislike'
    this.chatSessions = new Map();
  }

  // Helper to match userId
  matchesUser(record, userId) {
    if (!userId || !record) return false;
    const target = String(userId);
    const u1 = record.userId ? String(record.userId) : null;
    const u2 = record.user ? String(record.user) : null;
    const u3 = record.farmerId ? String(record.farmerId) : null;
    return u1 === target || u2 === target || u3 === target;
  }

  // ─── Soil Store ─────────────────────────────────────────────────────────────
  addSoilAnalysis(data) {
    const record = {
      _id: data._id || `SOIL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date(),
      ...data
    };
    this.soilAnalyses.unshift(record);
    return record;
  }

  getSoilAnalyses(userId) {
    return this.soilAnalyses.filter(r => this.matchesUser(r, userId));
  }

  getLatestSoil(userId) {
    const list = this.getSoilAnalyses(userId);
    return list.length > 0 ? list[0] : null;
  }

  // ─── Water Store ────────────────────────────────────────────────────────────
  addWaterSource(data) {
    const record = {
      _id: data._id || `WS-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date(),
      ...data
    };
    this.waterSources.unshift(record);
    return record;
  }

  getWaterSources(userId) {
    return this.waterSources.filter(r => this.matchesUser(r, userId));
  }

  getLatestWater(userId) {
    const list = this.getWaterSources(userId);
    return list.length > 0 ? list[0] : null;
  }

  // ─── Irrigation Store ───────────────────────────────────────────────────────
  addIrrigationSchedule(data) {
    const record = {
      _id: data._id || `IRR-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date(),
      ...data
    };
    this.irrigationSchedules.unshift(record);
    return record;
  }

  getIrrigationSchedules(userId) {
    return this.irrigationSchedules.filter(r => this.matchesUser(r, userId));
  }

  getLatestIrrigation(userId) {
    const list = this.getIrrigationSchedules(userId);
    return list.length > 0 ? list[0] : null;
  }

  // ─── Disease Detection Store (With Disk Sync) ──────────────────────────────
  addDiseaseDetection(data) {
    const record = {
      _id: data._id || `DISEASE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date(),
      ...data
    };
    this.diseaseDetections.unshift(record);
    saveJsonFile(DISEASE_STORE_FILE, this.diseaseDetections);
    return record;
  }

  getDiseaseDetections(userId) {
    if (!userId) return this.diseaseDetections;
    return this.diseaseDetections.filter(r => this.matchesUser(r, userId));
  }

  deleteDiseaseDetection(id) {
    this.diseaseDetections = this.diseaseDetections.filter(d => String(d._id) !== String(id));
    saveJsonFile(DISEASE_STORE_FILE, this.diseaseDetections);
  }

  // ─── Community Store (With Disk Sync) ──────────────────────────────────────
  addCommunityPost(data) {
    this.communityPosts.unshift(data);
    saveJsonFile(COMMUNITY_STORE_FILE, this.communityPosts);
    return data;
  }

  getCommunityPosts() {
    return this.communityPosts;
  }

  saveCommunityPosts(posts) {
    this.communityPosts = posts;
    saveJsonFile(COMMUNITY_STORE_FILE, this.communityPosts);
  }

  // ─── Post Reaction Store (With Disk Sync) ─────────────────────────
  getPostReaction(userId, postId) {
    if (!userId || !postId) return null;
    const key = `${userId}_${postId}`;
    return this.postReactions[key] || null;
  }

  setPostReaction(userId, postId, reactionType) {
    if (!userId || !postId) return;
    const key = `${userId}_${postId}`;
    if (!reactionType) {
      delete this.postReactions[key];
    } else {
      this.postReactions[key] = reactionType;
    }
    saveJsonFile(REACTIONS_STORE_FILE, this.postReactions);
  }

  getReactionsForUser(userId) {
    if (!userId) return {};
    const userReactions = {};
    const prefix = `${userId}_`;
    for (const [key, val] of Object.entries(this.postReactions)) {
      if (key.startsWith(prefix)) {
        const postId = key.substring(prefix.length);
        userReactions[postId] = val;
      }
    }
    return userReactions;
  }

  // ─── Chatbot Store ──────────────────────────────────────────────────────────
  addChatMessage(sessionId, userId, role, content, metadata = {}) {
    const sId = sessionId || `CHAT-${Date.now()}`;
    if (!this.chatSessions.has(sId)) {
      this.chatSessions.set(sId, {
        sessionId: sId,
        user: userId,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const session = this.chatSessions.get(sId);
    session.messages.push({
      role,
      content,
      metadata,
      timestamp: new Date()
    });
    session.updatedAt = new Date();
    return session;
  }

  getChatHistory(userId) {
    const userSessions = Array.from(this.chatSessions.values())
      .filter(s => String(s.user) === String(userId))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return userSessions;
  }

  clearChatHistory(userId) {
    for (const [key, session] of this.chatSessions.entries()) {
      if (String(session.user) === String(userId)) {
        this.chatSessions.delete(key);
      }
    }
  }
}

module.exports = new InMemoryStore();
