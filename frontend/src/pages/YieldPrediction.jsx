import React, { useState } from 'react';
import YieldMethodSelector from '../components/yield/YieldMethodSelector';
import FarmerFriendlyFormSteps from '../components/yield/FarmerFriendlyForm';
import YieldPredictionForm from '../components/yield/YieldPredictionForm';
import YieldResultCard from '../components/yield/YieldResultCard';
import { useLanguage } from '../context/LanguageContext';
import yieldTranslations from '../i18n/Yieldtranslations';

const YieldPrediction = () => {
  const { language } = useLanguage();
  const t = yieldTranslations[language]?.page ?? yieldTranslations.en.page;

  const [selectedMode, setSelectedMode] = useState(null);
  const [result, setResult] = useState(null);

  const handleModeSelect = (mode) => { setSelectedMode(mode); setResult(null); };
  const handleBackToSelection = () => { setSelectedMode(null); setResult(null); };
  const handlePredictionReceived = (predictionResult) => { setResult(predictionResult); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedMode && !result && (
          <button
            type="button"
            onClick={handleBackToSelection}
            className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">{t.backToSelection}</span>
          </button>
        )}

        {!selectedMode && <YieldMethodSelector onSelectMode={handleModeSelect} />}

        {selectedMode === 'simple' && !result && (
          <FarmerFriendlyFormSteps onPredictionReceived={handlePredictionReceived} />
        )}

        {selectedMode === 'advanced' && !result && (
          <YieldPredictionForm onPredictionReceived={handlePredictionReceived} />
        )}

        {result && (
          <div>
            <YieldResultCard result={result} />
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleBackToSelection}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t.makeAnotherPrediction}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default YieldPrediction;