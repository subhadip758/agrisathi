import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TrendChart = ({
  data,
  title = 'Trend Analysis',
  dataKey = 'value',
  xAxisKey = 'date',
  color = '#10b981',
  height = 250
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after mount
    setIsVisible(true);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No trend data available
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { payload: point } = payload[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-800">{point[xAxisKey]}</p>
          <p style={{ color }}>
            Value: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const calculateTrend = () => {
    if (data.length < 2) return 'stable';
    const firstValue = data[0][dataKey];
    if (firstValue === 0) return 'stable';
    const lastValue = data[data.length - 1][dataKey];
    const change = ((lastValue - firstValue) / firstValue) * 100;

    if (change > 5) return 'increasing';
    if (change < -5) return 'decreasing';
    return 'stable';
  };

  const trend = calculateTrend();
  const trendIcon = {
    increasing: (
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    decreasing: (
      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
    stable: (
      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6
        transition-opacity duration-700 ease-in-out
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex items-center space-x-2">
          {trendIcon[trend]}
          <span className="text-sm font-medium text-gray-600 capitalize">{trend}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey={xAxisKey}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#color${dataKey})`}
            isAnimationActive={true}  // Animation enabled
            animationDuration={1500}  // Animation duration in ms
          />

        </AreaChart>
      </ResponsiveContainer>

      {/* Summary */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-gray-600">Min</p>
          <p className="text-lg font-semibold text-gray-800">
            {Math.min(...data.map(d => d[dataKey])).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Average</p>
          <p className="text-lg font-semibold text-gray-800">
            {(data.reduce((sum, d) => sum + d[dataKey], 0) / data.length).toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Max</p>
          <p className="text-lg font-semibold text-gray-800">
            {Math.max(...data.map(d => d[dataKey])).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
