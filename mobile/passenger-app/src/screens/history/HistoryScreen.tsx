import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useRideHistory } from '../../api/hooks/useRides';
import { colors } from '../../constants/colors';
import { formatDate, formatPrice } from '../../utils/formatters';
import { Ride } from '../../types/ride';

export const HistoryScreen: React.FC = () => {
  const { data, isLoading, refetch } = useRideHistory();

  const renderItem = ({ item }: { item: Ride }) => (
    <View style={styles.card}>
      <Text style={styles.address}>{item.pickup_address} → {item.dropoff_address}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>{formatPrice(item.estimated_price)}</Text>
        <Text style={styles.date}>{formatDate(item.created_at)}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.results || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={<Text style={styles.empty}>Нет поездок</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  card: { backgroundColor: colors.surface, margin: 8, marginHorizontal: 16, padding: 16, borderRadius: 12 },
  address: { fontSize: 14, color: colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '600', color: colors.primary },
  date: { fontSize: 12, color: colors.textSecondary },
  empty: { textAlign: 'center', marginTop: 40, color: colors.textSecondary },
});
