import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon: Icon,
  action,
  className = '',
  padding = 'default',
  hover = true 
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    default: 'p-6',
    large: 'p-8',
  };

  return (
    <div 
      className={`
        bg-white rounded-lg shadow-card
        ${hover ? 'hover:shadow-card-hover' : ''}
        transition-shadow duration-200
        ${paddingClasses[padding]}
        ${className}
      `}
    >
      {(title || subtitle || Icon || action) && (
        <div className="mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {Icon && (
                <div className="p-2 bg-primary-50 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
              )}
              <div className="flex-1">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-800">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            {action && (
              <div className="ml-4">
                {action}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

// Stat Card Component
export const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  subtitle 
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeColors[changeType]}`}>
              {change}
            </div>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            <Icon className="w-8 h-8 text-primary-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

// Info Card Component
export const InfoCard = ({ 
  title, 
  description, 
  icon: Icon, 
  variant = 'default',
  action 
}) => {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };

  return (
    <div className={`rounded-lg border-l-4 p-4 ${variantClasses[variant]}`}>
      <div className="flex items-start">
        {Icon && (
          <Icon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          {description && (
            <p className="text-sm opacity-90">{description}</p>
          )}
        </div>
        {action && (
          <div className="ml-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

// Empty State Card
export const EmptyStateCard = ({ 
  icon: Icon, 
  title, 
  description, 
  action 
}) => {
  return (
    <Card className="text-center py-12">
      {Icon && (
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div>
          {action}
        </div>
      )}
    </Card>
  );
};

export default Card;