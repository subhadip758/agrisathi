import React, { useState, useEffect } from 'react';
import yieldService from '../../services/yieldService';
import dataBridgeService from '../../services/dataBridgeService';
import { useLanguage } from '../../context/LanguageContext';
import yieldTranslations from '../../i18n/Yieldtranslations';

const CROPS = [
  'Rice','Wheat','Maize','Cotton','Sugarcane',
  'Potato','Tomato','Onion','Soybean','Chickpea',
  'Groundnut','Mustard','Barley','Jute','Tea'
];
const SEASONS     = ['Kharif','Rabi','Zaid','Whole Year','Summer','Winter'];
const SOIL_TYPES  = ['Clay','Sandy','Loamy','Black','Red','Alluvial','Clayey','Sandy Loam','Loam'];
const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand',
  'Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal'
];
const NUMERIC_FIELDS = ['rainfall','temperature','humidity','pH','nitrogen','phosphorus','potassium','farmSize'];
const INITIAL_FORM = {
  crop:'', season:'Kharif', soilType:'Loamy',
  rainfall:'', temperature:'', humidity:'',
  pH:'', nitrogen:'', phosphorus:'', potassium:'',
  farmSize:1, state:'West Bengal', district:''
};

const Field = ({ label, required, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && ' *'}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3 py-2 border ${hasError ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`;

const YieldPredictionForm = ({ onPredictionReceived }) => {
  const { language } = useLanguage();
  const t = yieldTranslations[language]?.advancedForm ?? yieldTranslations.en.advancedForm;

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors,   setErrors]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [autoLoadedMsg, setAutoLoadedMsg] = useState('');

  useEffect(() => {
    autoLoadData();
  }, []);

  const autoLoadData = async () => {
    try {
      const soil = dataBridgeService.getLatestSoilData();
      const weather = await dataBridgeService.getAutoLocationAndWeather();

      setFormData(prev => ({
        ...prev,
        nitrogen: soil.nitrogen || prev.nitrogen || 60,
        phosphorus: soil.phosphorus || prev.phosphorus || 45,
        potassium: soil.potassium || prev.potassium || 50,
        pH: soil.ph || prev.pH || 6.5,
        soilType: soil.soilType === 'Loam' ? 'Loamy' : (soil.soilType || 'Loamy'),
        temperature: weather.temperature || prev.temperature || 28,
        humidity: weather.humidity || prev.humidity || 65,
        rainfall: weather.rainfall || prev.rainfall || 100,
        state: prev.state || 'West Bengal',
        district: weather.city || prev.district || 'Durgapur'
      }));

      const msg = language === 'bn'
        ? `🌱 মাটি পরীক্ষা থেকে NPK (N:${soil.nitrogen}, P:${soil.phosphorus}, K:${soil.potassium}, pH:${soil.ph}) এবং লাইভ আবহাওয়া ও অবস্থান স্বয়ংক্রিয়ভাবে যুক্ত হয়েছে।`
        : language === 'hi'
        ? `🌱 मिट्टी परीक्षण से NPK (N:${soil.nitrogen}, P:${soil.phosphorus}, K:${soil.potassium}, pH:${soil.ph}) और मौसम डेटा लोड हो गया है।`
        : `🌱 NPK (N:${soil.nitrogen}, P:${soil.phosphorus}, K:${soil.potassium}, pH:${soil.ph}) & Live Weather auto-filled!`;

      setAutoLoadedMsg(msg);
    } catch (e) {
      console.warn('Yield prediction auto load error:', e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: NUMERIC_FIELDS.includes(name) ? (value === '' ? '' : Number(value)) : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!formData.crop)     e.crop     = t.errors.crop;
    if (!formData.season)   e.season   = t.errors.season;
    if (!formData.soilType) e.soilType = t.errors.soilType;
    if (!formData.state)    e.state    = t.errors.state;

    if (formData.rainfall   === '' || formData.rainfall   < 0)                                  e.rainfall    = t.errors.rainfall;
    if (formData.temperature === '' || formData.temperature < -10 || formData.temperature > 50) e.temperature = t.errors.temperature;
    if (formData.humidity   === '' || formData.humidity   < 0  || formData.humidity   > 100)    e.humidity    = t.errors.humidity;
    if (formData.pH         === '' || formData.pH         < 0  || formData.pH         > 14)     e.pH          = t.errors.pH;
    if (formData.nitrogen   === '' || formData.nitrogen   < 0)  e.nitrogen   = t.errors.nitrogen;
    if (formData.phosphorus === '' || formData.phosphorus < 0)  e.phosphorus = t.errors.phosphorus;
    if (formData.potassium  === '' || formData.potassium  < 0)  e.potassium  = t.errors.potassium;
    if (formData.farmSize !== '' && formData.farmSize <= 0)      e.farmSize   = t.errors.farmSize;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // language is nested inside the payload body so the backend
      // returns factors, risks and recommendations in the correct
      // language: 'en' | 'hi' | 'bn'
      const payload = {
        language,                        // <── added
        cropDetails: {
          crop: formData.crop, season: formData.season,
          area: formData.farmSize
            ? { value: Number(formData.farmSize), unit: 'hectare' }
            : { value: 1, unit: 'hectare' }
        },
        inputFactors: {
          soilType:    formData.soilType,
          rainfall:    Number(formData.rainfall),
          temperature: Number(formData.temperature),
          humidity:    Number(formData.humidity),
          pH:          Number(formData.pH),
          nitrogen:    Number(formData.nitrogen),
          phosphorus:  Number(formData.phosphorus),
          potassium:   Number(formData.potassium),
        },
        location: {
          state:    formData.state,
          district: formData.district || 'Not specified',
          country:  'India',
        },
      };

      const response       = await yieldService.predictYieldML(payload);
      const predictionData = response.data?.prediction;

      const result = {
        mode: 'ml', crop: formData.crop,
        predictedYield:  predictionData.prediction?.predictedYield?.value ?? 0,
        unit:            predictionData.prediction?.predictedYield?.unit  ?? 'kg/hectare',
        confidence:      predictionData.prediction?.confidence            ?? 'Medium',
        confidenceScore: predictionData.prediction?.confidenceScore       ?? 0,
        expectedRange:   predictionData.prediction?.range                 ?? { min: 0, max: 0 },
        factors:         predictionData.prediction?.factors               ?? [],
        yieldCategory:   predictionData.yieldCategory                     ?? null,
        yieldRange:      predictionData.yieldRange                        ?? null,
        recommendations: predictionData.recommendations                   ?? [],
        risks:           predictionData.risks                             ?? [],
        modelName:       predictionData.modelInfo?.modelName              ?? 'AI',
        algorithm:       predictionData.modelInfo?.algorithm              ?? 'ai',
        modelVersion:    predictionData.modelInfo?.version                ?? '2.0.0',
        modelAccuracy:   predictionData.modelInfo?.accuracy               ?? null,
        processingTime:  predictionData.processingTime                    ?? 0,
        predictionId:    predictionData._id ?? predictionData.predictionId,
        inputData: {
          season: formData.season, rainfall: formData.rainfall, temperature: formData.temperature,
          humidity: formData.humidity, soilType: formData.soilType, pH: formData.pH,
          nitrogen: formData.nitrogen, phosphorus: formData.phosphorus, potassium: formData.potassium,
          farmSize: formData.farmSize || 1,
        },
      };

      onPredictionReceived(result);
    } catch (error) {
      setErrors({ general: error.message || t.errors.general });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setFormData(INITIAL_FORM); setErrors({}); };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">{t.poweredBy}</span>
      </div>

      {autoLoadedMsg && (
        <div className="mb-6 p-3.5 bg-blue-50 border border-blue-300 text-blue-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <span>{autoLoadedMsg}</span>
          <button
            type="button"
            onClick={autoLoadData}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            🔄 {language === 'bn' ? 'রিফ্রেশ' : language === 'hi' ? 'रीफ्रेश' : 'Refresh'}
          </button>
        </div>
      )}

      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Crop Details */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.sections.cropDetails}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label={t.fields.crop} required error={errors.crop}>
              <select name="crop" value={formData.crop} onChange={handleChange} className={inputClass(errors.crop)}>
                <option value="">{t.placeholders.crop}</option>
                {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label={t.fields.season} required error={errors.season}>
              <select name="season" value={formData.season} onChange={handleChange} className={inputClass(errors.season)}>
                <option value="">{t.placeholders.season}</option>
                {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={t.fields.farmSize} error={errors.farmSize}>
              <input type="number" name="farmSize" value={formData.farmSize} onChange={handleChange}
                step="0.1" min="0.1" placeholder={t.fields.farmSizeHint} className={inputClass(errors.farmSize)} />
            </Field>
          </div>
        </div>

        {/* Climate */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.sections.climate}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label={t.fields.rainfall} required error={errors.rainfall}>
              <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange}
                step="0.1" min="0" max="3000" placeholder={t.placeholders.rainfall} className={inputClass(errors.rainfall)} />
            </Field>
            <Field label={t.fields.temperature} required error={errors.temperature}>
              <input type="number" name="temperature" value={formData.temperature} onChange={handleChange}
                step="0.1" min="-10" max="50" placeholder={t.placeholders.temperature} className={inputClass(errors.temperature)} />
            </Field>
            <Field label={t.fields.humidity} required error={errors.humidity}>
              <input type="number" name="humidity" value={formData.humidity} onChange={handleChange}
                step="0.1" min="0" max="100" placeholder={t.placeholders.humidity} className={inputClass(errors.humidity)} />
            </Field>
          </div>
        </div>

        {/* Soil */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.sections.soil}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Field label={t.fields.soilType} required error={errors.soilType}>
              <select name="soilType" value={formData.soilType} onChange={handleChange} className={inputClass(errors.soilType)}>
                <option value="">{t.placeholders.soilType}</option>
                {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={t.fields.pH} required error={errors.pH}>
              <input type="number" name="pH" value={formData.pH} onChange={handleChange}
                step="0.1" min="0" max="14" placeholder={t.placeholders.pH} className={inputClass(errors.pH)} />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label={t.fields.nitrogen} required error={errors.nitrogen}>
              <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleChange}
                step="0.1" min="0" placeholder={t.placeholders.nitrogen} className={inputClass(errors.nitrogen)} />
            </Field>
            <Field label={t.fields.phosphorus} required error={errors.phosphorus}>
              <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleChange}
                step="0.1" min="0" placeholder={t.placeholders.phosphorus} className={inputClass(errors.phosphorus)} />
            </Field>
            <Field label={t.fields.potassium} required error={errors.potassium}>
              <input type="number" name="potassium" value={formData.potassium} onChange={handleChange}
                step="0.1" min="0" placeholder={t.placeholders.potassium} className={inputClass(errors.potassium)} />
            </Field>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.sections.location}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label={t.fields.state} required error={errors.state}>
              <select name="state" value={formData.state} onChange={handleChange} className={inputClass(errors.state)}>
                <option value="">{t.placeholders.state}</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label={t.fields.district}>
              <input type="text" name="district" value={formData.district} onChange={handleChange}
                placeholder={t.fields.districtHint} className={inputClass(false)} />
            </Field>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button type="submit" disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.analysing}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                {t.submitBtn}
              </span>
            )}
          </button>
          <button type="button" onClick={handleReset}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium">
            {t.resetBtn}
          </button>
        </div>
      </form>

      {/* Info box */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-md p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-purple-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-purple-900">
            <p className="font-semibold mb-1">{t.infoBox.title}</p>
            <p>{t.infoBox.body}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldPredictionForm;