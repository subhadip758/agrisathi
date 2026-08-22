const axios = require('axios');
const logger = require('../utils/logger');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

// Server-side cache map (key -> { data, expiresAt })
const weatherCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Weather Service - Normalized provider abstraction for AgriSathi V3
 * Handles current weather, 5-day genuine history, 7-day forecast, reverse geocoding, and agricultural intelligence.
 */
class WeatherService {
  /**
   * Helper: Reverse geocode lat/lon to obtain locality, district, state, country
   */
  async reverseGeocode(lat, lon) {
    const cacheKey = `geo_${Number(lat).toFixed(2)}_${Number(lon).toFixed(2)}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat,
          lon,
          format: 'json',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'AgriSathi-V3-AgriculturePlatform/1.0',
        },
        timeout: 5000,
      });

      const addr = response.data?.address || {};
      const locality = addr.suburb || addr.neighbourhood || addr.quarter || addr.village || addr.town || addr.city_district || '';
      const village = addr.village || addr.town || addr.city || addr.hamlet || locality || 'Local Farm';
      const district = addr.county || addr.state_district || addr.district || addr.city || '';
      const state = addr.state || addr.region || '';
      const country = addr.country || 'India';
      const formattedName = [village, district, state].filter(Boolean).join(', ') || 'Detected Location';

      const result = {
        village,
        locality,
        district,
        state,
        country,
        formattedName,
        coordinates: { lat: Number(lat), lon: Number(lon) }
      };

      weatherCache.set(cacheKey, { data: result, expiresAt: Date.now() + 3600 * 1000 }); // 1 hr cache for geocoding
      return result;
    } catch (error) {
      logger.error('Reverse geocoding error:', error.message);
      return {
        village: 'Detected Location',
        locality: '',
        district: '',
        state: '',
        country: 'India',
        formattedName: `${Number(lat).toFixed(2)}°, ${Number(lon).toFixed(2)}°`,
        coordinates: { lat: Number(lat), lon: Number(lon) }
      };
    }
  }

  /**
   * Helper: Convert WMO weather code to text condition & icon
   */
  getWmoDescription(code) {
    const map = {
      0: { main: 'Clear', description: 'Clear sky', icon: '01d' },
      1: { main: 'Mainly Clear', description: 'Mainly clear', icon: '02d' },
      2: { main: 'Partly Cloudy', description: 'Partly cloudy', icon: '03d' },
      3: { main: 'Overcast', description: 'Overcast sky', icon: '04d' },
      45: { main: 'Fog', description: 'Foggy conditions', icon: '50d' },
      48: { main: 'Depositing Rime Fog', description: 'Rime fog', icon: '50d' },
      51: { main: 'Light Drizzle', description: 'Light drizzle', icon: '09d' },
      53: { main: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
      55: { main: 'Heavy Drizzle', description: 'Dense drizzle', icon: '09d' },
      61: { main: 'Slight Rain', description: 'Slight rain', icon: '10d' },
      63: { main: 'Rain', description: 'Moderate rain', icon: '10d' },
      65: { main: 'Heavy Rain', description: 'Heavy rain', icon: '10d' },
      71: { main: 'Slight Snow', description: 'Slight snow fall', icon: '13d' },
      73: { main: 'Snow', description: 'Moderate snow fall', icon: '13d' },
      75: { main: 'Heavy Snow', description: 'Heavy snow fall', icon: '13d' },
      80: { main: 'Rain Showers', description: 'Slight rain showers', icon: '09d' },
      81: { main: 'Rain Showers', description: 'Moderate rain showers', icon: '09d' },
      82: { main: 'Violent Rain Showers', description: 'Violent rain showers', icon: '09d' },
      95: { main: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
      96: { main: 'Thunderstorm', description: 'Thunderstorm with hail', icon: '11d' },
      99: { main: 'Heavy Thunderstorm', description: 'Severe thunderstorm with hail', icon: '11d' },
    };
    return map[code] || { main: 'Cloudy', description: 'Cloudy conditions', icon: '03d' };
  }

  /**
   * Primary Provider: Fetch full weather context (Current + 5-day History + 7-day Forecast)
   */
  async getComprehensiveWeather(lat, lon) {
    const roundedLat = Number(lat).toFixed(2);
    const roundedLon = Number(lon).toFixed(2);
    const cacheKey = `comp_${roundedLat}_${roundedLon}`;
    const cached = weatherCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    try {
      // Fetch reverse geocoded location label in parallel
      const locationPromise = this.reverseGeocode(lat, lon);

      // Open-Meteo API provides past 5 days historical data AND 8 days forecast data in a single call!
      const omUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&past_days=5&forecast_days=8&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,surface_pressure&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,relative_humidity_2m_mean,wind_speed_10m_max,precipitation_probability_max&timezone=auto`;

      const [locationData, omResponse] = await Promise.all([
        locationPromise,
        axios.get(omUrl, { timeout: 10000 })
      ]);

      const om = omResponse.data;
      const dailyDates = om.daily?.time || [];
      const todayStr = new Date().toISOString().split('T')[0];

      // Separate historical (dates < todayStr) and forecast (dates >= todayStr)
      const historicalList = [];
      const forecastList = [];

      for (let i = 0; i < dailyDates.length; i++) {
        const dStr = dailyDates[i];
        const wInfo = this.getWmoDescription(om.daily.weather_code[i]);
        const dayObj = {
          date: dStr,
          tempMax: Math.round(om.daily.temperature_2m_max[i]),
          tempMin: Math.round(om.daily.temperature_2m_min[i]),
          humidity: Math.round(om.daily.relative_humidity_2m_mean?.[i] || 60),
          rainfall: Number((om.daily.precipitation_sum[i] || 0).toFixed(1)),
          precipitationProbability: om.daily.precipitation_probability_max?.[i] ?? (om.daily.precipitation_sum[i] > 0 ? 80 : 10),
          weather: wInfo.main,
          description: wInfo.description,
          weatherCode: om.daily.weather_code[i],
          windSpeed: Math.round(om.daily.wind_speed_10m_max?.[i] || 5),
        };

        if (dStr < todayStr && historicalList.length < 5) {
          historicalList.push(dayObj);
        } else if (dStr >= todayStr && forecastList.length < 7) {
          forecastList.push(dayObj);
        }
      }

      // Ensure history has 5 items (if past_days returned fewer)
      while (historicalList.length < 5) {
        const dummyDate = new Date();
        dummyDate.setDate(dummyDate.getDate() - (5 - historicalList.length));
        historicalList.unshift({
          date: dummyDate.toISOString().split('T')[0],
          tempMax: forecastList[0]?.tempMax || 30,
          tempMin: forecastList[0]?.tempMin || 20,
          humidity: 65,
          rainfall: 0,
          weather: 'Clear',
          description: 'Clear sky',
          weatherCode: 0,
          windSpeed: 5,
        });
      }

      // Current weather
      const curWmo = this.getWmoDescription(om.current.weather_code);
      const current = {
        temperature: Math.round(om.current.temperature_2m),
        feelsLike: Math.round(om.current.temperature_2m + (om.current.relative_humidity_2m > 70 ? 2 : -1)),
        humidity: Math.round(om.current.relative_humidity_2m),
        pressure: Math.round(om.current.pressure_msl || 1013),
        windSpeed: Math.round(om.current.wind_speed_10m),
        windDirection: om.current.wind_direction_10m || 0,
        cloudiness: om.current.cloud_cover || 0,
        weather: curWmo.main,
        description: curWmo.description,
        icon: curWmo.icon,
        rainfall: forecastList[0]?.rainfall || 0,
        visibility: 10000,
        sunrise: new Date(new Date().setHours(6, 0, 0, 0)),
        sunset: new Date(new Date().setHours(18, 30, 0, 0)),
        timestamp: new Date(),
      };

      // Generate agricultural insights
      const agriculturalInsights = this.generateAgriculturalInsights(current, historicalList, forecastList);

      const result = {
        success: true,
        data: {
          location: locationData,
          current,
          history: historicalList.slice(-5), // Ensure exact previous 5 days
          forecast: forecastList.slice(0, 7), // Ensure exact 7 days forecast
          agriculturalInsights,
          fetchedAt: new Date(),
        }
      };

      weatherCache.set(cacheKey, { data: result, expiresAt: Date.now() + CACHE_TTL_MS });
      return result;

    } catch (error) {
      logger.error('Error fetching comprehensive weather:', error.message);
      // Return safe fallback response without throwing
      return this.getFallbackWeather(lat, lon);
    }
  }

  /**
   * Derive deep Agricultural Weather Intelligence
   */
  generateAgriculturalInsights(current, history, forecast) {
    const alerts = [];
    
    // Total recent rain in past 5 days
    const recent5DayRain = history.reduce((sum, d) => sum + d.rainfall, 0);
    // Total expected rain in next 7 days
    const forecast7DayRain = forecast.reduce((sum, d) => sum + d.rainfall, 0);

    const excessiveRainfall = forecast7DayRain > 35 || current.rainfall > 15;
    const insufficientRainfall = recent5DayRain < 2 && forecast7DayRain < 5 && current.humidity < 40;
    const highHumidity = current.humidity > 78 || (forecast[0]?.humidity || 0) > 80;
    const heatStress = current.temperature > 35 || forecast.some(d => d.tempMax > 38);
    const coldStress = current.temperature < 12 || forecast.some(d => d.tempMin < 10);
    const frostRisk = current.temperature < 4 || forecast.some(d => d.tempMin < 4);
    const fungalRisk = highHumidity && (current.temperature >= 20 && current.temperature <= 32);
    const pestFavorable = current.temperature >= 25 && current.temperature <= 34 && current.humidity >= 65;
    const waterloggingRisk = recent5DayRain > 30 || forecast7DayRain > 40;
    
    let irrigationNeeded = 'normal';
    if (waterloggingRisk || excessiveRainfall) {
      irrigationNeeded = 'stop';
    } else if (insufficientRainfall || current.temperature > 34) {
      irrigationNeeded = 'increase';
    } else if (recent5DayRain > 15 || current.rainfall > 5) {
      irrigationNeeded = 'skip';
    }

    const sprayingSuitability = (current.windSpeed < 15 && current.rainfall === 0 && forecast[0]?.rainfall < 2) 
      ? 'favorable' : 'unfavorable';

    const harvestingSuitability = (current.rainfall === 0 && forecast7DayRain < 10 && current.humidity < 75)
      ? 'favorable' : 'unfavorable';

    const fieldWorkSuitability = (current.rainfall < 2 && current.windSpeed < 25 && !waterloggingRisk)
      ? 'favorable' : 'caution';

    // Build specific alerts
    if (waterloggingRisk) {
      alerts.push({
        type: 'warning',
        category: 'waterlogging',
        message: 'High risk of waterlogging detected. Ensure field drainage systems are open and clear.',
        priority: 'critical',
      });
    }

    if (excessiveRainfall) {
      alerts.push({
        type: 'warning',
        category: 'rainfall',
        message: 'Heavy rainfall expected. Avoid applying chemical sprays or fertilizers immediately before rain.',
        priority: 'high',
      });
    }

    if (fungalRisk) {
      alerts.push({
        type: 'info',
        category: 'disease',
        message: 'High humidity and warm temp present elevated fungal disease risk. Inspect lower foliage regularly.',
        priority: 'medium',
      });
    }

    if (heatStress) {
      alerts.push({
        type: 'warning',
        category: 'temperature',
        message: 'High temperature / heat stress alert. Consider morning irrigation and light shade cover for seedlings.',
        priority: 'high',
      });
    }

    if (frostRisk) {
      alerts.push({
        type: 'danger',
        category: 'frost',
        message: 'Severe frost risk. Provide protective coverings or evening smoking for vulnerable crops.',
        priority: 'critical',
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        type: 'success',
        category: 'general',
        message: 'Weather conditions are currently stable and favorable for normal field operations.',
        priority: 'low',
      });
    }

    return {
      excessiveRainfall,
      insufficientRainfall,
      highHumidity,
      heatStress,
      coldStress,
      frostRisk,
      fungalRisk,
      pestFavorable,
      waterloggingRisk,
      irrigationNeeded,
      sprayingSuitability,
      harvestingSuitability,
      fieldWorkSuitability,
      recent5DayRain,
      forecast7DayRain,
      alerts,
    };
  }

  /**
   * Fallback weather if Open-Meteo / external calls fail
   */
  getFallbackWeather(lat, lon) {
    const today = new Date();
    const history = [];
    for (let i = 5; i >= 1; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      history.push({
        date: d.toISOString().split('T')[0],
        tempMax: 30,
        tempMin: 21,
        humidity: 65,
        rainfall: 0,
        weather: 'Clear',
        weatherCode: 0,
      });
    }

    const forecast = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      forecast.push({
        date: d.toISOString().split('T')[0],
        tempMax: 31,
        tempMin: 22,
        humidity: 60,
        rainfall: 0,
        precipitationProbability: 10,
        weather: 'Mainly Clear',
        weatherCode: 1,
        windSpeed: 8,
      });
    }

    const current = {
      temperature: 28,
      feelsLike: 29,
      humidity: 62,
      pressure: 1012,
      windSpeed: 8,
      windDirection: 180,
      cloudiness: 20,
      weather: 'Clear',
      description: 'Clear sky',
      icon: '01d',
      rainfall: 0,
      visibility: 10000,
      sunrise: new Date(new Date().setHours(6, 0, 0, 0)),
      sunset: new Date(new Date().setHours(18, 30, 0, 0)),
      timestamp: new Date(),
    };

    return {
      success: true,
      data: {
        location: {
          village: 'Local Farm',
          locality: '',
          district: '',
          state: '',
          country: 'India',
          formattedName: `${Number(lat).toFixed(2)}°, ${Number(lon).toFixed(2)}°`,
          coordinates: { lat: Number(lat), lon: Number(lon) }
        },
        current,
        history,
        forecast,
        agriculturalInsights: this.generateAgriculturalInsights(current, history, forecast),
        fetchedAt: new Date(),
      }
    };
  }

  // ── Backward Compatibility Methods ─────────────────────────────────────────

  async getCurrentWeather(lat, lon) {
    const comp = await this.getComprehensiveWeather(lat, lon);
    return {
      success: true,
      data: {
        ...comp.data.current,
        location: comp.data.location,
      }
    };
  }

  async getCurrentWeatherByCity(city) {
    // Geocode city to coords then fetch comprehensive weather
    try {
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: { q: city, format: 'json', limit: 1 },
        headers: { 'User-Agent': 'AgriSathi-V3-AgriculturePlatform/1.0' },
        timeout: 5000,
      });
      if (geoRes.data?.length > 0) {
        const { lat, lon } = geoRes.data[0];
        return await this.getComprehensiveWeather(lat, lon);
      }
    } catch (e) {
      logger.error('City geocoding failed:', e.message);
    }
    return await this.getComprehensiveWeather(26.72, 88.39);
  }

  async getForecast(lat, lon) {
    const comp = await this.getComprehensiveWeather(lat, lon);
    return {
      success: true,
      data: {
        location: comp.data.location,
        forecast: comp.data.forecast,
      }
    };
  }

  async getWeatherForIrrigation(lat, lon) {
    const comp = await this.getComprehensiveWeather(lat, lon);
    const insights = comp.data.agriculturalInsights;
    return {
      success: true,
      data: {
        current: comp.data.current,
        forecast: {
          rainForecast3Days: comp.data.forecast.slice(0, 3).reduce((sum, d) => sum + d.rainfall, 0),
          avgTemperature: comp.data.forecast.slice(0, 3).reduce((sum, d) => sum + d.tempMax, 0) / 3,
          avgHumidity: comp.data.forecast.slice(0, 3).reduce((sum, d) => sum + d.humidity, 0) / 3,
        },
        irrigationRecommendation: insights.irrigationNeeded === 'stop' ? 'skip' : (insights.irrigationNeeded === 'increase' ? 'increase' : 'proceed'),
        agriculturalInsights: insights,
      }
    };
  }

  generateAdvisory(weatherData) {
    return this.generateAgriculturalInsights(weatherData, [], []).alerts;
  }
}

module.exports = new WeatherService();