import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StockDetailScreen = ({ route }) => {
  const { stock } = route.params;
  const isPositive = parseFloat(stock.change) >= 0;
  const changeColor = isPositive ? '#00c853' : '#ff1744';

  const openYahooFinance = () => {
    Linking.openURL(`https://finance.yahoo.com/quote/${stock.symbol}`);
  };

  const StatCard = ({ icon, label, value, color }) => (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={24} color={color || '#6c5ce7'} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbol}>{stock.symbol}</Text>
          <View style={[styles.rankBadge, { backgroundColor: '#6c5ce7' }]}>
            <Text style={styles.rankText}>#{stock.rank}</Text>
          </View>
        </View>
        <Text style={styles.companyName}>{stock.name}</Text>
      </View>

      <View style={styles.priceSection}>
        <Text style={styles.currentPrice}>${stock.price}</Text>
        <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={20}
            color={changeColor}
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isPositive ? '+' : ''}{stock.change} ({stock.changePercent})
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          icon="arrow-up-circle"
          label="Day High"
          value={`$${stock.high}`}
          color="#00c853"
        />
        <StatCard
          icon="arrow-down-circle"
          label="Day Low"
          value={`$${stock.low}`}
          color="#ff1744"
        />
        <StatCard
          icon="bar-chart"
          label="Volume"
          value={stock.volume}
        />
        <StatCard
          icon="pulse"
          label="Trend Rank"
          value={`#${stock.rank}`}
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Symbol</Text>
            <Text style={styles.infoValue}>{stock.symbol}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Company</Text>
            <Text style={styles.infoValue}>{stock.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Price</Text>
            <Text style={styles.infoValue}>${stock.price}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Daily Change</Text>
            <Text style={[styles.infoValue, { color: changeColor }]}>
              {isPositive ? '+' : ''}{stock.change}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={openYahooFinance}>
        <Ionicons name="open-outline" size={20} color="#ffffff" />
        <Text style={styles.actionButtonText}>View on Yahoo Finance</Text>
      </TouchableOpacity>

      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color="#8e8e93" />
        <Text style={styles.disclaimerText}>
          Stock data is for informational purposes only. Not financial advice.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  symbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  rankBadge: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  companyName: {
    fontSize: 16,
    color: '#8e8e93',
    marginTop: 4,
  },
  priceSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  currentPrice: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '46%',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    margin: '2%',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#8e8e93',
    marginTop: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#8e8e93',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: '#2d2d44',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6c5ce7',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#8e8e93',
    marginLeft: 6,
    textAlign: 'center',
  },
});

export default StockDetailScreen;
