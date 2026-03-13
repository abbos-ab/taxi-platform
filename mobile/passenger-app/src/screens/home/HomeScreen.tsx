import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* TODO: Подключить MapView + UrlTile */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>Карта</Text>
      </View>
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.searchInput}>
          <Text style={styles.searchPlaceholder}>{ru.home.searchPlaceholder}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapPlaceholder: { flex: 1, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  mapText: { color: colors.textSecondary, fontSize: 18 },
  searchBar: { position: 'absolute', top: 60, left: 16, right: 16 },
  searchInput: { backgroundColor: colors.surface, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  searchPlaceholder: { color: colors.textSecondary, fontSize: 16 },
});
