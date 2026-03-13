import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRideHistory } from '../../api/hooks/useRides';
import { colors } from '../../constants/colors';
import { formatPrice, formatDate } from '../../utils/formatters';

export const HistoryScreen: React.FC = () => {
  const { data, isLoading } = useRideHistory();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>История поездок</Text>
      <FlatList
        data={data?.results || []}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.address} numberOfLines={1}>{item.pickup_address}</Text>
              <Text style={styles.price}>{formatPrice(item.final_price || item.estimated_price)}</Text>
            </View>
            <Text style={styles.addressTo} numberOfLines={1}>{item.dropoff_address}</Text>
            <Text style={styles.date}>{formatDate(item.created_at)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Нет поездок</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, padding: 16, paddingBottom: 8 },
  card: { backgroundColor: colors.surface, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  address: { fontSize: 14, color: colors.text, flex: 1, marginRight: 8 },
  addressTo: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  price: { fontSize: 16, fontWeight: '700', color: colors.primary },
  date: { fontSize: 12, color: colors.textSecondary },
  empty: { textAlign: 'center', color: colors.textSecondary, marginTop: 40, fontSize: 16 },
});
