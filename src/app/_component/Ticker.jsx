import React, { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const Ticker = memo(({ commodities, position }) => {
  // Memoize price formatter to prevent unnecessary recalculations
  const formatPrice = useMemo(
    () => (price) => {
      const numPrice = typeof price === "string" ? parseFloat(price) : price;
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numPrice);
    },
    []
  );

  // Memoize duplicated commodities array
  const duplicatedCommodities = useMemo(
    () => [...commodities, ...commodities],
    [commodities]
  );

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      {/* Gradient overlay for smooth fade effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-blue-500/90 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-purple-700/90 to-transparent z-10" />

      <div className="w-full bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden border border-white/10">
        <motion.div
          className="p-4 overflow-hidden backdrop-blur-sm backdrop-filter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="flex whitespace-nowrap transition-transform duration-1000 ease-linear"
            style={{ transform: `translateX(${position}%)` }}
          >
            {duplicatedCommodities.map((commodity, index) => (
              <motion.div
                key={`${commodity.name}-${index}`}
                className="inline-flex items-center mr-8 px-6 py-3 bg-white/10 rounded-full 
                  backdrop-blur-md shadow-lg border border-white/20 
                  hover:bg-white/15 hover:scale-105 hover:shadow-xl
                  transition-all duration-300 ease-in-out"
                whileHover={{ y: -2 }}
              >
                <div className="relative w-10 h-10 mr-4">
                  <Image
                    src={commodity.image}
                    alt={commodity.name}
                    className="rounded-full object-cover ring-2 ring-white/30 
                      group-hover:ring-white/50 transition-all duration-300"
                    fill
                    sizes="40px"
                    priority={index < 5}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-white/90 text-sm">
                    {commodity.name}
                  </span>
                  <span className="text-emerald-300 font-bold tracking-wide text-lg">
                    {formatPrice(commodity.price)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
});

Ticker.displayName = "Ticker";

export default Ticker;
