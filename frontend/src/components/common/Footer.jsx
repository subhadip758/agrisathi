import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  const translations = {
    en: {
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      copyright: `© ${currentYear} Urban Farming Platform. All rights reserved.`,
    },
    hi: {
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      copyright: `© ${currentYear} अर्बन फार्मिंग प्लेटफ़ॉर्म। सर्वाधिकार सुरक्षित।`,
    },
    bn: {
      privacy: "গোপনীয়তা নীতি",
      terms: "সেবার শর্তাবলী",
      copyright: `© ${currentYear} আরবান ফার্মিং প্ল্যাটফর্ম। সর্বস্বত্ব সংরক্ষিত।`,
    },
  };

  const t = translations[language] || translations.en;

  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
        <div className="text-sm text-gray-600">
          {t.copyright}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <Link
            to="/privacy"
            className="hover:text-primary-600 transition-colors"
          >
            {t.privacy}
          </Link>
          <Link
            to="/terms"
            className="hover:text-primary-600 transition-colors"
          >
            {t.terms}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;