import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../constants/colors';
import { ru } from '../../i18n/ru';

export const RatingScreen: React.FC = () => {
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ru.rating.title}</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => setScore(n)}>
            <Text style={[styles.star, n <= score && styles.starActive]}>★</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder={ru.rating.comment}
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{ru.rating.submit}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 24 },
  stars: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  star: { fontSize: 40, color: colors.border, marginHorizontal: 4 },
  starActive: { color: colors.warning },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 16, minHeight: 100, textAlignVertical: 'top', marginBottom: 24 },
  button: { backgroundColor: colors.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
