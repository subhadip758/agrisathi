import React from 'react';

const StatisticsCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral', 
  icon, 
  bgColor = 'bg-white',
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600' 
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (changeType === 'negative') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={`${bgColor} rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          
          {change !== undefined && change !== null && (
            <div className={`flex items-center space-x-1 mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${iconBgColor} rounded-full p-3`}>
            <div className={iconColor}>
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsCard;