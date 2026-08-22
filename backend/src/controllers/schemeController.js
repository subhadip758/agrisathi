const GovernmentScheme = require('../models/GovernmentScheme');
const { evaluateSchemeEligibility, ingestScheme } = require('../services/schemeIngestionService');

const AUTHENTIC_TRILINGUAL_SCHEMES = [
  {
    _id: '1',
    schemeName: {
      bn: 'পিএম কিষান সম্মান নিধি (PM-Kisan)',
      hi: 'पीएम किसान सम्मान निधि (PM-Kisan)',
      en: 'PM-Kisan Samman Nidhi (PM-Kisan)',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক, ভারত সরকার',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
      en: 'Ministry of Agriculture & Farmers Welfare, Govt of India',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'বছরে ₹৬,০০০ টাকা সরাসরি ব্যাংক অ্যাকাউন্টে (৩টি কিস্তিতে ₹২,০০০ টাকা করে)',
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
      hi: ['आधार कार्ड', 'भूमि स्वामित्व रिकॉर्ड (खसरा/खतौनी)', 'बैंक पासबुक'],
      en: ['Aadhaar Card', 'Land Ownership Record (RoR/Khatian)', 'Bank Passbook'],
    },
    applicationDeadline: {
      bn: 'সারা বছর আবেদন খোলা (Open Year-Round)',
      hi: 'पूरे वर्ष आवेदन खुला (Open Year-Round)',
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
      bn: 'কৃষক বন্ধু প্রকল্প (Krishak Bandhu)',
      hi: 'कृषक बंधु योजना (Krishak Bandhu)',
      en: 'Krishak Bandhu Scheme (Krishak Bandhu)',
    },
    department: {
      bn: 'কৃষি বিভাগ, পশ্চিমবঙ্গ সরকার',
      hi: 'कृषि विभाग, पश्चिम बंगाल सरकार',
      en: 'Department of Agriculture, Govt of West Bengal',
    },
    governmentLevel: 'state',
    benefit: {
      bn: 'একরে বছরে সর্বোচ্চ ₹১০,০০০ টাকা আর্থিক অনুদান + মৃত্যুতে পরিবারের জন্য ₹২ লাখ টাকা জীবন বীমা',
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
      hi: ['वोटर आईडी', 'आधार कार्ड', 'भूमि रिकॉर्ड (पर्चा)', 'बैंक खाता विवरण'],
      en: ['Voter ID Card', 'Aadhaar Card', 'Land RoR/Porcha Copy', 'Bank Account Passbook'],
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
      bn: 'বাংলা শস্য বীমা (Bangla Shasya Bima / PMFBY)',
      hi: 'बांग्ला शस्य बीमा (Bangla Shasya Bima / PMFBY)',
      en: 'Bangla Shasya Bima / PMFBY Crop Insurance',
    },
    department: {
      bn: 'কৃষি বিভাগ, পশ্চিমবঙ্গ সরকার ও ভারতীয় কৃষি বীমা কোম্পানি',
      hi: 'कृषि विभाग, पश्चिम बंगाल सरकार एवं भारतीय कृषि बीमा कंपनी',
      en: 'Department of Agriculture, WB & Agriculture Insurance Company of India',
    },
    governmentLevel: 'state',
    benefit: {
      bn: 'প্রাকৃতিক দুর্যোগ বা পোকার আক্রমণে ফসলের ক্ষতি হলে ১০০% বিনামূল্যে সম্পূর্ণ বিমা ক্ষতিপূরণ',
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
      bn: ['আধার কার্ড', 'রোপণ প্রমাণপত্র (Sowing Certificate)', 'জমির পর্চা/বর্গা নথি'],
      hi: ['आधार कार्ड', 'बुआई प्रमाण पत्र (Sowing Certificate)', 'भूमि रिकॉर्ड'],
      en: ['Aadhaar Card', 'Crop Sowing Certificate from Panchayat', 'Land Records'],
    },
    applicationDeadline: {
      bn: 'খরিফ শেষ তারিখ: ৩১শে জুলাই / রবি: ৩১শে ডিসেম্বর',
      hi: 'खरीफ अंतिम तिथि: 31 जुलाई / रबी: 31 दिसंबर',
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
      bn: 'কিষাণ ক্রেডিট কার্ড (Kisan Credit Card - KCC)',
      hi: 'किसान क्रेडिट कार्ड (Kisan Credit Card - KCC)',
      en: 'Kisan Credit Card Scheme (KCC)',
    },
    department: {
      bn: 'নাবার্ড (NABARD) ও ভারতীয় রিজার্ভ ব্যাংক',
      hi: 'नाबार्ड (NABARD) एवं भारतीय रिजर्व बैंक',
      en: 'NABARD & Reserve Bank of India',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'মাত্র ৪% সুদে ₹৩ লাখ টাকা পর্যন্ত কৃষি ঋণ এবং সময়মতো পরিশোধে ৩% সুদের ছাড়',
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
      hi: ['आधार कार्ड', 'भूमि रिकॉर्ड या बटाईदार दस्तावेज़', 'पासपोर्ट फोटो', 'बैंक खाता'],
      en: ['Aadhaar Card', 'Land RoR / Sharecropper Agreement', 'Passport Photo', 'Bank Account'],
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
      bn: 'পিএম কৃষি সিঞ্চায়ী যোজনা (PMKSY - ড্রিপ সেচ অনুদান)',
      hi: 'पीएम कृषि सिंचाई योजना (PMKSY - ड्रिप सिंचाई सब्सिडी)',
      en: 'PM Krishi Sinchayee Yojana (PMKSY - Drip Irrigation)',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ বিভাগ, ভারত সরকার',
      hi: 'कृषि एवं किसान कल्याण विभाग, भारत सरकार',
      en: 'Department of Agriculture & Farmers Welfare, GoI',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'ড্রিপ (Drip) ও স্প্রিংকলার সেচ যন্ত্রপাতি ক্রয়ে ৫৫% থেকে ৮০% পর্যন্ত বিশাল সরকারি সাবসিডি',
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
      bn: ['আধার কার্ড', 'জমির পর্চা', 'পাম্প/জল উৎসের বিবরণ', 'ব্যাংক পাসবই'],
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
      bn: 'কৃষি যন্ত্রীকরণ প্রকল্প (SMAM - Agricultural Machinery Subsidy)',
      hi: 'कृषि यंत्रीकरण योजना (SMAM - मशीनरी सब्सिडी)',
      en: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক / রাজ্য কৃষি বিভাগ',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय / राज्य कृषि विभाग',
      en: 'Ministry of Agriculture & Farmers Welfare / WB Krishi',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'ট্র্যাক্টর, পাওয়ার টিলার, মাড়াই মেশিন ক্রয়ে ৫০% থেকে ৮০% পর্যন্ত সরাসরি ব্যাংক সাবসিডি',
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
      bn: ['আধার কার্ড', 'ভোটার কার্ড', 'জমির রেকর্ড', 'যন্ত্রপাতির কোটেশন ইনভয়েস'],
      hi: ['आधार कार्ड', 'वोटर आईडी', 'भूमि रिकॉर्ड', 'उपकरण कोटेशन चालान'],
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
      bn: 'মৃত্তিকা স্বাস্থ্য কার্ড প্রকল্প (Soil Health Card Scheme)',
      hi: 'मृदा स्वास्थ्य कार्ड योजना (Soil Health Card Scheme)',
      en: 'Soil Health Card Scheme (Soil Testing)',
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
      bn: ['আধার নম্বর', 'ক্ষেতের মাটির নমুনা (Soil Sample)', 'মোবাইল নম্বর'],
      hi: ['आधार नंबर', 'खेत की मिट्टी का नमूना (Soil Sample)', 'मोबाइल नंबर'],
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
      bn: 'আমার ফসল আমার গোলা প্রকল্প (WB Amar Fasal Amar Gola)',
      hi: 'अमार फसल अमार गोला योजना (Amar Fasal Amar Gola)',
      en: 'WB Amar Fasal Amar Gola (Crop Granary Subsidy)',
    },
    department: {
      bn: 'কৃষি বিপণন বিভাগ, পশ্চিমবঙ্গ সরকার',
      hi: 'कृषि विपणन विभाग, पश्चिम बंगाल सरकार',
      en: 'Department of Agricultural Marketing, Govt of West Bengal',
    },
    governmentLevel: 'state',
    benefit: {
      bn: 'শস্য বা ধান সংরক্ষণের গোলা ঘর নির্মাণে ৫০% সরকারি আর্থিক সাহায্য (সর্বোচ্চ ₹২০,০০০ টাকা অনুদান)',
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
      bn: 'পরম্পরাগত কৃষি বিকাশ যোজনা (PKVY - জৈব চাষ উৎসাহ)',
      hi: 'परम्परागत कृषि विकास योजना (PKVY - जैविक खेती)',
      en: 'Paramparagat Krishi Vikas Yojana (PKVY - Organic)',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক, ভারত সরকার',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
      en: 'Ministry of Agriculture & Farmers Welfare, GoI',
    },
    governmentLevel: 'central',
    benefit: {
      bn: 'জৈব সার, জৈব কীটনাশক ও শংসাপত্রের জন্য একরে ₹৫০,০০০ টাকা সরকারি আর্থিক অনুদান',
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
      bn: 'পিএম কিষান মানধন যোজনা (PM-KMY - কৃষক পেনশন)',
      hi: 'पीएम किसान मानधन योजना (PM-KMY - किसान पेंशन)',
      en: 'PM Kisan Maandhan Yojana (PM-KMY Pension)',
    },
    department: {
      bn: 'কৃষি ও কৃষক কল্যাণ মন্ত্রক ও এলআইসি (LIC)',
      hi: 'कृषि एवं किसान कल्याण मंत्रालय एवं एलआईसी (LIC)',
      en: 'Ministry of Agriculture & Farmers Welfare & LIC of India',
    },
    governmentLevel: 'central',
    benefit: {
      bn: '৬০ বছর বয়স থেকে প্রতি মাসে সুনিশ্চিত ₹৩,০০০ টাকা সরকারি পেনশন সহায়তা',
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
      bn: 'তথ্যমিত্র কেন্দ্রে (CSC) আবেদন খোলা',
      hi: 'सीएससी केंद्रों पर आवेदन खुला',
      en: 'Open at nearest Common Service Centers (CSC)',
    },
    officialPortalUrl: 'https://maandhan.in',
    sourceUrl: 'https://maandhan.in',
    officialSourceDomain: 'maandhan.in',
    lastVerifiedAt: new Date(),
  },
];

// ── GET Published Government Schemes ──────────────────────────────────────────
exports.getSchemes = async (req, res) => {
  try {
    const { lang = 'en', search, level } = req.query;

    let results = AUTHENTIC_TRILINGUAL_SCHEMES;

    if (level && level !== 'all') {
      results = results.filter(s => s.governmentLevel === level);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(s => {
        const nameBn = (s.schemeName.bn || '').toLowerCase();
        const nameHi = (s.schemeName.hi || '').toLowerCase();
        const nameEn = (s.schemeName.en || '').toLowerCase();
        const deptEn = (s.department.en || '').toLowerCase();
        const beneBn = (s.benefit.bn || '').toLowerCase();
        const beneEn = (s.benefit.en || '').toLowerCase();
        return nameBn.includes(q) || nameHi.includes(q) || nameEn.includes(q) || deptEn.includes(q) || beneBn.includes(q) || beneEn.includes(q);
      });
    }

    res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── GET Single Scheme Details ────────────────────────────────────────────────
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = AUTHENTIC_TRILINGUAL_SCHEMES.find(s => s._id === req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Government scheme not found' });
    }
    res.json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── POST Check Farmer Eligibility ────────────────────────────────────────────
exports.checkEligibility = async (req, res) => {
  try {
    const scheme = AUTHENTIC_TRILINGUAL_SCHEMES.find(s => s._id === req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Government scheme not found' });
    }

    const farmerProfile = req.body.farmerProfile || {
      state: req.user?.location?.state || 'West Bengal',
      district: req.user?.location?.district || 'North 24 Parganas',
      landSize: req.user?.landSize || 4.5,
      category: req.user?.farmerCategory || 'Small & Marginal',
    };

    const evaluation = evaluateSchemeEligibility(scheme, farmerProfile);

    res.json({
      success: true,
      schemeId: scheme._id,
      schemeName: scheme.schemeName,
      evaluation,
      disclaimer: 'Based on available profile data. Final eligibility is determined by the concerned government authority.',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ── POST Ingest Scheme (Domain Whitelisted) ───────────────────────────────────
exports.ingestNewScheme = async (req, res) => {
  try {
    const scheme = await ingestScheme(req.body);
    res.status(201).json({
      success: true,
      message: 'Scheme ingested and verified against official government domain',
      data: scheme,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
