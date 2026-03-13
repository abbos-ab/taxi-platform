import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { NewOrderScreen } from '../screens/ride/NewOrderScreen';
import { NavigationScreen } from '../screens/ride/NavigationScreen';
import { RideScreen } from '../screens/ride/RideScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { MainStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="NewOrder" component={NewOrderScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Navigation" component={NavigationScreen} options={{ title: 'Навигация' }} />
    <Stack.Screen name="Ride" component={RideScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Чат' }} />
  </Stack.Navigator>
);
