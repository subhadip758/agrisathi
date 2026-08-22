/**
 * Crop Nutrient Database
 * Contains crop-specific nutrient requirements, growth stage needs, and base fertilizer doses
 */

const cropDatabase = {
    rice: {
      name: 'Rice',
      seasons: ['Kharif', 'Rabi'],
      growthStages: {
        seedling: {
          duration: '0-21 days',
          npkRatio: { n: 20, p: 30, k: 10 },
          criticalNutrients: ['P'],
          baseDose: { urea: 0, dap: 50, mop: 0 } // kg per acre
        },
        vegetative: {
          duration: '22-55 days',
          npkRatio: { n: 50, p: 30, k: 20 },
          criticalNutrients: ['N'],
          baseDose: { urea: 60, dap: 0, mop: 20 }
        },
        flowering: {
          duration: '56-85 days',
          npkRatio: { n: 20, p: 30, k: 50 },
          criticalNutrients: ['P', 'K'],
          baseDose: { urea: 30, dap: 30, mop: 30 }
        },
        fruiting: {
          duration: '86-120 days',
          npkRatio: { n: 10, p: 20, k: 70 },
          criticalNutrients: ['K'],
          baseDose: { urea: 0, dap: 0, mop: 40 }
        }
      },
      totalNPK: { n: 120, p: 60, k: 40 }, // kg per acre for full season
      soilPreference: 'loamy',
      commonDeficiencies: ['N', 'Zn', 'Fe']
    },
  
    wheat: {
      name: 'Wheat',
      seasons: ['Rabi'],
      growthStages: {
        seedling: {
          duration: '0-25 days',
          npkRatio: { n: 20, p: 40, k: 10 },
          criticalNutrients: ['P'],
          baseDose: { urea: 30, dap: 60, mop: 0 }
        },
        vegetative: {
          duration: '26-60 days',
          npkRatio: { n: 50, p: 30, k: 20 },
          criticalNutrients: ['N'],
          baseDose: { urea: 80, dap: 0, mop: 20 }
        },
        flowering: {
          duration: '61-100 days',
          npkRatio: { n: 20, p: 20, k: 50 },
          criticalNutrients: ['K'],
          baseDose: { urea: 40, dap: 0, mop: 30 }
        },
        fruiting: {
          duration: '101-130 days',
          npkRatio: { n: 10, p: 10, k: 70 },
          criticalNutrients: ['K'],
          baseDose: { urea: 0, dap: 0, mop: 30 }
        }
      },
      totalNPK: { n: 150, p: 60, k: 40 },
      soilPreference: 'loamy',
      commonDeficiencies: ['N', 'P', 'Zn']
    },
  
    cotton: {
      name: 'Cotton',
      seasons: ['Kharif'],
      growthStages: {
        seedling: {
          duration: '0-30 days',
          npkRatio: { n: 15, p: 40, k: 15 },
          criticalNutrients: ['P'],
          baseDose: { urea: 25, dap: 50, mop: 15 }
        },
        vegetative: {
          duration: '31-75 days',
          npkRatio: { n: 50, p: 25, k: 25 },
          criticalNutrients: ['N'],
          baseDose: { urea: 70, dap: 0, mop: 25 }
        },
        flowering: {
          duration: '76-120 days',
          npkRatio: { n: 25, p: 25, k: 50 },
          criticalNutrients: ['K', 'P'],
          baseDose: { urea: 30, dap: 25, mop: 40 }
        },
        fruiting: {
          duration: '121-180 days',
          npkRatio: { n: 10, p: 10, k: 80 },
          criticalNutrients: ['K'],
          baseDose: { urea: 20, dap: 0, mop: 50 }
        }
      },
      totalNPK: { n: 120, p: 50, k: 50 },
      soilPreference: 'clay',
      commonDeficiencies: ['K', 'N', 'B']
    },
  
    tomato: {
      name: 'Tomato',
      seasons: ['Year-round'],
      growthStages: {
        seedling: {
          duration: '0-20 days',
          npkRatio: { n: 20, p: 40, k: 10 },
          criticalNutrients: ['P'],
          baseDose: { urea: 15, dap: 40, mop: 10 }
        },
        vegetative: {
          duration: '21-45 days',
          npkRatio: { n: 50, p: 25, k: 25 },
          criticalNutrients: ['N'],
          baseDose: { urea: 50, dap: 0, mop: 20 }
        },
        flowering: {
          duration: '46-70 days',
          npkRatio: { n: 20, p: 40, k: 40 },
          criticalNutrients: ['P', 'K'],
          baseDose: { urea: 20, dap: 30, mop: 30 }
        },
        fruiting: {
          duration: '71-120 days',
          npkRatio: { n: 10, p: 20, k: 70 },
          criticalNutrients: ['K', 'Ca'],
          baseDose: { urea: 10, dap: 10, mop: 50 }
        }
      },
      totalNPK: { n: 100, p: 80, k: 100 },
      soilPreference: 'loamy',
      commonDeficiencies: ['Ca', 'K', 'Mg']
    },
  
    potato: {
      name: 'Potato',
      seasons: ['Rabi'],
      growthStages: {
        seedling: {
          duration: '0-30 days',
          npkRatio: { n: 25, p: 40, k: 15 },
          criticalNutrients: ['P'],
          baseDose: { urea: 30, dap: 50, mop: 15 }
        },
        vegetative: {
          duration: '31-60 days',
          npkRatio: { n: 50, p: 30, k: 20 },
          criticalNutrients: ['N'],
          baseDose: { urea: 60, dap: 0, mop: 20 }
        },
        flowering: {
          duration: '61-90 days',
          npkRatio: { n: 15, p: 20, k: 65 },
          criticalNutrients: ['K'],
          baseDose: { urea: 15, dap: 0, mop: 50 }
        },
        fruiting: {
          duration: '91-120 days',
          npkRatio: { n: 10, p: 10, k: 80 },
          criticalNutrients: ['K'],
          baseDose: { urea: 0, dap: 0, mop: 40 }
        }
      },
      totalNPK: { n: 120, p: 60, k: 100 },
      soilPreference: 'sandy',
      commonDeficiencies: ['K', 'N', 'Mg']
    },
  
    maize: {
      name: 'Maize/Corn',
      seasons: ['Kharif', 'Rabi'],
      growthStages: {
        seedling: {
          duration: '0-25 days',
          npkRatio: { n: 20, p: 40, k: 10 },
          criticalNutrients: ['P'],
          baseDose: { urea: 25, dap: 50, mop: 10 }
        },
        vegetative: {
          duration: '26-55 days',
          npkRatio: { n: 60, p: 20, k: 20 },
          criticalNutrients: ['N'],
          baseDose: { urea: 90, dap: 0, mop: 20 }
        },
        flowering: {
          duration: '56-85 days',
          npkRatio: { n: 15, p: 30, k: 55 },
          criticalNutrients: ['K'],
          baseDose: { urea: 20, dap: 20, mop: 40 }
        },
        fruiting: {
          duration: '86-120 days',
          npkRatio: { n: 5, p: 10, k: 75 },
          criticalNutrients: ['K'],
          baseDose: { urea: 0, dap: 0, mop: 50 }
        }
      },
      totalNPK: { n: 150, p: 60, k: 60 },
      soilPreference: 'loamy',
      commonDeficiencies: ['N', 'Zn', 'S']
    },
  
    sugarcane: {
      name: 'Sugarcane',
      seasons: ['Year-round'],
      growthStages: {
        seedling: {
          duration: '0-45 days',
          npkRatio: { n: 20, p: 40, k: 10 },
          criticalNutrients: ['P'],
          baseDose: { urea: 30, dap: 60, mop: 15 }
        },
        vegetative: {
          duration: '46-120 days',
          npkRatio: { n: 50, p: 30, k: 20 },
          criticalNutrients: ['N'],
          baseDose: { urea: 100, dap: 0, mop: 25 }
        },
        flowering: {
          duration: '121-240 days',
          npkRatio: { n: 20, p: 20, k: 60 },
          criticalNutrients: ['K'],
          baseDose: { urea: 40, dap: 0, mop: 60 }
        },
        fruiting: {
          duration: '241-365 days',
          npkRatio: { n: 10, p: 10, k: 80 },
          criticalNutrients: ['K'],
          baseDose: { urea: 20, dap: 0, mop: 50 }
        }
      },
      totalNPK: { n: 200, p: 80, k: 100 },
      soilPreference: 'loamy',
      commonDeficiencies: ['N', 'K', 'Fe']
    },
  
    onion: {
      name: 'Onion',
      seasons: ['Rabi', 'Kharif'],
      growthStages: {
        seedling: {
          duration: '0-30 days',
          npkRatio: { n: 25, p: 40, k: 10 },
          criticalNutrients: ['P'],
          baseDose: { urea: 30, dap: 50, mop: 10 }
        },
        vegetative: {
          duration: '31-75 days',
          npkRatio: { n: 50, p: 30, k: 20 },
          criticalNutrients: ['N'],
          baseDose: { urea: 60, dap: 0, mop: 20 }
        },
        flowering: {
          duration: '76-120 days',
          npkRatio: { n: 15, p: 20, k: 65 },
          criticalNutrients: ['K'],
          baseDose: { urea: 20, dap: 0, mop: 50 }
        },
        fruiting: {
          duration: '121-150 days',
          npkRatio: { n: 10, p: 10, k: 80 },
          criticalNutrients: ['K', 'S'],
          baseDose: { urea: 0, dap: 0, mop: 40 }
        }
      },
      totalNPK: { n: 100, p: 50, k: 75 },
      soilPreference: 'loamy',
      commonDeficiencies: ['S', 'K', 'N']
    }
  };
  
  /**
   * Get crop information
   */
  const getCropInfo = (cropType) => {
    const crop = cropType.toLowerCase();
    return cropDatabase[crop] || null;
  };
  
  /**
   * Get fertilizer dose for specific crop and growth stage
   */
  const getFertilizerDose = (cropType, growthStage, soilType = 'loamy') => {
    const crop = getCropInfo(cropType);
    if (!crop) return null;
  
    const stage = crop.growthStages[growthStage.toLowerCase()];
    if (!stage) return null;
  
    // Adjust dose based on soil type
    const soilMultiplier = {
      sandy: 1.2,   // Sandy soil needs more (nutrients leach)
      loamy: 1.0,   // Standard dose
      clay: 0.85    // Clay soil needs less (retains nutrients)
    };
  
    const multiplier = soilMultiplier[soilType.toLowerCase()] || 1.0;
  
    return {
      urea: Math.round(stage.baseDose.urea * multiplier),
      dap: Math.round(stage.baseDose.dap * multiplier),
      mop: Math.round(stage.baseDose.mop * multiplier),
      stage: stage.duration,
      criticalNutrients: stage.criticalNutrients
    };
  };
  
  /**
   * Get all available crops
   */
  const getAvailableCrops = () => {
    return Object.keys(cropDatabase).map(key => ({
      value: key,
      label: cropDatabase[key].name,
      seasons: cropDatabase[key].seasons
    }));
  };
  
  /**
   * Get growth stages for a crop
   */
  const getGrowthStages = (cropType) => {
    const crop = getCropInfo(cropType);
    if (!crop) return [];
  
    return Object.keys(crop.growthStages).map(stage => ({
      value: stage,
      label: stage.charAt(0).toUpperCase() + stage.slice(1),
      duration: crop.growthStages[stage].duration
    }));
  };
  
  module.exports = {
    cropDatabase,
    getCropInfo,
    getFertilizerDose,
    getAvailableCrops,
    getGrowthStages
  };