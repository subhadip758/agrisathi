const waterTranslations = {
  page: {
    en: {
      title:       "💧 Water Management System",
      subtitle:    "Manage water sources and get smart irrigation advice",
      tabSources:  "🚰 Water Source Management",
      tabAdvisory: "🌾 Irrigation Advisory",
    },
    hi: {
      title:       "💧 जल प्रबंधन प्रणाली",
      subtitle:    "जल स्रोतों का प्रबंधन करें और स्मार्ट सिंचाई सलाह प्राप्त करें",
      tabSources:  "🚰 जल स्रोत प्रबंधन",
      tabAdvisory: "🌾 सिंचाई परामर्श",
    },
    bn: {
      title:       "💧 জল ব্যবস্থাপনা সিস্টেম",
      subtitle:    "জলের উৎস পরিচালনা করুন এবং স্মার্ট সেচ পরামর্শ পান",
      tabSources:  "🚰 জলের উৎস ব্যবস্থাপনা",
      tabAdvisory: "🌾 সেচ পরামর্শ",
    },
  },

  // ─── WaterAdvisoryDashboard ──────────────────────────────────────────────
  advisory: {
    en: {
      title:              "💧 Water Advisory System",
      subtitle:           "Smart irrigation guidance for farmers",
      formTitle:          "🌾 Tell us about your field",

      // Form labels
      labelCropType:      "Crop Type",
      labelCropStage:     "Crop Stage",
      labelSoilType:      "Soil Type",
      labelDrainage:      "Water Drainage",
      labelMoisture:      "Soil Moisture",
      labelTemperature:   "Temperature (°C)",
      labelRainfall:      "Rainfall Today",

      // Crop type options
      cropRice:           "🌾 Rice",
      cropWheat:          "🌾 Wheat",
      cropMaize:          "🌽 Maize",
      cropCotton:         "🌸 Cotton",

      // Crop stage options
      stageSowing:        "🌱 Sowing",
      stageVegetative:    "🌿 Vegetative",
      stageFlowering:     "🌺 Flowering",
      stageFruiting:      "🍇 Fruiting",
      stageHarvest:       "🎉 Harvest",

      // Soil options
      soilSandy:          "🏖️ Sandy",
      soilLoam:           "🌍 Loam (Best)",
      soilClay:           "🪨 Clay",

      // Drainage options
      drainVeryFast:      "⚡ Very Fast",
      drainFast:          "🏃 Fast",
      drainNormal:        "👍 Normal",
      drainSlow:          "🐢 Slow",
      drainVerySlow:      "🐌 Very Slow",

      // Moisture options
      moistDry:           "🔥 Dry",
      moistSlightly:      "💧 Slightly Moist",
      moistWet:           "💦 Wet",
      moistWaterlogged:   "🌊 Waterlogged",

      // Rainfall options
      rainNone:           "☀️ None",
      rainLight:          "🌦️ Light",
      rainModerate:       "🌧️ Moderate",
      rainHeavy:          "⛈️ Heavy",

      // Buttons
      btnAnalyzing:       "⏳ Analyzing & Saving...",
      btnGetAdvice:       "💧 Calculate Water Advisory & Save",
      submitBtn:          "💧 Calculate Water Advisory & Save",
      loadingBtn:         "⏳ Analyzing & Saving...",

      // Error
      errorConnect:       "Cannot connect to server. Please try again.",

      // Result section
      waterQuantityLabel: "Water Quantity:",
      bestTimeLabel:      "Best Time:",
      whyAdvice:          "Why this advice?",
      alertsTitle:        "Important Alerts",

      // Charts
      chartSoilMoisture:  "Current Soil Moisture",
      chartWaterByStage:  "Water Need by Stage",
      chartWeeklyTrend:   "Weekly Irrigation Trend",
      chartBarDataset:    "Water Requirement (%)",
      chartLineDataset:   "Irrigation Need (%)",

      // Score card
      scoreTitle:         "Water Requirement Score",
      scoreSub:           "Based on your field conditions",
    },
    hi: {
      title:              "💧 जल परामर्श प्रणाली",
      subtitle:           "किसानों के लिए स्मार्ट सिंचाई मार्गदर्शन",
      formTitle:          "🌾 अपने खेत के बारे में बताएं",

      labelCropType:      "फसल का प्रकार",
      labelCropStage:     "फसल की अवस्था",
      labelSoilType:      "मिट्टी का प्रकार",
      labelDrainage:      "जल निकासी",
      labelMoisture:      "मिट्टी की नमी",
      labelTemperature:   "तापमान (°C)",
      labelRainfall:      "आज की वर्षा",

      cropRice:           "🌾 चावल",
      cropWheat:          "🌾 गेहूँ",
      cropMaize:          "🌽 मक्का",
      cropCotton:         "🌸 कपास",

      stageSowing:        "🌱 बुवाई",
      stageVegetative:    "🌿 वानस्पतिक",
      stageFlowering:     "🌺 फूल आना",
      stageFruiting:      "🍇 फल आना",
      stageHarvest:       "🎉 कटाई",

      soilSandy:          "🏖️ रेतीली",
      soilLoam:           "🌍 दोमट (सर्वोत्तम)",
      soilClay:           "🪨 चिकनी मिट्टी",

      drainVeryFast:      "⚡ बहुत तेज",
      drainFast:          "🏃 तेज",
      drainNormal:        "👍 सामान्य",
      drainSlow:          "🐢 धीमी",
      drainVerySlow:      "🐌 बहुत धीमी",

      moistDry:           "🔥 सूखी",
      moistSlightly:      "💧 थोड़ी नम",
      moistWet:           "💦 गीली",
      moistWaterlogged:   "🌊 जलभराव",

      rainNone:           "☀️ कोई नहीं",
      rainLight:          "🌦️ हल्की",
      rainModerate:       "🌧️ मध्यम",
      rainHeavy:          "⛈️ भारी",

      btnAnalyzing:       "⏳ विश्लेषण और सहेजा जा रहा है...",
      btnGetAdvice:       "💧 सिंचाई सलाह गणना करें और सहेजें",
      submitBtn:          "💧 सिंचाई सलाह गणना करें और सहेजें",
      loadingBtn:         "⏳ विश्लेषण और सहेजा जा रहा है...",

      errorConnect:       "सर्वर से कनेक्ट नहीं हो सका। कृपया पुनः प्रयास करें।",

      waterQuantityLabel: "पानी की मात्रा:",
      bestTimeLabel:      "सर्वोत्तम समय:",
      whyAdvice:          "यह सलाह क्यों?",
      alertsTitle:        "महत्वपूर्ण चेतावनियाँ",

      chartSoilMoisture:  "वर्तमान मिट्टी की नमी",
      chartWaterByStage:  "अवस्था के अनुसार जल आवश्यकता",
      chartWeeklyTrend:   "साप्ताहिक सिंचाई प्रवृत्ति",
      chartBarDataset:    "जल आवश्यकता (%)",
      chartLineDataset:   "सिंचाई आवश्यकता (%)",

      scoreTitle:         "जल आवश्यकता स्कोर",
      scoreSub:           "आपके खेत की स्थितियों के आधार पर",
    },
    bn: {
      title:              "💧 জল পরামর্শ সিস্টেম",
      subtitle:           "কৃষকদের জন্য স্মার্ট সেচ নির্দেশিকা",
      formTitle:          "🌾 আপনার মাঠ সম্পর্কে জানান",

      labelCropType:      "ফসলের ধরন",
      labelCropStage:     "ফসলের পর্যায়",
      labelSoilType:      "মাটির ধরন",
      labelDrainage:      "জল নিষ্কাশন",
      labelMoisture:      "মাটির আর্দ্রতা",
      labelTemperature:   "তাপমাত্রা (°C)",
      labelRainfall:      "আজকের বৃষ্টি",

      cropRice:           "🌾 ধান",
      cropWheat:          "🌾 গম",
      cropMaize:          "🌽 ভুট্টা",
      cropCotton:         "🌸 তুলা",

      stageSowing:        "🌱 বপন",
      stageVegetative:    "🌿 উদ্ভিজ্জ",
      stageFlowering:     "🌺 ফুল ধরা",
      stageFruiting:      "🍇 ফল ধরা",
      stageHarvest:       "🎉 ফসল কাটা",

      soilSandy:          "🏖️ বালুকাময়",
      soilLoam:           "🌍 দোআঁশ (সর্বোত্তম)",
      soilClay:           "🪨 এঁটেল মাটি",

      drainVeryFast:      "⚡ অত্যন্ত দ্রুত",
      drainFast:          "🏃 দ্রুত",
      drainNormal:        "👍 স্বাভাবিক",
      drainSlow:          "🐢 ধীর",
      drainVerySlow:      "🐌 অত্যন্ত ধীর",

      moistDry:           "🔥 শুষ্ক",
      moistSlightly:      "💧 সামান্য আর্দ্র",
      moistWet:           "💦 ভেজা",
      moistWaterlogged:   "🌊 জলাবদ্ধ",

      rainNone:           "☀️ কোনো বৃষ্টি নেই",
      rainLight:          "🌦️ হালকা",
      rainModerate:       "🌧️ মাঝারি",
      rainHeavy:          "⛈️ ভারী",

      btnAnalyzing:       "⏳ বিশ্লেষণ ও সংরক্ষণ করা হচ্ছে...",
      btnGetAdvice:       "💧 সেচ পরামর্শ গণনা ও সংরক্ষণ করুন",
      submitBtn:          "💧 সেচ পরামর্শ গণনা ও সংরক্ষণ করুন",
      loadingBtn:         "⏳ বিশ্লেষণ ও সংরক্ষণ করা হচ্ছে...",

      errorConnect:       "সার্ভারের সাথে সংযোগ করা যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।",

      waterQuantityLabel: "জলের পরিমাণ:",
      bestTimeLabel:      "সেরা সময়:",
      whyAdvice:          "এই পরামর্শ কেন?",
      alertsTitle:        "গুরুত্বপূর্ণ সতর্কতা",

      chartSoilMoisture:  "বর্তমান মাটির আর্দ্রতা",
      chartWaterByStage:  "পর্যায় অনুযায়ী জলের প্রয়োজন",
      chartWeeklyTrend:   "সাপ্তাহিক সেচ প্রবণতা",
      chartBarDataset:    "জলের প্রয়োজনীয়তা (%)",
      chartLineDataset:   "সেচ প্রয়োজনীয়তা (%)",

      scoreTitle:         "জলের প্রয়োজনীয়তার স্কোর",
      scoreSub:           "আপনার মাঠের অবস্থার উপর ভিত্তি করে",
    },
  },

  // ─── WaterSourceDashboard ────────────────────────────────────────────────
  source: {
    en: {
      title:                  "💧 Water Source Management",
      subtitle:               "Monitor and manage your water sources",
      btnAddSource:           "Add Water Source",
      loading:                "Loading...",
      errorLoad:              "Failed to load data",

      statTotalSources:       "Total Sources",
      statActive:             "Active",
      statTotalCapacity:      "Total Capacity",
      statAvailable:          "Available",
      stat30DayUsage:         "30-Day Usage",

      recTitle:               "Recommended Water Source",
      recScoreLabel:          "Recommendation Score:",

      chartByType:            "Sources by Type",
      chartAvailability:      "Availability Overview",
      chartAvailDataset:      "Availability %",

      thName:                 "Name",
      thType:                 "Type",
      thAvailability:         "Availability",
      thCost:                 "Cost",
      thSustainability:       "Sustainability",
      thStatus:               "Status",
      thActions:              "Actions",
      costFree:               "Free",
      tableTitle:             "Water Sources",

      tooltipRecordUsage:     "Record Usage",
      tooltipEdit:            "Edit",
      tooltipDelete:          "Delete",

      modalTitleAdd:          "Add Water Source",
      modalTitleEdit:         "Edit Water Source",
      labelSourceType:        "Source Type",
      labelName:              "Name",
      labelCapacity:          "Capacity (Liters)",
      labelCurrentAvail:      "Current Availability (Liters)",
      labelCostPerUnit:       "Cost per Unit (₹)",
      labelSustainRating:     "Sustainability Rating (1-5)",
      labelQualityRating:     "Quality Rating (1-5)",
      labelStatus:            "Status",
      labelNotes:             "Notes",
      btnAdd:                 "Add",
      btnUpdate:              "Update",
      btnCancel:              "Cancel",

      typeWell:               "Well",
      typeCanal:              "Canal",
      typeRainwater:          "Rainwater",
      typeTank:               "Tank",
      typeBorewell:           "Borewell",
      typePond:               "Pond",
      typeRiver:              "River",

      statusActive:           "Active",
      statusInactive:         "Inactive",
      statusMaintenance:      "Maintenance",

      confirmDelete:          "Are you sure you want to delete this water source?",
      alertOpFailed:          "Operation failed",
      alertDeleteFailed:      "Delete failed",
      alertUsageFailed:       "Failed to record usage",

      usageModalTitle:        "Record Water Usage",
      usageSourceLabel:       "Source:",
      labelAmountUsed:        "Amount Used (Liters)",
      labelPurpose:           "Purpose",
      purposeIrrigation:      "Irrigation",
      purposeLivestock:       "Livestock",
      purposeDomestic:        "Domestic",
      purposeOther:           "Other",
      btnRecord:              "Record",
    },
    hi: {
      title:                  "💧 जल स्रोत प्रबंधन",
      subtitle:               "अपने जल स्रोतों की निगरानी और प्रबंधन करें",
      btnAddSource:           "जल स्रोत जोड़ें",
      loading:                "लोड हो रहा है...",
      errorLoad:              "डेटा लोड करने में विफल",

      statTotalSources:       "कुल स्रोत",
      statActive:             "सक्रिय",
      statTotalCapacity:      "कुल क्षमता",
      statAvailable:          "उपलब्ध",
      stat30DayUsage:         "30-दिन का उपयोग",

      recTitle:               "अनुशंसित जल स्रोत",
      recScoreLabel:          "अनुशंसा स्कोर:",

      chartByType:            "प्रकार के अनुसार स्रोत",
      chartAvailability:      "उपलब्धता का अवलोकन",
      chartAvailDataset:      "उपलब्धता %",

      thName:                 "नाम",
      thType:                 "प्रकार",
      thAvailability:         "उपलब्धता",
      thCost:                 "लागत",
      thSustainability:       "स्थिरता",
      thStatus:               "स्थिति",
      thActions:              "कार्रवाई",
      costFree:               "निःशुल्क",
      tableTitle:             "जल स्रोत",

      tooltipRecordUsage:     "उपयोग दर्ज करें",
      tooltipEdit:            "संपादित करें",
      tooltipDelete:          "हटाएं",

      modalTitleAdd:          "जल स्रोत जोड़ें",
      modalTitleEdit:         "जल स्रोत संपादित करें",
      labelSourceType:        "स्रोत का प्रकार",
      labelName:              "नाम",
      labelCapacity:          "क्षमता (लीटर)",
      labelCurrentAvail:      "वर्तमान उपलब्धता (लीटर)",
      labelCostPerUnit:       "प्रति इकाई लागत (₹)",
      labelSustainRating:     "स्थिरता रेटिंग (1-5)",
      labelQualityRating:     "गुणवत्ता रेटिंग (1-5)",
      labelStatus:            "स्थिति",
      labelNotes:             "टिप्पणियाँ",
      btnAdd:                 "जोड़ें",
      btnUpdate:              "अपडेट करें",
      btnCancel:              "रद्द करें",

      typeWell:               "कुआँ",
      typeCanal:              "नहर",
      typeRainwater:          "वर्षा जल",
      typeTank:               "टंकी",
      typeBorewell:           "बोरवेल",
      typePond:               "तालाब",
      typeRiver:              "नदी",

      statusActive:           "सक्रिय",
      statusInactive:         "निष्क्रिय",
      statusMaintenance:      "रखरखाव",

      confirmDelete:          "क्या आप वाकई इस जल स्रोत को हटाना चाहते हैं?",
      alertOpFailed:          "ऑपरेशन विफल",
      alertDeleteFailed:      "हटाने में विफल",
      alertUsageFailed:       "उपयोग दर्ज करने में विफल",

      usageModalTitle:        "जल उपयोग दर्ज करें",
      usageSourceLabel:       "स्रोत:",
      labelAmountUsed:        "उपयोग की गई मात्रा (लीटर)",
      labelPurpose:           "उद्देश्य",
      purposeIrrigation:      "सिंचाई",
      purposeLivestock:       "पशुधन",
      purposeDomestic:        "घरेलू",
      purposeOther:           "अन्य",
      btnRecord:              "दर्ज करें",
    },
    bn: {
      title:                  "💧 জলের উৎস ব্যবস্থাপনা",
      subtitle:               "আপনার জলের উৎসগুলি পর্যবেক্ষণ ও পরিচালনা করুন",
      btnAddSource:           "জলের উৎস যোগ করুন",
      loading:                "লোড হচ্ছে...",
      errorLoad:              "ডেটা লোড করতে ব্যর্থ",

      statTotalSources:       "মোট উৎস",
      statActive:             "সক্রিয়",
      statTotalCapacity:      "মোট ধারণক্ষমতা",
      statAvailable:          "উপলব্ধ",
      stat30DayUsage:         "৩০ দিনের ব্যবহার",

      recTitle:               "প্রস্তাবিত জলের উৎস",
      recScoreLabel:          "প্রস্তাবনা স্কোর:",

      chartByType:            "ধরন অনুযায়ী উৎস",
      chartAvailability:      "উপলব্ধতার সংক্ষিপ্ত বিবরণ",
      chartAvailDataset:      "উপলব্ধতা %",

      thName:                 "নাম",
      thType:                 "ধরন",
      thAvailability:         "উপলব্ধতা",
      thCost:                 "খরচ",
      thSustainability:       "টেকসইতা",
      thStatus:               "অবস্থা",
      thActions:              "কার্যক্রম",
      costFree:               "বিনামূল্যে",
      tableTitle:             "জলের উৎস",

      tooltipRecordUsage:     "ব্যবহার রেকর্ড করুন",
      tooltipEdit:            "সম্পাদনা করুন",
      tooltipDelete:          "মুছুন",

      modalTitleAdd:          "জলের উৎস যোগ করুন",
      modalTitleEdit:         "জলের উৎস সম্পাদনা করুন",
      labelSourceType:        "উৎসের ধরন",
      labelName:              "নাম",
      labelCapacity:          "ধারণক্ষমতা (লিটার)",
      labelCurrentAvail:      "বর্তমান উপলব্ধতা (লিটার)",
      labelCostPerUnit:       "প্রতি একক খরচ (₹)",
      labelSustainRating:     "টেকসই রেটিং (১-৫)",
      labelQualityRating:     "মান রেটিং (১-৫)",
      labelStatus:            "অবস্থা",
      labelNotes:             "নোট",
      btnAdd:                 "যোগ করুন",
      btnUpdate:              "আপডেট করুন",
      btnCancel:              "বাতিল করুন",

      typeWell:               "কূপ",
      typeCanal:              "খাল",
      typeRainwater:          "বৃষ্টির জল",
      typeTank:               "ট্যাংক",
      typeBorewell:           "বোরওয়েল",
      typePond:               "পুকুর",
      typeRiver:              "নদী",

      statusActive:           "সক্রিয়",
      statusInactive:         "নিষ্ক্রিয়",
      statusMaintenance:      "রক্ষণাবেক্ষণ",

      confirmDelete:          "আপনি কি সত্যিই এই জলের উৎসটি মুছতে চান?",
      alertOpFailed:          "অপারেশন ব্যর্থ",
      alertDeleteFailed:      "মুছতে ব্যর্থ",
      alertUsageFailed:       "ব্যবহার রেকর্ড করতে ব্যর্থ",

      usageModalTitle:        "জল ব্যবহার রেকর্ড করুন",
      usageSourceLabel:       "উৎস:",
      labelAmountUsed:        "ব্যবহৃত পরিমাণ (লিটার)",
      labelPurpose:           "উদ্দেশ্য",
      purposeIrrigation:      "সেচ",
      purposeLivestock:       "পশুপালন",
      purposeDomestic:        "গৃহস্থালি",
      purposeOther:           "অন্যান্য",
      btnRecord:              "রেকর্ড করুন",
    },
  },
};

export default waterTranslations;