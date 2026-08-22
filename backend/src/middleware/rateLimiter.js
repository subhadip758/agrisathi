const rateLimit = require('express-rate-limit');

const isDev = process.env.NODE_ENV !== 'production';

const skipLocalhost = (req) => {
  if (isDev) return true;
  const ip = req.ip || req.connection?.remoteAddress || '';
  return ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost');
};

/**
 * General API Rate Limiter
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
  skip: skipLocalhost,
  message: {
    status: 'error',
    message: 'Too many requests from this IP, please try again later'
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many requests from this IP, please try again later'
    });
  }
});

/**
 * Strict Rate Limiter for Authentication Routes
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skip: skipLocalhost,
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later'
  },
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many login attempts, please try again later'
    });
  }
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  skip: skipLocalhost,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Too many password reset requests, please try again later'
    });
  }
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  skip: skipLocalhost,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Upload limit exceeded, please try again later'
    });
  }
});

const mlPredictionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  skip: skipLocalhost,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Prediction limit exceeded, please try again later'
    });
  }
});

const chatbotLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 1000,
  skip: skipLocalhost,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'Chatbot usage limit exceeded, please try again later'
    });
  }
});

const apiKeyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 50,
  skip: skipLocalhost,
  handler: (req, res) => {
    res.status(429).json({
      status: 'error',
      message: 'API key creation limit exceeded'
    });
  }
});

const createCustomLimiter = (windowMs, max, message = 'Too many requests') => {
  return rateLimit({
    windowMs,
    max: 10000,
    skip: skipLocalhost,
    message: { status: 'error', message },
    handler: (req, res) => {
      res.status(429).json({ status: 'error', message });
    }
  });
};

const subscriptionBasedLimiter = (limits) => {
  return (req, res, next) => next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  mlPredictionLimiter,
  chatbotLimiter,
  apiKeyLimiter,
  createCustomLimiter,
  subscriptionBasedLimiter
};