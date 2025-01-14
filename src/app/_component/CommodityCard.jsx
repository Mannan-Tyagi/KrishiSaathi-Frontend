// components/CommodityCard.jsx
import React from 'react';
import { Clock, Truck, Share2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // Install with: npm install date-fns

const PriceTag = ({ type, value, percentage, isPositive }) => {
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';
  const bgColorClass = isPositive ? 'bg-emerald-50' : 'bg-red-50';

  return (
    <div className={`flex items-center gap-1 ${colorClass} text-xs font-medium ${bgColorClass} px-2 py-1 rounded-full`}>
      <Icon className="w-3 h-3" />
      <span>{percentage}</span>
    </div>
  );
};

const PriceMetricCard = ({ title, value, change }) => {
  const isPositive = !change.startsWith('-');
  
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-50/90 transition-all duration-200">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-lg font-semibold text-gray-900">₹{value}</p>
      <PriceTag isPositive={isPositive} percentage={change} />
    </div>
  );
};

export const CommodityCard = ({
  name = "Onion",
  variety = "Red Variety",
  quality = "Premium Quality",
  image = "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=64&h=64",
  lastUpdated = new Date(),
  volume = "2.5K MT",
  currentPrice = 3855,
  priceUnit = "100 KG",
  priceChange = -25,
  priceChangePercentage = -0.54,
  metrics = {
    low24h: { value: 3800, change: "-1.2%" },
    high24h: { value: 3950, change: "+2.1%" },
    average7d: { value: 3875, change: "+0.8%" }
  },
  isMostTraded = true,
  onShare = () => {},
}) => {
  const timeAgo = formatDistanceToNow(new Date(lastUpdated), { addSuffix: true });
  const isPriceDown = priceChange < 0;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Gradient background effect
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
      
      <div className="relative">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-4">
              {/* Image with enhanced shadow */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-20"></div>
                <img
                  src={image}
                  alt={name}
                  className="relative w-14 h-14 rounded-xl object-cover shadow-md border-2 border-white"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {name}
                  </h2>
                  {isMostTraded && (
                    <span className="px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-full ring-1 ring-emerald-200">
                      Most Traded
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {variety} • {quality}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">
                  Updated: {timeAgo}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-500">Volume: {volume}</p>
              </div>
            </div>
          </div>

          {/* Share Button with hover effect */}
          <button 
            onClick={onShare}
            className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group/share"
          >
            <Share2 className="w-5 h-5 text-gray-500 group-hover/share:text-gray-700" />
          </button>
        </div>

        {/* Price Section */}
        <div className="flex items-end gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Current Price
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-bold text-gray-900">
                ₹{currentPrice.toLocaleString()}
              </p>
              <span className="text-sm font-medium text-gray-500">
                /{priceUnit}
              </span>
            </div>
          </div>
          <div className={`flex items-center ${isPriceDown ? 'text-red-500' : 'text-emerald-500'} text-sm font-medium ${isPriceDown ? 'bg-red-50' : 'bg-emerald-50'} px-3 py-1.5 rounded-full`}>
            {isPriceDown ? <ArrowDownRight className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
            {priceChange} ({priceChangePercentage}%)
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <PriceMetricCard 
              title="24h Low" 
              value={metrics.low24h.value.toLocaleString()} 
              change={metrics.low24h.change} 
            />
            <PriceMetricCard 
              title="24h High" 
              value={metrics.high24h.value.toLocaleString()} 
              change={metrics.high24h.change} 
            />
            <PriceMetricCard 
              title="7d Average" 
              value={metrics.average7d.value.toLocaleString()} 
              change={metrics.average7d.change} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};