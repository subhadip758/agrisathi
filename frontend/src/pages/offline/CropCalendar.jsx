// src/pages/offline/CropCalendar.jsx
import { useState } from "react";
import { CROP_CALENDAR } from "../../data/offlineKnowledge";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const T = {
  title:   { en: "Crop Calendar", hi: "फसल कैलेंडर", bn: "ফসল ক্যালেন্ডার" },
  current: { en: "Current month", hi: "वर्तमान महीना", bn: "বর্তমান মাস" },
  pick:    { en: "Pick a crop:", hi: "फसल चुनें:", bn: "ফসল বেছে নিন:" },
  activity:{ en: "Activities this month:", hi: "इस महीने की गतिविधियां:", bn: "এই মাসের কার্যক্রম:" },
  allCrops:{ en: "All Crops Overview", hi: "सभी फसलें एक नजर में", bn: "একনজরে সব ফসল" },
  oneCrop: { en: "One Crop", hi: "एक फसल", bn: "একটি ফসল" },
  noAct:   { en: "No specific activity this month", hi: "इस महीने कोई विशेष गतिविधि नहीं", bn: "এই মাসে বিশেষ কার্যক্রম নেই" },
};

const Styles = () => (
  <style>{`
    .cal-wrap {
      padding: 16px;
      font-family: 'Rajdhani', 'Noto Sans Devanagari', sans-serif;
      color: #e0fff0;
    }

    /* page title */
    .cal-title-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
    .cal-title-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, #071f10, #0a3020);
      border: 1px solid #00ff8840; box-shadow: 0 0 12px #00ff8830;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .cal-title-text {
      font-size: 17px; font-weight: 700; letter-spacing: 1.2px;
      text-transform: uppercase; color: #00ff88;
      text-shadow: 0 0 12px #00ff8880;
    }

    /* view toggle */
    .cal-toggle {
      display: flex; gap: 8px; margin-bottom: 18px;
      background: #041a0d; border: 1px solid #00ff8820;
      border-radius: 14px; padding: 4px;
    }
    .cal-toggle-btn {
      flex: 1; padding: 9px 8px; border-radius: 10px;
      font-size: 12px; font-weight: 700; letter-spacing: 0.5px;
      border: 1px solid transparent; background: transparent;
      color: #4a7a5e; cursor: pointer; font-family: inherit; transition: all 0.25s;
      text-transform: uppercase;
    }
    .cal-toggle-btn:hover { color: #00ff88; background: #00ff8810; }
    .cal-toggle-btn.active {
      background: linear-gradient(135deg, #00ff8818, #00ff8808);
      border-color: #00ff8850; color: #00ff88;
      box-shadow: 0 0 10px #00ff8820;
    }

    /* month strip */
    .month-strip {
      display: flex; gap: 5px; overflow-x: auto;
      padding-bottom: 10px; margin-bottom: 18px;
    }
    .month-strip::-webkit-scrollbar { display: none; }
    .month-btn {
      flex-shrink: 0; width: 46px;
      padding: 8px 0; border-radius: 10px;
      font-size: 11px; font-weight: 700;
      border: 1px solid #00ff8820;
      background: #041a0d; color: #4a7a5e;
      cursor: pointer; font-family: inherit;
      transition: all 0.2s; text-align: center;
      letter-spacing: 0.3px;
    }
    .month-btn:hover { color: #90c8a8; background: #00ff8810; }
    .month-btn.selected {
      background: linear-gradient(135deg, #00c853, #00ff88);
      color: #020d07; border-color: transparent;
      box-shadow: 0 2px 12px #00ff8840;
      transform: scale(1.08);
    }
    .month-btn.today {
      border-color: #ffb30060; color: #ffb300;
      background: #1a0f00;
    }
    .month-dot { color: #ffb300; font-size: 9px; margin-top: 1px; }

    /* sub label */
    .cal-sub-label {
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      color: #4a7a5e; margin-bottom: 10px;
    }

    /* crop selector chips */
    .crop-chip-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
    .crop-chip {
      padding: 7px 14px; border-radius: 20px;
      font-size: 13px; font-weight: 600;
      border: 1px solid #00ff8830; background: #041a0d;
      color: #4a7a5e; cursor: pointer; font-family: inherit; transition: all 0.2s;
    }
    .crop-chip:hover { color: #00ff88; background: #00ff8812; }
    .crop-chip.active {
      background: linear-gradient(135deg, #00ff8818, #00ff8808);
      border-color: #00ff88; color: #00ff88;
      box-shadow: 0 0 10px #00ff8828;
    }

    /* activity card */
    .activity-card {
      background: #041a0d; border: 1px solid #00ff8830;
      border-radius: 16px; padding: 16px;
      animation: fadeSlideUp 0.3s ease;
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .activity-card-header {
      display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
    }
    .crop-big-icon { font-size: 32px; line-height: 1; }
    .crop-header-name { font-size: 16px; font-weight: 700; color: #00ff88; letter-spacing: 0.5px; }
    .crop-header-month { font-size: 11px; color: #4a7a5e; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }

    .current-badge {
      margin-left: auto; font-size: 10px; font-weight: 700;
      padding: 4px 10px; border-radius: 20px;
      border: 1px solid #ffb30050; background: #1a0f00;
      color: #ffb300; letter-spacing: 0.5px;
    }

    .activity-box {
      background: #030f06; border: 1px solid #00ff8820;
      border-left: 3px solid #00ff88;
      border-radius: 10px; padding: 12px;
      margin-bottom: 14px;
    }
    .activity-box-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
      text-transform: uppercase; color: #00ff88; margin-bottom: 6px;
    }
    .activity-box-text { font-size: 13px; color: #c8f0d8; line-height: 1.55; }

    /* all months mini grid */
    .months-mini-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; max-height: 260px; overflow-y: auto; }
    .months-mini-grid::-webkit-scrollbar { width: 3px; }
    .months-mini-grid::-webkit-scrollbar-thumb { background: #00ff8840; border-radius: 2px; }
    .month-mini-card {
      background: #030f06; border: 1px solid #00ff8818;
      border-radius: 9px; padding: 9px 10px;
    }
    .month-mini-card.highlight { border-color: #ffb30040; background: #1a0f0088; }
    .month-mini-name { font-size: 10px; font-weight: 700; color: #00ff88; margin-bottom: 4px; letter-spacing: 0.5px; text-transform: uppercase; }
    .month-mini-card.highlight .month-mini-name { color: #ffb300; }
    .month-mini-text { font-size: 11px; color: #4a7a5e; line-height: 1.4; }

    /* all-crops view */
    .all-crop-card {
      background: #041a0d; border: 1px solid #00ff8825;
      border-radius: 14px; padding: 14px; margin-bottom: 10px;
    }
    .all-crop-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .all-crop-icon { font-size: 20px; }
    .all-crop-name { font-size: 14px; font-weight: 700; color: #00ff88; flex: 1; letter-spacing: 0.3px; }
    .all-crop-month { font-size: 10px; color: #4a7a5e; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .all-crop-activity {
      font-size: 12px; color: #90c8a8; line-height: 1.5;
      background: #030f06; border: 1px solid #00ff8815;
      border-left: 2px solid #00ff8850;
      border-radius: 8px; padding: 9px 11px;
    }
  `}</style>
);

export default function CropCalendar({ lang }) {
  const currentMonthIdx = new Date().getMonth();
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIdx);
  const [view, setView] = useState("single");

  const cropKeys = Object.keys(CROP_CALENDAR);
  const crop = CROP_CALENDAR[selectedCrop];
  const currentMonthName = MONTHS[selectedMonth];

  function getMonthData(cropKey, monthName) {
    const cal = CROP_CALENDAR[cropKey];
    return cal.months.find(m => m.month === monthName || (monthName.includes("–") && m.month === monthName));
  }

  return (
    <div className="cal-wrap">
      <Styles />

      <div className="cal-title-row">
        <div className="cal-title-icon">📅</div>
        <span className="cal-title-text">{T.title[lang]}</span>
      </div>

      {/* View toggle */}
      <div className="cal-toggle">
        {["single", "all"].map(v => (
          <button key={v} onClick={() => setView(v)} className={`cal-toggle-btn ${view === v ? "active" : ""}`}>
            {v === "single" ? T.oneCrop[lang] : T.allCrops[lang]}
          </button>
        ))}
      </div>

      {/* Month strip */}
      <div className="month-strip">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setSelectedMonth(i)}
            className={`month-btn ${i === selectedMonth ? "selected" : i === currentMonthIdx ? "today" : ""}`}>
            {m}
            {i === currentMonthIdx && i !== selectedMonth && <div className="month-dot">●</div>}
          </button>
        ))}
      </div>

      {view === "single" ? (
        <>
          <p className="cal-sub-label">{T.pick[lang]}</p>
          <div className="crop-chip-row">
            {cropKeys.map(k => (
              <button key={k} onClick={() => setSelectedCrop(k)}
                className={`crop-chip ${selectedCrop === k ? "active" : ""}`}>
                {CROP_CALENDAR[k].icon} {CROP_CALENDAR[k][lang]}
              </button>
            ))}
          </div>

          {(() => {
            const md = getMonthData(selectedCrop, currentMonthName);
            return (
              <div className="activity-card">
                <div className="activity-card-header">
                  <span className="crop-big-icon">{crop.icon}</span>
                  <div>
                    <p className="crop-header-name">{crop[lang]}</p>
                    <p className="crop-header-month">{currentMonthName}</p>
                  </div>
                  {selectedMonth === currentMonthIdx && (
                    <span className="current-badge">{T.current[lang]}</span>
                  )}
                </div>

                <div className="activity-box">
                  <p className="activity-box-label">{T.activity[lang]}</p>
                  <p className="activity-box-text">
                    {md ? (md[lang]?.activity || md.en.activity) : T.noAct[lang]}
                  </p>
                </div>

                <div className="months-mini-grid">
                  {crop.months.map((m, i) => (
                    <div key={i} className={`month-mini-card ${m.month === currentMonthName ? "highlight" : ""}`}>
                      <p className="month-mini-name">{m.month}</p>
                      <p className="month-mini-text">{m[lang]?.activity || m.en.activity}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      ) : (
        <div>
          {cropKeys.map(k => {
            const c = CROP_CALENDAR[k];
            const md = getMonthData(k, currentMonthName);
            return (
              <div key={k} className="all-crop-card">
                <div className="all-crop-header">
                  <span className="all-crop-icon">{c.icon}</span>
                  <span className="all-crop-name">{c[lang]}</span>
                  <span className="all-crop-month">{currentMonthName}</span>
                </div>
                <p className="all-crop-activity">
                  {md ? (md[lang]?.activity || md.en.activity) : "—"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}