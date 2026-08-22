// ============================================================
//  OFFLINE FARMING KNOWLEDGE BASE
//  Languages: English (en) | Hindi (hi) | Bengali (bn)
//  Crops: Rice/Paddy, Wheat, Vegetables, Fruits
//  Zero network dependency — all data is embedded here
// ============================================================

export const LANG_LABELS = {
    en: { name: "English", flag: "🇬🇧" },
    hi: { name: "हिन्दी", flag: "🇮🇳" },
    bn: { name: "বাংলা", flag: "🇮🇳" },
  };
  
  // ─── FAQ KNOWLEDGE BASE ─────────────────────────────────────
  export const FAQ = [
    // ── SOIL ──────────────────────────────────────────────────
    {
      id: 1, category: "soil", tags: ["soil", "ph", "test", "मिट्टी", "মাটি"],
      en: {
        q: "How do I test soil pH at home?",
        a: "Mix 2 tablespoons of soil with distilled water to form a paste. Dip a pH strip in it. Below 6 = acidic (add lime/wood ash). Above 7.5 = alkaline (add sulfur or compost). Ideal pH for most crops is 6.0–7.0. Test from multiple spots in your field for best accuracy."
      },
      hi: {
        q: "घर पर मिट्टी का pH कैसे जांचें?",
        a: "2 चम्मच मिट्टी को आसुत जल में मिलाकर पेस्ट बनाएं। इसमें pH पट्टी डुबोएं। 6 से कम = अम्लीय (चूना/राख डालें)। 7.5 से अधिक = क्षारीय (सल्फर या खाद डालें)। अधिकांश फसलों के लिए आदर्श pH 6.0–7.0 है।"
      },
      bn: {
        q: "বাড়িতে মাটির pH পরীক্ষা কীভাবে করব?",
        a: "২ চামচ মাটি পাতিত জলে মিশিয়ে পেস্ট তৈরি করুন। pH স্ট্রিপ ডুবিয়ে দেখুন। ৬-এর নিচে = অম্লীয় (চুন/ছাই দিন)। ৭.৫-এর উপরে = ক্ষারীয় (সালফার বা কম্পোস্ট দিন)। বেশিরভাগ ফসলের জন্য আদর্শ pH ৬.০–৭.০।"
      }
    },
    {
      id: 2, category: "soil", tags: ["soil", "sandy", "compost", "improve", "मिट्टी", "বালি"],
      en: {
        q: "How do I improve sandy soil?",
        a: "Add organic matter like compost, cow dung manure, or leaf mulch. Mix 3–4 inches of compost into the top 8 inches of soil. Sandy soil drains fast and loses nutrients quickly — repeat every season. Growing green manure crops like cowpea or mustard also helps."
      },
      hi: {
        q: "रेतीली मिट्टी को कैसे सुधारें?",
        a: "खाद, गोबर की खाद या पत्तियों का गीला कचरा मिलाएं। 3-4 इंच खाद को मिट्टी की 8 इंच गहराई में मिलाएं। रेतीली मिट्टी जल्दी सूखती है — हर मौसम में दोहराएं। लोबिया या सरसों जैसी हरी खाद की फसलें उगाने से भी मदद मिलती है।"
      },
      bn: {
        q: "বালি মাটি উন্নত করব কীভাবে?",
        a: "কম্পোস্ট, গোবর সার বা পাতার মালচ যোগ করুন। ৩-৪ ইঞ্চি কম্পোস্ট মাটির ৮ ইঞ্চি গভীরে মেশান। বালি মাটি দ্রুত শুকায় — প্রতি মৌসুমে করুন। কাউপি বা সরিষার মতো সবুজ সার ফসল চাষও সাহায্য করে।"
      }
    },
    {
      id: 3, category: "soil", tags: ["soil", "hard", "compact", "crust", "মাটি", "শক্ত"],
      en: {
        q: "What causes soil to become hard and how to fix it?",
        a: "Soil hardens from heavy rain on bare soil, excess tilling, or low organic matter. Fix: add compost every season, use mulch to protect surface, avoid tilling wet soil. Grow deep-rooted crops like sunflower or radish to break up compaction naturally. Earthworms are your best ally."
      },
      hi: {
        q: "मिट्टी सख्त क्यों होती है और इसे कैसे ठीक करें?",
        a: "खुली मिट्टी पर भारी बारिश, अधिक जुताई या कम जैविक पदार्थ से मिट्टी सख्त होती है। उपाय: हर मौसम में खाद डालें, गीला कचरा डालें, गीली मिट्टी की जुताई न करें। सूरजमुखी या मूली जैसी गहरी जड़ों वाली फसलें उगाएं। केंचुए आपके सबसे अच्छे मित्र हैं।"
      },
      bn: {
        q: "মাটি শক্ত হওয়ার কারণ ও সমাধান?",
        a: "খোলা মাটিতে ভারী বৃষ্টি, অতিরিক্ত চাষ বা কম জৈব পদার্থে মাটি শক্ত হয়। সমাধান: প্রতি মৌসুমে কম্পোস্ট দিন, মালচ ব্যবহার করুন, ভেজা মাটি চাষ এড়িয়ে চলুন। সূর্যমুখী বা মূলার মতো গভীর শিকড়ের ফসল চাষ করুন।"
      }
    },
  
    // ── WATER / IRRIGATION ────────────────────────────────────
    {
      id: 4, category: "water", tags: ["water", "irrigation", "vegetable", "how much", "পানি", "পানি"],
      en: {
        q: "How much water do vegetables need per day?",
        a: "Most vegetables need 1 inch of water per week (about 1–1.5 liters per sq ft per week). In hot/dry weather, water daily in the morning. Check soil 2 inches deep — if dry, water now. Tomatoes and brinjal need more water; onions and garlic need less. Mulching saves 40% water."
      },
      hi: {
        q: "सब्जियों को प्रतिदिन कितना पानी चाहिए?",
        a: "अधिकांश सब्जियों को प्रति सप्ताह 1 इंच पानी (लगभग 1-1.5 लीटर प्रति वर्ग फुट) चाहिए। गर्मी में सुबह प्रतिदिन पानी दें। मिट्टी 2 इंच गहरी जांचें — सूखी हो तो पानी दें। टमाटर और बैंगन को अधिक पानी चाहिए; प्याज और लहसुन को कम।"
      },
      bn: {
        q: "সবজিতে প্রতিদিন কতটুকু পানি লাগে?",
        a: "বেশিরভাগ সবজিতে সপ্তাহে ১ ইঞ্চি পানি (প্রতি বর্গফুটে ১–১.৫ লিটার) লাগে। গরমে সকালে প্রতিদিন পানি দিন। মাটি ২ ইঞ্চি গভীরে পরীক্ষা করুন — শুকনো হলে পানি দিন। টমেটো ও বেগুনে বেশি পানি লাগে; পেঁয়াজ ও রসুনে কম।"
      }
    },
    {
      id: 5, category: "water", tags: ["water", "morning", "best time", "when", "সেচ", "সময়"],
      en: {
        q: "When is the best time to water crops?",
        a: "Water early morning (5–9 AM) — leaves dry before evening, preventing fungal disease. Avoid watering at noon (60% evaporation loss in summer). Never water at night as wet leaves overnight cause mold and blight. If using drip irrigation, any time is fine."
      },
      hi: {
        q: "फसलों को पानी देने का सबसे अच्छा समय क्या है?",
        a: "सुबह जल्दी (5-9 बजे) पानी दें — शाम तक पत्तियां सूख जाती हैं, फफूंद से बचाव होता है। दोपहर में पानी न दें (गर्मियों में 60% वाष्पीकरण)। रात में कभी पानी न दें — गीली पत्तियां रात भर रहने से फफूंदी और झुलसा रोग होता है।"
      },
      bn: {
        q: "ফসলে পানি দেওয়ার সেরা সময় কখন?",
        a: "সকাল ৫–৯টায় পানি দিন — সন্ধ্যার আগে পাতা শুকিয়ে যায়, ছত্রাক রোগ থেকে বাঁচে। দুপুরে পানি দেবেন না (৬০% বাষ্পীভবন)। রাতে কখনো পানি দেবেন না — ভেজা পাতায় ছত্রাক ও ব্লাইট হয়। ড্রিপ সেচ যেকোনো সময় ব্যবহার করা যায়।"
      }
    },
    {
      id: 6, category: "water", tags: ["overwater", "yellow", "wilting", "root rot", "অতিরিক্ত পানি"],
      en: {
        q: "How do I know if my crops are over-watered?",
        a: "Signs: yellowing leaves (especially lower ones), wilting despite wet soil, mold on soil surface, slimy/smelly roots. Fix: stop watering for 3–5 days, poke holes in soil for drainage, add sand to improve drainage. Most crops prefer 'dry between waterings' to staying constantly wet."
      },
      hi: {
        q: "फसलों में अधिक पानी के लक्षण क्या हैं?",
        a: "लक्षण: पीली पत्तियां (खासकर नीचे की), गीली मिट्टी में भी मुरझाना, मिट्टी की सतह पर फफूंदी, बदबूदार जड़ें। उपाय: 3-5 दिन पानी बंद करें, जल निकासी के लिए मिट्टी में छेद करें, रेत मिलाएं। अधिकांश फसलें लगातार गीले रहने से बेहतर 'बीच-बीच में सूखना' पसंद करती हैं।"
      },
      bn: {
        q: "অতিরিক্ত পানির লক্ষণ কী?",
        a: "লক্ষণ: হলদে পাতা (বিশেষত নিচের), ভেজা মাটিতেও ঢলে পড়া, মাটির উপর ছাঁচ, দুর্গন্ধযুক্ত শিকড়। সমাধান: ৩–৫ দিন পানি বন্ধ রাখুন, মাটিতে ছিদ্র করুন, বালি মেশান। বেশিরভাগ ফসল ক্রমাগত ভেজা থাকার চেয়ে 'মাঝে মাঝে শুকনো' পছন্দ করে।"
      }
    },
  
    // ── RICE / PADDY ──────────────────────────────────────────
    {
      id: 7, category: "rice", tags: ["rice", "paddy", "dhaan", "yellowing", "ধান", "ধান"],
      en: {
        q: "Why are paddy leaves turning yellow?",
        a: "Yellow paddy leaves usually mean: (1) Nitrogen deficiency — apply urea (45kg/acre). (2) Iron deficiency in flooded fields — drain for 2 days, then apply ferrous sulfate spray. (3) Blast disease — yellow-brown spots with gray center — apply Tricyclazole fungicide. (4) Water logging — ensure proper drainage."
      },
      hi: {
        q: "धान की पत्तियां पीली क्यों हो रही हैं?",
        a: "पीली धान की पत्तियों के कारण: (1) नाइट्रोजन की कमी — यूरिया (45 किग्रा/एकड़) डालें। (2) बाढ़ में आयरन की कमी — 2 दिन पानी निकालें, फिर फेरस सल्फेट स्प्रे करें। (3) झुलसा रोग — पीले-भूरे धब्बे — ट्राईसाइक्लाजोल फफूंदीनाशक लगाएं। (4) जलभराव — उचित जल निकासी सुनिश्चित करें।"
      },
      bn: {
        q: "ধানের পাতা হলুদ হচ্ছে কেন?",
        a: "হলুদ ধানপাতার কারণ: (1) নাইট্রোজেনের অভাব — ইউরিয়া (৪৫ কেজি/একর) দিন। (2) জলাবদ্ধ জমিতে আয়রনের অভাব — ২ দিন পানি সরান, তারপর ফেরাস সালফেট স্প্রে করুন। (3) ব্লাস্ট রোগ — হলুদ-বাদামি দাগ — ট্রাইসাইক্লাজোল ছত্রাকনাশক দিন।"
      }
    },
    {
      id: 8, category: "rice", tags: ["rice", "paddy", "transplant", "seedling", "রোপণ"],
      en: {
        q: "What is the right age to transplant paddy seedlings?",
        a: "Transplant paddy seedlings at 20–25 days old for short-duration varieties, 25–30 days for medium, and 30–35 days for long-duration varieties. Ideal seedling height: 15–25 cm. Transplant in early morning or evening. Maintain 2–3 cm standing water after transplanting for 7 days."
      },
      hi: {
        q: "धान के पौधे कब लगाने चाहिए?",
        a: "अल्प अवधि किस्मों के लिए 20-25 दिन, मध्यम अवधि के लिए 25-30 दिन और लंबी अवधि किस्मों के लिए 30-35 दिन की उम्र में रोपाई करें। आदर्श पौध ऊंचाई 15-25 सेमी। सुबह या शाम को रोपाई करें। रोपाई के बाद 7 दिनों तक 2-3 सेमी पानी रखें।"
      },
      bn: {
        q: "ধানের চারা কখন রোপণ করতে হয়?",
        a: "স্বল্প মেয়াদী জাতের জন্য ২০–২৫ দিন, মধ্যম মেয়াদের জন্য ২৫–৩০ দিন এবং দীর্ঘমেয়াদী জাতের জন্য ৩০–৩৫ দিন বয়সে রোপণ করুন। আদর্শ উচ্চতা ১৫–২৫ সেমি। সকালে বা বিকেলে রোপণ করুন। রোপণের পর ৭ দিন ২–৩ সেমি পানি রাখুন।"
      }
    },
    {
      id: 9, category: "rice", tags: ["rice", "blast", "blight", "disease", "ধান রোগ"],
      en: {
        q: "How to control rice blast disease?",
        a: "Rice blast causes diamond-shaped gray spots on leaves. Prevention: use resistant varieties, avoid excess nitrogen, don't over-irrigate. Control: spray Tricyclazole (0.6g/L water) or Carbendazim (1g/L) at first sign. Spray again after 10 days. Drain field for 2 days before spraying."
      },
      hi: {
        q: "धान का झुलसा रोग कैसे नियंत्रित करें?",
        a: "झुलसा रोग में पत्तियों पर हीरे के आकार के भूरे-सफेद धब्बे होते हैं। रोकथाम: प्रतिरोधी किस्में, अधिक नाइट्रोजन न दें, अधिक पानी न दें। नियंत्रण: ट्राईसाइक्लाजोल (0.6 ग्राम/लीटर) या कार्बेंडाजिम (1 ग्राम/लीटर) स्प्रे करें। 10 दिन बाद दोबारा स्प्रे करें।"
      },
      bn: {
        q: "ধানের ব্লাস্ট রোগ কীভাবে নিয়ন্ত্রণ করব?",
        a: "ব্লাস্ট রোগে পাতায় হীরা আকৃতির ধূসর দাগ পড়ে। প্রতিরোধ: প্রতিরোধী জাত, অতিরিক্ত নাইট্রোজেন ও পানি এড়িয়ে চলুন। নিয়ন্ত্রণ: ট্রাইসাইক্লাজোল (০.৬ গ্রাম/লিটার) বা কার্বেন্ডাজিম (১ গ্রাম/লিটার) স্প্রে করুন। ১০ দিন পর আবার স্প্রে করুন।"
      }
    },
  
    // ── WHEAT ──────────────────────────────────────────────────
    {
      id: 10, category: "wheat", tags: ["wheat", "sowing", "time", "temperature", "গম"],
      en: {
        q: "When is the best time to sow wheat?",
        a: "Sow wheat when soil temperature is 20–22°C, typically: North India — Oct 25 to Nov 15, East India (WB) — Nov 15 to Dec 5. Timely sowing gives best yield. Late sowing (after Dec 15) reduces yield by 30–40 kg/day delay. Use timely varieties like HD-2967, PBW-550, or GW-322."
      },
      hi: {
        q: "गेहूं बोने का सबसे अच्छा समय कब है?",
        a: "जब मिट्टी का तापमान 20-22°C हो तब गेहूं बोएं, आमतौर पर: उत्तर भारत — 25 अक्टूबर से 15 नवंबर, पूर्वी भारत (पश्चिम बंगाल) — 15 नवंबर से 5 दिसंबर। देरी से बुवाई (15 दिसंबर के बाद) से प्रति दिन 30-40 किग्रा/एकड़ उपज कम होती है। HD-2967, PBW-550 किस्में उपयुक्त हैं।"
      },
      bn: {
        q: "গম বোনার সেরা সময় কখন?",
        a: "মাটির তাপমাত্রা ২০–২২°C হলে গম বোনান, সাধারণত: পশ্চিমবঙ্গে — ১৫ নভেম্বর থেকে ৫ ডিসেম্বর। দেরিতে বপন (১৫ ডিসেম্বরের পর) প্রতিদিন ৩০–৪০ কেজি/একর ফলন কমায়। GW-322, HI-8498 বা K-9107 জাত ব্যবহার করুন।"
      }
    },
    {
      id: 11, category: "wheat", tags: ["wheat", "rust", "orange", "yellow stripe", "গম মরিচা"],
      en: {
        q: "How to identify and control wheat rust?",
        a: "Wheat rust types: (1) Yellow rust — yellow stripes on leaves in cool weather. (2) Brown/leaf rust — round orange-brown pustules. (3) Black/stem rust — black pustules on stems. Control all: spray Propiconazole (1ml/L) or Tebuconazole at first sign. Repeat after 15 days. Use resistant varieties like HD-2967."
      },
      hi: {
        q: "गेहूं के रतुआ रोग को कैसे पहचानें और नियंत्रित करें?",
        a: "गेहूं रतुआ के प्रकार: (1) पीला रतुआ — ठंड में पत्तियों पर पीली धारियां। (2) भूरा रतुआ — गोल नारंगी-भूरे फफोले। (3) काला रतुआ — तनों पर काले फफोले। नियंत्रण: प्रोपिकोनाजोल (1 मिली/लीटर) या टेबुकोनाजोल स्प्रे करें। 15 दिन बाद दोबारा करें।"
      },
      bn: {
        q: "গমের মরিচা রোগ চেনার ও নিয়ন্ত্রণের উপায়?",
        a: "গম মরিচার ধরন: (1) হলুদ মরিচা — ঠান্ডায় পাতায় হলুদ ডোরা। (2) বাদামি মরিচা — গোলাকার কমলা-বাদামি ফোস্কা। (3) কালো মরিচা — কাণ্ডে কালো ফোস্কা। নিয়ন্ত্রণ: প্রোপিকোনাজোল (১ মিলি/লিটার) বা টেবুকোনাজোল স্প্রে করুন। ১৫ দিন পর আবার করুন।"
      }
    },
  
    // ── VEGETABLES ────────────────────────────────────────────
    {
      id: 12, category: "vegetables", tags: ["tomato", "tomatoes", "blossom drop", "টমেটো"],
      en: {
        q: "Why are my tomato flowers falling off without making fruit?",
        a: "Blossom drop in tomatoes is caused by: (1) Temperature above 35°C or below 10°C — shade nets help. (2) Low humidity — mist spray leaves in afternoon. (3) Excess nitrogen — use phosphorus fertilizer (DAP). (4) Irregular watering — maintain consistent moisture. Spray Boric acid (1g/L) to improve fruit set."
      },
      hi: {
        q: "टमाटर के फूल बिना फल लगे क्यों गिर जाते हैं?",
        a: "टमाटर में पुष्प पतन के कारण: (1) तापमान 35°C से अधिक या 10°C से कम — छायाजाल उपयोगी। (2) कम नमी — दोपहर में पत्तियों पर पानी छिड़कें। (3) अधिक नाइट्रोजन — DAP फॉस्फोरस उर्वरक उपयोग करें। (4) अनियमित सिंचाई। बोरिक एसिड (1ग्राम/लीटर) स्प्रे करें।"
      },
      bn: {
        q: "টমেটোর ফুল ফল না ধরে ঝরে যাচ্ছে কেন?",
        a: "টমেটোতে ফুল ঝরার কারণ: (1) তাপমাত্রা ৩৫°C-এর বেশি বা ১০°C-এর কম — শেড নেট ব্যবহার করুন। (2) কম আর্দ্রতা — দুপুরে পাতায় পানি ছিটান। (3) অতিরিক্ত নাইট্রোজেন — DAP ফসফরাস সার ব্যবহার করুন। বোরিক এসিড (১ গ্রাম/লিটার) স্প্রে করুন।"
      }
    },
    {
      id: 13, category: "vegetables", tags: ["onion", "storage", "rot", "পেঁয়াজ"],
      en: {
        q: "How do I store onions to prevent rotting?",
        a: "Cure onions in shade for 10–15 days after harvest until outer skin is papery dry. Store in mesh bags or slatted crates — never airtight bags. Keep in cool, dry, well-ventilated place (25–30°C, 60–70% humidity). Remove any sprouting or damaged bulbs immediately. Avoid storing near potatoes."
      },
      hi: {
        q: "प्याज को सड़ने से बचाने के लिए कैसे संग्रहित करें?",
        a: "कटाई के बाद 10-15 दिन छाया में सुखाएं जब तक बाहरी छिलका कागज जैसा सूख न जाए। जाली की थैलियों या स्लेटेड क्रेट में रखें — कभी एयरटाइट नहीं। ठंडी, सूखी, हवादार जगह रखें (25-30°C)। अंकुरित या खराब बल्ब तुरंत हटाएं। आलू के पास न रखें।"
      },
      bn: {
        q: "পেঁয়াজ পচা রোধে কীভাবে সংরক্ষণ করব?",
        a: "কাটার পর ১০–১৫ দিন ছায়ায় শুকান যতক্ষণ বাইরের খোসা কাগজের মতো শুকনো না হয়। জালের ব্যাগ বা ফাঁকা ক্রেটে রাখুন — কখনো বায়ুরোধী ব্যাগে নয়। ঠান্ডা, শুষ্ক, বায়ুচলাচল আছে এমন জায়গায় রাখুন। অঙ্কুরিত বা নষ্ট বাল্ব সঙ্গে সঙ্গে সরান।"
      }
    },
    {
      id: 14, category: "vegetables", tags: ["brinjal", "eggplant", "fruit borer", "shoot", "বেগুন"],
      en: {
        q: "How to control brinjal shoot and fruit borer?",
        a: "This is the most damaging brinjal pest. Signs: drooping shoot tips, holes in fruits with frass. Control: (1) Remove and destroy affected shoots weekly. (2) Use pheromone traps (1/acre). (3) Spray Spinosad (0.5ml/L) or Chlorpyrifos (2ml/L) every 15 days. (4) Avoid applying nitrogen in excess."
      },
      hi: {
        q: "बैंगन के तना एवं फल छेदक को कैसे नियंत्रित करें?",
        a: "यह बैंगन का सबसे हानिकारक कीट है। लक्षण: शाखाओं के सिरे लटकना, फलों में छेद और मल। नियंत्रण: (1) प्रभावित शाखाएं साप्ताहिक तोड़कर नष्ट करें। (2) फेरोमोन ट्रैप (1/एकड़)। (3) स्पिनोसैड (0.5 मिली/लीटर) या क्लोरपाइरीफॉस (2 मिली/लीटर) हर 15 दिन स्प्रे करें।"
      },
      bn: {
        q: "বেগুনের ডগা ও ফল ছিদ্রকারী পোকা নিয়ন্ত্রণ?",
        a: "এটি বেগুনের সবচেয়ে ক্ষতিকর পোকা। লক্ষণ: ডগা ঝুলে পড়া, ফলে ছিদ্র ও মল। নিয়ন্ত্রণ: (1) প্রতি সপ্তাহে আক্রান্ত ডগা ভেঙে নষ্ট করুন। (2) ফেরোমোন ট্র্যাপ (১/একর)। (3) স্পিনোসাড (০.৫ মিলি/লিটার) বা ক্লোরপাইরিফস (২ মিলি/লিটার) প্রতি ১৫ দিনে স্প্রে করুন।"
      }
    },
  
    // ── FRUITS ────────────────────────────────────────────────
    {
      id: 15, category: "fruits", tags: ["mango", "flowering", "no fruit", "আম"],
      en: {
        q: "Why is my mango tree not flowering?",
        a: "Mango not flowering reasons: (1) Tree age — needs 5+ years. (2) Excess nitrogen — use potassium and phosphorus instead. (3) No cool/dry spell — mango needs 8–10°C nights for 2 weeks before flowering. (4) Pruning at wrong time — prune only after harvest. Spray KNO3 (1%) to induce flowering in unresponsive trees."
      },
      hi: {
        q: "मेरे आम के पेड़ में फूल क्यों नहीं आ रहे?",
        a: "आम में फूल न आने के कारण: (1) पेड़ की उम्र — 5+ साल चाहिए। (2) अधिक नाइट्रोजन — पोटेशियम और फॉस्फोरस उपयोग करें। (3) ठंड/सूखे का दौर न होना — फूल के लिए 2 हफ्ते 8-10°C रातें चाहिए। (4) गलत समय छंटाई। KNO3 (1%) स्प्रे से फूल आ सकते हैं।"
      },
      bn: {
        q: "আমগাছে ফুল আসছে না কেন?",
        a: "আমে ফুল না আসার কারণ: (1) গাছের বয়স — ৫+ বছর লাগে। (2) অতিরিক্ত নাইট্রোজেন — পটাশিয়াম ও ফসফরাস ব্যবহার করুন। (3) শীতল/শুষ্ক আবহাওয়া না থাকা — ফুলের জন্য ২ সপ্তাহ ৮–১০°C রাতের প্রয়োজন। KNO3 (১%) স্প্রে ফুল আসাতে সাহায্য করে।"
      }
    },
    {
      id: 16, category: "fruits", tags: ["banana", "yellowing", "panama", "কলা"],
      en: {
        q: "What is banana Panama wilt and how to manage it?",
        a: "Panama wilt (Fusarium wilt) is a serious banana soil disease — no cure once infected. Signs: yellowing from oldest leaves, brown streaks inside stem. Prevention: use resistant varieties (Grand Naine), plant in uninfected soil, avoid waterlogging, sterilize tools. Remove and burn affected plants immediately to stop spread."
      },
      hi: {
        q: "केले का पनामा विल्ट क्या है और इसे कैसे नियंत्रित करें?",
        a: "पनामा विल्ट (फ्यूजेरियम विल्ट) एक गंभीर केला मृदा रोग है — एक बार संक्रमित होने पर कोई इलाज नहीं। लक्षण: पुरानी पत्तियों से पीलापन, तने के अंदर भूरी धारियां। रोकथाम: प्रतिरोधी किस्में (ग्रैंड नेन), असंक्रमित मिट्टी, जलभराव न होने दें। प्रभावित पौधे तुरंत नष्ट करें।"
      },
      bn: {
        q: "কলার পানামা উইল্ট কী ও ব্যবস্থাপনা?",
        a: "পানামা উইল্ট (ফিউজেরিয়াম উইল্ট) মাটিবাহিত গুরুতর কলা রোগ — আক্রান্ত হলে কোনো চিকিৎসা নেই। লক্ষণ: পুরনো পাতা থেকে হলুদ হওয়া, কাণ্ডের ভেতরে বাদামি দাগ। প্রতিরোধ: প্রতিরোধী জাত (গ্র্যান্ড নেন), জলাবদ্ধতা এড়ান। আক্রান্ত গাছ সঙ্গে সঙ্গে পুড়িয়ে দিন।"
      }
    },
  
    // ── FERTILIZER ───────────────────────────────────────────
    {
      id: 17, category: "fertilizer", tags: ["npk", "fertilizer", "nitrogen", "phosphorus", "সার"],
      en: {
        q: "What does NPK mean and how do I use it?",
        a: "NPK = Nitrogen (N) : Phosphorus (P) : Potassium (K). N = leaf/stem growth (green). P = root development and flowering. K = fruit quality and disease resistance. Example: NPK 12-32-16 means 12% N, 32% P, 16% K. For vegetables: apply DAP (P) at planting, Urea (N) during growth, MOP (K) before flowering."
      },
      hi: {
        q: "NPK का क्या मतलब है और इसे कैसे उपयोग करें?",
        a: "NPK = नाइट्रोजन (N) : फॉस्फोरस (P) : पोटेशियम (K)। N = पत्ती/तना वृद्धि। P = जड़ विकास और फूलना। K = फल गुणवत्ता और रोग प्रतिरोध। उदाहरण: NPK 12-32-16। सब्जियों के लिए: रोपाई पर DAP (P), वृद्धि के दौरान यूरिया (N), फूल से पहले MOP (K)।"
      },
      bn: {
        q: "NPK মানে কী এবং কীভাবে ব্যবহার করব?",
        a: "NPK = নাইট্রোজেন (N) : ফসফরাস (P) : পটাশিয়াম (K)। N = পাতা/কাণ্ড বৃদ্ধি। P = শিকড় ও ফুল। K = ফলের মান ও রোগ প্রতিরোধ। উদাহরণ: NPK 12-32-16। সবজিতে: রোপণে DAP (P), বৃদ্ধিতে ইউরিয়া (N), ফুলের আগে MOP (K)।"
      }
    },
    {
      id: 18, category: "fertilizer", tags: ["organic", "compost", "vermicompost", "organic farming", "জৈব সার"],
      en: {
        q: "How do I make compost at home?",
        a: "Layer green waste (vegetables, grass — 1 part) with brown waste (dry leaves, straw — 2 parts) in a heap or pit. Add water to keep it moist like a wrung-out sponge. Turn every 2 weeks. Ready in 45–60 days (dark, crumbly, earthy smell). Add cow dung to speed up. Avoid meat, oily food, and diseased plants."
      },
      hi: {
        q: "घर पर खाद कैसे बनाएं?",
        a: "हरे कचरे (सब्जियां, घास — 1 भाग) को भूरे कचरे (सूखी पत्तियां, पुआल — 2 भाग) के साथ ढेर या गड्ढे में परतें लगाएं। नमी बनाए रखने के लिए पानी डालें। हर 2 हफ्ते पलटें। 45-60 दिन में तैयार (गहरा, भुरभुरा, मिट्टी जैसी गंध)। गोबर डालने से जल्दी बनती है।"
      },
      bn: {
        q: "বাড়িতে কম্পোস্ট কীভাবে তৈরি করব?",
        a: "সবুজ বর্জ্য (সবজি, ঘাস — ১ ভাগ) ও বাদামি বর্জ্য (শুকনো পাতা, খড় — ২ ভাগ) স্তরে স্তরে স্তূপে রাখুন। স্যাঁতসেঁতে রাখতে পানি দিন। প্রতি ২ সপ্তাহে উল্টান। ৪৫–৬০ দিনে তৈরি (গাঢ়, খামখেয়ালি, মাটির গন্ধ)। গোবর দিলে দ্রুত হয়।"
      }
    },
  
    // ── GENERAL / WEATHER ────────────────────────────────────
    {
      id: 19, category: "general", tags: ["pest", "neem", "organic pesticide", "নিম"],
      en: {
        q: "How to make organic pesticide from neem at home?",
        a: "Neem oil spray: mix 5ml neem oil + 2ml liquid soap (emulsifier) + 1L water. Spray in evening on all leaf surfaces. Repeat every 7–10 days. OR: Soak 500g neem leaves in 10L water overnight, strain and spray. Effective against aphids, whitefly, mites, and many soft-bodied insects. Safe for humans and bees."
      },
      hi: {
        q: "नीम से घर पर जैविक कीटनाशक कैसे बनाएं?",
        a: "नीम तेल स्प्रे: 5 मिली नीम तेल + 2 मिली तरल साबुन + 1 लीटर पानी मिलाएं। शाम को सभी पत्ती सतहों पर स्प्रे करें। हर 7-10 दिन दोहराएं। या: 500 ग्राम नीम पत्तियां 10 लीटर पानी में रात भर भिगोएं, छानकर स्प्रे करें। एफिड, व्हाइटफ्लाई, माइट्स पर प्रभावी।"
      },
      bn: {
        q: "নিম থেকে জৈব কীটনাশক বাড়িতে তৈরি?",
        a: "নিম তেল স্প্রে: ৫ মিলি নিম তেল + ২ মিলি তরল সাবান + ১ লিটার পানি মিশিয়ে নিন। বিকেলে সব পাতার পৃষ্ঠে স্প্রে করুন। প্রতি ৭–১০ দিনে পুনরাবৃত্তি করুন। অথবা: ৫০০ গ্রাম নিম পাতা ১০ লিটার পানিতে রাতভর ভিজিয়ে ছেঁকে স্প্রে করুন। জাব পোকা, সাদামাছি, মাইটে কার্যকর।"
      }
    },
    {
      id: 20, category: "general", tags: ["intercropping", "mixed", "companion", "সাথী ফসল"],
      en: {
        q: "What crops can I grow together (intercropping)?",
        a: "Good combinations: (1) Tomato + Basil — basil repels pests. (2) Maize + Beans + Squash ('Three Sisters') — beans fix nitrogen, squash covers ground. (3) Onion + Carrot — confuse each other's pests. (4) Paddy + Azolla — azolla fixes nitrogen. Avoid: tomato + fennel, onion + beans (they compete)."
      },
      hi: {
        q: "कौन सी फसलें एक साथ उगाई जा सकती हैं?",
        a: "अच्छे संयोजन: (1) टमाटर + तुलसी — तुलसी कीट भगाती है। (2) मक्का + बीन्स + कद्दू — बीन्स नाइट्रोजन बनाती है। (3) प्याज + गाजर — एक-दूसरे के कीट भगाते हैं। (4) धान + अजोला — अजोला नाइट्रोजन स्थिर करता है। बचें: टमाटर + सौंफ, प्याज + बीन्स।"
      },
      bn: {
        q: "কোন ফসলগুলো একসাথে চাষ করা যায়?",
        a: "ভালো সংমিশ্রণ: (1) টমেটো + তুলসী — তুলসী পোকা তাড়ায়। (2) ভুট্টা + মটর + কুমড়ো — মটর নাইট্রোজেন তৈরি করে। (3) পেঁয়াজ + গাজর — একে অপরের পোকা তাড়ায়। (4) ধান + অ্যাজোলা — অ্যাজোলা নাইট্রোজেন স্থির করে।"
      }
    }
  ];
  
  // ─── DIAGNOSIS DECISION TREE ───────────────────────────────
  export const DIAGNOSIS_TREE = {
    id: "start",
    en: { q: "What problem are you facing with your crop?" },
    hi: { q: "आपकी फसल में क्या समस्या है?" },
    bn: { q: "আপনার ফসলে কী সমস্যা হচ্ছে?" },
    options: [
      {
        en: "🍂 Leaves look unhealthy", hi: "🍂 पत्तियां अस्वस्थ लग रही हैं", bn: "🍂 পাতা অসুস্থ দেখাচ্ছে",
        next: {
          id: "leaves",
          en: { q: "What does the leaf look like?" },
          hi: { q: "पत्तियां कैसी दिख रही हैं?" },
          bn: { q: "পাতা কেমন দেখাচ্ছে?" },
          options: [
            {
              en: "💛 Yellow / Pale", hi: "💛 पीली / फीकी", bn: "💛 হলুদ / ফ্যাকাশে",
              next: {
                id: "yellow_leaves",
                en: { q: "Where are the yellow leaves?" },
                hi: { q: "पीली पत्तियां कहाँ हैं?" },
                bn: { q: "হলুদ পাতা কোথায়?" },
                options: [
                  {
                    en: "Bottom leaves first", hi: "पहले नीचे की पत्तियां", bn: "প্রথমে নিচের পাতা",
                    result: {
                      en: { title: "Nitrogen Deficiency", solution: "Apply urea fertilizer: 20–25 kg/acre for vegetables, 45 kg/acre for paddy. Split into 2 doses. Also check if soil is waterlogged — poor drainage blocks nitrogen uptake. Add compost to improve soil health long-term." },
                      hi: { title: "नाइट्रोजन की कमी", solution: "यूरिया उर्वरक डालें: सब्जियों के लिए 20-25 किग्रा/एकड़, धान के लिए 45 किग्रा/एकड़। 2 खुराकों में बांटें। जलभराव की भी जांच करें — खराब जल निकासी नाइट्रोजन अवशोषण रोकती है।" },
                      bn: { title: "নাইট্রোজেনের অভাব", solution: "ইউরিয়া সার দিন: সবজির জন্য ২০–২৫ কেজি/একর, ধানের জন্য ৪৫ কেজি/একর। ২ ভাগে দিন। জলাবদ্ধতা পরীক্ষা করুন — নিষ্কাশন খারাপ হলে নাইট্রোজেন শোষণ বাধাগ্রস্ত হয়।" }
                    }
                  },
                  {
                    en: "Top/young leaves first", hi: "पहले ऊपर की/नई पत्तियां", bn: "প্রথমে উপরের/নতুন পাতা",
                    result: {
                      en: { title: "Iron or Zinc Deficiency", solution: "Yellow young leaves = Iron OR Zinc deficiency. For Iron: spray Ferrous Sulfate (0.5%) on leaves. For Zinc: spray Zinc Sulfate (0.5%) or apply to soil (5 kg/acre). Check soil pH — above 7.5 locks up micronutrients. Lower pH with sulfur if needed." },
                      hi: { title: "आयरन या जिंक की कमी", solution: "युवा पत्तियों का पीलापन = आयरन या जिंक की कमी। आयरन के लिए: फेरस सल्फेट (0.5%) पत्तियों पर स्प्रे करें। जिंक के लिए: जिंक सल्फेट (0.5%) स्प्रे करें या मिट्टी में (5 किग्रा/एकड़) डालें। pH 7.5 से अधिक हो तो सल्फर से कम करें।" },
                      bn: { title: "আয়রন বা জিংকের অভাব", solution: "নতুন পাতা হলুদ = আয়রন বা জিংকের অভাব। আয়রনের জন্য: ফেরাস সালফেট (০.৫%) পাতায় স্প্রে করুন। জিংকের জন্য: জিংক সালফেট (০.৫%) স্প্রে বা মাটিতে (৫ কেজি/একর) দিন। pH ৭.৫-এর বেশি হলে সালফার দিয়ে কমান।" }
                    }
                  }
                ]
              }
            },
            {
              en: "🟤 Brown spots / patches", hi: "🟤 भूरे धब्बे", bn: "🟤 বাদামি দাগ",
              next: {
                id: "brown_spots",
                en: { q: "What do the brown spots look like?" },
                hi: { q: "भूरे धब्बे कैसे दिखते हैं?" },
                bn: { q: "বাদামি দাগগুলো কেমন দেখতে?" },
                options: [
                  {
                    en: "Round spots with yellow ring", hi: "पीले छल्ले के साथ गोल धब्बे", bn: "হলুদ বলয় সহ গোল দাগ",
                    result: {
                      en: { title: "Fungal Leaf Spot Disease", solution: "Fungal disease — spread by water splash. Remove affected leaves immediately. Spray Mancozeb (2.5g/L) or Copper Oxychloride (3g/L) every 10 days. Avoid overhead irrigation. Improve air circulation by pruning dense foliage. Do not compost infected leaves." },
                      hi: { title: "फफूंदी पत्ती धब्बा रोग", solution: "फफूंदी रोग — पानी के छींटों से फैलता है। प्रभावित पत्तियां तुरंत हटाएं। मैन्कोजेब (2.5 ग्राम/लीटर) या कॉपर ऑक्सीक्लोराइड (3 ग्राम/लीटर) हर 10 दिन स्प्रे करें। ऊपर से पानी देना बंद करें।" },
                      bn: { title: "ছত্রাকজনিত পাতার দাগ রোগ", solution: "ছত্রাক রোগ — পানির ছিটায় ছড়ায়। আক্রান্ত পাতা সঙ্গে সঙ্গে সরান। ম্যানকোজেব (২.৫ গ্রাম/লিটার) বা কপার অক্সিক্লোরাইড (৩ গ্রাম/লিটার) প্রতি ১০ দিনে স্প্রে করুন। উপর থেকে পানি দেওয়া বন্ধ করুন।" }
                    }
                  },
                  {
                    en: "Powdery white coating", hi: "सफेद पाउडर जैसी परत", bn: "সাদা পাউডারের আবরণ",
                    result: {
                      en: { title: "Powdery Mildew", solution: "Powdery mildew — common in dry weather with humid nights. Spray: mix 1 tbsp baking soda + 1 tsp neem oil + 1L water (organic option). Or use Sulfur dust (3g/L) or Hexaconazole (1ml/L). Improve air circulation. Avoid excess nitrogen fertilizer." },
                      hi: { title: "ख़स्ता फफूंदी (पाउडरी मिल्ड्यू)", solution: "शुष्क मौसम और नम रातों में सामान्य। स्प्रे: 1 बड़ा चम्मच बेकिंग सोडा + 1 चम्मच नीम तेल + 1 लीटर पानी (जैविक)। या सल्फर धूल (3 ग्राम/लीटर) या हेक्साकोनाजोल (1 मिली/लीटर)। वायु संचार बढ़ाएं।" },
                      bn: { title: "পাউডারি মিলডিউ (চূর্ণিল আসিতা)", solution: "শুষ্ক আবহাওয়ায় ও আর্দ্র রাতে সাধারণ। স্প্রে: ১ চামচ বেকিং সোডা + ১ চা চামচ নিম তেল + ১ লিটার পানি (জৈব)। বা সালফার ধুলা (৩ গ্রাম/লিটার) বা হেক্সাকোনাজোল (১ মিলি/লিটার)। বায়ু চলাচল বাড়ান।" }
                    }
                  }
                ]
              }
            },
            {
              en: "🌀 Curling / distorted", hi: "🌀 मुड़ी / विकृत", bn: "🌀 কুঁকড়ানো / বিকৃত",
              result: {
                en: { title: "Pest Infestation (Aphids/Mites/Thrips)", solution: "Curling leaves = sucking pests underneath. Check undersides with magnifying glass. See tiny bugs? Spray Imidacloprid (0.5ml/L) or neem oil (5ml/L). See fine webs? Spider mites — spray water forcefully, then Spiromesifen (1ml/L). Thrips (tiny slivers) — use blue sticky traps + Spinosad spray." },
                hi: { title: "कीट संक्रमण (एफिड/माइट/थ्रिप्स)", solution: "पत्तियां मुड़ना = नीचे चूसक कीट। आवर्धक कांच से पत्ती की पीठ देखें। छोटे कीड़े? इमिडाक्लोप्रिड (0.5 मिली/लीटर) या नीम तेल (5 मिली/लीटर) स्प्रे करें। महीन जाले? मकड़ी के कण — जोरदार पानी, फिर स्पिरोमेसिफेन (1 मिली/लीटर)।" },
                bn: { title: "পোকার আক্রমণ (জাব পোকা/মাইট/থ্রিপস)", solution: "পাতা কুঁকড়ানো = নিচে রস-চোষা পোকা। আতশ কাচ দিয়ে পাতার নিচ দেখুন। ছোট পোকা? ইমিডাক্লোপ্রিড (০.৫ মিলি/লিটার) বা নিম তেল (৫ মিলি/লিটার) স্প্রে করুন। সূক্ষ্ম জাল? মাকড়সা মাইট — জোরে পানি ছেটান তারপর স্পিরোমেসিফেন।" }
              }
            }
          ]
        }
      },
      {
        en: "🌊 Wilting / drooping plant", hi: "🌊 मुरझाना / लटकना", bn: "🌊 ঢলে পড়া",
        next: {
          id: "wilt",
          en: { q: "Is the soil wet or dry right now?" },
          hi: { q: "अभी मिट्टी गीली है या सूखी?" },
          bn: { q: "এখন মাটি ভেজা না শুকনো?" },
          options: [
            {
              en: "Soil is DRY", hi: "मिट्टी सूखी है", bn: "মাটি শুকনো",
              result: {
                en: { title: "Water Stress (Drought)", solution: "Water immediately but slowly — don't flood. Give 2–3 liters per plant. Mulch with straw/leaves to retain moisture. Water in morning only. For field crops: irrigate and apply anti-transpirant spray (Kaolin 5%) if available. Long-term: improve soil with compost for better water retention." },
                hi: { title: "पानी की कमी (सूखा)", solution: "तुरंत धीरे-धीरे पानी दें — बाढ़ न लाएं। प्रति पौधा 2-3 लीटर दें। नमी बनाए रखने के लिए पुआल/पत्तियों से गीला कचरा डालें। सुबह ही पानी दें। खेत की फसलों के लिए: सिंचाई करें और एंटी-ट्रांसपिरेंट स्प्रे करें।" },
                bn: { title: "পানির অভাব (খরা)", solution: "সঙ্গে সঙ্গে ধীরে ধীরে পানি দিন — বন্যা করবেন না। প্রতি গাছে ২–৩ লিটার দিন। আর্দ্রতা ধরে রাখতে খড়/পাতার মালচ দিন। শুধু সকালে পানি দিন। দীর্ঘমেয়াদে কম্পোস্ট দিয়ে মাটির পানি ধারণক্ষমতা বাড়ান।" }
              }
            },
            {
              en: "Soil is WET / waterlogged", hi: "मिट्टी गीली / जलभराव है", bn: "মাটি ভেজা / জলাবদ্ধ",
              result: {
                en: { title: "Root Rot or Wilt Disease", solution: "Wet soil + wilting = root rot or soil-borne wilt (Fusarium/Pythium). Stop watering immediately. Create drainage channels. Drench soil with Carbendazim (1g/L) + Copper Oxychloride (3g/L). Remove severely affected plants. For prevention: raised beds + well-drained soil is best solution." },
                hi: { title: "जड़ सड़न या उकठा रोग", solution: "गीली मिट्टी + मुरझाना = जड़ सड़न या मृदा जनित उकठा (फ्यूजेरियम/पाइथियम)। तुरंत पानी बंद करें। जल निकासी नाली बनाएं। कार्बेंडाजिम (1 ग्राम/लीटर) + कॉपर ऑक्सीक्लोराइड (3 ग्राम/लीटर) मिट्टी में डालें। गंभीर रूप से प्रभावित पौधे हटाएं।" },
                bn: { title: "শিকড় পচা বা উইল্ট রোগ", solution: "ভেজা মাটি + ঢলে পড়া = শিকড় পচা বা মাটিবাহিত উইল্ট (ফিউজেরিয়াম/পাইথিয়াম)। সঙ্গে সঙ্গে পানি বন্ধ করুন। নিষ্কাশন নালা তৈরি করুন। কার্বেন্ডাজিম (১ গ্রাম/লিটার) + কপার অক্সিক্লোরাইড (৩ গ্রাম/লিটার) মাটিতে ঢালুন।" }
              }
            }
          ]
        }
      },
      {
        en: "🐛 Insects / bugs visible", hi: "🐛 कीड़े दिखाई दे रहे हैं", bn: "🐛 পোকামাকড় দেখা যাচ্ছে",
        next: {
          id: "pest",
          en: { q: "Where are the insects?" },
          hi: { q: "कीड़े कहाँ हैं?" },
          bn: { q: "পোকা কোথায় আছে?" },
          options: [
            {
              en: "On leaves/stems (small)", hi: "पत्तियों/तनों पर (छोटे)", bn: "পাতা/কাণ্ডে (ছোট)",
              result: {
                en: { title: "Sap-Sucking Insects", solution: "Small soft insects on leaves = aphids, whitefly, or mealybug. Organic: spray neem oil (5ml) + soap (2ml) per liter. Chemical: Imidacloprid 0.5ml/L or Thiamethoxam 0.3g/L. For mealybug (white cotton): dab with cotton soaked in alcohol or spray with Profenofos. Apply in evening." },
                hi: { title: "रस चूसने वाले कीट", solution: "पत्तियों पर छोटे नरम कीड़े = एफिड, व्हाइटफ्लाई, या मिलीबग। जैविक: नीम तेल (5 मिली) + साबुन (2 मिली) प्रति लीटर स्प्रे। रासायनिक: इमिडाक्लोप्रिड 0.5 मिली/लीटर या थायमेथोक्सम 0.3 ग्राम/लीटर। मिलीबग के लिए: अल्कोहल में डूबे रुई से पोंछें।" },
                bn: { title: "রস-চোষা পোকা", solution: "পাতায় ছোট নরম পোকা = জাব পোকা, সাদামাছি বা মিলিবাগ। জৈব: নিম তেল (৫ মিলি) + সাবান (২ মিলি) প্রতি লিটারে। রাসায়নিক: ইমিডাক্লোপ্রিড ০.৫ মিলি/লিটার। মিলিবাগের জন্য: অ্যালকোহলে ভেজানো তুলো দিয়ে মুছুন।" }
              }
            },
            {
              en: "Holes in leaves / caterpillars", hi: "पत्तियों में छेद / कैटरपिलर", bn: "পাতায় ছিদ্র / শুঁয়াপোকা",
              result: {
                en: { title: "Caterpillar / Leaf-Eating Pest", solution: "Caterpillars eat leaves at night. Check undersides for eggs. Pick off by hand if few. Spray Bacillus thuringiensis (Bt) — organic and safe. Or Chlorpyrifos 2ml/L. For armyworm (large caterpillars in groups): spray Emamectin Benzoate 0.5g/L. Act quickly — they spread fast." },
                hi: { title: "कैटरपिलर / पत्ती खाने वाले कीट", solution: "कैटरपिलर रात को पत्तियां खाते हैं। अंडों के लिए पत्ती की पीठ जांचें। कम होने पर हाथ से तोड़ें। बैसिलस थुरिंजिएंसिस (Bt) स्प्रे करें — जैविक और सुरक्षित। या क्लोरपाइरीफॉस 2 मिली/लीटर। आर्मीवर्म के लिए: इमामेक्टिन बेंजोएट 0.5 ग्राम/लीटर।" },
                bn: { title: "শুঁয়াপোকা / পাতা-খাওয়া পোকা", solution: "শুঁয়াপোকা রাতে পাতা খায়। ডিমের জন্য পাতার নিচ দেখুন। কম হলে হাতে তুলুন। ব্যাসিলাস থুরিনজিয়েনসিস (Bt) স্প্রে করুন — জৈব ও নিরাপদ। বা ক্লোরপাইরিফস ২ মিলি/লিটার। আর্মিওয়ার্মে: ইমামেক্টিন বেনজোয়েট ০.৫ গ্রাম/লিটার।" }
              }
            }
          ]
        }
      },
      {
        en: "🌾 Poor growth / no fruit", hi: "🌾 कमजोर बढ़वार / फल नहीं", bn: "🌾 দুর্বল বৃদ্ধি / ফল নেই",
        result: {
          en: { title: "Nutritional or Pollination Issue", solution: "Weak growth: test soil pH (6–7 ideal). Apply balanced NPK fertilizer. Add compost. Ensure adequate sunlight (6+ hours). No fruit/flowers: check if pollinators present (hand pollinate if needed). Spray DAP (2%) solution for flowering. For vegetables: avoid excess nitrogen after flowering stage starts." },
          hi: { title: "पोषण या परागण समस्या", solution: "कमजोर बढ़वार: मिट्टी pH जांचें (6-7 आदर्श)। संतुलित NPK उर्वरक डालें। खाद मिलाएं। पर्याप्त धूप सुनिश्चित करें (6+ घंटे)। फल/फूल नहीं: परागणकर्ता हैं की नहीं जांचें (हाथ से परागण करें)। फूल के लिए DAP (2%) घोल स्प्रे करें।" },
          bn: { title: "পুষ্টিঘাটতি বা পরাগায়ন সমস্যা", solution: "দুর্বল বৃদ্ধি: মাটির pH পরীক্ষা করুন (৬–৭ আদর্শ)। সুষম NPK সার দিন। কম্পোস্ট মেশান। পর্যাপ্ত সূর্যালোক নিশ্চিত করুন (৬+ ঘন্টা)। ফল/ফুল নেই: পরাগায়নকারী আছে কিনা দেখুন (হাত দিয়ে পরাগায়ন করুন)। ফুলের জন্য DAP (২%) দ্রবণ স্প্রে করুন।" }
        }
      }
    ]
  };
  
  // ─── CROP CALENDAR ────────────────────────────────────────
  export const CROP_CALENDAR = {
    rice: {
      en: "Rice / Paddy", hi: "धान", bn: "ধান",
      icon: "🌾",
      months: [
        { month: "Jan", en: { activity: "Rabi harvest prep, dry season vegetables" }, hi: { activity: "रबी फसल तैयारी, शुष्क मौसम सब्जियां" }, bn: { activity: "রবি কাটার প্রস্তুতি, শুষ্ক মৌসুমের সবজি" } },
        { month: "Feb", en: { activity: "Nursery for early Boro rice" }, hi: { activity: "बोरो धान की नर्सरी" }, bn: { activity: "বোরো ধানের বীজতলা" } },
        { month: "Mar", en: { activity: "Boro rice transplanting" }, hi: { activity: "बोरो धान रोपाई" }, bn: { activity: "বোরো ধান রোপণ" } },
        { month: "Apr", en: { activity: "Boro tillering, weed control" }, hi: { activity: "बोरो कुशी, खरपतवार नियंत्रण" }, bn: { activity: "বোরো কুশি, আগাছা নিয়ন্ত্রণ" } },
        { month: "May", en: { activity: "Boro heading, 2nd fertilizer dose" }, hi: { activity: "बोरो बाली आना, 2री खाद" }, bn: { activity: "বোরো শীষ বের হওয়া, ২য় সার" } },
        { month: "Jun", en: { activity: "Boro harvest. Aus nursery. Land prep for Kharif" }, hi: { activity: "बोरो कटाई। औस नर्सरी। खरीफ भूमि तैयारी" }, bn: { activity: "বোরো কাটাই। আউস বীজতলা। খরিফের জমি প্রস্তুতি" } },
        { month: "Jul", en: { activity: "Kharif/Aman transplanting. Blast watch" }, hi: { activity: "खरीफ/अमन रोपाई। झुलसा सावधानी" }, bn: { activity: "আমন রোপণ। ব্লাস্ট সতর্কতা" } },
        { month: "Aug", en: { activity: "Weeding, N top-dress, BPH monitoring" }, hi: { activity: "निराई, नाइट्रोजन, BPH निगरानी" }, bn: { activity: "আগাছা, নাইট্রোজেন, BPH পর্যবেক্ষণ" } },
        { month: "Sep", en: { activity: "Panicle initiation. Potassium application" }, hi: { activity: "बाली बनना। पोटेशियम डालें" }, bn: { activity: "শীষ তৈরি। পটাশিয়াম দিন" } },
        { month: "Oct", en: { activity: "Grain filling. Reduce water gradually" }, hi: { activity: "दाना भरना। धीरे-धीरे पानी कम करें" }, bn: { activity: "দানা ভরা। ধীরে পানি কমান" } },
        { month: "Nov", en: { activity: "Aman harvest. Rabi land preparation" }, hi: { activity: "अमन कटाई। रबी भूमि तैयारी" }, bn: { activity: "আমন কাটাই। রবি জমি প্রস্তুতি" } },
        { month: "Dec", en: { activity: "Post harvest soil improvement. Boro nursery" }, hi: { activity: "कटाई बाद मिट्टी सुधार। बोरो नर्सरी" }, bn: { activity: "কাটাই পরবর্তী মাটি উন্নয়ন। বোরো বীজতলা" } }
      ]
    },
    wheat: {
      en: "Wheat", hi: "गेहूं", bn: "গম",
      icon: "🌿",
      months: [
        { month: "Jan", en: { activity: "Irrigation at crown root stage. Weed control" }, hi: { activity: "जड़ अवस्था में सिंचाई। खरपतवार नियंत्रण" }, bn: { activity: "মুকুট-শিকড় পর্যায়ে সেচ। আগাছা নিয়ন্ত্রণ" } },
        { month: "Feb", en: { activity: "2nd irrigation at tillering. Yellow rust watch" }, hi: { activity: "कुशी पर 2री सिंचाई। पीला रतुआ सावधानी" }, bn: { activity: "কুশিতে ২য় সেচ। হলুদ মরিচা সতর্কতা" } },
        { month: "Mar", en: { activity: "Heading stage. 3rd irrigation. Aphid watch" }, hi: { activity: "बाली अवस्था। तीसरी सिंचाई। एफिड निगरानी" }, bn: { activity: "শীষ পর্যায়। ৩য় সেচ। জাব পোকা নজর রাখুন" } },
        { month: "Apr", en: { activity: "Grain filling. Last irrigation. Harvest prep" }, hi: { activity: "दाना भरना। अंतिम सिंचाई। कटाई तैयारी" }, bn: { activity: "দানা ভরা। শেষ সেচ। কাটাইয়ের প্রস্তুতি" } },
        { month: "May", en: { activity: "Wheat harvest. Threshing and storage" }, hi: { activity: "गेहूं कटाई। दौनी और भंडारण" }, bn: { activity: "গম কাটাই। মাড়াই ও সংরক্ষণ" } },
        { month: "Jun-Oct", en: { activity: "Off season — soil rest, green manure, land preparation" }, hi: { activity: "बंद मौसम — मिट्टी आराम, हरी खाद, भूमि तैयारी" }, bn: { activity: "অফ সিজন — মাটি বিশ্রাম, সবুজ সার, জমি প্রস্তুতি" } },
        { month: "Nov", en: { activity: "Sow wheat (Nov 15 – Dec 5 for WB)" }, hi: { activity: "गेहूं बुवाई (15 नव - 5 दिसंबर)" }, bn: { activity: "গম বপন (১৫ নভে – ৫ ডিসেম্বর)" } },
        { month: "Dec", en: { activity: "Pre-sowing irrigation. 1st fertilizer dose" }, hi: { activity: "पूर्व-बुवाई सिंचाई। पहली खाद" }, bn: { activity: "বপন-পূর্ব সেচ। ১ম সার প্রয়োগ" } }
      ]
    },
    vegetables: {
      en: "Vegetables", hi: "सब्जियां", bn: "সবজি",
      icon: "🥦",
      months: [
        { month: "Jan", en: { activity: "Harvest tomato/cauliflower/cabbage. Sow summer cucurbits" }, hi: { activity: "टमाटर/फूलगोभी/पत्तागोभी कटाई। गर्मी कद्दू बुवाई" }, bn: { activity: "টমেটো/ফুলকপি কাটাই। গ্রীষ্মের কুমড়া বপন" } },
        { month: "Feb", en: { activity: "Transplant cucumber/bitter gourd. Harvest potato" }, hi: { activity: "खीरा/करेला रोपाई। आलू कटाई" }, bn: { activity: "শসা/করলা রোপণ। আলু কাটাই" } },
        { month: "Mar", en: { activity: "Sow okra, cowpea. Harvest onion" }, hi: { activity: "भिंडी, लोबिया बुवाई। प्याज कटाई" }, bn: { activity: "ঢেঁড়স, কাউপি বপন। পেঁয়াজ কাটাই" } },
        { month: "Apr", en: { activity: "Summer crop care. Heat stress management" }, hi: { activity: "गर्मी फसल देखभाल। गर्मी तनाव प्रबंधन" }, bn: { activity: "গ্রীষ্মের ফসলের যত্ন। তাপ চাপ ব্যবস্থাপনা" } },
        { month: "May", en: { activity: "Harvest okra/cucumber. Prepare Kharif nursery" }, hi: { activity: "भिंडी/खीरा कटाई। खरीफ नर्सरी तैयारी" }, bn: { activity: "ঢেঁড়স/শসা কাটাই। খরিফ বীজতলা প্রস্তুতি" } },
        { month: "Jun", en: { activity: "Sow/transplant brinjal, tomato (Kharif)" }, hi: { activity: "बैंगन, टमाटर (खरीफ) बुवाई/रोपाई" }, bn: { activity: "বেগুন, টমেটো (খরিফ) বপন/রোপণ" } },
        { month: "Jul", en: { activity: "Kharif vegetables care. Waterlogging prevention" }, hi: { activity: "खरीफ सब्जी देखभाल। जलभराव रोकें" }, bn: { activity: "খরিফ সবজি যত্ন। জলাবদ্ধতা রোধ" } },
        { month: "Aug", en: { activity: "Sow Rabi nursery (tomato, cabbage, cauliflower)" }, hi: { activity: "रबी नर्सरी बुवाई (टमाटर, पत्तागोभी, फूलगोभी)" }, bn: { activity: "রবি বীজতলা বপন (টমেটো, বাঁধাকপি, ফুলকপি)" } },
        { month: "Sep", en: { activity: "Transplant Rabi vegetables. Land preparation" }, hi: { activity: "रबी सब्जी रोपाई। भूमि तैयारी" }, bn: { activity: "রবি সবজি রোপণ। জমি প্রস্তুতি" } },
        { month: "Oct", en: { activity: "Sow potato, radish, carrot, spinach" }, hi: { activity: "आलू, मूली, गाजर, पालक बुवाई" }, bn: { activity: "আলু, মূলা, গাজর, পালং শাক বপন" } },
        { month: "Nov", en: { activity: "Rabi care. Onion transplanting" }, hi: { activity: "रबी देखभाल। प्याज रोपाई" }, bn: { activity: "রবি যত্ন। পেঁয়াজ রোপণ" } },
        { month: "Dec", en: { activity: "Harvest radish/spinach. Protect from frost" }, hi: { activity: "मूली/पालक कटाई। पाले से बचाव" }, bn: { activity: "মূলা/পালং কাটাই। শিলাবৃষ্টি থেকে রক্ষা" } }
      ]
    },
    fruits: {
      en: "Fruits", hi: "फल", bn: "ফল",
      icon: "🍎",
      months: [
        { month: "Jan", en: { activity: "Mango flowering. Banana bunch cover" }, hi: { activity: "आम में फूल आना। केले के गुच्छे ढकें" }, bn: { activity: "আম ফুল ফোটে। কলার থোকা ঢাকুন" } },
        { month: "Feb", en: { activity: "Mango fruit set. Spray micronutrients" }, hi: { activity: "आम में फल लगना। सूक्ष्म पोषक तत्व स्प्रे" }, bn: { activity: "আমে ফল ধরা। সূক্ষ্মপুষ্টি স্প্রে" } },
        { month: "Mar", en: { activity: "Mango thinning if excess fruit. Irrigation" }, hi: { activity: "अधिक फल हो तो आम फल पतलाना। सिंचाई" }, bn: { activity: "অতিরিক্ত ফল হলে আম পাতলা করুন। সেচ" } },
        { month: "Apr", en: { activity: "Mango fruit development. Watch for hoppers" }, hi: { activity: "आम फल विकास। हॉपर कीट सावधानी" }, bn: { activity: "আম ফল বিকাশ। হপার পোকা সতর্কতা" } },
        { month: "May", en: { activity: "Mango harvest (early varieties). Banana planting" }, hi: { activity: "आम कटाई (अगेती किस्में)। केला रोपाई" }, bn: { activity: "আম কাটাই (আগাম জাত)। কলা রোপণ" } },
        { month: "Jun", en: { activity: "Main mango harvest. Papaya planting" }, hi: { activity: "मुख्य आम कटाई। पपीता रोपाई" }, bn: { activity: "মূল আম কাটাই। পেঁপে রোপণ" } },
        { month: "Jul", en: { activity: "Post-harvest mango pruning. Banana care" }, hi: { activity: "कटाई बाद आम छंटाई। केला देखभाल" }, bn: { activity: "কাটাই পরবর্তী আম ছাঁটাই। কলার যত্ন" } },
        { month: "Aug", en: { activity: "Mango new flush. Apply fertilizer" }, hi: { activity: "आम नई पत्तियां। खाद डालें" }, bn: { activity: "আমের নতুন পাতা। সার দিন" } },
        { month: "Sep", en: { activity: "Banana bunch emergence. Papaya fruiting" }, hi: { activity: "केला गुच्छा निकलना। पपीता फल लगना" }, bn: { activity: "কলার থোকা বের হওয়া। পেঁপে ফল ধরা" } },
        { month: "Oct", en: { activity: "Mango rest period. Reduce irrigation" }, hi: { activity: "आम आराम काल। सिंचाई कम करें" }, bn: { activity: "আমের বিশ্রামকাল। সেচ কমান" } },
        { month: "Nov", en: { activity: "Banana harvest. Mango pre-flowering" }, hi: { activity: "केला कटाई। आम पूर्व-फूल अवस्था" }, bn: { activity: "কলা কাটাই। আমের ফুল-পূর্ব অবস্থা" } },
        { month: "Dec", en: { activity: "Mango panicle emergence. Apply K fertilizer" }, hi: { activity: "आम बौर निकलना। K खाद डालें" }, bn: { activity: "আমের মুকুল বের হওয়া। K সার দিন" } }
      ]
    }
  };
  
  // ─── EMERGENCY DISEASE QUICK GUIDE ───────────────────────
  export const EMERGENCY_GUIDE = [
    {
      id: "e1", crop: "rice", severity: "high",
      en: { name: "Rice Blast", symptoms: "Diamond-shaped gray lesions on leaves; neck rot at panicle", immediate: "Spray Tricyclazole 75WP (0.6g/L) immediately. Drain field 2 days before spraying. Repeat after 10 days." },
      hi: { name: "धान झुलसा", symptoms: "पत्तियों पर हीरे के आकार के भूरे-सफेद धब्बे; बाली की गर्दन पर सड़न", immediate: "तुरंत ट्राईसाइक्लाजोल 75WP (0.6 ग्राम/लीटर) स्प्रे करें। 2 दिन पानी निकालें। 10 दिन बाद दोबारा।" },
      bn: { name: "ধান ব্লাস্ট", symptoms: "পাতায় হীরা আকৃতির ধূসর দাগ; শীষের গোড়ায় পচন", immediate: "সঙ্গে সঙ্গে ট্রাইসাইক্লাজোল ৭৫WP (০.৬ গ্রাম/লিটার) স্প্রে করুন। ২ দিন পানি বের করুন। ১০ দিন পর আবার।" }
    },
    {
      id: "e2", crop: "rice", severity: "high",
      en: { name: "Brown Plant Hopper (BPH)", symptoms: "Circular burned patches (hopperburn), milky stem base, plants lodging", immediate: "Drain field immediately. Spray Buprofezin (1ml/L) or Thiamethoxam. Never use synthetic pyrethroids — they make BPH worse." },
      hi: { name: "भूरा पौध फुदका (BPH)", symptoms: "गोल जले हुए धब्बे, दूधिया तना, गिरे पौधे", immediate: "तुरंत खेत में पानी निकालें। बुप्रोफेजिन (1 मिली/लीटर) या थायमेथोक्सम स्प्रे करें। सिंथेटिक पायरेथ्रॉयड कभी नहीं।" },
      bn: { name: "বাদামি গাছ ফড়িং (BPH)", symptoms: "গোলাকার পোড়া দাগ, দুধসাদা কাণ্ড, গাছ শুয়ে পড়া", immediate: "সঙ্গে সঙ্গে জমির পানি বের করুন। বুপ্রোফেজিন (১ মিলি/লিটার) বা থায়ামেথোক্সাম স্প্রে করুন।" }
    },
    {
      id: "e3", crop: "wheat", severity: "high",
      en: { name: "Yellow Stripe Rust", symptoms: "Bright yellow powdery stripes along leaf veins in cool weather", immediate: "Spray Propiconazole 25EC (1ml/L) or Tebuconazole immediately. Repeat after 15 days. Use resistant variety next season." },
      hi: { name: "पीला रतुआ (Yellow Rust)", symptoms: "ठंड में पत्तियों की नसों के साथ चमकदार पीले पाउडर की धारियां", immediate: "प्रोपिकोनाजोल 25EC (1 मिली/लीटर) या टेबुकोनाजोल तुरंत स्प्रे करें। 15 दिन बाद दोबारा।" },
      bn: { name: "হলুদ মরিচা (Yellow Rust)", symptoms: "ঠান্ডায় পাতার শিরা বরাবর উজ্জ্বল হলুদ গুঁড়ার ডোরা", immediate: "সঙ্গে সঙ্গে প্রোপিকোনাজোল ২৫EC (১ মিলি/লিটার) বা টেবুকোনাজোল স্প্রে করুন। ১৫ দিন পর আবার।" }
    },
    {
      id: "e4", crop: "vegetables", severity: "medium",
      en: { name: "Tomato Early Blight", symptoms: "Dark brown concentric rings on lower leaves, defoliation upward", immediate: "Remove affected leaves. Spray Mancozeb 75WP (2.5g/L) + sticker. Repeat every 7 days. Stake plants for air circulation." },
      hi: { name: "टमाटर अगेती झुलसा", symptoms: "नीचे की पत्तियों पर गहरे भूरे गोल छल्ले, ऊपर की ओर पत्ते झड़ना", immediate: "प्रभावित पत्तियां हटाएं। मैन्कोजेब 75WP (2.5 ग्राम/लीटर) + चिपकने वाला स्प्रे करें। हर 7 दिन दोहराएं।" },
      bn: { name: "টমেটো আর্লি ব্লাইট", symptoms: "নিচের পাতায় গাঢ় বাদামি কেন্দ্রীভূত বলয়, উপরের দিকে পাতা ঝরা", immediate: "আক্রান্ত পাতা সরান। ম্যানকোজেব ৭৫WP (২.৫ গ্রাম/লিটার) + আঠা স্প্রে করুন। প্রতি ৭ দিনে করুন।" }
    },
    {
      id: "e5", crop: "fruits", severity: "high",
      en: { name: "Mango Anthracnose", symptoms: "Black irregular spots on leaves, flowers, and fruits; fruit rot at harvest", immediate: "Spray Carbendazim (1g/L) + Mancozeb (2.5g/L) before and after flowering. Do hot-water treatment (52°C, 5 min) on harvested fruit." },
      hi: { name: "आम एन्थ्रेकनोज", symptoms: "पत्तियों, फूलों और फलों पर काले अनियमित धब्बे; कटाई पर फल सड़न", immediate: "फूल आने से पहले और बाद में कार्बेंडाजिम (1 ग्राम/लीटर) + मैन्कोजेब (2.5 ग्राम/लीटर) स्प्रे करें।" },
      bn: { name: "আম অ্যান্থ্রাকনোজ", symptoms: "পাতা, ফুল ও ফলে কালো অনিয়মিত দাগ; কাটাইয়ে ফল পচন", immediate: "ফুল আসার আগে ও পরে কার্বেন্ডাজিম (১ গ্রাম/লিটার) + ম্যানকোজেব (২.৫ গ্রাম/লিটার) স্প্রে করুন।" }
    }
  ];
  
  // ─── FERTILIZER REFERENCE TABLE ──────────────────────────
  export const FERTILIZER_GUIDE = {
    rice: {
      en: { crop: "Rice/Paddy", n: "45–60", p: "20–30", k: "20–30", notes: "Split N: 50% basal, 25% tillering, 25% panicle. Apply Zinc Sulfate 5kg/acre if deficient." },
      hi: { crop: "धान", n: "45–60", p: "20–30", k: "20–30", notes: "N विभाजन: 50% बेसल, 25% कुशी, 25% बाली। कमी हो तो जिंक सल्फेट 5 किग्रा/एकड़।" },
      bn: { crop: "ধান", n: "৪৫–৬০", p: "২০–৩০", k: "২০–৩০", notes: "N ভাগ: ৫০% বেসাল, ২৫% কুশি, ২৫% শীষে। ঘাটতিতে জিংক সালফেট ৫ কেজি/একর।" }
    },
    wheat: {
      en: { crop: "Wheat", n: "50–60", p: "25–30", k: "20", notes: "50% N as basal, 50% at first irrigation. Full P and K as basal dose only." },
      hi: { crop: "गेहूं", n: "50–60", p: "25–30", k: "20", notes: "50% N बेसल में, 50% पहली सिंचाई पर। पूरा P और K केवल बेसल के रूप में।" },
      bn: { crop: "গম", n: "৫০–৬০", p: "২৫–৩০", k: "২০", notes: "৫০% N বেসালে, ৫০% ১ম সেচে। সম্পূর্ণ P ও K শুধু বেসালে।" }
    },
    tomato: {
      en: { crop: "Tomato", n: "60–80", p: "40–50", k: "50–60", notes: "High K for fruit quality. Foliar spray of calcium nitrate (1%) at fruit set to prevent BER." },
      hi: { crop: "टमाटर", n: "60–80", p: "40–50", k: "50–60", notes: "फल गुणवत्ता के लिए K अधिक। फल लगने पर कैल्शियम नाइट्रेट (1%) पत्ती स्प्रे।" },
      bn: { crop: "টমেটো", n: "৬০–৮০", p: "৪০–৫০", k: "৫০–৬০", notes: "ফলের মানের জন্য বেশি K। ফল ধরলে ক্যালসিয়াম নাইট্রেট (১%) পাতায় স্প্রে।" }
    },
    potato: {
      en: { crop: "Potato", n: "60–80", p: "50–60", k: "80–100", notes: "Potato needs the most K of all crops. Apply in 3 splits. Use MOP or SOP for potassium." },
      hi: { crop: "आलू", n: "60–80", p: "50–60", k: "80–100", notes: "आलू को सभी फसलों में सबसे अधिक K चाहिए। 3 बार में डालें। MOP या SOP उपयोग करें।" },
      bn: { crop: "আলু", n: "৬০–৮০", p: "৫০–৬০", k: "৮০–১০০", notes: "আলুতে সব ফসলের মধ্যে সবচেয়ে বেশি K লাগে। ৩ ভাগে দিন। MOP বা SOP ব্যবহার করুন।" }
    }
  };
  
  export const CATEGORIES = [
    { id: "soil",       en: "Soil",       hi: "मिट्टी",    bn: "মাটি",   icon: "🌱" },
    { id: "water",      en: "Water",      hi: "पानी",       bn: "পানি",   icon: "💧" },
    { id: "rice",       en: "Rice",       hi: "धान",        bn: "ধান",    icon: "🌾" },
    { id: "wheat",      en: "Wheat",      hi: "गेहूं",      bn: "গম",     icon: "🌿" },
    { id: "vegetables", en: "Vegetables", hi: "सब्जियां",   bn: "সবজি",  icon: "🥦" },
    { id: "fruits",     en: "Fruits",     hi: "फल",         bn: "ফল",     icon: "🍎" },
    { id: "fertilizer", en: "Fertilizer", hi: "खाद",        bn: "সার",    icon: "🧪" },
    { id: "general",    en: "General",    hi: "सामान्य",    bn: "সাধারণ", icon: "📖" },
  ];