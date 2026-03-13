import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { useSocket } from '../../hooks/useSocket';
import { useAuthStore } from '../../store/useAuthStore';
import { ru } from '../../i18n/ru';

interface Message {
  id: string;
  sender: { id: string; name: string };
  text: string;
  timestamp: string;
}

export const ChatPage: React.FC = () => {
  const { id: rideId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const chatSocket = useSocket('/chat');
  const userId = useAuthStore((s) => s.user?.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = chatSocket.current;
    if (!s || !rideId) return;

    s.emit('chat:join', { ride_id: rideId });
    s.on('message:received', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      s.removeAllListeners();
    };
  }, [rideId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const s = chatSocket.current;
    if (!s || !text.trim() || !rideId) return;

    s.emit('message:send', { ride_id: rideId, text: text.trim() });
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-white border-b border-border px-4 py-3">
        <h2 className="font-semibold text-primary">{ru.chat.title}</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3 bg-background">
        {messages.length === 0 && (
          <p className="text-center text-text-secondary py-8">Нет сообщений</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender.id === userId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isMe
                    ? 'bg-accent text-white rounded-br-sm'
                    : 'bg-white text-primary border border-border rounded-bl-sm'
                }`}
              >
                {!isMe && (
                  <p className="text-xs font-medium text-accent mb-1">{msg.sender.name}</p>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-text-secondary'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-border p-3 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={ru.chat.placeholder}
          className="flex-1 px-4 py-2 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-accent text-sm"
        />
        <Button onClick={handleSend} disabled={!text.trim()}>
          {ru.chat.send}
        </Button>
      </div>
    </div>
  );
};
