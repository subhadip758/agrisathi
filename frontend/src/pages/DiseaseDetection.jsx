import React, { useState, useCallback, useMemo } from 'react';
import { Leaf, History, Trash2, RefreshCw, ChevronRight, AlertCircle, Microscope, Camera } from 'lucide-react';
import { toast } from 'react-toastify';
import DiseaseUploadForm from '../components/disease/DiseaseUploadForm';
import DiseaseResultCard from '../components/disease/DiseaseResultCard';
import { detectDisease, getDetectionHistory, deleteDetection } from '../services/diseaseService';
import { useLanguage } from '../context/LanguageContext';
import diseaseTranslations from '../i18n/disease';

/* ─── Injected global styles ────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

    .dd-root {
      font-family: 'DM Sans', sans-serif;
      min-height: 100vh;
      background-color: #0b1f10;
      background-image:
        radial-gradient(ellipse 80% 60% at 10% 0%, rgba(34,90,40,0.45) 0%, transparent 60%),
        radial-gradient(ellipse 60% 50% at 90% 100%, rgba(20,60,25,0.5) 0%, transparent 55%),
        url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.022'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      position: relative;
    }
    .dd-root::before {
      content: '';
      position: fixed;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 0;
    }
    .dd-root > * { position: relative; z-index: 1; }
    .dd-heading { font-family: 'Playfair Display', serif; }
    .dd-glass {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.09);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 20px;
    }
    .dd-glass-card {
      background: rgba(255,255,255,0.035);
      border: 1px solid rgba(255,255,255,0.07);
      backdrop-filter: blur(12px);
      border-radius: 16px;
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    }
    .dd-glass-card:hover {
      background: rgba(255,255,255,0.06);
      border-color: rgba(134,197,100,0.25);
      transform: translateY(-2px);
    }
    .dd-glass-card.active {
      background: rgba(134,197,100,0.08);
      border-color: rgba(134,197,100,0.4);
      box-shadow: 0 0 20px rgba(134,197,100,0.1);
    }
    .dd-accent-card {
      background: linear-gradient(135deg, rgba(34,90,40,0.4) 0%, rgba(20,60,25,0.4) 100%);
      border: 1px solid rgba(134,197,100,0.2);
      backdrop-filter: blur(16px);
      border-radius: 20px;
    }
    .dd-tab-btn {
      padding: 9px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.01em;
      transition: all 0.2s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 7px;
      border: none;
      background: transparent;
      color: rgba(255,255,255,0.5);
    }
    .dd-tab-btn:hover { color: rgba(255,255,255,0.85); }
    .dd-tab-btn.active {
      background: linear-gradient(135deg, #2a6828 0%, #1e4d1a 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(34,90,40,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
    }
    .dd-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 99px;
      background: rgba(134,197,100,0.12);
      border: 1px solid rgba(134,197,100,0.25);
      color: #86c564;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .dd-chip-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #86c564;
      box-shadow: 0 0 6px #86c564;
    }
    .dd-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba(134,197,100,0.15);
      border-top-color: #56b848;
      border-radius: 50%;
      animation: dd-spin 0.9s cubic-bezier(0.6,0.2,0.4,0.8) infinite;
    }
    @keyframes dd-spin { to { transform: rotate(360deg); } }
    .dd-section-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
      margin-bottom: 12px;
    }
    .dd-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      text-align: center;
    }
    .dd-empty-icon {
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: rgba(134,197,100,0.08);
      border: 1px solid rgba(134,197,100,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }
    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 12px;
      color: rgba(255,255,255,0.7);
      line-height: 1.5;
    }
    .tip-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #86c564;
      margin-top: 6px;
      flex-shrink: 0;
    }
    .dd-delete-btn {
      opacity: 0;
      transition: opacity 0.15s ease;
      background: rgba(220,53,69,0.15);
      border: 1px solid rgba(220,53,69,0.3);
      color: #ff6b6b;
      border-radius: 8px;
      padding: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dd-glass-card:hover .dd-delete-btn { opacity: 1; }
    .dd-delete-btn:hover {
      background: rgba(220,53,69,0.3);
      color: #fff;
    }
    @keyframes dd-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .dd-fade-up { animation: dd-fade-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards; }
    .dd-fade-up-1 { animation-delay: 0.05s; }
    .dd-fade-up-2 { animation-delay: 0.12s; }
    .dd-fade-up-3 { animation-delay: 0.2s; }
  `}</style>
);

/* ─── Botanical SVG deco ────────────────────────────────────────────────────── */
const LeafDeco = ({ size = 120, style = {} }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ ...style, position: 'absolute', pointerEvents: 'none', opacity: 0.07 }}>
    <path d="M60 10 C60 10 100 30 100 70 C100 90 80 110 60 110 C40 110 20 90 20 70 C20 30 60 10 60 10Z" fill="#56b848"/>
    <path d="M60 110 L60 10" stroke="#3a8c32" strokeWidth="1.5"/>
    <path d="M60 70 Q80 55 95 50" stroke="#3a8c32" strokeWidth="1" opacity="0.6"/>
    <path d="M60 55 Q40 40 25 38" stroke="#3a8c32" strokeWidth="1" opacity="0.6"/>
    <path d="M60 85 Q75 72 88 70" stroke="#3a8c32" strokeWidth="1" opacity="0.4"/>
    <path d="M60 40 Q44 28 32 26" stroke="#3a8c32" strokeWidth="1" opacity="0.4"/>
  </svg>
);

/* ─── Main Page ─────────────────────────────────────────────────────────────── */
const DiseaseDetection = () => {
  const { language } = useLanguage();
  const t = useMemo(() => diseaseTranslations.page?.[language] || diseaseTranslations.page?.en || {}, [language]);

  const [activeView, setActiveView] = useState('scan');
  const [loading, setLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const handleDetect = useCallback(async (imageFile, cropDetails) => {
    setLoading(true); setCurrentResult(null);
    try {
      const { source, data } = await detectDisease(imageFile, cropDetails);
      setCurrentResult(data);
      if (source === 'fallback') toast.warn(t.toastFallback);
      else toast.success(t.toastSuccess);
    } catch (err) {
      toast.error(err.message || t.toastAnalysisFailed);
    } finally { setLoading(false); }
  }, [t]);

  const loadHistory = useCallback(async () => {
    if (historyLoaded && history.length) return;
    setHistoryLoading(true);
    try {
      const res = await getDetectionHistory({ limit: 20 });
      setHistory(res.data.detections || []);
      setHistoryLoaded(true);
    } catch { toast.error(t.toastHistoryFailed); }
    finally { setHistoryLoading(false); }
  }, [historyLoaded, history.length, t]);

  const switchToHistory = () => { setActiveView('history'); loadHistory(); };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm(t.confirmDelete)) return;
    setDeleting(id);
    try {
      await deleteDetection(id);
      setHistory(prev => prev.filter(h => h._id !== id));
      if (selectedHistoryItem?._id === id) setSelectedHistoryItem(null);
      toast.success(t.toastDeleteSuccess);
    } catch { toast.error(t.toastDeleteFailed); }
    finally { setDeleting(null); }
  };

  return (
    <>
      <GlobalStyles />
      <div className="dd-root" style={{ padding: '0 0 60px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 20px 0' }}>

          {/* ── Hero Header ── */}
          <div className="dd-fade-up" style={{ marginBottom: 40, position: 'relative' }}>
            <LeafDeco size={200} style={{ top: -40, right: -10, opacity: 0.06 }} />
            <LeafDeco size={140} style={{ bottom: -20, left: -30, opacity: 0.04, transform: 'rotate(60deg)' }} />

            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div className="dd-chip">
                <div className="dd-chip-dot" />
                <span>{t.breadcrumbPlatform}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>›</span>
              <div className="dd-chip">
                <Microscope size={11} style={{ color: '#56b848' }} />
                <span>{t.breadcrumbLab}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="dd-heading" style={{
              fontSize: 42, fontWeight: 700, lineHeight: 1.15,
              color: '#ffffff', marginBottom: 10, letterSpacing: '-0.02em'
            }}>
              {t.heroTitle1}{' '}
              <span style={{
                background: 'linear-gradient(90deg, #56b848, #8dd86e)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>
                {t.heroTitle2}
              </span>
            </h1>

            <p style={{
              fontSize: 15, color: 'rgba(255,255,255,0.6)', maxWidth: 540,
              lineHeight: 1.6, margin: 0
            }}>
              {t.heroSubtitle}
            </p>
          </div>

          {/* ── View Switcher Bar ── */}
          <div className="dd-fade-up dd-fade-up-1" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 28, flexWrap: 'wrap', gap: 16
          }}>
            <div className="dd-glass" style={{ padding: 5, display: 'inline-flex', gap: 4 }}>
              <button
                className={`dd-tab-btn ${activeView === 'scan' ? 'active' : ''}`}
                onClick={() => setActiveView('scan')}
              >
                <Leaf size={14} />
                <span>{t.tabNewScan}</span>
              </button>
              <button
                className={`dd-tab-btn ${activeView === 'history' ? 'active' : ''}`}
                onClick={switchToHistory}
              >
                <History size={14} />
                <span>{t.tabHistory}</span>
                {history.length > 0 && (
                  <span style={{
                    background: 'rgba(255,255,255,0.2)', borderRadius: 99,
                    fontSize: 11, padding: '1px 7px', fontWeight: 700
                  }}>
                    {history.length}
                  </span>
                )}
              </button>
            </div>

            {activeView === 'history' && (
              <button
                className="dd-tab-btn"
                onClick={() => { setHistoryLoaded(false); loadHistory(); }}
                disabled={historyLoading}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.8)'
                }}
              >
                <RefreshCw size={13} className={historyLoading ? 'animate-spin' : ''} />
                <span>{t.btnRefresh}</span>
              </button>
            )}
          </div>

          {/* ── VIEW 1: SCAN MODE ── */}
          {activeView === 'scan' && (
            <div className="dd-fade-up dd-fade-up-2">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, alignItems: 'start' }}>

                {/* Left column: upload form & tips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Upload card */}
                  <div className="dd-glass" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12,
                        background: 'linear-gradient(135deg, #1e4d1a, #2e7a28)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(60,160,50,0.3)'
                      }}>
                        <Camera size={18} color="#86c564" />
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{t.uploadCardTitle}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{t.uploadCardSubtitle}</div>
                      </div>
                    </div>
                    <DiseaseUploadForm onSubmit={handleDetect} loading={loading} />
                  </div>

                  {/* Photo tips */}
                  <div className="dd-accent-card" style={{ padding: 22, position: 'relative', overflow: 'hidden' }}>
                    <LeafDeco size={100} style={{ top: -10, right: -10, opacity: 0.12 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                      <div style={{
                        background: 'rgba(134,197,100,0.15)', borderRadius: 8,
                        padding: '4px 10px', fontSize: 11, fontWeight: 700,
                        color: '#86c564', letterSpacing: '0.08em', textTransform: 'uppercase'
                      }}>
                        {t.tipsLabel}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {t.tips?.map((tip, i) => (
                        <div key={i} className="tip-item">
                          <div className="tip-dot" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column: result */}
                <div>
                  {loading && (
                    <div className="dd-glass" style={{
                      height: 320, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 16
                    }}>
                      <div style={{ position: 'relative' }}>
                        <div className="dd-spinner" />
                        <div style={{
                          position: 'absolute', inset: 0, display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Leaf size={18} color="#56b848" />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>
                          {t.loadingTitle}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
                          {t.loadingSubtitle}
                        </p>
                      </div>
                    </div>
                  )}

                  {!loading && currentResult && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="dd-section-title" style={{ margin: 0 }}>{t.resultSectionTitle}</span>
                        <button
                          onClick={() => setCurrentResult(null)}
                          style={{
                            background: 'none', border: 'none', color: '#86c564',
                            fontSize: 12, fontWeight: 600, cursor: 'pointer'
                          }}
                        >
                          + {t.btnNewScan}
                        </button>
                      </div>
                      <DiseaseResultCard detection={currentResult} />
                    </div>
                  )}

                  {!loading && !currentResult && (
                    <div className="dd-glass dd-empty" style={{ minHeight: 380 }}>
                      <div className="dd-empty-icon">
                        <Microscope size={28} color="rgba(134,197,100,0.5)" />
                      </div>
                      <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 6 }}>
                        {t.awaitingTitle}
                      </p>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', maxWidth: 280, lineHeight: 1.5 }}>
                        {t.awaitingSubtitle}
                      </p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ── VIEW 2: HISTORY MODE ── */}
          {activeView === 'history' && (
            <div className="dd-fade-up dd-fade-up-2" style={{
              display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr',
              gap: 28, alignItems: 'start'
            }}>

              {/* History list sidebar */}
              <div>
                <div className="dd-section-title">{t.historySectionTitle}</div>

                <div className="dd-glass" style={{ padding: 12, maxHeight: 600, overflowY: 'auto' }}>
                  {historyLoading && (
                    <div style={{ padding: '32px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                      <RefreshCw size={20} style={{ animation: 'dd-spin 0.8s linear infinite', margin: '0 auto 8px' }} />
                      <span>{t.loadingTitle}</span>
                    </div>
                  )}

                  {!historyLoading && history.length === 0 && (
                    <div className="dd-empty" style={{ padding: '32px 16px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600, fontSize: 14 }}>{t.historyEmptyTitle}</p>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 4 }}>{t.historyEmptySub}</p>
                    </div>
                  )}

                  {!historyLoading && history.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {history.map((item) => {
                        const diseaseName = item.detection?.diseaseName || item.top_diagnosis?.disease || item.diseaseName || item.cropDetails?.cropType || item.cropType || 'Disease Diagnosis';
                        const cropName = item.cropDetails?.cropType || item.cropType || 'Crop';

                        return (
                          <div
                            key={item._id}
                            className={`dd-glass-card ${selectedHistoryItem?._id === item._id ? 'active' : ''}`}
                            onClick={() => setSelectedHistoryItem(item)}
                            style={{ padding: '12px 14px', cursor: 'pointer' }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflow: 'hidden' }}>
                                <div style={{
                                  fontWeight: 700, fontSize: 13, color: '#ffffff',
                                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                }}>
                                  {diseaseName}
                                </div>
                                <div style={{ fontSize: 11, color: '#86c564', display: 'flex', alignItems: 'center', gap: 6 }}>
                                  <span>{cropName}</span>
                                  <span>•</span>
                                  <span>{new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <button
                                  className="dd-delete-btn"
                                  onClick={(e) => handleDelete(item._id, e)}
                                  disabled={deleting === item._id}
                                  title={t.tooltipDelete}
                                >
                                  {deleting === item._id
                                    ? <RefreshCw size={13} style={{ animation: 'dd-spin 0.8s linear infinite' }} />
                                    : <Trash2 size={13} />
                                  }
                                </button>
                                <ChevronRight size={15} color="rgba(255,255,255,0.2)" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Detail pane */}
              <div>
                <div className="dd-section-title">{t.detailSectionTitle}</div>
                {selectedHistoryItem ? (
                  <DiseaseResultCard detection={selectedHistoryItem} />
                ) : (
                  <div className="dd-glass dd-empty" style={{ minHeight: 320 }}>
                    <div className="dd-empty-icon">
                      <AlertCircle size={28} color="rgba(134,197,100,0.4)" />
                    </div>
                    <p style={{ fontWeight: 600, color: 'rgba(255,255,255,0.4)', fontSize: 15, marginBottom: 6 }}>
                      {t.detailEmptyTitle}
                    </p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)', maxWidth: 260, lineHeight: 1.5 }}>
                      {t.detailEmptySub}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default DiseaseDetection;