const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    './uploads',
    './uploads/disease-images',
    './uploads/soil-images',
    './uploads/profile-images',
    './uploads/temp'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration for disease images
const diseaseStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/disease-images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `disease-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for soil images
const soilStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/soil-images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `soil-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Storage configuration for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/profile-images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `profile-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// File size limits
const limits = {
  fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
};

// Multer configurations for different upload types
const uploadDiseaseImage = multer({
  storage: diseaseStorage,
  fileFilter: imageFileFilter,
  limits: limits
}).single('image');

const uploadSoilImage = multer({
  storage: soilStorage,
  fileFilter: imageFileFilter,
  limits: limits
}).single('image');

const uploadProfileImage = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB for profile images
  }
}).single('profileImage');

const uploadMultipleImages = multer({
  storage: diseaseStorage,
  fileFilter: imageFileFilter,
  limits: limits
}).array('images', 5); // Max 5 images

// Middleware wrapper for better error handling
const handleMulterError = (uploadFunction) => {
  return (req, res, next) => {
    uploadFunction(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File too large. Maximum size is 5MB'
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            status: 'error',
            message: 'Too many files. Maximum is 5 files'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Unexpected field name'
          });
        }
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      } else if (err) {
        // Custom errors (like file type validation)
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};

// Delete file utility
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
};

module.exports = {
  uploadDiseaseImage: handleMulterError(uploadDiseaseImage),
  uploadSoilImage: handleMulterError(uploadSoilImage),
  uploadProfileImage: handleMulterError(uploadProfileImage),
  uploadMultipleImages: handleMulterError(uploadMultipleImages),
  deleteFile
};