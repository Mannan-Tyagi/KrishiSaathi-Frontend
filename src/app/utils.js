// utils.js

// Define the base backend link

// utils.js


const BASE_BACKEND_URL = process.env.NEXT_PUBLIC_BASE_BACKEND_URL_PROD;
console.log("Backend URL:", BASE_BACKEND_URL); // Should print the URL from .env.local
// Export the constant
export { BASE_BACKEND_URL };

// marketUtils.js

// Variable to hold the selected market ID
let selectedMarketId = null;
let selectedMarketName = null;  // Variable to hold the selected market name
let selectedCommodityId = null; // Variable to hold the selected commodity ID

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

// Function to set the commodity ID
export const setCommodityId = (commodityId) => {
  selectedCommodityId = commodityId;
};

// Function to get the commodity ID
export const getCommodityId = () => {
  return selectedCommodityId;
};