const { format, addDays, subDays, startOfDay, endOfDay } = require('date-fns');

/**
 * Format response for success
 */
const successResponse = (res, statusCode, message, data = null) => {
  const response = {
    status: 'success',
    message
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Format response for error
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    status: 'error',
    message
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginate results
 */
const paginate = (query, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

/**
 * Calculate pagination metadata
 */
const getPaginationMetadata = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null
  };
};

/**
 * Generate random string
 */
const generateRandomString = (length = 32) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Generate random number between min and max
 */
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Sleep/delay function
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Convert object to query string
 */
const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');
};

/**
 * Clean object - remove null/undefined values
 */
const cleanObject = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Convert area units
 */
const convertArea = (value, fromUnit, toUnit) => {
  const conversions = {
    'sqm': 1,
    'sqft': 0.092903,
    'acres': 4046.86,
    'hectares': 10000
  };

  const valueInSqm = value * conversions[fromUnit];
  return valueInSqm / conversions[toUnit];
};

/**
 * Convert temperature units
 */
const convertTemperature = (value, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return value;

  let celsius;
  if (fromUnit === 'fahrenheit') {
    celsius = (value - 32) * 5/9;
  } else if (fromUnit === 'kelvin') {
    celsius = value - 273.15;
  } else {
    celsius = value;
  }

  if (toUnit === 'fahrenheit') {
    return (celsius * 9/5) + 32;
  } else if (toUnit === 'kelvin') {
    return celsius + 273.15;
  }
  return celsius;
};

/**
 * Format date to readable string
 */
const formatDate = (date, formatString = 'yyyy-MM-dd') => {
  return format(new Date(date), formatString);
};

/**
 * Get date range (start and end dates)
 */
const getDateRange = (days) => {
  const now = new Date();
  return {
    startDate: startOfDay(subDays(now, days)),
    endDate: endOfDay(now)
  };
};

/**
 * Generate irrigation schedule dates
 */
const generateScheduleDates = (startDate, endDate, intervalDays) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, intervalDays);
  }

  return dates;
};

/**
 * Calculate crop growth stage
 */
const calculateCropStage = (plantedDate, cropGrowthDays) => {
  const now = new Date();
  const planted = new Date(plantedDate);
  const daysSincePlanting = Math.floor((now - planted) / (1000 * 60 * 60 * 24));

  if (daysSincePlanting < 0) return 'Not planted yet';
  if (daysSincePlanting < cropGrowthDays * 0.2) return 'Germination';
  if (daysSincePlanting < cropGrowthDays * 0.4) return 'Vegetative';
  if (daysSincePlanting < cropGrowthDays * 0.6) return 'Flowering';
  if (daysSincePlanting < cropGrowthDays * 0.8) return 'Fruiting';
  if (daysSincePlanting < cropGrowthDays) return 'Maturation';
  return 'Ready to harvest';
};

/**
 * Calculate water requirements based on crop and area
 */
const calculateWaterRequirement = (cropType, area, temperature, humidity) => {
  // Base water requirement in liters per square meter per day
  const baseRequirements = {
    'tomato': 5,
    'lettuce': 3,
    'cucumber': 6,
    'pepper': 4,
    'spinach': 3,
    'carrot': 3,
    'bean': 4,
    'default': 4
  };

  const baseRequirement = baseRequirements[cropType.toLowerCase()] || baseRequirements.default;

  // Adjust for temperature and humidity
  const tempFactor = temperature > 30 ? 1.3 : temperature > 25 ? 1.1 : 1.0;
  const humidityFactor = humidity < 40 ? 1.2 : humidity < 60 ? 1.0 : 0.9;

  const dailyRequirement = baseRequirement * area * tempFactor * humidityFactor;

  return {
    daily: Math.round(dailyRequirement * 100) / 100,
    weekly: Math.round(dailyRequirement * 7 * 100) / 100,
    monthly: Math.round(dailyRequirement * 30 * 100) / 100
  };
};

/**
 * Validate file type
 */
const isValidImageType = (mimetype) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(mimetype);
};

/**
 * Get file extension
 */
const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

/**
 * Sanitize filename
 */
const sanitizeFilename = (filename) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
};

/**
 * Format file size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Deep clone object
 */
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if object is empty
 */
const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Capitalize first letter
 */
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate string
 */
const truncate = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str;
};

module.exports = {
  successResponse,
  errorResponse,
  paginate,
  getPaginationMetadata,
  generateRandomString,
  generateRandomNumber,
  sleep,
  objectToQueryString,
  cleanObject,
  calculateDistance,
  toRadians,
  convertArea,
  convertTemperature,
  formatDate,
  getDateRange,
  generateScheduleDates,
  calculateCropStage,
  calculateWaterRequirement,
  isValidImageType,
  getFileExtension,
  sanitizeFilename,
  formatFileSize,
  deepClone,
  isEmpty,
  capitalize,
  truncate
};