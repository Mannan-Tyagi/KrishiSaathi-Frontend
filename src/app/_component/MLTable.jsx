import React, { useState, useEffect } from "react";
import { TrendingUp, Calendar } from "lucide-react";
import Image from "next/image";
import { getMarketId } from "./marketutils";

const MLTable = ({ commodityId }) => {
  const [commodities, setCommodities] = useState([]);
  const [position, setPosition] = useState(0);
  const [marketId, setMarketId] = useState(getMarketId() || "defaultMarketId");

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/get-commodity/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ market_id: marketId }),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const formattedData = data.map((item) => ({
          name: item.commodity_name,
          price: parseFloat(item.modal_price),
          image: "/api/placeholder/32/32",
        }));

        setCommodities(formattedData);
      } catch (error) {
        console.error("Failed to fetch commodities:", error);
      }
    };

    fetchCommodities();

    const intervalId = setInterval(() => {
      setPosition((prevPosition) =>
        prevPosition <= -100 ? 0 : prevPosition - 0.5
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, [marketId]);

  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    const fetchForecastData = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/api/get-top6-forecast-price/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commodity_id: commodityId,
            market_id: marketId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedData = data.map((item) => ({
          week: `Week ${item.week}`,
          price: parseFloat(item.avg_modal_price),
          predictedPrice: parseFloat(item.avg_predicted_price),
        }));
        setForecastData(formattedData);
      } else {
        console.error("Failed to fetch forecast data:", response.statusText);
      }
    };

    fetchForecastData();
  }, [commodityId, marketId]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="max-w-4xl rounded-xl shadow-2xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <h2 className="text-3xl font-bold flex items-center">
            <TrendingUp className="mr-2" />
            Commodity Pricing Forecast
          </h2>
          <p className="mt-2 text-blue-100">
            Future commodity pricing based on advanced ML predictions
          </p>
        </div>
        <div className="p-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {forecastData.map((item, index) => (
              <div
                key={index}
                className="rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                <div className="bg-indigo-100 p-3">
                  <p className="font-medium text-indigo-800 flex items-center justify-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {item.week}
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                    <span className="text-green-500">₹</span>
                    {item.price.toFixed(2)}
                  </div>
                  <p className="mt-1 text-sm text-gray-600 text-center">
                    INR/100kg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{ transform: `translateX(${position}%)` }}
          >
            {[...commodities, ...commodities].map((commodity, index) => (
              <div key={index} className="inline-flex items-center mr-8">
                <Image
                  src={`/${commodity.name}.jpeg`}
                  alt={commodity.name}
                  className="w-8 h-8 mr-2 rounded-full"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-white">
                  {commodity.name}:
                </span>
                <span className="ml-2 text-yellow-200">
                  ₹{commodity.price.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLTable;
