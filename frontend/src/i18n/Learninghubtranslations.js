// ─── AgriSathi Learning Hub Translations ───────────────────────────────────
// Supports: English (en), Hindi (hi), Bengali (bn)
// ALL display text lives here — LearningHub.jsx reads exclusively from t.

const learningHubTranslations = {

    /* ══════════════════════════════════════════════════════════════════
       ENGLISH
    ══════════════════════════════════════════════════════════════════ */
    en: {
      hero: {
        eyebrow:  'AgriSathi Learning Hub',
        titleA:   'Grow Your',
        titleB:   'Knowledge,',
        titleC:   'Grow Your Farm',
        subtitle: 'Expert-led courses in Hindi & Bengali — from soil science to modern precision farming, learn at your own pace.',
        stats: [
          { n: '50+',   l: 'Courses'            },
          { n: '15K+',  l: 'Learners'           },
          { n: '2',     l: 'Languages'          },
          { n: 'Free',  l: 'Always'             },
        ],
      },
  
      search: { placeholder: 'Search courses…' },
  
      categories: {
        sectionTitle: 'Browse Topics',
        list: [
          { id: 'all',     name: 'All'            },
          { id: 'soil',    name: 'Soil'           },
          { id: 'weather', name: 'Weather'        },
          { id: 'herbal',  name: 'Herbal Trees'   },
          { id: 'farming', name: 'Modern Farming' },
        ],
      },
  
      courses: {
        allLabel:    'All Courses',
        countSuffix: 'courses',
        startBtn:    'Start Learning',
        lessonUnit:  'lessons',
      },
  
      banner: [
        { n: '50+',     l: 'Total Courses'      },
        { n: '15,000+', l: 'Active Learners'    },
        { n: '5,000+',  l: 'Certificates Issued'},
      ],
  
      learning: {
        backBtn:      'Courses',
        lessonOf:     'Lesson',
        of:           'of',
        progressLabel:'% complete',
        markComplete: 'Mark Complete',
        completed:    'Completed',
        prevBtn:      'Previous',
        nextBtn:      'Next',
        courseContent:'Course Content',
        watchYT:      'Watch on YouTube',
      },
  
      materials: {
        heading:      'Course Materials',
        langBadge:    'हिंदी & বাংলা',
        comingSoon:   'Coming soon',
        available:    'available',
        downloadBtn:  'Download',
        pdfLabel:     'PDF',
      },
  
      modal: {
        badge:        'Download PDF',
        title:        'Choose Language',
        cancelBtn:    'Cancel',
        downloadBtn:  'Download PDF',
        openingBtn:   'Opening…',
        openedBtn:    'Opened!',
        gdrive:       "This PDF is on Google Drive — it'll open in a new tab. Click Download on that page.",
        errorMsg:     'Download failed. Please try again.',
        notAvailable: 'This language is not available yet.',
        langs: [
          { id: 'hindi',   label: 'हिंदी', sub: 'Hindi',   flag: '🇮🇳', notAvail: 'Hindi — not available'   },
          { id: 'bengali', label: 'বাংলা', sub: 'Bengali', flag: '🇮🇳', notAvail: 'Bengali — not available' },
        ],
      },
  
      levels: {
        Beginner:     'Beginner',
        Intermediate: 'Intermediate',
        Advanced:     'Advanced',
      },
  
      courses_data: [
        {
          id: 1, category: 'soil', image: '🌱',
          title: 'Complete Soil Health Management',
          description: 'Learn everything about soil testing, pH balance, nutrient management, and organic farming.',
          duration: '6 weeks', lessons: 24, level: 'Beginner', enrolled: 1250,
          topics: ['Soil Testing', 'pH Management', 'Composting', 'Micronutrients'],
          courseLessons: [
            { id: 1, title: 'Introduction to Soil Health',  duration: '15:30', description: 'Understanding the basics of soil composition and why soil health matters for farming.',    videoUrl: 'https://www.youtube.com/embed/W6HyGx-pqkI', materials: [{ name: 'Soil Health Guide.pdf',       hindi: 'https://docs.google.com/document/d/1DIZSvVI6CqoQDpLBoL486TU9GrIrsus0/export?format=pdf', bengali: 'https://docs.google.com/document/d/1S8q_HTmJSNUljCOVazfwqD-W7Sp0f9PC/export?format=pdf' }] },
            { id: 2, title: 'Soil Testing Methods',         duration: '22:45', description: 'Learn different methods to test your soil pH, nutrients, and composition.',               videoUrl: 'https://www.youtube.com/embed/6DEU4YHSyi0', materials: [{ name: 'Testing Equipment List.pdf',   hindi: 'https://docs.google.com/document/d/1a7SAneTMZJ-feH8tSlAoPII4H1iPXLIm/export?format=pdf', bengali: 'https://docs.google.com/document/d/1RX5Z1PnlUnl2Zc9rHpHY4vZLLDskWmCz/export?format=pdf' }] },
            { id: 3, title: 'Understanding pH Levels',      duration: '18:20', description: 'Deep dive into soil pH and how it affects crop growth.',                                  videoUrl: 'https://www.youtube.com/embed/W6HyGx-pqkI', materials: [{ name: 'pH Management Guide.pdf',    hindi: 'https://docs.google.com/document/d/1BzJSebhWO-ri9xmwjpNS7PDNXKvtbRhP/export?format=pdf', bengali: 'https://docs.google.com/document/d/15U5hp3HV5zLa6bUixxp0we8gCcshz15U/export?format=pdf' }] },
            { id: 4, title: 'Composting Basics',            duration: '25:15', description: 'Learn how to create high-quality compost naturally.',                                     videoUrl: 'https://www.youtube.com/embed/6DEU4YHSyi0', materials: [{ name: 'Composting Step-by-Step.pdf', hindi: 'https://docs.google.com/document/d/1n1ciLXWOq3Bd0Ufp0WEqq6zTFN-id-zc/export?format=pdf', bengali: 'https://docs.google.com/document/d/1WgKV_CNVZ9eWX_WbfgLRM5a2NEV_lkiz/export?format=pdf' }] },
          ],
        },
        {
          id: 2, category: 'weather', image: '🌤️',
          title: 'Weather Patterns & Crop Planning',
          description: 'Understand forecasting, seasonal patterns, and how to plan your crops accordingly.',
          duration: '4 weeks', lessons: 18, level: 'Intermediate', enrolled: 890,
          topics: ['Climate Zones', 'Rainfall Patterns', 'Temperature Effects', 'Seasonal Planning'],
          courseLessons: [
            { id: 1, title: 'Understanding Weather Patterns', duration: '20:00', description: 'Read and interpret weather forecasts for better farm planning.',        videoUrl: 'https://www.youtube.com/embed/u1cY70eU1u0', materials: [{ name: 'Weather Reading Guide.pdf', hindi: 'https://docs.google.com/document/d/1MYi3g7MJUhemjSF-tkv1ENuQNMPDyB9E/export?format=pdf', bengali: 'https://docs.google.com/document/d/196OVJeQISedxiH022SSHqH2edi5uf3Rs/export?format=pdf' }] },
            { id: 2, title: 'Seasonal Crop Planning',        duration: '28:30', description: 'Plan crops according to seasonal weather changes.',                     videoUrl: 'https://www.youtube.com/embed/szn_Nz-bPeE', materials: [{ name: 'Seasonal Calendar.pdf',       hindi: 'https://docs.google.com/document/d/1nVAmAF42jgOcwFxmqtmd3SLhHJMd65Ps/export?format=pdf', bengali: 'https://docs.google.com/document/d/1l0TQB36612QMvHgDgzBzYZ9L_4LRgybs/export?format=pdf' }] },
            { id: 3, title: 'Rainfall Management',           duration: '24:45', description: 'Managing water resources based on rainfall predictions.',              videoUrl: 'https://www.youtube.com/embed/u1cY70eU1u0', materials: [{ name: 'Water Management Plan.pdf',  hindi: 'https://docs.google.com/document/d/1BbqI74zim0mcjClL_J3ZQysR7JNkbXRn/export?format=pdf', bengali: 'https://docs.google.com/document/d/1l4qa_4VrhaUtkaCV5PbgqLq9bVX83Rhp/export?format=pdf' }] },
          ],
        },
        {
          id: 3, category: 'herbal', image: '🌿',
          title: 'Medicinal & Herbal Tree Cultivation',
          description: 'Grow medicinal plants and herbal trees for health benefits and additional income.',
          duration: '8 weeks', lessons: 32, level: 'Beginner', enrolled: 2100,
          topics: ['Neem Cultivation', 'Tulsi Growing', 'Aloe Vera', 'Moringa Farming'],
          courseLessons: [
            { id: 1, title: 'Introduction to Medicinal Plants', duration: '16:40', description: 'Overview of medicinal plants and their economic potential.',          videoUrl: 'https://www.youtube.com/embed/D2aPL0JFxl0', materials: [{ name: 'Medicinal Plants Guide.pdf',   hindi: null, bengali: null }] },
            { id: 2, title: 'Neem Tree Cultivation',            duration: '30:20', description: 'Complete guide to growing neem trees for maximum benefit.',           videoUrl: 'https://www.youtube.com/embed/ArM4U83cvQM', materials: [{ name: 'Neem Cultivation Manual.pdf', hindi: 'https://docs.google.com/document/d/1l1OQ-vPhWokST2Kws8gXKDEaxFA2pQ0i/export?format=pdf', bengali: 'https://docs.google.com/document/d/1eAtMukT--GjWap9DvCZ9-hYmgdqWXpBH/export?format=pdf' }] },
            { id: 3, title: 'Tulsi and Holy Basil',             duration: '22:15', description: 'Best practices for cultivating tulsi for medicinal use.',             videoUrl: 'https://www.youtube.com/embed/D2aPL0JFxl0', materials: [{ name: 'Tulsi Growing Tips.pdf',       hindi: null, bengali: null }] },
          ],
        },
        {
          id: 4, category: 'farming', image: '🚜',
          title: 'Modern Farming Techniques',
          description: 'Master drip irrigation, hydroponics, and precision agriculture for the future.',
          duration: '10 weeks', lessons: 40, level: 'Advanced', enrolled: 760,
          topics: ['Drip Irrigation', 'Hydroponics', 'Vertical Farming', 'Smart Sensors'],
          courseLessons: [
            { id: 1, title: 'Introduction to Modern Farming', duration: '18:50', description: 'Overview of modern farming technologies and benefits.',                    videoUrl: 'https://www.youtube.com/embed/4gsJKyFtHUE', materials: [{ name: 'Modern Farming Overview.pdf', hindi: 'https://docs.google.com/document/d/1kwoEwyb8JFV3wA3SFVMXJTt2lPgTCXjh/export?format=pdf', bengali: 'https://docs.google.com/document/d/1VLkIrec0bUy7wIUyDy5TuqcMraTC09NW/export?format=pdf' }] },
            { id: 2, title: 'Drip Irrigation Systems',        duration: '35:20', description: 'Complete guide to installing and managing drip systems.',                 videoUrl: 'https://www.youtube.com/embed/vBPCtUOxCkE', materials: [{ name: 'Installation Guide.pdf',       hindi: 'https://docs.google.com/document/d/165SFZNa_Uv5lVvUT1AyyJKypEdnXBoRb/export?format=pdf', bengali: 'https://docs.google.com/document/d/16VG1977HhODRvnS3xEcp_uDXdBodd7Gf/export?format=pdf' }] },
            { id: 3, title: 'Introduction to Hydroponics',    duration: '28:40', description: 'Soil-less farming techniques and hydroponic system basics.',             videoUrl: 'https://www.youtube.com/embed/4gsJKyFtHUE', materials: [{ name: 'Hydroponics Starter Kit.pdf',  hindi: 'https://docs.google.com/document/d/1NH59NYXyBca-f3bBPiGsD3TvX06EIkoh/export?format=pdf', bengali: 'https://docs.google.com/document/d/1FuDaJ3rIChLRFbEHdRhGVErEd6NdwJxm/export?format=pdf' }] },
          ],
        },
        {
          id: 5, category: 'soil', image: '♻️',
          title: 'Organic Farming Essentials',
          description: 'Complete guide to organic farming, composting, and natural pest control.',
          duration: '5 weeks', lessons: 20, level: 'Beginner', enrolled: 1580,
          topics: ['Organic Certification', 'Natural Pesticides', 'Crop Rotation', 'Green Manure'],
          courseLessons: [
            { id: 1, title: 'What is Organic Farming?', duration: '14:25', description: 'Understanding organic farming principles and certification.',          videoUrl: 'https://www.youtube.com/embed/mkEsLdNKlPM', materials: [{ name: 'Organic Standards.pdf',      hindi: null, bengali: null }] },
            { id: 2, title: 'Natural Pest Control',     duration: '26:30', description: 'Effective natural methods to control pests without chemicals.',        videoUrl: 'https://www.youtube.com/embed/mkEsLdNKlPM', materials: [{ name: 'Pest Control Methods.pdf',   hindi: 'https://docs.google.com/document/d/1GDaMRqAyI-9yNvpx50vAz3cK1yXjHEzN/export?format=pdf', bengali: 'https://docs.google.com/document/d/1xDMCdKSSGS-E3L_7QsElO5bK42_d96wX/export?format=pdf' }] },
          ],
        },
        {
          id: 6, category: 'farming', image: '💧',
          title: 'Water Management in Agriculture',
          description: 'Efficient water usage, rainwater harvesting, and irrigation optimization.',
          duration: '4 weeks', lessons: 16, level: 'Intermediate', enrolled: 920,
          topics: ['Rainwater Harvesting', 'Drip Systems', 'Water Conservation', 'Scheduling'],
          courseLessons: [
            { id: 1, title: 'Water Conservation Principles',   duration: '19:15', description: 'Understanding water scarcity and farm conservation strategies.', videoUrl: 'https://www.youtube.com/embed/ba0In5ezHXc', materials: [{ name: 'Conservation Guide.pdf', hindi: null, bengali: null }] },
            { id: 2, title: 'Rainwater Harvesting Systems',    duration: '31:40', description: 'Design and implement rainwater harvesting.',                    videoUrl: 'https://www.youtube.com/embed/S0Dmkhr8t0w', materials: [{ name: 'System Design.pdf',      hindi: null, bengali: null }, { name: 'Cost Analysis.pdf', hindi: null, bengali: null }] },
          ],
        },
      ],
    },
  
    /* ══════════════════════════════════════════════════════════════════
       HINDI
    ══════════════════════════════════════════════════════════════════ */
    hi: {
      hero: {
        eyebrow:  'AgriSathi लर्निंग हब',
        titleA:   'अपना ज्ञान',
        titleB:   'बढ़ाएं,',
        titleC:   'खेत को समृद्ध करें',
        subtitle: 'हिंदी और बांग्ला में विशेषज्ञ-नेतृत्व वाले पाठ्यक्रम — मिट्टी विज्ञान से आधुनिक खेती तक, अपनी गति से सीखें।',
        stats: [
          { n: '50+',   l: 'पाठ्यक्रम'     },
          { n: '15K+',  l: 'शिक्षार्थी'    },
          { n: '2',     l: 'भाषाएँ'        },
          { n: 'मुफ़्त', l: 'हमेशा'         },
        ],
      },
  
      search: { placeholder: 'पाठ्यक्रम खोजें…' },
  
      categories: {
        sectionTitle: 'विषय ब्राउज़ करें',
        list: [
          { id: 'all',     name: 'सभी'          },
          { id: 'soil',    name: 'मिट्टी'        },
          { id: 'weather', name: 'मौसम'          },
          { id: 'herbal',  name: 'जड़ी-बूटी पेड़' },
          { id: 'farming', name: 'आधुनिक खेती'  },
        ],
      },
  
      courses: {
        allLabel:    'सभी पाठ्यक्रम',
        countSuffix: 'पाठ्यक्रम',
        startBtn:    'सीखना शुरू करें',
        lessonUnit:  'पाठ',
      },
  
      banner: [
        { n: '50+',     l: 'कुल पाठ्यक्रम'      },
        { n: '15,000+', l: 'सक्रिय शिक्षार्थी'   },
        { n: '5,000+',  l: 'प्रमाणपत्र जारी'    },
      ],
  
      learning: {
        backBtn:       'पाठ्यक्रम',
        lessonOf:      'पाठ',
        of:            'में से',
        progressLabel: '% पूर्ण',
        markComplete:  'पूर्ण करें',
        completed:     'पूर्ण हुआ',
        prevBtn:       'पिछला',
        nextBtn:       'अगला',
        courseContent: 'पाठ्यक्रम सामग्री',
        watchYT:       'YouTube पर देखें',
      },
  
      materials: {
        heading:     'पाठ्यक्रम सामग्री',
        langBadge:   'हिंदी & বাংলা',
        comingSoon:  'जल्द आएगा',
        available:   'उपलब्ध',
        downloadBtn: 'डाउनलोड',
        pdfLabel:    'PDF',
      },
  
      modal: {
        badge:        'PDF डाउनलोड',
        title:        'भाषा चुनें',
        cancelBtn:    'रद्द करें',
        downloadBtn:  'PDF डाउनलोड',
        openingBtn:   'खुल रहा है…',
        openedBtn:    'खुल गया!',
        gdrive:       'यह PDF Google Drive पर है — यह नए टैब में खुलेगी। उस पेज पर डाउनलोड पर क्लिक करें।',
        errorMsg:     'डाउनलोड विफल। कृपया पुनः प्रयास करें।',
        notAvailable: 'यह भाषा अभी उपलब्ध नहीं है।',
        langs: [
          { id: 'hindi',   label: 'हिंदी', sub: 'Hindi',   flag: '🇮🇳', notAvail: 'हिंदी — उपलब्ध नहीं'  },
          { id: 'bengali', label: 'বাংলা', sub: 'Bengali', flag: '🇮🇳', notAvail: 'Bengali — उपलब्ध नहीं' },
        ],
      },
  
      levels: {
        Beginner:     'शुरुआती',
        Intermediate: 'मध्यम',
        Advanced:     'उन्नत',
      },
  
      courses_data: [
        {
          id: 1, category: 'soil', image: '🌱',
          title: 'संपूर्ण मिट्टी स्वास्थ्य प्रबंधन',
          description: 'मिट्टी परीक्षण, pH संतुलन, पोषक तत्व प्रबंधन और जैविक खेती के बारे में सब कुछ सीखें।',
          duration: '6 सप्ताह', lessons: 24, level: 'Beginner', enrolled: 1250,
          topics: ['मिट्टी परीक्षण', 'pH प्रबंधन', 'खाद बनाना', 'सूक्ष्म पोषक तत्व'],
          courseLessons: [
            { id: 1, title: 'मिट्टी स्वास्थ्य का परिचय',  duration: '15:30', description: 'मिट्टी की संरचना की मूल बातें और खेती के लिए मिट्टी स्वास्थ्य का महत्व।',    videoUrl: 'https://www.youtube.com/embed/W6HyGx-pqkI', materials: [{ name: 'Soil Health Guide.pdf',       hindi: 'https://docs.google.com/document/d/1DIZSvVI6CqoQDpLBoL486TU9GrIrsus0/export?format=pdf', bengali: 'https://docs.google.com/document/d/1S8q_HTmJSNUljCOVazfwqD-W7Sp0f9PC/export?format=pdf' }] },
            { id: 2, title: 'मिट्टी परीक्षण विधियाँ',     duration: '22:45', description: 'अपनी मिट्टी के pH, पोषक तत्वों और संरचना के परीक्षण की विभिन्न विधियाँ।',  videoUrl: 'https://www.youtube.com/embed/6DEU4YHSyi0', materials: [{ name: 'Testing Equipment List.pdf',   hindi: 'https://docs.google.com/document/d/1a7SAneTMZJ-feH8tSlAoPII4H1iPXLIm/export?format=pdf', bengali: 'https://docs.google.com/document/d/1RX5Z1PnlUnl2Zc9rHpHY4vZLLDskWmCz/export?format=pdf' }] },
            { id: 3, title: 'pH स्तरों को समझना',         duration: '18:20', description: 'मिट्टी pH और यह फसल विकास को कैसे प्रभावित करता है।',                       videoUrl: 'https://www.youtube.com/embed/W6HyGx-pqkI', materials: [{ name: 'pH Management Guide.pdf',    hindi: 'https://docs.google.com/document/d/1BzJSebhWO-ri9xmwjpNS7PDNXKvtbRhP/export?format=pdf', bengali: 'https://docs.google.com/document/d/15U5hp3HV5zLa6bUixxp0we8gCcshz15U/export?format=pdf' }] },
            { id: 4, title: 'खाद बनाने की मूल बातें',    duration: '25:15', description: 'प्राकृतिक रूप से उच्च गुणवत्ता वाली खाद कैसे बनाएं।',                      videoUrl: 'https://www.youtube.com/embed/6DEU4YHSyi0', materials: [{ name: 'Composting Step-by-Step.pdf', hindi: 'https://docs.google.com/document/d/1n1ciLXWOq3Bd0Ufp0WEqq6zTFN-id-zc/export?format=pdf', bengali: 'https://docs.google.com/document/d/1WgKV_CNVZ9eWX_WbfgLRM5a2NEV_lkiz/export?format=pdf' }] },
          ],
        },
        {
          id: 2, category: 'weather', image: '🌤️',
          title: 'मौसम पैटर्न और फसल योजना',
          description: 'पूर्वानुमान, मौसमी पैटर्न और अपनी फसलों की योजना बनाना सीखें।',
          duration: '4 सप्ताह', lessons: 18, level: 'Intermediate', enrolled: 890,
          topics: ['जलवायु क्षेत्र', 'वर्षा पैटर्न', 'तापमान प्रभाव', 'मौसमी योजना'],
          courseLessons: [
            { id: 1, title: 'मौसम पैटर्न को समझना', duration: '20:00', description: 'बेहतर खेत योजना के लिए मौसम पूर्वानुमान पढ़ना और समझना।',  videoUrl: 'https://www.youtube.com/embed/u1cY70eU1u0', materials: [{ name: 'Weather Reading Guide.pdf', hindi: 'https://docs.google.com/document/d/1MYi3g7MJUhemjSF-tkv1ENuQNMPDyB9E/export?format=pdf', bengali: 'https://docs.google.com/document/d/196OVJeQISedxiH022SSHqH2edi5uf3Rs/export?format=pdf' }] },
            { id: 2, title: 'मौसमी फसल योजना',      duration: '28:30', description: 'मौसमी मौसम परिवर्तन के अनुसार फसलों की योजना बनाएं।',    videoUrl: 'https://www.youtube.com/embed/szn_Nz-bPeE', materials: [{ name: 'Seasonal Calendar.pdf',       hindi: 'https://docs.google.com/document/d/1nVAmAF42jgOcwFxmqtmd3SLhHJMd65Ps/export?format=pdf', bengali: 'https://docs.google.com/document/d/1l0TQB36612QMvHgDgzBzYZ9L_4LRgybs/export?format=pdf' }] },
            { id: 3, title: 'वर्षा प्रबंधन',        duration: '24:45', description: 'वर्षा पूर्वानुमान के आधार पर जल संसाधनों का प्रबंधन।',    videoUrl: 'https://www.youtube.com/embed/u1cY70eU1u0', materials: [{ name: 'Water Management Plan.pdf',  hindi: 'https://docs.google.com/document/d/1BbqI74zim0mcjClL_J3ZQysR7JNkbXRn/export?format=pdf', bengali: 'https://docs.google.com/document/d/1l4qa_4VrhaUtkaCV5PbgqLq9bVX83Rhp/export?format=pdf' }] },
          ],
        },
        {
          id: 3, category: 'herbal', image: '🌿',
          title: 'औषधीय और जड़ी-बूटी पेड़ की खेती',
          description: 'स्वास्थ्य लाभ और अतिरिक्त आय के लिए औषधीय पौधे और जड़ी-बूटी पेड़ उगाएं।',
          duration: '8 सप्ताह', lessons: 32, level: 'Beginner', enrolled: 2100,
          topics: ['नीम की खेती', 'तुलसी उगाना', 'एलोवेरा', 'मोरिंगा खेती'],
          courseLessons: [
            { id: 1, title: 'औषधीय पौधों का परिचय', duration: '16:40', description: 'औषधीय पौधों और उनकी आर्थिक क्षमता का अवलोकन।',     videoUrl: 'https://www.youtube.com/embed/D2aPL0JFxl0', materials: [{ name: 'Medicinal Plants Guide.pdf',   hindi: null, bengali: null }] },
            { id: 2, title: 'नीम पेड़ की खेती',      duration: '30:20', description: 'अधिकतम लाभ के लिए नीम पेड़ उगाने की पूरी गाइड।',   videoUrl: 'https://www.youtube.com/embed/ArM4U83cvQM', materials: [{ name: 'Neem Cultivation Manual.pdf', hindi: 'https://docs.google.com/document/d/1l1OQ-vPhWokST2Kws8gXKDEaxFA2pQ0i/export?format=pdf', bengali: 'https://docs.google.com/document/d/1eAtMukT--GjWap9DvCZ9-hYmgdqWXpBH/export?format=pdf' }] },
            { id: 3, title: 'तुलसी और होली बेसिल', duration: '22:15', description: 'औषधीय उपयोग के लिए तुलसी की खेती के सर्वोत्तम तरीके।', videoUrl: 'https://www.youtube.com/embed/D2aPL0JFxl0', materials: [{ name: 'Tulsi Growing Tips.pdf',       hindi: null, bengali: null }] },
          ],
        },
        {
          id: 4, category: 'farming', image: '🚜',
          title: 'आधुनिक खेती तकनीकें',
          description: 'भविष्य के लिए ड्रिप सिंचाई, हाइड्रोपोनिक्स और परिशुद्ध कृषि में महारत हासिल करें।',
          duration: '10 सप्ताह', lessons: 40, level: 'Advanced', enrolled: 760,
          topics: ['ड्रिप सिंचाई', 'हाइड्रोपोनिक्स', 'वर्टिकल फार्मिंग', 'स्मार्ट सेंसर'],
          courseLessons: [
            { id: 1, title: 'आधुनिक खेती का परिचय', duration: '18:50', description: 'आधुनिक खेती तकनीकों और लाभों का अवलोकन।',          videoUrl: 'https://www.youtube.com/embed/4gsJKyFtHUE', materials: [{ name: 'Modern Farming Overview.pdf', hindi: 'https://docs.google.com/document/d/1kwoEwyb8JFV3wA3SFVMXJTt2lPgTCXjh/export?format=pdf', bengali: 'https://docs.google.com/document/d/1VLkIrec0bUy7wIUyDy5TuqcMraTC09NW/export?format=pdf' }] },
            { id: 2, title: 'ड्रिप सिंचाई प्रणाली', duration: '35:20', description: 'ड्रिप सिस्टम स्थापित करने और प्रबंधित करने की पूरी गाइड।', videoUrl: 'https://www.youtube.com/embed/vBPCtUOxCkE', materials: [{ name: 'Installation Guide.pdf',       hindi: 'https://docs.google.com/document/d/165SFZNa_Uv5lVvUT1AyyJKypEdnXBoRb/export?format=pdf', bengali: 'https://docs.google.com/document/d/16VG1977HhODRvnS3xEcp_uDXdBodd7Gf/export?format=pdf' }] },
            { id: 3, title: 'हाइड्रोपोनिक्स का परिचय',duration:'28:40', description: 'मिट्टी-रहित खेती तकनीक और हाइड्रोपोनिक सिस्टम की मूल बातें।', videoUrl: 'https://www.youtube.com/embed/4gsJKyFtHUE', materials: [{ name: 'Hydroponics Starter Kit.pdf',  hindi: 'https://docs.google.com/document/d/1NH59NYXyBca-f3bBPiGsD3TvX06EIkoh/export?format=pdf', bengali: 'https://docs.google.com/document/d/1FuDaJ3rIChLRFbEHdRhGVErEd6NdwJxm/export?format=pdf' }] },
          ],
        },
        {
          id: 5, category: 'soil', image: '♻️',
          title: 'जैविक खेती की आवश्यकताएं',
          description: 'जैविक खेती, खाद बनाने और प्राकृतिक कीट नियंत्रण की पूरी गाइड।',
          duration: '5 सप्ताह', lessons: 20, level: 'Beginner', enrolled: 1580,
          topics: ['जैविक प्रमाणन', 'प्राकृतिक कीटनाशक', 'फसल चक्र', 'हरी खाद'],
          courseLessons: [
            { id: 1, title: 'जैविक खेती क्या है?',  duration: '14:25', description: 'जैविक खेती के सिद्धांत और प्रमाणन को समझना।',            videoUrl: 'https://www.youtube.com/embed/mkEsLdNKlPM', materials: [{ name: 'Organic Standards.pdf',    hindi: null, bengali: null }] },
            { id: 2, title: 'प्राकृतिक कीट नियंत्रण',duration:'26:30', description: 'रसायनों के बिना कीटों को नियंत्रित करने के प्रभावी प्राकृतिक तरीके।', videoUrl: 'https://www.youtube.com/embed/mkEsLdNKlPM', materials: [{ name: 'Pest Control Methods.pdf', hindi: 'https://docs.google.com/document/d/1GDaMRqAyI-9yNvpx50vAz3cK1yXjHEzN/export?format=pdf', bengali: 'https://docs.google.com/document/d/1xDMCdKSSGS-E3L_7QsElO5bK42_d96wX/export?format=pdf' }] },
          ],
        },
        {
          id: 6, category: 'farming', image: '💧',
          title: 'कृषि में जल प्रबंधन',
          description: 'कुशल जल उपयोग, वर्षा जल संचयन और सिंचाई अनुकूलन।',
          duration: '4 सप्ताह', lessons: 16, level: 'Intermediate', enrolled: 920,
          topics: ['वर्षा जल संचयन', 'ड्रिप सिस्टम', 'जल संरक्षण', 'शेड्यूलिंग'],
          courseLessons: [
            { id: 1, title: 'जल संरक्षण के सिद्धांत',   duration: '19:15', description: 'जल की कमी और खेत संरक्षण रणनीतियों को समझना।', videoUrl: 'https://www.youtube.com/embed/ba0In5ezHXc', materials: [{ name: 'Conservation Guide.pdf', hindi: null, bengali: null }] },
            { id: 2, title: 'वर्षा जल संचयन प्रणाली', duration: '31:40', description: 'वर्षा जल संचयन डिजाइन और कार्यान्वयन।',         videoUrl: 'https://www.youtube.com/embed/S0Dmkhr8t0w', materials: [{ name: 'System Design.pdf', hindi: null, bengali: null }, { name: 'Cost Analysis.pdf', hindi: null, bengali: null }] },
          ],
        },
      ],
    },
  
    /* ══════════════════════════════════════════════════════════════════
       BENGALI
    ══════════════════════════════════════════════════════════════════ */
    bn: {
      hero: {
        eyebrow:  'AgriSathi লার্নিং হাব',
        titleA:   'আপনার জ্ঞান',
        titleB:   'বাড়ান,',
        titleC:   'খামার সমৃদ্ধ করুন',
        subtitle: 'হিন্দি ও বাংলায় বিশেষজ্ঞ-নির্দেশিত কোর্স — মাটি বিজ্ঞান থেকে আধুনিক কৃষি পর্যন্ত, নিজের গতিতে শিখুন।',
        stats: [
          { n: '৫০+',   l: 'কোর্স'          },
          { n: '১৫K+',  l: 'শিক্ষার্থী'     },
          { n: '২',     l: 'ভাষা'           },
          { n: 'বিনামূল্যে', l: 'সর্বদা'   },
        ],
      },
  
      search: { placeholder: 'কোর্স খুঁজুন…' },
  
      categories: {
        sectionTitle: 'বিষয় ব্রাউজ করুন',
        list: [
          { id: 'all',     name: 'সব'              },
          { id: 'soil',    name: 'মাটি'             },
          { id: 'weather', name: 'আবহাওয়া'          },
          { id: 'herbal',  name: 'ভেষজ গাছ'         },
          { id: 'farming', name: 'আধুনিক কৃষি'      },
        ],
      },
  
      courses: {
        allLabel:    'সব কোর্স',
        countSuffix: 'কোর্স',
        startBtn:    'শেখা শুরু করুন',
        lessonUnit:  'পাঠ',
      },
  
      banner: [
        { n: '৫০+',     l: 'মোট কোর্স'         },
        { n: '১৫,০০০+', l: 'সক্রিয় শিক্ষার্থী'  },
        { n: '৫,০০০+',  l: 'সার্টিফিকেট প্রদান' },
      ],
  
      learning: {
        backBtn:       'কোর্স',
        lessonOf:      'পাঠ',
        of:            'এর মধ্যে',
        progressLabel: '% সম্পন্ন',
        markComplete:  'সম্পন্ন করুন',
        completed:     'সম্পন্ন হয়েছে',
        prevBtn:       'আগের',
        nextBtn:       'পরের',
        courseContent: 'কোর্সের বিষয়বস্তু',
        watchYT:       'YouTube-এ দেখুন',
      },
  
      materials: {
        heading:     'কোর্স সামগ্রী',
        langBadge:   'हिंदी & বাংলা',
        comingSoon:  'শীঘ্রই আসছে',
        available:   'উপলব্ধ',
        downloadBtn: 'ডাউনলোড',
        pdfLabel:    'PDF',
      },
  
      modal: {
        badge:        'PDF ডাউনলোড',
        title:        'ভাষা বেছে নিন',
        cancelBtn:    'বাতিল করুন',
        downloadBtn:  'PDF ডাউনলোড',
        openingBtn:   'খুলছে…',
        openedBtn:    'খুলে গেছে!',
        gdrive:       'এই PDF Google Drive-এ আছে — এটি নতুন ট্যাবে খুলবে। সেই পেজে ডাউনলোড-এ ক্লিক করুন।',
        errorMsg:     'ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।',
        notAvailable: 'এই ভাষা এখনও উপলব্ধ নেই।',
        langs: [
          { id: 'hindi',   label: 'हिंदी', sub: 'Hindi',   flag: '🇮🇳', notAvail: 'Hindi — উপলব্ধ নেই'   },
          { id: 'bengali', label: 'বাংলা', sub: 'Bengali', flag: '🇮🇳', notAvail: 'Bengali — উপলব্ধ নেই' },
        ],
      },
  
      levels: {
        Beginner:     'প্রাথমিক',
        Intermediate: 'মধ্যবর্তী',
        Advanced:     'উন্নত',
      },
  
      courses_data: [
        {
          id: 1, category: 'soil', image: '🌱',
          title: 'সম্পূর্ণ মাটির স্বাস্থ্য ব্যবস্থাপনা',
          description: 'মাটি পরীক্ষা, pH ভারসাম্য, পুষ্টি ব্যবস্থাপনা এবং জৈব চাষ সম্পর্কে সব কিছু শিখুন।',
          duration: '৬ সপ্তাহ', lessons: 24, level: 'Beginner', enrolled: 1250,
          topics: ['মাটি পরীক্ষা', 'pH ব্যবস্থাপনা', 'কম্পোস্টিং', 'অনুখাদ্য'],
          courseLessons: [
            { id: 1, title: 'মাটির স্বাস্থ্যের ভূমিকা',  duration: '15:30', description: 'মাটির গঠনের মূল বিষয় এবং কৃষিতে মাটির স্বাস্থ্য কেন গুরুত্বপূর্ণ।',   videoUrl: 'https://www.youtube.com/embed/W6HyGx-pqkI', materials: [{ name: 'Soil Health Guide.pdf',       hindi: 'https://docs.google.com/document/d/1DIZSvVI6CqoQDpLBoL486TU9GrIrsus0/export?format=pdf', bengali: 'https://docs.google.com/document/d/1S8q_HTmJSNUljCOVazfwqD-W7Sp0f9PC/export?format=pdf' }] },
            { id: 2, title: 'মাটি পরীক্ষার পদ্ধতি',     duration: '22:45', description: 'মাটির pH, পুষ্টি ও গঠন পরীক্ষার বিভিন্ন পদ্ধতি শিখুন।',               videoUrl: 'https://www.youtube.com/embed/6DEU4YHSyi0', materials: [{ name: 'Testing Equipment List.pdf',   hindi: 'https://docs.google.com/document/d/1a7SAneTMZJ-feH8tSlAoPII4H1iPXLIm/export?format=pdf', bengali: 'https://docs.google.com/document/d/1RX5Z1PnlUnl2Zc9rHpHY4vZLLDskWmCz/export?format=pdf' }] },
            { id: 3, title: 'pH স্তর বোঝা',              duration: '18:20', description: 'মাটির pH এবং এটি ফসলের বৃদ্ধিতে কীভাবে প্রভাব ফেলে।',                  videoUrl: 'https://www.youtube.com/embed/W6HyGx-pqkI', materials: [{ name: 'pH Management Guide.pdf',    hindi: 'https://docs.google.com/document/d/1BzJSebhWO-ri9xmwjpNS7PDNXKvtbRhP/export?format=pdf', bengali: 'https://docs.google.com/document/d/15U5hp3HV5zLa6bUixxp0we8gCcshz15U/export?format=pdf' }] },
            { id: 4, title: 'কম্পোস্টিংয়ের মূল বিষয়', duration: '25:15', description: 'প্রাকৃতিকভাবে উচ্চমানের কম্পোস্ট তৈরি করতে শিখুন।',                    videoUrl: 'https://www.youtube.com/embed/6DEU4YHSyi0', materials: [{ name: 'Composting Step-by-Step.pdf', hindi: 'https://docs.google.com/document/d/1n1ciLXWOq3Bd0Ufp0WEqq6zTFN-id-zc/export?format=pdf', bengali: 'https://docs.google.com/document/d/1WgKV_CNVZ9eWX_WbfgLRM5a2NEV_lkiz/export?format=pdf' }] },
          ],
        },
        {
          id: 2, category: 'weather', image: '🌤️',
          title: 'আবহাওয়ার ধরন ও ফসল পরিকল্পনা',
          description: 'পূর্বাভাস, মৌসুমী ধরন এবং সেই অনুযায়ী ফসল পরিকল্পনা করতে শিখুন।',
          duration: '৪ সপ্তাহ', lessons: 18, level: 'Intermediate', enrolled: 890,
          topics: ['জলবায়ু অঞ্চল', 'বৃষ্টিপাতের ধরন', 'তাপমাত্রার প্রভাব', 'মৌসুমী পরিকল্পনা'],
          courseLessons: [
            { id: 1, title: 'আবহাওয়ার ধরন বোঝা', duration: '20:00', description: 'ভালো খামার পরিকল্পনার জন্য আবহাওয়ার পূর্বাভাস পড়া ও ব্যাখ্যা করা।', videoUrl: 'https://www.youtube.com/embed/u1cY70eU1u0', materials: [{ name: 'Weather Reading Guide.pdf', hindi: 'https://docs.google.com/document/d/1MYi3g7MJUhemjSF-tkv1ENuQNMPDyB9E/export?format=pdf', bengali: 'https://docs.google.com/document/d/196OVJeQISedxiH022SSHqH2edi5uf3Rs/export?format=pdf' }] },
            { id: 2, title: 'মৌসুমী ফসল পরিকল্পনা', duration: '28:30', description: 'মৌসুমী আবহাওয়া পরিবর্তন অনুযায়ী ফসল পরিকল্পনা করুন।',          videoUrl: 'https://www.youtube.com/embed/szn_Nz-bPeE', materials: [{ name: 'Seasonal Calendar.pdf',       hindi: 'https://docs.google.com/document/d/1nVAmAF42jgOcwFxmqtmd3SLhHJMd65Ps/export?format=pdf', bengali: 'https://docs.google.com/document/d/1l0TQB36612QMvHgDgzBzYZ9L_4LRgybs/export?format=pdf' }] },
            { id: 3, title: 'বৃষ্টিপাত ব্যবস্থাপনা',  duration: '24:45', description: 'বৃষ্টিপাতের পূর্বাভাসের ভিত্তিতে জলসম্পদ ব্যবস্থাপনা।',         videoUrl: 'https://www.youtube.com/embed/u1cY70eU1u0', materials: [{ name: 'Water Management Plan.pdf',  hindi: 'https://docs.google.com/document/d/1BbqI74zim0mcjClL_J3ZQysR7JNkbXRn/export?format=pdf', bengali: 'https://docs.google.com/document/d/1l4qa_4VrhaUtkaCV5PbgqLq9bVX83Rhp/export?format=pdf' }] },
          ],
        },
        {
          id: 3, category: 'herbal', image: '🌿',
          title: 'ভেষজ ও ওষধি গাছের চাষ',
          description: 'স্বাস্থ্য উপকার ও অতিরিক্ত আয়ের জন্য ভেষজ ও ওষধি গাছ চাষ করুন।',
          duration: '৮ সপ্তাহ', lessons: 32, level: 'Beginner', enrolled: 2100,
          topics: ['নিম চাষ', 'তুলসী চাষ', 'অ্যালোভেরা', 'মোরিঙ্গা চাষ'],
          courseLessons: [
            { id: 1, title: 'ভেষজ উদ্ভিদের ভূমিকা', duration: '16:40', description: 'ভেষজ উদ্ভিদ ও তাদের অর্থনৈতিক সম্ভাবনার সংক্ষিপ্ত বিবরণ।',    videoUrl: 'https://www.youtube.com/embed/D2aPL0JFxl0', materials: [{ name: 'Medicinal Plants Guide.pdf',   hindi: null, bengali: null }] },
            { id: 2, title: 'নিম গাছ চাষ',           duration: '30:20', description: 'সর্বোচ্চ সুবিধার জন্য নিম গাছ চাষের সম্পূর্ণ গাইড।',            videoUrl: 'https://www.youtube.com/embed/ArM4U83cvQM', materials: [{ name: 'Neem Cultivation Manual.pdf', hindi: 'https://docs.google.com/document/d/1l1OQ-vPhWokST2Kws8gXKDEaxFA2pQ0i/export?format=pdf', bengali: 'https://docs.google.com/document/d/1eAtMukT--GjWap9DvCZ9-hYmgdqWXpBH/export?format=pdf' }] },
            { id: 3, title: 'তুলসী ও হলি বেসিল',    duration: '22:15', description: 'ভেষজ ব্যবহারের জন্য তুলসী চাষের সেরা পদ্ধতি।',                  videoUrl: 'https://www.youtube.com/embed/D2aPL0JFxl0', materials: [{ name: 'Tulsi Growing Tips.pdf',       hindi: null, bengali: null }] },
          ],
        },
        {
          id: 4, category: 'farming', image: '🚜',
          title: 'আধুনিক কৃষি কৌশল',
          description: 'ভবিষ্যতের জন্য ড্রিপ সেচ, হাইড্রোপনিক্স এবং নির্ভুল কৃষিতে দক্ষতা অর্জন করুন।',
          duration: '১০ সপ্তাহ', lessons: 40, level: 'Advanced', enrolled: 760,
          topics: ['ড্রিপ সেচ', 'হাইড্রোপনিক্স', 'ভার্টিক্যাল ফার্মিং', 'স্মার্ট সেন্সর'],
          courseLessons: [
            { id: 1, title: 'আধুনিক কৃষির ভূমিকা',    duration: '18:50', description: 'আধুনিক কৃষি প্রযুক্তি ও সুবিধার সংক্ষিপ্ত বিবরণ।',                   videoUrl: 'https://www.youtube.com/embed/4gsJKyFtHUE', materials: [{ name: 'Modern Farming Overview.pdf', hindi: 'https://docs.google.com/document/d/1kwoEwyb8JFV3wA3SFVMXJTt2lPgTCXjh/export?format=pdf', bengali: 'https://docs.google.com/document/d/1VLkIrec0bUy7wIUyDy5TuqcMraTC09NW/export?format=pdf' }] },
            { id: 2, title: 'ড্রিপ সেচ ব্যবস্থা',    duration: '35:20', description: 'ড্রিপ সিস্টেম স্থাপন ও পরিচালনার সম্পূর্ণ গাইড।',                    videoUrl: 'https://www.youtube.com/embed/vBPCtUOxCkE', materials: [{ name: 'Installation Guide.pdf',       hindi: 'https://docs.google.com/document/d/165SFZNa_Uv5lVvUT1AyyJKypEdnXBoRb/export?format=pdf', bengali: 'https://docs.google.com/document/d/16VG1977HhODRvnS3xEcp_uDXdBodd7Gf/export?format=pdf' }] },
            { id: 3, title: 'হাইড্রোপনিক্সের ভূমিকা', duration: '28:40', description: 'মাটিবিহীন চাষ পদ্ধতি এবং হাইড্রোপনিক সিস্টেমের মূল বিষয়।',         videoUrl: 'https://www.youtube.com/embed/4gsJKyFtHUE', materials: [{ name: 'Hydroponics Starter Kit.pdf',  hindi: 'https://docs.google.com/document/d/1NH59NYXyBca-f3bBPiGsD3TvX06EIkoh/export?format=pdf', bengali: 'https://docs.google.com/document/d/1FuDaJ3rIChLRFbEHdRhGVErEd6NdwJxm/export?format=pdf' }] },
          ],
        },
        {
          id: 5, category: 'soil', image: '♻️',
          title: 'জৈব চাষের মূল বিষয়',
          description: 'জৈব চাষ, কম্পোস্টিং এবং প্রাকৃতিক কীটপতঙ্গ নিয়ন্ত্রণের সম্পূর্ণ গাইড।',
          duration: '৫ সপ্তাহ', lessons: 20, level: 'Beginner', enrolled: 1580,
          topics: ['জৈব সার্টিফিকেশন', 'প্রাকৃতিক কীটনাশক', 'ফসল আবর্তন', 'সবুজ সার'],
          courseLessons: [
            { id: 1, title: 'জৈব চাষ কী?',             duration: '14:25', description: 'জৈব চাষের নীতি ও সার্টিফিকেশন বোঝা।',                              videoUrl: 'https://www.youtube.com/embed/mkEsLdNKlPM', materials: [{ name: 'Organic Standards.pdf',    hindi: null, bengali: null }] },
            { id: 2, title: 'প্রাকৃতিক কীটপতঙ্গ নিয়ন্ত্রণ', duration: '26:30', description: 'রাসায়নিক ছাড়া কীটপতঙ্গ নিয়ন্ত্রণের কার্যকর প্রাকৃতিক পদ্ধতি।', videoUrl: 'https://www.youtube.com/embed/mkEsLdNKlPM', materials: [{ name: 'Pest Control Methods.pdf', hindi: 'https://docs.google.com/document/d/1GDaMRqAyI-9yNvpx50vAz3cK1yXjHEzN/export?format=pdf', bengali: 'https://docs.google.com/document/d/1xDMCdKSSGS-E3L_7QsElO5bK42_d96wX/export?format=pdf' }] },
          ],
        },
        {
          id: 6, category: 'farming', image: '💧',
          title: 'কৃষিতে জল ব্যবস্থাপনা',
          description: 'দক্ষ জল ব্যবহার, বৃষ্টির জল সংগ্রহ এবং সেচ অপ্টিমাইজেশন।',
          duration: '৪ সপ্তাহ', lessons: 16, level: 'Intermediate', enrolled: 920,
          topics: ['বৃষ্টির জল সংগ্রহ', 'ড্রিপ সিস্টেম', 'জল সংরক্ষণ', 'সময়সূচি'],
          courseLessons: [
            { id: 1, title: 'জল সংরক্ষণের নীতি',        duration: '19:15', description: 'জলের ঘাটতি ও খামার সংরক্ষণ কৌশল বোঝা।',    videoUrl: 'https://www.youtube.com/embed/ba0In5ezHXc', materials: [{ name: 'Conservation Guide.pdf', hindi: null, bengali: null }] },
            { id: 2, title: 'বৃষ্টির জল সংগ্রহ ব্যবস্থা', duration: '31:40', description: 'বৃষ্টির জল সংগ্রহ ডিজাইন ও বাস্তবায়ন।',    videoUrl: 'https://www.youtube.com/embed/S0Dmkhr8t0w', materials: [{ name: 'System Design.pdf', hindi: null, bengali: null }, { name: 'Cost Analysis.pdf', hindi: null, bengali: null }] },
          ],
        },
      ],
    },
  };
  
  export default learningHubTranslations;