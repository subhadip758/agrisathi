import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import fertilizerTranslations from '../../i18n/fertilizer';

const ModeToggle = ({ mode, onToggle }) => {
  const { language } = useLanguage();
  const t = fertilizerTranslations.modeToggle[language] ?? fertilizerTranslations.modeToggle.en;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{t.heading}</h3>
          <p className="text-sm text-gray-600">{t.subheading}</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onToggle('expert')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              mode === 'expert' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🔬</span>
              <span>{t.btnExpert}</span>
            </div>
          </button>

          <button
            onClick={() => onToggle('farmer')}
            className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
              mode === 'farmer' ? 'bg-green-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🌾</span>
              <span>{t.btnFarmer}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mode Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
        {mode === 'expert' ? (
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">{t.expertInfoTitle}</h4>
              <p className="text-sm text-blue-800">{t.expertInfoDesc}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">{t.farmerInfoTitle}</h4>
              <p className="text-sm text-blue-800">{t.farmerInfoDesc}</p>
            </div>
          </div>
        )}
      </div>

      {/* Chips */}
      <div className="mt-3 flex flex-wrap gap-2">
        {mode === 'farmer' && (
          <>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.chipNoLab}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.chipSimple}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.chipInstant}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.chipEasy}</span>
          </>
        )}
        {mode === 'expert' && (
          <>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{t.chipAccuracy}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{t.chipML}</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{t.chipPrecise}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ModeToggle;