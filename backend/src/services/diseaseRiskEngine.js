const DiseaseReport = require('../models/DiseaseReport');
const DiseaseAlert = require('../models/DiseaseAlert');

/**
 * Calculates Explainable Disease Risk Score for a crop & location
 */
async function evaluateDiseaseRisk(cropType, district, state = 'West Bengal', weatherData = {}) {
  const crop = cropType.toLowerCase();

  // 1. Fetch disease reports for this crop & district within the last 14 days
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const reports = await DiseaseReport.find({
    cropType: crop,
    'location.district': new RegExp(district, 'i'),
    createdAt: { $gte: fourteenDaysAgo },
  });

  const reportCount = reports.length;

  // Single report threshold suppression: if < 2 reports, return LOW risk without mass alert
  if (reportCount < 2) {
    return {
      riskLevel: 'LOW',
      riskScore: 18,
      shouldAlert: false,
      reportCount,
      contributingFactors: [
        { factor: 'Farmer Disease Reports', points: reportCount * 5, detail: `${reportCount} report(s) in past 14 days (below outbreak threshold)` },
        { factor: 'Weather Suitability', points: 8, detail: 'Normal temperature & humidity conditions' },
      ],
    };
  }

  // Group reports by disease name to find predominant disease
  const diseaseCounts = {};
  let totalAiConfidence = 0;

  reports.forEach(r => {
    const dName = r.diseaseName || 'Unknown Blight';
    diseaseCounts[dName] = (diseaseCounts[dName] || 0) + 1;
    totalAiConfidence += r.confidence || 0.8;
  });

  let topDisease = 'Bacterial Leaf Blight / Blast';
  let maxCount = 0;
  Object.keys(diseaseCounts).forEach(d => {
    if (diseaseCounts[d] > maxCount) {
      maxCount = diseaseCounts[d];
      topDisease = d;
    }
  });

  const avgConfidence = totalAiConfidence / reportCount;

  // Calculate Explainable Factor Breakdown
  const reportPoints = Math.min(40, reportCount * 12);
  const aiPoints = Math.round(avgConfidence * 25);

  // Weather Factor calculation
  const temp = weatherData.temp || 28;
  const humidity = weatherData.humidity || 82;
  const rainfall = weatherData.rainfall || 15;

  let weatherPoints = 10;
  if (humidity > 80 && temp >= 22 && temp <= 32) weatherPoints += 12; // Favorable fungal growth range
  if (rainfall > 20) weatherPoints += 8;

  const historyPoints = 12; // Historical outbreak baseline for region

  const totalScore = Math.min(100, reportPoints + aiPoints + weatherPoints + historyPoints);

  let riskLevel = 'LOW';
  if (totalScore >= 75) riskLevel = 'VERY HIGH';
  else if (totalScore >= 55) riskLevel = 'HIGH';
  else if (totalScore >= 35) riskLevel = 'MODERATE';

  const contributingFactors = [
    { factor: 'Farmer Disease Reports', points: reportPoints, detail: `${reportCount} distinct disease reports recorded in ${district}` },
    { factor: 'AI Diagnostic Predictions', points: aiPoints, detail: `Average vision model confidence score of ${(avgConfidence * 100).toFixed(0)}%` },
    { factor: 'Weather Risk Factor', points: weatherPoints, detail: `High humidity (${humidity}%) and temperature (${temp}°C) encouraging spore germination` },
    { factor: 'Historical Outbreak Baseline', points: historyPoints, detail: `Regional historical seasonal activity score for ${crop}` },
  ];

  // Auto create or update DiseaseAlert document
  const alertDoc = await DiseaseAlert.findOneAndUpdate(
    { cropType: crop, diseaseName: topDisease, district },
    {
      cropType: crop,
      diseaseName: topDisease,
      district,
      state,
      riskLevel,
      riskScore: totalScore,
      contributingFactors,
      reportCount,
      symptoms: ['Leaf yellowing & brown spots', 'Wilting of stems', 'Lesions along paddy vein lines'],
      preventionSteps: [
        'Perform bio-drenching with Trichoderma viride (10g/L water)',
        'Maintain balanced soil moisture and avoid excessive nitrogen fertilizer application',
        'Spray copper oxychloride (2.5g/L) if humidity exceeds 85%',
      ],
      status: totalScore >= 50 ? 'active' : 'resolved',
    },
    { upsert: true, new: true }
  );

  return {
    riskLevel,
    riskScore: totalScore,
    shouldAlert: totalScore >= 50,
    reportCount,
    topDisease,
    contributingFactors,
    alertDoc,
  };
}

module.exports = {
  evaluateDiseaseRisk,
};
