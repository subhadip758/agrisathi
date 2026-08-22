import React, { useState } from 'react';
import soilService from '../../services/soilService';
import dataBridgeService from '../../services/dataBridgeService';
import { useLanguage } from '../../context/LanguageContext';
import soilTranslations from '../../i18n/soilTranslations';

const SoilObservationForm = ({ onAnalysisComplete }) => {
  const { language } = useLanguage();
  const t = soilTranslations[language]?.form ?? soilTranslations.en.form;
  const steps = t.steps;

  const [analyzing,    setAnalyzing]    = useState(false);
  const [currentStep,  setCurrentStep]  = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [error,        setError]        = useState(null);

  const step          = steps[currentStep];
  const isStepComplete = step.questions.every((q) => answers[q.key]);
  const isLastStep    = currentStep === steps.length - 1;
  const progress      = ((currentStep + 1) / steps.length) * 100;

  const handleChange = (key, value) => setAnswers((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    setAnalyzing(true);
    setError(null);
    try {
      const result = await soilService.analyzeObservation(answers);
      dataBridgeService.saveLatestSoilData(result);
      onAnalysisComplete(result);
    } catch (err) {
      setError(t.error);
      console.error('Analysis error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="mb-8 text-center border-b pb-6">
        <h2 className="text-3xl font-bold text-green-700 mb-2">{t.title}</h2>
        <p className="text-gray-600 text-lg">{t.subtitle}</p>
        <p className="text-sm text-gray-500 mt-2">{t.hint}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">
            {t.stepLabel} {currentStep + 1} {t.of} {steps.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}{t.complete}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-green-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-around mt-3">
          {steps.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                idx < currentStep  ? 'bg-green-600 text-white' :
                idx === currentStep ? 'bg-green-400 text-green-900 ring-2 ring-green-200' :
                'bg-gray-200 text-gray-400'
              }`}>
                {idx < currentStep ? '✓' : s.icon}
              </div>
              <span className={`text-xs ${idx === currentStep ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Title */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-600">
        <h3 className="text-xl font-bold text-gray-800">{step.icon} {step.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{t.answerAll}</p>
      </div>

      {/* Questions */}
      <div className="space-y-5">
        {step.questions.map((q) => (
          <div key={q.key} className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">{q.label}</label>
            <select
              value={answers[q.key] || ''}
              onChange={(e) => handleChange(q.key, e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none text-base"
              required
            >
              <option value="">{t.selectAnswer}</option>
              {q.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {answers[q.key] && (
              <p className="mt-1 text-sm text-green-600 font-medium">{t.recorded}</p>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t">
        <button
          type="button"
          onClick={() => setCurrentStep((p) => p - 1)}
          className={`px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition ${currentStep === 0 ? 'invisible' : ''}`}
        >
          {t.previous}
        </button>

        {!isLastStep ? (
          <button
            type="button"
            onClick={() => setCurrentStep((p) => p + 1)}
            disabled={!isStepComplete}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              isStepComplete ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {t.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isStepComplete || analyzing}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition ${
              isStepComplete && !analyzing ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {analyzing ? t.analysing : t.startAnalysis}
          </button>
        )}
      </div>

      {error && <p className="mt-4 text-center text-red-600 font-medium">{error}</p>}

      {/* Tip */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">{t.tip}</p>
      </div>
    </div>
  );
};

export default SoilObservationForm;