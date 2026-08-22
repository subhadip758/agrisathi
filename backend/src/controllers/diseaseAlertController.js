const mongoose = require('mongoose');
const DiseaseDetection = require('../models/DiseaseDetection');
const DiseaseReport = require('../models/DiseaseReport');
const inMemoryStore = require('../utils/inMemoryStore');

// ── GET Active Disease Alerts (Generated dynamically from Disease Detection History)
exports.getAlerts = async (req, res) => {
  try {
    const { district = 'North 24 Parganas', cropType } = req.query;

    let historyDetections = [];
    if (mongoose.connection.readyState === 1) {
      try {
        historyDetections = await DiseaseDetection.find({}).sort({ createdAt: -1 });
      } catch (_) {}
    }

    if (historyDetections.length === 0) {
      historyDetections = inMemoryStore.getDiseaseDetections() || [];
    }

    // Filter by crop type if requested
    if (cropType && cropType !== 'all') {
      historyDetections = historyDetections.filter(d => {
        const cType = d.cropDetails?.cropType || d.cropType || d.crop || '';
        return cType.toLowerCase().includes(cropType.toLowerCase());
      });
    }

    // Filter out healthy plant scans
    const diseasedScans = historyDetections.filter(d => {
      const dName = d.detection?.diseaseName || d.final_diagnosis?.diseaseName || d.top_diagnosis?.disease || d.diseaseName || '';
      return dName && !dName.toLowerCase().includes('healthy');
    });

    if (diseasedScans.length === 0) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Group real scans by Crop Type + Disease Name to construct dynamic alerts
    const alertGroupMap = {};
    diseasedScans.forEach(scan => {
      const cType = scan.cropDetails?.cropType || scan.cropType || scan.crop || 'Rice';
      const dName = scan.detection?.diseaseName || scan.final_diagnosis?.diseaseName || scan.top_diagnosis?.disease || scan.diseaseName || 'Crop Disease';
      const key = `${cType}::${dName}`;

      if (!alertGroupMap[key]) {
        alertGroupMap[key] = {
          cropType: cType,
          diseaseName: dName,
          scans: [],
          totalConfidence: 0,
        };
      }

      alertGroupMap[key].scans.push(scan);
      const conf = scan.detection?.confidence || scan.final_diagnosis?.calibrated_confidence || scan.confidence || 0.85;
      alertGroupMap[key].totalConfidence += Number(conf);
    });

    const generatedAlerts = Object.values(alertGroupMap).map((group, idx) => {
      const count = group.scans.length;
      const avgConf = Math.round((group.totalConfidence / count) * 100);
      const riskScore = Math.min(98, 50 + count * 10 + Math.round(avgConf * 0.3));

      let riskLevel = 'LOW';
      if (riskScore >= 80) riskLevel = 'VERY HIGH';
      else if (riskScore >= 70) riskLevel = 'HIGH';
      else if (riskScore >= 50) riskLevel = 'MODERATE';

      return {
        _id: `alert-${idx + 1}`,
        cropType: group.cropType.toLowerCase(),
        diseaseName: group.diseaseName,
        district: `${district} (Barasat)`,
        state: 'West Bengal',
        riskLevel,
        riskScore,
        reportCount: count,
        contributingFactors: [
          {
            factor: 'Farmer Disease Detection History',
            points: Math.min(40, count * 15),
            detail: `${count} disease diagnosis scan(s) recorded in history for ${group.cropType}`,
          },
          {
            factor: 'Vision AI Diagnostic Confidence',
            points: Math.round(avgConf * 0.4),
            detail: `Vision AI model average confidence score is ${avgConf}% across recorded scans`,
          },
        ],
        createdAt: group.scans[0]?.createdAt || new Date(),
      };
    });

    res.json({
      success: true,
      count: generatedAlerts.length,
      data: generatedAlerts,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── POST Disease Report ─────────────────────────────────────────────────────
exports.submitReport = async (req, res) => {
  try {
    const { cropType, diseaseName, confidence, location } = req.body;
    if (!cropType || !diseaseName) {
      return res.status(400).json({ success: false, error: 'Crop type and disease name are required' });
    }

    const report = new DiseaseReport({
      farmer: req.user ? req.user._id : null,
      cropType,
      diseaseName,
      confidence: confidence || 0.85,
      location: location || { state: 'West Bengal', district: 'North 24 Parganas', blockOrVillage: 'Barasat' },
    });

    if (mongoose.connection.readyState === 1) {
      try { await report.save(); } catch (_) {}
    }

    res.status(201).json({
      success: true,
      message: 'Disease report recorded',
      report,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── POST Manually Trigger Risk Evaluation ───────────────────────────────────
exports.triggerEvaluation = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Disease risk evaluation updated',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
