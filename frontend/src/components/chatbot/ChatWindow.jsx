import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import chatbotService from '../../services/chatbotService';
import { stopSpeech } from '../../services/ttsService';
import { useLanguage } from '../../context/LanguageContext';
import { getFarmerActiveContext } from '../../utils/farmerContextStore';

const ChatWindow = () => {
  const { language } = useLanguage(); // 'bn' | 'hi' | 'en'

  const getQuickAskChips = (lang) => {
    if (lang === 'bn') {
      return ['বারাসাতের আবহাওয়া', 'ধানের রোগ চিকিৎসা', 'সরকারি প্রকল্প ও সাবসিডি', 'বাজারে ফসলের দাম'];
    }
    if (lang === 'hi') {
      return ['बरासात का मौसम', 'धान का झुलसा रोग', 'सरकारी योजनाएं', 'बाज़ार भाव'];
    }
    return ['Weather in Barasat', 'Crop disease diagnosis', 'Government schemes', 'Market produce prices'];
  };

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [suggestions, setSuggestions] = useState(() => getQuickAskChips(language));
  const conversationVersionRef = useRef(0);
  const messagesEndRef = useRef(null);

  // Update quick ask chips when site language changes
  useEffect(() => {
    setSuggestions(getQuickAskChips(language));
  }, [language]);

  // Auto scroll to bottom
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
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };
    loadChatHistory();
  }, []);

  // Send message handler with request cancellation version control and farmer section context
  const handleSendMessage = async (messageText, imageFile = null) => {
    const hasText = messageText?.trim();
    if (!hasText && !imageFile) return;

    const currentVersion = conversationVersionRef.current;
    const localImageUrl = imageFile ? URL.createObjectURL(imageFile) : null;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: hasText ? messageText : (language === 'bn' ? 'ছবি পাঠানো হয়েছে' : language === 'hi' ? 'फोटो भेजी गई' : 'Image sent'),
      imageUrl: localImageUrl,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      let response;
      const farmerActiveContext = getFarmerActiveContext();
      const contextObj = {
        language,
        farmerContext: farmerActiveContext
      };

      if (imageFile) {
        response = await chatbotService.sendMessageWithImage(messageText || '', imageFile, sessionId, contextObj);
      } else {
        response = await chatbotService.sendMessage(messageText, sessionId, contextObj);
      }

      if (conversationVersionRef.current !== currentVersion) {
        return;
      }

      if (response?.data?.sessionId) {
        setSessionId(response.data.sessionId);
      }

      const botMsgText = response?.data?.message || response?.message || (language === 'bn' ? 'আপনার প্রশ্নের জন্য ধন্যবাদ।' : language === 'hi' ? 'आपके प्रश्न के लिए धन्यवाद।' : 'Thank you for your question.');

      const botMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: botMsgText,
        detectedLanguage: response?.data?.detectedLanguage || response?.data?.metadata?.detectedLanguage || language,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      if (conversationVersionRef.current !== currentVersion) return;
      console.error('Error processing chatbot response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: language === 'bn' ? 'দুঃখিত, উত্তর প্রক্রিয়া করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।' : language === 'hi' ? 'क्षमा करें, उत्तर प्रक्रिया में समस्या हुई। कृपया पुनः प्रयास करें।' : 'Sorry, failed to process answer. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      if (conversationVersionRef.current === currentVersion) {
        setLoading(false);
      }
    }
  };

  const handleClearHistory = async () => {
    stopSpeech();
    conversationVersionRef.current += 1;
    setLoading(false);
    setMessages([]);
    setSessionId(null);
    try {
      await chatbotService.clearChatHistory();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-900 px-5 py-4 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-emerald-600/60 border border-emerald-400/40 flex items-center justify-center text-xl shadow-inner">
            🌾
          </div>
          <div>
            <h3 className="font-bold text-base tracking-wide">
              AgriSathi AI
            </h3>
            <p className="text-xs text-emerald-200/90 font-medium">
              {language === 'bn' ? 'আপনার ব্যক্তিগত কৃত্রিম বুদ্ধিমত্তা কৃষি সহকারী' : language === 'hi' ? 'आपका व्यक्तिगत एआई कृषि सहायक' : 'Your Personal AI Agriculture Assistant'}
            </p>
          </div>
        </div>
        <button
          onClick={handleClearHistory}
          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors border border-white/15"
          title="Clear Conversation"
        >
          {language === 'bn' ? 'মুছে ফেলুন' : language === 'hi' ? 'साफ़ करें' : 'Clear'}
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl shadow-sm mb-1">
              🌱
            </div>
            <h4 className="font-bold text-gray-800 text-lg">
              {language === 'bn' ? 'কৃষিসাথী এআই-তে স্বাগতম' : language === 'hi' ? 'एग्रीसाथी एआई में आपका स्वागत है' : 'Welcome to AgriSathi AI'}
            </h4>
            <p className="text-sm text-gray-600 max-w-sm">
              {language === 'bn' ? 'মাটি, সেচ, আবহাওয়া, ফসল কাটা, রোগের ছবি বা বাজারে শস্য বিক্রির বিষয়ে যেকোনো প্রশ্ন জিজ্ঞেস করুন।' : language === 'hi' ? 'मिट्टी, सिंचाई, मौसम, फसल रोग की फोटो या बाजार भाव पर कोई भी सवाल पूछें।' : 'Ask any question about soil, irrigation, weather, crop disease diagnosis, or market prices.'}
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))
        )}

        {loading && (
          <div className="flex items-center space-x-2 text-emerald-700 text-xs bg-emerald-50 border border-emerald-200/60 rounded-xl p-3 w-fit animate-pulse">
            <div className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span>
              {language === 'bn' ? 'কৃষিসাথী এআই রিয়েল-টাইম ডাটা বিশ্লেষণ করছে...' : language === 'hi' ? 'एग्रीसाथी एआई डेटा विश्लेषण कर रहा है...' : 'AgriSathi AI is analyzing real-time data...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Chips */}
      {suggestions.length > 0 && (
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {suggestions.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      <ChatInput onSendMessage={handleSendMessage} disabled={loading} />
    </div>
  );
};

export default ChatWindow;