/**
 * Rule-based Yield Calculator for Farmer-Friendly Estimation
 * No lab data required - uses observational inputs
 */

// Base yield potentials (kg per hectare) for common crops
const BASE_YIELDS = {
    rice: { min: 4000, avg: 5500, max: 7000 },
    wheat: { min: 3500, avg: 5000, max: 6500 },
    maize: { min: 4500, avg: 6000, max: 8000 },
    cotton: { min: 1500, avg: 2500, max: 3500 },
    sugarcane: { min: 60000, avg: 80000, max: 100000 },
    potato: { min: 20000, avg: 30000, max: 40000 },
    tomato: { min: 25000, avg: 40000, max: 55000 },
    onion: { min: 15000, avg: 25000, max: 35000 },
    soybean: { min: 2000, avg: 3000, max: 4000 },
    chickpea: { min: 1500, avg: 2500, max: 3500 },
    mustard: { min: 1200, avg: 1800, max: 2500 },
    groundnut: { min: 1800, avg: 2800, max: 3800 }
  };
  
  // Critical growth stages for different crops
  const CRITICAL_STAGES = {
    rice: ['tillering', 'flowering', 'grain_filling'],
    wheat: ['tillering', 'flowering', 'grain_filling'],
    maize: ['vegetative', 'flowering', 'grain_filling'],
    cotton: ['flowering', 'boll_formation'],
    sugarcane: ['tillering', 'grand_growth'],
    potato: ['tuber_initiation', 'tuber_bulking'],
    tomato: ['flowering', 'fruit_development'],
    onion: ['bulb_formation', 'bulb_development']
  };
  
  /**
   * Calculate yield estimate based on farmer's observational inputs
   */
  function calculateYieldEstimate(inputs) {
    const {
      crop,
      growthStage,
      sowingTime,
      plantHealth,
      leafColor,
      pestDiseaseImpact,
      rainfallExperience,
      waterAvailability,
      fertilizerUsage,
      lastSeasonComparison,
      farmSize,
      soilType // optional
    } = inputs;
  
    // Start with base yield for the crop
    const baseYield = BASE_YIELDS[crop.toLowerCase()] || BASE_YIELDS.wheat;
    let adjustmentFactor = 1.0;
    const affectingFactors = [];
    const recommendations = [];
  
    // Factor 1: Sowing Time (Critical - affects entire crop cycle)
    if (sowingTime === 'very_early' || sowingTime === 'very_late') {
      adjustmentFactor *= 0.75;
      affectingFactors.push({
        factor: 'Sowing Time',
        impact: 'High Negative',
        description: 'Crop sown outside optimal window',
        effect: '-25%'
      });
      recommendations.push('Plan timely sowing next season based on weather forecast');
    } else if (sowingTime === 'slightly_late' || sowingTime === 'slightly_early') {
      adjustmentFactor *= 0.90;
      affectingFactors.push({
        factor: 'Sowing Time',
        impact: 'Moderate Negative',
        description: 'Minor delay/advance in sowing',
        effect: '-10%'
      });
    } else {
      affectingFactors.push({
        factor: 'Sowing Time',
        impact: 'Positive',
        description: 'Optimal sowing window utilized',
        effect: '+0%'
      });
    }
  
    // Factor 2: Plant Health (Overall vigor and growth)
    switch (plantHealth) {
      case 'excellent':
        adjustmentFactor *= 1.15;
        affectingFactors.push({
          factor: 'Plant Health',
          impact: 'High Positive',
          description: 'Excellent plant vigor and growth',
          effect: '+15%'
        });
        break;
      case 'good':
        adjustmentFactor *= 1.05;
        affectingFactors.push({
          factor: 'Plant Health',
          impact: 'Moderate Positive',
          description: 'Good overall plant condition',
          effect: '+5%'
        });
        break;
      case 'average':
        // No change
        affectingFactors.push({
          factor: 'Plant Health',
          impact: 'Neutral',
          description: 'Average plant growth',
          effect: '0%'
        });
        break;
      case 'poor':
        adjustmentFactor *= 0.80;
        affectingFactors.push({
          factor: 'Plant Health',
          impact: 'High Negative',
          description: 'Poor plant vigor and stunted growth',
          effect: '-20%'
        });
        recommendations.push('Apply recommended fertilizer doses');
        recommendations.push('Check for soil compaction or drainage issues');
        break;
      case 'very_poor':
        adjustmentFactor *= 0.60;
        affectingFactors.push({
          factor: 'Plant Health',
          impact: 'Severe Negative',
          description: 'Very poor plant condition',
          effect: '-40%'
        });
        recommendations.push('Consult agricultural expert immediately');
        recommendations.push('Consider rescue measures like foliar nutrition');
        break;
    }
  
    // Factor 3: Leaf Color (Nutrient status indicator)
    switch (leafColor) {
      case 'dark_green':
        adjustmentFactor *= 1.08;
        affectingFactors.push({
          factor: 'Leaf Color',
          impact: 'Positive',
          description: 'Healthy dark green leaves indicate good nitrogen',
          effect: '+8%'
        });
        break;
      case 'light_green':
        // Neutral - normal for some stages
        affectingFactors.push({
          factor: 'Leaf Color',
          impact: 'Neutral',
          description: 'Normal leaf color',
          effect: '0%'
        });
        break;
      case 'pale_yellow':
        adjustmentFactor *= 0.85;
        affectingFactors.push({
          factor: 'Leaf Color',
          impact: 'High Negative',
          description: 'Yellowing indicates nitrogen deficiency',
          effect: '-15%'
        });
        recommendations.push('Apply nitrogen-rich fertilizer (urea) immediately');
        break;
      case 'yellow_brown':
        adjustmentFactor *= 0.70;
        affectingFactors.push({
          factor: 'Leaf Color',
          impact: 'Severe Negative',
          description: 'Severe nutrient deficiency or disease',
          effect: '-30%'
        });
        recommendations.push('Apply balanced NPK fertilizer urgently');
        recommendations.push('Check for root damage or soil pH issues');
        break;
    }
  
    // Factor 4: Pest and Disease Impact
    switch (pestDiseaseImpact) {
      case 'none':
        adjustmentFactor *= 1.05;
        affectingFactors.push({
          factor: 'Pest & Disease',
          impact: 'Positive',
          description: 'No pest or disease pressure',
          effect: '+5%'
        });
        break;
      case 'minor':
        adjustmentFactor *= 0.95;
        affectingFactors.push({
          factor: 'Pest & Disease',
          impact: 'Minor Negative',
          description: 'Minor pest/disease incidence',
          effect: '-5%'
        });
        recommendations.push('Monitor pest levels regularly');
        break;
      case 'moderate':
        adjustmentFactor *= 0.80;
        affectingFactors.push({
          factor: 'Pest & Disease',
          impact: 'Moderate Negative',
          description: 'Moderate pest/disease damage',
          effect: '-20%'
        });
        recommendations.push('Apply recommended pesticide/fungicide immediately');
        break;
      case 'severe':
        adjustmentFactor *= 0.60;
        affectingFactors.push({
          factor: 'Pest & Disease',
          impact: 'Severe Negative',
          description: 'Severe pest/disease infestation',
          effect: '-40%'
        });
        recommendations.push('Emergency pest control required');
        recommendations.push('Remove severely affected plants to prevent spread');
        break;
      case 'very_severe':
        adjustmentFactor *= 0.40;
        affectingFactors.push({
          factor: 'Pest & Disease',
          impact: 'Critical Negative',
          description: 'Devastating pest/disease attack',
          effect: '-60%'
        });
        recommendations.push('Consult agricultural expert for crop salvage options');
        break;
    }
  
    // Factor 5: Water Availability (Critical for most crops)
    const isCriticalStage = CRITICAL_STAGES[crop.toLowerCase()]?.includes(growthStage);
    
    switch (waterAvailability) {
      case 'excess':
        if (isCriticalStage) {
          adjustmentFactor *= 0.75;
          affectingFactors.push({
            factor: 'Water Stress',
            impact: 'High Negative',
            description: 'Waterlogging during critical stage',
            effect: '-25%'
          });
          recommendations.push('Improve drainage immediately');
          recommendations.push('Avoid irrigation until soil drains');
        } else {
          adjustmentFactor *= 0.90;
          affectingFactors.push({
            factor: 'Water Stress',
            impact: 'Moderate Negative',
            description: 'Excess water can cause root damage',
            effect: '-10%'
          });
        }
        break;
      case 'adequate':
        adjustmentFactor *= 1.10;
        affectingFactors.push({
          factor: 'Water Availability',
          impact: 'High Positive',
          description: 'Optimal water availability',
          effect: '+10%'
        });
        break;
      case 'slight_stress':
        adjustmentFactor *= 0.95;
        affectingFactors.push({
          factor: 'Water Stress',
          impact: 'Minor Negative',
          description: 'Mild water stress',
          effect: '-5%'
        });
        recommendations.push('Plan irrigation within 3-4 days');
        break;
      case 'moderate_stress':
        if (isCriticalStage) {
          adjustmentFactor *= 0.70;
          affectingFactors.push({
            factor: 'Water Stress',
            impact: 'Severe Negative',
            description: 'Water stress during critical flowering/grain filling',
            effect: '-30%'
          });
          recommendations.push('Irrigate immediately - critical stage');
        } else {
          adjustmentFactor *= 0.85;
          affectingFactors.push({
            factor: 'Water Stress',
            impact: 'Moderate Negative',
            description: 'Moderate water stress',
            effect: '-15%'
          });
          recommendations.push('Irrigate within 1-2 days');
        }
        break;
      case 'severe_stress':
        adjustmentFactor *= 0.55;
        affectingFactors.push({
          factor: 'Water Stress',
          impact: 'Critical Negative',
          description: 'Severe drought stress',
          effect: '-45%'
        });
        recommendations.push('Emergency irrigation required');
        recommendations.push('Consider protective measures like mulching');
        break;
    }
  
    // Factor 6: Rainfall Experience
    switch (rainfallExperience) {
      case 'excess':
        adjustmentFactor *= 0.85;
        affectingFactors.push({
          factor: 'Rainfall',
          impact: 'Moderate Negative',
          description: 'Excessive rainfall can damage crops',
          effect: '-15%'
        });
        break;
      case 'adequate':
        adjustmentFactor *= 1.08;
        affectingFactors.push({
          factor: 'Rainfall',
          impact: 'Positive',
          description: 'Well-distributed rainfall',
          effect: '+8%'
        });
        break;
      case 'below_normal':
        adjustmentFactor *= 0.90;
        affectingFactors.push({
          factor: 'Rainfall',
          impact: 'Moderate Negative',
          description: 'Below normal rainfall',
          effect: '-10%'
        });
        break;
      case 'deficit':
        adjustmentFactor *= 0.75;
        affectingFactors.push({
          factor: 'Rainfall',
          impact: 'High Negative',
          description: 'Significant rainfall deficit',
          effect: '-25%'
        });
        break;
    }
  
    // Factor 7: Fertilizer Usage
    switch (fertilizerUsage) {
      case 'excess':
        adjustmentFactor *= 0.90;
        affectingFactors.push({
          factor: 'Fertilizer Usage',
          impact: 'Moderate Negative',
          description: 'Over-fertilization can harm plants',
          effect: '-10%'
        });
        recommendations.push('Reduce fertilizer dose to recommended levels');
        break;
      case 'recommended':
        adjustmentFactor *= 1.12;
        affectingFactors.push({
          factor: 'Fertilizer Usage',
          impact: 'High Positive',
          description: 'Optimal fertilizer application',
          effect: '+12%'
        });
        break;
      case 'below_recommended':
        adjustmentFactor *= 0.92;
        affectingFactors.push({
          factor: 'Fertilizer Usage',
          impact: 'Moderate Negative',
          description: 'Insufficient fertilizer',
          effect: '-8%'
        });
        recommendations.push('Apply remaining fertilizer dose as per crop stage');
        break;
      case 'minimal':
        adjustmentFactor *= 0.75;
        affectingFactors.push({
          factor: 'Fertilizer Usage',
          impact: 'High Negative',
          description: 'Very low fertilizer input',
          effect: '-25%'
        });
        recommendations.push('Apply balanced NPK fertilizer immediately');
        break;
      case 'none':
        adjustmentFactor *= 0.60;
        affectingFactors.push({
          factor: 'Fertilizer Usage',
          impact: 'Severe Negative',
          description: 'No fertilizer applied',
          effect: '-40%'
        });
        recommendations.push('Urgent: Apply starter fertilizer dose');
        break;
    }
  
    // Factor 8: Last Season Comparison (Farmer's own experience)
    if (lastSeasonComparison === 'much_better') {
      adjustmentFactor *= 1.10;
      affectingFactors.push({
        factor: 'Season Comparison',
        impact: 'Positive',
        description: 'Crop performing better than last season',
        effect: '+10%'
      });
    } else if (lastSeasonComparison === 'worse' || lastSeasonComparison === 'much_worse') {
      adjustmentFactor *= 0.90;
      affectingFactors.push({
        factor: 'Season Comparison',
        impact: 'Negative',
        description: 'Crop underperforming vs last season',
        effect: '-10%'
      });
    }
  
    // Calculate final yield range
    const estimatedAvgYield = baseYield.avg * adjustmentFactor;
    const yieldRange = {
      low: Math.round(estimatedAvgYield * 0.85),
      expected: Math.round(estimatedAvgYield),
      high: Math.round(estimatedAvgYield * 1.15)
    };
  
    // Categorize yield level
    let yieldCategory;
    let categoryDescription;
    
    if (adjustmentFactor >= 1.10) {
      yieldCategory = 'Excellent';
      categoryDescription = 'Above average yield expected';
    } else if (adjustmentFactor >= 0.95) {
      yieldCategory = 'Good';
      categoryDescription = 'Normal to good yield expected';
    } else if (adjustmentFactor >= 0.80) {
      yieldCategory = 'Average';
      categoryDescription = 'Average yield expected';
    } else if (adjustmentFactor >= 0.65) {
      yieldCategory = 'Below Average';
      categoryDescription = 'Below average yield expected';
    } else {
      yieldCategory = 'Poor';
      categoryDescription = 'Poor yield expected - immediate action needed';
    }
  
    // Calculate per acre (for farmers familiar with acres)
    const yieldPerAcre = {
      low: Math.round(yieldRange.low * 0.4047), // hectare to acre conversion
      expected: Math.round(yieldRange.expected * 0.4047),
      high: Math.round(yieldRange.high * 0.4047)
    };
  
    // Total farm yield if farm size provided
    let totalYield = null;
    if (farmSize) {
      totalYield = {
        low: Math.round(yieldRange.low * farmSize),
        expected: Math.round(yieldRange.expected * farmSize),
        high: Math.round(yieldRange.high * farmSize)
      };
    }
  
    return {
      success: true,
      crop: crop,
      growthStage: growthStage,
      yieldCategory: yieldCategory,
      categoryDescription: categoryDescription,
      yieldPerHectare: yieldRange,
      yieldPerAcre: yieldPerAcre,
      totalYield: totalYield,
      adjustmentFactor: Math.round(adjustmentFactor * 100) / 100,
      affectingFactors: affectingFactors,
      recommendations: recommendations,
      confidence: getConfidenceLevel(inputs),
      disclaimer: 'This is an estimate based on your observations. Actual yield may vary based on weather and other factors.',
      nextSteps: getNextSteps(growthStage, crop, recommendations)
    };
  }
  
  /**
   * Get confidence level based on input completeness
   */
  function getConfidenceLevel(inputs) {
    let score = 0;
    const totalFields = 10;
    
    if (inputs.crop) score++;
    if (inputs.growthStage) score++;
    if (inputs.sowingTime) score++;
    if (inputs.plantHealth) score++;
    if (inputs.leafColor) score++;
    if (inputs.pestDiseaseImpact) score++;
    if (inputs.rainfallExperience) score++;
    if (inputs.waterAvailability) score++;
    if (inputs.fertilizerUsage) score++;
    if (inputs.lastSeasonComparison) score++;
  
    const percentage = (score / totalFields) * 100;
    
    if (percentage >= 90) return 'High';
    if (percentage >= 70) return 'Medium';
    return 'Low';
  }
  
  /**
   * Get next steps based on growth stage
   */
  function getNextSteps(growthStage, crop, recommendations) {
    const steps = [];
    
    // Add stage-specific guidance
    if (growthStage === 'vegetative' || growthStage === 'tillering') {
      steps.push('Monitor plant density and gap filling');
      steps.push('Ensure adequate nitrogen availability');
    } else if (growthStage === 'flowering') {
      steps.push('Critical stage - ensure no water stress');
      steps.push('Protect from pest damage during flowering');
    } else if (growthStage === 'grain_filling' || growthStage === 'fruit_development') {
      steps.push('Maintain irrigation schedule');
      steps.push('Monitor for late-stage diseases');
    } else if (growthStage === 'maturity') {
      steps.push('Plan timely harvest to avoid losses');
      steps.push('Arrange labor and equipment in advance');
    }
    
    // Add top 3 recommendations
    steps.push(...recommendations.slice(0, 3));
    
    return steps.filter((step, index, self) => self.indexOf(step) === index); // Remove duplicates
  }
  
  /**
   * Get historical comparison for trend analysis
   */
  function getYieldTrend(currentInputs, previousPredictions) {
    if (!previousPredictions || previousPredictions.length === 0) {
      return null;
    }
  
    // Simple trend analysis
    const trends = previousPredictions.map(pred => pred.adjustmentFactor);
    const avgPastFactor = trends.reduce((a, b) => a + b, 0) / trends.length;
    const currentFactor = currentInputs.adjustmentFactor;
  
    let trend = 'stable';
    if (currentFactor > avgPastFactor * 1.1) trend = 'improving';
    if (currentFactor < avgPastFactor * 0.9) trend = 'declining';
  
    return {
      trend: trend,
      message: trend === 'improving' 
        ? 'Your crop management is improving over time' 
        : trend === 'declining' 
        ? 'Consider reviewing your farming practices'
        : 'Consistent crop performance'
    };
  }
  
  module.exports = {
    calculateYieldEstimate,
    BASE_YIELDS,
    CRITICAL_STAGES,
    getYieldTrend
  };