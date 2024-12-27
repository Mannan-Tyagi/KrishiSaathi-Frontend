import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, MapPin, ChevronDown, X } from "lucide-react";
import Logo from "../../../public/logo.png";
import { setMarketId, setMarketName } from "./marketutils";

const Navbar = ({ onCommoditySelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCommodities, setFilteredCommodities] = useState([]); // Added filteredCommodities state
  const [selectedLocation, setSelectedLocation] = useState({
    state: "",
    district: "",
    market: "",
    marketId: null,
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [commodities, setCommodities] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [locationData, setLocationData] = useState({
    states: [],
    districts: {},
    markets: {},
  });

  // Fetch states when component mounts
  useEffect(() => {
    const fetchMarketStates = async () => {
      const response = await fetch("http://127.0.0.1:8000/api/get-market-states/");
      const data = await response.json();
      setLocationData((prev) => ({
        ...prev,
        states: data.map((item) => item.market_state),
      }));
    };

    fetchMarketStates();
  }, []);

  // Fetch districts when a state is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedLocation.state) {
        const response = await fetch("http://127.0.0.1:8000/api/get-market-districts/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ market_state: selectedLocation.state }),
        });
        const data = await response.json();
        setLocationData((prev) => ({
          ...prev,
          districts: {
            ...prev.districts,
            [selectedLocation.state]: data.map((item) => item.market_district),
          },
        }));
      }
    };

    fetchDistricts();
  }, [selectedLocation.state]);
  const handleLocationSelect = (type, value) => {
    setSelectedLocation((prev) => {
      const newLocation = { ...prev, [type]: value };
  
      if (type === "state") {
        newLocation.district = "";
        newLocation.market = "";
        newLocation.marketId = null; // Reset marketId when state is changed
      } else if (type === "district") {
        newLocation.market = "";
        newLocation.marketId = null; // Reset marketId when district is changed
      } else if (type === "market") {
        newLocation.market = value.name; // Set the selected market name
        newLocation.marketId = value.id;
        setMarketId(value.id);
        setMarketName(value.name) // Set the selected market id
      }
      
      return newLocation;
    });
  
    if (type === "market") {
      setIsLocationOpen(false);
    }
  };
  // Fetch markets when a district is selected
  useEffect(() => {
    const fetchMarkets = async () => {
      if (selectedLocation.district) {
        const response = await fetch("http://127.0.0.1:8000/api/get-markets/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ market_district: selectedLocation.district }),
        });
        const data = await response.json();
        setLocationData((prev) => ({
          ...prev,
          markets: {
            ...prev.markets,
            [selectedLocation.district]: data.map((item) => ({
              name: item.market_name,
              id: item.market_id, 
            })),
          },
        }));
      }
    };

    fetchMarkets();
  }, [selectedLocation.district]);

  // Fetch commodities when a market is selected
  useEffect(() => {
    const fetchCommodities = async () => {
      if (selectedLocation.marketId) {
        const response = await fetch("http://127.0.0.1:8000/api/get-commodity-details/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ market_id: selectedLocation.marketId }), 
        });
        const data = await response.json();
        setCommodities(data);
      }
    };

    fetchCommodities();
  }, [selectedLocation.marketId]);

  // Handle search term input and filter commodities
  const handleSearchTermChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term) {
      const filtered = commodities.filter((commodity) =>
        commodity.commodity_name.toLowerCase().includes(term)
      );
      setFilteredCommodities(filtered);
    } else {
      setFilteredCommodities([]);
    }
  };

  // Handle commodity selection
  const handleCommoditySelect = (commodity) => {
    onCommoditySelect(commodity);
    setSearchTerm("");
    setFilteredCommodities([]);
  };

  return (
    <nav className="sticky top-0 z-20 bg-white bg-opacity-40 shadow-md transition-all duration-300 ease-in-out backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Image
              src={Logo}
              alt="Krishi Saathi Logo"
              width={48}
              height={48}
              className="transition-transform duration-300 ease-in-out hover:scale-110"
            />
            <span className="ml-3 text-2xl font-bold text-green-700 hover:text-green-600 transition-colors duration-300">
              Krishi Saathi
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-lg w-full lg:max-w-xs relative">
              <input
                type="text"
                placeholder="Search for commodities..."
                value={searchTerm}
                onChange={handleSearchTermChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="block w-full pl-12 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white bg-opacity-90 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm transition-all duration-300 ease-in-out"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              {isSearchFocused && filteredCommodities.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                  {filteredCommodities.map((commodity) => (
                    <div
                      key={commodity.id}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-green-50 flex items-center"
                      onClick={() => handleCommoditySelect(commodity)}
                    >
                      <Image
                        src={`/${commodity.commodity_name}.jpeg`}
                        alt={commodity.commodity_name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <span className="font-medium block truncate">
                          {commodity.commodity_name}
                        </span>
                        <span className="text-gray-500 block text-sm">
                          {commodity.commodity_variety} - Grade {commodity.commodity_grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="ml-4 flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center text-base font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
              >
                <MapPin className="mr-1 h-6 w-6 text-gray-400" />
                <span className="hidden md:inline">
                  {selectedLocation.market ||
                    selectedLocation.district ||
                    selectedLocation.state ||
                    "Select Location"}
                </span>
                <span className="ml-1">
                  <ChevronDown className={`h-5 w-5 ${isLocationOpen ? "rotate-180" : ""} transition-transform duration-300`} />
                </span>
              </button>
              {isLocationOpen && (
                <div className="absolute right-0 mt-2 w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                  <div className="p-4">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <select
                        value={selectedLocation.state}
                        onChange={(e) => handleLocationSelect("state", e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                      >
                        <option value="">Select a state</option>
                        {locationData.states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedLocation.state && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">District</label>
                        <select
                          value={selectedLocation.district}
                          onChange={(e) => handleLocationSelect("district", e.target.value)}
                          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                        >
                          <option value="">Select a district</option>
                          {(locationData.districts[selectedLocation.state] || []).map(
                            (district) => (
                              <option key={district} value={district}>
                                {district}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    )}
                    {selectedLocation.district && (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">Market</label>
    <select
      value={selectedLocation.marketId || ""}
      onChange={(e) => {
        const selectedMarketId = parseInt(e.target.value, 10); // Get the selected market id
        const selectedMarket = locationData.markets[selectedLocation.district].find(
          (m) => m.id === selectedMarketId // Find the selected market by its id
        );
        handleLocationSelect("market", selectedMarket); // Pass the selected market object
      }}
      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
    >
      <option value="">Select a market</option>
      {locationData.markets[selectedLocation.district]?.map((market) => (
        <option key={market.id} value={market.id}>
          {market.name} {/* Display the market name */}
        </option>
      ))}
    </select>
  </div>
)}

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
