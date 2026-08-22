// src/pages/offline/EmergencyGuide.jsx
import { useState } from "react";
import { EMERGENCY_GUIDE, FERTILIZER_GUIDE } from "../../data/offlineKnowledge";

const T = {
  title:       { en: "Emergency Disease Guide", hi: "आपातकालीन रोग गाइड", bn: "জরুরি রোগ গাইড" },
  diseaseTab:  { en: "🦠 Disease Guide", hi: "🦠 रोग गाइड", bn: "🦠 রোগ গাইড" },
  fertRef:     { en: "📋 Fertilizer Ref", hi: "📋 उर्वरक संदर्भ", bn: "📋 সার রেফারেন্স" },
  symptoms:    { en: "Symptoms:", hi: "लक्षण:", bn: "লক্ষণ:" },
  action:      { en: "⚡ Immediate Action:", hi: "⚡ तत्काल कार्रवाई:", bn: "⚡ তাৎক্ষণিক ব্যবস্থা:" },
  high:        { en: "HIGH", hi: "उच्च", bn: "উচ্চ" },
  medium:      { en: "MEDIUM", hi: "मध्यम", bn: "মাঝারি" },
  nLabel:      { en: "N (kg/ac)", hi: "N (किग्रा/एकड़)", bn: "N (কেজি/একর)" },
  pLabel:      { en: "P (kg/ac)", hi: "P (किग्रा/एकड़)", bn: "P (কেজি/একর)" },
  kLabel:      { en: "K (kg/ac)", hi: "K (किग्रा/एकड़)", bn: "K (কেজি/একর)" },
  notes:       { en: "Notes:", hi: "टिप्पणी:", bn: "নোট:" },
};

const CROP_FILTERS = [
  { id: "all",        label: { en: "All",         hi: "सभी",       bn: "সব" } },
  { id: "rice",       label: { en: "🌾 Rice",      hi: "🌾 धान",    bn: "🌾 ধান" } },
  { id: "wheat",      label: { en: "🌿 Wheat",     hi: "🌿 गेहूं",  bn: "🌿 গম" } },
  { id: "vegetables", label: { en: "🥦 Veggies",   hi: "🥦 सब्जियां", bn: "🥦 সবজি" } },
  { id: "fruits",     label: { en: "🍎 Fruits",    hi: "🍎 फल",     bn: "🍎 ফল" } },
];

const Styles = () => (
  <style>{`
    .emer-wrap {
      padding: 16px;
      font-family: 'Rajdhani', 'Noto Sans Devanagari', sans-serif;
      color: #e0fff0;
    }

    /* title */
    .emer-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
    .emer-title-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, #1a0404, #2a0808);
      border: 1px solid #ff444440; box-shadow: 0 0 12px #ff444430;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .emer-title-text {
      font-size: 16px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #ff6666;
      text-shadow: 0 0 12px #ff444460;
    }

    /* tabs */
    .emer-tabs {
      display: flex; gap: 8px; margin-bottom: 18px;
      background: #0f0404; border: 1px solid #ff444420;
      border-radius: 14px; padding: 4px;
    }
    .emer-tab-btn {
      flex: 1; padding: 9px 8px; border-radius: 10px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
      text-transform: uppercase; border: 1px solid transparent;
      background: transparent; color: #7a3a3a; cursor: pointer;
      font-family: inherit; transition: all 0.25s;
    }
    .emer-tab-btn:hover { color: #ff6666; background: #ff44441a; }
    .emer-tab-btn.active {
      background: linear-gradient(135deg, #ff444420, #ff444410);
      border-color: #ff444450; color: #ff6666;
      box-shadow: 0 0 12px #ff444428;
    }
    /* fert tab active is green */
    .emer-tab-btn.fert-active {
      background: linear-gradient(135deg, #00ff8818, #00ff8808);
      border-color: #00ff8850; color: #00ff88;
      box-shadow: 0 0 12px #00ff8828;
    }

    /* filter strip */
    .filter-strip {
      display: flex; gap: 6px; overflow-x: auto;
      padding-bottom: 8px; margin-bottom: 14px;
    }
    .filter-strip::-webkit-scrollbar { display: none; }
    .filter-btn {
      flex-shrink: 0; font-size: 11px; font-weight: 700;
      padding: 6px 12px; border-radius: 20px;
      border: 1px solid #ff444430; background: #0f0404;
      color: #7a3a3a; cursor: pointer; font-family: inherit;
      transition: all 0.2s; letter-spacing: 0.3px;
    }
    .filter-btn:hover { color: #ff8888; background: #ff444415; }
    .filter-btn.active {
      background: #ff444420; border-color: #ff6666;
      color: #ff6666; box-shadow: 0 0 8px #ff444430;
    }

    /* disease card */
    .disease-card {
      border-radius: 14px; overflow: hidden;
      margin-bottom: 10px; border: 1px solid;
      transition: all 0.2s;
    }
    .disease-card.high  { border-color: #ff444440; }
    .disease-card.med   { border-color: #ffb30040; }

    .disease-card-header {
      width: 100%; display: flex; align-items: center;
      justify-content: space-between; padding: 12px 14px;
      text-align: left; cursor: pointer; border: none;
      font-family: inherit; transition: all 0.2s;
    }
    .disease-card.high .disease-card-header { background: #1a0404; }
    .disease-card.med  .disease-card-header { background: #1a0f00; }
    .disease-card-header:hover { filter: brightness(1.15); }

    .severity-badge {
      font-size: 9px; font-weight: 700; letter-spacing: 0.8px;
      padding: 3px 8px; border-radius: 20px; flex-shrink: 0;
    }
    .badge-high { background: #ff444430; color: #ff6666; border: 1px solid #ff444450; }
    .badge-med  { background: #ffb30030; color: #ffb300; border: 1px solid #ffb30050; }

    .disease-name { font-size: 13px; font-weight: 700; color: #e0c8c8; margin-left: 10px; flex: 1; }
    .expand-arrow { color: #4a3030; font-size: 11px; transition: transform 0.2s; flex-shrink: 0; }
    .expand-arrow.open { transform: rotate(180deg); }

    .disease-body {
      padding: 12px 14px; border-top: 1px solid;
      animation: fadeSlideUp 0.2s ease;
    }
    .disease-card.high .disease-body { background: #0f0303; border-color: #ff444420; }
    .disease-card.med  .disease-body { background: #0f0900; border-color: #ffb30020; }

    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .symptom-box {
      background: #0a0a0a; border: 1px solid #ffffff12;
      border-radius: 9px; padding: 10px 12px; margin-bottom: 8px;
    }
    .symptom-label { font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #7a5a5a; margin-bottom: 5px; }
    .symptom-text { font-size: 12px; color: #c0a8a8; line-height: 1.5; }

    .action-box { border-radius: 9px; padding: 10px 12px; border: 1px solid; }
    .disease-card.high .action-box { background: #1a0404; border-color: #ff444430; border-left: 3px solid #ff6666; }
    .disease-card.med  .action-box { background: #1a0f00; border-color: #ffb30030; border-left: 3px solid #ffb300; }
    .action-label { font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; margin-bottom: 5px; }
    .disease-card.high .action-label { color: #ff6666; }
    .disease-card.med  .action-label { color: #ffb300; }
    .action-text { font-size: 12px; color: #e0c8c8; line-height: 1.5; font-weight: 600; }

    /* fert table */
    .fert-card {
      background: #041a0d; border: 1px solid #00ff8825;
      border-radius: 14px; padding: 14px; margin-bottom: 10px;
    }
    .fert-card-name { font-size: 14px; font-weight: 700; color: #00ff88; margin-bottom: 12px; letter-spacing: 0.3px; }
    .fert-npk-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 7px; margin-bottom: 10px; }
    .fert-npk-cell { border-radius: 9px; padding: 9px 6px; text-align: center; }
    .fert-npk-n { background: #051e10; border: 1px solid #00ff8830; }
    .fert-npk-p { background: #05101e; border: 1px solid #0088ff30; }
    .fert-npk-k { background: #1e0f05; border: 1px solid #ff880030; }
    .fert-npk-val { font-size: 18px; font-weight: 700; line-height: 1; }
    .fert-npk-n .fert-npk-val { color: #00ff88; text-shadow: 0 0 8px #00ff8860; }
    .fert-npk-p .fert-npk-val { color: #44aaff; text-shadow: 0 0 8px #44aaff60; }
    .fert-npk-k .fert-npk-val { color: #ff9900; text-shadow: 0 0 8px #ff990060; }
    .fert-npk-lbl { font-size: 9px; margin-top: 4px; font-weight: 700; letter-spacing: 0.3px; }
    .fert-npk-n .fert-npk-lbl { color: #2a6a3a; }
    .fert-npk-p .fert-npk-lbl { color: #1a4a6a; }
    .fert-npk-k .fert-npk-lbl { color: #6a3a1a; }
    .fert-notes {
      font-size: 11px; color: #4a7a5e; line-height: 1.55;
      background: #030f06; border: 1px solid #00ff8815;
      border-radius: 8px; padding: 9px 11px;
    }
    .fert-notes-lbl { font-size: 10px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; color: #2a5a3e; margin-bottom: 5px; }
  `}</style>
);

export default function EmergencyGuide({ lang }) {
  const [filter, setFilter]   = useState("all");
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab]         = useState("disease");

  const filtered = EMERGENCY_GUIDE.filter(e => filter === "all" || e.crop === filter);

  return (
    <div className="emer-wrap">
      <Styles />

      <div className="emer-title-row">
        <div className="emer-title-icon">🚨</div>
        <span className="emer-title-text">{T.title[lang]}</span>
      </div>

      {/* Tab switcher */}
      <div className="emer-tabs">
        <button onClick={() => setTab("disease")}
          className={`emer-tab-btn ${tab === "disease" ? "active" : ""}`}>
          {T.diseaseTab[lang]}
        </button>
        <button onClick={() => setTab("fert")}
          className={`emer-tab-btn ${tab === "fert" ? "fert-active" : ""}`}>
          {T.fertRef[lang]}
        </button>
      </div>

      {tab === "disease" ? (
        <>
          {/* Crop filter */}
          <div className="filter-strip">
            {CROP_FILTERS.map(cf => (
              <button key={cf.id} onClick={() => setFilter(cf.id)}
                className={`filter-btn ${filter === cf.id ? "active" : ""}`}>
                {cf.label[lang] || cf.label.en}
              </button>
            ))}
          </div>

          {/* Disease cards */}
          {filtered.map(entry => {
            const data = entry[lang] || entry.en;
            const isOpen = expanded === entry.id;
            const isHigh = entry.severity === "high";
            return (
              <div key={entry.id} className={`disease-card ${isHigh ? "high" : "med"}`}>
                <button className="disease-card-header" onClick={() => setExpanded(isOpen ? null : entry.id)}>
                  <span className={`severity-badge ${isHigh ? "badge-high" : "badge-med"}`}>
                    {isHigh ? T.high[lang] : T.medium[lang]}
                  </span>
                  <span className="disease-name">{data.name}</span>
                  <span className={`expand-arrow ${isOpen ? "open" : ""}`}>▼</span>
                </button>
                {isOpen && (
                  <div className="disease-body">
                    <div className="symptom-box">
                      <p className="symptom-label">{T.symptoms[lang]}</p>
                      <p className="symptom-text">{data.symptoms}</p>
                    </div>
                    <div className="action-box">
                      <p className="action-label">{T.action[lang]}</p>
                      <p className="action-text">{data.immediate}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </>
      ) : (
        /* Fertilizer reference */
        <div>
          {Object.entries(FERTILIZER_GUIDE).map(([key, guide]) => {
            const g = guide[lang] || guide.en;
            return (
              <div key={key} className="fert-card">
                <p className="fert-card-name">{g.crop}</p>
                <div className="fert-npk-row">
                  <div className="fert-npk-cell fert-npk-n">
                    <p className="fert-npk-val">{g.n}</p>
                    <p className="fert-npk-lbl">{T.nLabel[lang]}</p>
                  </div>
                  <div className="fert-npk-cell fert-npk-p">
                    <p className="fert-npk-val">{g.p}</p>
                    <p className="fert-npk-lbl">{T.pLabel[lang]}</p>
                  </div>
                  <div className="fert-npk-cell fert-npk-k">
                    <p className="fert-npk-val">{g.k}</p>
                    <p className="fert-npk-lbl">{T.kLabel[lang]}</p>
                  </div>
                </div>
                <div className="fert-notes">
                  <p className="fert-notes-lbl">{T.notes[lang]}</p>
                  {g.notes}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}