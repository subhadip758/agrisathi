import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import fertilizerTranslations from '../../i18n/fertilizer';

const SymptomSelector = ({ selectedSymptoms, onSymptomChange }) => {
  const { language } = useLanguage();
  const t = fertilizerTranslations.symptom[language] ?? fertilizerTranslations.symptom.en;

  const [expandedCategory, setExpandedCategory] = useState('leaf');

  const symptomCategories = {
    leaf: {
      title: t.catLeafTitle,
      icon: '🍃',
      symptoms: [
        { id: 'yellowLeaves',          name: t.yellowLeavesName,          icon: '🍂', description: t.yellowLeavesDesc,          common: true  },
        { id: 'paleGreen',             name: t.paleGreenName,             icon: '🌿', description: t.paleGreenDesc,             common: true  },
        { id: 'purpleLeaves',          name: t.purpleLeavesName,          icon: '🍇', description: t.purpleLeavesDesc,          common: false },
        { id: 'brownEdges',            name: t.brownEdgesName,            icon: '🔥', description: t.brownEdgesDesc,            common: true  },
        { id: 'leafCurling',           name: t.leafCurlingName,           icon: '🌀', description: t.leafCurlingDesc,           common: false },
        { id: 'interveinalChlorosis',  name: t.interveinalChlorosisName,  icon: '🎨', description: t.interveinalChlorosisDesc,  common: false },
        { id: 'whiteLeaves',           name: t.whiteLeavesName,           icon: '⚪', description: t.whiteLeavesDesc,           common: false },
        { id: 'prematureLeafDrop',     name: t.prematureLeafDropName,     icon: '🍃', description: t.prematureLeafDropDesc,     common: false },
      ],
    },
    growth: {
      title: t.catGrowthTitle,
      icon: '🌱',
      symptoms: [
        { id: 'stuntedGrowth',         name: t.stuntedGrowthName,         icon: '📉', description: t.stuntedGrowthDesc,         common: true  },
        { id: 'weakStems',             name: t.weakStemsName,             icon: '🎋', description: t.weakStemsDesc,             common: true  },
        { id: 'shortenedInternodes',   name: t.shortenedInternodesName,   icon: '🌹', description: t.shortenedInternodesDesc,   common: false },
        { id: 'overallPoorHealth',     name: t.overallPoorHealthName,     icon: '😷', description: t.overallPoorHealthDesc,     common: false },
      ],
    },
    flowerFruit: {
      title: t.catFlowerTitle,
      icon: '🌸',
      symptoms: [
        { id: 'poorFlowering',         name: t.poorFloweringName,         icon: '🌸', description: t.poorFloweringDesc,         common: true  },
        { id: 'smallFruits',           name: t.smallFruitsName,           icon: '🍅', description: t.smallFruitsDesc,           common: true  },
        { id: 'blossomEndRot',         name: t.blossomEndRotName,         icon: '🥀', description: t.blossomEndRotDesc,         common: false },
        { id: 'delayedMaturity',       name: t.delayedMaturityName,       icon: '⏱️', description: t.delayedMaturityDesc,      common: false },
        { id: 'tipBurn',               name: t.tipBurnName,               icon: '☠️', description: t.tipBurnDesc,              common: false },
      ],
    },
  };

  const handleSymptomToggle = (symptomId) => {
    const newSymptoms = selectedSymptoms.includes(symptomId)
      ? selectedSymptoms.filter(s => s !== symptomId)
      : [...selectedSymptoms, symptomId];
    onSymptomChange(newSymptoms);
  };

  const isSelected = (id) => selectedSymptoms.includes(id);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {t.label} <span className="text-gray-500">{t.labelSub}</span>
        </label>
        {selectedSymptoms.length > 0 && (
          <button onClick={() => onSymptomChange([])} className="text-sm text-red-600 hover:text-red-800">
            {t.btnClearAll}
          </button>
        )}
      </div>

      {/* Selected count */}
      {selectedSymptoms.length > 0 && (
        <div className="p-3 bg-green-50 rounded-md border border-green-200">
          <p className="text-sm text-green-800">
            <strong>{selectedSymptoms.length}</strong>{' '}
            {selectedSymptoms.length === 1 ? t.selectedOne : t.selectedMany.replace('{n}', selectedSymptoms.length)}
          </p>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-3">
        {Object.entries(symptomCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* Category Header */}
            <button
              onClick={() => setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey)}
              className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{category.icon}</span>
                <span className="font-medium text-gray-800">{category.title}</span>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                  {t.countBadge.replace('{n}', category.symptoms.length)}
                </span>
              </div>
              <span className="text-gray-500">{expandedCategory === categoryKey ? '▼' : '▶'}</span>
            </button>

            {/* Symptoms Grid */}
            {expandedCategory === categoryKey && (
              <div className="p-4 bg-white grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.symptoms.map(symptom => (
                  <div
                    key={symptom.id}
                    onClick={() => handleSymptomToggle(symptom.id)}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected(symptom.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <span className="text-3xl">{symptom.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-800 text-sm">{symptom.name}</h4>
                          {symptom.common && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                              {t.badgeCommon}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{symptom.description}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected(symptom.id) ? 'bg-green-500 border-green-500' : 'border-gray-300'
                        }`}>
                          {isSelected(symptom.id) && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-sm text-blue-800">{t.tipText}</p>
      </div>
    </div>
  );
};

export default SymptomSelector;