import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const { language } = useLanguage();
  const [message, setMessage] = useState('');
  const [focused, setFocused] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(true);

  // Dynamic voice language selection: 'bn-IN' | 'hi-IN' | 'en-IN'
  const getDefaultVoiceLang = (lang) => {
    if (lang === 'bn') return 'bn-IN';
    if (lang === 'hi') return 'hi-IN';
    return 'en-IN';
  };

  const [voiceLang, setVoiceLang] = useState(() => getDefaultVoiceLang(language));

  useEffect(() => {
    setVoiceLang(getDefaultVoiceLang(language));
  }, [language]);

  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const onSendMessageRef = useRef(onSendMessage);

  useEffect(() => { onSendMessageRef.current = onSendMessage; }, [onSendMessage]);

  useEffect(() => {
    return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); };
  }, [imagePreview]);

  // Setup Web Speech API with dynamic voice language
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = voiceLang;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setVoiceError('');
      setInterimText('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (interim) setInterimText(interim);

      if (final && final.trim()) {
        setInterimText('');
        setMessage('');
        setIsListening(false);
        onSendMessageRef.current(final.trim(), null);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setInterimText('');
      const errorMessages = {
        'not-allowed':        '🚫 Mic access denied. Click address bar lock icon → allow microphone.',
        'permission-denied':  '🚫 Mic access denied in browser settings.',
        'no-speech':          '🔇 No speech detected. Please speak clearly into your mic.',
        'network':            '🌐 Network error. Voice recognition requires internet.',
        'audio-capture':      '🎤 Microphone not detected.',
        'service-not-allowed':'🚫 Web speech requires HTTPS or localhost.',
      };
      const msg = errorMessages[event.error] ?? `Voice error: ${event.error}`;
      if (msg) {
        setVoiceError(msg);
        setTimeout(() => setVoiceError(''), 5000);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;
  }, [voiceLang]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((!message.trim() && !selectedImage) || disabled) return;
    onSendMessage(message, selectedImage);
    setMessage('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const removeImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleVoiceToggle = () => {
    if (!voiceSupported || !recognitionRef.current) {
      setVoiceError('🚫 Voice input not supported. Please use Chrome, Edge, or Safari.');
      setTimeout(() => setVoiceError(''), 4000);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    setMessage('');
    setInterimText('');
    setVoiceError('');

    try {
      recognitionRef.current.lang = voiceLang;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('Mic start error:', err);
    }
  };

  const displayValue = isListening ? interimText : message;

  const inputPlaceholder = isListening
    ? `🎤 Listening (${voiceLang === 'bn-IN' ? 'বাংলা' : voiceLang === 'hi-IN' ? 'हिन्दी' : 'English'})...`
    : selectedImage
    ? 'Describe what to do with this image...'
    : 'Ask about crops, weather, soil, disease...';

  const canSend = !disabled && (message.trim() || selectedImage);

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        .chat-input-field::placeholder { color: #b0bdb1; }
        .chat-input-field:focus { outline: none; }
        .send-btn:hover:not(:disabled) { transform: scale(1.08); background: linear-gradient(135deg, #3d6b4a, #2a4e33) !important; }
        .send-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .send-btn { transition: transform 0.18s ease, background 0.2s ease; }
        .icon-btn {
          width: 36px; height: 36px; border-radius: 50%; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s ease; flex-shrink: 0;
          background: rgba(74,124,89,0.08);
        }
        .icon-btn:hover:not(:disabled) { background: rgba(74,124,89,0.18); transform: scale(1.05); }
        .icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .icon-btn.listening { background: rgba(220,53,69,0.12); }
        .icon-btn.listening:hover { background: rgba(220,53,69,0.22); }
        @keyframes micPulse {
          0%   { box-shadow: 0 0 0 0 rgba(220,53,69,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(220,53,69,0); }
          100% { box-shadow: 0 0 0 0 rgba(220,53,69,0); }
        }
        .icon-btn.listening { animation: micPulse 1.2s infinite; }
        .lang-pill-wrap { display: flex; gap: 4px; margin-bottom: 6px; align-items: center; }
        .lang-pill {
          font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 600;
          padding: 2px 7px; border-radius: 99px; border: 1px solid #dce8dc;
          background: #f4f7f4; color: #4a7c59; cursor: pointer; transition: all 0.15s;
        }
        .lang-pill.active { background: #4a7c59; color: #fff; border-color: #4a7c59; }
        .image-preview-wrap { position: relative; display: inline-block; margin-bottom: 8px; }
        .image-preview-thumb {
          width: 56px; height: 56px; border-radius: 10px;
          object-fit: cover; border: 2px solid #4a7c59; display: block;
        }
        .remove-img-btn {
          position: absolute; top: -6px; right: -6px;
          width: 18px; height: 18px; border-radius: 50%;
          background: #dc3545; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 10px; line-height: 1;
        }
        .voice-error {
          font-family: 'DM Sans', sans-serif; font-size: 11.5px; color: #c0392b;
          background: rgba(220,53,69,0.07); border: 1px solid rgba(220,53,69,0.18);
          border-radius: 8px; padding: 6px 10px; margin-top: 6px; line-height: 1.5;
        }
      `}</style>

      {/* Voice language selector pills */}
      <div className="lang-pill-wrap">
        <span style={{ fontSize: 10, color: '#8a9e8b', fontWeight: 600 }}>VOICE LANG:</span>
        <button type="button" className={`lang-pill ${voiceLang === 'bn-IN' ? 'active' : ''}`} onClick={() => setVoiceLang('bn-IN')}>বাংলা</button>
        <button type="button" className={`lang-pill ${voiceLang === 'hi-IN' ? 'active' : ''}`} onClick={() => setVoiceLang('hi-IN')}>हिन्दी</button>
        <button type="button" className={`lang-pill ${voiceLang === 'en-IN' ? 'active' : ''}`} onClick={() => setVoiceLang('en-IN')}>EN</button>
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div style={{ paddingBottom: 4 }}>
          <div className="image-preview-wrap">
            <img src={imagePreview} alt="Preview" className="image-preview-thumb" />
            <button className="remove-img-btn" onClick={removeImage} title="Remove image">✕</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />

        {/* 📷 Gallery button */}
        <button
          type="button"
          className="icon-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Attach image from gallery"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4a7c59" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </button>

        {/* 🎤 Voice button */}
        <button
          type="button"
          className={`icon-btn${isListening ? ' listening' : ''}`}
          onClick={handleVoiceToggle}
          disabled={disabled}
          title={
            !voiceSupported ? 'Voice not supported — use Chrome or Safari'
            : isListening   ? 'Listening... click to stop'
                            : `Speak in ${voiceLang === 'bn-IN' ? 'Bengali' : voiceLang === 'hi-IN' ? 'Hindi' : 'English'}`
          }
        >
          {isListening ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc3545" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3"  y1="10" x2="3"  y2="14" />
              <line x1="7"  y1="6"  x2="7"  y2="18" />
              <line x1="11" y1="3"  x2="11" y2="21" />
              <line x1="15" y1="6"  x2="15" y2="18" />
              <line x1="19" y1="10" x2="19" y2="14" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={voiceSupported ? '#4a7c59' : '#bbb'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
              <path d="M19 10v2a7 7 0 01-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8"  y1="23" x2="16" y2="23" />
            </svg>
          )}
        </button>

        {/* Text / voice input */}
        <div
          style={{
            flex: 1, display: 'flex', alignItems: 'center',
            background: focused ? '#fff' : 'rgba(248,250,248,1)',
            border: isListening ? '1.5px solid #dc3545'
              : focused ? '1.5px solid #4a7c59' : '1.5px solid #dce8dc',
            borderRadius: 50, padding: '6px 16px',
            transition: 'all 0.2s ease',
            boxShadow: isListening ? '0 0 0 3px rgba(220,53,69,0.1)'
              : focused ? '0 0 0 3px rgba(74,124,89,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          <span style={{ fontSize: 14, marginRight: 7, opacity: 0.6 }}>
            {isListening ? '🎤' : '🌱'}
          </span>
          <input
            type="text"
            value={displayValue}
            onChange={(e) => { if (!isListening) setMessage(e.target.value); }}
            onKeyPress={handleKeyPress}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={inputPlaceholder}
            disabled={disabled}
            className="chat-input-field"
            style={{
              flex: 1, border: 'none', background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13.5,
              color: isListening ? '#c0392b' : '#2c3e2d',
              fontWeight: 400,
              fontStyle: isListening ? 'italic' : 'normal',
            }}
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={!canSend}
          className="send-btn"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: canSend ? 'linear-gradient(135deg, #4a7c59, #2d5a3d)' : '#ccd8cc',
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: canSend ? '0 4px 12px rgba(74,124,89,0.35)' : 'none',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>

      {/* Voice error banner */}
      {voiceError && <div className="voice-error">{voiceError}</div>}
    </div>
  );
};

export default ChatInput;