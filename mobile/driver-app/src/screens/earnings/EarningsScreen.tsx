import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const EarningsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ru.earnings.title}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{ru.earnings.today}</Text>
        <Text style={styles.amount}>0 TJS</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>{ru.earnings.week}</Text>
        <Text style={styles.amount}>0 TJS</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>{ru.earnings.month}</Text>
        <Text style={styles.amount}>0 TJS</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 12, padding: 20, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 16, color: colors.textSecondary },
  amount: { fontSize: 24, fontWeight: '700', color: colors.primary },
});
