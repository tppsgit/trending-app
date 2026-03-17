import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { ENDPOINTS } from '../config/api';

const TrendingListScreen = ({ navigation }) => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchTrendingStocks = async () => {
    let hasError = false;
    let is429Error = false;
    
    try {
      setError(null);
      const response = await axios.get(ENDPOINTS.TRENDING);
      setStocks(response.data);
      setFilteredStocks(response.data);
    } catch (err) {
      console.error('Error fetching stocks:', err);
      hasError = true;
      is429Error = err.response?.status === 429;
      
      // Don't show error for 429, just retry silently
      if (!is429Error) {
        setError('Failed to load trending stocks. Please try again.');
      }
      // Retry after 2 seconds for 429 errors
      if (is429Error) {
        setTimeout(() => {
          fetchTrendingStocks();
        }, 2000);
      }
    } finally {
      if (!hasError || !is429Error) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const searchStocks = async (query) => {
    if (!query || query.length < 1) {
      setSearchResults([]);
      setFilteredStocks(stocks);
      return;
    }

    // Always search both local and API for comprehensive results
    setIsSearching(true);
    
    try {
      // Filter local stocks first
      const localFiltered = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );

      // Search via API for broader results
      const response = await axios.get(ENDPOINTS.SEARCH(query));
      const apiResults = response.data || [];

      // If we have API results, show them (more comprehensive)
      if (apiResults.length > 0) {
        setSearchResults(apiResults);
        setFilteredStocks([]);
      } else if (localFiltered.length > 0) {
        // Fallback to local results if API returns nothing
        setFilteredStocks(localFiltered);
        setSearchResults([]);
      } else {
        // No results found anywhere
        setSearchResults([]);
        setFilteredStocks([]);
      }
    } catch (err) {
      console.error('Error searching stocks:', err);
      // Fallback to local search on API error
      const localFiltered = stocks.filter(stock => 
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredStocks(localFiltered);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    searchStocks(text);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setFilteredStocks(stocks);
  };

  useEffect(() => {
    fetchTrendingStocks();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTrendingStocks();
  }, []);

  const getChangeColor = (change) => {
    const value = parseFloat(change);
    if (value > 0) return '#00c853';
    if (value < 0) return '#ff1744';
    return '#9e9e9e';
  };

  const getChangeIcon = (change) => {
    const value = parseFloat(change);
    if (value > 0) return 'trending-up';
    if (value < 0) return 'trending-down';
    return 'remove';
  };

  const renderStockItem = ({ item, index }) => {
    const changeColor = getChangeColor(item.change);
    const isPositive = parseFloat(item.change) >= 0;

    return (
      <TouchableOpacity
        style={styles.stockCard}
        onPress={() => navigation.navigate('StockDetail', { stock: item })}
        activeOpacity={0.7}
      >
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{item.rank}</Text>
        </View>

        <View style={styles.stockInfo}>
          <Text style={styles.symbol}>{item.symbol}</Text>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price}</Text>
          <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
            <Ionicons
              name={getChangeIcon(item.change)}
              size={14}
              color={changeColor}
            />
            <Text style={[styles.change, { color: changeColor }]}>
              {isPositive ? '+' : ''}{item.change} ({item.changePercent})
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6c5ce7" />
        <Text style={styles.loadingText}>Loading trending stocks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="cloud-offline" size={64} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTrendingStocks}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.searchResultCard}
      onPress={() => navigation.navigate('StockDetail', { 
        stock: { 
          ...item, 
          price: '0.00', 
          change: '0.00', 
          changePercent: '0%',
          volume: '0',
          high: '0.00',
          low: '0.00',
          rank: '-'
        } 
      })}
      activeOpacity={0.7}
    >
      <View style={styles.searchResultInfo}>
        <Text style={styles.symbol}>{item.symbol}</Text>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.searchMeta}>{item.type} • {item.region}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8e8e93" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Market Movers</Text>
        <Text style={styles.headerSubtitle}>Top 20 trending stocks today</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ticker or company name..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>
        {isSearching && (
          <ActivityIndicator size="small" color="#6c5ce7" style={styles.searchLoader} />
        )}
      </View>

      {/* Search Results from API */}
      {searchResults.length > 0 && (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.searchResultsTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.symbol}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Trending Stocks List */}
      {searchResults.length === 0 && (
        <FlatList
          data={filteredStocks}
          renderItem={renderStockItem}
          keyExtractor={(item) => item.symbol}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6c5ce7"
              colors={['#6c5ce7']}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery.length > 0 && !isSearching ? (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={48} color="#8e8e93" />
                <Text style={styles.noResultsText}>No stocks found for "{searchQuery}"</Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingTop: 0,
  },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  rankContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stockInfo: {
    flex: 1,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  name: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  change: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8e8e93',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ff6b6b',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#6c5ce7',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#ffffff',
  },
  clearButton: {
    padding: 4,
  },
  searchLoader: {
    marginTop: 8,
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchResultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 12,
  },
  searchResultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchMeta: {
    fontSize: 11,
    color: '#6c5ce7',
    marginTop: 4,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default TrendingListScreen;
