import React, { useState, useEffect } from 'react';
import IrrigationForm from '../components/irrigation/IrrigationForm';
import IrrigationSchedule from '../components/irrigation/IrrigationSchedule';
import RuleBasedPlanner from '../components/irrigation/RuleBasedPlanner';
import IrrigationRecommendationCard from '../components/irrigation/IrrigationRecommendationCard';
import { Sprout, Brain, History, Trash2, Droplet, Calendar, AlertCircle } from 'lucide-react';
import FloatingChatButton from '../components/chatbot/Floatingchatbutton';
import { useLanguage } from '../context/LanguageContext';
import irrigationTranslations from '../i18n/irrigation';
import irrigationService from '../services/irrigationService';

const IrrigationPlanner = () => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.page ?? irrigationTranslations.en.page;
  const tS = irrigationTranslations[language]?.schedule ?? irrigationTranslations.en.schedule;

  const [activeTab, setActiveTab] = useState('rule-based');
  const [schedule, setSchedule] = useState(null);
  const [mlPrediction, setMlPrediction] = useState(null);
  const [setMlRecommendation] = useState(null);
  const [showMLInsights, setShowMLInsights] = useState(false);

  // Persistent History State
  const [historyList, setHistoryList] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistorySchedule, setSelectedHistorySchedule] = useState(null);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const response = await irrigationService.getRuleBasedSchedules().catch(() => null);
      let items = response?.data || response || [];
      if (!Array.isArray(items) || items.length === 0) {
        const rawLocal = localStorage.getItem('agrisathi_irrigation_history');
        if (rawLocal) items = JSON.parse(rawLocal);
      }
      if (Array.isArray(items)) {
        setHistoryList(items);
        localStorage.setItem('agrisathi_irrigation_history', JSON.stringify(items));
      }
    } catch (err) {
      console.warn('Failed to load irrigation history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [activeTab]);

  const handleScheduleReceived = (data) => {
    setSchedule(data);
    loadHistory();
  };

  const handleMLPredictionReceived = (prediction) => {
    setMlPrediction(prediction);
    setShowMLInsights(true);
  };

  const handleMLRecommendationReceived = (rec) => {
    setMlRecommendation(rec);
  };

  const handleDeleteHistory = async (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved irrigation schedule?')) {
      try {
        await irrigationService.deactivateRuleBasedSchedule(id).catch(() => {});
      } catch (_) {}
      const updated = historyList.filter(item => String(item._id) !== String(id));
      setHistoryList(updated);
      localStorage.setItem('agrisathi_irrigation_history', JSON.stringify(updated));
      if (selectedHistorySchedule && String(selectedHistorySchedule._id) === String(id)) {
        setSelectedHistorySchedule(null);
      }
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (String(urgency).toLowerCase()) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high':     return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':   return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low':      return 'bg-green-100 border-green-500 text-green-800';
      default:         return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const tabs = [
    { id: 'rule-based', name: t.tabs.ruleBased, icon: Sprout,  description: t.tabs.ruleDesc,   color: 'green'  },
    { id: 'ml',         name: t.tabs.ml,        icon: Brain,   description: t.tabs.mlDesc,     color: 'blue'   },
    { id: 'history',    name: `${t.tabs.history} (${historyList.length})`, icon: History, description: t.tabs.historyDesc, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
          <p className="text-gray-600 mt-2">{t.subtitle}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const colorClasses = {
                  green:  isActive ? 'border-green-500 text-green-600'  : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300',
                  blue:   isActive ? 'border-blue-500 text-blue-600'    : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300',
                  purple: isActive ? 'border-purple-500 text-purple-600': 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300',
                };
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${colorClasses[tab.color]}`}>
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">{tabs.find(tab => tab.id === activeTab)?.description}</p>
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">

          {/* Rule-Based Tab */}
          {activeTab === 'rule-based' && (
            <div className="animate-fadeIn">
              <RuleBasedPlanner />
            </div>
          )}

          {/* ML Tab */}
          {activeTab === 'ml' && (
            <div className="animate-fadeIn">
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <IrrigationForm
                    onScheduleReceived={handleScheduleReceived}
                    onMLPredictionReceived={handleMLPredictionReceived}
                    onMLRecommendationReceived={handleMLRecommendationReceived}
                  />
                </div>

                {showMLInsights && mlPrediction && mlPrediction.prediction && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{tS.aiAnalysisTitle}</h3>
                      <button onClick={() => setShowMLInsights(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className={`p-4 rounded-lg border-l-4 mb-4 ${
                      mlPrediction.prediction.needsIrrigation ? 'bg-blue-50 border-blue-500' : 'bg-green-50 border-green-500'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold">
                          {mlPrediction.prediction.needsIrrigation ? tS.irrigNeeded : tS.noIrrigNeeded}
                        </h4>
                        <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold">
                          {mlPrediction.prediction.confidence}{tS.confidence}
                        </span>
                      </div>
                      <p className="text-gray-700">{mlPrediction.prediction.recommendation}</p>
                    </div>

                    {mlPrediction.prediction.needsIrrigation && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">{tS.waterAmount}</p>
                          <p className="text-2xl font-bold text-blue-600">{mlPrediction.prediction.waterAmount?.value || 2500}L</p>
                          <p className="text-xs text-gray-500">{mlPrediction.prediction.waterAmount?.perArea || 'per acre'}</p>
                        </div>
                        <div className={`p-4 rounded-lg border-l-4 ${getUrgencyColor(mlPrediction.prediction.urgency)}`}>
                          <p className="text-sm mb-1">{tS.urgencyTitle}</p>
                          <p className="text-xl font-bold capitalize">{mlPrediction.prediction.urgency}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-1">{tS.soilMoisLabel}</p>
                          <p className="text-2xl font-bold text-gray-700">{mlPrediction.prediction.conditions?.soilMoisture || 50}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {schedule && <div><IrrigationSchedule schedule={schedule} /></div>}
              </div>
            </div>
          )}

          {/* Persistent History Tab */}
          {activeTab === 'history' && (
            <div className="animate-fadeIn space-y-6">
              {selectedHistorySchedule ? (
                <div>
                  <button
                    onClick={() => setSelectedHistorySchedule(null)}
                    className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition"
                  >
                    ← Back to Irrigation History
                  </button>
                  <IrrigationRecommendationCard schedule={selectedHistorySchedule} />
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Saved Irrigation History</h2>
                      <p className="text-sm text-gray-500">All past rule-based and AI schedules stored persistently</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                      {historyList.length} Record{historyList.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {historyList.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center">
                      <History className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.noSchedules}</h3>
                      <p className="text-gray-600 mb-6">{t.noSchedulesDesc}</p>
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => setActiveTab('rule-based')}
                          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                          {t.tryRuleBased}
                        </button>
                        <button onClick={() => setActiveTab('ml')}
                          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                          {t.tryAI}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {historyList.map((item) => {
                        const farm = item.farmDetails || {};
                        const sched = item.irrigationSchedule || {};
                        const dateStr = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Saved Schedule';

                        return (
                          <div
                            key={item._id}
                            className="border-2 border-gray-100 rounded-xl p-5 hover:border-purple-300 hover:shadow-md transition cursor-pointer bg-white relative"
                            onClick={() => setSelectedHistorySchedule(item)}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                  {farm.cropType || 'Crop'} Irrigation Plan
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {dateStr} • {farm.farmSize || 1} Acre ({farm.soilType || 'Soil'})
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getUrgencyColor(sched.urgency || 'medium')}`}>
                                  {sched.urgency || 'Medium'} Urgency
                                </span>
                                <button
                                  onClick={(e) => handleDeleteHistory(e, item._id)}
                                  className="text-gray-400 hover:text-red-600 p-1.5 rounded transition"
                                  title="Delete Schedule"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-purple-50/50 p-3 rounded-lg text-xs">
                              <div>
                                <span className="text-gray-500 block">Frequency:</span>
                                <span className="font-bold text-gray-800">{sched.frequency || 'Every 3 days'}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Water Quantity:</span>
                                <span className="font-bold text-blue-700">{sched.waterQuantity || 2000} Liters</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Duration:</span>
                                <span className="font-bold text-purple-700">{sched.duration || 30} mins</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Weekly Total:</span>
                                <span className="font-bold text-indigo-700">{sched.weeklyWaterNeed || 8000} Liters</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comparison Section */}
        {!schedule && !showMLInsights && activeTab !== 'history' && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.whichPlanner}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                <div className="flex items-center mb-3">
                  <Sprout className="w-6 h-6 text-green-600 mr-2" />
                  <h4 className="font-semibold text-green-800">{t.comparison.ruleTitle}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">{t.comparison.ruleDesc}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {t.comparison.ruleFeatures.map((f, i) => (
                    <li key={i} className="flex items-start"><span className="text-green-600 mr-2">✓</span><span>{f}</span></li>
                  ))}
                </ul>
              </div>
              <div className="border border-blue-200 rounded-lg p-5 bg-blue-50">
                <div className="flex items-center mb-3">
                  <Brain className="w-6 h-6 text-blue-600 mr-2" />
                  <h4 className="font-semibold text-blue-800">{t.comparison.mlTitle}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">{t.comparison.mlDesc}</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {t.comparison.mlFeatures.map((f, i) => (
                    <li key={i} className="flex items-start"><span className="text-blue-600 mr-2">✓</span><span>{f}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
      <FloatingChatButton />
    </div>
  );
};

export default IrrigationPlanner;