// src/pages/Offline.jsx
// ─────────────────────────────────────────────────────────────
//  Main Offline Hub — shown automatically when backend is down
// ─────────────────────────────────────────────────────────────
import { useState } from "react";
import ChatBot        from "./offline/ChatBot";
import DiagnosisTree  from "./offline/DiagnosisTree";
import Calculators    from "./offline/Calculators";
import CropCalendar   from "./offline/CropCalendar";
import EmergencyGuide from "./offline/EmergencyGuide";
import { LANG_LABELS } from "../data/offlineKnowledge";

const TABS = [
  { id: "chat",      icon: "💬", en: "Ask",       hi: "पूछें",    bn: "জিজ্ঞেস" },
  { id: "diagnose",  icon: "🩺", en: "Diagnose",  hi: "निदान",    bn: "নির্ণয়" },
  { id: "calc",      icon: "🧮", en: "Calculate", hi: "गणना",     bn: "হিসাব" },
  { id: "calendar",  icon: "📅", en: "Calendar",  hi: "कैलेंडर",  bn: "ক্যালেন্ডার" },
  { id: "emergency", icon: "🚨", en: "Emergency", hi: "आपात",     bn: "জরুরি" },
];

const UI_TEXT = {
  offlineBadge: { en: "● Offline Mode", hi: "● ऑफलाइन मोड", bn: "● অফলাইন মোড" },
  title:        { en: "AgriSathi Lite", hi: "कृषि साथी लाइट", bn: "কৃষি সাথী লাইট" },
  subtitle:     { en: "Your farming guide — no internet needed",
                  hi: "आपका कृषि मार्गदर्शक — बिना इंटरनेट",
                  bn: "আপনার কৃষি গাইড — ইন্টারনেট ছাড়াই" },
  retrying:     { en: "Checking connection…", hi: "कनेक्शन जांच रहे हैं…", bn: "সংযোগ পরীক্ষা করা হচ্ছে…" },
  retry:        { en: "↻ Retry Connection", hi: "↻ कनेक्शन पुनः प्रयास", bn: "↻ সংযোগ পুনরায় চেষ্টা করুন" },
  backOnline:   { en: "✅ Back online! Redirecting…", hi: "✅ वापस ऑनलाइन! पुनर्निर्देशित…", bn: "✅ আবার অনলাইন! পুনর্নির্দেশিত…" },
};

// Injected global styles for neon wave animations
const NeonStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap');

    :root {
      --neon-primary:   #00ff88;
      --neon-mid:       #00e676;
      --neon-dim:       #00c853;
      --neon-glow:      #00ff8866;
      --neon-faint:     #00ff881a;
      --bg-deep:        #020d07;
      --bg-mid:         #041a0d;
      --bg-card:        #071f10;
      --border-glow:    #00ff8830;
      --text-bright:    #e0fff0;
      --text-mid:       #90c8a8;
      --text-dim:       #4a7a5e;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .agri-root {
      min-height: 100svh;
      display: flex;
      flex-direction: column;
      background: var(--bg-deep);
      font-family: 'Rajdhani', 'Noto Sans Devanagari', sans-serif;
      position: relative;
      overflow: hidden;
      color: var(--text-bright);
    }

    /* ── WAVE CANVAS BG ─────────────────────────────── */
    .wave-bg {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .wave-layer {
      position: absolute;
      bottom: -10%;
      left: -10%;
      width: 120%;
      height: 70%;
      border-radius: 60% 60% 0 0 / 40% 40% 0 0;
      opacity: 0.06;
      transform-origin: center bottom;
    }

    .wave-layer-1 {
      background: radial-gradient(ellipse at 50% 100%, var(--neon-primary) 0%, transparent 70%);
      animation: wavePulse1 6s ease-in-out infinite;
    }
    .wave-layer-2 {
      background: radial-gradient(ellipse at 40% 100%, var(--neon-mid) 0%, transparent 60%);
      animation: wavePulse2 8s ease-in-out infinite;
      opacity: 0.04;
    }
    .wave-layer-3 {
      background: radial-gradient(ellipse at 60% 100%, var(--neon-primary) 0%, transparent 55%);
      animation: wavePulse3 10s ease-in-out infinite;
      opacity: 0.035;
      bottom: -5%;
    }

    /* SVG sine waves */
    .svg-waves {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40%;
      opacity: 0.18;
    }
    .svg-wave-path-1 { animation: svgWave1 7s linear infinite; }
    .svg-wave-path-2 { animation: svgWave2 9s linear infinite reverse; opacity: 0.6; }
    .svg-wave-path-3 { animation: svgWave3 5s linear infinite; opacity: 0.4; }

    /* Grid overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(var(--border-glow) 1px, transparent 1px),
        linear-gradient(90deg, var(--border-glow) 1px, transparent 1px);
      background-size: 40px 40px;
      opacity: 0.3;
    }

    /* Floating orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }
    .orb-1 {
      width: 300px; height: 300px;
      background: var(--neon-primary);
      top: -80px; left: -80px;
      opacity: 0.06;
      animation: orbFloat1 12s ease-in-out infinite;
    }
    .orb-2 {
      width: 250px; height: 250px;
      background: var(--neon-mid);
      bottom: 60px; right: -60px;
      opacity: 0.07;
      animation: orbFloat2 15s ease-in-out infinite;
    }
    .orb-3 {
      width: 180px; height: 180px;
      background: var(--neon-dim);
      top: 40%; left: 50%;
      opacity: 0.04;
      animation: orbFloat3 10s ease-in-out infinite;
    }

    /* ── ANIMATIONS ─────────────────────────────────── */
    @keyframes wavePulse1 {
      0%,100% { transform: scaleY(1) scaleX(1); }
      50%      { transform: scaleY(1.15) scaleX(1.03); }
    }
    @keyframes wavePulse2 {
      0%,100% { transform: scaleY(1) translateX(0); }
      50%      { transform: scaleY(1.2) translateX(-3%); }
    }
    @keyframes wavePulse3 {
      0%,100% { transform: scaleY(1) translateX(0); }
      50%      { transform: scaleY(1.1) translateX(4%); }
    }
    @keyframes svgWave1 {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes svgWave2 {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes svgWave3 {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes orbFloat1 {
      0%,100% { transform: translate(0, 0); }
      50%      { transform: translate(30px, 20px); }
    }
    @keyframes orbFloat2 {
      0%,100% { transform: translate(0, 0); }
      50%      { transform: translate(-20px, -30px); }
    }
    @keyframes orbFloat3 {
      0%,100% { transform: translate(-50%, 0); }
      50%      { transform: translate(-50%, -25px); }
    }
    @keyframes neonPulse {
      0%,100% { text-shadow: 0 0 10px var(--neon-primary), 0 0 20px var(--neon-primary); }
      50%      { text-shadow: 0 0 20px var(--neon-primary), 0 0 40px var(--neon-primary), 0 0 60px var(--neon-glow); }
    }
    @keyframes scanline {
      0%   { top: -4px; }
      100% { top: 100%; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* ── TOP BAR ─────────────────────────────────────── */
    .top-bar {
      position: relative;
      z-index: 10;
      background: linear-gradient(180deg, #000d05ee 0%, #011208dd 100%);
      border-bottom: 1px solid var(--border-glow);
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      backdrop-filter: blur(12px);
      overflow: hidden;
    }

    .top-bar::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon-primary), transparent);
      animation: shimmer 3s linear infinite;
      background-size: 200% auto;
    }

    .logo-icon {
      width: 42px; height: 42px;
      border-radius: 50%;
      border: 2px solid var(--neon-primary);
      box-shadow: 0 0 14px var(--neon-glow);
      overflow: hidden;
      flex-shrink: 0;
      object-fit: cover;
      display: block;
    }

    .logo-title {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--neon-primary);
      animation: neonPulse 3s ease-in-out infinite;
      line-height: 1.2;
    }

    .logo-subtitle {
      font-size: 10px;
      color: var(--text-dim);
      letter-spacing: 0.5px;
      font-weight: 500;
    }

    /* ── LANGUAGE SWITCHER ─────────────────────────── */
    .lang-btn {
      font-size: 11px;
      padding: 5px 10px;
      border-radius: 8px;
      font-weight: 600;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-dim);
      cursor: pointer;
      transition: all 0.2s;
      letter-spacing: 0.3px;
    }
    .lang-btn:hover {
      background: var(--neon-faint);
      color: var(--neon-primary);
    }
    .lang-btn.active {
      background: var(--neon-faint);
      border-color: var(--neon-primary);
      color: var(--neon-primary);
      box-shadow: 0 0 8px var(--neon-glow);
    }

    /* ── STATUS BANNER ──────────────────────────────── */
    .status-banner {
      position: relative;
      z-index: 10;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border-glow);
      background: #011a0acc;
      transition: all 0.4s;
    }
    .status-banner.back-online {
      background: #003a1aaa;
      border-color: var(--neon-mid);
    }

    .offline-dot {
      display: inline-block;
      width: 7px; height: 7px;
      border-radius: 50%;
      background: #ffb300;
      box-shadow: 0 0 8px #ffb300;
      margin-right: 6px;
      animation: dotBlink 1.5s ease-in-out infinite;
    }
    @keyframes dotBlink {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.3; }
    }

    .retry-btn {
      font-size: 11px;
      padding: 5px 12px;
      border-radius: 8px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border: 1px solid #ffb30060;
      background: #1a0f0022;
      color: #ffb300;
      cursor: pointer;
      transition: all 0.2s;
    }
    .retry-btn:hover:not(:disabled) {
      background: #ffb30020;
      box-shadow: 0 0 10px #ffb30040;
    }
    .retry-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* ── MAIN CONTENT ───────────────────────────────── */
    .main-content {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 5;
      min-height: 0;
    }

    .tab-panel {
      flex: 1;
      overflow-y: auto;
      min-height: 0;
      padding: 0;
      animation: fadeSlideUp 0.3s ease;
    }

    /* Custom scrollbar */
    .tab-panel::-webkit-scrollbar { width: 4px; }
    .tab-panel::-webkit-scrollbar-track { background: transparent; }
    .tab-panel::-webkit-scrollbar-thumb {
      background: var(--neon-dim);
      border-radius: 2px;
    }

    /* ── BOTTOM NAV ─────────────────────────────────── */
    .bottom-nav {
      position: relative;
      z-index: 10;
      background: linear-gradient(0deg, #000d05f5 0%, #011208ee 100%);
      border-top: 1px solid var(--border-glow);
      padding: 8px 8px 8px;
      backdrop-filter: blur(16px);
      overflow: hidden;
    }

    .bottom-nav::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon-primary), transparent);
    }

    .nav-tabs {
      display: flex;
      gap: 4px;
    }

    .nav-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 8px 4px;
      border-radius: 12px;
      border: 1px solid transparent;
      background: transparent;
      color: var(--text-dim);
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      overflow: hidden;
    }

    .nav-tab:hover {
      color: var(--neon-primary);
      background: var(--neon-faint);
    }

    .nav-tab.active {
      background: linear-gradient(135deg, #00ff8818, #00ff8808);
      border-color: var(--neon-primary);
      color: var(--neon-primary);
      box-shadow: 0 0 14px var(--neon-glow), inset 0 0 8px #00ff8810;
    }

    .nav-tab.active::before {
      content: '';
      position: absolute;
      bottom: 0; left: 20%; right: 20%;
      height: 2px;
      background: var(--neon-primary);
      border-radius: 1px;
      box-shadow: 0 0 8px var(--neon-primary);
    }

    /* Scanline on active tab */
    .nav-tab.active::after {
      content: '';
      position: absolute;
      left: 0; right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--neon-glow), transparent);
      animation: scanline 2.5s linear infinite;
    }

    .tab-icon { font-size: 18px; line-height: 1; }
    .tab-label { font-size: 10px; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; line-height: 1; }
  `}</style>
);

// Animated SVG wave paths
function WaveBackground() {
  const w = "200%";
  const h = "100%";
  const wave1 = "M0,80 C150,20 350,140 500,80 C650,20 850,140 1000,80 C1150,20 1350,140 1500,80 C1650,20 1850,140 2000,80 L2000,200 L0,200 Z";
  const wave2 = "M0,100 C120,50 280,150 440,100 C600,50 760,150 920,100 C1080,50 1240,150 1400,100 C1560,50 1720,150 1880,100 C1940,75 1970,87 2000,100 L2000,200 L0,200 Z";
  const wave3 = "M0,120 C100,80 200,160 360,120 C520,80 640,160 800,120 C960,80 1080,160 1240,120 C1400,80 1520,160 1680,120 C1760,100 1880,130 2000,120 L2000,200 L0,200 Z";

  return (
    <div className="wave-bg">
      <div className="grid-overlay" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="wave-layer wave-layer-1" />
      <div className="wave-layer wave-layer-2" />
      <div className="wave-layer wave-layer-3" />
      <svg className="svg-waves" viewBox="0 0 2000 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path className="svg-wave-path-1" d={wave1} fill="none" stroke="#00ff88" strokeWidth="1.5" />
        <path className="svg-wave-path-2" d={wave2} fill="none" stroke="#00e676" strokeWidth="1" />
        <path className="svg-wave-path-3" d={wave3} fill="none" stroke="#00ff88" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

export default function Offline({ onRetry, isRetrying, isBackOnline }) {
  const [lang, setLang] = useState("en");
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="agri-root">
      <NeonStyles />
      <WaveBackground />

      {/* ── TOP BAR ───────────────────────────────────── */}
      <div className="top-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/assets/images/logo.jpeg"
            alt="AgriSathi"
            className="logo-icon"
          />
          <div>
            <p className="logo-title">{UI_TEXT.title[lang]}</p>
            <p className="logo-subtitle">{UI_TEXT.subtitle[lang]}</p>
          </div>
        </div>

        {/* Language switcher */}
        <div style={{ display: "flex", gap: 4 }}>
          {Object.entries(LANG_LABELS).map(([key, val]) => (
            <button key={key} onClick={() => setLang(key)}
              className={`lang-btn ${lang === key ? "active" : ""}`}>
              {val.flag} {val.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATUS BANNER ─────────────────────────────── */}
      <div className={`status-banner ${isBackOnline ? "back-online" : ""}`}>
        <span style={{ display: "flex", alignItems: "center", color: isBackOnline ? "#00ff88" : "#ffb300" }}>
          {!isBackOnline && <span className="offline-dot" />}
          {isBackOnline ? UI_TEXT.backOnline[lang] : UI_TEXT.offlineBadge[lang]}
        </span>
        {!isBackOnline && (
          <button onClick={onRetry} disabled={isRetrying} className="retry-btn">
            {isRetrying ? UI_TEXT.retrying[lang] : UI_TEXT.retry[lang]}
          </button>
        )}
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <div className="main-content">
        <div className="tab-panel">
          {activeTab === "chat"      && <ChatBot        lang={lang} />}
          {activeTab === "diagnose"  && <DiagnosisTree  lang={lang} />}
          {activeTab === "calc"      && <Calculators    lang={lang} />}
          {activeTab === "calendar"  && <CropCalendar   lang={lang} />}
          {activeTab === "emergency" && <EmergencyGuide lang={lang} />}
        </div>
      </div>

      {/* ── BOTTOM NAV ────────────────────────────────── */}
      <div className="bottom-nav">
        <div className="nav-tabs">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}>
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab[lang] || tab.en}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}