import React, { useState } from 'react';
import { Bell, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NOTIFICATION_ITEMS = [
  {
    id: 1,
    type: 'irrigation',
    title: '🚿 Irrigation Reminder',
    titleBn: '🚿 সেচ প্রদান স্মরণিকা',
    titleHi: '🚿 सिंचाई रिमाइंडर',
    message: 'It is recommended to irrigate your Wheat field today (2,000 Liters).',
    messageBn: 'আজ আপনার গম খেতে সেচ প্রদান করার নির্দেশ দেওয়া হচ্ছে (২,০০০ লিটার)।',
    messageHi: 'आज आपके गेहूं के खेत में सिंचाई करने की सलाह दी जाती है (2,000 लीटर)।',
    time: '10 mins ago',
    unread: true,
    category: 'Reminders'
  },
  {
    id: 2,
    type: 'disease',
    title: '🚨 Early Blight Warning in Region',
    titleBn: '🚨 অঞ্চলে প্রারম্ভিক ধসা রোগের সতর্কতা',
    titleHi: '🚨 क्षेत्र में अगेती अंगमारी चेतावनी',
    message: 'High humidity detected in North 24 Parganas. Spray Trichoderma viride preventive shield.',
    messageBn: 'উত্তর ২৪ পরগনায় উচ্চ আর্দ্রতা সনাক্ত করা হয়েছে। ট্রাইকোডার্মা ভিরিডি ছিটান।',
    messageHi: 'उत्तर 24 परगना में उच्च आर्द्रता का पता चला है। ट्राइकोडर्मा विरिडी स्प्रे करें।',
    time: '1 hour ago',
    unread: true,
    category: 'Alerts'
  },
  {
    id: 3,
    type: 'weather',
    title: '🌧️ Heavy Rain Expected Tomorrow',
    titleBn: '🌧️ আগামীকাল ভারী বৃষ্টির সম্ভাবনা',
    titleHi: '🌧️ कल भारी बारिश की संभावना',
    message: 'IMD forecasts 25mm rain in Barasat. Postpone chemical spraying & clear drainage channels.',
    messageBn: 'বারাসাতে ২৫ মিমি বৃষ্টির পূর্বাভাস। রাসায়নিক স্প্রে স্থগিত রাখুন এবং ড্রেন পরিষ্কার করুন।',
    messageHi: 'बारासात में 25 मिमी बारिश का अनुमान। रासायनिक छिड़काव स्थगित रखें।',
    time: '3 hours ago',
    unread: false,
    category: 'Alerts'
  },
  {
    id: 4,
    type: 'soil',
    title: '🌱 Soil Health Analysis Complete',
    titleBn: '🌱 মাটি স্বাস্থ্য বিশ্লেষণ সম্পন্ন হয়েছে',
    titleHi: '🌱 मिट्टी स्वास्थ्य विश्लेषण पूरा हुआ',
    message: 'Your soil test health score is 78/100 (GOOD). Check NPK recommendations.',
    messageBn: 'আপনার মাটি পরীক্ষার হেলথ স্কোর ৭৮/১০০ (ভালো)। এনপিকে সুপারিশ দেখুন।',
    messageHi: 'आपकी मिट्टी परीक्षण स्कोर 78/100 (अच्छा) है। एनपीके सिफारिशें देखें।',
    time: '1 day ago',
    unread: false,
    category: 'Updates'
  },
  {
    id: 5,
    type: 'scheme',
    title: '🌾 PM-Kisan Installment Released',
    titleBn: '🌾 পিএম-কিষাণ কিস্তি প্রকাশিত হয়েছে',
    titleHi: '🌾 पीएम-किसान किस्त जारी',
    message: 'Goverment of India released 17th installment of PM-Kisan. Check your bank account.',
    messageBn: 'ভারত সরকার পিএম-কিষাণের ১৭তম কিস্তি প্রকাশ করেছে। আপনার ব্যাংক অ্যাকাউন্ট চেক করুন।',
    messageHi: 'भारत सरकार ने पीएम-किसान की 17वीं किस्त जारी की। अपना बैंक खाता जांचें।',
    time: '2 days ago',
    unread: false,
    category: 'Updates'
  }
];

const Notifications = () => {
  const { language } = useLanguage();
  const [notifications, setNotifications] = useState(NOTIFICATION_ITEMS);
  const [activeFilter, setActiveFilter] = useState('All');

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDeleteItem = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const filtered = activeFilter === 'All' 
    ? notifications 
    : notifications.filter(n => n.category === activeFilter);

  const getTitle = (n) => language === 'bn' ? n.titleBn : language === 'hi' ? n.titleHi : n.title;
  const getMsg = (n) => language === 'bn' ? n.messageBn : language === 'hi' ? n.messageHi : n.message;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-600" />
              {language === 'bn' ? 'সকল বিজ্ঞপ্তি' : language === 'hi' ? 'सभी सूचनाएं' : 'All Notifications'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {language === 'bn' ? 'আপনার খামার ও আবহাওয়ার রিয়েল-টাইম আপডেট' : language === 'hi' ? 'आपके खेत और मौसम के रीयल-टाइम अपडेट' : 'Real-time alerts & farm advisories'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition"
          >
            ✓ {language === 'bn' ? 'সব পঠিত হিসেবে চিহ্নিত করুন' : language === 'hi' ? 'सभी पढ़ा हुआ मार्क करें' : 'Mark all as read'}
          </button>
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {language === 'bn' ? 'মুছে ফেলুন' : language === 'hi' ? 'हटाएं' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b pb-2">
        {['All', 'Alerts', 'Reminders', 'Updates'].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
              activeFilter === cat ? 'bg-green-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === 'All' ? (language === 'bn' ? 'সব' : language === 'hi' ? 'सभी' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-700">
            {language === 'bn' ? 'কোনো বিজ্ঞপ্তি নেই' : language === 'hi' ? 'कोई सूचना नहीं है' : 'No notifications'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {language === 'bn' ? 'নতুন কোনো আপডেট এলে এখানে দেখতে পাবেন।' : language === 'hi' ? 'कोई नया अपडेट आने पर यहां दिखेगा।' : 'You are all caught up! Check back later.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition flex items-start justify-between ${
                item.unread ? 'bg-blue-50/60 border-blue-200' : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="space-y-1 flex-1 pr-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-sm">{getTitle(item)}</h3>
                  {item.unread && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">NEW</span>
                  )}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">{getMsg(item)}</p>
                <span className="text-[10px] text-gray-400 font-medium block pt-1">{item.time}</span>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-gray-400 hover:text-red-600 p-1.5 transition"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
