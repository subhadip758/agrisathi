import React, { useState, useEffect, useRef } from 'react';
import { speakText, stopSpeech } from '../../services/ttsService';

const cleanTextForTTS = (raw) => {
  if (!raw) return '';
  let text = String(raw);
  // Remove Source tags from spoken voice
  text = text.replace(/\[Source:[^\]]+\]/gi, '');
  // Remove URLs
  text = text.replace(/https?:\/\/\S+/gi, '');
  // Remove markdown headers, bold, italics, bullets
  text = text.replace(/[#*_~`]/g, '');
  text = text.replace(/^[\s•\-\d+.]+/gm, '');
  return text.trim();
};

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const [speaking, setSpeaking] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getTargetLangCode = (text, detectedLang) => {
    if (detectedLang === 'bengali' || /[\u0980-\u09FF]/.test(text)) return 'bn';
    if (detectedLang === 'hindi' || /[\u0900-\u097F]/.test(text)) return 'hi';
    return 'en';
  };

  // 🔊 Speak response using enterprise backend TTS service (bn-IN, hi-IN, en-IN)
  const handleSpeak = async () => {
    if (speaking) {
      stopSpeech();
      setSpeaking(false);
      return;
    }

    const rawText = String(message.content || '').trim();
    if (!rawText) return;

    const textToSpeak = cleanTextForTTS(rawText);
    const langCode = getTargetLangCode(rawText, message.detectedLanguage);

    try {
      setSpeaking(true);
      await speakText({ text: textToSpeak, language: langCode });
    } catch (err) {
      console.warn('Backend TTS failed, trying browser Web Speech fallback:', err.message);
      // Fallback to Web Speech API
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(textToSpeak);
        u.lang = langCode === 'bn' ? 'bn-IN' : langCode === 'hi' ? 'hi-IN' : 'en-IN';
        u.onend = () => setSpeaking(false);
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } else {
        setSpeaking(false);
      }
    } finally {
      setSpeaking(false);
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-end gap-2`}
      style={{ animation: 'slideUp 0.3s ease forwards', opacity: 0 }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .speak-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 8px;
          opacity: 0.7;
          transition: opacity 0.2s ease, background 0.2s ease;
          display: flex;
          align-items: center;
          margin-top: 2px;
        }
        .message-wrapper:hover .speak-btn { opacity: 1; }
        .speak-btn:hover { background: rgba(74,124,89,0.15); }
        .speak-btn.active { opacity: 1; background: rgba(74,124,89,0.2); }
        @keyframes speakPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .speak-btn.active svg { animation: speakPulse 0.8s infinite; }
        .image-preview-msg {
          max-width: 200px;
          max-height: 160px;
          border-radius: 12px;
          margin-bottom: 6px;
          object-fit: cover;
          border: 1px solid rgba(74,124,89,0.2);
        }
      `}</style>

      {/* Bot Avatar */}
      {!isUser && (
        <div
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4a7c59, #2d5a3d)',
            display: 'flex', items: 'center', justify: 'center',
            flexShrink: 0, boxShadow: '0 2px 8px rgba(74,124,89,0.35)', fontSize: 16,
          }}
        >
          🌿
        </div>
      )}

      {/* Bubble */}
      <div
        className="message-wrapper"
        style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', maxWidth: '72%' }}
      >
        <div
          style={{
            padding: '10px 16px',
            borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            background: isUser
              ? 'linear-gradient(135deg, #4a7c59, #355e42)'
              : 'rgba(255,255,255,0.92)',
            color: isUser ? '#fff' : '#2c3e2d',
            boxShadow: isUser ? '0 4px 14px rgba(74,124,89,0.3)' : '0 2px 10px rgba(0,0,0,0.06)',
            backdropFilter: 'blur(6px)',
            border: isUser ? 'none' : '1px solid rgba(74,124,89,0.12)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 14, lineHeight: 1.6, fontWeight: 400, letterSpacing: '0.01em',
          }}
        >
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Uploaded" className="image-preview-msg" />
          )}
          <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {message.content}
          </p>
        </div>

        {/* Timestamp + Speak button row */}
        <div style={{ display: 'flex', items: 'center', gap: 4, paddingInline: 4, marginTop: 4 }}>
          <span style={{ fontSize: 11, color: '#9aaa9b', fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {formatTime(message.timestamp)}
          </span>

          {!isUser && (
            <button
              onClick={handleSpeak}
              className={`speak-btn${speaking ? ' active' : ''}`}
              title={speaking ? 'Stop speaking' : 'Listen to response aloud'}
            >
              {speaking ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#4a7c59">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M15.54 8.46a5 5 0 010 7.07" />
                  <path d="M19.07 4.93a10 10 0 010 14.14" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #c8a96e, #a07c45)',
            display: 'flex', items: 'center', justify: 'center',
            flexShrink: 0, boxShadow: '0 2px 8px rgba(160,124,69,0.35)', fontSize: 16,
          }}
        >
          👤
        </div>
      )}
    </div>
  );
};

export default ChatMessage;