// components/ForecastCard/ForecastCard.jsx
import React, { useState } from 'react';
import { BarChart3, Zap, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format, addWeeks, startOfWeek } from 'date-fns';

// Utility function to generate forecast data
const generateForecastData = (startDate, numWeeks = 6) => {
  return Array.from({ length: numWeeks }).map((_, index) => {
    const weekDate = addWeeks(startDate, index);
    const weekNumber = format(weekDate, 'w');
    const basePrice = 2955;
    const randomChange = (Math.random() * 4 - 1).toFixed(1); // Random change between -1% and 3%
    const price = basePrice * (1 + parseFloat(randomChange) / 100);
    
    return {
      week: weekNumber,
      date: weekDate,
      price: price.toFixed(2),
      change: `${randomChange}%`,
      isPositive: parseFloat(randomChange) > 0,
      confidence: 85 - index * 5, // Decreasing confidence over time
    };
  });
};

const TimeRangeSelect = ({ value, onChange }) => (
  <select 
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-sm border-gray-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/80 backdrop-blur-sm px-3 py-2 hover:bg-gray-100 transition-colors"
  >
    <option value="6w">Next 6 weeks</option>
    <option value="3m">Next 3 months</option>
    <option value="6m">Next 6 months</option>
  </select>
);

const ForecastCard = ({ currentDate = new Date(), userName = 'User' }) => {
  const [timeRange, setTimeRange] = useState('6w');
  const [forecasts] = useState(() => generateForecastData(startOfWeek(currentDate)));

  const ForecastItem = ({ week, date, price, change, isPositive, confidence }) => {
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const changeColor = isPositive ? 'text-emerald-600' : 'text-red-500';
    
    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <div className="relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200">
          {/* Week Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="text-sm">
                <p className="text-gray-600">Week {week}</p>
                <p className="text-xs text-gray-400">{format(date, 'MMM d')}</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-gray-900">
            ₹{parseFloat(price).toLocaleString()}
          </p>

          {/* Change */}
          <div className="flex items-center gap-1 mt-2">
            <Icon className={`w-3 h-3 ${changeColor}`} />
            <p className={`text-xs font-medium ${changeColor}`}>
              {change}
            </p>
          </div>

          {/* Confidence Bar */}
          <div className="flex items-center gap-1 mt-1">
            <p className="text-xs text-gray-500">Confidence:</p>
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg blur opacity-30"></div>
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Price Forecast
            </h2>
            <p className="text-sm text-gray-500">
              AI-powered commodity price predictions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">AI Predictions</span>
          </div>
          <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      {/* Forecast Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {forecasts.map((forecast, index) => (
          <ForecastItem key={index} {...forecast} />
        ))}
      </div>

      {/* Footer - Additional Info */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Last updated on {format(currentDate, 'PPP')} by {userName}. 
          Predictions are based on historical data and market trends.
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;