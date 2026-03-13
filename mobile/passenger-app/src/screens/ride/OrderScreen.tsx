import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const OrderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Подтверждение заказа</Text>
      {/* TODO: Маршрут, цена, выбор тарифа */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{ru.ride.order}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 24 },
  button: { backgroundColor: colors.accent, borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 'auto' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
