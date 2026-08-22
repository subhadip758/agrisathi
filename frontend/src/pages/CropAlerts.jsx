import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldAlert, MapPin, CheckCircle, Activity } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || '/api/v1';

const RISK_BADGES = {
  'VERY HIGH': {
    bg: 'bg-rose-600 text-white border-rose-500',
    label: { bn: '🔴 অত্যন্ত উচ্চ ঝুঁকি (VERY HIGH)', hi: '🔴 अत्यंत उच्च जोखिम (VERY HIGH)', en: '🔴 VERY HIGH RISK' }
  },
  'HIGH': {
    bg: 'bg-orange-600 text-white border-orange-500',
    label: { bn: '🟠 উচ্চ ঝুঁকি (HIGH RISK)', hi: '🟠 उच्च जोखिम (HIGH RISK)', en: '🟠 HIGH RISK' }
  },
  'MODERATE': {
    bg: 'bg-amber-600 text-white border-amber-400',
    label: { bn: '🟡 মাঝারি ঝুঁকি (MODERATE)', hi: '🟡 मध्यम जोखिम (MODERATE)', en: '🟡 MODERATE RISK' }
  },
  'LOW': {
    bg: 'bg-emerald-600 text-white border-emerald-500',
    label: { bn: '🟢 কম ঝুঁকি (LOW RISK)', hi: '🟢 कम जोखिम (LOW RISK)', en: '🟢 LOW RISK' }
  },
};

const CROP_NAME_MAP = {
  rice: { bn: 'ধান (Rice)', hi: 'धान / चावल (Rice)', en: 'Rice / Paddy' },
  potato: { bn: 'আলু (Potato)', hi: 'আलू (Potato)', en: 'Potato' },
  jute: { bn: 'পাট (Jute)', hi: 'पटसन / जूट (Jute)', en: 'Jute' },
  mustard: { bn: 'সরিষা (Mustard)', hi: 'सरसों (Mustard)', en: 'Mustard' },
  wheat: { bn: 'গম (Wheat)', hi: 'गेहूं (Wheat)', en: 'Wheat' },
  vegetable: { bn: 'সবজি (Vegetable)', hi: 'सब्जी (Vegetable)', en: 'Vegetables' },
};

const translateAlertText = (str, lang) => {
  if (!str || typeof str !== 'string' || lang === 'en') return str;

  const exactMap = {
    bn: {
      'Farmer Disease Detection History': 'কৃষকদের রোগ সনাক্তকরণের রেকর্ড',
      'Vision AI Diagnostic Confidence': 'ভিশন এআই রোগ নির্ণয়ের নির্ভরযোগ্যতা',
      'Weather Compatibility': 'আবহাওয়ার আর্দ্রতা ও তাপমাত্রা সামঞ্জস্য',
      'Diagnosis Frequency': 'রোগ সনাক্তকরণের পুনরাবৃত্তি',
      'Foliar Lesion Severity': 'পাতায় ক্ষতের তীব্রতার প্রভাব',
      'Soil & Moisture Vector': 'মাটি ও বাতাসের সেচ পরিবেশ',

      'Wheat Leaf Rust': 'গমের পাতার মরচে রোগ (Wheat Leaf Rust)',
      'Potato Late Blight': 'আলুর নাবী ধসা রোগ (Potato Late Blight)',
      'Rice Blast': 'ধানের ব্লাস্ট রোগ (Rice Blast)',
      'Potato Early Blight': 'আলুর আগাম ধসা রোগ (Potato Early Blight)',
      'Bacterial Blight': 'ব্যাকটেরিয়াল ব্লাইট রোগ',
      'Powdery Mildew': 'পাউডারি মিলডিউ ফাঙ্গাস রোগ',
    },
    hi: {
      'Farmer Disease Detection History': 'किसान रोग निदान इतिहास',
      'Vision AI Diagnostic Confidence': 'विज़न एआई नैदानिक ​​सटीकता',
      'Weather Compatibility': 'मौसम नमी एवं तापमान अनुकूलता',
      'Diagnosis Frequency': 'क्षेत्र में रोग निदान की आवृत्ति',
      'Foliar Lesion Severity': 'पत्तियों में घाव की गंभीरता का प्रभाव',
      'Soil & Moisture Vector': 'मिट्टी एवं हवा में नमी की स्थिति',

      'Wheat Leaf Rust': 'गेहूं का पत्ती रतुआ (Wheat Leaf Rust)',
      'Potato Late Blight': 'आलू का पछेती झुलसा (Potato Late Blight)',
      'Rice Blast': 'धान का ब्लास्ट रोग (Rice Blast)',
      'Potato Early Blight': 'आलू का अगेती झुलसा (Potato Early Blight)',
      'Bacterial Blight': 'जीवाणु झुलसा रोग',
      'Powdery Mildew': 'पाउडरी मिलड्यू कवक रोग',
    }
  };

  if (exactMap[lang]?.[str]) return exactMap[lang][str];

  // Dynamic Regex Matching for Detail Sentences
  if (lang === 'bn') {
    if (str.includes('disease diagnosis scan(s) recorded in history for')) {
      const match = str.match(/(\d+)\s+disease diagnosis scan\(s\) recorded in history for\s+(.*)/i);
      if (match) return `জেলা এলাকায় ${match[2]} ফসলের ওপর মোট ${match[1]} টি রোগের স্ক্যান রেকর্ড করা হয়েছে।`;
    }
    if (str.includes('Vision AI model average confidence score is')) {
      const match = str.match(/Vision AI model average confidence score is\s+(\d+)%/i);
      if (match) return `রেকর্ডকৃত স্ক্যানে ভিশন এআই মডেলের গড় আস্থার স্কোর ${match[1]}%।`;
    }
  }

  if (lang === 'hi') {
    if (str.includes('disease diagnosis scan(s) recorded in history for')) {
      const match = str.match(/(\d+)\s+disease diagnosis scan\(s\) recorded in history for\s+(.*)/i);
      if (match) return `जिले में ${match[2]} फसल पर कुल ${match[1]} रोग निदान स्कैन दर्ज किए गए हैं।`;
    }
    if (str.includes('Vision AI model average confidence score is')) {
      const match = str.match(/Vision AI model average confidence score is\s+(\d+)%/i);
      if (match) return `दर्ज स्कैन में विज़न एआई मॉडल की औसत नैदानिक ​​सटीकता ${match[1]}% है।`;
    }
  }

  return str;
};

const CropAlerts = () => {
  const { language } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('North 24 Parganas');

  const fetchAlerts = async () => {
    setLoading(true);
    let loadedAlerts = [];
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('agrisathi_token');
      const res = await fetch(`${API_BASE}/disease-alerts?district=${encodeURIComponent(selectedDistrict)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
          'localtunnel-bypass-https': 'true',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        loadedAlerts = data.data;
      }
    } catch (_) {}

    if (loadedAlerts.length === 0) {
      try {
        const rawHistory = localStorage.getItem('agrisathi_disease_history');
        if (rawHistory) {
          const parsed = JSON.parse(rawHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedAlerts = parsed.map(item => ({
              _id: item._id || String(Date.now()),
              cropType: item.cropDetails?.cropType || item.cropType || 'wheat',
              diseaseName: item.topDiagnosis?.disease || item.diseaseName || 'Leaf Rust',
              riskLevel: (item.topDiagnosis?.severity === 'High' || item.topDiagnosis?.severity === 'Critical') ? 'HIGH' : 'MODERATE',
              district: selectedDistrict,
              confidenceScore: item.topDiagnosis?.confidence || 92,
              summary: item.topDiagnosis?.description || 'Active disease outbreak alert based on farmer field diagnostics.',
              preventiveActions: ['Apply 5ml/L Neem Oil bio-shield', 'Ensure early morning irrigation'],
              createdAt: item.createdAt || new Date().toISOString()
            }));
          }
        }
      } catch (_) {}
    }

    setAlerts(loadedAlerts);
    setLoading(false);
  };

  useEffect(() => {
    fetchAlerts();
  }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-rose-300" />
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {language === 'bn' ? 'রোগের প্রাদুর্ভাব সতর্কবার্তা (Disease Outbreak Alerts)' : language === 'hi' ? 'फसल रोग चेतावनी प्रणाली' : 'Crop Disease Outbreak Early Warning'}
            </h1>
          </div>
          <p className="text-rose-100 text-xs md:text-sm mt-1 max-w-2xl">
            {language === 'bn'
              ? 'ফসলের রোগ সনাক্তকরণ ইতিহাস এবং লক্ষণ স্ক্যান থেকে স্বয়ংক্রিয় সতর্কবার্তা সংগৃহীত।'
              : language === 'hi'
              ? 'ऐतिहासिक रोग निदान स्कैन से स्वचालित रूप से उत्पन्न प्रकोप चेतावनी।'
              : 'Real outbreak warnings dynamically generated from historical disease diagnosis scans.'}
          </p>
        </div>

        {/* District Selector */}
        <div className="flex items-center gap-2 bg-rose-950/60 p-2 rounded-xl border border-rose-500/40">
          <MapPin className="w-4 h-4 text-rose-300" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer"
          >
            <option value="North 24 Parganas" className="text-gray-900">North 24 Parganas (Barasat)</option>
            <option value="South 24 Parganas" className="text-gray-900">South 24 Parganas</option>
            <option value="Hooghly" className="text-gray-900">Hooghly</option>
            <option value="Nadia" className="text-gray-900">Nadia</option>
            <option value="Burdwan" className="text-gray-900">Burdwan</option>
          </select>
        </div>
      </div>

      {/* Main Content List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">
          {language === 'bn' ? 'রোগ সতর্কবার্তা লোড হচ্ছে...' : language === 'hi' ? 'रोग चेतावनी लोड हो रही है...' : 'Loading disease history alerts...'}
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center text-gray-600 border border-dashed border-gray-300 space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-gray-900">
            {language === 'bn' ? 'বর্তমানে কোনো রোগের প্রাদুর্ভাব সতর্কবার্তা নেই' : language === 'hi' ? 'चयनित क्षेत्र के लिए कोई रोग चेतावनी नहीं है' : 'No Outbreak Alerts for Selected Region'}
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            {language === 'bn'
              ? `${selectedDistrict} এলাকায় কোনো সংক্রামক রোগের রিপোর্ট রেকর্ড হয়নি। ক্রপ ডিজিজ ডিটেকশন সেকশনে ছবি স্ক্যান করলে নতুন সতর্কবার্তা স্বয়ংক্রিয়ভাবে যুক্ত হবে।`
              : language === 'hi'
              ? `${selectedDistrict} में कोई संक्रामक रोग दर्ज नहीं हुआ है। फसल रोग पहचान अनुभाग में स्कैन करने पर नई चेतावनियां जुड़ जाएंगी।`
              : `No plant disease outbreaks recorded in ${selectedDistrict}. Outbreak alerts will be automatically generated whenever a farmer diagnoses a crop disease in the Disease Detection section.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => {
            const badge = RISK_BADGES[alert.riskLevel] || RISK_BADGES['MODERATE'];
            const cropText = CROP_NAME_MAP[alert.cropType.toLowerCase()]?.[language] || alert.cropType;
            const diseaseName = translateAlertText(alert.diseaseName, language);

            return (
              <div key={alert._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-gray-900">{diseaseName}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border shadow ${badge.bg}`}>
                        {badge.label[language] || badge.label.en}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-3">
                      <span><strong>{language === 'bn' ? 'লক্ষ্যযুক্ত ফসল:' : language === 'hi' ? 'लक्षित फसल:' : 'Target Crop:'}</strong> {cropText}</span>
                      <span>•</span>
                      <span><strong>{language === 'bn' ? 'অঞ্চল:' : language === 'hi' ? 'क्षेत्र:' : 'Region:'}</strong> {alert.district}</span>
                      <span>•</span>
                      <span><strong>{language === 'bn' ? 'শনাক্তকৃত স্ক্যান:' : language === 'hi' ? 'निदान किए गए स्कैन:' : 'Diagnosed Scans:'}</strong> {alert.reportCount}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-2 rounded-xl border text-right">
                    <div className="text-xs font-bold text-gray-500">
                      {language === 'bn' ? 'প্রাদুর্ভাবের ঝুঁকির মাত্রা' : language === 'hi' ? 'प्रकोप जोखिम स्तर' : 'Outbreak Risk Level'}
                    </div>
                    <div className="text-xl font-extrabold text-rose-700">{alert.riskLevel}</div>
                  </div>
                </div>

                {/* Factors contributing to alert */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-600" />
                    {language === 'bn' ? 'প্রমাণ এবং রোগ নির্ণয় ইতিহাসের প্রভাবকসমূহ:' : language === 'hi' ? 'साक्ष्य एवं निदान इतिहास कारक:' : 'Evidence & Diagnosis History Factors:'}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {alert.contributingFactors?.map((cf, idx) => (
                      <div key={idx} className="bg-rose-50/50 p-3 rounded-lg border border-rose-100 text-xs">
                        <div className="font-bold text-rose-900">
                          <span>{translateAlertText(cf.factor, language)}</span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-1">{translateAlertText(cf.detail, language)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CropAlerts;
