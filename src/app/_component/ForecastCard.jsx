import React, { useState } from 'react';
import { BarChart3, Zap, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';

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

const ForecastCard = ({ data, isLoading, error, selectedCommodity }) => {
  const [timeRange, setTimeRange] = useState('6w');

  const formatPrice = (price) => {
    if (!price) return '0.00';
    
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    }
    
    return isNaN(price) ? '0.00' : Number(price).toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    });
  };

  const ForecastItem = ({ forecast }) => {
    const { 
      week, 
      avg_modal_price, 
      avg_predicted_price, 
      diff 
    } = forecast;

    const isPositive = parseFloat(diff) >= 0;
    const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
    const changeColor = isPositive ? 'text-emerald-600' : 'text-red-500';
    
    // Calculate the forecasted date based on the week number
    const getDateFromWeek = (weekNum) => {
      const currentDate = new Date();
      const startDate = new Date(currentDate.getFullYear(), 0, 1);
      const days = weekNum * 7;
      const targetDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000);
      return format(targetDate, 'MMM d');
    };

    return (
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        <div className="relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div className="text-sm">
                <p className="text-gray-600">Week {week}</p>
                <p className="text-xs text-gray-400">{getDateFromWeek(week)}</p>
              </div>
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Current Price</p>
            <p className="text-base font-semibold text-gray-700">
              ₹{formatPrice(avg_modal_price)}
            </p>
          </div>

          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Predicted Price</p>
            <p className="text-lg font-bold text-gray-900">
              ₹{formatPrice(avg_predicted_price)}
            </p>
          </div>

          <div className="flex items-center gap-1 mt-2">
            <Icon className={`w-3 h-3 ${changeColor}`} />
            <p className={`text-xs font-medium ${changeColor}`}>
              {parseFloat(diff).toFixed(1)}%
            </p>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <p className="text-xs text-gray-500">Confidence:</p>
            <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-300"
                style={{ width: '80%' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Sort the data by week in descending order (most recent first)
  const sortedData = Array.isArray(data) 
    ? [...data].sort((a, b) => b.week - a.week)
    : [];

  if (isLoading) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
        <div className="text-center text-gray-500">Loading forecast data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-red-100">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  if (!selectedCommodity) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
        <div className="text-center text-gray-500">Select a commodity to view forecast</div>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100">
        <div className="text-center text-gray-500">No forecast data available</div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg blur opacity-30"></div>
            <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Price Forecast</h2>
            <p className="text-sm text-gray-500">AI-powered commodity price predictions</p>
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {sortedData.map((forecast, index) => (
          <ForecastItem 
            key={forecast.week}
            forecast={forecast}
          />
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Last updated on {format(new Date(), 'PPP')}. 
          Predictions are based on historical data and market trends.
        </p>
      </div>
    </div>
  );
};

export default ForecastCard;