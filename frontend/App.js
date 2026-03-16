import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TrendingListScreen from './src/screens/TrendingListScreen';
import StockDetailScreen from './src/screens/StockDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="TrendingList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1a1a2e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="TrendingList"
            component={TrendingListScreen}
            options={{ title: '📈 Top 20 Trending Stocks' }}
          />
          <Stack.Screen
            name="StockDetail"
            component={StockDetailScreen}
            options={({ route }) => ({ title: route.params?.symbol || 'Stock Details' })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
