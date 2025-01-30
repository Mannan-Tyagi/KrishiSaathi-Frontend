import SearchableDropdown from './SearchableDropdown';

export const LocationModal = ({
  showLocationModal,
  setShowLocationModal,
  statesList,
  districtOptions,
  marketOptions,
  selectedState,
  selectedDistrict,
  selectedMarket,
  setSelectedState,
  setSelectedDistrict,
  setSelectedMarket
}) => (
  showLocationModal && (
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
            
<SearchableDropdown
  label="State"
  // Use the strings that were already mapped in the parent
  options={statesList}
  selected={selectedState}
  onSelect={(value) => {
    setSelectedState(value);
    setSelectedDistrict('');
    setSelectedMarket('');
  }}
/>

            <SearchableDropdown
              label="District"
              options={districtOptions}
              selected={selectedDistrict}
              onSelect={(value) => {
                setSelectedDistrict(value);
                setSelectedMarket('');
              }}
              disabled={!selectedState}
            />

            <SearchableDropdown
              label="Market"
              options={marketOptions}
              selected={selectedMarket}
              onSelect={setSelectedMarket}
              disabled={!selectedDistrict}
            />
          </div>

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
  )
);