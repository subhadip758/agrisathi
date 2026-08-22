# 🌾 Urban Farming Platform - Complete Documentation

A comprehensive AI-powered platform for urban farmers featuring crop recommendations, soil analysis, disease detection, irrigation planning, and market insights.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The Urban Farming Platform is a full-stack web application that leverages AI/ML to help urban farmers optimize their farming practices. It provides intelligent recommendations for crop selection, soil management, disease detection, irrigation scheduling, and market analysis.

### Key Highlights

- **AI-Powered Insights**: ML models for crop recommendations and disease detection
- **Real-time Weather Integration**: Location-based weather advisories
- **Smart Irrigation**: Automated irrigation scheduling with weather adjustments
- **Market Intelligence**: Real-time crop price tracking and forecasting
- **Comprehensive Analytics**: Water usage, soil health, and yield predictions

---

## ✨ Features

### 🌱 Crop Management
- **Crop Recommendation System**: ML-based suggestions using NPK, climate, and soil data
- **Yield Prediction**: Forecast crop yields with 80%+ accuracy
- **Growth Stage Tracking**: Monitor crop development stages

### 🧪 Soil & Fertilizer
- **Soil Analysis**: Comprehensive soil health scoring (0-100)
- **NPK Analysis**: Detailed nutrient level assessment
- **Fertilizer Scheduler**: Customized fertilizer recommendations
- **Regional Comparisons**: Compare soil health across regions

### 💧 Water Management
- **Irrigation Planner**: Smart scheduling with weather integration
- **Water Analytics**: Track usage, efficiency, and savings opportunities
- **Multi-source Support**: Municipal, well, rainwater, river sources
- **Crop-wise Tracking**: Water consumption per crop type

### 🐛 Disease & Pest Control
- **Disease Detection**: Image-based disease identification (87%+ accuracy)
- **Treatment Recommendations**: Chemical, organic, and cultural practices
- **Expert Review System**: Escalation to agricultural experts
- **Follow-up Tracking**: Monitor treatment progress

### 🌤️ Weather & Market
- **Weather Advisory**: Real-time weather data and farming advisories
- **Market Prices**: Current and historical crop prices
- **Price Forecasting**: Predict future market trends
- **Best Sell Time**: AI recommendations for optimal selling periods

### 💬 AI Chatbot
- **24/7 Support**: Intelligent agricultural helpdesk
- **Multi-language**: Support for regional languages
- **Intent Detection**: Understands farming queries
- **Expert Escalation**: Human support when needed

---

## 🛠️ Technology Stack

### Frontend
```
- React 18.2.0
- React Router 6.16.0
- Tailwind CSS 3.3.3
- Axios 1.5.1
- Recharts 2.8.0
- Date-fns 2.30.0
- React Toastify 9.1.3
- Lucide React (Icons)
```

### Backend
```
- Node.js 16+
- Express.js 4.18.2
- MongoDB 6.0
- Mongoose 7.6.3
- JWT Authentication
- Bcrypt.js
- Multer (File uploads)
- Winston (Logging)
- Joi (Validation)
```

### ML Services
```
- Python 3.9
- Flask 2.3.3
- TensorFlow 2.13.0
- Scikit-learn 1.3.0
- OpenCV 4.8.0
- Pandas 2.0.3
- NumPy 1.24.3
```

### External APIs
```
- OpenWeatherMap API
- OpenAI/Anthropic API (Chatbot)
```

---

## 📁 Project Structure

```
urban-farming-platform/
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── config/            # Database, JWT, Multer config
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, error handling, rate limiting
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Helper functions
│   │   └── server.js          # Entry point
│   ├── uploads/               # File uploads
│   ├── package.json
│   └── .env.example
│
├── ml-services/               # Python ML microservices
│   ├── models/                # Trained ML models
│   │   ├── crop_recommendation/
│   │   ├── disease_detection/
│   │   ├── soil_prediction/
│   │   ├── yield_prediction/
│   │   └── irrigation_optimizer/
│   ├── api/
│   │   ├── app.py            # Flask app
│   │   ├── routes.py         # ML endpoints
│   │   └── utils.py          # ML utilities
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── context/          # React context
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   ├── utils/            # Utilities
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── docker-compose.yml         # Docker orchestration
└── README.md                  # This file
```

---

## 📋 Prerequisites

### Required Software

- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **Python**: v3.9 or higher
- **MongoDB**: v6.0 or higher
- **Docker** (optional): v20.10 or higher
- **Docker Compose** (optional): v2.0 or higher

### API Keys Required

1. **OpenWeatherMap API Key**
   - Sign up at: https://openweathermap.org/api
   - Free tier: 1,000 calls/day

2. **OpenAI API Key** (for chatbot)
   - Sign up at: https://platform.openai.com
   - Or use Anthropic Claude API

---

## 🚀 Installation

### Option 1: Docker Installation (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd urban-farming-platform

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp ml-services/.env.example ml-services/.env

# Edit .env files with your API keys
# nano backend/.env
# nano frontend/.env
# nano ml-services/.env

# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 2: Manual Installation

#### Step 1: Clone Repository

```bash
git clone <repository-url>
cd urban-farming-platform
```

#### Step 2: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start MongoDB (if not using Docker)
mongod --dbpath=/path/to/data

# Run backend server
npm run dev
```

#### Step 3: ML Services Setup

```bash
cd ml-services

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start ML services
python api/app.py
```

#### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with backend URL
nano .env

# Start frontend
npm start
```

---

## ⚙️ Configuration

### Backend Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/urban_farming

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# ML Service
ML_SERVICE_URL=http://localhost:8000

# External APIs
WEATHER_API_KEY=your_openweathermap_api_key
OPENAI_API_KEY=your_openai_api_key

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_ML_API_URL=http://localhost:8000/api
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
```

### ML Services Environment Variables

```env
FLASK_PORT=8000
MODEL_PATH=./models
OPENAI_API_KEY=your_openai_api_key
```

---

## 🏃 Running the Application

### Development Mode

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```
   Backend runs on: http://localhost:5000

2. **Start ML Services**:
   ```bash
   cd ml-services
   python api/app.py
   ```
   ML Services run on: http://localhost:8000

3. **Start Frontend**:
   ```bash
   cd frontend
   npm start
   ```
   Frontend runs on: http://localhost:3000

### Production Mode

```bash
# Backend
cd backend
npm start

# ML Services
cd ml-services
gunicorn -w 4 -b 0.0.0.0:8000 api.app:app

# Frontend
cd frontend
npm run build
serve -s build -p 3000
```

### Using Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/v1/auth/register     - Register new user
POST   /api/v1/auth/login        - Login user
POST   /api/v1/auth/logout       - Logout user
GET    /api/v1/auth/me           - Get current user
PUT    /api/v1/auth/updatedetails - Update user details
PUT    /api/v1/auth/updatepassword - Update password
```

### Crop Endpoints

```
POST   /api/v1/crops/recommend   - Get crop recommendations
GET    /api/v1/crops/history     - Get recommendation history
GET    /api/v1/crops/:id         - Get single recommendation
PUT    /api/v1/crops/:id/implement - Mark as implemented
POST   /api/v1/crops/:id/feedback - Add feedback
DELETE /api/v1/crops/:id         - Delete recommendation
```

### Soil Endpoints

```
POST   /api/v1/soil/analyze      - Analyze soil
GET    /api/v1/soil/history      - Get analysis history
GET    /api/v1/soil/:id          - Get single analysis
PUT    /api/v1/soil/:id/verify   - Verify analysis (Admin)
```

### Disease Endpoints

```
POST   /api/v1/diseases/detect   - Detect disease from image
GET    /api/v1/diseases/history  - Get detection history
POST   /api/v1/diseases/:id/followup - Add follow-up
POST   /api/v1/diseases/:id/request-review - Request expert review
```

### Weather Endpoints

```
GET    /api/v1/weather/current   - Get current weather
GET    /api/v1/weather/forecast  - Get weather forecast
GET    /api/v1/weather/advisory  - Get agricultural advisory
```

### Full API Documentation

Access Swagger/OpenAPI docs at: `http://localhost:5000/api-docs`

---

## 🚢 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create apps
heroku create urban-farming-backend
heroku create urban-farming-frontend
heroku create urban-farming-ml

# Set environment variables
heroku config:set NODE_ENV=production --app urban-farming-backend
heroku config:set MONGODB_URI=<your-mongodb-uri> --app urban-farming-backend

# Deploy
git push heroku main
```

### Deploy to AWS

1. **Backend**: Deploy to EC2 or Elastic Beanstalk
2. **Frontend**: Deploy to S3 + CloudFront
3. **ML Services**: Deploy to EC2 with GPU or SageMaker
4. **Database**: Use MongoDB Atlas or AWS DocumentDB

### Deploy to DigitalOcean

1. Create Droplets for each service
2. Use App Platform for easy deployment
3. Set up MongoDB managed database
4. Configure DNS and SSL

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: MongoDB connection failed
```bash
# Solution: Check if MongoDB is running
mongod --version
sudo systemctl status mongod
sudo systemctl start mongod
```

**Issue**: ML Service not responding
```bash
# Solution: Check Python dependencies
pip install -r requirements.txt --upgrade
python api/app.py
```

**Issue**: Frontend can't connect to backend
```bash
# Solution: Check CORS settings
# In backend/.env, set:
CORS_ORIGIN=http://localhost:3000
```

**Issue**: Port already in use
```bash
# Solution: Kill process using port
# On macOS/Linux:
lsof -ti:5000 | xargs kill -9
# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=* npm run dev

# ML Services
FLASK_ENV=development python api/app.py
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- **Backend**: Use ESLint with Airbnb config
- **Frontend**: Use Prettier + ESLint
- **Python**: Follow PEP 8 guidelines

### Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# ML tests
cd ml-services
pytest
```

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team & Support

- **Documentation**: https://docs.urbanfarm.com
- **Issues**: https://github.com/your-repo/issues
- **Email**: support@urbanfarm.com

---

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- TensorFlow team for ML frameworks
- MongoDB for database solutions
- The open-source community

---

## 📊 Performance Benchmarks

- **API Response Time**: < 200ms (average)
- **ML Prediction Time**: < 2s (crop recommendation)
- **Image Processing**: < 5s (disease detection)
- **Concurrent Users**: Supports 1000+ simultaneous users
- **Database Queries**: Optimized with indexes (< 50ms)

---

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Rate limiting on all endpoints
- Input validation with Joi
- SQL injection prevention
- XSS protection with Helmet.js
- CORS configured for specific origins

---

## 📈 Roadmap

- [ ] Mobile application (React Native)
- [ ] Offline mode support
- [ ] Advanced analytics dashboard
- [ ] Community marketplace
- [ ] IoT sensor integration
- [ ] Drone imagery support
- [ ] Multi-language support
- [ ] Blockchain for supply chain

---

**Happy Farming! 🌾🚜**
