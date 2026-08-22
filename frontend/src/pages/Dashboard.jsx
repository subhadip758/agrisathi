import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FloatingChatButton from '../components/chatbot/Floatingchatbutton';
import { useLanguage } from '../context/LanguageContext';
import landingTranslations from '../i18n/dashboard';

/* ─── Google Fonts inject (once) ──────────────────────────────────────── */
if (!document.getElementById('agrisathi-fonts')) {
  const l = document.createElement('link');
  l.id = 'agrisathi-fonts';
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Raleway:wght@300;400;500;600;700;800;900&display=swap';
  document.head.appendChild(l);
}

/* ─── Global CSS inject (once) ────────────────────────────────────────── */
const STYLE_ID = 'agrisathi-landing-css';
if (!document.getElementById(STYLE_ID)) {
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
    :root {
      --gd: #1a3d1f; --gm: #2d6a35; --gl: #4caf50;
      --gp: #e8f5e9; --gxp: #f2faf3;
      --gold: #f0c040; --goldd: #c9952a;
      --cream: #faf8f2; --border: #cde0c4;
      --td: #1a2614; --tm: #3d5228; --ts: #6b7c5a;
      --shadow: rgba(26,61,31,0.13);
    }

    .ag-page { font-family:'Raleway',sans-serif; color:var(--td); overflow-x:hidden; }

    .ag-reveal { opacity:0; transform:translateY(36px); transition: opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1); }
    .ag-reveal.ag-in { opacity:1; transform:translateY(0); }
    .ag-d1{transition-delay:.08s} .ag-d2{transition-delay:.16s}
    .ag-d3{transition-delay:.24s} .ag-d4{transition-delay:.32s}

    .ag-nav { position:sticky; top:0; z-index:50; background:#fff; border-bottom:1px solid var(--border); box-shadow:0 2px 16px rgba(0,0,0,.05); }
    .ag-nav-link { padding:8px 15px; font-size:13.5px; font-weight:600; color:var(--tm); text-decoration:none; border-radius:8px; transition:all .18s; }
    .ag-nav-link:hover,.ag-nav-link.active { background:var(--gp); color:var(--gd); }

    .ag-hero { min-height:88vh; background:linear-gradient(135deg,rgba(26,61,31,.94) 0%,rgba(45,106,53,.89) 55%,rgba(30,80,38,.93) 100%); position:relative; overflow:hidden; }
    .ag-hero::before { content:''; position:absolute; inset:0; background-image:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234caf50' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E"); }
    .ag-hero-deco { position:absolute; right:60px; bottom:-30px; font-size:320px; opacity:.05; pointer-events:none; user-select:none; }

    .ag-feature-card { background:#fff; border:1px solid var(--border); border-radius:18px; padding:28px 24px; transition:all .25s; cursor:default; position:relative; overflow:hidden; }
    .ag-feature-card::before { content:''; position:absolute; top:0;left:0;right:0; height:3px; background:linear-gradient(90deg,var(--gl),#a5d6a7); opacity:0; transition:opacity .25s; }
    .ag-feature-card:hover { box-shadow:0 12px 40px var(--shadow); transform:translateY(-4px); border-color:var(--gl); }
    .ag-feature-card:hover::before { opacity:1; }
    .ag-tcard { background:#fff; border:1px solid var(--border); border-radius:18px; padding:28px 24px; transition:all .2s; }
    .ag-tcard:hover { box-shadow:0 8px 30px var(--shadow); transform:translateY(-3px); }
    .ag-gov-card { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12); border-radius:16px; padding:26px 22px; transition:all .2s; }
    .ag-gov-card:hover { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.22); }
    .ag-principle { background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.11); border-radius:16px; padding:28px 22px; transition:background .2s; }
    .ag-principle:hover { background:rgba(255,255,255,.12); }
    .ag-service-visual { border-radius:20px; aspect-ratio:16/10; display:flex; align-items:center; justify-content:center; font-size:80px; position:relative; overflow:hidden; }
    .ag-service-visual::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,transparent 50%,rgba(26,61,31,.08)); }
    .ag-bullet { display:flex; align-items:flex-start; gap:10px; font-size:13.5px; color:var(--tm); font-weight:500; }
    .ag-bullet-dot { width:22px; height:22px; background:var(--gp); color:var(--gm); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px; font-weight:800; flex-shrink:0; margin-top:1px; }
    .ag-hcard { background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); border-radius:14px; padding:20px 28px; color:#fff; text-decoration:none; transition:all .2s; min-width:180px; text-align:center; }
    .ag-hcard:hover { background:rgba(255,255,255,.18); transform:translateY(-2px); }
    .ag-footer-link { display:block; font-size:13px; color:rgba(255,255,255,.55); text-decoration:none; margin-bottom:10px; transition:color .15s; }
    .ag-footer-link:hover { color:var(--gold); }
    .ag-strip-item { text-align:center; padding:0 20px; border-right:1px solid rgba(255,255,255,.1); }
    .ag-strip-item:last-child { border-right:none; }
    .ag-obj { display:flex; gap:14px; align-items:flex-start; padding:14px 18px; background:var(--gxp); border-radius:12px; border:1px solid var(--border); }
    .ag-obj-icon { width:36px; height:36px; border-radius:9px; background:var(--gp); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
    .ag-float { position:absolute; bottom:-18px; right:-18px; background:#fff; border:1px solid var(--border); border-radius:14px; padding:16px 20px; box-shadow:0 8px 30px var(--shadow); display:flex; align-items:center; gap:12px; }
    .ag-mobile-nav { display:none; flex-direction:column; background:#fff; border-top:1px solid var(--border); padding:12px 20px; gap:4px; }
    @media(max-width:900px){ .ag-mobile-nav.open{display:flex;} .ag-nav-links-desktop{display:none!important;} }
    @media(max-width:640px){ .ag-hero-deco{font-size:180px;} }

    .ag-farmer-bob { transform-origin: bottom center; }
    @keyframes agReveal { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
    @keyframes agSun { 0%,100%{transform:scale(1);opacity:.9} 50%{transform:scale(1.12);opacity:1} }
    @keyframes agCrop { 0%,100%{transform:rotate(-4deg);transform-origin:bottom center} 50%{transform:rotate(4deg);transform-origin:bottom center} }

    @keyframes goldFlow {
      0%   { background-position: 0%   50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0%   50%; }
    }

    .ag-grain { position: relative; }
    .ag-grain::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 100;
      opacity: 0.22;
      mix-blend-mode: overlay;
    }

    .ag-splash {
      position: fixed; inset: 0; z-index: 9999;
      background: #0d2211;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      transition: opacity 0.65s cubic-bezier(.4,0,.2,1), transform 0.65s cubic-bezier(.4,0,.2,1);
    }
    .ag-splash-out { opacity: 0 !important; transform: scale(1.04) !important; pointer-events: none; }

    @keyframes agSplashLogo    { from{opacity:0;transform:translateY(18px) scale(.92)} to{opacity:1;transform:translateY(0) scale(1)} }
    @keyframes agSplashTagline { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes agSplashPulse   { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.9;transform:scale(1.1)} }
    @keyframes agSplashGlow    { 0%,100%{box-shadow:0 0 30px rgba(76,175,80,.2)} 50%{box-shadow:0 0 80px rgba(76,175,80,.45),0 0 120px rgba(240,192,64,.12)} }

    .ag-video-wrap {
      position: relative;
      filter: drop-shadow(0 40px 90px rgba(26,61,31,.32)) drop-shadow(0 8px 24px rgba(26,61,31,.2));
    }
    .ag-video-frame {
      position: relative;
      border-radius: 22px;
      padding: 3px;
      background: linear-gradient(135deg,#4caf50,#f0c040,#2d6a35,#a5d6a7,#f0c040);
      background-size: 300% 300%;
      animation: goldFlow 5s ease infinite;
    }
    .ag-video-inner {
      position: relative;
      border-radius: 20px;
      overflow: hidden;
      background: #000;
      width: 100%;
      padding-bottom: 56.25%;
      height: 0;
    }
    .ag-video-inner video {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover; display: block;
    }
    .ag-vc { position:absolute; width:28px; height:28px; z-index:5; border-color:var(--gold); border-style:solid; border-width:0; }
    .ag-vc-tl { top:-10px; left:-10px; border-top-width:3px; border-left-width:3px; border-top-left-radius:8px; }
    .ag-vc-tr { top:-10px; right:-10px; border-top-width:3px; border-right-width:3px; border-top-right-radius:8px; }
    .ag-vc-bl { bottom:-10px; left:-10px; border-bottom-width:3px; border-left-width:3px; border-bottom-left-radius:8px; }
    .ag-vc-br { bottom:-10px; right:-10px; border-bottom-width:3px; border-right-width:3px; border-bottom-right-radius:8px; }
    @keyframes agSkeleton { 0%{background-position:-500px 0} 100%{background-position:500px 0} }
    .ag-video-skeleton {
      position:absolute; inset:0; z-index:3;
      background: linear-gradient(90deg,#1a3d1f 25%,#2d6a35 50%,#1a3d1f 75%);
      background-size: 500px 100%;
      animation: agSkeleton 1.6s ease-in-out infinite;
      display:flex; align-items:center; justify-content:center;
      border-radius: 18px;
      transition: opacity 0.55s ease;
    }
    .ag-video-skeleton.loaded { opacity:0; pointer-events:none; }
    @keyframes agRec { 0%,100%{opacity:1} 50%{opacity:.15} }
    .ag-rec { display:inline-block; width:8px; height:8px; border-radius:50%; background:#ef4444; animation:agRec 1.1s ease-in-out infinite; }
    .ag-vbadge {
      display:inline-flex; align-items:center; gap:8px;
      padding:7px 18px; border-radius:30px;
      font-size:12.5px; font-weight:700;
      background:#fff; color:var(--gd);
      border:1.5px solid var(--border);
      box-shadow:0 2px 10px var(--shadow);
      white-space:nowrap;
      transition: all .2s;
    }
    .ag-vbadge:hover { transform:translateY(-2px); box-shadow:0 6px 18px var(--shadow); border-color:var(--gl); }

    /* ── Language Switcher ── */
    .ag-lang-btn {
      padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700;
      border: 1.5px solid var(--border); background: transparent; color: var(--tm);
      cursor: pointer; font-family: 'Raleway', sans-serif; transition: all .18s;
    }
    .ag-lang-btn:hover, .ag-lang-btn.active { background: var(--gp); color: var(--gd); border-color: var(--gl); }
  `;
  document.head.appendChild(s);
}

/* ─── useScrollReveal ──────────────────────────────────────────────────── */
function useReveal(deps = []) {
  useEffect(() => {
    // Small delay so DOM is fully painted before we observe
    const timer = setTimeout(() => {
      // Reset any previously animated elements so they can re-animate
      document.querySelectorAll('.ag-reveal').forEach(el => el.classList.remove('ag-in'));

      const obs = new IntersectionObserver(
        (entries) => entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('ag-in'); obs.unobserve(e.target); }
        }),
        { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
      );
      document.querySelectorAll('.ag-reveal').forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, 80);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

function Reveal({ children, delay = '', className = '', style = {} }) {
  return <div className={`ag-reveal ${delay} ${className}`} style={style}>{children}</div>;
}

function SectionLabel({ children, dark }) {
  return (
    <div style={{
      display:'inline-flex', alignItems:'center', gap:8,
      fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:2,
      color: dark ? 'var(--gold)' : 'var(--gm)',
      background: dark ? 'rgba(240,192,64,0.15)' : 'var(--gp)',
      padding:'5px 14px', borderRadius:30, marginBottom:14,
    }}>{children}</div>
  );
}

function BtnPrimary({ to, children, onClick }) {
  const base = { display:'inline-flex', alignItems:'center', gap:8, padding:'13px 30px', borderRadius:12, background:'var(--gold)', color:'var(--gd)', fontWeight:800, fontSize:14.5, textDecoration:'none', fontFamily:'Raleway,sans-serif', border:'none', cursor:'pointer', transition:'all .2s' };
  if (to && to.startsWith('#')) {
    return <button onClick={() => document.getElementById(to.substring(1))?.scrollIntoView({ behavior: 'smooth' })} style={base}>{children}</button>;
  }
  if (to) return <Link to={to} style={base}>{children}</Link>;
  return <button onClick={onClick} style={base}>{children}</button>;
}
function BtnOutline({ to, children, dark }) {
  const base = { display:'inline-flex', alignItems:'center', gap:8, padding:'13px 30px', borderRadius:12, background:'transparent', border: dark?'2px solid rgba(255,255,255,.35)':`2px solid var(--border)`, color: dark?'#fff':'var(--gd)', fontWeight:700, fontSize:14.5, textDecoration:'none', fontFamily:'Raleway,sans-serif', transition:'all .2s', cursor:'pointer' };
  if (to && to.startsWith('#')) {
    return <button onClick={() => document.getElementById(to.substring(1))?.scrollIntoView({ behavior: 'smooth' })} style={base}>{children}</button>;
  }
  return <Link to={to||'#'} style={base}>{children}</Link>;
}
function BtnDark({ to, children }) {
  const base = { display:'inline-flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:10, background:'var(--gd)', color:'#fff', fontWeight:700, fontSize:13.5, textDecoration:'none', fontFamily:'Raleway,sans-serif', transition:'background .2s', cursor:'pointer' };
  if (to && to.startsWith('#')) {
    return <button onClick={() => document.getElementById(to.substring(1))?.scrollIntoView({ behavior: 'smooth' })} style={base}>{children}</button>;
  }
  return <Link to={to||'#'} style={base}>{children}</Link>;
}

/* ── About Image — AI farm image primary ── */
function AboutImage() {
  const [src, setSrc] = useState('/assets/images/ai_remote_sensing_farm.png');
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{
      borderRadius: 20,
      aspectRatio: '4/3',
      overflow: 'hidden',
      position: 'relative',
      background: 'linear-gradient(135deg,var(--gp),#c8e6c9)',
      boxShadow: '0 20px 60px rgba(26,61,31,0.15)',
    }}>
      {/* Skeleton while loading */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 80,
        }}>🌱</div>
      )}
      <img
        src={src}
        alt="AgriSathi AI remote sensing farm"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (src !== 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80')
            setSrc('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80');
        }}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />
      {/* Subtle overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(26,61,31,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

/* ── Service Images — generated high-res local assets ── */
const SERVICE_IMAGES = [
  {
    src: '/assets/images/weather_farm_sky.png',
    fallback: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    alt: 'Weather crop advisories',
  },
  {
    src: '/assets/images/pest_protection_crop.png',
    fallback: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
    alt: 'Crop protection and pest solutions',
  },
  {
    src: '/assets/images/ai_satellite_drone.png',
    fallback: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80',
    alt: 'AI and remote sensing',
  },
];

function ServiceVisual({ index, bg }) {
  const img = SERVICE_IMAGES[index];
  const [src, setSrc] = useState(img.src);
  const [loaded, setLoaded] = useState(false);

  return (
    <div style={{
      borderRadius: 20,
      aspectRatio: '16/10',
      overflow: 'hidden',
      position: 'relative',
      background: bg,
      boxShadow: '0 20px 60px rgba(26,61,31,0.18)',
    }}>
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: `linear-gradient(135deg, ${bg.replace('linear-gradient(135deg,','').replace(')','')})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, animation: 'agSplashPulse 1.4s ease-in-out infinite',
          }}>🌿</div>
        </div>
      )}

      <img
        src={src}
        alt={img.alt}
        onLoad={() => setLoaded(true)}
        onError={() => { if (src !== img.fallback) setSrc(img.fallback); }}
        style={{
          width: '100%', height: '100%',
          objectFit: 'cover', display: 'block',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Subtle green gradient overlay for brand consistency */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(26,61,31,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Bottom label strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(to top, rgba(26,61,31,0.72) 0%, transparent 100%)',
        padding: '32px 18px 14px',
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(240,192,64,0.92)', borderRadius: 20,
          padding: '4px 12px', fontSize: 11, fontWeight: 800,
          color: '#1a3d1f', letterSpacing: 0.5,
        }}>
          🌿 AgriSathi
        </div>
      </div>
    </div>
  );
}

/* ── Language Switcher Component ── */
const LANG_OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'hi', label: 'हि' },
  { code: 'bn', label: 'বা' },
  { code: 'ta', label: 'த' },
];

function LanguageSwitcher({ language, setLanguage }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {LANG_OPTIONS.map(opt => (
        <button
          key={opt.code}
          className={`ag-lang-btn${language === opt.code ? ' active' : ''}`}
          onClick={() => setLanguage(opt.code)}
          title={opt.code.toUpperCase()}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PREMIUM SPLASH SCREEN
════════════════════════════════════════════════════════════════════════ */
function PremiumSplash({ onDone, t }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 1900;

  const done = useCallback(() => {
    setExiting(true);
    setTimeout(onDone, 680);
  }, [onDone]);

  useEffect(() => {
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const pct = Math.min(((ts - startRef.current) / DURATION) * 100, 100);
      setProgress(Math.round(pct));
      if (pct < 100) rafRef.current = requestAnimationFrame(tick);
      else done();
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [done]);

  const words = t.loadingWords;
  const wordIdx = Math.min(Math.floor((progress / 100) * words.length), words.length - 1);

  return (
    <div className={`ag-splash${exiting ? ' ag-splash-out' : ''}`}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(45,106,53,.4) 0%, transparent 70%)', animation:'agSplashGlow 2s ease-in-out infinite', borderRadius:'50%' }} />
      {['🌾','🌱','🌿','🍃','🌾','🌱'].map((em,i) => (
        <div key={i} style={{ position:'absolute', top:`${10+i*13}%`, left: i%2===0?`${4+i*3}%`:`${82-i*4}%`, fontSize:18+i*4, opacity:0.08, animation:`agSplashPulse ${1.4+i*0.25}s ease-in-out infinite`, animationDelay:`${i*0.18}s`, pointerEvents:'none' }}>{em}</div>
      ))}
      <div style={{ animation:'agSplashLogo .75s cubic-bezier(.16,1,.3,1) .1s both', textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ width:104, height:104, borderRadius:'50%', margin:'0 auto 22px', background:'linear-gradient(135deg, rgba(76,175,80,.18), rgba(240,192,64,.12))', border:'1.5px solid rgba(76,175,80,.28)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:54, boxShadow:'0 0 50px rgba(76,175,80,.22), inset 0 0 20px rgba(240,192,64,.08)' }}>🌿</div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:52, color:'#fff', letterSpacing:'-0.5px', lineHeight:1, marginBottom:10 }}>Agri<span style={{ color:'#f0c040' }}>Sathi</span></div>
        <div style={{ width:60, height:1.5, background:'linear-gradient(90deg, transparent, rgba(240,192,64,.5), transparent)', margin:'0 auto 16px' }} />
        <div style={{ animation:'agSplashTagline .6s ease .45s both', fontSize:11, color:'rgba(255,255,255,.38)', fontWeight:700, letterSpacing:4, textTransform:'uppercase', marginBottom:52 }}>{t.tagline}</div>
        <div style={{ fontSize:12.5, color:'rgba(255,255,255,.32)', fontWeight:500, marginBottom:18, height:18, letterSpacing:0.5 }}>{t.loading} {words[wordIdx]}…</div>
        <div style={{ width:240, height:2, background:'rgba(255,255,255,.07)', borderRadius:99, overflow:'hidden', margin:'0 auto 14px' }}>
          <div style={{ height:'100%', width:`${progress}%`, borderRadius:99, background:'linear-gradient(90deg,#4caf50,#f0c040)', transition:'width 0.04s linear', boxShadow:'0 0 10px rgba(240,192,64,.6)' }} />
        </div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,.2)', fontWeight:800, letterSpacing:2, fontVariantNumeric:'tabular-nums' }}>{String(progress).padStart(3,'0')}%</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   CINEMATIC VIDEO SECTION
════════════════════════════════════════════════════════════════════════ */
function VideoSection({ t }) {
  const [videoSrc, setVideoSrc] = useState('/assets/video/entry.mp4');
  const [loaded, setLoaded] = useState(false);

  const handleVideoError = () => {
    const fallbackUrl = 'https://assets.mixkit.co/videos/preview/mixkit-farmer-hands-working-in-a-greenhouse-41584-large.mp4';
    if (videoSrc !== fallbackUrl) {
      setVideoSrc(fallbackUrl);
    } else {
      setLoaded(true);
    }
  };

  return (
    <section id="video" style={{ padding:'80px 60px', background:'var(--gxp)' }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <Reveal style={{ textAlign:'center', marginBottom:52 }}>
          <SectionLabel>{t.sectionLabel}</SectionLabel>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:42, color:'var(--gd)', lineHeight:1.15, marginBottom:12 }}>{t.heading}</h2>
          <p style={{ fontSize:16, color:'var(--ts)', lineHeight:1.7, maxWidth:540, margin:'0 auto' }}>{t.desc}</p>
        </Reveal>
        <Reveal delay="ag-d1">
          <div className="ag-video-wrap">
            <div className="ag-video-frame">
              <div className="ag-vc ag-vc-tl" /><div className="ag-vc ag-vc-tr" />
              <div className="ag-vc ag-vc-bl" /><div className="ag-vc ag-vc-br" />
              <div className="ag-video-inner">
                <div className={`ag-video-skeleton${loaded?' loaded':''}`}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:44, marginBottom:10, opacity:0.55 }}>🎬</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.35)', fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>{t.loadingText}</div>
                  </div>
                </div>
                <video
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  onLoadedData={() => setLoaded(true)}
                  onCanPlay={() => setLoaded(true)}
                  onError={handleVideoError}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    opacity: loaded ? 1 : 0.95,
                    transition: 'opacity .6s ease'
                  }}
                />
                <div style={{ position:'absolute', top:14, left:14, zIndex:4, background:'rgba(0,0,0,.58)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'5px 12px', display:'flex', alignItems:'center', gap:6, fontSize:10.5, fontWeight:800, color:'#fff', letterSpacing:1.5 }}>
                  <span className="ag-rec" />{t.liveDemo}
                </div>
                <div style={{ position:'absolute', top:14, right:14, zIndex:4, background:'rgba(0,0,0,.58)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'5px 12px', fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:1 }}>{t.version}</div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:4, background:'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 100%)', borderBottomLeftRadius:18, borderBottomRightRadius:18, padding:'36px 20px 14px', display:'flex', alignItems:'center', justifyContent:'space-between', pointerEvents:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:7, background:'linear-gradient(135deg,#4caf50,#f0c040)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🌿</div>
                    <span style={{ fontSize:13, fontWeight:700, color:'#fff', letterSpacing:0.3 }}>{t.caption}</span>
                  </div>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,.45)', fontWeight:600 }}>{t.madeFor}</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <Reveal delay="ag-d2">
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:40 }}>
            {t.chips.map(chip => <div key={chip} className="ag-vbadge">{chip}</div>)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO RATING SECTION
════════════════════════════════════════════════════════════════════════ */
const STAR_COLORS = ['#e53935','#ff7043','#fdd835','#66bb6a','#4caf50'];

function HeroRatingSection({ t }) {
  const [hovered,   setHovered]   = useState(0);
  const [selected,  setSelected]  = useState(0);
  const [feedback,  setFeedback]  = useState('');
  const [category,  setCategory]  = useState([]);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const active = hovered || selected;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 900);
  };
  const handleReset = () => { setSubmitted(false); setSelected(0); setFeedback(''); setCategory([]); };

  return (
    <div style={{ marginTop:48, paddingTop:36, borderTop:'1px solid rgba(255,255,255,0.14)' }}>
      <div style={{ background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:20, padding:'28px 30px', backdropFilter:'blur(8px)', maxWidth:640 }}>
        {submitted ? (
          <div style={{ textAlign:'center', padding:'10px 0' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🙏</div>
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:'#fff', marginBottom:8 }}>{t.thanks}</div>
            <div style={{ fontSize:14, color:'rgba(255,255,255,0.65)', marginBottom:6 }}>
              {t.youRated} &nbsp;
              {[1,2,3,4,5].map(i => <span key={i} style={{ color: i<=selected ? STAR_COLORS[selected-1] : 'rgba(255,255,255,0.2)', fontSize:18 }}>★</span>)}
              &nbsp; <strong style={{ color:STAR_COLORS[selected-1] }}>{t.starLabels[selected-1]}</strong>
            </div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>{t.helpText}</div>
            <button onClick={handleReset} style={{ padding:'8px 22px', borderRadius:10, background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Raleway,sans-serif' }}>{t.rateAgain}</button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.5)', textTransform:'uppercase', letterSpacing:1.5, marginBottom:6 }}>{t.title}</div>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:'#fff' }}>
                {active ? <span>{t.selected} <span style={{ color:STAR_COLORS[active-1] }}>{t.starLabels[active-1]}</span></span> : t.question}
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:22 }}>
              {[1,2,3,4,5].map(star => {
                const isActive = star <= (hovered||selected);
                return (
                  <button key={star}
                    onClick={() => setSelected(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ background: isActive ? 'linear-gradient(90deg,#FFD700,#FFF8DC,#FFD700)' : 'none', backgroundSize:'200% auto', animation: isActive ? 'goldFlow 2s linear infinite' : 'none', border:'none', cursor:'pointer', padding:0, fontSize: isActive ? 42 : 36, lineHeight:1, color: isActive ? '#FFD700' : 'rgba(255,255,255,0.4)', filter: isActive ? 'drop-shadow(0 0 10px #FFD700)' : 'grayscale(1) opacity(0.4)', transform: isActive ? 'translateY(-3px)' : 'translateY(0)', transition:'all 0.18s cubic-bezier(0.34,1.56,0.64,1)', WebkitBackgroundClip: isActive ? 'text' : undefined, WebkitTextFillColor: isActive ? 'transparent' : undefined }}
                    title={t.starLabels[star-1]}
                  >★</button>
                );
              })}
            </div>
            {selected > 0 && (
              <div style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.5)', fontWeight:600, marginBottom:10, textTransform:'uppercase', letterSpacing:1, display:'flex', alignItems:'center', gap:8 }}>
                  {t.whatsRating}
                  {category.length > 0 && <span style={{ background:STAR_COLORS[selected-1], color:'#fff', fontSize:10, fontWeight:800, padding:'1px 7px', borderRadius:20 }}>{category.length} {t.selected_count}</span>}
                </div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  {t.categories.map(cat => {
                    const isSel = category.includes(cat);
                    return (
                      <button key={cat}
                        onClick={() => setCategory(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev,cat])}
                        style={{ padding:'6px 16px', borderRadius:22, border: isSel ? '1.5px solid #F0C040' : '1.5px solid rgba(255,255,255,0.22)', background: isSel ? 'linear-gradient(120deg,#F0C040,#FFD54F,#FFF8E1,#FFD54F)' : 'rgba(255,255,255,0.07)', backgroundSize:'200% auto', color: isSel ? '#1A3D1F' : 'rgba(255,255,255,0.7)', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily:'Raleway,sans-serif', display:'flex', alignItems:'center', gap:6, boxShadow: isSel ? '0 0 8px rgba(240,192,64,0.6)' : 'none', transform: isSel ? 'scale(1.05)' : 'scale(1)', transition:'all 0.25s ease', animation: isSel ? 'goldFlow 2.5s linear infinite' : 'none' }}
                      >
                        {isSel && <span style={{ fontSize:10 }}>✓</span>}{cat}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            {selected > 0 && (
              <div style={{ marginBottom:18 }}>
                <textarea
                  value={feedback} onChange={e => setFeedback(e.target.value)}
                  placeholder={t.placeholder.replace('{{label}}', t.starLabels[selected-1].toLowerCase())}
                  rows={3} maxLength={300}
                  style={{ width:'100%', padding:'12px 16px', borderRadius:12, border:'1.5px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.08)', color:'#fff', fontSize:13.5, fontFamily:'Raleway,sans-serif', resize:'none', outline:'none', lineHeight:1.6, boxSizing:'border-box' }}
                  onFocus={e => e.target.style.borderColor = STAR_COLORS[selected-1]}
                  onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                />
                <div style={{ textAlign:'right', fontSize:11, color:'rgba(255,255,255,.35)', marginTop:4 }}>{feedback.length}/300</div>
              </div>
            )}
            <button onClick={handleSubmit} disabled={!selected||submitting} style={{ padding:'11px 28px', borderRadius:11, background: selected ? `linear-gradient(135deg,${STAR_COLORS[selected-1]},${STAR_COLORS[Math.min(selected,4)]})` : 'rgba(255,255,255,0.1)', border:'none', color: selected ? '#fff' : 'rgba(255,255,255,0.35)', fontSize:14, fontWeight:800, cursor: selected?'pointer':'not-allowed', fontFamily:'Raleway,sans-serif', transition:'all .2s', opacity: submitting?0.7:1, boxShadow: selected ? `0 4px 18px ${STAR_COLORS[selected-1]}44` : 'none' }}>
              {submitting ? t.submitting : selected ? t.submit.replace('{{label}}', t.starLabels[selected-1]) : t.noRating}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FARM SCENE STRIP (no text — no translation needed)
════════════════════════════════════════════════════════════════════════ */
function FarmSceneStrip() {
  const truckRef  = useRef(null);
  const frameRef  = useRef(null);
  const stateRef  = useRef({ x:-120, dir:1, pausing:false, pauseTimer:0 });
  const [bob,    setBob]    = useState(false);
  const [cloud1, setCloud1] = useState(0);
  const [cloud2, setCloud2] = useState(0);
  const [sway,   setSway]   = useState(0);

  useEffect(() => {
    const loop = () => {
      const el = truckRef.current;
      if (!el) { frameRef.current = requestAnimationFrame(loop); return; }
      const cW = el.parentElement?.offsetWidth || window.innerWidth;
      const s  = stateRef.current;
      if (!s.pausing) {
        s.x += 2.2 * s.dir;
        if (s.dir===1  && s.x > cW+10)   { s.x=cW+10;  s.pausing=true; s.pauseTimer=40; s.dir=-1; }
        if (s.dir===-1 && s.x < -130)     { s.x=-130;   s.pausing=true; s.pauseTimer=40; s.dir=1;  }
      } else { s.pauseTimer--; if (s.pauseTimer<=0) s.pausing=false; }
      el.style.left      = `${s.x}px`;
      el.style.transform = `scaleX(${s.dir})`;
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => { const id=setInterval(()=>setBob(b=>!b),600); return ()=>clearInterval(id); }, []);
  useEffect(() => {
    let t=0;
    const id=setInterval(()=>{ t+=0.04; setCloud1(Math.sin(t)*14); setCloud2(Math.sin(t+1.5)*10); },50);
    return ()=>clearInterval(id);
  }, []);
  useEffect(() => {
    let t=0;
    const id=setInterval(()=>{ t+=0.07; setSway(Math.sin(t)*6); },50);
    return ()=>clearInterval(id);
  }, []);

  const farmerStyle = (delay) => ({ position:'absolute', bottom:34, fontSize:34, transform:`rotate(${bob?-10:10}deg)`, transformOrigin:'bottom center', transition:`transform ${delay}ms ease-in-out` });

  return (
    <div style={{ position:'relative', height:180, overflow:'hidden', background:'linear-gradient(180deg,#1e6fa8 0%,#3498db 40%,#87ceeb 70%)' }}>
      <div style={{ position:'absolute', top:14, right:100, fontSize:34, filter:'drop-shadow(0 0 8px #ffd54f)' }}>☀️</div>
      <div style={{ position:'absolute', top:8,  left:`calc(12% + ${cloud1}px)`, fontSize:30, opacity:.88 }}>☁️</div>
      <div style={{ position:'absolute', top:3,  left:`calc(38% + ${cloud2}px)`, fontSize:22, opacity:.72 }}>☁️</div>
      <div style={{ position:'absolute', top:14, left:`calc(62% + ${cloud1*.6}px)`, fontSize:26, opacity:.80 }}>☁️</div>
      <div style={{ position:'absolute', top:24, left:'50%', fontSize:15, opacity:.75 }}>🐦</div>
      <div style={{ position:'absolute', top:34, left:'53%', fontSize:12, opacity:.60 }}>🐦</div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:85, background:'linear-gradient(180deg,#33a04a 0%,#1b6b2c 100%)', borderTop:'3px solid #4caf50' }} />
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:36, background:'linear-gradient(180deg,#b08860 0%,#7a5c3a 100%)', borderTop:'2px solid #d4a574' }} />
      {[8,20,32,44,56,68,80].map(p=>(<div key={p} style={{ position:'absolute', bottom:14, left:`${p}%`, width:52, height:5, borderRadius:3, background:'rgba(255,255,255,0.32)' }} />))}
      <div style={{ ...farmerStyle(600), left:'6%' }}>🧑‍🌾</div>
      <div style={{ ...farmerStyle(750), left:'13%', fontSize:28, bottom:36 }}>👨‍🌾</div>
      {[{left:'21%',size:28,phase:0},{left:'24%',size:26,phase:.4},{left:'27%',size:28,phase:.2},{left:'30%',size:26,phase:.6}].map(({left,size,phase})=>(
        <div key={left} style={{ position:'absolute', bottom:34, left, fontSize:size, transform:`rotate(${Math.sin(phase)*sway/6}deg)`, transformOrigin:'bottom center' }}>🌾</div>
      ))}
      <div style={{ position:'absolute', bottom:34, left:'47%', fontSize:22, transform:`rotate(${sway*.5}deg)`, transformOrigin:'bottom center' }}>🥦</div>
      <div style={{ position:'absolute', bottom:34, left:'50%', fontSize:20, transform:`rotate(${-sway*.4}deg)`, transformOrigin:'bottom center' }}>🌽</div>
      <div style={{ position:'absolute', bottom:34, left:'53%', fontSize:22, transform:`rotate(${sway*.6}deg)`, transformOrigin:'bottom center' }}>🍅</div>
      <div style={{ position:'absolute', bottom:50, left:'37%', fontSize:44 }}>🌳</div>
      <div style={{ position:'absolute', bottom:48, left:'71%', fontSize:38 }}>🌴</div>
      <div style={{ position:'absolute', bottom:50, left:'87%', fontSize:42 }}>🌳</div>
      <div ref={truckRef} style={{ position:'absolute', bottom:30, left:-120, display:'flex', flexDirection:'column', alignItems:'center', width:110, zIndex:10, transformOrigin:'center center' }}>
        <div style={{ display:'flex', gap:1, marginBottom:1, transform:'scaleX(1)' }}>
          {['🍅','🥬','🌽','🥕','🧅'].map(v=><span key={v} style={{ fontSize:13 }}>{v}</span>)}
        </div>
        <span style={{ fontSize:44, lineHeight:1 }}>⛟</span>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FARMER WORKFLOW GUIDELINE BANNER
════════════════════════════════════════════════════════════════════════ */
function FarmerWorkflowGuideline({ language }) {
  const isBn = language === 'bn';
  const isHi = language === 'hi';

  const title = isBn
    ? '💡 কৃষক গাইডলাইন: সেরা কার্যকারিতার জন্য নির্দেশিত ব্যবহারের ক্রম'
    : isHi
    ? '💡 किसान मार्गदर्शिका: सर्वोत्तम AI परिणाम के लिए अनुशंसित क्रम'
    : '💡 Farmer Guideline: Recommended Order for Maximum AI Accuracy';

  const subtitle = isBn
    ? 'কৃষক ভাইগণ, যদি আপনি মেনুবারের নির্দেশিত ক্রমানুসারে (Dashboard ➔ Weather ➔ Soil ➔ Irrigation ➔ Water ➔ Yield ➔ Disease) টুলগুলো ব্যবহার করেন, তবে তথ্যগুলো স্বয়ংসক্রিয়ভাবে লিঙ্ক হবে এবং সবচেয়ে নির্ভুল ফলাফল পাবেন।'
    : isHi
    ? 'किसान भाइयों, यदि आप (Dashboard ➔ Weather ➔ Soil ➔ Irrigation ➔ Water ➔ Yield ➔ Disease) क्रम का पालन करते हैं, तो डेटा ऑटो-लिंक होगा और सबसे सटीक सलाह मिलेगी।'
    : 'For maximum precision and auto-filled farm parameters, farmers are advised to follow this recommended sequence:';

  const steps = [
    { num: '1', title: isBn ? '1. আবহাওয়া (Weather)' : isHi ? '1. मौसम (Weather)' : '1. Weather', desc: isBn ? 'আবহাওয়ার তাপমাত্রা ও বৃষ্টিপাতের তথ্য লোড করে' : isHi ? 'मौसम और तापमान का वास्तविक डेटा ऑटो-लोड होता है' : 'Auto-fetches temperature & rain' },
    { num: '2', title: isBn ? '2. মাটি (Soil)' : isHi ? '2. मिट्टी (Soil)' : '2. Soil Analysis', desc: isBn ? 'আপনার এলাকার মাটির NPK (কেজি/হেক্টর) ও pH হিসাব দেয়' : isHi ? 'मृदा NPK (kg/ha) और pH का हिसाब बनता है' : 'Calculates NPK (kg/ha) & pH' },
    { num: '3', title: isBn ? '3. সেচ (Irrigation)' : isHi ? '3. सिंचाई (Irrigation)' : '3. Irrigation Planner', desc: isBn ? 'আবহাওয়া ও মাটির ডেটা মিলে সঠিক সেচের পানি নির্ণয় করে' : isHi ? 'मौसम और मिट्टी से सटीक पानी तय होता है' : 'Calculates farm water dosage' },
    { num: '4', title: isBn ? '4. পানির মান (Water)' : isHi ? '4. जल गुणवत्ता (Water)' : '4. Water Analytics', desc: isBn ? 'সেচের পানির TDS ও pH নিরীক্ষা করে' : isHi ? 'सिंचाई के पानी के pH और TDS की जांच' : 'Verifies water TDS & line flush' },
    { num: '5', title: isBn ? '5. ফলন পূর্বাভাস (Yield)' : isHi ? '5. उपज (Yield)' : '5. Yield Prediction', desc: isBn ? 'মাটির NPK ও স্থান যুক্ত হয়ে ফলন গণনা করে' : isHi ? 'मिट्टी और स्थान से पैदावार का सटीक अनुमान' : 'Auto-pulls NPK for yield forecast' },
    { num: '6', title: isBn ? '6. রোগ নির্ণয় (Disease)' : isHi ? '6. रोग निदान (Disease)' : '6. Disease Diagnostics', desc: isBn ? 'আবহাওয়া ও মাটির তথ্যের সাহায্যে নির্ভুল রোগ চিকিৎসা দেয়' : isHi ? 'मौसम और मिट्टी के साथ फसलों का सटीक इलाज' : 'Diagnoses crop pests with full context' },
  ];

  return (
    <section style={{ padding: '40px 60px', background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)', borderTop: '2px solid #10b981', borderBottom: '2px solid #10b981' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <span style={{ fontSize: 24 }}>🌱</span>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#f0c040', letterSpacing: 0.5, fontFamily: 'Inter, sans-serif' }}>
            {title}
          </h3>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 14.5, lineHeight: 1.6, marginBottom: 24, maxWidth: 1050 }}>
          {subtitle}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {steps.map(s => (
            <div key={s.num} style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(16, 185, 129, 0.38)', borderRadius: 14, padding: '14px 16px', backdropFilter: 'blur(6px)' }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: '#fff', marginBottom: 4 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.78)', lineHeight: 1.45 }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { language, setLanguage } = useLanguage();

  // Resolve translations — fall back to English
  const t = landingTranslations.page[language] || landingTranslations.page.en;

  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [splashDone,    setSplashDone]    = useState(false);
  // Re-observe reveal elements whenever splash finishes or language switches
  useReveal([splashDone, language]);

  useEffect(() => {
    const ids = ['about','features','services','governance','contact'];
    const handler = () => {
      let cur = '';
      ids.forEach(id => { const el = document.getElementById(id); if (el && window.scrollY >= el.offsetTop-110) cur = id; });
      setActiveSection(cur);
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); setMenuOpen(false); };

  const NAV_IDS   = ['about','features','services','governance','contact'];
  const NAV_LABELS = [t.nav.about, t.nav.features, t.nav.services, t.nav.governance, t.nav.contact];

  return (
    <>
      {!splashDone && <PremiumSplash onDone={() => setSplashDone(true)} t={t.splash} />}

      <div
        className="ag-page ag-grain"
        style={{ visibility: splashDone ? 'visible' : 'hidden', opacity: splashDone ? 1 : 0, transition: 'opacity 0.4s ease' }}
      >

        {/* ── NAV ── */}
        <nav className="ag-nav">
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
            <Link to="/" style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:'var(--gd)', textDecoration:'none', fontWeight:700 }}>🌿 AgriSathi</Link>
            <div className="ag-nav-links-desktop" style={{ display:'flex', alignItems:'center', gap:4 }}>
              {NAV_IDS.map((id, i) => (
                <button key={id} onClick={() => scrollTo(id)} className={`ag-nav-link${activeSection===id?' active':''}`} style={{ background:'none', border:'none', cursor:'pointer' }}>{NAV_LABELS[i]}</button>
              ))}
            </div>
            {/* <div style={{ display:'flex', gap:8, alignItems:'center' }}> */}
              {/* Language Switcher */}
              {/* <LanguageSwitcher language={language} setLanguage={setLanguage} />
              <Link to="/login"    style={{ padding:'8px 18px', borderRadius:8, fontSize:13.5, fontWeight:700, color:'var(--gm)', textDecoration:'none', border:'1.5px solid var(--border)', fontFamily:'Raleway,sans-serif' }}>{t.nav.login}</Link>
              <Link to="/register" style={{ padding:'8px 18px', borderRadius:8, fontSize:13.5, fontWeight:700, color:'#fff', textDecoration:'none', background:'var(--gd)', fontFamily:'Raleway,sans-serif' }}>{t.nav.getStarted}</Link>
              <button onClick={() => setMenuOpen(o=>!o)} style={{ display:'none', background:'none', border:'none', fontSize:22, cursor:'pointer', color:'var(--gd)' }} className="ag-hamburger">☰</button>
            </div> */}
          </div>
          <div className={`ag-mobile-nav${menuOpen?' open':''}`}>
            {NAV_IDS.map((id, i) => <button key={id} onClick={()=>scrollTo(id)} className="ag-nav-link" style={{ background:'none', border:'none', cursor:'pointer', textAlign:'left' }}>{NAV_LABELS[i]}</button>)}
            <div style={{ paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
            </div>
          </div>
        </nav>

        {/* ── VIDEO ── */}
        <VideoSection t={t.video} />

        {/* ── HERO ── */}
        <section className="ag-hero" style={{ display:'flex', alignItems:'center', padding:'80px 60px' }}>
          <span className="ag-hero-deco">🌾</span>
          <div style={{ maxWidth:700, position:'relative', zIndex:1, animation:'agReveal .85s cubic-bezier(.16,1,.3,1) both' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(240,192,64,.2)', border:'1px solid rgba(240,192,64,.4)', padding:'6px 16px', borderRadius:30, fontSize:12, fontWeight:700, color:'var(--gold)', letterSpacing:1, textTransform:'uppercase', marginBottom:24 }}>
              {t.hero.badge}
            </div>
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:60, color:'#fff', lineHeight:1.1, marginBottom:20 }}>
              {t.hero.heading1} <em style={{ color:'var(--gold)', fontStyle:'italic' }}>{t.hero.heading2}</em> {t.hero.heading3}
            </h1>
            <p style={{ fontSize:17, color:'rgba(255,255,255,.75)', lineHeight:1.75, marginBottom:36, maxWidth:560 }}>{t.hero.desc}</p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <BtnPrimary to="/register">{t.hero.ctaPrimary} <ArrowRight size={16} /></BtnPrimary>
              <BtnOutline to="#features" dark>{t.hero.ctaSecondary}</BtnOutline>
            </div>
            <HeroRatingSection t={t.rating} />
          </div>
        </section>

        {/* ── FARM SCENE ── */}
        <FarmSceneStrip />

        {/* ── ABOUT ── */}
        <section id="about" style={{ padding:'90px 60px' }}>
          <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }}>
            <Reveal>
              <div style={{ position:'relative' }}>
                <AboutImage />
                <div className="ag-float">
                  <div style={{ width:44, height:44, background:'var(--gp)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>📊</div>
                  <div>
                    <div style={{ fontSize:18, fontWeight:800, color:'var(--gd)' }}>{t.about.floatTitle}</div>
                    <div style={{ fontSize:11, color:'var(--ts)' }}>{t.about.floatSub}</div>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay="ag-d2">
              <SectionLabel>{t.about.label}</SectionLabel>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:42, color:'var(--gd)', lineHeight:1.15, marginBottom:14 }}>{t.about.heading}</h2>
              <p style={{ fontSize:15.5, color:'var(--ts)', lineHeight:1.75, marginBottom:28 }}>{t.about.desc}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {t.about.items.map(obj => (
                  <div key={obj.title} className="ag-obj">
                    <div className="ag-obj-icon" style={{ fontSize:17 }}>{obj.icon}</div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13.5, color:'var(--gd)', marginBottom:2 }}>{obj.title}</div>
                      <div style={{ fontSize:12.5, color:'var(--ts)', lineHeight:1.55 }}>{obj.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── FARMER WORKFLOW GUIDELINE BANNER ── */}
        <FarmerWorkflowGuideline language={language} />

        {/* ── FEATURES ── */}
        <section id="features" style={{ padding:'90px 60px', background:'var(--gxp)' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <Reveal style={{ marginBottom:52 }}>
              <SectionLabel>{t.features.label}</SectionLabel>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:42, color:'var(--gd)', lineHeight:1.15, marginBottom:12 }}>{t.features.heading}</h2>
              <p style={{ fontSize:16, color:'var(--ts)', lineHeight:1.7, maxWidth:580 }}>{t.features.desc}</p>
            </Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
              {t.features.items.map((f, i) => (
                <Reveal key={f.title} delay={`ag-d${(i%4)+1}`}>
                  <div className="ag-feature-card">
                    <div style={{ width:54, height:54, background:f.iconBg, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, marginBottom:18 }}>{f.icon}</div>
                    <h3 style={{ fontSize:17, fontWeight:700, color:'var(--gd)', marginBottom:10 }}>{f.title}</h3>
                    <p style={{ fontSize:13.5, color:'var(--ts)', lineHeight:1.65 }}>{f.desc}</p>
                    <div style={{ display:'inline-block', marginTop:18, padding:'4px 12px', background:'var(--gp)', color:'var(--gm)', borderRadius:20, fontSize:11, fontWeight:700 }}>{f.tag}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services">
          {t.services.map((svc, idx) => (
            <div key={svc.title} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:72, alignItems:'center', padding:'72px 60px', borderBottom:'1px solid var(--border)', background:svc.altBg?'var(--gxp)':'#fff', direction:svc.reverse?'rtl':'ltr' }}>
              <Reveal style={{ direction:'ltr' }}>
                <ServiceVisual index={idx} bg={svc.bg} />
              </Reveal>
              <Reveal delay="ag-d2" style={{ direction:'ltr' }}>
                <SectionLabel>{svc.label}</SectionLabel>
                <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, color:'var(--gd)', lineHeight:1.15, marginBottom:14 }}>{svc.title}</h3>
                <p style={{ fontSize:15, color:'var(--ts)', lineHeight:1.75, marginBottom:24 }}>{svc.desc}</p>
                <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}>
                  {svc.bullets.map(b => (
                    <div key={b} className="ag-bullet">
                      <div className="ag-bullet-dot">✓</div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
                <BtnDark to={svc.ctaTo}>{svc.cta} <ArrowRight size={15} /></BtnDark>
              </Reveal>
            </div>
          ))}
        </section>

        {/* ── GOVERNANCE ── */}
        <section id="governance" style={{ padding:'90px 60px', background:'var(--gd)' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <Reveal style={{ marginBottom:52 }}>
              <SectionLabel dark>{t.governance.label}</SectionLabel>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:42, color:'#fff', lineHeight:1.15, marginBottom:12 }}>{t.governance.heading}</h2>
              <p style={{ fontSize:16, color:'rgba(255,255,255,.65)', lineHeight:1.7, maxWidth:600 }}>{t.governance.desc}</p>
            </Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:18, marginBottom:56 }}>
              {t.governance.cards.map((g, i) => (
                <Reveal key={g.title} delay={`ag-d${(i%3)+1}`}>
                  <div className="ag-gov-card">
                    <div style={{ width:50, height:50, borderRadius:12, background:'rgba(240,192,64,.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:16 }}>{g.icon}</div>
                    <h4 style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:10 }}>{g.title}</h4>
                    <p style={{ fontSize:13, color:'rgba(255,255,255,.62)', lineHeight:1.65 }}>{g.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:'#fff', marginBottom:24, textAlign:'center' }}>{t.governance.principlesHeading}</h3>
            </Reveal>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:18 }}>
              {t.governance.principles.map((p, i) => (
                <Reveal key={p.title} delay={`ag-d${i+1}`}>
                  <div className="ag-principle">
                    <div style={{ fontSize:32, marginBottom:14 }}>{p.icon}</div>
                    <h4 style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:8 }}>{p.title}</h4>
                    <p style={{ fontSize:13, color:'rgba(255,255,255,.62)', lineHeight:1.6 }}>{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HELPDESK ── */}
        <section id="contact" style={{ background:'linear-gradient(120deg,var(--gd),#2d6a35)', padding:'70px 60px', textAlign:'center' }}>
          <Reveal>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:38, color:'#fff', marginBottom:10 }}>{t.helpdesk.heading}</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,.7)', marginBottom:36 }}>{t.helpdesk.desc}</p>
            <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
              {t.helpdesk.cards.map(h => (
                <a key={h.label} href={h.href} className="ag-hcard">
                  <div style={{ fontSize:30, marginBottom:8 }}>{h.icon}</div>
                  <div style={{ fontSize:10.5, opacity:.65, fontWeight:600, textTransform:'uppercase', letterSpacing:1 }}>{h.label}</div>
                  <div style={{ fontSize:16, fontWeight:800, marginTop:4 }}>{h.val}</div>
                </a>
              ))}
            </div>
          </Reveal>
        </section>

         {/* ── FOOTER ── */}
         <footer style={{ background:'#0f1f12', padding:'60px 60px 28px' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr 1fr 1fr', gap:48, marginBottom:48 }}>
              <div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:'#fff', marginBottom:10 }}>🌿 AgriSathi</div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,.6)', lineHeight:1.7, marginBottom:18 }}>{t.footer.tagline}</p>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.3)' }}>{t.footer.ministry}</div>
              </div>

              {/* Platform — internal routes */}
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>{t.footer.cols[0].h}</div>
                {[
                  { label: t.footer.cols[0].links[0], to: '/crop-recommendation' },
                  { label: t.footer.cols[0].links[1], to: '/soil-analysis' },
                  { label: t.footer.cols[0].links[2], to: '/disease-detection' },
                  { label: t.footer.cols[0].links[3], to: '/irrigation' },
                  { label: t.footer.cols[0].links[4], to: '/weather' },
                ].map(({ label, to }) => (
                  <Link key={label} to={to} className="ag-footer-link">{label}</Link>
                ))}
              </div>

              {/* Government — real external URLs */}
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>{t.footer.cols[1].h}</div>
                {[
                  { label: t.footer.cols[1].links[0], href: 'https://pmkisan.gov.in' },
                  { label: t.footer.cols[1].links[1], href: 'https://pmfby.gov.in' },
                  { label: t.footer.cols[1].links[2], href: 'https://soilhealth.dac.gov.in' },
                  { label: t.footer.cols[1].links[3], href: 'https://www.nabard.org' },
                  { label: t.footer.cols[1].links[4], href: 'https://agricoop.nic.in' },
                ].map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="ag-footer-link">{label}</a>
                ))}
              </div>

              {/* Support — internal routes */}
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>{t.footer.cols[2].h}</div>
                {[
                  { label: t.footer.cols[2].links[0], to: '/helpdesk' },
                  { label: t.footer.cols[2].links[1], to: '/helpdesk' },
                  { label: t.footer.cols[2].links[2], to: '/terms' },
                  { label: t.footer.cols[2].links[3], to: '/privacy' },
                  { label: t.footer.cols[2].links[4], to: '/terms' },
                ].map(({ label, to }) => (
                  <Link key={label} to={to} className="ag-footer-link">{label}</Link>
                ))}
              </div>

            </div>
            <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:24, display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,.35)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, background:'linear-gradient(135deg,var(--gl),var(--gold))', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15 }}>🌿</div>
                <span>{t.footer.copyright}</span>
              </div>
              <span>{t.footer.madeFor}</span>
            </div>
          </div>
        </footer>

        <FloatingChatButton />
      </div>
    </>
  );
}