import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useChatStore } from '../../store/useChatStore';
import { colors } from '../../constants/colors';

export const ChatScreen: React.FC = () => {
  const [text, setText] = useState('');
  const messages = useChatStore((s) => s.messages);

  const handleSend = () => {
    if (!text.trim()) return;
    // TODO: отправить через Socket.IO
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text style={styles.sender}>{item.sender.name}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        inverted={false}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Сообщение..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  message: { padding: 12, marginHorizontal: 16, marginVertical: 4, backgroundColor: colors.surface, borderRadius: 12 },
  sender: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: colors.border },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10 },
  sendButton: { width: 44, height: 44, backgroundColor: colors.accent, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  sendText: { color: '#fff', fontSize: 20 },
});
