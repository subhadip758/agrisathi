/**
 * Symptom to Nutrient Deficiency Mappings
 * Maps visual symptoms to probable nutrient deficiencies
 */

const symptomDatabase = {
    // Nitrogen deficiency symptoms
    yellowLeaves: {
      name: 'Yellow Leaves (especially older leaves)',
      icon: '🍂',
      probableDeficiency: ['N'],
      confidence: 'high',
      description: 'Older leaves turn yellow while new leaves remain green',
      additionalInfo: 'Most common nutrient deficiency'
    },
  
    stuntedGrowth: {
      name: 'Slow/Stunted Growth',
      icon: '📉',
      probableDeficiency: ['N', 'P'],
      confidence: 'medium',
      description: 'Plant grows slower than expected, appears small',
      additionalInfo: 'Check if accompanied by other symptoms'
    },
  
    paleGreen: {
      name: 'Pale Green Color',
      icon: '🌿',
      probableDeficiency: ['N', 'Fe'],
      confidence: 'medium',
      description: 'Overall light green or pale appearance',
      additionalInfo: 'Common in nitrogen deficiency'
    },
  
    // Phosphorus deficiency symptoms
    poorFlowering: {
      name: 'Poor Flowering/Few Flowers',
      icon: '🌸',
      probableDeficiency: ['P'],
      confidence: 'high',
      description: 'Reduced number of flowers or delayed flowering',
      additionalInfo: 'Apply phosphorus-rich fertilizer'
    },
  
    purpleLeaves: {
      name: 'Purple/Reddish Leaves',
      icon: '🍇',
      probableDeficiency: ['P'],
      confidence: 'high',
      description: 'Leaves develop purple or reddish tint, especially undersides',
      additionalInfo: 'Common in cold weather with P deficiency'
    },
  
    darkGreenLeaves: {
      name: 'Dark Green Leaves with Purple Tint',
      icon: '🌑',
      probableDeficiency: ['P'],
      confidence: 'medium',
      description: 'Abnormally dark green color with purple edges',
      additionalInfo: 'Often seen in seedling stage'
    },
  
    delayedMaturity: {
      name: 'Delayed Maturity/Ripening',
      icon: '⏱️',
      probableDeficiency: ['P'],
      confidence: 'medium',
      description: 'Crop takes longer to mature than normal',
      additionalInfo: 'Affects fruit and grain development'
    },
  
    // Potassium deficiency symptoms
    brownEdges: {
      name: 'Brown/Yellow Leaf Edges',
      icon: '🔥',
      probableDeficiency: ['K'],
      confidence: 'high',
      description: 'Leaf margins turn brown or yellow (scorching)',
      additionalInfo: 'Starts from older leaves'
    },
  
    weakStems: {
      name: 'Weak/Thin Stems',
      icon: '🎋',
      probableDeficiency: ['K'],
      confidence: 'high',
      description: 'Stems are weak, plants lodge (fall over) easily',
      additionalInfo: 'Reduces structural strength'
    },
  
    smallFruits: {
      name: 'Small Fruits/Poor Fruit Quality',
      icon: '🍅',
      probableDeficiency: ['K'],
      confidence: 'high',
      description: 'Fruits are smaller than normal, poor quality',
      additionalInfo: 'Affects yield and market value'
    },
  
    leafCurling: {
      name: 'Leaf Curling',
      icon: '🌀',
      probableDeficiency: ['K', 'Ca'],
      confidence: 'medium',
      description: 'Leaves curl downward or become distorted',
      additionalInfo: 'Can also indicate water stress'
    },
  
    // Calcium deficiency symptoms
    blossomEndRot: {
      name: 'Blossom End Rot (Tomato/Pepper)',
      icon: '🥀',
      probableDeficiency: ['Ca'],
      confidence: 'high',
      description: 'Dark sunken spots on fruit bottom',
      additionalInfo: 'Common in tomatoes and peppers'
    },
  
    tipBurn: {
      name: 'Tip Burn/Dead Growing Tips',
      icon: '☠️',
      probableDeficiency: ['Ca', 'B'],
      confidence: 'high',
      description: 'Growing tips die or turn brown',
      additionalInfo: 'Affects new growth'
    },
  
    // Magnesium deficiency symptoms
    interveinalChlorosis: {
      name: 'Yellow Between Leaf Veins',
      icon: '🎨',
      probableDeficiency: ['Mg', 'Fe', 'Mn'],
      confidence: 'medium',
      description: 'Yellowing between veins while veins stay green',
      additionalInfo: 'Common in older leaves for Mg'
    },
  
    // Sulfur deficiency symptoms
    uniformYellowing: {
      name: 'Uniform Light Green/Yellow (young leaves)',
      icon: '💛',
      probableDeficiency: ['S', 'N'],
      confidence: 'medium',
      description: 'Young leaves turn yellow uniformly',
      additionalInfo: 'Similar to N but affects young leaves first'
    },
  
    // Iron deficiency symptoms
    whiteLeaves: {
      name: 'White/Very Pale Young Leaves',
      icon: '⚪',
      probableDeficiency: ['Fe'],
      confidence: 'high',
      description: 'New leaves appear almost white or very pale',
      additionalInfo: 'Common in high pH soils'
    },
  
    // Zinc deficiency symptoms
    shortenedInternodes: {
      name: 'Shortened Stem Sections/Rosetting',
      icon: '🌹',
      probableDeficiency: ['Zn'],
      confidence: 'high',
      description: 'Very short distance between leaves, bushy appearance',
      additionalInfo: 'Common in rice and maize'
    },
  
    // Multiple/General symptoms
    overallPoorHealth: {
      name: 'Overall Poor Health',
      icon: '😷',
      probableDeficiency: ['N', 'P', 'K'],
      confidence: 'low',
      description: 'General unhealthy appearance, multiple issues',
      additionalInfo: 'May need complete fertilization'
    },
  
    prematureLeafDrop: {
      name: 'Premature Leaf Drop',
      icon: '🍃',
      probableDeficiency: ['N', 'K'],
      confidence: 'medium',
      description: 'Leaves falling off earlier than normal',
      additionalInfo: 'Check for other symptoms'
    }
  };
  
  /**
   * Analyze symptoms and return probable deficiencies
   */
  const analyzeSymptoms = (selectedSymptoms) => {
    if (!selectedSymptoms || selectedSymptoms.length === 0) {
      return {
        deficiencies: [],
        confidence: 'none',
        recommendation: 'Please select symptoms to analyze'
      };
    }
  
    // Collect all deficiencies from symptoms
    const deficiencyCount = {};
    const confidenceLevels = [];
  
    selectedSymptoms.forEach(symptom => {
      const symptomData = symptomDatabase[symptom];
      if (symptomData) {
        symptomData.probableDeficiency.forEach(def => {
          deficiencyCount[def] = (deficiencyCount[def] || 0) + 1;
        });
        confidenceLevels.push(symptomData.confidence);
      }
    });
  
    // Sort deficiencies by occurrence
    const sortedDeficiencies = Object.entries(deficiencyCount)
      .sort((a, b) => b[1] - a[1])
      .map(([nutrient, count]) => ({ nutrient, count }));
  
    // Determine overall confidence
    let overallConfidence = 'low';
    if (selectedSymptoms.length === 1 && confidenceLevels[0] === 'high') {
      overallConfidence = 'high';
    } else if (sortedDeficiencies.length > 0 && sortedDeficiencies[0].count >= 2) {
      overallConfidence = 'medium';
    } else if (selectedSymptoms.length >= 3) {
      overallConfidence = 'medium';
    }
  
    return {
      deficiencies: sortedDeficiencies,
      primaryDeficiency: sortedDeficiencies[0]?.nutrient || null,
      secondaryDeficiency: sortedDeficiencies[1]?.nutrient || null,
      confidence: overallConfidence,
      symptomDetails: selectedSymptoms.map(s => symptomDatabase[s])
    };
  };
  
  /**
   * Get all symptoms grouped by nutrient
   */
  const getSymptomsByNutrient = () => {
    const grouped = {
      N: [],
      P: [],
      K: [],
      Ca: [],
      Mg: [],
      S: [],
      Fe: [],
      Zn: [],
      B: [],
      Mn: []
    };
  
    Object.entries(symptomDatabase).forEach(([key, symptom]) => {
      symptom.probableDeficiency.forEach(nutrient => {
        if (grouped[nutrient]) {
          grouped[nutrient].push({ key, ...symptom });
        }
      });
    });
  
    return grouped;
  };
  
  /**
   * Get all symptoms for display
   */
  const getAllSymptoms = () => {
    return Object.entries(symptomDatabase).map(([key, symptom]) => ({
      value: key,
      label: symptom.name,
      icon: symptom.icon,
      description: symptom.description,
      confidence: symptom.confidence
    }));
  };
  
  /**
   * Get symptom categories for better UI organization
   */
  const getSymptomCategories = () => {
    return {
      leafSymptoms: [
        'yellowLeaves',
        'paleGreen',
        'purpleLeaves',
        'darkGreenLeaves',
        'brownEdges',
        'leafCurling',
        'interveinalChlorosis',
        'uniformYellowing',
        'whiteLeaves',
        'prematureLeafDrop'
      ],
      growthSymptoms: [
        'stuntedGrowth',
        'weakStems',
        'shortenedInternodes',
        'overallPoorHealth'
      ],
      flowerFruitSymptoms: [
        'poorFlowering',
        'delayedMaturity',
        'smallFruits',
        'blossomEndRot',
        'tipBurn'
      ]
    };
  };
  
  module.exports = {
    symptomDatabase,
    analyzeSymptoms,
    getSymptomsByNutrient,
    getAllSymptoms,
    getSymptomCategories
  };