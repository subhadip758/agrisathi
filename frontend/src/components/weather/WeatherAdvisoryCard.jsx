import React from 'react';

const WeatherAdvisoryCard = ({ advisories, t = { advisory: {} } }) => {
  if (!advisories || advisories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t.advisory.title}
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{t.advisory.normal}</p>
        </div>
      </div>
    );
  }

  const getAdvisoryIcon = (type) => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getAdvisoryColor = (type, priority) => {
    if (priority === 'high') {
      return 'bg-red-50 border-red-500 text-red-800';
    }

    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-800';
      case 'success':
        return 'bg-green-50 border-green-500 text-green-800';
      default:
        return 'bg-gray-50 border-gray-500 text-gray-800';
    }
  };

  const getIconColor = (type, priority) => {
    if (priority === 'high') {
      return 'text-red-600';
    }

    switch (type) {
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[priority] || colors.low}`}>
        {priority?.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {t.advisory.title}
      </h3>
      <div className="space-y-4">
        {advisories.map((advisory, index) => (
          <div
            key={index}
            className={`border-l-4 rounded-lg p-4 ${getAdvisoryColor(advisory.type, advisory.priority)}`}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getIconColor(advisory.type, advisory.priority)}`}>
                {getAdvisoryIcon(advisory.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold uppercase tracking-wide">
                    {advisory.category?.replace('_', ' ')}
                  </h4>
                  {advisory.priority && getPriorityBadge(advisory.priority)}
                </div>

                <p className="text-sm leading-relaxed">
                  {t.advisory[advisory.messageKey]}
                </p>

                {advisory.actions && advisory.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <p className="text-xs font-semibold mb-2">Recommended Actions:</p>
                    <ul className="text-xs space-y-1">
                      {advisory.actions.map((action, i) => (
                        <li key={i} className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* General Tips */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          {t.advisory.generalTipsTitle}
        </h4>
        <ul className="text-xs text-gray-700 space-y-1">
          {t.advisory.generalTipsList.map((tip, i) => (
            <li key={i}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeatherAdvisoryCard;