import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../i18n/translations";

const ErrorBoundaryWrapper = ({ children }) => {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <ErrorBoundary texts={t}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;