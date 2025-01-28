import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sprout, Menu, ChevronDown } from 'lucide-react';
import { BASE_BACKEND_URL, setCommodityId, setMarketId, setMarketName } from "../utils";
import Image from 'next/image';

function Navbar({ onCommoditySelect }) {
  // Track location selections

  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');

  // For toggling modals and menus
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // For searching commodities
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Lists from the backend
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);
  const [commoditiesList, setCommoditiesList] = useState([]);
  
  // Track the selected market and its ID
  const [marketId, setMarketId] = useState(null);
  // const [commodityId, setCommodityId] = useState(null);

   // --------------------------------------------------------------------------
  // 1) Fetch list of states on mount ( /api/get-market-states/ )
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-market-states/`);
        if (!response.ok) {
          throw new Error(`Failed to fetch states. Status: ${response.status}`);
        }
        const data = await response.json();
        setStatesList(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
  }, []);
  // --------------------------------------------------------------------------
  // 2) Fetch districts whenever selectedState changes
  //    ( /api/get-market-districts/ with body { "market_state": selectedState } )
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) {
        setDistrictsList([]);
        setSelectedDistrict('');
        return;
      }
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-market-districts/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market_state: selectedState }),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch districts. Status: ${response.status}`);
        }
        const data = await response.json();
        setDistrictsList(data);
        setSelectedDistrict('');
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, [selectedState]);
  // --------------------------------------------------------------------------
  // 3) Fetch markets any time selectedDistrict changes
  //    ( /api/get-markets/ with body { "market_district": selectedDistrict } )
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchMarkets = async () => {
      if (!selectedDistrict) {
        setMarketsList([]);
        setSelectedMarket('');
        return;
      }
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-markets/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market_district: selectedDistrict }),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch markets. Status: ${response.status}`);
        }
        const data = await response.json();
        setMarketsList(data);
        setSelectedMarket('');
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    };
    fetchMarkets();
  }, [selectedDistrict]);
  // --------------------------------------------------------------------------
  // 4) Fetch commodities whenever a market is selected
  //    ( /api/get-commodity/ with body { "market_id": market_id } )
  // --------------------------------------------------------------------------
  const sortCommoditiesByDate = (commodities) => {
    return commodities.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  // Fetch commodities whenever a market is selected
  useEffect(() => {
    const marketObj = marketsList.find((m) => m.market_name === selectedMarket);
    if (!marketObj) {
      setCommoditiesList([]);
      return;
    }
    const fetchCommodities = async () => {
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-commodity/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market_id: String(marketObj.market_id) }),
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch commodities. Status: ${response.status}`);
        }
        const data = await response.json();
        const sortedData = sortCommoditiesByDate(data);
        setCommoditiesList(sortedData);
        // Also store the market info for external usage
        setMarketId(marketObj.market_id);
      } catch (error) {
        console.error('Error fetching commodities:', error);
      }
    };
    fetchCommodities();
  }, [selectedMarket, marketsList]);
  // --------------------------------------------------------------------------
  // 5) Filter the fetched commodities based on searchQuery
  // --------------------------------------------------------------------------
  const filteredCommodities = commoditiesList.filter((commodity) =>
    commodity.commodity_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Simple helper to load images from public/<commodity_name>.jpg
  // Adjust or sanitize commodity names as needed for actual file naming
  const getCommodityImage = (commodityName) => {
    // Only sanitize if there are spaces (replace spaces with underscores)
    const sanitized = commodityName.replace(/\s+/g, '_');
    return `/${sanitized}.jpeg`;
  };
  
  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Krishi Saathi
                  </span>
                </div>
              </div>
            </div>

            {/* Search (center) */}
            <div className="hidden md:flex items-center flex-1 max-w-3xl mx-8 gap-4">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-200" />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search commodities..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSearch(true);
                    }}
                    onFocus={() => setShowSearch(true)}
                    className="w-full px-4 py-2.5 rounded-lg border border-emerald-100
                               focus:outline-none focus:ring-2 focus:ring-emerald-500
                               focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                  <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                </div>

                {/* Search Results for Desktop */}
                {showSearch && searchQuery && filteredCommodities.length > 0 && (
                  <div className="absolute mt-1 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-emerald-100 max-h-96 overflow-y-auto">
                    {filteredCommodities.map((commodity) => (
                      <div
                        key={commodity.commodity_id}
                        className="flex items-center p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors"
                        onClick={() => {
                          setCommodityId(commodity.commodity_id);
                          onCommoditySelect?.(commodity,marketId);
                          setSearchQuery(commodity.commodity_name);
                          setShowSearch(false);
                        }}
                      >
                        <Image
                          src={getCommodityImage(commodity.commodity_name)}
                          alt={commodity.commodity_name}
                          className="w-12 h-12 rounded-lg object-cover"
                          width={48}
                          height={48}
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-gray-700 font-medium">
                            {commodity.commodity_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {commodity.modal_price
                              ? `₹${commodity.modal_price}`
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* The location button (on the right side) */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="hidden md:flex items-center px-4 py-2.5 text-gray-700 hover:text-emerald-600
                           focus:outline-none bg-white/80 rounded-lg hover:bg-emerald-50/80
                           transition-colors border border-emerald-100"
              >
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                <span>
                  {selectedMarket || 'Select Market'}, {selectedDistrict || 'Select District'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-emerald-50/80 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md border-b border-emerald-100">
          <div className="px-4 py-3 space-y-4">
            {/* Mobile search with suggestions */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search commodities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-emerald-100
                           focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white/80"
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />

              {showSearch && searchQuery && filteredCommodities.length > 0 && (
                <div className="absolute mt-1 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-emerald-100 max-h-96 overflow-y-auto">
                  {filteredCommodities.map((commodity) => (
                    <div
                      key={commodity.commodity_id}
                      className="flex items-center p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors"
                      onClick={() => {
                        setCommodityId(commodity.commodity_id);
                        onCommoditySelect?.(commodity,marketId);
                        setSearchQuery(commodity.commodity_name);
                        setShowSearch(false);
                      }}
                    >
                      <Image
                        src={getCommodityImage(commodity.commodity_name)}
                        alt={commodity.commodity_name}
                        className="w-12 h-12 rounded-lg object-cover"
                        width={48}
                        height={48}
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-gray-700 font-medium">
                          {commodity.commodity_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {commodity.modal_price
                            ? `₹${commodity.modal_price}`
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location button on mobile menu */}
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
      )}

      {/* Location Modal (centered) */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-md rounded-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Select Location</h2>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* State Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedDistrict('');
                      setSelectedMarket('');
                    }}
                    className="w-full p-2.5 border border-emerald-100 rounded-lg
                               bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose State --</option>
                    {statesList.map((st) => (
                      <option key={st.market_state} value={st.market_state}>
                        {st.market_state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedMarket('');
                    }}
                    className="w-full p-2.5 border border-emerald-100 rounded-lg
                               bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose District --</option>
                    {districtsList.map((dist) => (
                      <option key={dist.market_district} value={dist.market_district}>
                        {dist.market_district}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Market Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Market</label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full p-2.5 border border-emerald-100 rounded-lg
                               bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose Market --</option>
                    {marketsList.map((mObj) => (
                      <option key={mObj.market_id} value={mObj.market_name}>
                        {mObj.market_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600
                             text-white rounded-lg hover:from-emerald-600 hover:to-teal-700
                             transition-colors shadow-lg shadow-emerald-200"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;