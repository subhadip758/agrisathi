import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import fertilizerTranslations from '../../i18n/fertilizer';

const getDeficiencyName = (symbol) => {
  const names = {
    N: 'Nitrogen', P: 'Phosphorus', K: 'Potassium', Ca: 'Calcium',
    Mg: 'Magnesium', S: 'Sulfur', Fe: 'Iron', Zn: 'Zinc', B: 'Boron', Mn: 'Manganese',
  };
  return names[symbol] || symbol;
};

const FertilizerComparisonCard = ({ recommendation, mode }) => {
  const { language } = useLanguage();
  const t = fertilizerTranslations.comparisonCard[language] ?? fertilizerTranslations.comparisonCard.en;

  if (!recommendation || !recommendation.success) return null;

  const {
    cropName, growthStage, diagnosis, recommendations,
    totalEstimatedCost, generalAdvice, nextSteps, safetyWarnings,
  } = recommendation;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{t.headerTitle}</h2>
            <p className="text-green-100">
              {t.headerFor} {cropName} — {growthStage.charAt(0).toUpperCase() + growthStage.slice(1)} {t.headerStageSuffix}
            </p>
          </div>
          <div className="text-6xl">✅</div>
        </div>
      </div>

      {/* Diagnosis */}
      {diagnosis && diagnosis.symptoms && diagnosis.symptoms.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            {t.diagnosisTitle}
          </h3>
          <div className="space-y-2">
            <p className="text-blue-800">
              <strong>{t.diagSymptomsLabel}</strong> {diagnosis.symptoms.join(', ')}
            </p>
            <p className="text-blue-800">
              <strong>{t.diagDeficiencyLabel}</strong>{' '}
              {diagnosis.primaryDeficiency
                ? `${diagnosis.primaryDeficiency} (${getDeficiencyName(diagnosis.primaryDeficiency)})`
                : t.diagDefaultDeficiency}
            </p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              diagnosis.confidence === 'high'   ? 'bg-green-100 text-green-800' :
              diagnosis.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              <span className="mr-1">
                {diagnosis.confidence === 'high' ? '✓' : diagnosis.confidence === 'medium' ? '⚠' : '!'}
              </span>
              {diagnosis.confidence === 'high'   ? t.confidenceHigh   :
               diagnosis.confidence === 'medium' ? t.confidenceMedium : t.confidenceLow}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{t.recTitle}</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white border-2 border-green-200 rounded-lg p-5 shadow-sm">

              {/* Fertilizer Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">
                      {rec.nutrient.includes('Nitrogen') ? '🟢' :
                       rec.nutrient.includes('Phosphorus') ? '🟣' : '🔵'}
                    </span>
                    {rec.fertilizer}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.nutrient}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {rec.quantityInBags} {t.unitBags}
                  </div>
                  <div className="text-xs text-gray-500">({rec.quantity} {t.unitKgTotal})</div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4">
                <p className="text-sm text-amber-900">
                  <strong>{t.whyLabel}</strong> {rec.reason}
                </p>
              </div>

              {/* Timing */}
              <div className="mb-4">
                <h5 className="font-semibold text-gray-700 mb-2 text-sm">{t.whenLabel}</h5>
                <div className="space-y-2">
                  {rec.applicationTiming.map((timing, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-sm">
                      <div className="flex-shrink-0 w-16 text-center bg-green-100 text-green-800 rounded px-2 py-1 font-medium">
                        {timing.percentage}%
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{timing.dose}</div>
                        <div className="text-gray-600">{timing.timing}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h5 className="font-semibold text-gray-700 mb-2 text-sm">{t.tipsLabel}</h5>
                <ul className="space-y-1">
                  {rec.applicationTips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-500 flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cost */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t.costLabel}</span>
                  <span className="font-bold text-gray-800">₹{rec.estimatedCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-green-900">{t.totalCostTitle}</span>
          <span className="text-2xl font-bold text-green-700">₹{totalEstimatedCost.toLocaleString()}</span>
        </div>
        <p className="text-xs text-green-700 mt-2">{t.costDisclaimer}</p>
      </div>

      {/* General Advice */}
      {generalAdvice && generalAdvice.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            {t.adviceTitle}
          </h3>
          <ul className="space-y-2">
            {generalAdvice.map((advice, index) => (
              <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                <span className="text-purple-500 flex-shrink-0">✓</span>
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps && nextSteps.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">📌</span>
            {t.nextStepsTitle}
          </h3>
          <div className="space-y-2">
            {nextSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <p className="text-sm text-blue-800 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Warnings */}
      {safetyWarnings && safetyWarnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-red-900 mb-3 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            {t.safetyTitle}
          </h3>
          <ul className="space-y-2">
            {safetyWarnings.map((warning, index) => (
              <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-500 flex-shrink-0">!</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          {t.btnSave}
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          {t.btnShare}
        </button>
        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          {t.btnPrint}
        </button>
      </div>
    </div>
  );
};

export default FertilizerComparisonCard;