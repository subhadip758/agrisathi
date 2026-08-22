import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import chatbotService from '../../services/chatbotService';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hello! I'm your farming assistant. Ask me anything about crops, soil health, or weather — or even send a photo of your field! 🌾",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState([
    '🌽 Crop recommendations',
    '🌱 Check soil health',
    '🌤 Weather forecast',
  ]);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history once on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const response = await chatbotService.getChatHistory(10);
        const historyData = response?.data?.history || response?.data || [];
        if (Array.isArray(historyData) && historyData.length > 0) {
          const latestSession = historyData[0];
          if (latestSession?.sessionId) setSessionId(latestSession.sessionId);

          const formattedMessages = [];
          const history = [...historyData].reverse();
          history.forEach((chat) => {
            if (Array.isArray(chat.messages)) {
              chat.messages.forEach((msg) => {
                formattedMessages.push({
                  id: formattedMessages.length + 1,
                  role: msg.role,
                  content: msg.content,
                  detectedLanguage: msg.metadata?.detectedLanguage,
                  timestamp: new Date(msg.timestamp || Date.now()),
                });
              });
            }
          });
          if (formattedMessages.length > 0) {
            setMessages((prev) => [...formattedMessages, prev[0]]);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, []);

  // ─── Core send handler — supports text-only OR text+image ─────────────────
  const handleSendMessage = async (messageText, imageFile = null) => {
    const hasText = messageText?.trim();
    if (!hasText && !imageFile) return;

    // Build local preview URL for the image (shown in user bubble)
    const localImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: hasText ? messageText : '📷 Image sent',
      imageUrl: localImageUrl,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      let response;

      if (imageFile) {
        response = await chatbotService.sendMessageWithImage(messageText || '', imageFile, sessionId);
      } else {
        response = await chatbotService.sendMessage(messageText, sessionId);
      }

      if (response?.data?.sessionId) {
        setSessionId(response.data.sessionId);
      }

      const botMsgText = response?.data?.message || response?.message || 'Thank you for your question. How else can I assist your field?';

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: botMsgText,
        detectedLanguage: response?.data?.detectedLanguage || response?.data?.metadata?.detectedLanguage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (response?.data?.suggestions) setSuggestions(response.data.suggestions);
    } catch (err) {
      console.error('Chat send error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
      if (localImageUrl) URL.revokeObjectURL(localImageUrl);
    }
  };

  const handleClearChat = async () => {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setSessionId(null);
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: "Hello! I'm your farming assistant. Ask me anything about crops, soil health, or weather — or even send a photo of your field! 🌾",
        timestamp: new Date(),
      },
    ]);
    setSuggestions(['🌽 Crop recommendations', '🌱 Check soil health', '🌤 Weather forecast']);

    try {
      await chatbotService.clearChatHistory();
    } catch (error) {
      console.error('Error clearing chat on server:', error);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        .chat-window {
          display: flex; flex-direction: column;
          height: 480px; width: 360px; border-radius: 18px; overflow: hidden;
          box-shadow: 0 20px 60px rgba(45,90,61,0.18), 0 4px 16px rgba(0,0,0,0.08);
          font-family: 'DM Sans', sans-serif;
          background: #f4f7f4; position: relative;
        }
        .chat-header {
          background: linear-gradient(135deg, #2d5a3d 0%, #4a7c59 60%, #5e9469 100%);
          padding: 10px 14px; display: flex; align-items: center;
          justify-content: space-between; position: relative; overflow: hidden;
        }
        .chat-header::before {
          content: ''; position: absolute; top: -30px; right: -30px;
          width: 100px; height: 100px; border-radius: 50%;
          background: rgba(255,255,255,0.06);
        }
        .chat-header::after {
          content: ''; position: absolute; bottom: -20px; left: 40%;
          width: 70px; height: 70px; border-radius: 50%;
          background: rgba(255,255,255,0.04);
        }
        .header-title {
          font-family: 'DM Serif Display', serif; font-size: 14px;
          color: #fff; font-weight: 400; letter-spacing: 0.02em; line-height: 1.2;
        }
        .header-sub {
          font-size: 10px; color: rgba(255,255,255,0.65);
          font-weight: 300; letter-spacing: 0.04em; margin-top: 1px;
        }
        .status-dot {
          width: 7px; height: 7px; background: #7ed99a; border-radius: 50%;
          display: inline-block; margin-right: 6px;
          box-shadow: 0 0 0 2px rgba(126,217,154,0.3); animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px rgba(126,217,154,0.3); }
          50% { box-shadow: 0 0 0 5px rgba(126,217,154,0.1); }
        }
        .clear-btn {
          background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
          border-radius: 10px; padding: 7px 10px; cursor: pointer;
          color: rgba(255,255,255,0.8); transition: all 0.2s ease;
          display: flex; align-items: center; gap: 5px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 400;
        }
        .clear-btn:hover { background: rgba(255,255,255,0.2); color: #fff; }
        .messages-area {
          flex: 1; overflow-y: auto; overflow-x: hidden;
          padding: 12px 12px; display: flex; flex-direction: column;
          gap: 10px; background: #f4f7f4;
          background-image:
            radial-gradient(circle at 15% 85%, rgba(74,124,89,0.05) 0%, transparent 50%),
            radial-gradient(circle at 85% 10%, rgba(200,169,110,0.06) 0%, transparent 50%);
          min-height: 0;
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: #c8ddc8; border-radius: 4px; }
        .typing-bubble { display: flex; align-items: flex-end; gap: 8px; }
        .typing-dots {
          background: rgba(255,255,255,0.92); border: 1px solid rgba(74,124,89,0.12);
          border-radius: 20px 20px 20px 4px; padding: 12px 16px;
          display: flex; gap: 5px; align-items: center;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .dot {
          width: 7px; height: 7px; background: #9ab89a;
          border-radius: 50%; animation: bounce 1.2s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .suggestions-bar {
          padding: 7px 12px 9px; background: #eef3ee;
          border-top: 1px solid rgba(74,124,89,0.1);
        }
        .suggestions-label {
          font-size: 9.5px; color: #8a9e8b; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
        }
        .suggestions-list { display: flex; flex-wrap: wrap; gap: 5px; }
        .suggestion-chip {
          font-family: 'DM Sans', sans-serif; font-size: 11.5px; font-weight: 400;
          background: #fff; border: 1.5px solid #ccdacc; color: #3a5e40;
          padding: 4px 11px; border-radius: 50px; cursor: pointer;
          transition: all 0.18s ease; letter-spacing: 0.01em;
        }
        .suggestion-chip:hover {
          background: #4a7c59; border-color: #4a7c59; color: #fff;
          transform: translateY(-1px); box-shadow: 0 4px 10px rgba(74,124,89,0.25);
        }
        .input-area {
          padding: 10px 12px; background: #fff;
          border-top: 1px solid rgba(74,124,89,0.08);
        }
        .avatar-bot {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #4a7c59, #2d5a3d);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; box-shadow: 0 2px 8px rgba(74,124,89,0.35); flex-shrink: 0;
        }
      `}</style>

      <div className="chat-window">
        {/* Header */}
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                border: '2px solid rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, backdropFilter: 'blur(4px)',
              }}
            >
              🌾
            </div>
            <div>
              <div className="header-title">Farming Assistant</div>
              <div className="header-sub">
                <span className="status-dot" />
                Always here to help
              </div>
            </div>
          </div>
          <button onClick={handleClearChat} className="clear-btn" title="Clear chat">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="typing-bubble">
              <div className="avatar-bot">🌿</div>
              <div className="typing-dots">
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="suggestions-bar">
            <div className="suggestions-label">Quick asks</div>
            <div className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-chip"
                  onClick={() => handleSendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="input-area">
          <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </>
  );
};

export default ChatWindow;
