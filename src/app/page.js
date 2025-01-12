"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "./_component/Hero";
import Navbar from "./_component/Navbar";
import { getMarketId, getMarketName } from "./_component/marketutils";
import TopMarkets from "./_component/TopMarkets";
import MarketMap from "./_component/MarketMap";
import { Chart } from "./_component/Chart";
import MLTable from "./_component/MLTable";
import { Top5Markets } from "./_component/Top5Markets";
import { Ticker } from "./_component/Ticker";
import CommodityComparison from "./_component/comparison";
export default function Home() {
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [priceDetails, setPriceDetails] = useState([]);
  const [error, setError] = useState(null);
  const [marketName, setMarketName] = useState(null);

  const [commodities, setCommodities] = useState([]);
  const [position, setPosition] = useState(0);

  // Example data fetching for commodities
  useEffect(() => {
    // Fetch commodities data here and set it
    // For example:
    setCommodities([
      { name: "Wheat", price: 2000, image: "/Wheat.jpeg" },
      { name: "Rice", price: 3000, image: "/Rice.jpeg" },
      // Add more commodities as needed
    ]);

    // Ticker animation effect
    const intervalId = setInterval(() => {
      setPosition((prev) => (prev <= -100 ? 0 : prev - 0.5));
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (selectedCommodity) {
      const marketId = getMarketId();
      const marketName = getMarketName();
      setMarketName(marketName);
      if (marketId) {
        fetchPriceDetails(marketId, selectedCommodity.commodity_id);
      } else {
        setError("Market ID not found for the selected commodity.");
      }
    }
  }, [selectedCommodity]);

  const handleCommoditySelect = (commodity) => {
    setSelectedCommodity(commodity);
    setError(null);
    setPriceDetails([]);
  };

  const fetchPriceDetails = async (marketId, commodityId) => {
    try {
      const response = await axios.post(
        "https://xnv320z0-8000.inc1.devtunnels.ms/api/get-price-details/",
        {
          market_id: marketId,
          commodity_id: commodityId,
        }
      );
      setPriceDetails(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to fetch price details.");
      setPriceDetails([]);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar onCommoditySelect={handleCommoditySelect} />
      <main className="container mx-auto px-4 py-8">
        {/* Hero and Top5Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6 h-full">
            {selectedCommodity ? (
              <Hero
                commodityName={selectedCommodity.commodity_name}
                variety={selectedCommodity.commodity_variety}
                priceDetails={priceDetails}
              />
            ) : (
              <p className="text-center mt-8 text-gray-600">
                Select a commodity to view details
              </p>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 h-full">
            {selectedCommodity ? (
              <Top5Markets
                marketName={marketName}
                commodityName={selectedCommodity.commodity_name}
                commodityId={selectedCommodity.commodity_id}
                variety={selectedCommodity.commodity_variety}
              />
            ) : (
              <p className="text-center mt-8 text-gray-600">
                Select a commodity to view details
              </p>
            )}
          </div>
        </div>
        {/* MarketMap and MLTable Grid */}
        <div className="w-full mb-8">
          <MarketMap />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5">
          <div className="w-full">
            {selectedCommodity ? (
              <MLTable commodityId={selectedCommodity.commodity_id} />
            ) : (
              <p className="text-center mt-8 text-gray-600">
                Select a commodity to view details
              </p>
            )}
          </div>
          <div>
            <CommodityComparison />
          </div>
        </div>
        <div className="mb-8">
          <Ticker commodities={commodities} position={position} />
        </div>
        {/* Chart Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {selectedCommodity ? (
            <Chart commodityId={selectedCommodity.commodity_id} />
          ) : (
            <p className="text-center mt-8 text-gray-600">
              Select a commodity to view details
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
