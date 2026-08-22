import React from 'react';
import { useLanguage } from '../../context/LanguageContext'; 
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const WaterUsageChart = ({ data, title = 'Water Usage Over Time' }) => {
  const { t } = useLanguage();
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          {t('waterUsageOverTime')}
        </div>
      </div>
    );
  }
  // Format data for the chart
  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    usage: item.usage,
    crop: item.crop,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-800">{payload[0].payload.date}</p>
          <p className="text-blue-600">
            Usage: <span className="font-bold">{payload[0].value} L</span>
          </p>
          {payload[0].payload.crop && (
            <p className="text-gray-600 text-sm">Crop: {payload[0].payload.crop}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{ value: 'Water Usage (L)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="usage" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
            name="Water Usage (L)"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">t('totalUsage')</p>
          <p className="text-xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.usage, 0).toFixed(2)} L
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">t('averageDaily')</p>
          <p className="text-xl font-bold text-green-600">
            {(data.reduce((sum, item) => sum + item.usage, 0) / data.length).toFixed(2)} L
          </p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-gray-600">t('daysTracked')</p>
          <p className="text-xl font-bold text-purple-600">{data.length}</p>
        </div>
      </div>
    </div>
  );
};

export default WaterUsageChart;