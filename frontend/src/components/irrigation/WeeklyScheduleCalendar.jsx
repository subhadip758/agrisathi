import React from 'react';
import { Droplet, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import irrigationTranslations from '../../i18n/irrigation';

const WeeklyScheduleCalendar = ({ schedule }) => {
  const { language } = useLanguage();
  const t = irrigationTranslations[language]?.calendar ?? irrigationTranslations.en.calendar;

  if (!schedule) return null;

  const { irrigationSchedule, farmDetails } = schedule;

  const generateWeekDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        date,
        dayName:   date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month:     date.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return days;
  };

  const shouldIrrigateOnDay = (dayIndex) => {
    const frequency = irrigationSchedule.frequency;
    if (frequency === 'Daily' || frequency === 'Twice Daily') return true;
    if (frequency.includes('Every')) {
      const days = parseInt(frequency.match(/\d+/)[0]);
      return dayIndex % days === 0;
    }
    return false;
  };

  const weekDays = generateWeekDays();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <CalendarIcon className="w-6 h-6 mr-2 text-blue-600" />
          {t.title}
        </h2>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {weekDays.map((day, index) => {
          const needsIrrigation = shouldIrrigateOnDay(index);
          return (
            <div key={index} className={`border rounded-lg p-4 transition-all ${needsIrrigation ? 'bg-blue-50 border-blue-300 shadow-md' : 'bg-gray-50 border-gray-200'}`}>
              <div className="text-center mb-3">
                <p className="text-xs font-medium text-gray-600">{day.dayName}</p>
                <p className="text-2xl font-bold text-gray-800">{day.dayNumber}</p>
                <p className="text-xs text-gray-500">{day.month}</p>
              </div>
              {needsIrrigation ? (
                <div className="space-y-2">
                  <div className="bg-blue-100 rounded-lg p-2">
                    <div className="flex items-center justify-center text-blue-700 mb-1">
                      <Droplet className="w-4 h-4 mr-1" />
                      <span className="text-xs font-semibold">{t.irrigate}</span>
                    </div>
                    <div className="space-y-1">
                      {irrigationSchedule.timeOfDay.map((time, i) => (
                        <div key={i} className="bg-white rounded px-2 py-1 text-center">
                          <p className="text-xs font-medium text-gray-800">{time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded-lg p-2 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-purple-700 mr-1" />
                    <span className="text-xs font-medium text-purple-700">{irrigationSchedule.duration} min</span>
                  </div>
                  <div className="bg-green-100 rounded-lg p-2 text-center">
                    <p className="text-xs font-medium text-green-700">{(irrigationSchedule.waterQuantity / 1000).toFixed(1)}k L</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-xs text-gray-400 italic">{t.noIrrigation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <h3 className="font-semibold text-gray-700 mb-3">{t.legend}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded mr-2"></div>
            <span className="text-gray-700">{t.irrigationDay}</span>
          </div>
          <div className="flex items-center">
            <Droplet className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-gray-700">{t.waterRequired}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-gray-700">{t.durationLabel}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{t.weeklySummary}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">{t.totalSessions}</p>
            <p className="font-bold text-gray-800">
              {weekDays.filter((_, i) => shouldIrrigateOnDay(i)).length * irrigationSchedule.timeOfDay.length}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{t.waterPerSession}</p>
            <p className="font-bold text-gray-800">{(irrigationSchedule.waterQuantity / 1000).toFixed(1)}k L</p>
          </div>
          <div>
            <p className="text-gray-600">{t.weeklyTotal}</p>
            <p className="font-bold text-gray-800">{(irrigationSchedule.weeklyWaterTotal / 1000).toFixed(1)}k L</p>
          </div>
          <div>
            <p className="text-gray-600">{t.cropLabel}</p>
            <p className="font-bold text-gray-800">{farmDetails.cropType}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleCalendar;