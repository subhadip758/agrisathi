import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, Droplets, Wind, Thermometer, Gauge, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import weatherTranslations from "../i18n/weather";
import WeatherAdvisoryCard from "../components/weather/WeatherAdvisoryCard";
import FloatingChatButton from '../components/chatbot/Floatingchatbutton';
import weatherService from '../services/weatherService';

/* ═══════════════════════════════════════════════════════════ STYLES ══ */
const WA_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap');

  :root {
    --void:    #060C14;
    --abyss:   #0A1628;
    --deep:    #0F2040;
    --ocean:   #1A3A5C;
    --storm:   #1E4D72;
    --cyan:    #00D4FF;
    --ice:     #7DE8FF;
    --frost:   #B8F0FF;
    --glass:   rgba(255,255,255,0.06);
    --glass2:  rgba(255,255,255,0.10);
    --border:  rgba(0,212,255,0.15);
    --border2: rgba(0,212,255,0.30);
    --warn:    #FF6B35;
    --ok:      #44D688;
    --text:    #E8F4FF;
    --muted:   rgba(232,244,255,0.45);
    --dim:     rgba(232,244,255,0.22);
  }

  .wa-root {
    font-family: 'Syne', sans-serif;
    background: var(--void);
    min-height: 100vh;
    color: var(--text);
    position: relative;
    overflow-x: hidden;
  }

  /* ── ANIMATED SKY BACKGROUND ── */
  .wa-sky {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(26,58,92,.9) 0%, var(--void) 70%);
  }
  .wa-sky::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(circle 300px at 20% 30%, rgba(0,212,255,.05) 0%, transparent 70%),
      radial-gradient(circle 200px at 80% 60%, rgba(0,212,255,.04) 0%, transparent 70%);
    animation: wa-aurora 8s ease-in-out infinite alternate;
  }
  @keyframes wa-aurora {
    from { opacity: .6; transform: scale(1) }
    to   { opacity: 1;  transform: scale(1.05) }
  }

  /* Rain drops */
  .wa-rain { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden }
  .wa-drop {
    position: absolute; top: -20px;
    width: 1px; background: linear-gradient(to bottom, transparent, rgba(0,212,255,.25));
    border-radius: 1px; animation: wa-fall linear infinite;
  }
  @keyframes wa-fall {
    to { transform: translateY(110vh) }
  }

  /* Stars / particles */
  .wa-star {
    position: absolute; border-radius: 50%;
    background: rgba(0,212,255,.4);
    animation: wa-twinkle ease-in-out infinite alternate;
  }
  @keyframes wa-twinkle {
    from { opacity: .15; transform: scale(.8) }
    to   { opacity: .7;  transform: scale(1.2) }
  }

  /* ── GENERAL ── */
  .wa-page { position: relative; z-index: 1; max-width: 1280px; margin: 0 auto; padding: 36px 24px 80px }

  /* ── HEADER ── */
  .wa-header { margin-bottom: 36px; animation: wa-rise .7s ease both }
  @keyframes wa-rise { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }

  .wa-label {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase;
    color: var(--cyan); opacity: .8; margin-bottom: 10px;
  }
  .wa-label-dot {
    width: 6px; height: 6px; border-radius: 50%; background: var(--cyan);
    animation: wa-blink 1.5s ease-in-out infinite;
  }
  @keyframes wa-blink { 0%,100%{opacity:1} 50%{opacity:.2} }

  .wa-title {
    font-size: clamp(32px,5vw,54px); font-weight: 800;
    line-height: 1.1; letter-spacing: -1px;
    background: linear-gradient(135deg, #fff 30%, var(--ice));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .wa-sub { font-size: 15px; color: var(--muted); margin-top: 8px; font-weight: 400 }

  /* ── LOCATION STATUS BAR ── */
  .wa-loc-banner {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 12px 18px; border-radius: 14px; margin-top: 20px;
    background: rgba(0,212,255,0.06); border: 1px solid var(--border);
    font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; color: var(--ice);
    backdrop-filter: blur(10px); flex-wrap: wrap;
  }
  .wa-loc-banner.denied {
    background: rgba(255,107,53,0.1); border-color: rgba(255,107,53,0.3); color: #FF9A72;
  }
  .wa-loc-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border2);
    background: rgba(0,212,255,0.12); color: #fff; cursor: pointer;
    font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600;
    transition: all 0.2s ease;
  }
  .wa-loc-btn:hover { background: rgba(0,212,255,0.25); transform: translateY(-1px); }

  /* ── SEARCH ── */
  .wa-search-form { display: flex; gap: 10px; max-width: 480px; margin-top: 18px }
  .wa-search-wrap { position: relative; flex: 1 }
  .wa-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--cyan); opacity: .6; width: 17px; height: 17px }
  .wa-search-input {
    width: 100%; padding: 14px 18px 14px 46px;
    background: var(--glass); backdrop-filter: blur(12px);
    border: 1.5px solid var(--border2); border-radius: 14px;
    font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--text);
    outline: none; transition: border-color .2s, box-shadow .2s;
  }
  .wa-search-input::placeholder { color: var(--dim) }
  .wa-search-input:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,212,255,.12), 0 0 20px rgba(0,212,255,.08) }

  .wa-search-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 14px 22px; border-radius: 14px; border: none; cursor: pointer;
    background: linear-gradient(135deg, var(--storm), var(--ocean));
    border: 1.5px solid var(--border2);
    color: var(--cyan); font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700; transition: all .22s;
    box-shadow: 0 4px 20px rgba(0,212,255,.12);
  }
  .wa-search-btn:hover { background: linear-gradient(135deg,var(--ocean),var(--storm)); box-shadow: 0 4px 28px rgba(0,212,255,.25); transform: translateY(-1px) }
  .wa-search-btn:disabled { opacity: .4; cursor: not-allowed; transform: none }

  .wa-error {
    margin-top: 14px; padding: 12px 16px; font-size: 13px;
    background: rgba(255,107,53,.1); border: 1px solid rgba(255,107,53,.3);
    border-radius: 10px; color: #FF9A72;
    font-family: 'IBM Plex Mono', monospace;
  }

  /* ── LOADER ── */
  .wa-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 0; gap: 20px }
  .wa-spinner {
    width: 56px; height: 56px; border-radius: 50%;
    border: 2px solid rgba(0,212,255,.1);
    border-top-color: var(--cyan);
    animation: wa-spin 1s linear infinite;
  }
  @keyframes wa-spin { to { transform: rotate(360deg) } }
  .wa-loader-text { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--muted); letter-spacing: 1px }

  /* ── GLASS PANEL ── */
  .wa-panel {
    background: var(--glass); backdrop-filter: blur(20px);
    border: 1px solid var(--border); border-radius: 22px;
    overflow: hidden; transition: border-color .3s;
  }
  .wa-panel:hover { border-color: var(--border2) }

  /* ── HERO WEATHER ── */
  .wa-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px }
  @media(max-width:768px) { .wa-hero-grid { grid-template-columns: 1fr } }

  .wa-current {
    padding: 32px 32px 28px;
    background: linear-gradient(135deg, rgba(26,58,92,.6) 0%, rgba(15,32,64,.8) 100%);
    border: 1px solid var(--border2); border-radius: 22px;
    position: relative; overflow: hidden;
    animation: wa-rise .6s .05s ease both;
  }
  .wa-current::before {
    content: '';
    position: absolute; top: -60px; right: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,255,.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .wa-city-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap }
  .wa-city { font-size: 22px; font-weight: 800; color: #fff }
  .wa-city-pin { color: var(--cyan); opacity: .9 }

  .wa-condition-row {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px; color: var(--cyan); opacity: .7;
    letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 24px;
  }

  .wa-temp-block { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px }
  .wa-emoji-big {
    font-size: 72px; line-height: 1;
    animation: wa-float 4s ease-in-out infinite;
    filter: drop-shadow(0 0 20px rgba(0,212,255,.3));
  }
  @keyframes wa-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

  .wa-temp-big {
    font-size: 84px; font-weight: 800; line-height: 1;
    font-family: 'IBM Plex Mono', monospace;
    background: linear-gradient(180deg, #fff 40%, var(--ice));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .wa-temp-unit { font-size: 28px; font-weight: 400; margin-top: 12px; color: var(--muted) }

  /* ── STAT RING GAUGES ── */
  .wa-gauges { display: grid; grid-template-columns: 1fr 1fr; gap: 12px }

  .wa-gauge-card {
    background: rgba(255,255,255,.04); border: 1px solid var(--border);
    border-radius: 16px; padding: 16px 18px;
    display: flex; align-items: center; gap: 14px;
    transition: all .25s;
  }
  .wa-gauge-card:hover { background: rgba(0,212,255,.06); border-color: var(--border2) }

  .wa-ring-wrap { position: relative; width: 52px; height: 52px; flex-shrink: 0 }
  .wa-ring-svg { width: 52px; height: 52px; transform: rotate(-90deg) }
  .wa-ring-bg { fill: none; stroke: rgba(255,255,255,.08); stroke-width: 4 }
  .wa-ring-fill { fill: none; stroke-width: 4; stroke-linecap: round; transition: stroke-dashoffset 1s ease }
  .wa-ring-icon {
    position: absolute; inset: 0; display: flex;
    align-items: center; justify-content: center;
  }
  .wa-ring-icon svg { width: 18px; height: 18px }

  .wa-gauge-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 3px }
  .wa-gauge-value { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; color: #fff }
  .wa-gauge-unit  { font-size: 11px; color: var(--muted); font-weight: 400 }

  /* ── MAP PANEL ── */
  .wa-map-panel {
    background: var(--glass); backdrop-filter: blur(20px);
    border: 1px solid var(--border2); border-radius: 22px;
    overflow: hidden; display: flex; flex-direction: column;
    animation: wa-rise .6s .1s ease both;
  }
  .wa-map-header { padding: 20px 24px 16px; display: flex; align-items: center; gap: 10px }
  .wa-map-title { font-size: 16px; font-weight: 700; color: var(--text) }
  .wa-map-coords {
    margin-left: auto; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; color: var(--cyan); opacity: .6;
  }
  .wa-map-frame { flex: 1; min-height: 260px; position: relative }
  .wa-map-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; filter: hue-rotate(180deg) invert(.9) saturate(0.6) }
  .wa-map-frame::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 80%, var(--void) 100%);
    pointer-events: none;
  }

  /* ── STRIP HEADERS ── */
  .wa-strip-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .wa-strip-title {
    font-size: 16px; font-weight: 700; color: var(--text);
    display: flex; align-items: center; gap: 8px;
  }
  .wa-strip-badge {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase;
    padding: 3px 8px; border-radius: 6px; background: rgba(0,212,255,0.12);
    color: var(--cyan); border: 1px solid var(--border);
  }

  /* ── FORECAST / HISTORY STRIP ── */
  .wa-forecast { padding: 28px; animation: wa-rise .6s .15s ease both }

  .wa-forecast-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 12px }
  .wa-forecast-grid-7 { display: grid; grid-template-columns: repeat(7,1fr); gap: 10px }
  @media(max-width:900px) { .wa-forecast-grid-7 { grid-template-columns: repeat(4,1fr) } }
  @media(max-width:640px) { 
    .wa-forecast-grid { grid-template-columns: repeat(2,1fr) }
    .wa-forecast-grid-7 { grid-template-columns: repeat(2,1fr) }
  }

  .wa-day-card {
    background: rgba(255,255,255,.04); border: 1px solid var(--border);
    border-radius: 16px; padding: 16px 12px; text-align: center;
    transition: all .25s; cursor: default;
    animation: wa-rise .5s ease both;
  }
  .wa-day-card:hover { background: rgba(0,212,255,.07); border-color: var(--border2); transform: translateY(-3px) }
  .wa-day-name { font-family: 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--cyan); opacity: .8; margin-bottom: 6px }
  .wa-day-emoji { font-size: 34px; margin-bottom: 8px; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,.4)) }
  .wa-day-desc { font-size: 11px; color: var(--muted); margin-bottom: 10px; line-height: 1.3; min-height: 28px }
  .wa-day-temps { display: flex; align-items: center; justify-content: center; gap: 6px }
  .wa-day-max { font-family: 'IBM Plex Mono', monospace; font-size: 17px; font-weight: 600; color: #FF9A72 }
  .wa-day-sep { color: var(--dim) }
  .wa-day-min { font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--ice) }
  .wa-day-precip {
    display: flex; align-items: center; justify-content: center; gap: 4px;
    margin-top: 8px; font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; color: var(--cyan); opacity: .85;
  }

  /* ── AGRICULTURAL INSIGHTS ── */
  .wa-insights-panel {
    background: linear-gradient(135deg, rgba(26,58,92,.4) 0%, rgba(10,22,40,.8) 100%);
    border: 1px solid var(--border2); border-radius: 22px; padding: 28px; margin-bottom: 20px;
  }
  .wa-insights-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px }
  @media(max-width:768px) { .wa-insights-grid { grid-template-columns: 1fr } }

  .wa-insight-card {
    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
    border-radius: 16px; padding: 16px; display: flex; flex-direction: column; gap: 8px;
  }
  .wa-insight-head { display: flex; align-items: center; justify-content: space-between }
  .wa-insight-title { font-size: 13px; font-weight: 700; color: var(--text) }
  .wa-insight-badge {
    font-size: 11px; padding: 2px 8px; border-radius: 99px; font-family: 'IBM Plex Mono', monospace; font-weight: 600;
  }
  .wa-insight-badge.good { background: rgba(68,214,136,0.15); color: #44D688; border: 1px solid rgba(68,214,136,0.3); }
  .wa-insight-badge.warn { background: rgba(255,107,53,0.15); color: #FF9A72; border: 1px solid rgba(255,107,53,0.3); }

  /* ── TIPS ── */
  .wa-tips { padding: 28px; animation: wa-rise .6s .25s ease both }
  .wa-tips-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 20px; display: flex; align-items: center; gap: 10px }
  .wa-tips-title::after { content: ''; flex: 1; height: 1px; background: var(--border) }

  .wa-tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px }
  @media(max-width:640px) { .wa-tips-grid { grid-template-columns: 1fr } }

  .wa-tip-card {
    background: rgba(255,255,255,.04); border: 1px solid var(--border);
    border-radius: 16px; padding: 18px; transition: all .25s;
  }
  .wa-tip-card:hover { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.15); transform: translateY(-2px) }
  .wa-tip-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px }
  .wa-tip-emoji { font-size: 26px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.4)) }
  .wa-tip-label { font-size: 14px; font-weight: 700; color: var(--text) }
  .wa-tip-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px }
  .wa-tip-item { font-size: 13px; color: var(--muted); display: flex; gap: 8px; align-items: flex-start; line-height: 1.5 }
  .wa-tip-item::before { content: '›'; color: var(--cyan); opacity: .6; font-size: 16px; line-height: 1.2; flex-shrink: 0 }
`;

/* ═══════════════════════════════════════════════════════ RAIN CANVAS ══ */
const RainLayer = () => {
  const drops = Array.from({ length: 24 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    height: `${60 + Math.random() * 80}px`,
    delay: `${Math.random() * 4}s`,
    duration: `${1.2 + Math.random() * 1.6}s`,
    opacity: 0.15 + Math.random() * 0.2,
  }));
  const stars = Array.from({ length: 16 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 60}%`,
    size: `${1 + Math.random() * 2}px`,
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2}s`,
  }));
  return (
    <>
      <div className="wa-sky" />
      <div className="wa-rain">
        {stars.map((s, i) => (
          <div key={`s${i}`} className="wa-star" style={{ left: s.left, top: s.top, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.duration }} />
        ))}
        {drops.map((d, i) => (
          <div key={i} className="wa-drop" style={{ left: d.left, height: d.height, animationDelay: d.delay, animationDuration: d.duration, opacity: d.opacity }} />
        ))}
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════ RING GAUGE ══ */
const RingGauge = ({ value, max, color, icon: Icon, label, unit }) => {
  const r = 20, circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div className="wa-gauge-card">
      <div className="wa-ring-wrap">
        <svg className="wa-ring-svg" viewBox="0 0 52 52">
          <circle className="wa-ring-bg" cx="26" cy="26" r={r} />
          <circle
            className="wa-ring-fill"
            cx="26" cy="26" r={r}
            stroke={color}
            strokeDasharray={circ}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="wa-ring-icon">
          <Icon style={{ color }} />
        </div>
      </div>
      <div>
        <div className="wa-gauge-label">{label}</div>
        <div className="wa-gauge-value">{value}<span className="wa-gauge-unit"> {unit}</span></div>
      </div>
    </div>
  );
};

/* ═════════════════════════════════════════════════════════ MAIN ══════ */
const WeatherAdvisory = () => {
  const [weather, setWeather]                 = useState(null);
  const [history, setHistory]                 = useState([]);
  const [forecast, setForecast]               = useState([]);
  const [insights, setInsights]               = useState(null);
  const [advisories, setAdvisories]           = useState([]);
  const [locationInfo, setLocationInfo]       = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [searchCity, setSearchCity]           = useState('');
  const [coordinates, setCoordinates]         = useState({ lat: 22.7243, lon: 88.4754 });
  const [error, setError]                     = useState(null);
  const [locStatus, setLocStatus]             = useState('detecting'); // 'detecting' | 'granted' | 'denied' | 'error'
  const [locMessage, setLocMessage]           = useState('Detecting farm GPS location...');

  const { language } = useLanguage();
  const t = weatherTranslations[language] || weatherTranslations.en;

  const getWeatherEmoji = (code) => {
    if (code === 0 || code === 1) return '☀️';
    if (code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  };

  /* ── Load Full Weather Context ── */
  const loadWeatherContext = useCallback(async (lat, lon, city = null) => {
    try {
      setLoading(true);
      setError(null);
      const res = await weatherService.getWeatherContext(lat, lon, city);
      const d = res?.data || res || {};

      if (d) {
        setLocationInfo(d.location || { formattedName: city || 'Barasat, North 24 Parganas, West Bengal', coordinates: { lat: lat || 22.7243, lon: lon || 88.4754 } });
        setCoordinates(d.location?.coordinates || { lat: lat || 22.7243, lon: lon || 88.4754 });
        setWeather(d.current || d.weather || {});
        setHistory(d.history || []);
        setForecast(d.forecast || d.dailyForecast || []);
        setInsights(d.agriculturalInsights || {});
        setAdvisories(d.agriculturalInsights?.alerts || d.advisories || []);
      }
    } catch (err) {
      console.error('Weather load error:', err);
      setError('Unable to retrieve weather intelligence. Displaying default advisory.');
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── GPS Geolocation Request ── */
  const requestLocation = useCallback(() => {
    setLocStatus('detecting');
    setLocMessage('Requesting GPS location permission...');

    if (!navigator.geolocation) {
      setLocStatus('denied');
      setLocMessage('Geolocation is not supported by your browser. Using fallback location.');
      loadWeatherContext(22.7243, 88.4754, 'Barasat');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocStatus('granted');
        setLocMessage('GPS location detected successfully.');
        loadWeatherContext(latitude, longitude);
      },
      (err) => {
        setLocStatus('denied');
        if (err.code === err.PERMISSION_DENIED) {
          setLocMessage('Location permission denied. Please allow GPS access or search city manually.');
        } else if (err.code === err.TIMEOUT) {
          setLocMessage('Location request timed out. Using fallback location.');
        } else {
          setLocMessage('Unable to detect precise GPS position. Using default location.');
        }
        loadWeatherContext(22.7243, 88.4754, 'Barasat');
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
    );
  }, [loadWeatherContext]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      loadWeatherContext(null, null, searchCity.trim());
    }
  };

  return (
    <>
      <style>{WA_STYLES}</style>
      <div className="wa-root">
        <RainLayer />

        <div className="wa-page">
          {/* ── HEADER ── */}
          <div className="wa-header">
            <div className="wa-label">
              <span className="wa-label-dot" />
              AgriSathi · Location-First Weather Intelligence
            </div>
            <h1 className="wa-title">{t.title || 'Weather Advisory'}</h1>
            <p className="wa-sub">{t.subtitle || 'Real-time forecasts & farming advisories for your exact location'}</p>

            {/* Geolocation status banner */}
            <div className={`wa-loc-banner${locStatus === 'denied' ? ' denied' : ''}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {locStatus === 'detecting' && <RefreshCw size={14} style={{ animation: 'wa-spin 1s linear infinite' }} />}
                {locStatus === 'granted' && <CheckCircle size={14} color="#44D688" />}
                {locStatus === 'denied' && <AlertTriangle size={14} color="#FF9A72" />}
                <span>{locMessage}</span>
              </div>
              {locStatus === 'denied' && (
                <button className="wa-loc-btn" onClick={requestLocation}>
                  <RefreshCw size={12} />
                  Retry GPS
                </button>
              )}
            </div>

            {/* Search form fallback */}
            <form className="wa-search-form" onSubmit={handleSearch}>
              <div className="wa-search-wrap">
                <MapPin className="wa-search-icon" />
                <input
                  className="wa-search-input"
                  type="text"
                  value={searchCity}
                  onChange={e => setSearchCity(e.target.value)}
                  placeholder={t.searchPlaceholder || 'Search city / district...'}
                />
              </div>
              <button className="wa-search-btn" type="submit" disabled={loading}>
                <Search size={16} />
                {t.searchButton || 'Search'}
              </button>
            </form>

            {error && <div className="wa-error">⚠ {error}</div>}
          </div>

          {/* ── LOADER ── */}
          {loading && (
            <div className="wa-loader">
              <div className="wa-spinner" />
              <div className="wa-loader-text">{t.loading || 'Fetching weather intelligence...'}</div>
            </div>
          )}

          {/* ── CONTENT ── */}
          {!loading && weather && (
            <>
              {/* HERO ROW */}
              <div className="wa-hero-grid">
                {/* Current Weather Card */}
                <div className="wa-current">
                  <div className="wa-city-row">
                    <MapPin className="wa-city-pin" size={18} />
                    <span className="wa-city">
                      {locationInfo?.village || locationInfo?.district || 'Detected Farm'}
                    </span>
                    {locationInfo?.district && (
                      <span style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 400 }}>
                        ({locationInfo.district}, {locationInfo.state})
                      </span>
                    )}
                  </div>
                  <div className="wa-condition-row">
                    {weather.description} &nbsp;·&nbsp; Live GPS Weather
                  </div>

                  <div className="wa-temp-block">
                    <span className="wa-emoji-big">{getWeatherEmoji(weather.weatherCode || 0)}</span>
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <span className="wa-temp-big">{weather.temperature}</span>
                      <span className="wa-temp-unit">°C</span>
                    </div>
                  </div>

                  {/* Ring Gauges */}
                  <div className="wa-gauges">
                    <RingGauge
                      value={weather.humidity} max={100}
                      color="#00D4FF" icon={Droplets}
                      label={t.current?.humidity || 'Humidity'} unit="%"
                    />
                    <RingGauge
                      value={weather.windSpeed} max={120}
                      color="#44D688" icon={Wind}
                      label={t.current?.wind || 'Wind'} unit="km/h"
                    />
                    <RingGauge
                      value={weather.pressure} max={1060}
                      color="#FF9A72" icon={Gauge}
                      label={t.current?.pressure || 'Pressure'} unit="hPa"
                    />
                    <RingGauge
                      value={weather.feelsLike} max={50}
                      color="#FFD166" icon={Thermometer}
                      label={t.current?.temperature || 'Feels Like'} unit="°C"
                    />
                  </div>
                </div>

                {/* Map panel */}
                <div className="wa-map-panel">
                  <div className="wa-map-header">
                    <MapPin size={16} style={{ color: 'var(--cyan)' }} />
                    <span className="wa-map-title">{t.map?.title || 'Location Map'}</span>
                    <span className="wa-map-coords">
                      {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
                    </span>
                  </div>
                  <div className="wa-map-frame">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lon-0.08},${coordinates.lat-0.08},${coordinates.lon+0.08},${coordinates.lat+0.08}&layer=mapnik&marker=${coordinates.lat},${coordinates.lon}`}
                      title="Farm Location map"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* PREVIOUS 5 DAYS HISTORICAL WEATHER */}
              {history.length > 0 && (
                <div className="wa-panel wa-forecast" style={{ marginBottom: 20 }}>
                  <div className="wa-strip-header">
                    <div className="wa-strip-title">
                      📅 Previous 5 Days Weather History
                    </div>
                    <span className="wa-strip-badge">Genuine Historical Data</span>
                  </div>
                  <div className="wa-forecast-grid">
                    {history.map((day, i) => (
                      <div key={i} className="wa-day-card" style={{ animationDelay: `${i * 0.08}s` }}>
                        <div className="wa-day-name">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                        </div>
                        <span className="wa-day-emoji">{getWeatherEmoji(day.weatherCode || 0)}</span>
                        <div className="wa-day-desc">{day.weather || 'Recorded'}</div>
                        <div className="wa-day-temps">
                          <span className="wa-day-max">{day.tempMax}°</span>
                          <span className="wa-day-sep">/</span>
                          <span className="wa-day-min">{day.tempMin}°</span>
                        </div>
                        <div className="wa-day-precip">
                          <Droplets size={10} />
                          {day.rainfall}mm
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* NEXT 7 DAYS FORECAST */}
              {forecast.length > 0 && (
                <div className="wa-panel wa-forecast" style={{ marginBottom: 20 }}>
                  <div className="wa-strip-header">
                    <div className="wa-strip-title">
                      🌤️ Next 7 Days Forecast
                    </div>
                    <span className="wa-strip-badge">Predictive Forecast</span>
                  </div>
                  <div className="wa-forecast-grid-7">
                    {forecast.slice(0, 7).map((day, i) => (
                      <div key={i} className="wa-day-card" style={{ animationDelay: `${i * 0.06}s` }}>
                        <div className="wa-day-name">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })}
                        </div>
                        <span className="wa-day-emoji">{getWeatherEmoji(day.weatherCode || 0)}</span>
                        <div className="wa-day-desc">{day.weather || 'Forecast'}</div>
                        <div className="wa-day-temps">
                          <span className="wa-day-max">{day.tempMax}°</span>
                          <span className="wa-day-sep">/</span>
                          <span className="wa-day-min">{day.tempMin}°</span>
                        </div>
                        <div className="wa-day-precip">
                          <Droplets size={10} />
                          {day.rainfall}mm ({day.precipitationProbability || 0}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AGRICULTURAL INTELLIGENCE SUMMARY */}
              {insights && (
                <div className="wa-insights-panel">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <ShieldAlert size={20} color="var(--cyan)" />
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>
                      Agricultural Operations Suitability
                    </span>
                  </div>
                  <div className="wa-insights-grid">
                    <div className="wa-insight-card">
                      <div className="wa-insight-head">
                        <span className="wa-insight-title">🚿 Spraying Suitability</span>
                        <span className={`wa-insight-badge ${insights.sprayingSuitability === 'favorable' ? 'good' : 'warn'}`}>
                          {insights.sprayingSuitability?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                        {insights.sprayingSuitability === 'favorable'
                          ? 'Low wind and zero rainfall render conditions optimal for foliar sprays.'
                          : 'Wind speed or rain risk may cause spray drift or wash-off.'}
                      </span>
                    </div>

                    <div className="wa-insight-card">
                      <div className="wa-insight-head">
                        <span className="wa-insight-title">🌾 Harvesting Suitability</span>
                        <span className={`wa-insight-badge ${insights.harvestingSuitability === 'favorable' ? 'good' : 'warn'}`}>
                          {insights.harvestingSuitability?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                        {insights.harvestingSuitability === 'favorable'
                          ? 'Dry foliage and low precipitation favor harvesting and grain drying.'
                          : 'High humidity or rain risk could damage harvested produce.'}
                      </span>
                    </div>

                    <div className="wa-insight-card">
                      <div className="wa-insight-head">
                        <span className="wa-insight-title">💧 Irrigation Guidance</span>
                        <span className={`wa-insight-badge ${insights.irrigationNeeded === 'stop' || insights.irrigationNeeded === 'skip' ? 'warn' : 'good'}`}>
                          {insights.irrigationNeeded?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.4 }}>
                        {insights.irrigationNeeded === 'stop'
                          ? 'Stop irrigation immediately due to waterlogging risk or heavy rain.'
                          : insights.irrigationNeeded === 'skip'
                          ? 'Sufficient recent rain recorded. You may skip irrigation today.'
                          : 'Maintain standard moisture levels for active crop growth.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ADVISORIES CARD */}
              <div className="wa-advisories-wrap" style={{ marginBottom: 20 }}>
                <WeatherAdvisoryCard advisories={advisories} t={t} />
              </div>

              {/* FARMING TIPS */}
              <div className="wa-panel wa-tips">
                <div className="wa-tips-title">
                  {t.tips?.title || 'Farming Tips by Weather Condition'}
                </div>
                <div className="wa-tips-grid">
                  {[
                    { emoji: '☀️', label: t.tips?.sunny || 'Sunny Days',   tips: t.tips?.sunnyTips },
                    { emoji: '☁️', label: t.tips?.cloudy || 'Cloudy Days', tips: t.tips?.cloudyTips },
                    { emoji: '🌧️', label: t.tips?.rainy || 'Rainy Days',   tips: t.tips?.rainyTips },
                    { emoji: '🌡️', label: t.tips?.hot || 'Hot Weather',    tips: t.tips?.hotTips },
                  ].map(({ emoji, label, tips }) => (
                    <div key={label} className="wa-tip-card">
                      <div className="wa-tip-head">
                        <span className="wa-tip-emoji">{emoji}</span>
                        <span className="wa-tip-label">{label}</span>
                      </div>
                      <ul className="wa-tip-list">
                        {(tips || []).map((tip, i) => (
                          <li key={i} className="wa-tip-item">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <FloatingChatButton />
      </div>
    </>
  );
};

export default WeatherAdvisory;