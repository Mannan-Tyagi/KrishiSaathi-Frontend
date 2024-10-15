import React, { useState, useEffect } from "react";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import Image from "next/image";

const MLTable = () => {
  const forecastData = [
    { date: "Aug 27", Price: 8900.3 },
    { date: "Aug 28", Price: 5000.9 },
    { date: "Aug 29", Price: 1200.29 },
    { date: "Aug 30", Price: 6800.89 },
    { date: "Aug 31", Price: 4785.41 },
    { date: "Sep 1", Price: 4785.41 },
  ];

  const commodities = [
    { name: "Gold", price: 1890.5, image: "/api/placeholder/32/32" },
    { name: "Silver", price: 23.75, image: "/api/placeholder/32/32" },
    { name: "Crude Oil", price: 75.2, image: "/api/placeholder/32/32" },
    { name: "Wheat", price: 650.25, image: "/api/placeholder/32/32" },
    { name: "Coffee", price: 185.3, image: "/api/placeholder/32/32" },
  ];

  const [position, setPosition] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition((prevPosition) =>
        prevPosition <= -100 ? 0 : prevPosition - 0.5
      );
    }, 50);

    return () => clearInterval(intervalId);
  }, []);

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
                    {item.date}
                  </p>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-500 mr-1" />
                    {item.Price.toFixed(2)}
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
                  src={commodity.image}
                  alt={commodity.name}
                  className="w-8 h-8 mr-2 rounded-full"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-white">
                  {commodity.name}:
                </span>
                <span className="ml-2 text-yellow-200">
                  ${commodity.price.toFixed(2)}
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
