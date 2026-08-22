import React, { useState } from 'react';
import SimplifiedIrrigationForm from './SimplifiedIrrigationForm';
import IrrigationRecommendationCard from './IrrigationRecommendationCard';
import WeeklyScheduleCalendar from './WeeklyScheduleCalendar';
import { CheckCircle, XCircle } from 'lucide-react';
import ruleBasedIrrigationService from '../../services/ruleBasedIrrigationService';
import { useLanguage } from '../../context/LanguageContext';
import irrigationTranslations from '../../i18n/irrigation';

const RuleBasedPlanner = () => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.rulePlanner ?? irrigationTranslations.en.rulePlanner;

  const [schedule, setSchedule]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [success, setSuccess]         = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const handleGenerateSchedule = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await ruleBasedIrrigationService.generateSchedule(formData);
      if (response.success) {
        setSchedule(response.data);
        setSuccess(t.successMsg);
        setTimeout(() => setSuccess(null), 5000);
      } else {
        throw new Error(response.message || t.failMsg);
      }
    } catch (err) {
      setError(err.message || err.error || t.failMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSchedule = async () => {
    try {
      setSuccess(t.saveSuccess);
      setTimeout(() => setSuccess(null), 5000);
    } catch {
      setError(t.failMsg);
    }
  };

  const handleAddFeedback = () => {
    alert(t.feedbackSoon);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <p className="text-green-800 font-medium">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-600 hover:text-green-800">✕</button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-600 mr-3" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">✕</button>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">{t.infoBannerTitle}</h3>
        <p className="text-blue-800 text-sm">{t.infoBannerDesc}</p>
      </div>

      {/* Form */}
      <SimplifiedIrrigationForm onSubmit={handleGenerateSchedule} loading={loading} />

      {/* Results */}
      {schedule && (
        <div className="space-y-6">
          <IrrigationRecommendationCard
            schedule={schedule}
            onSaveSchedule={handleSaveSchedule}
            onAddFeedback={handleAddFeedback}
          />

          <div className="flex justify-center">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
            >
              {showCalendar ? t.hideCalendar : t.showCalendar}
            </button>
          </div>

          {showCalendar && <WeeklyScheduleCalendar schedule={schedule.schedule} />}
        </div>
      )}
    </div>
  );
};

export default RuleBasedPlanner;