// src/pages/offline/Calculators.jsx
import { useState } from "react";
import { FERTILIZER_GUIDE } from "../../data/offlineKnowledge";

const T = {
  title:        { en: "Farm Calculators", hi: "कृषि कैलकुलेटर", bn: "কৃষি ক্যালকুলেটর" },
  waterTab:     { en: "💧 Water", hi: "💧 पानी", bn: "💧 পানি" },
  fertTab:      { en: "🧪 Fertilizer", hi: "🧪 खाद", bn: "🧪 সার" },
  waterTitle:   { en: "Water Requirement Calculator", hi: "पानी आवश्यकता कैलकुलेटर", bn: "পানির প্রয়োজনীয়তা ক্যালকুলেটর" },
  fieldArea:    { en: "Field Area", hi: "खेत का क्षेत्रफल", bn: "মাঠের আয়তন" },
  areaUnit:     { en: "Unit", hi: "इकाई", bn: "একক" },
  cropType:     { en: "Crop", hi: "फसल", bn: "ফসল" },
  stage:        { en: "Crop Stage", hi: "फसल अवस्था", bn: "ফসলের পর্যায়" },
  soilType:     { en: "Soil Type", hi: "मिट्टी का प्रकार", bn: "মাটির ধরন" },
  calcBtn:      { en: "Calculate", hi: "गणना करें", bn: "হিসাব করুন" },
  resultTitle:  { en: "Water Needed", hi: "पानी की जरूरत", bn: "পানির প্রয়োজন" },
  perDay:       { en: "per day", hi: "प्रतिदिन", bn: "প্রতিদিন" },
  perWeek:      { en: "per week", hi: "प्रति सप्ताह", bn: "প্রতি সপ্তাহে" },
  tip:          { en: "💡 Tip:", hi: "💡 सुझाव:", bn: "💡 পরামর্শ:" },
  fertTitle:    { en: "Fertilizer Dose Calculator", hi: "उर्वरक खुराक कैलकुलेटर", bn: "সার ডোজ ক্যালকুলেটর" },
  area:         { en: "Field Area (acres)", hi: "खेत क्षेत्रफल (एकड़)", bn: "মাঠের আয়তন (একর)" },
  selectCrop:   { en: "Select Crop", hi: "फसल चुनें", bn: "ফসল বেছে নিন" },
  nNeeded:      { en: "Urea (Nitrogen)", hi: "यूरिया (नाइट्रोजन)", bn: "ইউরিয়া (নাইট্রোজেন)" },
  pNeeded:      { en: "DAP (Phosphorus)", hi: "DAP (फॉस्फोरस)", bn: "DAP (ফসফরাস)" },
  kNeeded:      { en: "MOP (Potassium)", hi: "MOP (पोटेशियम)", bn: "MOP (পটাশিয়াম)" },
  kg:           { en: "kg", hi: "किग्रा", bn: "কেজি" },
  litres:       { en: "L", hi: "लीटर", bn: "লিটার" },
  notes:        { en: "Important Notes:", hi: "महत्वपूर्ण टिप्पणी:", bn: "গুরুত্বপূর্ণ নোট:" },
};

const CROPS_WATER = [
  { id: "paddy",  en: "Paddy/Rice", hi: "धान",   bn: "ধান",     baseL: 8,  stages: { seedling: 0.7, tillering: 1.2, heading: 1.0, ripening: 0.6 } },
  { id: "wheat",  en: "Wheat",      hi: "गेहूं",  bn: "গম",      baseL: 5,  stages: { germination: 0.6, tillering: 1.0, heading: 1.0, ripening: 0.7 } },
  { id: "tomato", en: "Tomato",     hi: "टमाटर", bn: "টমেটো",  baseL: 6,  stages: { transplant: 0.8, flowering: 1.2, fruiting: 1.3, ripening: 0.9 } },
  { id: "potato", en: "Potato",     hi: "आलू",   bn: "আলু",     baseL: 5,  stages: { emergence: 0.7, tuber_init: 1.1, tuber_bulk: 1.3, ripening: 0.8 } },
  { id: "onion",  en: "Onion",      hi: "प्याज", bn: "পেঁয়াজ", baseL: 4,  stages: { establishment: 0.7, bulbing: 1.1, maturity: 0.7 } },
  { id: "mango",  en: "Mango",      hi: "आम",    bn: "আম",      baseL: 10, stages: { flowering: 0.9, fruiting: 1.2, maturity: 1.0, dormant: 0.4 } },
];

const SOIL_MULT = {
  sandy: { en: "Sandy (drain fast)",  hi: "रेतीली (जल्दी सूखे)", bn: "বালি (দ্রুত শুকায়)", mult: 1.4 },
  loam:  { en: "Loam (normal)",       hi: "दोमट (सामान्य)",      bn: "দোআঁশ (স্বাভাবিক)",   mult: 1.0 },
  clay:  { en: "Clay (holds water)",  hi: "चिकनी (पानी रोके)",   bn: "এঁটেল (পানি ধরে)",    mult: 0.7 },
};

const FERT_CROPS = [
  { id: "rice",   en: "Rice / Paddy", hi: "धान",    bn: "ধান" },
  { id: "wheat",  en: "Wheat",        hi: "गेहूं",  bn: "গম" },
  { id: "tomato", en: "Tomato",       hi: "टमाटर", bn: "টমেটো" },
  { id: "potato", en: "Potato",       hi: "आलू",   bn: "আলু" },
];

const Styles = () => (
  <style>{`
    .calc-wrap {
      padding: 16px;
      font-family: 'Rajdhani', 'Noto Sans Devanagari', sans-serif;
      color: #e0fff0;
    }

    /* ── PAGE TITLE ─────────────────── */
    .calc-page-title {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 18px;
    }
    .calc-page-title-icon {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: linear-gradient(135deg, #071f10, #0a3020);
      border: 1px solid #00ff8840;
      box-shadow: 0 0 12px #00ff8830;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    .calc-page-title-text {
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #00ff88;
      text-shadow: 0 0 12px #00ff8880;
    }

    /* ── TAB SWITCHER ───────────────── */
    .calc-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      background: #041a0d;
      border: 1px solid #00ff8820;
      border-radius: 14px;
      padding: 4px;
    }
    .calc-tab-btn {
      flex: 1;
      padding: 9px 8px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border: 1px solid transparent;
      background: transparent;
      color: #4a7a5e;
      cursor: pointer;
      transition: all 0.25s;
      font-family: inherit;
    }
    .calc-tab-btn:hover { color: #00ff88; background: #00ff8810; }
    .calc-tab-btn.active {
      background: linear-gradient(135deg, #00ff8818, #00ff8808);
      border-color: #00ff8850;
      color: #00ff88;
      box-shadow: 0 0 12px #00ff8828, inset 0 0 8px #00ff8810;
    }

    /* ── SECTION TITLE ──────────────── */
    .calc-section-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #90c8a8;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid #00ff8820;
    }

    /* ── FORM GRID ──────────────────── */
    .calc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .calc-form-group { margin-bottom: 12px; }

    .calc-label {
      display: block;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #4a7a5e;
      margin-bottom: 6px;
    }

    .calc-input, .calc-select {
      width: 100%;
      background: #041a0d;
      border: 1px solid #00ff8830;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 13px;
      font-weight: 600;
      color: #e0fff0;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
      appearance: none;
      -webkit-appearance: none;
    }
    .calc-input::placeholder { color: #2a5a3e; }
    .calc-input:focus, .calc-select:focus {
      border-color: #00ff8860;
      box-shadow: 0 0 10px #00ff8825;
      background: #051e0f;
    }
    .calc-select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300ff88' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
      padding-right: 32px;
      cursor: pointer;
    }
    .calc-select option { background: #020d07; color: #e0fff0; }

    /* ── CALCULATE BUTTON ───────────── */
    .calc-btn {
      width: 100%;
      background: linear-gradient(135deg, #00c853, #00ff88);
      border: none;
      border-radius: 12px;
      padding: 13px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #020d07;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      box-shadow: 0 4px 16px #00ff8830;
      margin-top: 4px;
    }
    .calc-btn:hover {
      box-shadow: 0 4px 24px #00ff8860;
      transform: translateY(-1px);
    }
    .calc-btn:active { transform: translateY(0); }

    /* ── WATER RESULT CARD ──────────── */
    .result-card {
      margin-top: 16px;
      background: #041a0d;
      border: 1px solid #00ff8830;
      border-radius: 16px;
      padding: 16px;
      animation: fadeSlideUp 0.3s ease;
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .result-card-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #00ff88;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .result-card-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #00ff8840, transparent);
    }

    .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .result-stat {
      background: #051e0f;
      border: 1px solid #00ff8825;
      border-radius: 12px;
      padding: 14px 10px;
      text-align: center;
    }
    .result-stat-val {
      font-size: 26px;
      font-weight: 700;
      color: #00ff88;
      text-shadow: 0 0 14px #00ff8860;
      line-height: 1;
    }
    .result-stat-lbl {
      font-size: 10px;
      color: #4a7a5e;
      margin-top: 5px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .result-tip {
      margin-top: 12px;
      background: #071a08;
      border: 1px solid #ffb30030;
      border-left: 3px solid #ffb300;
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 11.5px;
      color: #c8a870;
      line-height: 1.5;
    }
    .result-tip-label { color: #ffb300; font-weight: 700; }

    /* ── FERTILIZER RESULT ──────────── */
    .fert-result-card {
      margin-top: 16px;
      background: #041a0d;
      border: 1px solid #00ff8830;
      border-radius: 16px;
      padding: 16px;
      animation: fadeSlideUp 0.3s ease;
    }
    .fert-result-header {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #00ff88;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .fert-result-header::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, #00ff8840, transparent);
    }

    .fert-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 10px;
      padding: 11px 14px;
      margin-bottom: 8px;
      border: 1px solid;
    }
    .fert-row-n { background: #051e10; border-color: #00ff8830; }
    .fert-row-p { background: #05101e; border-color: #0088ff30; }
    .fert-row-k { background: #1e0f05; border-color: #ff880030; }

    .fert-row-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .fert-row-n .fert-row-label { color: #00ff88; }
    .fert-row-p .fert-row-label { color: #44aaff; }
    .fert-row-k .fert-row-label { color: #ff9900; }

    .fert-row-val {
      font-size: 20px;
      font-weight: 700;
      line-height: 1;
    }
    .fert-row-n .fert-row-val { color: #00ff88; text-shadow: 0 0 10px #00ff8860; }
    .fert-row-p .fert-row-val { color: #44aaff; text-shadow: 0 0 10px #44aaff60; }
    .fert-row-k .fert-row-val { color: #ff9900; text-shadow: 0 0 10px #ff990060; }

    .fert-notes-box {
      margin-top: 12px;
      background: #030f06;
      border: 1px solid #00ff8820;
      border-radius: 10px;
      padding: 12px;
    }
    .fert-notes-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: #4a7a5e;
      margin-bottom: 6px;
    }
    .fert-notes-text {
      font-size: 12px;
      color: #90c8a8;
      line-height: 1.6;
    }
  `}</style>
);

export default function Calculators({ lang }) {
  const [tab, setTab]     = useState("water");
  const [wArea, setWArea] = useState("");
  const [wUnit, setWUnit] = useState("acre");
  const [wCrop, setWCrop] = useState("paddy");
  const [wStage, setWStage] = useState("");
  const [wSoil, setWSoil]   = useState("loam");
  const [wResult, setWResult] = useState(null);

  const [fArea, setFArea] = useState("");
  const [fCrop, setFCrop] = useState("rice");
  const [fResult, setFResult] = useState(null);

  function calcWater() {
    const area = parseFloat(wArea);
    if (!area || area <= 0) return;
    const cropData  = CROPS_WATER.find(c => c.id === wCrop);
    const stageKeys = Object.keys(cropData.stages);
    const stageKey  = wStage || stageKeys[1];
    const stageMult = cropData.stages[stageKey] || 1;
    const soilMult  = SOIL_MULT[wSoil].mult;

    let areaSqM = area;
    if (wUnit === "acre")  areaSqM = area * 4047;
    if (wUnit === "bigha") areaSqM = area * 1338;

    const litresPerDayPerSqM = cropData.baseL * stageMult * soilMult;
    const totalLitresDay  = litresPerDayPerSqM * areaSqM;
    const totalLitresWeek = totalLitresDay * 7;

    const tips = {
      en: `Water ${wCrop === "paddy" ? "paddyfields should maintain 2-5cm standing water" : "early morning to reduce evaporation"}. Mulching can save up to 40% water.`,
      hi: `${wCrop === "paddy" ? "धान के खेत में 2-5 सेमी खड़ा पानी रखें" : "सुबह पानी दें, वाष्पीकरण कम होगा"}। गीला कचरा डालने से 40% पानी बचता है।`,
      bn: `${wCrop === "paddy" ? "ধানক্ষেতে ২-৫ সেমি দাঁড়ানো পানি রাখুন" : "সকালে পানি দিন, বাষ্পীভবন কম হবে"}। মালচিং দিলে ৪০% পানি বাঁচে।`,
    };
    setWResult({ perDay: Math.round(totalLitresDay), perWeek: Math.round(totalLitresWeek), tip: tips[lang] });
  }

  function calcFert() {
    const area = parseFloat(fArea);
    if (!area || area <= 0) return;
    const guide = FERTILIZER_GUIDE[fCrop];
    if (!guide) return;
    const g = guide[lang] || guide.en;
    const parseRange = str => {
      const parts = str.toString().split("–").map(Number);
      return parts.reduce((a, b) => a + b, 0) / parts.length;
    };
    const urea = Math.round((parseRange(g.n) * area) / 0.46);
    const dap  = Math.round((parseRange(g.p) * area) / 0.46);
    const mop  = Math.round((parseRange(g.k) * area) / 0.60);
    setFResult({ urea, dap, mop, notes: g.notes, crop: g.crop });
  }

  return (
    <div className="calc-wrap">
      <Styles />

      {/* Title */}
      <div className="calc-page-title">
        <div className="calc-page-title-icon">🧮</div>
        <span className="calc-page-title-text">{T.title[lang]}</span>
      </div>

      {/* Tab switcher */}
      <div className="calc-tabs">
        {["water", "fertilizer"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`calc-tab-btn ${tab === t ? "active" : ""}`}>
            {t === "water" ? T.waterTab[lang] : T.fertTab[lang]}
          </button>
        ))}
      </div>

      {/* ── WATER CALCULATOR ─────────────────────────── */}
      {tab === "water" && (
        <div>
          <p className="calc-section-title">{T.waterTitle[lang]}</p>

          <div className="calc-grid-2">
            <div className="calc-form-group">
              <label className="calc-label">{T.fieldArea[lang]}</label>
              <input type="number" min="0.1" step="0.1" value={wArea}
                onChange={e => setWArea(e.target.value)}
                className="calc-input" placeholder="e.g. 1.5" />
            </div>
            <div className="calc-form-group">
              <label className="calc-label">{T.areaUnit[lang]}</label>
              <select value={wUnit} onChange={e => setWUnit(e.target.value)} className="calc-select">
                <option value="acre">Acre / एकड़ / একর</option>
                <option value="bigha">Bigha / बीघा / বিঘা</option>
                <option value="sqm">Sq Metre / वर्ग मी</option>
              </select>
            </div>
          </div>

          <div className="calc-form-group">
            <label className="calc-label">{T.cropType[lang]}</label>
            <select value={wCrop} onChange={e => { setWCrop(e.target.value); setWStage(""); setWResult(null); }} className="calc-select">
              {CROPS_WATER.map(c => <option key={c.id} value={c.id}>{c[lang] || c.en}</option>)}
            </select>
          </div>

          <div className="calc-form-group">
            <label className="calc-label">{T.stage[lang]}</label>
            <select value={wStage} onChange={e => setWStage(e.target.value)} className="calc-select">
              {Object.keys(CROPS_WATER.find(c => c.id === wCrop)?.stages || {}).map(s => (
                <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>

          <div className="calc-form-group">
            <label className="calc-label">{T.soilType[lang]}</label>
            <select value={wSoil} onChange={e => setWSoil(e.target.value)} className="calc-select">
              {Object.entries(SOIL_MULT).map(([k, v]) => (
                <option key={k} value={k}>{v[lang] || v.en}</option>
              ))}
            </select>
          </div>

          <button onClick={calcWater} className="calc-btn">{T.calcBtn[lang]}</button>

          {wResult && (
            <div className="result-card">
              <div className="result-card-label">{T.resultTitle[lang]}</div>
              <div className="result-grid">
                <div className="result-stat">
                  <div className="result-stat-val">{wResult.perDay.toLocaleString()}</div>
                  <div className="result-stat-lbl">{T.litres[lang]} / {T.perDay[lang]}</div>
                </div>
                <div className="result-stat">
                  <div className="result-stat-val">{wResult.perWeek.toLocaleString()}</div>
                  <div className="result-stat-lbl">{T.litres[lang]} / {T.perWeek[lang]}</div>
                </div>
              </div>
              <div className="result-tip">
                <span className="result-tip-label">{T.tip[lang]}</span> {wResult.tip}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FERTILIZER CALCULATOR ────────────────────── */}
      {tab === "fertilizer" && (
        <div>
          <p className="calc-section-title">{T.fertTitle[lang]}</p>

          <div className="calc-form-group">
            <label className="calc-label">{T.area[lang]}</label>
            <input type="number" min="0.1" step="0.1" value={fArea}
              onChange={e => setFArea(e.target.value)}
              className="calc-input" placeholder="e.g. 2" />
          </div>

          <div className="calc-form-group">
            <label className="calc-label">{T.selectCrop[lang]}</label>
            <select value={fCrop} onChange={e => { setFCrop(e.target.value); setFResult(null); }} className="calc-select">
              {FERT_CROPS.map(c => <option key={c.id} value={c.id}>{c[lang] || c.en}</option>)}
            </select>
          </div>

          <button onClick={calcFert} className="calc-btn">{T.calcBtn[lang]}</button>

          {fResult && (
            <div className="fert-result-card">
              <div className="fert-result-header">{fResult.crop} — {fArea} acres</div>

              <div className={`fert-row fert-row-n`}>
                <span className="fert-row-label">{T.nNeeded[lang]}</span>
                <span className="fert-row-val">{fResult.urea} {T.kg[lang]}</span>
              </div>
              <div className={`fert-row fert-row-p`}>
                <span className="fert-row-label">{T.pNeeded[lang]}</span>
                <span className="fert-row-val">{fResult.dap} {T.kg[lang]}</span>
              </div>
              <div className={`fert-row fert-row-k`}>
                <span className="fert-row-label">{T.kNeeded[lang]}</span>
                <span className="fert-row-val">{fResult.mop} {T.kg[lang]}</span>
              </div>

              <div className="fert-notes-box">
                <div className="fert-notes-label">{T.notes[lang]}</div>
                <div className="fert-notes-text">{fResult.notes}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}