// API Configuration
// In production, use relative URLs since frontend is served from same server
const DEV_API_URL = 'http://localhost:3000';

// Detect if running in production (served from same origin)
const isProduction = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

export const API_BASE_URL = isProduction ? '' : DEV_API_URL;

export const ENDPOINTS = {
  TRENDING: `${API_BASE_URL}/api/trending`,
  STOCK: (symbol) => `${API_BASE_URL}/api/stock/${symbol}`,
  LIVE: (symbol) => `${API_BASE_URL}/api/live/${symbol}`,
  SEARCH: (query) => `${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`,
  HEALTH: `${API_BASE_URL}/health`,
};
