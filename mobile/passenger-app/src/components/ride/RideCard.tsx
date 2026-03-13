import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ride } from '../../types/ride';
import { StatusBadge } from './StatusBadge';
import { formatPrice, formatDate } from '../../utils/formatters';
import { colors } from '../../constants/colors';

interface Props {
  ride: Ride;
}

export const RideCard: React.FC<Props> = ({ ride }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <StatusBadge status={ride.status} />
      <Text style={styles.price}>{formatPrice(ride.estimated_price)}</Text>
    </View>
    <Text style={styles.address}>{ride.pickup_address}</Text>
    <Text style={styles.address}>→ {ride.dropoff_address}</Text>
    <Text style={styles.date}>{formatDate(ride.created_at)}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  price: { fontSize: 16, fontWeight: '700', color: colors.primary },
  address: { fontSize: 13, color: colors.text, marginBottom: 2 },
  date: { fontSize: 12, color: colors.textSecondary, marginTop: 8 },
});
