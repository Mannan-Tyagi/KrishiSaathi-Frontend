"use client";

import React, { useEffect, useState } from "react";
import { Filter, RefreshCcw } from "lucide-react";
import Navbar from "./_component/Navbar";
import { StatsGrid } from "./_component/StatsGrid";
import { CommodityCard } from "./_component/CommodityCard";
import { TopMarketsCard } from "./_component/TopMarketsCard";
import { WeatherImpactCard } from "./_component/WeatherImpactCard";
import ForecastCard from "./_component/ForecastCard";
import { getCommodityId } from "./utils";
import PriceAnalytics from "./_component/PriceAnalytics";

function App() {
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [selectedMarketId, setSelectedMarketId] = useState(null);
  const [commodityData, setCommodityData] = useState(null);
  const [topMarketsData, setTopMarketsData] = useState([]);
  const [isLoadingCommodity, setIsLoadingCommodity] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [commodityError, setCommodityError] = useState(null);
  const [marketsError, setMarketsError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  // Fetch commodity data
  const fetchCommodityData = async (commodity, marketId) => {
    setIsLoadingCommodity(true);
    setCommodityError(null);
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/get-price-details/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          market_id: marketId, 
          commodity_id: commodity.commodity_id 
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch commodity data. Status: ${response.status}`);
      }
      
      const data = await response.json();
      setCommodityData(data[0]);
    } catch (error) {
      console.error("Error fetching commodity data:", error);
      console.log(commodity.id);
      setCommodityError(error.message);
    } finally {
      setIsLoadingCommodity(false);
    }
  };
  // Fetch top markets data
  const fetchTopMarketsData = async (commodity) => {
    if (!commodity?.commodity_id) {
      console.log('No commodity ID provided for fetching top markets');
      return;
    }
  
    setIsLoadingMarkets(true);
    setMarketsError(null);
    
    try {
      console.log('Fetching top markets for commodity:', commodity);
      const response = await fetch("http://127.0.0.1:8000/api/get-top6-market-prices/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          commodity_id: commodity.commodity_id
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch market data. Status: ${response.status}. Details: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Received top markets data:', data);
      setTopMarketsData(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
      setMarketsError(error.message);
    } finally {
      setIsLoadingMarkets(false);
    }
  };
  
  // Add these new state variables at the top of your App component
const [forecastData, setForecastData] = useState([]);
const [isLoadingForecast, setIsLoadingForecast] = useState(false);
const [forecastError, setForecastError] = useState(null);

// Add this new function to fetch forecast data
const fetchForecastData = async (commodity, marketId) => {
  if (!commodity?.commodity_id || !marketId) {
    console.log('Missing required data for forecast fetch');
    return;
  }

  setIsLoadingForecast(true);
  setForecastError(null);

  try {
    console.log('Fetching forecast data:', { commodity_id: commodity.commodity_id, market_id: marketId });
    const response = await fetch("http://127.0.0.1:8000/api/get-top6-forecast-price/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        market_id: marketId,
        commodity_id: commodity.commodity_id
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch forecast data. Status: ${response.status}. Details: ${errorText}`);
    }

    const data = await response.json();
    console.log('Received forecast data:', data);
    setForecastData(data);
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    setForecastError(error.message);
  } finally {
    setIsLoadingForecast(false);
  }
};

// Update the handleCommoditySelect function to include forecast data
const handleCommoditySelect = async (commodity, marketId) => {
  console.log("Selected Commodity:", commodity);
  setSelectedCommodity(commodity);
  setSelectedMarketId(marketId);
  setLastUpdated(new Date());

  // Clear existing data
  setCommodityData(null);
  setTopMarketsData([]);
  setForecastData([]);

  // Fetch all data
  try {
    await Promise.all([
      fetchCommodityData(commodity, marketId),
      fetchTopMarketsData(commodity),
      fetchForecastData(commodity, marketId)
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  // Function to format the time difference
  const getTimeDifference = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdated) / 1000 / 60);
    return `at 09:02 AM 1/15/2025`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar onCommoditySelect={handleCommoditySelect} />
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Food Commodity Market Intelligence Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Real-time insights and AI-powered predictions
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCcw className="w-4 h-4" />
              <span>Last updated: {getTimeDifference()}</span>
            </div>
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button> */}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6">
          <StatsGrid />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Commodity Card Section */}
          <div>
            {isLoadingCommodity && (
              <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-emerald-100">
                <div className="text-gray-500">Loading commodity data...</div>
              </div>
            )}
            
            {commodityError && (
              <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-red-100">
                <div className="text-red-500">{commodityError}</div>
              </div>
            )}
            
            {!isLoadingCommodity && !commodityError && commodityData && (
              <CommodityCard data={commodityData} />
            )}
            
            {!isLoadingCommodity && !commodityError && !commodityData && !selectedCommodity && (
              <div className="flex items-center justify-center h-64 bg-white rounded-xl border border-emerald-100">
                <div className="text-gray-500">Select a commodity to view details</div>
              </div>
            )}
          </div>

          {/* Market Trends */}
          <TopMarketsCard 
            data={topMarketsData}
            isLoading={isLoadingMarkets}
            error={marketsError}
            selectedCommodity={selectedCommodity}
          />
        </div>

        {/* Weather Impact */}
        <div className="mb-6">
          <WeatherImpactCard lastUpdated={lastUpdated} />
        </div>

        {/* Forecast Section */}
        <div>
        <ForecastCard 
    data={forecastData}
    isLoading={isLoadingForecast}
    error={forecastError}
    selectedCommodity={selectedCommodity}
  />
        <PriceAnalytics 
  selectedCommodity={selectedCommodity}
  selectedMarketId={selectedMarketId}
/>
        </div>
      </main>
    </div>
  );
}

export default App;