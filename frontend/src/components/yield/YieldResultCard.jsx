import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import yieldTranslations from '../../i18n/Yieldtranslations';
import ActionToolbar from '../common/ActionToolbar';

const formatVal = (val) => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return val;
  if (typeof val === 'object') {
    return val.expected ?? val.value ?? val.low ?? val.min ?? 0;
  }
  const parsed = parseFloat(val);
  return isNaN(parsed) ? 0 : parsed;
};

const YieldResultCard = ({ result }) => {
  const { language } = useLanguage();
  const t = yieldTranslations[language]?.result ?? yieldTranslations.en.result;

  if (!result) return null;

  const predictedVal = formatVal(result.predictedYield);
  const minVal = formatVal(result.expectedRange?.min ?? result.expectedRange?.low ?? result.yieldRange?.low);
  const maxVal = formatVal(result.expectedRange?.max ?? result.expectedRange?.high ?? result.yieldRange?.high);
  const expVal = formatVal(result.expectedRange?.expected ?? result.yieldRange?.expected ?? ((minVal + maxVal) / 2));

  const getYieldRating = (val, min, max) => {
    if (!max) return 'good';
    const avg = (min + max) / 2;
    if (val >= avg * 1.1) return 'excellent';
    if (val >= avg * 0.9) return 'good';
    if (val >= avg * 0.7) return 'fair';
    return 'poor';
  };

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good':      return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'fair':      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'poor':      return 'bg-red-100 text-red-800 border-red-200';
      default:          return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAccuracyRating = (accuracy) => {
    const acc = Number(accuracy || 75);
    if (acc >= 90) return { label: t.accuracyLabels?.excellent || 'Excellent', color: 'bg-green-100 text-green-800 border-green-300' };
    if (acc >= 80) return { label: t.accuracyLabels?.veryGood || 'Very Good',  color: 'bg-blue-100 text-blue-800 border-blue-300'   };
    if (acc >= 70) return { label: t.accuracyLabels?.good || 'Good',          color: 'bg-cyan-100 text-cyan-800 border-cyan-300'   };
    if (acc >= 60) return { label: t.accuracyLabels?.fair || 'Fair',          color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return               { label: t.accuracyLabels?.average || 'Average',     color: 'bg-orange-100 text-orange-800 border-orange-300' };
  };

  const rating = getYieldRating(predictedVal, minVal, maxVal);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {t.title} {String(result.crop || 'Crop')}
        </h2>
        <div className="flex items-center gap-4">
          {result.confidence !== undefined && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">{t.confidence}</span>
              <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg font-bold text-green-600">{String(result.confidence)}%</span>
              </div>
            </div>
          )}
          {result.modelAccuracy !== undefined && (
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-600 mb-1">{t.modelAccuracy}</span>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getAccuracyRating(result.modelAccuracy).color}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span className="text-sm font-semibold">{result.modelAccuracy}%</span>
                <span className="text-xs font-medium">({getAccuracyRating(result.modelAccuracy).label})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Info */}
      {(result.modelVersion || result.algorithm) && (
        <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
          {result.algorithm && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t.algorithm}: <span className="font-medium capitalize">{String(result.algorithm).replace('-', ' ')}</span>
            </span>
          )}
          {result.modelVersion && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {t.version}: <span className="font-medium">{String(result.modelVersion)}</span>
            </span>
          )}
        </div>
      )}

      {/* Predicted Yield */}
      <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.predictedYield}</h3>
            <p className="text-4xl font-bold text-green-600">
              {predictedVal.toLocaleString()} {String(result.unit || 'kg/hectare')}
            </p>
            {result.totalYield && (
              <p className="text-sm text-gray-600 mt-2">
                {t.totalYield}: {formatVal(result.totalYield).toLocaleString()} {String(result.unit || 'kg')} ({String(result.area || 1)} {t.acres})
              </p>
            )}
          </div>
          <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getRatingColor(rating)}`}>
            {t.ratings?.[rating] || rating}
          </span>
        </div>
      </div>

      {/* Yield Range */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">{t.yieldRange}</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-gray-600 mb-1">{t.minimum}</p>
            <p className="text-xl font-bold text-orange-600">{minVal.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-gray-600 mb-1">{t.average}</p>
            <p className="text-xl font-bold text-blue-600">{expVal.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-xs text-gray-600 mb-1">{t.maximum}</p>
            <p className="text-xl font-bold text-green-600">{maxVal.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Factors */}
      {Array.isArray(result.factors) && result.factors.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">{t.factors}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.factors.map((factor, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  factor.impact === 'positive' ? 'text-green-600' : factor.impact === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {factor.impact === 'positive' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  ) : factor.impact === 'negative' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
                <div>
                  <p className="font-semibold text-gray-800">{String(factor.name || factor.factor || 'Factor')}</p>
                  <p className="text-sm text-gray-600">{String(factor.description || '')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.recommendations}</h3>
          <ul className="space-y-2">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-gray-700">{typeof rec === 'object' ? String(rec.description || rec.title || '') : String(rec)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Toolbar: Print/Download PDF, Share, Feedback */}
      <ActionToolbar
        title={`Yield Prediction Report - ${result.crop || 'Crop'}`}
        summary={`Predicted Yield: ${predictedVal} ${result.unit || 'kg/hectare'}. Confidence: ${result.confidence || 85}%`}
      />
    </div>
  );
};

export default YieldResultCard;