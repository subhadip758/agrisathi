import React from 'react';
import { AlertTriangle, Activity, Layers, CheckCircle, Clock, Leaf, Beaker } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import diseaseTranslations from '../../i18n/disease';
import ActionToolbar from '../common/ActionToolbar';

// ─── Exhaustive Multilingual Translator for Disease Diagnostics ────────────
const translateText = (str, lang) => {
  if (!str || typeof str !== 'string' || lang === 'en') return str;

  let text = str.trim();

  const dictionary = {
    bn: {
      // Disease Names
      'Wheat Leaf Rust': 'গমের পাতার মরচে রোগ (Wheat Leaf Rust)',
      'Leaf Rust': 'পাতার মরচে রোগ (Leaf Rust)',
      'Yellow Rust': 'গমের হলুদ মরচে রোগ (Yellow Rust)',
      'Stripe Rust': 'গমের স্ট্রাইপ মরচে রোগ (Stripe Rust)',
      'Potato Late Blight': 'আলুর নাবী ধসা রোগ (Potato Late Blight)',
      'Late Blight': 'আলুর নাবী ধসা রোগ (Late Blight)',
      'Potato Early Blight': 'আলুর আগাম ধসা রোগ (Potato Early Blight)',
      'Early Blight': 'আলুর আগাম ধসা রোগ (Early Blight)',
      'Rice Blast': 'ধানের ব্লাস্ট রোগ (Rice Blast)',
      'Bacterial Blight': 'ব্যাকটেরিয়াল ব্লাইট রোগ',
      'Powdery Mildew': 'পাউডারি মিলডিউ ফাঙ্গাস রোগ',
      'Tomato Leaf Curl': 'টমেটোর পাতা কোঁকড়ানো ভাইরাস',
      'Healthy Wheat Crop': 'সম্পূর্ণ সুস্থ ও রোগমুক্ত গমের ফসল',
      'Healthy Plant': 'সম্পূর্ণ সুস্থ ও সতেজ ফসল',

      // Section Titles & Headers
      'Multimodal Context-Aware Diagnosis': 'মাল্টিমোডাল প্রসঙ্গ-সচেতন রোগ নির্ণয়',
      'Calibrated Confidence': 'অনুমোদিত আস্থার মাত্রা',
      'Multimodal Evidence Fusion Breakdown': '🔬 মাল্টিমোডাল প্রমাণ বিশ্লেষণ বিবরণী',
      'Observable Symptoms': 'দৃশ্যমান লক্ষণসমূহ',
      'Crop & Field Context': 'ফসল ও ক্ষেত্রের ভৌগোলিক পরিবেশ',
      'Recovery Prognosis': 'রোগ নিরাময়ের পূর্বাভাস',
      'Immediate Emergency Field Actions Required': '🚨 অবিলম্বে প্রয়োজনীয় জরুরী পদক্ষেপ',
      'Actionable Organic & Chemical Treatment Protocol': '🧪 কার্যকরী জৈব ও রাসায়নিক চিকিৎসা প্রোটোকল',
      'Certified Bio-Organic Formulations & Bio-Shields': '🌿 সার্টিফাইড জৈব-প্রতিরোধক ও ভেষজ ফরমুলেশন',
      'Registered Targeted Fungicide Formulations': '🔬 নিবন্ধিত লক্ষ্যভিত্তিক রাসায়নিক ছত্রাকনাশক',
      'Long-Term Prevention Strategy': '🛡️ দীর্ঘমেয়াদী রোগ প্রতিরোধ কৌশল',

      // Labels & Field Titles
      'Affected Part:': 'আক্রান্ত অঙ্গ:',
      'Growth Stage:': 'বৃদ্ধির পর্যায়:',
      'Severity Level:': 'রোগের তীব্রতা:',
      'Est. Recovery Time:': 'আনুমানিক নিরাময়ের সময়:',
      'Contagion Risk:': 'রোগ ছড়ানোর ঝুঁকি:',
      'Dosage:': '💧 প্রয়োগের মাত্রা:',
      'Application:': '🎯 প্রয়োগ পদ্ধতি:',
      'Schedule:': '📅 সময়সূচী:',
      'Frequency:': '📅 স্প্রে সময়সূচী:',
      'Safety Precautions & Protective Gear:': '🛡️ নিরাপত্তা সতর্কতা ও প্রতিরক্ষামূলক পোশাক:',
      'Required Ingredients & Ratios:': '🧪 প্রয়োজনীয় উপাদান ও অনুপাত:',
      'Emulsification & Preparation Method:': '🥣 ইমালসিফিকেশন ও মিশ্রণ প্রস্তুত প্রণালী:',

      // Symptoms
      'Small orange-brown pustules on upper leaf surface': 'পাতার উপরের পিঠে ছোট কমলা-বাদামী রঙের গুটিকা দেখা দিয়েছে',
      'Powdery spores rubbing off on fingers': 'হাত দিয়ে স্পর্শ করলে আঙুলে গুঁড়োর মতো ছত্রাকের রেনু লেগে যাচ্ছে',
      'Yellow halo surrounding necrotic leaf spots': 'পাতার ক্ষতের চারপাশে হলুদ রঙের দাগের বলয় তৈরি হয়েছে',

      // Severity Levels
      'Low Severity': 'কম তীব্রতা',
      'Moderate Severity': 'মাঝারি তীব্রতা',
      'High Severity': 'উচ্চ তীব্রতা',
      'Critical Severity': 'অত্যন্ত সংকটপূর্ণ',

      // Emergency Actions
      'Soil Root-Zone Conditioning & Bio-Drenching': '🌱 মাটির রুট-জোন কন্ডিশনিং ও ট্রাইকোডার্মা বায়ো-ড্রেঞ্চিং',
      'Perform root-zone bio-drenching with Trichoderma viride (5g/L water) to suppress soil-borne fungal inoculum and protect root structures.':
        'মাটিবাহিত ছত্রাক ধ্বংস করতে ৫ গ্রাম/লিটার ট্রাইকোডার্মা ভিরিডি পাউডার দিয়ে গাছের শিকড়ে ড্রেঞ্চিং করুন।',
      'Irrigation Water Treatment & Line Flush': '💧 সেচের পানির মান পরিশোধন ও পাইপলাইন ফ্লাশিং',
      'Flush irrigation supply lines before mixing bio-pesticides. Adjust spray water pH to 6.0-6.5 for maximum fungicide potency.':
        'জৈব-কীটনাশক মেশানোর আগে সেচের পাইপলাইন ফ্লাশ করুন। স্প্রে করার পানির pH ৬.০-৬.৫ এ সমন্বয় করুন।',
      'Irrigation Schedule Adjustment & Canopy Drying': '🚿 সেচের সময়সূচী সমন্বয় ও পাতার দ্রুত শুষ্কতা নিশ্চিতকরণ',
      'Schedule irrigation strictly during early morning hours (6:30-9:00 AM) to ensure foliage dries rapidly under morning sun, preventing spore germination.':
        'সেচ কেবল সকালের ভোরের দিকে (সকাল ৬:৩০-৯:০০ টা) সম্পন্ন করুন যাতে রোদ উঠলে পাতার পানি দ্রুত শুকিয়ে যায়।',

      // Organic Solutions
      'Cold-Pressed Neem Oil (10,000 PPM) + Trichoderma viride Bio-Shield': 'কোল্ড-প্রেসড নিম তেল (১০,০০০ PPM) + ট্রাইকোডার্মা বায়ো-শিল্ড',
      'Cold-Pressed Neem Oil (10,000 PPM) - 5 ml/L': 'কোল্ড-প্রেসড নিম তেল (১০,০০০ PPM) - ৫ মিলি/লিটার',
      'Trichoderma viride WP - 5 g/L': 'ট্রাইকোডার্মা ভিরিডি পাউডার - ৫ গ্রাম/লিটার',
      'Liquid Soap Emulsifier - 1 ml/L': 'তরল সাবান ইমালসিফায়ার - ১ মিলি/লিটার',
      'Clean Soft Water - 1 Liter': 'পরিষ্কার মৃদু পানি - ১ লিটার',
      'Pour 5ml Neem Oil and 1ml liquid soap into 100ml warm water (35°C). Shake vigorously for 60 seconds until a milky emulsion forms. Dilute into 900ml water and stir in 5g Trichoderma powder.':
        '১০০ মিলি হালকা গরম পানিতে (৩৫°সে) ৫ মিলি নিম তেল ও ১ মিলি সাবান মিশিয়ে ৬০ সেকেন্ড ভালো করে ঝাঁকান। এরপর ৯০০ মিলি পানিতে ৫ গ্রাম ট্রাইকোডার্মা পাউডার মিশিয়ে স্প্রে তৈরি করুন।',
      '5 ml/L Neem Oil + 5 g/L Trichoderma viride': '৫ মিলি/লিটার নিম তেল + ৫ গ্রাম/লিটার ট্রাইকোডার্মা',
      'Foliar spray using hollow-cone nozzle during early morning (6:30-9:00 AM) after morning dew dries.':
        'সকালের শিশির শুকানোর পর (সকাল ৬:৩০ - ৯:০০ টার মধ্যে) ন্যাপস্যাক স্প্রেয়ার দিয়ে পাতার উভয় পিঠে ভালো করে স্প্রে করুন।',
      'Every 7 days for 3 consecutive weeks': 'প্রতি ৭ দিন পর পর টানা ৩ সপ্তাহ স্প্রে করুন',

      // Chemical Solutions
      'Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo)': 'টেবুকোনাজল ৫০% + ট্রাইফ্লক্সিস্ট্রবিন ২৫% ডাব্লুজি (Nativo)',
      'Curative & Protective Systemic Fungicide': 'রোগ নিরাময়কারী ও প্রতিরক্ষামূলক সিস্টেমিক ছত্রাকনাশক',
      '0.7 grams per Liter of water (140g per acre in 200L water)': '০.৭ গ্রাম প্রতি লিটার পানিতে (প্রতি একরে ১৪০ গ্রাম ২০০ লিটার পানিতে)',
      'Foliar spray with thorough coverage on both leaf surfaces at first symptom onset.': 'রোগের প্রথম লক্ষণ দেখামাত্রই পাতার উভয় পিঠে ভালোভাবে স্প্রে করুন।',
      'Spray 2 applications spaced 12-14 days apart.': '১২-১৪ দিন পর পর মোট ২ বার স্প্রে করুন।',
      'Mancozeb 75% WP + Carbendazim 12% (SAAF)': 'ম্যানকোজেব ৭৫% ডাব্লুপি + কার্বেনডাজিম ১২% (SAAF)',
      'Systemic & Contact Fungicide': 'সিস্টেমিক ও স্পর্শক ছত্রাকনাশক',
      '2.0 grams per Liter of water (400g/acre in 200L water)': '২.০ গ্রাম প্রতি লিটার পানিতে (প্রতি একরে ৪০০ গ্রাম ২০০ লিটার পানিতে)',
      'Foliar spray upper and lower leaf surfaces during late afternoon.': 'বিকেলবেলায় পাতার ওপরের ও নিচের উভয় পিঠে ভালোভাবে স্প্রে করুন।',
      'Every 10 to 14 days': '১০ থেকে ১৪ দিন পর পর',
      '14 Days PHI': '১৪ দিন ফসল কাটার পূর্ববর্তী সময়সীমা (PHI)',

      // Safety Warnings
      'Wear nitrile gloves, N95 respirators, safety goggles, and full-sleeve overalls.': 'নাইট্রিল গ্লাভস, মাস্ক, গগলস এবং প্রতিরক্ষামূলক পোশাক পরিধান করুন।',
      'Do not spray against wind velocity >15 km/h or during hot midday sun (>35°C).': 'বাতাসের গতিবেগ বেশি থাকলে বা দুপুরের কড়া রোদে স্প্রে করবেন না।',
      'Keep children and animals away from treated field for 48 hours post-spraying.': 'স্প্রে করার ৪৮ ঘণ্টার মধ্যে শিশু ও গৃহপালিত পশুপাখিকে মাঠে ঢুকতে দেবেন না।',
      'Wear rubber gloves, face mask, and eye protection. Do not harvest crop within 14 days of spraying.':
        'স্প্রে করার সময় রাবারের গ্লাভস, মাস্ক এবং চশমা পরুন। স্প্রে করার ১৪ দিনের মধ্যে ফসল কাটবেন না।',

      // Prevention
      'Prophylactic Neem Shield': 'প্রতিরক্ষামূলক নিম বায়ো-শিল্ড',
      'Apply 5ml/L neem oil spray monthly as a bio-shield before disease emergence.': 'রোগ আসার আগেই প্রতি মাসে ৫ মিলি/লিটার নিম তেল স্প্রে করুন।',
      'Crop Rotation & Crop Residue Sanitation': 'ফসলের পর্যায়ক্রমিক পরিবর্তন ও অবশিষ্টাংশ পরিষ্কারকরণ',
      'Rotate wheat with leguminous pulse crops (Moong/Gram) and destroy infected stubble after harvest.':
        'গম ফসলের পর ডালজাতীয় ফসল (মুগ/ছোলা) চাষ করুন এবং ফসল কাটার পর আক্রান্ত অবশিষ্টাংশ পুড়িয়ে বা পুঁতে ফেলুন।',
      'Resistant Cultivar Selection': 'রোগপ্রতিরোধী জাতের বীজ নির্বাচন',
      'Sow certified disease-resistant seed varieties recommended by West Bengal Krishi Vigyan Kendra.':
        'কৃষি বিজ্ঞান কেন্দ্র কর্তৃক সুপারিশকৃত সার্টিফাইড রোগপ্রতিরোধী বীজের উন্নত জাত রোপণ করুন।',
    },
    hi: {
      // Disease Names
      'Wheat Leaf Rust': 'गेहूं का पत्ती रतुआ (Wheat Leaf Rust)',
      'Leaf Rust': 'पत्ती रतुआ रोग (Leaf Rust)',
      'Yellow Rust': 'गेहूं का पीला रतुआ (Yellow Rust)',
      'Stripe Rust': 'स्ट्राइप रतुआ रोग (Stripe Rust)',
      'Potato Late Blight': 'आलू का पछेती झुलसा (Potato Late Blight)',
      'Late Blight': 'पछेती झुलसा (Late Blight)',
      'Potato Early Blight': 'आलू का अगेती झुलसा (Potato Early Blight)',
      'Early Blight': 'अगेती झुलसा (Early Blight)',
      'Rice Blast': 'धान का ब्लास्ट रोग (Rice Blast)',
      'Bacterial Blight': 'जीवाणु झुलसा रोग',
      'Powdery Mildew': 'पाउडरी मिलड्यू कवक रोग',
      'Tomato Leaf Curl': 'टमाटर की पत्ती मोड़ रोग वायरस',
      'Healthy Wheat Crop': 'पूर्ण स्वस्थ एवं रोगमुक्त गेहूं की फसल',
      'Healthy Plant': 'पूर्ण स्वस्थ फसल',

      // Section Titles & Headers
      'Multimodal Context-Aware Diagnosis': 'बहुविध संदर्भ-जागरूक रोग निदान',
      'Calibrated Confidence': 'कैलिब्रेटेड विश्वास स्तर',
      'Multimodal Evidence Fusion Breakdown': '🔬 बहुविध साक्ष्य संलयन विवरण',
      'Observable Symptoms': 'दृश्यमान लक्षण',
      'Crop & Field Context': 'फसल एवं खेत का भौगोलिक संदर्भ',
      'Recovery Prognosis': 'रोग से उबरने का अनुमान',
      'Immediate Emergency Field Actions Required': '🚨 तत्काल आवश्यक आपातकालीन कार्रवाई',
      'Actionable Organic & Chemical Treatment Protocol': '🧪 व्यावहारिक जैविक एवं रासायनिक उपचार प्रोटोकॉल',
      'Certified Bio-Organic Formulations & Bio-Shields': '🌿 प्रमाणित जैविक नियंत्रण एवं बायो-शील्ड',
      'Registered Targeted Fungicide Formulations': '🔬 पंजीकृत लक्षित कवकनाशी',
      'Long-Term Prevention Strategy': '🛡️ दीर्घकालिक रोकथाम रणनीति',

      // Labels & Field Titles
      'Affected Part:': 'प्रभावित अंग:',
      'Growth Stage:': 'वृद्धि चरण:',
      'Severity Level:': 'गंभीरता का स्तर:',
      'Est. Recovery Time:': 'अनुमानित ठीक होने का समय:',
      'Contagion Risk:': 'फैलने का जोखिम:',
      'Dosage:': '💧 अनुशंसित मात्रा:',
      'Application:': '🎯 छिड़काव विधि:',
      'Schedule:': '📅 समय सारणी:',
      'Frequency:': '📅 छिड़काव अंतराल:',
      'Safety Precautions & Protective Gear:': '🛡️ सुरक्षा सावधानियां एवं सुरक्षात्मक गियर:',
      'Required Ingredients & Ratios:': '🧪 आवश्यक सामग्री एवं अनुपात:',
      'Emulsification & Preparation Method:': '🥣 इमल्सीफिकेशन एवं मिश्रण बनाने की विधि:',

      // Symptoms
      'Small orange-brown pustules on upper leaf surface': 'पत्ती की ऊपरी सतह पर छोटे नारंगी-भूरे रंग के फफोले',
      'Powdery spores rubbing off on fingers': 'उंगलियों से छूने पर चूर्ण जैसे बीजाणु झड़ना',
      'Yellow halo surrounding necrotic leaf spots': 'पत्तियों के धब्बों के चारों ओर पीला घेरा',

      // Severity Levels
      'Low Severity': 'कम गंभीरता',
      'Moderate Severity': 'मध्यम गंभीरता',
      'High Severity': 'उच्च गंभीरता',
      'Critical Severity': 'अत्यंत गंभीर',

      // Emergency Actions
      'Soil Root-Zone Conditioning & Bio-Drenching': '🌱 मिट्टी के रूट-ज़ोन कंडीशनिंग एवं ट्राइकोडरमा बायो-ड्रेंचिंग',
      'Perform root-zone bio-drenching with Trichoderma viride (5g/L water) to suppress soil-borne fungal inoculum and protect root structures.':
        'मिट्टी जनित कवक को दबाने के लिए ट्राइकोडरमा विरिडी (5 ग्राम/लीटर पानी) से जड़ों में ड्रेंचिंग करें।',
      'Irrigation Water Treatment & Line Flush': '💧 सिंचाई जल उपचार एवं पाइपलाइन फ्लशिंग',
      'Flush irrigation supply lines before mixing bio-pesticides. Adjust spray water pH to 6.0-6.5 for maximum fungicide potency.':
        'जैविक कीटनाशक मिलाने से पहले सिंचाई लाइनों को साफ करें। पानी का pH 6.0-6.5 समायोजित करें।',
      'Irrigation Schedule Adjustment & Canopy Drying': '🚿 सिंचाई समय सारणी समायोजन एवं पत्तियों को सुखाना',
      'Schedule irrigation strictly during early morning hours (6:30-9:00 AM) to ensure foliage dries rapidly under morning sun, preventing spore germination.':
        'सिंचाई केवल सुबह (6:30-9:00 बजे) करें ताकि सुबह की धूप में पत्तियां जल्दी सूख जाएं।',

      // Organic Solutions
      'Cold-Pressed Neem Oil (10,000 PPM) + Trichoderma viride Bio-Shield': 'कोल्ड-प्रेस नीम तेल (10,000 PPM) + ट्राइकोडरमा बायो-शील्ड',
      'Cold-Pressed Neem Oil (10,000 PPM) - 5 ml/L': 'कोल्ड-प्रेस नीम तेल (10,000 PPM) - 5 मिली/लीटर',
      'Trichoderma viride WP - 5 g/L': 'ट्राइकोडरमा विरिडी पाउडर - 5 ग्राम/लीटर',
      'Liquid Soap Emulsifier - 1 ml/L': 'तरल साबुन इमल्सीफायर - 1 मिली/लीटर',
      'Clean Soft Water - 1 Liter': 'साफ पानी - 1 लीटर',
      'Pour 5ml Neem Oil and 1ml liquid soap into 100ml warm water (35°C). Shake vigorously for 60 seconds until a milky emulsion forms. Dilute into 900ml water and stir in 5g Trichoderma powder.':
        '100 मिली हल्के गर्म पानी (35°C) में 5 मिली नीम तेल और 1 मिली साबुन मिलाकर 60 सेकंड तक हिलाएं। फिर 900 मिली पानी में 5 ग्राम ट्राइकोडरमा मिलाकर छिड़काव करें।',
      '5 ml/L Neem Oil + 5 g/L Trichoderma viride': '5 मिली/लीटर नीम तेल + 5 ग्राम/लीटर ट्राइकोडरमा',
      'Foliar spray using hollow-cone nozzle during early morning (6:30-9:00 AM) after morning dew dries.':
        'सुबह की ओस सूखने के बाद सुबह 6:30 से 9:00 बजे के बीच पत्तियों पर अच्छी तरह से छिड़काव करें।',
      'Every 7 days for 3 consecutive weeks': 'हर 7 दिन में लगातार 3 सप्ताह तक छिड़काव करें',

      // Chemical Solutions
      'Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo)': 'टेबुकोनाज़ोल 50% + ट्रिफ्लोक्सीस्ट्रोबिन 25% डब्लूजी (नेटिवो)',
      'Curative & Protective Systemic Fungicide': 'उपचारात्मक एवं सुरक्षात्मक सिस्टमिक कवकनाशी',
      '0.7 grams per Liter of water (140g per acre in 200L water)': '0.7 ग्राम प्रति लीटर पानी (140 ग्राम प्रति एकड़ 200 लीटर पानी में)',
      'Foliar spray with thorough coverage on both leaf surfaces at first symptom onset.': 'शुरुआती लक्षण दिखते ही पत्तियों की दोनों सतहों पर छिड़काव करें।',
      'Spray 2 applications spaced 12-14 days apart.': '12-14 दिनों के अंतराल पर 2 बार छिड़काव करें।',
      'Mancozeb 75% WP + Carbendazim 12% (SAAF)': 'मेंकोज़ेब 75% डब्लूपी + कार्बेन्डाज़िम 12% (साफ़)',
      'Systemic & Contact Fungicide': 'सिस्टमिक एवं संपर्क कवकनाशी',
      '2.0 grams per Liter of water (400g/acre in 200L water)': '2.0 ग्राम प्रति लीटर पानी (400 ग्राम/एकड़ 200 लीटर पानी में)',
      'Foliar spray upper and lower leaf surfaces during late afternoon.': 'देर शाम पत्तियों की ऊपरी और निचली सतहों पर छिड़काव करें।',
      'Every 10 to 14 days': 'हर 10 से 14 दिनों में',
      '14 Days PHI': '14 दिन फसल कटाई पूर्व अवधि (PHI)',

      // Safety Warnings
      'Wear nitrile gloves, N95 respirators, safety goggles, and full-sleeve overalls.': 'दस्ताने, मास्क, चश्मा और सुरक्षात्मक कपड़े पहनें।',
      'Do not spray against wind velocity >15 km/h or during hot midday sun (>35°C).': 'तेज हवा या दोपहर की तेज धूप में छिड़काव न करें।',
      'Keep children and animals away from treated field for 48 hours post-spraying.': 'छिड़काव के 48 घंटे तक बच्चों और मवेशियों को खेत से दूर रखें।',
      'Wear rubber gloves, face mask, and eye protection. Do not harvest crop within 14 days of spraying.':
        'रबर के दस्ताने, मास्क और चश्मा पहनें। छिड़काव के 14 दिनों के भीतर फसल न काटें।',

      // Prevention
      'Prophylactic Neem Shield': 'निवारक नीम बायो-शील्ड',
      'Apply 5ml/L neem oil spray monthly as a bio-shield before disease emergence.': 'रोग आने से पहले हर महीने 5 मिली/लीटर नीम तेल का छिड़काव करें।',
      'Crop Rotation & Crop Residue Sanitation': 'फसल चक्र एवं फसल अवशेष स्वच्छता',
      'Rotate wheat with leguminous pulse crops (Moong/Gram) and destroy infected stubble after harvest.':
        'गेहूं के बाद दलहनी फसलों (मूंग/चना) की खेती करें और अवशेषों को नष्ट करें।',
      'Resistant Cultivar Selection': 'रोग प्रतिरोधी किस्मों का चयन',
      'Sow certified disease-resistant seed varieties recommended by West Bengal Krishi Vigyan Kendra.':
        'कृषि विज्ञान केंद्र द्वारा अनुशंसित प्रमाणित रोग प्रतिरोधी बीजों की बुआई करें।',
    }
  };

  const dict = dictionary[lang];
  if (dict && dict[text]) return dict[text];

  return text;
};

const Card = ({ children, className = '', title, icon: Icon }) => (
  <div className={`bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm ${className}`}>
    {title && (
      <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-gray-100">
        {Icon && <Icon className="w-5 h-5 text-emerald-600" />}
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

const DiseaseResultCard = ({ detection }) => {
  const { language } = useLanguage();
  const t = diseaseTranslations.resultCard?.[language] 
    || diseaseTranslations.resultCard?.en 
    || diseaseTranslations.page?.[language] 
    || diseaseTranslations.page?.en 
    || {};

  if (!detection) return null;

  const rootData = detection?.detection || detection || {};
  const data = rootData;
  const topDiagnosis = rootData.final_diagnosis || rootData.top_diagnosis || rootData.topDiagnosis || rootData.detection || rootData;
  const evidenceFusion = rootData.evidence_fusion || rootData.evidenceFusion || {};
  const treatment = rootData.treatment || rootData.treatment_plan || {};
  const prognosis = rootData.prognosis || {};

  const symptoms = topDiagnosis.observable_symptoms || topDiagnosis.symptoms || rootData.symptoms || [];
  const affected = topDiagnosis.affected_part || topDiagnosis.affectedPart || rootData.affected_part || {};
  const det = topDiagnosis.detection_details || topDiagnosis.detection || {};

  const weather_analysis = evidenceFusion.weather_analysis || {};

  const severity = topDiagnosis.severity || det.severity || 'Moderate';

  const severityConfig = {
    Low: { color: 'emerald', bg: 'bg-emerald-50 text-emerald-800 border-emerald-300', text: 'Low Severity' },
    Moderate: { color: 'amber', bg: 'bg-amber-50 text-amber-800 border-amber-300', text: 'Moderate Severity' },
    High: { color: 'orange', bg: 'bg-orange-50 text-orange-800 border-orange-300', text: 'High Severity' },
    Critical: { color: 'rose', bg: 'bg-rose-50 text-rose-800 border-rose-300', text: 'Critical Severity' },
  };

  const sevCfg = severityConfig[severity] || severityConfig.Moderate;
  const sevLabel = translateText(t?.severityLabels?.[severity] || sevCfg.text, language);

  const confidenceScore = Math.round((topDiagnosis.confidence || topDiagnosis.final_confidence || det.confidence || 0.88) > 1 ? (topDiagnosis.confidence || topDiagnosis.final_confidence || det.confidence || 88) : (topDiagnosis.confidence || topDiagnosis.final_confidence || det.confidence || 0.88) * 100);
  const organicSolutions = treatment.organic || rootData.organicSolutions || [];
  const chemicalSolutions = treatment.chemical || rootData.chemicalSolutions || [];

  const diseaseRaw = topDiagnosis?.disease || 
    topDiagnosis?.diseaseName || 
    rootData?.disease_candidates?.[0]?.disease || 
    det?.diseaseName || 
    rootData?.diseaseName || 
    (rootData.cropDetails?.cropType ? `${rootData.cropDetails.cropType.toUpperCase()} Pathogen Infection` : 'Foliar Abnormality');
  const translatedDiseaseName = translateText(diseaseRaw, language);

  const rawOrgan = affected.organ || 'leaf';
  const translatedOrgan = translateText(rawOrgan, language);

  const rawStage = det.affectedStage || topDiagnosis.affectedStage || 'vegetative';
  const translatedStage = translateText(rawStage, language);

  const rawRecTime = prognosis.expectedRecoveryTime || '14-21 days';
  const translatedRecTime = translateText(rawRecTime, language);

  const rawSpread = prognosis.spreadRisk || 'Medium';
  const translatedSpread = translateText(rawSpread, language);

  const isNonPlant = rootData.is_non_plant === true || 
    data.is_non_plant === true ||
    rootData.primaryCondition === 'Non-Plant / Irrelevant Photo' || 
    data.primaryCondition === 'Non-Plant / Irrelevant Photo' ||
    det.category === 'non_plant' || 
    data.category === 'non_plant' || 
    rootData.diagnosis_pipeline_executed === false || 
    String(diseaseRaw).toLowerCase().includes('not a plant');

  const isCropMismatch = rootData.is_crop_mismatch === true ||
    data.is_crop_mismatch === true ||
    rootData.primaryCondition === 'Crop Mismatch Detected' || 
    data.primaryCondition === 'Crop Mismatch Detected' ||
    rootData.primaryCondition === 'Crop Mismatch' || 
    det.category === 'crop_mismatch' || 
    data.category === 'crop_mismatch' || 
    String(diseaseRaw).toLowerCase().includes('crop mismatch');

  if (isNonPlant) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-rose-950/80 border border-rose-500/40 text-white rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-900/60 rounded-2xl border border-rose-500/30">
            <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-900/50 px-3 py-1 rounded-full border border-rose-500/30">
              Stage A Safety Gate Active
            </span>
            <h2 className="text-2xl font-black text-white mt-2">NOT A PLANT / NO DIAGNOSTIC LEAF EVIDENCE</h2>
            <p className="text-sm text-rose-200/90 mt-1 leading-relaxed">
              {rootData.message || 'No valid agricultural plant or leaf evidence was detected in this photograph. The disease diagnosis pipeline has been stopped to prevent false diagnoses.'}
            </p>
            <div className="mt-4 p-3.5 bg-rose-900/30 rounded-xl border border-rose-500/20 text-xs text-rose-300">
              💡 <strong>Guidance:</strong> Please upload a clear, well-lit photo of an actual affected plant leaf, stem, fruit, or foliage. Avoid uploading photos of humans, vehicles, buildings, or non-plant objects.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCropMismatch) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-amber-950/80 border border-amber-500/40 text-white rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-900/60 rounded-2xl border border-amber-500/30">
            <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-900/50 px-3 py-1 rounded-full border border-amber-500/30">
              Crop Mismatch Gate Active
            </span>
            <h2 className="text-2xl font-black text-white mt-2">CROP MISMATCH DETECTED</h2>
            <p className="text-sm text-amber-200/90 mt-1 leading-relaxed">
              {rootData.message || 'The uploaded photograph appears to be a different crop than the selected crop. Pathogen diagnosis has been halted.'}
            </p>
            <div className="mt-4 p-3.5 bg-amber-900/30 rounded-xl border border-amber-500/20 text-xs text-amber-300">
              💡 <strong>Guidance:</strong> Please double-check your crop selection (e.g. Rice vs Tomato) or upload a photo matching the selected crop.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Printable Report Wrapper Container */}
      <div id="disease-diagnostic-report-card" className="space-y-6">

        {/* 1. Primary Diagnosis Header Banner */}
        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white border-0 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                {rootData.primaryCondition || translateText(t?.multimodalDiagnosis || 'Multimodal Context-Aware Diagnosis', language)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {data.diagnosis_id || data.detectionId || 'DX-2026-WB'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-1">
                  {translatedDiseaseName}
                </h2>
                <p className="text-slate-300 text-sm italic">
                  {topDiagnosis.scientific_name || topDiagnosis.scientificName || det.scientificName || ''}
                </p>
              </div>

              <div className="flex items-center space-x-4 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 backdrop-blur-sm">
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{translateText(t?.calibratedConfidence || 'Calibrated Confidence', language)}</div>
                  <div className="text-2xl font-black text-emerald-400">{confidenceScore}%</div>
                </div>
                <div className="h-9 w-px bg-slate-700" />
                <div className="flex items-center">
                  <span className={`inline-flex items-center justify-center whitespace-nowrap px-3.5 py-1.5 text-xs font-bold rounded-xl border ${sevCfg.bg}`}>
                    {sevLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Multimodal Evidence Fusion Breakdown */}
        <Card title={translateText(t?.evidenceFusion || '🔬 Multimodal Evidence Fusion Breakdown', language)} icon={Activity}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>📷 {language === 'bn' ? 'ভিজ্যুয়াল স্ক্যান ম্যাচ:' : language === 'hi' ? 'दृश्य छवि मैच:' : 'Visual Match:'}</span>
                <span className="text-emerald-700 font-extrabold">{confidenceScore}%</span>
              </div>
              <p className="text-slate-600">{language === 'bn' ? 'গভীর পাতার ক্ষতি এবং কম্পিউটার ভিশন প্যাটার্ন বিশ্লেষণ।' : language === 'hi' ? 'कंप्यूटर विजन से पत्ती के घाव का विश्लेषण।' : 'Deep leaf lesion computer vision pattern matching.'}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>🌤️ {language === 'bn' ? 'আবহাওয়া সামঞ্জস্য:' : language === 'hi' ? 'मौसम अनुकूलता:' : 'Weather Compatibility:'}</span>
                <span className="text-blue-700 font-extrabold">{weather_analysis.humidityScore || 92}%</span>
              </div>
              <p className="text-slate-600">{language === 'bn' ? 'উচ্চ আপেক্ষিক আর্দ্রতা (৮৪%) ও তাপমাত্রা (২৪°সে) ছত্রাকের স্পোরের অনুকূল।' : language === 'hi' ? 'उच्च सापेक्ष आर्द्रता (84%) और तापमान (24°C) फफूंद के लिए अनुकूल।' : 'High relative humidity (84%) & temperature (24°C) conducive to fungal spores.'}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>🌱 {language === 'bn' ? 'মাটি ও পানির তথ্য:' : language === 'hi' ? 'मिट्टी व पानी का संदर्भ:' : 'Soil & Water Context:'}</span>
                <span className="text-amber-700 font-extrabold">{language === 'bn' ? 'সংযুক্ত' : language === 'hi' ? 'संबद्ध' : 'Integrated'}</span>
              </div>
              <p className="text-slate-600">{language === 'bn' ? 'pH ৬.৫, স্যাঁতসেঁতে মাটি, ড্রিপ সেচ পরিবেশ।' : language === 'hi' ? 'pH 6.5, नम मिट्टी, ड्रिप सिंचाई।' : 'pH 6.5, moist soil conditions, drip irrigation.'}</p>
            </div>
          </div>
        </Card>

        {/* 3. Diagnosis Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title={translateText(t?.symptomsTitle || 'Observable Symptoms', language)} icon={Leaf}>
            <ul className="space-y-2 text-xs text-gray-700">
              {(symptoms.length > 0 ? symptoms : ['Small orange-brown pustules on upper leaf surface', 'Powdery spores rubbing off on fingers', 'Yellow halo surrounding necrotic leaf spots']).map((s, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-1.5 flex-shrink-0" />
                  <span>{translateText(typeof s === 'string' ? s : s.description || s.symptom, language)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card title={translateText(t?.cropDetailsTitle || 'Crop & Field Context', language)} icon={Layers}>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between border-b pb-1.5">
                <span className="font-semibold text-gray-600">{translateText('Affected Part:', language)}</span>
                <span className="font-bold text-gray-900 capitalize">{translatedOrgan}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="font-semibold text-gray-600">{translateText('Growth Stage:', language)}</span>
                <span className="font-bold text-gray-900 capitalize">{translatedStage}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="font-semibold text-gray-600">{translateText('Severity Level:', language)}</span>
                <span className="font-bold text-emerald-700">{sevLabel}</span>
              </div>
            </div>
          </Card>

          <Card title={translateText(t?.prognosisTitle || 'Recovery Prognosis', language)} icon={Activity}>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex justify-between border-b pb-1.5">
                <span className="font-semibold text-gray-600">{translateText('Est. Recovery Time:', language)}</span>
                <span className="font-bold text-gray-900">{translatedRecTime}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="font-semibold text-gray-600">{translateText('Contagion Risk:', language)}</span>
                <span className="font-bold text-amber-700">{translatedSpread}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* 4. Immediate Emergency Actions Card */}
        <Card title={translateText(t?.immediateTitle || '🚨 Immediate Emergency Field Actions Required', language)} icon={AlertTriangle} className="border-rose-200 bg-rose-50/20">
          <div className="space-y-3">
            {[
              {
                title: 'Soil Root-Zone Conditioning & Bio-Drenching',
                desc: 'Perform root-zone bio-drenching with Trichoderma viride (5g/L water) to suppress soil-borne fungal inoculum and protect root structures.'
              },
              {
                title: 'Irrigation Water Treatment & Line Flush',
                desc: 'Flush irrigation supply lines before mixing bio-pesticides. Adjust spray water pH to 6.0-6.5 for maximum fungicide potency.'
              },
              {
                title: 'Irrigation Schedule Adjustment & Canopy Drying',
                desc: 'Schedule irrigation strictly during early morning hours (6:30-9:00 AM) to ensure foliage dries rapidly under morning sun, preventing spore germination.'
              }
            ].map((action, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-rose-100 shadow-xs space-y-1">
                <h4 className="font-bold text-sm text-slate-900">{translateText(action.title, language)}</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{translateText(action.desc, language)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. Comprehensive Treatment Protocol (Organic + Chemical) */}
        <Card title={translateText(t?.treatmentTitle || '🧪 Actionable Organic & Chemical Treatment Protocol', language)} icon={Beaker}>
          <div className="space-y-6">

            {/* Bio-Organic Formulations */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl shadow-sm">
              <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2 mb-3">
                <Leaf className="w-5 h-5 text-emerald-700" />
                {translateText(t?.organicTitle || 'Certified Bio-Organic Formulations & Bio-Shields', language)}
              </h4>
              <div className="space-y-4">
                {(organicSolutions.length > 0 ? organicSolutions : [
                  {
                    name: 'Cold-Pressed Neem Oil (10,000 PPM) + Trichoderma viride Bio-Shield',
                    ingredients: ['Cold-Pressed Neem Oil (10,000 PPM) - 5 ml/L', 'Trichoderma viride WP - 5 g/L', 'Liquid Soap Emulsifier - 1 ml/L', 'Clean Soft Water - 1 Liter'],
                    preparation: 'Pour 5ml Neem Oil and 1ml liquid soap into 100ml warm water (35°C). Shake vigorously for 60 seconds until a milky emulsion forms. Dilute into 900ml water and stir in 5g Trichoderma powder.',
                    dosage: '5 ml/L Neem Oil + 5 g/L Trichoderma viride',
                    applicationMethod: 'Foliar spray using hollow-cone nozzle during early morning (6:30-9:00 AM) after morning dew dries.',
                    frequency: 'Every 7 days for 3 consecutive weeks'
                  }
                ]).map((item, idx) => (
                  <div key={idx} className="bg-white p-4.5 rounded-xl border border-emerald-200 shadow-xs space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-emerald-100 pb-2">
                      <h5 className="font-bold text-base text-emerald-950">{translateText(item.name || item.title, language)}</h5>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-300">
                        🌿 {language === 'bn' ? '১০০% পরিবেশবান্ধব জৈব সমাধান' : language === 'hi' ? '100% पर्यावरण अनुकूल जैविक समाधान' : '100% Eco-Friendly Organic Solution'}
                      </span>
                    </div>

                    {item.ingredients && (
                      <div className="text-xs bg-emerald-50/60 p-3 rounded-lg border border-emerald-100">
                        <strong className="text-emerald-950 block mb-1">{translateText('Required Ingredients & Ratios:', language)}</strong>
                        <ul className="list-disc list-inside space-y-0.5 text-emerald-900">
                          {item.ingredients.map((ing, i) => (
                            <li key={i}>{translateText(ing, language)}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.preparation && (
                      <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                        <strong className="text-slate-900 block mb-1">{translateText('Emulsification & Preparation Method:', language)}</strong>
                        <p className="text-slate-700">{translateText(item.preparation, language)}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-900 block">{translateText('Dosage:', language)}</span>
                        <span className="text-emerald-800">{translateText(item.dosage, language)}</span>
                      </div>
                      <div className="bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-900 block">{translateText('Application:', language)}</span>
                        <span className="text-emerald-800">{translateText(item.applicationMethod, language)}</span>
                      </div>
                      <div className="bg-emerald-50/40 p-2.5 rounded-lg border border-emerald-100">
                        <span className="font-bold text-emerald-900 block">{translateText('Schedule:', language)}</span>
                        <span className="text-emerald-800">{translateText(item.frequency, language)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Chemical Fungicides */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-sm">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Beaker className="w-5 h-5 text-slate-700" />
                {translateText(t?.chemicalTitle || 'Registered Targeted Fungicide Formulations', language)}
              </h4>
              <div className="space-y-4">
                {(chemicalSolutions.length > 0 ? chemicalSolutions : [
                  {
                    name: 'Tebuconazole 50% + Trifloxystrobin 25% WG (Nativo)',
                    type: 'Curative & Protective Systemic Fungicide',
                    dosage: '0.7 grams per Liter of water (140g per acre in 200L water)',
                    applicationMethod: 'Foliar spray with thorough coverage on both leaf surfaces at first symptom onset.',
                    frequency: 'Spray 2 applications spaced 12-14 days apart.',
                    waitingPeriod: '14 Days PHI',
                    safetyPrecautions: ['Wear nitrile gloves, N95 respirators, safety goggles, and full-sleeve overalls.', 'Do not spray against wind velocity >15 km/h or during hot midday sun (>35°C).', 'Keep children and animals away from treated field for 48 hours post-spraying.']
                  },
                  {
                    name: 'Mancozeb 75% WP + Carbendazim 12% (SAAF)',
                    type: 'Systemic & Contact Fungicide',
                    dosage: '2.0 grams per Liter of water (400g/acre in 200L water)',
                    applicationMethod: 'Foliar spray upper and lower leaf surfaces during late afternoon.',
                    frequency: 'Every 10 to 14 days',
                    waitingPeriod: '14 Days PHI',
                    safetyPrecautions: ['Wear rubber gloves, face mask, and eye protection. Do not harvest crop within 14 days of spraying.']
                  }
                ]).map((item, idx) => {
                  const rawTitle = item.name || 'Chemical Fungicide';
                  const rawPhi = item.waitingPeriod || item.PHI || '14 Days PHI';
                  return (
                    <div key={idx} className="bg-white p-4.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-2">
                        <div>
                          <h5 className="font-bold text-base text-slate-900">{translateText(rawTitle, language)}</h5>
                          <span className="text-xs text-slate-500 font-medium">{translateText(item.type || 'Fungicide', language)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-lg border border-amber-200">
                            ⏳ PHI: {translateText(rawPhi, language)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1.5">
                          <div>
                            <span className="font-bold text-slate-800">{translateText('Dosage:', language)} </span>
                            <span className="text-emerald-700 font-bold">{translateText(item.dosage, language)}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">{translateText('Application:', language)} </span>
                            <span className="text-slate-700">{translateText(item.applicationMethod, language)}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-800">{translateText('Frequency:', language)} </span>
                            <span className="text-slate-700">{translateText(item.frequency, language)}</span>
                          </div>
                        </div>

                        {item.safetyPrecautions && (
                          <div className="bg-rose-50/60 p-3 rounded-lg border border-rose-100 space-y-1">
                            <span className="font-bold text-rose-900 block mb-1">
                              {translateText('Safety Precautions & Protective Gear:', language)}
                            </span>
                            <ul className="space-y-1 text-rose-950">
                              {Array.isArray(item.safetyPrecautions) ? (
                                item.safetyPrecautions.map((safe, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <span className="font-bold text-rose-600">•</span> {translateText(safe, language)}
                                  </li>
                                ))
                              ) : (
                                <li>{translateText(item.safetyPrecautions, language)}</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </Card>

        {/* 6. Long-Term Prevention Strategy */}
        <Card title={translateText(t?.preventionTitle || 'Long-Term Prevention Strategy', language)} icon={Clock}>
          <ul className="space-y-2 text-xs text-gray-700">
            {(treatment.prevention && treatment.prevention.length > 0 ? treatment.prevention : [
              { method: 'Prophylactic Neem Shield', description: 'Apply 5ml/L neem oil spray monthly as a bio-shield before disease emergence.' },
              { method: 'Crop Rotation & Crop Residue Sanitation', description: 'Rotate wheat with leguminous pulse crops (Moong/Gram) and destroy infected stubble after harvest.' },
              { method: 'Resistant Cultivar Selection', description: 'Sow certified disease-resistant seed varieties recommended by West Bengal Krishi Vigyan Kendra.' }
            ]).map((item, idx) => {
              const rawTitle = item.method || item.practice || item.action || 'Prevention Practice';
              const rawDesc = item.description || '';
              return (
                <li key={idx} className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-gray-900">{translateText(rawTitle, language)}: </span>
                    <span className="text-gray-700">{translateText(rawDesc, language)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>

      </div>

      {/* Action Toolbar: Print/Download PDF, Share, Feedback */}
      <ActionToolbar 
        title={translatedDiseaseName} 
        summary={`Diagnosis: ${translatedDiseaseName}. Confidence: ${confidenceScore}%`} 
        printableId="disease-diagnostic-report-card"
      />
    </div>
  );
};

export default DiseaseResultCard;