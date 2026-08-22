// API Endpoints
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5180/api/v1';
export const ML_API_BASE_URL = process.env.REACT_APP_ML_API_URL || 'http://localhost:8000/api';

// App Configuration
export const APP_NAME = 'Urban Farming Platform';
export const APP_VERSION = '1.0.0';

// Soil Types
export const SOIL_TYPES = [
  { value: 'clay', label: 'Clay' },
  { value: 'sandy', label: 'Sandy' },
  { value: 'loamy', label: 'Loamy' },
  { value: 'peaty', label: 'Peaty' },
  { value: 'chalky', label: 'Chalky' },
  { value: 'silty', label: 'Silty' },
];

// Crop Types
export const POPULAR_CROPS = [
  'Rice',
  'Wheat',
  'Maize',
  'Cotton',
  'Tomato',
  'Potato',
  'Onion',
  'Lettuce',
  'Spinach',
  'Carrot',
];

// Seasons
export const SEASONS = [
  { value: 'kharif', label: 'Kharif (Monsoon)' },
  { value: 'rabi', label: 'Rabi (Winter)' },
  { value: 'summer', label: 'Summer' },
  { value: 'winter', label: 'Winter' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'spring', label: 'Spring' },
];

// Farm Types
export const FARM_TYPES = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'community', label: 'Community' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'vertical', label: 'Vertical' },
];

// Irrigation Methods
export const IRRIGATION_METHODS = [
  { value: 'drip', label: 'Drip Irrigation' },
  { value: 'sprinkler', label: 'Sprinkler' },
  { value: 'surface', label: 'Surface Irrigation' },
  { value: 'subsurface', label: 'Subsurface' },
  { value: 'manual', label: 'Manual Watering' },
];

// Irrigation Frequencies
export const IRRIGATION_FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'alternate-days', label: 'Alternate Days' },
  { value: 'twice-weekly', label: 'Twice Weekly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
];

// Growth Stages
export const GROWTH_STAGES = [
  { value: 'germination', label: 'Germination' },
  { value: 'vegetative', label: 'Vegetative' },
  { value: 'flowering', label: 'Flowering' },
  { value: 'fruiting', label: 'Fruiting' },
  { value: 'maturation', label: 'Maturation' },
  { value: 'harvest', label: 'Ready to Harvest' },
];

// Disease Severities
export const DISEASE_SEVERITIES = [
  { value: 'mild', label: 'Mild', color: 'text-yellow-600' },
  { value: 'moderate', label: 'Moderate', color: 'text-orange-600' },
  { value: 'severe', label: 'Severe', color: 'text-red-600' },
  { value: 'critical', label: 'Critical', color: 'text-red-800' },
];

// Disease Categories
export const DISEASE_CATEGORIES = [
  { value: 'fungal', label: 'Fungal' },
  { value: 'bacterial', label: 'Bacterial' },
  { value: 'viral', label: 'Viral' },
  { value: 'pest', label: 'Pest' },
  { value: 'nutrient-deficiency', label: 'Nutrient Deficiency' },
  { value: 'environmental', label: 'Environmental' },
];

// Units
export const AREA_UNITS = [
  { value: 'sqm', label: 'Square Meters (m²)' },
  { value: 'sqft', label: 'Square Feet (ft²)' },
  { value: 'acres', label: 'Acres' },
  { value: 'hectares', label: 'Hectares' },
];

export const WATER_UNITS = [
  { value: 'liters', label: 'Liters' },
  { value: 'gallons', label: 'Gallons' },
  { value: 'cubic-meters', label: 'Cubic Meters' },
];

export const WEIGHT_UNITS = [
  { value: 'kg', label: 'Kilograms' },
  { value: 'tons', label: 'Tons' },
  { value: 'quintals', label: 'Quintals' },
  { value: 'pounds', label: 'Pounds' },
];

// NPK Ranges
export const NPK_RANGES = {
  nitrogen: { min: 0, max: 200, optimal: { min: 40, max: 60 } },
  phosphorus: { min: 0, max: 200, optimal: { min: 30, max: 50 } },
  potassium: { min: 0, max: 200, optimal: { min: 40, max: 60 } },
};

// pH Range
export const PH_RANGE = {
  min: 0,
  max: 14,
  optimal: { min: 6.0, max: 7.5 },
};

// Status Colors
export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  paused: 'bg-gray-100 text-gray-800',
};

// Priority Colors
export const PRIORITY_COLORS = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

// Chart Colors
export const CHART_COLORS = [
  '#16a34a', // green
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
];

// Date Formats
export const DATE_FORMATS = {
  display: 'MMM dd, yyyy',
  input: 'yyyy-MM-dd',
  full: 'MMMM dd, yyyy HH:mm',
  time: 'HH:mm',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100];

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'Saved successfully!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  REGISTER_SUCCESS: 'Registration successful!',
};