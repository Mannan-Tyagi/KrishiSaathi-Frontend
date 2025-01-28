import React, { useState, useEffect } from 'react';
import { TrendingUp, MapPin, ArrowUpRight, ArrowDownRight, Menu } from 'lucide-react';

const TimeRangeSelect = ({ value, onChange, isMobile }) => (
  <select 
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`text-xs sm:text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-gray-100 transition-colors ${
      isMobile ? 'w-full mb-2' : ''
    }`}
  >
    <option value="24h">Last 24 hours</option>
    <option value="7d">Last 7 days</option>
    <option value="30d">Last 30 days</option>
  </select>
);

const MarketItem = ({ item }) => {
  const modalPrice = parseFloat(item.modal_price) || 0;
  const minPrice = parseFloat(item.min_price) || 0;
  const maxPrice = parseFloat(item.max_price) || 0;

  const priceRange = minPrice > 0 ? 
    ((maxPrice - minPrice) / minPrice * 100).toFixed(1) : 
    0;
  
  const isPositive = maxPrice >= modalPrice;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg hover:bg-gray-50/90 transition-all duration-200 border border-gray-100 hover:border-blue-100 hover:shadow-sm gap-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
            {item.market_name || 'Market Name Not Available'}
          </span>
          <p className="text-sm text-gray-500">
            {item.arrival_date_string}
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-lg font-semibold text-gray-900">
          ₹{modalPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </p>
        <div className="flex items-center sm:justify-end gap-1">
          <Icon className={`w-4 h-4 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`} />
          <p className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            Range: {priceRange}%
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Min: ₹{minPrice.toLocaleString('en-IN')} | Max: ₹{maxPrice.toLocaleString('en-IN')}
        </p>
      </div>
    </div>
  );
};

export const TopMarketsCard = ({ data = [], isLoading, error, selectedCommodity }) => {
  const [timeRange, setTimeRange] = useState('24h');
  const [localData, setLocalData] = useState(data);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (!selectedCommodity?.commodity_id) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-emerald-100 flex items-center justify-center h-64">
        <p className="text-gray-500">Select a commodity to view top markets</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
      {/* Mobile Header with Menu Toggle */}
      <div className="sm:hidden flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-800">Top Markets</h2>
          </div>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mb-4">
          <TimeRangeSelect 
            value={timeRange} 
            onChange={handleTimeRangeChange}
            isMobile={true}
          />
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden sm:flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-20"></div>
            <div className="relative w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800 break-words">
            Top Markets - {selectedCommodity?.commodity_name || 'Loading...'}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <TimeRangeSelect 
            value={timeRange} 
            onChange={handleTimeRangeChange}
          />
        </div>
      </div>

      {/* Market List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">Loading market data...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-red-500">{error}</p>
        </div>
      ) : localData.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <p className="text-gray-500">No market data available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localData.map((item, index) => (
            <MarketItem
              key={`${item.market_id}-${index}`}
              item={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TopMarketsCard;