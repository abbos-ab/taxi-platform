import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';

export const RideScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* TODO: MapView с отслеживанием водителя */}
      <View style={styles.mapPlaceholder}>
        <Text>Карта с водителем</Text>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.status}>Водитель в пути</Text>
        {/* TODO: DriverInfoCard */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  infoCard: { padding: 24, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  status: { fontSize: 18, fontWeight: '600', color: colors.text },
});
