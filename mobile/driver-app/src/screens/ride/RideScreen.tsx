import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const RideScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text>Маршрут к точке назначения</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.buttonText}>{ru.ride.completeRide}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  actions: { padding: 16 },
  completeButton: { backgroundColor: colors.success, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
