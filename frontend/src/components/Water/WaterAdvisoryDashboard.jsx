import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Droplet, AlertTriangle, ThumbsUp, History, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import waterTranslations from '../../i18n/water';
import ActionToolbar from '../common/ActionToolbar';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const translateWaterText = (str, lang) => {
  if (!str || typeof str !== 'string' || lang === 'en') return str;

  let text = str.trim();

  const dict = {
    bn: {
      'rice': 'ধান (Rice)',
      'wheat': 'গম (Wheat)',
      'maize': 'ভুট্টা (Maize)',
      'cotton': 'তুলা (Cotton)',
      'sowing': 'বুনে দেওয়া পর্যায়',
      'vegetative': 'বানস্পতিক বৃদ্ধি পর্যায়',
      'flowering': 'ফুল ফোটার পর্যায়',
      'fruiting': 'ফল ধরার পর্যায়',
      'loam': 'দোআঁশ মাটি',
      'sandy': 'বেলে মাটি',
      'clay': 'এটেল মাটি',
      'dry': 'শুকনো মাটি',
      'slightly_moist': 'মৃদু আর্দ্র মাটি',
      'saturated': 'পানি জমে থাকা মাটি',
      'none': 'বৃষ্টি নেই',
      'light': 'হালকা বৃষ্টি',
      'heavy': 'ভারী বৃষ্টি',
      'Tomorrow Morning': 'আগামীকাল সকালে',
      'High': 'উচ্চ',
      'Medium': 'মাঝারি',
      'Low': 'কম',
      'CRITICAL': 'অত্যন্ত জরুরি',
      'IRRIGATE_NOW': 'জরুরি সেচ প্রদান করুন',
      'SKIP_IRRIGATION': 'আজ সেচের প্রয়োজন নেই',
      'MODERATE_IRRIGATION': 'পরিমিত সেচ প্রদান করুন'
    },
    hi: {
      'rice': 'धान (Rice)',
      'wheat': 'गेहूँ (Wheat)',
      'maize': 'मक्का (Maize)',
      'cotton': 'कपास (Cotton)',
      'sowing': 'बुआई की अवस्था',
      'vegetative': 'वानस्पतिक अवस्था',
      'flowering': 'फूल आने की अवस्था',
      'fruiting': 'फल लगने की अवस्था',
      'loam': 'दोमट मिट्टी',
      'sandy': 'बलुई मिट्टी',
      'clay': 'चिकनी मिट्टी',
      'dry': 'सूखी मिट्टी',
      'slightly_moist': 'हल्की नम मिट्टी',
      'saturated': 'जलभराव वाली मिट्टी',
      'none': 'कोई बारिश नहीं',
      'light': 'हल्की बारिश',
      'heavy': 'भारी बारिश',
      'Tomorrow Morning': 'कल सुबह',
      'High': 'उच्च',
      'Medium': 'मध्यम',
      'Low': 'निम्न',
      'CRITICAL': 'अत्यंत आवश्यक',
      'IRRIGATE_NOW': 'तत्काल सिंचाई करें',
      'SKIP_IRRIGATION': 'आज सिंचाई की आवश्यकता नहीं है',
      'MODERATE_IRRIGATION': 'मध्यम सिंचाई करें'
    }
  };

  if (dict[lang] && dict[lang][text]) return dict[lang][text];

  if (text.includes('Irrigate Immediately') || text.includes('IRRIGATE_NOW')) {
    return lang === 'bn' ? 'জরুরি সেচ প্রদান করুন' : 'तत्काल सिंचाई करें';
  }
  if (text.includes('No Irrigation Needed') || text.includes('SKIP_IRRIGATION')) {
    return lang === 'bn' ? 'আজ সেচের প্রয়োজন নেই' : 'आज सिंचाई की आवश्यकता नहीं है';
  }
  if (text.includes('Moderate Irrigation')) {
    return lang === 'bn' ? 'পরিমিত সেচ দিন' : 'मध्यम सिंचाई करें';
  }

  return text;
};

const WaterAdvisoryDashboard = () => {
  const { language } = useLanguage();
  const t = waterTranslations.advisory[language] ?? waterTranslations.advisory.en;

  const [loading, setLoading] = useState(false);
  const [advisory, setAdvisory] = useState(null);
  const [error, setError] = useState(null);
  const [waterHistory, setWaterHistory] = useState([]);

  const [inputs, setInputs] = useState({
    cropType: 'rice',
    cropStage: 'flowering',
    soilTexture: 'loam',
    waterDrainage: 'normal',
    soilMoisture: 'slightly_moist',
    temperature: 28,
    rainfall: 'none'
  });

  const loadWaterHistory = async () => {
    try {
      const response = await fetch('http://localhost:5180/api/v1/water-sources/usage/history', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      let items = data.data || [];
      if (!Array.isArray(items) || items.length === 0) {
        const localRaw = localStorage.getItem('agrisathi_water_history');
        if (localRaw) items = JSON.parse(localRaw);
      }
      if (Array.isArray(items)) {
        setWaterHistory(items);
        localStorage.setItem('agrisathi_water_history', JSON.stringify(items));
      }
    } catch (_) {
      const localRaw = localStorage.getItem('agrisathi_water_history');
      if (localRaw) setWaterHistory(JSON.parse(localRaw));
    }
  };

  useEffect(() => {
    loadWaterHistory();
  }, []);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5180/api/v1/water/advisory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      if (data.success) {
        setAdvisory(data.data);
        const newRecord = {
          _id: `WAD-${Date.now()}`,
          inputs,
          advisory: data.data,
          createdAt: new Date().toISOString()
        };
        const existing = JSON.parse(localStorage.getItem('agrisathi_water_history') || '[]');
        const updated = [newRecord, ...existing];
        setWaterHistory(updated);
        localStorage.setItem('agrisathi_water_history', JSON.stringify(updated));
      } else {
        setError(data.message || t.errorConnect);
      }
    } catch (err) {
      setError(t.errorConnect);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = (e, id) => {
    e.stopPropagation();
    if (window.confirm(language === 'bn' ? 'আপনি কি এই রেকর্ডটি মুছে ফেলতে চান?' : language === 'hi' ? 'क्या आप इस रिकॉर्ड को हटाना चाहते हैं?' : 'Are you sure you want to delete this water record?')) {
      const updated = waterHistory.filter(item => String(item._id) !== String(id));
      setWaterHistory(updated);
      localStorage.setItem('agrisathi_water_history', JSON.stringify(updated));
    }
  };

  const getDecisionIcon = (decision) => {
    if (decision === 'IRRIGATE_NOW' || decision?.includes('Irrigate')) {
      return <Droplet className="w-8 h-8 text-blue-600 animate-bounce" />;
    }
    if (decision === 'SKIP_IRRIGATION') {
      return <ThumbsUp className="w-8 h-8 text-green-600" />;
    }
    return <AlertTriangle className="w-8 h-8 text-amber-600" />;
  };

  const getDecisionColor = (decision) => {
    if (decision === 'IRRIGATE_NOW' || decision?.includes('Irrigate')) {
      return 'bg-blue-50 border-blue-400 text-blue-900';
    }
    if (decision === 'SKIP_IRRIGATION') {
      return 'bg-green-50 border-green-400 text-green-900';
    }
    return 'bg-amber-50 border-amber-400 text-amber-900';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Input Form */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-3 mb-6 border-b pb-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{t.title}</h2>
            <p className="text-sm text-gray-500">{t.subtitle}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.labelCropType || "Crop Type"}</label>
            <select name="cropType" value={inputs.cropType} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm">
              <option value="rice">{t.cropRice || "🌾 Rice"}</option>
              <option value="wheat">{t.cropWheat || "🌾 Wheat"}</option>
              <option value="maize">{t.cropMaize || "🌽 Maize"}</option>
              <option value="cotton">{t.cropCotton || "🌸 Cotton"}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.labelCropStage || "Crop Stage"}</label>
            <select name="cropStage" value={inputs.cropStage} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm">
              <option value="sowing">{t.stageSowing || "🌱 Sowing"}</option>
              <option value="vegetative">{t.stageVegetative || "🌿 Vegetative"}</option>
              <option value="flowering">{t.stageFlowering || "🌺 Flowering"}</option>
              <option value="fruiting">{t.stageFruiting || "🍇 Fruiting"}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.labelSoilType || "Soil Type"}</label>
            <select name="soilTexture" value={inputs.soilTexture} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm">
              <option value="loam">{t.soilLoam || "🌍 Loam"}</option>
              <option value="sandy">{t.soilSandy || "🏖️ Sandy"}</option>
              <option value="clay">{t.soilClay || "🪨 Clay"}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.labelMoisture || "Soil Moisture"}</label>
            <select name="soilMoisture" value={inputs.soilMoisture} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm">
              <option value="dry">{t.moistDry || "🔥 Dry"}</option>
              <option value="slightly_moist">{t.moistSlightly || "💧 Slightly Moist"}</option>
              <option value="saturated">{t.moistWaterlogged || "🌊 Waterlogged"}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.labelTemperature || "Temperature (°C)"}</label>
            <input type="number" name="temperature" value={inputs.temperature} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">{t.labelRainfall || "Rainfall Today"}</label>
            <select name="rainfall" value={inputs.rainfall} onChange={handleChange} className="w-full p-2.5 bg-gray-50 border rounded-lg text-sm">
              <option value="none">{t.rainNone || "☀️ None"}</option>
              <option value="light">{t.rainLight || "🌦️ Light"}</option>
              <option value="heavy">{t.rainHeavy || "⛈️ Heavy"}</option>
            </select>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="mt-6 w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base shadow-lg transition flex items-center justify-center gap-2 transform active:scale-98">
          {loading ? (t.btnAnalyzing || t.loadingBtn || "⏳ Analyzing & Saving...") : (t.btnGetAdvice || t.submitBtn || "💧 Calculate Water Advisory & Save")}
        </button>
      </div>

      {/* Advisory Result */}
      {advisory && (
        <div className={`p-6 rounded-2xl border-2 shadow-lg ${getDecisionColor(advisory.decision)}`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white rounded-xl shadow">{getDecisionIcon(advisory.decision)}</div>
            <div>
              <h2 className="text-2xl font-bold">{translateWaterText(advisory.title || advisory.decision, language)}</h2>
              <p className="text-sm opacity-90">{translateWaterText(advisory.recommendation, language)}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/80 p-4 rounded-xl text-sm">
            <div>
              <span className="font-semibold block">{t.waterQuantityLabel || "Water Quantity:"}</span>
              {advisory.waterNeededLiters || 2500} {language === 'bn' ? 'লিটার' : language === 'hi' ? 'लीटर' : 'Liters'}
            </div>
            <div>
              <span className="font-semibold block">{language === 'bn' ? 'পরবর্তী সেচ:' : language === 'hi' ? 'अगली सिंचाई:' : 'Next Irrigation:'}</span>
              {translateWaterText(advisory.nextWatering || 'Tomorrow Morning', language)}
            </div>
            <div>
              <span className="font-semibold block">{language === 'bn' ? 'জরুরি মাত্রা:' : language === 'hi' ? 'प्राथमिकता:' : 'Priority Urgency:'}</span>
              {translateWaterText(advisory.urgency || 'High', language)}
            </div>
          </div>

          <ActionToolbar
            title="Water Requirement Advisory Report"
            summary={`Decision: ${advisory.decision}. Water Needed: ${advisory.waterNeededLiters || 2500} Liters.`}
          />
        </div>
      )}

      {/* Saved Water Advisory History Section */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            {language === 'bn' ? 'সংরক্ষিত সেচ পরামর্শের ইতিহাস' : language === 'hi' ? 'सहेजे गए जल परामर्श का इतिहास' : 'Saved Water Advisory History'}
          </h2>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            {waterHistory.length} {language === 'bn' ? 'টি রেকর্ড' : language === 'hi' ? 'रिकॉर्ड' : 'Record(s)'}
          </span>
        </div>

        {waterHistory.length === 0 ? (
          <p className="text-center py-6 text-gray-500 text-sm">
            {language === 'bn' ? 'কোনো সংরক্ষিত ইতিহাস পাওয়া যায়নি।' : language === 'hi' ? 'कोई सहेजा गया इतिहास नहीं मिला।' : 'No saved water advisories found. Submit a test above to record history.'}
          </p>
        ) : (
          <div className="space-y-3">
            {waterHistory.map((item) => {
              const inp = item.inputs || {};
              const adv = item.advisory || {};
              const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString(language === 'bn' ? 'bn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Water Test';

              return (
                <div key={item._id} className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center hover:border-blue-300 transition">
                  <div>
                    <span className="text-xs text-gray-400 font-medium block">{dateStr}</span>
                    <h4 className="font-bold text-gray-800 capitalize text-sm">
                      {translateWaterText(inp.cropType, language)} ({translateWaterText(inp.cropStage, language)}) • {translateWaterText(inp.soilTexture, language)}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {language === 'bn' ? 'সিদ্ধান্ত: ' : language === 'hi' ? 'निर्णय: ' : 'Decision: '}
                      <span className="font-bold text-blue-700">{translateWaterText(adv.title || adv.decision || 'Advisory Generated', language)}</span>
                    </p>
                  </div>
                  <button onClick={(e) => handleDeleteHistory(e, item._id)} className="text-gray-400 hover:text-red-600 p-2">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterAdvisoryDashboard;