import React from 'react';
import { Droplet, Clock, Calendar, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import irrigationTranslations from '../../i18n/irrigation';
import ActionToolbar from '../common/ActionToolbar';

const translateIrrigationText = (str, lang) => {
  if (!str || typeof str !== 'string' || lang === 'en') return str;

  let text = str.trim();

  const dict = {
    bn: {
      'Critical': 'অত্যন্ত জরুরি',
      'High': 'উচ্চ',
      'Medium': 'মাঝারি',
      'Low': 'কম',
      'Rice': 'ধান (Rice)',
      'Wheat': 'গম (Wheat)',
      'Maize': 'ভুট্টা (Maize)',
      'Tomato': 'টমেটো (Tomato)',
      'Potato': 'আলু (Potato)',
      'Onion': 'পেঁয়াজ (Onion)',
      'Cabbage': 'বাঁধাকপি (Cabbage)',
      'General Crop': 'সাধারণ ফসল',
      'Loamy': 'দোআঁশ মাটি',
      'Loam': 'দোআঁশ মাটি',
      'Clay': 'এটেল মাটি',
      'Sandy': 'বেলে মাটি',
      'Monsoon': 'বর্ষাকাল',
      'Summer': 'গ্রীষ্মকাল',
      'Winter': 'শীতকাল',
      'Spring': 'বসন্তকাল',
      'Rabi': 'রবি মৌসুম'
    },
    hi: {
      'Critical': 'अत्यंत आवश्यक',
      'High': 'उच्च',
      'Medium': 'मध्यम',
      'Low': 'निम्न',
      'Rice': 'धान (Rice)',
      'Wheat': 'गेहूँ (Wheat)',
      'Maize': 'मक्का (Maize)',
      'Tomato': 'टमाटर (Tomato)',
      'Potato': 'आलू (Potato)',
      'Onion': 'प्याज (Onion)',
      'Cabbage': 'पत्तागोभी (Cabbage)',
      'General Crop': 'सामान्य फसल',
      'Loamy': 'दोमट मिट्टी',
      'Loam': 'दोमट मिट्टी',
      'Clay': 'चिकनी मिट्टी',
      'Sandy': 'बलुई मिट्टी',
      'Monsoon': 'मानसून/वर्षाऋतु',
      'Summer': 'ग्रीष्मकाल',
      'Winter': 'शीतकाल',
      'Spring': 'वसंतकाल',
      'Rabi': 'रबी फसल'
    }
  };

  if (dict[lang] && dict[lang][text]) return dict[lang][text];

  if (text.includes('Stage Adjustment Factor')) {
    const val = text.split(':')[1] || '';
    return lang === 'bn' ? `ফসলের বৃদ্ধি পর্যায় সমন্বয় ফ্যাক্টর:${val}` : `फसल विकास चरण समायोजन कारक:${val}`;
  }
  if (text.includes('Soil Adjustment Factor')) {
    const val = text.split(':')[1] || '';
    return lang === 'bn' ? `মাটির ধরন সমন্বয় ফ্যাক্টর:${val}` : `मिट्टी प्रकार समायोजन कारक:${val}`;
  }
  if (text.includes('Season Adjustment Factor')) {
    const val = text.split(':')[1] || '';
    return lang === 'bn' ? `মৌসুমি আবহাওয়া সমন্বয় ফ্যাক্টর:${val}` : `मौसमी मौसम समायोजन कारक:${val}`;
  }

  if (text.includes('Every 2 days')) return lang === 'bn' ? 'প্রতি ২ দিন পর পর' : 'हर 2 दिन में';
  if (text.includes('Every day') || text === 'Daily') return lang === 'bn' ? 'প্রতিদিন' : 'प्रतिदिन';
  if (text.includes('Twice a week')) return lang === 'bn' ? 'সপ্তাহে ২ বার' : 'सप्ताह में 2 बार';
  if (text.includes('Every 3 days')) return lang === 'bn' ? 'প্রতি ৩ দিন পর পর' : 'हर 3 दिन में';

  if (text.includes('liters')) return lang === 'bn' ? text.replace(/liters/gi, 'লিটার') : text.replace(/liters/gi, 'लीटर');
  if (text.includes('minutes')) return lang === 'bn' ? text.replace(/minutes/gi, 'মিনিট') : text.replace(/minutes/gi, 'मिनट');

  if (text.includes('6:00 AM - 8:00 AM')) return lang === 'bn' ? 'সকাল ৬:০০ - ৮:০০ টা' : 'सुबह 6:00 - 8:00 बजे';
  if (text.includes('5:00 PM - 7:00 PM')) return lang === 'bn' ? 'বিকাল ৫:০০ - ৭:০০ টা' : 'शाम 5:00 - 7:00 बजे';

  if (text.includes('Irrigation schedule optimized') || text.includes('based on current soil moisture')) {
    return lang === 'bn'
      ? 'বর্তমান মাটির আর্দ্রতা এবং ফসলের বৃদ্ধির পর্যায়ের ওপর ভিত্তি করে সেচ সময়সূচী সর্বোত্তম করা হয়েছে।'
      : 'वर्तमान मिट्टी की नमी और फसल की अवस्था के आधार पर सिंचाई सारणी को अनुकूलित किया गया है।';
  }

  if (text.includes('Mulch around crop base')) {
    return lang === 'bn'
      ? 'মাটির বাষ্পীভবন কমাতে গাছের গোড়ায় খড় বা পাতা দিয়ে মালচিং করুন'
      : 'मिट्टी के वाष्पीकरण को कम करने के लिए पौधों के चारों ओर मल्चिंग करें';
  }
  if (text.includes('Irrigate during early morning hours')) {
    return lang === 'bn'
      ? 'পানির অপচয় কমাতে ভোরের ঠান্ডা বাতাসে সেচ প্রদান করুন'
      : 'पानी के वाष्पीकरण को कम करने के लिए सुबह तड़के सिंचाई करें';
  }

  if (text.includes('Avoid over-watering') || text.includes('root rot')) {
    return lang === 'bn'
      ? 'মাটিতে পানি জমে যাওয়া এবং শিকড় পচা রোগ রোধ করতে অতিরিক্ত সেচ থেকে বিরত থাকুন'
      : 'जलभराव और जड़ों को सड़ने से बचाने के लिए अत्यधिक सिंचाई से बचें';
  }

  return text;
};

const IrrigationRecommendationCard = ({ schedule, onSaveSchedule, onAddFeedback }) => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.recCard ?? irrigationTranslations.en.recCard;

  if (!schedule) return null;

  const scheduleData = schedule.schedule || schedule;
  const summary = schedule.summary || {};

  const irrSched = scheduleData?.irrigationSchedule || {};
  const recs = scheduleData?.recommendations || {};
  const calcBy = scheduleData?.calculatedBy || scheduleData?.ruleEngineCalculations || {};
  const farmDet = scheduleData?.farmDetails || {};
  const envCond = scheduleData?.environmentalConditions || {};

  const urgency = summary.urgency || irrSched.urgency || 'Medium';
  const frequency = summary.frequency || irrSched.frequency || 'Every 2 days';
  const waterPerSession = summary.waterPerSession || `${irrSched.waterQuantity || 2000} ${irrSched.waterUnit || 'liters'}`;
  const durationPerSession = summary.durationPerSession || `${irrSched.duration || 30} ${irrSched.durationUnit || 'minutes'}`;
  const weeklyTotal = summary.weeklyTotal || `${irrSched.weeklyWaterNeed || 8000} liters`;

  const adviceText = recs.irrigationAdvice || irrSched.recommendedAction || 'Irrigation schedule optimized based on current soil moisture and crop stage.';
  const rawTimes = irrSched.bestIrrigationTimes || irrSched.timeOfDay || summary.bestTimes?.split(', ') || ['6:00 AM - 8:00 AM', '5:00 PM - 7:00 PM'];
  const timeList = Array.isArray(rawTimes) ? rawTimes : [rawTimes];

  const rulesList = calcBy.rulesApplied || [
    `Stage Adjustment Factor: ${calcBy.stageFactor || 1.0}x`,
    `Soil Adjustment Factor: ${calcBy.soilFactor || 1.0}x`,
    `Season Adjustment Factor: ${calcBy.seasonFactor || 1.0}x`
  ];
  const waterSavingTips = recs.waterSavingTips || [
    'Mulch around crop base to reduce soil evaporation',
    'Irrigate during early morning hours to minimize water loss'
  ];
  const cautionaryNotes = recs.cautionaryNotes || [
    'Avoid over-watering to prevent waterlogging and root rot'
  ];

  const getUrgencyColor = (u) => {
    switch (u) {
      case 'Critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'High':     return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'Medium':   return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      default:         return 'bg-green-100 border-green-300 text-green-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{t.subtitle}</p>
          </div>
          <div className={`px-4 py-2 rounded-lg border-2 ${getUrgencyColor(urgency)}`}>
            <p className="text-sm font-semibold">{translateIrrigationText(urgency, language)} {t.priority}</p>
          </div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-900">{t.frequency}</span>
          </div>
          <p className="text-lg font-bold text-blue-700">{translateIrrigationText(frequency, language)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Droplet className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-900">{t.waterPerSession}</span>
          </div>
          <p className="text-lg font-bold text-green-700">{translateIrrigationText(waterPerSession, language)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <Clock className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-purple-900">{t.duration}</span>
          </div>
          <p className="text-lg font-bold text-purple-700">{translateIrrigationText(durationPerSession, language)}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-900">{t.weeklyTotal}</span>
          </div>
          <p className="text-lg font-bold text-indigo-700">{translateIrrigationText(weeklyTotal, language)}</p>
        </div>
      </div>

      {/* Expert Advice */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-4 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
          {t.expertAdvice}
        </h3>
        <p className="text-gray-700 leading-relaxed">{translateIrrigationText(adviceText, language)}</p>
      </div>

      {/* Best Times */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t.bestTimes}</h3>
        <div className="flex flex-wrap gap-3">
          {timeList.map((time, i) => (
            <div key={i} className="bg-blue-100 px-4 py-2 rounded-full">
              <span className="font-medium text-blue-800">{translateIrrigationText(time, language)}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-600 mt-2">{t.bestTimesHint}</p>
      </div>

      {/* Water Saving Tips */}
      {waterSavingTips.length > 0 && (
        <div className="border rounded-lg p-4 bg-green-50">
          <h3 className="font-semibold text-green-800 mb-3">{t.waterSavingTips}</h3>
          <ul className="space-y-2">
            {waterSavingTips.map((tip, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-700 text-sm">{translateIrrigationText(tip, language)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cautionary Notes */}
      {cautionaryNotes.length > 0 && (
        <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-300">
          <h3 className="font-semibold text-yellow-800 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {t.cautionaryNotes}
          </h3>
          <ul className="space-y-2">
            {cautionaryNotes.map((note, i) => (
              <li key={i} className="text-gray-700 text-sm">{translateIrrigationText(note, language)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Rules Applied */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-3">{t.rulesApplied}</h3>
        <div className="space-y-1">
          {rulesList.slice(0, 5).map((rule, i) => (
            <p key={i} className="text-xs text-gray-600 font-mono">{translateIrrigationText(rule, language)}</p>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {language === 'bn' ? `নির্ভুলতার হার (Confidence): ${calcBy.confidence || 95}%` : language === 'hi' ? `सटीकता दर (Confidence): ${calcBy.confidence || 95}%` : (t.confidence?.replace('{n}', calcBy.confidence || 95) || 'Confidence: 95%')}
        </p>
      </div>

      {/* Farm Details */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">{t.farmDetails}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div><p className="text-gray-600">{t.crop}</p><p className="font-medium text-gray-800">{translateIrrigationText(farmDet.cropType || 'General Crop', language)}</p></div>
          <div><p className="text-gray-600">{t.farmSize}</p><p className="font-medium text-gray-800">{farmDet.farmSize || 1} {t.acres}</p></div>
          <div><p className="text-gray-600">{t.soilType}</p><p className="font-medium text-gray-800">{translateIrrigationText(farmDet.soilType || 'Loamy', language)}</p></div>
          <div><p className="text-gray-600">{t.soilMoisture}</p><p className="font-medium text-gray-800">{envCond.currentSoilMoisture || 50}%</p></div>
          <div><p className="text-gray-600">{t.temperature}</p><p className="font-medium text-gray-800">{envCond.temperature || 28}°C</p></div>
          <div><p className="text-gray-600">{t.season}</p><p className="font-medium text-gray-800">{translateIrrigationText(farmDet.season || envCond.season || 'Monsoon', language)}</p></div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {onSaveSchedule && (
          <button onClick={() => onSaveSchedule(scheduleData)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            {t.saveBtn}
          </button>
        )}
        {onAddFeedback && (
          <button onClick={() => onAddFeedback(scheduleData._id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            {t.rateBtn}
          </button>
        )}
      </div>

      {/* Action Toolbar: Print/Download, Share, Feedback */}
      <ActionToolbar
        title="Irrigation Schedule Advisory"
        summary={`Recommended Water Quantity: ${waterPerSession}. Frequency: ${frequency}. Duration: ${durationPerSession}`}
      />

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center border-t pt-4">
        <p>{t.disclaimer}</p>
      </div>

    </div>
  );
};

export default IrrigationRecommendationCard;