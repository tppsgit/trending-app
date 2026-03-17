const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour (25 calls/day = ~1 call/hour)

app.use(cors());
app.use(express.json());

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, 'public')));

// Top 20 trending stock symbols
const TRENDING_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA',
  'META', 'TSLA', 'BRK.B', 'JPM', 'V',
  'UNH', 'XOM', 'JNJ', 'WMT', 'MA',
  'PG', 'HD', 'CVX', 'MRK', 'ABBV'
];

// Company names mapping
const COMPANY_NAMES = {
  'AAPL': 'Apple Inc.',
  'MSFT': 'Microsoft Corporation',
  'GOOGL': 'Alphabet Inc.',
  'AMZN': 'Amazon.com Inc.',
  'NVDA': 'NVIDIA Corporation',
  'META': 'Meta Platforms Inc.',
  'TSLA': 'Tesla Inc.',
  'BRK.B': 'Berkshire Hathaway',
  'JPM': 'JPMorgan Chase & Co.',
  'V': 'Visa Inc.',
  'UNH': 'UnitedHealth Group',
  'XOM': 'Exxon Mobil Corporation',
  'JNJ': 'Johnson & Johnson',
  'WMT': 'Walmart Inc.',
  'MA': 'Mastercard Inc.',
  'PG': 'Procter & Gamble',
  'HD': 'The Home Depot',
  'CVX': 'Chevron Corporation',
  'MRK': 'Merck & Co.',
  'ABBV': 'AbbVie Inc.'
};

// Alpha Vantage API Key
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'FQSFVIRBDMJAOHOJ';

// API usage tracking
let apiCallCount = 0;
let lastApiReset = new Date().toDateString();
const MAX_DAILY_CALLS = 25;

function checkApiLimit() {
  const today = new Date().toDateString();
  if (today !== lastApiReset) {
    apiCallCount = 0;
    lastApiReset = today;
  }
  
  if (apiCallCount >= MAX_DAILY_CALLS) {
    return false; // Limit reached
  }
  
  apiCallCount++;
  console.log(`API call ${apiCallCount}/${MAX_DAILY_CALLS} for ${today}`);
  return true;
}

// Fetch stock data from Alpha Vantage
async function fetchStockData(symbol) {
  const cacheKey = `stock_${symbol}`;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  // Check API limit before making call
  if (!checkApiLimit()) {
    console.log('Daily API limit reached, returning null for stock data');
    return null;
  }

  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const quote = response.data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      return null;
    }

    const stockData = {
      symbol: quote['01. symbol'],
      name: COMPANY_NAMES[symbol] || symbol,
      price: parseFloat(quote['05. price']).toFixed(2),
      change: parseFloat(quote['09. change']).toFixed(2),
      changePercent: quote['10. change percent'],
      high: parseFloat(quote['03. high']).toFixed(2),
      low: parseFloat(quote['04. low']).toFixed(2),
      volume: parseInt(quote['06. volume']).toLocaleString(),
      previousClose: parseFloat(quote['08. previous close']).toFixed(2),
      latestTradingDay: quote['07. latest trading day']
    };

    cache.set(cacheKey, stockData, 3600); // Cache for 1 hour
    return stockData;
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error.message);
    return null;
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API usage status endpoint
app.get('/api/status', (req, res) => {
  const today = new Date().toDateString();
  if (today !== lastApiReset) {
    apiCallCount = 0;
    lastApiReset = today;
  }
  
  res.json({
    date: today,
    apiCallsUsed: apiCallCount,
    apiCallsRemaining: MAX_DAILY_CALLS - apiCallCount,
    maxDailyCalls: MAX_DAILY_CALLS,
    cacheStats: cache.getStats()
  });
});

// Get all trending stocks - Top 20 Gainers from Alpha Vantage
app.get('/api/trending', async (req, res) => {
  try {
    const cachedTrending = cache.get('all_trending');
    
    if (cachedTrending) {
      console.log('Returning cached trending data');
      return res.json(cachedTrending);
    }

    console.log('Fetching top gainers from Alpha Vantage API...');
    
    // Check API limit before making call
    if (!checkApiLimit()) {
      console.log('Daily API limit reached, using fallback data for trending');
      const fallbackData = TRENDING_SYMBOLS.map((symbol, index) => ({
        id: index + 1,
        symbol: symbol,
        name: COMPANY_NAMES[symbol],
        price: (150 + Math.random() * 200).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: ((Math.random() * 6 - 3)).toFixed(2) + '%',
        volume: Math.floor(Math.random() * 50000000).toLocaleString(),
        high: (160 + Math.random() * 200).toFixed(2),
        low: (140 + Math.random() * 180).toFixed(2),
        rank: index + 1
      }));
      
      cache.set('all_trending', fallbackData, 3600); // Cache for 1 hour
      return res.json(fallbackData);
    }
    
    // Fetch top gainers from Alpha Vantage
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TOP_GAINERS_LOSERS',
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    console.log('API Response received:', Object.keys(response.data));

    // Check if we got valid data
    if (response.data.top_gainers && response.data.top_gainers.length > 0) {
      const topGainers = response.data.top_gainers.slice(0, 20).map((stock, index) => ({
        id: index + 1,
        symbol: stock.ticker,
        name: stock.ticker, // Alpha Vantage doesn't provide company names in this endpoint
        price: parseFloat(stock.price).toFixed(2),
        change: parseFloat(stock.change_amount).toFixed(2),
        changePercent: stock.change_percentage,
        volume: parseInt(stock.volume).toLocaleString(),
        high: parseFloat(stock.price).toFixed(2),
        low: (parseFloat(stock.price) - Math.abs(parseFloat(stock.change_amount))).toFixed(2),
        rank: index + 1
      }));

      console.log(`Fetched ${topGainers.length} top gainers`);
      cache.set('all_trending', topGainers, 3600); // Cache for 1 hour
      return res.json(topGainers);
    }

    // If API limit reached or no data, return fallback data immediately
    if (response.data.Note || response.data.Information) {
      console.log('API limit reached, using fallback data');
      const fallbackData = TRENDING_SYMBOLS.map((symbol, index) => ({
        id: index + 1,
        symbol: symbol,
        name: COMPANY_NAMES[symbol],
        price: (150 + Math.random() * 200).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: ((Math.random() * 6 - 3)).toFixed(2) + '%',
        volume: Math.floor(Math.random() * 50000000).toLocaleString(),
        high: (160 + Math.random() * 200).toFixed(2),
        low: (140 + Math.random() * 180).toFixed(2),
        rank: index + 1
      }));
      
      cache.set('all_trending', fallbackData, 3600); // Cache for 1 hour
      return res.json(fallbackData);
    }

    // Fallback to mock data if API fails
    console.log('API returned no data, using fallback mock data');
    const trendingStocks = TRENDING_SYMBOLS.map((symbol, index) => ({
      id: index + 1,
      symbol: symbol,
      name: COMPANY_NAMES[symbol],
      price: (150 + Math.random() * 200).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2),
      changePercent: ((Math.random() * 6 - 3)).toFixed(2) + '%',
      volume: Math.floor(Math.random() * 50000000).toLocaleString(),
      high: (160 + Math.random() * 200).toFixed(2),
      low: (140 + Math.random() * 180).toFixed(2),
      rank: index + 1
    }));

    cache.set('all_trending', trendingStocks, 3600); // Cache for 1 hour
    res.json(trendingStocks);
  } catch (error) {
    console.error('Error fetching trending stocks:', error.message);
    res.status(500).json({ error: 'Failed to fetch trending stocks', details: error.message });
  }
});

// Get single stock details
app.get('/api/stock/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const stockData = await fetchStockData(symbol.toUpperCase());
    
    if (!stockData) {
      return res.status(404).json({ error: 'Stock not found' });
    }
    
    res.json(stockData);
  } catch (error) {
    console.error('Error fetching stock:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Search stocks by ticker symbol or company name
app.get('/api/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 1) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const cacheKey = `search_${query.toLowerCase()}`;
    const cachedResults = cache.get(cacheKey);
    
    if (cachedResults) {
      return res.json(cachedResults);
    }

    console.log(`Searching for: ${query}`);

    // Check API limit before making call
    if (!checkApiLimit()) {
      console.log('Daily API limit reached, returning empty search results');
      return res.json([]);
    }

    // Use Alpha Vantage SYMBOL_SEARCH endpoint
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    if (response.data.bestMatches && response.data.bestMatches.length > 0) {
      const results = response.data.bestMatches.slice(0, 10).map((match, index) => ({
        id: index + 1,
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        currency: match['8. currency'],
        matchScore: match['9. matchScore']
      }));

      cache.set(cacheKey, results, 3600); // Cache for 1 hour
      return res.json(results);
    }

    // Check for API limit - return empty array instead of error
    if (response.data.Note || response.data.Information) {
      console.log('Search API limit reached, returning empty results');
      return res.json([]);
    }

    res.json([]);
  } catch (error) {
    console.error('Error searching stocks:', error.message);
    res.status(500).json({ error: 'Failed to search stocks' });
  }
});

// Get live stock data (uses actual API - limited calls)
app.get('/api/live/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    const quote = response.data['Global Quote'];
    
    if (!quote || Object.keys(quote).length === 0) {
      return res.status(404).json({ error: 'Stock not found or API limit reached' });
    }

    res.json({
      symbol: quote['01. symbol'],
      name: COMPANY_NAMES[symbol.toUpperCase()] || symbol.toUpperCase(),
      price: quote['05. price'],
      change: quote['09. change'],
      changePercent: quote['10. change percent'],
      high: quote['03. high'],
      low: quote['04. low'],
      volume: quote['06. volume'],
      previousClose: quote['08. previous close'],
      latestTradingDay: quote['07. latest trading day']
    });
  } catch (error) {
    console.error('Error fetching live stock:', error);
    res.status(500).json({ error: 'Failed to fetch live stock data' });
  }
});

// Serve frontend for all non-API routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Trending Stocks API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📈 Trending stocks: http://localhost:${PORT}/api/trending`);
});
