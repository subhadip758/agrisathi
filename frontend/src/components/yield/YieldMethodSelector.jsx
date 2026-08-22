import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import yieldTranslations from '../../i18n/Yieldtranslations';

const YieldMethodSelector = ({ onSelectMode }) => {
  const { language } = useLanguage();
  const t = yieldTranslations[language]?.selector ?? yieldTranslations.en.selector;

  const handleSelect = (e, mode) => {
    e.preventDefault();
    e.stopPropagation();
    onSelectMode(mode);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {t.heading}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t.subheading}
        </p>
      </div>

      {/* Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

        {/* Easy Estimator Card */}
        <button
          type="button"
          onClick={(e) => handleSelect(e, 'simple')}
          className="group relative bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="absolute -top-3 -right-3">
            <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
              {t.easy.badge}
            </span>
          </div>

          <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="text-4xl">🌾</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.easy.title}</h2>
          <p className="text-green-700 font-medium mb-4 text-lg">{t.easy.subtitle}</p>
          <p className="text-gray-700 mb-6 leading-relaxed">{t.easy.description}</p>

          <div className="space-y-3 mb-6">
            {t.easy.features.map((text) => (
              <div key={text} className="flex items-center text-sm text-gray-700">
                <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-green-300">
            <span className="text-green-700 font-semibold">{t.easy.cta}</span>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* AI Prediction Card */}
        <button
          type="button"
          onClick={(e) => handleSelect(e, 'advanced')}
          className="group relative bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-2xl p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 text-left"
        >
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <span className="text-4xl">🔬</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t.advanced.title}</h2>
          <p className="text-blue-700 font-medium mb-4 text-lg">{t.advanced.subtitle}</p>
          <p className="text-gray-700 mb-6 leading-relaxed">{t.advanced.description}</p>

          <div className="space-y-3 mb-6">
            {t.advanced.features.map((text) => (
              <div key={text} className="flex items-center text-sm text-gray-700">
                <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-blue-300">
            <span className="text-blue-700 font-semibold">{t.advanced.cta}</span>
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>
      </div>

      {/* How It Works */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t.howItWorks.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.howItWorks.steps.map(({ step, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{step}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldMethodSelector;