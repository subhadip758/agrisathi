const mongoose = require('mongoose');
const { generateWaterAdvisory } = require('../services/waterAdvisoryRules');
const WaterSource = require('../models/WaterSource');

/**
 * Get water advisory based on farmer inputs
 * POST /api/water/advisory
 */
const getWaterAdvisory = async (req, res) => {
  try {
    const validUserId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';

    const {
      cropType,
      cropStage,
      soilTexture,
      waterDrainage,
      soilMoisture,
      temperature,
      rainfall
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'cropType', 'cropStage', 'soilTexture', 
      'waterDrainage', 'soilMoisture', 'temperature', 'rainfall'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        missingFields,
        message: 'Please provide all farmer inputs'
      });
    }

    // Generate water advisory using rule engine
    const advisory = generateWaterAdvisory(req.body);

    // Save water source / usage entry in database for persistent context
    if (mongoose.connection.readyState === 1) {
      try {
        const newWaterRecord = new WaterSource({
          farmerId: validUserId,
          sourceType: 'well',
          name: `${cropType || 'Crop'} Irrigation Water Source`,
          capacity: 50000,
          currentAvailability: 35000,
          costPerUnit: 0,
          sustainabilityRating: 4,
          qualityRating: 4,
          notes: `Drainage: ${waterDrainage}, Moisture: ${soilMoisture}, Stage: ${cropStage}`,
          createdAt: new Date()
        });
        await newWaterRecord.save();
      } catch (dbErr) {
        console.warn('Water advisory record save warning:', dbErr.message);
      }
    }

    // Return success response
    return res.status(200).json({
      success: true,
      data: advisory,
      message: 'Water advisory generated successfully'
    });

  } catch (error) {
    console.error('Error in getWaterAdvisory:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to generate water advisory. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const getChartData = async (req, res) => {
  try {
    const {
      cropType,
      cropStage,
      soilMoisture,
      soilTexture,
      temperature
    } = req.query;

    if (!cropType || !cropStage) {
      return res.status(400).json({
        success: false,
        error: 'Missing crop information',
        message: 'Please provide cropType and cropStage'
      });
    }

    const inputs = {
      cropType,
      cropStage,
      soilTexture: soilTexture || 'loam',
      waterDrainage: 'normal',
      soilMoisture: soilMoisture || 'slightly_moist',
      temperature: parseInt(temperature) || 25,
      rainfall: 'none'
    };

    const advisory = generateWaterAdvisory(inputs);

    return res.status(200).json({
      success: true,
      data: {
        charts: advisory.charts
      },
      message: 'Chart data generated successfully'
    });

  } catch (error) {
    console.error('Error in getChartData:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      message: 'Failed to generate chart data'
    });
  }
};

module.exports = {
  getWaterAdvisory,
  getChartData
};