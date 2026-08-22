import React, { useState, useEffect } from 'react';
import cropService from '../../services/cropService';
import dataBridgeService from '../../services/dataBridgeService';
import { useLanguage } from "../../context/LanguageContext";
import cropTranslations from "../../i18n/crop";

const CropRecommendationForm = ({ onRecommendationReceived }) => {
  const { language } = useLanguage();
  const t = cropTranslations[language] || cropTranslations.en;
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoLoadedInfo, setAutoLoadedInfo] = useState('');

  useEffect(() => {
    autoLoadSoilAndWeather();
  }, []);

  const autoLoadSoilAndWeather = async () => {
    try {
      const soilData = dataBridgeService.getLatestSoilData();
      const weatherData = await dataBridgeService.getAutoLocationAndWeather();

      setFormData(prev => ({
        ...prev,
        nitrogen: soilData.nitrogen || prev.nitrogen || 60,
        phosphorus: soilData.phosphorus || prev.phosphorus || 45,
        potassium: soilData.potassium || prev.potassium || 50,
        ph: soilData.ph || prev.ph || 6.5,
        temperature: weatherData.temperature || prev.temperature || 28,
        humidity: weatherData.humidity || prev.humidity || 65,
        rainfall: weatherData.rainfall || prev.rainfall || 100
      }));

      const infoMsg = language === 'bn'
        ? `🌱 মাটি পরীক্ষা থেকে NPK (N:${soilData.nitrogen}, P:${soilData.phosphorus}, K:${soilData.potassium}) এবং pH (${soilData.ph}) ও লাইভ আবহাওয়া স্বয়ংক্রিয়ভাবে সংগৃহীত হয়েছে।`
        : language === 'hi'
        ? `🌱 मिट्टी परीक्षण से NPK (N:${soilData.nitrogen}, P:${soilData.phosphorus}, K:${soilData.potassium}) एवं pH (${soilData.ph}) तथा मौसम स्वचालित रूप से प्राप्त हुआ।`
        : `🌱 Soil NPK (N:${soilData.nitrogen}, P:${soilData.phosphorus}, K:${soilData.potassium}), pH (${soilData.ph}) & Live Weather auto-loaded!`;

      setAutoLoadedInfo(infoMsg);
    } catch (e) {
      console.warn('Crop form auto load error:', e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nitrogen || formData.nitrogen < 0 || formData.nitrogen > 140) {
      newErrors.nitrogen = 'Nitrogen must be between 0 and 140';
    }

    if (!formData.phosphorus || formData.phosphorus < 0 || formData.phosphorus > 145) {
      newErrors.phosphorus = 'Phosphorus must be between 0 and 145';
    }

    if (!formData.potassium || formData.potassium < 0 || formData.potassium > 205) {
      newErrors.potassium = 'Potassium must be between 0 and 205';
    }

    if (!formData.temperature || formData.temperature < -10 || formData.temperature > 60) {
      newErrors.temperature = 'Temperature must be between -10 and 60°C';
    }

    if (!formData.humidity || formData.humidity < 0 || formData.humidity > 100) {
      newErrors.humidity = 'Humidity must be between 0 and 100%';
    }

    if (!formData.ph || formData.ph < 0 || formData.ph > 14) {
      newErrors.ph = 'pH must be between 0 and 14';
    }

    if (!formData.rainfall || formData.rainfall < 0 || formData.rainfall > 3000) {
      newErrors.rainfall = 'Rainfall must be between 0 and 3000mm';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setLoading(true);
  
    try {
      const recommendations = await cropService.getCropRecommendation(formData);
      console.log("Received from service:", recommendations);
  
      onRecommendationReceived(recommendations);
    } catch (error) {
      setErrors({
        general: error.message || 'Failed to get crop recommendation. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleReset = () => {
    setFormData({
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      temperature: '',
      humidity: '',
      ph: '',
      rainfall: '',
    });
    setErrors({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {t.title}
      </h2>

      {autoLoadedInfo && (
        <div className="mb-6 p-3.5 bg-green-50 border border-green-300 text-green-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{autoLoadedInfo}</span>
          <button
            type="button"
            onClick={autoLoadSoilAndWeather}
            className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
          >
            🔄 {language === 'bn' ? 'রিফ্রেশ' : language === 'hi' ? 'रीफ्रेश' : 'Refresh'}
          </button>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NPK Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700 mb-1">
             {t.nitrogen} (N) *
            </label>
            <input
              type="number"
              id="nitrogen"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="140"
              className={`w-full px-3 py-2 border ${
                errors.nitrogen ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="0-140"
            />
            {errors.nitrogen && (
              <p className="mt-1 text-xs text-red-600">{errors.nitrogen}</p>
            )}
          </div>

          <div>
            <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700 mb-1">
             {t.phosphorus} (P) *
            </label>
            <input
              type="number"
              id="phosphorus"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="145"
              className={`w-full px-3 py-2 border ${
                errors.phosphorus ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="0-145"
            />
            {errors.phosphorus && (
              <p className="mt-1 text-xs text-red-600">{errors.phosphorus}</p>
            )}
          </div>

          <div>
            <label htmlFor="potassium" className="block text-sm font-medium text-gray-700 mb-1">
             {t.potassium} (K) *
            </label>
            <input
              type="number"
              id="potassium"
              name="potassium"
              value={formData.potassium}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="205"
              className={`w-full px-3 py-2 border ${
                errors.potassium ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="0-205"
            />
            {errors.potassium && (
              <p className="mt-1 text-xs text-red-600">{errors.potassium}</p>
            )}
          </div>
        </div>

        {/* Weather Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
             {t.temperature} (°C) *
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              step="0.1"
              min="-10"
              max="60"
              className={`w-full px-3 py-2 border ${
                errors.temperature ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="20-35"
            />
            {errors.temperature && (
              <p className="mt-1 text-xs text-red-600">{errors.temperature}</p>
            )}
          </div>

          <div>
            <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-1">
             {t.humidity} (%) *
            </label>
            <input
              type="number"
              id="humidity"
              name="humidity"
              value={formData.humidity}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="100"
              className={`w-full px-3 py-2 border ${
                errors.humidity ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="40-90"
            />
            {errors.humidity && (
              <p className="mt-1 text-xs text-red-600">{errors.humidity}</p>
            )}
          </div>
        </div>

        {/* pH and Rainfall */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ph" className="block text-sm font-medium text-gray-700 mb-1">
             {t.ph} *
            </label>
            <input
              type="number"
              id="ph"
              name="ph"
              value={formData.ph}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="14"
              className={`w-full px-3 py-2 border ${
                errors.ph ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="5.5-8.5"
            />
            {errors.ph && (
              <p className="mt-1 text-xs text-red-600">{errors.ph}</p>
            )}
          </div>

          <div>
            <label htmlFor="rainfall" className="block text-sm font-medium text-gray-700 mb-1">
              {t.rainfall} (mm) *
            </label>
            <input
              type="number"
              id="rainfall"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="3000"
              className={`w-full px-3 py-2 border ${
                errors.rainfall ? 'border-red-300' : 'border-gray-300'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="50-300"
            />
            {errors.rainfall && (
              <p className="mt-1 text-xs text-red-600">{errors.rainfall}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t.analyzing}
              </span>
            ) : (
              t.getRecommendation
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            {t.reset}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-600 mt-0.5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">{t.tips}:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{t.tip1}</li>
              <li>{t.tip2}</li>
              <li>{t.tip3}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendationForm;