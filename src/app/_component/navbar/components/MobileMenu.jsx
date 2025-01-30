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
}) => (
  isOpen && (
    <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-emerald-100">
      <div className="px-4 py-3 space-y-4">
        <div className="relative">
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

          {showSearch && searchQuery && filteredCommodities.length > 0 && (
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

        <button
          onClick={() => setShowLocationModal(true)}
          className="w-full flex items-center px-4 py-2.5 text-gray-700 bg-emerald-50/50 rounded-lg"
        >
          <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
          <span>
            {selectedMarket || 'Select Market'}, {selectedDistrict || 'Select District'}
          </span>
        </button>
      </div>
    </div>
  )
);