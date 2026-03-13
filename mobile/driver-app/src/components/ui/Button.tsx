import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const bgColor = {
    primary: colors.primary,
    secondary: colors.surface,
    danger: colors.danger,
  }[variant];

  const txtColor = variant === 'secondary' ? colors.text : '#fff';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: bgColor },
        variant === 'secondary' && styles.secondaryBorder,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={txtColor} />
      ) : (
        <Text style={[styles.text, { color: txtColor }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: { borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center' },
  secondaryBorder: { borderWidth: 1, borderColor: colors.border },
  disabled: { opacity: 0.5 },
  text: { fontSize: 16, fontWeight: '600' },
});
