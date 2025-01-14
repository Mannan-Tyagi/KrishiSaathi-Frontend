// components/TopMarketsCard.jsx
import React, { useState } from 'react';
import { TrendingUp, Download, MapPin, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TimeRangeSelect = ({ value, onChange }) => (
  <select 
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50/80 backdrop-blur-sm px-3 py-2 hover:bg-gray-100 transition-colors"
  >
    <option value="24h">Last 24 hours</option>
    <option value="7d">Last 7 days</option>
    <option value="30d">Last 30 days</option>
  </select>
);

const MarketItem = ({ market, price, change, volume }) => {
  const isPositive = change.startsWith('+');
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="group flex items-center justify-between p-4 rounded-lg hover:bg-gray-50/90 transition-all duration-200 border border-gray-100 hover:border-blue-100 hover:shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/50">
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <span className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
            {market}
          </span>
          <p className="text-sm text-gray-500">
            Volume: {volume}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          ₹{price.toLocaleString()}
        </p>
        <div className="flex items-center justify-end gap-1">
          <Icon className={`w-4 h-4 ${isPositive ? 'text-emerald-600' : 'text-red-500'}`} />
          <p className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {change}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TopMarketsCard = ({ 
  title = "Top Markets",
  onDownload = () => console.log("Download data"),
}) => {
  const [timeRange, setTimeRange] = useState('24h');
  
  // Sample data - in a real app, this would come from props or an API
  const marketData = [
    {
      market: "Kolkata Market",
      price: 3800,
      change: "+2.3%",
      volume: "450 MT"
    },
    {
      market: "Solapur",
      price: 3600,
      change: "-1.2%",
      volume: "380 MT"
    },
    {
      market: "Mumbai",
      price: 3900,
      change: "+3.1%",
      volume: "520 MT"
    },
    {
      market: "Bangalore",
      price: 3700,
      change: "-0.5%",
      volume: "410 MT"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-lg blur opacity-20"></div>
            <div className="relative w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <TimeRangeSelect value={timeRange} onChange={setTimeRange} />
          <button 
            onClick={onDownload}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors group"
            title="Download data"
          >
            <Download className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* Market List */}
      <div className="space-y-4">
        {marketData.map((item, index) => (
          <MarketItem
            key={index}
            market={item.market}
            price={item.price}
            change={item.change}
            volume={item.volume}
          />
        ))}
      </div>
    </div>
  );
};