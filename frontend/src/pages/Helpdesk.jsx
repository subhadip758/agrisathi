import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import helpdeskTranslations from '../i18n/Helpdesktranslations';

/* ════════════════════════════════════════════════════════════════════
   HELPDESK — MULTILINGUAL
   Language is controlled globally via LanguageContext.
   All text sourced exclusively from helpdeskTranslations[lang].
════════════════════════════════════════════════════════════════════ */
const Helpdesk = () => {
  // ── Global language from context ─────────────────────────────────
  const { language } = useLanguage();
  const t = helpdeskTranslations[language] ?? helpdeskTranslations.en;

  // ── FAQ state ─────────────────────────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openFaq,          setOpenFaq]          = useState(null);

  // ── Officer form state ────────────────────────────────────────────
  const [officerForm,       setOfficerForm]      = useState({ name:'', phone:'', district:'', topic:'', message:'' });
  const [officerSubmitted,  setOfficerSubmitted] = useState(false);
  const [officerSubmitting, setOfficerSubmitting]= useState(false);

  // ── Complaint form state ──────────────────────────────────────────
  const [complaintForm,       setComplaintForm]      = useState({ name:'', email:'', category:'', description:'' });
  const [complaintSubmitted,  setComplaintSubmitted] = useState(false);
  const [complaintSubmitting, setComplaintSubmitting]= useState(false);

  // Reset FAQ open state when language changes so stale keys don't linger
  const prevLang = React.useRef(language);
  if (prevLang.current !== language) {
    prevLang.current = language;
    setSelectedCategory(null);
    setOpenFaq(null);
  }

  const visibleCategories = t.faq.categories.filter(
    cat => !selectedCategory || cat.id === selectedCategory
  );

  const handleOfficerSubmit = () => {
    if (!officerForm.name || !officerForm.phone || !officerForm.district || !officerForm.topic) return;
    setOfficerSubmitting(true);
    setTimeout(() => { setOfficerSubmitting(false); setOfficerSubmitted(true); }, 1000);
  };

  const handleComplaintSubmit = () => {
    if (!complaintForm.name || !complaintForm.email || !complaintForm.category || !complaintForm.description) return;
    setComplaintSubmitting(true);
    setTimeout(() => { setComplaintSubmitting(false); setComplaintSubmitted(true); }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Lato:wght@300;400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .helpdesk-root {
          min-height: 100vh;
          background-color: #f7f3ec;
          background-image:
            radial-gradient(ellipse at 10% 0%,  rgba(164,195,138,.18) 0%, transparent 55%),
            radial-gradient(ellipse at 90% 100%, rgba(212,168,83,.12)  0%, transparent 55%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a07850' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
          font-family: 'Lato', sans-serif;
          color: #2e2010;
        }
        .hd-inner { max-width: 1200px; margin: 0 auto; padding: 48px 24px 72px; }

        /* ── header ── */
        .hd-header { text-align: center; margin-bottom: 56px; }
        .hd-header-badge { display: inline-flex; align-items: center; gap: 8px; background: #e8f0e4; border: 1px solid #b5cfaa; color: #3d6b3d; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 6px 16px; border-radius: 999px; margin-bottom: 20px; }
        .hd-header h1 { font-family: 'Playfair Display', serif; font-size: clamp(30px,5vw,50px); color: #1e3a1e; line-height: 1.15; margin-bottom: 16px; }
        .hd-header h1 span { color: #5a8f3a; }
        .hd-header p { font-size: 16px; color: #6b5c3e; max-width: 480px; margin: 0 auto; line-height: 1.7; font-weight: 300; }
        .hd-divider { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 28px; }
        .hd-divider-line { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, #b5a070); }

        /* ── stats ── */
        .hd-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #e0d5be; border-radius: 14px; overflow: hidden; margin-bottom: 40px; }
        .hd-stat { background: #fffdf8; padding: 16px; text-align: center; }
        .hd-stat-val { font-family: 'Playfair Display', serif; font-size: 22px; color: #5a8f3a; }
        .hd-stat-label { font-size: 11px; color: #8a7040; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; margin-top: 2px; }

        /* ── grid ── */
        .hd-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
        @media (max-width: 900px) { .hd-grid { grid-template-columns: 1fr; } }

        /* ── card ── */
        .hd-card { background: #fffdf8; border-radius: 20px; border: 1px solid #e0d5be; box-shadow: 0 4px 24px rgba(80,50,10,.07), 0 1px 4px rgba(80,50,10,.05); padding: 32px; position: relative; overflow: hidden; }
        .hd-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #5a8f3a, #d4a853, #c0522b); border-radius: 20px 20px 0 0; }
        .hd-officer-card::before  { background: linear-gradient(90deg, #2d5c2d, #5a8f3a, #a0c878) !important; }
        .hd-complaint-card::before{ background: linear-gradient(90deg, #8b2500, #c0522b, #e08060) !important; }
        .hd-card-title { font-family: 'Playfair Display', serif; font-size: 20px; color: #1e3a1e; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
        .hd-card-title-icon { width: 36px; height: 36px; background: #e8f0e4; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }

        /* ── pills ── */
        .hd-pills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }
        .hd-pill { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; cursor: pointer; border: 1.5px solid transparent; transition: all .2s; background: #f0ebe0; color: #5a4020; font-family: 'Lato', sans-serif; }
        .hd-pill:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.1); }
        .hd-pill.active { background: #1e3a1e; color: #f0ebe0; border-color: #1e3a1e; }

        /* ── faq ── */
        .hd-cat-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #8a7040; margin: 20px 0 10px; }
        .hd-cat-label:first-child { margin-top: 0; }
        .hd-faq-item { border: 1px solid #e0d5be; border-radius: 12px; margin-bottom: 8px; overflow: hidden; transition: border-color .2s, box-shadow .2s; background: #fffdf8; }
        .hd-faq-item:hover { border-color: #a0c878; box-shadow: 0 2px 12px rgba(90,143,60,.08); }
        .hd-faq-item.open { border-color: #5a8f3a; box-shadow: 0 2px 16px rgba(90,143,60,.12); }
        .hd-faq-btn { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; background: none; border: none; cursor: pointer; text-align: left; gap: 12px; font-family: 'Lato', sans-serif; }
        .hd-faq-q { font-size: 14px; font-weight: 700; color: #1e3a1e; line-height: 1.4; }
        .hd-faq-chevron { flex-shrink: 0; width: 24px; height: 24px; background: #e8f0e4; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform .25s, background .2s; color: #5a8f3a; }
        .hd-faq-item.open .hd-faq-chevron { transform: rotate(180deg); background: #5a8f3a; color: #fff; }
        .hd-faq-answer { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
        .hd-faq-item.open .hd-faq-answer { max-height: 220px; }
        .hd-faq-answer-inner { padding: 14px 20px 16px; font-size: 13.5px; color: #5a4020; line-height: 1.75; font-weight: 300; border-top: 1px dashed #e0d5be; }

        /* ── contact card ── */
        .hd-contact-card { margin-top: 24px; background: linear-gradient(135deg, #1e3a1e, #2d5c2d); border-radius: 20px; padding: 28px 32px; color: #f0ebe0; position: relative; overflow: hidden; }
        .hd-contact-card::after { content: '🌳'; position: absolute; right: 20px; bottom: -10px; font-size: 80px; opacity: .12; }
        .hd-contact-title { font-family: 'Playfair Display', serif; font-size: 18px; margin-bottom: 6px; }
        .hd-contact-sub { font-size: 13px; color: #a8c89a; margin-bottom: 20px; font-weight: 300; }
        .hd-contact-links-row { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (max-width: 640px) { .hd-contact-links-row { grid-template-columns: 1fr; } }
        .hd-contact-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12); border-radius: 12px; text-decoration: none; color: #f0ebe0; transition: background .2s, transform .2s; }
        .hd-contact-link:hover { background: rgba(255,255,255,.15); transform: translateX(4px); }
        .hd-contact-link-icon { width: 36px; height: 36px; background: rgba(90,143,60,.3); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .hd-contact-link-label { font-size: 12px; color: #a8c89a; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
        .hd-contact-link-value { font-size: 14px; font-weight: 400; margin-top: 1px; }

        /* ── section divider ── */
        .hd-section-divider { display: flex; align-items: center; gap: 16px; margin: 52px 0 36px; }
        .hd-section-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, #e0d5be, transparent); }
        .hd-section-divider-line.right { background: linear-gradient(270deg, #e0d5be, transparent); }
        .hd-section-divider-label { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8a7040; background: #f0ebe0; border: 1px solid #e0d5be; padding: 6px 16px; border-radius: 999px; white-space: nowrap; }

        /* ── officer profiles ── */
        .hd-officer-profiles { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
        @media (max-width: 600px) { .hd-officer-profiles { grid-template-columns: 1fr; } }
        .hd-officer-profile { background: #f0f7ee; border: 1px solid #cde0c4; border-radius: 12px; padding: 14px 12px; text-align: center; }
        .hd-officer-avatar { width: 44px; height: 44px; background: linear-gradient(135deg, #2d5c2d, #5a8f3a); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; margin: 0 auto 8px; }
        .hd-officer-name { font-size: 13px; font-weight: 700; color: #1e3a1e; }
        .hd-officer-role { font-size: 11px; color: #5a8f3a; font-weight: 700; letter-spacing: .3px; margin-top: 2px; }
        .hd-officer-dist { font-size: 11px; color: #8a7040; margin-top: 1px; }

        /* ── form ── */
        .hd-form { display: flex; flex-direction: column; gap: 14px; }
        .hd-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        @media (max-width: 600px) { .hd-form-row { grid-template-columns: 1fr; } }
        .hd-field { display: flex; flex-direction: column; gap: 6px; }
        .hd-field label { font-size: 12px; font-weight: 700; color: #5a4020; letter-spacing: .5px; text-transform: uppercase; }
        .hd-field input, .hd-field select, .hd-field textarea { padding: 11px 14px; border: 1.5px solid #e0d5be; border-radius: 10px; font-size: 14px; font-family: 'Lato', sans-serif; color: #2e2010; background: #fffdf8; outline: none; transition: border-color .2s, box-shadow .2s; width: 100%; }
        .hd-field input:focus, .hd-field select:focus, .hd-field textarea:focus { border-color: #5a8f3a; box-shadow: 0 0 0 3px rgba(90,143,60,.1); }
        .hd-field textarea { resize: vertical; min-height: 90px; }

        /* ── submit ── */
        .hd-submit-btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; border-radius: 12px; border: none; cursor: pointer; font-family: 'Lato', sans-serif; font-size: 14px; font-weight: 700; transition: all .2s; align-self: flex-start; }
        .hd-submit-btn:disabled { opacity: .5; cursor: not-allowed; }
        .hd-submit-btn.green { background: linear-gradient(135deg, #2d5c2d, #5a8f3a); color: #fff; box-shadow: 0 4px 14px rgba(90,143,60,.3); }
        .hd-submit-btn.green:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(90,143,60,.35); }
        .hd-submit-btn.red { background: linear-gradient(135deg, #8b2500, #c0522b); color: #fff; box-shadow: 0 4px 14px rgba(192,82,43,.3); }
        .hd-submit-btn.red:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(192,82,43,.35); }

        /* ── success ── */
        .hd-success { display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 32px 20px; gap: 12px; }
        .hd-success-icon { font-size: 52px; }
        .hd-success h3 { font-family: 'Playfair Display', serif; font-size: 20px; color: #1e3a1e; }
        .hd-success p { font-size: 14px; color: #6b5c3e; line-height: 1.6; max-width: 320px; font-weight: 300; }
        .hd-success-reset { margin-top: 8px; padding: 9px 22px; border-radius: 10px; border: 1.5px solid #e0d5be; background: #f0ebe0; color: #5a4020; font-family: 'Lato', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: all .2s; }
        .hd-success-reset:hover { background: #e0d5be; }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
      `}</style>

      <div className="helpdesk-root">
        <div className="hd-inner">

          {/* ── Header ── */}
          <div className="hd-header">
            <div className="hd-header-badge"><span>🌱</span><span>{t.header.badge}</span></div>
            <h1>{t.header.h1a}<br /><span>{t.header.h1b}</span></h1>
            <p>{t.header.subtitle}</p>
            <div className="hd-divider">
              <div className="hd-divider-line" />
              <span style={{ fontSize: 20 }}>🌾</span>
              <div className="hd-divider-line" style={{ background: 'linear-gradient(90deg, #b5a070, transparent)' }} />
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="hd-stats">
            {t.stats.map(s => (
              <div key={s.label} className="hd-stat">
                <div className="hd-stat-val">{s.val}</div>
                <div className="hd-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* ── FAQ ── */}
          <div className="hd-card" style={{ marginBottom: 0 }}>
            <div className="hd-card-title">
              <div className="hd-card-title-icon">📋</div>
              {t.faq.cardTitle}
            </div>
            <div className="hd-pills">
              <button className={`hd-pill${!selectedCategory ? ' active' : ''}`} onClick={() => setSelectedCategory(null)}>
                {t.faq.pillAll}
              </button>
              {t.faq.categories.map(cat => (
                <button key={cat.id} className={`hd-pill${selectedCategory === cat.id ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}>
                  {cat.emoji} {cat.title}
                </button>
              ))}
            </div>
            <div>
              {visibleCategories.map(cat => (
                <div key={cat.id}>
                  {!selectedCategory && (
                    <div className="hd-cat-label"><span>{cat.emoji}</span><span>{cat.title}</span></div>
                  )}
                  {cat.faqs.map((faq, i) => {
                    const key = `${cat.id}-${i}`;
                    const isOpen = openFaq === key;
                    return (
                      <div key={key} className={`hd-faq-item${isOpen ? ' open' : ''}`}>
                        <button className="hd-faq-btn" onClick={() => setOpenFaq(isOpen ? null : key)}>
                          <span className="hd-faq-q">{faq.question}</span>
                          <span className="hd-faq-chevron">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        </button>
                        <div className="hd-faq-answer">
                          {isOpen && <div className="hd-faq-answer-inner">{faq.answer}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── Contact ── */}
          <div className="hd-contact-card">
            <div className="hd-contact-title">{t.contact.title}</div>
            <div className="hd-contact-sub">{t.contact.subtitle}</div>
            <div className="hd-contact-links-row">
              <a href={`mailto:${t.contact.email.value}`} className="hd-contact-link">
                <div className="hd-contact-link-icon">✉️</div>
                <div>
                  <div className="hd-contact-link-label">{t.contact.email.label}</div>
                  <div className="hd-contact-link-value">{t.contact.email.value}</div>
                </div>
              </a>
              <a href={`tel:${t.contact.phone.value.replace(/[\s-]/g, '')}`} className="hd-contact-link">
                <div className="hd-contact-link-icon">📞</div>
                <div>
                  <div className="hd-contact-link-label">{t.contact.phone.label}</div>
                  <div className="hd-contact-link-value">{t.contact.phone.value}</div>
                </div>
              </a>
            </div>
          </div>

          {/* ════════════ OFFICER SECTION ════════════ */}
          <div className="hd-section-divider">
            <div className="hd-section-divider-line" />
            <div className="hd-section-divider-label">{t.officer.sectionLabel}</div>
            <div className="hd-section-divider-line right" />
          </div>

          <div className="hd-grid">
            {/* Officer form */}
            <div className="hd-card hd-officer-card">
              <div className="hd-card-title">
                <div className="hd-card-title-icon">🧑‍💼</div>
                {t.officer.cardTitle}
              </div>

              <div className="hd-officer-profiles">
                {t.officer.profiles.map(o => (
                  <div key={o.name} className="hd-officer-profile">
                    <div className="hd-officer-avatar">{o.emoji}</div>
                    <div className="hd-officer-name">{o.name}</div>
                    <div className="hd-officer-role">{o.role}</div>
                    <div className="hd-officer-dist">📍 {o.dist}</div>
                  </div>
                ))}
              </div>

              {officerSubmitted ? (
                <div className="hd-success">
                  <div className="hd-success-icon">{t.officer.success.icon}</div>
                  <h3>{t.officer.success.title}</h3>
                  <p>{t.officer.success.message}</p>
                  <button className="hd-success-reset"
                    onClick={() => { setOfficerSubmitted(false); setOfficerForm({ name:'', phone:'', district:'', topic:'', message:'' }); }}>
                    {t.officer.success.reset}
                  </button>
                </div>
              ) : (
                <div className="hd-form">
                  <div className="hd-form-row">
                    <div className="hd-field">
                      <label>{t.officer.form.name.label}</label>
                      <input placeholder={t.officer.form.name.placeholder} value={officerForm.name}
                        onChange={e => setOfficerForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="hd-field">
                      <label>{t.officer.form.phone.label}</label>
                      <input placeholder={t.officer.form.phone.placeholder} value={officerForm.phone}
                        onChange={e => setOfficerForm(f => ({ ...f, phone: e.target.value }))} />
                    </div>
                  </div>
                  <div className="hd-form-row">
                    <div className="hd-field">
                      <label>{t.officer.form.district.label}</label>
                      <select value={officerForm.district} onChange={e => setOfficerForm(f => ({ ...f, district: e.target.value }))}>
                        <option value="">{t.officer.form.district.placeholder}</option>
                        {t.officer.districts.map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="hd-field">
                      <label>{t.officer.form.topic.label}</label>
                      <select value={officerForm.topic} onChange={e => setOfficerForm(f => ({ ...f, topic: e.target.value }))}>
                        <option value="">{t.officer.form.topic.placeholder}</option>
                        {t.officer.topics.map(tp => <option key={tp}>{tp}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="hd-field">
                    <label>
                      {t.officer.form.message.label}&nbsp;
                      <span style={{ color:'#8a7040', textTransform:'none', fontWeight:400 }}>
                        {t.officer.form.message.optionalTag}
                      </span>
                    </label>
                    <textarea placeholder={t.officer.form.message.placeholder} value={officerForm.message}
                      onChange={e => setOfficerForm(f => ({ ...f, message: e.target.value }))} />
                  </div>
                  <button className="hd-submit-btn green"
                    disabled={!officerForm.name || !officerForm.phone || !officerForm.district || !officerForm.topic || officerSubmitting}
                    onClick={handleOfficerSubmit}>
                    {officerSubmitting ? t.officer.form.submitting : t.officer.form.submitBtn}
                  </button>
                  <p style={{ fontSize:12, color:'#8a7040', fontWeight:300, marginTop:-6 }}>{t.officer.form.privacy}</p>
                </div>
              )}
            </div>

            {/* Officer info cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {t.officer.infoCards.map(item => (
                <div key={item.title} style={{ background:'#f0f7ee', border:'1px solid #cde0c4', borderRadius:14, padding:'18px 20px', display:'flex', gap:14, alignItems:'flex-start' }}>
                  <div style={{ width:40, height:40, background:'#e8f0e4', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:'#1e3a1e', marginBottom:4 }}>{item.title}</div>
                    <div style={{ fontSize:12.5, color:'#5a6b40', lineHeight:1.6, fontWeight:300 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ════════════ COMPLAINT SECTION ════════════ */}
          <div className="hd-section-divider" style={{ marginTop:60 }}>
            <div className="hd-section-divider-line" />
            <div className="hd-section-divider-label" style={{ background:'#fdf0ec', borderColor:'#f0cfc4', color:'#7a3010' }}>
              {t.complaint.sectionLabel}
            </div>
            <div className="hd-section-divider-line right" />
          </div>

          <div className="hd-grid">
            {/* Complaint form */}
            <div className="hd-card hd-complaint-card">
              <div className="hd-card-title">
                <div className="hd-card-title-icon" style={{ background:'#fdecea' }}>🐛</div>
                {t.complaint.cardTitle}
              </div>

              {complaintSubmitted ? (
                <div className="hd-success">
                  <div className="hd-success-icon">{t.complaint.success.icon}</div>
                  <h3>{t.complaint.success.title}</h3>
                  <p>{t.complaint.success.message}</p>
                  <button className="hd-success-reset"
                    onClick={() => { setComplaintSubmitted(false); setComplaintForm({ name:'', email:'', category:'', description:'' }); }}>
                    {t.complaint.success.reset}
                  </button>
                </div>
              ) : (
                <div className="hd-form">
                  <div className="hd-form-row">
                    <div className="hd-field">
                      <label>{t.complaint.form.name.label}</label>
                      <input placeholder={t.complaint.form.name.placeholder} value={complaintForm.name}
                        onChange={e => setComplaintForm(f => ({ ...f, name: e.target.value }))} />
                    </div>
                    <div className="hd-field">
                      <label>{t.complaint.form.email.label}</label>
                      <input type="email" placeholder={t.complaint.form.email.placeholder} value={complaintForm.email}
                        onChange={e => setComplaintForm(f => ({ ...f, email: e.target.value }))} />
                    </div>
                  </div>
                  <div className="hd-field">
                    <label>{t.complaint.form.category.label}</label>
                    <select value={complaintForm.category} onChange={e => setComplaintForm(f => ({ ...f, category: e.target.value }))}>
                      <option value="">{t.complaint.form.category.placeholder}</option>
                      {t.complaint.categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="hd-field">
                    <label>{t.complaint.form.description.label}</label>
                    <textarea rows={4} style={{ minHeight:110 }}
                      placeholder={t.complaint.form.description.placeholder}
                      value={complaintForm.description}
                      onChange={e => setComplaintForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                  <button className="hd-submit-btn red"
                    disabled={!complaintForm.name || !complaintForm.email || !complaintForm.category || !complaintForm.description || complaintSubmitting}
                    onClick={handleComplaintSubmit}>
                    {complaintSubmitting ? t.complaint.form.submitting : t.complaint.form.submitBtn}
                  </button>
                  <p style={{ fontSize:12, color:'#8a7040', fontWeight:300, marginTop:-6 }}>{t.complaint.form.privacy}</p>
                </div>
              )}
            </div>

            {/* What happens next + quick links */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ background:'#fffdf8', border:'1px solid #e0d5be', borderRadius:16, padding:'20px 22px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#7a3010', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
                  {t.complaint.whatNext.heading}
                </div>
                {t.complaint.whatNext.steps.map((s, i) => (
                  <div key={s.step} style={{ display:'flex', gap:14, alignItems:'flex-start', paddingBottom:i<2?16:0, marginBottom:i<2?16:0, borderBottom:i<2?'1px dashed #e0d5be':'none' }}>
                    <div style={{ width:34, height:34, background:'linear-gradient(135deg,#8b2500,#c0522b)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:800, color:'#fff', flexShrink:0 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:700, color:'#1e3a1e', marginBottom:3 }}>{s.title}</div>
                      <div style={{ fontSize:12.5, color:'#6b5c3e', lineHeight:1.5, fontWeight:300 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background:'#fdf0ec', border:'1px solid #f0cfc4', borderRadius:14, padding:'18px 20px' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#7a3010', marginBottom:12 }}>{t.complaint.quickLinks.heading}</div>
                {t.complaint.quickLinks.links.map(l => (
                  <a key={l.label} href={l.href}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, textDecoration:'none', color:'#5a4020', fontSize:13.5, fontWeight:400, transition:'background .18s', marginBottom:4, background:'rgba(255,255,255,0.6)' }}
                    onMouseOver={e => e.currentTarget.style.background = '#fff'}
                    onMouseOut={e  => e.currentTarget.style.background = 'rgba(255,255,255,0.6)'}>
                    <span style={{ fontSize:18 }}>{l.icon}</span>
                    {l.label}
                    <span style={{ marginLeft:'auto', fontSize:14, color:'#c0522b' }}>›</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Helpdesk;