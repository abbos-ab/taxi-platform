import React from 'react';
import { TextInput, Text, View, StyleSheet, TextInputProps } from 'react-native';
import { colors } from '../../constants/colors';

interface Props extends TextInputProps {
  label?: string;
}

export const Input: React.FC<Props> = ({ label, style, ...props }) => (
  <View style={styles.container}>
    {label && <Text style={styles.label}>{label}</Text>}
    <TextInput style={[styles.input, style]} placeholderTextColor={colors.textSecondary} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, fontSize: 16, color: colors.text },
});
