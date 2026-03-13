import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<Props> = ({ title, onPress, variant = 'primary', disabled, style }) => {
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : colors.surface;
  const textColor = variant === 'secondary' ? colors.text : '#fff';

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bg }, disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 12, padding: 16, alignItems: 'center' },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '600' },
});
