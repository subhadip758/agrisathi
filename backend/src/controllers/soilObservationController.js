const mongoose = require('mongoose');
const { analyzeSoilFromObservations } = require('../services/soilRules');
const SoilAnalysis = require('../models/SoilAnalysis');
const jsonFileStore = require('../utils/jsonFileStore');

const analyzeSoilObservation = async (req, res) => {
  try {
    const validUserId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const observations = req.body;

    const requiredFields = ['leafColor', 'cropYield', 'handFeel', 'waterDrainage'];
    const missingFields = requiredFields.filter(field => !observations[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'कृपया सभी जरूरी जानकारी भरें',
        missingFields
      });
    }

    const analysis = analyzeSoilFromObservations(observations);

    const soilAnalysisRecord = {
      _id: `SOIL-${Date.now()}`,
      userId: validUserId,
      analysisType: 'observation-based',
      observations,
      results: {
        healthScore: analysis.healthScore,
        healthClass: analysis.healthClass,
        nitrogenLevel: analysis.nutrientLevels.nitrogen?.level || 'MEDIUM',
        phosphorusLevel: analysis.nutrientLevels.phosphorus?.level || 'MEDIUM',
        potassiumLevel: analysis.nutrientLevels.potassium?.level || 'MEDIUM',
        phCategory: analysis.soilProperties.ph?.category || 'NEUTRAL',
        phValue: analysis.soilProperties.ph?.value || 6.5,
        texture: analysis.soilProperties.texture || 'LOAM',
        organicMatter: analysis.soilProperties.organicMatter || 'MEDIUM'
      },
      recommendations: {
        fertilizers: analysis.fertilizerRecommendations || [],
        crops: analysis.cropRecommendations || {},
        improvementPlan: analysis.improvementPlan || {}
      },
      deficiencies: analysis.deficiencies || [],
      createdAt: new Date().toISOString()
    };

    // Always save to jsonFileStore disk storage
    jsonFileStore.addSoilAnalysis(soilAnalysisRecord);

    if (mongoose.connection.readyState === 1) {
      try {
        const doc = new SoilAnalysis(soilAnalysisRecord);
        await doc.save();
      } catch (dbErr) {
        console.warn('Soil observation DB save warning:', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Soil analysis completed successfully',
      analysisId: soilAnalysisRecord._id,
      data: {
        ...analysis,
        _id: soilAnalysisRecord._id,
        savedAt: soilAnalysisRecord.createdAt
      }
    });

  } catch (error) {
    console.error('Soil observation analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Error occurred during analysis. Please try again.'
    });
  }
};

const getSoilAnalysisHistory = async (req, res) => {
  try {
    const validUserId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const { limit = 50, page = 1 } = req.query;

    let analyses = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const filter = { $or: [{ userId: validUserId }, { user: validUserId }] };
        analyses = await SoilAnalysis.find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit))
          .skip((parseInt(page) - 1) * parseInt(limit))
          .select('-observations');
      } catch (_) {}
    }

    if (analyses.length === 0) {
      analyses = jsonFileStore.getSoilAnalyses(validUserId);
    }

    const total = analyses.length;

    res.status(200).json({
      success: true,
      data: analyses,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)) || 1
      }
    });

  } catch (error) {
    console.error('Get soil history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching history'
    });
  }
};

const getSoilAnalysisById = async (req, res) => {
  try {
    const validUserId = req.user?._id || req.user?.id || req.user || '650000000000000000000001';
    const analysisId = req.params.id;

    let analysis = null;
    if (mongoose.connection.readyState === 1) {
      try {
        analysis = await SoilAnalysis.findOne({
          _id: analysisId,
          $or: [{ userId: validUserId }, { user: validUserId }]
        });
      } catch (_) {}
    }

    if (!analysis) {
      analysis = jsonFileStore.getSoilAnalyses(validUserId).find(a => String(a._id) === String(analysisId));
    }

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis not found' });
    }

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching analysis' });
  }
};

const getObservationOptions = (req, res) => {
  const options = {
    leafColor: [
      { value: 'dark_green', label: 'Dark Green', emoji: '🟢' },
      { value: 'light_green', label: 'Light Green', emoji: '💚' },
      { value: 'yellow_green', label: 'Yellow-Green', emoji: '💛' },
      { value: 'yellow', label: 'Yellow', emoji: '🟡' },
      { value: 'pale_yellow', label: 'Pale Yellow', emoji: '⚪' }
    ],
    cropYield: [
      { value: 'excellent', label: 'Excellent', emoji: '🏆' },
      { value: 'good', label: 'Good', emoji: '✅' },
      { value: 'average', label: 'Average', emoji: '➖' },
      { value: 'poor', label: 'Poor', emoji: '⚠️' }
    ],
    handFeel: [
      { value: 'gritty_loose', label: 'Gritty/Loose', emoji: '🏖️' },
      { value: 'sticky_smooth', label: 'Sticky/Smooth', emoji: '🧱' },
      { value: 'soft_crumbly', label: 'Soft/Crumbly', emoji: '🌱' }
    ],
    waterDrainage: [
      { value: 'fast', label: 'Fast', emoji: '⚡' },
      { value: 'normal', label: 'Normal', emoji: '➖' },
      { value: 'slow', label: 'Slow', emoji: '🐌' }
    ]
  };

  res.status(200).json({
    success: true,
    data: options,
    instructions: { english: 'Please select information about your field and crops below' }
  });
};

module.exports = {
  analyzeSoilObservation,
  getSoilAnalysisHistory,
  getSoilAnalysisById,
  getObservationOptions
};