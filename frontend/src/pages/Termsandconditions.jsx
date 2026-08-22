import React, { useState, useEffect } from 'react';
import { useLanguage } from "../context/LanguageContext";
import tncTranslations from "../i18n/tnc";

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const { language } = useLanguage();
  const t =
  tncTranslations.page[language] ||
  tncTranslations.page.en;

const sections =
  tncTranslations.sections[language] ||
  tncTranslations.sections.en;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .tnc-root {
          min-height: 100vh;
          background: #0e1a0f;
          font-family: 'Jost', sans-serif;
          color: #e8e0d0;
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative background */
        .tnc-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 0% 0%, rgba(74,124,59,0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(212,168,83,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(14,26,15,0) 0%, #0e1a0f 100%);
          pointer-events: none;
          z-index: 0;
        }

        /* Grid texture */
        .tnc-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(74,124,59,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74,124,59,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .tnc-inner {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* Floating nav */
        .tnc-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          padding: 14px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(74,124,59,0.2);
          background: rgba(14,26,15,0.85);
          backdrop-filter: blur(12px);
          margin: 0 -24px;
          padding: 14px 24px;
          transition: box-shadow 0.3s;
        }
        .tnc-nav.scrolled {
          box-shadow: 0 4px 24px rgba(0,0,0,0.4);
        }
        .tnc-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: #a8d490;
          font-weight: 600;
        }
        .tnc-nav-badge {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #6aaa50;
          background: rgba(74,124,59,0.15);
          border: 1px solid rgba(74,124,59,0.3);
          padding: 4px 12px;
          border-radius: 999px;
        }

        /* Hero */
        .tnc-hero {
          padding: 72px 0 56px;
          text-align: center;
          position: relative;
        }
        .tnc-hero-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #6aaa50;
          margin-bottom: 24px;
        }
        .tnc-hero-label::before,
        .tnc-hero-label::after {
          content: '';
          width: 32px;
          height: 1px;
          background: #6aaa50;
          opacity: 0.5;
        }
        .tnc-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(40px, 7vw, 72px);
          font-weight: 600;
          color: #e8e0d0;
          line-height: 1.05;
          margin-bottom: 20px;
          letter-spacing: -0.5px;
        }
        .tnc-hero h1 em {
          font-style: italic;
          color: #a8d490;
        }
        .tnc-hero-desc {
          max-width: 520px;
          margin: 0 auto 36px;
          font-size: 15px;
          color: rgba(232,224,208,0.55);
          line-height: 1.8;
          font-weight: 300;
        }
        .tnc-hero-meta {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          padding: 12px 28px;
          background: rgba(74,124,59,0.08);
          border: 1px solid rgba(74,124,59,0.2);
          border-radius: 99px;
          font-size: 12px;
          color: rgba(232,224,208,0.5);
          font-weight: 300;
          letter-spacing: 0.5px;
        }
        .tnc-hero-meta span { display: flex; align-items: center; gap: 6px; }
        .tnc-hero-meta-dot {
          width: 3px; height: 3px;
          background: rgba(232,224,208,0.3);
          border-radius: 50%;
        }

        /* Divider */
        .tnc-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 8px 0 48px;
        }
        .tnc-divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(74,124,59,0.3), transparent);
        }
        .tnc-divider-icon {
          font-size: 18px;
          opacity: 0.6;
        }

        /* Section cards */
        .tnc-section {
          margin-bottom: 16px;
          border: 1px solid rgba(74,124,59,0.15);
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.02);
          transition: border-color 0.25s, background 0.25s;
          cursor: pointer;
          animation: fadeUp 0.5s ease both;
        }
        .tnc-section:hover,
        .tnc-section.active {
          border-color: rgba(106,170,80,0.4);
          background: rgba(74,124,59,0.06);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tnc-section-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px 28px;
        }
        .tnc-section-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px;
          font-weight: 400;
          color: rgba(106,170,80,0.5);
          font-style: italic;
          min-width: 28px;
        }
        .tnc-section-emoji {
          font-size: 22px;
          width: 44px; height: 44px;
          background: rgba(74,124,59,0.1);
          border: 1px solid rgba(74,124,59,0.2);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .tnc-section.active .tnc-section-emoji {
          background: rgba(74,124,59,0.25);
        }
        .tnc-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 600;
          color: #e8e0d0;
          flex: 1;
        }
        .tnc-section-chevron {
          width: 28px; height: 28px;
          border: 1px solid rgba(74,124,59,0.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.3s, background 0.2s;
          color: #6aaa50;
          flex-shrink: 0;
        }
        .tnc-section.active .tnc-section-chevron {
          transform: rotate(180deg);
          background: rgba(74,124,59,0.2);
        }

        .tnc-section-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }
        .tnc-section.active .tnc-section-body {
          max-height: 300px;
        }
        .tnc-section-body-inner {
          padding: 0 28px 24px 92px;
          font-size: 14.5px;
          color: rgba(232,224,208,0.6);
          line-height: 1.85;
          font-weight: 300;
          border-top: 1px solid rgba(74,124,59,0.1);
          padding-top: 18px;
        }

        /* Footer note */
        .tnc-footer-note {
          margin-top: 48px;
          padding: 28px 32px;
          background: rgba(74,124,59,0.06);
          border: 1px solid rgba(74,124,59,0.2);
          border-radius: 16px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .tnc-footer-note-icon {
          font-size: 24px;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .tnc-footer-note-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 600;
          color: #a8d490;
          margin-bottom: 6px;
        }
        .tnc-footer-note-text {
          font-size: 13.5px;
          color: rgba(232,224,208,0.5);
          line-height: 1.75;
          font-weight: 300;
        }
        .tnc-footer-note-text a {
          color: #6aaa50;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .tnc-last-updated {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: rgba(232,224,208,0.25);
          letter-spacing: 1px;
          font-weight: 300;
          text-transform: uppercase;
        }
      `}</style>

      <div className="tnc-root">
        <div className="tnc-inner">
          {/* Nav */}
          <nav className={`tnc-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="tnc-nav-brand">
              🌾 {t.brand}
            </div>
            <span className="tnc-nav-badge">{t.badge}</span>
          </nav>

          {/* Hero */}
          <div className="tnc-hero">
            <div className="tnc-hero-label">{t.heroLabel}</div>
            <h1>
            {t.title1}<br /><em>{t.title2}</em>
            </h1>
            <p className="tnc-hero-desc">
            {t.description}
            </p>
            <div className="tnc-hero-meta">
              <span>📅 {t.updated}</span>
              <div className="tnc-hero-meta-dot" />
              <span>⏱ {t.readTime}</span>
              <div className="tnc-hero-meta-dot" />
              <span>🌍 {t.global}</span>
            </div>
          </div>

          <div className="tnc-divider">
            <div className="tnc-divider-line" />
            <div className="tnc-divider-icon">🌿</div>
            <div className="tnc-divider-line" />
          </div>

          {/* Sections */}
          {sections.map((sec, i) => (
            <div
              key={sec.id}
              className={`tnc-section ${activeSection === sec.id ? 'active' : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
              onClick={() => setActiveSection(activeSection === sec.id ? null : sec.id)}
            >
              <div className="tnc-section-header">
                <span className="tnc-section-num">{sec.number}</span>
                <div className="tnc-section-emoji">{sec.emoji}</div>
                <div className="tnc-section-title">{sec.title}</div>
                <div className="tnc-section-chevron">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="tnc-section-body">
                <div className="tnc-section-body-inner">{sec.content}</div>
              </div>
            </div>
          ))}

          {/* Footer Note */}
          <div className="tnc-footer-note">
            <div className="tnc-footer-note-icon">💬</div>
            <div>
              <div className="tnc-footer-note-title">{t.footerTitle}</div>
              <p className="tnc-footer-note-text">
              {t.footerText}{' '}
                <a href="mailto:legal@urbanfarming.com">legal@urbanfarming.com</a>. {t.footerLine}
              </p>
            </div>
          </div>

          <div className="tnc-last-updated">{t.lastUpdated}</div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;