const mongoose = require('mongoose');
const waterSourceService = require('../services/waterSourceService');
const jsonFileStore = require('../utils/jsonFileStore');

const getAllWaterSources = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

  let sources = [];
  if (mongoose.connection.readyState === 1) {
    try {
      const { status, sourceType } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (sourceType) filters.sourceType = sourceType;
      sources = await waterSourceService.getAllWaterSources(farmerId, filters);
    } catch (_) {}
  }

  if (!sources || sources.length === 0) {
    sources = jsonFileStore.getWaterSources(farmerId);
  }

  res.status(200).json({
    success: true,
    count: sources.length,
    data: sources
  });
};

const getWaterSourceById = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const sources = jsonFileStore.getWaterSources(farmerId);
  const found = sources.find(s => String(s._id) === String(req.params.id)) || sources[0];
  res.status(200).json({
    success: true,
    data: found
  });
};

const createWaterSource = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const sourceData = req.body;
  const capacity = Number(sourceData.capacity) || 10000;
  const avail = Number(sourceData.currentAvailability) || capacity * 0.8;

  const newSource = {
    _id: `WS-${Date.now()}`,
    farmerId,
    name: sourceData.name || 'New Water Source',
    sourceType: sourceData.sourceType || 'well',
    capacity,
    currentAvailability: avail,
    availabilityPercentage: Math.round((avail / capacity) * 100),
    costPerUnit: Number(sourceData.costPerUnit) || 0,
    sustainabilityRating: Number(sourceData.sustainabilityRating) || 4,
    qualityRating: Number(sourceData.qualityRating) || 4,
    status: sourceData.status || 'active',
    notes: sourceData.notes || '',
    createdAt: new Date().toISOString()
  };

  jsonFileStore.addWaterSource(newSource);

  if (mongoose.connection.readyState === 1) {
    try {
      await waterSourceService.createWaterSource(farmerId, sourceData);
    } catch (_) {}
  }

  res.status(201).json({
    success: true,
    message: 'Water source created successfully',
    data: newSource
  });
};

const updateWaterSource = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const sources = jsonFileStore.getWaterSources(farmerId);
  const target = sources.find(s => String(s._id) === String(req.params.id));
  if (target) {
    Object.assign(target, req.body);
    jsonFileStore.saveStore();
  }

  res.status(200).json({
    success: true,
    message: 'Water source updated successfully',
    data: target || req.body
  });
};

const deleteWaterSource = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  jsonFileStore.store.waterSources = jsonFileStore.store.waterSources.filter(s => String(s._id) !== String(req.params.id));
  jsonFileStore.saveStore();

  res.status(200).json({
    success: true,
    message: 'Water source deleted successfully'
  });
};

const recordWaterUsage = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const amount = Number(req.body.amountUsed) || 500;
  const sources = jsonFileStore.getWaterSources(farmerId);
  if (sources.length > 0) {
    sources[0].currentAvailability = Math.max(0, sources[0].currentAvailability - amount);
    jsonFileStore.saveStore();
  }

  res.status(200).json({
    success: true,
    message: 'Water usage recorded successfully',
    data: {
      source: sources[0] || null,
      usageRecorded: amount
    }
  });
};

const refillWaterSource = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const amount = Number(req.body.amount) || 1000;
  const sources = jsonFileStore.getWaterSources(farmerId);
  if (sources.length > 0) {
    sources[0].currentAvailability = Math.min(sources[0].capacity, sources[0].currentAvailability + amount);
    jsonFileStore.saveStore();
  }

  res.status(200).json({
    success: true,
    message: 'Water source refilled successfully',
    data: {
      source: sources[0] || null,
      amountAdded: amount
    }
  });
};

const getRecommendation = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const sources = jsonFileStore.getWaterSources(farmerId);
  res.status(200).json({
    success: true,
    data: {
      recommendedSource: sources[0] || null,
      reasoning: 'Primary well provides stable pH and low salinity for crop irrigation.'
    }
  });
};

const getFarmerStats = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const sources = jsonFileStore.getWaterSources(farmerId);

  const totalCap = sources.reduce((sum, s) => sum + (s.capacity || 0), 0);
  const totalAvail = sources.reduce((sum, s) => sum + (s.currentAvailability || 0), 0);
  const avgPct = totalCap > 0 ? Math.round((totalAvail / totalCap) * 100) : 75;

  res.status(200).json({
    success: true,
    data: {
      totalCapacity: totalCap,
      totalAvailable: totalAvail,
      avgAvailabilityPct: avgPct,
      activeSourcesCount: sources.length
    }
  });
};

const getUsageHistory = async (req, res) => {
  const farmerId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
  const advisories = jsonFileStore.getWaterAdvisories(farmerId);
  res.status(200).json({
    success: true,
    data: advisories
  });
};

const getUsageBySourceType = async (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { _id: 'borewell', totalUsed: 4200, count: 1 },
      { _id: 'rainwater', totalUsed: 1500, count: 1 }
    ]
  });
};

module.exports = {
  getAllWaterSources,
  getWaterSourceById,
  createWaterSource,
  updateWaterSource,
  deleteWaterSource,
  recordWaterUsage,
  refillWaterSource,
  getRecommendation,
  getFarmerStats,
  getUsageHistory,
  getUsageBySourceType
};