const mongoose = require('mongoose');
const RuleBasedIrrigation = require('../models/RuleBasedIrrigation');
const jsonFileStore = require('../utils/jsonFileStore');
const {
  getCropInfo,
  calculateStageWaterFactor,
  calculateSoilWaterFactor,
  calculateSeasonWaterFactor,
  calculateMoistureDeficit,
  determineIrrigationUrgency,
  calculateWaterQuantity,
  calculateIrrigationFrequency,
  determineBestIrrigationTimes,
  calculateWeeklyWaterNeed,
  generateNextIrrigationDate
} = require('../utils/cropWaterDatabase');

async function generateRuleBasedSchedule(userId, inputData) {
  try {
    const validUserId = userId || '650000000000000000000001';
    const cropInfo = getCropInfo(inputData.cropType);
    const stageFactor = calculateStageWaterFactor(cropInfo, inputData.cropStage);
    const soilFactor = calculateSoilWaterFactor(inputData.soilType);
    const seasonFactor = calculateSeasonWaterFactor(inputData.season);
    const moistureDeficit = calculateMoistureDeficit(cropInfo.targetSoilMoisture, inputData.currentSoilMoisture);

    const adjustmentFactor = stageFactor * soilFactor * seasonFactor;

    const irrigationNeed = determineIrrigationUrgency(
      moistureDeficit,
      inputData.temperature,
      inputData.humidity,
      adjustmentFactor
    );

    const irrigationAmount = calculateWaterQuantity(
      cropInfo.baseWaterNeed,
      inputData.farmSize,
      adjustmentFactor
    );

    const frequency = calculateIrrigationFrequency(
      inputData.soilType,
      inputData.currentSoilMoisture,
      irrigationNeed.urgency
    );

    const irrigationTimes = determineBestIrrigationTimes(
      inputData.season,
      inputData.temperature
    );

    const weeklyTotal = calculateWeeklyWaterNeed(
      irrigationAmount.waterQuantity,
      frequency
    );

    const nextIrrigationDate = generateNextIrrigationDate(
      irrigationNeed.urgency,
      frequency
    );

    const scheduleData = {
      _id: `IRR-${Date.now()}`,
      userId: validUserId,
      farmDetails: {
        farmSize: Number(inputData.farmSize),
        cropType: inputData.cropType,
        soilType: inputData.soilType,
        cropStage: inputData.cropStage,
        season: inputData.season
      },
      environmentalConditions: {
        currentSoilMoisture: Number(inputData.currentSoilMoisture),
        targetSoilMoisture: cropInfo.targetSoilMoisture,
        moistureDeficit,
        temperature: Number(inputData.temperature),
        humidity: Number(inputData.humidity)
      },
      irrigationSchedule: {
        urgency: irrigationNeed.urgency,
        recommendedAction: irrigationNeed.action,
        waterQuantity: irrigationAmount.waterQuantity,
        waterUnit: irrigationAmount.unit,
        frequency,
        duration: irrigationAmount.duration,
        durationUnit: 'minutes',
        bestIrrigationTimes: irrigationTimes,
        weeklyWaterNeed: weeklyTotal,
        nextIrrigationDate
      },
      ruleEngineCalculations: {
        baseWaterNeed: cropInfo.baseWaterNeed,
        stageFactor,
        soilFactor,
        seasonFactor,
        adjustmentFactor,
        rawCalculatedNeed: irrigationNeed.rawNeed
      },
      isActive: true,
      createdAt: new Date().toISOString()
    };

    // Save to disk store permanently
    jsonFileStore.addIrrigationSchedule(scheduleData);

    if (mongoose.connection.readyState === 1) {
      try {
        const scheduleDoc = new RuleBasedIrrigation(scheduleData);
        await scheduleDoc.save();
      } catch (dbErr) {
        console.warn('Irrigation DB save warning:', dbErr.message);
      }
    }

    return {
      schedule: scheduleData,
      summary: {
        crop: inputData.cropType,
        stage: inputData.cropStage,
        urgency: irrigationNeed.urgency,
        frequency,
        waterPerSession: `${irrigationAmount.waterQuantity} liters`,
        durationPerSession: `${irrigationAmount.duration} minutes`,
        weeklyTotal: `${weeklyTotal} liters`,
        bestTimes: irrigationTimes.join(', ')
      }
    };

  } catch (error) {
    console.error('Error generating rule-based schedule:', error);
    throw error;
  }
}

function generateIrrigationAdvice(irrigationNeed, cropInfo, stageInfo) {
  let advice = '';
  if (irrigationNeed.urgency === 'Critical') {
    advice = `🚨 URGENT: Immediate irrigation required! Your crop is experiencing severe water stress. `;
  } else if (irrigationNeed.urgency === 'High') {
    advice = `⚠️ Irrigation needed soon. Soil moisture is below optimal levels. `;
  } else if (irrigationNeed.urgency === 'Medium') {
    advice = `💧 Irrigation recommended to maintain optimal moisture. `;
  } else {
    advice = `✅ Soil moisture is adequate. Continue monitoring. `;
  }
  return advice;
}

async function getUserSchedules(userId, filters = {}) {
  const validUserId = userId || '650000000000000000000001';
  let schedules = [];

  if (mongoose.connection.readyState === 1) {
    try {
      const query = { userId: validUserId, ...filters };
      schedules = await RuleBasedIrrigation.find(query).sort({ createdAt: -1 }).limit(20);
    } catch (_) {}
  }

  if (!schedules || schedules.length === 0) {
    schedules = jsonFileStore.getIrrigationSchedules(validUserId);
  }

  return schedules;
}

async function getActiveSchedule(userId) {
  const schedules = await getUserSchedules(userId, { isActive: true });
  return schedules[0] || null;
}

async function deactivateSchedule(scheduleId, userId) {
  const validUserId = userId || '650000000000000000000001';
  if (mongoose.connection.readyState === 1) {
    try {
      await RuleBasedIrrigation.findOneAndUpdate(
        { _id: scheduleId, userId: validUserId },
        { isActive: false }
      );
    } catch (_) {}
  }
  return { success: true };
}

async function updateScheduleConditions(scheduleId, userId, newConditions) {
  return { success: true };
}

module.exports = {
  generateRuleBasedSchedule,
  getUserSchedules,
  getActiveSchedule,
  deactivateSchedule,
  updateScheduleConditions
};