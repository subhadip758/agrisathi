const landingTranslations = {
    page: {
      en: {
        /* ── Splash ── */
        splash: {
          loadingWords: ['Crop Intelligence', 'Soil Analysis', 'Disease Detection', 'Smart Irrigation', 'Market Insights'],
          tagline: 'Smart Agriculture Platform',
          loading: 'Loading',
        },
  
        /* ── Nav ── */
        nav: {
          about: 'About',
          features: 'Features',
          services: 'Services',
          governance: 'Governance',
          contact: 'Contact',
          login: 'Login',
          getStarted: 'Get Started',
        },
  
        /* ── Hero ── */
        hero: {
          badge: '🌾 Smart Agriculture Platform',
          heading1: 'Empowering Farmers with',
          heading2: 'Advanced',
          heading3: 'Tools & Services',
          desc: 'AgriSathi is a pioneering digital platform designed to revolutionize agricultural practices. Bridging traditional farming wisdom with cutting-edge AI, weather analytics, and real-time crop intelligence — right in your hands.',
          ctaPrimary: 'Get Started Free',
          ctaSecondary: 'Explore Features',
        },
  
        /* ── Rating ── */
        rating: {
          title: '⭐ Rate Your Experience',
          question: 'How would you rate AgriSathi?',
          selected: 'You selected:',
          whatsRating: 'What are you rating?',
          selected_count: 'selected',
          placeholder: 'Tell us more about your {{label}} experience...',
          submit: 'Submit {{label}} Review',
          noRating: 'Select a Rating First',
          submitting: '⏳ Submitting...',
          thanks: 'Thank you for your feedback!',
          youRated: 'You rated us',
          helpText: 'Your feedback helps us improve AgriSathi for every farmer.',
          rateAgain: 'Rate Again',
          starLabels: ['Poor', 'Fair', 'Good', 'Great', 'Excellent'],
          categories: ['Crop Advice', 'Soil Analysis', 'Disease Detection', 'Weather Info', 'Govt. Schemes', 'Overall App'],
        },
  
        /* ── Video ── */
        video: {
          sectionLabel: '▶️ See AgriSathi in Action',
          heading: 'Watch How AgriSathi Works',
          desc: 'See how farmers are using AgriSathi to grow smarter, save more, and access government schemes instantly.',
          loadingText: 'Loading Video…',
          liveDemo: 'LIVE DEMO',
          version: 'AgriSathi v2.0',
          caption: 'AgriSathi — Smart Agriculture Platform',
          madeFor: "Made for India's Farmers 🇮🇳",
          chips: ['🌾 Crop Planning', '🧪 Soil Analysis', '🐛 Disease Detection', '💧 Smart Irrigation', '💰 Govt. Schemes'],
        },
  
        /* ── About ── */
        about: {
          label: '🌿 About AgriSathi',
          heading: 'What is AgriSathi?',
          desc: 'AgriSathi (Agriculture Friend) is a pioneering digital platform designed to revolutionize agricultural practices across India. By bridging traditional farming wisdom with cutting-edge AI, AgriSathi addresses the critical challenges facing modern agriculture.',
          floatTitle: 'Data-Driven',
          floatSub: 'AI-powered crop analytics',
          items: [
            { icon: '🤖', title: 'Advanced Agricultural Technology', desc: 'Comprehensive AI-powered digital solutions for every farmer, from crop planning to harvest.' },
            { icon: '📈', title: 'Data-Driven Insights',            desc: 'Empowering agricultural professionals with real-time, actionable intelligence.' },
            { icon: '🌍', title: 'Sustainable Development',         desc: 'Promoting eco-friendly and economically viable farming practices for future generations.' },
          ],
        },
  
        /* ── Features ── */
        features: {
          label: '⚡ Core Features',
          heading: 'Everything a Farmer Needs',
          desc: 'AgriSathi is constantly evolving. From AI crop recommendations to government scheme applications — all in one place.',
          items: [
            { icon: '🌾', iconBg: '#e8f5e9', tag: 'AI Powered',      title: 'Crop Recommendation',  desc: 'AI-powered crop suggestions based on your soil type, climate, water availability, and market trends. Get personalised planting calendars.' },
            { icon: '🧪', iconBg: '#fff8e1', tag: 'Lab Integrated',   title: 'Soil Health Analysis', desc: 'Digital soil lab reports, real-time soil health card tracking, and targeted fertiliser input recommendations to maximise yield.' },
            { icon: '🐛', iconBg: '#fdecea', tag: 'Image AI',         title: 'Disease Detection',    desc: 'Upload a photo of your crop — our AI instantly identifies pests, diseases, and stress symptoms with expert-verified treatment plans.' },
            { icon: '💧', iconBg: '#e3f2fd', tag: 'IoT Ready',        title: 'Smart Irrigation',     desc: 'Weather-based irrigation advisories, automated scheduling based on crop growth stage, and water efficiency tracking for every plot.' },
            { icon: '🌦️', iconBg: '#f3e5f5', tag: 'Real-Time',       title: 'Weather Advisory',     desc: '10-day hyper-local forecasts, extreme weather alerts, sowing and harvest windows — all tailored to your exact farm location.' },
            { icon: '💰', iconBg: '#fff3e0', tag: 'Govt. Integrated', title: 'Scheme & Subsidy',     desc: 'Discover eligible government schemes, apply online, track status, and receive PM-KISAN, crop insurance, and subsidy payments seamlessly.' },
          ],
        },
  
        /* ── Services ── */
        services: [
          {
            emoji: '🌦️', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
            label: '🌤️ Weather Intelligence',
            title: 'Weather-Based Crop Advisories',
            desc: 'Receive localised, real-time weather intelligence that directly guides your farming decisions — from when to sow and irrigate, to when to apply fertilisers and protect your crops.',
            bullets: ['10-day localised weather forecast', 'Sowing & harvest window recommendations', 'Irrigation scheduling based on rainfall', 'Fertiliser input adjustments for weather', 'Frost, flood, and drought early warnings'],
            cta: '🌤️ View Weather Dashboard', ctaTo: '/weather',
          },
          {
            emoji: '🐛', bg: 'linear-gradient(135deg,#fdecea,#ffcdd2)',
            label: '🔬 Crop Protection',
            title: 'Crop Protection & Pest Solutions',
            desc: 'Stay ahead of crop threats with AI-driven pest forewarning, disease alerts, and expert-backed recommendations — personalised for your specific crops and location.',
            bullets: ['AI photo-based disease & pest identification', 'Forewarning alerts for seasonal pest outbreaks', 'Extreme weather crop stress alerts', 'In-app Plant Doctor consultation', 'Organic and chemical treatment recommendations'],
            cta: '🐛 Detect Disease Now', ctaTo: '/disease-detection', reverse: true, altBg: true,
          },
          {
            emoji: '🛰️', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
            label: '🤖 AI & Remote Sensing',
            title: "Power of AI & Remote Sensing in Every Farmer's Hand",
            desc: "Satellite-based crop health monitoring, yield estimation, and AI-driven insights — once only available to large agribusinesses — now accessible to every small farmer.",
            bullets: ['Satellite field health monitoring (NDVI)', 'Accurate yield estimation before harvest', 'Early issue detection with remote sensing', 'Agronomy expert consultations in-app', 'Soil lab testing service integration'],
            cta: '🛰️ Explore AI Tools', ctaTo: '/crop-recommendation',
          },
        ],
  
        /* ── Governance ── */
        governance: {
          label: '🏛️ Smart Governance',
          heading: 'AgriSathi Optimising Governance',
          desc: 'AgriSathi equips government agencies with advanced IT tools for data management, analytics, and workflow automation — enhancing efficiency and real-time decision-making.',
          cards: [
            { icon: '⚙️', title: 'Smart Workflow Management', desc: 'Utilise the vast agri-database to power digital workflows, simplifying access to agricultural schemes and improving efficiency.' },
            { icon: '🚨', title: 'Disaster Preparedness',      desc: 'Coordinate rapid, effective responses to agricultural challenges like droughts, floods, and pest outbreaks through timely alerts.' },
            { icon: '📊', title: 'Data-Driven Intelligence',   desc: 'Transform complex agricultural data — crop analytics, production statistics — into actionable insights for evidence-based policy.' },
            { icon: '📋', title: 'Policy Implementation',      desc: 'Streamline scheme enrollment, beneficiary tracking, and subsidy disbursement through a single unified digital platform.' },
            { icon: '👥', title: 'Unified Farmer Database',    desc: 'Maintain a real-time, comprehensive database of farmers facilitating targeted outreach, program tracking, and personalised support.' },
            { icon: '🔗', title: 'Market Linkage',             desc: 'Source produce directly from farmers via e-markets, ensuring best quality and price. Bulk orders managed efficiently at scale.' },
          ],
          principlesHeading: 'Guiding Principles',
          principles: [
            { icon: '🌾', title: 'Farmer First',       desc: "Every feature, every decision — designed with the farmer's welfare and ease of use at the centre." },
            { icon: '📡', title: 'Real-Time Data',     desc: 'Live weather, market prices, and crop alerts ensure farmers always act on the most current information.' },
            { icon: '🌍', title: 'Sustainable Farming',desc: 'Eco-friendly practices that protect soil health, water resources, and biodiversity for future generations.' },
            { icon: '🤝', title: 'Inclusive Growth',   desc: 'Available in multiple regional languages — ensuring every farmer, regardless of education, can benefit.' },
          ],
        },
  
        /* ── Helpdesk ── */
        helpdesk: {
          heading: 'Help Desk & Support',
          desc: 'Reach our agricultural experts and support team any time of day',
          cards: [
            { icon: '📞', label: 'Helpline Number', val: '1800-123-4567', href: 'tel:18001234567' },
            { icon: '☎️', label: 'Alternate Line',  val: '1800-123-4568', href: 'tel:18001234568' },
            { icon: '📧', label: 'Email Support',   val: 'support@agrisathi.in', href: 'mailto:support@agrisathi.in' },
            { icon: '💬', label: 'Live Chat',       val: 'Chat with Expert', href: '#' },
          ],
        },
  
        /* ── Footer ── */
        footer: {
          tagline: "A pioneering digital platform connecting farmers, technology, and agricultural innovation. Empowering India's farming community with AI-powered tools and government services.",
          ministry: "Ministry of Agriculture & Farmers Welfare, Govt. of India",
          copyright: '© 2026 AgriSathi. All rights reserved.',
          madeFor: "Designed for India's farmers 🇮🇳",
          cols: [
            { h: 'Platform',   links: ['Crop Recommendation', 'Soil Analysis', 'Disease Detection', 'Smart Irrigation', 'Weather Advisory'] },
            { h: 'Government', links: ['PM-KISAN', 'Fasal Bima', 'Soil Health Card', 'Agri Loans', 'Subsidy Portal'] },
            { h: 'Support',    links: ['Help Desk', 'Expert Helpline', 'User Guide', 'Privacy Policy', 'Terms of Use'] },
          ],
        },
      },
  
      /* ════════════════════════════════════════════════════════
         HINDI
      ════════════════════════════════════════════════════════ */
      hi: {
        splash: {
          loadingWords: ['फसल बुद्धिमत्ता', 'मिट्टी विश्लेषण', 'रोग पहचान', 'स्मार्ट सिंचाई', 'बाजार जानकारी'],
          tagline: 'स्मार्ट कृषि प्लेटफॉर्म',
          loading: 'लोड हो रहा है',
        },
        nav: {
          about: 'परिचय', features: 'विशेषताएं', services: 'सेवाएं',
          governance: 'शासन', contact: 'संपर्क', login: 'लॉगिन', getStarted: 'शुरू करें',
        },
        hero: {
          badge: '🌾 स्मार्ट कृषि प्लेटफॉर्म',
          heading1: 'किसानों को सशक्त बनाना',
          heading2: 'उन्नत',
          heading3: 'उपकरण और सेवाओं के साथ',
          desc: 'AgriSathi एक अग्रणी डिजिटल प्लेटफॉर्म है जो कृषि प्रथाओं में क्रांति लाने के लिए बनाया गया है। पारंपरिक कृषि ज्ञान को अत्याधुनिक AI, मौसम विश्लेषण और रियल-टाइम फसल जानकारी से जोड़ता है।',
          ctaPrimary: 'मुफ़्त शुरू करें',
          ctaSecondary: 'विशेषताएं देखें',
        },
        rating: {
          title: '⭐ अपना अनुभव रेट करें',
          question: 'आप AgriSathi को कैसे रेट करेंगे?',
          selected: 'आपने चुना:',
          whatsRating: 'आप क्या रेट कर रहे हैं?',
          selected_count: 'चुने गए',
          placeholder: 'अपने {{label}} अनुभव के बारे में बताएं...',
          submit: '{{label}} समीक्षा सबमिट करें',
          noRating: 'पहले रेटिंग चुनें',
          submitting: '⏳ सबमिट हो रहा है...',
          thanks: 'आपकी प्रतिक्रिया के लिए धन्यवाद!',
          youRated: 'आपने हमें रेट किया',
          helpText: 'आपकी प्रतिक्रिया हमें हर किसान के लिए AgriSathi को बेहतर बनाने में मदद करती है।',
          rateAgain: 'फिर से रेट करें',
          starLabels: ['खराब', 'ठीक', 'अच्छा', 'बहुत अच्छा', 'उत्कृष्ट'],
          categories: ['फसल सलाह', 'मिट्टी विश्लेषण', 'रोग पहचान', 'मौसम जानकारी', 'सरकारी योजनाएं', 'समग्र ऐप'],
        },
        video: {
          sectionLabel: '▶️ AgriSathi को एक्शन में देखें',
          heading: 'देखें AgriSathi कैसे काम करता है',
          desc: 'देखें कि किसान AgriSathi का उपयोग करके कैसे स्मार्ट तरीके से उगाते हैं, बचत करते हैं और सरकारी योजनाओं का लाभ उठाते हैं।',
          loadingText: 'वीडियो लोड हो रहा है…',
          liveDemo: 'लाइव डेमो',
          version: 'AgriSathi v2.0',
          caption: 'AgriSathi — स्मार्ट कृषि प्लेटफॉर्म',
          madeFor: 'भारत के किसानों के लिए बनाया गया 🇮🇳',
          chips: ['🌾 फसल योजना', '🧪 मिट्टी विश्लेषण', '🐛 रोग पहचान', '💧 स्मार्ट सिंचाई', '💰 सरकारी योजनाएं'],
        },
        about: {
          label: '🌿 AgriSathi के बारे में',
          heading: 'AgriSathi क्या है?',
          desc: 'AgriSathi (कृषि मित्र) एक अग्रणी डिजिटल प्लेटफॉर्म है जो पूरे भारत में कृषि प्रथाओं में क्रांति लाने के लिए बनाया गया है। AI और पारंपरिक ज्ञान को जोड़कर AgriSathi आधुनिक कृषि की चुनौतियों का समाधान करता है।',
          floatTitle: 'डेटा-संचालित',
          floatSub: 'AI-संचालित फसल विश्लेषण',
          items: [
            { icon: '🤖', title: 'उन्नत कृषि तकनीक',    desc: 'फसल योजना से लेकर कटाई तक हर किसान के लिए AI-संचालित समाधान।' },
            { icon: '📈', title: 'डेटा-संचालित जानकारी', desc: 'कृषि पेशेवरों को रियल-टाइम, कार्यकारी जानकारी से सशक्त बनाना।' },
            { icon: '🌍', title: 'टिकाऊ विकास',          desc: 'भविष्य की पीढ़ियों के लिए पर्यावरण अनुकूल कृषि प्रथाओं को बढ़ावा देना।' },
          ],
        },
        features: {
          label: '⚡ मुख्य विशेषताएं',
          heading: 'किसान को जो चाहिए वो सब',
          desc: 'AI फसल सिफारिशों से लेकर सरकारी योजना आवेदनों तक — सब एक ही जगह।',
          items: [
            { icon: '🌾', iconBg: '#e8f5e9', tag: 'AI संचालित',     title: 'फसल सिफारिश',      desc: 'मिट्टी के प्रकार, जलवायु और बाजार के रुझानों के आधार पर AI-संचालित फसल सुझाव।' },
            { icon: '🧪', iconBg: '#fff8e1', tag: 'लैब एकीकृत',     title: 'मिट्टी स्वास्थ्य',  desc: 'डिजिटल मिट्टी लैब रिपोर्ट और उत्पादन अधिकतम करने के लिए उर्वरक सिफारिशें।' },
            { icon: '🐛', iconBg: '#fdecea', tag: 'इमेज AI',         title: 'रोग पहचान',         desc: 'फसल की फोटो अपलोड करें — AI तुरंत कीट, रोग और उपचार की पहचान करता है।' },
            { icon: '💧', iconBg: '#e3f2fd', tag: 'IoT तैयार',       title: 'स्मार्ट सिंचाई',    desc: 'मौसम-आधारित सिंचाई सलाह और स्वचालित शेड्यूलिंग।' },
            { icon: '🌦️', iconBg: '#f3e5f5', tag: 'रियल-टाइम',      title: 'मौसम सलाह',         desc: '10-दिवसीय स्थानीय पूर्वानुमान और चरम मौसम अलर्ट।' },
            { icon: '💰', iconBg: '#fff3e0', tag: 'सरकार एकीकृत',   title: 'योजना और सब्सिडी',  desc: 'सरकारी योजनाओं के लिए आवेदन करें और PM-KISAN, फसल बीमा भुगतान प्राप्त करें।' },
          ],
        },
        services: [
          {
            emoji: '🌦️', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
            label: '🌤️ मौसम बुद्धिमत्ता',
            title: 'मौसम-आधारित फसल सलाह',
            desc: 'स्थानीय, रियल-टाइम मौसम जानकारी प्राप्त करें जो आपके कृषि निर्णयों को सीधे निर्देशित करती है।',
            bullets: ['10-दिवसीय स्थानीय मौसम पूर्वानुमान', 'बुवाई और कटाई की सिफारिशें', 'वर्षा-आधारित सिंचाई शेड्यूलिंग', 'मौसम के लिए उर्वरक समायोजन', 'पाला, बाढ़ और सूखा चेतावनी'],
            cta: '🌤️ मौसम डैशबोर्ड देखें', ctaTo: '/weather',
          },
          {
            emoji: '🐛', bg: 'linear-gradient(135deg,#fdecea,#ffcdd2)',
            label: '🔬 फसल सुरक्षा',
            title: 'फसल सुरक्षा और कीट समाधान',
            desc: 'AI-संचालित कीट चेतावनी और विशेषज्ञ सिफारिशों के साथ फसल खतरों से आगे रहें।',
            bullets: ['AI फोटो-आधारित रोग और कीट पहचान', 'मौसमी कीट प्रकोप अलर्ट', 'चरम मौसम फसल तनाव अलर्ट', 'इन-ऐप प्लांट डॉक्टर परामर्श', 'जैविक और रासायनिक उपचार सिफारिशें'],
            cta: '🐛 अभी रोग पहचानें', ctaTo: '/disease-detection', reverse: true, altBg: true,
          },
          {
            emoji: '🛰️', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
            label: '🤖 AI और रिमोट सेंसिंग',
            title: 'हर किसान की हथेली में AI और रिमोट सेंसिंग की शक्ति',
            desc: 'सैटेलाइट-आधारित फसल स्वास्थ्य निगरानी और AI-संचालित जानकारी — अब हर छोटे किसान के लिए उपलब्ध।',
            bullets: ['सैटेलाइट फील्ड स्वास्थ्य निगरानी (NDVI)', 'कटाई से पहले सटीक उपज अनुमान', 'रिमोट सेंसिंग से समस्या पहचान', 'इन-ऐप कृषि विशेषज्ञ परामर्श', 'मिट्टी लैब परीक्षण सेवा'],
            cta: '🛰️ AI उपकरण देखें', ctaTo: '/crop-recommendation',
          },
        ],
        governance: {
          label: '🏛️ स्मार्ट शासन',
          heading: 'AgriSathi शासन को अनुकूलित करना',
          desc: 'AgriSathi सरकारी एजेंसियों को डेटा प्रबंधन, विश्लेषण और वर्कफ्लो ऑटोमेशन के लिए उन्नत IT उपकरण प्रदान करता है।',
          cards: [
            { icon: '⚙️', title: 'स्मार्ट वर्कफ्लो प्रबंधन',  desc: 'कृषि योजनाओं तक पहुंच को सरल बनाते हुए डिजिटल वर्कफ्लो को शक्ति देना।' },
            { icon: '🚨', title: 'आपदा तैयारी',                desc: 'सूखे, बाढ़ और कीट प्रकोप जैसी चुनौतियों के लिए त्वरित प्रतिक्रिया।' },
            { icon: '📊', title: 'डेटा-संचालित बुद्धिमत्ता',  desc: 'जटिल कृषि डेटा को नीति निर्माण के लिए कार्यकारी जानकारी में बदलें।' },
            { icon: '📋', title: 'नीति कार्यान्वयन',           desc: 'एक एकीकृत प्लेटफॉर्म के माध्यम से योजना नामांकन और सब्सिडी वितरण।' },
            { icon: '👥', title: 'एकीकृत किसान डेटाबेस',       desc: 'लक्षित आउटरीच और व्यक्तिगत समर्थन के लिए रियल-टाइम किसान डेटाबेस।' },
            { icon: '🔗', title: 'बाजार लिंकेज',               desc: 'e-मार्केट के माध्यम से किसानों से सीधे उत्पाद खरीदें।' },
          ],
          principlesHeading: 'मार्गदर्शक सिद्धांत',
          principles: [
            { icon: '🌾', title: 'किसान पहले',    desc: 'हर सुविधा, हर निर्णय — किसान के कल्याण को केंद्र में रखकर।' },
            { icon: '📡', title: 'रियल-टाइम डेटा', desc: 'लाइव मौसम, बाजार मूल्य और फसल अलर्ट।' },
            { icon: '🌍', title: 'टिकाऊ खेती',    desc: 'मिट्टी, जल और जैव विविधता की रक्षा करने वाली प्रथाएं।' },
            { icon: '🤝', title: 'समावेशी विकास',  desc: 'कई क्षेत्रीय भाषाओं में उपलब्ध — हर किसान के लिए।' },
          ],
        },
        helpdesk: {
          heading: 'हेल्प डेस्क और सहायता',
          desc: 'दिन के किसी भी समय हमारे कृषि विशेषज्ञों से संपर्क करें',
          cards: [
            { icon: '📞', label: 'हेल्पलाइन नंबर',  val: '1800-123-4567', href: 'tel:18001234567' },
            { icon: '☎️', label: 'वैकल्पिक लाइन',   val: '1800-123-4568', href: 'tel:18001234568' },
            { icon: '📧', label: 'ईमेल सहायता',     val: 'support@agrisathi.in', href: 'mailto:support@agrisathi.in' },
            { icon: '💬', label: 'लाइव चैट',        val: 'विशेषज्ञ से चैट करें', href: '#' },
          ],
        },
        footer: {
          tagline: 'एक अग्रणी डिजिटल प्लेटफॉर्म जो किसानों, तकनीक और कृषि नवाचार को जोड़ता है।',
          ministry: 'कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
          copyright: '© 2026 AgriSathi. सर्वाधिकार सुरक्षित।',
          madeFor: "भारत के किसानों के लिए डिज़ाइन किया गया 🇮🇳",
          cols: [
            { h: 'प्लेटफॉर्म',  links: ['फसल सिफारिश', 'मिट्टी विश्लेषण', 'रोग पहचान', 'स्मार्ट सिंचाई', 'मौसम सलाह'] },
            { h: 'सरकार',       links: ['PM-KISAN', 'फसल बीमा', 'मृदा स्वास्थ्य कार्ड', 'कृषि ऋण', 'सब्सिडी पोर्टल'] },
            { h: 'सहायता',      links: ['हेल्प डेस्क', 'विशेषज्ञ हेल्पलाइन', 'उपयोगकर्ता गाइड', 'गोपनीयता नीति', 'उपयोग की शर्तें'] },
          ],
        },
      },
  
      /* ════════════════════════════════════════════════════════
         BENGALI
      ════════════════════════════════════════════════════════ */
      bn: {
        splash: {
          loadingWords: ['ফসল বুদ্ধিমত্তা', 'মাটি বিশ্লেষণ', 'রোগ শনাক্তকরণ', 'স্মার্ট সেচ', 'বাজার তথ্য'],
          tagline: 'স্মার্ট কৃষি প্ল্যাটফর্ম',
          loading: 'লোড হচ্ছে',
        },
        nav: {
          about: 'পরিচয়', features: 'বৈশিষ্ট্য', services: 'সেবা',
          governance: 'শাসন', contact: 'যোগাযোগ', login: 'লগইন', getStarted: 'শুরু করুন',
        },
        hero: {
          badge: '🌾 স্মার্ট কৃষি প্ল্যাটফর্ম',
          heading1: 'কৃষকদের ক্ষমতায়ন করছে',
          heading2: 'উন্নত',
          heading3: 'সরঞ্জাম এবং সেবা দিয়ে',
          desc: 'AgriSathi একটি অগ্রণী ডিজিটাল প্ল্যাটফর্ম যা কৃষি অনুশীলনকে বিপ্লব ঘটাতে ডিজাইন করা হয়েছে। ঐতিহ্যগত কৃষি জ্ঞানকে অত্যাধুনিক AI, আবহাওয়া বিশ্লেষণ এবং রিয়েল-টাইম ফসল তথ্যের সাথে সংযুক্ত করে।',
          ctaPrimary: 'বিনামূল্যে শুরু করুন',
          ctaSecondary: 'বৈশিষ্ট্য দেখুন',
        },
        rating: {
          title: '⭐ আপনার অভিজ্ঞতা রেট করুন',
          question: 'আপনি AgriSathi-কে কীভাবে রেট করবেন?',
          selected: 'আপনি বেছে নিয়েছেন:',
          whatsRating: 'আপনি কী রেট করছেন?',
          selected_count: 'বেছে নেওয়া হয়েছে',
          placeholder: 'আপনার {{label}} অভিজ্ঞতা সম্পর্কে আরও বলুন...',
          submit: '{{label}} রিভিউ জমা দিন',
          noRating: 'প্রথমে রেটিং বেছে নিন',
          submitting: '⏳ জমা দেওয়া হচ্ছে...',
          thanks: 'আপনার মতামতের জন্য ধন্যবাদ!',
          youRated: 'আপনি আমাদের রেট করেছেন',
          helpText: 'আপনার মতামত প্রতিটি কৃষকের জন্য AgriSathi উন্নত করতে সাহায্য করে।',
          rateAgain: 'আবার রেট করুন',
          starLabels: ['খারাপ', 'মোটামুটি', 'ভালো', 'খুব ভালো', 'চমৎকার'],
          categories: ['ফসল পরামর্শ', 'মাটি বিশ্লেষণ', 'রোগ শনাক্তকরণ', 'আবহাওয়া তথ্য', 'সরকারি প্রকল্প', 'সামগ্রিক অ্যাপ'],
        },
        video: {
          sectionLabel: '▶️ AgriSathi কার্যক্রমে দেখুন',
          heading: 'দেখুন AgriSathi কীভাবে কাজ করে',
          desc: 'দেখুন কৃষকরা কীভাবে AgriSathi ব্যবহার করে স্মার্টভাবে চাষ করছেন এবং সরকারি প্রকল্পের সুবিধা নিচ্ছেন।',
          loadingText: 'ভিডিও লোড হচ্ছে…',
          liveDemo: 'লাইভ ডেমো',
          version: 'AgriSathi v2.0',
          caption: 'AgriSathi — স্মার্ট কৃষি প্ল্যাটফর্ম',
          madeFor: 'ভারতের কৃষকদের জন্য তৈরি 🇮🇳',
          chips: ['🌾 ফসল পরিকল্পনা', '🧪 মাটি বিশ্লেষণ', '🐛 রোগ শনাক্তকরণ', '💧 স্মার্ট সেচ', '💰 সরকারি প্রকল্প'],
        },
        about: {
          label: '🌿 AgriSathi সম্পর্কে',
          heading: 'AgriSathi কী?',
          desc: 'AgriSathi (কৃষি বন্ধু) একটি অগ্রণী ডিজিটাল প্ল্যাটফর্ম যা সারা ভারতে কৃষি অনুশীলনে বিপ্লব আনতে ডিজাইন করা হয়েছে। AI এবং ঐতিহ্যগত জ্ঞানকে একত্রিত করে আধুনিক কৃষির চ্যালেঞ্জ মোকাবেলা করে।',
          floatTitle: 'ডেটা-চালিত',
          floatSub: 'AI-চালিত ফসল বিশ্লেষণ',
          items: [
            { icon: '🤖', title: 'উন্নত কৃষি প্রযুক্তি', desc: 'ফসল পরিকল্পনা থেকে ফসল কাটা পর্যন্ত AI-চালিত সমাধান।' },
            { icon: '📈', title: 'ডেটা-চালিত তথ্য',     desc: 'কৃষি পেশাদারদের রিয়েল-টাইম কার্যকর তথ্য দিয়ে ক্ষমতায়ন।' },
            { icon: '🌍', title: 'টেকসই উন্নয়ন',        desc: 'ভবিষ্যৎ প্রজন্মের জন্য পরিবেশবান্ধব কৃষি অনুশীলন।' },
          ],
        },
        features: {
          label: '⚡ মূল বৈশিষ্ট্য',
          heading: 'কৃষকের যা দরকার সব কিছু',
          desc: 'AI ফসল সুপারিশ থেকে সরকারি প্রকল্পের আবেদন পর্যন্ত — সব একটি জায়গায়।',
          items: [
            { icon: '🌾', iconBg: '#e8f5e9', tag: 'AI চালিত',       title: 'ফসল সুপারিশ',        desc: 'মাটি, জলবায়ু ও বাজার প্রবণতার উপর ভিত্তি করে AI-চালিত ফসল পরামর্শ।' },
            { icon: '🧪', iconBg: '#fff8e1', tag: 'ল্যাব সংযুক্ত',  title: 'মাটি স্বাস্থ্য বিশ্লেষণ', desc: 'ডিজিটাল মাটি ল্যাব রিপোর্ট এবং সার সুপারিশ।' },
            { icon: '🐛', iconBg: '#fdecea', tag: 'ইমেজ AI',          title: 'রোগ শনাক্তকরণ',      desc: 'ফসলের ছবি আপলোড করুন — AI তাৎক্ষণিকভাবে রোগ ও চিকিৎসা চিহ্নিত করে।' },
            { icon: '💧', iconBg: '#e3f2fd', tag: 'IoT প্রস্তুত',    title: 'স্মার্ট সেচ',          desc: 'আবহাওয়া-ভিত্তিক সেচ পরামর্শ এবং স্বয়ংক্রিয় সময়সূচী।' },
            { icon: '🌦️', iconBg: '#f3e5f5', tag: 'রিয়েল-টাইম',     title: 'আবহাওয়া পরামর্শ',    desc: '১০ দিনের স্থানীয় পূর্বাভাস এবং চরম আবহাওয়া সতর্কতা।' },
            { icon: '💰', iconBg: '#fff3e0', tag: 'সরকার সংযুক্ত',  title: 'প্রকল্প ও ভর্তুকি',   desc: 'সরকারি প্রকল্পে আবেদন করুন এবং PM-KISAN, ফসল বীমা পেমেন্ট পান।' },
          ],
        },
        services: [
          {
            emoji: '🌦️', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
            label: '🌤️ আবহাওয়া বুদ্ধিমত্তা',
            title: 'আবহাওয়া-ভিত্তিক ফসল পরামর্শ',
            desc: 'স্থানীয়করণ করা, রিয়েল-টাইম আবহাওয়া তথ্য পান যা আপনার কৃষি সিদ্ধান্তগুলিকে সরাসরি নির্দেশ করে।',
            bullets: ['১০ দিনের স্থানীয় আবহাওয়া পূর্বাভাস', 'বপন ও ফসল কাটার সুপারিশ', 'বৃষ্টিপাত-ভিত্তিক সেচ সময়সূচী', 'আবহাওয়ার জন্য সার সমন্বয়', 'তুষারপাত, বন্যা ও খরার প্রাথমিক সতর্কতা'],
            cta: '🌤️ আবহাওয়া ড্যাশবোর্ড দেখুন', ctaTo: '/weather',
          },
          {
            emoji: '🐛', bg: 'linear-gradient(135deg,#fdecea,#ffcdd2)',
            label: '🔬 ফসল সুরক্ষা',
            title: 'ফসল সুরক্ষা ও কীটপতঙ্গ সমাধান',
            desc: 'AI-চালিত কীটপতঙ্গ সতর্কতা এবং বিশেষজ্ঞ সুপারিশ দিয়ে ফসলের হুমকির আগে থেকুন।',
            bullets: ['AI ফটো-ভিত্তিক রোগ ও কীট শনাক্তকরণ', 'মৌসুমি কীটপতঙ্গ প্রাদুর্ভাবের সতর্কতা', 'চরম আবহাওয়া ফসল চাপ সতর্কতা', 'ইন-অ্যাপ প্ল্যান্ট ডাক্তার পরামর্শ', 'জৈব এবং রাসায়নিক চিকিৎসা সুপারিশ'],
            cta: '🐛 এখনই রোগ শনাক্ত করুন', ctaTo: '/disease-detection', reverse: true, altBg: true,
          },
          {
            emoji: '🛰️', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
            label: '🤖 AI ও রিমোট সেন্সিং',
            title: 'প্রতিটি কৃষকের হাতে AI ও রিমোট সেন্সিংয়ের শক্তি',
            desc: 'স্যাটেলাইট-ভিত্তিক ফসল স্বাস্থ্য পর্যবেক্ষণ এবং AI-চালিত তথ্য — এখন প্রতিটি ছোট কৃষকের জন্য।',
            bullets: ['স্যাটেলাইট ফিল্ড স্বাস্থ্য পর্যবেক্ষণ (NDVI)', 'ফসল কাটার আগে সঠিক ফলন অনুমান', 'রিমোট সেন্সিং দিয়ে সমস্যা শনাক্তকরণ', 'ইন-অ্যাপ কৃষি বিশেষজ্ঞ পরামর্শ', 'মাটি ল্যাব পরীক্ষা সেবা'],
            cta: '🛰️ AI সরঞ্জাম দেখুন', ctaTo: '/crop-recommendation',
          },
        ],
        governance: {
          label: '🏛️ স্মার্ট শাসন',
          heading: 'AgriSathi শাসন অপ্টিমাইজ করছে',
          desc: 'AgriSathi সরকারি সংস্থাগুলিকে ডেটা ব্যবস্থাপনা, বিশ্লেষণ এবং ওয়ার্কফ্লো অটোমেশনের জন্য উন্নত IT সরঞ্জাম দিয়ে সজ্জিত করে।',
          cards: [
            { icon: '⚙️', title: 'স্মার্ট ওয়ার্কফ্লো ব্যবস্থাপনা', desc: 'কৃষি প্রকল্পে প্রবেশাধিকার সহজ করতে ডিজিটাল ওয়ার্কফ্লো পরিচালনা।' },
            { icon: '🚨', title: 'দুর্যোগ প্রস্তুতি',               desc: 'খরা, বন্যা ও কীটপতঙ্গ প্রাদুর্ভাবের দ্রুত প্রতিক্রিয়া।' },
            { icon: '📊', title: 'ডেটা-চালিত বুদ্ধিমত্তা',          desc: 'জটিল কৃষি ডেটাকে প্রমাণ-ভিত্তিক নীতির জন্য কার্যকর তথ্যে রূপান্তর।' },
            { icon: '📋', title: 'নীতি বাস্তবায়ন',                  desc: 'একক প্ল্যাটফর্মের মাধ্যমে প্রকল্প তালিকাভুক্তি এবং ভর্তুকি বিতরণ।' },
            { icon: '👥', title: 'একীভূত কৃষক ডেটাবেস',             desc: 'লক্ষ্যভিত্তিক আউটরিচ ও ব্যক্তিগত সহায়তার জন্য রিয়েল-টাইম ডেটাবেস।' },
            { icon: '🔗', title: 'বাজার সংযোগ',                     desc: 'e-মার্কেটের মাধ্যমে কৃষকদের কাছ থেকে সরাসরি পণ্য কিনুন।' },
          ],
          principlesHeading: 'পথপ্রদর্শক নীতি',
          principles: [
            { icon: '🌾', title: 'কৃষক প্রথম',      desc: 'প্রতিটি বৈশিষ্ট্য, প্রতিটি সিদ্ধান্ত — কৃষকের কল্যাণকে কেন্দ্রে রেখে।' },
            { icon: '📡', title: 'রিয়েল-টাইম ডেটা', desc: 'লাইভ আবহাওয়া, বাজার মূল্য এবং ফসল সতর্কতা।' },
            { icon: '🌍', title: 'টেকসই চাষ',        desc: 'মাটি, জল ও জীববৈচিত্র্য রক্ষাকারী অনুশীলন।' },
            { icon: '🤝', title: 'অন্তর্ভুক্তিমূলক প্রবৃদ্ধি', desc: 'একাধিক আঞ্চলিক ভাষায় উপলব্ধ — প্রতিটি কৃষকের জন্য।' },
          ],
        },
        helpdesk: {
          heading: 'হেল্প ডেস্ক ও সহায়তা',
          desc: 'দিনের যেকোনো সময় আমাদের কৃষি বিশেষজ্ঞদের সাথে যোগাযোগ করুন',
          cards: [
            { icon: '📞', label: 'হেল্পলাইন নম্বর',  val: '1800-123-4567', href: 'tel:18001234567' },
            { icon: '☎️', label: 'বিকল্প লাইন',       val: '1800-123-4568', href: 'tel:18001234568' },
            { icon: '📧', label: 'ইমেইল সহায়তা',     val: 'support@agrisathi.in', href: 'mailto:support@agrisathi.in' },
            { icon: '💬', label: 'লাইভ চ্যাট',        val: 'বিশেষজ্ঞের সাথে চ্যাট', href: '#' },
          ],
        },
        footer: {
          tagline: 'একটি অগ্রণী ডিজিটাল প্ল্যাটফর্ম যা কৃষক, প্রযুক্তি ও কৃষি উদ্ভাবনকে সংযুক্ত করে।',
          ministry: 'কৃষি ও কৃষক কল্যাণ মন্ত্রণালয়, ভারত সরকার',
          copyright: '© 2026 AgriSathi. সকল অধিকার সংরক্ষিত।',
          madeFor: 'ভারতের কৃষকদের জন্য ডিজাইন করা হয়েছে 🇮🇳',
          cols: [
            { h: 'প্ল্যাটফর্ম',  links: ['ফসল সুপারিশ', 'মাটি বিশ্লেষণ', 'রোগ শনাক্তকরণ', 'স্মার্ট সেচ', 'আবহাওয়া পরামর্শ'] },
            { h: 'সরকার',        links: ['PM-KISAN', 'ফসল বীমা', 'মাটি স্বাস্থ্য কার্ড', 'কৃষি ঋণ', 'ভর্তুকি পোর্টাল'] },
            { h: 'সহায়তা',      links: ['হেল্প ডেস্ক', 'বিশেষজ্ঞ হেল্পলাইন', 'ব্যবহারকারী গাইড', 'গোপনীয়তা নীতি', 'ব্যবহারের শর্তাবলী'] },
          ],
        },
      },
  
      /* ════════════════════════════════════════════════════════
         TAMIL
      ════════════════════════════════════════════════════════ */
      ta: {
        splash: {
          loadingWords: ['பயிர் நுண்ணறிவு', 'மண் பகுப்பாய்வு', 'நோய் கண்டறிதல்', 'நுண்ணிய பாசனம்', 'சந்தை தகவல்'],
          tagline: 'நுண்ணிய வேளாண் தளம்',
          loading: 'ஏற்றுகிறது',
        },
        nav: {
          about: 'பற்றி', features: 'அம்சங்கள்', services: 'சேவைகள்',
          governance: 'ஆட்சி', contact: 'தொடர்பு', login: 'உள்நுழைவு', getStarted: 'தொடங்குங்கள்',
        },
        hero: {
          badge: '🌾 நுண்ணிய வேளாண் தளம்',
          heading1: 'விவசாயிகளை மேம்படுத்துகிறது',
          heading2: 'மேம்பட்ட',
          heading3: 'கருவிகள் & சேவைகளுடன்',
          desc: 'AgriSathi வேளாண் நடைமுறைகளை புரட்சிகரமாக்க வடிவமைக்கப்பட்ட ஒரு முன்னோடி டிஜிட்டல் தளம். பாரம்பரிய விவசாய அறிவை AI, வானிலை பகுப்பாய்வு மற்றும் நேரடி பயிர் நுண்ணறிவுடன் இணைக்கிறது.',
          ctaPrimary: 'இலவசமாக தொடங்குங்கள்',
          ctaSecondary: 'அம்சங்களை ஆராயுங்கள்',
        },
        rating: {
          title: '⭐ உங்கள் அனுபவத்தை மதிப்பிடுங்கள்',
          question: 'AgriSathi-ஐ எவ்வாறு மதிப்பிடுவீர்கள்?',
          selected: 'நீங்கள் தேர்ந்தெடுத்தது:',
          whatsRating: 'நீங்கள் எதை மதிப்பிடுகிறீர்கள்?',
          selected_count: 'தேர்ந்தெடுக்கப்பட்டவை',
          placeholder: 'உங்கள் {{label}} அனுபவத்தைப் பற்றி மேலும் சொல்லுங்கள்...',
          submit: '{{label}} மதிப்பாய்வை சமர்ப்பிக்கவும்',
          noRating: 'முதலில் மதிப்பீட்டைத் தேர்ந்தெடுக்கவும்',
          submitting: '⏳ சமர்ப்பிக்கிறது...',
          thanks: 'உங்கள் கருத்துக்கு நன்றி!',
          youRated: 'நீங்கள் எங்களை மதிப்பிட்டீர்கள்',
          helpText: 'உங்கள் கருத்து ஒவ்வொரு விவசாயிக்கும் AgriSathi-ஐ மேம்படுத்த உதவுகிறது.',
          rateAgain: 'மீண்டும் மதிப்பிடுங்கள்',
          starLabels: ['மோசம்', 'சாதாரணம்', 'நல்லது', 'மிகவும் நல்லது', 'சிறப்பானது'],
          categories: ['பயிர் ஆலோசனை', 'மண் பகுப்பாய்வு', 'நோய் கண்டறிதல்', 'வானிலை தகவல்', 'அரசு திட்டங்கள்', 'ஒட்டுமொத்த செயலி'],
        },
        video: {
          sectionLabel: '▶️ AgriSathi செயலில் காணுங்கள்',
          heading: 'AgriSathi எவ்வாறு செயல்படுகிறது என்று பாருங்கள்',
          desc: 'விவசாயிகள் AgriSathi-ஐப் பயன்படுத்தி எவ்வாறு அறிவார்ந்த முறையில் விவசாயம் செய்கிறார்கள் என்று பாருங்கள்.',
          loadingText: 'வீடியோ ஏற்றுகிறது…',
          liveDemo: 'நேரலை டெமோ',
          version: 'AgriSathi v2.0',
          caption: 'AgriSathi — நுண்ணிய வேளாண் தளம்',
          madeFor: 'இந்தியாவின் விவசாயிகளுக்காக 🇮🇳',
          chips: ['🌾 பயிர் திட்டமிடல்', '🧪 மண் பகுப்பாய்வு', '🐛 நோய் கண்டறிதல்', '💧 நுண்ணிய பாசனம்', '💰 அரசு திட்டங்கள்'],
        },
        about: {
          label: '🌿 AgriSathi பற்றி',
          heading: 'AgriSathi என்றால் என்ன?',
          desc: 'AgriSathi (வேளாண் நண்பன்) இந்தியா முழுவதும் வேளாண் நடைமுறைகளை புரட்சிகரமாக்க வடிவமைக்கப்பட்ட ஒரு முன்னோடி டிஜிட்டல் தளம். AI மற்றும் பாரம்பரிய அறிவை ஒருங்கிணைத்து நவீன விவசாயத்தின் சவால்களை எதிர்கொள்கிறது.',
          floatTitle: 'தரவு-இயக்கப்படும்',
          floatSub: 'AI-இயக்கப்படும் பயிர் பகுப்பாய்வு',
          items: [
            { icon: '🤖', title: 'மேம்பட்ட வேளாண் தொழில்நுட்பம்', desc: 'பயிர் திட்டமிடல் முதல் அறுவடை வரை AI-இயக்கப்படும் தீர்வுகள்.' },
            { icon: '📈', title: 'தரவு-இயக்கப்படும் நுண்ணறிவு',    desc: 'வேளாண் நிபுணர்களுக்கு நேரடி, செயல்படுத்தக்கூடிய நுண்ணறிவு.' },
            { icon: '🌍', title: 'நிலையான வளர்ச்சி',                desc: 'எதிர்கால தலைமுறைகளுக்கான சூழல்நட்பு விவசாய நடைமுறைகள்.' },
          ],
        },
        features: {
          label: '⚡ முக்கிய அம்சங்கள்',
          heading: 'விவசாயிக்கு தேவையான அனைத்தும்',
          desc: 'AI பயிர் பரிந்துரைகள் முதல் அரசு திட்ட விண்ணப்பங்கள் வரை — அனைத்தும் ஒரே இடத்தில்.',
          items: [
            { icon: '🌾', iconBg: '#e8f5e9', tag: 'AI இயக்கம்',      title: 'பயிர் பரிந்துரை',       desc: 'மண் வகை, காலநிலை மற்றும் சந்தை போக்குகளின் அடிப்படையில் AI பரிந்துரைகள்.' },
            { icon: '🧪', iconBg: '#fff8e1', tag: 'ஆய்வக ஒருங்கிணைப்பு', title: 'மண் ஆரோக்கிய பகுப்பாய்வு', desc: 'டிஜிட்டல் மண் ஆய்வக அறிக்கைகள் மற்றும் உரப் பரிந்துரைகள்.' },
            { icon: '🐛', iconBg: '#fdecea', tag: 'படம் AI',           title: 'நோய் கண்டறிதல்',        desc: 'பயிரின் புகைப்படம் பதிவேற்றுங்கள் — AI உடனடியாக நோய் மற்றும் சிகிச்சையை கண்டறியும்.' },
            { icon: '💧', iconBg: '#e3f2fd', tag: 'IoT தயார்',          title: 'நுண்ணிய பாசனம்',        desc: 'வானிலை-அடிப்படையிலான பாசன ஆலோசனைகள் மற்றும் தானியங்கி அட்டவணை.' },
            { icon: '🌦️', iconBg: '#f3e5f5', tag: 'நேரடி',             title: 'வானிலை ஆலோசனை',        desc: '10 நாள் உள்ளூர் முன்னறிவிப்பு மற்றும் தீவிர வானிலை எச்சரிக்கைகள்.' },
            { icon: '💰', iconBg: '#fff3e0', tag: 'அரசு ஒருங்கிணைப்பு', title: 'திட்டம் & மானியம்',      desc: 'அரசு திட்டங்களுக்கு விண்ணப்பிக்கவும் PM-KISAN, பயிர் காப்பீடு பெறவும்.' },
          ],
        },
        services: [
          {
            emoji: '🌦️', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)',
            label: '🌤️ வானிலை நுண்ணறிவு',
            title: 'வானிலை-அடிப்படையிலான பயிர் ஆலோசனைகள்',
            desc: 'உங்கள் விவசாய முடிவுகளை நேரடியாக வழிநடத்தும் உள்ளூரான, நேரடி வானிலை நுண்ணறிவு பெறுங்கள்.',
            bullets: ['10 நாள் உள்ளூர் வானிலை முன்னறிவிப்பு', 'விதைப்பு & அறுவடை சாளர பரிந்துரைகள்', 'மழையின் அடிப்படையில் பாசன அட்டவணை', 'வானிலைக்கான உரப் சரிசெய்தல்', 'உறைபனி, வெள்ளம் & வறட்சி எச்சரிக்கைகள்'],
            cta: '🌤️ வானிலை டாஷ்போர்டு காண்க', ctaTo: '/weather',
          },
          {
            emoji: '🐛', bg: 'linear-gradient(135deg,#fdecea,#ffcdd2)',
            label: '🔬 பயிர் பாதுகாப்பு',
            title: 'பயிர் பாதுகாப்பு & பூச்சி தீர்வுகள்',
            desc: 'AI-இயக்கப்படும் பூச்சி முன்னறிவிப்பு மற்றும் நிபுணர் பரிந்துரைகளுடன் பயிர் அச்சுறுத்தல்களுக்கு முன்னதாக இருங்கள்.',
            bullets: ['AI புகைப்படம் அடிப்படையிலான நோய் & பூச்சி அடையாளம்', 'மேசோகால பூச்சி தாக்குதல் எச்சரிக்கைகள்', 'தீவிர வானிலை பயிர் அழுத்த எச்சரிக்கைகள்', 'உள்-செயலி தாவர மருத்துவர் ஆலோசனை', 'இயற்கை மற்றும் இரசாயன சிகிச்சை பரிந்துரைகள்'],
            cta: '🐛 இப்போது நோயை கண்டறியுங்கள்', ctaTo: '/disease-detection', reverse: true, altBg: true,
          },
          {
            emoji: '🛰️', bg: 'linear-gradient(135deg,#e3f2fd,#bbdefb)',
            label: '🤖 AI & தொலை உணர்வு',
            title: 'ஒவ்வொரு விவசாயியின் கையிலும் AI & தொலை உணர்வின் சக்தி',
            desc: 'செயற்கைக்கோள் அடிப்படையிலான பயிர் ஆரோக்கிய கண்காணிப்பு இப்போது ஒவ்வொரு சிறு விவசாயிக்கும்.',
            bullets: ['செயற்கைக்கோள் வயல் ஆரோக்கிய கண்காணிப்பு (NDVI)', 'அறுவடைக்கு முன் துல்லியமான மகசூல் மதிப்பீடு', 'தொலை உணர்வு மூலம் ஆரம்ப சிக்கல் கண்டறிதல்', 'உள்-செயலி வேளாண் நிபுணர் ஆலோசனைகள்', 'மண் ஆய்வக சோதனை சேவை'],
            cta: '🛰️ AI கருவிகளை ஆராயுங்கள்', ctaTo: '/crop-recommendation',
          },
        ],
        governance: {
          label: '🏛️ நுண்ணிய ஆட்சி',
          heading: 'AgriSathi ஆட்சியை மேம்படுத்துகிறது',
          desc: 'AgriSathi அரசு நிறுவனங்களுக்கு தரவு நிர்வாகம், பகுப்பாய்வு மற்றும் தானியங்கி செயல்பாடுக்கான மேம்பட்ட IT கருவிகளை வழங்குகிறது.',
          cards: [
            { icon: '⚙️', title: 'நுண்ணிய செயல்பாட்டு நிர்வாகம்',  desc: 'வேளாண் திட்டங்களுக்கான அணுகலை எளிமைப்படுத்த டிஜிட்டல் செயல்பாடுகளை இயக்குங்கள்.' },
            { icon: '🚨', title: 'பேரழிவு தயார்நிலை',                desc: 'வறட்சி, வெள்ளம் மற்றும் பூச்சி தாக்குதல்களுக்கு விரைவான பதில்.' },
            { icon: '📊', title: 'தரவு-இயக்கப்படும் நுண்ணறிவு',      desc: 'சிக்கலான வேளாண் தரவை கொள்கை வகுப்பிற்கான செயல்படுத்தக்கூடிய நுண்ணறிவாக மாற்றுங்கள்.' },
            { icon: '📋', title: 'கொள்கை செயல்படுத்தல்',              desc: 'ஒரே ஒருங்கிணைந்த தளம் மூலம் திட்ட பதிவு மற்றும் மானியம் வழங்குதல்.' },
            { icon: '👥', title: 'ஒருங்கிணைந்த விவசாயி தரவுத்தளம்', desc: 'இலக்கு சேவை மற்றும் தனிப்பட்ட ஆதரவிற்கான நேரடி தரவுத்தளம்.' },
            { icon: '🔗', title: 'சந்தை இணைப்பு',                    desc: 'e-சந்தைகள் மூலம் விவசாயிகளிடமிருந்து நேரடியாக விளைபொருள் வாங்கவும்.' },
          ],
          principlesHeading: 'வழிகாட்டும் கொள்கைகள்',
          principles: [
            { icon: '🌾', title: 'விவசாயி முதல்',        desc: 'ஒவ்வொரு அம்சமும், ஒவ்வொரு முடிவும் — விவசாயியின் நலனை மையமாக வைத்து.' },
            { icon: '📡', title: 'நேரடி தரவு',            desc: 'நேரடி வானிலை, சந்தை விலைகள் மற்றும் பயிர் எச்சரிக்கைகள்.' },
            { icon: '🌍', title: 'நிலையான விவசாயம்',      desc: 'மண், நீர் மற்றும் உயிரினப் பன்மையை பாதுகாக்கும் நடைமுறைகள்.' },
            { icon: '🤝', title: 'அனைவரையும் உள்ளடக்கிய வளர்ச்சி', desc: 'பல மாநில மொழிகளில் கிடைக்கிறது — ஒவ்வொரு விவசாயிக்கும்.' },
          ],
        },
        helpdesk: {
          heading: 'உதவி மேசை & ஆதரவு',
          desc: 'நாளின் எந்த நேரத்திலும் எங்கள் வேளாண் நிபுணர்களை தொடர்பு கொள்ளுங்கள்',
          cards: [
            { icon: '📞', label: 'உதவி எண்',       val: '1800-123-4567', href: 'tel:18001234567' },
            { icon: '☎️', label: 'மாற்று எண்',     val: '1800-123-4568', href: 'tel:18001234568' },
            { icon: '📧', label: 'மின்னஞ்சல் ஆதரவு', val: 'support@agrisathi.in', href: 'mailto:support@agrisathi.in' },
            { icon: '💬', label: 'நேரடி அரட்டை',   val: 'நிபுணரிடம் அரட்டையடியுங்கள்', href: '#' },
          ],
        },
        footer: {
          tagline: 'விவசாயிகள், தொழில்நுட்பம் மற்றும் வேளாண் கண்டுபிடிப்பை இணைக்கும் ஒரு முன்னோடி டிஜிட்டல் தளம்.',
          ministry: 'வேளாண்மை & விவசாயி நலன் அமைச்சகம், இந்திய அரசு',
          copyright: '© 2026 AgriSathi. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
          madeFor: 'இந்தியாவின் விவசாயிகளுக்காக வடிவமைக்கப்பட்டது 🇮🇳',
          cols: [
            { h: 'தளம்',      links: ['பயிர் பரிந்துரை', 'மண் பகுப்பாய்வு', 'நோய் கண்டறிதல்', 'நுண்ணிய பாசனம்', 'வானிலை ஆலோசனை'] },
            { h: 'அரசு',      links: ['PM-KISAN', 'பயிர் காப்பீடு', 'மண் ஆரோக்கிய அட்டை', 'வேளாண் கடன்கள்', 'மானியம் தளம்'] },
            { h: 'ஆதரவு',    links: ['உதவி மேசை', 'நிபுணர் உதவி எண்', 'பயனர் வழிகாட்டி', 'தனியுரிமை கொள்கை', 'பயன்பாட்டு விதிமுறைகள்'] },
          ],
        },
      },
    },
  };
  
  export default landingTranslations;