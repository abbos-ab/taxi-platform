import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useChatStore } from '../../store/useChatStore';
import { colors } from '../../constants/colors';

export const ChatScreen: React.FC = () => {
  const [text, setText] = useState('');
  const messages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);

  const handleSend = () => {
    if (!text.trim()) return;
    addMessage({
      id: Date.now().toString(),
      sender: { id: 'driver', name: 'Водитель' },
      text: text.trim(),
      timestamp: new Date().toISOString(),
    });
    setText('');
    // TODO: отправить через socket
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender.id === 'driver' ? styles.myBubble : styles.theirBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
        inverted={false}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Сообщение..."
          placeholderTextColor={colors.textSecondary}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Отправить</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16 },
  bubble: { maxWidth: '75%', borderRadius: 12, padding: 12, marginBottom: 8 },
  myBubble: { alignSelf: 'flex-end', backgroundColor: colors.accent },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface },
  messageText: { fontSize: 14, color: colors.text },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  input: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, fontSize: 14 },
  sendButton: { marginLeft: 8, backgroundColor: colors.accent, borderRadius: 20, paddingHorizontal: 16, justifyContent: 'center' },
  sendText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});
