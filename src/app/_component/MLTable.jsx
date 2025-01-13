import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TrendingUp,
  Calendar,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  ArrowRight,
} from "lucide-react";
import { getMarketId } from "./marketutils";

const API_BASE_URL = "https://xnv320z0-8000.inc1.devtunnels.ms/api";

export function MLTable({ commodityId }) {
  const [commodities, setCommodities] = useState([]);
  const [marketId, setMarketId] = useState(getMarketId() || "defaultMarketId");
  const [forecastData, setForecastData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForecastData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/get-top6-forecast-price/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commodity_id: commodityId,
          market_id: marketId,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setForecastData(
        data.map((item, index, arr) => {
          const price = parseFloat(item.avg_modal_price);
          const prevPrice =
            index > 0 ? parseFloat(arr[index - 1].avg_modal_price) : price;
          return {
            week: `Week ${item.week}`,
            price,
            predictedPrice: parseFloat(item.avg_predicted_price),
            percentageChange:
              index === 0 ? 0 : ((price - prevPrice) / prevPrice) * 100,
          };
        })
      );
    } catch (error) {
      setError("Failed to fetch forecast data. Please try again later.");
      console.error("Failed to fetch forecast data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [commodityId, marketId]);

  useEffect(() => {
    fetchForecastData();
  }, [fetchForecastData]);

  const formatPrice = useMemo(
    () => (price) =>
      `₹${price.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    []
  );

  if (error) {
    return (
      <div className="flex items-center justify-center p-6 bg-red-50/80 rounded-lg border border-red-200">
        <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full gap-8 p-4">
      {/* Header Section with Gradient */}
      <div className="w-full max-w-4xl rounded-xl shadow-lg overflow-hidden bg-[#FEF3C7] border border-[#93C5FD]">
        <div className="bg-gradient-to-r from-[#A78BFA] to-[#93C5FD] text-white p-8 relative">
          <h2 className="text-3xl font-bold flex items-center gap-3 mb-3">
            <TrendingUp className="w-8 h-8" />
            Commodity Pricing Forecast
          </h2>
          <p className="text-lg text-white/80">
            Future commodity pricing based on advanced ML predictions
          </p>
        </div>

        {/* Forecast Data */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#93C5FD] border-t-[#A78BFA]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {forecastData.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-white shadow-md border border-[#93C5FD] p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="bg-gradient-to-r from-[#A78BFA] to-[#F472B6] p-4 rounded-lg">
                    <p className="font-semibold text-white flex items-center justify-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {item.week}
                    </p>
                  </div>
                  <div className="text-center mt-4">
                    <div className="text-2xl font-bold text-[#374151]">
                      {formatPrice(item.price)}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">INR / 100kg</p>
                    {item.percentageChange !== undefined && (
                      <div
                        className={`mt-3 flex items-center justify-center gap-1 text-sm font-medium ${
                          item.percentageChange > 0
                            ? "text-emerald-600"
                            : item.percentageChange < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {item.percentageChange > 0 ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : item.percentageChange < 0 ? (
                          <ArrowDown className="w-4 h-4" />
                        ) : (
                          <ArrowRight className="w-4 h-4" />
                        )}
                        {Math.abs(item.percentageChange).toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Primary Button */}
      <button className="px-6 py-3 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg shadow-md">
        View Full Report
      </button>
    </div>
  );
}

export default MLTable;
