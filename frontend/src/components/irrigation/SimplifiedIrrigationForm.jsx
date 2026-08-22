import React, { useState, useEffect } from 'react';
import { AlertCircle, Droplet, Thermometer, Cloud, Wind, MapPin, Sparkles } from 'lucide-react';
import ruleBasedIrrigationService from '../../services/ruleBasedIrrigationService';
import dataBridgeService from '../../services/dataBridgeService';
import { useLanguage } from '../../context/LanguageContext';
import irrigationTranslations from '../../i18n/irrigation';

const SimplifiedIrrigationForm = ({ onSubmit, loading }) => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.simpleForm ?? irrigationTranslations.en.simpleForm;

  const [formData, setFormData] = useState({
    farmSize: '', cropType: '', soilType: '', cropStage: '',
    location: { city: '', latitude: '', longitude: '' },
    currentSoilMoisture: '', temperature: '', humidity: '',
    rainfall: 0, rainForecast: 0, season: '', windSpeed: 5
  });

  const [errors, setErrors]               = useState({});
  const [availableCrops, setAvailableCrops] = useState([]);
  const [selectedCropInfo, setSelectedCropInfo] = useState(null);
  const [autoFetched, setAutoFetched] = useState(false);

  useEffect(() => {
    fetchAvailableCrops();
    autoFetchWeatherAndLocation();
  }, []);

  const autoFetchWeatherAndLocation = async () => {
    try {
      const weatherData = await dataBridgeService.getAutoLocationAndWeather();
      setFormData(prev => ({
        ...prev,
        temperature: weatherData.temperature || prev.temperature,
        humidity: weatherData.humidity || prev.humidity,
        rainfall: weatherData.rainfall || prev.rainfall,
        rainForecast: weatherData.rainForecast || prev.rainForecast,
        windSpeed: weatherData.windSpeed || prev.windSpeed,
        currentSoilMoisture: weatherData.currentSoilMoisture || prev.currentSoilMoisture || 55,
        season: weatherData.season || prev.season || 'Monsoon',
        location: {
          city: weatherData.city || 'My Location',
          latitude: weatherData.latitude || 23.5204,
          longitude: weatherData.longitude || 87.3119
        }
      }));
      setAutoFetched(true);
    } catch (e) {
      console.warn('Weather auto fetch error:', e);
    }
  };

  const fetchAvailableCrops = async () => {
    try {
      const response = await ruleBasedIrrigationService.getAvailableCrops();
      if (response.success) {
        setAvailableCrops(response.data.crops);
      }
    } catch {
      setAvailableCrops(['Rice','Wheat','Maize','Tomato','Potato','Onion','Cabbage','Chickpea','Mango','Banana','Cotton','Sugarcane']);
    }
  };

  const fetchCropInfo = async (cropName) => {
    try {
      const response = await ruleBasedIrrigationService.getCropInformation(cropName);
      if (response.success) setSelectedCropInfo(response.data);
    } catch { /* silent */ }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'cropType' && value) fetchCropInfo(value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.farmSize || formData.farmSize <= 0)                                         newErrors.farmSize           = t.farmSizeErr;
    if (!formData.cropType)                                                                    newErrors.cropType           = t.cropTypeErr;
    if (!formData.soilType)                                                                    newErrors.soilType           = t.soilTypeErr;
    if (!formData.cropStage)                                                                   newErrors.cropStage          = t.cropStageErr;
    if (!formData.currentSoilMoisture || formData.currentSoilMoisture < 0 || formData.currentSoilMoisture > 100) newErrors.currentSoilMoisture = t.soilMoistureErr;
    if (!formData.temperature)                                                                 newErrors.temperature        = t.temperatureErr;
    if (!formData.humidity || formData.humidity < 0 || formData.humidity > 100)               newErrors.humidity           = t.humidityErr;
    if (!formData.season)                                                                      newErrors.season             = t.seasonErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({
        ...formData,
        farmSize:            parseFloat(formData.farmSize),
        currentSoilMoisture: parseFloat(formData.currentSoilMoisture),
        temperature:         parseFloat(formData.temperature),
        humidity:            parseFloat(formData.humidity),
        rainfall:            parseFloat(formData.rainfall),
        rainForecast:        parseFloat(formData.rainForecast),
        windSpeed:           parseFloat(formData.windSpeed),
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.title}</h2>
        <p className="text-gray-600">{t.subtitle}</p>

        {autoFetched && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-pulse" />
              <span>
                {language === 'bn' 
                  ? `✨ লাইভ আবহাওয়া ও অবস্থান স্বয়ংক্রিয়ভাবে সংগৃহীত হয়েছে (তাপমাত্রা: ${formData.temperature}°C, আর্দ্রতা: ${formData.humidity}%, বৃষ্টিপাত: ${formData.rainfall}mm, স্থান: ${formData.location.city})`
                  : language === 'hi'
                  ? `✨ लाइव मौसम और स्थान स्वचालित रूप से प्राप्त हुआ (तापमान: ${formData.temperature}°C, आर्द्रता: ${formData.humidity}%, स्थान: ${formData.location.city})`
                  : `✨ Live weather & GPS location auto-fetched (Temp: ${formData.temperature}°C, Humidity: ${formData.humidity}%, Location: ${formData.location.city})`}
              </span>
            </div>
            <button
              type="button"
              onClick={autoFetchWeatherAndLocation}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-1"
            >
              🔄 {language === 'bn' ? 'রিফ্রেশ' : language === 'hi' ? 'रीफ्रेश' : 'Refresh'}
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Farm Details */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.farmDetails}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Farm Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.farmSize}</label>
              <input type="number" name="farmSize" value={formData.farmSize} onChange={handleInputChange}
                step="0.1" min="0" placeholder={t.farmSizePh}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.farmSize ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.farmSize && <p className="text-red-500 text-xs mt-1">{errors.farmSize}</p>}
            </div>

            {/* Crop Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.cropType}</label>
              <select name="cropType" value={formData.cropType} onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.cropType ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">{t.cropTypePh}</option>
                {availableCrops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
              </select>
              {errors.cropType && <p className="text-red-500 text-xs mt-1">{errors.cropType}</p>}
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.soilType}</label>
              <select name="soilType" value={formData.soilType} onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.soilType ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">{t.soilTypePh}</option>
                {t.soilTypes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              {errors.soilType && <p className="text-red-500 text-xs mt-1">{errors.soilType}</p>}
              {formData.soilType && (
                <p className="text-xs text-gray-500 mt-1">{t.soilTypes.find(s => s.value === formData.soilType)?.description}</p>
              )}
            </div>

            {/* Crop Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.cropStage}</label>
              <select name="cropStage" value={formData.cropStage} onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.cropStage ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">{t.cropStagePh}</option>
                {t.cropStages.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
              {errors.cropStage && <p className="text-red-500 text-xs mt-1">{errors.cropStage}</p>}
            </div>
          </div>

          {/* Location */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{t.location}</label>
            <input type="text" name="location.city" value={formData.location.city} onChange={handleInputChange}
              placeholder={t.locationPh}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {/* Conditions */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.conditions}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Soil Moisture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Droplet className="inline w-4 h-4 mr-1" />{t.soilMoisture}
              </label>
              <input type="number" name="currentSoilMoisture" value={formData.currentSoilMoisture} onChange={handleInputChange}
                min="0" max="100" placeholder={t.soilMoisturePh}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.currentSoilMoisture ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.currentSoilMoisture && <p className="text-red-500 text-xs mt-1">{errors.currentSoilMoisture}</p>}
              <p className="text-xs text-gray-500 mt-1">{t.soilMoistureHint}</p>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="inline w-4 h-4 mr-1" />{t.temperature}
              </label>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleInputChange}
                step="0.1" placeholder={t.temperaturePh}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.temperature ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.temperature && <p className="text-red-500 text-xs mt-1">{errors.temperature}</p>}
            </div>

            {/* Humidity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Cloud className="inline w-4 h-4 mr-1" />{t.humidity}
              </label>
              <input type="number" name="humidity" value={formData.humidity} onChange={handleInputChange}
                min="0" max="100" placeholder={t.humidityPh}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.humidity ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.humidity && <p className="text-red-500 text-xs mt-1">{errors.humidity}</p>}
            </div>

            {/* Season */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.season}</label>
              <select name="season" value={formData.season} onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.season ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">{t.seasonPh}</option>
                {t.seasons.map(s => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
              </select>
              {errors.season && <p className="text-red-500 text-xs mt-1">{errors.season}</p>}
            </div>

            {/* Rainfall */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.rainfall}</label>
              <input type="number" name="rainfall" value={formData.rainfall} onChange={handleInputChange}
                min="0" step="0.1" placeholder={t.rainfallPh}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Rain Forecast */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.rainForecast}</label>
              <input type="number" name="rainForecast" value={formData.rainForecast} onChange={handleInputChange}
                min="0" step="0.1" placeholder={t.rainForecastPh}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>

            {/* Wind Speed */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Wind className="inline w-4 h-4 mr-1" />{t.windSpeed}
              </label>
              <input type="number" name="windSpeed" value={formData.windSpeed} onChange={handleInputChange}
                min="0" step="0.1" placeholder={t.windSpeedPh}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
        </div>

        {/* Crop Info Display */}
        {selectedCropInfo && (
          <div className="bg-white border border-green-200 rounded-xl p-5 shadow-md transform transition-all duration-500 ease-out animate-fadeIn">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🌾</span>
              <h4 className="font-bold text-lg text-green-800">{formData.cropType} {t.cropInfoTitle}</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">{t.category}</p>
                <p className="font-medium text-green-900">{selectedCropInfo.category}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">{t.waterStress}</p>
                <div className="space-y-3">
                  {[
                    { label: t.low,      value: selectedCropInfo.stressTolerance?.low || 30,      color: 'bg-blue-500'  },
                    { label: t.expected, value: selectedCropInfo.stressTolerance?.expected || 60, color: 'bg-green-500' },
                    { label: t.high,     value: selectedCropInfo.stressTolerance?.high || 90,     color: 'bg-red-500'   },
                  ].map(bar => (
                    <div key={bar.label}>
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{bar.label}</span><span>{bar.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${bar.color} h-2 rounded-full transition-all duration-1000`} style={{ width: `${bar.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedCropInfo.soilPreference && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{t.preferredSoil}</p>
                  <p className="font-medium text-yellow-900">{selectedCropInfo.soilPreference.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tips Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">{t.tipsTitle}</p>
            <ul className="list-disc list-inside space-y-1">
              {t.tips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 px-8 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:to-emerald-600'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.generating || 'Generating Schedule...'}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Droplet className="w-6 h-6 text-emerald-200" />
                {t.submitBtn || '🌾 Analyze & Generate Irrigation Schedule'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SimplifiedIrrigationForm;