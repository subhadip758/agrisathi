// ─── AgriSathi Helpdesk Translations ───────────────────────────────────────
// Supports: English (en), Hindi (hi), Bengali (bn)
// ALL display text, lists, FAQs, form labels, officer profiles — everything here.

const helpdeskTranslations = {

    /* ══════════════════════════════════════════════════════════════════
       ENGLISH
    ══════════════════════════════════════════════════════════════════ */
    en: {
      lang: { label: 'Language', en: 'EN', hi: 'HI', bn: 'BN' },
  
      header: {
        badge:    'Farmer Support Center',
        h1a:      "We're here to help",
        h1b:      'your farm thrive',
        subtitle: 'Find answers to your questions or chat with our AI farming assistant, available anytime.',
      },
  
      stats: [
        { val: '85–90%', label: 'AI Accuracy' },
        { val: '24/7',   label: 'AI Support'  },
        { val: '10k+',   label: 'Farmers Helped' },
      ],
  
      faq: {
        cardTitle:  'Frequently Asked Questions',
        pillAll:    '🌍 All Topics',
        categories: [
          {
            id: 'general', title: 'General', emoji: '🌾',
            faqs: [
              { question: 'How do I get started with the platform?',  answer: 'Sign up for an account, complete your profile with farm details, and start using our AI-powered features like crop recommendations, soil analysis, and more.' },
              { question: 'Is the platform free to use?',             answer: 'We offer both free and premium plans. The free plan includes basic features, while premium plans unlock advanced analytics and unlimited predictions.' },
              { question: 'How accurate are the AI predictions?',     answer: 'Our ML models have accuracy rates of 85–90% based on extensive testing. However, results should be used as guidance alongside your farming expertise.' },
            ],
          },
          {
            id: 'crops', title: 'Crop Recommendations', emoji: '🌿',
            faqs: [
              { question: 'What parameters are needed for crop recommendations?', answer: 'You need soil NPK values, pH level, temperature, humidity, and rainfall data for accurate crop recommendations.' },
              { question: 'Can I get recommendations for multiple seasons?',      answer: 'Yes, you can run separate analyses for different seasons (Kharif, Rabi, Zaid) to plan your crop rotation.' },
            ],
          },
          {
            id: 'disease', title: 'Disease Detection', emoji: '🔍',
            faqs: [
              { question: 'What makes a good disease detection image?', answer: 'Use clear, well-lit photos taken from 6–12 inches away. Focus on the affected area and avoid blurry or dark images.' },
              { question: 'Which diseases can be detected?',            answer: 'Our model can detect common diseases including leaf blight, powdery mildew, rust, bacterial spots, and viral infections across major crops.' },
            ],
          },
          {
            id: 'technical', title: 'Technical Support', emoji: '⚙️',
            faqs: [
              { question: 'What should I do if a feature is not working?', answer: 'Try refreshing the page first. If the issue persists, clear your browser cache or try a different browser. Contact support if problems continue.' },
              { question: 'How do I report a bug?',                        answer: 'Use the feedback button or contact us at support@agrisathi.in with details about the issue, including screenshots if possible.' },
            ],
          },
        ],
      },
  
      contact: {
        title:    'Still have questions?',
        subtitle: 'Our support team is just a message away.',
        email: { label: 'Email Support',  value: 'support@agrisathi.in'  },
        phone: { label: 'Phone Support',  value: '+91 1800-123-4567'      },
      },
  
      officer: {
        sectionLabel: '👨‍🌾 Expert Agricultural Support',
        cardTitle:    'Connect with an Agriculture Officer',
        profiles: [
          { emoji: '👨‍🌾', name: 'Dr. R. K. Sharma', role: 'Soil Specialist',       dist: 'Lucknow' },
          { emoji: '👩‍🔬', name: 'Dr. Priya Rao',    role: 'Crop Pathologist',      dist: 'Pune'    },
          { emoji: '👨‍💼', name: 'Sh. A. K. Verma',  role: 'Horticulture Advisor',  dist: 'Jaipur'  },
        ],
        form: {
          name:         { label: 'Your Name *',      placeholder: 'e.g. Ramesh Kumar'   },
          phone:        { label: 'Phone Number *',   placeholder: '+91 98765 43210'      },
          district:     { label: 'Your District *',  placeholder: 'Select district…'    },
          topic:        { label: 'Help Topic *',     placeholder: 'Select topic…'       },
          message:      { label: 'Describe Your Problem', optionalTag: '(optional)',
                          placeholder: 'Tell the officer more about your situation — crop type, area affected, symptoms seen…' },
          submitBtn:    '📩 Request Officer Callback',
          submitting:   '⏳ Sending…',
          privacy:      '🔒 Your details are only shared with your district agriculture officer.',
        },
        success: {
          icon:    '🌾',
          title:   'Request Sent Successfully!',
          message: 'An agriculture officer from your district will contact you within 24–48 hours on your registered phone number.',
          reset:   'Submit Another Request',
        },
        infoCards: [
          { icon: '⏱️', title: 'Response within 24–48 hrs',       desc: 'A verified government agriculture officer assigned to your district will call you back directly.' },
          { icon: '🌐', title: 'Expert advice in your language',   desc: 'Officers are available in Hindi, English, and major regional languages including Marathi, Telugu, and Tamil.' },
          { icon: '🆓', title: 'Completely free service',          desc: 'This service is funded by the Ministry of Agriculture. There is no charge to the farmer for any consultation.' },
          { icon: '📋', title: 'What to keep ready',               desc: 'Your soil health card (if available), land size in acres, current crop name, and photos of any disease or pest visible on crops.' },
        ],
        districts: ['Agra','Aligarh','Allahabad','Ambala','Amritsar','Aurangabad','Bareilly','Bhopal','Chandigarh','Chennai','Dehradun','Delhi','Faridabad','Gurgaon','Hyderabad','Indore','Jaipur','Jodhpur','Kanpur','Kolkata','Lucknow','Ludhiana','Mumbai','Nagpur','Nashik','Noida','Patna','Pune','Raipur','Ranchi','Surat','Varanasi','Visakhapatnam'],
        topics: ['Crop Disease / Pest Attack','Soil Health & Fertiliser','Irrigation & Water Management','Government Scheme Eligibility','Seed & Variety Selection','Market Price & Selling','Weather & Climate Advisory','Other / General Query'],
      },
  
      complaint: {
        sectionLabel: '🛠️ Report a Website Problem',
        cardTitle:    'Submit a Complaint to AgriSathi Team',
        form: {
          name:        { label: 'Your Name *',       placeholder: 'Full name'           },
          email:       { label: 'Email Address *',   placeholder: 'you@example.com'     },
          category:    { label: 'Problem Category *',placeholder: 'Select category…'   },
          description: { label: 'Describe the Problem *',
                         placeholder: 'Please describe exactly what happened, which page or feature was affected, and any error messages you saw. The more detail you give, the faster we can fix it.' },
          submitBtn:   '🚨 Submit Complaint',
          submitting:  '⏳ Submitting…',
          privacy:     '📧 A confirmation and ticket ID will be sent to your email.',
        },
        success: {
          icon:    '✅',
          title:   'Complaint Registered!',
          message: 'Our technical team will review your report and send an update to your email within 2–3 business days. Thank you for helping us improve AgriSathi.',
          reset:   'Submit Another',
        },
        categories: ['Feature Not Working','Wrong / Inaccurate Data','Page Loading Issue','Login / Account Problem','Payment / Subscription','Data Privacy Concern','UI / Display Bug','Other'],
        whatNext: {
          heading: '🔁 What happens after you report?',
          steps: [
            { step: '01', title: 'Ticket Created', desc: 'You receive a unique ticket ID on your email immediately.'         },
            { step: '02', title: 'Team Assigned',  desc: 'Our engineering team reviews and prioritises your report.'         },
            { step: '03', title: 'Fix Deployed',   desc: 'The bug is fixed and you are notified once resolved.'              },
          ],
        },
        quickLinks: {
          heading: '🔗 Quick Issue Links',
          links: [
            { icon: '🔐', label: 'Login / Password Reset',          href: '/forgot-password' },
            { icon: '📲', label: 'App not loading on mobile',        href: '#'               },
            { icon: '💳', label: 'Payment or subscription issue',    href: '#'               },
            { icon: '🔒', label: 'Report a data privacy concern',    href: '#'               },
          ],
        },
      },
    },
  
    /* ══════════════════════════════════════════════════════════════════
       HINDI
    ══════════════════════════════════════════════════════════════════ */
    hi: {
      lang: { label: 'भाषा', en: 'EN', hi: 'HI', bn: 'BN' },
  
      header: {
        badge:    'किसान सहायता केंद्र',
        h1a:      'हम यहाँ हैं आपकी मदद के लिए',
        h1b:      'आपके खेत को समृद्ध बनाने के लिए',
        subtitle: 'अपने सवालों के जवाब खोजें या हमारे AI कृषि सहायक से बात करें — जो हर समय उपलब्ध है।',
      },
  
      stats: [
        { val: '85–90%', label: 'AI सटीकता'       },
        { val: '24/7',   label: 'AI सहायता'        },
        { val: '10,000+',label: 'किसानों की मदद'  },
      ],
  
      faq: {
        cardTitle:  'अक्सर पूछे जाने वाले प्रश्न',
        pillAll:    '🌍 सभी विषय',
        categories: [
          {
            id: 'general', title: 'सामान्य', emoji: '🌾',
            faqs: [
              { question: 'प्लेटफ़ॉर्म से शुरुआत कैसे करें?',          answer: 'अकाउंट बनाएं, खेत की जानकारी के साथ प्रोफ़ाइल पूरी करें और फिर AI फसल सुझाव, मिट्टी विश्लेषण जैसी सुविधाओं का उपयोग शुरू करें।' },
              { question: 'क्या प्लेटफ़ॉर्म मुफ़्त है?',               answer: 'हम मुफ़्त और प्रीमियम दोनों योजनाएं देते हैं। मुफ़्त योजना में बुनियादी सुविधाएं हैं, जबकि प्रीमियम में उन्नत विश्लेषण और असीमित अनुमान मिलते हैं।' },
              { question: 'AI भविष्यवाणियाँ कितनी सटीक हैं?',          answer: 'हमारे ML मॉडल की सटीकता दर 85–90% है। हालांकि, इन्हें अपनी खेती की समझ के साथ मार्गदर्शन के रूप में उपयोग करें।' },
            ],
          },
          {
            id: 'crops', title: 'फसल सुझाव', emoji: '🌿',
            faqs: [
              { question: 'फसल सुझाव के लिए कौन-सी जानकारी चाहिए?', answer: 'सटीक सुझाव के लिए मिट्टी के NPK मान, pH स्तर, तापमान, आर्द्रता और वर्षा की जानकारी ज़रूरी है।' },
              { question: 'क्या कई सीज़न के लिए सुझाव मिल सकते हैं?', answer: 'हाँ, आप खरीफ, रबी, ज़ायद जैसे अलग-अलग सीज़न के लिए अलग-अलग विश्लेषण कर सकते हैं।' },
            ],
          },
          {
            id: 'disease', title: 'रोग पहचान', emoji: '🔍',
            faqs: [
              { question: 'रोग पहचान के लिए अच्छी तस्वीर कैसी हो?',  answer: 'स्पष्ट, अच्छी रोशनी में 15–30 सेमी की दूरी से फ़ोटो लें। प्रभावित हिस्से पर फ़ोकस करें और धुंधली या अंधेरी तस्वीरों से बचें।' },
              { question: 'कौन-कौन से रोग पहचाने जा सकते हैं?',       answer: 'हमारा मॉडल पत्ती झुलसा, चूर्णिल फफूंदी, रतुआ, बैक्टीरियल धब्बे और वायरल संक्रमण जैसी प्रमुख बीमारियाँ पहचान सकता है।' },
            ],
          },
          {
            id: 'technical', title: 'तकनीकी सहायता', emoji: '⚙️',
            faqs: [
              { question: 'अगर कोई सुविधा काम नहीं कर रही तो क्या करें?', answer: 'पहले पेज रिफ्रेश करें। अगर समस्या बनी रहे तो ब्राउज़र कैश साफ करें या अलग ब्राउज़र आज़माएं। फिर भी समस्या हो तो हमसे संपर्क करें।' },
              { question: 'बग रिपोर्ट कैसे करें?',                      answer: 'फीडबैक बटन का उपयोग करें या support@agrisathi.in पर स्क्रीनशॉट सहित समस्या की जानकारी भेजें।' },
            ],
          },
        ],
      },
  
      contact: {
        title:    'अभी भी सवाल हैं?',
        subtitle: 'हमारी सहायता टीम बस एक संदेश की दूरी पर है।',
        email: { label: 'ईमेल सहायता',  value: 'support@agrisathi.in' },
        phone: { label: 'फ़ोन सहायता',  value: '+91 1800-123-4567'     },
      },
  
      officer: {
        sectionLabel: '👨‍🌾 विशेषज्ञ कृषि सहायता',
        cardTitle:    'कृषि अधिकारी से संपर्क करें',
        profiles: [
          { emoji: '👨‍🌾', name: 'डॉ. आर. के. शर्मा', role: 'मिट्टी विशेषज्ञ',       dist: 'लखनऊ'  },
          { emoji: '👩‍🔬', name: 'डॉ. प्रिया राव',    role: 'फसल रोगविज्ञानी',      dist: 'पुणे'   },
          { emoji: '👨‍💼', name: 'श्री ए. के. वर्मा', role: 'बागवानी सलाहकार',      dist: 'जयपुर'  },
        ],
        form: {
          name:         { label: 'आपका नाम *',          placeholder: 'जैसे रमेश कुमार'         },
          phone:        { label: 'फ़ोन नंबर *',          placeholder: '+91 98765 43210'          },
          district:     { label: 'आपका जिला *',          placeholder: 'जिला चुनें…'             },
          topic:        { label: 'सहायता विषय *',        placeholder: 'विषय चुनें…'             },
          message:      { label: 'समस्या बताएं',         optionalTag: '(वैकल्पिक)',
                          placeholder: 'अधिकारी को अपनी स्थिति के बारे में अधिक बताएं — फसल का प्रकार, प्रभावित क्षेत्र, दिखाई देने वाले लक्षण…' },
          submitBtn:    '📩 अधिकारी कॉलबैक का अनुरोध करें',
          submitting:   '⏳ भेजा जा रहा है…',
          privacy:      '🔒 आपकी जानकारी केवल आपके जिले के कृषि अधिकारी के साथ साझा की जाती है।',
        },
        success: {
          icon:    '🌾',
          title:   'अनुरोध सफलतापूर्वक भेजा गया!',
          message: 'आपके जिले के एक कृषि अधिकारी 24–48 घंटों के भीतर आपके पंजीकृत फ़ोन नंबर पर संपर्क करेंगे।',
          reset:   'एक और अनुरोध करें',
        },
        infoCards: [
          { icon: '⏱️', title: '24–48 घंटों में जवाब',       desc: 'आपके जिले के लिए नियुक्त सत्यापित सरकारी कृषि अधिकारी सीधे आपको कॉल करेंगे।' },
          { icon: '🌐', title: 'आपकी भाषा में विशेषज्ञ सलाह', desc: 'अधिकारी हिंदी, अंग्रेजी और प्रमुख क्षेत्रीय भाषाओं में उपलब्ध हैं।' },
          { icon: '🆓', title: 'पूरी तरह मुफ़्त सेवा',        desc: 'यह सेवा कृषि मंत्रालय द्वारा वित्त पोषित है। किसी भी परामर्श के लिए कोई शुल्क नहीं।' },
          { icon: '📋', title: 'क्या तैयार रखें',              desc: 'मृदा स्वास्थ्य कार्ड (यदि उपलब्ध हो), भूमि का आकार (एकड़ में), वर्तमान फसल का नाम और रोग या कीट की तस्वीरें।' },
        ],
        districts: ['आगरा','अलीगढ़','इलाहाबाद','अंबाला','अमृतसर','औरंगाबाद','बरेली','भोपाल','चंडीगढ़','चेन्नई','देहरादून','दिल्ली','फरीदाबाद','गुरुग्राम','हैदराबाद','इंदौर','जयपुर','जोधपुर','कानपुर','कोलकाता','लखनऊ','लुधियाना','मुंबई','नागपुर','नासिक','नोएडा','पटना','पुणे','रायपुर','रांची','सूरत','वाराणसी','विशाखापट्टनम'],
        topics: ['फसल रोग / कीट हमला','मिट्टी स्वास्थ्य और उर्वरक','सिंचाई और जल प्रबंधन','सरकारी योजना पात्रता','बीज और किस्म चयन','बाज़ार मूल्य और बिक्री','मौसम और जलवायु सलाह','अन्य / सामान्य प्रश्न'],
      },
  
      complaint: {
        sectionLabel: '🛠️ वेबसाइट समस्या रिपोर्ट करें',
        cardTitle:    'AgriSathi टीम को शिकायत भेजें',
        form: {
          name:        { label: 'आपका नाम *',        placeholder: 'पूरा नाम'              },
          email:       { label: 'ईमेल पता *',         placeholder: 'aap@example.com'       },
          category:    { label: 'समस्या श्रेणी *',    placeholder: 'श्रेणी चुनें…'         },
          description: { label: 'समस्या का विवरण *',
                         placeholder: 'कृपया बताएं कि क्या हुआ, कौन-सा पेज या फ़ीचर प्रभावित था, और कोई एरर मैसेज दिखा हो तो वो भी लिखें।' },
          submitBtn:   '🚨 शिकायत दर्ज करें',
          submitting:  '⏳ दर्ज हो रही है…',
          privacy:     '📧 पुष्टि और टिकट ID आपके ईमेल पर भेजी जाएगी।',
        },
        success: {
          icon:    '✅',
          title:   'शिकायत दर्ज हो गई!',
          message: 'हमारी तकनीकी टीम 2–3 कार्यदिवसों के भीतर आपकी रिपोर्ट की समीक्षा करेगी और ईमेल पर अपडेट भेजेगी। AgriSathi को बेहतर बनाने में मदद के लिए धन्यवाद।',
          reset:   'एक और शिकायत करें',
        },
        categories: ['फ़ीचर काम नहीं कर रहा','गलत / अशुद्ध डेटा','पेज लोडिंग समस्या','लॉगिन / अकाउंट समस्या','भुगतान / सदस्यता','डेटा गोपनीयता चिंता','UI / डिस्प्ले बग','अन्य'],
        whatNext: {
          heading: '🔁 रिपोर्ट के बाद क्या होता है?',
          steps: [
            { step: '01', title: 'टिकट बना',     desc: 'आपको तुरंत ईमेल पर एक अनूठा टिकट ID मिलता है।'          },
            { step: '02', title: 'टीम नियुक्त',  desc: 'हमारी इंजीनियरिंग टीम आपकी रिपोर्ट की समीक्षा करती है।' },
            { step: '03', title: 'सुधार तैनात',  desc: 'बग ठीक होने के बाद आपको सूचित किया जाता है।'             },
          ],
        },
        quickLinks: {
          heading: '🔗 त्वरित समस्या लिंक',
          links: [
            { icon: '🔐', label: 'लॉगिन / पासवर्ड रीसेट',    href: '/forgot-password' },
            { icon: '📲', label: 'मोबाइल पर ऐप नहीं खुल रहा', href: '#'               },
            { icon: '💳', label: 'भुगतान या सदस्यता समस्या',   href: '#'               },
            { icon: '🔒', label: 'डेटा गोपनीयता की शिकायत',   href: '#'               },
          ],
        },
      },
    },
  
    /* ══════════════════════════════════════════════════════════════════
       BENGALI
    ══════════════════════════════════════════════════════════════════ */
    bn: {
      lang: { label: 'ভাষা', en: 'EN', hi: 'HI', bn: 'BN' },
  
      header: {
        badge:    'কৃষক সহায়তা কেন্দ্র',
        h1a:      'আমরা এখানে আছি আপনাকে সাহায্য করতে',
        h1b:      'আপনার খামারকে সমৃদ্ধ করতে',
        subtitle: 'আপনার প্রশ্নের উত্তর খুঁজুন বা আমাদের AI কৃষি সহায়কের সাথে কথা বলুন — যা সর্বদা উপলব্ধ।',
      },
  
      stats: [
        { val: '৮৫–৯০%', label: 'AI সঠিকতা'       },
        { val: '২৪/৭',   label: 'AI সহায়তা'        },
        { val: '১০,০০০+',label: 'কৃষকদের সাহায্য'  },
      ],
  
      faq: {
        cardTitle:  'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
        pillAll:    '🌍 সব বিষয়',
        categories: [
          {
            id: 'general', title: 'সাধারণ', emoji: '🌾',
            faqs: [
              { question: 'প্ল্যাটফর্ম দিয়ে কীভাবে শুরু করব?',      answer: 'অ্যাকাউন্ট তৈরি করুন, খামারের তথ্য দিয়ে প্রোফাইল সম্পন্ন করুন এবং AI ফসল সুপারিশ, মাটি বিশ্লেষণের মতো সুবিধা ব্যবহার শুরু করুন।' },
              { question: 'প্ল্যাটফর্ম কি বিনামূল্যে?',              answer: 'আমরা বিনামূল্যে এবং প্রিমিয়াম উভয় পরিকল্পনা অফার করি। বিনামূল্যে পরিকল্পনায় মৌলিক সুবিধা রয়েছে, প্রিমিয়ামে উন্নত বিশ্লেষণ এবং সীমাহীন পূর্বাভাস পাওয়া যায়।' },
              { question: 'AI পূর্বাভাস কতটা নির্ভুল?',              answer: 'আমাদের ML মডেলের নির্ভুলতার হার ৮৫–৯০%। তবে ফলাফলগুলি আপনার কৃষি দক্ষতার পাশাপাশি নির্দেশিকা হিসাবে ব্যবহার করুন।' },
            ],
          },
          {
            id: 'crops', title: 'ফসল সুপারিশ', emoji: '🌿',
            faqs: [
              { question: 'ফসল সুপারিশের জন্য কী কী তথ্য দরকার?',   answer: 'সঠিক সুপারিশের জন্য মাটির NPK মান, pH স্তর, তাপমাত্রা, আর্দ্রতা এবং বৃষ্টিপাতের তথ্য প্রয়োজন।' },
              { question: 'একাধিক মৌসুমের জন্য কি সুপারিশ পাওয়া যায়?', answer: 'হ্যাঁ, আপনি খারিফ, রবি, জায়েদের মতো বিভিন্ন মৌসুমের জন্য আলাদা বিশ্লেষণ চালাতে পারেন।' },
            ],
          },
          {
            id: 'disease', title: 'রোগ সনাক্তকরণ', emoji: '🔍',
            faqs: [
              { question: 'রোগ সনাক্তকরণের জন্য ভালো ছবি কেমন হওয়া উচিত?', answer: '১৫–৩০ সেমি দূর থেকে স্পষ্ট, ভালো আলোতে তোলা ছবি ব্যবহার করুন। আক্রান্ত জায়গায় ফোকাস করুন এবং ঝাপসা বা অন্ধকার ছবি এড়িয়ে চলুন।' },
              { question: 'কোন কোন রোগ সনাক্ত করা যায়?',               answer: 'আমাদের মডেল পাতা ঝলসানো, চূর্ণ-রোগ, মরিচা, ব্যাকটেরিয়াল দাগ এবং ভাইরাল সংক্রমণসহ প্রধান রোগগুলি সনাক্ত করতে পারে।' },
            ],
          },
          {
            id: 'technical', title: 'প্রযুক্তিগত সহায়তা', emoji: '⚙️',
            faqs: [
              { question: 'কোনো সুবিধা কাজ না করলে কী করব?',  answer: 'প্রথমে পেজ রিফ্রেশ করুন। সমস্যা থাকলে ব্রাউজার ক্যাশ পরিষ্কার করুন বা অন্য ব্রাউজার ব্যবহার করুন। সমস্যা অব্যাহত থাকলে সাপোর্টে যোগাযোগ করুন।' },
              { question: 'বাগ রিপোর্ট কীভাবে করব?',            answer: 'ফিডব্যাক বোতাম ব্যবহার করুন বা support@agrisathi.in-এ স্ক্রিনশটসহ সমস্যার বিবরণ পাঠান।' },
            ],
          },
        ],
      },
  
      contact: {
        title:    'এখনও প্রশ্ন আছে?',
        subtitle: 'আমাদের সহায়তা দল মাত্র একটি বার্তার দূরত্বে।',
        email: { label: 'ইমেইল সহায়তা', value: 'support@agrisathi.in' },
        phone: { label: 'ফোন সহায়তা',  value: '+91 1800-123-4567'     },
      },
  
      officer: {
        sectionLabel: '👨‍🌾 বিশেষজ্ঞ কৃষি সহায়তা',
        cardTitle:    'একজন কৃষি কর্মকর্তার সাথে যোগাযোগ করুন',
        profiles: [
          { emoji: '👨‍🌾', name: 'ড. আর. কে. শর্মা', role: 'মাটি বিশেষজ্ঞ',       dist: 'লখনউ'  },
          { emoji: '👩‍🔬', name: 'ড. প্রিয়া রাও',    role: 'ফসল রোগ বিশেষজ্ঞ',   dist: 'পুণে'   },
          { emoji: '👨‍💼', name: 'শ্রী এ. কে. বর্মা', role: 'উদ্যানতত্ত্ব উপদেষ্টা',dist: 'জয়পুর' },
        ],
        form: {
          name:         { label: 'আপনার নাম *',       placeholder: 'যেমন রমেশ কুমার'          },
          phone:        { label: 'ফোন নম্বর *',       placeholder: '+91 98765 43210'           },
          district:     { label: 'আপনার জেলা *',      placeholder: 'জেলা বেছে নিন…'           },
          topic:        { label: 'সাহায্যের বিষয় *', placeholder: 'বিষয় বেছে নিন…'           },
          message:      { label: 'সমস্যা বর্ণনা করুন', optionalTag: '(ঐচ্ছিক)',
                          placeholder: 'কর্মকর্তাকে আপনার পরিস্থিতি সম্পর্কে আরও জানান — ফসলের ধরন, আক্রান্ত এলাকা, দৃশ্যমান লক্ষণ…' },
          submitBtn:    '📩 কর্মকর্তার কলব্যাক অনুরোধ করুন',
          submitting:   '⏳ পাঠানো হচ্ছে…',
          privacy:      '🔒 আপনার তথ্য শুধুমাত্র আপনার জেলার কৃষি কর্মকর্তার সাথে শেয়ার করা হবে।',
        },
        success: {
          icon:    '🌾',
          title:   'অনুরোধ সফলভাবে পাঠানো হয়েছে!',
          message: 'আপনার জেলার একজন কৃষি কর্মকর্তা ২৪–৪৮ ঘণ্টার মধ্যে আপনার নিবন্ধিত ফোন নম্বরে যোগাযোগ করবেন।',
          reset:   'আরেকটি অনুরোধ করুন',
        },
        infoCards: [
          { icon: '⏱️', title: '২৪–৪৮ ঘণ্টার মধ্যে সাড়া',      desc: 'আপনার জেলায় নিযুক্ত যাচাইকৃত সরকারি কৃষি কর্মকর্তা সরাসরি আপনাকে কল করবেন।' },
          { icon: '🌐', title: 'আপনার ভাষায় বিশেষজ্ঞ পরামর্শ', desc: 'কর্মকর্তারা হিন্দি, ইংরেজি এবং মারাঠি, তেলুগু, তামিলসহ প্রধান আঞ্চলিক ভাষায় উপলব্ধ।' },
          { icon: '🆓', title: 'সম্পূর্ণ বিনামূল্যে সেবা',       desc: 'এই সেবাটি কৃষি মন্ত্রণালয় কর্তৃক অর্থায়িত। কোনো পরামর্শের জন্য কৃষকের কাছ থেকে কোনো চার্জ নেওয়া হয় না।' },
          { icon: '📋', title: 'কী প্রস্তুত রাখবেন',             desc: 'মাটির স্বাস্থ্য কার্ড (যদি থাকে), জমির আকার (একরে), বর্তমান ফসলের নাম এবং রোগ বা পোকার যেকোনো ছবি।' },
        ],
        districts: ['আগ্রা','আলীগড়','এলাহাবাদ','আম্বালা','অমৃতসর','ঔরঙ্গাবাদ','বেরেলি','ভোপাল','চণ্ডীগড়','চেন্নাই','দেহরাদুন','দিল্লি','ফরিদাবাদ','গুরুগ্রাম','হায়দরাবাদ','ইন্দোর','জয়পুর','জোধপুর','কানপুর','কলকাতা','লখনউ','লুধিয়ানা','মুম্বাই','নাগপুর','নাসিক','নয়ডা','পাটনা','পুণে','রায়পুর','রাঁচি','সুরাট','বারাণসী','বিশাখাপত্তনম'],
        topics: ['ফসল রোগ / কীটপতঙ্গ আক্রমণ','মাটির স্বাস্থ্য ও সার','সেচ ও জল ব্যবস্থাপনা','সরকারি প্রকল্পের যোগ্যতা','বীজ ও জাত নির্বাচন','বাজার মূল্য ও বিক্রয়','আবহাওয়া ও জলবায়ু পরামর্শ','অন্যান্য / সাধারণ প্রশ্ন'],
      },
  
      complaint: {
        sectionLabel: '🛠️ ওয়েবসাইট সমস্যা রিপোর্ট করুন',
        cardTitle:    'AgriSathi দলে অভিযোগ জমা দিন',
        form: {
          name:        { label: 'আপনার নাম *',         placeholder: 'পুরো নাম'              },
          email:       { label: 'ইমেইল ঠিকানা *',      placeholder: 'aap@example.com'       },
          category:    { label: 'সমস্যার বিভাগ *',     placeholder: 'বিভাগ বেছে নিন…'      },
          description: { label: 'সমস্যার বিবরণ *',
                         placeholder: 'অনুগ্রহ করে ঠিক কী ঘটেছে, কোন পেজ বা ফিচার প্রভাবিত হয়েছে এবং কোনো ত্রুটি বার্তা দেখা গেলে তা লিখুন।' },
          submitBtn:   '🚨 অভিযোগ জমা দিন',
          submitting:  '⏳ জমা হচ্ছে…',
          privacy:     '📧 একটি নিশ্চিতকরণ এবং টিকেট ID আপনার ইমেইলে পাঠানো হবে।',
        },
        success: {
          icon:    '✅',
          title:   'অভিযোগ নিবন্ধিত হয়েছে!',
          message: 'আমাদের প্রযুক্তি দল ২–৩ কার্যদিবসের মধ্যে আপনার রিপোর্ট পর্যালোচনা করে ইমেইলে আপডেট পাঠাবে। AgriSathi উন্নত করতে সাহায্য করার জন্য ধন্যবাদ।',
          reset:   'আরেকটি অভিযোগ করুন',
        },
        categories: ['ফিচার কাজ করছে না','ভুল / অসঠিক ডেটা','পেজ লোডিং সমস্যা','লগইন / অ্যাকাউন্ট সমস্যা','পেমেন্ট / সদস্যপদ','ডেটা গোপনীয়তা উদ্বেগ','UI / ডিসপ্লে বাগ','অন্যান্য'],
        whatNext: {
          heading: '🔁 রিপোর্টের পরে কী হয়?',
          steps: [
            { step: '০১', title: 'টিকেট তৈরি',    desc: 'আপনি তাৎক্ষণিকভাবে ইমেইলে একটি অনন্য টিকেট ID পাবেন।'    },
            { step: '০২', title: 'দল নিযুক্ত',    desc: 'আমাদের ইঞ্জিনিয়ারিং দল আপনার রিপোর্ট পর্যালোচনা করে।'   },
            { step: '০৩', title: 'সমাধান প্রয়োগ', desc: 'বাগ ঠিক হওয়ার পর আপনাকে জানানো হয়।'                     },
          ],
        },
        quickLinks: {
          heading: '🔗 দ্রুত সমস্যা লিঙ্ক',
          links: [
            { icon: '🔐', label: 'লগইন / পাসওয়ার্ড রিসেট',       href: '/forgot-password' },
            { icon: '📲', label: 'মোবাইলে অ্যাপ লোড হচ্ছে না',    href: '#'               },
            { icon: '💳', label: 'পেমেন্ট বা সদস্যপদ সমস্যা',     href: '#'               },
            { icon: '🔒', label: 'ডেটা গোপনীয়তা উদ্বেগ জানান',   href: '#'               },
          ],
        },
      },
    },
  };
  
  export default helpdeskTranslations;