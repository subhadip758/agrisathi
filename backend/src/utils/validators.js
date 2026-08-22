const Joi = require('joi');

/**
 * Validate Email Format
 */
const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate Phone Number
 */
const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate Password Strength
 */
const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate Coordinates
 */
const validateCoordinates = (latitude, longitude) => {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
};

/**
 * Joi Schema for User Registration
 */
const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().email().lowercase().trim().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  role: Joi.string().valid('user', 'admin', 'expert').default('user')
});

/**
 * Joi Schema for User Login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Joi Schema for Profile Update
 */
const updateProfileSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).optional(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
  profileImage: Joi.string().uri().optional(),
  farmDetails: Joi.object({
    farmName: Joi.string().trim().optional(),
    location: Joi.object({
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      country: Joi.string().optional(),
      zipCode: Joi.string().optional(),
      coordinates: Joi.object({
        latitude: Joi.number().min(-90).max(90).optional(),
        longitude: Joi.number().min(-180).max(180).optional()
      }).optional()
    }).optional(),
    farmSize: Joi.object({
      value: Joi.number().positive().optional(),
      unit: Joi.string().valid('acres', 'hectares', 'sqft', 'sqm').optional()
    }).optional(),
    farmType: Joi.string().valid('residential', 'commercial', 'community', 'rooftop', 'vertical').optional(),
    soilType: Joi.string().valid('clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty').optional()
  }).optional(),
  preferences: Joi.object({
    language: Joi.string().optional(),
    units: Joi.string().valid('metric', 'imperial').optional(),
    notifications: Joi.object({
      email: Joi.boolean().optional(),
      push: Joi.boolean().optional(),
      weather: Joi.boolean().optional(),
      irrigation: Joi.boolean().optional(),
      disease: Joi.boolean().optional(),
      market: Joi.boolean().optional()
    }).optional()
  }).optional()
});

/**
 * Joi Schema for Crop Recommendation
 */
const cropRecommendationSchema = Joi.object({
  nitrogen: Joi.number().min(0).max(200).required(),
  phosphorus: Joi.number().min(0).max(200).required(),
  potassium: Joi.number().min(0).max(200).required(),
  temperature: Joi.number().min(-50).max(60).required(),
  humidity: Joi.number().min(0).max(100).required(),
  ph: Joi.number().min(0).max(14).required(),
  rainfall: Joi.number().min(0).max(3000).required(),
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).optional(),
    longitude: Joi.number().min(-180).max(180).optional()
  }).optional()
});

/**
 * Joi Schema for Soil Analysis
 */
const soilAnalysisSchema = Joi.object({
  nitrogen: Joi.number().min(0).max(200).required(),
  phosphorus: Joi.number().min(0).max(200).required(),
  potassium: Joi.number().min(0).max(200).required(),
  ph: Joi.number().min(0).max(14).required(),
  organicCarbon: Joi.number().min(0).max(10).optional(),
  sulfur: Joi.number().min(0).max(100).optional(),
  zinc: Joi.number().min(0).max(50).optional(),
  iron: Joi.number().min(0).max(100).optional(),
  copper: Joi.number().min(0).max(50).optional(),
  manganese: Joi.number().min(0).max(100).optional(),
  soilType: Joi.string().valid('clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty').optional()
});

/**
 * Joi Schema for Irrigation Schedule
 */
const irrigationScheduleSchema = Joi.object({
  scheduleName: Joi.string().trim().min(1).max(100).required(),
  
  cropDetails: Joi.object({
    cropType: Joi.string().required(),
    cropStage: Joi.string()
      .valid('germination', 'vegetative', 'flowering', 'fruiting', 'maturation', 'harvest')
      .optional(),
    plantedDate: Joi.date().iso().required(),
    area: Joi.object({
      value: Joi.number().positive().required(),
      unit: Joi.string().valid('acres', 'hectares', 'sqft', 'sqm').default('acres')
    }).required()
  }).required(),
  
  soilInformation: Joi.object({
    soilType: Joi.string()
      .valid('clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty')
      .required(),
    soilMoisture: Joi.number().min(0).max(100).optional()
  }).required(),
  
  location: Joi.object({
    coordinates: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required(),
    address: Joi.string().allow('').optional()
  }).required(),
  
  irrigationSystem: Joi.object({
    type: Joi.string()
      .valid('drip', 'sprinkler', 'surface', 'subsurface')
      .default('drip'),
    efficiency: Joi.number().min(0).max(100).optional()
  }).optional(),
  
  schedule: Joi.object({
    frequency: Joi.string()
      .valid('daily', 'alternate-days', 'twice-weekly', 'weekly')
      .default('daily'),
    waterAmount: Joi.object({
      value: Joi.number().positive().required(),
      unit: Joi.string().valid('liters', 'gallons', 'cubic-meters').default('liters')
    }).required(),
    preferredTimes: Joi.array().items(
      Joi.object({
        hour: Joi.number().min(0).max(23).required(),
        minute: Joi.number().min(0).max(59).required(),
        duration: Joi.number().positive().optional()
      })
    ).optional(),
    customInterval: Joi.number().positive().optional()
  }).required(),
  
  duration: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).optional()
  }).required(),
  
  weatherAdjustments: Joi.object({
    enabled: Joi.boolean().default(true),
    rainThreshold: Joi.number().min(0).optional()
  }).optional(),
  
  notifications: Joi.object({
    enabled: Joi.boolean().default(true),
    methods: Joi.array().items(Joi.string().valid('email', 'sms', 'push')).optional()
  }).optional(),
  
  notes: Joi.string().max(500).allow('').optional()
}).unknown(false);

/**
 * Joi Schema for Fertilizer Recommendation (UPDATED for Fertilizer Scheduler)
 */
const fertilizerRecommendationSchema = Joi.object({
  // New required fields for fertilizer scheduler
  cropName: Joi.string()
    .trim()
    .lowercase()
    .required()
    .messages({
      'any.required': 'Crop name is required',
      'string.empty': 'Crop name cannot be empty'
    }),
  
  soilN: Joi.number()
    .min(0)
    .max(1000)
    .required()
    .messages({
      'any.required': 'Soil nitrogen (N) is required',
      'number.min': 'Soil nitrogen cannot be negative',
      'number.max': 'Soil nitrogen value seems unrealistic (max 1000 kg/ha)'
    }),
  
  soilP: Joi.number()
    .min(0)
    .max(500)
    .required()
    .messages({
      'any.required': 'Soil phosphorus (P) is required',
      'number.min': 'Soil phosphorus cannot be negative',
      'number.max': 'Soil phosphorus value seems unrealistic (max 500 kg/ha)'
    }),
  
  soilK: Joi.number()
    .min(0)
    .max(1000)
    .required()
    .messages({
      'any.required': 'Soil potassium (K) is required',
      'number.min': 'Soil potassium cannot be negative',
      'number.max': 'Soil potassium value seems unrealistic (max 1000 kg/ha)'
    }),
  
  soilPh: Joi.number()
    .min(4.0)
    .max(10.0)
    .required()
    .messages({
      'any.required': 'Soil pH is required',
      'number.min': 'Soil pH must be at least 4.0',
      'number.max': 'Soil pH must be at most 10.0'
    }),
  
  cropStage: Joi.string()
    .trim()
    .lowercase()
    .valid('sowing', 'vegetative', 'flowering')
    .required()
    .messages({
      'any.required': 'Crop growth stage is required',
      'any.only': 'Crop stage must be one of: sowing, vegetative, flowering'
    }),
  
  area: Joi.number()
    .positive()
    .max(10000)
    .required()
    .messages({
      'any.required': 'Farm area is required',
      'number.positive': 'Area must be greater than 0',
      'number.max': 'Area seems unrealistic (max 10000 hectares)'
    }),

  // Optional backward compatibility fields
  cropType: Joi.string().optional(),
  soilType: Joi.string()
    .valid('clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty')
    .optional(),
  nitrogen: Joi.number().min(0).max(200).optional(),
  phosphorus: Joi.number().min(0).max(200).optional(),
  potassium: Joi.number().min(0).max(200).optional(),
  temperature: Joi.number().min(-50).max(60).optional(),
  humidity: Joi.number().min(0).max(100).optional(),
  moisture: Joi.number().min(0).max(100).optional()
});

/**
 * Joi Schema for Yield Prediction
 * Updated to match ML model requirements (10 features)
 */
const yieldPredictionSchema = Joi.object({
  cropDetails: Joi.object({
    crop: Joi.string().required().messages({
      'any.required': 'Crop type is required',
      'string.empty': 'Crop type cannot be empty'
    }),
    season: Joi.string()
      .valid('Kharif', 'Rabi', 'Zaid', 'Whole Year', 'Summer', 'Winter', 'Autumn', 'Spring')
      .required()
      .messages({
        'any.required': 'Season is required',
        'any.only': 'Invalid season. Must be one of: Kharif, Rabi, Zaid, Whole Year, Summer, Winter, Autumn, Spring'
      }),
    area: Joi.object({
      value: Joi.number().positive().optional(),
      unit: Joi.string().valid('hectare', 'acre', 'sqm').optional()
    }).optional()
  }).required(),

  inputFactors: Joi.object({
    soilType: Joi.string()
      .required()
      .messages({
        'any.required': 'Soil type is required',
        'string.empty': 'Soil type cannot be empty'
      }),
    rainfall: Joi.number()
      .min(0)
      .max(5000)
      .required()
      .messages({
        'any.required': 'Rainfall is required',
        'number.min': 'Rainfall cannot be negative',
        'number.max': 'Rainfall value seems unrealistic (max 5000mm)'
      }),
    temperature: Joi.number()
      .min(-10)
      .max(50)
      .required()
      .messages({
        'any.required': 'Temperature is required',
        'number.min': 'Temperature must be at least -10°C',
        'number.max': 'Temperature must be at most 50°C'
      }),
    humidity: Joi.number()
      .min(0)
      .max(100)
      .required()
      .messages({
        'any.required': 'Humidity is required',
        'number.min': 'Humidity cannot be negative',
        'number.max': 'Humidity cannot exceed 100%'
      }),
    pH: Joi.number()
      .min(0)
      .max(14)
      .required()
      .messages({
        'any.required': 'Soil pH is required',
        'number.min': 'pH must be at least 0',
        'number.max': 'pH must be at most 14'
      }),
    nitrogen: Joi.number()
      .min(0)
      .max(500)
      .required()
      .messages({
        'any.required': 'Nitrogen (N) content is required',
        'number.min': 'Nitrogen cannot be negative'
      }),
    phosphorus: Joi.number()
      .min(0)
      .max(500)
      .required()
      .messages({
        'any.required': 'Phosphorus (P) content is required',
        'number.min': 'Phosphorus cannot be negative'
      }),
    potassium: Joi.number()
      .min(0)
      .max(500)
      .required()
      .messages({
        'any.required': 'Potassium (K) content is required',
        'number.min': 'Potassium cannot be negative'
      })
  }).required(),

  location: Joi.object({
    state: Joi.string().required().messages({
      'any.required': 'State is required',
      'string.empty': 'State cannot be empty'
    }),
    district: Joi.string().optional().allow(''),
    country: Joi.string().optional().default('India')
  }).required(),

  historicalComparison: Joi.object().optional()
});


/**
 * Joi Schema for Chatbot Message
 */
const chatbotMessageSchema = Joi.object({
  message: Joi.string().trim().min(1).max(2000).required(),
  sessionId: Joi.string().optional().allow('', null),
  context: Joi.object().optional().allow(null)
});

/**
 * Validate Request Body
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};

/**
 * Validate Query Parameters
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Query validation failed',
        errors
      });
    }

    req.query = value;
    next();
  };
};

const simpleYieldEstimationSchema = Joi.object({
  crop: Joi.string().required().trim().messages({
    'string.empty': 'Crop type is required',
    'any.required': 'Crop type is required'
  }),
  
  farmSize: Joi.number().positive().optional().allow(null, '').messages({
    'number.positive': 'Farm size must be a positive number'
  }),
  
  growthStage: Joi.string()
    .valid(
      'sowing', 'germination', 'vegetative', 'tillering', 
      'flowering', 'grain_filling', 'fruit_development', 
      'maturity', 'harvest'
    )
    .required()
    .messages({
      'any.only': 'Invalid growth stage',
      'any.required': 'Growth stage is required'
    }),
  
  sowingTime: Joi.string()
    .valid('very_early', 'slightly_early', 'on_time', 'slightly_late', 'very_late')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  plantHealth: Joi.string()
    .valid('excellent', 'good', 'average', 'poor', 'very_poor')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  leafColor: Joi.string()
    .valid('dark_green', 'light_green', 'pale_yellow', 'yellow_brown')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  pestDiseaseImpact: Joi.string()
    .valid('none', 'minor', 'moderate', 'severe', 'very_severe')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  rainfallExperience: Joi.string()
    .valid('excess', 'adequate', 'below_normal', 'deficit')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  waterAvailability: Joi.string()
    .valid('excess', 'adequate', 'slight_stress', 'moderate_stress', 'severe_stress')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  fertilizerUsage: Joi.string()
    .valid('none', 'minimal', 'below_recommended', 'recommended', 'excess')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  lastSeasonComparison: Joi.string()
    .valid('much_worse', 'worse', 'same', 'better', 'much_better')
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  soilType: Joi.string()
    .optional()
    .allow('', null),  // ✅ Allow empty string
  
  location: Joi.string()
    .optional()
    .allow('', null)  // ✅ Allow empty string
});

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateCoordinates,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  cropRecommendationSchema,
  soilAnalysisSchema,
  irrigationScheduleSchema,
  fertilizerRecommendationSchema,
  yieldPredictionSchema,
  chatbotMessageSchema,
  validateRequest,
  validateQuery,
  simpleYieldEstimationSchema,
  yieldPredictionSchema
};