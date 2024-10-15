"use client";
import React, { useState } from "react";
import Hero from "./_component/Hero";
import Navbar from "./_component/Navbar";
import TopMarkets from "./_component/TopMarkets";
import MarketMap from "./_component/MarketMap";
import { ContainerWithChildren } from "postcss/lib/container";
import { Chart } from "./_component/Chart";
import MLTable from "./_component/MLTable";
import { Component } from "./_component/BarchartMarketPrices.";

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
      />

      {/* <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            {selectedCommodityData ? (
              <Hero
                commodityName={selectedCommodityData.Commodity}
                variety={selectedCommodityData.Variety}
                lastUpdate={selectedCommodityData.Arrival_Date}
                price={selectedCommodityData.Modal_Price}
                unit="Quintal"
              />
            ) : (
              <p className="text-center text-gray-500">
                Select a commodity to view details
              </p>
            )}
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            {topMarkets.length > 0 ? (
              <Component
                title={`Top 5 Markets for ${
                  selectedCommodityData?.Commodity || "Commodity"
                }`}
                markets={topMarkets}
                priceLabel="Price"
              />
            ) : (
              <p className="text-center text-gray-500">
                No top markets data available
              </p>
            )}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <MarketMap />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <MLTable />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <Chart />
        </div>
      </main> */}
    </div>
  );
}