import api from './api';
import { saveFarmerSectionInput } from '../utils/farmerContextStore';

export const dataBridgeService = {
  // ── 1. Soil Test Data Persistence & Bridge ─────────────────────────────────
  saveLatestSoilData: (soilData) => {
    try {
      if (!soilData) return;
      const results = soilData.results || soilData;
      const nutrients = soilData.nutrientLevels || {};
      const props = soilData.soilProperties || {};

      const nVal = nutrients.nitrogen?.score || results.nitrogenLevelScore || (results.nitrogenLevel === 'HIGH' ? 90 : results.nitrogenLevel === 'LOW' ? 30 : 60);
      const pVal = nutrients.phosphorus?.score || results.phosphorusLevelScore || (results.phosphorusLevel === 'HIGH' ? 80 : results.phosphorusLevel === 'LOW' ? 20 : 45);
      const kVal = nutrients.potassium?.score || results.potassiumLevelScore || (results.potassiumLevel === 'HIGH' ? 85 : results.potassiumLevel === 'LOW' ? 25 : 50);
      const phVal = props.ph?.value || results.phValue || 6.5;
      const textureVal = props.texture || results.texture || 'Loam';

      const payload = {
        nitrogen: Number(nVal),      // in kg/ha
        phosphorus: Number(pVal),    // in kg/ha
        potassium: Number(kVal),     // in kg/ha
        ph: Number(phVal),
        soilType: textureVal,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('agrisathi_latest_soil_test', JSON.stringify(payload));
      saveFarmerSectionInput('soil', payload);
      return payload;
    } catch (e) {
      console.warn('Failed to save soil test bridge data:', e);
    }
  },

  getLatestSoilData: () => {
    try {
      const raw = localStorage.getItem('agrisathi_latest_soil_test');
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return { nitrogen: 60, phosphorus: 45, potassium: 50, ph: 6.5, soilType: 'Loam' };
  },

  // ── 2. Geolocation & Weather Auto-Fetch with High Accuracy & Reverse Geocoding ──────
  getAutoLocationAndWeather: async () => {
    return new Promise((resolve) => {
      const defaultLocation = {
        city: 'Barasat',
        district: 'North 24 Parganas',
        state: 'West Bengal',
        latitude: 22.7243,
        longitude: 88.4754,
        temperature: 28,
        humidity: 70,
        rainfall: 5,
        rainForecast: 2,
        windSpeed: 8,
        currentSoilMoisture: 60,
        season: 'Monsoon'
      };

      if (!navigator.geolocation) {
        resolve(defaultLocation);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          let placeName = 'Barasat';
          let districtName = 'North 24 Parganas';
          let stateName = 'West Bengal';

          // 📍 High-Precision Nominatim Reverse Geocoding
          try {
            const nomRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=12`);
            if (nomRes.ok) {
              const nomData = await nomRes.json();
              const addr = nomData.address || {};
              placeName = addr.city || addr.town || addr.suburb || addr.village || addr.county || 'Barasat';
              districtName = addr.state_district || addr.county || addr.district || 'North 24 Parganas';
              stateName = addr.state || 'West Bengal';
            }
          } catch (e) {
            console.warn('Nominatim reverse geocoding error:', e);
          }

          try {
            const res = await api.get('/weather/context', { params: { lat, lon } });
            if (res.data && res.data.success) {
              const ctx = res.data.data || {};
              const curr = ctx.currentWeather || ctx.current || {};
              const insights = ctx.insights || {};
              const loc = ctx.location || {};

              const fetched = {
                city: loc.name || placeName,
                district: loc.district || districtName,
                state: loc.state || stateName,
                latitude: lat,
                longitude: lon,
                temperature: curr.temperature || 28,
                humidity: curr.humidity || 70,
                rainfall: curr.rainfallMm || 5,
                rainForecast: insights.forecast7DayRain || 2,
                windSpeed: curr.windSpeed || 8,
                currentSoilMoisture: 60,
                season: curr.season || 'Monsoon'
              };
              resolve(fetched);
              return;
            }
          } catch (err) {
            console.warn('Backend weather context fetch failed, falling back to local defaults:', err);
          }

          resolve({
            ...defaultLocation,
            city: placeName,
            district: districtName,
            state: stateName,
            latitude: lat,
            longitude: lon
          });
        },
        () => {
          resolve(defaultLocation);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  }
};

export default dataBridgeService;
