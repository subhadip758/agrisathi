const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'agrisathi_v3_super_secret_jwt_key_2026';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

/**
 * Generate JWT Token
 * @param {string} userId - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRE
    }
  );
};

/**
 * Verify JWT Token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate Refresh Token
 * @param {string} userId - User ID to encode in token
 * @returns {string} Refresh token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

/**
 * Decode Token Without Verification (for checking expiry)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token or null
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

/**
 * Get Token From Request Headers
 * @param {Object} req - Express request object
 * @returns {string|null} Token or null
 */
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

/**
 * Send Token Response
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 */
const sendTokenResponse = (user, statusCode, res) => {
  const userId = user._id || '650000000000000000000001';
  const token = generateToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  };

  if (user.password) user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      status: 'success',
      token,
      refreshToken,
      user
    });
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  decodeToken,
  getTokenFromHeader,
  sendTokenResponse
};