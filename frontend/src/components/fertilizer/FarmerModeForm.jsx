import React, { useState, useEffect } from 'react';
import SymptomSelector from './SymptomSelector';
import { useLanguage } from '../../context/LanguageContext';
import fertilizerTranslations from '../../i18n/fertilizer';

const FarmerModeForm = ({ onSubmit, loading }) => {
  const { language } = useLanguage();
  const t = fertilizerTranslations.farmerForm[language] ?? fertilizerTranslations.farmerForm.en;

  const [formData, setFormData] = useState({
    cropType: '', growthStage: '', symptoms: [],
    soilType: 'loamy', irrigationFrequency: 'alternate',
    lastFertilizerUsed: 'none', farmSize: 1,
  });
  const [growthStages, setGrowthStages] = useState([]);

  const crops = [
    { value: 'rice',      label: t.cropRice,      icon: '🌾' },
    { value: 'wheat',     label: t.cropWheat,     icon: '🌾' },
    { value: 'cotton',    label: t.cropCotton,    icon: '🌼' },
    { value: 'tomato',    label: t.cropTomato,    icon: '🍅' },
    { value: 'potato',    label: t.cropPotato,    icon: '🥔' },
    { value: 'maize',     label: t.cropMaize,     icon: '🌽' },
    { value: 'sugarcane', label: t.cropSugarcane, icon: '🎋' },
    { value: 'onion',     label: t.cropOnion,     icon: '🧅' },
  ];

  const allGrowthStages = {
    rice:      ['seedling','vegetative','flowering','fruiting'],
    wheat:     ['seedling','vegetative','flowering','fruiting'],
    cotton:    ['seedling','vegetative','flowering','fruiting'],
    tomato:    ['seedling','vegetative','flowering','fruiting'],
    potato:    ['seedling','vegetative','flowering','fruiting'],
    maize:     ['seedling','vegetative','flowering','fruiting'],
    sugarcane: ['seedling','vegetative','flowering','fruiting'],
    onion:     ['seedling','vegetative','flowering','fruiting'],
  };

  const stageLabels = {
    seedling:   t.stageSeedling,
    vegetative: t.stageVegetative,
    flowering:  t.stageFlowering,
    fruiting:   t.stageFruiting,
  };

  useEffect(() => {
    if (formData.cropType) {
      setGrowthStages(allGrowthStages[formData.cropType] || []);
      setFormData(prev => ({ ...prev, growthStage: '' }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.cropType]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };

  const isFormValid = formData.cropType && formData.growthStage;

  const soilTypes = [
    { value: 'sandy', label: t.soilSandy, desc: t.soilSandyDesc },
    { value: 'loamy', label: t.soilLoamy, desc: t.soilLoamyDesc },
    { value: 'clay',  label: t.soilClay,  desc: t.soilClayDesc  },
  ];

  const irrigationOptions = [
    { value: 'daily',     label: t.irrigationDaily,     icon: '💧💧💧' },
    { value: 'alternate', label: t.irrigationAlternate, icon: '💧💧'   },
    { value: 'weekly',    label: t.irrigationWeekly,    icon: '💧'     },
    { value: 'rainfall',  label: t.irrigationRainfall,  icon: '🌧️'    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Crop Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.labelCropType} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {crops.map(crop => (
            <button key={crop.value} type="button" onClick={() => handleChange('cropType', crop.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                formData.cropType === crop.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              <div className="text-3xl mb-2">{crop.icon}</div>
              <div className="text-sm font-medium text-gray-800">{crop.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Growth Stage */}
      {formData.cropType && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t.labelGrowthStage} <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {growthStages.map(stage => (
              <button key={stage} type="button" onClick={() => handleChange('growthStage', stage)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.growthStage === stage
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}>
                <div className="text-sm font-medium text-gray-800">{stageLabels[stage] || stage}</div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">{t.stageHint}</p>
        </div>
      )}

      {/* Symptoms */}
      {formData.cropType && formData.growthStage && (
        <div>
          <SymptomSelector
            selectedSymptoms={formData.symptoms}
            onSymptomChange={(symptoms) => handleChange('symptoms', symptoms)}
          />
        </div>
      )}

      {/* Soil Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.labelSoilType}</label>
        <div className="grid grid-cols-3 gap-3">
          {soilTypes.map(soil => (
            <button key={soil.value} type="button" onClick={() => handleChange('soilType', soil.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                formData.soilType === soil.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              <div className="font-medium text-sm text-gray-800">{soil.label}</div>
              <div className="text-xs text-gray-600 mt-1">{soil.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Irrigation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.labelIrrigation}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {irrigationOptions.map(opt => (
            <button key={opt.value} type="button" onClick={() => handleChange('irrigationFrequency', opt.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                formData.irrigationFrequency === opt.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}>
              <div className="text-lg mb-1">{opt.icon}</div>
              <div className="text-sm font-medium text-gray-800">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Farm Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.labelFarmSize}</label>
        <input type="number" min="0.1" step="0.1" value={formData.farmSize}
          onChange={(e) => handleChange('farmSize', e.target.value)}
          className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder={t.placeholderFarmSize} />
        <p className="mt-1 text-xs text-gray-500">{t.hintFarmSize}</p>
      </div>

      {/* Last Fertilizer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.labelLastFertilizer} <span className="text-gray-500">{t.labelOptional}</span>
        </label>
        <select value={formData.lastFertilizerUsed} onChange={(e) => handleChange('lastFertilizerUsed', e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option value="none">{t.fertNone}</option>
          <option value="urea">{t.fertUrea}</option>
          <option value="dap">{t.fertDap}</option>
          <option value="mop">{t.fertMop}</option>
          <option value="npk">{t.fertNpk}</option>
          <option value="ssp">{t.fertSsp}</option>
          <option value="unknown">{t.fertOther}</option>
        </select>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button type="submit" disabled={!isFormValid || loading}
          className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${
            isFormValid && !loading ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'bg-gray-300 cursor-not-allowed'
          }`}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin">⏳</span>
              {t.btnAnalyzing}
            </span>
          ) : t.btnSubmit}
        </button>
        {!isFormValid && <p className="text-sm text-gray-500">{t.hintSelectRequired}</p>}
      </div>
    </form>
  );
};

export default FarmerModeForm;