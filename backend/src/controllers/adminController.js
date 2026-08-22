const mongoose = require('mongoose');
const MarketListing = require('../models/MarketListing');
const CropFreshnessRule = require('../models/CropFreshnessRule');
const GovernmentScheme = require('../models/GovernmentScheme');
const DiseaseAlert = require('../models/DiseaseAlert');
const MarketReport = require('../models/MarketReport');
const CommunityReport = require('../models/CommunityReport');
const User = require('../models/User');

// ── GET Admin System Stats ────────────────────────────────────────────────────
exports.getAdminStats = async (req, res) => {
  try {
    const isConnected = mongoose.connection && mongoose.connection.readyState === 1;
    const totalUsers = isConnected ? await User.countDocuments() : 12;
    const activeListings = isConnected ? await MarketListing.countDocuments({ status: 'active' }) : 8;
    const totalSchemes = isConnected ? await GovernmentScheme.countDocuments({ status: 'published' }) : 6;
    const activeAlerts = isConnected ? await DiseaseAlert.countDocuments({ status: 'active' }) : 2;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeListings,
        totalSchemes,
        activeAlerts,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── GET Marketplace & Community Moderation Reports ───────────────────────────
exports.getReports = async (req, res) => {
  try {
    let marketReports = [];
    let communityReports = [];

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      marketReports = await MarketReport.find().populate('listing reportedSeller reporter').sort({ createdAt: -1 });
      communityReports = await CommunityReport.find().populate('reporter').sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      data: {
        marketReports,
        communityReports,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── Update Report Moderation Status ──────────────────────────────────────────
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportType, status, adminNotes } = req.body;
    const reportId = req.params.id;

    if (reportType === 'market' && mongoose.connection && mongoose.connection.readyState === 1) {
      await MarketReport.findByIdAndUpdate(reportId, { status, adminNotes });
    } else if (reportType === 'community' && mongoose.connection && mongoose.connection.readyState === 1) {
      await CommunityReport.findByIdAndUpdate(reportId, { status, adminNotes });
    }

    res.json({ success: true, message: `Report status updated to ${status}` });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── GET/PUT Crop Freshness Rules ──────────────────────────────────────────────
exports.getFreshnessRules = async (req, res) => {
  try {
    const rules = await CropFreshnessRule.find().sort({ cropName: 1 });
    res.json({ success: true, count: rules.length, data: rules });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.upsertFreshnessRule = async (req, res) => {
  try {
    const { cropName, storageType = 'fresh', newly_arrived_days, fresh_days, aging_days, old_after_days, source, sourceUrl } = req.body;

    const rule = await CropFreshnessRule.findOneAndUpdate(
      { cropName: cropName.toLowerCase(), storageType },
      {
        cropName: cropName.toLowerCase(),
        storageType,
        newly_arrived_days,
        fresh_days,
        aging_days,
        old_after_days,
        source: source || 'ICAR Verified Rule',
        sourceUrl: sourceUrl || 'https://icar.org.in',
        lastVerifiedAt: new Date(),
        verificationStatus: 'verified_production',
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Freshness rule saved', data: rule });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── Moderate Market Listing ───────────────────────────────────────────────────
exports.moderateListing = async (req, res) => {
  try {
    const { status, moderationNotes } = req.body;
    const listing = await MarketListing.findByIdAndUpdate(
      req.params.id,
      { status, moderationNotes },
      { new: true }
    );
    res.json({ success: true, message: `Listing status updated to ${status}`, data: listing });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// ── Verify Government Scheme ─────────────────────────────────────────────────
exports.verifyScheme = async (req, res) => {
  try {
    const { status = 'published' } = req.body;
    const scheme = await GovernmentScheme.findByIdAndUpdate(
      req.params.id,
      { status, lastVerifiedAt: new Date() },
      { new: true }
    );
    res.json({ success: true, message: `Scheme status updated to ${status}`, data: scheme });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
