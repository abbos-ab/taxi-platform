import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { useRegister } from '../../api/hooks/useAuth';
import { isValidPhone } from '../../utils/validators';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Auth'>;

export const AuthScreen: React.FC = () => {
  const [phone, setPhone] = useState('+992');
  const navigation = useNavigation<Nav>();
  const register = useRegister();

  const handleSubmit = async () => {
    if (!isValidPhone(phone)) return;
    await register.mutateAsync(phone);
    navigation.navigate('OTP', { phone });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ru.auth.title}</Text>
      <Text style={styles.label}>{ru.auth.phoneLabel}</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder={ru.auth.phonePlaceholder}
        keyboardType="phone-pad"
        maxLength={13}
      />
      <TouchableOpacity
        style={[styles.button, !isValidPhone(phone) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValidPhone(phone) || register.isPending}
      >
        <Text style={styles.buttonText}>{ru.auth.getCode}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 32, textAlign: 'center' },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 18, marginBottom: 24 },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
