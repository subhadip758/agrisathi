/**
 * Soil Health Analysis Rules Engine
 * Maps farmer observations to soil health metrics without lab data
 * Uses agricultural knowledge-based rules
 */

// Nitrogen estimation rules
const estimateNitrogen = (leafColor, cropYield, plantGrowth) => {
  let score = 50; // baseline
  
  // Leaf color is primary indicator of nitrogen
  if (leafColor === 'dark_green') score += 25;
  else if (leafColor === 'light_green') score += 10;
  else if (leafColor === 'yellow_green') score -= 10;
  else if (leafColor === 'yellow') score -= 25;
  else if (leafColor === 'pale_yellow') score -= 35;
  
  // Crop yield correlation
  if (cropYield === 'excellent') score += 15;
  else if (cropYield === 'good') score += 5;
  else if (cropYield === 'average') score += 0;
  else if (cropYield === 'poor') score -= 15;
  else if (leafColor === 'very_poor') score -= 25;
  
  // Plant growth rate
  if (plantGrowth === 'very_fast') score += 10;
  else if (plantGrowth === 'fast') score += 5;
  else if (plantGrowth === 'slow') score -= 10;
  else if (plantGrowth === 'very_slow') score -= 20;
  
  const level = score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
  return { score: Math.max(0, Math.min(100, score)), level };
};

// Phosphorus estimation rules
const estimatePhosphorus = (rootDevelopment, floweringFruiting, oldLeafColor) => {
  let score = 50;
  
  // Root development is key indicator
  if (rootDevelopment === 'excellent') score += 25;
  else if (rootDevelopment === 'good') score += 10;
  else if (rootDevelopment === 'weak') score -= 15;
  else if (rootDevelopment === 'very_weak') score -= 30;
  
  // Flowering and fruiting
  if (floweringFruiting === 'abundant') score += 20;
  else if (floweringFruiting === 'normal') score += 5;
  else if (floweringFruiting === 'poor') score -= 15;
  else if (floweringFruiting === 'very_poor') score -= 25;
  
  // Old leaves turning purple/dark indicates P deficiency
  if (oldLeafColor === 'dark_green') score += 10;
  else if (oldLeafColor === 'purple_tint') score -= 20;
  else if (oldLeafColor === 'dark_purple') score -= 30;
  
  const level = score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
  return { score: Math.max(0, Math.min(100, score)), level };
};

// Potassium estimation rules
const estimatePotassium = (leafEdges, stemStrength, diseaseResistance, droughtTolerance) => {
  let score = 50;
  
  // Leaf edge burning is classic K deficiency
  if (leafEdges === 'healthy_green') score += 20;
  else if (leafEdges === 'slight_yellowing') score -= 10;
  else if (leafEdges === 'brown_edges') score -= 25;
  else if (leafEdges === 'burnt_curled') score -= 35;
  
  // Stem strength
  if (stemStrength === 'very_strong') score += 15;
  else if (stemStrength === 'strong') score += 5;
  else if (stemStrength === 'weak') score -= 15;
  else if (stemStrength === 'very_weak') score -= 25;
  
  // Disease resistance
  if (diseaseResistance === 'high') score += 10;
  else if (diseaseResistance === 'medium') score += 0;
  else if (diseaseResistance === 'low') score -= 15;
  
  // Drought tolerance
  if (droughtTolerance === 'high') score += 10;
  else if (droughtTolerance === 'low') score -= 10;
  
  const level = score >= 65 ? 'HIGH' : score >= 40 ? 'MEDIUM' : 'LOW';
  return { score: Math.max(0, Math.min(100, score)), level };
};

// Soil pH estimation
const estimateSoilPH = (soilColor, weedTypes, crustingBehavior) => {
  let phEstimate = 6.5; // neutral baseline
  
  // Soil color indicators
  if (soilColor === 'dark_brown_black') phEstimate += 0.5; // organic, slightly acidic
  else if (soilColor === 'red_brown') phEstimate += 0.3;
  else if (soilColor === 'light_gray_white') phEstimate += 1.5; // alkaline
  else if (soilColor === 'yellow_brown') phEstimate -= 0.5; // acidic
  
  // Weed types indicate pH
  if (weedTypes === 'clover_dandelion') phEstimate += 0.3; // neutral to alkaline
  else if (weedTypes === 'sorrel_moss') phEstimate -= 1.0; // acidic
  else if (weedTypes === 'thistle_mustard') phEstimate += 0.8; // alkaline
  
  // Crusting behavior
  if (crustingBehavior === 'hard_crust') phEstimate += 0.5; // alkaline tendency
  else if (crustingBehavior === 'no_crust') phEstimate -= 0.2;
  
  let category = 'NEUTRAL';
  if (phEstimate < 6.0) category = 'ACIDIC';
  else if (phEstimate > 7.5) category = 'ALKALINE';
  
  return { value: parseFloat(phEstimate.toFixed(1)), category };
};

// Soil texture analysis
const analyzeSoilTexture = (handFeel, crackingPattern, waterDrainage) => {
  let texture = 'LOAM';
  let organicMatter = 'MEDIUM';
  
  // Hand feel test
  if (handFeel === 'gritty_loose') {
    texture = 'SANDY';
    organicMatter = 'LOW';
  } else if (handFeel === 'sticky_smooth') {
    texture = 'CLAY';
    organicMatter = 'MEDIUM';
  } else if (handFeel === 'soft_crumbly') {
    texture = 'LOAM';
    organicMatter = 'HIGH';
  } else if (handFeel === 'silky_smooth') {
    texture = 'SILTY';
    organicMatter = 'MEDIUM';
  }
  
  // Cracking pattern
  if (crackingPattern === 'wide_deep_cracks') {
    texture = 'CLAY';
  } else if (crackingPattern === 'no_cracks') {
    texture = texture === 'LOAM' ? 'SANDY_LOAM' : 'SANDY';
  }
  
  // Drainage correlation
  if (waterDrainage === 'very_fast') {
    texture = texture.includes('SANDY') ? texture : 'SANDY';
    organicMatter = 'LOW';
  } else if (waterDrainage === 'very_slow') {
    texture = 'CLAY';
  }
  
  return { texture, organicMatter };
};

// Water holding capacity
const analyzeWaterCapacity = (waterDrainage, soilTexture) => {
  let capacity = 'MEDIUM';
  let irrigationNeeds = 'MODERATE';
  
  if (waterDrainage === 'very_fast') {
    capacity = 'LOW';
    irrigationNeeds = 'HIGH';
  } else if (waterDrainage === 'fast') {
    capacity = 'LOW_MEDIUM';
    irrigationNeeds = 'MODERATE_HIGH';
  } else if (waterDrainage === 'slow') {
    capacity = 'HIGH';
    irrigationNeeds = 'LOW';
  } else if (waterDrainage === 'very_slow') {
    capacity = 'VERY_HIGH';
    irrigationNeeds = 'VERY_LOW';
  }
  
  return { capacity, irrigationNeeds };
};

// Calculate overall soil health score
const calculateSoilHealthScore = (nitrogen, phosphorus, potassium, ph, texture, waterCapacity) => {
  // Weighted scoring
  const nitrogenWeight = 0.30;
  const phosphorusWeight = 0.25;
  const potassiumWeight = 0.25;
  const phWeight = 0.10;
  const textureWeight = 0.10;
  
  // Nitrogen contribution
  const nScore = nitrogen.score * nitrogenWeight;
  
  // Phosphorus contribution
  const pScore = phosphorus.score * phosphorusWeight;
  
  // Potassium contribution
  const kScore = potassium.score * potassiumWeight;
  
  // pH contribution (optimal range 6.0-7.5)
  let phScore = 100;
  if (ph.value < 5.5 || ph.value > 8.0) phScore = 40;
  else if (ph.value < 6.0 || ph.value > 7.5) phScore = 70;
  else phScore = 100;
  const phContribution = phScore * phWeight;
  
  // Texture contribution
  let textureScore = 70;
  if (texture === 'LOAM' || texture === 'SANDY_LOAM') textureScore = 100;
  else if (texture === 'CLAY' || texture === 'SANDY') textureScore = 60;
  const textureContribution = textureScore * textureWeight;
  
  const totalScore = nScore + pScore + kScore + phContribution + textureContribution;
  
  return Math.round(totalScore);
};

// Classify soil health
const classifySoilHealth = (score) => {
  if (score >= 75) return 'GOOD';
  if (score >= 50) return 'MEDIUM';
  return 'POOR';
};

// Detect deficiencies
const detectDeficiencies = (nitrogen, phosphorus, potassium, ph) => {
  const deficiencies = [];
  
  if (nitrogen.level === 'LOW') {
    deficiencies.push({
      nutrient: 'Nitrogen',
      severity: nitrogen.score < 25 ? 'HIGH' : 'MEDIUM',
      symptoms: [
        'Yellowing of leaves (especially older leaves)',
        'Slow plant growth',
        'Reduced crop yield',
        'Thin, weak stems'
      ],
      impact: 'Nitrogen is essential for leaf growth and green color. Low nitrogen severely reduces yield.'
    });
  }
  
  if (phosphorus.level === 'LOW') {
    deficiencies.push({
      nutrient: 'Phosphorus',
      severity: phosphorus.score < 25 ? 'HIGH' : 'MEDIUM',
      symptoms: [
        'Purple or dark color on older leaves',
        'Poor root development',
        'Delayed flowering and fruiting',
        'Stunted growth'
      ],
      impact: 'Phosphorus is crucial for root growth, flowering, and fruit formation.'
    });
  }
  
  if (potassium.level === 'LOW') {
    deficiencies.push({
      nutrient: 'Potassium',
      severity: potassium.score < 25 ? 'HIGH' : 'MEDIUM',
      symptoms: [
        'Brown or burnt leaf edges',
        'Weak stems that bend easily',
        'Poor disease resistance',
        'Reduced drought tolerance'
      ],
      impact: 'Potassium strengthens plants and improves disease resistance.'
    });
  }
  
  if (ph.category === 'ACIDIC' && ph.value < 5.5) {
    deficiencies.push({
      nutrient: 'pH Balance',
      severity: 'MEDIUM',
      symptoms: [
        'Nutrients locked in soil',
        'Aluminum toxicity possible',
        'Poor nutrient absorption'
      ],
      impact: 'Very acidic soil prevents plants from using available nutrients.'
    });
  }
  
  if (ph.category === 'ALKALINE' && ph.value > 8.0) {
    deficiencies.push({
      nutrient: 'pH Balance',
      severity: 'MEDIUM',
      symptoms: [
        'Iron deficiency (leaf yellowing with green veins)',
        'Phosphorus lockup',
        'Micronutrient deficiency'
      ],
      impact: 'Alkaline soil makes many nutrients unavailable to plants.'
    });
  }
  
  return deficiencies;
};

// Generate fertilizer recommendations
const generateFertilizerRecommendations = (nitrogen, phosphorus, potassium, ph, texture) => {
  const recommendations = [];
  
  // Nitrogen recommendations
  if (nitrogen.level === 'LOW') {
    recommendations.push({
      type: 'Nitrogen Fertilizer',
      priority: 'HIGH',
      options: [
        {
          name: 'Urea',
          quantity: '50-75 kg per acre',
          timing: 'Split application: Half at sowing, half after 30 days',
          cost: 'Low cost, easily available'
        },
        {
          name: 'Ammonium Sulphate',
          quantity: '75-100 kg per acre',
          timing: 'Apply before sowing and top dress after 30 days',
          cost: 'Medium cost, also provides sulfur'
        },
        {
          name: 'Organic Option: Compost',
          quantity: '2-3 tractor trolleys per acre',
          timing: 'Apply 2-3 weeks before sowing',
          cost: 'Low cost if made at farm'
        },
        {
          name: 'Green Manure',
          quantity: 'Grow dhaincha/moong and mix in soil',
          timing: '45 days before main crop',
          cost: 'Very low cost, improves soil structure'
        }
      ]
    });
  } else if (nitrogen.level === 'MEDIUM') {
    recommendations.push({
      type: 'Nitrogen Maintenance',
      priority: 'MEDIUM',
      options: [
        {
          name: 'Urea',
          quantity: '25-35 kg per acre',
          timing: 'Single application at 20-25 days after sowing',
          cost: 'Low cost'
        }
      ]
    });
  }
  
  // Phosphorus recommendations
  if (phosphorus.level === 'LOW') {
    recommendations.push({
      type: 'Phosphorus Fertilizer',
      priority: 'HIGH',
      options: [
        {
          name: 'DAP (Di-Ammonium Phosphate)',
          quantity: '50-75 kg per acre',
          timing: 'Apply at sowing time',
          cost: 'Medium cost, also provides nitrogen'
        },
        {
          name: 'SSP (Single Super Phosphate)',
          quantity: '100-125 kg per acre',
          timing: 'Mix in soil before sowing',
          cost: 'Low cost, also provides calcium and sulfur'
        },
        {
          name: 'Rock Phosphate (Organic)',
          quantity: '150-200 kg per acre',
          timing: 'Apply 1 month before sowing',
          cost: 'Medium cost, slow release, long lasting'
        }
      ]
    });
  }
  
  // Potassium recommendations
  if (potassium.level === 'LOW') {
    recommendations.push({
      type: 'Potassium Fertilizer',
      priority: 'HIGH',
      options: [
        {
          name: 'MOP (Muriate of Potash)',
          quantity: '25-40 kg per acre',
          timing: 'Apply before flowering stage',
          cost: 'Medium cost, most common potash fertilizer'
        },
        {
          name: 'SOP (Sulphate of Potash)',
          quantity: '30-50 kg per acre',
          timing: 'Apply at sowing or before flowering',
          cost: 'Higher cost, better for sensitive crops'
        },
        {
          name: 'Wood Ash (Organic)',
          quantity: '200-300 kg per acre',
          timing: 'Mix in soil before sowing',
          cost: 'Free if available, also provides calcium'
        }
      ]
    });
  }
  
  // NPK complex for multiple deficiencies
  if (nitrogen.level === 'LOW' && phosphorus.level === 'LOW') {
    recommendations.push({
      type: 'Complete NPK Fertilizer',
      priority: 'HIGH',
      options: [
        {
          name: 'NPK 12:32:16',
          quantity: '75-100 kg per acre',
          timing: 'Apply at sowing time',
          cost: 'Medium to high cost, balanced nutrition'
        }
      ]
    });
  }
  
  // pH correction
  if (ph.category === 'ACIDIC' && ph.value < 6.0) {
    recommendations.push({
      type: 'Lime (for acidic soil)',
      priority: 'HIGH',
      options: [
        {
          name: 'Agricultural Lime',
          quantity: '200-400 kg per acre (depending on acidity)',
          timing: 'Apply 2-3 months before sowing and mix well',
          cost: 'Low to medium cost, lasts 2-3 years'
        },
        {
          name: 'Dolomite Lime',
          quantity: '200-350 kg per acre',
          timing: 'Apply well before sowing',
          cost: 'Medium cost, also provides magnesium'
        }
      ]
    });
  }
  
  if (ph.category === 'ALKALINE' && ph.value > 7.5) {
    recommendations.push({
      type: 'Soil Amendment (for alkaline soil)',
      priority: 'MEDIUM',
      options: [
        {
          name: 'Gypsum',
          quantity: '200-400 kg per acre',
          timing: 'Apply before sowing and irrigate',
          cost: 'Low cost, improves water penetration'
        },
        {
          name: 'Sulfur',
          quantity: '50-100 kg per acre',
          timing: 'Apply 2-3 months before sowing',
          cost: 'Medium cost, gradually reduces pH'
        },
        {
          name: 'Organic Matter',
          quantity: '3-4 tractor trolleys compost per acre',
          timing: 'Apply before each crop season',
          cost: 'Low if made at farm, improves soil structure'
        }
      ]
    });
  }
  
  // Organic matter for all soil types
  if (texture === 'SANDY' || texture === 'CLAY') {
    recommendations.push({
      type: 'Soil Structure Improvement',
      priority: 'MEDIUM',
      options: [
        {
          name: 'Farm Compost',
          quantity: '3-5 tractor trolleys per acre',
          timing: 'Apply before each season',
          cost: 'Low cost, improves water holding and drainage'
        },
        {
          name: 'Vermicompost',
          quantity: '1-2 tractor trolleys per acre',
          timing: 'Apply at sowing time',
          cost: 'Medium cost, rich in nutrients and microbes'
        }
      ]
    });
  }
  
  return recommendations;
};

// Crop suitability recommendations
const recommendCrops = (soilHealth, nitrogen, phosphorus, potassium, ph, texture, waterCapacity) => {
  const crops = {
    highlyRecommended: [],
    recommended: [],
    possibleWithCare: [],
    notRecommended: []
  };
  
  // Rice
  if (texture === 'CLAY' && waterCapacity.capacity === 'HIGH' && ph.value >= 5.5 && ph.value <= 7.5) {
    if (soilHealth >= 60) crops.highlyRecommended.push({
      name: 'Rice',
      reason: 'Clay soil with good water holding capacity is ideal for rice',
      season: 'Kharif (monsoon)'
    });
    else crops.recommended.push({
      name: 'Rice',
      reason: 'Soil suitable but needs fertilizer application',
      season: 'Kharif (monsoon)'
    });
  }
  
  // Wheat
  if (ph.value >= 6.0 && ph.value <= 7.5 && texture !== 'SANDY') {
    if (nitrogen.level !== 'LOW' && phosphorus.level !== 'LOW' && soilHealth >= 65) {
      crops.highlyRecommended.push({
        name: 'Wheat',
        reason: 'Good pH and nutrient levels for wheat',
        season: 'Rabi (winter)'
      });
    } else {
      crops.recommended.push({
        name: 'Wheat',
        reason: 'Suitable with proper fertilizer application',
        season: 'Rabi (winter)'
      });
    }
  }
  
  // Cotton
  if (texture === 'CLAY' || texture === 'LOAM') {
    if (soilHealth >= 60 && potassium.level !== 'LOW') {
      crops.recommended.push({
        name: 'Cotton',
        reason: 'Good soil structure and potassium for cotton',
        season: 'Kharif'
      });
    } else {
      crops.possibleWithCare.push({
        name: 'Cotton',
        reason: 'Needs good nutrient management, especially potassium',
        season: 'Kharif'
      });
    }
  }
  
  // Sugarcane
  if (waterCapacity.capacity !== 'LOW' && texture !== 'SANDY') {
    if (soilHealth >= 65) {
      crops.recommended.push({
        name: 'Sugarcane',
        reason: 'Good water availability and soil fertility',
        season: 'Year-round crop'
      });
    }
  }
  
  // Pulses (लाल मसूर, मूंग, उड़द)
  if (ph.value >= 6.0 && ph.value <= 7.5) {
    if (soilHealth >= 50) {
      crops.recommended.push({
        name: 'Pulses - Moong/Urad (मूंग/उड़द)',
        reason: 'Pulses improve soil nitrogen, good for rotation',
        season: 'Kharif or summer'
      });
      crops.recommended.push({
        name: 'Pulses - Gram/Lentil (चना/मसूर)',
        reason: 'Suitable for moderate fertility soils',
        season: 'Rabi'
      });
    }
  }
  
  // Vegetables
  if (texture === 'LOAM' || texture === 'SANDY_LOAM') {
    if (soilHealth >= 60 && waterCapacity.irrigationNeeds !== 'VERY_LOW') {
      crops.highlyRecommended.push({
        name: 'Vegetables',
        reason: 'Loamy soil with good drainage is excellent for vegetables',
        season: 'Year-round with irrigation'
      });
    }
  }
  
  // Maize
  if (texture !== 'CLAY' && waterCapacity.capacity !== 'VERY_HIGH') {
    if (soilHealth >= 55 && nitrogen.level !== 'LOW') {
      crops.recommended.push({
        name: 'Maize',
        reason: 'Well-drained soil with adequate nitrogen',
        season: 'Kharif'
      });
    }
  }
  
  // Bajra (Pearl Millet) - drought tolerant
  if (texture === 'SANDY' || texture === 'SANDY_LOAM') {
    crops.recommended.push({
      name: 'Bajra',
      reason: 'Tolerates sandy soil and low water availability',
      season: 'Kharif'
    });
  }
  
  // Groundnut
  if (texture === 'SANDY_LOAM' && waterCapacity.capacity !== 'VERY_HIGH' && ph.value >= 6.0) {
    if (soilHealth >= 55 && calcium !== 'deficient') {
      crops.recommended.push({
        name: 'Groundnut',
        reason: 'Good drainage and loose soil for pod development',
        season: 'Kharif'
      });
    }
  }
  
  // If soil health is poor, add hardy crops
  if (soilHealth < 50) {
    crops.possibleWithCare.push({
      name: 'Green Manure Crops',
      reason: 'Grow dhaincha, moong to improve soil before main crop',
      season: 'Before main crop season'
    });
  }
  
  return crops;
};

// Generate improvement plan
const generateImprovementPlan = (soilHealth, deficiencies, texture) => {
  const plan = {
    immediate: [],
    shortTerm: [],
    longTerm: []
  };
  
  // Immediate actions (0-2 weeks)
  if (deficiencies.length > 0) {
    plan.immediate.push({
      action: 'Apply recommended fertilizers',
      description: 'Start with the high priority fertilizers mentioned above',
      timeframe: 'Before next sowing or as top dressing'
    });
  }
  
  plan.immediate.push({
    action: 'Test soil drainage',
    description: 'Dig a 1-foot hole, fill with water, see how fast it drains',
    timeframe: 'This week'
  });
  
  // Short-term (2-3 months)
  plan.shortTerm.push({
    action: 'Add organic matter',
    description: 'Apply compost, farmyard manure, or vermicompost',
    timeframe: '2-3 weeks before next sowing',
    benefit: 'Improves soil structure, water holding, and nutrient supply'
  });
  
  if (texture === 'SANDY') {
    plan.shortTerm.push({
      action: 'Mulching',
      description: 'Cover soil with crop residue or grass to reduce water loss',
      timeframe: 'After sowing',
      benefit: 'Reduces evaporation and adds organic matter'
    });
  }
  
  if (texture === 'CLAY') {
    plan.shortTerm.push({
      action: 'Add sand and organic matter',
      description: 'Mix sand and compost to improve drainage',
      timeframe: 'Before next season',
      benefit: 'Improves drainage and reduces waterlogging'
    });
  }
  
  // Long-term (6+ months)
  plan.longTerm.push({
    action: 'Crop rotation',
    description: 'Rotate between cereal crops and legumes (pulses)',
    timeframe: 'Every season',
    benefit: 'Legumes add nitrogen naturally, breaks pest cycles'
  });
  
  plan.longTerm.push({
    action: 'Build compost pit',
    description: 'Make your own compost from crop waste and animal manure',
    timeframe: 'Start anytime',
    benefit: 'Free, continuous supply of organic fertilizer'
  });
  
  if (soilHealth < 50) {
    plan.longTerm.push({
      action: 'Grow green manure crop',
      description: 'Dedicate one season to dhaincha/sunhemp, then mix in soil',
      timeframe: 'One full season',
      benefit: 'Dramatically improves soil fertility and structure'
    });
  }
  
  plan.longTerm.push({
    action: 'Reduce tillage',
    description: 'Avoid excessive plowing to preserve soil structure',
    timeframe: 'Ongoing',
    benefit: 'Maintains organic matter and soil life'
  });
  
  return plan;
};

// Main analysis function
const analyzeSoilFromObservations = (observations) => {
  // Extract observations
  const {
    // Plant observations
    leafColor,
    oldLeafColor,
    leafEdges,
    plantGrowth,
    stemStrength,
    rootDevelopment,
    floweringFruiting,
    
    // Crop performance
    cropYield,
    diseaseResistance,
    droughtTolerance,
    
    // Soil physical properties
    soilColor,
    handFeel,
    crackingPattern,
    waterDrainage,
    crustingBehavior,
    
    // Environmental indicators
    weedTypes
  } = observations;
  
  // Estimate nutrients
  const nitrogen = estimateNitrogen(leafColor, cropYield, plantGrowth);
  const phosphorus = estimatePhosphorus(rootDevelopment, floweringFruiting, oldLeafColor);
  const potassium = estimatePotassium(leafEdges, stemStrength, diseaseResistance, droughtTolerance);
  
  // Estimate pH
  const ph = estimateSoilPH(soilColor, weedTypes, crustingBehavior);
  
  // Analyze texture and water capacity
  const textureAnalysis = analyzeSoilTexture(handFeel, crackingPattern, waterDrainage);
  const waterCapacity = analyzeWaterCapacity(waterDrainage, textureAnalysis.texture);
  
  // Calculate health score
  const healthScore = calculateSoilHealthScore(
    nitrogen,
    phosphorus,
    potassium,
    ph,
    textureAnalysis.texture,
    waterCapacity
  );
  
  const healthClass = classifySoilHealth(healthScore);
  
  // Detect deficiencies
  const deficiencies = detectDeficiencies(nitrogen, phosphorus, potassium, ph);
  
  // Generate recommendations
  const fertilizerRecommendations = generateFertilizerRecommendations(
    nitrogen,
    phosphorus,
    potassium,
    ph,
    textureAnalysis.texture
  );
  
  const cropRecommendations = recommendCrops(
    healthScore,
    nitrogen,
    phosphorus,
    potassium,
    ph,
    textureAnalysis.texture,
    waterCapacity
  );
  
  const improvementPlan = generateImprovementPlan(
    healthScore,
    deficiencies,
    textureAnalysis.texture
  );
  
  // Return complete analysis
  return {
    healthScore,
    healthClass,
    nutrientLevels: {
      nitrogen,
      phosphorus,
      potassium
    },
    soilProperties: {
      ph,
      texture: textureAnalysis.texture,
      organicMatter: textureAnalysis.organicMatter,
      waterCapacity: waterCapacity.capacity,
      irrigationNeeds: waterCapacity.irrigationNeeds
    },
    deficiencies,
    fertilizerRecommendations,
    cropRecommendations,
    improvementPlan,
    summary: generateSummary(healthScore, healthClass, deficiencies)
  };
};

// Generate farmer-friendly summary
const generateSummary = (score, healthClass, deficiencies) => {
  let summary = '';
  
  if (healthClass === 'GOOD') {
    summary = `Congratulations! Your soil health is good (${score}/100). You can expect a good crop yield. `;
    summary += 'Keep applying organic fertilizers regularly.';
  } else if (healthClass === 'MEDIUM') {
    summary = `Your soil health is moderate (${score}/100). `;
    if (deficiencies.length > 0) {
      summary += `There are deficiencies in ${deficiencies.length} nutrients. `;
      summary += 'Applying the recommended fertilizers will improve your crop.';
    }
  } else {
    summary = `Your soil needs attention (${score}/100). `;
    if (deficiencies.length > 0) {
      summary += `There are serious deficiencies in ${deficiencies.length} nutrients. `;
      summary += 'Apply fertilizers immediately and increase the use of organic manure.';
    }
  }
  
  return summary;
};

module.exports = {
  analyzeSoilFromObservations,
  estimateNitrogen,
  estimatePhosphorus,
  estimatePotassium,
  estimateSoilPH,
  analyzeSoilTexture,
  analyzeWaterCapacity,
  generateSummary
};
