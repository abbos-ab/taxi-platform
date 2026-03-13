import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RideStatus } from '../../types/ride';

const STATUS_CONFIG: Record<RideStatus, { bg: string; text: string; label: string }> = {
  searching: { bg: '#dbeafe', text: '#1d4ed8', label: 'Поиск' },
  accepted: { bg: '#cffafe', text: '#0891b2', label: 'Принят' },
  arrived: { bg: '#ede9fe', text: '#7c3aed', label: 'На месте' },
  in_progress: { bg: '#ffedd5', text: '#ea580c', label: 'В пути' },
  completed: { bg: '#dcfce7', text: '#16a34a', label: 'Завершён' },
  cancelled: { bg: '#fee2e2', text: '#dc2626', label: 'Отменён' },
};

export const StatusBadge: React.FC<{ status: RideStatus }> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  text: { fontSize: 12, fontWeight: '600' },
});
