const privacyTranslations = {
    page: {
        en: {
            tag: "🔒 Privacy Policy",
            title1: "Your data,",
            title2: "your harvest",
            navBrand: "🌾 Urban Farming",
            navBadge: "Privacy",
            desc:
                "We believe your farm data belongs to you. This policy explains exactly what we collect, why we collect it, and how we keep it safe — in plain language, no legalese.",
            pills: [
                "✅ No data selling",
                "🔒 AES-256 encrypted",
                "🗑️ Delete anytime",
                "🇮🇳 India PDPB compliant",
            ],
            consentTitle: "Your Consent",
            consentText:
                "By using our platform, you consent to this Privacy Policy. You may withdraw consent at any time by deleting your account. Questions? Reach us at",
            lastUpdated: "Last updated — February 2025",
            heroTag: "🔒 Privacy Policy",

            cards: [
                { icon: "🔐", label: "Encrypted Storage", sub: "AES-256 standard" },
                { icon: "🚫", label: "Zero Data Sales", sub: "We never sell your info" },
                { icon: "📤", label: "Export Anytime", sub: "JSON or CSV format" }
            ]
        },

        hi: {
            tag: "🔒 गोपनीयता नीति",
            title1: "आपका डेटा,",
            title2: "आपकी फसल",
            navBrand: "🌾 अर्बन फार्मिंग",
            navBadge: "गोपनीयता",
            desc:
                "हम मानते हैं कि आपके खेत का डेटा आपका है। यह नीति बताती है कि हम क्या एकत्र करते हैं, क्यों करते हैं और इसे कैसे सुरक्षित रखते हैं।",
            pills: [
                "✅ डेटा बिक्री नहीं",
                "🔒 AES-256 एन्क्रिप्शन",
                "🗑️ कभी भी हटाएं",
                "🇮🇳 भारत PDPB अनुरूप",
            ],
            consentTitle: "आपकी सहमति",
            consentText:
                "हमारे प्लेटफ़ॉर्म का उपयोग करके, आप इस गोपनीयता नीति से सहमत होते हैं। आप किसी भी समय अपना खाता हटाकर सहमति वापस ले सकते हैं। प्रश्न? हमसे संपर्क करें",
            lastUpdated: "अंतिम अपडेट — फरवरी 2025",
            heroTag: "🔒 गोपनीयता नीति",

            cards: [
                { icon: "🔐", label: "एन्क्रिप्टेड स्टोरेज", sub: "AES-256 मानक" },
                { icon: "🚫", label: "डेटा बिक्री नहीं", sub: "हम आपका डेटा नहीं बेचते" },
                { icon: "📤", label: "कभी भी एक्सपोर्ट करें", sub: "JSON या CSV फॉर्मेट" }
            ]
        },

        bn: {
            tag: "🔒 গোপনীয়তা নীতি",
            title1: "আপনার ডেটা,",
            title2: "আপনার ফসল",
            navBrand: "🌾 আরবান ফার্মিং",
            navBadge: "গোপনীয়তা",
            desc:
                "আমরা বিশ্বাস করি আপনার কৃষি তথ্য আপনারই। এই নীতিতে আমরা কী সংগ্রহ করি, কেন করি এবং কীভাবে সুরক্ষিত রাখি তা ব্যাখ্যা করা হয়েছে।",
            pills: [
                "✅ ডেটা বিক্রি নয়",
                "🔒 AES-256 এনক্রিপশন",
                "🗑️ যেকোনো সময় মুছুন",
                "🇮🇳 ভারত PDPB সম্মত",
            ],
            consentTitle: "আপনার সম্মতি",
            consentText:
                "আমাদের প্ল্যাটফর্ম ব্যবহার করে আপনি এই প্রাইভেসি পলিসিতে সম্মতি দিচ্ছেন। আপনি যেকোনো সময় আপনার অ্যাকাউন্ট মুছে সম্মতি প্রত্যাহার করতে পারেন। প্রশ্ন থাকলে যোগাযোগ করুন",
            lastUpdated: "সর্বশেষ আপডেট — ফেব্রুয়ারি ২০২৫",
            heroTag: "🔒 গোপনীয়তা নীতি",

            cards: [
                { icon: "🔐", label: "এনক্রিপ্টেড স্টোরেজ", sub: "AES-256 স্ট্যান্ডার্ড" },
                { icon: "🚫", label: "ডেটা বিক্রি নয়", sub: "আমরা আপনার তথ্য বিক্রি করি না" },
                { icon: "📤", label: "যেকোনো সময় এক্সপোর্ট", sub: "JSON বা CSV ফরম্যাট" }
            ]
        },
    },

    sections: {
        en: [
            {
                id: 'collect',
                emoji: '📥',
                title: 'Information We Collect',
                items: [
                    { label: 'Personal Details', desc: 'Name, email, phone, and location.' },
                    { label: 'Farm Data', desc: 'Soil values, crops, and field data.' },
                    { label: 'Usage Data', desc: 'App usage and device info.' },
                    { label: 'Images', desc: 'Uploaded crop images for AI analysis.' },
                ],
            },
            {
                id: 'use',
                emoji: '⚙️',
                title: 'How We Use Your Information',
                items: [
                    { label: 'AI Recommendations', desc: 'Personalized farming insights.' },
                    { label: 'Improvement', desc: 'Improve model accuracy.' },
                    { label: 'Communication', desc: 'Alerts and updates.' },
                    { label: 'Security', desc: 'Prevent misuse.' },
                ],
            },
        ],

        hi: [
            {
                id: 'collect',
                emoji: '📥',
                title: 'हम कौन सी जानकारी एकत्र करते हैं',
                items: [
                    { label: 'व्यक्तिगत विवरण', desc: 'नाम, ईमेल, फोन, स्थान।' },
                    { label: 'फार्म डेटा', desc: 'मिट्टी, फसल और खेत की जानकारी।' },
                    { label: 'उपयोग डेटा', desc: 'ऐप उपयोग और डिवाइस जानकारी।' },
                    { label: 'चित्र', desc: 'AI विश्लेषण के लिए अपलोड।' },
                ],
            },
        ],

        bn: [
            {
                id: 'collect',
                emoji: '📥',
                title: 'আমরা কী তথ্য সংগ্রহ করি',
                items: [
                    { label: 'ব্যক্তিগত তথ্য', desc: 'নাম, ইমেইল, ফোন, অবস্থান।' },
                    { label: 'খামার তথ্য', desc: 'মাটি ও ফসলের তথ্য।' },
                    { label: 'ব্যবহার তথ্য', desc: 'অ্যাপ ব্যবহার ডেটা।' },
                    { label: 'ছবি', desc: 'AI বিশ্লেষণের জন্য আপলোড।' },
                ],
            },
        ],
    },
};

export default privacyTranslations;