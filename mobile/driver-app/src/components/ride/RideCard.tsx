import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ride } from '../../types/ride';
import { StatusBadge } from './StatusBadge';
import { formatPrice, formatDate } from '../../utils/formatters';
import { colors } from '../../constants/colors';

interface RideCardProps {
  ride: Ride;
  onPress?: () => void;
}

export const RideCard: React.FC<RideCardProps> = ({ ride, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.header}>
        <StatusBadge status={ride.status} />
        <Text style={styles.price}>{formatPrice(ride.final_price || ride.estimated_price)}</Text>
      </View>
      <Text style={styles.address} numberOfLines={1}>{ride.pickup_address}</Text>
      <Text style={styles.addressTo} numberOfLines={1}>{ride.dropoff_address}</Text>
      <Text style={styles.date}>{formatDate(ride.created_at)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  price: { fontSize: 18, fontWeight: '700', color: colors.primary },
  address: { fontSize: 14, color: colors.text, marginBottom: 2 },
  addressTo: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  date: { fontSize: 12, color: colors.textSecondary },
});
