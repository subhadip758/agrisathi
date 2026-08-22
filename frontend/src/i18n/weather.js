const weatherTranslations = {
    en: {
        title: "Weather Advisory",
        subtitle: "Real-time weather updates and farming advisories",

        search: {
            placeholder: "Enter city name...",
            button: "Search",
            loading: "Loading weather data...",
            errorCity: "City not found",
        },

        current: {
            title: "Current Weather",
            humidity: "Humidity",
            wind: "Wind Speed",
            pressure: "Pressure",
            temperature: "Feels Like",
        },

        map: {
            title: "Location Map",
            coordinates: "Coordinates",
        },

        advisory: {
            title: "Weather Advisories",

            highTemp:
                "High temperature alert. Increase irrigation frequency and provide shade for sensitive crops.",
            lowTemp:
                "Low temperature alert. Protect sensitive crops from frost damage.",

            humidityHigh:
                "High humidity levels. Monitor for fungal diseases and ensure proper ventilation.",

            windHigh:
                "Strong winds expected. Secure loose structures and delay spraying operations.",

            rain:
                "Rain expected. Postpone irrigation and fertilizer application. Check drainage systems.",

            normal:
                "Weather conditions are favorable for farming activities.",
            generalTipsTitle: "General Weather Tips",
            generalTipsList: [
                "Check weather forecast daily for better farm planning",
                "Plan field activities based on weather predictions",
                "Protect crops during extreme weather conditions",
                "Maintain drainage systems before monsoon season"
            ],
        },

        forecast: {
            title: "5-Day Forecast",
            rainfall: "Rainfall",
        },

        tips: {
            title: "Weather-Based Farming Tips",

            sunny: "Sunny Days",
            sunnyTips: [
                "Ideal for spraying pesticides and fertilizers",
                "Good time for harvesting and drying crops",
                "Monitor soil moisture and irrigate if needed",
            ],

            cloudy: "Cloudy Days",
            cloudyTips: [
                "Good for transplanting seedlings",
                "Reduced water evaporation",
                "Monitor for pest activity",
            ],

            rainy: "Rainy Days",
            rainyTips: [
                "Postpone irrigation activities",
                "Check drainage systems",
                "Avoid field operations to prevent soil compaction",
            ],

            hot: "Hot Weather",
            hotTips: [
                "Increase irrigation frequency",
                "Provide shade for sensitive crops",
                "Monitor plants for heat stress",
            ],
        },
    },

    hi: {
        title: "मौसम सलाह",
        subtitle: "रीयल-टाइम मौसम अपडेट और कृषि सलाह",

        search: {
            placeholder: "शहर का नाम दर्ज करें...",
            button: "खोजें",
            loading: "मौसम डेटा लोड हो रहा है...",
            errorCity: "शहर नहीं मिला",
        },

        current: {
            title: "वर्तमान मौसम",
            humidity: "आर्द्रता",
            wind: "हवा की गति",
            pressure: "वायुदाब",
            temperature: "महसूस होने वाला तापमान",
        },

        map: {
            title: "स्थान मानचित्र",
            coordinates: "निर्देशांक",
        },

        advisory: {
            title: "मौसम चेतावनी",

            highTemp:
                "उच्च तापमान चेतावनी। सिंचाई बढ़ाएं और संवेदनशील फसलों को छाया दें।",
            lowTemp:
                "कम तापमान चेतावनी। फसलों को पाले से बचाएं।",

            humidityHigh:
                "अधिक आर्द्रता। फफूंद रोगों की निगरानी करें और वेंटिलेशन बनाए रखें।",

            windHigh:
                "तेज़ हवाएं चलने की संभावना। ढीली संरचनाओं को सुरक्षित करें।",

            rain:
                "बारिश की संभावना। सिंचाई और उर्वरक देना स्थगित करें।",

            normal:
                "मौसम कृषि गतिविधियों के लिए अनुकूल है।",

            generalTipsTitle: "सामान्य मौसम सलाह",
            generalTipsList: [
                "बेहतर खेती की योजना के लिए रोज़ाना मौसम का पूर्वानुमान देखें",
                "मौसम की भविष्यवाणियों के आधार पर खेत के कार्यों की योजना बनाएं",
                "अत्यधिक मौसम की स्थितियों में फसलों की सुरक्षा करें",
                "मानसून से पहले जल निकासी प्रणाली बनाए रखें"
            ],
        },

        forecast: {
            title: "5-दिन का पूर्वानुमान",
            rainfall: "वर्षा",
        },

        tips: {
            title: "मौसम आधारित कृषि सुझाव",

            sunny: "धूप वाले दिन",
            sunnyTips: [
                "कीटनाशक और उर्वरक छिड़काव के लिए उपयुक्त",
                "फसल कटाई और सुखाने के लिए अच्छा समय",
                "मिट्टी की नमी की निगरानी करें",
            ],

            cloudy: "बादल वाले दिन",
            cloudyTips: [
                "पौध प्रतिरोपण के लिए अच्छा",
                "कम जल वाष्पीकरण",
                "कीट गतिविधि की निगरानी करें",
            ],

            rainy: "बारिश के दिन",
            rainyTips: [
                "सिंचाई स्थगित करें",
                "जल निकासी व्यवस्था जांचें",
                "खेत में काम से बचें",
            ],

            hot: "गर्म मौसम",
            hotTips: [
                "सिंचाई की आवृत्ति बढ़ाएं",
                "संवेदनशील फसलों को छाया दें",
                "हीट स्ट्रेस की निगरानी करें",
            ],
        },
    },

    bn: {
        title: "আবহাওয়া পরামর্শ",
        subtitle: "রিয়েল-টাইম আবহাওয়া আপডেট ও কৃষি পরামর্শ",

        search: {
            placeholder: "শহরের নাম লিখুন...",
            button: "অনুসন্ধান",
            loading: "আবহাওয়ার তথ্য লোড হচ্ছে...",
            errorCity: "শহর খুঁজে পাওয়া যায়নি",
        },

        current: {
            title: "বর্তমান আবহাওয়া",
            humidity: "আর্দ্রতা",
            wind: "বাতাসের গতি",
            pressure: "বায়ুচাপ",
            temperature: "অনুভূত তাপমাত্রা",
        },

        map: {
            title: "অবস্থান মানচিত্র",
            coordinates: "স্থানাঙ্ক",
        },

        advisory: {
            title: "আবহাওয়া সতর্কতা",

            highTemp:
                "উচ্চ তাপমাত্রা সতর্কতা। সেচ বাড়ান এবং সংবেদনশীল ফসলকে ছায়া দিন।",
            lowTemp:
                "নিম্ন তাপমাত্রা সতর্কতা। ফসলকে তুষারপাত থেকে রক্ষা করুন।",

            humidityHigh:
                "উচ্চ আর্দ্রতা। ছত্রাক রোগের জন্য নজর রাখুন।",

            windHigh:
                "তীব্র বাতাসের সম্ভাবনা। আলগা কাঠামো সুরক্ষিত করুন।",

            rain:
                "বৃষ্টির সম্ভাবনা। সেচ ও সার প্রয়োগ স্থগিত করুন।",

            normal:
                "কৃষি কাজের জন্য আবহাওয়া অনুকূল।",

            generalTipsTitle: "সাধারণ আবহাওয়া পরামর্শ",
            generalTipsList: [
                "ভালো খামার পরিকল্পনার জন্য প্রতিদিন আবহাওয়ার পূর্বাভাস দেখুন",
                "আবহাওয়ার পূর্বাভাস অনুযায়ী মাঠের কাজ পরিকল্পনা করুন",
                "চরম আবহাওয়া পরিস্থিতিতে ফসল রক্ষা করুন",
                "বর্ষাকালে সেচ ব্যবস্থা বজায় রাখুন"
            ],
        },

        forecast: {
            title: "৫ দিনের পূর্বাভাস",
            rainfall: "বৃষ্টিপাত",
        },

        tips: {
            title: "আবহাওয়া ভিত্তিক কৃষি পরামর্শ",

            sunny: "রৌদ্রোজ্জ্বল দিন",
            sunnyTips: [
                "কীটনাশক ও সার ছিটানোর জন্য ভালো",
                "ফসল কাটার উপযুক্ত সময়",
                "মাটির আর্দ্রতা পর্যবেক্ষণ করুন",
            ],

            cloudy: "মেঘলা দিন",
            cloudyTips: [
                "চারা রোপণের জন্য উপযুক্ত",
                "কম জল বাষ্পীভবন",
                "পোকার আক্রমণ পর্যবেক্ষণ করুন",
            ],

            rainy: "বৃষ্টির দিন",
            rainyTips: [
                "সেচ স্থগিত রাখুন",
                "নিকাশী ব্যবস্থা পরীক্ষা করুন",
                "মাঠে কাজ এড়িয়ে চলুন",
            ],

            hot: "গরম আবহাওয়া",
            hotTips: [
                "সেচের পরিমাণ বাড়ান",
                "সংবেদনশীল ফসলকে ছায়া দিন",
                "তাপ চাপ পর্যবেক্ষণ করুন",
            ],
        },
    },
};

export default weatherTranslations;
