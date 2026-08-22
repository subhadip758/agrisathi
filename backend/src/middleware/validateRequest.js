const { validationResult } = require('express-validator');

/**
 * Middleware to validate request using express-validator
 * @param {Array} validations - Array of validation chains
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors for better response
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors,
    });
  };
};

/**
 * Custom validation middleware for specific scenarios
 */
const validateRequest = {
  /**
   * Validate if request body exists
   */
  checkBody: (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body is required',
      });
    }
    next();
  },

  /**
   * Validate if specific fields exist in request
   */
  checkFields: (fields) => {
    return (req, res, next) => {
      const missingFields = [];
      
      fields.forEach((field) => {
        if (!req.body[field] && req.body[field] !== 0 && req.body[field] !== false) {
          missingFields.push(field);
        }
      });

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields',
          fields: missingFields,
        });
      }
      
      next();
    };
  },

  /**
   * Validate numeric range
   */
  validateRange: (field, min, max) => {
    return (req, res, next) => {
      const value = req.body[field];
      
      if (value === undefined || value === null) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }

      const numValue = Number(value);
      
      if (isNaN(numValue)) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a number`,
        });
      }

      if (numValue < min || numValue > max) {
        return res.status(400).json({
          success: false,
          message: `${field} must be between ${min} and ${max}`,
        });
      }

      next();
    };
  },

  /**
   * Validate file upload
   */
  validateFile: (req, res, next) => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }
    next();
  },

  /**
   * Validate image file type
   */
  validateImageType: (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed',
      });
    }

    next();
  },

  /**
   * Sanitize input to prevent XSS
   */
  sanitizeInput: (req, res, next) => {
    const sanitize = (obj) => {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
          // Remove potential script tags
          obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitize(obj[key]);
        }
      }
    };

    if (req.body) sanitize(req.body);
    if (req.query) sanitize(req.query);
    if (req.params) sanitize(req.params);

    next();
  },
};

module.exports = { validate, validateRequest };