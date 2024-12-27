"use client";
import React, { useState } from "react";
import axios from "axios";
import Hero from "./_component/Hero";
import Navbar from "./_component/Navbar";
import { getMarketId, getMarketName } from "./_component/marketutils";
import TopMarkets from "./_component/TopMarkets";
import MarketMap from "./_component/MarketMap";
import { Chart } from "./_component/Chart";
import MLTable from "./_component/MLTable";
import { Component, Top5Markets } from "./_component/Top5Markets";

export default function Home() {
  const [selectedCommodity, setSelectedCommodity] = useState(null);
  const [priceDetails, setPriceDetails] = useState([]);
  const [error, setError] = useState(null);
  const [marketName, setMarketName] = useState(null);

  const handleCommoditySelect = (commodity) => {
    setSelectedCommodity(commodity);
    console.log("Selected commodity:", commodity);

    const marketId = getMarketId();
    const marketName = getMarketName();
    setMarketName(marketName);
    console.log("Market ID from utils:", marketId);

    if (marketId) {
      fetchPriceDetails(marketId, commodity.commodity_id);
    } else {
      setError("Market ID not found for the selected commodity.");
    }
  };

  const fetchPriceDetails = async (marketId, commodityId) => {
    try {
      console.log("Sending request with:", { marketId, commodityId });

      const response = await axios.post(
        "http://127.0.0.1:8000/api/get-price-details/",
        {
          market_id: marketId,
          commodity_id: commodityId,
        }
      );

      console.log("Received response:", response.data);
      setPriceDetails(response.data);
      setError(null);
    } catch (err) {
      console.error("Error:", err);
      console.log("Response data:", err.response?.data);
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

    {/* MLTable and MarketMap Container */}
    <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 w-full">
          {selectedCommodity ? (
            <MLTable commodityId={selectedCommodity.commodity_id} />
          ) : (
            <p className="text-center mt-8 text-gray-600">
              Select a commodity to view details
            </p>
          )}
        </div>
        <div className="lg:w-1/2 w-full">
          <MarketMap />
        </div>
      </div>
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