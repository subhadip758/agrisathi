import React, { useState, useEffect, useRef } from 'react';
import dataBridgeService from '../../services/dataBridgeService';
import { useLanguage } from '../../context/LanguageContext';
import yieldTranslations from '../../i18n/Yieldtranslations';

const StepHeader = ({ icon, title, subtitle }) => (
  <div className="text-center mb-8">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
      <span className="text-3xl">{icon}</span>
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600">{subtitle}</p>
  </div>
);

const OptionButton = ({ selected, onClick, children, className = '' }) => (
  <button
    type="button"
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); }}
    className={`border-2 rounded-lg transition-all ${
      selected ? 'border-green-500 bg-green-50 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
    } ${className}`}
  >
    {children}
  </button>
);

const FarmerFriendlyFormSteps = ({ onPredictionReceived }) => {
  const { language } = useLanguage();
  const t   = yieldTranslations[language]?.form   ?? yieldTranslations.en.form;
  const tSt = yieldTranslations[language]?.form?.steps ?? yieldTranslations.en.form.steps;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const errorRef = useRef(null);

  const [formData, setFormData] = useState({
    crop: '', farmSize: '1', growthStage: '', sowingTime: '',
    plantHealth: '', leafColor: '', pestDiseaseImpact: '',
    rainfallExperience: '', waterAvailability: '', fertilizerUsage: '',
    lastSeasonComparison: '', soilType: '', location: ''
  });

  useEffect(() => {
    autoLoadFarmerData();
  }, []);

  const autoLoadFarmerData = async () => {
    try {
      const soil = dataBridgeService.getLatestSoilData();
      const weather = await dataBridgeService.getAutoLocationAndWeather();

      setFormData(prev => ({
        ...prev,
        soilType: soil.soilType || prev.soilType || 'loam',
        location: weather.city || prev.location || 'Durgapur'
      }));
    } catch (e) {
      console.warn('Farmer form auto load error:', e);
    }
  };

  const totalSteps = 7;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.crop)        { showError(t.errors.crop);        return false; }
        if (!formData.growthStage) { showError(t.errors.growthStage); return false; }
        return true;
      case 2:
        if (!formData.sowingTime)  { showError(t.errors.sowingTime);  return false; }
        return true;
      case 3:
        if (!formData.plantHealth) { showError(t.errors.plantHealth); return false; }
        if (!formData.leafColor)   { showError(t.errors.leafColor);   return false; }
        return true;
      case 4:
        if (!formData.pestDiseaseImpact) { showError(t.errors.pestDisease); return false; }
        return true;
      case 5:
        if (!formData.rainfallExperience) { showError(t.errors.rainfall); return false; }
        if (!formData.waterAvailability)  { showError(t.errors.water);    return false; }
        return true;
      case 6:
        if (!formData.fertilizerUsage) { showError(t.errors.fertilizer); return false; }
        return true;
      default: return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setError(null);
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const yieldService = (await import('../../services/yieldService')).default;

      // language is included in the body so the backend returns
      // factor names, descriptions and recommendations in the
      // correct language: 'en' | 'hi' | 'bn'
      const response = await yieldService.estimateYieldSimple({
        ...formData,
        language,
      });

      const estimation = response.data?.estimation || response.data;
      const formattedResult = {
        crop: formData.crop,
        predictedYield: estimation.yieldPerHectare?.expected || estimation.yieldRange?.expected || 3500,
        unit: 'kg/hectare',
        confidence: estimation.confidence === 'High' ? 85 : estimation.confidence === 'Medium' ? 70 : 55,
        expectedRange: {
          min: estimation.yieldPerHectare?.low  || estimation.yieldRange?.low  || 2800,
          expected: estimation.yieldPerHectare?.expected || estimation.yieldRange?.expected || 3500,
          max: estimation.yieldPerHectare?.high || estimation.yieldRange?.high || 4200,
        },
        factors: Array.isArray(estimation.affectingFactors)
          ? estimation.affectingFactors.map(f => ({
              name: f.factor || f.name, description: f.description || '',
              impact: f.impact?.toLowerCase().includes('positive') ? 'positive'
                : (f.impact?.toLowerCase().includes('negative') || f.impact?.toLowerCase().includes('critical')) ? 'negative' : 'neutral'
            }))
          : [],
        modelAccuracy: 85, modelVersion: 'Simple Estimator v1.0', algorithm: 'rule-based',
        recommendations: estimation.recommendations || [],
        yieldCategory: typeof estimation.yieldCategory === 'string' ? estimation.yieldCategory : 'Optimal',
        categoryDescription: typeof estimation.categoryDescription === 'string' ? estimation.categoryDescription : '',
        yieldRange: `${estimation.yieldPerHectare?.low || 2800} - ${estimation.yieldPerHectare?.high || 4200} kg/ha`,
        inputData: {
          growthStage:       formData.growthStage?.replace(/_/g, ' '),
          plantHealth:       formData.plantHealth?.replace(/_/g, ' '),
          leafColor:         formData.leafColor?.replace(/_/g, ' '),
          sowingTime:        formData.sowingTime?.replace(/_/g, ' '),
          pestImpact:        formData.pestDiseaseImpact,
          waterAvailability: formData.waterAvailability?.replace(/_/g, ' '),
          fertilizerUsage:   formData.fertilizerUsage?.replace(/_/g, ' '),
        },
      };

      if (onPredictionReceived) onPredictionReceived(formattedResult);
    } catch (err) {
      console.error('Estimation error:', err);
      showError(err.message || t.errors.generic);
    } finally {
      setLoading(false);
    }
  };

  const pct      = (currentStep / totalSteps) * 100;
  const stepInfo = tSt[currentStep];

  const reviewRows = [
    [t.review.crop,        formData.crop],
    [t.review.growthStage, formData.growthStage?.replace(/_/g, ' ')],
    [t.review.sowingTime,  formData.sowingTime?.replace(/_/g, ' ')],
    [t.review.plantHealth, formData.plantHealth?.replace(/_/g, ' ')],
    [t.review.pestImpact,  formData.pestDiseaseImpact],
    [t.review.water,       formData.waterAvailability?.replace(/_/g, ' ')],
    [t.review.rainfall,    formData.rainfallExperience?.replace(/_/g, ' ')],
    [t.review.fertilizer,  formData.fertilizerUsage?.replace(/_/g, ' ')],
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {t.stepOf} {currentStep} {t.of} {totalSteps}
          </span>
          <span className="text-sm font-medium text-gray-700">{Math.round(pct)}{t.complete}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div ref={errorRef} className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded flex">
          <svg className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="ml-3 text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">

        {currentStep === 1 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.crop} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {t.crops.map(c => (
                  <OptionButton key={c.value} selected={formData.crop === c.value} onClick={() => handleChange('crop', c.value)} className="p-4 text-left">
                    <div className="font-medium text-gray-900">{c.label}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.labels.farmSize}</label>
              <input type="number" value={formData.farmSize} onChange={e => handleChange('farmSize', e.target.value)}
                placeholder={t.labels.farmSizePlaceholder} step="0.1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              <p className="text-xs text-gray-500 mt-1">{t.labels.farmSizeHint}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.growthStage} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {t.growthStages.map(s => (
                  <OptionButton key={s.value} selected={formData.growthStage === s.value} onClick={() => handleChange('growthStage', s.value)} className="p-4 text-left">
                    <div className="font-medium text-gray-900 mb-1">{s.label}</div>
                    <div className="text-sm text-gray-600">{s.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.labels.location}</label>
              <input type="text" value={formData.location} onChange={e => handleChange('location', e.target.value)}
                placeholder={t.labels.locationPlaceholder}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.sowingTime} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.sowingTimeOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.sowingTime === o.value} onClick={() => handleChange('sowingTime', o.value)} className="p-6 text-left">
                    <div className="flex items-start"><span className="text-3xl mr-4">{o.icon}</span>
                      <div><div className="font-semibold text-gray-900 mb-1">{o.label}</div><div className="text-sm text-gray-600">{o.desc}</div></div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.plantHealth} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.plantHealthOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.plantHealth === o.value} onClick={() => handleChange('plantHealth', o.value)} className="p-6 text-left">
                    <div className="flex items-start"><span className="text-3xl mr-4">{o.icon}</span>
                      <div><div className="font-semibold text-gray-900 mb-1">{o.label}</div><div className="text-sm text-gray-600">{o.desc}</div></div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.leafColor} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.leafColorOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.leafColor === o.value} onClick={() => handleChange('leafColor', o.value)} className="p-6 text-center">
                    <div className="text-4xl mb-2">{o.icon}</div>
                    <div className="font-medium text-gray-900 text-sm mb-1">{o.label}</div>
                    <div className="text-xs text-gray-600">{o.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.pestDisease} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.pestDiseaseOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.pestDiseaseImpact === o.value} onClick={() => handleChange('pestDiseaseImpact', o.value)} className="p-6 text-left">
                    <div className="flex items-start"><span className="text-3xl mr-4">{o.icon}</span>
                      <div><div className="font-semibold text-gray-900 mb-1">{o.label}</div><div className="text-sm text-gray-600">{o.desc}</div></div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.rainfall} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {t.rainfallOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.rainfallExperience === o.value} onClick={() => handleChange('rainfallExperience', o.value)} className="p-6 text-center">
                    <div className="text-3xl mb-2">{o.icon}</div>
                    <div className="font-medium text-gray-900 text-sm mb-1">{o.label}</div>
                    <div className="text-xs text-gray-600">{o.desc}</div>
                  </OptionButton>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.waterAvailability} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.waterOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.waterAvailability === o.value} onClick={() => handleChange('waterAvailability', o.value)} className="p-6 text-left">
                    <div className="flex items-start"><span className="text-2xl mr-4">{o.icon}</span>
                      <div><div className="font-semibold text-gray-900 mb-1">{o.label}</div><div className="text-sm text-gray-600">{o.desc}</div></div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.fertilizer} <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {t.fertilizerOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.fertilizerUsage === o.value} onClick={() => handleChange('fertilizerUsage', o.value)} className="p-6 text-left">
                    <div className="flex items-start"><span className="text-2xl mr-4">{o.icon}</span>
                      <div><div className="font-semibold text-gray-900 mb-1">{o.label}</div><div className="text-sm text-gray-600">{o.desc}</div></div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-6">
            <StepHeader icon={stepInfo.icon} title={stepInfo.title} subtitle={stepInfo.subtitle} />
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviewRows.map(([label, value]) => (
                  <div key={label}>
                    <div className="text-sm text-gray-600 mb-1">{label}</div>
                    <div className="font-medium text-gray-900 capitalize">{value || t.notSpecified}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">{t.labels.lastSeason}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {t.comparisonOptions.map(o => (
                  <OptionButton key={o.value} selected={formData.lastSeasonComparison === o.value} onClick={() => handleChange('lastSeasonComparison', o.value)} className="p-4 text-left">
                    <div className="flex items-start"><span className="text-xl mr-2">{o.icon}</span>
                      <div><div className="font-medium text-gray-900 text-sm mb-1">{o.label}</div><div className="text-xs text-gray-600">{o.desc}</div></div>
                    </div>
                  </OptionButton>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button type="button" onClick={prevStep} disabled={currentStep === 1}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.previous}
        </button>

        {currentStep < totalSteps ? (
          <button type="button" onClick={nextStep}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors font-medium flex items-center shadow-lg">
            {t.next}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button type="button" onClick={handleSubmit} disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center shadow-lg">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.calculating}
              </>
            ) : (
              <><span className="mr-2">🌾</span>{t.getYieldEstimate}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FarmerFriendlyFormSteps;