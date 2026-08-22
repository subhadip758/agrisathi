/**
 * 🛠️ AGRISATHI REAL TOOL DECLARATIONS FOR GEMINI AI AGENT (SDK 0.21.0 JSON SCHEMA)
 */
const toolDeclarations = [
  {
    name: "getCurrentLocation",
    description: "Retrieve verified user location (city, district, state, coordinates). Use when question requires location context.",
    parameters: {
      type: "OBJECT",
      properties: {
        queryText: { type: "STRING", description: "Optional location name from prompt" }
      }
    }
  },
  {
    name: "getFarmerProfile",
    description: "Retrieve authenticated farmer profile details (name, land size, crops grown, state/district). Use to personalize advice to farmer's land and crops.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "getWeather",
    description: "Retrieve current weather conditions (temperature, humidity, rain mm) for location. Use for immediate current weather questions.",
    parameters: {
      type: "OBJECT",
      properties: {
        locationName: { type: "STRING", description: "City or district name (e.g., Barasat, Bankura, Malda)" }
      }
    }
  },
  {
    name: "getWeatherForecast",
    description: "Retrieve 7-day future weather forecast (temperature max/min, rain probability, rainfall mm) for relevant location. Use when user asks about upcoming weather, rain, temperature, harvesting, irrigation, or weather risk planning.",
    parameters: {
      type: "OBJECT",
      properties: {
        locationName: { type: "STRING", description: "City or district name (e.g., Barasat, Bankura, Malda)" },
        days: { type: "NUMBER", description: "Number of forecast days (1 to 7)" }
      }
    }
  },
  {
    name: "getSoilAnalysis",
    description: "Retrieve authenticated farmer's verified soil test report (pH, Nitrogen, Phosphorus, Potassium, Organic Matter, Texture). Use when question depends on soil condition, nutrients, soil health, fertilizer dosing, or crop suitability.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "getSoilMoisture",
    description: "Retrieve live soil moisture status (%) and whether irrigation is needed. Use when user asks if watering or irrigation is needed today.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "getIrrigationStatus",
    description: "Retrieve irrigation system advisory and schedule for specified crop type. Use when user asks about irrigation timing, watering frequency, or irrigation methods.",
    parameters: {
      type: "OBJECT",
      properties: {
        cropType: { type: "STRING", description: "Crop type (e.g. Rice, Wheat, Potato, Vegetables)" }
      }
    }
  },
  {
    name: "getCropInformation",
    description: "Retrieve growth stages, water needs, fertilizer schedule, and disease risks for a crop. Use when user asks about crop management or crop stage care.",
    parameters: {
      type: "OBJECT",
      properties: {
        cropType: { type: "STRING", description: "Crop name (e.g. Rice, Wheat, Potato, Mustard, Jute)" }
      }
    }
  },
  {
    name: "getCropRecommendation",
    description: "Retrieve AI crop recommendations based on location, soil, and season. Use when user asks what crop to grow or plant.",
    parameters: {
      type: "OBJECT",
      properties: {
        district: { type: "STRING", description: "District name" }
      }
    }
  },
  {
    name: "getYieldPrediction",
    description: "Retrieve crop yield prediction and harvest estimate based on land area and crop type. Use when user asks about expected yield, production, or harvest output.",
    parameters: {
      type: "OBJECT",
      properties: {
        cropType: { type: "STRING", description: "Crop name" }
      }
    }
  },
  {
    name: "detectCropDisease",
    description: "Diagnose crop disease symptoms from descriptions and recommend treatment. Use when user describes plant spots, yellowing, rotting, or pest damage.",
    parameters: {
      type: "OBJECT",
      properties: {
        cropType: { type: "STRING", description: "Crop name" },
        symptoms: { type: "STRING", description: "Description of plant symptoms" }
      }
    }
  },
  {
    name: "getDiseaseAlerts",
    description: "Retrieve active crop disease outbreak alerts for a district. Use when user asks about disease risks, pest alerts, or disease outbreaks in their area.",
    parameters: {
      type: "OBJECT",
      properties: {
        district: { type: "STRING", description: "District name" },
        cropType: { type: "STRING", description: "Optional crop filter" }
      }
    }
  },
  {
    name: "getMarketListings",
    description: "Retrieve marketplace produce listings for buying/selling crops in a district. Use when user asks about crop prices, market sales, or produce listings.",
    parameters: {
      type: "OBJECT",
      properties: {
        district: { type: "STRING", description: "District name" },
        cropType: { type: "STRING", description: "Optional crop name" }
      }
    }
  },
  {
    name: "getFreshMarketListings",
    description: "Retrieve newly arrived fresh vegetable and crop listings for a district. Use when user asks about fresh vegetables or newly harvested produce available nearby.",
    parameters: {
      type: "OBJECT",
      properties: {
        district: { type: "STRING", description: "District name" },
        cropType: { type: "STRING", description: "Optional crop name" }
      }
    }
  },
  {
    name: "getColdStorageListings",
    description: "Retrieve cold storage crop listings and warehouse availability in a district. Use when user asks about cold storage produce or storing crops.",
    parameters: {
      type: "OBJECT",
      properties: {
        district: { type: "STRING", description: "District name" },
        cropType: { type: "STRING", description: "Optional crop name" }
      }
    }
  },
  {
    name: "getGovernmentSchemes",
    description: "Retrieve verified agricultural government schemes and subsidies (PM-Kisan, Krishak Bandhu, PMFBY, KCC). Use when user asks about government schemes, subsidies, grants, or financial aid.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "checkSchemeEligibility",
    description: "Check authenticated farmer's eligibility for specific government schemes based on land size and crops. Use when user asks if they are eligible for a scheme or subsidy.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "getCommunityInformation",
    description: "Retrieve recent farmer community discussions and public posts for a district. Use when user asks about what other farmers in their area are discussing or reporting.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search query" },
        district: { type: "STRING", description: "District name" }
      }
    }
  },
  {
    name: "getNotifications",
    description: "Retrieve system notifications and urgent weather/disease alerts for farmer account.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  },
  {
    name: "webSearch",
    description: "Perform live web search retrieval for current external information, news, government ministers, market rates, or non-platform general topics. Use when live external web verification is required.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search query term" }
      },
      required: ["query"]
    }
  }
];

module.exports = toolDeclarations;
