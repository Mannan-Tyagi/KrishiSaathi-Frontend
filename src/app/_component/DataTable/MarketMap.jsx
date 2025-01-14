"use client";

import { useEffect, useState, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Market data with state grouping
const marketData = [
  { id: 1, name: "Chittoor", latitude: 13.160105, longitude: 79.155551 },
  { id: 2, name: "Palamaner", latitude: 13.151597, longitude: 78.735667 },
  { id: 3, name: "Punganur", latitude: 13.405603, longitude: 78.558084 },
  { id: 4, name: "Vayalapadu", latitude: 13.636911, longitude: 78.628499 },
  { id: 5, name: "Ambajipeta", latitude: 16.605932, longitude: 81.944182 },
  { id: 6, name: "Tanuku", latitude: 16.75414, longitude: 81.685839 },
  { id: 7, name: "Aarah", latitude: 4.2299428, longitude: 73.49431423 },
  { id: 8, name: "Gaya", latitude: 24.7964355, longitude: 85.0079563 },
  { id: 9, name: "Balod", latitude: 25.3579684, longitude: 76.0918021 },
  { id: 10, name: "Balodabazar", latitude: 21.6564735, longitude: 82.1605962 },
  { id: 11, name: "Bhatapara", latitude: 22.8571157, longitude: 88.3971976 },
  { id: 12, name: "Kasdol", latitude: 21.6193745, longitude: 82.4270994 },
  { id: 13, name: "Ramanujganj", latitude: 23.806378, longitude: 83.6998108 },
  { id: 14, name: "Bastar", latitude: 19.25, longitude: 81.25 },
  { id: 15, name: "Devda", latitude: 22.3572654, longitude: 74.82791379 },
  { id: 16, name: "Jagdalpur", latitude: 19.0870758, longitude: 82.0235715 },
  { id: 17, name: "Jaitgiri", latitude: 19.3167319, longitude: 82.1351853 },
  { id: 18, name: "Karpawand", latitude: 19.3656888, longitude: 82.0874619 },
  { id: 19, name: "Lohandiguda", latitude: 19.1653061, longitude: 81.7433345 },
  { id: 20, name: "Tokapal", latitude: 19.0111236, longitude: 81.8903303 },
  //{ id: 21, name: "Saja", latitude: 31.3016935, longitude: 120.5810725 },
  { id: 22, name: "Bilaspur", latitude: 28.868311, longitude: 79.29807497 },
  // {
  //   id: 23,
  //   name: "Munguli",
  //   city: "Mungeli",
  //   state: "Chattisgarh",
  //   latitude: -1.0553369,
  //   longitude: 29.1459308,
  // },
  {
    id: 24,
    name: "Narayanpur",
    city: "Narayanpur",
    state: "Chattisgarh",
    latitude: 25.36679325,
    longitude: 86.87262364,
  },
  {
    id: 25,
    name: "Gharghoda",
    city: "Raigarh",
    state: "Chattisgarh",
    latitude: 22.1674127,
    longitude: 83.3485457,
  },
  {
    id: 26,
    name: "Raigarh",
    city: "Raigarh",
    state: "Chattisgarh",
    latitude: 22.5,
    longitude: 83.5,
  },
  {
    id: 27,
    name: "Arang",
    city: "Raipur",
    state: "Chattisgarh",
    latitude: 25.0493108,
    longitude: 92.6634014,
  },
  {
    id: 28,
    name: "Navapara",
    city: "Raipur",
    state: "Chattisgarh",
    latitude: 21.21080945,
    longitude: 73.96326276,
  },
  {
    id: 29,
    name: "Neora",
    city: "Raipur",
    state: "Chattisgarh",
    latitude: 25.5750487,
    longitude: 84.986958,
  },
  {
    id: 30,
    name: "Raipur",
    city: "Raipur",
    state: "Chattisgarh",
    latitude: 21.2380912,
    longitude: 81.6336993,
  },
  {
    id: 31,
    name: "Dongargaon",
    city: "Rajnandgaon",
    state: "Chattisgarh",
    latitude: 21.1627819,
    longitude: 80.0003209,
  },
  {
    id: 32,
    name: "Dongargarh",
    city: "Rajnandgaon",
    state: "Chattisgarh",
    latitude: 21.1884868,
    longitude: 80.7560121,
  },
  {
    id: 33,
    name: "Gandai",
    city: "Rajnandgaon",
    state: "Chattisgarh",
    latitude: 21.6688285,
    longitude: 81.1006134,
  },
  {
    id: 34,
    name: "Rajnandgaon",
    city: "Rajnandgaon",
    state: "Chattisgarh",
    latitude: 21.166667,
    longitude: 81,
  },
  {
    id: 35,
    name: "Konta",
    city: "Sukma",
    state: "Chattisgarh",
    latitude: 23.49975665,
    longitude: 76.44436861,
  },
  {
    id: 36,
    name: "Sukma",
    city: "Sukma",
    state: "Chattisgarh",
    latitude: 18.3932222,
    longitude: 81.6569457,
  },
  {
    id: 37,
    name: "Surajpur",
    city: "Surajpur",
    state: "Chattisgarh",
    latitude: 23.212528,
    longitude: 82.8667246,
  },
  {
    id: 38,
    name: "Mapusa",
    city: "North Goa",
    state: "Goa",
    latitude: 15.5926511,
    longitude: 73.8119741,
  },
  {
    id: 39,
    name: "Pernem",
    city: "North Goa",
    state: "Goa",
    latitude: 15.7089964,
    longitude: 73.8167602,
  },
  {
    id: 40,
    name: "Ahmedabad",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0216238,
    longitude: 72.5797068,
  },
  {
    id: 41,
    name: "Bavla",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 28.1372048,
    longitude: 74.9140763,
  },
  {
    id: 42,
    name: "Amreli",
    city: "Amreli",
    state: "Gujarat",
    latitude: 20.866667,
    longitude: 70.75,
  },
  {
    id: 43,
    name: "Babra",
    city: "Amreli",
    state: "Gujarat",
    latitude: 21.8485451,
    longitude: 71.3036656,
  },
  {
    id: 44,
    name: "Bagasara",
    city: "Amreli",
    state: "Gujarat",
    latitude: 21.49682465,
    longitude: 70.90483233,
  },
  {
    id: 45,
    name: "Damnagar",
    city: "Amreli",
    state: "Gujarat",
    latitude: 22.1453429,
    longitude: 69.3467448,
  },
  {
    id: 46,
    name: "Dhari",
    city: "Amreli",
    state: "Gujarat",
    latitude: 29.31669745,
    longitude: 79.72881578,
  },
  {
    id: 47,
    name: "Khambha",
    city: "Amreli",
    state: "Gujarat",
    latitude: 21.1410665,
    longitude: 71.2537125,
  },
  {
    id: 48,
    name: "Rajula",
    city: "Amreli",
    state: "Gujarat",
    latitude: 21.038617,
    longitude: 71.4438845,
  },
  {
    id: 49,
    name: "Savarkundla",
    city: "Amreli",
    state: "Gujarat",
    latitude: 21.3394524,
    longitude: 71.3082758,
  },
  {
    id: 50,
    name: "Umreth",
    city: "Anand",
    state: "Gujarat",
    latitude: 22.6990518,
    longitude: 73.115045,
  },
  {
    id: 51,
    name: "Deesa",
    city: "Banaskanth",
    state: "Gujarat",
    latitude: 24.2594977,
    longitude: 72.1803348,
  },
  {
    id: 52,
    name: "Dhanera",
    city: "Banaskanth",
    state: "Gujarat",
    latitude: 23.92538685,
    longitude: 81.25904378,
  },
  {
    id: 53,
    name: "Lakhani",
    city: "Banaskanth",
    state: "Gujarat",
    latitude: 23.7032553,
    longitude: 79.65215282,
  },
  {
    id: 54,
    name: "Palanpur",
    city: "Banaskanth",
    state: "Gujarat",
    latitude: 24.1709794,
    longitude: 72.4366375,
  },
  {
    id: 55,
    name: "Thara",
    city: "Banaskanth",
    state: "Gujarat",
    latitude: 24.9016247,
    longitude: 79.65084267,
  },
  { id: 56, name: "Vadgam", latitude: 22.57665535, longitude: 74.27593994 },
  { id: 57, name: "Ankleshwar", latitude: 21.6293206, longitude: 72.9945103 },
  { id: 58, name: "Jambusar", latitude: 22.0514367, longitude: 72.8069758 },
  { id: 59, name: "Bhavnagar", latitude: 21.7718836, longitude: 72.1416449 },
  {
    id: 60,
    name: "Mahuva(Station Road)",
    latitude: 21.0923909,
    longitude: 71.7675484,
  },
  { id: 61, name: "Botad", latitude: 22.1686, longitude: 71.6685 },
  // { id: 62, name: "Hadad", latitude: 47.4025956, longitude: 23.0250179 },
  { id: 63, name: "Kalediya", latitude: 22.0690948, longitude: 73.7115429 },
  { id: 64, name: "Dahod", latitude: 22.8358786, longitude: 74.2556823 },
  { id: 65, name: "Limkheda", latitude: 19.8551662, longitude: 76.4396953 },
  { id: 66, name: "Dehgam", latitude: 23.16403255, longitude: 72.88183192 },
  { id: 67, name: "Kalol", latitude: 22.6103179, longitude: 73.4617061 },
  // { id: 68, name: "Mansa", latitude: -11.2006743, longitude: 28.8893922 },
  { id: 69, name: "Kodinar", latitude: 20.795759, longitude: 70.7045453 },
  { id: 70, name: "Dhrol", latitude: 22.5675674, longitude: 70.4164394 },
  { id: 71, name: "Mangrol", latitude: 26.2482157, longitude: 77.35356339 },
  { id: 72, name: "Visavadar", latitude: 21.3417058, longitude: 70.7534299 },
  { id: 73, name: "Rapar", latitude: 23.57215, longitude: 70.6465877 },
  { id: 74, name: "Kapadvanj", latitude: 23.0232402, longitude: 73.0727531 },
  // { id: 75, name: "Kadi", latitude: 7.2931208, longitude: 80.6350358 },
  { id: 76, name: "Mehsana", latitude: 23.6015557, longitude: 72.3867981 },
  { id: 77, name: "Unjha", latitude: 23.7968484, longitude: 72.3818955 },
  { id: 78, name: "Visnagar", latitude: 23.7036823, longitude: 72.5404601 },
  { id: 79, name: "Halvad", latitude: 23.0182418, longitude: 71.1833818 },
  { id: 80, name: "Morbi", latitude: 22.8176662, longitude: 70.8345928 },
  { id: 81, name: "Bilimora", latitude: 20.7671693, longitude: 72.9693451 },
  { id: 82, name: "Godhra", latitude: 22.7785001, longitude: 73.6245157 },
  { id: 83, name: "Patan", latitude: 17.3565267, longitude: 73.86342072 },
  { id: 84, name: "Siddhpur", latitude: 23.918279, longitude: 72.3681846 },
  { id: 85, name: "Porbandar", latitude: 21.6409, longitude: 69.611 },
  { id: 86, name: "Dhoraji", latitude: 21.734812, longitude: 70.4491538 },
  { id: 87, name: "Jasdan", latitude: 22.0399, longitude: 71.2046 },
  { id: 88, name: "Rajkot", latitude: 22.3053263, longitude: 70.8028377 },
  { id: 89, name: "Dhansura", latitude: 23.3467, longitude: 73.2054 },
  { id: 90, name: "Himatnagar", latitude: 23.5971246, longitude: 72.9588273 },
  { id: 91, name: "Khedbrahma", latitude: 24.0310837, longitude: 73.0484016 },
  { id: 92, name: "Modasa", latitude: 23.4634245, longitude: 73.2990631 },
  { id: 93, name: "Talod", latitude: 23.018122, longitude: 76.41674432 },
  { id: 94, name: "Mandvi", latitude: 22.8314482, longitude: 69.35081 },
  // { id: 95, name: "Surat", latitude: 45.9383, longitude: 3.2553 },
  { id: 96, name: "Chotila", latitude: 25.8719283, longitude: 73.1822061 },
  { id: 97, name: "Ahwa-Dang", latitude: 20.7587262, longitude: 73.6873533 },
  { id: 98, name: "Padra", latitude: 25.09783285, longitude: 78.2705947 },
  {
    id: 99,
    name: "Ambala Cantt.",
    latitude: 30.3663493,
    longitude: 76.82004831,
  },
  { id: 100, name: "Barara", latitude: 30.2423627, longitude: 77.04605188 },
  {
    id: 101,
    name: "Naraingarh",
    latitude: 30.44557605,
    longitude: 77.12563182,
  },
  { id: 102, name: "Shahzadpur", latitude: 30.4559063, longitude: 76.9983236 },
  { id: 103, name: "Bhiwani", latitude: 28.7931703, longitude: 76.1391283 },
  { id: 104, name: "Siwani", latitude: 28.8241239, longitude: 75.5956446 },
  { id: 105, name: "Ballabhgarh", latitude: 28.340002, longitude: 77.3164509 },
  { id: 106, name: "Faridabad", latitude: 28.4031478, longitude: 77.3105561 },
  {
    id: 107,
    name: "Bhattu Kalan",
    latitude: 29.3875946,
    longitude: 75.3418112,
  },
  { id: 108, name: "Jakhal", latitude: 29.74660585, longitude: 75.74819505 },
  {
    id: 109,
    name: "Farukh Nagar",
    latitude: 28.4474356,
    longitude: 76.8262064,
  },
  { id: 110, name: "Gurgaon", latitude: 28.4646148, longitude: 77.0299194 },
  { id: 111, name: "Pataudi", latitude: 28.30147985, longitude: 76.75007013 },
  { id: 112, name: "Sohna", latitude: 28.3241636, longitude: 77.08486438 },
  {
    id: 113,
    name: "Barwala(Hisar)",
    latitude: 29.350185,
    longitude: 75.93817117,
  },
  { id: 114, name: "Hansi", latitude: 29.1352917, longitude: 75.97647564 },
  { id: 115, name: "Jhajjar", latitude: 28.53364155, longitude: 76.68981478 },
  { id: 116, name: "Jind", latitude: 29.30219685, longitude: 76.33894452 },
  { id: 117, name: "Uchana", latitude: 29.4884284, longitude: 76.1481213 },
  { id: 118, name: "Cheeka", latitude: 30.048095, longitude: 76.3338623 },
  { id: 119, name: "Dhand", latitude: 25.39802585, longitude: 78.3188856 },
  { id: 120, name: "Siwan", latitude: 26.2632466, longitude: 84.32254962 },
  { id: 121, name: "Asandh", latitude: 29.5212674, longitude: 76.603457 },
  { id: 122, name: "Gharaunda", latitude: 29.5394114, longitude: 76.93889369 },
  { id: 123, name: "Tarori", latitude: 47.03121, longitude: -122.85022 },
  { id: 124, name: "Babain", latitude: 30.08749505, longitude: 76.99026887 },
  { id: 125, name: "Ladwa", latitude: 30.0346232, longitude: 77.0485926 },
  { id: 126, name: "Pehowa", latitude: 29.99888435, longitude: 76.55827733 },
  { id: 127, name: "Pipli", latitude: 32.6776447, longitude: 73.3652222 },
  { id: 128, name: "Shahabad", latitude: 27.5994338, longitude: 80.03260244 },
  { id: 129, name: "Narnaul", latitude: 27.9981957, longitude: 76.07674276 },
  { id: 130, name: "Nuh", latitude: 28.09742915, longitude: 77.0515944 },
  { id: 131, name: "Hassanpur", latitude: 28.0173749, longitude: 77.45120036 },
  { id: 132, name: "Hodal", latitude: 27.9785769, longitude: 77.3436017 },
  { id: 133, name: "Barwala", latitude: 30.6179342, longitude: 76.97873825 },
  { id: 134, name: "Madlauda", latitude: 29.4022237, longitude: 76.8032637 },
  { id: 135, name: "Panipat", latitude: 29.3912753, longitude: 76.9771675 },
  { id: 136, name: "Samalkha", latitude: 29.230736, longitude: 77.0019919 },
  // Add more market data as needed
];

// Group markets by state
const groupedMarkets = marketData.reduce((acc, market) => {
  const state = market.state || "Other";
  if (!acc[state]) acc[state] = [];
  acc[state].push(market);
  return acc;
}, {});

// Custom marker icon configuration with different colors per state
const stateColors = {
  "Andhra Pradesh": "#4F46E5",
  Gujarat: "#7C3AED",
  Chattisgarh: "#EC4899",
  Goa: "#10B981",
  Other: "#6366F1",
};

const createCustomIcon = (color = "#4F46E5") =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
    <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48C16 48 32 28 32 16C32 7.16 24.84 0 16 0ZM16 22C12.68 22 10 19.32 10 16C10 12.68 12.68 10 16 10C19.32 10 22 12.68 22 16C22 19.32 19.32 22 16 22Z" fill="${color}"/>
    </svg>
  `)}`,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  });

const MarketMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState("All");
  const defaultCenter = [20.5937, 78.9629]; // Center of India

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Memoize filtered markets
  const filteredMarkets = useMemo(() => {
    if (selectedState === "All") return marketData;
    return marketData.filter((market) => market.state === selectedState);
  }, [selectedState]);

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-indigo-900 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Market Locations
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/10 text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="All">All States</option>
                {Object.keys(groupedMarkets)
                  .sort()
                  .map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
              </select>
              <div className="text-white/90 text-sm">
                Showing {filteredMarkets.length} markets
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <MapContainer
            center={userLocation || defaultCenter}
            zoom={userLocation ? 8 : 5}
            className="h-[600px] w-full rounded-lg shadow-inner"
            style={{ background: "#f8fafc" }}
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {userLocation && (
              <Marker
                position={userLocation}
                icon={createCustomIcon("#2563EB")}
              >
                <Popup className="bg-white/90 backdrop-blur-sm">
                  <div className="text-sm font-medium text-gray-900">
                    Your Location
                  </div>
                </Popup>
              </Marker>
            )}

            {filteredMarkets.map((market) => (
              <Marker
                key={market.id}
                position={[market.latitude, market.longitude]}
                icon={createCustomIcon(stateColors[market.state || "Other"])}
              >
                <Popup className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
                  <div className="p-2">
                    <h3 className="font-semibold text-gray-900">
                      {market.name}
                    </h3>
                    {market.state && (
                      <p className="text-xs text-gray-500 mt-1">
                        {market.state}
                      </p>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Latitude: {market.latitude.toFixed(4)}°</p>
                      <p>Longitude: {market.longitude.toFixed(4)}°</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 bg-white rounded-xl shadow-lg">
        {Object.entries(stateColors).map(([state, color]) => (
          <div key={state} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            ></div>
            <span className="text-gray-700">{state}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketMap;
