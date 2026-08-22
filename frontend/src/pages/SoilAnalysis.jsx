import React, { useState, useEffect } from 'react';
import SoilObservationForm from '../components/soil/SoilAnalysisForm';
import SoilAnalysisResult from '../components/soil/SoilResultCard';
import FloatingChatButton from '../components/chatbot/Floatingchatbutton';
import { useLanguage } from '../context/LanguageContext';
import soilTranslations from '../i18n/soilTranslations';
import soilService from '../services/soilService';
import dataBridgeService from '../services/dataBridgeService';

const SoilAnalysisPage = () => {
  const { language } = useLanguage();
  const t = soilTranslations[language]?.page ?? soilTranslations.en.page;

  const [view, setView] = useState('form'); // 'form' | 'result' | 'history'
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // 🔄 Persistent History Fetch on Component Mount & Navigation
  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const data = await soilService.getSoilHistory();
      if (Array.isArray(data) && data.length > 0) {
        setHistory(data);
        dataBridgeService.saveLatestSoilData(data[0]);
      }
    } catch (err) {
      console.error('Failed to load soil history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleAnalysisComplete = (result) => {
    setCurrentAnalysis(result);
    dataBridgeService.saveLatestSoilData(result);
    loadHistory();
    setView('result');
  };

  const handleViewHistory = (id) => {
    const entry = history.find((h) => String(h._id) === String(id));
    if (entry) {
      // Normalize historical entry into complete full-fidelity report structure
      const normalized = {
        ...entry,
        healthScore: entry.healthScore ?? entry.results?.healthScore ?? 75,
        healthClass: entry.healthClass ?? entry.results?.healthClass ?? 'GOOD',
        summary: entry.summary || entry.results?.summary || 'Soil condition shows good agricultural potential with balanced pH and loam structure.',
        nutrientLevels: entry.nutrientLevels || {
          nitrogen: { level: entry.results?.nitrogenLevel || 'MEDIUM', score: 60 },
          phosphorus: { level: entry.results?.phosphorusLevel || 'MEDIUM', score: 65 },
          potassium: { level: entry.results?.potassiumLevel || 'MEDIUM', score: 70 }
        },
        soilProperties: entry.soilProperties || {
          ph: { value: entry.results?.phValue || 6.5, category: entry.results?.phCategory || 'NEUTRAL' },
          texture: entry.results?.texture || 'LOAM',
          organicMatter: entry.results?.organicMatter || 'MEDIUM',
          waterCapacity: 'GOOD'
        },
        fertilizerRecommendations: (entry.fertilizerRecommendations && entry.fertilizerRecommendations.length > 0)
          ? entry.fertilizerRecommendations
          : (entry.recommendations?.fertilizers || []),
        cropRecommendations: (entry.cropRecommendations && Object.keys(entry.cropRecommendations).length > 0)
          ? entry.cropRecommendations
          : (entry.recommendations?.crops || {}),
        improvementPlan: (entry.improvementPlan && Object.keys(entry.improvementPlan).length > 0)
          ? entry.improvementPlan
          : (entry.recommendations?.improvementPlan || {})
      };

      setCurrentAnalysis(normalized);
      dataBridgeService.saveLatestSoilData(normalized);
      setView('result');
    }
  };

  const handleDeleteHistory = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this soil test record?')) {
      const updated = await soilService.deleteSoilAnalysis(id);
      setHistory(updated);
      if (currentAnalysis && String(currentAnalysis._id) === String(id)) {
        setCurrentAnalysis(null);
        setView('form');
      }
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setView('form');
  };

  const getHealthBadge = (healthClass) => {
    const styles = { GOOD: 'bg-green-100 text-green-800', MEDIUM: 'bg-yellow-100 text-yellow-800', POOR: 'bg-red-100 text-red-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[healthClass] || ''}`}>
        {t.health?.[healthClass] || healthClass}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-1">{t.title}</h1>
              <p className="text-green-100">{t.subtitle}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleNewAnalysis}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  view === 'form' ? 'bg-white text-green-700' : 'bg-green-500 text-white hover:bg-green-400'
                }`}
              >
                {t.newTest}
              </button>
              <button
                onClick={() => setView('history')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  view === 'history' ? 'bg-white text-green-700' : 'bg-green-500 text-white hover:bg-green-400'
                }`}
              >
                {t.history} ({history.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Main Area */}
          <div className="lg:col-span-3">
            {view === 'form' && (
              <SoilObservationForm onAnalysisComplete={handleAnalysisComplete} />
            )}

            {view === 'result' && currentAnalysis && (
              <div>
                <button
                  onClick={handleNewAnalysis}
                  className="mb-4 px-6 py-2 bg-white text-green-700 border-2 border-green-600 rounded-lg font-semibold hover:bg-green-50 transition shadow"
                >
                  {t.newTestBtn}
                </button>
                <SoilAnalysisResult analysis={currentAnalysis} />
              </div>
            )}

            {view === 'history' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">{t.pastAnalyses}</h2>
                  <span className="text-xs text-gray-500 font-medium">
                    {history.length} record{history.length === 1 ? '' : 's'} saved persistently
                  </span>
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg mb-4">{t.noHistory}</p>
                    <button onClick={handleNewAnalysis} className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                      {t.firstTest}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div
                        key={item._id}
                        className="border-2 border-gray-200 rounded-lg p-5 hover:border-green-400 hover:shadow-md transition cursor-pointer relative group"
                        onClick={() => handleViewHistory(item._id)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-500 font-medium">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Saved Soil Test'}
                            </p>
                            <p className="text-xs text-gray-400">{item.createdAt ? new Date(item.createdAt).toLocaleTimeString('en-IN') : ''}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getHealthBadge(item.healthClass || item.results?.healthClass)}
                            <button
                              onClick={(e) => handleDeleteHistory(e, item._id)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded transition"
                              title="Delete record"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="text-4xl font-bold text-green-600">{item.healthScore || item.results?.healthScore || 75}</div>
                          <div className="text-sm text-gray-600">
                            <p>N: {item.nutrientLevels?.nitrogen?.level || item.results?.nitrogenLevel || 'MEDIUM'}</p>
                            <p>P: {item.nutrientLevels?.phosphorus?.level || item.results?.phosphorusLevel || 'MEDIUM'}</p>
                            <p>K: {item.nutrientLevels?.potassium?.level || item.results?.potassiumLevel || 'MEDIUM'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">{item.deficiencies?.length || 0}</span> {t.defFound}
                          </div>
                          <div className="text-sm text-green-600 font-semibold">{t.viewDetails}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-5 sticky top-4">
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">{t.recentTitle}</h3>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">{t.noHistoryYet}</p>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 3).map((item) => (
                    <div
                      key={item._id}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-400 cursor-pointer transition"
                      onClick={() => handleViewHistory(item._id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-green-600">{item.healthScore || item.results?.healthScore || 75}</span>
                        {getHealthBadge(item.healthClass || item.results?.healthClass)}
                      </div>
                      <p className="text-xs text-gray-500">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'Recent'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {history.length > 3 && (
                <button onClick={() => setView('history')} className="w-full mt-4 px-4 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition font-semibold">
                  {t.viewAll} ({history.length}) →
                </button>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-bold mb-3 text-gray-700">{t.statsTitle}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">{t.totalTests}</span><span className="font-bold">{history.length}</span></div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.avgScore}</span>
                    <span className="font-bold">
                      {history.length > 0 ? Math.round(history.reduce((sum, i) => sum + (i.healthScore || i.results?.healthScore || 75), 0) / history.length) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t.goodSoil}</span>
                    <span className="font-bold text-green-600">{history.filter((i) => (i.healthClass || i.results?.healthClass) === 'GOOD').length}</span>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-bold mb-2 text-gray-700">{t.helpTitle}</h4>
                <p className="text-xs text-gray-600 mb-3">{t.helpDesc}</p>
                <a href="tel:1800-xxx-xxxx" className="block w-full px-4 py-2 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600 transition text-sm font-semibold">
                  {t.helpline}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              ['🎯', t.footer.aiPowered,  t.footer.aiDesc],
              ['⚡', t.footer.instant,    t.footer.instantDesc],
              ['💰', t.footer.free,       t.footer.freeDesc],
            ].map(([icon, title, desc]) => (
              <div key={title} className="p-6 bg-white rounded-lg shadow">
                <div className="text-4xl mb-2">{icon}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>{t.footer.madeFor}</p>
            <p className="mt-2">{t.footer.rights}</p>
          </div>
        </div>
      </div>
      <FloatingChatButton />
    </div>
  );
};

export default SoilAnalysisPage;