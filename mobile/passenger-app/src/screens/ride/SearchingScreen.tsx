import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const SearchingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.accent} />
      <Text style={styles.text}>{ru.ride.searching}</Text>
      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelText}>{ru.ride.cancel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
  text: { fontSize: 18, color: colors.text, marginTop: 24 },
  cancelButton: { marginTop: 32, padding: 16 },
  cancelText: { color: colors.danger, fontSize: 16 },
});
