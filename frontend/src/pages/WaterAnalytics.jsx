import React, { useState } from 'react';
import WaterAdvisoryDashboard from '../components/Water/WaterAdvisoryDashboard';
import WaterSourceDashboard from '../components/Water/WaterSourceDashboard';
import FloatingChatButton from '../components/chatbot/Floatingchatbutton';
import { useLanguage } from '../context/LanguageContext';
import waterAnalyticsTranslations from '../i18n/water';

const WaterAnalytics = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const { language } = useLanguage();
  const t = waterAnalyticsTranslations.page[language] ?? waterAnalyticsTranslations.page.en;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header with Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {t.title}
              </h1>
              <p className="text-gray-600 mt-2">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('sources')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'sources'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.tabSources}
              </button>
              <button
                onClick={() => setActiveTab('advisory')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'advisory'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {t.tabAdvisory}
              </button>
            </nav>
          </div>
        </div>

        {/* Water Source Management Tab */}
        {activeTab === 'sources' && (
          <div>
            <WaterSourceDashboard />
          </div>
        )}

        {/* Irrigation Advisory Tab */}
        {activeTab === 'advisory' && (
          <div>
            <WaterAdvisoryDashboard />
          </div>
        )}

      </div>
      <FloatingChatButton />
    </div>
  );
};

export default WaterAnalytics;