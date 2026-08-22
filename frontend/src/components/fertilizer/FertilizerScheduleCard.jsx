import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import fertilizerTranslations from '../../i18n/fertilizer';

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => {
  if (!message) return null;
  const bg = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb';
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      background: bg, color: 'white', padding: '12px 20px',
      borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      fontSize: 14, fontWeight: 600,
    }}>
      {message}
    </div>
  );
};

// ── Reminder Modal ────────────────────────────────────────────────────────────
const ReminderModal = ({ schedule, onClose, t }) => {
  if (!schedule) return null;
  const recommendations = schedule.recommendations || [];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: 'white', borderRadius: 12, padding: 28,
        maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1f2937' }}>{t.reminderTitle}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6b7280' }}>✕</button>
        </div>

        <div style={{ background: '#f0fdf4', borderRadius: 8, padding: 14, marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: '#166534' }}>
            <b>{t.reminderCropLabel}</b> {schedule.analysis?.crop?.name?.toUpperCase() || t.headerNoName}
          </p>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: '#166534' }}>
            <b>{t.reminderStageLabel}</b> {schedule.analysis?.crop?.stage || t.reminderNA}
          </p>
        </div>

        {recommendations.length > 0 && (
          <>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>{t.reminderAppTitle}</p>
            {recommendations.slice(0, 3).map((fert, i) => (
              <div key={i} style={{
                border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, marginBottom: 8,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1f2937' }}>{fert.fertilizerName}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                    {fert.applicationTiming?.timing || t.reminderTimingDefault} — {fert.applicationTiming?.growthStage}
                  </p>
                </div>
                <span style={{
                  background: '#dcfce7', color: '#166534',
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                }}>{t.reminderScheduled}</span>
              </div>
            ))}
          </>
        )}

        <p style={{ fontSize: 12, color: '#9ca3af', margin: '12px 0 16px' }}>{t.reminderNotice}</p>
        <button onClick={onClose} style={{
          width: '100%', background: '#16a34a', color: 'white',
          border: 'none', borderRadius: 8, padding: '10px 0',
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          {t.reminderGotIt}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const FertilizerScheduleCard = ({ schedule, mode = 'expert' }) => {
  const { language } = useLanguage();
  const t = fertilizerTranslations.scheduleCard[language] ?? fertilizerTranslations.scheduleCard.en;

  const [activeTab,    setActiveTab]    = useState('fertilizers');
  const [toast,        setToast]        = useState({ message: '', type: '' });
  const [isSaving,     setIsSaving]     = useState(false);
  const [isPrinting,   setIsPrinting]   = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  if (!schedule) return null;

  // Farmer Mode
  if (mode === 'farmer' && schedule.recommendation) {
    return <FarmerModeResults data={schedule} />;
  }

  const { recommendations, analysis, warnings, explanation, source, algorithm } = schedule;
  const crop              = analysis?.crop             || {};
  const farm              = analysis?.farm             || {};
  const nutrientAnalysis  = analysis?.nutrientAnalysis || {};
  const phRecommendations = analysis?.phRecommendations || {};
  const costEstimate      = analysis?.costEstimate     || {};

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const scheduleId = schedule._id;
    if (!scheduleId) { showToast(t.toastAutoSaved, 'info'); return; }
    try {
      setIsSaving(true);
      await api.put(`/fertilizer/schedules/${scheduleId}`, {
        status: schedule.status || 'active',
        notes:  schedule.notes  || '',
      });
      showToast(t.toastSaved, 'success');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save';
      showToast(`❌ ${msg}`, 'error');
    } finally { setIsSaving(false); }
  };

  // ── Share ────────────────────────────────────────────────────────────────────
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t.toastCopied, 'success');
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast(t.toastCopied, 'success');
    }
  };

  // ── Print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    setIsPrinting(true);
    const printWindow = window.open('', '_blank', 'width=950,height=800');
    if (!printWindow) {
      alert(t.alertPopup);
      setIsPrinting(false);
      return;
    }

    const sec = (title, color, content) => `
      <div style="margin-bottom:28px;page-break-inside:avoid;">
        <div style="border-top:3px solid ${color};padding-top:10px;margin-bottom:14px;">
          <h2 style="margin:0;font-size:16px;font-weight:700;color:${color};">${title}</h2>
        </div>
        ${content}
      </div>`;

    const kv = (label, value) => `
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;min-width:120px;">
        <p style="font-size:11px;color:#6b7280;margin:0 0 2px;">${label}</p>
        <b style="font-size:14px;color:#1f2937;">${value ?? t.reminderNA}</b>
      </div>`;

    const cropHtml = `
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${kv('Crop', crop.name?.toUpperCase() || t.reminderNA)}
        ${kv('Type', crop.type || t.reminderNA)}
        ${kv('Growth Cycle', crop.duration_days ? `${crop.duration_days} days` : t.reminderNA)}
        ${kv('Stage', crop.stage || t.reminderNA)}
        ${kv('Area', farm.area_hectare ? `${farm.area_hectare} ha` : t.reminderNA)}
        ${kv('Algorithm', algorithm === 'rule-based-formula-driven' ? t.algoFormula : t.algoML)}
      </div>`;

    const warningsHtml = warnings?.length > 0 ? `
      <div style="background:#fefce8;border-left:4px solid #ca8a04;border-radius:6px;padding:14px;">
        <b style="color:#92400e;">${t.warningsTitle}</b>
        <ul style="margin:8px 0 0;padding-left:16px;color:#92400e;font-size:13px;">
          ${warnings.map(w => `<li style="margin-bottom:4px;">${w}</li>`).join('')}
        </ul>
      </div>` : '';

    const fertHtml = recommendations?.length > 0 ? recommendations.map(f => `
      <div style="border:2px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:14px;page-break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;margin-bottom:12px;">
          <div>
            <h3 style="margin:0;font-size:16px;font-weight:800;color:#1f2937;">${f.fertilizerName}</h3>
            <p style="margin:3px 0 0;font-size:12px;color:#6b7280;">${f.fertilizerType} • NPK: ${f.composition?.npkRatio || t.reminderNA}</p>
          </div>
          <span style="background:#dbeafe;color:#1e40af;padding:4px 14px;border-radius:20px;font-weight:700;font-size:13px;">
            ${f.dosage?.totalAmount || f.dosage?.amount} ${f.dosage?.unit}
          </span>
        </div>
        <div style="display:flex;gap:10px;margin-bottom:12px;">
          <div style="flex:1;background:#f0fdf4;border-radius:6px;padding:10px;text-align:center;">
            <p style="font-size:11px;color:#6b7280;margin:0;">${t.labelNitrogen}</p>
            <b style="font-size:18px;color:#16a34a;">${f.composition?.nitrogen}%</b>
          </div>
          <div style="flex:1;background:#eff6ff;border-radius:6px;padding:10px;text-align:center;">
            <p style="font-size:11px;color:#6b7280;margin:0;">${t.labelPhosphorus}</p>
            <b style="font-size:18px;color:#2563eb;">${f.composition?.phosphorus}%</b>
          </div>
          <div style="flex:1;background:#faf5ff;border-radius:6px;padding:10px;text-align:center;">
            <p style="font-size:11px;color:#6b7280;margin:0;">${t.labelPotassium}</p>
            <b style="font-size:18px;color:#9333ea;">${f.composition?.potassium}%</b>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px;">
          <div style="flex:1;min-width:160px;background:#f9fafb;border-radius:6px;padding:10px;">
            <p style="font-size:11px;color:#6b7280;margin:0 0 3px;">${t.labelTiming}</p>
            <b style="font-size:13px;">${f.applicationTiming?.timing || t.timingDefault}</b>
            <p style="font-size:11px;color:#9ca3af;margin:2px 0 0;">Stage: ${f.applicationTiming?.growthStage || t.reminderNA}</p>
          </div>
          <div style="flex:1;min-width:160px;background:#f9fafb;border-radius:6px;padding:10px;">
            <p style="font-size:11px;color:#6b7280;margin:0 0 3px;">${t.labelMethod}</p>
            <b style="font-size:13px;text-transform:capitalize;">${f.applicationMethod || t.methodDefault}</b>
          </div>
        </div>
        ${f.applicationInstructions ? `<p style="font-size:12px;color:#374151;margin:8px 0 0;"><b>${t.labelInstructions}</b> ${f.applicationInstructions}</p>` : ''}
        ${f.precautions?.length > 0 ? `
          <div style="margin-top:10px;border-top:1px solid #e5e7eb;padding-top:10px;">
            <b style="font-size:12px;color:#6b7280;">${t.labelPrecautions}</b>
            <ul style="margin:4px 0 0;padding-left:16px;font-size:12px;color:#374151;">
              ${f.precautions.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>` : ''}
      </div>`).join('') : `<p style="color:#6b7280;">${t.printNoRec}</p>`;

    const costHtml = costEstimate?.total_cost ? `
      <div style="background:linear-gradient(to right,#f0fdf4,#eff6ff);border:1px solid #86efac;border-radius:8px;padding:16px;">
        <div style="display:flex;gap:16px;flex-wrap:wrap;">
          <div>
            <p style="font-size:11px;color:#6b7280;margin:0;">${t.costTotal}</p>
            <b style="font-size:24px;color:#1f2937;">₹${costEstimate.total_cost?.toFixed(2)}</b>
          </div>
          ${Object.entries(costEstimate.breakdown || {}).map(([fert, d]) => `
            <div>
              <p style="font-size:11px;color:#6b7280;margin:0;">${fert}</p>
              <b style="font-size:16px;color:#1f2937;">₹${d.total_cost?.toFixed(2)}</b>
              <p style="font-size:11px;color:#9ca3af;margin:2px 0 0;">${d.quantity} kg @ ₹${d.price_per_kg}/kg</p>
            </div>`).join('')}
        </div>
      </div>` : '';

    const nutrientHtml = `
      <div style="display:flex;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
        ${['N', 'P', 'K'].map(n => {
          const required  = nutrientAnalysis.crop_required?.[n] || 0;
          const available = nutrientAnalysis.soil_available?.[n] || 0;
          const deficit   = nutrientAnalysis.deficiency?.[n] || 0;
          const pct       = required > 0 ? Math.min((available / required) * 100, 100) : 0;
          const col       = pct >= 100 ? '#16a34a' : pct >= 50 ? '#ca8a04' : '#dc2626';
          const label     = n === 'N' ? t.labelNitrogen : n === 'P' ? t.labelPhosphorus : t.labelPotassium;
          return `
            <div style="flex:1;min-width:160px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:14px;text-align:center;">
              <b style="font-size:15px;">${label}</b>
              <p style="font-size:20px;font-weight:800;color:${col};margin:6px 0;">${available} kg/ha</p>
              <p style="font-size:11px;color:#6b7280;margin:0;">Required: ${required} kg/ha</p>
              ${deficit > 0 ? `<p style="font-size:11px;color:#dc2626;margin:3px 0 0;">${t.deficitLabel} ${deficit}</p>` : ''}
              <div style="background:#e5e7eb;border-radius:8px;height:8px;margin-top:8px;">
                <div style="background:${col};height:8px;border-radius:8px;width:${pct}%;"></div>
              </div>
            </div>`;
        }).join('')}
      </div>
      ${phRecommendations?.ph_value ? `
        <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:14px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <p style="font-size:11px;color:#6b7280;margin:0;">${t.phCurrentLabel}</p>
            <b style="font-size:28px;color:#16a34a;">${phRecommendations.ph_value}</b>
            <p style="font-size:12px;color:#374151;margin:3px 0 0;text-transform:capitalize;">${phRecommendations.ph_status}</p>
          </div>
          ${phRecommendations.correction_needed ? `
            <div style="max-width:320px;">
              <b style="font-size:12px;color:#374151;">${t.phCorrectionLabel}</b>
              <p style="font-size:12px;color:#6b7280;margin:4px 0 0;">${phRecommendations.correction_method}</p>
            </div>` : ''}
        </div>` : ''}`;

    const explanationHtml = explanation ? `
      <div style="background:linear-gradient(to right,#eff6ff,#f0fdf4);border-radius:8px;padding:16px;">
        <pre style="white-space:pre-wrap;font-family:Arial,sans-serif;font-size:13px;color:#374151;line-height:1.6;margin:0;">${explanation}</pre>
      </div>` : '';

    const safetyHtml = `
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px;">
        <b style="color:#991b1b;">${t.safetyTitle}</b>
        <ul style="margin:8px 0 0;padding-left:16px;font-size:13px;color:#991b1b;">
          ${t.safety.map(s => `<li style="margin-bottom:4px;">${s}</li>`).join('')}
        </ul>
      </div>`;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>${t.printTitle}</title>
  <style>
    * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    body { font-family:Arial,sans-serif; margin:0; padding:28px; background:white; color:#1f2937; }
    @page { margin:16px; }
  </style>
</head>
<body>
  <div style="max-width:860px;margin:0 auto;">
    <div style="border-bottom:3px solid #16a34a;margin-bottom:24px;padding-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;">
      <div>
        <h1 style="margin:0;font-size:22px;font-weight:800;color:#15803d;">${t.printTitle}</h1>
        <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${t.printGenerated} ${new Date().toLocaleString()}</p>
      </div>
      <b style="font-size:14px;color:#374151;">${crop.name?.toUpperCase() || 'Crop'} • ${crop.stage || t.reminderNA}</b>
    </div>
    ${warningsHtml ? sec(t.printWarnings, '#ca8a04', warningsHtml) : ''}
    ${sec(t.printCropInfo, '#2563eb', cropHtml)}
    ${sec(t.printFertilizers, '#16a34a', fertHtml)}
    ${costEstimate?.total_cost ? sec(t.printCost, '#16a34a', costHtml) : ''}
    ${sec(t.printNutrient, '#7c3aed', nutrientHtml)}
    ${explanation ? sec(t.printExplanation, '#0891b2', explanationHtml) : ''}
    ${sec(t.printSafety, '#dc2626', safetyHtml)}
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

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      {showReminder && <ReminderModal schedule={schedule} onClose={() => setShowReminder(false)} t={t} />}

      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t.headerTitle} {crop.name?.toUpperCase() || t.headerNoName}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{crop.type} • {crop.duration_days} days growth cycle</p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold capitalize">
              {crop.stage || t.reminderNA}
            </span>
            {source && (
              <span className="text-xs text-gray-500">
                {algorithm === 'rule-based-formula-driven' ? t.algoFormula : t.algoML}
              </span>
            )}
          </div>
        </div>

        {/* Warnings */}
        {warnings?.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-sm">
                <p className="font-semibold text-yellow-800 mb-2">{t.warningsTitle}</p>
                <ul className="space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-yellow-800">• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-4">
            {['fertilizers', 'analysis', 'explanation'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab === 'fertilizers' && t.tabFertilizers}
                {tab === 'analysis'    && t.tabAnalysis}
                {tab === 'explanation' && t.tabDetails}
              </button>
            ))}
          </div>
        </div>

        {/* Fertilizers Tab */}
        {activeTab === 'fertilizers' && (
          <div className="space-y-6">
            {recommendations?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  {t.recTitle} ({farm.area_hectare} hectares)
                </h3>
                <div className="space-y-4">
                  {recommendations.map((fertilizer, index) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{fertilizer.fertilizerName}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {fertilizer.fertilizerType} • NPK: {fertilizer.composition?.npkRatio || t.reminderNA}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            {fertilizer.dosage?.totalAmount || fertilizer.dosage?.amount} {fertilizer.dosage?.unit}
                          </span>
                          <span className="block text-xs text-gray-500 mt-1">
                            ({fertilizer.dosage?.amount} {fertilizer.dosage?.unit}/{fertilizer.dosage?.perArea})
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="bg-green-50 rounded-md p-2 text-center">
                          <p className="text-xs text-gray-600">{t.labelNitrogen}</p>
                          <p className="text-lg font-bold text-green-600">{fertilizer.composition?.nitrogen}%</p>
                        </div>
                        <div className="bg-blue-50 rounded-md p-2 text-center">
                          <p className="text-xs text-gray-600">{t.labelPhosphorus}</p>
                          <p className="text-lg font-bold text-blue-600">{fertilizer.composition?.phosphorus}%</p>
                        </div>
                        <div className="bg-purple-50 rounded-md p-2 text-center">
                          <p className="text-xs text-gray-600">{t.labelPotassium}</p>
                          <p className="text-lg font-bold text-purple-600">{fertilizer.composition?.potassium}%</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-xs text-gray-600 mb-1">{t.labelTiming}</p>
                          <p className="text-sm font-semibold text-gray-800">{fertilizer.applicationTiming?.timing || t.timingDefault}</p>
                          <p className="text-xs text-gray-600 mt-1">Stage: {fertilizer.applicationTiming?.growthStage}</p>
                        </div>
                        <div className="bg-gray-50 rounded-md p-3">
                          <p className="text-xs text-gray-600 mb-1">{t.labelMethod}</p>
                          <p className="text-sm font-semibold text-gray-800 capitalize">{fertilizer.applicationMethod || t.methodDefault}</p>
                        </div>
                      </div>
                      {fertilizer.applicationInstructions && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">{t.labelInstructions}</p>
                          <p className="text-sm text-gray-700">{fertilizer.applicationInstructions}</p>
                        </div>
                      )}
                      {fertilizer.precautions?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-xs text-gray-600 mb-2">{t.labelPrecautions}</p>
                          <ul className="space-y-1">
                            {fertilizer.precautions.map((p, idx) => (
                              <li key={idx} className="text-xs text-gray-700">• {p}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {costEstimate?.total_cost && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.costTitle}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">{t.costTotal}</p>
                    <p className="text-2xl font-bold text-gray-800">₹{costEstimate.total_cost?.toFixed(2)}</p>
                  </div>
                  {costEstimate.breakdown && Object.entries(costEstimate.breakdown).map(([fert, details]) => (
                    <div key={fert}>
                      <p className="text-xs text-gray-600">{fert}</p>
                      <p className="text-lg font-bold text-gray-800">₹{details.total_cost?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{details.quantity} kg @ ₹{details.price_per_kg}/kg</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.soilStatusTitle}</h3>
              <div className="grid grid-cols-3 gap-4">
                {['N', 'P', 'K'].map(n => (
                  <div key={n} className="text-center">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                      farm.soil_status?.[n] === 'high'   ? 'bg-green-100 text-green-800' :
                      farm.soil_status?.[n] === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {farm.soil_status?.[n]?.toUpperCase()}
                    </div>
                    <p className="text-sm text-gray-600">
                      {n === 'N' ? t.labelNitrogen : n === 'P' ? t.labelPhosphorus : t.labelPotassium}
                    </p>
                    <p className="text-xl font-bold text-gray-800">{nutrientAnalysis.soil_available?.[n]} kg/ha</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.nutrientBalanceTitle}</h3>
              <div className="space-y-3">
                {['N', 'P', 'K'].map(n => {
                  const required  = nutrientAnalysis.crop_required?.[n] || 0;
                  const available = nutrientAnalysis.soil_available?.[n] || 0;
                  const deficit   = nutrientAnalysis.deficiency?.[n] || 0;
                  const pct = available > 0 ? (available / required * 100) : 0;
                  return (
                    <div key={n}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">
                          {n === 'N' ? t.labelNitrogen : n === 'P' ? t.labelPhosphorus : t.labelPotassium}
                        </span>
                        <span className="text-gray-600">
                          {available} / {required} kg/ha
                          {deficit > 0 && <span className="text-red-600 ml-2">({t.deficitLabel} {deficit})</span>}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full ${pct >= 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {phRecommendations && (
              <div className={`p-4 rounded-lg ${
                phRecommendations.ph_status === 'neutral' ? 'bg-green-50' :
                phRecommendations.ph_status === 'acidic'  ? 'bg-yellow-50' : 'bg-orange-50'
              }`}>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.phTitle}</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{t.phCurrentLabel}</p>
                    <p className="text-3xl font-bold text-gray-800">{phRecommendations.ph_value}</p>
                    <p className="text-sm text-gray-600 capitalize mt-1">{phRecommendations.ph_status}</p>
                  </div>
                  {phRecommendations.correction_needed && (
                    <div className="text-right max-w-md">
                      <p className="text-sm font-semibold text-gray-800 mb-1">{t.phCorrectionLabel}</p>
                      <p className="text-xs text-gray-700">{phRecommendations.correction_method}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explanation Tab */}
        {activeTab === 'explanation' && (
          <div className="space-y-6">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.explanationTitle}</h3>
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed">
                {explanation}
              </pre>
            </div>
          </div>
        )}

        {/* Safety */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-2">{t.safetyTitle}</p>
              <ul className="list-disc list-inside space-y-1">
                {t.safety.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={handleSave} disabled={isSaving}
            className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {t.btnSaving}
              </>
            ) : t.btnSave}
          </button>

          <button onClick={handlePrint} disabled={isPrinting}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-60 transition-colors font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {isPrinting ? t.btnPrinting : t.btnPrint}
          </button>

          <button onClick={handleShare}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            {t.btnShare}
          </button>

          <button onClick={() => setShowReminder(true)}
            className="px-6 py-3 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            {t.btnReminder}
          </button>
        </div>
      </div>
    </>
  );
};

// Farmer Mode Results
const FarmerModeResults = ({ data }) => {
  const recommendation = data.recommendation?.recommendation || data.recommendation;
  if (!recommendation) return null;
  const FertilizerComparisonCard = require('./FertilizerComparisonCard').default;
  return <FertilizerComparisonCard recommendation={recommendation} mode="farmer" />;
};

export default FertilizerScheduleCard;