import React, { useState, useEffect } from 'react';
import irrigationService from '../../services/irrigationService';
import { useLanguage } from '../../context/LanguageContext';
import irrigationTranslations from '../../i18n/irrigation';

const IrrigationForm = ({ onScheduleReceived, onMLPredictionReceived, onMLRecommendationReceived }) => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.aiForm ?? irrigationTranslations.en.aiForm;

  const [formData, setFormData] = useState({
    scheduleName: 'My Farm Irrigation Schedule',
    cropType: 'rice',
    soilType: 'loamy',
    soilMoisture: '45',
    temperature: '28',
    humidity: '65',
    rainfall: '0',
    cropStage: 'vegetative',
    farmSize: '2.5',
    latitude: '',
    longitude: '',
    frequency: 'daily',
    irrigationSystem: 'drip',
    waterAmount: '2500',
    plantedDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [mlLoading, setMlLoading] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('');

  // 📍 Automatic GPS location detection on mount
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported. Defaulting to 26.7271, 88.3953.');
      setFormData(prev => ({ ...prev, latitude: '26.7271', longitude: '88.3953' }));
      return;
    }

    setGpsStatus('Detecting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(4),
          longitude: pos.coords.longitude.toFixed(4)
        }));
        setGpsStatus('GPS location detected successfully!');
      },
      () => {
        setGpsStatus('GPS permission denied. Using default location (26.7271, 88.3953).');
        setFormData(prev => ({ ...prev, latitude: '26.7271', longitude: '88.3953' }));
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    detectLocation();
  }, []);

  const cropTypes = [
    'rice', 'wheat', 'maize', 'cotton', 'sugarcane',
    'potato', 'tomato', 'onion', 'soybean', 'chickpea',
    'groundnut', 'mustard', 'other'
  ];

  const soilTypes = ['clay', 'sandy', 'loamy', 'peaty', 'chalky', 'silty'];

  const cropStages = [
    'germination', 'vegetative', 'flowering', 'fruiting', 'maturation', 'harvest'
  ];

  const getCropDays = () => {
    if (!formData.plantedDate) return 45;
    const planted = new Date(formData.plantedDate);
    const today   = new Date();
    return Math.max(1, Math.floor((today - planted) / (1000 * 60 * 60 * 24)));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const lat = formData.latitude || '26.7271';
    const lon = formData.longitude || '88.3953';

    if (!formData.latitude || !formData.longitude) {
      setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
    }

    if (!formData.scheduleName.trim())                                                  newErrors.scheduleName  = t.scheduleNameErr;
    if (!formData.cropType)                                                             newErrors.cropType      = t.cropTypeErr;
    if (!formData.soilType)                                                             newErrors.soilType      = t.soilTypeErr;
    if (formData.soilMoisture === '' || formData.soilMoisture < 0 || formData.soilMoisture > 100) newErrors.soilMoisture = t.soilMoistureErr;
    if (!formData.temperature || formData.temperature < -10 || formData.temperature > 60) newErrors.temperature  = t.temperatureErr;
    if (!formData.humidity || formData.humidity < 0 || formData.humidity > 100)         newErrors.humidity      = t.humidityErr;
    if (formData.rainfall && (formData.rainfall < 0 || formData.rainfall > 3000))       newErrors.rainfall      = t.rainfallErr;
    if (!formData.cropStage)                                                            newErrors.cropStage     = t.cropStageErr;
    if (!formData.farmSize || formData.farmSize <= 0)                                   newErrors.farmSize      = t.farmSizeErr;
    if (!formData.waterAmount || formData.waterAmount <= 0)                             newErrors.waterAmount   = t.waterAmountErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMLPrediction = async () => {
    if (!onMLPredictionReceived) return;
    try {
      setMlLoading(true);
      const prediction = await irrigationService.getPrediction({
        soilMoisture: Number(formData.soilMoisture || 45),
        temperature:  Number(formData.temperature || 28),
        humidity:     Number(formData.humidity || 65),
        rainfall:     Number(formData.rainfall) || 0,
        cropType:     formData.cropType,
        cropDays:     getCropDays(),
        soilType:     formData.soilType,
      });
      onMLPredictionReceived(prediction);
    } catch (error) {
      console.error('ML Prediction Error:', error);
    } finally {
      setMlLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await getMLPrediction();
      const payload = {
        scheduleName: formData.scheduleName,
        cropDetails: {
          cropType:    formData.cropType,
          cropStage:   formData.cropStage,
          cropDays:    getCropDays(),
          plantedDate: formData.plantedDate || new Date().toISOString(),
          area: { value: Number(formData.farmSize), unit: 'acres' },
        },
        soilInformation: {
          soilType:     formData.soilType,
          soilMoisture: Number(formData.soilMoisture),
          moisture:     Number(formData.soilMoisture),
        },
        location: {
          coordinates: {
            latitude: Number(formData.latitude || 26.7271),
            longitude: Number(formData.longitude || 88.3953)
          },
          address: ''
        },
        irrigationSystem: {
          type:       formData.irrigationSystem,
          efficiency: formData.irrigationSystem === 'drip' ? 90 : formData.irrigationSystem === 'sprinkler' ? 75 : 60
        },
        schedule: {
          frequency: formData.frequency,
          waterAmount: { value: Number(formData.waterAmount), unit: 'liters' },
          preferredTimes: [{ hour: 6, minute: 0, duration: 60 }]
        },
        duration: { startDate: new Date().toISOString() },
        weatherAdjustments: { enabled: true, rainThreshold: 10 },
        notifications: { enabled: true, methods: ['email'] }
      };
      const response = await irrigationService.createSchedule(payload);
      if (response.status === 'success' || response.success) {
        onScheduleReceived(response.data || response);
      } else {
        setErrors({ general: response.message || t.generalError });
      }
    } catch (error) {
      setErrors({ general: error.message || t.generalError });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      scheduleName: 'My Farm Irrigation Schedule', cropType: 'rice', soilType: 'loamy', soilMoisture: '45',
      temperature: '28', humidity: '65', rainfall: '0', cropStage: 'vegetative',
      farmSize: '2.5', latitude: '26.7271', longitude: '88.3953', frequency: 'daily',
      irrigationSystem: 'drip', waterAmount: '2500',
      plantedDate: new Date().toISOString().split('T')[0]
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
        {mlLoading && (
          <span className="flex items-center text-sm text-blue-600">
            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            {t.aiAnalysis}
          </span>
        )}
      </div>

      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Schedule Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.scheduleName}</label>
          <input type="text" name="scheduleName" value={formData.scheduleName} onChange={handleChange}
            className={`w-full px-3 py-2 border ${errors.scheduleName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder={t.scheduleNamePh} />
          {errors.scheduleName && <p className="mt-1 text-xs text-red-600">{errors.scheduleName}</p>}
        </div>

        {/* Crop + Soil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.cropType}</label>
            <select name="cropType" value={formData.cropType} onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.cropType ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="">{t.cropTypePh}</option>
              {cropTypes.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            {errors.cropType && <p className="mt-1 text-xs text-red-600">{errors.cropType}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.soilType}</label>
            <select name="soilType" value={formData.soilType} onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.soilType ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="">{t.soilTypePh}</option>
              {soilTypes.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            {errors.soilType && <p className="mt-1 text-xs text-red-600">{errors.soilType}</p>}
          </div>
        </div>

        {/* Soil Moisture + Crop Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.soilMoisture}</label>
            <input type="number" name="soilMoisture" value={formData.soilMoisture} onChange={handleChange}
              step="0.1" min="0" max="100" placeholder="0-100"
              className={`w-full px-3 py-2 border ${errors.soilMoisture ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            {errors.soilMoisture && <p className="mt-1 text-xs text-red-600">{errors.soilMoisture}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.cropStage}</label>
            <select name="cropStage" value={formData.cropStage} onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.cropStage ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}>
              <option value="">{t.cropStagePh}</option>
              {cropStages.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            {errors.cropStage && <p className="mt-1 text-xs text-red-600">{errors.cropStage}</p>}
          </div>
        </div>

        {/* Planted Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.plantedDate}</label>
          <input type="date" name="plantedDate" value={formData.plantedDate} onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {formData.plantedDate && (
            <p className="mt-1 text-xs text-gray-500">
              {t.plantedDateHint.replace('{days}', getCropDays())}
            </p>
          )}
        </div>

        {/* Weather */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.temperature}</label>
            <input type="number" name="temperature" value={formData.temperature} onChange={handleChange}
              step="0.1" min="-10" max="60" placeholder="20-35"
              className={`w-full px-3 py-2 border ${errors.temperature ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            {errors.temperature && <p className="mt-1 text-xs text-red-600">{errors.temperature}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.humidity}</label>
            <input type="number" name="humidity" value={formData.humidity} onChange={handleChange}
              step="0.1" min="0" max="100" placeholder="40-90"
              className={`w-full px-3 py-2 border ${errors.humidity ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            {errors.humidity && <p className="mt-1 text-xs text-red-600">{errors.humidity}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.rainfall}</label>
            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange}
              step="0.1" min="0" max="3000" placeholder="0-300"
              className={`w-full px-3 py-2 border ${errors.rainfall ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            {errors.rainfall && <p className="mt-1 text-xs text-red-600">{errors.rainfall}</p>}
          </div>
        </div>

        {/* Farm Size + Frequency + Water Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.farmSize}</label>
            <input type="number" name="farmSize" value={formData.farmSize} onChange={handleChange}
              step="0.1" min="0"
              className={`w-full px-3 py-2 border ${errors.farmSize ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            {errors.farmSize && <p className="mt-1 text-xs text-red-600">{errors.farmSize}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.frequency}</label>
            <select name="frequency" value={formData.frequency} onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {t.frequencies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.waterAmount}</label>
            <input type="number" name="waterAmount" value={formData.waterAmount} onChange={handleChange}
              step="1" min="0" placeholder={t.waterAmountPh}
              className={`w-full px-3 py-2 border ${errors.waterAmount ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            {errors.waterAmount && <p className="mt-1 text-xs text-red-600">{errors.waterAmount}</p>}
          </div>
        </div>

        {/* Irrigation System */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.irrigationSys}</label>
          <select name="irrigationSystem" value={formData.irrigationSystem} onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            {t.irrigationSystems.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Location GPS auto-detect section */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">{t.location}</label>
            <button
              type="button"
              onClick={detectLocation}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              📍 Auto-Detect My Location
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="number" step="any" name="latitude" placeholder={t.latPh || "Latitude (e.g. 26.7271)"}
              value={formData.latitude} onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
            <input type="number" step="any" name="longitude" placeholder={t.lngPh || "Longitude (e.g. 88.3953)"}
              value={formData.longitude} onChange={handleChange}
              className={`w-full px-3 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`} />
          </div>
          {gpsStatus && <p className="mt-1 text-xs text-blue-600 font-mono">{gpsStatus}</p>}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button type="submit" disabled={loading || mlLoading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {t.creating}
              </span>
            ) : t.submitBtn}
          </button>
          <button type="button" onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
            {t.resetBtn}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IrrigationForm;