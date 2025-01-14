import React from "react";
import Image from "next/image";
import { TrendingUp, TrendingDown, Calendar, Package } from "lucide-react";

const Hero = ({ commodityName, variety, priceDetails = [], imageSrc }) => {
  const isIncreasing =
    priceDetails.length > 0 ? parseFloat(priceDetails[0].price_change) > 0 : null;
  console.log(priceDetails);
  return (
    <div className="h-auto">
      {/* Outer Card with Pastel Gradient */}
      <div className="bg-gradient-to-br from-[#FEF3C7] to-[#A78BFA] p-8 rounded-3xl mx-auto mt-8 shadow-xl max-w-4xl h-auto">
        {/* Inner White Card */}
        <div className="bg-white rounded-2xl p-8 h-full shadow-inner">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Commodity Details */}
            <div className="mb-6 md:mb-0 md:mr-8">
              <h1 className="text-4xl font-extrabold mb-2 text-[#374151] tracking-tight">
                {commodityName}
              </h1>
              <p className="text-xl text-[#F472B6] font-semibold mb-4">
                {variety}
              </p>
              {priceDetails.length > 0 && (
                <>
                  <div className="flex items-center text-[#374151] mb-2">
                    <Calendar size={18} className="mr-2 text-[#A78BFA]" />
                    <span>
                      Last Updated:{" "}
                      {new Date(
                        priceDetails[0].arrival_date_string
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center text-[#374151]">
                    <Package size={18} className="mr-2 text-[#A78BFA]" />
                    <span>Unit: {priceDetails[0].commodity_variety}</span>
                  </div>
                </>
              )}
            </div>

            {/* Commodity Image with Trending Icon */}
            <div className="relative">
              <Image
                src={`/${commodityName}.jpeg`}
                alt={commodityName}
                width={180}
                height={180}
                className="rounded-full shadow-lg transform transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-md">
                {isIncreasing !== null ? (
                  isIncreasing ? (
                    <TrendingUp size={24} className="text-[#22C55E]" />
                  ) : (
                    <TrendingDown size={24} className="text-[#EF4444]" />
                  )
                ) : null}
              </div>
            </div>
          </div>

          {/* Price Section with Soft Gradient Background */}
          <div className="mt-8 bg-gradient-to-r from-[#FEF3C7] to-[#93C5FD] rounded-xl p-6 shadow-inner">
            {Array.isArray(priceDetails) && priceDetails.length > 0 ? (
              priceDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex items-end justify-between mb-4"
                >
                  <div>
                    <p className="text-sm font-medium text-[#374151] mb-1">
                      Current Price
                    </p>
                    <p className="text-5xl font-bold text-[#374151]">
                      ₹{parseFloat(detail.modal_price).toLocaleString()}
                      <span className="text-base font-normal text-[#374151] ml-2">
                        per 100 KG
                      </span>
                    </p>
                  </div>
                  <div
                    className={`text-right ${
                      isIncreasing ? "text-[#22C55E]" : "text-[#EF4444]"
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
              <p className="text-[#374151]">No price details available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
