// marketUtils.js

// Variable to hold the selected market ID
let selectedMarketId = null;
let selectedMarketName = null;  // Variable to hold the selected market name
// Function to set the market ID
export const setMarketId = (marketId) => {
  selectedMarketId = marketId;
};

// Function to get the market ID
export const getMarketId = () => {
  return selectedMarketId;
};

// Function to set the market name
export const setMarketName = (marketName) => {
  selectedMarketName = marketName;
};

// Function to get the market name
export const getMarketName = () => {
  return selectedMarketName;
};


