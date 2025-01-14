import React from 'react';
import { Clock, Truck, Share2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow, parse } from 'date-fns';

const PriceTag = ({ value, percentage, isPositive }) => {
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';
  const bgColorClass = isPositive ? 'bg-emerald-50' : 'bg-red-50';

  return (
    <div className={`flex items-center gap-1 ${colorClass} text-xs font-medium ${bgColorClass} px-2 py-1 rounded-full`}>
      <Icon className="w-3 h-3" />
      <span>{percentage}%</span>
    </div>
  );
};

const PriceMetricCard = ({ title, value, change }) => {
  const isPositive = parseFloat(change) >= 0;
  
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-50/90 transition-all duration-200">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-lg font-semibold text-gray-900">₹{parseFloat(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
      <PriceTag isPositive={isPositive} percentage={change} />
    </div>
  );
};
const getCommodityImage = (commodityName) => {
  const sanitized = commodityName.replace(/\s+/g, '_');
  return `/${sanitized}.jpeg`;
};
export const CommodityCard = ({ data }) => {
  const {
    arrival_date_string,
    min_price,
    max_price,
    modal_price,
    commodity_name,
    commodity_variety,
    commodity_grade,
    price_change,
    percentage_change,
  } = data;

  const parsedDate = parse(arrival_date_string, 'dd-MMM-yyyy', new Date());
  const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });
  const isPriceUp = parseFloat(price_change) > 0;

  // Calculate daily price range percentage
  const priceRange = ((parseFloat(max_price) - parseFloat(min_price)) / parseFloat(min_price) * 100).toFixed(2);

  return (
    <div className="group relative bg-white rounded-xl shadow-sm p-6 border border-emerald-100 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur-lg opacity-20"></div>
                <img
                 src={getCommodityImage(commodity_name)}
                  alt={commodity_name}
                  className="relative w-14 h-14 rounded-xl object-cover shadow-md border-2 border-white"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {commodity_name}
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {commodity_variety} • {commodity_grade}
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
                <p className="text-sm text-gray-500">Daily Price Range: {priceRange}%</p>
              </div>
            </div>
          </div>

          <button className="p-2.5 rounded-lg hover:bg-gray-100 transition-colors group/share">
            <Share2 className="w-5 h-5 text-gray-500 group-hover/share:text-gray-700" />
          </button>
        </div>

        {/* Price Section */}
        <div className="flex items-end gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Modal Price
            </p>
            <div className="flex items-baseline gap-1">
              <p className="text-4xl font-bold text-gray-900">
                ₹{parseFloat(modal_price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </p>
              <span className="text-sm font-medium text-gray-500">
                /Quintal
              </span>
            </div>
          </div>
          <div className={`flex items-center ${isPriceUp ? 'text-emerald-500' : 'text-red-500'} text-sm font-medium ${isPriceUp ? 'bg-emerald-50' : 'bg-red-50'} px-3 py-1.5 rounded-full`}>
            {isPriceUp ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
            ₹{parseFloat(price_change).toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({percentage_change}%)
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <PriceMetricCard 
              title="Min Price" 
              value={min_price}
              change={percentage_change}
            />
            <PriceMetricCard 
              title="Max Price" 
              value={max_price}
              change={percentage_change}
            />
            <PriceMetricCard 
              title="Modal Price" 
              value={modal_price}
              change={percentage_change}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommodityCard;