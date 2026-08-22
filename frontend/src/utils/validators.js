/**
 * Validation utility functions for form inputs and data
 */

// Email validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  // Password validation (min 8 chars, at least one uppercase, one lowercase, one number)
  export const validatePassword = (password) => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    return { isValid: true, message: 'Password is valid' };
  };
  
  // Phone number validation (flexible format)
  export const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
  };
  
  // Name validation (letters, spaces, hyphens only)
  export const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s-']+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  };
  
  // Required field validation
  export const validateRequired = (value) => {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    if (typeof value === 'number') {
      return !isNaN(value);
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  };
  
  // Number validation with optional min/max
  export const validateNumber = (value, min = null, max = null) => {
    const num = parseFloat(value);
    
    if (isNaN(num)) {
      return { isValid: false, message: 'Must be a valid number' };
    }
    
    if (min !== null && num < min) {
      return { isValid: false, message: `Must be at least ${min}` };
    }
    
    if (max !== null && num > max) {
      return { isValid: false, message: `Must be at most ${max}` };
    }
    
    return { isValid: true, message: 'Valid number' };
  };
  
  // Positive number validation
  export const validatePositiveNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };
  
  // Integer validation
  export const validateInteger = (value) => {
    return Number.isInteger(Number(value));
  };
  
  // Date validation
  export const validateDate = (date) => {
    const parsedDate = new Date(date);
    return parsedDate instanceof Date && !isNaN(parsedDate);
  };
  
  // Future date validation
  export const validateFutureDate = (date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return parsedDate >= today;
  };
  
  // Past date validation
  export const validatePastDate = (date) => {
    const parsedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return parsedDate <= today;
  };
  
  // Date range validation
  export const validateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  };
  
  // URL validation
  export const validateURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // File size validation (size in MB)
  export const validateFileSize = (file, maxSizeMB = 5) => {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    return file.size <= maxSize;
  };
  
  // File type validation
  export const validateFileType = (file, allowedTypes = []) => {
    if (allowedTypes.length === 0) return true;
    return allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.includes(type);
    });
  };
  
  // Image file validation
  export const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validateFileType(file, allowedTypes);
  };
  
  // Coordinates validation (latitude and longitude)
  export const validateCoordinates = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return { isValid: false, message: 'Invalid coordinates' };
    }
    
    if (latitude < -90 || latitude > 90) {
      return { isValid: false, message: 'Latitude must be between -90 and 90' };
    }
    
    if (longitude < -180 || longitude > 180) {
      return { isValid: false, message: 'Longitude must be between -180 and 180' };
    }
    
    return { isValid: true, message: 'Valid coordinates' };
  };
  
  // Area validation (for farm size, plot size, etc.)
  export const validateArea = (area, unit = 'acres') => {
    const num = parseFloat(area);
    
    if (isNaN(num) || num <= 0) {
      return { isValid: false, message: 'Area must be a positive number' };
    }
    
    // Set reasonable limits based on unit
    const limits = {
      acres: { min: 0.01, max: 10000 },
      hectares: { min: 0.01, max: 5000 },
      sqft: { min: 100, max: 500000000 },
      sqm: { min: 10, max: 50000000 }
    };
    
    const limit = limits[unit] || limits.acres;
    
    if (num < limit.min || num > limit.max) {
      return { 
        isValid: false, 
        message: `Area must be between ${limit.min} and ${limit.max} ${unit}` 
      };
    }
    
    return { isValid: true, message: 'Valid area' };
  };
  
  // pH level validation
  export const validatePH = (ph) => {
    const value = parseFloat(ph);
    
    if (isNaN(value)) {
      return { isValid: false, message: 'pH must be a number' };
    }
    
    if (value < 0 || value > 14) {
      return { isValid: false, message: 'pH must be between 0 and 14' };
    }
    
    return { isValid: true, message: 'Valid pH level' };
  };
  
  // NPK values validation (for fertilizers)
  export const validateNPK = (n, p, k) => {
    const nitrogen = parseFloat(n);
    const phosphorus = parseFloat(p);
    const potassium = parseFloat(k);
    
    if (isNaN(nitrogen) || isNaN(phosphorus) || isNaN(potassium)) {
      return { isValid: false, message: 'NPK values must be numbers' };
    }
    
    if (nitrogen < 0 || phosphorus < 0 || potassium < 0) {
      return { isValid: false, message: 'NPK values cannot be negative' };
    }
    
    if (nitrogen > 100 || phosphorus > 100 || potassium > 100) {
      return { isValid: false, message: 'NPK values cannot exceed 100' };
    }
    
    return { isValid: true, message: 'Valid NPK values' };
  };
  
  // Temperature validation (in Celsius)
  export const validateTemperature = (temp, min = -50, max = 60) => {
    const temperature = parseFloat(temp);
    
    if (isNaN(temperature)) {
      return { isValid: false, message: 'Temperature must be a number' };
    }
    
    if (temperature < min || temperature > max) {
      return { 
        isValid: false, 
        message: `Temperature must be between ${min}°C and ${max}°C` 
      };
    }
    
    return { isValid: true, message: 'Valid temperature' };
  };
  
  // Humidity validation (percentage)
  export const validateHumidity = (humidity) => {
    const value = parseFloat(humidity);
    
    if (isNaN(value)) {
      return { isValid: false, message: 'Humidity must be a number' };
    }
    
    if (value < 0 || value > 100) {
      return { isValid: false, message: 'Humidity must be between 0% and 100%' };
    }
    
    return { isValid: true, message: 'Valid humidity' };
  };
  
  // Rainfall validation (in mm)
  export const validateRainfall = (rainfall) => {
    const value = parseFloat(rainfall);
    
    if (isNaN(value)) {
      return { isValid: false, message: 'Rainfall must be a number' };
    }
    
    if (value < 0) {
      return { isValid: false, message: 'Rainfall cannot be negative' };
    }
    
    if (value > 1000) {
      return { isValid: false, message: 'Rainfall value seems unusually high' };
    }
    
    return { isValid: true, message: 'Valid rainfall' };
  };
  
  // Soil moisture validation (percentage)
  export const validateSoilMoisture = (moisture) => {
    const value = parseFloat(moisture);
    
    if (isNaN(value)) {
      return { isValid: false, message: 'Soil moisture must be a number' };
    }
    
    if (value < 0 || value > 100) {
      return { isValid: false, message: 'Soil moisture must be between 0% and 100%' };
    }
    
    return { isValid: true, message: 'Valid soil moisture' };
  };
  
  // Crop name validation
  export const validateCropName = (cropName) => {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    return nameRegex.test(cropName) && cropName.trim().length >= 2;
  };
  
  // Form validation helper
  export const validateForm = (formData, validationRules) => {
    const errors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rules = validationRules[field];
      const value = formData[field];
      
      rules.forEach(rule => {
        if (!errors[field]) {
          const result = rule.validator(value);
          
          if (typeof result === 'boolean' && !result) {
            errors[field] = rule.message || 'Invalid value';
          } else if (typeof result === 'object' && !result.isValid) {
            errors[field] = result.message;
          }
        }
      });
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  // Sanitize input (remove potentially harmful characters)
  export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .trim();
  };
  
  // Check if value is empty
  export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  };
  
  export default {
    validateEmail,
    validatePassword,
    validatePhone,
    validateName,
    validateRequired,
    validateNumber,
    validatePositiveNumber,
    validateInteger,
    validateDate,
    validateFutureDate,
    validatePastDate,
    validateDateRange,
    validateURL,
    validateFileSize,
    validateFileType,
    validateImageFile,
    validateCoordinates,
    validateArea,
    validatePH,
    validateNPK,
    validateTemperature,
    validateHumidity,
    validateRainfall,
    validateSoilMoisture,
    validateCropName,
    validateForm,
    sanitizeInput,
    isEmpty
  };