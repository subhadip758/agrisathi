import React, { useState, useEffect } from 'react';
import fertilizerService from '../../services/fertilizerService';
import { useLanguage } from '../../context/LanguageContext';
import fertilizerTranslations from '../../i18n/fertilizer';

const FALLBACK_CROPS = [
  { name: 'rice',      display: 'Rice',      type: 'cereal'    },
  { name: 'wheat',     display: 'Wheat',     type: 'cereal'    },
  { name: 'maize',     display: 'Maize',     type: 'cereal'    },
  { name: 'cotton',    display: 'Cotton',    type: 'fiber'     },
  { name: 'sugarcane', display: 'Sugarcane', type: 'cash_crop' },
  { name: 'potato',    display: 'Potato',    type: 'tuber'     },
  { name: 'tomato',    display: 'Tomato',    type: 'vegetable' },
  { name: 'onion',     display: 'Onion',     type: 'vegetable' },
  { name: 'chickpea',  display: 'Chickpea',  type: 'legume'    },
  { name: 'soybean',   display: 'Soybean',   type: 'legume'    },
  { name: 'groundnut', display: 'Groundnut', type: 'legume'    },
];

const FALLBACK_STAGES = [
  { name: 'sowing',     display: 'Sowing/Germination',       description: 'Initial stage - seed germination' },
  { name: 'vegetative', display: 'Vegetative Growth',         description: 'Rapid growth phase'              },
  { name: 'flowering',  display: 'Flowering/Reproductive',    description: 'Flowering and fruit development'  },
];

const FertilizerForm = ({ onRecommendationReceived }) => {
  const { language } = useLanguage();
  const t = fertilizerTranslations.form[language] ?? fertilizerTranslations.form.en;

  const [formData, setFormData] = useState({
    cropName: '', soilN: '', soilP: '', soilK: '',
    soilPh: '', cropStage: '', area: '',
  });
  const [errors,        setErrors]        = useState({});
  const [loading,       setLoading]       = useState(false);
  const [supportedCrops,setSupportedCrops]= useState([]);
  const [growthStages,  setGrowthStages]  = useState([]);
  const [loadingData,   setLoadingData]   = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        try {
          const cropsResponse = await fertilizerService.getSupportedCrops();
          if (cropsResponse.success && cropsResponse.data?.crops) {
            setSupportedCrops(cropsResponse.data.crops.map(crop => ({
              name: crop.name,
              display: crop.name.charAt(0).toUpperCase() + crop.name.slice(1),
              type: crop.type,
            })));
          } else { setSupportedCrops(FALLBACK_CROPS); }
        } catch { setSupportedCrops(FALLBACK_CROPS); }

        try {
          const stagesResponse = await fertilizerService.getGrowthStages();
          if (stagesResponse.success && stagesResponse.data?.stages) {
            setGrowthStages(stagesResponse.data.stages);
          } else { setGrowthStages(FALLBACK_STAGES); }
        } catch { setGrowthStages(FALLBACK_STAGES); }
      } finally { setLoadingData(false); }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.cropName) newErrors.cropName = t.errCropRequired;
    if (!formData.soilN || formData.soilN < 0 || formData.soilN > 1000)   newErrors.soilN = t.errNRange;
    if (!formData.soilP || formData.soilP < 0 || formData.soilP > 500)    newErrors.soilP = t.errPRange;
    if (!formData.soilK || formData.soilK < 0 || formData.soilK > 1000)   newErrors.soilK = t.errKRange;
    if (!formData.soilPh || formData.soilPh < 4.0 || formData.soilPh > 10.0) newErrors.soilPh = t.errPhRange;
    if (!formData.cropStage) newErrors.cropStage = t.errStageRequired;
    if (!formData.area || formData.area <= 0) newErrors.area = t.errAreaRequired;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fertilizerService.getFertilizerRecommendation({
        cropName:  formData.cropName,
        soilN:     parseFloat(formData.soilN),
        soilP:     parseFloat(formData.soilP),
        soilK:     parseFloat(formData.soilK),
        soilPh:    parseFloat(formData.soilPh),
        cropStage: formData.cropStage,
        area:      parseFloat(formData.area),
      });
      if (response.status === 'success') {
        onRecommendationReceived(response.data);
      } else {
        setErrors({ general: response.message || 'Failed to get recommendation' });
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      setErrors({ general: error.response?.data?.message || error.message || 'Failed to get fertilizer recommendation. Please try again.' });
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setFormData({ cropName: '', soilN: '', soilP: '', soilK: '', soilPh: '', cropStage: '', area: '' });
    setErrors({});
  };

  const inputCls = (field) =>
    `w-full px-3 py-2 border ${errors[field] ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`;

  if (loadingData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <svg className="animate-spin h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="ml-3 text-gray-600">{t.loadingData}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>

      {errors.general && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start">
          <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Crop + Stage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="cropName" className="block text-sm font-medium text-gray-700 mb-1">{t.labelCropType}</label>
            <select id="cropName" name="cropName" value={formData.cropName} onChange={handleChange} className={inputCls('cropName')}>
              <option value="">{t.placeholderCrop}</option>
              {supportedCrops.map(crop => (
                <option key={crop.name} value={crop.name}>{crop.display} {crop.type && `(${crop.type})`}</option>
              ))}
            </select>
            {errors.cropName && <p className="mt-1 text-xs text-red-600">{errors.cropName}</p>}
          </div>
          <div>
            <label htmlFor="cropStage" className="block text-sm font-medium text-gray-700 mb-1">{t.labelGrowthStage}</label>
            <select id="cropStage" name="cropStage" value={formData.cropStage} onChange={handleChange} className={inputCls('cropStage')}
              title={formData.cropStage ? growthStages.find(s => s.name === formData.cropStage)?.description : ''}>
              <option value="">{t.placeholderStage}</option>
              {growthStages.map(stage => <option key={stage.name} value={stage.name}>{stage.display}</option>)}
            </select>
            {errors.cropStage && <p className="mt-1 text-xs text-red-600">{errors.cropStage}</p>}
            {formData.cropStage && (
              <p className="mt-1 text-xs text-gray-500">{growthStages.find(s => s.name === formData.cropStage)?.description}</p>
            )}
          </div>
        </div>

        {/* NPK */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t.soilNutrientTitle}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'soilN', label: t.labelN, placeholder: t.placeholderN, hint: t.hintN, max: 1000 },
              { id: 'soilP', label: t.labelP, placeholder: t.placeholderP, hint: t.hintP, max: 500  },
              { id: 'soilK', label: t.labelK, placeholder: t.placeholderK, hint: t.hintK, max: 1000 },
            ].map(({ id, label, placeholder, hint, max }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input type="number" id={id} name={id} value={formData[id]} onChange={handleChange}
                  step="0.1" min="0" max={max} className={inputCls(id)} placeholder={placeholder} />
                {errors[id] && <p className="mt-1 text-xs text-red-600">{errors[id]}</p>}
                <p className="mt-1 text-xs text-gray-500">{hint}</p>
              </div>
            ))}
          </div>
        </div>

        {/* pH + Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="soilPh" className="block text-sm font-medium text-gray-700 mb-1">{t.labelPh}</label>
            <input type="number" id="soilPh" name="soilPh" value={formData.soilPh} onChange={handleChange}
              step="0.1" min="4.0" max="10.0" className={inputCls('soilPh')} placeholder={t.placeholderPh} />
            {errors.soilPh && <p className="mt-1 text-xs text-red-600">{errors.soilPh}</p>}
            <p className="mt-1 text-xs text-gray-500">{t.hintPh}</p>
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">{t.labelArea}</label>
            <input type="number" id="area" name="area" value={formData.area} onChange={handleChange}
              step="0.1" min="0.1" className={inputCls('area')} placeholder={t.placeholderArea} />
            {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
            <p className="mt-1 text-xs text-gray-500">{t.hintArea}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-4">
          <button type="submit" disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.btnLoading}
              </span>
            ) : t.btnSubmit}
          </button>
          <button type="button" onClick={handleReset}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium">
            {t.btnReset}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">{t.infoTitle}</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>{t.infoItem1}</li>
              <li>{t.infoItem2}</li>
              <li>{t.infoItem3}</li>
              <li>{t.infoItem4}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerForm;