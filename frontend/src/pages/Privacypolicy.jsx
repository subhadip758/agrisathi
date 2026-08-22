import React, { useState } from 'react';
import { useLanguage } from "../context/LanguageContext";
import privacyTranslations from "../i18n/privacyTranslations";

const PrivacyPolicy = () => {
  const { language } = useLanguage();

  const t = privacyTranslations.page[language] || privacyTranslations.page.en;
  const sections = privacyTranslations.sections[language] || privacyTranslations.sections.en;

  const [activeSection, setActiveSection] = useState(sections[0].id);

  const active = sections.find(s => s.id === activeSection);


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Jost:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .pp-root {
          min-height: 100vh;
          background: #f5f0e8;
          font-family: 'Jost', sans-serif;
          color: #1e2d1e;
          position: relative;
          overflow-x: hidden;
        }
        .pp-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse at 100% 0%, rgba(90,143,58,0.08) 0%, transparent 55%),
            radial-gradient(ellipse at 0% 100%, rgba(212,168,83,0.07) 0%, transparent 55%);
          pointer-events: none;
        }

        .pp-inner {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 80px;
        }

        /* Nav */
        .pp-nav {
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(90,143,58,0.15);
          margin: 0 -24px;
          padding: 18px 24px;
          position: sticky;
          top: 0;
          background: rgba(245,240,232,0.92);
          backdrop-filter: blur(10px);
          z-index: 100;
        }
        .pp-nav-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: #2d5a1e;
          font-weight: 600;
          display: flex; align-items: center; gap: 10px;
        }
        .pp-nav-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #5a8f3a;
          background: rgba(90,143,58,0.1);
          border: 1px solid rgba(90,143,58,0.25);
          padding: 4px 12px;
          border-radius: 999px;
        }

        /* Hero */
        .pp-hero {
          padding: 64px 0 48px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 48px;
        }
        @media (max-width: 760px) {
          .pp-hero { flex-direction: column; }
          .pp-hero-visual { display: none; }
        }
        .pp-hero-left { flex: 1; }
        .pp-hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #5a8f3a;
          margin-bottom: 20px;
        }
        .pp-hero-tag::before {
          content: '';
          width: 28px; height: 1px;
          background: #5a8f3a;
          opacity: 0.5;
        }
        .pp-hero h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5.5vw, 62px);
          font-weight: 600;
          color: #1e3a1e;
          line-height: 1.08;
          margin-bottom: 20px;
          letter-spacing: -0.3px;
        }
        .pp-hero h1 em { font-style: italic; color: #5a8f3a; }
        .pp-hero-desc {
          font-size: 15px;
          color: #5a4a2e;
          line-height: 1.8;
          font-weight: 300;
          max-width: 440px;
          margin-bottom: 32px;
        }
        .pp-hero-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .pp-hero-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 14px;
          background: rgba(90,143,58,0.08);
          border: 1px solid rgba(90,143,58,0.2);
          border-radius: 999px;
          color: #3d6b1e;
        }

        .pp-hero-visual {
          width: 200px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 16px;
        }
        .pp-hero-visual-card {
          background: #fff;
          border: 1px solid rgba(90,143,58,0.2);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 12px rgba(90,143,58,0.06);
        }
        .pp-hero-visual-icon {
          font-size: 20px;
          width: 38px; height: 38px;
          background: rgba(90,143,58,0.08);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-hero-visual-label {
          font-size: 12px;
          font-weight: 600;
          color: #1e3a1e;
        }
        .pp-hero-visual-sub {
          font-size: 11px;
          color: #8a7040;
          font-weight: 300;
          margin-top: 1px;
        }

        /* Divider */
        .pp-divider {
          display: flex; align-items: center; gap: 16px; margin-bottom: 40px;
        }
        .pp-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, rgba(90,143,58,0.25), transparent); }
        .pp-divider-icon { font-size: 16px; opacity: 0.5; }

        /* Two-column layout */
        .pp-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 24px;
          align-items: start;
        }
        @media (max-width: 760px) {
          .pp-layout { grid-template-columns: 1fr; }
        }

        /* Sidebar */
        .pp-sidebar {
          position: sticky;
          top: 80px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pp-sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          font-size: 13px;
          font-weight: 400;
          color: #5a4a2e;
        }
        .pp-sidebar-item:hover {
          background: rgba(90,143,58,0.06);
          color: #2d5a1e;
        }
        .pp-sidebar-item.active {
          background: #fff;
          border-color: rgba(90,143,58,0.2);
          color: #1e3a1e;
          font-weight: 500;
          box-shadow: 0 2px 10px rgba(90,143,58,0.08);
        }
        .pp-sidebar-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #c8d8c0;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .pp-sidebar-item.active .pp-sidebar-dot {
          background: #5a8f3a;
        }

        /* Main content */
        .pp-content {
          background: #fff;
          border: 1px solid rgba(90,143,58,0.15);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(90,143,58,0.06);
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pp-content-header {
          padding: 32px 36px 28px;
          border-bottom: 1px solid #f0ebe0;
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .pp-content-emoji {
          font-size: 28px;
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .pp-content-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 600;
          color: #1e3a1e;
        }
        .pp-content-title-sub {
          font-size: 13px;
          color: #8a7040;
          font-weight: 300;
          margin-top: 3px;
        }

        .pp-content-body {
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pp-item {
          display: flex;
          gap: 16px;
          padding: 20px;
          border-radius: 14px;
          border: 1px solid #f0ebe0;
          background: #fdfaf5;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .pp-item:hover {
          border-color: rgba(90,143,58,0.2);
          box-shadow: 0 2px 12px rgba(90,143,58,0.06);
        }
        .pp-item-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-style: italic;
          color: rgba(90,143,58,0.25);
          min-width: 28px;
          line-height: 1;
          padding-top: 2px;
        }
        .pp-item-label {
          font-size: 14px;
          font-weight: 600;
          color: #1e3a1e;
          margin-bottom: 6px;
        }
        .pp-item-desc {
          font-size: 13.5px;
          color: #6b5c3e;
          line-height: 1.75;
          font-weight: 300;
        }

        /* Consent banner */
        .pp-consent {
          margin-top: 32px;
          padding: 24px 28px;
          background: linear-gradient(135deg, #1e3a1e, #2d5c2d);
          border-radius: 16px;
          color: #e8e0d0;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .pp-consent-icon { font-size: 24px; margin-top: 2px; }
        .pp-consent-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 17px;
          font-weight: 600;
          color: #a8d490;
          margin-bottom: 6px;
        }
        .pp-consent-text {
          font-size: 13px;
          color: rgba(232,224,208,0.6);
          line-height: 1.7;
          font-weight: 300;
        }
        .pp-consent-text a { color: #a8d490; text-decoration: underline; text-underline-offset: 3px; }

        .pp-last-updated {
          text-align: center;
          margin-top: 48px;
          font-size: 12px;
          color: #b0a080;
          letter-spacing: 1px;
          font-weight: 300;
          text-transform: uppercase;
        }
      `}</style>

      <div className="pp-root">
        <div className="pp-inner">
          {/* Nav */}
          <nav className="pp-nav">
            <div className="pp-nav-brand">🌾 {t.navBrand}</div>
            <span className="pp-nav-badge">{t.navBadge}</span>
          </nav>

          {/* Hero */}
          <div className="pp-hero">
            <div className="pp-hero-left">
              <div className="pp-hero-tag">{t.heroTag}</div>
              <h1>{t.title1}<br /><em>{t.title2}</em></h1>
              <p className="pp-hero-desc">
                {t.desc}
              </p>
              <div className="pp-hero-pills">
                {t.pills.map((pill, i) => (
                  <span key={i} className="pp-hero-pill">{pill}</span>
                ))}
              </div>
            </div>
            <div className="pp-hero-visual">
              {t.cards.map((c, i) => (
                <div key={i} className="pp-hero-visual-card">
                  <div className="pp-hero-visual-icon">{c.icon}</div>
                  <div>
                    <div className="pp-hero-visual-label">{c.label}</div>
                    <div className="pp-hero-visual-sub">{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pp-divider">
            <div className="pp-divider-line" />
            <div className="pp-divider-icon">🌿</div>
            <div className="pp-divider-line" />
          </div>

          {/* Layout */}
          <div className="pp-layout">
            {/* Sidebar */}
            <div className="pp-sidebar">
              {sections.map(sec => (
                <div
                  key={sec.id}
                  className={`pp-sidebar-item ${activeSection === sec.id ? 'active' : ''}`}
                  onClick={() => setActiveSection(sec.id)}
                >
                  <div className="pp-sidebar-dot" />
                  <span>{sec.emoji} {sec.title}</span>
                </div>
              ))}
            </div>

            {/* Content */}
            <div>
              {active && (
                <div className="pp-content" key={active.id}>
                  <div className="pp-content-header">
                    <div
                      className="pp-content-emoji"
                      style={{ background: `${active.color}18` }}
                    >
                      {active.emoji}
                    </div>
                    <div>
                      <div className="pp-content-title">{active.title}</div>
                      <div className="pp-content-title-sub">
                        Section {sections.findIndex(s => s.id === active.id) + 1} of {sections.length}
                      </div>
                    </div>
                  </div>
                  <div className="pp-content-body">
                    {active.items.map((item, i) => (
                      <div key={i} className="pp-item">
                        <div className="pp-item-num">{String(i + 1).padStart(2, '0')}</div>
                        <div>
                          <div className="pp-item-label">{item.label}</div>
                          <div className="pp-item-desc">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consent */}
              <div className="pp-consent">
                <div className="pp-consent-icon">🤝</div>
                <div>
                  <div className="pp-consent-title">{t.consentTitle}</div>
                  <p className="pp-consent-text">
                    {t.consentText}{' '}
                    <a href="mailto:privacy@urbanfarming.com">privacy@urbanfarming.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pp-last-updated">{t.lastUpdated}</div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;