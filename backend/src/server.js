process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT ERROR:", err);
});


const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Load environment variables
dotenv.config();

// Import configurations
const connectDB = require('./config/database');
const { logger } = require('./utils/logger');

// Import middleware
const { errorHandler } = require('./middleware/errorHandler');
const { generalLimiter, authLimiter, passwordResetLimiter } = require('./middleware/rateLimiter');


// Import routes
const authRoutes = require('./routes/authRoutes.js');
const soilObservationRoutes = require('./routes/soilObservationRoutes.js');
const weatherRoutes = require('./routes/weatherRoutes.js');
const irrigationRoutes = require('./routes/irrigationRoutes.js'); 
const diseaseRoutes = require('./routes/diseaseRoutes');
const waterRoutes = require('./routes/waterRoutes.js');
const yieldRoutes = require('./routes/yieldRoutes.js');
const chatbotRoutes = require('./routes/chatbotRoutes.js');
const analyticsRoutes = require('./routes/analyticsRoutes.js');
const waterSourceRoutes = require('./routes/waterSourceRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Bypass-Tunnel-Reminder', 'localtunnel-bypass-https', 'ngrok-skip-browser-warning']
}));
app.options('*', cors());

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Compression Middleware
app.use(compression());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Rate Limiting
app.use('/api', (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
}, generalLimiter);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    features: {
      mlIrrigation: true,
      ruleBasedIrrigation: true, // NEW: Rule-based irrigation enabled
      cropDatabase: true
    }
  });
});

const marketRoutes = require('./routes/marketRoutes');
const diseaseAlertRoutes = require('./routes/diseaseAlertRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ttsRoutes = require('./routes/ttsRoutes');

const communityRoutes = require('./routes/communityRoutes');
const messagingRoutes = require('./routes/messagingRoutes');

// API Routes
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/soil`, soilObservationRoutes);
app.use(`/api/${API_VERSION}/weather`, weatherRoutes);
app.use(`/api/${API_VERSION}/irrigation`, irrigationRoutes); 
app.use(`/api/${API_VERSION}/disease`, diseaseRoutes);
app.use(`/api/${API_VERSION}/water`, waterRoutes);
app.use(`/api/${API_VERSION}/yield`, yieldRoutes);
app.use(`/api/${API_VERSION}/chatbot`, chatbotRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/water-sources`, waterSourceRoutes);
app.use(`/api/${API_VERSION}/market`, marketRoutes);
app.use(`/api/${API_VERSION}/disease-alerts`, diseaseAlertRoutes);
app.use(`/api/${API_VERSION}/schemes`, schemeRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/tts`, ttsRoutes);
app.use(`/api/${API_VERSION}/community`, communityRoutes);
app.use(`/api/${API_VERSION}/messages`, messagingRoutes);

// Root Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Urban Farming Platform API',
    version: API_VERSION,
    documentation: '/api/docs',
    health: '/health',
    features: {
      irrigation: {
        mlBased: `/api/${API_VERSION}/irrigation/ml/*`,
        ruleBased: `/api/${API_VERSION}/irrigation/rule-based/*`,
        comparison: `/api/${API_VERSION}/irrigation/compare/:mlId/:ruleId`
      }
    }
  });
});

// API Documentation Route (Optional)
app.get('/api/docs', (req, res) => {
  res.status(200).json({
    message: 'Urban Farming Platform API Documentation',
    version: API_VERSION,
    endpoints: {
      authentication: {
        login: `POST /api/${API_VERSION}/auth/login`,
        register: `POST /api/${API_VERSION}/auth/register`,
        logout: `POST /api/${API_VERSION}/auth/logout`
      },
      irrigation: {
        mlBased: {
          generate: `POST /api/${API_VERSION}/irrigation/ml/generate`,
          schedules: `GET /api/${API_VERSION}/irrigation/ml/schedules`
        },
        ruleBased: {
          generate: `POST /api/${API_VERSION}/irrigation/rule-based/generate`,
          schedules: `GET /api/${API_VERSION}/irrigation/rule-based/schedules`,
          active: `GET /api/${API_VERSION}/irrigation/rule-based/active`,
          quickRecommendation: `POST /api/${API_VERSION}/irrigation/rule-based/quick-recommendation`,
          crops: `GET /api/${API_VERSION}/irrigation/rule-based/crops`,
          cropInfo: `GET /api/${API_VERSION}/irrigation/rule-based/crop/:cropName`
        },
        general: {
          all: `GET /api/${API_VERSION}/irrigation/all`,
          compare: `GET /api/${API_VERSION}/irrigation/compare/:mlId/:ruleId`
        }
      },
      crops: `GET/POST /api/${API_VERSION}/crops`,
      soil: `GET/POST /api/${API_VERSION}/soil`,
      weather: `GET /api/${API_VERSION}/weather`,
      diseases: `GET/POST /api/${API_VERSION}/diseases`,
      fertilizer: `GET/POST /api/${API_VERSION}/fertilizer`,
      water: `GET/POST /api/${API_VERSION}/water`,
      yield: `GET/POST /api/${API_VERSION}/yield`,
      market: `GET /api/${API_VERSION}/market`,
      chatbot: `POST /api/${API_VERSION}/chatbot`,
      analytics: `GET /api/${API_VERSION}/analytics`,
      waterSources: `GET/POST /api/${API_VERSION}/water-sources`
    },
    notes: {
      irrigation: 'Now supports both ML-based and Rule-based irrigation planning',
      ruleBased: 'Rule-based system requires no ML training and provides instant, farmer-friendly recommendations'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
    suggestion: 'Check /api/docs for available endpoints'
  });
});

// Error Handler Middleware (must be last)
app.use(errorHandler);

// Start Server
let server;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5180;

  server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Version: ${API_VERSION}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`💧 Irrigation: ML-Based ✅ | Rule-Based ✅`);
    console.log(`📖 API Docs: http://localhost:${PORT}/api/docs`);
  });
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;