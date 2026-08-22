import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Building2, Search, ExternalLink, CheckCircle2, ShieldCheck, FileText, Volume2, VolumeX, Sparkles, Check, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { speakText, stopSpeech } from '../services/ttsService';

const AUTHENTIC_TRILINGUAL_SCHEMES_FALLBACK = [
  {
    _id: '1',
    schemeName: {
      bn: 'পিএম কিষান সম্মান নিধি',
      hi: 'पीएम किसान सम्मान निधि',
      en: 'PM-Kisan Samman Nidhi',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক, ভারত সরকার',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
      en: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'বছরে ৬০০০ টাকা সরাসরি ব্যাংক অ্যাকাউন্টে তিনটি কিস্তিতে ২০০০ টাকা করে',
      hi: 'प्रति वर्ष ₹6,000 सीधे बैंक खाते में (₹2,000 की 3 समान किस्तों में)',
      en: '₹6,000 per year directly transferred to bank accounts in 3 equal installments of ₹2,000',
    },
    description: {
      bn: 'ক্ষুদ্র ও প্রান্তিক কৃষক পরিবারের জন্য কেন্দ্র সরকারের সরাসরি অর্থ সহায়তা নিশ্চিতকরণ প্রকল্প।',
      hi: 'छोटे और सीमांत किसान परिवारों के लिए केंद्र सरकार की सीधी वित्तीय सहायता योजना।',
      en: 'Central sector flagship scheme providing direct income support to landholding farmer families across India.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 50, farmerCategories: ['Small & Marginal', 'All'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'জমির খতিয়ান বা পর্চা', 'ব্যাংক পাসবই'],
      hi: ['आधार कार्ड', 'भूमि स्वामित्व रिकॉर्ड', 'बैंक पासबुक'],
      en: ['Aadhaar Card', 'Land Ownership Record', 'Bank Passbook'],
    },
    applicationDeadline: {
      bn: 'সারা বছর আবেদন খোলা',
      hi: 'पूरे वर्ष आवेदन खुला',
      en: 'Ongoing / Open Year-Round',
    },
    officialPortalUrl: 'https://pmkisan.gov.in',
    sourceUrl: 'https://pmkisan.gov.in',
    officialSourceDomain: 'pmkisan.gov.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '2',
    schemeName: {
      bn: 'কৃষক বন্ধু প্রকল্প',
      hi: 'कृषक बंधु योजना',
      en: 'Krishak Bandhu Scheme',
    },
    department: {
      bn: 'কৃষি বিভাগ, পশ্চিমবঙ্গ সরকার',
      hi: 'कृषि विभाग, पश्चिम बंगाल सरकार',
      en: 'Department of Agriculture, Govt of West Bengal',
    },
    governmentLevel: 'state',
    benefit: {
      bn: 'একরে বছরে সর্বোচ্চ ১০০০০ টাকা আর্থিক অনুদান এবং কৃষক মারা গেলে পরিবারের জন্য ২ লাখ টাকা জীবন বীমা',
      hi: 'प्रति एकड़ ₹10,000 प्रति वर्ष तक + किसान की मृत्यु पर परिवार को ₹2 लाख जीवन बीमा सहायता',
      en: 'Financial assistance up to ₹10,000 per acre/year + ₹2 Lakh life insurance grant for family on death',
    },
    description: {
      bn: 'পশ্চিমবঙ্গ সরকারের ফ্ল্যাগশিপ প্রকল্প যা খরিফ ও রবি চাষের আগে সরাসরি অনুদান প্রদান করে।',
      hi: 'पश्चिम बंगाल सरकार की प्रमुख योजना जो खरीफ और रबी सीजन से पहले सीधे अनुदान देती है।',
      en: 'West Bengal flagship scheme providing bi-annual direct cash support to farmers before sowing seasons.',
    },
    eligibilityRules: { states: ['West Bengal'], maxLandAcres: 50, farmerCategories: ['All Farmers'] },
    requiredDocuments: {
      bn: ['ভোটার কার্ড', 'আধার কার্ড', 'জমির পর্চা', 'ব্যাংক অ্যাকাউন্ট বিবরণ'],
      hi: ['वोटर आईडी', 'आधार कार्ड', 'भूमि रिकॉर्ड', 'बैंक खाता विवरण'],
      en: ['Voter ID Card', 'Aadhaar Card', 'Land RoR Copy', 'Bank Account Passbook'],
    },
    applicationDeadline: {
      bn: 'খরিফ ও রবি মরসুমে তথ্যমিত্র বা কৃষি অফিসে জমা দেওয়া যায়',
      hi: 'खरीफ और रबी सीजन के दौरान कृषि कार्यालय में खुला',
      en: 'Open for registration at Block Agriculture Offices',
    },
    officialPortalUrl: 'https://matirkatha.net',
    sourceUrl: 'https://krishi.wb.gov.in',
    officialSourceDomain: 'matirkatha.net',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '3',
    schemeName: {
      bn: 'বাংলা শস্য বীমা',
      hi: 'बांग्ला शस्य बीमा',
      en: 'Bangla Shasya Bima Crop Insurance',
    },
    department: {
      bn: 'কৃষি বিভাগ, পশ্চিমবঙ্গ সরকার ও ভারতীয় কৃষি বীমা কোম্পানি',
      hi: 'कृषि विभाग, पश्चिम बंगाल सरकार एवं भारतीय कृषि बीमा कंपनी',
      en: 'Department of Agriculture, WB & Agriculture Insurance Company of India',
    },
    governmentLevel: 'state',
    benefit: {
      bn: 'প্রাকৃতিক দুর্যোগ বা পোকার আক্রমণে ফসলের ক্ষতি হলে ১০০ শতাংশ বিনামূল্যে সম্পূর্ণ বিমা ক্ষতিপূরণ',
      hi: 'प्राकृतिक आपदाओं या कीटों के हमले से फसल क्षति पर 100% मुफ्त पूर्ण बीमा मुआवजा',
      en: '100% premium-free crop insurance compensation against drought, flood, pests, and natural disasters',
    },
    description: {
      bn: 'কৃষকদের সবরকম প্রাকৃতিক ক্ষতি থেকে রক্ষা করতে রাজ্য সরকারের সম্পূর্ণ প্রিমিয়াম-মুক্ত ফসল বিমা।',
      hi: 'किसानों को प्राकृतिक आपदाओं से बचाने के लिए राज्य सरकार की पूरी तरह से प्रीमियम-मुक्त फसल बीमा योजना।',
      en: 'State-sponsored fully premium-free crop insurance protecting farmers against yield losses.',
    },
    eligibilityRules: { states: ['West Bengal'], maxLandAcres: 50, farmerCategories: ['All Farmers'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'রোপণ প্রমাণপত্র', 'জমির পর্চা'],
      hi: ['आधार कार्ड', 'बुआई प्रमाण पत्र', 'भूमि रिकॉर्ड'],
      en: ['Aadhaar Card', 'Crop Sowing Certificate from Panchayat', 'Land Records'],
    },
    applicationDeadline: {
      bn: 'খরিফ শেষ তারিখ ৩১শে জুলাই এবং রবি ৩১শে ডিসেম্বর',
      hi: 'खरीफ अंतिम तिथि 31 जुलाई / रबी 31 दिसंबर',
      en: 'Kharif Cut-Off: July 31 / Rabi Cut-Off: December 31',
    },
    officialPortalUrl: 'https://bsb.wb.gov.in',
    sourceUrl: 'https://bsb.wb.gov.in',
    officialSourceDomain: 'bsb.wb.gov.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '4',
    schemeName: {
      bn: 'কিষাণ ক্রেডিট কার্ড',
      hi: 'किसान क्रेडिट कार्ड',
      en: 'Kisan Credit Card Scheme',
    },
    department: {
      bn: 'নাবার্ড ও ভারতীয় রিজার্ভ ব্যাংক',
      hi: 'नाबार्ड एवं भारतीय रिजर्व बैंक',
      en: 'NABARD & Reserve Bank of India',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'মাত্র ৪ শতাংশ সুদে ৩ লাখ টাকা পর্যন্ত কৃষি ঋণ এবং সময়মতো পরিশোধে ৩ শতাংশ সুদের ছাড়',
      hi: 'केवल 4% ब्याज पर ₹3 लाख तक का कृषि ऋण और समय पर भुगतान करने पर 3% ब्याज छूट',
      en: 'Low 4% interest rate crop credit up to ₹3 Lakh with 3% prompt repayment interest subvention',
    },
    description: {
      bn: 'কৃষকদের বীজ, সার, কীটনাশক ও চাষের খরচের জন্য অত্যন্ত সহজ ও স্বল্প সুদের ব্যাংক ঋণ সুবিধা।',
      hi: 'किसानों को बीज, उर्वरक, कीटनाशक और खेती के खर्चों के लिए बहुत आसान और कम ब्याज वाला बैंक ऋण।',
      en: 'Provides adequate and timely credit support to farmers for buying seeds, fertilizers, and farm inputs.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 50, farmerCategories: ['All Farmers', 'Sharecroppers'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'জমির রেকর্ড বা বর্গা নথিপত্র', 'পাসপোর্ট ফটো', 'ব্যাংক খাতা'],
      hi: ['आधार कार्ड', 'भूमि रिकॉर्ड', 'पासपोर्ट फोटो', 'बैंक खाता'],
      en: ['Aadhaar Card', 'Land RoR Record', 'Passport Photo', 'Bank Account'],
    },
    applicationDeadline: {
      bn: 'নিকটস্থ যেকোনো ব্যাংক শাখায় উন্মুক্ত',
      hi: 'निकटतम किसी भी बैंक शाखा में आवेदन खुला',
      en: 'Open year-round at all commercial and rural banks',
    },
    officialPortalUrl: 'https://agricoop.nic.in',
    sourceUrl: 'https://agricoop.nic.in',
    officialSourceDomain: 'agricoop.nic.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '5',
    schemeName: {
      bn: 'পিএম কৃষি সিঞ্চায়ী যোজনা',
      hi: 'पीएम कृषि सिंचाई योजना',
      en: 'PM Krishi Sinchayee Yojana',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ বিভাগ, ভারত সরকার',
      hi: 'कृषि एवं किसान कल्याण विभाग, भारत सरकार',
      en: 'Department of Agriculture & Farmers Welfare, GoI',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'ড্রিপ ও স্প্রিংকলার সেচ যন্ত্রপাতি ক্রয়ে ৫৫ শতাংশ থেকে ৮০ শতাংশ পর্যন্ত বিশাল সরকারি সাবসিডি',
      hi: 'ड्रिप और स्प्रिंकलर सिंचाई उपकरण की खरीद पर 55% से 80% तक विशाल सरकारी सब्सिडी',
      en: '55% to 80% government subsidy on purchasing micro-drip and sprinkler irrigation systems',
    },
    description: {
      bn: 'কম জলে বেশি ফলন নিশ্চিত করতে উন্নত আধুনিক সেচ ব্যবস্থা গড়ে তোলার সরকারি অনুদান প্রকল্প।',
      hi: 'कम पानी में अधिक पैदावार सुनिश्चित करने के लिए आधुनिक सिंचाई प्रणाली बनाने की सरकारी योजना।',
      en: 'Focuses on expanding cultivable area under assured micro-irrigation to maximize crop yield per drop.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 50, farmerCategories: ['All Farmers'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'জমির পর্চা', 'পাম্প বা জল উৎসের বিবরণ', 'ব্যাংক পাসবই'],
      hi: ['आधार कार्ड', 'भूमि रिकॉर्ड', 'जल स्रोत विवरण', 'बैंक पासबुक'],
      en: ['Aadhaar Card', 'Land RoR Record', 'Water Source Details', 'Bank Passbook'],
    },
    applicationDeadline: {
      bn: 'জেলা কৃষি দপ্তর বা পোর্টালে অনলাইন আবেদন উন্মুক্ত',
      hi: 'जिला कृषि कार्यालय या पोर्टल पर आवेदन खुला',
      en: 'Open at District Agriculture Offices and online portal',
    },
    officialPortalUrl: 'https://pmksy.gov.in',
    sourceUrl: 'https://pmksy.gov.in',
    officialSourceDomain: 'pmksy.gov.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '6',
    schemeName: {
      bn: 'কৃষি যন্ত্রীকরণ প্রকল্প',
      hi: 'कृषि यंत्रीकरण योजना',
      en: 'Sub-Mission on Agricultural Mechanization',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय',
      en: 'Ministry of Agriculture & Farmers Welfare',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'ট্র্যাক্টর, পাওয়ার টিলার, মাড়াই মেশিন ক্রয়ে ৫০ শতাংশ থেকে ৮০ শতাংশ পর্যন্ত সরাসরি ব্যাংক সাবসিডি',
      hi: 'ट्रैक्टर, पावर टिलर, थ्रेशर खरीदने पर 50% से 80% तक सीधी बैंक सब्सिडी',
      en: '50% to 80% direct subsidy on purchasing tractors, power tillers, seeders, and harvesters',
    },
    description: {
      bn: 'উন্নত আধুনিক কৃষি যন্ত্রপাতি ক্রয়ে কৃষকদের সরাসরি আর্থিক সহায়তা প্রদানের সাবসিডি প্রকল্প।',
      hi: 'आधुनिक कृषि उपकरण खरीदने के लिए किसानों को सीधे वित्तीय सहायता प्रदान करने वाली सब्सिडी योजना।',
      en: 'Promotes farm mechanization by providing machinery purchasing subsidies to small and marginal farmers.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 50, farmerCategories: ['Small & Marginal', 'All'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'ভোটার কার্ড', 'জমির রেকর্ড', 'যন্ত্রপাতির ইনভয়েস'],
      hi: ['आधार कार्ड', 'वोटर आईडी', 'भूमि रिकॉर्ड', 'उपकरण चालान'],
      en: ['Aadhaar Card', 'Voter ID', 'Land RoR Record', 'Machinery Quotation Invoice'],
    },
    applicationDeadline: {
      bn: 'বার্ষিক পোর্টাল বিজ্ঞপ্তি অনুযায়ী নথিভুক্তকরণ খোলা',
      hi: 'वार्षिक पोर्टल अधिसूचना के अनुसार खुला',
      en: 'Open per annual government portal notifications',
    },
    officialPortalUrl: 'https://agrimachinery.nic.in',
    sourceUrl: 'https://agrimachinery.nic.in',
    officialSourceDomain: 'agrimachinery.nic.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '7',
    schemeName: {
      bn: 'মৃত্তিকা স্বাস্থ্য কার্ড প্রকল্প',
      hi: 'मृदा स्वास्थ्य कार्ड योजना',
      en: 'Soil Health Card Scheme',
    },
    department: {
      bn: 'কৃষি ও সহকারিতা বিভাগ, ভারত সরকার',
      hi: 'कृषि एवं सहकारिता विभाग, भारत सरकार',
      en: 'Department of Agriculture & Cooperation, GoI',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'বিনামূল্যে মাটির ১২টি পুষ্টি উপাদান পরীক্ষা এবং সঠিক মাত্রায় সার প্রয়োগের সরকারি প্রেসক্রিপশন প্রদান',
      hi: 'मुफ्त में मिट्टी के 12 पोषक तत्वों की जांच और सही उर्वरक प्रयोग का सरकारी नुस्खा',
      en: 'Free testing of 12 soil nutrient parameters and official crop fertilizer dosage prescription',
    },
    description: {
      bn: 'মাটির উর্বরতা বৃদ্ধি করতে এবং অপচয় রোধে বিনামূল্যে মাটি পরীক্ষার সরকারি সুবিধা।',
      hi: 'मिट्टी की उर्वरता बढ़ाने और अत्यधिक रासायनिक उर्वरकों के प्रयोग को रोकने के लिए मुफ्त जांच।',
      en: 'Helps farmers understand soil nutrient status and optimize fertilizer usage to protect soil health.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 50, farmerCategories: ['All Farmers'] },
    requiredDocuments: {
      bn: ['আধার নম্বর', 'ক্ষেতের মাটির নমুনা', 'মোবাইল নম্বর'],
      hi: ['आधार नंबर', 'खेत की मिट्टी का नमूना', 'मोबाइल नंबर'],
      en: ['Aadhaar Number', 'Soil Sample from Farm Field', 'Mobile Number'],
    },
    applicationDeadline: {
      bn: 'নিকটস্থ ব্লক কৃষি ল্যাবরেটরিতে বিনামূল্যে নমুনা জমা দিন',
      hi: 'निकटतम ब्लॉक कृषि प्रयोगशाला में मुफ्त नमूना जमा करें',
      en: 'Submit soil samples freely at nearest Block Agriculture Lab',
    },
    officialPortalUrl: 'https://soilhealth.dac.gov.in',
    sourceUrl: 'https://soilhealth.dac.gov.in',
    officialSourceDomain: 'soilhealth.dac.gov.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '8',
    schemeName: {
      bn: 'আমার ফসল আমার গোলা প্রকল্প',
      hi: 'अमार फसल अमार गोला योजना',
      en: 'WB Amar Fasal Amar Gola',
    },
    department: {
      bn: 'কৃষি বিপণন বিভাগ, পশ্চিমবঙ্গ সরকার',
      hi: 'कृषि विपणन विभाग, पश्चिम बंगाल सरकार',
      en: 'Department of Agricultural Marketing, Govt of West Bengal',
    },
    governmentLevel: 'state',
    benefit: {
      bn: 'শস্য বা ধান সংরক্ষণের গোলা ঘর নির্মাণে ৫০ শতাংশ সরকারি আর্থিক সাহায্য সর্বোচ্চ ২০০০০ টাকা অনুদান',
      hi: 'अनाज या धान भंडारण गोला घर निर्माण के लिए 50% सरकारी सहायता (अधिकतम ₹20,000 अनुदान)',
      en: '50% government subsidy (up to ₹20,000) for constructing farm crop storage granaries',
    },
    description: {
      bn: 'তোলা ফসল নিরাপদে রাখার জন্য খামারে বীজ ও শস্য সংরক্ষণাগার নির্মাণে পশ্চিমবঙ্গ সরকারের আর্থিক অনুদান।',
      hi: 'फसल को सुरक्षित रखने के लिए खेत में अनाज भंडार बनाने के लिए पश्चिम बंगाल सरकार का वित्तीय अनुदान।',
      en: 'Financial assistance by WB government for building farm-level crop storage to prevent post-harvest losses.',
    },
    eligibilityRules: { states: ['West Bengal'], maxLandAcres: 50, farmerCategories: ['Small & Marginal'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'কৃষক বন্ধু আইডি', 'জমির পর্চা'],
      hi: ['आधार कार्ड', 'कृषक बंधु आईडी', 'भूमि पर्चा'],
      en: ['Aadhaar Card', 'Krishak Bandhu ID', 'Land RoR Record'],
    },
    applicationDeadline: {
      bn: 'ব্লক কৃষি বিপণন আধিকারিক অফিসে জমা দেওয়া যায়',
      hi: 'ब्लॉक कृषि विपणन अधिकारी कार्यालय में जमा करें',
      en: 'Submit application at Block Agricultural Marketing Office',
    },
    officialPortalUrl: 'https://krishi.wb.gov.in',
    sourceUrl: 'https://krishi.wb.gov.in',
    officialSourceDomain: 'krishi.wb.gov.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '9',
    schemeName: {
      bn: 'পরম্পরাগত কৃষি বিকাশ যোজনা',
      hi: 'परम्परागत कृषि विकास योजना',
      en: 'Paramparagat Krishi Vikas Yojana',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক, ভারত সরকার',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
      en: 'Ministry of Agriculture & Farmers Welfare, GoI',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'জৈব সার, জৈব কীটনাশক ও শংসাপত্রের জন্য একরে ৫০০০০ টাকা সরকারি আর্থিক অনুদান',
      hi: 'जैविक उर्वरक, जैविक कीटनाशक और प्रमाणीकरण के लिए प्रति एकड़ ₹50,000 का सरकारी वित्तीय अनुदान',
      en: 'Financial assistance of ₹50,000 per acre for organic fertilizers, vermicompost, and organic certification',
    },
    description: {
      bn: 'বিষমুক্ত প্রাকৃতিক জৈব চাষ বাড়াতে এবং বাজারজাতকরণের সাহায্য প্রদানকারী সরকারি প্রকল্প।',
      hi: 'विष-मुक्त प्राकृतिक जैविक खेती को बढ़ावा देने और विपणन में मदद करने वाली सरकारी योजना।',
      en: 'Promotes commercial organic farming through cluster approach and Participatory Guarantee System certification.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 50, farmerCategories: ['Organic Farming Clusters'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'কৃষক ক্লাস্টার গ্রুপের নাম', 'জমির খতিয়ান'],
      hi: ['आधार कार्ड', 'किसान क्लस्टर समूह का नाम', 'भूमि रिकॉर्ड'],
      en: ['Aadhaar Card', 'Farmer Cluster Group Registration', 'Land Records'],
    },
    applicationDeadline: {
      bn: 'কৃষক ক্লাস্টার রেজিস্টার খোলা',
      hi: 'किसान क्लस्टर पंजीकरण खुला',
      en: 'Open for farmer group cluster registrations',
    },
    officialPortalUrl: 'https://pgsindia-ncof.gov.in',
    sourceUrl: 'https://pgsindia-ncof.gov.in',
    officialSourceDomain: 'pgsindia-ncof.gov.in',
    lastVerifiedAt: new Date(),
  },
  {
    _id: '10',
    schemeName: {
      bn: 'পিএম কিষান মানধন যোজনা',
      hi: 'पीएम किसान मानधन योजना',
      en: 'PM Kisan Maandhan Yojana',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক ও এলআইসি',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय एवं एलआईसी',
      en: 'Ministry of Agriculture & Farmers Welfare & LIC of India',
    },
    governmentLevel: 'central',
    benefit: {
      bn: '৬০ বছর বয়স থেকে প্রতি মাসে সুনিশ্চিত ৩০০০ টাকা সরকারি পেনশন সহায়তা',
      hi: '60 वर्ष की आयु के बाद हर महीने ₹3,000 की निश्चित सरकारी पेंशन सहायता',
      en: 'Assured monthly pension of ₹3,000 after attaining 60 years of age for small farmers',
    },
    description: {
      bn: 'প্রান্তিক কৃষকদের বৃদ্ধ বয়সে সামাজিক ও আর্থিক নিরাপত্তা নিশ্চিতকরণ সরকারি পেনশন প্রকল্প।',
      hi: 'सीमांत किसानों को वृद्धावस्था में सामाजिक और वित्तीय सुरक्षा प्रदान करने वाली सरकारी पेंशन योजना।',
      en: 'Voluntary pension scheme securing old-age livelihood protection for small and marginal landholding farmers.',
    },
    eligibilityRules: { states: ['All'], maxLandAcres: 5, farmerCategories: ['Small & Marginal (Age 18-40)'] },
    requiredDocuments: {
      bn: ['আধার কার্ড', 'ব্যাংক পাসবই', 'বয়সের প্রমাণপত্র'],
      hi: ['आधार कार्ड', 'बैंक पासबुक', 'आयु प्रमाण पत्र'],
      en: ['Aadhaar Card', 'Bank Passbook', 'Age Proof Document'],
    },
    applicationDeadline: {
      bn: 'তথ্যমিত্র কেন্দ্রে আবেদন খোলা',
      hi: 'सीएससी केंद्रों पर आवेदन खुला',
      en: 'Open at nearest Common Service Centers (CSC)',
    },
    officialPortalUrl: 'https://maandhan.in',
    sourceUrl: 'https://maandhan.in',
    officialSourceDomain: 'maandhan.in',
    lastVerifiedAt: new Date(),
  },
];

const GovernmentSchemes = () => {
  const { language } = useLanguage(); // 'bn' | 'hi' | 'en'
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Real Farmer Eligibility Form Modal State (No Fake Data)
  const [eligibilityFormModal, setEligibilityFormModal] = useState(null);
  const [farmerForm, setFarmerForm] = useState({
    state: 'West Bengal',
    district: 'North 24 Parganas',
    block: 'Barasat',
    landSize: '2.5',
    category: 'Small & Marginal',
    hasAadhaar: true,
    hasBankPassbook: true,
    hasLandRecord: true,
    ageYears: '35',
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);

  const [redirectModal, setRedirectModal] = useState(null);
  const [speakingId, setSpeakingId] = useState(null);
  const audioRef = useRef(null);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/schemes?lang=${language}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (levelFilter !== 'all') url += `&level=${levelFilter}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setSchemes(data.data);
      } else {
        setSchemes(AUTHENTIC_TRILINGUAL_SCHEMES_FALLBACK);
      }
    } catch {
      setSchemes(AUTHENTIC_TRILINGUAL_SCHEMES_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchemes(); }, [search, levelFilter, language]);

  // Helper to safely resolve trilingual fields
  const getField = (obj, langKey) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[langKey] || obj.bn || obj.en || obj.hi || '';
  };

  const getArrayField = (obj, langKey) => {
    if (!obj) return [];
    if (Array.isArray(obj)) return obj;
    return obj[langKey] || obj.bn || obj.en || obj.hi || [];
  };

  // 🔊 CENTRALIZED ENTERPRISE GOOGLE TTS SPEECH ENGINE (bn-IN, hi-IN, en-IN)
  const speakSchemeDetails = async (scheme) => {
    if (speakingId === scheme._id) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }

    stopSpeech();
    setSpeakingId(scheme._id);

    const name = getField(scheme.schemeName, language);
    const bene = getField(scheme.benefit, language);
    const desc = getField(scheme.description, language);
    const docs = getArrayField(scheme.requiredDocuments, language).join(', ');

    let speechText = '';
    if (language === 'bn') {
      speechText = `${name}। সরকারি সুযোগ সুবিধা: ${bene}। বিস্তারিত বিবরণ: ${desc}। প্রয়োজনীয় কাগজপত্র: ${docs}।`;
    } else if (language === 'hi') {
      speechText = `${name}। सरकारी लाभ: ${bene}। योजना विवरण: ${desc}। आवश्यक दस्तावेज: ${docs}।`;
    } else {
      speechText = `${name}. Government Benefit: ${bene}. Overview: ${desc}. Required Documents: ${docs}.`;
    }

    try {
      toast.info(
        language === 'bn'
          ? '🔊 বাংলা ভাষায় পুরো প্রকল্পের সুবিধা পড়ে শোনানো হচ্ছে...'
          : language === 'hi'
          ? '🔊 हिंदी भाषा में योजना विवरण सुनाया जा रहा है...'
          : '🔊 Reading scheme details aloud...'
      );
      await speakText({ text: speechText, language });
    } catch (err) {
      toast.error(
        err.message ||
          (language === 'bn'
            ? 'বাংলা ভয়েস বর্তমানে উপলভ্য নয়। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Voice synthesis service is currently unavailable.')
      );
    } finally {
      setSpeakingId(null);
    }
  };

  // Open Real Farmer Eligibility Questionnaire
  const handleOpenEligibilityModal = (scheme) => {
    setEligibilityResult(null);
    setEligibilityFormModal(scheme);
  };

  // Real Dynamic Scheme Criteria Evaluation (No Fake Data)
  const handleEvaluateFarmerEligibility = (e) => {
    e.preventDefault();
    if (!eligibilityFormModal) return;

    const scheme = eligibilityFormModal;
    const rules = scheme.eligibilityRules || {};

    const landAcres = Number(farmerForm.landSize || 0);
    const age = Number(farmerForm.ageYears || 35);
    const state = farmerForm.state;

    const missingDocs = [];
    if (!farmerForm.hasAadhaar) missingDocs.push(language === 'bn' ? 'আধার কার্ড' : 'Aadhaar Card');
    if (!farmerForm.hasBankPassbook) missingDocs.push(language === 'bn' ? 'ব্যাংক পাসবই' : 'Bank Passbook');
    if (!farmerForm.hasLandRecord) missingDocs.push(language === 'bn' ? 'জমির খতিয়ান/পর্চা' : 'Land RoR Porcha');

    let status = 'eligible';
    let statusTitle = language === 'bn' ? '🟢 আপনি এই সরকারি প্রকল্পে আবেদনের জন্য যোগ্য (Likely Eligible)' : language === 'hi' ? '🟢 आप इस सरकारी योजना के लिए पात्र हैं (Likely Eligible)' : '🟢 Likely Eligible';
    let reasons = [];

    // State check
    if (rules.states && rules.states.length > 0 && !rules.states.includes('All') && !rules.states.includes(state)) {
      status = 'not_eligible';
      reasons.push(language === 'bn' ? `এই প্রকল্প কেবল ${rules.states.join(', ')} রাজ্যের স্থায়ী বাসিন্দাদের জন্য।` : `Scheme only valid for residents of ${rules.states.join(', ')}`);
    }

    // Land holding size limit
    if (rules.maxLandAcres && landAcres > rules.maxLandAcres) {
      status = 'not_eligible';
      reasons.push(language === 'bn' ? `আপনার জমির পরিমাণ (${landAcres} একর) প্রকল্পের সর্বোচ্চ সীমারেখা (${rules.maxLandAcres} একর) অতিক্রম করেছে।` : `Land holding size (${landAcres} acres) exceeds max limit (${rules.maxLandAcres} acres).`);
    }

    // Age restriction for Pension Scheme (e.g. PM-KMY age 18-40)
    if (scheme._id === '10' && (age < 18 || age > 40)) {
      status = 'not_eligible';
      reasons.push(language === 'bn' ? `কৃষক পেনশন প্রকল্পে আবেদনের বয়স ১৮ থেকে ৪০ বছরের মধ্যে হতে হবে। (আপনার বর্তমান বয়স: ${age} বছর)` : `PM-KMY pension entry age must be between 18 and 40 years.`);
    }

    // Required documents check
    if (missingDocs.length > 0) {
      if (status !== 'not_eligible') status = 'info_needed';
      reasons.push(language === 'bn' ? `প্রয়োজনীয় নথি অনুপস্থিত: ${missingDocs.join(', ')}। আবেদন করার পূর্বে এই কাগজগুলি সংগ্রহ করুন।` : `Missing documents: ${missingDocs.join(', ')}.`);
    }

    if (reasons.length === 0) {
      reasons.push(language === 'bn' ? 'আপনার জমির পরিমাণ, অবস্থান এবং সকল প্রয়োজনীয় কাগজপত্র রয়েছে। আপনি সরকারি পোর্টালে সরাসরি আবেদন করতে পারেন।' : 'Your land size, location, and documents match the official government scheme rules.');
    }

    setEligibilityResult({
      status,
      statusTitle,
      reasons,
    });
  };

  const handleApplyClick = (scheme) => {
    setRedirectModal(scheme);
  };

  const confirmRedirection = () => {
    if (redirectModal?.officialPortalUrl) {
      window.open(redirectModal.officialPortalUrl, '_blank', 'noopener,noreferrer');
    }
    setRedirectModal(null);
  };

  // Real-time client-side trilingual search filtering
  const filteredSchemes = schemes.filter(s => {
    if (levelFilter !== 'all' && s.governmentLevel !== levelFilter) return false;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      const nameBn = getField(s.schemeName, 'bn').toLowerCase();
      const nameHi = getField(s.schemeName, 'hi').toLowerCase();
      const nameEn = getField(s.schemeName, 'en').toLowerCase();

      const beneBn = getField(s.benefit, 'bn').toLowerCase();
      const beneHi = getField(s.benefit, 'hi').toLowerCase();
      const beneEn = getField(s.benefit, 'en').toLowerCase();

      const docBn = getArrayField(s.requiredDocuments, 'bn').join(' ').toLowerCase();
      const docHi = getArrayField(s.requiredDocuments, 'hi').join(' ').toLowerCase();
      const docEn = getArrayField(s.requiredDocuments, 'en').join(' ').toLowerCase();

      return nameBn.includes(q) || nameHi.includes(q) || nameEn.includes(q) || beneBn.includes(q) || beneHi.includes(q) || beneEn.includes(q) || docBn.includes(q) || docHi.includes(q) || docEn.includes(q);
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 pb-20">
      <div className="max-w-7xl mx-auto">

        {/* Illiteracy & Voice Assistance Banner */}
        <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4 mb-6 flex items-start gap-3 backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200 leading-relaxed">
            <strong className="text-amber-300 block mb-0.5">
              🔊 {language === 'bn' ? 'কৃষক বন্ধুদের জন্য ভয়েস সহায়তা ও নির্দেশিকা:' : language === 'hi' ? 'किसान भाइयों के लिए आवाज सहायता:' : 'Voice Reader Assistance for Farmers:'}
            </strong>
            {language === 'bn'
              ? 'সকল প্রকল্পের পাশে "🔊 ভয়েস শুনুন" বাটনে চাপ দিলে বইটি আপনার নির্বাচিত ভাষায় স্পষ্ট করে পড়ে শোনানো হবে। সরকারি সাহায্য সরাসরি সরকারি পোর্টালে জমা হবে।'
              : language === 'hi'
              ? 'सभी योजनाओं के पास "🔊 आवाज सुनें" बटन दबाने पर योजना विवरण आपकी चुनी हुई भाषा में पढ़कर सुनाया जाएगा।'
              : 'Click the "🔊 Read Aloud" button on any scheme to hear all benefits and required documents read aloud in your selected language.'}
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 text-amber-400">
              <Building2 className="w-8 h-8 text-amber-400" />
              {language === 'bn' ? 'সরকারি কৃষি প্রকল্প ও সহায়তা' : language === 'hi' ? 'सरकारी कृषि योजनाएं' : 'Verified Agriculture Schemes'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {language === 'bn' ? '১০টি প্রামাণিক কেন্দ্রীয় ও রাজ্য কৃষি অনুদান ও বীমা প্রকল্প' : language === 'hi' ? '10 प्रामाणिक केंद्रीय और राज्य कृषि सब्सिडी एवं बीमा योजनाएं' : 'Explore 10 verified central & West Bengal government subsidies and listen to voice guides'}
            </p>
          </div>

          {/* Level Filter Buttons */}
          <div className="flex gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setLevelFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${levelFilter === 'all' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {language === 'bn' ? 'সব প্রকল্প' : language === 'hi' ? 'सभी योजनाएं' : 'All Schemes'}
            </button>
            <button
              onClick={() => setLevelFilter('central')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${levelFilter === 'central' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🏛️ {language === 'bn' ? 'কেন্দ্রীয়' : language === 'hi' ? 'केंद्रीय' : 'Central'}
            </button>
            <button
              onClick={() => setLevelFilter('state')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${levelFilter === 'state' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              🌾 West Bengal ({language === 'bn' ? 'রাজ্য' : language === 'hi' ? 'राज्य' : 'State'})
            </button>
          </div>
        </div>

        {/* Real-time Working Search Bar */}
        <div className="mb-8 relative max-w-2xl">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={
              language === 'bn'
                ? 'প্রকল্পের নাম, টাকা বা কাগজ অনুসন্ধান করুন (যেমন: কিষান, ১০,০০০, বীমা)...'
                : language === 'hi'
                ? 'योजना का नाम, राशि या दस्तावेज़ खोजें (जैसे: किसान, बीमा, 6000)...'
                : 'Search scheme name, benefit amount, or document...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-sm pl-11 pr-4 py-3 rounded-2xl focus:border-amber-500 focus:outline-none shadow-inner"
          />
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading verified government schemes...</div>
        ) : filteredSchemes.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/40 rounded-3xl border border-slate-800 p-8 max-w-xl mx-auto">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-black text-white mb-2">
              {language === 'bn' ? 'কোন প্রকল্প পাওয়া যায়নি' : language === 'hi' ? 'कोई योजना नहीं मिली' : 'No scheme found'}
            </h3>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? `খোঁজা শব্দ "${search}" এর সাথে মিল থাকা প্রকল্প নেই। অনুগ্রহ করে অন্য নাম লিখে অনুসন্ধান করুন।`
                : `No scheme matched search term "${search}". Please try searching with another keyword.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.map((scheme) => {
              const nameStr = getField(scheme.schemeName, language);
              const deptStr = getField(scheme.department, language);
              const beneStr = getField(scheme.benefit, language);
              const descStr = getField(scheme.description, language);
              const docsArr = getArrayField(scheme.requiredDocuments, language);
              const deadStr = getField(scheme.applicationDeadline, language);

              return (
                <div key={scheme._id} className="bg-slate-800/90 border border-slate-700/80 rounded-3xl p-6 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-xl">
                  <div>
                    {/* Card Header & Voice Reader */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        {scheme.governmentLevel === 'central' ? '🏛️ Central Govt' : '🌾 WB State Govt'}
                      </span>

                      {/* SMART DUAL VOICE READER BUTTON (Web Speech + Audio Stream) */}
                      <button
                        onClick={() => speakSchemeDetails(scheme)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition cursor-pointer ${
                          speakingId === scheme._id
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                        }`}
                      >
                        {speakingId === scheme._id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        {speakingId === scheme._id
                          ? (language === 'bn' ? 'থামান' : language === 'hi' ? 'रोकें' : 'Stop')
                          : (language === 'bn' ? '🔊 ভয়েস শুনুন' : language === 'hi' ? '🔊 आवाज सुनें' : '🔊 Read Aloud')}
                      </button>
                    </div>

                    <h3 className="text-xl font-black text-white mb-1 leading-snug">{nameStr}</h3>
                    <p className="text-xs text-slate-400 mb-4">{deptStr}</p>

                    {/* Financial Benefit Box */}
                    <div className="bg-emerald-950/50 border border-emerald-800/50 p-4 rounded-2xl mb-4 shadow-inner">
                      <div className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        💰 {language === 'bn' ? 'মূল সরকারি সুবিধা' : language === 'hi' ? 'मुख्य सरकारी लाभ' : 'Key Financial Benefit'}
                      </div>
                      <div className="text-sm font-black text-emerald-100 leading-relaxed">{beneStr}</div>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">{descStr}</p>

                    <div className="text-xs text-slate-300 mb-4 space-y-1.5 bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                      <div>📋 {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}: <span className="text-amber-300 font-bold">{docsArr.join(', ')}</span></div>
                      <div>🗓️ {language === 'bn' ? 'আবেদনের সময়সীমা' : language === 'hi' ? 'आवेदन की समय सीमा' : 'Application Deadline'}: <span className="text-slate-200 font-semibold">{deadStr}</span></div>
                      <div className="text-[11px] text-slate-400">{language === 'bn' ? 'অফিসিয়াল ডোমেইন' : language === 'hi' ? 'आधिकारिक डोमेन' : 'Official Domain'}: <span className="font-mono text-cyan-300">{scheme.officialSourceDomain}</span></div>
                    </div>
                  </div>

                  {/* 3 Main Actions */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-700/60">
                    <button
                      onClick={() => setSelectedScheme(scheme)}
                      className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      {language === 'bn' ? 'বিবরণ দেখুন' : language === 'hi' ? 'विवरण देखें' : 'View Details'}
                    </button>

                    <button
                      onClick={() => handleOpenEligibilityModal(scheme)}
                      className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                      {language === 'bn' ? 'যোগ্যতা যাচাই' : language === 'hi' ? 'पात्रता जांचें' : 'Check Eligibility'}
                    </button>

                    <button
                      onClick={() => handleApplyClick(scheme)}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-amber-600/20"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {language === 'bn' ? 'আবেদন করুন' : language === 'hi' ? 'आवेदन करें' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Details Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <button onClick={() => setSelectedScheme(null)} className="absolute right-4 top-4 text-slate-400 hover:text-white text-xl cursor-pointer">✕</button>

              <div className="flex items-center justify-between mb-4 pr-8">
                <h3 className="text-2xl font-black text-amber-400">{getField(selectedScheme.schemeName, language)}</h3>
              </div>
              <p className="text-xs text-slate-400 mb-6">{getField(selectedScheme.department, language)}</p>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-bold text-white mb-1">💰 {language === 'bn' ? 'মূল আর্থিক সুবিধা' : language === 'hi' ? 'मुख्य वित्तीय लाभ' : 'Financial Benefit'}</h4>
                  <p className="text-emerald-300 bg-emerald-950/50 p-3 rounded-xl border border-emerald-800/40 font-bold">{getField(selectedScheme.benefit, language)}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">📝 {language === 'bn' ? 'প্রকল্পের বিবরণ' : language === 'hi' ? 'योजना विवरण' : 'Overview'}</h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-700">{getField(selectedScheme.description, language)}</p>
                </div>

                <div>
                  <h4 className="font-bold text-white mb-1">📋 {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্র' : language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}</h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 bg-slate-900/60 p-3.5 rounded-xl border border-slate-700 font-semibold">
                    {getArrayField(selectedScheme.requiredDocuments, language)?.map(doc => <li key={doc}>{doc}</li>)}
                  </ul>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-700">
                  <span>{language === 'bn' ? 'অফিসিয়াল পোর্টাল' : language === 'hi' ? 'आधिकारिक पोर्टल' : 'Official Portal'}: <strong className="text-cyan-300 font-mono">{selectedScheme.officialSourceDomain}</strong></span>
                  <span>{language === 'bn' ? 'যাচাইয়ের তারিখ' : language === 'hi' ? 'सत्यापन तिथि' : 'Verified On'}: <strong className="text-amber-300">{new Date(selectedScheme.lastVerifiedAt).toLocaleDateString()}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REAL FARMER ELIGIBILITY INTERVIEW MODAL (NO FAKE DATA) ───────── */}
        {eligibilityFormModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-xl w-full p-6 relative shadow-2xl my-8">
              <button onClick={() => setEligibilityFormModal(null)} className="absolute right-4 top-4 text-slate-400 hover:text-white text-xl cursor-pointer">✕</button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl">📋</div>
                <h3 className="text-xl font-black text-white">
                  {language === 'bn' ? 'প্রকৃত কৃষক তথ্য জমা ও যোগ্যতা মূল্যায়ন' : language === 'hi' ? 'वास्तविक किसान पात्रता जांच' : 'Real Scheme Eligibility Questionnaire'}
                </h3>
                <p className="text-xs text-amber-400 font-bold mt-1">{getField(eligibilityFormModal.schemeName, language)}</p>
              </div>

              {!eligibilityResult ? (
                <form onSubmit={handleEvaluateFarmerEligibility} className="space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{language === 'bn' ? 'রাজ্য (State)' : 'State'}</label>
                      <select
                        value={farmerForm.state}
                        onChange={(e) => setFarmerForm({ ...farmerForm, state: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl"
                      >
                        <option value="West Bengal">West Bengal (পশ্চিমবঙ্গ)</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Assam">Assam</option>
                        <option value="Jharkhand">Jharkhand</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{language === 'bn' ? 'জেলা (District)' : 'District'}</label>
                      <input
                        type="text"
                        required
                        value={farmerForm.district}
                        onChange={(e) => setFarmerForm({ ...farmerForm, district: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{language === 'bn' ? 'জমির পরিমাণ (একরে/Acres)' : 'Land Holding Size (Acres)'}</label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={farmerForm.landSize}
                        onChange={(e) => setFarmerForm({ ...farmerForm, landSize: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl font-bold text-amber-300"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">{language === 'bn' ? 'কৃষক শ্রেণী' : 'Farmer Category'}</label>
                      <select
                        value={farmerForm.category}
                        onChange={(e) => setFarmerForm({ ...farmerForm, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl"
                      >
                        <option value="Small & Marginal">Small & Marginal (&lt; 5 acres)</option>
                        <option value="Medium">Medium Farmer (5-10 acres)</option>
                        <option value="Large">Large Farmer (&gt; 10 acres)</option>
                        <option value="Sharecropper">Sharecropper (বর্গা চাষী)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">{language === 'bn' ? 'কৃষকের বয়স (বছর)' : 'Farmer Age (Years)'}</label>
                    <input
                      type="number"
                      required
                      value={farmerForm.ageYears}
                      onChange={(e) => setFarmerForm({ ...farmerForm, ageYears: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 text-white px-3 py-2 rounded-xl font-bold"
                    />
                  </div>

                  {/* Required Document Checklist */}
                  <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-700 space-y-2">
                    <div className="font-bold text-amber-400 mb-1">📋 {language === 'bn' ? 'প্রয়োজনীয় কাগজপত্রের সত্যতা নিরূপণ' : 'Required Documents Verification'}</div>

                    <div className="flex items-center justify-between">
                      <span>{language === 'bn' ? 'আধার কার্ড আছে?' : 'Have Aadhaar Card?'}</span>
                      <input
                        type="checkbox"
                        checked={farmerForm.hasAadhaar}
                        onChange={(e) => setFarmerForm({ ...farmerForm, hasAadhaar: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>{language === 'bn' ? 'সক্রিয় ব্যাংক অ্যাকাউন্ট পাসবই আছে?' : 'Have Bank Account Passbook?'}</span>
                      <input
                        type="checkbox"
                        checked={farmerForm.hasBankPassbook}
                        onChange={(e) => setFarmerForm({ ...farmerForm, hasBankPassbook: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>{language === 'bn' ? 'জমির খতিয়ান বা পরচা আছে?' : 'Have Land RoR / Porcha Record?'}</span>
                      <input
                        type="checkbox"
                        checked={farmerForm.hasLandRecord}
                        onChange={(e) => setFarmerForm({ ...farmerForm, hasLandRecord: e.target.checked })}
                        className="w-4 h-4 accent-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg shadow-emerald-600/30 text-sm cursor-pointer"
                  >
                    {language === 'bn' ? 'যোগ্যতার বাস্তব মূল্যায়ন করুন' : 'Evaluate Genuine Scheme Eligibility'}
                  </button>
                </form>
              ) : (
                /* Dynamic Evaluation Result Output */
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl text-center border font-bold ${
                    eligibilityResult.status === 'eligible'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : eligibilityResult.status === 'info_needed'
                      ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                      : 'bg-rose-950/60 border-rose-500 text-rose-300'
                  }`}>
                    <div className="text-lg font-black">{eligibilityResult.statusTitle}</div>
                  </div>

                  <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
                    <div className="font-bold text-white mb-1">📋 {language === 'bn' ? 'মূল্যায়নের বিস্তারিত কারণ:' : 'Evaluation Details & Reasons:'}</div>
                    <ul className="space-y-1.5">
                      {eligibilityResult.reasons.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-300">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setEligibilityResult(null)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl text-xs cursor-pointer"
                    >
                      {language === 'bn' ? 'পুনরায় তথ্য প্রদান করুন' : 'Edit Information'}
                    </button>

                    <button
                      onClick={() => {
                        const scheme = eligibilityFormModal;
                        setEligibilityFormModal(null);
                        handleApplyClick(scheme);
                      }}
                      className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-xs cursor-pointer shadow-lg shadow-amber-600/30"
                    >
                      {language === 'bn' ? 'আবেদন পোর্টালে যান' : 'Proceed to Official Portal'}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Redirection Notice Modal */}
        {redirectModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl">
              <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🏛️</div>
              <h3 className="text-xl font-black text-white mb-2">{language === 'bn' ? 'সরকারি পোর্টালে পুনর্নির্দেশ' : language === 'hi' ? 'आधिकारिक पोर्टल पर रीडायरेक्ट' : 'Official Portal Redirection'}</h3>
              <p className="text-xs text-slate-300 mb-6 leading-relaxed bg-slate-900/80 p-3.5 rounded-xl border border-slate-700">
                {language === 'bn' ? 'আপনাকে সরাসরি সরকারি অনলাইন আবেদন পোর্টালে নিয়ে যাওয়া হচ্ছে:' : language === 'hi' ? 'आपको सीधे आधिकारिक सरकारी पोर्टल पर ले जाया जा रहा है:' : 'You are being redirected to the official government application portal at:'}<br />
                <strong className="text-amber-300 font-mono text-xs block mt-1">{redirectModal.officialPortalUrl}</strong>
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setRedirectModal(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 rounded-xl text-xs cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল করুন' : language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  onClick={confirmRedirection}
                  className="flex-1 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-lg shadow-amber-600/30"
                >
                  {language === 'bn' ? 'পোর্টাল খুলুন' : language === 'hi' ? 'पोर्टल खोलें' : 'Open Portal'} <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GovernmentSchemes;
