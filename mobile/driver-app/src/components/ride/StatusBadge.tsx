import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RideStatus } from '../../types/ride';
import { colors } from '../../constants/colors';

const STATUS_CONFIG: Record<RideStatus, { label: string; bg: string; text: string }> = {
  searching: { label: 'Поиск', bg: '#fef3c7', text: '#92400e' },
  accepted: { label: 'Принят', bg: '#dbeafe', text: '#1e40af' },
  arrived: { label: 'На месте', bg: '#e0e7ff', text: '#3730a3' },
  in_progress: { label: 'В пути', bg: '#dcfce7', text: '#166534' },
  completed: { label: 'Завершён', bg: '#f0fdf4', text: '#15803d' },
  cancelled: { label: 'Отменён', bg: '#fee2e2', text: '#991b1b' },
};

interface StatusBadgeProps {
  status: RideStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  text: { fontSize: 12, fontWeight: '600' },
});
