import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/home/HomeScreen';
import { EarningsScreen } from '../screens/earnings/EarningsScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { TabParamList } from '../types/navigation';
import { ru } from '../i18n/ru';

const Tab = createBottomTabNavigator<TabParamList>();

export const TabNavigator: React.FC = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: ru.tabs.home }} />
    <Tab.Screen name="Earnings" component={EarningsScreen} options={{ title: ru.tabs.earnings }} />
    <Tab.Screen name="History" component={HistoryScreen} options={{ title: ru.tabs.history }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: ru.tabs.profile }} />
  </Tab.Navigator>
);
