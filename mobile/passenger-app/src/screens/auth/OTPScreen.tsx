import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useVerifyOtp } from '../../api/hooks/useAuth';
import { useAuthStore } from '../../store/useAuthStore';
import { isValidOtp } from '../../utils/validators';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const OTPScreen: React.FC = () => {
  const [code, setCode] = useState('');
  const route = useRoute<any>();
  const phone = route.params?.phone || '';
  const verifyOtp = useVerifyOtp();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleVerify = async () => {
    if (!isValidOtp(code)) return;
    const res = await verifyOtp.mutateAsync({ phone, code });
    setAuth(res.data.access, res.data.user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ru.auth.otpTitle}</Text>
      <Text style={styles.subtitle}>{ru.auth.otpSent} {phone}</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="000000"
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />
      <TouchableOpacity
        style={[styles.button, !isValidOtp(code) && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={!isValidOtp(code) || verifyOtp.isPending}
      >
        <Text style={styles.buttonText}>{ru.auth.verify}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: '700', color: colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginBottom: 32, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 24, letterSpacing: 8, marginBottom: 24 },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
