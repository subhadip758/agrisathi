import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Bell, User, LogOut, Settings, ChevronDown, Languages,
  LayoutDashboard, TestTube, CloudRain, Droplets, Bug, BarChart3, TrendingUp, MessageSquare, Users, Newspaper, ExternalLink, RefreshCw,
  ShoppingBag, Building2, ShieldAlert, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import common from '../../i18n/common';

// ── Color helpers ─────────────────────────────────────────────────────────────
function colorRGB(colorClass) {
  if (colorClass.includes('emerald')) return '16,185,129';
  if (colorClass.includes('green'))   return '34,197,94';
  if (colorClass.includes('sky'))     return '14,165,233';
  if (colorClass.includes('cyan'))    return '6,182,212';
  if (colorClass.includes('teal'))    return '20,184,166';
  if (colorClass.includes('blue'))    return '59,130,246';
  if (colorClass.includes('indigo'))  return '99,102,241';
  if (colorClass.includes('violet'))  return '139,92,246';
  if (colorClass.includes('purple'))  return '168,85,247';
  if (colorClass.includes('pink'))    return '236,72,153';
  if (colorClass.includes('rose'))    return '244,63,94';
  if (colorClass.includes('red'))     return '239,68,68';
  if (colorClass.includes('amber'))   return '251,146,60';
  if (colorClass.includes('orange'))  return '249,115,22';
  if (colorClass.includes('yellow'))  return '234,179,8';
  return '34,197,94';
}
function buildGlow(c) { const r = colorRGB(c); return `0 0 16px rgba(${r},.55), 0 0 32px rgba(${r},.3)`; }
function buildTextGlow(c) { const r = colorRGB(c); return `0 0 8px rgba(${r},.8), 0 0 16px rgba(${r},.5)`; }

// ── Menu items (Recommended Farmer Workflow Order) ─────────────────────────
const menuItems = [
  { key: 'Dashboard',   icon: LayoutDashboard, path: '/dashboard',           color: 'from-blue-500 to-cyan-500'     },
  { key: 'Weather',     icon: CloudRain,        path: '/weather',             color: 'from-sky-500 to-blue-500'     },
  { key: 'Soil',        icon: TestTube,         path: '/soil-analysis',       color: 'from-amber-500 to-orange-500' },
  { key: 'Irrigation',  icon: Droplets,         path: '/irrigation',          color: 'from-cyan-500 to-teal-500'    },
  { key: 'Water',       icon: BarChart3,        path: '/water-analytics',     color: 'from-indigo-500 to-blue-500'  },
  { key: 'Yield',       icon: TrendingUp,       path: '/yield-prediction',    color: 'from-emerald-500 to-green-500'},
  { key: 'Disease',     icon: Bug,              path: '/disease-detection',   color: 'from-red-500 to-rose-500'     },
  { key: 'Market',      icon: ShoppingBag,      path: '/market',              color: 'from-amber-500 to-yellow-500' },
  { key: 'Schemes',     icon: Building2,        path: '/schemes',             color: 'from-blue-600 to-indigo-500'  },
  { key: 'Alerts',      icon: ShieldAlert,      path: '/alerts',              color: 'from-rose-500 to-red-500'     },
  { key: 'Helpdesk',    icon: MessageSquare,    path: '/helpdesk',            color: 'from-teal-500 to-cyan-500'    },
];

// ── News tag colors ───────────────────────────────────────────────────────────
const TAG_COLORS = {
  'MSP':        'bg-emerald-100 text-emerald-700',
  'Monsoon':    'bg-blue-100 text-blue-700',
  'Export':     'bg-purple-100 text-purple-700',
  'Technology': 'bg-amber-100 text-amber-700',
  'Subsidy':    'bg-green-100 text-green-700',
  'Alert':      'bg-red-100 text-red-700',
  'Market':     'bg-orange-100 text-orange-700',
  'Policy':     'bg-indigo-100 text-indigo-700',
};

// ── Fallback static news (shown while fetching or on error) ──────────────────
// ── Fallback static news (shown while fetching or on error) ──────────────────
const FALLBACK_NEWS = [
  {
    id: 1,
    title: "Govt raises MSP for Kharif crops by 7% ahead of sowing season",
    titleBn: "বুনো মরসুমের আগেই খরিফ ফসলের এমএসপি ৭% বাড়াল সরকার",
    titleHi: "बुवाई के मौसम से पहले सरकार ने खरीफ फसलों का न्यूनतम समर्थन मूल्य (MSP) 7% बढ़ाया",
    source: 'The Hindu / কৃষি পত্রিকা',
    time: '2h ago',
    tag: 'MSP',
    tagBn: 'এমএসপি (দাম)',
    tagHi: 'न्यूनतम समर्थन मूल्य',
    url: 'https://news.google.com/search?q=Govt+raises+MSP+for+Kharif+crops+by+7'
  },
  {
    id: 2,
    title: "IMD predicts above-normal monsoon rainfall for 2025 — good news for farmers",
    titleBn: "আবহাওয়া দফতর ২০২৫ সালে স্বাভাবিকের চেয়ে বেশি বর্ষার পূর্বাভাস দিয়েছে — কৃষকদের জন্য সুখবর",
    titleHi: "मौसम विभाग का अनुमान: 2025 में सामान्य से अधिक मानसून बारिश — किसानों के लिए बड़ी खुशखबरी",
    source: 'Times of India',
    time: '4h ago',
    tag: 'Monsoon',
    tagBn: 'বর্ষার পূর্বাভাস',
    tagHi: 'मानसून',
    url: 'https://news.google.com/search?q=IMD+predicts+above-normal+monsoon+rainfall'
  },
  {
    id: 3,
    title: "India's rice export ban lifted; global prices expected to stabilise",
    titleBn: "ভারতের চাল রপ্তানি নিষেধাজ্ঞা প্রত্যাহার; আন্তর্জাতিক বাজারে দাম স্বাভাবিক হওয়ার আশা",
    titleHi: "भारत ने चावल निर्यात पर लगा प्रतिबंध हटाया; वैश्विक कीमतों में स्थिरता आने की उम्मीद",
    source: 'Economic Times',
    time: '6h ago',
    tag: 'Export',
    tagBn: 'রপ্তানি বার্তা',
    tagHi: 'निर्यात',
    url: 'https://news.google.com/search?q=India+rice+export+ban+lifted'
  },
  {
    id: 4,
    title: "New AI-powered pest detection app launched for smallholder farmers",
    titleBn: "ক্ষুদ্র কৃষকদের জন্য নতুন এআই চালিত পোকা ও রোগ শনাক্তকরণ প্রযুক্তি চালু",
    titleHi: "छोटे किसानों के लिए नया एआई-संचालित कीट पहचान ऐप लॉन्च",
    source: 'AgriMint',
    time: '8h ago',
    tag: 'Technology',
    tagBn: 'প্রযুক্তি',
    tagHi: 'तकनीक',
    url: 'https://news.google.com/search?q=AI-powered+pest+detection+app+farmers'
  },
  {
    id: 5,
    title: "PM Kisan 17th installment released — ₹2000 transferred to 9 crore farmers",
    titleBn: "পিএম কিষানের ১৭তম কিস্তি মুক্ত — ৯ কোটি কৃষকের অ্যাকাউন্টে ২০০০ টাকা সরাসরি হস্তান্তর",
    titleHi: "पीएम किसान की 17वीं किस्त जारी — 9 करोड़ किसानों के खातों में ₹2000 सीधे ट्रांसफर",
    source: 'NDTV',
    time: '10h ago',
    tag: 'Subsidy',
    tagBn: 'অনুদানের অর্থ',
    tagHi: 'सरकारी योजना',
    url: 'https://news.google.com/search?q=PM+Kisan+17th+installment+released'
  },
  {
    id: 6,
    title: "Locust warning issued in Rajasthan & Gujarat — farmers on high alert",
    titleBn: "রাজস্থান ও গুজরাটে পঙ্গপাল আক্রমণের সতর্কতা জারি — কৃষকদের সতর্ক থাকার নির্দেশ",
    titleHi: "राजस्थान और गुजरात में टिड्डी हमले की चेतावनी जारी — किसानों को सतर्क रहने के निर्देश",
    source: 'Krishi Jagran',
    time: '12h ago',
    tag: 'Alert',
    tagBn: 'জরুরি সতর্কতা',
    tagHi: 'चेतावनी',
    url: 'https://news.google.com/search?q=Locust+warning+issued+in+Rajasthan+Gujarat'
  },
];

// ── AgriNews Panel ────────────────────────────────────────────────────────────
const AgriNewsPanel = ({ onClose }) => {
  const { language }          = useLanguage();
  const [news, setNews]       = useState(FALLBACK_NEWS);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);
  const [activeTag, setTag]   = useState('All');
  const [newsLangMode, setNewsLangMode] = useState('all'); // 'all' | 'bn' | 'hi' | 'en'

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const key = process.env.REACT_APP_GNEWS_KEY;
      if (!key) throw new Error('No API key');
      const langCode = newsLangMode === 'bn' || newsLangMode === 'hi' ? 'hi' : 'en';
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=agriculture+farming+india&lang=${langCode}&max=8&apikey=${key}`
      );
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const mapped = data.articles.map((a, i) => ({
        id: i,
        title: a.title,
        source: a.source.name,
        time: new Date(a.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        tag: 'News',
        url: a.url,
        image: a.image,
      }));
      setNews(mapped);
    } catch {
      setError(true);
      setNews(FALLBACK_NEWS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, [language, newsLangMode]);

  const getItemTitle = (item) => {
    if (newsLangMode === 'bn' && item.titleBn) return item.titleBn;
    if (newsLangMode === 'hi' && item.titleHi) return item.titleHi;
    if (newsLangMode === 'en') return item.title;
    // 'all' mode uses site default or English fallback
    if (language === 'bn' && item.titleBn) return item.titleBn;
    if (language === 'hi' && item.titleHi) return item.titleHi;
    return item.title;
  };

  const getItemTag = (item) => {
    if (newsLangMode === 'bn' && item.tagBn) return item.tagBn;
    if (newsLangMode === 'hi' && item.tagHi) return item.tagHi;
    if (language === 'bn' && item.tagBn) return item.tagBn;
    if (language === 'hi' && item.tagHi) return item.tagHi;
    return item.tag;
  };

  const allTags = ['All', ...new Set(news.map(n => getItemTag(n)))];
  const filtered = activeTag === 'All' ? news : news.filter(n => getItemTag(n) === activeTag);

  return (
    <div className="absolute right-0 top-12 w-96 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
      style={{ background: 'linear-gradient(160deg,#f0fdf4,#ffffff)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
        style={{ background: 'linear-gradient(90deg,#14532d,#166534)' }}>
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-green-300" />
          <span className="text-white font-bold text-sm tracking-wide">
            {language === 'bn' ? 'কৃষি বার্তা ও খবর' : language === 'hi' ? 'कृषि समाचार एवं अलर्ट' : 'Agri News'}
          </span>
          <span className="text-xs bg-green-500/40 text-green-100 px-2 py-0.5 rounded-full font-medium">Live</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchNews}
            className={`text-green-300 hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}>
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button onClick={onClose} className="text-green-300 hover:text-white text-xl leading-none">×</button>
        </div>
      </div>

      {/* Language Filter Tabs */}
      <div className="flex items-center justify-around bg-green-900/90 text-white text-xs py-1.5 px-2 font-medium border-b border-green-800">
        <button
          onClick={() => setNewsLangMode('all')}
          className={`px-2 py-0.5 rounded transition ${newsLangMode === 'all' ? 'bg-green-500 text-white font-bold' : 'text-green-200 hover:text-white'}`}
        >
          🌐 All / সব / सब
        </button>
        <button
          onClick={() => setNewsLangMode('bn')}
          className={`px-2 py-0.5 rounded transition ${newsLangMode === 'bn' ? 'bg-green-500 text-white font-bold' : 'text-green-200 hover:text-white'}`}
        >
          🇧🇩 বাংলা
        </button>
        <button
          onClick={() => setNewsLangMode('hi')}
          className={`px-2 py-0.5 rounded transition ${newsLangMode === 'hi' ? 'bg-green-500 text-white font-bold' : 'text-green-200 hover:text-white'}`}
        >
          🇮🇳 हिंदी
        </button>
        <button
          onClick={() => setNewsLangMode('en')}
          className={`px-2 py-0.5 rounded transition ${newsLangMode === 'en' ? 'bg-green-500 text-white font-bold' : 'text-green-200 hover:text-white'}`}
        >
          🇬🇧 English
        </button>
      </div>

      {/* Tag filters */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto border-b border-gray-100 bg-white/60">
        {allTags.map(tag => (
          <button key={tag} onClick={() => setTag(tag)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap transition-all ${
              activeTag === tag
                ? 'bg-green-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {tag}
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="overflow-y-auto" style={{ maxHeight: '380px' }}>
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {filtered.map((item, idx) => (
              <li key={item.id}>
                <a href={item.url && item.url !== '#' ? item.url : `https://news.google.com/search?q=${encodeURIComponent(getItemTitle(item))}`} target="_blank" rel="noopener noreferrer"
                  className="flex gap-3 px-4 py-3 hover:bg-green-50/60 transition-colors group">

                  {/* Rank number */}
                  <span className="text-xl font-black text-gray-100 group-hover:text-green-200 transition-colors shrink-0 w-5 text-center leading-tight mt-0.5">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-green-800 transition-colors">
                      {getItemTitle(item)}
                    </p>

                    {/* Show Bengali & Hindi translations together in 'all' mode */}
                    {newsLangMode === 'all' && (
                      <div className="mt-1 space-y-0.5 text-[11px] text-gray-600 border-l-2 border-green-500 pl-2 bg-green-50/40 py-1 rounded-r">
                        {item.titleBn && <p className="font-medium text-emerald-900">🇧🇩 {item.titleBn}</p>}
                        {item.titleHi && <p className="font-medium text-blue-900">🇮🇳 {item.titleHi}</p>}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[item.tag] || 'bg-gray-100 text-gray-600'}`}>
                        {getItemTag(item)}
                      </span>
                      <span className="text-xs text-gray-400">{item.source}</span>
                      <span className="text-xs text-gray-300">·</span>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </div>
                  </div>

                  <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-green-500 transition-colors shrink-0 mt-1" />
                </a>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <div className="px-4 py-2 text-xs text-amber-600 bg-amber-50 flex items-center gap-1.5">
            <span>⚠️</span> {language === 'bn' ? 'সংরক্ষিত খবর দেখানো হচ্ছে।' : language === 'hi' ? 'संरक्षित समाचार दिखाए जा रहे हैं।' : 'Showing cached Headlines.'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-white/80 flex items-center justify-between">
        <span className="text-xs text-gray-400">AgriSathi Trilingual News Feed</span>
        <a href="https://news.google.com" target="_blank" rel="noopener noreferrer"
          className="text-xs text-green-600 font-medium hover:underline">Google News</a>
      </div>
    </div>
  );
};

// ── Main Navbar ───────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout }             = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const location                     = useLocation();
  const t                            = common[language];

  const [displayName, setDisplayName] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisathi_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p && p.name) return p.name;
      }
    } catch (_) {}
    return user?.name || 'Subhadip Pal';
  });

  const [displayEmail, setDisplayEmail] = useState(() => {
    try {
      const saved = localStorage.getItem('agrisathi_profile');
      if (saved) {
        const p = JSON.parse(saved);
        if (p && p.email) return p.email;
      }
    } catch (_) {}
    return user?.email || 'subhadip@agrisathi.com';
  });

  useEffect(() => {
    const updateFromStorage = () => {
      try {
        const saved = localStorage.getItem('agrisathi_profile');
        if (saved) {
          const p = JSON.parse(saved);
          if (p && p.name) setDisplayName(p.name);
          if (p && p.email) setDisplayEmail(p.email);
        } else if (user?.name) {
          setDisplayName(user.name);
          if (user.email) setDisplayEmail(user.email);
        }
      } catch (_) {}
    };

    updateFromStorage();
    window.addEventListener('storage', updateFromStorage);
    const interval = setInterval(updateFromStorage, 1000);
    return () => {
      window.removeEventListener('storage', updateFromStorage);
      clearInterval(interval);
    };
  }, [user]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showProfile,  setShowProfile]  = useState(false);
  const [showNotif,    setShowNotif]    = useState(false);
  const [showNews,     setShowNews]     = useState(false);
  const [logoRotated,  setLogoRotated]  = useState(false);
  const [hoveredItem,  setHoveredItem]  = useState(null);

  const dropdownRef = useRef(null);
  const newsRef     = useRef(null);
  const langLabel   = { en: 'EN', hi: 'हिंदी', bn: 'বাংলা' };

  // Close menu dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false); setLogoRotated(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close news panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (newsRef.current && !newsRef.current.contains(e.target)) setShowNews(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogoClick = () => {
    const next = !dropdownOpen;
    setDropdownOpen(next); setLogoRotated(next);
  };

  const closeAll = () => {
    setDropdownOpen(false); setLogoRotated(false);
    setShowProfile(false);  setShowNotif(false); setShowNews(false);
  };

  const notifications = [
    {
      id: 1,
      title: language === 'bn' ? '🚿 সেচ দেওয়ার তাগিদ (বারাসাত)' : language === 'hi' ? '🚿 सिंचाई अनुस्मारक (बारासात)' : '🚿 Irrigation Reminder (Barasat)',
      message: language === 'bn' ? 'আপনার ধান ও গম খেতে আজ ২,০০০ লিটার সেচ প্রদান করার নির্দেশ দেয়া হচ্ছে।' : language === 'hi' ? 'आज आपके खेत में 2,000 लीटर सिंचाई करने की सलाह दी जाती है।' : 'Recommended to water your wheat & rice fields today (2,000L).',
      time: '10 min ago',
      unread: true
    },
    {
      id: 2,
      title: language === 'bn' ? '🌱 মাটি পরীক্ষার ফলাফল আপডেট' : language === 'hi' ? '🌱 मृदा स्वास्थ्य रिपोर्ट अपडेट' : '🌱 Soil Health Analysis Complete',
      message: language === 'bn' ? 'উত্তর ২৪ পরগনা বারাসাত এলাকার দোআঁশ মাটির এনপিকে স্কোর রেকর্ড করা হয়েছে।' : language === 'hi' ? 'बारासात खेत की मिट्टी का एनपीके स्कोर सहेजा गया है।' : 'Barasat farm soil test completed with optimal NPK balance.',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: language === 'bn' ? '🌧️ আগামীকালের বৃষ্টির পূর্বাভাস' : language === 'hi' ? '🌧️ कल बारिश का पूर्वानुमान' : '🌧️ Tomorrow Rain Warning',
      message: language === 'bn' ? 'বারাসাতে আগামী ২৪ ঘণ্টায় ২৫ মিমি বৃষ্টিপাত হতে পারে। রাসায়নিক ছিটানো স্থগিত রাখুন।' : language === 'hi' ? 'अगले 24 घंटों में 25 मिमी बारिश की संभावना। कीटनाशक छिड़काव रोकें।' : 'IMD predicts 25mm rain in Barasat tomorrow. Postpone pesticide spray.',
      time: '3 hours ago',
      unread: false
    },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;
  const isCommunityActive = location.pathname === '/community';

  return (
    <>
      <nav className="bg-white shadow-md h-16 flex items-center justify-between px-6 sticky top-0 z-[10000]">

        {/* ── Logo + Dropdown ── */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={handleLogoClick} aria-label="Toggle menu" className="focus:outline-none flex items-center gap-2">
            <img src="/assets/images/logo.jpeg" alt="AgriSathi"
              className="w-10 h-10 rounded-full object-cover shadow-lg shadow-green-500/30 hover:shadow-green-500/60"
              style={{
                transition: 'transform 0.5s ease-in-out, box-shadow 0.3s',
                transform: logoRotated ? 'rotate(360deg) scale(1.1)' : 'rotate(0deg) scale(1)',
              }} />
            <span className="hidden sm:inline-block font-extrabold text-lg text-emerald-900 tracking-tight">
              AgriSathi
            </span>
          </button>

          <div className={`absolute left-0 top-14 w-72 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out origin-top-left z-[10001]
            ${dropdownOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-3 pointer-events-none'}`}
            style={{ background: 'linear-gradient(145deg, #0f172a, #1e293b, #0f172a)' }}>
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              <div className="absolute top-0 -left-4 w-48 h-48 bg-green-500 rounded-full blur-3xl animate-blob" />
              <div className="absolute top-10 -right-4 w-48 h-48 bg-blue-500 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute bottom-0 left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>
            <nav className="relative z-10 overflow-y-auto py-3 px-2" style={{ maxHeight: '70vh' }}>
              <ul className="space-y-0.5">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  const isHovered = hoveredItem === item.key;
                  return (
                    <li key={item.path} style={{ animationDelay: `${index * 35}ms` }} className="animate-slideIn">
                      <Link to={item.path}
                        onMouseEnter={() => setHoveredItem(item.key)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={closeAll}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-250 overflow-hidden group
                          ${active ? 'text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700/30'}`}
                        style={active ? { background: 'rgba(15,23,42,0.8)', boxShadow: 'inset 0 0 0 1px rgba(100,116,139,0.2)' } : {}}>
                        {active && <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-10`} />}
                        <div className={`relative flex items-center justify-center w-9 h-9 shrink-0 rounded-lg transition-all duration-250 z-10
                            ${active ? `bg-gradient-to-br ${item.color}` : 'bg-slate-700/40 group-hover:bg-slate-700/60'}
                            ${isHovered && !active ? 'scale-110 rotate-3' : ''}`}
                          style={active ? { boxShadow: buildGlow(item.color) } : {}}>
                          <Icon className={`w-4 h-4 transition-all duration-250 ${active ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]' : 'text-slate-400 group-hover:text-white'}`} />
                        </div>
                        <span className={`text-sm font-medium relative z-10 transition-all duration-250 flex-1 ${active ? 'font-semibold' : ''} ${isHovered && !active ? 'translate-x-0.5' : ''}`}
                          style={active ? { textShadow: buildTextGlow(item.color) } : {}}>
                          {t[item.key] || item.key}
                        </span>
                        {active && <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-pulse shrink-0`} />}
                        {isHovered && !active && <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color} animate-ping shrink-0`} />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center space-x-3">

          {/* Community */}
          <Link to="/community" title="Community"
            className={`relative p-2 rounded-lg transition-all duration-200 group
              ${isCommunityActive ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100 text-gray-600'}`}>
            <Users className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110 ${isCommunityActive ? 'text-green-600' : 'text-gray-600'}`} />
            {isCommunityActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-600" />}
          </Link>

          {/* ── Agri News Button + Panel ── */}
          <div className="relative" ref={newsRef}>
            <button
              onClick={() => { setShowNews(!showNews); setShowNotif(false); setShowProfile(false); }}
              title="Agriculture News"
              className={`relative p-2 rounded-lg transition-all duration-200 group
                ${showNews ? 'bg-green-50' : 'hover:bg-gray-100'}`}>
              {/* Pulsing green dot — "live" indicator */}
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <Newspaper className={`w-6 h-6 transition-transform duration-200 group-hover:scale-110
                ${showNews ? 'text-green-600' : 'text-gray-600'}`} />
            </button>

            {showNews && <AgriNewsPanel onClose={() => setShowNews(false)} />}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); setShowProfile(false); setShowNews(false); }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
            </button>
            {showNotif && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotif(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-800">{t.notifications}</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className={`p-4 hover:bg-gray-50 border-b border-gray-50 cursor-pointer ${n.unread ? 'bg-blue-50' : ''}`}>
                        <p className="font-medium text-sm text-gray-800">{n.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 text-center border-t">
                    <Link to="/notifications" className="text-sm text-green-600 font-medium hover:text-green-700">{t.viewAll}</Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Language */}
          <button onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border hover:bg-gray-100 transition text-sm font-medium">
            <Languages className="w-4 h-4 text-gray-600" />
            {langLabel[language]}
          </button>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); setShowNews(false); }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-700 font-bold text-white flex items-center justify-center text-sm border border-emerald-500 shadow-sm">
                {displayName ? displayName[0].toUpperCase() : 'S'}
              </div>
              <span className="hidden md:block text-sm font-semibold text-gray-800">{displayName}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {showProfile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-800">{displayName}</p>
                    <p className="text-sm text-gray-500">{displayEmail}</p>
                  </div>
                  <div className="py-2">
                    <Link to="/profile" onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                      <User className="w-4 h-4" /> {t.profile}
                    </Link>
                    <Link to="/settings" onClick={() => setShowProfile(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm">
                      <Settings className="w-4 h-4" /> {t.settings}
                    </Link>
                  </div>
                  <div className="border-t py-2">
                    <button onClick={() => { setShowProfile(false); logout(); }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-red-500 w-full text-sm">
                      <LogOut className="w-4 h-4" /> {t.logout}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          25%     { transform: translate(20px,-40px) scale(1.1); }
          50%     { transform: translate(-20px,20px) scale(0.9); }
          75%     { transform: translate(40px,40px) scale(1.05); }
        }
        .animate-slideIn      { animation: slideIn 0.4s ease-out forwards; opacity: 0; }
        .animate-blob         { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </>
  );
};

export default Navbar;