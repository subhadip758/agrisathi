import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const languages = ["en", "hi", "bn"];

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('agrisathi_lang') || "en";
  });

  const setLanguage = (lang) => {
    if (languages.includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('agrisathi_lang', lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState(prev => {
      const index = languages.indexOf(prev);
      const nextLang = languages[(index + 1) % languages.length];
      localStorage.setItem('agrisathi_lang', nextLang);
      return nextLang;
    });
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('agrisathi_lang');
      if (stored && languages.includes(stored) && stored !== language) {
        setLanguageState(stored);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
