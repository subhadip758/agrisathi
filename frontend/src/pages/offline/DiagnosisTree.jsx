// src/pages/offline/DiagnosisTree.jsx
import { useState } from "react";
import { DIAGNOSIS_TREE } from "../../data/offlineKnowledge";

const Styles = () => (
  <style>{`
    .diag-wrap {
      padding: 16px;
      font-family: 'Rajdhani', 'Noto Sans Devanagari', sans-serif;
      color: #e0fff0;
    }

    /* header */
    .diag-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
    .diag-title-row { display: flex; align-items: center; gap: 10px; }
    .diag-title-icon {
      width: 38px; height: 38px; border-radius: 10px;
      background: linear-gradient(135deg, #071f10, #0a3020);
      border: 1px solid #00ff8840; box-shadow: 0 0 12px #00ff8830;
      display: flex; align-items: center; justify-content: center; font-size: 18px;
    }
    .diag-title-text {
      font-size: 16px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #00ff88;
      text-shadow: 0 0 12px #00ff8880;
    }
    .diag-btn-row { display: flex; gap: 6px; }
    .diag-nav-btn {
      font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
      padding: 6px 12px; border-radius: 8px;
      border: 1px solid #00ff8830; background: #041a0d;
      color: #4a7a5e; cursor: pointer; font-family: inherit; transition: all 0.2s;
    }
    .diag-nav-btn:hover { color: #00ff88; border-color: #00ff8860; background: #00ff8810; }
    .diag-nav-btn.reset { border-color: #ffffff10; color: #2a5a3e; }
    .diag-nav-btn.reset:hover { border-color: #ffffff25; color: #90c8a8; background: #ffffff08; }

    /* progress dots */
    .progress-dots { display: flex; gap: 5px; margin-bottom: 18px; align-items: center; }
    .prog-dot {
      height: 6px; border-radius: 3px; transition: all 0.3s;
      background: #00ff8830;
    }
    .prog-dot.active { width: 22px; background: #00ff88; box-shadow: 0 0 6px #00ff8880; }
    .prog-dot.done   { width: 6px; background: #00c853; }
    .prog-dot.result { width: 22px; background: #ffb300; box-shadow: 0 0 6px #ffb30080; }

    /* question card */
    .question-card {
      background: #041a0d; border: 1px solid #00ff8830;
      border-radius: 16px; padding: 18px; margin-bottom: 14px;
      animation: fadeSlideUp 0.25s ease;
    }
    @keyframes fadeSlideUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .step-badge {
      display: inline-block; font-size: 10px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      padding: 3px 10px; border-radius: 20px;
      border: 1px solid #00ff8840; background: #00ff8812;
      color: #00ff88; margin-bottom: 10px;
    }
    .question-text {
      font-size: 15px; font-weight: 600; color: #c8f0d8;
      line-height: 1.45; letter-spacing: 0.2px;
    }

    /* option buttons */
    .option-btn {
      width: 100%; text-align: left;
      background: #041a0d; border: 1px solid #00ff8828;
      border-radius: 12px; padding: 14px 16px;
      font-size: 13px; font-weight: 600; color: #90c8a8;
      cursor: pointer; font-family: inherit;
      transition: all 0.2s; margin-bottom: 8px;
      display: flex; align-items: center; justify-content: space-between;
    }
    .option-btn:hover {
      background: #00ff8812; border-color: #00ff8860;
      color: #00ff88; box-shadow: 0 0 10px #00ff8818;
      transform: translateX(3px);
    }
    .option-btn:active { transform: translateX(1px); }
    .option-arrow { color: #00ff8860; font-size: 14px; flex-shrink: 0; margin-left: 8px; transition: transform 0.2s; }
    .option-btn:hover .option-arrow { transform: translateX(3px); color: #00ff88; }

    /* result card */
    .result-card {
      background: #041a0d; border: 1px solid #00ff8830;
      border-radius: 16px; padding: 18px;
      animation: fadeSlideUp 0.3s ease;
    }
    .result-header { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
    .result-icon-box {
      width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
      background: linear-gradient(135deg, #1a0f00, #2a1500);
      border: 1px solid #ffb30040; box-shadow: 0 0 14px #ffb30030;
      display: flex; align-items: center; justify-content: center; font-size: 24px;
    }
    .result-problem-label {
      font-size: 10px; font-weight: 700; letter-spacing: 1px;
      text-transform: uppercase; color: #ffb300; margin-bottom: 5px;
    }
    .result-problem-title {
      font-size: 17px; font-weight: 700; color: #e0fff0; letter-spacing: 0.3px; line-height: 1.3;
    }

    .solution-box {
      background: #030f06; border: 1px solid #00ff8820;
      border-left: 3px solid #00ff88;
      border-radius: 10px; padding: 14px;
    }
    .solution-label {
      font-size: 10px; font-weight: 700; letter-spacing: 0.8px;
      text-transform: uppercase; color: #00ff88; margin-bottom: 8px;
    }
    .solution-text { font-size: 13px; color: #c8f0d8; line-height: 1.6; white-space: pre-wrap; }

    .restart-btn {
      width: 100%; margin-top: 14px;
      background: linear-gradient(135deg, #00c853, #00ff88);
      border: none; border-radius: 12px;
      padding: 13px; font-size: 13px; font-weight: 700;
      letter-spacing: 0.8px; text-transform: uppercase;
      color: #020d07; cursor: pointer; font-family: inherit;
      transition: all 0.2s; box-shadow: 0 3px 14px #00ff8830;
    }
    .restart-btn:hover { box-shadow: 0 3px 22px #00ff8860; transform: translateY(-1px); }
  `}</style>
);

export default function DiagnosisTree({ lang }) {
  const [history, setHistory] = useState([DIAGNOSIS_TREE]);
  const [result, setResult] = useState(null);
  const current = history[history.length - 1];

  const labels = {
    title:    { en: "Crop Diagnosis", hi: "फसल समस्या निदान", bn: "ফসল সমস্যা নির্ণয়" },
    restart:  { en: "↺ Reset", hi: "↺ रीसेट", bn: "↺ রিসেট" },
    back:     { en: "← Back", hi: "← पीछे", bn: "← পিছনে" },
    solution: { en: "✅ Solution", hi: "✅ समाधान", bn: "✅ সমাধান" },
    problem:  { en: "Problem Identified", hi: "पहचानी गई समस्या", bn: "চিহ্নিত সমস্যা" },
    restart2: { en: "Diagnose Another Problem", hi: "दूसरी समस्या जांचें", bn: "আরেকটি সমস্যা নির্ণয়" },
    step:     { en: "Step", hi: "चरण", bn: "ধাপ" },
  };

  function handleOption(option) {
    if (option.result) setResult(option.result);
    else if (option.next) setHistory(prev => [...prev, option.next]);
  }
  function handleBack() {
    if (result) { setResult(null); return; }
    setHistory(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }
  function handleRestart() { setHistory([DIAGNOSIS_TREE]); setResult(null); }

  return (
    <div className="diag-wrap">
      <Styles />

      <div className="diag-header">
        <div className="diag-title-row">
          <div className="diag-title-icon">🩺</div>
          <span className="diag-title-text">{labels.title[lang]}</span>
        </div>
        <div className="diag-btn-row">
          {history.length > 1 && (
            <button onClick={handleBack} className="diag-nav-btn">{labels.back[lang]}</button>
          )}
          <button onClick={handleRestart} className="diag-nav-btn reset">{labels.restart[lang]}</button>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-dots">
        {history.map((_, i) => (
          <div key={i} className={`prog-dot ${i === history.length - 1 && !result ? "active" : "done"}`} />
        ))}
        {result && <div className="prog-dot result" />}
      </div>

      {result ? (
        <div className="result-card">
          <div className="result-header">
            <div className="result-icon-box">🔬</div>
            <div>
              <p className="result-problem-label">{labels.problem[lang]}</p>
              <p className="result-problem-title">{result[lang]?.title || result.en.title}</p>
            </div>
          </div>
          <div className="solution-box">
            <p className="solution-label">{labels.solution[lang]}</p>
            <p className="solution-text">{result[lang]?.solution || result.en.solution}</p>
          </div>
          <button onClick={handleRestart} className="restart-btn">{labels.restart2[lang]}</button>
        </div>
      ) : (
        <div>
          <div className="question-card">
            <span className="step-badge">{labels.step[lang]} {history.length}</span>
            <p className="question-text">{current[lang]?.q || current.en?.q}</p>
          </div>
          <div>
            {(current.options || []).map((opt, i) => (
              <button key={i} onClick={() => handleOption(opt)} className="option-btn">
                <span>{opt[lang] || opt.en}</span>
                <span className="option-arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}