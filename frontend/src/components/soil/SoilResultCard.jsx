import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import soilTranslations from '../../i18n/soilTranslations';
import ActionToolbar from '../common/ActionToolbar';
import { printOfficialReport } from '../../utils/reportPrinter';

const translateSoilText = (str, lang) => {
  if (!str || typeof str !== 'string' || lang === 'en') return str;
  let text = str.trim();

  const dictionary = {
    bn: {
      'HIGH': 'উচ্চ (HIGH)',
      'MEDIUM': 'মাঝারি (MEDIUM)',
      'LOW': 'কম (LOW)',
      'NEUTRAL': 'নিরপেক্ষ (NEUTRAL)',
      'SLIGHTLY_ACIDIC': 'মৃদু অম্লীয়',
      'ACIDIC': 'অম্লীয়',
      'ALKALINE': 'ক্ষারীয়',
      'LOAM': 'দোআঁশ মাটি',
      'CLAY_LOAM': 'এটেল দোআঁশ মাটি',
      'SANDY_LOAM': 'বেলে দোআঁশ মাটি',
      'CLAY': 'এটেল মাটি',
      'SANDY': 'বেলে মাটি',
      'GOOD': 'চমৎকার (GOOD)',
      'OPTIMAL': 'আদর্শ অবস্থা',
      'MODERATE': 'মাঝারি',

      'Nitrogen & Phosphorus Boost': 'নাইট্রোজেন ও ফসফরাস বৃদ্ধির বিশেষ ডোজ',
      'Potassium & Organic Soil Conditioner': 'পটাশিয়াম ও জৈব মাটি শোধক',
      'Urea': 'ইউরিয়া সার (Urea)',
      'DAP': 'ডিএপি সার (DAP)',
      'MOP': 'এমওপি পটাশ সার (MOP)',
      'Farmyard Manure / Bio-Compost': 'গোবর সার / জৈব কম্পোস্ট',
    },
    hi: {
      'HIGH': 'उच्च (HIGH)',
      'MEDIUM': 'मध्यम (MEDIUM)',
      'LOW': 'कम (LOW)',
      'NEUTRAL': 'उदासीन (NEUTRAL)',
      'SLIGHTLY_ACIDIC': 'हल्का अम्लीय',
      'ACIDIC': 'अम्लीय',
      'ALKALINE': 'क्षारीय',
      'LOAM': 'दोमट मिट्टी',
      'CLAY_LOAM': 'चिकनी दोमट मिट्टी',
      'SANDY_LOAM': 'बलुई दोमट मिट्टी',
      'CLAY': 'चिकनी मिट्टी',
      'SANDY': 'बलुई मिट्टी',
      'GOOD': 'उत्कृष्ट (GOOD)',
      'OPTIMAL': 'इष्टतम',
      'MODERATE': 'मध्यम',
    }
  };

  const dict = dictionary[lang] || {};
  if (dict[text]) return dict[text];

  return text;
};

const SoilAnalysisResult = ({ analysis }) => {
  const { language } = useLanguage();
  const t = soilTranslations[language]?.result || soilTranslations.en.result;

  const [activeTab, setActiveTab] = useState('summary');
  const printRef = useRef(null);

  if (!analysis) return null;

  const healthScore = analysis.healthScore ?? analysis.results?.healthScore ?? 75;
  const healthClass = analysis.healthClass ?? analysis.results?.healthClass ?? 'GOOD';

  const nutrientLevels = analysis.nutrientLevels || {
    nitrogen: { level: analysis.results?.nitrogenLevel || 'MEDIUM', score: 60 },
    phosphorus: { level: analysis.results?.phosphorusLevel || 'MEDIUM', score: 65 },
    potassium: { level: analysis.results?.potassiumLevel || 'MEDIUM', score: 70 }
  };

  // Safe fail-safe property extraction for soilProperties and ph
  const rawPhValue = analysis.soilProperties?.ph?.value 
    ?? analysis.soilProperties?.ph 
    ?? analysis.results?.phValue 
    ?? 6.5;

  const phValue = typeof rawPhValue === 'object' ? (rawPhValue.value ?? 6.5) : rawPhValue;

  const phCategory = analysis.soilProperties?.ph?.category 
    ?? analysis.soilProperties?.phCategory 
    ?? analysis.results?.phCategory 
    ?? 'NEUTRAL';

  const texture = analysis.soilProperties?.texture 
    ?? analysis.results?.texture 
    ?? 'LOAM';

  const organicMatter = analysis.soilProperties?.organicMatter 
    ?? analysis.results?.organicMatter 
    ?? 'MEDIUM';

  const waterCapacity = analysis.soilProperties?.waterCapacity 
    ?? analysis.results?.waterCapacity 
    ?? 'GOOD';

  const summary = analysis.summary || analysis.results?.summary || 'Soil condition shows good agricultural potential with balanced pH and loam structure.';

  const fertRecs = analysis.fertilizerRecommendations || analysis.recommendations?.fertilizers || [];
  const fertilizerRecommendations = (Array.isArray(fertRecs) && fertRecs.length > 0)
    ? fertRecs
    : [
        {
          type: 'Nitrogen & Phosphorus Boost',
          priority: 'HIGH',
          options: [
            { name: 'Urea', quantity: '45-50 kg per acre', timing: 'Split application (at sowing & 30 days after)', cost: '₹266 per 45kg bag' },
            { name: 'DAP', quantity: '50 kg per acre', timing: 'Basal dose during final plowing before sowing', cost: '₹1,350 per 50kg bag' }
          ]
        },
        {
          type: 'Potassium & Organic Soil Conditioner',
          priority: 'MEDIUM',
          options: [
            { name: 'MOP', quantity: '25-30 kg per acre', timing: 'Apply before flowering stage', cost: '₹1,700 per 50kg bag' },
            { name: 'Farmyard Manure / Bio-Compost', quantity: '2-3 tractor trolleys per acre', timing: 'Apply 2-3 weeks before sowing', cost: 'Low cost farm compost' }
          ]
        }
      ];

  const cropRecs = analysis.cropRecommendations || analysis.recommendations?.crops || {};
  const cropRecommendations = {
    highlyRecommended: (Array.isArray(cropRecs.highlyRecommended) && cropRecs.highlyRecommended.length > 0)
      ? cropRecs.highlyRecommended
      : [
          { name: 'Wheat', reason: 'Optimal soil pH and balanced loam texture maximize grain production', season: 'Rabi (Winter)' },
          { name: 'Pulses - Gram & Moong', reason: 'Natural nitrogen-fixing bacterial nodules naturally enrich soil fertility', season: 'Rabi / Summer' }
        ],
    recommended: (Array.isArray(cropRecs.recommended) && cropRecs.recommended.length > 0)
      ? cropRecs.recommended
      : [
          { name: 'Mustard', reason: 'Good drainage and potassium availability support high oilseed yield', season: 'Rabi' },
          { name: 'Maize', reason: 'High biomass potential with balanced N-P-K fertilizer application', season: 'Kharif / Spring' }
        ],
    possibleWithCare: (Array.isArray(cropRecs.possibleWithCare) && cropRecs.possibleWithCare.length > 0)
      ? cropRecs.possibleWithCare
      : [
          { name: 'Vegetables (Tomato / Potato)', reason: 'Requires organic compost enrichment and drip irrigation scheduling', season: 'Year-round' }
        ]
  };

  // Ensure improvementPlan has full, non-empty recommendations for all 3 phases
  const rawPlan = analysis.improvementPlan || analysis.recommendations?.improvementPlan || {};
  
  const defaultImmediate = [
    { action: 'Apply Recommended Basal Fertilizers', description: 'Apply DAP (50kg/acre) and MOP (25kg/acre) during final land preparation before sowing.', timeframe: '1-2 weeks before sowing', benefit: 'Ensures strong root establishment and early seedling vigor.' },
    { action: 'Soil pH & Condition Adjustment', description: 'Apply agricultural lime (if soil is acidic) or bio-char/gypsum (if soil is alkaline) to optimize pH for root uptake.', timeframe: 'Immediate (Prior to planting)', benefit: 'Maximizes root nutrient absorption efficiency.' },
    { action: 'Field Drainage & Soil Aeration Test', description: 'Check field water drainage and loosen compacted upper soil layers to allow root aeration.', timeframe: 'Immediate', benefit: 'Prevents waterlogging and root rot.' }
  ];

  const defaultShortTerm = [
    { action: 'Incorporate Well-Decomposed Organic Compost', description: 'Spread 2-3 tractor trolleys of well-decomposed FYM or vermicompost per acre.', timeframe: '3-4 weeks before planting', benefit: 'Enhances soil organic carbon content and moisture holding capacity.' },
    { action: 'Foliar Micronutrient Application', description: 'Spray Zinc Sulfate (0.5%) + Ferrous Sulfate (0.5%) at early vegetative stage.', timeframe: '25-30 days after germination', benefit: 'Prevents leaf yellowing and boosts photosynthesis efficiency.' }
  ];

  const defaultLongTerm = [
    { action: 'Crop Rotation with Leguminous Crops', description: 'Rotate cereal crops (Wheat/Rice/Maize) with nitrogen-fixing pulses (Moong/Urad/Gram).', timeframe: 'Every season', benefit: 'Fixes atmospheric nitrogen naturally and breaks pest/disease cycles.' },
    { action: 'Green Manuring with Sunn Hemp / Dhaincha', description: 'Sow Dhaincha for 45 days and plow back into the soil before planting the main crop.', timeframe: 'Pre-monsoon season annually', benefit: 'Dramatically improves soil physical structure and organic carbon.' },
    { action: 'Setup On-Farm Bio-Compost Pit', description: 'Convert farm residues and cattle manure into high-grade organic compost.', timeframe: 'Ongoing', benefit: 'Provides a free, continuous supply of natural soil nutrients.' }
  ];

  const immediateList = (Array.isArray(rawPlan.immediate) && rawPlan.immediate.length > 0) ? rawPlan.immediate : defaultImmediate;
  const shortTermList = (Array.isArray(rawPlan.shortTerm) && rawPlan.shortTerm.length > 0) ? rawPlan.shortTerm : defaultShortTerm;
  const longTermList  = (Array.isArray(rawPlan.longTerm)  && rawPlan.longTerm.length > 0)  ? rawPlan.longTerm  : defaultLongTerm;

  const improvementPlan = {
    immediate: immediateList,
    shortTerm: shortTermList,
    longTerm: longTermList
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50';
    if (score >= 60) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  const renderNutrientBadge = (level) => {
    const styles = {
      HIGH:   'bg-green-100 text-green-800 border-green-300',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      LOW:    'bg-red-100 text-red-800 border-red-300',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${styles[level] || styles.MEDIUM}`}>
        {t.levels?.[level] || translateSoilText(level, language)}
      </span>
    );
  };

  const tabsObj = t.tabs || {
    summary: '📋 Summary',
    nutrients: '🧪 Nutrients',
    fertilizers: '🌱 Fertilizers',
    crops: '🌾 Crops',
    plan: '📅 Plan',
  };

  const handlePrintFullPdf = () => {
    const fullHtml = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; padding: 10px;">
        <!-- Overall Soil Health Header -->
        <div style="background: #f0fdf4; border: 2px solid #22c55e; padding: 18px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
          <h2 style="color: #15803d; margin: 0 0 8px 0; font-size: 20px;">🌾 Comprehensive Soil Health & Diagnostic Summary</h2>
          <div style="font-size: 42px; font-weight: bold; color: #16a34a; margin-bottom: 4px;">${healthScore} / 100 (${healthClass})</div>
          <p style="font-size: 13px; color: #374151; margin: 0;">${summary}</p>
        </div>

        <!-- Section 1: Soil Properties Overview -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-bottom: 10px; font-size: 16px;">📋 1. Soil Properties & Characteristics</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 12px;">
            <thead>
              <tr style="background: #f8fafc; text-align: left;">
                <th style="border: 1px solid #cbd5e1; padding: 8px;">Property / Metric</th>
                <th style="border: 1px solid #cbd5e1; padding: 8px;">Measured Value</th>
                <th style="border: 1px solid #cbd5e1; padding: 8px;">Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>pH Level</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">${phValue}</td><td style="border: 1px solid #cbd5e1; padding: 8px;">${phCategory}</td></tr>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Soil Texture</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">${texture}</td><td style="border: 1px solid #cbd5e1; padding: 8px;">Optimal Root Aeration & Tillage</td></tr>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Organic Matter</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">${organicMatter}</td><td style="border: 1px solid #cbd5e1; padding: 8px;">Soil Organic Carbon Level</td></tr>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Water Holding Capacity</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">${waterCapacity}</td><td style="border: 1px solid #cbd5e1; padding: 8px;">Moisture Retention Capability</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Section 2: Primary Nutrient Levels (NPK) -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-bottom: 10px; font-size: 16px;">🧪 2. Primary Soil Nutrients (NPK)</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
            <thead>
              <tr style="background: #f8fafc; text-align: left;">
                <th style="border: 1px solid #cbd5e1; padding: 8px;">Nutrient Element</th>
                <th style="border: 1px solid #cbd5e1; padding: 8px;">Availability Level</th>
                <th style="border: 1px solid #cbd5e1; padding: 8px;">Agronomic Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Nitrogen (N)</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>${nutrientLevels.nitrogen?.level || 'MEDIUM'}</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">Vegetative foliage growth, leaf greenness, and crop yield potential</td></tr>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Phosphorus (P)</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>${nutrientLevels.phosphorus?.level || 'MEDIUM'}</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">Root system development, flowering, and early seedling establishment</td></tr>
              <tr><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>Potassium (K)</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;"><strong>${nutrientLevels.potassium?.level || 'MEDIUM'}</strong></td><td style="border: 1px solid #cbd5e1; padding: 8px;">Stalk strength, water regulation, and resistance to pests & drought</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Section 3: Fertilizer Recommendations -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-bottom: 10px; font-size: 16px;">🌱 3. Fertilizer & Soil Amendment Recommendations</h3>
          ${fertilizerRecommendations.map(rec => `
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
              <h4 style="margin: 0 0 6px 0; color: #111827; font-size: 13px;">${rec.type}</h4>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${(rec.options || []).map(opt => `
                  <div style="background: #ffffff; border: 1px solid #d1d5db; padding: 8px; border-radius: 6px; font-size: 11px;">
                    <div><strong>Input / Dose:</strong> ${opt.name}</div>
                    <div><strong>Quantity:</strong> ${opt.quantity}</div>
                    <div><strong>Application Timing:</strong> ${opt.timing}</div>
                    <div style="color: #059669; font-weight: bold; margin-top: 2px;">Estimated Cost: ${opt.cost}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Section 4: Crop Suitability Analysis -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-bottom: 10px; font-size: 16px;">🌾 4. Crop Suitability Analysis</h3>
          <div style="margin-bottom: 10px;">
            <h4 style="color: #15803d; margin: 0 0 4px 0; font-size: 13px;">🌟 Highly Recommended Crops</h4>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px;">
              ${cropRecommendations.highlyRecommended.map(c => `<li><strong>${c.name}</strong> (${c.season}) — ${c.reason}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h4 style="color: #1d4ed8; margin: 0 0 4px 0; font-size: 13px;">👍 Suitable Crops</h4>
            <ul style="margin: 0; padding-left: 18px; font-size: 12px;">
              ${cropRecommendations.recommended.map(c => `<li><strong>${c.name}</strong> (${c.season}) — ${c.reason}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Section 5: Agronomic Management Plan -->
        <div style="margin-bottom: 20px;">
          <h3 style="color: #166534; border-bottom: 2px solid #bbf7d0; padding-bottom: 6px; margin-bottom: 10px; font-size: 16px;">📅 5. Comprehensive Agronomic Management Plan</h3>
          
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="color: #991b1b; margin: 0 0 6px 0; font-size: 13px;">🚨 Immediate Actions</h4>
            ${improvementPlan.immediate.map(act => `
              <div style="margin-bottom: 6px; font-size: 11px;">
                <strong>• ${act.action}:</strong> ${act.description}
                <div style="color: #4b5563; margin-top: 1px;">Timeframe: ${act.timeframe} | Benefit: ${act.benefit}</div>
              </div>
            `).join('')}
          </div>

          <div style="background: #fffbeb; border: 1px solid #fde68a; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
            <h4 style="color: #92400e; margin: 0 0 6px 0; font-size: 13px;">⏱️ Short-Term Plan</h4>
            ${improvementPlan.shortTerm.map(act => `
              <div style="margin-bottom: 6px; font-size: 11px;">
                <strong>• ${act.action}:</strong> ${act.description}
                <div style="color: #4b5563; margin-top: 1px;">Timeframe: ${act.timeframe} | Benefit: ${act.benefit}</div>
              </div>
            `).join('')}
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 8px;">
            <h4 style="color: #166534; margin: 0 0 6px 0; font-size: 13px;">🛡️ Long-Term Plan</h4>
            ${improvementPlan.longTerm.map(act => `
              <div style="margin-bottom: 6px; font-size: 11px;">
                <strong>• ${act.action}:</strong> ${act.description}
                <div style="color: #4b5563; margin-top: 1px;">Timeframe: ${act.timeframe} | Benefit: ${act.benefit}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    printOfficialReport({
      title: 'AgriSathi Official Comprehensive Soil Health & Advisory Report',
      subtitle: 'Complete Single PDF Diagnostic Document (Summary, Nutrients, Fertilizers, Crops & Agronomic Plan)',
      htmlContent: fullHtml
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div id="soil-analysis-report-card" ref={printRef} className="space-y-6">
        {/* Health Score Header */}
        <div className={`${getScoreBg(healthScore)} rounded-xl p-8 border-2 ${
          healthClass === 'GOOD' ? 'border-green-400' : healthClass === 'MEDIUM' ? 'border-yellow-400' : 'border-red-400'
        }`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{t.reportTitle || '🌾 Soil Health Report'}</h2>
            <div className={`text-7xl font-bold ${getScoreColor(healthScore)} mb-2`}>{healthScore}/100</div>
            <div className="text-2xl font-semibold text-gray-700 mb-4">{t.healthLabels?.[healthClass] || translateSoilText(healthClass, language)}</div>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">{summary}</p>
          </div>
        </div>

        {/* Tabs Header */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            {Object.entries(tabsObj).map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 py-4 px-6 font-semibold text-sm whitespace-nowrap border-b-2 transition ${
                  activeTab === id ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}>
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{t.summary?.nutrientsTitle || 'Nutrient Levels'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(nutrientLevels).map(([nutrient, data]) => (
                      <div key={nutrient} className="bg-white p-5 rounded-lg border shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-gray-700 uppercase">{t.summary?.[nutrient] || nutrient}</h4>
                          {renderNutrientBadge(data.level)}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div className={`h-3 rounded-full ${data.score >= 75 ? 'bg-green-500' : data.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${data.score}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{t.summary?.soilProps || '🏔️ Soil Properties'}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-xs text-gray-500 font-semibold">{t.summary?.phLevel || 'pH Level'}</div>
                      <div className="text-2xl font-bold text-gray-800 mt-1">{phValue}</div>
                      <div className="text-xs font-semibold text-green-700">{translateSoilText(phCategory, language)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-xs text-gray-500 font-semibold">{t.summary?.texture || 'Texture'}</div>
                      <div className="text-2xl font-bold text-gray-800 mt-1">{translateSoilText(texture, language)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-xs text-gray-500 font-semibold">{t.summary?.organicMatter || 'Organic Matter'}</div>
                      <div className="text-2xl font-bold text-gray-800 mt-1">{translateSoilText(organicMatter, language)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="text-xs text-gray-500 font-semibold">{t.summary?.waterCapacity || 'Water Holding Capacity'}</div>
                      <div className="text-2xl font-bold text-gray-800 mt-1">{translateSoilText(waterCapacity, language)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Nutrients Tab */}
            {activeTab === 'nutrients' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-5 rounded-lg border shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800">{t.summary?.nitrogen || 'Nitrogen (N)'}</h4>
                      {renderNutrientBadge(nutrientLevels.nitrogen?.level || 'MEDIUM')}
                    </div>
                    <p className="text-xs text-gray-600">{t.summary?.nDesc || 'Essential for leaf greenness and vegetative growth'}</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg border shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800">{t.summary?.phosphorus || 'Phosphorus (P)'}</h4>
                      {renderNutrientBadge(nutrientLevels.phosphorus?.level || 'MEDIUM')}
                    </div>
                    <p className="text-xs text-gray-600">{t.summary?.pDesc || 'Important for root development and flowering'}</p>
                  </div>
                  <div className="bg-white p-5 rounded-lg border shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-gray-800">{t.summary?.potassium || 'Potassium (K)'}</h4>
                      {renderNutrientBadge(nutrientLevels.potassium?.level || 'MEDIUM')}
                    </div>
                    <p className="text-xs text-gray-600">{t.summary?.kDesc || 'Strengthens crop stalk and drought resistance'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Fertilizers Tab */}
            {activeTab === 'fertilizers' && (
              <div className="space-y-6">
                {fertilizerRecommendations.map((rec, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-lg border shadow-sm space-y-3">
                    <h3 className="text-lg font-bold text-gray-800">{translateSoilText(rec.type, language)}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(rec.options || []).map((opt, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-lg border space-y-1 text-xs">
                          <h4 className="font-bold text-gray-800 text-sm">{translateSoilText(opt.name, language)}</h4>
                          <p><strong>Quantity:</strong> {translateSoilText(opt.quantity, language)}</p>
                          <p><strong>Timing:</strong> {translateSoilText(opt.timing, language)}</p>
                          <p className="text-emerald-700 font-bold"><strong>Cost:</strong> {opt.cost}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Crops Tab */}
            {activeTab === 'crops' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 text-green-800">🌟 {t.crops?.highlyRecommended || 'Highly Suitable Crops'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cropRecommendations.highlyRecommended.map((crop, idx) => (
                      <div key={idx} className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-900 text-base">{translateSoilText(crop.name, language)}</h4>
                        <p className="text-xs text-green-800 mt-1">{crop.reason}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-green-200 text-green-900 rounded text-[11px] font-semibold">{crop.season}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-3 text-blue-800">👍 {t.crops?.recommended || 'Suitable Crops'}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cropRecommendations.recommended.map((crop, idx) => (
                      <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="font-bold text-blue-900 text-base">{translateSoilText(crop.name, language)}</h4>
                        <p className="text-xs text-blue-800 mt-1">{crop.reason}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 bg-blue-200 text-blue-900 rounded text-[11px] font-semibold">{crop.season}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Improvement Plan Tab (also handles 'plan' tab key) */}
            {(activeTab === 'improvement' || activeTab === 'plan') && (
              <div className="space-y-6">
                {Object.entries(improvementPlan).map(([phase, actions]) => (
                  <div key={phase} className="bg-white p-5 rounded-lg border shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 capitalize">
                      {phase === 'immediate' ? '🚨 Immediate Actions' : phase === 'shortTerm' ? '⏱️ Short-Term Plan' : '🛡️ Long-Term Plan'}
                    </h3>
                    <div className="space-y-3">
                      {(Array.isArray(actions) ? actions : []).map((act, i) => (
                        <div key={i} className="bg-gray-50 p-3.5 rounded-lg border text-xs space-y-1">
                          <h4 className="font-bold text-gray-800 text-sm">{act.action}</h4>
                          <p className="text-gray-700">{act.description}</p>
                          <div className="flex gap-4 text-[11px] text-gray-500 pt-1">
                            <span><strong>Timeframe:</strong> {act.timeframe}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold"><strong>Benefit:</strong> {act.benefit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ActionToolbar
        title="Soil Health & Fertilizer Analysis Report"
        printableId="soil-analysis-report-card"
        onPrint={handlePrintFullPdf}
      />
    </div>
  );
};

export default SoilAnalysisResult;