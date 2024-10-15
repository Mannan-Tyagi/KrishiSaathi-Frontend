import React from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown, Calendar, Package } from "lucide-react";

const Hero = ({
  commodityName,
  variety,
  lastUpdate,
  price,
  unit,
  imageSrc,
  previousPrice,
}) => {
  const priceChange = price - previousPrice;
  const priceChangePercentage = ((priceChange / previousPrice) * 100).toFixed(
    2
  );
  const isIncreasing = priceChange >= 0;

  return (
    <div className="h-auto">
      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-8 rounded-3xl mx-auto mt-8 shadow-2xl max-w-4xl h-auto">
        <div className="bg-white rounded-2xl p-8 h-full shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-8">
              <h1 className="text-4xl font-extrabold mb-2 text-indigo-900 tracking-tight">
                {commodityName}
              </h1>
              <p className="text-xl text-purple-700 font-semibold mb-4">
                {variety}
              </p>
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar size={18} className="mr-2" />
                <span>
                  Last Updated: {new Date(lastUpdate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Package size={18} className="mr-2" />
                <span>Unit: {unit}</span>
              </div>
            </div>

            <div className="relative">
              <Image
                // src={imageSrc}
                src="/onion.jpg"
                alt={commodityName}
                width={180}
                height={180}
                className="rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-md">
                {isIncreasing ? (
                  <TrendingUp size={24} className="text-green-500" />
                ) : (
                  <TrendingDown size={24} className="text-red-500" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-inner">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Current Price
                </p>
                <p className="text-5xl font-bold text-indigo-900">
                  ₹{price.toLocaleString()}
                  <span className="text-base font-normal text-gray-600 ml-2">
                    per {unit}
                  </span>
                </p>
              </div>
              <div
                className={`text-right ${
                  isIncreasing ? "text-green-600" : "text-red-600"
                }`}
              >
                <p className="text-sm font-medium mb-1">Price Change</p>
                <p className="text-2xl font-bold">
                  {isIncreasing ? "+" : ""}
                  {priceChange.toLocaleString()}
                </p>
                <p className="text-sm font-medium">
                  ({isIncreasing ? "+" : ""}
                  {priceChangePercentage}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
