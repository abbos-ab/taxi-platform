import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { useProfile } from '../../api/hooks/useProfile';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const ProfileScreen: React.FC = () => {
  const { data: profile } = useProfile();
  const logout = useAuthStore((s) => s.logout);

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{profile?.first_name?.[0] || '?'}</Text>
      </View>
      <Text style={styles.name}>{profile?.first_name} {profile?.last_name}</Text>
      <Text style={styles.phone}>{profile?.phone}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>{ru.profile.logout}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 80, backgroundColor: colors.background },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '600', color: colors.text },
  phone: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  logoutButton: { marginTop: 40, padding: 16 },
  logoutText: { color: colors.danger, fontSize: 16 },
});
