/**
 * Comprehensive Disease Knowledge Base for AgriSathi
 * Stores epidemiological rules, weather requirements, target organs, vulnerable stages,
 * soil/water risk factors, and registered chemical & organic treatments.
 */
const EPIDEMIOLOGICAL_DATABASE = {
  // 🌾 WHEAT DISEASES
  'Common bunt (Tilletia caries)': {
    crop: 'Wheat',
    organ: 'spike',
    vulnerable_stages: ['seedling', 'flowering', 'fruiting'],
    weather: { minTemp: 5, optTempMin: 10, optTempMax: 18, maxTemp: 25, minRH: 70, minRainfall: 5 },
    soil: { minpH: 5.5, maxpH: 7.5, maxMoisture: 80 },
    water: { maxEC: 3.0 },
    irrigation_risk: 'overhead',
    contradiction_organs: ['leaf'],
    treatment: {
      immediate: [
        { action: 'Isolate & Rogue Contaminated Earheads', priority: 'critical', description: 'Carefully bag and remove infected black earheads from the field before spores disperse to neighboring plants.', materials: ['Plastic Collection Bags', 'Pruning Shears'] },
        { action: 'Separate Seed Bin Processing', priority: 'high', description: 'Process contaminated grain lots separately and thoroughly sanitize threshers with 2% sodium hypochlorite solution.', materials: ['Sanitizer Spray'] }
      ],
      chemical: [
        {
          name: 'Carboxin 37.5% + Thiram 37.5% DS (Vitavax Power)',
          type: 'Systemic & Contact Seed Dresser',
          dosage: '2.5 to 3.0 grams per kg of wheat seed',
          applicationMethod: 'Dry or slurry seed treatment prior to sowing in seed coating drum.',
          frequency: 'Single application before sowing',
          safetyPrecautions: ['Wear nitrile gloves and N95 dust mask while mixing seed.', 'Do not use treated grain for human consumption or animal feed.'],
          PHI: 'Seed Treatment at Sowing (0 days PHI)'
        },
        {
          name: 'Tebuconazole 2% DS (Raxil)',
          type: 'Systemic Triazole Seed Treatment',
          dosage: '1.25 grams per kg seed',
          applicationMethod: 'Mix uniformly with moist seed in seed treatment drum.',
          frequency: 'Single seed treatment',
          safetyPrecautions: ['Use protective eyewear and gloves.', 'Store away from foodstuffs.'],
          PHI: 'Seed Treatment'
        }
      ],
      organic: [
        {
          name: 'Thermal Hot Water Seed Disinfection',
          ingredients: ['Pre-soaked Wheat Seeds', 'Hot Water Bath (52°C)', 'Cold Water Tank'],
          preparation: 'Pre-soak wheat seeds in ambient clean water for 4 hours. Submerge in hot water bath maintained precisely at 52°C for exactly 11 minutes.',
          application: 'Cool rapidly in cold water tank, then spread in a thin layer under direct sunlight to dry completely.',
          frequency: 'Once before sowing'
        },
        {
          name: 'Bio-Fungicide Seed Coating (Trichoderma viride 1% WP)',
          ingredients: ['Trichoderma viride 1% WP - 10g/kg', 'Jaggery Water Solution (5%) - 50ml/kg'],
          preparation: 'Dissolve 50g jaggery in 1L warm water to make a sticky solution. Sprinkle over 10kg seed, then coat evenly with 100g Trichoderma viride powder.',
          application: 'Dry in shade for 30 minutes before sowing in moist field.',
          frequency: 'Single seed treatment'
        }
      ]
    }
  },

  'Loose smut (Ustilago tritici)': {
    crop: 'Wheat',
    organ: 'spike',
    vulnerable_stages: ['flowering'],
    weather: { minTemp: 12, optTempMin: 18, optTempMax: 24, maxTemp: 30, minRH: 65, minRainfall: 2 },
    soil: { minpH: 6.0, maxpH: 7.8 },
    water: { maxEC: 3.0 },
    irrigation_risk: 'overhead',
    contradiction_organs: ['leaf'],
    treatment: {
      immediate: [
        { action: 'Early Field Roguing of Black Earheads', priority: 'critical', description: 'Enclose infected smutted earheads in wet cloth bags before pulling plants to prevent airborne spore dispersion.', materials: ['Wet Cloth Bag'] }
      ],
      chemical: [
        {
          name: 'Tebuconazole 2% DS (Raxil 2DS)',
          type: 'Systemic Fungicide Seed Dresser',
          dosage: '1.25 grams per kg seed',
          applicationMethod: 'Coat seed thoroughly before sowing',
          frequency: 'Single application',
          safetyPrecautions: ['Wear rubber gloves and mask.', 'Keep out of reach of children.'],
          PHI: 'Seed Treatment'
        }
      ],
      organic: [
        {
          name: 'Solar Heat Seed Treatment (Jensen Method)',
          ingredients: ['Clean Wheat Seeds', 'Water Tank', 'Clean Drying Sheet / Tarpaulin'],
          preparation: 'Soak seeds in water for 4 hours (8 AM to 12 PM) on a hot summer day. Spread soaked seeds in a thin layer on a black plastic sheet under bright sun (12 PM to 4 PM).',
          application: 'Allow temperature to reach 50-54°C to destroy internal smut mycelium.',
          frequency: 'Once in May-June before sowing'
        }
      ]
    }
  },

  // 🍅 TOMATO DISEASES
  'Tomato Early Blight (Alternaria solani)': {
    crop: 'Tomato',
    organ: 'leaf',
    vulnerable_stages: ['vegetative', 'flowering', 'fruiting'],
    weather: { minTemp: 15, optTempMin: 24, optTempMax: 30, maxTemp: 38, minRH: 75, minRainfall: 5 },
    soil: { minpH: 5.5, maxpH: 7.2, lowNitrogenRisk: true },
    water: { maxEC: 2.5 },
    irrigation_risk: 'overhead',
    treatment: {
      immediate: [
        { action: 'Prune Lower Chlorotic Foliage', priority: 'high', description: 'Remove infected lower leaves with target-ring spots up to 30 cm from soil level to break splash dispersal.', materials: ['Pruning Shears', 'Sanitizer'] }
      ],
      chemical: [
        {
          name: 'Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo)',
          type: 'Broad-Spectrum Systemic Fungicide',
          dosage: '0.7 grams per Liter of water (140g in 200L water per acre)',
          applicationMethod: 'Foliar spray using hollow-cone nozzle during early morning (6:30-9:00 AM).',
          frequency: '2 sprays at 14-day intervals',
          safetyPrecautions: ['Wear full protective clothing, nitrile gloves, and respirator mask.', 'Do not spray during high temperatures (>35°C) or strong wind.'],
          PHI: '14 Days Pre-Harvest Interval'
        },
        {
          name: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)',
          type: 'Dual-Action Systemic Fungicide',
          dosage: '1.0 ml per Liter of water (200ml per acre)',
          applicationMethod: 'Apply fine foliar mist at early symptom onset.',
          frequency: 'Repeat after 12-14 days if wet weather persists',
          safetyPrecautions: ['Avoid skin contact and inhalation.', 'Do not contaminate nearby irrigation ponds.'],
          PHI: '7 Days PHI'
        }
      ],
      organic: [
        {
          name: 'Cold-Pressed Neem Oil (10,000 PPM) + Bio-Shield Emulsion',
          ingredients: ['Neem Oil 10,000 PPM - 5ml/L', 'Organic Liquid Soap Emulsifier - 1ml/L', 'Trichoderma viride WP - 5g/L'],
          preparation: 'Mix 5ml Neem Oil with 1ml liquid soap in 100ml warm water (35°C). Shake vigorously until milky, then dilute into 1L water with 5g Trichoderma.',
          application: 'Spray thoroughly on upper and lower leaf surfaces during late afternoon (after 4:30 PM).',
          frequency: 'Apply every 5 to 7 days for 3 consecutive weeks'
        },
        {
          name: 'Bordeaux Mixture (1% Prophylactic Spray)',
          ingredients: ['Copper Sulfate - 10g/L', 'Quick Lime (Calcium Oxide) - 10g/L', 'Clean Water - 1L'],
          preparation: 'Dissolve 10g Copper Sulfate in 500ml water. Separately slake 10g Lime in 500ml water. Pour Copper solution into Lime suspension while stirring continuously.',
          application: 'Test pH (should be neutral pH 7.0), then spray immediately.',
          frequency: 'Apply every 10-12 days during humid rainy weather'
        }
      ]
    }
  },

  'Tomato Late Blight (Phytophthora infestans)': {
    crop: 'Tomato',
    organ: 'leaf',
    vulnerable_stages: ['vegetative', 'flowering', 'fruiting'],
    weather: { minTemp: 10, optTempMin: 17, optTempMax: 22, maxTemp: 28, minRH: 85, minRainfall: 15 },
    soil: { minpH: 5.0, maxpH: 7.5, highMoistureRisk: true },
    water: { maxEC: 3.0 },
    irrigation_risk: 'overhead',
    treatment: {
      immediate: [
        { action: 'Stop Overhead Sprinkler Irrigation Immediately', priority: 'critical', description: 'Switch to drip irrigation immediately to keep leaves completely dry during cool humid weather.', materials: ['Drip Line'] }
      ],
      chemical: [
        {
          name: 'Cymoxanil 8% + Mancozeb 64% WP (Curzate M8)',
          type: 'Curative & Protective Systemic Fungicide',
          dosage: '2.5 grams per Liter of water (500g in 200L per acre)',
          applicationMethod: 'Foliar spray with thorough coverage on both leaf surfaces at first symptom.',
          frequency: 'Apply twice at 10-12 day intervals',
          safetyPrecautions: ['Wear nitrile gloves, mask, and goggles.', 'Do not enter field for 24 hours after spraying.'],
          PHI: '14 Days PHI'
        },
        {
          name: 'Dimethomorph 50% WP (Acrobat)',
          type: 'Systemic Oomycete Specialist',
          dosage: '1.0 gram per Liter of water',
          applicationMethod: 'Spray uniformly over plant canopy.',
          frequency: 'Every 10 days',
          safetyPrecautions: ['Wear protective gear.', 'Do not allow washings into fish ponds.'],
          PHI: '14 Days PHI'
        }
      ],
      organic: [
        {
          name: 'Pseudomonas fluorescens 1% WP Bio-Fungicide',
          ingredients: ['Pseudomonas fluorescens 1% WP - 10g/L', 'Jaggery Solution - 2g/L'],
          preparation: 'Dissolve 10g Bio-agent powder in 1L water with 2g jaggery. Allow to sit for 2 hours for bacterial activation.',
          application: 'Foliar spray during evening hours.',
          frequency: 'Apply every 7 days in foggy cool weather'
        }
      ]
    }
  },

  // 🌾 RICE DISEASES
  'Rice Blast (Pyricularia oryzae)': {
    crop: 'Rice',
    organ: 'leaf',
    vulnerable_stages: ['tillering', 'panicle-initiation', 'flowering'],
    weather: { minTemp: 18, optTempMin: 24, optTempMax: 28, maxTemp: 35, minRH: 85, minRainfall: 10 },
    soil: { minpH: 5.0, maxpH: 7.0, highNitrogenRisk: true },
    water: { maxEC: 2.0 },
    irrigation_risk: 'none',
    treatment: {
      immediate: [
        { action: 'Split Urea Dose & Regulate Water Level', priority: 'high', description: 'Stop excess top-dressing of urea fertilizer and maintain 5 cm standing water layer in paddy field.', materials: [] }
      ],
      chemical: [
        {
          name: 'Tricyclazole 75% WP (Beam)',
          type: 'Systemic Blast Specialist Fungicide',
          dosage: '0.6 grams per Liter of water (120g per acre in 200L water)',
          applicationMethod: 'Foliar spray at panicle initiation stage (booting) and 10 days later.',
          frequency: '2 applications at 10-14 day interval',
          safetyPrecautions: ['Wear nitrile gloves and face mask.', 'Do not spray when rain is imminent within 4 hours.'],
          PHI: '30 Days PHI'
        },
        {
          name: 'Isoprothiolane 40% EC (Fuji-One)',
          type: 'Systemic Blast Fungicide & Plant Growth Enhancer',
          dosage: '1.5 ml per Liter of water (300ml per acre)',
          applicationMethod: 'Foliar spray at first appearance of eye-shaped leaf lesions.',
          frequency: '1-2 applications',
          safetyPrecautions: ['Wear protective clothes.', 'Avoid spraying near aquaculture tanks.'],
          PHI: '21 Days PHI'
        }
      ],
      organic: [
        {
          name: 'Pseudomonas fluorescens + Neem Cake Extract',
          ingredients: ['Pseudomonas fluorescens 1% WP - 10g/L', 'Neem Cake Extract - 50ml/L'],
          preparation: 'Soak 50g Neem Cake in 1L water overnight, filter extract, then add 10g Pseudomonas powder.',
          application: 'Spray thoroughly on paddy canopy during late afternoon.',
          frequency: 'Apply every 7-10 days'
        }
      ]
    }
  }
};

const DISEASE_BINOMIAL_MAP = {
  'Common bunt (Tilletia caries)': 'Tilletia caries',
  'Loose smut (Ustilago tritici)': 'Ustilago tritici',
  'Loose smut': 'Ustilago tritici',
  'Common bunt': 'Tilletia caries',
  'Wheat Rust (Puccinia spp.)': 'Puccinia recondita f. sp. tritici',
  'Wheat Leaf Rust': 'Puccinia recondita f. sp. tritici',
  'Leaf Rust': 'Puccinia recondita f. sp. tritici',
  'Yellow Rust': 'Puccinia striiformis',
  'Stripe Rust': 'Puccinia striiformis',
  'Septoria Blight': 'Zymoseptoria tritici',
  'Tomato Early Blight (Alternaria solani)': 'Alternaria solani',
  'Tomato Early Blight': 'Alternaria solani',
  'Early Blight': 'Alternaria solani',
  'Tomato Late Blight (Phytophthora infestans)': 'Phytophthora infestans',
  'Tomato Late Blight': 'Phytophthora infestans',
  'Late Blight': 'Phytophthora infestans',
  'Tomato Leaf Curl': 'Tomato yellow leaf curl virus (TYLCV)',
  'Tomato Yellow Leaf Curl Virus (TYLCV)': 'Tomato yellow leaf curl virus (TYLCV)',
  'Tomato Septoria Leaf Spot': 'Septoria lycopersici',
  'Rice Blast (Pyricularia oryzae)': 'Pyricularia oryzae',
  'Rice Blast': 'Pyricularia oryzae',
  'Rice Brown Spot (Cochliobolus miyabeanus)': 'Cochliobolus miyabeanus',
  'Rice Brown Spot': 'Cochliobolus miyabeanus',
  'Brown Spot': 'Cochliobolus miyabeanus',
  'Bacterial Leaf Blight (Xanthomonas oryzae)': 'Xanthomonas oryzae pv. oryzae',
  'Bacterial Blight': 'Xanthomonas oryzae pv. oryzae',
  'Sheath Blight': 'Rhizoctonia solani',
  'Potato Late Blight': 'Phytophthora infestans',
  'Potato Early Blight': 'Alternaria solani',
  'Foliar Spot': 'Cercospora spp.',
  'Powdery Mildew': 'Erysiphe cichoracearum',
  'Healthy Wheat Crop': 'N/A (Healthy Organism)',
  'Healthy Rice Crop': 'N/A (Healthy Organism)',
  'Healthy Tomato Plant': 'N/A (Healthy Organism)',
  'Healthy Plant': 'N/A (Healthy Organism)'
};

class DiseaseKnowledgeBase {
  getDiseaseRule(diseaseName) {
    if (!diseaseName) return {};
    for (const [key, rule] of Object.entries(EPIDEMIOLOGICAL_DATABASE)) {
      if (diseaseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(diseaseName.toLowerCase())) {
        return rule;
      }
    }
    return {
      crop: 'General Crop',
      organ: 'leaf',
      vulnerable_stages: ['vegetative', 'flowering'],
      weather: { minTemp: 15, optTempMin: 22, optTempMax: 30, maxTemp: 38, minRH: 75, minRainfall: 5 },
      soil: { minpH: 5.5, maxpH: 7.5 },
      water: { maxEC: 3.0 },
      irrigation_risk: 'overhead',
      treatment: {
        immediate: [
          { action: 'Isolate Infected Foliage & Improve Airflow', priority: 'high', description: 'Prune heavily spotted leaf canopy and maintain proper drainage.', materials: ['Pruning Shears'] }
        ],
        chemical: [
          {
            name: 'Mancozeb 75% WP + Carbendazim 12% (SAAF)',
            type: 'Systemic & Contact Broad-Spectrum Fungicide',
            dosage: '2.0 grams per Liter of water',
            applicationMethod: 'Foliar spray during early morning hours after dew dries.',
            frequency: 'Every 10 to 14 days',
            safetyPrecautions: ['Wear rubber gloves, goggles, and face mask during spraying.'],
            PHI: '14 Days PHI'
          }
        ],
        organic: [
          {
            name: 'Neem Oil Emulsion (10,000 PPM) + Bio-Fungicide',
            ingredients: ['Neem Oil 10,000 PPM - 5ml/L', 'Liquid Soap - 1ml/L', 'Trichoderma viride - 5g/L'],
            preparation: 'Mix 5ml Neem Oil and 1ml soap in 100ml warm water, shake until milky emulsion forms, dilute in 900ml water with 5g Trichoderma.',
            application: 'Foliar spray upper and lower leaf surfaces during late afternoon.',
            frequency: 'Every 7 days for 3 consecutive weeks'
          }
        ]
      }
    };
  }

  getScientificName(diseaseName) {
    if (!diseaseName) return '';
    for (const [key, sci] of Object.entries(DISEASE_BINOMIAL_MAP)) {
      if (diseaseName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(diseaseName.toLowerCase())) {
        return sci;
      }
    }
    return '';
  }

  assertBinomialMatch(commonName, sciName) {
    const expected = this.getScientificName(commonName);
    if (expected && sciName && expected.toLowerCase() !== sciName.toLowerCase()) {
      console.warn(`⚠️ BINOMIAL MISMATCH ASSERTION: Common '${commonName}' mapped to '${sciName}', expected '${expected}'`);
      return false;
    }
    return true;
  }
}

module.exports = new DiseaseKnowledgeBase();
