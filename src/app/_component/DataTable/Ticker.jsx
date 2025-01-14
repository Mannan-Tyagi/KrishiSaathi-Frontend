import React, { memo } from "react";
import Image from "next/image";

export const Ticker = memo(({ commodities, position }) => {
  const formatPrice = (price) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return `₹${numPrice.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10">
      <div className="p-4 overflow-hidden backdrop-blur-sm backdrop-filter">
        <div
          className="flex whitespace-nowrap transition-transform duration-1000 ease-linear"
          style={{ transform: `translateX(${position}%)` }}
        >
          {[...commodities, ...commodities].map((commodity, index) => (
            <div
              key={index}
              className="inline-flex items-center mr-8 px-5 py-2.5 bg-white/10 rounded-full 
                backdrop-blur-md shadow-lg border border-white/20 
                hover:bg-white/15 transition-all duration-300 ease-in-out"
            >
              <div className="relative w-8 h-8 mr-3">
                <Image
                  src={commodity.image}
                  alt={commodity.name}
                  className="rounded-full object-cover ring-2 ring-white/30"
                  fill
                  sizes="32px"
                  priority={index < 5}
                />
              </div>
              <span className="font-medium text-white/90">
                {commodity.name}
              </span>
              <span className="ml-2 text-emerald-300 font-semibold tracking-wide">
                {formatPrice(commodity.price)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

Ticker.displayName = "Ticker";

export default Ticker;
