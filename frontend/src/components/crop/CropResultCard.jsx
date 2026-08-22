import React, { useState, useRef } from 'react';
import { useLanguage } from "../../context/LanguageContext";
import cropTranslations from "../../i18n/crop";

// ── Helpers ───────────────────────────────────────────────────────────────────

const confidenceColor = (conf) => {
  if (conf >= 85) return 'text-green-600';
  if (conf >= 65) return 'text-blue-600';
  if (conf >= 45) return 'text-yellow-600';
  return 'text-red-500';
};

const confidenceBg = (conf) => {
  if (conf >= 85) return 'bg-green-50 border-green-300';
  if (conf >= 65) return 'bg-blue-50 border-blue-200';
  return 'bg-yellow-50 border-yellow-200';
};

const suitabilityLabel = (score) => {
  if (score >= 85) return { label: 'Highly Suitable', cls: 'bg-green-100 text-green-800 border-green-200' };
  if (score >= 70) return { label: 'Suitable',        cls: 'bg-blue-100 text-blue-800 border-blue-200' };
  if (score >= 50) return { label: 'Moderate',        cls: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  return             { label: 'Low Suitability',      cls: 'bg-red-100 text-red-800 border-red-200' };
};

const cropTypeIcon = (type) => {
  const icons = {
    cereal: '🌾', pulse: '🫘', fruit: '🍎',
    fiber: '🧵', cash: '☕', crop: '🌿',
  };
  return icons[type?.toLowerCase()] ?? '🌱';
};

// ── Toast Component ───────────────────────────────────────────────────────────

const Toast = ({ message, type }) => {
  if (!message) return null;
  const bg = type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  return (
    <div className={`fixed bottom-6 right-6 z-50 ${bg} text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all`}>
      {message}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────

const CropResultCard = ({ recommendation }) => {
  const { language } = useLanguage();
  const t = cropTranslations.result?.[language] ?? cropTranslations.result?.en ?? {};

  const [expandedIndex, setExpandedIndex] = useState(0);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);

  if (!recommendation) return null;

  const crops         = recommendation.recommendations ?? [];
  const inputParams   = recommendation.inputParameters  ?? {};
  const inputWarnings = recommendation.inputWarnings    ?? [];
  const isMLPowered   = recommendation.algorithm && recommendation.algorithm !== 'rule-based-fallback';
  const topCrop       = crops[0];

  // ── Show Toast Helper ───────────────────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  // ── Save Handler ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token'); // adjust if you store auth differently

      const res = await fetch('/api/crop-recommendations/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          recommendationId: recommendation._id,
          recommendations: crops,
          inputParameters: inputParams,
          algorithm: recommendation.algorithm,
          modelVersion: recommendation.modelVersion,
          savedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Server error ${res.status}`);
      }

      showToast('✅ Recommendation saved successfully!', 'success');
    } catch (err) {
      console.error('Save error:', err);
      showToast(`❌ Failed to save: ${err.message}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // ── Share Handler ───────────────────────────────────────────────────────────
  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      showToast('🔗 Link copied to clipboard!', 'success');
    } catch (err) {
      // Fallback for browsers that block clipboard API
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast('🔗 Link copied to clipboard!', 'success');
    }
  };

  // ── Print / Download PDF — built directly from data, no DOM cloning ────────
  const handlePrint = () => {
    setIsPrinting(true);

    const printWindow = window.open('', '_blank', 'width=950,height=800');
    if (!printWindow) {
      alert('Popup blocked! Please allow popups for this site and try again.');
      setIsPrinting(false);
      return;
    }

    // ── helpers ──────────────────────────────────────────────────────────────
    const confColor = (c) => c >= 85 ? '#16a34a' : c >= 65 ? '#2563eb' : c >= 45 ? '#ca8a04' : '#dc2626';
    const suitStyle = (s) => {
      if (s >= 85) return { label:'Highly Suitable', bg:'#dcfce7', color:'#166534', border:'#4ade80' };
      if (s >= 70) return { label:'Suitable',        bg:'#dbeafe', color:'#1e40af', border:'#93c5fd' };
      if (s >= 50) return { label:'Moderate',        bg:'#fef9c3', color:'#92400e', border:'#fde047' };
      return              { label:'Low Suitability', bg:'#fee2e2', color:'#991b1b', border:'#fca5a5' };
    };
    const bar = (pct, col) =>
      `<div style="background:#e5e7eb;border-radius:8px;height:10px;width:100%;margin-top:4px;">
        <div style="background:${col};height:10px;border-radius:8px;width:${Math.min(100,pct)}%;"></div>
      </div>`;
    const icon = (type) => ({ cereal:'🌾', pulse:'🫘', fruit:'🍎', fiber:'🧵', cash:'☕' }[type?.toLowerCase()] ?? '🌱');

    // ── Top header ────────────────────────────────────────────────────────────
    const isML = recommendation.algorithm && recommendation.algorithm !== 'rule-based-fallback';
    const headerHtml = `
      <div style="background:#f0fdf4;border:2px solid #4ade80;border-radius:10px;padding:20px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;">
          <div>
            <h2 style="margin:0;font-size:22px;font-weight:800;color:#1f2937;">
              Recommended Crop: <span style="color:#16a34a;">${icon(topCrop?.cropType)} ${topCrop?.cropName ?? '—'}</span>
            </h2>
            <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Model v${recommendation.modelVersion ?? '2.0.0'}</p>
          </div>
          <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <span style="background:${isML?'#f3e8ff':'#f3f4f6'};color:${isML?'#7c3aed':'#374151'};border:1px solid ${isML?'#e9d5ff':'#e5e7eb'};padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;">
              ${isML ? '🤖 AI Powered' : '📋 Rule-Based'}
            </span>
            ${topCrop?.confidence != null ? `
            <span style="background:#f0fdf4;border:1px solid #4ade80;padding:4px 14px;border-radius:20px;font-size:16px;font-weight:800;color:#16a34a;">
              ${topCrop.confidence.toFixed(1)}% <span style="font-size:11px;color:#6b7280;font-weight:400;">confidence</span>
            </span>` : ''}
          </div>
        </div>
      </div>`;

    // ── Warnings ──────────────────────────────────────────────────────────────
    const warningsHtml = inputWarnings.length > 0 ? `
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:14px;margin-bottom:20px;">
        <b style="color:#92400e;">⚠️ Input Range Warnings</b>
        <ul style="margin:6px 0 0;padding-left:18px;color:#92400e;font-size:13px;">
          ${inputWarnings.map(w => `<li>${w}</li>`).join('')}
        </ul>
      </div>` : '';

    // ── Top 3 crop cards ──────────────────────────────────────────────────────
    const cropCards = crops.slice(0, 3).map((crop, i) => {
      const suit = suitStyle(crop.suitabilityScore ?? crop.confidence);
      const cc   = confColor(crop.confidence);
      return `
        <div style="border:2px solid ${i===0?'#4ade80':'#e5e7eb'};border-radius:10px;padding:18px;margin-bottom:14px;page-break-inside:avoid;">
          <!-- crop header -->
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:34px;height:34px;border-radius:50%;background:${i===0?'#16a34a':'#e5e7eb'};color:${i===0?'white':'#374151'};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:14px;">${i+1}</div>
              <div>
                <span style="font-size:17px;font-weight:800;color:#1f2937;">${icon(crop.cropType)} ${crop.cropName}</span>
                ${crop.cropType ? `<span style="font-size:11px;color:#9ca3af;margin-left:6px;">(${crop.cropType})</span>` : ''}
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <span style="background:${suit.bg};color:${suit.color};border:1px solid ${suit.border};padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;">${suit.label}</span>
              <span style="font-weight:800;color:${cc};font-size:14px;">${crop.confidence?.toFixed(1)}%</span>
            </div>
          </div>
          ${bar(crop.confidence, cc)}

          <!-- stats row -->
          <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:14px;">
            ${crop.growthDuration != null ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;"><p style="font-size:11px;color:#6b7280;margin:0;">Duration</p><b>${crop.growthDuration} days</b></div>` : ''}
            ${crop.expectedYield?.value != null ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;"><p style="font-size:11px;color:#6b7280;margin:0;">Expected Yield</p><b>${crop.expectedYield.value.toLocaleString()} ${crop.expectedYield.unit ?? 'kg/ha'}</b></div>` : ''}
            ${crop.suitabilityScore != null ? `<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;"><p style="font-size:11px;color:#6b7280;margin:0;">Suitability</p><b>${crop.suitabilityScore.toFixed(1)} / 100</b></div>` : ''}
          </div>

          <!-- reasons -->
          ${crop.reasons?.length > 0 ? `
            <div style="margin-top:14px;">
              <b style="font-size:12px;color:#374151;">✅ Why this crop?</b>
              <ul style="margin:6px 0 0;padding-left:16px;font-size:12px;color:#374151;">
                ${crop.reasons.map(r => `<li style="margin-bottom:3px;">${r}</li>`).join('')}
              </ul>
            </div>` : ''}

          <!-- tips -->
          ${crop.tips?.length > 0 ? `
            <div style="margin-top:12px;">
              <b style="font-size:12px;color:#374151;">💡 Farming Tips</b>
              <ul style="margin:6px 0 0;padding-left:16px;font-size:12px;color:#374151;">
                ${crop.tips.map(t => `<li style="margin-bottom:3px;">${t}</li>`).join('')}
              </ul>
            </div>` : ''}

          <!-- warnings -->
          ${crop.warnings?.length > 0 ? `
            <div style="background:#fff7ed;border:1px solid #fdba74;border-radius:6px;padding:10px;margin-top:12px;">
              <b style="font-size:12px;color:#c2410c;">⚠️ Warnings</b>
              <ul style="margin:4px 0 0;padding-left:16px;font-size:12px;color:#c2410c;">
                ${crop.warnings.map(w => `<li>${w}</li>`).join('')}
              </ul>
            </div>` : ''}
        </div>`;
    }).join('');

    // ── Input parameters ──────────────────────────────────────────────────────
    const paramList = [
      { key:'nitrogen',    label:'Nitrogen (N)',    unit:'' },
      { key:'phosphorus',  label:'Phosphorus (P)',  unit:'' },
      { key:'potassium',   label:'Potassium (K)',   unit:'' },
      { key:'temperature', label:'Temperature',     unit:'°C' },
      { key:'humidity',    label:'Humidity',        unit:'%' },
      { key:'ph',          label:'pH',              unit:'' },
      { key:'rainfall',    label:'Rainfall',        unit:'mm' },
    ].filter(p => inputParams[p.key] != null);

    const paramsHtml = paramList.length > 0 ? `
      <div style="border-top:1px solid #e5e7eb;padding-top:16px;margin-top:8px;">
        <b style="font-size:13px;color:#374151;">Input Parameters</b>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:10px;">
          ${paramList.map(p => `
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;text-align:center;min-width:70px;">
              <p style="font-size:11px;color:#6b7280;margin:0;">${p.label}</p>
              <b style="font-size:14px;">${inputParams[p.key]}${p.unit}</b>
            </div>`).join('')}
        </div>
      </div>` : '';

    // ── Write to window ───────────────────────────────────────────────────────
    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Crop Recommendation Report</title>
  <style>
    * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    body { font-family:Arial,sans-serif; margin:0; padding:28px; background:white; color:#1f2937; }
    @page { margin:16px; }
  </style>
</head>
<body>
  <div style="max-width:860px;margin:0 auto;">
    <div style="border-bottom:3px solid #16a34a;margin-bottom:20px;padding-bottom:12px;">
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#15803d;">🌱 Crop Recommendation Report</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Generated on ${new Date().toLocaleString()}</p>
    </div>
    ${headerHtml}
    ${warningsHtml}
    <h3 style="font-size:16px;font-weight:700;color:#374151;margin:0 0 12px;">Top Recommendations</h3>
    ${cropCards}
    ${paramsHtml}
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.onafterprint = function() { window.close(); };
      }, 400);
    };
  </script>
</body>
</html>`);

    printWindow.document.close();
    setIsPrinting(false);
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Toast message={toast.message} type={toast.type} />

      <div ref={printRef} className="bg-white rounded-lg shadow-md p-6 space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t.recommendedCrop ?? 'Recommended Crop'}:{' '}
              <span className="text-green-600">
                {cropTypeIcon(topCrop?.cropType)} {topCrop?.cropName ?? '—'}
              </span>
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {t.modelVersion ?? 'Model'} {recommendation.modelVersion ?? '2.0.0'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              isMLPowered
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              {isMLPowered ? '🤖 AI Powered' : '📋 Rule-Based'}
            </span>

            {topCrop?.confidence != null && (
              <div className={`text-center px-4 py-1.5 rounded-full border font-bold text-lg ${confidenceBg(topCrop.confidence)}`}>
                <span className={confidenceColor(topCrop.confidence)}>
                  {topCrop.confidence.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1 font-normal">
                  {t.confidence ?? 'confidence'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Input Warnings ───────────────────────────────────────────────── */}
        {inputWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
            <p className="text-sm font-semibold text-amber-800 mb-1">⚠️ Input Range Warnings</p>
            <ul className="list-disc list-inside space-y-0.5">
              {inputWarnings.map((w, i) => (
                <li key={i} className="text-xs text-amber-700">{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Top 3 Crop Cards ─────────────────────────────────────────────── */}
        {crops.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              {t.topRecommendations ?? 'Top Recommendations'}
            </h3>

            <div className="space-y-3">
              {crops.slice(0, 3).map((crop, index) => {
                const suit = suitabilityLabel(crop.suitabilityScore ?? crop.confidence);
                const isExpanded = expandedIndex === index;

                return (
                  <div
                    key={crop._id ?? index}
                    className={`border-2 rounded-lg transition-all ${
                      index === 0 ? 'border-green-300' : 'border-gray-200'
                    }`}
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                      className="w-full text-left p-4"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                            index === 0 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <span className="text-lg font-bold text-gray-800">
                              {cropTypeIcon(crop.cropType)} {crop.cropName}
                            </span>
                            {crop.cropType && (
                              <span className="ml-2 text-xs text-gray-500 capitalize">
                                ({crop.cropType})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${suit.cls}`}>
                            {suit.label}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  crop.confidence >= 85 ? 'bg-green-500' :
                                  crop.confidence >= 65 ? 'bg-blue-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${Math.min(100, crop.confidence)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold ${confidenceColor(crop.confidence)}`}>
                              {crop.confidence?.toFixed(1)}%
                            </span>
                          </div>
                          <svg
                            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {crop.growthDuration != null && (
                            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-0.5">{t.duration ?? 'Duration'}</p>
                              <p className="text-sm font-semibold text-gray-800">{crop.growthDuration} days</p>
                            </div>
                          )}
                          {crop.expectedYield?.value != null && (
                            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-0.5">{t.expectedYield ?? 'Expected Yield'}</p>
                              <p className="text-sm font-semibold text-gray-800">
                                {crop.expectedYield.value.toLocaleString()} {crop.expectedYield.unit ?? 'kg/ha'}
                              </p>
                            </div>
                          )}
                          {crop.suitabilityScore != null && (
                            <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                              <p className="text-xs text-gray-500 mb-0.5">Suitability Score</p>
                              <p className="text-sm font-semibold text-gray-800">{crop.suitabilityScore.toFixed(1)} / 100</p>
                            </div>
                          )}
                        </div>

                        {crop.reasons?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1.5">✅ Why this crop?</p>
                            <ul className="space-y-1">
                              {crop.reasons.map((r, i) => (
                                <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                                  <span className="text-green-500 shrink-0">•</span> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {crop.tips?.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1.5">💡 Farming Tips</p>
                            <ul className="space-y-1">
                              {crop.tips.map((tip, i) => (
                                <li key={i} className="text-xs text-gray-700 flex gap-1.5">
                                  <span className="text-blue-400 shrink-0">→</span> {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {crop.warnings?.length > 0 && (
                          <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
                            <p className="text-xs font-semibold text-orange-700 mb-1">⚠️ Warnings</p>
                            <ul className="space-y-0.5">
                              {crop.warnings.map((w, i) => (
                                <li key={i} className="text-xs text-orange-700">{w}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Input Parameters Summary ─────────────────────────────────────── */}
        {Object.keys(inputParams).length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-600 mb-3">
              {t.inputParameters ?? 'Input Parameters'}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {[
                { key: 'nitrogen',    label: 'N',    unit: '' },
                { key: 'phosphorus',  label: 'P',    unit: '' },
                { key: 'potassium',   label: 'K',    unit: '' },
                { key: 'temperature', label: 'Temp', unit: '°C' },
                { key: 'humidity',    label: 'Hum',  unit: '%' },
                { key: 'ph',          label: 'pH',   unit: '' },
                { key: 'rainfall',    label: 'Rain', unit: 'mm' },
              ].map(({ key, label, unit }) => (
                inputParams[key] != null && (
                  <div key={key} className="bg-gray-50 rounded-md p-2 border border-gray-200 text-center">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {inputParams[key]}{unit}
                    </p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* ── Action Buttons ───────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 pt-2 no-print">
          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 min-w-[100px] bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm font-medium flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : (
              t.save ?? 'Save'
            )}
          </button>

          {/* SHARE */}
          <button
            onClick={handleShare}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {t.share ?? 'Share'}
          </button>

          {/* PRINT / PDF */}
          <button
            onClick={handlePrint}
            disabled={isPrinting}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-sm flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {isPrinting ? 'Preparing...' : (t.print ?? 'Print / PDF')}
          </button>
        </div>

      </div>
    </>
  );
};

export default CropResultCard;