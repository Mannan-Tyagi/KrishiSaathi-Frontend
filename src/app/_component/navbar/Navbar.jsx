import React, { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Menu, ChevronDown } from 'lucide-react';
import { BASE_BACKEND_URL } from '@/app/utils';
import { Logo } from './components/Logo';
import { SearchResults } from './components/SearchResults';
import { MobileMenu } from './components/MobileMenu';
import { LocationModal } from './components/LocationModal';
import SearchableDropdown from './components/SearchableDropdown';

const useLocationData = (selectedState, selectedDistrict) => {
  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);
  const [marketsList, setMarketsList] = useState([]);

  // Fetch all states
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-market-states/`);
        const data = await response.json();
        console.log('States response data:', data); // ← Check here
        setStatesList(data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    };
    fetchStates();
  }, []);

  // Fetch districts when selectedState changes
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!selectedState) {
        setDistrictsList([]);
        return;
      }
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-market-districts/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market_state: selectedState }),
        });
        const data = await response.json();
        console.log('Districts response data:', data); // ← Check here
        setDistrictsList(data);
      } catch (error) {
        console.error('Error fetching districts:', error);
      }
    };
    fetchDistricts();
  }, [selectedState]);

  // Fetch markets when selectedDistrict changes
  useEffect(() => {
    const fetchMarkets = async () => {
      if (!selectedDistrict) {
        setMarketsList([]);
        return;
      }
      try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/get-markets/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ market_district: selectedDistrict }),
        });
        const data = await response.json();
        console.log('Markets response data:', data); // ← Check here
        setMarketsList(data);
      } catch (error) {
        console.error('Error fetching markets:', error);
      }
    };
    fetchMarkets();
  }, [selectedDistrict]);

  return { statesList, districtsList, marketsList };
};

const Navbar = ({ onCommoditySelect }) => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [marketId, setMarketId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [commoditiesList, setCommoditiesList] = useState([]);

  const { statesList, districtsList, marketsList } = useLocationData(selectedState, selectedDistrict);

  // In your Navbar component
const districtOptions = useMemo(() => 
  districtsList
    .map(dist => dist?.market_district)
    .filter(Boolean), // Remove any undefined/null values
  [districtsList]
);

const marketOptions = useMemo(() => 
  marketsList
    .map(mkt => mkt?.market_name)
    .filter(Boolean), // Remove any undefined/null values
  [marketsList]
);

  // Fetch commodities when market is selected
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
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setCommoditiesList(sortedData);
        setMarketId(marketObj.market_id);
      } catch (error) {
        console.error('Error fetching commodities:', error);
      }
    };
    fetchCommodities();
  }, [selectedMarket, marketsList]);

  // Filter commodities based on search
  const filteredCommodities = useMemo(
    () => commoditiesList.filter(commodity =>
      commodity.commodity_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [commoditiesList, searchQuery]
  );

  const getCommodityImage = (commodityName) => `/${commodityName}.jpeg`;

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />

            {/* Desktop Search */}
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
                    className="w-full px-4 py-2.5 rounded-lg border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                  <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                </div>

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
            </div>

            {/* Location Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLocationModal(true)}
                className="hidden md:flex items-center px-4 py-2.5 text-gray-700 hover:text-emerald-600 focus:outline-none bg-white/80 rounded-lg hover:bg-emerald-50/80 transition-colors border border-emerald-100"
              >
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                <span>
                  {selectedMarket || 'Select Market'}, {selectedDistrict || 'Select District'}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>

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

      <MobileMenu
  isOpen={isMobileMenuOpen}
  searchQuery={searchQuery}
  showSearch={showSearch}             // Add this line
  setSearchQuery={setSearchQuery}
  setShowSearch={setShowSearch}
  filteredCommodities={filteredCommodities}
  onCommoditySelect={onCommoditySelect}
  getCommodityImage={getCommodityImage}
  setShowLocationModal={setShowLocationModal}
  selectedMarket={selectedMarket}
  selectedDistrict={selectedDistrict}
  marketId={marketId}
/>

<LocationModal
  showLocationModal={showLocationModal}
  setShowLocationModal={setShowLocationModal}
  // Map statesList into strings here and pass the final array
  statesList={statesList.map(st => st.market_state)}
  districtOptions={districtOptions}
  marketOptions={marketOptions}
  selectedState={selectedState}
  selectedDistrict={selectedDistrict}
  selectedMarket={selectedMarket}
  setSelectedState={setSelectedState}
  setSelectedDistrict={setSelectedDistrict}
  setSelectedMarket={setSelectedMarket}
/>
    </>
  );
};

export default Navbar;