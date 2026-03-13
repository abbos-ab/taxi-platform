import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const NavigationScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text>Навигация к пассажиру</Text>
      </View>
      <TouchableOpacity style={styles.arrivedButton}>
        <Text style={styles.buttonText}>{ru.ride.arrived}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  arrivedButton: { margin: 16, backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
