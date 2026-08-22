/**
 * Integration helper to link yield predictions with fertilizer recommendations
 */

const FertilizerSchedule = require('../models/FertilizerSchedule');

/**
 * Generate fertilizer recommendations based on yield prediction factors
 */
async function generateFertilizerRecommendations(yieldPrediction, userId) {
  const recommendations = [];

  // If leaf color indicates nitrogen deficiency
  if (yieldPrediction.farmerInputs?.leafColor === 'pale_yellow' || 
      yieldPrediction.farmerInputs?.leafColor === 'yellow_brown') {
    recommendations.push({
      nutrient: 'Nitrogen',
      urgency: 'High',
      action: 'Apply urea (46-0-0) at 50-75 kg per hectare immediately',
      reason: 'Yellowing leaves indicate nitrogen deficiency'
    });
  }

  // If fertilizer usage is below recommended
  if (yieldPrediction.farmerInputs?.fertilizerUsage === 'minimal' || 
      yieldPrediction.farmerInputs?.fertilizerUsage === 'none') {
    recommendations.push({
      nutrient: 'NPK',
      urgency: 'High',
      action: 'Apply balanced NPK fertilizer as per crop requirement',
      reason: 'Insufficient fertilizer input detected'
    });
  }

  // If plant health is poor
  if (yieldPrediction.farmerInputs?.plantHealth === 'poor' || 
      yieldPrediction.farmerInputs?.plantHealth === 'very_poor') {
    recommendations.push({
      nutrient: 'Micronutrients',
      urgency: 'Medium',
      action: 'Consider foliar spray of micronutrients (Zinc, Iron, Boron)',
      reason: 'Poor plant health may indicate micronutrient deficiency'
    });
  }

  return recommendations;
}

/**
 * Link yield prediction with existing fertilizer schedule
 */
async function linkWithFertilizerSchedule(yieldPredictionId, userId, crop) {
  try {
    // Find active fertilizer schedules for this crop
    const fertilizerSchedules = await FertilizerSchedule.find({
      userId: userId,
      crop: crop,
      status: 'active'
    }).sort({ createdAt: -1 }).limit(1);

    if (fertilizerSchedules.length > 0) {
      return {
        linked: true,
        scheduleId: fertilizerSchedules[0]._id,
        message: 'Yield prediction linked with active fertilizer schedule'
      };
    }

    return {
      linked: false,
      message: 'No active fertilizer schedule found. Create one for better yield management.'
    };
  } catch (error) {
    console.error('Error linking with fertilizer schedule:', error);
    return { linked: false, error: error.message };
  }
}

module.exports = {
  generateFertilizerRecommendations,
  linkWithFertilizerSchedule
};