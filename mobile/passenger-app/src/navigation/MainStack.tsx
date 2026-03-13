import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { OrderScreen } from '../screens/ride/OrderScreen';
import { SearchingScreen } from '../screens/ride/SearchingScreen';
import { RideScreen } from '../screens/ride/RideScreen';
import { RatingScreen } from '../screens/ride/RatingScreen';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { MainStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name="Order" component={OrderScreen} options={{ title: 'Заказ' }} />
    <Stack.Screen name="Searching" component={SearchingScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Ride" component={RideScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Rating" component={RatingScreen} options={{ title: 'Оценка' }} />
    <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Чат' }} />
  </Stack.Navigator>
);
