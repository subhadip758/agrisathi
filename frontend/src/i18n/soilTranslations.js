// ─── AgriSathi Soil Analysis Translations ──────────────────────────────────
// Covers: SoilAnalysisPage.jsx, SoilAnalysisForm.jsx, SoilResultCard.jsx

const soilTranslations = {

    /* ══════════════════════════════════════════════════════════════════
       ENGLISH
    ══════════════════════════════════════════════════════════════════ */
    en: {
      page: {
        title:        '🌾 Soil Health Analysis',
        subtitle:     'AI-powered · No lab test needed',
        newTest:      '📝 New Test',
        history:      '📜 History',
        newTestBtn:   '← New Test',
        pastAnalyses: '📜 Your Past Analyses',
        noHistory:    'No analyses performed yet',
        firstTest:    'Perform First Test',
        recentTitle:  '🕒 Recent Analyses',
        noHistoryYet: 'No history yet',
        viewAll:      'View All',
        statsTitle:   '📊 Statistics',
        totalTests:   'Total Tests',
        avgScore:     'Average Score',
        goodSoil:     'Good Soil',
        helpTitle:    '❓ Need Help?',
        helpDesc:     'Contact us for any questions',
        helpline:     '📞 Helpline',
        defFound:     'deficiencies found',
        viewDetails:  'View Details →',
        footer: {
          aiPowered:    'AI-Powered',
          aiDesc:       'Rules based on agricultural science',
          instant:      'Instant Results',
          instantDesc:  'No need for lab tests',
          free:         'Free Service',
          freeDesc:     'Unlimited analyses',
          madeFor:      'Made for Farmers 🇮🇳',
          rights:       '© 2026 Urban Farming Platform. All rights reserved.',
        },
        health: {
          GOOD:   '✅ Good',
          MEDIUM: '⚠️ Medium',
          POOR:   '❌ Poor',
        },
      },
  
      form: {
        title:        '🌾 Soil Health Check',
        subtitle:     'Soil Health Analysis (No Lab Test Required)',
        hint:         'Select observations you notice in your field',
        stepLabel:    'Step',
        of:           '/',
        complete:     '% Complete',
        answerAll:    'Please answer all questions to continue',
        recorded:     '✓ Recorded',
        previous:     '⬅️ Previous',
        next:         'Next ➡️',
        analysing:    '⏳ Analysing...',
        startAnalysis:'✅ Start Analysis',
        selectAnswer: '— Select an answer —',
        error:        'Analysis failed. Please try again.',
        tip:          '💡 Tip: To provide accurate information, carefully observe your plants and soil in the field. If unsure about a question, select the closest option.',
  
        steps: [
          {
            id: 'basic', title: 'Basic Farm Info', icon: '🗺️',
            questions: [
              {
                key: 'soilType', label: 'What type of soil is on your land?',
                options: ['Sandy', 'Clay', 'Loamy', 'Black soil', 'Red soil', 'Not sure'],
              },
              {
                key: 'soilColor', label: 'What color is your soil?',
                options: ['Dark black', 'Reddish', 'Yellowish', 'Light brown'],
              },
              {
                key: 'yearsOfCultivation', label: 'How many years have you been farming this land?',
                options: ['Less than 2 years', '2–5 years', '5–10 years', 'More than 10 years'],
              },
              {
                key: 'landSize', label: 'Land size',
                options: ['Less than 1 acre', '1–3 acres', '3–5 acres', 'More than 5 acres'],
              },
            ],
          },
          {
            id: 'crop', title: 'Crop History', icon: '🌾',
            questions: [
              {
                key: 'lastSeasonCrop', label: 'What crop did you grow last season?',
                options: ['Rice/Paddy', 'Wheat', 'Maize/Corn', 'Cotton', 'Sugarcane', 'Vegetables', 'Pulses/Legumes', 'Oilseeds', 'Other'],
              },
              {
                key: 'cropRotation', label: 'Do you practice crop rotation?',
                options: ['Yes, regularly', 'Sometimes', 'No'],
              },
              {
                key: 'leguminousCrop', label: 'Have you grown any leguminous crop recently? (e.g., dal, groundnut, soybean)',
                options: ['Yes, in last season', 'Yes, 2–3 seasons ago', 'No, not recently'],
              },
            ],
          },
          {
            id: 'fertilizer', title: 'Fertilizer Usage', icon: '🧪',
            questions: [
              {
                key: 'ureaUsed', label: 'How much Urea do you typically use per acre?',
                options: ['None', 'Less than 25 kg', '25–50 kg', '50–75 kg', '75–100 kg', 'More than 100 kg'],
              },
              {
                key: 'dapUsed', label: 'Do you use DAP (Di-Ammonium Phosphate)?',
                options: ['Yes, regularly', 'Sometimes', 'No'],
              },
              {
                key: 'mopUsed', label: 'Do you use MOP (Muriate of Potash)?',
                options: ['Yes, regularly', 'Sometimes', 'No'],
              },
              {
                key: 'organicManure', label: 'Do you use organic manure? (FYM, compost, vermicompost)',
                options: ['Yes, FYM (Farm Yard Manure)', 'Yes, compost', 'Yes, vermicompost', 'No organic manure'],
              },
            ],
          },
          {
            id: 'water', title: 'Irrigation & Water', icon: '💧',
            questions: [
              {
                key: 'irrigationType', label: 'What irrigation method do you use?',
                options: ['Rainfed (no irrigation)', 'Canal irrigation', 'Borewell', 'Drip irrigation', 'Mixed methods'],
              },
              {
                key: 'floodIrrigation', label: 'Do you practice flood irrigation?',
                options: ['Yes, always', 'Sometimes', 'No'],
              },
              {
                key: 'drainage', label: 'How is the drainage condition of your field?',
                options: ['Good – water drains quickly', 'Moderate – drains in a few hours', 'Poor – water stagnates'],
              },
              {
                key: 'waterSalinity', label: 'Have you noticed white salt deposits or salinity issues in the water or soil?',
                options: ['Yes, visible white crust on soil', 'Sometimes after irrigation', 'No issues observed'],
              },
            ],
          },
          {
            id: 'symptoms', title: 'Crop Symptoms', icon: '🔍',
            questions: [
              {
                key: 'yellowingLeaves', label: 'Do your crops show yellowing leaves?',
                options: ['Yes, young leaves are yellow', 'Yes, old/lower leaves are yellow', 'No yellowing observed'],
              },
              {
                key: 'stemGrowth', label: "How is your crop's stem strength and growth?",
                options: ['Weak, plants fall over easily', 'Moderate growth', 'Strong and healthy'],
              },
              {
                key: 'flowering', label: 'How is flowering and fruiting?',
                options: ['Poor flowering / fruit drop', 'Average', 'Good flowering and fruiting'],
              },
              {
                key: 'soilHardness', label: 'Does soil become hard or crack after irrigation?',
                options: ['Yes, very hard crust forms', 'Slightly hard', 'No, remains loose'],
              },
              {
                key: 'cropYield', label: 'How was your crop yield last season?',
                options: ['Poor – much lower than expected', 'Average – as expected', 'Good – higher than expected'],
              },
            ],
          },
        ],
      },
  
      result: {
        reportTitle:  '🌾 Soil Health Report',
        printBtn:     '🖨️ Print / Download PDF',
        printTitle:   '🌾 Soil Health Analysis Report',
        generatedOn:  'Generated on',
  
        healthLabels: {
          GOOD:   '✅ Good Soil',
          MEDIUM: '⚠️ Medium Soil',
          POOR:   '❌ Poor Soil',
        },
  
        tabs: {
          summary:     '📋 Summary',
          nutrients:   '🧪 Nutrients',
          fertilizers: '🌱 Fertilizers',
          crops:       '🌾 Crops',
          plan:        '📅 Plan',
        },
  
        summary: {
          nitrogen:          'Nitrogen (N)',
          phosphorus:        'Phosphorus (P)',
          potassium:         'Potassium (K)',
          nDesc:             'For leaf greenness',
          pDesc:             'For root and flower development',
          kDesc:             'For strength and drought resistance',
          soilProps:         '🏔️ Soil Properties',
          phLevel:           'pH Level',
          texture:           'Texture',
          organicMatter:     'Organic Matter',
          waterCapacity:     'Water Holding Capacity',
          defFound:          '⚠️ Deficiencies Found',
          severe:            'Severe',
          moderate:          'Moderate',
        },
  
        nutrients: {
          level:        'Level',
          importance:   'Importance:',
          nImportance:  'Essential for leaf greenness and plant growth',
          pImportance:  'Important for root development, flowering and fruiting',
          kImportance:  'Helps strengthen plant and resist drought and disease',
        },
  
        fertilizers: {
          tip:          '💡 Choose fertilizers below as per your convenience. No need to apply all together.',
          highPriority: '🔴 High Priority',
          normalPriority:'🟡 Normal Priority',
          quantity:     '📦 Quantity',
          timing:       '⏰ Timing',
          cost:         '💰 Cost',
        },
  
        crops: {
          highlyRecommended: '⭐ Highly Suitable Crops',
          recommended:       '✅ Suitable Crops',
          possibleWithCare:  '⚠️ Possible With Care',
          reason:            'Reason:',
        },
  
        plan: {
          immediate:    '🚨 Immediate Actions (0-2 weeks)',
          shortTerm:    '📅 Short Term Actions (2-3 months)',
          longTerm:     '🌱 Long Term Improvements (6+ months)',
          benefit:      'Benefit:',
        },
  
        levels: { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' },
      },
    },
  
    /* ══════════════════════════════════════════════════════════════════
       HINDI
    ══════════════════════════════════════════════════════════════════ */
    hi: {
      page: {
        title:        '🌾 मिट्टी स्वास्थ्य विश्लेषण',
        subtitle:     'AI-संचालित · कोई लैब परीक्षण जरूरी नहीं',
        newTest:      '📝 नया परीक्षण',
        history:      '📜 इतिहास',
        newTestBtn:   '← नया परीक्षण',
        pastAnalyses: '📜 आपके पिछले विश्लेषण',
        noHistory:    'अभी तक कोई विश्लेषण नहीं किया गया',
        firstTest:    'पहला परीक्षण करें',
        recentTitle:  '🕒 हाल के विश्लेषण',
        noHistoryYet: 'अभी तक कोई इतिहास नहीं',
        viewAll:      'सभी देखें',
        statsTitle:   '📊 आँकड़े',
        totalTests:   'कुल परीक्षण',
        avgScore:     'औसत स्कोर',
        goodSoil:     'अच्छी मिट्टी',
        helpTitle:    '❓ सहायता चाहिए?',
        helpDesc:     'किसी भी प्रश्न के लिए हमसे संपर्क करें',
        helpline:     '📞 हेल्पलाइन',
        defFound:     'कमियां मिलीं',
        viewDetails:  'विवरण देखें →',
        footer: {
          aiPowered:    'AI-संचालित',
          aiDesc:       'कृषि विज्ञान पर आधारित नियम',
          instant:      'तत्काल परिणाम',
          instantDesc:  'लैब परीक्षण की जरूरत नहीं',
          free:         'मुफ्त सेवा',
          freeDesc:     'असीमित विश्लेषण',
          madeFor:      'किसानों के लिए बनाया गया 🇮🇳',
          rights:       '© 2026 Urban Farming Platform. सर्वाधिकार सुरक्षित।',
        },
        health: {
          GOOD:   '✅ अच्छा',
          MEDIUM: '⚠️ मध्यम',
          POOR:   '❌ खराब',
        },
      },
  
      form: {
        title:        '🌾 मिट्टी स्वास्थ्य जांच',
        subtitle:     'मिट्टी स्वास्थ्य विश्लेषण (बिना लैब परीक्षण के)',
        hint:         'अपने खेत में जो निगरानी करते हैं वह चुनें',
        stepLabel:    'चरण',
        of:           '/',
        complete:     '% पूर्ण',
        answerAll:    'जारी रखने के लिए सभी प्रश्नों के उत्तर दें',
        recorded:     '✓ दर्ज किया गया',
        previous:     '⬅️ पिछला',
        next:         'अगला ➡️',
        analysing:    '⏳ विश्लेषण हो रहा है...',
        startAnalysis:'✅ विश्लेषण शुरू करें',
        selectAnswer: '— उत्तर चुनें —',
        error:        'विश्लेषण विफल। कृपया पुनः प्रयास करें।',
        tip:          '💡 सुझाव: सटीक जानकारी देने के लिए अपने पौधों और मिट्टी को खेत में ध्यान से देखें। किसी प्रश्न के बारे में अनिश्चित हों तो निकटतम विकल्प चुनें।',
  
        steps: [
          {
            id: 'basic', title: 'खेत की बुनियादी जानकारी', icon: '🗺️',
            questions: [
              {
                key: 'soilType', label: 'आपकी जमीन पर किस प्रकार की मिट्टी है?',
                options: ['बलुई', 'चिकनी मिट्टी', 'दोमट', 'काली मिट्टी', 'लाल मिट्टी', 'पता नहीं'],
              },
              {
                key: 'soilColor', label: 'आपकी मिट्टी का रंग क्या है?',
                options: ['गहरा काला', 'लाल रंग', 'पीलापन', 'हल्का भूरा'],
              },
              {
                key: 'yearsOfCultivation', label: 'आप इस जमीन पर कितने वर्षों से खेती कर रहे हैं?',
                options: ['2 साल से कम', '2–5 साल', '5–10 साल', '10 साल से अधिक'],
              },
              {
                key: 'landSize', label: 'जमीन का आकार',
                options: ['1 एकड़ से कम', '1–3 एकड़', '3–5 एकड़', '5 एकड़ से अधिक'],
              },
            ],
          },
          {
            id: 'crop', title: 'फसल इतिहास', icon: '🌾',
            questions: [
              {
                key: 'lastSeasonCrop', label: 'पिछले मौसम में आपने कौन सी फसल उगाई?',
                options: ['चावल/धान', 'गेहूं', 'मक्का', 'कपास', 'गन्ना', 'सब्जियां', 'दालें/फलियां', 'तिलहन', 'अन्य'],
              },
              {
                key: 'cropRotation', label: 'क्या आप फसल चक्र का अभ्यास करते हैं?',
                options: ['हाँ, नियमित रूप से', 'कभी-कभी', 'नहीं'],
              },
              {
                key: 'leguminousCrop', label: 'क्या आपने हाल ही में कोई फलीदार फसल उगाई है? (जैसे दाल, मूंगफली, सोयाबीन)',
                options: ['हाँ, पिछले मौसम में', 'हाँ, 2–3 मौसम पहले', 'नहीं, हाल ही में नहीं'],
              },
            ],
          },
          {
            id: 'fertilizer', title: 'उर्वरक उपयोग', icon: '🧪',
            questions: [
              {
                key: 'ureaUsed', label: 'आप सामान्यतः प्रति एकड़ कितना यूरिया उपयोग करते हैं?',
                options: ['कोई नहीं', '25 किग्रा से कम', '25–50 किग्रा', '50–75 किग्रा', '75–100 किग्रा', '100 किग्रा से अधिक'],
              },
              {
                key: 'dapUsed', label: 'क्या आप DAP (डाई-अमोनियम फॉस्फेट) उपयोग करते हैं?',
                options: ['हाँ, नियमित रूप से', 'कभी-कभी', 'नहीं'],
              },
              {
                key: 'mopUsed', label: 'क्या आप MOP (म्यूरिएट ऑफ पोटाश) उपयोग करते हैं?',
                options: ['हाँ, नियमित रूप से', 'कभी-कभी', 'नहीं'],
              },
              {
                key: 'organicManure', label: 'क्या आप जैविक खाद उपयोग करते हैं? (FYM, कम्पोस्ट, वर्मीकम्पोस्ट)',
                options: ['हाँ, FYM (खेत की खाद)', 'हाँ, कम्पोस्ट', 'हाँ, वर्मीकम्पोस्ट', 'कोई जैविक खाद नहीं'],
              },
            ],
          },
          {
            id: 'water', title: 'सिंचाई और पानी', icon: '💧',
            questions: [
              {
                key: 'irrigationType', label: 'आप कौन सी सिंचाई विधि उपयोग करते हैं?',
                options: ['वर्षा पर निर्भर (सिंचाई नहीं)', 'नहर सिंचाई', 'बोरवेल', 'ड्रिप सिंचाई', 'मिश्रित विधियां'],
              },
              {
                key: 'floodIrrigation', label: 'क्या आप बाढ़ सिंचाई का अभ्यास करते हैं?',
                options: ['हाँ, हमेशा', 'कभी-कभी', 'नहीं'],
              },
              {
                key: 'drainage', label: 'आपके खेत की जल निकासी कैसी है?',
                options: ['अच्छी – पानी जल्दी निकल जाता है', 'मध्यम – कुछ घंटों में निकलता है', 'खराब – पानी जमा रहता है'],
              },
              {
                key: 'waterSalinity', label: 'क्या आपने पानी या मिट्टी में सफेद नमक जमाव या लवणता की समस्या देखी है?',
                options: ['हाँ, मिट्टी पर सफेद परत दिखती है', 'सिंचाई के बाद कभी-कभी', 'कोई समस्या नहीं'],
              },
            ],
          },
          {
            id: 'symptoms', title: 'फसल के लक्षण', icon: '🔍',
            questions: [
              {
                key: 'yellowingLeaves', label: 'क्या आपकी फसल में पीली पत्तियां दिखती हैं?',
                options: ['हाँ, युवा पत्तियां पीली हैं', 'हाँ, पुरानी/निचली पत्तियां पीली हैं', 'कोई पीलापन नहीं'],
              },
              {
                key: 'stemGrowth', label: 'आपकी फसल के तने की मजबूती और वृद्धि कैसी है?',
                options: ['कमजोर, पौधे आसानी से गिरते हैं', 'मध्यम वृद्धि', 'मजबूत और स्वस्थ'],
              },
              {
                key: 'flowering', label: 'फूल और फल कैसे हैं?',
                options: ['कमजोर फूल / फल गिर रहे हैं', 'औसत', 'अच्छे फूल और फल'],
              },
              {
                key: 'soilHardness', label: 'क्या सिंचाई के बाद मिट्टी कठोर या दरार वाली हो जाती है?',
                options: ['हाँ, बहुत कठोर परत बनती है', 'थोड़ी कठोर', 'नहीं, ढीली रहती है'],
              },
              {
                key: 'cropYield', label: 'पिछले मौसम में आपकी फसल की उपज कैसी थी?',
                options: ['खराब – अपेक्षा से बहुत कम', 'औसत – उम्मीद के अनुसार', 'अच्छी – उम्मीद से अधिक'],
              },
            ],
          },
        ],
      },
  
      result: {
        reportTitle:  '🌾 मिट्टी स्वास्थ्य रिपोर्ट',
        printBtn:     '🖨️ प्रिंट / PDF डाउनलोड करें',
        printTitle:   '🌾 मिट्टी स्वास्थ्य विश्लेषण रिपोर्ट',
        generatedOn:  'उत्पन्न किया गया',
  
        healthLabels: {
          GOOD:   '✅ अच्छी मिट्टी',
          MEDIUM: '⚠️ मध्यम मिट्टी',
          POOR:   '❌ खराब मिट्टी',
        },
  
        tabs: {
          summary:     '📋 सारांश',
          nutrients:   '🧪 पोषक तत्व',
          fertilizers: '🌱 उर्वरक',
          crops:       '🌾 फसलें',
          plan:        '📅 योजना',
        },
  
        summary: {
          nitrogen:      'नाइट्रोजन (N)',
          phosphorus:    'फास्फोरस (P)',
          potassium:     'पोटेशियम (K)',
          nDesc:         'पत्ती की हरियाली के लिए',
          pDesc:         'जड़ और फूल के विकास के लिए',
          kDesc:         'मजबूती और सूखा प्रतिरोध के लिए',
          soilProps:     '🏔️ मिट्टी के गुण',
          phLevel:       'pH स्तर',
          texture:       'बनावट',
          organicMatter: 'जैविक पदार्थ',
          waterCapacity: 'जल धारण क्षमता',
          defFound:      '⚠️ कमियां मिलीं',
          severe:        'गंभीर',
          moderate:      'मध्यम',
        },
  
        nutrients: {
          level:       'स्तर',
          importance:  'महत्व:',
          nImportance: 'पत्ती की हरियाली और पौधे की वृद्धि के लिए आवश्यक',
          pImportance: 'जड़ विकास, फूल और फल के लिए महत्वपूर्ण',
          kImportance: 'पौधे को मजबूत बनाता है और सूखे व बीमारी से बचाता है',
        },
  
        fertilizers: {
          tip:           '💡 नीचे दिए गए उर्वरकों में से अपनी सुविधा के अनुसार चुनें। सभी एक साथ लगाना जरूरी नहीं।',
          highPriority:  '🔴 उच्च प्राथमिकता',
          normalPriority:'🟡 सामान्य प्राथमिकता',
          quantity:      '📦 मात्रा',
          timing:        '⏰ समय',
          cost:          '💰 लागत',
        },
  
        crops: {
          highlyRecommended: '⭐ अत्यधिक उपयुक्त फसलें',
          recommended:       '✅ उपयुक्त फसलें',
          possibleWithCare:  '⚠️ सावधानी के साथ संभव',
          reason:            'कारण:',
        },
  
        plan: {
          immediate: '🚨 तत्काल कार्य (0-2 सप्ताह)',
          shortTerm: '📅 अल्पकालिक कार्य (2-3 महीने)',
          longTerm:  '🌱 दीर्घकालिक सुधार (6+ महीने)',
          benefit:   'लाभ:',
        },
  
        levels: { HIGH: 'उच्च', MEDIUM: 'मध्यम', LOW: 'निम्न' },
      },
    },
  
    /* ══════════════════════════════════════════════════════════════════
       BENGALI
    ══════════════════════════════════════════════════════════════════ */
    bn: {
      page: {
        title:        '🌾 মাটির স্বাস্থ্য বিশ্লেষণ',
        subtitle:     'AI-চালিত · কোনো ল্যাব পরীক্ষার দরকার নেই',
        newTest:      '📝 নতুন পরীক্ষা',
        history:      '📜 ইতিহাস',
        newTestBtn:   '← নতুন পরীক্ষা',
        pastAnalyses: '📜 আপনার পূর্ববর্তী বিশ্লেষণ',
        noHistory:    'এখনও কোনো বিশ্লেষণ করা হয়নি',
        firstTest:    'প্রথম পরীক্ষা করুন',
        recentTitle:  '🕒 সাম্প্রতিক বিশ্লেষণ',
        noHistoryYet: 'এখনও কোনো ইতিহাস নেই',
        viewAll:      'সব দেখুন',
        statsTitle:   '📊 পরিসংখ্যান',
        totalTests:   'মোট পরীক্ষা',
        avgScore:     'গড় স্কোর',
        goodSoil:     'ভালো মাটি',
        helpTitle:    '❓ সাহায্য দরকার?',
        helpDesc:     'যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করুন',
        helpline:     '📞 হেল্পলাইন',
        defFound:     'ঘাটতি পাওয়া গেছে',
        viewDetails:  'বিবরণ দেখুন →',
        footer: {
          aiPowered:    'AI-চালিত',
          aiDesc:       'কৃষি বিজ্ঞানের নিয়মের উপর ভিত্তি করে',
          instant:      'তাৎক্ষণিক ফলাফল',
          instantDesc:  'ল্যাব পরীক্ষার দরকার নেই',
          free:         'বিনামূল্যে সেবা',
          freeDesc:     'সীমাহীন বিশ্লেষণ',
          madeFor:      'কৃষকদের জন্য তৈরি 🇮🇳',
          rights:       '© ২০২৬ Urban Farming Platform. সর্বস্বত্ব সংরক্ষিত।',
        },
        health: {
          GOOD:   '✅ ভালো',
          MEDIUM: '⚠️ মাঝারি',
          POOR:   '❌ খারাপ',
        },
      },
  
      form: {
        title:        '🌾 মাটির স্বাস্থ্য পরীক্ষা',
        subtitle:     'মাটির স্বাস্থ্য বিশ্লেষণ (ল্যাব পরীক্ষা ছাড়াই)',
        hint:         'আপনার মাঠে যা পর্যবেক্ষণ করেন তা বেছে নিন',
        stepLabel:    'ধাপ',
        of:           '/',
        complete:     '% সম্পন্ন',
        answerAll:    'এগিয়ে যেতে সব প্রশ্নের উত্তর দিন',
        recorded:     '✓ নথিভুক্ত হয়েছে',
        previous:     '⬅️ আগের',
        next:         'পরের ➡️',
        analysing:    '⏳ বিশ্লেষণ হচ্ছে...',
        startAnalysis:'✅ বিশ্লেষণ শুরু করুন',
        selectAnswer: '— উত্তর বেছে নিন —',
        error:        'বিশ্লেষণ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
        tip:          '💡 পরামর্শ: সঠিক তথ্য দিতে মাঠে গিয়ে আপনার গাছ ও মাটি সাবধানে দেখুন। কোনো প্রশ্নে অনিশ্চিত হলে সবচেয়ে কাছের বিকল্পটি বেছে নিন।',
  
        steps: [
          {
            id: 'basic', title: 'খামারের মূল তথ্য', icon: '🗺️',
            questions: [
              {
                key: 'soilType', label: 'আপনার জমিতে কোন ধরনের মাটি আছে?',
                options: ['বালুময়', 'এঁটেল', 'দোআঁশ', 'কালো মাটি', 'লাল মাটি', 'জানি না'],
              },
              {
                key: 'soilColor', label: 'আপনার মাটির রঙ কেমন?',
                options: ['গাঢ় কালো', 'লালচে', 'হলুদাভ', 'হালকা বাদামি'],
              },
              {
                key: 'yearsOfCultivation', label: 'আপনি এই জমিতে কত বছর ধরে চাষ করছেন?',
                options: ['২ বছরের কম', '২–৫ বছর', '৫–১০ বছর', '১০ বছরের বেশি'],
              },
              {
                key: 'landSize', label: 'জমির আকার',
                options: ['১ একরের কম', '১–৩ একর', '৩–৫ একর', '৫ একরের বেশি'],
              },
            ],
          },
          {
            id: 'crop', title: 'ফসলের ইতিহাস', icon: '🌾',
            questions: [
              {
                key: 'lastSeasonCrop', label: 'গত মৌসুমে আপনি কোন ফসল চাষ করেছিলেন?',
                options: ['ধান', 'গম', 'ভুট্টা', 'তুলা', 'আখ', 'সবজি', 'ডাল/শিম', 'তেলবীজ', 'অন্যান্য'],
              },
              {
                key: 'cropRotation', label: 'আপনি কি ফসল বদলানোর অভ্যাস করেন?',
                options: ['হ্যাঁ, নিয়মিত', 'মাঝে মাঝে', 'না'],
              },
              {
                key: 'leguminousCrop', label: 'আপনি কি সম্প্রতি কোনো শিম জাতীয় ফসল চাষ করেছেন? (যেমন ডাল, চিনাবাদাম, সয়াবিন)',
                options: ['হ্যাঁ, গত মৌসুমে', 'হ্যাঁ, ২–৩ মৌসুম আগে', 'না, সম্প্রতি না'],
              },
            ],
          },
          {
            id: 'fertilizer', title: 'সার ব্যবহার', icon: '🧪',
            questions: [
              {
                key: 'ureaUsed', label: 'আপনি সাধারণত প্রতি একরে কতটুকু ইউরিয়া ব্যবহার করেন?',
                options: ['কোনোটি না', '২৫ কেজির কম', '২৫–৫০ কেজি', '৫০–৭৫ কেজি', '৭৫–১০০ কেজি', '১০০ কেজির বেশি'],
              },
              {
                key: 'dapUsed', label: 'আপনি কি DAP (ডাই-অ্যামোনিয়াম ফসফেট) ব্যবহার করেন?',
                options: ['হ্যাঁ, নিয়মিত', 'মাঝে মাঝে', 'না'],
              },
              {
                key: 'mopUsed', label: 'আপনি কি MOP (মিউরিয়েট অব পটাশ) ব্যবহার করেন?',
                options: ['হ্যাঁ, নিয়মিত', 'মাঝে মাঝে', 'না'],
              },
              {
                key: 'organicManure', label: 'আপনি কি জৈব সার ব্যবহার করেন? (FYM, কম্পোস্ট, ভার্মিকম্পোস্ট)',
                options: ['হ্যাঁ, FYM (খামারের সার)', 'হ্যাঁ, কম্পোস্ট', 'হ্যাঁ, ভার্মিকম্পোস্ট', 'কোনো জৈব সার নেই'],
              },
            ],
          },
          {
            id: 'water', title: 'সেচ ও পানি', icon: '💧',
            questions: [
              {
                key: 'irrigationType', label: 'আপনি কোন সেচ পদ্ধতি ব্যবহার করেন?',
                options: ['বৃষ্টি নির্ভর (সেচ নেই)', 'খাল সেচ', 'বোরওয়েল', 'ড্রিপ সেচ', 'মিশ্র পদ্ধতি'],
              },
              {
                key: 'floodIrrigation', label: 'আপনি কি বন্যা সেচ করেন?',
                options: ['হ্যাঁ, সবসময়', 'মাঝে মাঝে', 'না'],
              },
              {
                key: 'drainage', label: 'আপনার মাঠের পানি নিষ্কাশন কেমন?',
                options: ['ভালো – পানি দ্রুত সরে যায়', 'মাঝারি – কয়েক ঘণ্টায় সরে', 'খারাপ – পানি জমে থাকে'],
              },
              {
                key: 'waterSalinity', label: 'আপনি কি পানিতে বা মাটিতে সাদা লবণ জমা বা লবণাক্ততার সমস্যা দেখেছেন?',
                options: ['হ্যাঁ, মাটিতে সাদা আস্তরণ দেখা যাচ্ছে', 'সেচের পরে মাঝে মাঝে', 'কোনো সমস্যা নেই'],
              },
            ],
          },
          {
            id: 'symptoms', title: 'ফসলের লক্ষণ', icon: '🔍',
            questions: [
              {
                key: 'yellowingLeaves', label: 'আপনার ফসলে হলুদ পাতা দেখা যাচ্ছে?',
                options: ['হ্যাঁ, কচি পাতা হলুদ', 'হ্যাঁ, পুরনো/নিচের পাতা হলুদ', 'কোনো হলুদ ভাব নেই'],
              },
              {
                key: 'stemGrowth', label: 'আপনার ফসলের কাণ্ডের শক্তি ও বৃদ্ধি কেমন?',
                options: ['দুর্বল, গাছ সহজে পড়ে যায়', 'মাঝারি বৃদ্ধি', 'শক্তিশালী ও সুস্থ'],
              },
              {
                key: 'flowering', label: 'ফুল ও ফল কেমন হচ্ছে?',
                options: ['কম ফুল / ফল ঝরছে', 'গড়পড়তা', 'ভালো ফুল ও ফল'],
              },
              {
                key: 'soilHardness', label: 'সেচের পরে মাটি কঠিন বা ফাটল ধরে যায়?',
                options: ['হ্যাঁ, খুব শক্ত আস্তরণ পড়ে', 'কিছুটা শক্ত', 'না, আলগা থাকে'],
              },
              {
                key: 'cropYield', label: 'গত মৌসুমে আপনার ফসলের ফলন কেমন ছিল?',
                options: ['খারাপ – প্রত্যাশার চেয়ে অনেক কম', 'গড় – প্রত্যাশামতো', 'ভালো – প্রত্যাশার চেয়ে বেশি'],
              },
            ],
          },
        ],
      },
  
      result: {
        reportTitle:  '🌾 মাটির স্বাস্থ্য রিপোর্ট',
        printBtn:     '🖨️ প্রিন্ট / PDF ডাউনলোড করুন',
        printTitle:   '🌾 মাটির স্বাস্থ্য বিশ্লেষণ রিপোর্ট',
        generatedOn:  'তৈরি হয়েছে',
  
        healthLabels: {
          GOOD:   '✅ ভালো মাটি',
          MEDIUM: '⚠️ মাঝারি মাটি',
          POOR:   '❌ খারাপ মাটি',
        },
  
        tabs: {
          summary:     '📋 সারসংক্ষেপ',
          nutrients:   '🧪 পুষ্টি উপাদান',
          fertilizers: '🌱 সার',
          crops:       '🌾 ফসল',
          plan:        '📅 পরিকল্পনা',
        },
  
        summary: {
          nitrogen:      'নাইট্রোজেন (N)',
          phosphorus:    'ফসফরাস (P)',
          potassium:     'পটাশিয়াম (K)',
          nDesc:         'পাতার সবুজত্বের জন্য',
          pDesc:         'শিকড় ও ফুলের বিকাশের জন্য',
          kDesc:         'শক্তি ও খরা প্রতিরোধের জন্য',
          soilProps:     '🏔️ মাটির বৈশিষ্ট্য',
          phLevel:       'pH মাত্রা',
          texture:       'গঠন',
          organicMatter: 'জৈব পদার্থ',
          waterCapacity: 'জল ধারণ ক্ষমতা',
          defFound:      '⚠️ ঘাটতি পাওয়া গেছে',
          severe:        'তীব্র',
          moderate:      'মাঝারি',
        },
  
        nutrients: {
          level:       'মাত্রা',
          importance:  'গুরুত্ব:',
          nImportance: 'পাতার সবুজত্ব ও গাছের বৃদ্ধির জন্য অপরিহার্য',
          pImportance: 'শিকড় বিকাশ, ফুল ও ফলের জন্য গুরুত্বপূর্ণ',
          kImportance: 'গাছকে শক্তিশালী করে এবং খরা ও রোগ প্রতিরোধে সাহায্য করে',
        },
  
        fertilizers: {
          tip:           '💡 নিচের সার থেকে আপনার সুবিধামতো বেছে নিন। সব একসাথে দেওয়া জরুরি নয়।',
          highPriority:  '🔴 উচ্চ অগ্রাধিকার',
          normalPriority:'🟡 সাধারণ অগ্রাধিকার',
          quantity:      '📦 পরিমাণ',
          timing:        '⏰ সময়',
          cost:          '💰 খরচ',
        },
  
        crops: {
          highlyRecommended: '⭐ অত্যন্ত উপযুক্ত ফসল',
          recommended:       '✅ উপযুক্ত ফসল',
          possibleWithCare:  '⚠️ সাবধানতার সাথে সম্ভব',
          reason:            'কারণ:',
        },
  
        plan: {
          immediate: '🚨 তাৎক্ষণিক পদক্ষেপ (০-২ সপ্তাহ)',
          shortTerm: '📅 স্বল্পমেয়াদী পদক্ষেপ (২-৩ মাস)',
          longTerm:  '🌱 দীর্ঘমেয়াদী উন্নতি (৬+ মাস)',
          benefit:   'সুবিধা:',
        },
  
        levels: { HIGH: 'উচ্চ', MEDIUM: 'মাঝারি', LOW: 'নিম্ন' },
      },
    },
  };
  
  export default soilTranslations;