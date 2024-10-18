import React from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown, Calendar, Package } from "lucide-react";

const Hero = ({
  commodityName,
  variety,
  priceDetails = [], // Default to empty array
  imageSrc,
}) => {
  // Determine if the price is increasing based on price_change
  const isIncreasing =
    priceDetails.length > 0 ? parseFloat(priceDetails[0].price_change) > 0 : null;

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
              {priceDetails.length > 0 && (
                <>
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={18} className="mr-2" />
                    <span>
                      Last Updated:{" "}
                      {new Date(priceDetails[0].arrival_date_string).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package size={18} className="mr-2" />
                    <span>Unit: {priceDetails[0].commodity_variety}</span>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <Image
                src={imageSrc || "/Onion.jpg"} // Fallback image
                alt={commodityName}
                width={180}
                height={180}
                className="rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-md">
                {isIncreasing !== null ? (
                  isIncreasing ? (
                    <TrendingUp size={24} className="text-green-500" />
                  ) : (
                    <TrendingDown size={24} className="text-red-500" />
                  )
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-inner">
            {Array.isArray(priceDetails) && priceDetails.length > 0 ? (
              priceDetails.map((detail, index) => (
                <div key={index} className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      Current Price
                    </p>
                    <p className="text-5xl font-bold text-indigo-900">
                      ₹{parseFloat(detail.modal_price).toLocaleString()}
                      <span className="text-base font-normal text-gray-600 ml-2">
                        per 100 KG
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
                      {parseFloat(detail.price_change).toLocaleString()}
                    </p>
                    <p className="text-sm font-medium">
                      ({isIncreasing ? "+" : ""}
                      {parseFloat(detail.percentage_change)}%)
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No price details available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
