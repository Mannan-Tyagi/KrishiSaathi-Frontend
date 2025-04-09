import React, { useEffect, useRef, useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export const MobileMenu = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  filteredCommodities,
  onCommoditySelect,
  getCommodityImage,
  setShowLocationModal,
  selectedMarket,
  selectedDistrict,
  marketId
}) => {
  // Create a local state for search functionality
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showLocalResults, setShowLocalResults] = useState(false);
  
  // Update local state when props change
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);
  
  // Handle the selection completely within this component
  const handleSelectCommodity = (e, commodity) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Mobile selection:", commodity.commodity_name); // Debug
    
    // Update the search query directly
    setLocalSearchQuery(commodity.commodity_name);
    setSearchQuery(commodity.commodity_name);
    
    // Call the parent handler explicitly
    if (onCommoditySelect) {
      onCommoditySelect(commodity, marketId);
    }
    
    // Hide results
    setShowLocalResults(false);
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-emerald-100">
      <div className="px-4 py-3 space-y-4">
        <button
          onClick={() => setShowLocationModal(true)}
          className="w-full flex items-center px-4 py-2.5 text-gray-700 bg-emerald-50/50 rounded-lg"
        >
          <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
          <span>
            {selectedMarket || 'Select Market'}, {selectedDistrict || 'Select District'}
          </span>
        </button>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search commodities..."
            value={localSearchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setLocalSearchQuery(value);
              setSearchQuery(value);
              setShowLocalResults(true);
            }}
            onFocus={() => setShowLocalResults(true)}
            className="w-full px-4 py-2.5 rounded-lg border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80"
          />
          <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />

          {showLocalResults && filteredCommodities.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-auto">
              {filteredCommodities.map((commodity, index) => (
                <div 
                  key={index}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onMouseDown={(e) => handleSelectCommodity(e, commodity)} // Using mouseDown instead of click
                >
                  {getCommodityImage && (
                    <img 
                      src={getCommodityImage(commodity.commodity_name)} 
                      alt={commodity.commodity_name} 
                      className="w-10 h-10 object-cover rounded mr-3"
                      onError={(e) => {e.target.src = '/placeholder.png'}}
                    />
                  )}
                  <div>
                    <div className="font-medium">{commodity.commodity_name}</div>
                    <div className="text-sm text-gray-500">₹{commodity.modal_price}/kg</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};