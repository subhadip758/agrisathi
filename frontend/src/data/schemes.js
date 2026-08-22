// src/data/schemes.js
export const schemes = [
    {
      id: 1,
      translations: {
        en: {
          title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
          description: "Direct income support of ₹6,000 per year to small and marginal farmer families, paid in three equal installments.",
          benefit: "₹6,000/year"
        },
        hi: {
          title: "प्रधान मंत्री किसान सम्मान निधि (पीएम-किसान)",
          description: "छोटे और सीमांत किसान परिवारों को प्रतिवर्ष ₹6,000 की प्रत्यक्ष आय सहायता, तीन समान किस्तों में भुगतान।",
          benefit: "₹6,000/वर्ष"
        },
        bn: {
          title: "প্রধানমন্ত্রী কৃষক সম্মান নিধি (PM-KISAN)",
          description: "ছোট ও সীমান্ত কৃষক পরিবারের জন্য বছরে ₹6,000 সরাসরি আয় সহায়তা, তিন সমান কিস্তিতে প্রদান।",
          benefit: "₹6,000/বছর"
        }
      },
      category: "welfare",
      government: "Central Government",
      eligibility: [
        "Small & Marginal farmers",
        "Land holding up to 2 hectares",
        "Indian citizen",
        "Valid Aadhaar card"
      ],
      documents: ["Aadhaar Card", "Bank Account Details", "Land Ownership Documents", "Mobile Number"],
      status: "Active",
      deadline: "Ongoing",
      applicationUrl: "https://pmkisan.gov.in/",
      features: ["Direct Bank Transfer", "Three installments", "No application fee", "Online verification"]
    },
    {
      id: 2,
      translations: {
        en: {
          title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
          description: "Comprehensive crop insurance scheme providing financial support to farmers in case of crop loss due to natural calamities.",
          benefit: "Up to 90% premium subsidy"
        },
        hi: {
          title: "प्रधान मंत्री फसल बीमा योजना (PMFBY)",
          description: "प्राकृतिक आपदाओं के कारण फसल हानि होने पर किसानों को वित्तीय सहायता प्रदान करने वाली व्यापक फसल बीमा योजना।",
          benefit: "90% तक प्रीमियम सब्सिडी"
        },
        bn: {
          title: "প্রধানমন্ত্রী ফসল বীমা যোজনা (PMFBY)",
          description: "প্রাকৃতিক দুর্যোগে ফসল ক্ষতির ক্ষেত্রে কৃষকদের আর্থিক সহায়তা প্রদানকারী সমগ্র ফসল বীমা যোজনা।",
          benefit: "৯০% পর্যন্ত প্রিমিয়াম সহায়তা"
        }
      },
      category: "insurance",
      government: "Central Government",
      eligibility: ["All farmers", "Loanee and non-loanee farmers", "Registered with scheme", "Valid land records"],
      documents: ["Aadhaar Card", "Bank Account", "Land Records", "Sowing Certificate", "Loan Sanction Letter (if applicable)"],
      status: "Active",
      deadline: "Seasonal enrollment",
      applicationUrl: "https://pmfby.gov.in/",
      features: ["Low premium", "Quick claim settlement", "Technology-driven", "All-risk coverage"]
    },
    {
      id: 3,
      translations: {
        en: {
          title: "Kisan Credit Card (KCC)",
          description: "Short-term credit facility for farmers to meet agricultural expenses with subsidized interest rates.",
          benefit: "Loan up to ₹3L @ 4%"
        },
        hi: {
          title: "किसान क्रेडिट कार्ड (KCC)",
          description: "किसानों को कृषि खर्चों को पूरा करने के लिए कम ब्याज दरों पर अल्पकालिक ऋण सुविधा।",
          benefit: "₹3 लाख तक ऋण @ 4%"
        },
        bn: {
          title: "কৃষক ক্রেডিট কার্ড (KCC)",
          description: "কৃষকদের কৃষি খরচ মেটানোর জন্য স্বল্প-মেয়াদি ঋণ সুবিধা, সাবসিডাইজড সুদের হারে।",
          benefit: "₹3 লাখ পর্যন্ত ঋণ @ ৪%"
        }
      },
      category: "loan",
      government: "Central Government",
      eligibility: ["Farmers (Individual/Joint)", "Tenant farmers", "Sharecroppers", "SHG members"],
      documents: ["Identity Proof", "Address Proof", "Land Documents", "Passport Photo", "Application Form"],
      status: "Active",
      deadline: "Ongoing",
      applicationUrl: "https://www.india.gov.in/spotlight/kisan-credit-card-kcc",
      features: ["Flexible repayment", "Low interest rate", "3% interest subvention", "Valid for 5 years"]
    },
    {
      id: 4,
      translations: {
        en: {
          title: "Sub-Mission on Agricultural Mechanization (SMAM)",
          description: "Financial assistance for purchase of agricultural machinery and equipment to promote farm mechanization across India.",
          benefit: "40-50% subsidy on equipment"
        },
        hi: {
          title: "कृषि यंत्रीकरण उप-आवेदन (SMAM)",
          description: "भारत में कृषि यंत्रीकरण को बढ़ावा देने के लिए कृषि मशीनरी और उपकरण खरीदने पर वित्तीय सहायता।",
          benefit: "उपकरण पर 40-50% सब्सिडी"
        },
        bn: {
          title: "কৃষি যন্ত্রায়ন উপ-মিশন (SMAM)",
          description: "ভারতে কৃষি যন্ত্রায়ন প্রচারের জন্য কৃষি যন্ত্রপাতি ও সরঞ্জাম কেনার জন্য আর্থিক সহায়তা।",
          benefit: "সরঞ্জামে ৪০-৫০% সহায়তা"
        }
      },
      category: "equipment",
      government: "Central Government",
      eligibility: ["Individual farmers", "FPOs", "Cooperative societies", "Custom Hiring Centers"],
      documents: ["Aadhaar Card", "Bank Account", "Land Records", "Caste Certificate (if applicable)", "Application Form"],
      status: "Active",
      deadline: "State-wise deadline",
      applicationUrl: "https://agrimachinery.nic.in/",
      features: ["Wide equipment range", "Direct Benefit Transfer", "Custom hiring support", "Training provided"]
    },
    {
      id: 5,
      translations: {
        en: {
          title: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
          description: "Scheme to expand cultivable land with assured irrigation, improve water efficiency, and promote precision-based micro-irrigation.",
          benefit: "Up to 90% on drip/sprinkler"
        },
        hi: {
          title: "प्रधान मंत्री कृषि सिंचाई योजना (PMKSY)",
          description: "सिंचाई सुनिश्चित करके कृषि योग्य भूमि का विस्तार करने, जल दक्षता बढ़ाने और सूक्ष्म सिंचाई को बढ़ावा देने की योजना।",
          benefit: "ड्रिप/स्प्रिंकलर पर 90% तक"
        },
        bn: {
          title: "প্রধানমন্ত্রী কৃষি সেচ যোজনা (PMKSY)",
          description: "নিশ্চিত সেচের মাধ্যমে চাষযোগ্য জমি বৃদ্ধি, জল দক্ষতা উন্নত করা এবং মাইক্রো-সেচ প্রচার করার জন্য যোজনা।",
          benefit: "ড্রিপ/স্প্রিঙ্কলার এ ৯০% পর্যন্ত"
        }
      },
      category: "irrigation",
      government: "Central Government",
      eligibility: ["All farmers", "Valid land holding", "Access to water source", "Registered beneficiary"],
      documents: ["Aadhaar Card", "Land Documents", "Bank Account", "Water Source Proof", "Application Form"],
      status: "Active",
      deadline: "Ongoing",
      applicationUrl: "https://pmksy.gov.in/",
      features: ["Micro-irrigation support", "Watershed development", "Per drop more crop", "State-specific benefits"]
    },
    {
      id: 6,
      translations: {
        en: {
          title: "National Mission on Sustainable Agriculture (NMSA)",
          description: "Promotes sustainable agriculture practices through location-specific integrated farming systems for climate-resilient outcomes.",
          benefit: "Financial support & training"
        },
        hi: {
          title: "राष्ट्रीय सतत कृषि मिशन (NMSA)",
          description: "स्थानीय विशेष एकीकृत कृषि प्रणालियों के माध्यम से टिकाऊ कृषि प्रथाओं को बढ़ावा देता है ताकि जलवायु-सहनशील परिणाम प्राप्त हो सकें।",
          benefit: "वित्तीय सहायता और प्रशिक्षण"
        },
        bn: {
          title: "জাতীয় টেকসই কৃষি মিশন (NMSA)",
          description: "অঞ্চল-নির্দিষ্ট সমন্বিত কৃষি ব্যবস্থার মাধ্যমে টেকসই কৃষি চর্চা প্রচার করে যাতে জলবায়ু-সহনশীল ফলাফল পাওয়া যায়।",
          benefit: "আর্থিক সহায়তা এবং প্রশিক্ষণ"
        }
      },
      category: "welfare",
      government: "Central Government",
      eligibility: ["All farmers", "FPOs", "Agricultural institutions", "State agencies"],
      documents: ["Identity Proof", "Land Documents", "Registration Certificate", "Project Proposal"],
      status: "Active",
      deadline: "Rolling basis",
      applicationUrl: "https://nmsa.dac.gov.in/",
      features: ["Soil health management", "Rainfed area development", "Climate resilience", "Knowledge dissemination"]
    }
  ];