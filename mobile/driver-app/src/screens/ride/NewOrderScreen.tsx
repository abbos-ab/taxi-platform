import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';
import { formatPrice, formatDistance } from '../../utils/formatters';

export const NewOrderScreen: React.FC = () => {
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ru.ride.newOrder}</Text>
      <Text style={styles.timer}>{timer} сек</Text>
      {/* TODO: ride info from route params */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.declineButton}>
          <Text style={styles.declineText}>{ru.ride.decline}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton}>
          <Text style={styles.acceptText}>{ru.ride.accept}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginBottom: 16 },
  timer: { fontSize: 48, fontWeight: '700', color: colors.accent, marginBottom: 32 },
  actions: { flexDirection: 'row', gap: 16 },
  declineButton: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.danger, borderRadius: 12, padding: 16, alignItems: 'center' },
  declineText: { color: colors.danger, fontSize: 16, fontWeight: '600' },
  acceptButton: { flex: 1, backgroundColor: colors.success, borderRadius: 12, padding: 16, alignItems: 'center' },
  acceptText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
