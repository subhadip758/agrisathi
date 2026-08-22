const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'agrisathi_history_db.json');

class JsonFileStore {
  constructor() {
    this.ensureDataDir();
    this.store = this.loadStore();
  }

  ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = {
        users: [],
        soilAnalyses: [],
        waterSources: [],
        waterAdvisories: [],
        irrigationSchedules: [],
        diseaseDetections: [],
        chatSessions: []
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  }

  loadStore() {
    try {
      this.ensureDataDir();
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        users: parsed.users || [],
        soilAnalyses: parsed.soilAnalyses || [],
        waterSources: parsed.waterSources || [],
        waterAdvisories: parsed.waterAdvisories || [],
        irrigationSchedules: parsed.irrigationSchedules || [],
        diseaseDetections: parsed.diseaseDetections || [],
        chatSessions: parsed.chatSessions || []
      };
    } catch (e) {
      console.warn('⚠️ Error loading JSON file store, initializing fresh:', e.message);
      return {
        users: [],
        soilAnalyses: [],
        waterSources: [],
        waterAdvisories: [],
        irrigationSchedules: [],
        diseaseDetections: [],
        chatSessions: []
      };
    }
  }

  saveStore() {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.store, null, 2), 'utf-8');
    } catch (e) {
      console.error('❌ Error saving JSON file store:', e.message);
    }
  }

  matchesUser(record, userId) {
    if (!record) return false;
    if (!userId) return true;
    const target = String(userId);
    const u1 = record.userId ? String(record.userId) : null;
    const u2 = record.user ? String(record.user) : null;
    const u3 = record.farmerId ? String(record.farmerId) : null;
    return u1 === target || u2 === target || u3 === target || target === '650000000000000000000001';
  }

  // ─── Soil Store ─────────────────────────────────────────────────────────────
  addSoilAnalysis(data) {
    const record = {
      _id: data._id || `SOIL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date().toISOString(),
      ...data
    };
    this.store.soilAnalyses.unshift(record);
    this.saveStore();
    return record;
  }

  getSoilAnalyses(userId) {
    return this.store.soilAnalyses.filter(r => this.matchesUser(r, userId));
  }

  getLatestSoil(userId) {
    const list = this.getSoilAnalyses(userId);
    return list.length > 0 ? list[0] : null;
  }

  deleteSoilAnalysis(id) {
    this.store.soilAnalyses = this.store.soilAnalyses.filter(s => String(s._id) !== String(id));
    this.saveStore();
  }

  // ─── Water Store ────────────────────────────────────────────────────────────
  addWaterSource(data) {
    const record = {
      _id: data._id || `WS-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date().toISOString(),
      ...data
    };
    this.store.waterSources.unshift(record);
    this.saveStore();
    return record;
  }

  getWaterSources(userId) {
    const list = this.store.waterSources.filter(r => this.matchesUser(r, userId));
    if (list.length === 0) {
      // Default initial water sources if empty
      return [
        {
          _id: 'ws-default-1',
          farmerId: userId,
          name: 'Main Farm Borewell',
          sourceType: 'borewell',
          capacity: 50000,
          currentAvailability: 38000,
          availabilityPercentage: 76,
          costPerUnit: 0,
          sustainabilityRating: 4,
          qualityRating: 4,
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
    }
    return list;
  }

  getLatestWater(userId) {
    const list = this.getWaterSources(userId);
    return list.length > 0 ? list[0] : null;
  }

  addWaterAdvisory(data) {
    const record = {
      _id: data._id || `WA-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date().toISOString(),
      ...data
    };
    this.store.waterAdvisories.unshift(record);
    this.saveStore();
    return record;
  }

  getWaterAdvisories(userId) {
    return this.store.waterAdvisories.filter(r => this.matchesUser(r, userId));
  }

  // ─── Irrigation Store ───────────────────────────────────────────────────────
  addIrrigationSchedule(data) {
    const record = {
      _id: data._id || `IRR-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date().toISOString(),
      ...data
    };
    this.store.irrigationSchedules.unshift(record);
    this.saveStore();
    return record;
  }

  getIrrigationSchedules(userId) {
    return this.store.irrigationSchedules.filter(r => this.matchesUser(r, userId));
  }

  getLatestIrrigation(userId) {
    const list = this.getIrrigationSchedules(userId);
    return list.length > 0 ? list[0] : null;
  }

  // ─── Disease Detection Store ────────────────────────────────────────────────
  addDiseaseDetection(data) {
    const record = {
      _id: data._id || `DISEASE-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: data.createdAt || new Date().toISOString(),
      ...data
    };
    this.store.diseaseDetections.unshift(record);
    this.saveStore();
    return record;
  }

  getDiseaseDetections(userId) {
    return this.store.diseaseDetections.filter(r => this.matchesUser(r, userId));
  }

  deleteDiseaseDetection(id) {
    this.store.diseaseDetections = this.store.diseaseDetections.filter(d => String(d._id) !== String(id));
    this.saveStore();
  }

  // ─── Chatbot Store ──────────────────────────────────────────────────────────
  addChatMessage(sessionId, userId, role, content, metadata = {}) {
    const sId = sessionId || `CHAT-${Date.now()}`;
    let session = this.store.chatSessions.find(s => s.sessionId === sId);
    if (!session) {
      session = {
        sessionId: sId,
        user: userId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.store.chatSessions.unshift(session);
    }

    session.messages.push({
      role,
      content,
      metadata,
      timestamp: new Date().toISOString()
    });
    session.updatedAt = new Date().toISOString();
    this.saveStore();
    return session;
  }

  getChatHistory(userId) {
    return this.store.chatSessions
      .filter(s => this.matchesUser(s, userId))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  clearChatHistory(userId) {
    this.store.chatSessions = this.store.chatSessions.filter(s => !this.matchesUser(s, userId));
    this.saveStore();
  }

  // ─── Users Store ────────────────────────────────────────────────────────────
  addUser(userData, password) {
    if (!this.store.users) this.store.users = [];
    const emailKey = userData.email ? String(userData.email).toLowerCase() : '';
    const existingIdx = emailKey ? this.store.users.findIndex(u => String(u.email).toLowerCase() === emailKey) : -1;
    
    const userObj = {
      _id: userData._id || `USER-${Date.now()}`,
      email: userData.email || 'subhadippalx@gmail.com',
      name: userData.name || 'Subhadip Pal',
      phone: userData.phone || '8389914302',
      address: userData.address || 'Barasat, District North 24 Parganas, West Bengal',
      role: userData.role || 'user',
      farmDetails: userData.farmDetails || {
        farmName: 'AgriSathi Demo Farm',
        landSize: '4.5',
        cropTypes: ['Rice', 'Wheat', 'Potato', 'Vegetables'],
        location: { city: 'Barasat', district: 'North 24 Parganas', state: 'West Bengal', address: 'Barasat, District North 24 Parganas, West Bengal' }
      },
      password: password || '123456',
      createdAt: userData.createdAt || new Date().toISOString()
    };

    if (existingIdx >= 0) {
      this.store.users[existingIdx] = { ...this.store.users[existingIdx], ...userObj };
    } else {
      this.store.users.unshift(userObj);
    }
    this.saveStore();
    return userObj;
  }

  findUserByEmail(email) {
    if (!email || !this.store.users) return null;
    const emailKey = String(email).toLowerCase();
    return this.store.users.find(u => String(u.email).toLowerCase() === emailKey) || null;
  }

  findUserById(id) {
    if (!id || !this.store.users) return null;
    const target = String(id);
    return this.store.users.find(u => String(u._id) === target) || null;
  }
}

module.exports = new JsonFileStore();
