import React, { useEffect, useState } from 'react';

// ─── Growing Seedling Full-Screen Loader ───────────────────────────────────
const Loader = ({
  fullScreen = false,
  size = 'medium',
  text = 'Loading...',
  color = 'primary',
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  if (fullScreen) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Jost:wght@300;400&display=swap');

          @keyframes grow-stem {
            0%   { height: 0px; }
            100% { height: 48px; }
          }
          @keyframes bloom {
            0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
            60%  { transform: scale(1.15) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes leaf-left {
            0%   { transform: scale(0) rotate(30deg); opacity: 0; }
            100% { transform: scale(1) rotate(30deg); opacity: 1; }
          }
          @keyframes leaf-right {
            0%   { transform: scale(0) rotate(-30deg); opacity: 0; }
            100% { transform: scale(1) rotate(-30deg); opacity: 1; }
          }
          @keyframes soil-wave {
            0%, 100% { transform: scaleX(1); }
            50%       { transform: scaleX(1.04); }
          }
          @keyframes float-particle {
            0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
            50%  { transform: translateY(-18px) translateX(6px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-36px) translateX(-4px) scale(0.7); opacity: 0; }
          }
          @keyframes shimmer-bar {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }

          .loader-overlay {
            position: fixed; inset: 0; z-index: 9999;
            background: radial-gradient(ellipse at 40% 60%, #0d2010 0%, #071208 100%);
            display: flex; align-items: center; justify-content: center;
            flex-direction: column;
            overflow: hidden;
          }
          .loader-overlay::before {
            content: '';
            position: absolute; inset: 0;
            background-image:
              linear-gradient(rgba(74,124,59,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74,124,59,0.05) 1px, transparent 1px);
            background-size: 40px 40px;
          }

          /* Floating orbs */
          .loader-orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            pointer-events: none;
          }

          /* Plant */
          .plant-wrapper {
            position: relative;
            width: 120px; height: 140px;
            display: flex; flex-direction: column;
            align-items: center; justify-content: flex-end;
            margin-bottom: 32px;
          }
          .plant-stem {
            width: 4px;
            background: linear-gradient(to top, #3a6b2a, #5a9e3a);
            border-radius: 4px;
            animation: grow-stem 1.2s cubic-bezier(0.34,1.56,0.64,1) 0.3s both;
            position: relative;
            z-index: 2;
          }
          .plant-flower {
            font-size: 44px;
            line-height: 1;
            animation: bloom 0.8s cubic-bezier(0.34,1.56,0.64,1) 1.4s both;
            position: absolute;
            top: 0; left: 50%;
            transform: translateX(-50%);
            filter: drop-shadow(0 4px 16px rgba(106,200,80,0.4));
          }
          .plant-leaf {
            position: absolute;
            font-size: 22px;
            top: 52px;
          }
          .plant-leaf.left {
            left: 6px;
            animation: leaf-left 0.5s ease 1.8s both;
          }
          .plant-leaf.right {
            right: 6px;
            animation: leaf-right 0.5s ease 2.0s both;
          }
          .plant-soil {
            width: 100px; height: 20px;
            background: linear-gradient(to bottom, #3d2010, #2a1608);
            border-radius: 50%;
            position: absolute; bottom: 0; left: 50%;
            transform: translateX(-50%);
            animation: soil-wave 2s ease-in-out infinite 2s;
            box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          }
          .plant-soil::before {
            content: '';
            position: absolute; top: -2px; left: 10%; right: 10%;
            height: 4px; border-radius: 50%;
            background: rgba(74,124,59,0.3);
          }

          /* Particles */
          .particle {
            position: absolute;
            font-size: 14px;
            animation: float-particle 2.5s ease-in-out infinite;
          }

          /* Progress bar */
          .loader-progress-track {
            width: 200px; height: 3px;
            background: rgba(255,255,255,0.07);
            border-radius: 99px;
            overflow: hidden;
            margin-bottom: 16px;
          }
          .loader-progress-fill {
            height: 100%;
            width: 60%;
            border-radius: 99px;
            background: linear-gradient(90deg, #3a6b2a, #6aca50, #3a6b2a);
            background-size: 200% 100%;
            animation: shimmer-bar 1.4s linear infinite;
          }

          .loader-text {
            font-family: 'Cormorant Garamond', serif;
            font-size: 20px;
            font-weight: 600;
            color: #a8d490;
            letter-spacing: 0.5px;
            animation: fade-in-up 0.6s ease 0.5s both;
          }
          .loader-subtext {
            font-family: 'Jost', sans-serif;
            font-size: 12px;
            color: rgba(168,212,144,0.4);
            font-weight: 300;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-top: 6px;
            animation: fade-in-up 0.6s ease 0.8s both;
          }
        `}</style>

        <div className="loader-overlay">
          {/* Background orbs */}
          <div className="loader-orb" style={{ width: 300, height: 300, background: 'rgba(74,124,59,0.12)', top: '-80px', left: '-80px' }} />
          <div className="loader-orb" style={{ width: 200, height: 200, background: 'rgba(212,168,83,0.07)', bottom: '-40px', right: '-40px' }} />

          {/* Floating particles */}
          {['🌿', '✨', '🌱', '💧', '🍃'].map((p, i) => (
            <span key={i} className="particle" style={{
              left: `${20 + i * 15}%`,
              bottom: `${25 + (i % 2) * 8}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.4}s`,
            }}>{p}</span>
          ))}

          {/* Plant animation */}
          <div className="plant-wrapper">
            <div className="plant-flower">🌻</div>
            <span className="plant-leaf left">🍃</span>
            <span className="plant-leaf right">🍃</span>
            <div className="plant-stem" style={{ height: 48 }} />
            <div className="plant-soil" />
          </div>

          {/* Progress */}
          <div className="loader-progress-track">
            <div className="loader-progress-fill" />
          </div>

          <div className="loader-text">{text}{dots}</div>
          <div className="loader-subtext">Urban Farming Platform</div>
        </div>
      </>
    );
  }

  // Inline loader
  const sizeMap = { small: 32, medium: 48, large: 64 };
  const dim = sizeMap[size] || 48;

  return (
    <>
      <style>{`
        @keyframes spin-leaf {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,124,59,0.3); }
          50%       { box-shadow: 0 0 0 8px rgba(74,124,59,0); }
        }
        .inline-loader-ring {
          border-radius: 50%;
          border: 2.5px solid rgba(74,124,59,0.15);
          border-top-color: #5a9e3a;
          animation: spin-leaf 0.9s linear infinite, pulse-glow 1.8s ease infinite;
          display: flex; align-items: center; justify-content: center;
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 0', gap: 10 }}>
        <div className="inline-loader-ring" style={{ width: dim, height: dim }}>
          <span style={{ fontSize: dim * 0.4 }}>🌱</span>
        </div>
        {text && <p style={{ fontSize: 13, color: '#6b8f6b', fontFamily: 'Jost, sans-serif', fontWeight: 300 }}>{text}</p>}
      </div>
    </>
  );
};


// ─── Spinner ──────────────────────────────────────────────────────────────
export const Spinner = ({ size = 'medium', color = 'primary' }) => {
  const dim = { small: 16, medium: 24, large: 32 }[size] || 24;
  const borderColor = color === 'white' ? 'rgba(255,255,255,0.3)' : 'rgba(74,124,59,0.2)';
  const topColor = color === 'white' ? '#fff' : '#5a9e3a';

  return (
    <>
      <style>{`
        @keyframes _spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .uf-spinner { border-radius: 50%; animation: _spin 0.85s linear infinite; }
      `}</style>
      <div className="uf-spinner" style={{
        width: dim, height: dim,
        border: `2px solid ${borderColor}`,
        borderTopColor: topColor,
      }} />
    </>
  );
};


// ─── Button Loader ────────────────────────────────────────────────────────
export const ButtonLoader = ({ text = 'Loading...' }) => (
  <>
    <style>{`
      @keyframes _bspin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .btn-loader-ring {
        width: 14px; height: 14px;
        border-radius: 50%;
        border: 2px solid rgba(255,255,255,0.3);
        border-top-color: #fff;
        animation: _bspin 0.8s linear infinite;
        flex-shrink: 0;
      }
    `}</style>
    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div className="btn-loader-ring" />
      <span>{text}</span>
    </span>
  </>
);


// ─── Card Skeleton ────────────────────────────────────────────────────────
export const CardSkeleton = ({ count = 1 }) => (
  <>
    <style>{`
      @keyframes _shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .skel-shimmer {
        background: linear-gradient(90deg, #f0ede8 25%, #e8e3db 50%, #f0ede8 75%);
        background-size: 400px 100%;
        animation: _shimmer 1.4s ease-in-out infinite;
        border-radius: 6px;
      }
      .skel-card {
        background: #fff;
        border-radius: 16px;
        border: 1px solid #eee8dc;
        padding: 24px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
        overflow: hidden;
        position: relative;
      }
      .skel-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 3px;
        background: linear-gradient(90deg, #a8d490, #d4a853, #a8d490);
        background-size: 200% 100%;
        animation: _shimmer 2s linear infinite;
      }
    `}</style>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="skel-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div className="skel-shimmer" style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skel-shimmer" style={{ height: 14, width: '55%', marginBottom: 8 }} />
            <div className="skel-shimmer" style={{ height: 10, width: '35%' }} />
          </div>
        </div>
        <div className="skel-shimmer" style={{ height: 10, width: '100%', marginBottom: 8 }} />
        <div className="skel-shimmer" style={{ height: 10, width: '85%', marginBottom: 8 }} />
        <div className="skel-shimmer" style={{ height: 10, width: '70%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {[40, 60, 50].map((w, j) => (
            <div key={j} className="skel-shimmer" style={{ height: 24, width: w, borderRadius: 99 }} />
          ))}
        </div>
      </div>
    ))}
  </>
);


// ─── Table Skeleton ───────────────────────────────────────────────────────
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <>
    <style>{`
      @keyframes _tshimmer {
        0%   { background-position: -400px 0; }
        100% { background-position: 400px 0; }
      }
      .tskel {
        background: linear-gradient(90deg, #f0ede8 25%, #e8e3db 50%, #f0ede8 75%);
        background-size: 400px 100%;
        animation: _tshimmer 1.4s ease-in-out infinite;
        border-radius: 4px;
      }
    `}</style>
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #eee8dc', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 16, padding: '16px 20px',
        background: 'linear-gradient(135deg, #1e3a1e, #2d5c2d)',
      }}>
        {[...Array(columns)].map((_, i) => (
          <div key={i} className="tskel" style={{ height: 12, opacity: 0.3 }} />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, r) => (
        <div key={r} style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 16, padding: '14px 20px',
          borderBottom: '1px solid #f0ede8',
          background: r % 2 === 0 ? '#fffdf8' : '#fff',
          animationDelay: `${r * 1}s`,
        }}>
          {[...Array(columns)].map((_, c) => (
            <div key={c} className="tskel" style={{ height: 10, width: `${60 + Math.random() * 30}%`, animationDelay: `${(r + c) * 0.08}s` }} />
          ))}
        </div>
      ))}
    </div>
  </>
);

export default Loader;