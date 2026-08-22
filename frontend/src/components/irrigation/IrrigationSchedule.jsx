import React, { useState } from 'react';
import api from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import irrigationTranslations from '../../i18n/irrigation';

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, type }) => {
  if (!message) return null;
  const bg = type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#2563eb';
  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex:9999,
      background:bg, color:'white', padding:'12px 20px',
      borderRadius:8, boxShadow:'0 4px 12px rgba(0,0,0,0.15)',
      fontSize:14, fontWeight:600
    }}>{message}</div>
  );
};

// ── Reminder Modal ─────────────────────────────────────────────────────────────
const ReminderModal = ({ schedule, onClose, t }) => {
  if (!schedule) return null;
  const upcoming    = schedule.upcomingIrrigations?.slice(0, 3) || [];
  const reminderTime = schedule.notifications?.reminderTime || 30;
  const channels    = schedule.notifications?.channels || ['app'];

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:10000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ background:'white', borderRadius:12, padding:28, maxWidth:480, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:'#1f2937' }}>{t.title}</h2>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#6b7280' }}>✕</button>
        </div>
        <div style={{ background:'#eff6ff', borderRadius:8, padding:14, marginBottom:16 }}>
          <p style={{ margin:0, fontSize:13, color:'#1e40af' }}><b>{t.set}</b> {reminderTime} {t.minsBefore}</p>
          <p style={{ margin:'6px 0 0', fontSize:13, color:'#1e40af' }}><b>{t.channels}</b> {channels.join(', ')}</p>
        </div>
        {upcoming.length > 0 && (
          <>
            <p style={{ fontSize:13, fontWeight:600, color:'#374151', margin:'0 0 10px' }}>{t.upcoming}</p>
            {upcoming.map((irr, i) => {
              const d = new Date(irr.scheduledDate);
              const reminderDate = new Date(d.getTime() - reminderTime * 60000);
              return (
                <div key={i} style={{ border:'1px solid #e5e7eb', borderRadius:8, padding:12, marginBottom:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <p style={{ margin:0, fontSize:13, fontWeight:600, color:'#1f2937' }}>{t.session} {i + 1} — {d.toLocaleDateString('en-US', { month:'short', day:'numeric' })}</p>
                    <p style={{ margin:'2px 0 0', fontSize:12, color:'#6b7280' }}>{t.reminderAt} {reminderDate.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}</p>
                  </div>
                  <span style={{ background:'#dcfce7', color:'#166534', padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>{t.active}</span>
                </div>
              );
            })}
          </>
        )}
        <p style={{ fontSize:12, color:'#9ca3af', margin:'12px 0 16px' }}>{t.info}</p>
        <button onClick={onClose} style={{ width:'100%', background:'#2563eb', color:'white', border:'none', borderRadius:8, padding:'10px 0', fontSize:14, fontWeight:600, cursor:'pointer' }}>
          {t.gotIt}
        </button>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const IrrigationSchedule = ({ schedule: data }) => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.schedule ?? irrigationTranslations.en.schedule;

  const [toast, setToast]               = useState({ message:'', type:'' });
  const [isSaving, setIsSaving]         = useState(false);
  const [isPrinting, setIsPrinting]     = useState(false);
  const [showReminder, setShowReminder] = useState(false);

  if (!data) return null;

  const schedule       = data.schedule;
  const waterUsage     = data.estimatedWaterUsage;
  const mlUsed         = data.mlUsed         || schedule?.mlMetadata?.usedML    || false;
  const mlConfidence   = data.confidence     || schedule?.mlMetadata?.confidence || null;
  const mlUrgency      = data.urgency        || schedule?.mlMetadata?.urgency    || null;
  const mlCropStage    = data.cropStage      || schedule?.mlMetadata?.cropStage  || null;
  const roadmapSummary = data.roadmapSummary || null;
  const cropTips       = data.cropTips       || [];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message:'', type:'' }), 3000);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
  const formatTime = (time) => {
    if (!time) return 'N/A';
    const [hour, minute] = time.split(':');
    const h = parseInt(hour);
    return `${h % 12 || 12}:${minute.padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const getMethodIcon = (method) => {
    const type = method?.toLowerCase() || 'drip';
    if (type === 'drip') {
      return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
    }
    return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
  };

  const urgencyColor = {
    critical: 'bg-red-100 text-red-800 border-red-300',
    high:     'bg-orange-100 text-orange-800 border-orange-300',
    moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    low:      'bg-green-100 text-green-800 border-green-300',
    none:     'bg-gray-100 text-gray-700 border-gray-300',
  };

  const handleSave = async () => {
    const scheduleId = data?.schedule?._id;
    try {
      setIsSaving(true);
      if (scheduleId) {
        await api.put(`/irrigation/schedules/${scheduleId}`, {
          scheduleName:       schedule.scheduleName,
          status:             schedule.status             || 'active',
          notes:              schedule.notes              || '',
          weatherAdjustments: schedule.weatherAdjustments || {},
          notifications:      schedule.notifications      || {},
        }).catch(() => {});
      }

      const rawHistory = localStorage.getItem('agrisathi_irrigation_history');
      let list = [];
      if (rawHistory) {
        try { list = JSON.parse(rawHistory); } catch (_) {}
      }
      if (!Array.isArray(list)) list = [];
      const newItem = {
        _id: scheduleId || `irrig_${Date.now()}`,
        farmDetails: schedule?.cropDetails || { cropType: 'Wheat', areaSize: 1, irrigationMethod: 'Drip' },
        irrigationSchedule: schedule || data,
        waterRequirement: data.estimatedWaterUsage || { totalWaterLiters: 1500 },
        createdAt: new Date().toISOString()
      };
      list = [newItem, ...list.filter(i => String(i._id) !== String(newItem._id))];
      localStorage.setItem('agrisathi_irrigation_history', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('agrisathi_irrigation_updated', { detail: list }));

      showToast(t.toast.saveSuccess, 'success');
    } catch (err) {
      showToast(`❌ ${err.response?.data?.message || err.message || 'Failed to save'}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t.toast.linkCopied, 'success');
    } catch {
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      showToast(t.toast.linkCopied, 'success');
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    const printWindow = window.open('', '_blank', 'width:950,height:800');
    if (!printWindow) { alert('Popup blocked! Please allow popups and try again.'); setIsPrinting(false); return; }

    const pr = t.printReport;
    const sec = (title, color, content) => `
      <div style="margin-bottom:28px;page-break-inside:avoid;">
        <div style="border-top:3px solid ${color};padding-top:10px;margin-bottom:14px;">
          <h2 style="margin:0;font-size:16px;font-weight:700;color:${color};">${title}</h2>
        </div>${content}
      </div>`;
    const kv = (label, value) => `
      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:10px 14px;min-width:120px;">
        <p style="font-size:11px;color:#6b7280;margin:0 0 2px;">${label}</p>
        <b style="font-size:14px;color:#1f2937;">${value ?? 'N/A'}</b>
      </div>`;

    const cropInfoHtml = `<div style="display:flex;gap:12px;flex-wrap:wrap;">
      ${kv(t.cropType,   schedule.cropDetails.cropType)}
      ${kv(t.area,       `${schedule.cropDetails.area.value} ${schedule.cropDetails.area.unit}`)}
      ${kv(t.plantedDate, formatDate(schedule.cropDetails.plantedDate))}
      ${kv(t.soilType,   schedule.cropDetails.soilType || schedule.soilInformation?.soilType)}
      ${kv(t.growthStage, schedule.cropDetails?.growthStage || mlCropStage)}
      ${kv(t.status,     schedule.status)}
    </div>`;

    const waterHtml = waterUsage ? `<div style="display:flex;gap:12px;flex-wrap:wrap;">
      ${kv(t.daily,        `${waterUsage.daily?.toFixed(1)} L`)}
      ${kv(t.weekly,       `${waterUsage.weekly?.toFixed(1)} L`)}
      ${kv(t.monthly,      `${waterUsage.monthly?.toFixed(1)} L`)}
      ${kv(t.sysEfficiency, `${schedule.irrigationSystem.efficiency}%`)}
      ${kv(t.irrigSystem,  schedule.irrigationSystem.type)}
    </div>` : `<p style="color:#6b7280;font-size:13px;">No water usage data available.</p>`;

    const mlHtml = mlUsed ? `
      <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:16px;">
        <b style="color:#6d28d9;">${t.mlBadge} — ${t.mlSubtitle}</b>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px;">
          ${mlConfidence !== null ? kv(t.mlConfidence, typeof mlConfidence === 'number' && mlConfidence <= 1 ? `${Math.round(mlConfidence*100)}%` : `${mlConfidence}%`) : ''}
          ${mlUrgency ? kv(t.urgencyLabel, mlUrgency) : ''}
          ${mlCropStage ? kv(t.cropStageML, mlCropStage) : ''}
          ${roadmapSummary?.totalIrrigationEvents !== undefined ? kv(t.events30d, roadmapSummary.totalIrrigationEvents) : ''}
          ${roadmapSummary?.totalWaterUsedMm !== undefined ? kv(t.totalWater30d, `${roadmapSummary.totalWaterUsedMm} mm`) : ''}
          ${roadmapSummary?.nextIrrigationDate ? kv(t.nextIrrigation, formatDate(roadmapSummary.nextIrrigationDate)) : ''}
        </div>
      </div>` : '';

    const nextHtml = schedule.nextIrrigation ? `
      <div style="background:#fff7ed;border:1px solid #fdba74;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <p style="font-size:18px;font-weight:800;color:#1f2937;margin:0;">${formatDate(schedule.nextIrrigation.scheduledDate)}</p>
          <p style="font-size:14px;color:#374151;margin:4px 0 0;">at ${formatTime(schedule.nextIrrigation.scheduledTime)}</p>
        </div>
        <div style="text-align:right;">
          <p style="font-size:22px;font-weight:800;color:#ea580c;margin:0;">${schedule.nextIrrigation.waterAmount.value} ${schedule.nextIrrigation.waterAmount.unit}</p>
          <p style="font-size:12px;color:#6b7280;margin:4px 0 0;">for ${schedule.nextIrrigation.duration} ${t.minutes}</p>
        </div>
      </div>` : '';

    const headers = pr.tableHeaders;
    const upcomingHtml = schedule.upcomingIrrigations?.length > 0 ? `
      <table style="width:100%;border-collapse:collapse;font-size:13px;">
        <thead><tr style="background:#f3f4f6;">
          ${headers.map(h => `<th style="padding:8px 12px;text-align:left;border:1px solid #e5e7eb;">${h}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${schedule.upcomingIrrigations.map((irr, i) => `
            <tr style="background:${i%2===0?'white':'#f9fafb'};">
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">${i+1}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">${formatDate(irr.scheduledDate)}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">${formatTime(irr.scheduledTime)}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">${irr.duration} min</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">${irr.waterAmount.value} ${irr.waterAmount.unit}</td>
              <td style="padding:8px 12px;border:1px solid #e5e7eb;">${irr.status}</td>
            </tr>`).join('')}
        </tbody>
      </table>` : `<p style="color:#6b7280;font-size:13px;">No upcoming sessions.</p>`;

    const tipsHtml = mlUsed && cropTips.length > 0
      ? `<ul style="margin:0;padding-left:18px;font-size:13px;color:#312e81;">${cropTips.map(tip => `<li style="margin-bottom:4px;">${tip}</li>`).join('')}</ul>`
      : '';

    const bestHtml = `<ul style="margin:0;padding-left:18px;font-size:13px;color:#166534;">
      ${pr.bestList.map(b => `<li>${b}</li>`).join('')}
      <li>${t.bestPracticesList[4].replace('{system}', schedule.irrigationSystem.type)}</li>
    </ul>`;

    printWindow.document.write(`<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"/>
<title>${pr.title}</title>
<style>* { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
body { font-family:Arial,sans-serif; margin:0; padding:28px; background:white; color:#1f2937; }
@page { margin:16px; }</style></head>
<body><div style="max-width:860px;margin:0 auto;">
  <div style="border-bottom:3px solid #2563eb;margin-bottom:24px;padding-bottom:12px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:8px;">
    <div>
      <h1 style="margin:0;font-size:22px;font-weight:800;color:#1e40af;">${pr.title}</h1>
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">${pr.generatedOn} ${new Date().toLocaleString()}</p>
    </div>
    <div style="font-size:14px;font-weight:700;color:#374151;text-transform:capitalize;">${schedule.scheduleName} · ${schedule.status}</div>
  </div>
  ${sec(pr.cropInfo,    '#2563eb', cropInfoHtml)}
  ${sec(pr.waterReq,    '#0891b2', waterHtml)}
  ${mlUsed ? sec(pr.mlAnalysis, '#7c3aed', mlHtml) : ''}
  ${schedule.nextIrrigation ? sec(pr.nextIrrig, '#ea580c', nextHtml) : ''}
  ${sec(pr.upcoming,    '#16a34a', upcomingHtml)}
  ${mlUsed && cropTips.length > 0 ? sec(pr.cropTips, '#4338ca', tipsHtml) : ''}
  ${sec(pr.bestPractices, '#16a34a', bestHtml)}
</div>
<script>window.onload=function(){setTimeout(function(){window.print();window.onafterprint=function(){window.close();};},400);};</script>
</body></html>`);
    printWindow.document.close();
    setIsPrinting(false);
  };

  return (
    <>
      <Toast message={toast.message} type={toast.type} />
      {showReminder && <ReminderModal schedule={schedule} onClose={() => setShowReminder(false)} t={t.reminder} />}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {schedule.scheduleName} {t.scheduleLabel}
          </h2>
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold capitalize">{schedule.status}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold capitalize">{schedule.cropDetails?.growthStage || mlCropStage || 'N/A'}</span>
            {mlUsed && <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">{t.mlBadge}</span>}
          </div>
        </div>

        {/* ML Summary Panel */}
        {mlUsed && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-l-4 border-purple-500 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              {t.mlTitle}
              <span className="ml-2 text-xs font-normal text-gray-500">{t.mlSubtitle}</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mlConfidence !== null && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t.mlConfidence}</p>
                  <p className="text-xl font-bold text-purple-700">
                    {typeof mlConfidence === 'number' && mlConfidence <= 1 ? `${Math.round(mlConfidence*100)}%` : `${mlConfidence}%`}
                  </p>
                </div>
              )}
              {mlUrgency && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t.urgencyLabel}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm font-semibold border capitalize ${urgencyColor[mlUrgency] || urgencyColor.none}`}>{mlUrgency}</span>
                </div>
              )}
              {mlCropStage && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t.cropStageML}</p>
                  <p className="text-sm font-bold text-gray-800 capitalize">{mlCropStage}</p>
                </div>
              )}
              {roadmapSummary?.totalIrrigationEvents !== undefined && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">{t.events30d}</p>
                  <p className="text-xl font-bold text-indigo-700">{roadmapSummary.totalIrrigationEvents}</p>
                </div>
              )}
            </div>
            {roadmapSummary && (
              <div className="mt-4 pt-3 border-t border-purple-200 grid grid-cols-2 md:grid-cols-3 gap-4">
                {roadmapSummary.totalWaterUsedMm !== undefined && (
                  <div><p className="text-xs text-gray-600 mb-1">{t.totalWater30d}</p><p className="text-lg font-bold text-blue-700">{roadmapSummary.totalWaterUsedMm} mm</p></div>
                )}
                {roadmapSummary.avgWaterPerEventMm !== undefined && (
                  <div><p className="text-xs text-gray-600 mb-1">{t.avgPerEvent}</p><p className="text-lg font-bold text-cyan-700">{roadmapSummary.avgWaterPerEventMm} mm</p></div>
                )}
                {roadmapSummary.nextIrrigationDate && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{t.nextIrrigation}</p>
                    <p className="text-sm font-bold text-orange-700">
                      {formatDate(roadmapSummary.nextIrrigationDate)}
                      {roadmapSummary.nextIrrigationVolumeMm && <span className="ml-1 text-gray-500">({roadmapSummary.nextIrrigationVolumeMm} mm)</span>}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Crop Information */}
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.cropInfo}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><p className="text-xs text-gray-600 mb-1">{t.cropType}</p><p className="text-lg font-bold text-gray-800 capitalize">{schedule.cropDetails.cropType}</p></div>
            <div><p className="text-xs text-gray-600 mb-1">{t.area}</p><p className="text-lg font-bold text-gray-800">{schedule.cropDetails.area.value} {schedule.cropDetails.area.unit}</p></div>
            <div><p className="text-xs text-gray-600 mb-1">{t.plantedDate}</p><p className="text-lg font-bold text-gray-800">{formatDate(schedule.cropDetails.plantedDate)}</p></div>
            <div><p className="text-xs text-gray-600 mb-1">{t.soilType}</p><p className="text-lg font-bold text-gray-800 capitalize">{schedule.soilInformation.soilType}</p></div>
          </div>
        </div>

        {/* Water Requirements */}
        {waterUsage && (
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.waterReq}</h3>
            <div className="grid grid-cols-3 gap-4">
              <div><p className="text-xs text-gray-600 mb-1">{t.daily}</p><p className="text-xl font-bold text-blue-600">{waterUsage.daily.toFixed(1)} L</p></div>
              <div><p className="text-xs text-gray-600 mb-1">{t.weekly}</p><p className="text-xl font-bold text-cyan-600">{waterUsage.weekly.toFixed(1)} L</p></div>
              <div><p className="text-xs text-gray-600 mb-1">{t.monthly}</p><p className="text-xl font-bold text-green-600">{waterUsage.monthly.toFixed(1)} L</p></div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{t.sysEfficiency}</span> {schedule.irrigationSystem.efficiency}%
                <span className="capitalize"> ({schedule.irrigationSystem.type} Irrigation)</span>
              </p>
            </div>
          </div>
        )}

        {/* Irrigation System */}
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.irrigSystem}</h3>
          <div className="flex items-start space-x-3">
            <div className="text-green-600">{getMethodIcon(schedule.irrigationSystem.type)}</div>
            <div>
              <p className="font-bold text-gray-800 capitalize mb-1">{schedule.irrigationSystem.type} Irrigation</p>
              <p className="text-sm text-gray-700">{t.efficiency} {schedule.irrigationSystem.efficiency}%</p>
              <p className="text-sm text-gray-700 mt-2">{t.frequency} <span className="font-semibold capitalize">{schedule.schedule.frequency.replace('-',' ')}</span></p>
              <p className="text-sm text-gray-700">{t.waterPerSession} <span className="font-semibold">{schedule.schedule.waterAmount.value} {schedule.schedule.waterAmount.unit}</span></p>
              <p className="text-sm text-gray-700">{t.duration} <span className="font-semibold">{schedule.schedule.preferredTimes[0]?.duration || 60} {t.minutes}</span></p>
            </div>
          </div>
        </div>

        {/* Next Irrigation */}
        {schedule.nextIrrigation && (
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.nextIrrigTitle}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-800">{formatDate(schedule.nextIrrigation.scheduledDate)}</p>
                <p className="text-lg text-gray-700">at {formatTime(schedule.nextIrrigation.scheduledTime)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">{schedule.nextIrrigation.waterAmount.value} {schedule.nextIrrigation.waterAmount.unit}</p>
                <p className="text-sm text-gray-600">for {schedule.nextIrrigation.duration} {t.minutes}</p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Irrigations */}
        {schedule.upcomingIrrigations?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {t.upcomingTitle} ({schedule.upcomingIrrigations.length} {t.sessionsPlanned})
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {schedule.upcomingIrrigations.slice(0, 10).map((irrigation, index) => (
                <div key={irrigation.id || index} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">{index + 1}</div>
                      <div>
                        <p className="font-bold text-gray-800">{formatDate(irrigation.scheduledDate)}</p>
                        <p className="text-sm text-gray-600">{formatTime(irrigation.scheduledTime)} • {irrigation.duration} {t.minutes}</p>
                        {irrigation.advisory && <p className="text-xs text-purple-700 mt-1 italic">🤖 {irrigation.advisory}</p>}
                        {irrigation.cropStage && <p className="text-xs text-gray-500 capitalize">{t.stageLabel} {irrigation.cropStage}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{irrigation.waterAmount.value} {irrigation.waterAmount.unit}</p>
                      {irrigation.confidence !== undefined && <p className="text-xs text-purple-600 font-medium">{Math.round(irrigation.confidence*100)}%</p>}
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        irrigation.status === 'pending'   ? 'bg-yellow-100 text-yellow-800' :
                        irrigation.status === 'completed' ? 'bg-green-100 text-green-800'  : 'bg-gray-100 text-gray-800'
                      }`}>{irrigation.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {schedule.upcomingIrrigations.length > 10 && (
              <p className="text-sm text-gray-500 text-center mt-3">
                {t.moreLabel.replace('{n}', schedule.upcomingIrrigations.length - 10)}
              </p>
            )}
          </div>
        )}

        {/* ML Crop Tips */}
        {mlUsed && cropTips.length > 0 && (
          <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.cropTipsTitle} {schedule.cropDetails.cropType}</h3>
            <ul className="list-disc list-inside space-y-1">
              {cropTips.map((tip, i) => <li key={i} className="text-sm text-indigo-900">{tip}</li>)}
            </ul>
          </div>
        )}

        {/* Schedule Duration */}
        <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t.scheduleDuration}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-600 mb-1">{t.startDate}</p><p className="text-lg font-bold text-gray-800">{formatDate(schedule.duration.startDate)}</p></div>
            {schedule.duration.endDate && <div><p className="text-xs text-gray-600 mb-1">{t.endDate}</p><p className="text-lg font-bold text-gray-800">{formatDate(schedule.duration.endDate)}</p></div>}
          </div>
        </div>

        {/* Weather Adjustments */}
        {schedule.weatherAdjustments?.enabled && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.weatherAdj}</h3>
            <p className="text-sm text-gray-700">{t.weatherAdjDesc} <span className="font-semibold">{schedule.weatherAdjustments.rainThreshold}mm</span>.</p>
            {schedule.weatherAdjustments.temperatureAdjustment && <p className="text-sm text-gray-700 mt-1">{t.tempAdj}</p>}
            {schedule.weatherAdjustments.humidityAdjustment && <p className="text-sm text-gray-700">{t.humidAdj}</p>}
          </div>
        )}

        {/* Best Practices */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-2">{t.bestPractices} {schedule.cropDetails.cropType}:</p>
              <ul className="list-disc list-inside space-y-1">
                {t.bestPracticesList.map((p, i) => (
                  <li key={i}>{p.replace('{system}', schedule.irrigationSystem.type)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Notifications */}
        {schedule.notifications?.enabled && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.notifications}</h3>
            <p className="text-sm text-gray-700">
              {t.notifDesc.replace('{time}', schedule.notifications.reminderTime)}
              {schedule.notifications.channels?.length > 0 && ` ${t.notifVia} ${schedule.notifications.channels.join(', ')}`}.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button onClick={handleSave} disabled={isSaving}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
            {isSaving ? (
              <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>{t.saving}</>
            ) : t.saveBtn}
          </button>
          <button onClick={handlePrint} disabled={isPrinting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-60 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            {isPrinting ? t.preparing : t.printBtn}
          </button>
          <button onClick={handleShare}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
            {t.shareBtn}
          </button>
          <button onClick={() => setShowReminder(true)}
            className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            {t.remindBtn}
          </button>
        </div>
      </div>
    </>
  );
};

export default IrrigationSchedule;