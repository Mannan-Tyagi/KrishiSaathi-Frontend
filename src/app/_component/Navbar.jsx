import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sprout, Menu, ChevronDown, Bell, Settings, Share2, Download } from 'lucide-react';

// Keep the existing data structures from App.tsx
const commodities = [
    {
        name: 'Onion',
        image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=100&h=100',
        price: '₹25/kg',
        trend: 'up'
      },
      {
        name: 'Potato',
        image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=100&h=100',
        price: '₹20/kg',
        trend: 'down'
      },
      {
        name: 'Tomato',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=100&h=100',
        price: '₹40/kg',
        trend: 'up'
      },
      {
        name: 'Rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=100&h=100',
        price: '₹60/kg',
        trend: 'stable'
      },
      {
        name: 'Wheat',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=100&h=100',
        price: '₹30/kg',
        trend: 'down'
      }
  // ... other commodities
];

const states = {
  Gujarat: {
    Rajkot: ['Gondal', 'Rajkot Main', 'Jetpur'],
    Ahmedabad: ['Maninagar', 'Vasna', 'Jamalpur'],
    Surat: ['Ring Road', 'Varachha', 'Katargam']
  },
  Maharashtra: {
    Mumbai: ['Vashi', 'Dadar', 'Byculla'],
    Pune: ['Market Yard', 'Hadapsar', 'Kharadi'],
    Nagpur: ['Cotton Market', 'Itwari', 'Kalamna']
  },
  Karnataka: {
    Bangalore: ['KR Market', 'Yeshwanthpur', 'RMC Yard'],
    Mysore: ['Devaraja', 'Bandipalya', 'Santhepete'],
    Hubli: ['Amargol', 'Old Hubli', 'Dharwad']
  }
  // ... other states
};

function Navbar() {
  // State management from App.tsx
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedState, setSelectedState] = useState('Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState('Rajkot');
  const [selectedMarket, setSelectedMarket] = useState('Gondal');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Filter commodities based on search
  const filteredCommodities = commodities.filter(commodity =>
    commodity.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

            {/* Search and Location Section - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-3xl mx-8 gap-4">
              {/* Search Input with Glass Effect */}
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
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

                {/* Search Results Dropdown */}
                {showSearch && searchQuery && (
                  <div className="absolute mt-1 w-full bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-emerald-100 max-h-96 overflow-y-auto">
                    {filteredCommodities.map((commodity) => (
                      <div
                        key={commodity.name}
                        className="flex items-center p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors"
                        onClick={() => {
                          setSearchQuery(commodity.name);
                          setShowSearch(false);
                        }}
                      >
                        <img
                          src={commodity.image}
                          alt={commodity.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-gray-700 font-medium">{commodity.name}</div>
                          <div className="text-sm text-gray-500">{commodity.price}</div>
                        </div>
                        <div className={`text-sm ${commodity.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                          {commodity.trend === 'up' ? '↑' : '↓'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Selector */}
              <button
                onClick={() => setShowLocationModal(true)}
                className="flex items-center px-4 py-2.5 text-gray-700 hover:text-emerald-600 focus:outline-none bg-white/80 rounded-lg hover:bg-emerald-50/80 transition-colors border border-emerald-100"
              >
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                <span>{selectedMarket}, {selectedDistrict}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Action Buttons - Desktop */}
              <div className="hidden md:flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-emerald-50/80 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-emerald-50/80 transition-colors">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
              </div>

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
            </div>
            <button
              onClick={() => setShowLocationModal(true)}
              className="w-full flex items-center px-4 py-2.5 text-gray-700 bg-emerald-50/50 rounded-lg"
            >
              <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
              <span>{selectedMarket}, {selectedDistrict}</span>
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
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
              
              {/* Location Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* State Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full p-2.5 border border-emerald-100 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.keys(states).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* District Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">District</label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-2.5 border border-emerald-100 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {Object.keys(states[selectedState]).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>

                {/* Market Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Market</label>
                  <select
                    value={selectedMarket}
                    onChange={(e) => setSelectedMarket(e.target.value)}
                    className="w-full p-2.5 border border-emerald-100 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {states[selectedState][selectedDistrict].map(market => (
                      <option key={market} value={market}>{market}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Confirm Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-lg shadow-emerald-200"
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