// marketUtils.js

// Variable to hold the selected market ID
let selectedMarketId = null;

// Function to set the market ID
export const setMarketId = (marketId) => {
  selectedMarketId = marketId;
};

// Function to get the market ID
export const getMarketId = () => {
  return selectedMarketId;
};
