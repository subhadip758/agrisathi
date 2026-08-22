import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n";

export const useTranslation = (section) => {
  const { language } = useLanguage();
  return translations[section][language];
};