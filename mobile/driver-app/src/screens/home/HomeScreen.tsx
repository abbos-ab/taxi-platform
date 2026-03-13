import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocationStore } from '../../store/useLocationStore';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const HomeScreen: React.FC = () => {
  const isOnline = useLocationStore((s) => s.isOnline);
  const setOnline = useLocationStore((s) => s.setOnline);

  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Карта</Text>
      </View>
      <View style={styles.bottomCard}>
        <Text style={styles.statusText}>
          {isOnline ? ru.home.online : ru.home.offline}
        </Text>
        <TouchableOpacity
          style={[styles.toggleButton, isOnline && styles.toggleActive]}
          onPress={() => setOnline(!isOnline)}
        >
          <Text style={styles.toggleText}>
            {isOnline ? ru.home.goOffline : ru.home.goOnline}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  mapText: { color: colors.textSecondary, fontSize: 18 },
  bottomCard: { padding: 24, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: 'center' },
  statusText: { fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 },
  toggleButton: { backgroundColor: colors.success, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 40 },
  toggleActive: { backgroundColor: colors.danger },
  toggleText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
