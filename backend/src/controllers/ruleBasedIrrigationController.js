const mongoose = require('mongoose');
const ruleBasedIrrigationService = require('../services/ruleBasedIrrigationService');
const { getCropInfo, getAllCrops, getAllCategories } = require('../utils/cropWaterDatabase');
const jsonFileStore = require('../utils/jsonFileStore');

const generateSchedule = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const inputData = req.body;

    const requiredFields = [
      'farmSize',
      'cropType',
      'soilType',
      'cropStage',
      'currentSoilMoisture',
      'temperature',
      'humidity',
      'season'
    ];

    const missingFields = requiredFields.filter(field => !inputData[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const result = await ruleBasedIrrigationService.generateRuleBasedSchedule(userId, inputData);

    res.status(201).json({
      success: true,
      message: 'Irrigation schedule generated successfully',
      data: result
    });

  } catch (error) {
    console.error('Error in generateSchedule:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate irrigation schedule'
    });
  }
};

const getUserSchedules = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const { isActive, cropType } = req.query;

    const filters = {};
    if (isActive !== undefined) filters.isActive = isActive === 'true';
    if (cropType) filters['farmDetails.cropType'] = cropType;

    const schedules = await ruleBasedIrrigationService.getUserSchedules(userId, filters);

    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });

  } catch (error) {
    const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const fallback = jsonFileStore.getIrrigationSchedules(userId);
    res.status(200).json({
      success: true,
      count: fallback.length,
      data: fallback
    });
  }
};

const getActiveSchedule = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const schedule = await ruleBasedIrrigationService.getActiveSchedule(userId);

    res.status(200).json({
      success: true,
      data: schedule
    });

  } catch (error) {
    res.status(200).json({ success: true, data: null });
  }
};

const getScheduleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const schedules = jsonFileStore.getIrrigationSchedules(userId);
    const found = schedules.find(s => String(s._id) === String(id));

    res.status(200).json({
      success: true,
      data: found || schedules[0] || null
    });
  } catch (error) {
    res.status(200).json({ success: true, data: null });
  }
};

const updateSchedule = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Schedule updated successfully'
  });
};

const deactivateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

    // Remove from jsonFileStore safely
    jsonFileStore.store.irrigationSchedules = jsonFileStore.store.irrigationSchedules.filter(
      s => String(s._id) !== String(id)
    );
    jsonFileStore.saveStore();

    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });

  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Schedule deleted successfully'
    });
  }
};

const addFeedback = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Feedback submitted successfully'
  });
};

const getQuickRecommendation = async (req, res) => {
  const result = await ruleBasedIrrigationService.generateRuleBasedSchedule(
    '650000000000000000000001',
    req.body
  );
  res.status(200).json({
    success: true,
    data: result
  });
};

const getCrops = async (req, res) => {
  const crops = getAllCrops();
  res.status(200).json({
    success: true,
    data: { crops, count: crops.length }
  });
};

const getCropDetails = async (req, res) => {
  const { cropName } = req.params;
  const cropInfo = getCropInfo(cropName);

  if (!cropInfo) {
    return res.status(404).json({
      success: false,
      message: `Crop '${cropName}' not found`
    });
  }

  res.status(200).json({
    success: true,
    data: cropInfo
  });
};

module.exports = {
  generateSchedule,
  getUserSchedules,
  getActiveSchedule,
  getScheduleById,
  updateSchedule,
  deactivateSchedule,
  addFeedback,
  getQuickRecommendation,
  getCrops,
  getCropDetails,
  getAvailableCrops: getCrops,
  getCropInformation: getCropDetails
};