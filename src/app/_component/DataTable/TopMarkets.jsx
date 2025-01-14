import React from "react";

const TopMarkets = ({ markets }) => {
  console.log(markets);
  return (
    <div className="bg-white text-black p-6 rounded-xl mt-8 shadow-2xl max-w-screen-lg">
      <div className="text-2xl font-extrabold mb-4 border-b-4 border-green-500 pb-2">
        Top 5 Markets
      </div>
      <ul className="space-y-4">
        {markets.slice(0, 5).map((market, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
          >
            <div className="text-xl font-semibold">{market.name}</div>
            <div className="text-2xl font-bold text-green-600">
              ₹{market.price}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopMarkets;
