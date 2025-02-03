import React, { useEffect, useRef } from 'react';
import { Search, MapPin } from 'lucide-react';
import { SearchResults } from './SearchResults';

export const MobileMenu = ({
  isOpen,
  searchQuery,
  showSearch,         // Accept showSearch here
  setSearchQuery,
  setShowSearch,
  filteredCommodities,
  onCommoditySelect,
  getCommodityImage,
  setShowLocationModal,
  selectedMarket,
  selectedDistrict,
  marketId
}) => {
  // Create a ref for the search container
  const searchContainerRef = useRef(null);

  // Close search results if clicking outside of the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowSearch]);

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
        <div ref={searchContainerRef} className="relative">
          <input
            type="text"
            placeholder="Search commodities..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            className="w-full px-4 py-2.5 rounded-lg border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80"
          />
          <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />

          {/* Show results if showSearch is true and there are any commodities */}
          {showSearch && filteredCommodities.length > 0 && (
            <SearchResults
              results={filteredCommodities}
              onSelect={(commodity) => {
                onCommoditySelect?.(commodity, marketId);
                setSearchQuery(commodity.commodity_name);
                setShowSearch(false);
              }}
              getImage={getCommodityImage}
            />
          )}
        </div>

        
      </div>
    </div>
  );
};
