// src/pages/offline/ChatBot.jsx
import { useState, useRef, useEffect } from "react";
import { FAQ, CATEGORIES } from "../../data/offlineKnowledge";

const GREETINGS = {
  en: ["Hello! I'm your offline farming assistant. Ask me anything about crops, soil, water, pests, or fertilizers.", "How can I help you today?"],
  hi: ["नमस्ते! मैं आपका ऑफलाइन कृषि सहायक हूं। फसल, मिट्टी, पानी, कीट या खाद के बारे में कुछ भी पूछें।", "आज मैं आपकी कैसे मदद कर सकता हूं?"],
  bn: ["নমস্কার! আমি আপনার অফলাইন কৃষি সহায়ক। ফসল, মাটি, পানি, পোকা বা সারের বিষয়ে যেকোনো প্রশ্ন করুন।", "আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?"],
};

const NO_MATCH = {
  en: "I couldn't find an exact match, but here are the closest topics I know about. Try selecting a category below or rephrase your question.",
  hi: "मुझे सटीक उत्तर नहीं मिला, लेकिन नीचे करीबी विषय हैं। कोई श्रेणी चुनें या प्रश्न बदलकर पूछें।",
  bn: "আমি সঠিক উত্তর খুঁজে পাইনি, তবে নিচে কাছাকাছি বিষয় আছে। কোনো বিভাগ বেছে নিন বা প্রশ্নটি অন্যভাবে করুন।",
};

function scoreMatch(faqItem, query, lang) {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter(w => w.length > 2);
  const haystack = (
    (faqItem[lang]?.q || "") + " " +
    (faqItem[lang]?.a || "") + " " +
    (faqItem.tags || []).join(" ")
  ).toLowerCase();
  let score = 0;
  for (const word of words) { if (haystack.includes(word)) score += 2; }
  if (haystack.includes(q)) score += 5;
  return score;
}

function searchFAQ(query, lang) {
  if (!query.trim()) return [];
  const scored = FAQ.map(item => ({ item, score: scoreMatch(item, query, lang) }))
    .filter(x => x.score > 0).sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map(x => x.item);
}

const Styles = () => (
  <style>{`
    .chat-root {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      font-family: 'Rajdhani', 'Noto Sans Devanagari', sans-serif;
    }

    /* ── MESSAGES AREA ────────────────── */
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-height: 0;
    }
    .chat-messages::-webkit-scrollbar { width: 3px; }
    .chat-messages::-webkit-scrollbar-track { background: transparent; }
    .chat-messages::-webkit-scrollbar-thumb { background: #00ff8840; border-radius: 2px; }

    .msg-row { display: flex; }
    .msg-row.user { justify-content: flex-end; }
    .msg-row.bot  { justify-content: flex-start; }

    /* Bot avatar */
    .bot-avatar {
      width: 28px; height: 28px;
      border-radius: 8px;
      background: linear-gradient(135deg, #041a0d, #0a3020);
      border: 1px solid #00ff8840;
      box-shadow: 0 0 8px #00ff8820;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      margin-right: 8px;
      margin-top: 2px;
    }

    /* Bubbles */
    .msg-bubble {
      max-width: 80%;
      border-radius: 16px;
      padding: 10px 13px;
      font-size: 13px;
      line-height: 1.55;
      animation: bubbleIn 0.2s ease;
    }
    @keyframes bubbleIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .msg-bubble.user {
      background: linear-gradient(135deg, #00c853, #00ff88);
      color: #020d07;
      font-weight: 600;
      border-bottom-right-radius: 4px;
      box-shadow: 0 2px 12px #00ff8830;
    }
    .msg-bubble.bot {
      background: #071f10;
      border: 1px solid #00ff8825;
      color: #c8f0d8;
      border-bottom-left-radius: 4px;
    }

    .matched-q {
      font-size: 10px;
      color: #00ff88;
      font-weight: 700;
      margin-bottom: 5px;
      font-style: italic;
      opacity: 0.8;
    }

    /* Suggestion chips */
    .chip-group { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .chip {
      font-size: 11px;
      padding: 5px 10px;
      border-radius: 20px;
      border: 1px solid #00ff8840;
      background: #041a0d;
      color: #00ff88;
      cursor: pointer;
      font-family: inherit;
      font-weight: 600;
      transition: all 0.2s;
    }
    .chip:hover { background: #00ff8815; box-shadow: 0 0 8px #00ff8830; }

    .chip.amber {
      border-color: #ffb30040;
      background: #1a0f00;
      color: #ffb300;
    }
    .chip.amber:hover { background: #ffb30015; box-shadow: 0 0 8px #ffb30030; }

    /* Category label */
    .sub-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: #4a7a5e;
      margin-bottom: 6px;
      margin-top: 6px;
    }

    /* Q list buttons */
    .q-btn {
      display: block;
      width: 100%;
      text-align: left;
      font-size: 12px;
      background: #041a0d;
      border: 1px solid #00ff8825;
      border-radius: 8px;
      padding: 8px 10px;
      color: #90c8a8;
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      margin-bottom: 5px;
      transition: all 0.2s;
    }
    .q-btn:hover { background: #00ff8812; color: #00ff88; border-color: #00ff8850; }

    /* Follow-up */
    .followup-section {
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #00ff8820;
    }
    .followup-btn {
      display: block;
      width: 100%;
      text-align: left;
      font-size: 11px;
      background: transparent;
      border: none;
      color: #44aaff;
      cursor: pointer;
      font-family: inherit;
      padding: 3px 0;
      transition: color 0.2s;
    }
    .followup-btn:hover { color: #88ccff; }

    .other-btn {
      display: block;
      font-size: 11px;
      background: transparent;
      border: none;
      color: #4a7a5e;
      cursor: pointer;
      font-family: inherit;
      padding: 3px 0;
      transition: color 0.2s;
      width: 100%;
      text-align: left;
    }
    .other-btn:hover { color: #90c8a8; }

    /* ── CATEGORY STRIP ───────────────── */
    .cat-strip {
      border-top: 1px solid #00ff8818;
      padding: 8px 10px;
      display: flex;
      gap: 6px;
      overflow-x: auto;
      background: #030f06;
      flex-shrink: 0;
    }
    .cat-strip::-webkit-scrollbar { display: none; }
    .cat-strip-btn {
      flex-shrink: 0;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 20px;
      border: 1px solid #00ff8830;
      background: #041a0d;
      color: #4a7a5e;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.2s;
      letter-spacing: 0.3px;
    }
    .cat-strip-btn:hover { color: #00ff88; background: #00ff8812; }
    .cat-strip-btn.active {
      background: #00ff8818;
      border-color: #00ff88;
      color: #00ff88;
      box-shadow: 0 0 8px #00ff8828;
    }

    /* ── INPUT BAR ────────────────────── */
    .chat-input-bar {
      border-top: 1px solid #00ff8818;
      padding: 10px 10px;
      display: flex;
      gap: 8px;
      background: #020d07;
      flex-shrink: 0;
    }
    .chat-input {
      flex: 1;
      background: #041a0d;
      border: 1px solid #00ff8830;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 500;
      color: #e0fff0;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }
    .chat-input::placeholder { color: #2a5a3e; }
    .chat-input:focus {
      border-color: #00ff8860;
      box-shadow: 0 0 10px #00ff8820;
    }
    .send-btn {
      background: linear-gradient(135deg, #00c853, #00ff88);
      border: none;
      border-radius: 12px;
      width: 44px; height: 44px;
      font-size: 16px;
      color: #020d07;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 10px #00ff8840;
      flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .send-btn:hover { box-shadow: 0 2px 18px #00ff8860; transform: scale(1.05); }
    .send-btn:active { transform: scale(0.97); }
  `}</style>
);

export default function ChatBot({ lang }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: GREETINGS[lang][0] },
    { from: "bot", text: GREETINGS[lang][1], suggestions: true }
  ]);
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function handleCategory(catId) {
    setSelectedCategory(catId);
    const cat = CATEGORIES.find(c => c.id === catId);
    const items = FAQ.filter(f => f.category === catId);
    const catName = cat?.[lang] || catId;
    setMessages(prev => [
      ...prev,
      { from: "user", text: `${cat?.icon} ${catName}` },
      { from: "bot", text: `Here are common questions about ${catName}:`, qaList: items.map(f => ({ id: f.id, q: f[lang]?.q || f.en.q })) }
    ]);
  }

  function handleSelectQuestion(faqId) {
    const item = FAQ.find(f => f.id === faqId);
    if (!item) return;
    const q = item[lang]?.q || item.en.q;
    const a = item[lang]?.a || item.en.a;
    setMessages(prev => [
      ...prev,
      { from: "user", text: q },
      { from: "bot", text: a, followUp: getFollowUp(item, lang) }
    ]);
  }

  function getFollowUp(item, lang) {
    return FAQ.filter(f => f.category === item.category && f.id !== item.id).slice(0, 2)
      .map(f => ({ id: f.id, q: f[lang]?.q || f.en.q }));
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput("");
    const results = searchFAQ(trimmed, lang);
    if (results.length === 0) {
      setMessages(prev => [...prev, { from: "user", text: trimmed }, { from: "bot", text: NO_MATCH[lang], categoryPicker: true }]);
      return;
    }
    const top = results[0];
    setMessages(prev => [
      ...prev,
      { from: "user", text: trimmed },
      { from: "bot", matchedQ: top[lang]?.q || top.en.q, text: top[lang]?.a || top.en.a, followUp: getFollowUp(top, lang), otherResults: results.slice(1, 3).map(f => ({ id: f.id, q: f[lang]?.q || f.en.q })) }
    ]);
  }

  const placeholders = { en: "Type your farming question…", hi: "अपना कृषि प्रश्न लिखें…", bn: "আপনার কৃষি প্রশ্ন টাইপ করুন…" };
  const moreLabel   = { en: "Related:", hi: "संबंधित:", bn: "সম্পর্কিত:" };
  const matchedLabel= { en: "Best match:", hi: "सबसे उपयुक्त:", bn: "সেরা মিল:" };
  const otherLabel  = { en: "Also try:", hi: "अन्य:", bn: "আরো দেখুন:" };
  const catLabel    = { en: "Browse by category:", hi: "श्रेणी से खोजें:", bn: "বিভাগ দিয়ে খুঁজুন:" };

  return (
    <div className="chat-root">
      <Styles />

      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`msg-row ${msg.from}`}>
            {msg.from === "bot" && <div className="bot-avatar">🌾</div>}
            <div className={`msg-bubble ${msg.from}`}>
              {msg.matchedQ && <p className="matched-q">{matchedLabel[lang]} "{msg.matchedQ}"</p>}
              <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>

              {msg.suggestions && (
                <div className="chip-group">
                  {CATEGORIES.slice(0, 4).map(cat => (
                    <button key={cat.id} onClick={() => handleCategory(cat.id)} className="chip">
                      {cat.icon} {cat[lang]}
                    </button>
                  ))}
                </div>
              )}

              {msg.categoryPicker && (
                <div style={{ marginTop: 8 }}>
                  <p className="sub-label">{catLabel[lang]}</p>
                  <div className="chip-group">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => handleCategory(cat.id)} className="chip amber">
                        {cat.icon} {cat[lang]}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {msg.qaList && (
                <div style={{ marginTop: 8 }}>
                  {msg.qaList.map(({ id, q }) => (
                    <button key={id} onClick={() => handleSelectQuestion(id)} className="q-btn">❓ {q}</button>
                  ))}
                </div>
              )}

              {msg.followUp && msg.followUp.length > 0 && (
                <div className="followup-section">
                  <p className="sub-label">{moreLabel[lang]}</p>
                  {msg.followUp.map(({ id, q }) => (
                    <button key={id} onClick={() => handleSelectQuestion(id)} className="followup-btn">→ {q}</button>
                  ))}
                </div>
              )}

              {msg.otherResults && msg.otherResults.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <p className="sub-label">{otherLabel[lang]}</p>
                  {msg.otherResults.map(({ id, q }) => (
                    <button key={id} onClick={() => handleSelectQuestion(id)} className="other-btn">· {q}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Category strip */}
      <div className="cat-strip">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => handleCategory(cat.id)}
            className={`cat-strip-btn ${selectedCategory === cat.id ? "active" : ""}`}>
            {cat.icon} {cat[lang]}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="chat-input-bar">
        <input className="chat-input" placeholder={placeholders[lang]}
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()} />
        <button onClick={handleSend} className="send-btn">➤</button>
      </div>
    </div>
  );
}